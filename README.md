# Laud Tetteh IO - Full Stack Monorepo

A modern, production-ready monorepo with:

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python 3.11+)
- **Dev Workflow:** Docker, ESLint (frontend), Ruff (backend), Playwright (e2e), GitHub Actions CI/CD

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

- **Frontend:**
  ```sh
  npm run dev
  # Open http://localhost:3000
  ```
- **Backend:**
  ```sh
  cd backend
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  # Open http://localhost:8000/docs
  ```

---

## 🐳 **Dockerized Workflow**

Build and run both frontend and backend with Docker Compose:

```sh
docker compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧹 **Linting**

- Frontend (ESLint): `npm run lint`
- Backend (Ruff): `ruff check backend/app` (`pip install ruff`, or use the Docker image)
- **CI** (`.github/workflows/lint.yml`) enforces both on every push, every branch. Run them locally before committing anything either covers.

---

## ⚙️ **Environment Variables**

- `.env.local` is the dev env file (gitignored, no `.env.example` — use `.env.local` as the template).
- Docker/CI/CD uses `.env.production` (see GitHub secrets).

---

## 🛠️ **Project Structure**

```
laudtetteh-io-react/
├── backend/
│   ├── app/           # FastAPI app code
│   ├── requirements.txt
│   └── Dockerfile
├── components/        # React components
├── pages/             # Next.js pages
├── styles/            # Tailwind & custom CSS
├── public/
├── .venv/             # Python virtualenv (gitignored)
├── docker-compose.yml
├── Dockerfile         # Frontend Dockerfile
├── package.json
└── ...
```

---

## 🧪 **Testing**

### End-to-End (E2E) — real, wired up on `redesign/site-refresh` only

- [Playwright](https://playwright.dev/) is installed and configured (`playwright.config.ts`, specs in `e2e/`) — currently only on the `redesign/site-refresh` branch, not yet backported to `main`.
- Run: `npm run test:e2e` (or `npx playwright test e2e/<file>.spec.ts` for one spec) — requires being on a branch with `playwright.config.ts` present.
- CI-enforced on every push touching frontend paths (`.github/workflows/e2e.yml`) on `redesign/site-refresh`. `main` doesn't run this yet.

### Unit/Integration — not yet installed

No Jest/RTL (frontend) or pytest (backend) suite exists yet. Tracked as a deliberate follow-up, deferred until the in-progress frontend redesign lands and stabilizes.

---

## 🚀 **Deployment Details**

- **Production deploys** are handled by GitHub Actions and Docker Compose.
- **DigitalOcean** is used as the deployment target (see `.github/workflows/deploy.yml`).
- **Secrets** (env vars, SSH keys) are managed via GitHub Secrets.
- **Zero-downtime deploy:**
  - CI/CD brings up new containers, then swaps them in place.
- **Manual deploy:**
  - SSH into your server and run:
    ```sh
    docker compose -f docker-compose.yml pull
    docker compose -f docker-compose.yml up -d --build
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
- `e2e.yml` — Playwright, on every push touching frontend paths — `redesign/site-refresh` only for now, not yet on `main`.
- `deploy.yml` — deploys to DigitalOcean using Docker Compose on push to `main`.

---

## 🤝 **Contributing & Best Practices**

- Always activate your Python virtualenv: `source .venv/bin/activate`
- Run `npm run lint` and `ruff check backend/app` before pushing code.
- Keep `requirements.txt` up to date: `pip freeze > backend/requirements.txt`
- Never commit `.venv/` or other environment-specific files.

---

## 📚 **Resources**

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Ruff](https://docs.astral.sh/ruff/), [Black](https://black.readthedocs.io/en/stable/), [mypy](https://mypy-lang.org/)

---

**Happy coding!** 🎉
