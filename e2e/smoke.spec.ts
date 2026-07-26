import { test, expect } from '@playwright/test';

/**
 * Pre-real-route toolchain check (mirrors the `zap` project's e2e/smoke.spec.ts).
 * `redesign/site-refresh` has no `/redesign` content yet — this proves the
 * Playwright setup itself (webServer boot, MCP config, CI job) actually works.
 * Once a redesign task lands a real `/redesign` route/section, add a spec for it
 * per `docs/testing-conventions.md` and leave this one as the pre-app baseline.
 */
test('homepage renders with zero console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');

  await expect(page).toHaveTitle(/Laud Tetteh/);
  expect(consoleErrors).toEqual([]);
});
