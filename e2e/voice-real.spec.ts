/**
 * Smoke test for the real /api/voice route (hits ElevenLabs).
 *
 * This file is skipped by default. Run with:
 *
 *   RITE_REAL_VOICE=1 npx playwright test e2e/voice-real.spec.ts
 *
 * It requires ELEVENLABS_API_KEY in your environment (already in .env.local).
 */
import { expect, test } from '@playwright/test';

import { completeOnboarding, resetStore, skipCycleOptIn } from './helpers';

const RUN_REAL = process.env.RITE_REAL_VOICE === '1';

test.describe('Real voice (ElevenLabs)', () => {
  test.skip(!RUN_REAL, 'Set RITE_REAL_VOICE=1 to run against the real API.');

  test.beforeEach(async ({ page }) => {
    await resetStore(page);
    // Note: NO mockVoiceRoute here — we want the real network call.
    await page.goto('/');
    await completeOnboarding(page);
    await skipCycleOptIn(page);
  });

  test('preview voice returns audio/mpeg', async ({ page }) => {
    await page.goto('/onboarding');
    const responsePromise = page.waitForResponse(
      (res) => res.url().endsWith('/api/voice') && res.status() === 200
    );
    await page.getByText('Preview voice').first().click();
    const res = await responsePromise;
    expect(res.headers()['content-type']).toContain('audio/mpeg');
    const buf = await res.body();
    expect(buf.length).toBeGreaterThan(1000);
  });
});
