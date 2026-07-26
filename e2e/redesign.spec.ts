import { test, expect } from '@playwright/test';

/**
 * Placeholder-shell check for #7 (redesign-scaffold), extended by #8
 * (redesign-header-nav), #9 (redesign-about-section), and #10
 * (redesign-experience-section). `header`, `about`, and `experience` now
 * render real content — the remaining sections stay stubs until their own
 * tickets land, each of which should extend this spec further (and remove
 * itself from the stub loop below) per testing-conventions.md.
 */
test('redesign renders with zero console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/redesign');

  await expect(page).toHaveTitle(/Laud Tetteh/);
  for (const section of ['projects', 'sandbox', 'writing', 'contact', 'footer']) {
    await expect(page.locator(`[data-redesign-section="${section}"]`)).toBeAttached();
  }
  expect(consoleErrors).toEqual([]);
});

test('about section renders real bio content in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const about = page.locator('#about');
  await expect(about).toContainText('Laud Tetteh');
  await expect(about).toContainText('Download CV');
  await expect(about).toContainText('Server Side');
});

test('experience section renders real work history in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const experience = page.locator('#experience');
  await expect(experience).toContainText('Salesforce');
  await expect(experience).toContainText('Brittani Dinsmore');
});

test('header renders name/role/nav/social in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const header = page.locator('#header');
  await expect(header).toContainText('Laud Tetteh');
  await expect(header).toContainText('Software Engineer');
  await expect(header.locator('a[href="#about"]')).toBeVisible();
  await expect(header.locator('a[href="https://github.com/laudtetteh"]')).toBeVisible();
  await expect(header.locator('a[href="https://www.linkedin.com/in/laudtetteh"]')).toBeVisible();
});

test('header tagline rotates over time', async ({ page }) => {
  await page.goto('/redesign');
  const tagline = page.locator('#header p[aria-live="polite"]');
  const first = await tagline.textContent();
  // Interval is 4000ms + a 200ms fade before the swap; pad generously so
  // CI hydration/render jitter doesn't make this flaky.
  await page.waitForTimeout(5500);
  const second = await tagline.textContent();
  expect(second).not.toBe(first);
});

test('header scroll-spy marks the active nav link', async ({ page }) => {
  await page.goto('/redesign');
  // #about is still a zero-height stub until its own ticket lands real
  // content — give it real height so IntersectionObserver has something to
  // report a nonzero ratio against, isolating useScrollSpy's own logic.
  await page.locator('#about').evaluate(el => {
    (el as HTMLElement).style.minHeight = '150vh';
  });
  const aboutLink = page.locator('#header a[href="#about"]');
  await expect(aboutLink).not.toHaveClass(/active/);
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect(aboutLink).toHaveClass(/active/);
});

test('header theme toggle switches dark class on html element', async ({ page }) => {
  await page.goto('/redesign');
  const html = page.locator('html');
  const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  await page.locator('#header button[aria-label*="Switch to"]:visible').first().click();
  const afterDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  expect(afterDark).not.toBe(initiallyDark);
});

test('header stacks within viewport width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/redesign');
  const header = page.locator('#header');
  await expect(header).toBeVisible();
  const box = await header.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(375);
});
