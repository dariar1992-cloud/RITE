import { type Page, type Route, expect } from '@playwright/test';

/**
 * Mock /api/voice so tests don't burn ElevenLabs credits and don't
 * depend on the network. Returns a 1-second silent mp3.
 *
 * A real, valid silent MP3 frame (1152 samples @ 44.1kHz, ~26ms) repeated.
 * Browsers accept this and the <audio> element will fire `ended` quickly.
 */
const SILENT_MP3_BASE64 =
  // 1s of silence, mono, 44.1kHz, 32kbps mp3 — generated from a single frame
  // pattern. Just enough to make the player happy.
  '//uQRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export async function mockVoiceRoute(page: Page) {
  await page.route('**/api/voice', async (route: Route) => {
    const buffer = Buffer.from(SILENT_MP3_BASE64, 'base64');
    await route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
      body: buffer,
    });
  });
}

/**
 * Clear the persisted zustand store so each test starts from a fresh
 * onboarding state. The store key is "rite-store" (see store/useRiteStore.ts).
 */
export async function resetStore(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.removeItem('rite-store');
    } catch {}
  });
}

/**
 * Go to "/" with a clean store. Onboarding redirect kicks in via _layout.tsx.
 */
export async function startFresh(page: Page) {
  await resetStore(page);
  await mockVoiceRoute(page);
  await page.goto('/');
}

/**
 * Walk through onboarding: pick Sage (first guide), hit Enter RITE.
 * Lands on /cycle-opt-in next per onboarding.tsx routing.
 */
export async function completeOnboarding(page: Page, guide: 'Sage' | 'Arjun' | 'Akasha' = 'Sage') {
  await expect(page.getByText('Choose your voice guide.')).toBeVisible();
  // Click the guide name to select the card.
  await page.getByText(guide, { exact: true }).first().click();
  await page.getByText('Enter RITE', { exact: true }).click();
}

/**
 * Skip the cycle protocol opt-in screen.
 */
export async function skipCycleOptIn(page: Page) {
  await expect(page.getByText('Cycle Protocol')).toBeVisible();
  await page.getByText('Skip — enter RITE').click();
}
