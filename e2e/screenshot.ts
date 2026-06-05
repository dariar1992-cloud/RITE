/**
 * Standalone screenshot script — boots a Chromium against the local server and
 * captures the major screens. Bypasses the test runner so it completes fast
 * inside the sandbox.
 *
 *   RITE_BASE_URL=http://localhost:8083 npx tsx e2e/screenshot.ts
 *
 * Outputs PNG files to ./screenshots/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const BASE = process.env.RITE_BASE_URL ?? 'http://localhost:8083';
const OUT = path.resolve(process.cwd(), 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const SILENT_MP3 = Buffer.from(
  '//uQRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'base64'
);

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 420, height: 880 } });
  await ctx.route('**/api/voice', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
      body: SILENT_MP3,
    })
  );

  // Clear persisted store on first nav.
  await ctx.addInitScript(() => {
    try {
      window.localStorage.removeItem('rite-store');
    } catch {}
  });

  const page = await ctx.newPage();

  async function shot(name: string, url: string) {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log('captured', name, '->', file);
  }

  // First load redirects to onboarding via _layout.tsx.
  await shot('01-onboarding', '/');

  // Pick Sage to advance.
  await page.getByText('Sage', { exact: true }).first().click();
  await page.waitForTimeout(200);
  await shot('02-onboarding-selected', '/onboarding');

  await page.getByText('Enter RITE', { exact: true }).click();
  await page.waitForTimeout(500);
  await shot('03-cycle-opt-in', '/cycle-opt-in');

  await page.getByText('Skip — enter RITE').click();
  await page.waitForTimeout(500);
  await shot('04-home', '/');

  await page.getByText('Stolen Moment').first().click();
  await page.waitForTimeout(500);
  await shot('05-checkin', '/checkin');

  await page.getByText('Scattered', { exact: true }).click();
  await page.getByText('2', { exact: true }).first().click();
  await page.waitForTimeout(200);
  await shot('06-checkin-filled', '/checkin');

  await page.getByText('Begin Rite', { exact: true }).click();
  await page.waitForTimeout(3500); // wait past settling beat
  await shot('07-session-layer-1', '/session');

  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(2500);
  await shot('08-session-layer-2', '/session');

  // Skip ahead to the last layer + complete.
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(2500);
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForTimeout(2500);
  await shot('09-session-layer-4', '/session');

  await page.getByText('Complete Rite', { exact: true }).click();
  await page.waitForTimeout(1000);
  await shot('10-complete', '/complete');

  // Methodology + Science library via settings.
  await page.getByText('Return to the world').click();
  await page.waitForTimeout(500);
  await page.getByText(/· settings/i).click();
  await page.waitForTimeout(500);
  await shot('11-settings', '/settings');

  await page.getByText('Methodology').click();
  await page.waitForTimeout(800);
  await shot('12-methodology', '/methodology');

  await browser.close();
  console.log('\nAll screenshots saved to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
