import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with all main sections visible', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display current year in footer copyright', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    await expect(page.locator('footer')).toContainText(`© ${currentYear} Yarson`);
  });

  test('should keep header fixed when scrolling', async ({ page }) => {
    const header = page.locator('header');
    const initialY = (await header.boundingBox())!.y;

    await page.evaluate(() => window.scrollTo(0, 500));
    
    const yAfterScroll = (await header.boundingBox())!.y;
    expect(yAfterScroll).toBe(initialY);
  });
});