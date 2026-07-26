# Frontend testing conventions

> Established by #27 (Playwright toolchain setup). See `BROWSER_INTERACTIONS.md` (same
> directory) for the browser-tooling half of this doc — which tool to reach for and why.

## Playwright: one smoke spec per route/section

Every route that renders real content (not a placeholder stub) gets a spec in the root
`e2e/` directory asserting:

1. **It renders the expected content** — a title, heading, or other landmark.
2. **Zero console errors** — collect `page.on('console', ...)` (`type() === 'error'`) and
   `page.on('pageerror', ...)` into an array and assert it's empty.

Reference: `e2e/smoke.spec.ts`.

### Where these live

Root `e2e/<route-or-section-name>.spec.ts`, config at root `playwright.config.ts`. Run a
specific spec with an **explicit path**:

```bash
npx playwright test e2e/smoke.spec.ts
```

Never invoke `npx playwright test` in a way that scans beyond `testDir` if this project
ever grows non-Playwright `*.test.ts`/`*.spec.ts` files (e.g. a future unit-test
framework, tracked in #26) — scope to `e2e` or a specific file.

### Route audit

| Route | Spec | Notes |
|---|---|---|
| `/` | `e2e/smoke.spec.ts` | Added by #27. Pre-real-route toolchain check — asserts the title and zero console errors on the current live homepage. Not tied to the redesign; exists to prove the Playwright setup itself works. |
| `/redesign` | — | Not yet covered. Add a spec here once a redesign task (#8 onward) lands real content on this route — the placeholder shell from #7 is the first candidate. |
| `/blog`, `/blog/[slug]` | — | Not yet covered. |
| `/admin/*` | — | Not yet covered. Authenticated — will need a login helper (`e2e/helpers.ts`) using `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `.env.local` once added; log in through the UI, don't `page.goto()` straight to an authenticated route (a hard reload behaves like it does for any client-side session state). |

Add a row here every time a new spec lands — this table is the source of truth for what
currently has coverage, not the `e2e/` directory listing alone.

## CI status

`.github/workflows/e2e.yml` runs this suite on every PR that touches frontend paths
(`pages/**`, `components/**`, `lib/**`, `styles/**`, `e2e/**`, `playwright.config.ts`,
`package.json`/`package-lock.json`). Unlike some other projects on this machine, this was
wired up from the start rather than deferred — keep it that way as new specs land.

## Unit tests (Jest/RTL) — not yet installed

Tracked separately in #26, deferred until after the redesign lands and stabilizes (no
existing suite to "mute" mid-redesign against markup about to be replaced). This doc will
gain a "Vitest/Jest + RTL" section once that ticket is picked up.
