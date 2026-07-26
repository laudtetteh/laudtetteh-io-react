# Browser Interactions — how agents test/validate laudtetteh-io-react locally

> Written 2026-07-26 (#27). This is the doc `rules/verification.md` points to whenever a
> request means "run it in a real browser" — not just a diff read or a `curl`. Read it
> before reaching for any browser tool.

---

## The three tools, and when each applies

There are **three** distinct ways to put a real browser in front of this app. They serve
different purposes — don't reach for the wrong one.

### 1. Playwright MCP server — interactive, agent-driven, ad hoc

**Use for:** exploratory "does this actually work" checks during a session — the default
for a one-off "test/validate this" request against the locally running stack.

- Declared in the repo root `.mcp.json` (committed) — Claude Code connects to it
  automatically at session start. **If `.mcp.json` was just added/changed, restart Claude
  Code (or reconnect MCP servers) before this tool is available** — it is not hot-loaded
  mid-session.
- Runs `npx @playwright/mcp@latest --browser chrome` — a **real Chrome** (not just
  Chromium), driven interactively, one action at a time (navigate, click, screenshot, read
  console).
- **Session state** persists to `.playwright-mcp/auth.json` (gitignored) via
  `--storage-state` — log in once (e.g. the admin panel at `/admin/login`), subsequent
  sessions in the same browser profile stay authenticated.
- **Secrets**, if any local credentials are needed for a flow (e.g. admin login), go in
  `.playwright-mcp/secrets.env` (gitignored — never commit it). Use the same
  `ADMIN_USERNAME`/`ADMIN_PASSWORD` values already configured in `.env.local` for local
  dev — don't invent new ones.
- **Output** (screenshots, page snapshots, console logs) lands in `.playwright-mcp/`
  (gitignored) via `--output-dir`.

### 2. `claude-in-chrome` (the `mcp__claude-in-chrome__*` tools) — the user's real browser

**Use for:** the same ad hoc validation as above, but when you want it to happen in the
**user's actual Chrome window** (their extensions, their logged-in state, visible to them
live) rather than a separate automation-driven instance. Requires the Claude in Chrome
extension installed and connected — call `tabs_context_mcp` first; if it reports the
extension isn't connected, fall back to the Playwright MCP server (#1) instead.

Both #1 and #2 are "regular" actions for this app's own local dev environment — no
destructive/irreversible browser actions are involved in routine local validation.
Standard judgment still applies to anything that submits the contact form, sends email
via Resend, or leaves the local dev stack.

### 3. `@playwright/test` CLI (`e2e/*.spec.ts`) — repeatable, CI-enforced

**Use for:** a **permanent, repeatable** test asserting a route renders + zero console
errors — the kind of check that runs on every PR touching frontend code, not just once
during a session.

- Config: root `playwright.config.ts`. Specs live in root `e2e/`.
- Run a specific spec with an explicit path: `npx playwright test e2e/smoke.spec.ts` (or
  `npm run test:e2e` to run the whole suite from the repo root).
- `webServer` in `playwright.config.ts` boots `npm run dev` (Next.js on port 3000) if it
  isn't already running.
- CI runs this suite on every PR that touches frontend paths — see
  `.github/workflows/e2e.yml`. This is the artifact that actually gates merges, not an
  interactive session check.
- See `testing-conventions.md` (same directory) for the full FE test bar: the
  smoke-per-route convention and which routes currently have coverage.

**Rule of thumb:** interactive validation during a session (#1/#2) proves it works *right
now*, for you. A committed `e2e/*.spec.ts` (#3) proves it keeps working, for everyone,
forever, on every PR.

---

## Local URLs

| Service | URL |
|---|---|
| Frontend (Next.js dev server) | `http://localhost:3000` |
| Backend API (browser-facing) | `http://localhost:8004` |
| Backend API (Docker-internal) | `http://api:8000` |

Confirm against `CLAUDE.md`'s "Common gotchas" before assuming these on a new machine —
the API host port has been remapped once already on this project (8000 → 8004) to avoid a
conflict with an unrelated project.

---

## Quick reference: "please test/validate this locally"

1. Confirm the stack is up: `docker compose ps` (or check `curl -sf http://localhost:3000`
   / `http://localhost:8004/health`) — bring it up with `docker compose up -d` if not.
2. Pick a tool: Playwright MCP (#1) is the default. Use `claude-in-chrome` (#2) only if the
   user wants it visible in their own browser, or Playwright MCP isn't connected this
   session.
3. Drive the actual user flow — navigate, interact, read the console
   (`read_console_messages`/equivalent) for errors. Screenshot on anything ambiguous.
4. Report what actually rendered / what broke — never claim "it works" from a curl/health
   check alone once a real UI exists to look at.
5. If this is a change that should stay verified forever (a new route, a new section),
   that's a nudge to also write or update an `e2e/*.spec.ts` (#3) — interactive validation
   isn't a substitute for the committed regression test that runs in CI.
