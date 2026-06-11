# Metableton Ecole

Online music school portal for modern music creation, built on top of Google Classroom.

## Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Client    | React 19, Vite 6, Tailwind CSS 4        |
| Server    | Node.js, Express 5                      |
| Database  | Supabase PostgreSQL                     |
| Auth      | Google OAuth 2.0 (server-side sessions) |

## Project structure

```
metableton-ecole/
├── client/          # React + Vite + Tailwind frontend
│   └── src/         # React components and pages
├── server/          # Express 5 API server
│   └── src/         # Routes, middleware, services
├── supabase/        # Supabase configuration
│   ├── config.toml  # Supabase CLI project config
│   └── migrations/  # SQL migration files
└── _bmad-output/    # Planning artifacts (brief, PRD, architecture)
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Supabase CLI](https://supabase.com/docs/guides/local-development) (`brew install supabase/tap/supabase` on macOS)
- [Docker](https://docs.docker.com/desktop/) (Supabase local dev runs in Docker)
- A Google Cloud project with OAuth 2.0 credentials (see below)

## Local setup

### 1. Install dependencies

```bash
# From the project root:
cd client && npm install
cd ../server && npm install
```

### 2. Start Supabase locally

The Supabase CLI project is already initialized (`supabase/config.toml` is committed), so a fresh clone is one command away:

```bash
# From the project root:
supabase start
```

This boots a local PostgreSQL plus all Supabase services in Docker. The default ports are:
- API: `http://127.0.0.1:54321`
- Postgres: `127.0.0.1:54322`
- Studio: `http://127.0.0.1:54323`
- Inbucket (email testing): `http://127.0.0.1:54324`

> If `supabase` is not on your PATH, install it first: `brew install supabase/tap/supabase` (macOS) — see the [CLI install guide](https://supabase.com/docs/guides/local-development) for Linux/Windows.

### 3. Run migrations

```bash
# Apply the core schema migration:
supabase db push
```

The migration at `supabase/migrations/001_core_schema.sql` creates:
- The `pgcrypto` extension (for `gen_random_uuid()`)
- Four enum types: `user_role`, `course_status`, `enrollment_status`, `skill_level`
- Three tables: `profiles`, `courses`, `enrollments`
- Six indexes for common query patterns

To reset and re-apply migrations from scratch: `supabase db reset`

### 4. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` and fill in:
- `SUPABASE_URL` — usually `http://127.0.0.1:54321`
- `SUPABASE_SERVICE_ROLE_KEY` — from `supabase status` (look for `service_role key`)
- `DATABASE_URL` — usually `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `GOOGLE_REDIRECT_URI` — `http://localhost:3001/api/auth/google/callback`
- `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
- `CLIENT_ORIGIN` — usually `http://localhost:5173`

The default values in `server/.env.example` already match the local Supabase ports, so for a first boot you only need to fill in the Google OAuth and session secret.

### 5. Google Cloud setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project or select an existing one
3. Enable the **Google Classroom API** (for course validation)
4. Go to **APIs & Services → Credentials** → Create OAuth 2.0 Client ID
5. Application type: **Web application**
6. Authorized redirect URI: `https://metableton-ecole.vercel.app/api/auth/google/callback` (production)
7. Note the Client ID and Client Secret → paste into `server/.env`

### 6. Start the app

```bash
# Terminal 1 — start the API server:
cd server && npm run dev

# Terminal 2 — start the Vite dev server:
cd client && npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

## Build & Start

### Frontend (client)

```bash
cd client
npm install
npm run dev       # Development server on http://localhost:5173
npm run build     # Production build in client/dist
npm run preview   # Preview production build locally
```

### Backend (server)

```bash
cd server
npm install
npm run dev       # Development with nodemon
npm start         # Production start
```

> **Note** : Le projet n'a pas de `package.json` root. Toutes les commandes doivent être exécutées depuis `client/` ou `server/`.

---

## Environment variables

| Variable                    | Required | Description                         |
|-----------------------------|----------|-------------------------------------|
| `PORT`                      | No       | Server port (default: `3001`)       |
| `NODE_ENV`                  | No       | `development` or `production`       |
| `SUPABASE_URL`              | Yes      | Supabase API URL                    |
| `SUPABASE_SERVICE_ROLE_KEY`  | Yes      | Supabase service role key           |
| `DATABASE_URL`              | Yes      | PostgreSQL URL (used by session store) |
| `GOOGLE_CLIENT_ID`          | Yes      | Google OAuth 2.0 client ID          |
| `GOOGLE_CLIENT_SECRET`      | Yes      | Google OAuth 2.0 client secret      |
| `GOOGLE_REDIRECT_URI`       | Yes      | OAuth callback URL (use Vercel URL in production: `https://metableton-ecole.vercel.app/api/auth/google/callback`) |
| `SESSION_SECRET`            | Yes      | Random string for session signing   |
| `CLIENT_ORIGIN`             | Yes      | Client origin allowed by CORS (e.g. `http://localhost:5173`) |
| `VITE_API_URL` (client)     | No       | Base URL of the API (default: `http://localhost:3001/api`) |

---

## Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://metableton-ecole.vercel.app |
| Backend health | https://metableton-ecole-api.onrender.com/api/health |
| API base | `/api` (via Vercel rewrite) |

**Note**: The frontend calls `/api` which is rewritten by Vercel to `https://metableton-ecole-api.onrender.com/api`. This ensures cookies work correctly (same-origin requests from the browser's perspective).

---

## MVP scope

- 2 teachers, 5 students, 3 courses at launch
- Google OAuth sign-in with automatic profile creation
- Moderated enrollment flow (request → pending → approve/reject)
- Google Classroom API: validation-only GET (no course creation, no roster sync)
- No payments, no custom video hosting, no notifications in v1

---

## Smoke test after deploy

After each production deployment, run the smoke test checklist:

🔗 [docs/production-smoke-test.md](docs/production-smoke-test.md)

The checklist verifies:
- `/api/health` endpoint
- Homepage and navigation
- Course catalog and course detail pages
- Google OAuth sign-in flow
- All dashboards (student, teacher, admin)
- Enrollment workflow and role management

> **Note** : This test takes ~3-5 minutes. Check off items after each deployment.

See `_bmad-output/planning-artifacts/` for the full PRD, architecture, and epic breakdown.
