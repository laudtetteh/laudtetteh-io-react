# Project Brief: laudtetteh.io

> This file documents the intent, scope, and constraints of the project.
> It is read by Claude Code at the start of tasks to understand context.
> Keep it current — update when scope or stack decisions change.

---

## What is this?

**One-liner:** Laud Tetteh's personal portfolio and blog — a public-facing site that communicates professional identity, showcases work, and shares technical writing.

**Problem statement:** Laud needed a professional online presence that accurately reflects his seniority (Senior Software Engineer at Salesforce) and serves as the landing page for recruiters, hiring managers, and the broader tech community. Off-the-shelf portfolio platforms don't allow the level of control or custom functionality required.

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

These are live in the codebase and functional (or nearly so):

- [x] Portfolio homepage — bio, skills, work history, education, testimonials, GitHub project showcase
- [x] Blog — list view, individual post view, category filtering, featured images via AWS S3, ISR
- [x] Blog admin — create, edit, publish/draft, delete posts; drag-and-drop weight ordering
- [x] Media manager — upload images to S3, view and delete uploaded files
- [x] Contact form — client-side captcha, Resend email delivery to hello@laudtetteh.io
- [x] JWT auth — single admin login; token stored in localStorage; protected admin routes
- [x] Tiptap rich text editor — client-side WYSIWYG for blog post body
- [x] CV download — `/docs/cv/Laud-Tetteh-Resume.pdf` linked from the About section

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
| CI/CD | GitHub Actions → DigitalOcean droplet (SSH + SCP) | Deploys on push to `main` |
| Testing | Playwright e2e wired up (#27) | `npm run test:e2e`, CI-enforced on PRs touching frontend paths. Jest/RTL and pytest still aspirational — not yet wired up (tracked in #26) |

---

## Constraints

**Timeline:** No hard deadline. Launch when quality bar is met.

**Budget:** Free tier where possible. MongoDB Atlas M0, AWS S3 pay-per-use, GitHub Actions free tier, DigitalOcean droplet ($12/mo for 2GB RAM minimum).

**Must integrate with:**
- MongoDB Atlas (cloud-hosted)
- AWS S3 (media storage)
- Resend (transactional email)
- GitHub API (public repos for project showcase, fetched at build time)

**Must NOT use:**
- Port 8000 on the Docker host — permanently held by `laudbot-backend-1` on this machine
- `NEXT_PUBLIC_API_URL` — that var doesn't exist; use `NEXT_PUBLIC_API_BROWSER` for browser-side API calls

**Existing code:** Full working codebase at `/Users/beaconavenue/code/laudtetteh-io-react`. Never launched. Pre-launch hardening in progress.

---

## Success criteria (launch)

- [ ] Contact form delivers submissions to hello@laudtetteh.io in production
- [ ] Blog posts render correctly with featured images
- [ ] Admin can create, edit, publish, and delete posts via the admin panel
- [ ] Site loads on HTTPS at https://laudtetteh.io with valid TLS cert
- [ ] Site restarts automatically after a droplet reboot
- [ ] `/api/healthz` returns `{"status": "ok", "db": "ok"}` in production
- [ ] No draft posts visible on public routes
- [ ] All secrets are post-rotation values (not the ones from the June 2026 session)

---

## Open questions

- [ ] API routing in production: subdomain (`api.laudtetteh.io`) or path prefix (`laudtetteh.io/api`)? Affects `NEXT_PUBLIC_API_BROWSER` and Caddy config.
- [ ] Droplet size: confirm ≥2GB RAM before first deploy attempt (Next.js build OOMs on 1GB).
- [ ] Resend domain verification: is `laudtetteh.io` verified in the Resend dashboard for sending?
- [ ] MongoDB Atlas IP allowlist: does the DigitalOcean droplet's public IP need to be added?
- [ ] `react-quill` in `package.json` — is this a dead dependency (Tiptap is the actual editor)?
