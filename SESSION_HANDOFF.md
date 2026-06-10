# Session Handoff — Metableton Ecole

**Date:** 2026-06-09
**Branch:** main
**MVP status:** Feature-complete + stabilization-blockers fixed. Demo-ready pending local environment setup.

---

## Project

**metableton-ecole** — Online music school portal for modern music creation, built on top of Google Classroom.

---

## Production status — 2026-06-10

**Production login and admin dashboard are now working end-to-end on Vercel + Render + Supabase Cloud.**

### Production fixes applied after the original MVP handoff

- Added a root-level `server.js` entrypoint in the server package so `node server.js` works locally when needed
- Replaced fragile local `node --watch` usage with `nodemon` for dev stability
- Switched Supabase and Google config loading to lazy imports to avoid heavy boot-time blocking locally
- Added Vercel SPA rewrite rules:
  - `client/vercel.json`
  - `vercel.json`
- Adjusted those rewrites to exclude static assets so Vite JS files are not served as HTML
- Exposed `role` from `AuthContext` so route guards can evaluate permissions correctly
- Fixed production cookie settings for cross-site auth:
  - `sameSite: 'none'` in production
  - `secure: true` in production
- Enabled `app.set('trust proxy', 1)` in production so secure cookies work correctly behind Render's proxy

### Working production assumptions

- Frontend host: `https://metableton-ecole.vercel.app`
- API host: `https://metableton-ecole-api.onrender.com`
- `SUPABASE_URL` must be the project base URL only, with no `/rest/v1`
- `DATABASE_URL` must use the Supabase **Session pooler** URI, not the direct `db.<project>.supabase.co:5432` host

### Important production reference

See:

- `docs/production-deployment-notes.md`

This file captures the deployment settings, environment variable rules, and failure modes we hit during production stabilization.

---

## Completed BMAD artifacts

