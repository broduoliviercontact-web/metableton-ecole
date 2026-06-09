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

```bash
# From the project root:
cd supabase
supabase start
```

This starts a local PostgreSQL instance with all Supabase services on `http://127.0.0.1:54321`.

### 3. Run migrations

```bash
# Apply the core schema migration:
supabase db push
```

The migration at `supabase/migrations/001_core_schema.sql` creates:
- Four enum types: `user_role`, `course_status`, `enrollment_status`, `skill_level`
- Three tables: `profiles`, `courses`, `enrollments`
- Six indexes for common query patterns

To reset and re-apply migrations: `supabase db reset`

### 4. Configure environment variables

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and fill in:
- `SUPABASE_URL` — from `supabase start` output (usually `http://127.0.0.1:54321`)
- `SUPABASE_SERVICE_ROLE_KEY` — from `supabase status`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `SESSION_SECRET` — any long random string

### 5. Google Cloud setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project or select an existing one
3. Enable the **Google Classroom API** (for course validation)
4. Go to **APIs & Services → Credentials** → Create OAuth 2.0 Client ID
5. Application type: **Web application**
6. Authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
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

## Environment variables

| Variable                    | Required | Description                         |
|-----------------------------|----------|-------------------------------------|
| `PORT`                      | No       | Server port (default: 3001)        |
| `NODE_ENV`                  | No       | `development` or `production`      |
| `SUPABASE_URL`              | Yes      | Supabase PostgreSQL URL            |
| `SUPABASE_SERVICE_ROLE_KEY`  | Yes      | Supabase service role key          |
| `GOOGLE_CLIENT_ID`          | Yes      | Google OAuth 2.0 client ID         |
| `GOOGLE_CLIENT_SECRET`      | Yes      | Google OAuth 2.0 client secret     |
| `GOOGLE_REDIRECT_URI`       | Yes      | OAuth callback URL                 |
| `SESSION_SECRET`            | Yes      | Random string for session signing  |

## MVP scope

- 2 teachers, 5 students, 3 courses at launch
- Google OAuth sign-in with automatic profile creation
- Moderated enrollment flow (request → pending → approve/reject)
- Google Classroom API: validation-only GET (no course creation, no roster sync)
- No payments, no custom video hosting, no notifications in v1

See `_bmad-output/planning-artifacts/` for the full PRD, architecture, and epic breakdown.
