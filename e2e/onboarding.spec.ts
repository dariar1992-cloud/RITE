import { expect, test } from '@playwright/test';

import { completeOnboarding, mockVoiceRoute, resetStore, skipCycleOptIn } from './helpers';

test.describe('Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await resetStore(page);
    await mockVoiceRoute(page);
  });

  test('first launch redirects to onboarding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Choose your voice guide.')).toBeVisible();
  });

  test('lists all three guides with archetypes', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Sage', { exact: true })).toBeVisible();
    await expect(page.getByText('Arjun', { exact: true })).toBeVisible();
    await expect(page.getByText('Akasha', { exact: true })).toBeVisible();
    await expect(page.getByText('Feminine')).toBeVisible();
    await expect(page.getByText('Masculine')).toBeVisible();
    await expect(page.getByText('Neutral')).toBeVisible();
  });

  test('Enter RITE is disabled until a guide is selected', async ({ page }) => {
    await page.goto('/');
    // The GoldButton renders the label text. When disabled it still shows the
    // text but tapping does nothing; we assert that no navigation happens.
    await page.getByText('Enter RITE', { exact: true }).click();
    await expect(page.getByText('Choose your voice guide.')).toBeVisible();
  });

  test('previewing a voice triggers /api/voice', async ({ page }) => {
    await page.goto('/');
    const voiceRequest = page.waitForRequest((req) =>
      req.url().endsWith('/api/voice') && req.method() === 'POST'
    );
    await page.getByText('Preview voice').first().click();
    const req = await voiceRequest;
    const body = req.postDataJSON();
    expect(body).toHaveProperty('text');
    expect(body).toHaveProperty('voiceId');
    expect(typeof body.voiceId).toBe('string');
    expect((body.voiceId as string).length).toBeGreaterThan(5);
  });

  test('completing onboarding routes to cycle opt-in', async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
    await expect(page.getByText('Cycle Protocol')).toBeVisible();
  });

  test('cycle opt-in skip lands on home', async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
    await skipCycleOptIn(page);
    // Home shows the two modes.
    await expect(page.getByText('Stolen Moment')).toBeVisible();
    await expect(page.getByText('Wind Down')).toBeVisible();
  });

  test('returning user is not redirected to onboarding', async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
    await skipCycleOptIn(page);
    await page.reload();
    // Should not see the onboarding heading after reload.
    await expect(page.getByText('Choose your voice guide.')).not.toBeVisible();
    await expect(page.getByText('Stolen Moment')).toBeVisible();
  });
});
