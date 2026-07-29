import { test, expect } from '@playwright/test';

/**
 * Placeholder-shell check for #7 (redesign-scaffold). All 8 Sprint 1
 * sections now render real content as of #13 (redesign-writing-section) —
 * no stubs remain in `RedesignLayout.tsx`.
 */
test('redesign renders with zero console errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/redesign');

  await expect(page).toHaveTitle(/Laud Tetteh/);
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

test('projects section renders real case-study cards in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const projects = page.locator('#projects');
  await expect(projects).toContainText('MethodistCRM');
  await expect(projects.getByRole('img').first()).toBeVisible();
});

test('sandbox section renders real GitHub repos with a working category filter', async ({ page }) => {
  await page.goto('/redesign');
  const sandbox = page.locator('#sandbox');
  await expect(sandbox.getByRole('button', { name: 'All' })).toBeVisible();
  const initialCardCount = await sandbox.locator('article').count();
  expect(initialCardCount).toBeGreaterThan(0);
  await sandbox.getByRole('button', { name: 'Backend' }).click();
  await expect(sandbox.locator('article').first()).toBeVisible();
});

test('sandbox filter results fade in on click rather than snapping instantly', async ({ page }) => {
  await page.goto('/redesign');
  const sandbox = page.locator('#sandbox');
  const grid = sandbox.locator('.animate-fade-in').first();
  await expect(grid).toBeVisible();

  await sandbox.getByRole('button', { name: 'Backend' }).click();

  // Poll opacity immediately after the click — if a real fade-in animation
  // is running, opacity starts below 1 and rises; an instant swap would
  // read 1 on every sample. Mirrors the polling approach already used for
  // the smooth-scroll assertion above, since a fixed-delay sample can land
  // after a short animation has already finished under CPU contention.
  const samples: number[] = [];
  const deadline = Date.now() + 1000;
  while (Date.now() < deadline) {
    samples.push(await grid.evaluate(el => parseFloat(getComputedStyle(el).opacity)));
    await page.waitForTimeout(20);
  }
  expect(samples.some(o => o < 0.95)).toBe(true);
  // `toHaveCSS` auto-retries rather than trusting the sampling loop's last
  // value, which can land mid-animation (not yet settled at 1) under heavy
  // parallel-worker CPU contention — same class of timing issue documented
  // on the spotlight-cursor and scroll-spy tests above.
  await expect(grid).toHaveCSS('opacity', '1');
});

test('writing section renders real blog teaser cards in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const writing = page.locator('#writing');
  await expect(writing.getByRole('link', { name: /Read the blog/ })).toBeVisible();
  // The blog API is only reachable inside the Docker network (API_SERVER
  // points at an internal address) — CI has no live backend, so
  // getLatestPosts() correctly falls back to an empty array there and this
  // section renders its graceful empty state instead of real cards. Locally,
  // against the real dev stack, real cards render. Both are valid outcomes;
  // assert on whichever one is actually showing rather than assuming a live
  // backend connection.
  const cardCount = await writing.locator('article').count();
  if (cardCount > 0) {
    await expect(writing.locator('article').first()).toBeVisible();
  } else {
    await expect(writing).toContainText('No posts published yet');
  }
});

test('contact section renders the real form shell in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const contact = page.locator('#contact');
  await expect(contact.locator('#contact_name')).toBeVisible();
  await expect(contact.locator('#contact_email')).toBeVisible();
  await expect(contact.locator('#contact_message')).toBeVisible();
  await expect(contact.locator('#send_message')).toBeVisible();
});

test('contact form honeypot field is present but hidden from real users', async ({ page }) => {
  await page.goto('/redesign');
  const contact = page.locator('#contact');
  const honeypot = contact.locator('input[name="website"]');
  await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(honeypot).toHaveValue('');
});

