import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for RITE web E2E tests.
 *
 * The tests boot the Expo web dev server (which also hosts the /api/voice route)
 * and exercise the full onboarding -> session -> complete flow.
 *
 * Voice playback is mocked at the route level in tests so we don't burn
 * ElevenLabs credits in CI. Run `npm run test:e2e:voice` to exercise the
 * real /api/voice endpoint against your ELEVENLABS_API_KEY.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.RITE_BASE_URL ?? 'http://localhost:8081',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: process.env.RITE_BASE_URL
    ? undefined
    : {
        // Use the dev server because it serves /api/voice as a real route handler.
        // Static `expo export` strips API routes unless app.json output is "server",
        // which RITE already is — but the production server is more involved to boot.
        // Dev server is the simplest path for E2E and matches the way you'd run locally.
        command: 'npx expo start --web --port 8081',
        url: 'http://localhost:8081',
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
});
