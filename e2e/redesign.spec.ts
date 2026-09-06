import { test, expect } from '@playwright/test';

const LEGACY_ASSET_PATH = /^\/(?:css|js|img)\//;

function normalizeFontFamily(value: string): string {
  return value.replace(/["']/g, '').trim();
}

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

  await page.goto('/');

  await expect(page).toHaveTitle(/Laud Tetteh/);
  expect(consoleErrors).toEqual([]);
});

test('redesign routes do not request deleted legacy template assets', async ({ page }) => {
  const legacyRequests: string[] = [];

  page.on('request', request => {
    const url = new URL(request.url());
    if (LEGACY_ASSET_PATH.test(url.pathname)) {
      legacyRequests.push(url.pathname);
    }
  });

  for (const route of ['/', '/blog', '/blog/does-not-exist-e2e']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => {
      // The dev server can keep HMR/network bookkeeping alive; the request
      // listener above still captures the legacy asset regression signal.
    });
  }

  expect(legacyRequests).toEqual([]);
});

test('about section renders real bio content in initial HTML', async ({ page }) => {
  await page.goto('/');
  const about = page.locator('#about');
  await expect(about).toContainText('Laud Tetteh');
  await expect(about).toContainText('Download CV');
  // One stable bio assertion so this test still verifies copy, not just
  // structure. "12 years" is a dossier-fixed value (§4.3), not styling.
  await expect(about).toContainText('12 years');
  // Assert the Skills block is present structurally rather than pinning a
  // category name — category labels are content and change with the copy.
  await expect(about.getByRole('heading', { name: 'Skills' })).toBeVisible();
});

test('experience section renders real work history in initial HTML', async ({ page }) => {
  await page.goto('/');
  const experience = page.locator('#experience');
  await expect(experience).toContainText('Salesforce');
  await expect(experience).toContainText('Brittani Dinsmore');
});

test('projects section renders real case-study cards in initial HTML', async ({ page }) => {
  await page.goto('/');
  const projects = page.locator('#projects');
  await expect(projects).toContainText('MethodistCRM');
  // Projects is a text-forward list by design (#101) — no thumbnails. The
  // Pricing Calculator is the lead entry and the only publicly clickable one.
  await expect(
    projects.locator('a[href="https://www.tableau.com/product-and-pricing-selector"]')
  ).toBeVisible();
});

// The two Sandbox tests that lived here were removed in #101 along with the
// section itself — it rendered eight repos last pushed in 2021, which argued
// against the site rather than for it. `SandboxSection.tsx` and `lib/github.ts`
// are untouched; #108 restores the section and these tests together.

test('writing section renders real blog teaser cards in initial HTML', async ({ page }) => {
  await page.goto('/');
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
    await expect(writing).toContainText('Nothing published here yet.');
    await expect(writing.getByRole('link', { name: 'Open the blog' })).toBeVisible();
  }
});

test('writing fallback image asset is available after legacy image cleanup', async ({ page }) => {
  const response = await page.goto('/images/writing/headless.jpeg');
  expect(response?.ok()).toBe(true);
  expect(response?.headers()['content-type']).toContain('image/');
});

test('contact section renders the real form shell in initial HTML', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('#contact');
  await expect(contact.locator('#contact_name')).toBeVisible();
  await expect(contact.locator('#contact_email')).toBeVisible();
  await expect(contact.locator('#contact_message')).toBeVisible();
  await expect(contact.locator('#send_message')).toBeVisible();
});

test('contact form honeypot field is present but hidden from real users', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('#contact');
  const honeypot = contact.locator('input[name="website"]');
  await expect(honeypot).toHaveAttribute('aria-hidden', 'true');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  await expect(honeypot).toHaveValue('');
});

