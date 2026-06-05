/**
 * Standalone screenshot script — boots a Chromium against the local server and
 * captures the major screens. Bypasses the test runner so it completes fast.
 *
 *   RITE_BASE_URL=http://localhost:8083 node e2e/screenshot.mjs
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

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 420, height: 880 } });
await ctx.route('**/api/voice', (route) =>
  route.fulfill({
    status: 200,
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
    body: SILENT_MP3,
  })
);
await ctx.addInitScript(() => {
  try {
    window.localStorage.removeItem('rite-store');
  } catch {}
});

const page = await ctx.newPage();

async function shot(name) {
  await page.waitForTimeout(400);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('captured', name);
}

await page.goto(BASE + '/');
await page.waitForLoadState('networkidle');
await shot('01-onboarding');

await page.getByText('Sage', { exact: true }).first().click();
await shot('02-onboarding-selected');

await page.getByText('Enter RITE', { exact: true }).click();
await page.waitForLoadState('networkidle');
await shot('03-cycle-opt-in');

await page.getByText('Skip — enter RITE').click();
await page.waitForLoadState('networkidle');
await shot('04-home');

await page.getByText('Stolen Moment').first().click();
await page.waitForLoadState('networkidle');
await shot('05-checkin');

await page.getByText('Scattered', { exact: true }).click();
await page.getByText('2', { exact: true }).first().click();
await shot('06-checkin-filled');

await page.getByText('Begin Rite', { exact: true }).click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3500);
await shot('07-session-layer-1');

await page.getByText('Continue', { exact: true }).click();
await page.waitForTimeout(2500);
await shot('08-session-layer-2');

await page.getByText('Continue', { exact: true }).click();
await page.waitForTimeout(2500);
await page.getByText('Continue', { exact: true }).click();
await page.waitForTimeout(2500);
await shot('09-session-layer-4');

await page.getByText('Complete Rite', { exact: true }).click();
await page.waitForLoadState('networkidle');
await shot('10-complete');

await browser.close();
console.log('all done -> ' + OUT);
