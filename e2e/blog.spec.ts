import { test, expect } from '@playwright/test';

/**
 * Coverage for #60: `/blog` and `/blog/[slug]` picking up the redesign
 * system (BlogLayout/BlogSidebar) instead of the legacy jQuery theme.
 * CI has no live backend, but the public archive has repo-backed static posts.
 * These assertions therefore exercise the real archive and category flows in
 * CI while API-backed posts remain optional enrichment.
 */

test('blog archive renders with zero console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/blog', { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle(/Blog \| Laud Tetteh/);
  expect(consoleErrors).toEqual([]);
});

test('blog archive shows the repo-backed post cards', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const cardCount = await page.locator('article').count();
  expect(cardCount).toBeGreaterThanOrEqual(3);
  await expect(page.locator('article').first()).toBeVisible();
});

test('category filter link updates the URL and re-filters', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const categoryLinks = page.locator('a[href^="/blog?category="]');
  expect(await categoryLinks.count()).toBeGreaterThan(0);

  const firstCategory = categoryLinks.first();
  const href = await firstCategory.getAttribute('href');
  await firstCategory.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('switching category filter resets pagination back to page 1', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const nav = page.getByRole('navigation', { name: 'Pagination' });
  const pageTwoButton = nav.getByRole('button', { name: '2', exact: true });
  test.skip((await pageTwoButton.count()) === 0, 'fewer than 2 pages of posts available');

  const categoryLinks = page.locator('a[href^="/blog?category="]');
  const href = await categoryLinks.first().getAttribute('href');

  // Baseline: what this category looks like with no stale pagination state.
  await page.goto(href!, { waitUntil: 'domcontentloaded' });
  const baselineArticleCount = await page.locator('article').count();
  const baselineEmptyState = await page.getByText(/^No posts found in/).count();

  // Regression repro: switching categories while on page 2+ previously left
  // `currentPage` stale, slicing past the end of the newly-filtered array
  // and showing "no posts found" even when matching posts existed.
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  await pageTwoButton.click();
  await expect(nav.getByRole('button', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page');
  await categoryLinks.first().click();

  await expect(page.locator('article')).toHaveCount(baselineArticleCount);
  expect(await page.getByText(/^No posts found in/).count()).toBe(baselineEmptyState);
});

test('archive results fade in on filter click rather than snapping instantly', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const categoryLinks = page.locator('a[href^="/blog?category="]');
  expect(await categoryLinks.count()).toBeGreaterThan(0);

  const results = page.locator('main .animate-fade-in').first();
  await expect(results).toBeVisible();
  const previousResults = await results.elementHandle();
  expect(previousResults).not.toBeNull();
  await categoryLinks.first().click();

  await expect
    .poll(async () => previousResults?.evaluate(el => !el.isConnected), {
      message: 'category click should remount the animated results container',
    })
    .toBe(true);
  await expect(results).toHaveClass(/animate-fade-in/);
  await expect(results).toHaveCSS('opacity', '1');
});

test('admin Edit link is absent from the archive when logged out', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
});

test('blog routes opt into the redesign shell (#60)', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const dataRoute = await page.evaluate(() => document.documentElement.getAttribute('data-route'));
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(dataRoute).toBe('redesign');
  expect(scrollBehavior).toBe('smooth');
});

test('blog archive theme toggle switches dark class on html element', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const html = page.locator('html');
  const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  await page.locator('button[aria-label*="Switch to"]:visible').first().click();
  const afterDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  expect(afterDark).not.toBe(initiallyDark);
});

test('single post page returns 404 for an unknown public slug without crashing', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  const response = await page.goto('/blog/does-not-exist-e2e', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(404);
  await expect(page.getByText('This page could not be found')).toBeVisible();
  expect(pageErrors).toEqual([]);
});