| Artifact | Path |
|---|---|
| Product brief | `_bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md` |
| PRD | `_bmad-output/planning-artifacts/prds/prd-metableton-ecole-2026-06-09/prd.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| Epics & stories | `_bmad-output/planning-artifacts/epics.md` |
| MVP stabilization audit | `_bmad-output/planning-artifacts/mvp-stabilization-audit.md` |

---

## MVP status — 2026-06-09

**All 21 stories accepted. All 3 stabilization blockers (B-1, B-2, B-3) fixed.**

| Epic | Stories | Status |
|---|---|---|
| 1 — School Foundation & Public Presence | 5/5 | ✅ Complete |
| 2 — Authentication & Role-Based Access | 5/5 | ✅ Complete |
| 3 — Courses, Enrollment & Google Classroom | 8/8 | ✅ Complete |
| 4 — Admin Operations | 3/3 | ✅ Complete |
| **Stabilization** | B-1, B-2, B-3 | ✅ Fixed |

**FR coverage:** 16/17 fully implemented, FR-7 (public catalog) fully implemented and live-wired post-B-1.
**NFR-SEC and NFR-REL:** all met. NFR-PERF and NFR-BRW: not formally measured; acceptable for MVP scale.

---

## Story-by-story status

| Story | Description | Status |
|---|---|---|
| 1.1 | Project scaffolding + Supabase database | ✅ |
| 1.2 | Express server foundation + session middleware | ✅ |
| 1.3 | Client shell — Vite, Tailwind, layout + UI components | ✅ |
| 1.4 | Public homepage | ✅ |
| 1.5 | Static course catalog + detail pages | ✅ (then live-wired in B-1) |
| 2.1 | Google OAuth server routes | ✅ |
| 2.2 | Profile service with admin bootstrap | ✅ |
| 2.3 | Auth + role middleware | ✅ |
| 2.4 | AuthContext + client login/logout flow | ✅ |
| 2.5 | Protected routes + role gating (RequireAuth) | ✅ |
| 3.1 | Server course CRUD + management routes | ✅ |
| 3.2 | Course create/edit form (teacher) | ✅ |
| 3.3 | Course list + detail in teacher dashboard | ✅ |
| 3.4 | Enrollment state machine + server routes | ✅ |
| 3.5 | Enrollment request UI from course detail page | ✅ (then live-wired in B-1) |
| 3.6 | Enrollment review UI on teacher dashboard | ✅ |
| 3.7 | Student dashboard — enrollments + Classroom links | ✅ |
| 3.8 | Google Classroom validation + linking | ✅ |
| 4.1 | Admin server routes (users + courses + last-admin guard) | ✅ |
| 4.2 | Admin dashboard — user list + role management | ✅ |
| 4.3 | Admin courses overview | ✅ |

---

## Stabilization fix B-1 — public catalog ↔ live API

**Problem:** `CatalogPage` and `CourseDetailPage` imported from `client/src/data/mockCourses.js`, which had hardcoded course IDs `'1'`, `'2'`, `'3'`. Clicking "Demander l'inscription" on a mock course would hit `POST /api/enrollments` with a fake ID and return 404 "Course not found". This broke the headline UJ-1 student journey.

**Files changed:**
- `client/src/api/courses.js` — added `getPublishedCourses()` (`GET /api/courses`) and `getPublishedCourseById(courseId)` (`GET /api/courses/:id`)
- `client/src/pages/CatalogPage.jsx` — full rewrite: `useState`/`useEffect`/`useCallback` loading/error/empty states; fetches live data; renders real `course.id` (UUID) in card links
- `client/src/pages/CourseDetailPage.jsx` — full rewrite: 404 from the server is treated as "not found" (sets course to `null`); loading/error/empty states; uses real `courseId` from `useParams` in `requestEnrollment`

**Not changed:** `mockCourses.js` is preserved because `StudentDashboardPage` still imports `SKILL_LABELS` from it. Public pages no longer use the data array, only the labels.

**Mock-only fields dropped** (do not exist in the DB schema): `format`, `duration`, `topics`, `longDescription`, `teacherName`, `coverImageUrl`. The detail page now renders `course.description` as the body text and `course.profiles?.display_name` as the teacher name.

**Acceptance:** `npm run build` passes (68 modules, 285.09 kB JS bundle). All 8 acceptance criteria met.

---

## Stabilization fix B-2 — pgcrypto extension

**Problem:** The migration uses `gen_random_uuid()` for all 3 table `id` columns, but does not enable the `pgcrypto` extension. Works on Supabase Cloud (pre-installed in `extensions` schema, visible to the service role), may fail on fresh local Supabase / vanilla Postgres.

**Files changed:**
- `supabase/migrations/001_core_schema.sql` — added `CREATE EXTENSION IF NOT EXISTS pgcrypto;` at the top, before any `CREATE TYPE` or `CREATE TABLE`

**Not changed:** 4 enums, 3 tables, 6 indexes, the unique constraint on `enrollments(student_id, course_id)` are all preserved verbatim.

**Acceptance:** Migration now declares the extension explicitly. Idempotent — safe to re-run.

---

## Stabilization fix B-3 — Supabase CLI config + README setup

**Problem:** The README instructed a fresh clone to run `cd supabase && supabase start`, but `supabase/config.toml` was never committed (no `supabase init` was ever run). A new developer would hit a CLI error on step 2.

**Files changed:**
- `supabase/config.toml` (new) — standard `supabase init` output, committed. Standard ports (54321 API / 54322 Postgres / 54323 Studio / 54324 Inbucket), `extra_search_path = ["public", "extensions"]` so `gen_random_uuid()` resolves from the `pgcrypto` extension added in B-2.
- `supabase/.gitignore` (new) — local-only file, ignores `supabase/.env`, `supabase/.branches/`, `supabase/.temp/`
- `.gitignore` (root, extended) — added `supabase/.env` and `supabase/migrations/*.local.sql` defense in depth
- `README.md` — Step 2 rewritten (now `supabase start` from project root, no broken `cd supabase`), Step 3 mentions the `pgcrypto` extension, Step 4 lists all env vars from `.env.example` (including previously-missing `DATABASE_URL` and `CLIENT_ORIGIN`), env-var table now includes `DATABASE_URL`, `CLIENT_ORIGIN`, and `VITE_API_URL`. Project structure tree lists `config.toml`.

**Not changed:** No application code. No schema. The B-1 (live catalog) and B-2 (pgcrypto) work is intact and untouched.

**Acceptance:** A fresh clone can now run `supabase start` without any `supabase init` step. Local runtime artifacts (`.env`, `.branches/`, `.temp/`, local SQL diffs) are git-ignored.

---

## Current route tree (`client/src/App.jsx`)

**Public** (no auth, PublicLayout):
- `/` → HomePage
- `/catalog` → CatalogPage (live API)
- `/catalog/:courseId` → CourseDetailPage (live API)

**Dashboard** (RequireAuth + DashboardLayout, role-gated):
- `/dashboard` → StudentDashboardPage (allow="student", but teacher+admin can also see it)
- `/dashboard/teacher` → TeacherDashboardPage (allow="teacher")
- `/dashboard/teacher/courses/new` → CourseFormPage mode="create" (allow="teacher")
- `/dashboard/teacher/courses/:courseId/edit` → CourseFormPage mode="edit" (allow="teacher")
- `/dashboard/admin` → AdminDashboardPage (allow="admin")
- `/dashboard/admin/courses` → AdminCoursesPage (allow="admin")

**404:** `*` → NotFoundPage

---

## API surface — final state

**Public:**
- `GET /api/courses` — list published courses
- `GET /api/courses/:id` — fetch a single published course
- `GET /api/auth/google` — start OAuth
- `GET /api/auth/google/callback` — OAuth callback
- `GET /api/auth/me` — current session profile
- `GET /api/auth/logout` — destroy session

**Protected (teacher or admin unless noted):**
- `POST /api/enrollments` — student requests enrollment
- `GET /api/enrollments/mine` — current student's enrollments
- `GET /api/enrollments/pending` — pending requests (teacher sees own, admin sees all)
- `POST /api/enrollments/:id/approve`
- `POST /api/enrollments/:id/reject`
- `GET /api/courses/manage` — courses you own (or all if admin)
- `GET /api/courses/manage/:id` — single manageable course
- `POST /api/courses` — create
- `PUT /api/courses/:id` — update
- `PUT /api/courses/:id/classroom` — link a Google Classroom course
- `GET /api/admin/users` — list all users (admin only)
- `PUT /api/admin/users/:id/role` — change a user's role (admin only, with last-admin guard returning 409 LAST_ADMIN)
- `GET /api/admin/courses` — all courses (admin only)

---

## Architecture rules (do not violate)

- **JavaScript only** — no TypeScript anywhere
- **React 19 + Vite 6 + Tailwind CSS 4** in `/client`
- **Express 5** in `/server`
- **Supabase PostgreSQL** in `/supabase` (migrations)
- **No ORM** — direct queries via `@supabase/supabase-js`
- **No global state library** — React Context (AuthContext) only
- **No direct client-to-Supabase access** — all data through Express API
- **Google OAuth fully server-side** — Authorization Code flow, secrets never on client
- **HTTP-only session cookies** — `express-session` + `connect-pg-simple`, no JWT in localStorage
- **Google Classroom API validation-only in MVP** — GET `/v1/courses/{id}`, no course creation, no roster sync
- **Admin bootstrap** — first Google sign-in → admin, subsequent → student
- **Role never overwritten on re-login**
- **French UI copy** throughout
- **Dark theme** — `bg-gray-950` + `emerald-400` accents

---

## Known limitations (deliberate, MVP-scope)

- Public catalog and course detail page live-wired to `/api/courses` (post-B-1)
- No email/in-app notifications for enrollment status changes — students check the dashboard manually
- No inline Meet link — students click through to Google Classroom (FR-17 explicit)
- No programmatic Classroom course creation, no roster sync (FR-14 explicit)
- No payment, no progress tracking, no mobile app, no i18n (PRD §6.2)
- No bulk operations on admin lists (Story 4.2 explicit)
- No user deletion, no user invitation, no email-based account creation (Story 4.1 explicit)
- Classroom scope (`classroom.courses.readonly`) is NOT in the initial OAuth consent — first attempt to link a Classroom course returns a friendly 403 / reconnect error (Story 3.8 explicit)
- Post-OAuth redirect always lands on the dashboard, not the originating page (Story 3.5 explicit)
- The mock data file `client/src/data/mockCourses.js` is preserved because `StudentDashboardPage` still imports `SKILL_LABELS` from it. The data array (`MOCK_COURSES`) is no longer used anywhere; only the labels map.

---

## Manual demo checklist (high-level)

A full 39-step checklist is in `_bmad-output/planning-artifacts/mvp-stabilization-audit.md` §5. The short version:

1. **Local setup:** `supabase start` → `supabase db push` → copy `.env.example` files → fill in Google OAuth + `SESSION_SECRET` → `cd server && npm run dev` and `cd client && npm run dev` in two terminals.
2. **First sign-in** gets the admin role. Subsequent sign-ins are students.
3. **Admin:** user list with role select, last-admin guard, courses overview at `/dashboard/admin/courses`.
4. **Teacher:** create / edit / publish courses, link a Google Classroom course, review pending enrollments.
5. **Student:** browse `/catalog` (live), click a course, click "Demander l'inscription", see state transitions on the dashboard.

---

## Next steps (post-MVP candidates, not yet scheduled)

The audit identified these as nice-to-have / post-MVP candidates — **none are blockers**:

- N-2: Root-level `package.json` with a `dev` script using `concurrently` for one-command full-stack startup
- N-3: Server-side request logging (`morgan` or hand-rolled)
- N-4: Skeleton placeholder for the public catalog on first paint
- N-5: Friendly toast for the OAuth cancel path
- N-6: Add `classroom.courses.readonly` to the initial OAuth consent (makes linking smoother but increases consent-screen scope)
- N-7: ESLint / Prettier
- N-9: Production-build step in the README
- N-10: `/catalog/:courseId` route shared with the student dashboard (one-line `<Link>`)

---

## Important instructions (for the next session)

- **Continue one task at a time** — do not start multiple stories at once
- **Do not rewrite completed work** unless explicitly asked
- **Verify acceptance criteria** before marking a task complete
- **Do not modify the database schema** unless the task explicitly requires it
- **Keep the server `.env` out of version control** — `.gitignore` already covers it
- The MVP backlog is complete. Do not start a new feature epic without an explicit instruction.