test('footer renders real copyright and contact links in initial HTML', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('#footer');
  await expect(footer).toContainText(`Copyright © ${new Date().getFullYear()} by Laud Tetteh`);
  await expect(footer.locator('a[href="mailto:hello@laudtetteh.io"]')).toBeVisible();
  await expect(footer.locator('a[href="https://github.com/laudtetteh"]')).toBeVisible();
  await expect(footer.locator('a[href="https://www.linkedin.com/in/laudtetteh"]')).toBeVisible();
});

test('header renders name/role/nav/social in initial HTML', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('#header');
  await expect(header).toContainText('Laud Tetteh');
  // DOSSIER §3.2/§3.3: the public title is exact, and "Senior" must never
  // appear. Scope the negative assertion to the whole page, not #header — the
  // regression it guards ("Senior Dev." twice) lived in #experience, so a
  // header-scoped check would be vacuous.
  // The hero role line is a trade descriptor (#117 item 8), deliberately not the
  // employer job title. The exact Salesforce title `Software Engineer (MTS)` still
  // appears on the Experience entry, which is what a reference check verifies.
  await expect(header).toContainText('Full Stack Software Engineer');
  await expect(page.locator('body')).not.toContainText('Senior');
  await expect(header.locator('a[href="#about"]')).toBeVisible();
  await expect(header.locator('a[href="https://github.com/laudtetteh"]')).toBeVisible();
  await expect(header.locator('a[href="https://www.linkedin.com/in/laudtetteh"]')).toBeVisible();
});

test('header tagline rotates over time', async ({ page }) => {
  await page.goto('/');
  const tagline = page.locator('#header p[aria-live="polite"]');
  const first = await tagline.textContent();
  // Interval is 4000ms + a 200ms fade before the swap; pad generously so
  // CI hydration/render jitter doesn't make this flaky.
  await page.waitForTimeout(5500);
  const second = await tagline.textContent();
  expect(second).not.toBe(first);
});

test('header scroll-spy marks the active nav link', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('/');
  const html = page.locator('html');
  const initiallyDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  await page.locator('#header button[aria-label*="Switch to"]:visible').first().click();
  const afterDark = (await html.getAttribute('class'))?.includes('dark') ?? false;
  expect(afterDark).not.toBe(initiallyDark);
});

test('header stacks within viewport width on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');

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
  await page.goto('/');
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
  await page.goto('/');
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
  await page.goto('/');
  const mobileTitle = page.locator('#about div[aria-hidden="true"]').first();
  await expect(mobileTitle).toBeVisible();
  await expect(mobileTitle).toContainText('About');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(mobileTitle).toBeHidden();
});

test('active nav indicator uses the neutral palette, not the teal accent (#48)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('#about').evaluate((el) => {
    (el as HTMLElement).style.minHeight = '150vh';
  });
  const aboutLink = page.locator('#header a[href="#about"]');
  await expect(aboutLink).toHaveClass(/active/);
  const className = (await aboutLink.getAttribute('class')) ?? '';
  expect(className).not.toContain('teal');
  expect(className).toContain('slate');
});

test('homepage opts into the redesign shell after the #17 cutover', async ({ page }) => {
  // Inverted as of #17: `/` used to be the last legacy route and asserted the
  // ABSENCE of the redesign shell. The cutover made `/` render RedesignLayout,
  // so the meaningful invariant is now the opposite — `/` must opt in, exactly
  // like `/redesign` did and like `/blog` does (#60, see e2e/blog.spec.ts).
  await page.goto('/');
  const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  const hasSpotlight = await page.evaluate(
    () => !!document.querySelector('div.pointer-events-none.fixed.inset-0.z-30')
  );
  expect(scrollBehavior).toBe('smooth');
  expect(hasSpotlight).toBe(true);
});

