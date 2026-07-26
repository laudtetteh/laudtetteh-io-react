import { test, expect } from '@playwright/test';

/**
 * Placeholder-shell check for #7 (redesign-scaffold). RedesignLayout only
 * renders empty section stubs so far — real content lands in later redesign
 * tasks, each of which should extend this spec per testing-conventions.md.
 */
test('redesign renders with zero console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/redesign');

  await expect(page).toHaveTitle(/Laud Tetteh/);
  for (const section of ['header', 'about', 'experience', 'projects', 'sandbox', 'writing', 'contact', 'footer']) {
    await expect(page.locator(`[data-redesign-section="${section}"]`)).toBeAttached();
  }
  expect(consoleErrors).toEqual([]);
});
