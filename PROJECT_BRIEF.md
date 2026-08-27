# Project Brief: laudtetteh.io

> This file documents the intent, scope, and constraints of the project.
> It is read by Claude Code at the start of tasks to understand context.
> Keep it current — update when scope or stack decisions change.

---

## What is this?

**One-liner:** Laud Tetteh's personal portfolio and blog — a public-facing site that communicates professional identity, showcases work, and shares technical writing.

**Problem statement:** Laud needed a professional online presence that accurately reflects his scope and level (Software Engineer (MTS) at Salesforce) and serves as the landing page for recruiters, hiring managers, and the broader tech community. Off-the-shelf portfolio platforms don't allow the level of control or custom functionality required.

> ⚠️ **Public title:** `Software Engineer (MTS)`. Never write "Senior", "Lead", "Staff", or
> "Principal" in reference to the Salesforce role on any public surface. Binding rule from
> `$RIG_DIR/docs/career/DOSSIER.md` §3.

**Solution:** A custom full-stack portfolio site with a self-hosted blog CMS, GitHub project showcase, contact form, and a private admin panel for content management. Everything is owned and deployed by Laud, with no third-party CMS dependency.

---

## Who is it for?

**Primary user (admin):** Laud Tetteh — sole author and administrator. Creates and publishes blog posts, manages media, controls all content via the admin panel.

**Audience (public readers):**
- Recruiters and hiring managers evaluating Laud's background
- Engineers and tech professionals reading the blog
- Professional contacts who've received the URL

**Scale:** Single admin. Public read-only for everything except the admin panel. No public accounts, no user-generated content.

---

## Features (shipped)

These are live in the codebase and functional unless noted:

- [x] Portfolio homepage — bio, skills, work history, education, testimonials, GitHub project showcase
- [x] Blog — list view, individual post view, category filtering, featured images via AWS S3, ISR
- [x] Blog admin — create, edit, publish/draft, delete posts
- [x] Blog admin drag-and-drop ordering — dashboard cards can be reordered by drag handle and persisted through `/api/admin/update-weights`
- [x] Media manager — upload images to S3, view and delete uploaded files
- [x] Contact form — Resend email delivery to hello@laudtetteh.io, with backend validation/rate limiting
- [ ] Contact form abuse protection beyond rate limiting — client-side captcha/Turnstile is not shipped
- [x] JWT auth — single admin login; token stored in localStorage; protected admin routes
- [x] Tiptap rich text editor — client-side WYSIWYG for blog post body
- [x] CV download — `/docs/cv/Laud-Tetteh-Resume-2026.pdf` linked from the About section and from Experience. Phone-free variant of the 2026 résumé; the 2024 `Laud-Tetteh-Resume.pdf` is retired and no longer linked

---

## Out of scope (permanent)

These will not be built:

- Public comments or community features
- Newsletter or email subscriptions
- Multi-user CMS or team access
- E-commerce or paid content
- Analytics beyond server logs and UptimeRobot

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Backend | FastAPI / Python 3.11 | Internal port 8000; host port 8004 in dev |
| Frontend | Next.js 15 / React 18 / TypeScript / Tailwind CSS | Pages router (not app router); port 3000 |
| Database | MongoDB Atlas (M0 free tier) | Async via `motor`; no migrations |
| Storage | AWS S3 (`laudtetteh-io` bucket, `us-east-2`) | Blog images and media uploads |
| Email | Resend | Contact form; sends from/to hello@laudtetteh.io |
| Auth | JWT — `python-jose` | Single admin; token in localStorage |
| Rich text | Tiptap | Client-side only; sanitized with `bleach` before DB write |
| Infra | Docker + Docker Compose | `docker-compose.override.yml` for dev hot reload |
| CI/CD | GitHub Actions → OVH VPS (SSH + rsync) | Production deploy is manual via `.github/workflows/deploy-ovh.yml`. `deploy.yml` is a retired tombstone after PR #100 — it deploys nothing; #85 still owns droplet/DNS/secrets removal |
| Linting | ESLint (frontend) + ruff (backend), wired up (#30) | `npm run lint`, `ruff check backend/app`. Required locally before committing anything either covers; CI-enforced on every push (`.github/workflows/lint.yml`). #31 is closed — no rules are downgraded; ESLint runs stock `next/core-web-vitals` + `next/typescript` and ruff ignores only `B008` (a permanent FastAPI-idiom exclusion). A handful of ESLint *warnings* remain (admin-panel `<img>` usage and `react-hooks/exhaustive-deps`); **zero errors** — don't read those warnings as a regression you introduced |
| Testing — e2e | Playwright, wired up (#27) | `npm run test:e2e`, CI-enforced on every push touching frontend paths. Run locally for changes e2e would actually catch (new/changed routes or components), not every edit |
| Testing — unit/integration | Vitest + RTL (frontend), pytest (backend), wired up (#26/#97) | `npm run test`, and `pytest` from `backend/`. A **foundation suite, not full coverage** — add specs alongside new logic. **Not CI-enforced;** run locally |

---

## Constraints

**Timeline:** Production launched on OVH on 2026-08-18. Current work is post-launch hardening, content cleanup, and staging/rollback decommission planning.

**Budget:** Free tier where possible. MongoDB Atlas M0, AWS S3 pay-per-use, GitHub Actions free tier, OVH VPS for production. The DigitalOcean droplet no longer serves anything (`dev.*` returns 502) but is still billing until #85 removes it; Opalstack likewise under #84.

**Must integrate with:**
- MongoDB Atlas (cloud-hosted)
- AWS S3 (media storage)
- Resend (transactional email)
- GitHub API (public repos for project showcase, fetched at build time)

**Must NOT use:**
- Port 8000 on the Docker host — permanently held by `laudbot-backend-1` on this machine
- `NEXT_PUBLIC_API_URL` — that var doesn't exist; use `NEXT_PUBLIC_API_BROWSER` for browser-side API calls

**Existing code:** Full working codebase at `/Users/beaconavenue/code/laudtetteh-io-react`. Production is live at `https://laudtetteh.io`; branch new work from `main`.

---

## Success criteria (launch)

- [x] Contact form delivers submissions to hello@laudtetteh.io in production
- [x] Blog posts render correctly with featured images
- [x] Admin can create, edit, publish, and delete posts via the admin panel
- [x] Site loads on HTTPS at https://laudtetteh.io with valid TLS cert
- [x] Site restarts automatically through the production Docker Compose stack
- [x] `/healthz` returns `{"status": "ok"}` on `https://api.laudtetteh.io`
- [x] No draft posts visible on public routes
- [x] Production secrets are provisioned on the OVH VPS, not generated from the old DigitalOcean `ENV_PRODUCTION` workflow

---

## Open questions

- [x] API routing in production: subdomain (`api.laudtetteh.io`) via Caddy.
- [x] OVH VPS has enough memory for the production build.
- [ ] Resend domain verification: is `laudtetteh.io` verified in the Resend dashboard for sending?
- [ ] MongoDB Atlas IP allowlist: confirm the OVH VPS IP remains allowed.
- [ ] `react-quill` in `package.json` — is this a dead dependency (Tiptap is the actual editor)?
- [x] Decide whether to migrate or retire `dev.laudtetteh.io` — **retired.** PR #100 tombstoned the workflow; droplet/DNS/secrets/billing removal remains open in #85.
- [ ] Retire Opalstack only after the OVH rollback window is no longer needed (#84).
