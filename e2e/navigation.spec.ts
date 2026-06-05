import { expect, test } from '@playwright/test';

import { completeOnboarding, mockVoiceRoute, resetStore, skipCycleOptIn } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await resetStore(page);
    await mockVoiceRoute(page);
    await page.goto('/');
    await completeOnboarding(page);
    await skipCycleOptIn(page);
  });

  test('settings is reachable from home', async ({ page }) => {
    // The footer "settings" link includes the guide name + " · settings".
    await page.getByText(/· settings/i).click();
    await expect(page.getByText('Methodology')).toBeVisible();
    await expect(page.getByText('Evidence library')).toBeVisible();
    await expect(page.getByText('Sync across devices')).toBeVisible();
  });

  test('methodology screen renders', async ({ page }) => {
    await page.getByText(/· settings/i).click();
    await page.getByText('Methodology').click();
    // Wait for any header from the methodology screen.
    await expect(page).toHaveURL(/\/methodology/);
  });

  test('science library is browsable', async ({ page }) => {
    await page.getByText(/· settings/i).click();
    await page.getByText('Evidence library').click();
    await expect(page).toHaveURL(/\/science/);
  });

  test('cloud sync is marked Coming soon', async ({ page }) => {
    await page.getByText(/· settings/i).click();
    await expect(page.getByText('Coming soon')).toBeVisible();
  });
});
