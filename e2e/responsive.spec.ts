import { test, expect, type Page } from '@playwright/test';

/**
 * Responsive regression coverage (#83).
 *
 * Two classes of bug are locked in here, both found on the live site right
 * after the OVH cutover:
 *
 *  1. The footer is styled as a full-bleed band but was rendered *inside*
 *     `<main>` (`lg:w-[52%]`), so it stopped halfway across the page at
 *     desktop widths. It was wrong on the homepage AND on every blog route —
 *     two separate layout files with the same mistake, which is exactly why
 *     this asserts across routes rather than just the one page that was
 *     reported.
 *  2. Horizontal overflow, the classic mobile breakage. Nothing was
 *     overflowing when this was written; the assertion exists to keep it
 *     that way.
 *
 * Viewports deliberately straddle the `lg` breakpoint (1024px), since the
 * footer bug only manifested once the two-column grid kicked in.
 */

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'sm boundary', width: 640, height: 900 },
  { name: 'tablet portrait', width: 768, height: 1024 },
  { name: 'lg breakpoint', width: 1024, height: 800 },
  { name: 'desktop', width: 1920, height: 1080 },
];

// `/blog/[slug]` is covered via the blog index's first post link rather than a
// hard-coded slug, so the spec keeps working as content changes.
const STATIC_ROUTES = ['/', '/blog'];

function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of STATIC_ROUTES) {
      test(`${route} has no horizontal overflow`, async ({ page }) => {
        // `networkidle` matters in dev mode: Next compiles routes on demand,
        // and measuring layout mid-compile reports a half-rendered page.
        await page.goto(route, { waitUntil: 'networkidle' });
        await expectNoHorizontalOverflow(page);
      });

      test(`${route} footer spans the full viewport width`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' });
        const footer = page.locator('#footer');
        await footer.waitFor();
        const box = await footer.boundingBox();
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(box).not.toBeNull();
        // Rounding tolerance only — anything larger means the footer is back
        // inside a constrained column.
        expect(Math.round(box!.width)).toBeGreaterThanOrEqual(clientWidth - 1);
      });
    }
  });
}

test('footer copy reads "All rights reserved" and stays on one line at desktop width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const copyright = page.locator('#footer p').first();
  await expect(copyright).toContainText('All rights reserved');
  // "All rights are reserved" was the original wording (#83).
  await expect(copyright).not.toContainText('rights are reserved');

  // A single rendered line: the reported symptom was this wrapping
  // mid-phrase because the footer was squeezed into the narrow column.
  const lineCount = await copyright.evaluate((el) => {
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    return Math.round(el.getBoundingClientRect().height / lineHeight);
  });
  expect(lineCount).toBe(1);
});

test('mobile homepage nav exposes tappable links without horizontal overflow', async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Retargeted in #119: the wrapping horizontal list this used to assert was
  // replaced by the fixed rail, which stays put while the stacked sidebar
  // scrolls away. The invariants below are unchanged — five reachable,
  // adequately sized links that do not push the page sideways.
  const nav = page.getByRole('navigation', { name: 'Section' });
  await expect(nav).toBeVisible();
  // About · Experience · Projects · Writing · Contact. Sandbox was removed in
  // #101 and comes back with the section in #108.
  await expect(nav.getByRole('link')).toHaveCount(5);

  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  for (const link of await nav.getByRole('link').all()) {
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth);
    // 44px since #119 — the rail's dash is 2px of chrome, but the tap area a
    // thumb has to hit is the whole row.
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await nav.getByRole('link', { name: 'Contact' }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

test('theme toggle works on mobile in both homepage and blog shells', async ({ page }) => {
  for (const route of ['/', '/blog']) {
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(route, { waitUntil: 'networkidle' });

    const html = page.locator('html');
    const toggle = page.locator('button[aria-label*="Switch to"]:visible').first();
    await expect(toggle).toBeVisible();

    const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
    await toggle.click();
    const afterFirstToggle = (await html.getAttribute('class'))?.includes('dark') ?? false;
    expect(afterFirstToggle).not.toBe(initiallyDark);

    await toggle.click();
    const afterSecondToggle = (await html.getAttribute('class'))?.includes('dark') ?? false;
    expect(afterSecondToggle).toBe(initiallyDark);

    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  }
});

test('contact form fields and submit button fit at mobile and sm widths', async ({ page }) => {
  for (const width of [375, 640]) {
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#contact', { waitUntil: 'networkidle' });

    const fields = [
      page.locator('#contact_name'),
      page.locator('#contact_email'),
      page.locator('#contact_message'),
      page.locator('#send_message'),
    ];
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);

    for (const field of fields) {
      await expect(field).toBeVisible();
      const box = await field.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth);
    }

    await page.locator('#contact_name').fill('Responsive QA');
    await page.locator('#contact_email').fill('qa@example.com');
    await page.locator('#contact_message').fill('Checking mobile field sizing only.');
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  }
});