test('footer renders real copyright and contact links in initial HTML', async ({ page }) => {
  await page.goto('/redesign');
  const footer = page.locator('#footer');
  await expect(footer).toContainText(`Copyright © ${new Date().getFullYear()} by Laud Tetteh`);
  await expect(footer.locator('a[href="mailto:hello@laudtetteh.io"]')).toBeVisible();
  await expect(footer.locator('a[href="https://github.com/laudtetteh"]')).toBeVisible();
  await expect(footer.locator('a[href="https://www.linkedin.com/in/laudtetteh"]')).toBeVisible();
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
  // Give #about real height so IntersectionObserver has something to
  // report a nonzero ratio against, isolating useScrollSpy's own logic.
  await page.locator('#about').evaluate(el => {
    (el as HTMLElement).style.minHeight = '150vh';
  });
  const aboutLink = page.locator('#header a[href="#about"]');
  const experienceLink = page.locator('#header a[href="#experience"]');

  // Under the #48 two-column shell, #about sits immediately beside the
  // sticky header (not below a full-width header block), so it's already
  // the active section at the top of the page — assert that directly,
  // then confirm scrolling to a later section moves the highlight.
  await expect(aboutLink).toHaveClass(/active/);
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect(experienceLink).toHaveClass(/active/);
  await expect(aboutLink).not.toHaveClass(/active/);
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

  // Regression coverage for #48: the mobile-only sticky section-title bar's
  // `-mx-6 w-screen` breakout previously caused real horizontal scroll on
  // narrow viewports (an ambient double-padding bug, since fixed) — assert
  // the whole document never exceeds the viewport width.
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('two-column shell splits header and main side by side at desktop width (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/redesign');
  await expect(page.locator('#header')).toBeVisible();
  await expect(page.locator('#content')).toBeVisible();
  const headerBox = await page.locator('#header').boundingBox();
  const mainBox = await page.locator('#content').boundingBox();
  expect(headerBox).not.toBeNull();
  expect(mainBox).not.toBeNull();
  // Real left margin — header is not flush against the viewport edge.
  expect(headerBox!.x).toBeGreaterThan(0);
  // Main sits immediately to the right of header, not below it.
  expect(mainBox!.x).toBeGreaterThanOrEqual(headerBox!.x + headerBox!.width);
  // Both columns start at the same vertical position.
  expect(mainBox!.y).toBeCloseTo(headerBox!.y, 0);
});

test('header stays visually pinned while scrolling at desktop width (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/redesign');
  for (const y of [0, 300, 800, 1500, 3000]) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    // Let the sticky recalculation settle — scroll listeners aren't
    // synchronous with the JS-driven `scrollTo`.
    await page.waitForTimeout(100);
    const top = await page.locator('#header').evaluate((el) => el.getBoundingClientRect().top);
    // This is the exact regression that shipped unnoticed: before the
    // two-column shell, `top` moved in lockstep with `-scrollY` (i.e.
    // `position: sticky` behaved as `static`). Pinned means `top` stays
    // near 0 regardless of how far the page has scrolled.
    expect(Math.abs(top)).toBeLessThanOrEqual(5);
  }
});

test('smooth scroll animates gradually on in-page nav click, not an instant jump (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/redesign');

  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(scrollBehavior).toBe('smooth');

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#header a[href="#experience"]').click();

  // Sample scrollY on a tight poll rather than at two fixed wall-clock
  // offsets — under heavy parallel-worker CPU contention a fixed delay can
  // land after the (browser-timed, not JS-timed) animation has already
  // finished, making a two-sample comparison flaky. Collecting the full
  // trajectory and asserting it passed through more than one distinct,
  // non-zero, non-final value proves the scroll was gradual regardless of
  // exactly when each sample landed.
  const samples: number[] = [];
  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    samples.push(await page.evaluate(() => window.scrollY));
    await page.waitForTimeout(20);
  }
  const finalY = samples[samples.length - 1];
  const intermediate = samples.filter((y) => y > 0 && y < finalY);

  expect(finalY).toBeGreaterThan(0);
  expect(intermediate.length).toBeGreaterThan(0);
});

test('spotlight cursor glow follows the mouse (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/redesign');
  const spotlight = page.locator('div.pointer-events-none.fixed.inset-0.z-30');

  // A single-jump `mouse.move()` right after `goto` is occasionally missed
  // entirely (dispatched before React's `mousemove` listener has attached
  // post-hydration) — an artifact of Playwright's synthetic input, not a
  // real-user scenario. `{ steps }` dispatches intermediate `mousemove`
  // events along the path, and `expect.poll` absorbs any remaining
  // scheduling variance, so this reliably observes the update either way.
  await page.mouse.move(50, 50);
  await page.mouse.move(100, 200, { steps: 5 });
  await expect
    .poll(async () => spotlight.getAttribute('style'))
    .toContain('100px 200px');
  const styleAtFirst = await spotlight.getAttribute('style');

  await page.mouse.move(500, 650, { steps: 5 });
  await expect
    .poll(async () => spotlight.getAttribute('style'))
    .toContain('500px 650px');
  const styleAtSecond = await spotlight.getAttribute('style');
  expect(styleAtSecond).not.toBe(styleAtFirst);
});

