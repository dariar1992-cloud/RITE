import { expect, test } from '@playwright/test';

import { completeOnboarding, mockVoiceRoute, resetStore, skipCycleOptIn } from './helpers';

/**
 * End-to-end session flow:
 *   home -> checkin -> session (4 layers) -> complete
 *
 * Each "layer" requires tapping Continue; on the last step the label flips
 * to "Complete Rite" and routes to /complete.
 */
test.describe('Session flow', () => {
  test.beforeEach(async ({ page }) => {
    await resetStore(page);
    await mockVoiceRoute(page);
    await page.goto('/');
    await completeOnboarding(page);
    await skipCycleOptIn(page);
  });

  test('home shows readiness ring and history footer', async ({ page }) => {
    await expect(page.getByText('Stolen Moment')).toBeVisible();
    await expect(page.getByText(/History · \d+/)).toBeVisible();
  });

  test('Stolen Moment flow: home -> checkin -> 4 layers -> complete', async ({ page }) => {
    await page.getByText('Stolen Moment').first().click();

    // Checkin: pick a state, a duration, optional charge, then Begin Rite.
    await expect(page.getByText('How are you arriving?')).toBeVisible();
    await page.getByText('Scattered', { exact: true }).click();
    await expect(page.getByText('How much time?')).toBeVisible();
    await page.getByText('2', { exact: true }).first().click();
    // Skip charge — it's optional.
    await page.getByText('Begin Rite', { exact: true }).click();

    // Session: 4 layers (Body, Energy, Mind, Soul). Continue between each.
    await expect(page.getByText(/Layer 1 of 4/)).toBeVisible({ timeout: 15_000 });
    await page.getByText('Continue', { exact: true }).click();
    await expect(page.getByText(/Layer 2 of 4/)).toBeVisible({ timeout: 15_000 });
    await page.getByText('Continue', { exact: true }).click();
    await expect(page.getByText(/Layer 3 of 4/)).toBeVisible({ timeout: 15_000 });
    await page.getByText('Continue', { exact: true }).click();
    await expect(page.getByText(/Layer 4 of 4/)).toBeVisible({ timeout: 15_000 });
    await page.getByText('Complete Rite', { exact: true }).click();

    // Complete screen.
    await expect(page.getByText('Rite complete')).toBeVisible();
    await expect(page.getByText('The protocol is done.')).toBeVisible();
  });

  test('Wind Down flow records a session in history', async ({ page }) => {
    await page.getByText('Wind Down').first().click();
    await expect(page.getByText('How are you arriving?')).toBeVisible();
    await page.getByText('Heavy', { exact: true }).click();
    await page.getByText('5', { exact: true }).first().click();
    await page.getByText('Begin Rite', { exact: true }).click();

    // Walk all four layers — Wind Down also has 4 steps.
    for (let i = 1; i <= 4; i++) {
      await expect(page.getByText(new RegExp(`Layer ${i} of 4`))).toBeVisible({ timeout: 15_000 });
      const label = i === 4 ? 'Complete Rite' : 'Continue';
      await page.getByText(label, { exact: true }).click();
    }

    await expect(page.getByText('Rite complete')).toBeVisible();
    await page.getByText('Return to the world').click();

    // Back on home — streak should now be 1, history count 1.
    await expect(page.getByText(/History · 1/)).toBeVisible();
    await expect(page.getByText(/Streak · 1/)).toBeVisible();
  });

  test('voice route fires during a session', async ({ page }) => {
    // Confirm /api/voice is being called for each layer's narration.
    const voiceHits: number[] = [];
    page.on('request', (req) => {
      if (req.url().endsWith('/api/voice') && req.method() === 'POST') {
        voiceHits.push(Date.now());
      }
    });

    await page.getByText('Stolen Moment').first().click();
    await page.getByText('Scattered', { exact: true }).click();
    await page.getByText('2', { exact: true }).first().click();
    await page.getByText('Begin Rite', { exact: true }).click();

    // Wait long enough for the autoplay delay + a tick.
    await expect(page.getByText(/Layer 1 of 4/)).toBeVisible({ timeout: 15_000 });
    // SettlingBeat plays first; the voice request fires after settling completes.
    // Give it generous headroom.
    await page.waitForTimeout(4500);

    expect(voiceHits.length).toBeGreaterThan(0);
  });
});
