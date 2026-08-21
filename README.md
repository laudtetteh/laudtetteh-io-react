# Laud Tetteh IO - Full Stack Monorepo

Production portfolio/blog for https://laudtetteh.io, with:

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python 3.11+)
- **Dev Workflow:** Docker, ESLint (frontend), Ruff (backend), Playwright (e2e), GitHub Actions
- **Production:** OVH VPS, Docker Compose, Caddy TLS via Cloudflare DNS-01

---

## 🚀 Quick Start (Local Development)

### 1. **Clone & Install**

```sh
git clone <repo-url>
cd laudtetteh-io-react
npm install
```

### 2. **Python Virtual Environment (Backend)**

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
# For type checking:
pip install mypy types-requests types-bleach
```

### 3. **Run Everything (Dev Mode)**

Preferred local workflow is Docker Compose, which matches the repo's port mapping:

```sh
docker compose up
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8004
- Backend health: http://localhost:8004/healthz

Frontend-only work can run with `npm run dev`. Backend-only host runs should mirror
the container working directory:

```sh
cd backend/app
uvicorn main:app --reload --host 0.0.0.0 --port 8004
```

---

## 🐳 **Dockerized Workflow**

Build and run both frontend and backend with Docker Compose:

```sh
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8004/docs](http://localhost:8004/docs)
- Backend health: [http://localhost:8004/healthz](http://localhost:8004/healthz)

---

## 🧹 **Linting**

- Frontend (ESLint): `npm run lint`
- Backend (Ruff): `ruff check backend/app` (`pip install ruff`, or use the Docker image)
- **CI** (`.github/workflows/lint.yml`) enforces both on every push, every branch. Run them locally before committing anything either covers.

---

## ⚙️ **Environment Variables**

- `.env.local` is the dev env file (gitignored, no `.env.example` — use `.env.local` as the template).
- `.env` provides local Docker Compose interpolation for build-time frontend API args.
- OVH production keeps its real `.env` on the VPS; `.github/workflows/deploy-ovh.yml` rsyncs code only and does not write production secrets.
- `.env.production` is legacy/staging-era local material. Do not treat it as the OVH production source of truth.

---

## 🛠️ **Project Structure**

```
laudtetteh-io-react/
├── backend/
│   ├── app/           # FastAPI app code
│   ├── requirements.txt
│   └── Dockerfile
├── caddy/             # Production Caddy image/config for OVH
├── components/        # React components
├── e2e/               # Playwright specs
├── pages/             # Next.js pages
├── styles/            # Tailwind & custom CSS
├── public/
├── docker-compose.prod.yml
├── .venv/             # Python virtualenv (gitignored)
├── docker-compose.yml
├── Dockerfile         # Frontend Dockerfile
├── package.json
└── ...
```

---

## 🧪 **Testing**

### End-to-End (E2E) — real, wired up

- [Playwright](https://playwright.dev/) is installed and configured (`playwright.config.ts`, specs in `e2e/`).
- Run: `npm run test:e2e` (or `npx playwright test e2e/<file>.spec.ts` for one spec).
- CI-enforced on every push touching frontend paths (`.github/workflows/e2e.yml`).

### Unit/Integration — not yet installed

No Jest/RTL (frontend) or pytest (backend) suite exists yet. Tracked as #26; the redesign has shipped, so this is no longer blocked by cutover.

---

## 🚀 **Deployment Details**

- **Production deploys** are handled by `.github/workflows/deploy-ovh.yml`, Docker Compose, and Caddy on the OVH VPS.
- **Production deploys are manual** (`workflow_dispatch`) and target `laudtetteh.io`, `www.laudtetteh.io`, and `api.laudtetteh.io`.
- **DigitalOcean is staging-only** for `dev.laudtetteh.io` / `api.dev.laudtetteh.io` until #85 decides whether to migrate or retire it. `.github/workflows/deploy.yml` still points there and should not be mistaken for production.
- **Secrets** (env vars, SSH keys) are managed via GitHub Secrets.
- **Production stack:**
  - `docker-compose.prod.yml` builds `web`, `api`, and `caddy`.
  - Caddy terminates TLS and reverse-proxies apex/`www` to `web:3000` and `api.laudtetteh.io` to `api:8000`.
  - `API_SERVER` and `NEXT_PUBLIC_API_BROWSER` are build-time args. In production builds they must be public HTTPS URLs, not Docker-internal `http://api:8000`.
- **Manual deploy:**
  - Dispatch the workflow:
    ```sh
    gh workflow run deploy-ovh.yml --ref main
    ```
  - Or SSH to the OVH VPS and run:
    ```sh
    docker compose -f docker-compose.prod.yml build --no-cache web
    docker compose -f docker-compose.prod.yml up -d
    ```

---

## 🧩 **Other Useful Tips**

- **Database:**
  - The backend expects a MongoDB instance (local or cloud). Configure via env vars.
- **Static files:**
  - Place images and other assets in `/public` for the frontend.
- **API Docs:**
  - FastAPI auto-generates docs at `/docs` (Swagger UI).
- **Pre-commit hooks:**
  - A gitleaks secret-scan runs automatically on every commit (`git/hooks`, no setup needed).
- **Updating dependencies:**
  - JS: `npm update` or `npm install <pkg>@latest`
  - Python: `pip install -U <package>`
- **Debugging:**
  - Use browser dev tools, VSCode Python/JS debuggers, and FastAPI's `/docs` for API testing.

---

## 🏗️ **CI/CD (GitHub Actions)**

- `lint.yml` — ESLint + Ruff, on every push, every branch.
- `e2e.yml` — Playwright, on every push touching frontend paths.
- `deploy-ovh.yml` — manual production deploy to OVH.
- `deploy.yml` — legacy/staging deploy to the DigitalOcean droplet on push to `main`; do not treat it as production.

---

## 🤝 **Contributing & Best Practices**

- Always activate your Python virtualenv: `source .venv/bin/activate`
- Run `npm run lint` and `ruff check backend/app` before pushing code.
- Keep `requirements.txt` up to date deliberately; do not overwrite it with a full local `pip freeze`.
- Never commit `.venv/` or other environment-specific files.

---

## 📚 **Resources**

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Ruff](https://docs.astral.sh/ruff/), [Black](https://black.readthedocs.io/en/stable/), [mypy](https://mypy-lang.org/)

---
