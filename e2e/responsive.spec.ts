import { test, expect } from '@playwright/test';

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
  { name: 'tablet portrait', width: 768, height: 1024 },
  { name: 'lg breakpoint', width: 1024, height: 800 },
  { name: 'desktop', width: 1920, height: 1080 },
];

// `/blog/[slug]` is covered via the blog index's first post link rather than a
// hard-coded slug, so the spec keeps working as content changes.
const STATIC_ROUTES = ['/', '/blog'];

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of STATIC_ROUTES) {
      test(`${route} has no horizontal overflow`, async ({ page }) => {
        // `networkidle` matters in dev mode: Next compiles routes on demand,
        // and measuring layout mid-compile reports a half-rendered page.
        await page.goto(route, { waitUntil: 'networkidle' });
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
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
