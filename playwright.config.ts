import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for laudtetteh.io visual validation + e2e.
 *
 * `e2e/smoke.spec.ts` runs against the current live homepage (`/`) — it exists to
 * prove the toolchain works before any real `/redesign` content has landed on this
 * branch. Once a redesign task adds a real route/section, add a spec for it here
 * following the testing conventions doc (external — see rules/verification.md).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }]] : 'list',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
