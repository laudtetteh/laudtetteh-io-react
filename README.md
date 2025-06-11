# Laud Tetteh IO - Full Stack Monorepo

A modern, production-ready monorepo with:

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python 3.11+)
- **Dev Workflow:** Docker, Prettier, ESLint, Ruff, Black, mypy, pre-commit, GitHub Actions CI/CD

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

## 🧹 **Linting, Formatting, Type Checking**

- **All at once:**
  ```sh
  npm run lint:all
  ```
- **Individually:**

  - JS/TS Lint: `npm run lint:js`
  - JS/TS Format: `npm run format:js`
  - Python Lint: `npm run lint:py`
  - Python Format: `npm run format:py`
  - Python Type Check: `npm run typecheck:py`

- **Pre-commit hooks** and **CI/CD** enforce all checks before deploy.

---

## ⚙️ **Environment Variables**

- Copy `.env.example` to `.env.local` and fill in required values for local dev.
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

### Frontend (React/Next.js)

- **Unit/Integration:**
  - Add tests with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  - Example:
    ```sh
    npm install --save-dev jest @testing-library/react @testing-library/jest-dom
    npm run test
    ```

### Backend (FastAPI)

- **Unit/Integration:**
  - Add tests with [pytest](https://docs.pytest.org/en/stable/) and [httpx](https://www.python-httpx.org/)
  - Example:
    ```sh
    pip install pytest httpx
    pytest backend/app/tests
    ```

### End-to-End (E2E)

- Consider [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/) for full-stack E2E tests.

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
  - Set up with [pre-commit](https://pre-commit.com/) for auto-linting on commit.
    ```sh
    pip install pre-commit
    pre-commit install
    ```
- **Updating dependencies:**
  - JS: `npm update` or `npm install <pkg>@latest`
  - Python: `pip install -U <package>`
- **Debugging:**
  - Use browser dev tools, VSCode Python/JS debuggers, and FastAPI's `/docs` for API testing.

---

## 🏗️ **CI/CD (GitHub Actions)**

- Lints, formats, and type-checks both frontend and backend before deploy.
- Deploys to DigitalOcean using Docker Compose.

---

## 🤝 **Contributing & Best Practices**

- Always activate your Python virtualenv: `source .venv/bin/activate`
- Use `npm run lint:all` before pushing code.
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