test('headings use the Inter font (#19)', async ({ page }) => {
  // Reads `/` directly as of #17 — the redesign now lives there, and
  // `/redesign` is only a redirect to it (see pages/redesign.tsx).
  await page.goto('/');
  const fontState = await page.locator('.font-inter').first().evaluate((el) => {
    const interVariable = getComputedStyle(el).getPropertyValue('--font-inter').trim();
    return {
      interVariable,
      h1Family: getComputedStyle(document.querySelector('#header h1')!).fontFamily,
      h2Family: getComputedStyle(document.querySelector('#about h2')!).fontFamily,
    };
  });
  const expectedInterFamily = normalizeFontFamily(fontState.interVariable.split(',')[0]);
  expect(expectedInterFamily.toLowerCase()).toContain('inter');
  expect(normalizeFontFamily(fontState.h1Family)).toContain(expectedInterFamily);
  expect(normalizeFontFamily(fontState.h2Family)).toContain(expectedInterFamily);

  // The Inter fix is scoped to `[data-route="redesign"]`, so `/` must carry
  // that marker post-cutover (it previously asserted the opposite, back when
  // `/` was still the legacy theme).
  const dataRoute = await page.evaluate(() => document.documentElement.getAttribute('data-route'));
  expect(dataRoute).toBe('redesign');
});