test('hovering an experience entry dims its siblings, not itself (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/redesign');
  const items = page.locator('#experience ol.group\\/list > li');
  await expect(items.first()).toBeVisible();

  const first = items.nth(0);
  const second = items.nth(1);

  await expect(second).toHaveCSS('opacity', '1');
  await first.hover();
  // `toHaveCSS` auto-retries until the `transition-opacity` finishes.
  await expect(first).toHaveCSS('opacity', '1');
  await expect(second).toHaveCSS('opacity', '0.5');
});

test('mobile-only sticky section-title bar shows on mobile, hidden at desktop width (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/redesign');
  const mobileTitle = page.locator('#about div[aria-hidden="true"]').first();
  await expect(mobileTitle).toBeVisible();
  await expect(mobileTitle).toContainText('About');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(mobileTitle).toBeHidden();
});

test('active nav indicator uses the neutral palette, not the teal accent (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/redesign');
  await page.locator('#about').evaluate((el) => {
    (el as HTMLElement).style.minHeight = '150vh';
  });
  const aboutLink = page.locator('#header a[href="#about"]');
  await expect(aboutLink).toHaveClass(/active/);
  const className = (await aboutLink.getAttribute('class')) ?? '';
  expect(className).not.toContain('teal');
  expect(className).toContain('slate');
});

test('legacy homepage route is unaffected by the redesign shell (#48)', async ({ page }) => {
  // `/blog` opted into the redesign shell as of #60 — see e2e/blog.spec.ts for
  // its equivalent "does have the shell" coverage. `/` (the still-legacy
  // homepage, pending the #17 cutover) is the only route left to assert here.
  await page.goto('/');
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  const hasSpotlight = await page.evaluate(
    () => !!document.querySelector('div.pointer-events-none.fixed.inset-0.z-30')
  );
  expect(scrollBehavior).toBe('auto');
  expect(hasSpotlight).toBe(false);
});

test('headings use the Inter font, not the legacy Syne theme font (#19)', async ({ page }) => {
  await page.goto('/redesign');
  const h1Family = await page.locator('#header h1').evaluate((el) => getComputedStyle(el).fontFamily);
  const h2Family = await page.locator('#about h2').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(h1Family).not.toContain('Syne');
  expect(h2Family).not.toContain('Syne');

  // `/` keeps the legacy Syne heading font untouched — this fix is scoped to
  // `[data-route="redesign"]`, which `/blog` now opts into as of #60 (see
  // e2e/blog.spec.ts for its "does get data-route" coverage).
  await page.goto('/');
  const dataRoute = await page.evaluate(() => document.documentElement.getAttribute('data-route'));
  expect(dataRoute).toBeNull();
});

test('skip-to-content link is the first focusable element and targets #content (#19)', async ({ page }) => {
  await page.goto('/redesign');
  await page.locator('a[href="#content"]').waitFor();

  // Explicitly establish a known focus baseline (`<body>`) before pressing
  // Tab, rather than relying on the browser's implicit post-load focus
  // state — under heavy parallel-worker CPU contention a Tab press sent
  // right after `goto` can otherwise race the browser's own focus-context
  // setup (the same class of synthetic-input timing issue already
  // documented on the spotlight-cursor test above).
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press('Tab');

  const active = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    href: document.activeElement?.getAttribute('href'),
    text: document.activeElement?.textContent,
  }));
  expect(active.tag).toBe('A');
  expect(active.href).toBe('#content');
  expect(active.text).toContain('Skip to Content');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#content$/);
});

test('contact form text inputs render rounded corners and the intended border color, not the legacy square/grey plugins.css style (#19)', async ({ page }) => {
  await page.goto('/redesign');
  const nameInput = page.locator('#contact_name');
  const messageTextarea = page.locator('#contact_message');

  const inputRadius = await nameInput.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  const textareaRadius = await messageTextarea.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  // The legacy `input[type="text"]` rule in `public/css/plugins.css` doesn't
  // match `<textarea>`, so the textarea's rounded-md corners are a reliable
  // "what it should look like" reference to compare the input against.
  expect(inputRadius).toBe(textareaRadius);

  const inputBorderColor = await nameInput.evaluate((el) => getComputedStyle(el).borderTopColor);
  expect(inputBorderColor).toBe('rgb(226, 232, 240)'); // slate-200, not the legacy #eee
});