test('blog post media and prose do not overflow on mobile', async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 375, height: 812 });
  const response = await page.goto('/blog/what-breaks-with-ai-agents', { waitUntil: 'networkidle' });
  expect(response?.status()).toBe(200);

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const checkedElements = page.locator('.prose img, .prose pre, .prose table, nav[aria-label="Breadcrumb"]');
  const count = await checkedElements.count();
  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    const box = await checkedElements.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(viewportWidth);
  }

  await expectNoHorizontalOverflow(page);
  expect(errors).toEqual([]);
});

/**
 * Mobile section rail (#119).
 *
 * Replaced the wrapping horizontal link list that scrolled away on the first
 * swipe. The rail overlays content by design, so the assertions that matter are
 * the breakpoint swap, the accessible names (a rail of bare dots is this
 * pattern's classic failure), and that it never forces horizontal overflow.
 */
test.describe('mobile section rail (#119)', () => {
  test('rail replaces the sidebar nav below lg and yields to it above', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Section"]')).toBeVisible();
    await expect(page.locator('nav[aria-label="In-page"]')).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.locator('nav[aria-label="Section"]')).toBeHidden();
    await expect(page.locator('nav[aria-label="In-page"]')).toBeVisible();
  });

  test('rail links carry real accessible names, not bare markers', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const links = page.locator('nav[aria-label="Section"] a');
    const names = await links.evaluateAll(ns => ns.map(n => n.textContent?.trim() ?? ''));

    expect(names.length).toBeGreaterThan(1);
    expect(names.every(Boolean)).toBe(true);
    expect(names).toContain('Projects');
  });

  test('rail marks the visible section and causes no horizontal overflow', async ({ page }) => {
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/');
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);

      const current = page.locator('nav[aria-label="Section"] a[aria-current="location"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText('Projects');

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflows, `horizontal overflow at ${width}px`).toBe(false);
    }
  });
});

test.describe('blog mobile site rail (#139)', () => {
  test('blog archive and category URLs show the mobile site rail below lg', async ({ page }) => {
    for (const route of ['/blog', '/blog?category=Development']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);

      const rail = page.locator('nav[aria-label="Site rail"]');
      await expect(rail).toBeVisible();
      await expect(rail.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      await expect(rail.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
      await expectNoHorizontalOverflow(page);

      await page.setViewportSize({ width: 1280, height: 900 });
      await expect(rail).toBeHidden();
    }
  });

  test('post detail pages keep the mobile site rail when a post exists', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/blog');

    const firstPost = page.locator('a[href^="/blog/"]').first();
    await expect(firstPost).toHaveCount(1);

    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\/.+/);

    const rail = page.locator('nav[aria-label="Site rail"]');
    await expect(rail).toBeVisible();
    await expect(rail.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
    await expectNoHorizontalOverflow(page);
  });
});