test('skip-to-content link is the first focusable element and targets #content (#19)', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[href="#content"]').waitFor({ state: 'attached' });

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

test('contact form text inputs render rounded corners and the intended border color (#19)', async ({ page }) => {
  await page.goto('/');
  const nameInput = page.locator('#contact_name');
  const messageTextarea = page.locator('#contact_message');

  const inputRadius = await nameInput.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  const textareaRadius = await messageTextarea.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  // The textarea's rounded-md corners are a reliable "what it should look
  // like" reference to compare the input against.
  expect(inputRadius).toBe(textareaRadius);

  const inputBorderColor = await nameInput.evaluate((el) => getComputedStyle(el).borderTopColor);
  // Original #19 intent: not the legacy hardcoded #eee.
  expect(inputBorderColor).not.toBe('rgb(238, 238, 238)');

  // #110: assert the requirement rather than a specific token. WCAG SC 1.4.11
  // needs 3:1 for the visual boundary of a UI control, and this border is the
  // field's only boundary. Pinning a hex here is what made this test break on
  // an intentional a11y fix — slate-200 measured 1.18:1, slate-400 2.56:1, and
  // slate-500 is the first value that clears the bar.
  const borderContrast = await nameInput.evaluate((el) => {
    const parse = (s: string) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const border = parse(getComputedStyle(el).borderTopColor);
    // Walk up for the first opaque background behind the field.
    let node: HTMLElement | null = el as HTMLElement;
    let bg = [255, 255, 255];
    while (node) {
      const c = getComputedStyle(node).backgroundColor;
      const alpha = c.startsWith('rgba') ? Number(c.split(',')[3]) : 1;
      if (alpha > 0.5) {
        bg = parse(c);
        break;
      }
      node = node.parentElement;
    }
    const [l1, l2] = [lum(border), lum(bg)];
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  });
  expect(borderContrast).toBeGreaterThanOrEqual(3);
});

test('/redesign redirects to the homepage after the #17 cutover', async ({ page }) => {
  // `/redesign` was the side-by-side preview route while the redesign was
  // built; #17 moved the same layout to `/` and reduced this to a redirect,
  // kept so old links/bookmarks still land on working content. Every other
  // test in this file now navigates to `/` directly rather than relying on
  // this hop — so when the redirect is finally deleted (#20 legacy cleanup),
  // only this one test should fail, not the whole suite.
  const res = await page.goto('/redesign');
  expect(res?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe('/');
});

/**
 * Progressive disclosure on Experience clusters and grouped Projects (#116).
 *
 * The DOM-retention assertion is the load-bearing one. The whole point of
 * collapsing rather than truncating is that recruiters and crawlers still get
 * the full text; if someone later "optimises" this into a conditional render,
 * that is a silent SEO and accessibility regression and this test is what
 * catches it.
 */
test.describe('progressive disclosure (#116)', () => {
  test('clusters are collapsed by default and expand on click', async ({ page }) => {
    await page.goto('/');

    const triggers = page.locator('button[aria-expanded]');
    expect(await triggers.count()).toBeGreaterThan(0);
    expect(await page.locator('button[aria-expanded="true"]').count()).toBe(0);

    const first = triggers.first();
    const panelId = await first.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();

    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();

    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('disclosure is keyboard operable', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('button[aria-expanded]').first();

    await first.focus();
    await expect(first).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('collapsed content is still present in the server-rendered HTML', async ({ request }) => {
    const html = await (await request.get('/')).text();

    // Buried inside collapsed Experience clusters.
    expect(html).toContain('branch-scoped dependency cache keys');
    // Buried inside a collapsed project card.
    expect(html).toContain('provider-agnostic abstraction layer');
  });

  test('the arc narrative survives the collapsed state', async ({ page }) => {
    await page.goto('/');

    // The three arc projects only read as one story if the connective phrases
    // are in the synopsis rather than hidden in the expanded body. Each phrase
    // matches twice — the synopsis and the body paragraph it compresses — so
    // this asserts on the synopsis, which comes first in DOM order.
    await expect(page.getByText('So I generalized the fix').first()).toBeVisible();
    await expect(page.getByText('And then I used it').first()).toBeVisible();
  });

  test('project expand controls have distinct accessible names', async ({ page }) => {
    await page.goto('/');

    const readMore = page.getByRole('button', { name: /Read more about/i });
    await expect(readMore.first()).toBeVisible();

    // Collected in a single evaluation rather than looping `nth(i)`: the loop
    // form races a re-render, `getAttribute` returns null for an index that
    // moved, and two nulls collapse into one Set entry — which failed
    // intermittently only inside full-suite runs.
    const names = await readMore.evaluateAll(nodes =>
      nodes.map(n => n.getAttribute('aria-label') ?? '')
    );

    expect(names.length).toBeGreaterThan(1);
    expect(names.every(Boolean)).toBe(true);
    // Repeated identical "Read more" names are a known screen-reader failure.
    expect(new Set(names).size).toBe(names.length);
  });
});

/**
 * Shared site identity across every route (#117 item 9).
 *
 * The homepage and the blog shells previously rendered two different identity
 * blocks and drifted: the blog sidebar showed a bare "Software Engineer" with
 * no tagline while the homepage had changed twice. They now share
 * `SiteIdentity`, and these assertions are what keeps them from splitting again.
 */
test.describe('shared site identity (#117)', () => {
  // `/blog/[slug]` is deliberately absent: CI has no live backend, so no post
  // slug is guaranteed to exist there. `blog.spec.ts` established the house
  // pattern for this — discover the route, then `test.skip` when the data
  // isn't there. The detail-page case is covered separately below.
  const ROUTES = ['/', '/blog'];

  async function expectIdentity(page: import('@playwright/test').Page) {
    await expect(page.getByText('Full Stack Software Engineer').first()).toBeVisible();

    const tagline = page.locator('p[aria-live="polite"]').first();
    await expect(tagline).toBeVisible();
    await expect(tagline).not.toBeEmpty();

    // The employer job title belongs on the Experience entry, never the role
    // line — and "Senior" is barred on every surface (DOSSIER §3.2).
    await expect(page.locator('body')).not.toContainText('Senior');
  }

  for (const route of ROUTES) {
    test(`role line and rotating tagline render on ${route}`, async ({ page }) => {
      await page.goto(route);
      await expectIdentity(page);
    });
  }

  test('role line and rotating tagline render on a post detail page', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href^="/blog/"]').first();
    const count = await firstPost.count();
    test.skip(count === 0, 'no posts available without a live backend');

    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expectIdentity(page);
  });

  test('every route still has exactly one h1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      expect(await page.locator('h1').count(), `h1 count on ${route}`).toBe(1);
    }
  });
});
