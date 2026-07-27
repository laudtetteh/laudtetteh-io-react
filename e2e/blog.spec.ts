import { test, expect } from '@playwright/test';

/**
 * Coverage for #60: `/blog` and `/blog/[slug]` picking up the redesign
 * system (BlogLayout/BlogSidebar) instead of the legacy jQuery theme.
 * CI has no live backend (`API_SERVER` points at a Docker-internal
 * address), so archive/category assertions mirror the "both valid
 * outcomes" pattern already established in redesign.spec.ts's writing
 * section test — real cards locally, graceful empty state in CI.
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

test('blog archive shows real post cards or the graceful empty state', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const cardCount = await page.locator('article').count();
  if (cardCount > 0) {
    await expect(page.locator('article').first()).toBeVisible();
  } else {
    await expect(page.getByText('No posts available yet.')).toBeVisible();
  }
});

test('category filter link updates the URL and re-filters', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const categoryLinks = page.locator('a[href^="/blog?category="]');
  const count = await categoryLinks.count();
  test.skip(count === 0, 'no categories available without a live backend');

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
  const count = await categoryLinks.count();
  test.skip(count === 0, 'no categories available without a live backend');

  const results = page.locator('main .animate-fade-in').first();
  await categoryLinks.first().click();

  // Same polling approach as the sandbox filter's equivalent assertion —
  // proves a real animation runs rather than an instant class swap.
  const samples: number[] = [];
  const deadline = Date.now() + 1000;
  while (Date.now() < deadline) {
    samples.push(await results.evaluate(el => parseFloat(getComputedStyle(el).opacity)));
    await page.waitForTimeout(20);
  }
  expect(samples.some(o => o < 0.95)).toBe(true);
  // `toHaveCSS` auto-retries rather than trusting the sampling loop's last
  // value, which can land mid-animation under heavy parallel-worker CPU
  // contention (see the equivalent sandbox test's comment).
  await expect(results).toHaveCSS('opacity', '1');
});

test('admin Edit link is absent from the archive when logged out', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0);
});

test('blog routes opt into the redesign shell (#60)', async ({ page }) => {
  for (const route of ['/blog', '/blog/does-not-exist-e2e']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const dataRoute = await page.evaluate(() => document.documentElement.getAttribute('data-route'));
    const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(dataRoute).toBe('redesign');
    expect(scrollBehavior).toBe('smooth');
  }
});

test('blog archive theme toggle switches dark class on html element', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'domcontentloaded' });
  const html = page.locator('html');
  const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  await page.locator('button[aria-label*="Switch to"]:visible').first().click();
  const afterDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  expect(afterDark).not.toBe(initiallyDark);
});

test('single post page renders breadcrumbs and handles an unknown slug without crashing', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/blog/does-not-exist-e2e', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).or(page.getByText('Loading post...'))).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
