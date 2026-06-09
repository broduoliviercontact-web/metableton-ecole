---
title: "MVP Stabilization Audit"
status: draft
created: 2026-06-09
updated: 2026-06-09
auditor: Claude (stabilization pass — no code changes)
---

# MVP Stabilization Audit — Metableton Ecole

*Audit of the current implementation against the brief, PRD, architecture, and epics. All four MVP epics are marked complete in the backlog. This document checks what is actually shipping, where it diverges from spec, and what needs attention before declaring the MVP "demo-ready."*

---

## 1. Summary of completion

### 1.1 Backlog status

| Epic | Stories | Status |
|---|---|---|
| 1 — School Foundation & Public Presence | 5 | ✅ Complete |
| 2 — Authentication & Role-Based Access | 5 | ✅ Complete |
| 3 — Courses, Enrollment & Google Classroom | 8 | ✅ Complete |
| 4 — Admin Operations | 3 | ✅ Complete |

**21/21 stories accepted.** Implementation matches story-by-story acceptance criteria. No half-finished stories. No in-progress work.

### 1.2 FR coverage (PRD)

| FR | Title | Status | Evidence |
|---|---|---|---|
| FR-1 | Google OAuth sign-in | ✅ | `server/src/routes/auth.js` |
| FR-2 | Automatic profile creation on first sign-in | ✅ | `server/src/services/profileService.js` (admin bootstrap on `count === 0`) |
| FR-3 | Profile update on subsequent sign-ins | ✅ | `profileService.findOrCreateGoogleProfile` updates email/display_name/avatar_url, never overwrites role |
| FR-4 | Role-gated dashboard routing | ✅ | `RequireAuth` + `App.jsx` route tree + post-auth redirect in `routes/auth.js` |
| FR-5 | Role-based UI visibility | ✅ | `Header.jsx` shows "Tableau de bord" only for teacher/admin; `DashboardLayout` role-aware |
| FR-6 | Public homepage | ✅ | `HomePage.jsx` |
| FR-7 | Public course catalog | ⚠️ | `CatalogPage.jsx` exists and renders, but **uses local mock data, not `/api/courses`** (see §3.1) |
| FR-8 | Teacher creates and edits courses | ✅ | `courseService` + `routes/courses.js` + `CourseFormPage.jsx` |
| FR-9 | Student requests enrollment | ✅ | `enrollmentService.requestEnrollment` + `CourseDetailPage` `EnrollmentCTA` |
| FR-10 | Teacher reviews enrollment requests | ✅ | `routes/enrollments.js` + `TeacherDashboardPage` `PendingEnrollmentsSection` |
| FR-11 | Admin reviews any enrollment request | ✅ | Same endpoint, `requireRole('teacher', 'admin')`; admin path returns all pending |
| FR-12 | Student views enrolled courses + Classroom links | ✅ | `StudentDashboardPage` with `ClassroomLink` |
| FR-13 | Teacher views and manages their courses | ✅ | `TeacherDashboardPage` + `listManageableCourses` |
| FR-14 | Teacher links a course to Google Classroom | ✅ | `classroomService` + `PUT /api/courses/:id/classroom` + `ClassroomSection` in edit page |
| FR-15 | Admin views and manages users | ✅ | `AdminDashboardPage` + `routes/admin.js` + last-admin guard |
| FR-16 | Admin views all courses | ✅ | `AdminCoursesPage` + `GET /api/admin/courses` |
| FR-17 | Student accesses Meet sessions via Classroom | ✅ | Pass-through: `classroom_url` opens Classroom, which surfaces Meet link |

**16/17 fully implemented, 1 (FR-7) implemented but with a key gap (mock data instead of live data).**

### 1.3 NFR coverage

| NFR | Status | Notes |
|---|---|---|
| NFR-SEC-1 (auth on protected routes) | ✅ | `requireAuth` on every protected route; verified 401 for `/api/admin/*`, `/api/enrollments/*` without session |
| NFR-SEC-2 (server-side role check) | ✅ | `requireRole` middleware; ownership checks on every per-resource route |
| NFR-SEC-3 (GOOGLE_CLIENT_SECRET server-only) | ✅ | `grep "GOOGLE_CLIENT_SECRET" client/src` returns nothing. `.env.example` only has `VITE_API_URL` on the client side. |
| NFR-SEC-4 (OAuth tokens server-only) | ✅ | Tokens stored in `req.session.googleTokens`, never serialized to the client; `/api/auth/me` returns only `{ userId, role }` |
| NFR-SEC-5 (Supabase server-only) | ✅ | No `supabase` import in `client/`; client only uses `apiClient` |
| NFR-PERF-1/2/3 (timing) | ⏳ | Not measured; code is lean enough for the 5/2/3 MVP scale — informal pass |
| NFR-REL-1 (Supabase down → graceful error) | ✅ | `errorHandler` maps Supabase errors to 400 `DATABASE_ERROR`; UI shows `ErrorMessage` with retry |
| NFR-REL-2 (Classroom API down → friendly error) | ✅ | `classroomService` rethrows upstream errors; `errorHandler`'s 502 branch returns the exact copy from the spec |
| NFR-BRW-1 (latest 2 of major browsers) | ⏳ | Not tested cross-browser; uses standard React 19 + Vite 6 + Tailwind 4 — no known incompat |

### 1.4 What the codebase actually contains

- 4 server services, 4 server route files, 4 middleware, 1 OAuth/Supabase/Google config triplet
- 5 client API modules, 1 context, 1 hook, 2 layout components, 5 UI primitives, 1 route guard
- 8 pages (3 public + 5 dashboard, including 2 admin sub-pages) + 1 not-found
- 1 migration file (3 tables, 4 enums, 6 indexes)
- 2 `.env.example` files
- 1 README

All 21 stories have working code paths end-to-end.

---

## 2. Critical blockers

*Issues that would prevent a successful first demo or that violate a PRD/architecture NFR.*

### B-1 (critical): Public catalog still uses mock data

**Where:** `client/src/pages/CatalogPage.jsx` line 7 (`getAllCourses()` from `../data/mockCourses.js`) and `client/src/pages/CourseDetailPage.jsx` line 23 (`getCourseById(courseId)` from mock data).

**Impact:** A visitor sees three fake courses (Ableton Live fundamentals, Sound Design, DJing) regardless of what the admin/teacher has actually created. Worse: if a student clicks "Demander l'inscription" on a mock course, the call goes to `POST /api/enrollments` with `courseId: "1"` (or `"2"`, `"3"`), which the server's `enrollmentService.requestEnrollment` rejects with **404 "Course not found"** — the very error path Story 3.5's `ErrorMessage` is designed to render.

**Why this happened:** The user explicitly deferred catalog→API wiring in Story 1.5 (server course CRUD was Story 3.1) and again noted the gap in Story 3.5. The result: a clean front-end ↔ back-end split that **does not connect** for the only public listing.

**Demo consequence:** The most basic "browse the catalog" flow uses fake data. A teacher who creates a real course in the admin dashboard will **not** see it in the public catalog — only in `/dashboard/teacher`. An admin creating real courses will **not** see them publicly either. This breaks the headline user journey UJ-1.

**Resolution:** Small and contained. The API helper `client/src/api/courses.js` already has `getCourses()` (`/api/courses`) defined; only the public pages import from the mock file. Two imports, two fetch calls, two state machines. Could be a 30-line change. See recommendation #1 in §6.

### B-2 (critical): `pgcrypto` / `gen_random_uuid()` not explicitly enabled

**Where:** `supabase/migrations/001_core_schema.sql` line 14, 28, 45 — `gen_random_uuid()` is called by all three tables, but the migration has no `CREATE EXTENSION IF NOT EXISTS pgcrypto;` (or any extension grant) preceding the table definitions.

**Impact:** On a vanilla `supabase init && supabase start` local instance, this function lives in the `extensions` schema. The default `postgres` role used by `connect-pg-simple` and the service-role key often has `extensions` in its search_path on Supabase but **not** on a fresh plain `initdb` install. Symptom: a `permission denied for function gen_random_uuid` or `function does not exist` error on `supabase db push`.

**Likelihood:** Medium on Supabase cloud (pgcrypto is pre-installed in the `extensions` schema, which the service role can see). Medium on a fresh `supabase start` (depends on CLI version). High on a custom non-Supabase Postgres.

**Resolution:** Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` at the top of the migration. One line, no downside.

### B-3 (high): `supabase init` never run — README setup step is broken

**Where:** `README.md` step 2 says `cd supabase && supabase start`. But there is no `supabase/config.toml` in the repo, and `supabase start` requires a `config.toml` to know the project.

**Impact:** A new developer following the README exactly will get a CLI error on step 2 and won't be able to set up the local database. This is a developer-experience blocker, not a runtime blocker for the existing dev environment (which presumably already has a `supabase start` running somewhere).

**Resolution:** Either run `supabase init` and commit `config.toml` (with project ID, ports, etc.), or rewrite the README to spell out the prerequisite.

### B-4 (high): No root-level `package.json` / no setup convenience scripts

**Where:** Project root has no `package.json` and no root scripts. README has the user run `cd client && npm install` and `cd ../server && npm install` separately.

**Impact:** A fresh checkout cannot `npm install` from the root. There's also no `npm run dev` from the root that spins up both servers concurrently. Minor friction but inconsistent with most monorepo conventions the user might expect. The architecture says "Two separate `package.json` files... No monorepo tooling" — so this is *consistent with the architecture*, but it might still be worth adding a root `package.json` with a `dev` script using `concurrently` for ergonomics.

**Decision:** Not a blocker for MVP. Tag as nice-to-have (N-2 in §4).

---

## 3. Important fixes before demo

*Not strictly broken, but they will surface during a live walkthrough and create a "wait, that's not real" moment.*

### F-1: Public catalog ↔ live data wiring (B-1 above)

This is the single most important fix. Without it, the public homepage → catalog → course detail → enroll journey is half-mock. Re-listed here so the "fix" is paired with the "blocker."

### F-2: Classroom scope not requested — first link will fail with a friendly error

**Where:** `server/src/routes/auth.js` line 14 — scopes are `['openid', 'profile', 'email']`. The Classroom scope `classroom.courses.readonly` is **not** in the OAuth consent request.

**Impact:** When a teacher signs in, goes to edit a course, pastes a Classroom URL, and clicks "Lier le cours", the server tries to call `classroom.courses.get` with the user's access token. Google returns 403 `insufficient_scope`. `classroomService` translates this to a clear French message: *"Google Classroom refuse l'accès : votre compte n'a pas la permission requise. Reconnectez-vous avec l'autorisation Google Classroom."* Good error message — but the teacher will then have to re-authenticate, which will land them in the **exact same scopes** unless the code is updated.

**This is the scenario Story 3.8 explicitly described as acceptable for MVP:** "make the route fail gracefully with a clear error telling the teacher to reconnect with Classroom permission. Do not overbuild OAuth scope escalation unless it is already simple in the current auth architecture."

**Decision:** For demo, this is workable if the demo script pre-conditions the teacher's account by *manually* getting a token with Classroom scope (one-time, via Google OAuth Playground), or by adding the scope to the initial consent. The current behavior is intentional, not a bug. **Document this in the demo runbook (M-7) and consider whether to escalate to the initial OAuth consent.** Risk: if a demo viewer is the one to hit "Lier Google Classroom" for the first time, the error UX is correct but the workflow is interrupted.

### F-3: Post-OAuth redirect always goes to dashboard, never back to the course

**Where:** `server/src/routes/auth.js` callback redirects via `dashboardPaths[role]`. The architecture and Story 3.5 explicitly mark this as an "acceptable for MVP" tradeoff.

**Impact:** A student browsing the catalog, clicking "Demander l'inscription" while logged out, will be sent through Google OAuth, then land on their dashboard, **not back on the course detail page**. They have to navigate back to the catalog manually. Functionally correct, but slightly clunky in a live demo.

**Decision:** Story 3.5 acceptance criteria accept this. Not a fix needed before demo — but a sentence in the demo script ("after sign-in, navigate to /catalog to find the course again") is enough.

### F-4: Course detail page shows no "already a teacher" / "already an admin" subtle UX for non-students

**Where:** `CourseDetailPage` `EnrollmentCTA` correctly shows "Vous êtes enseignant/administrateur" for non-students. ✅ This is fine.

**No fix needed — listed here only to confirm the spot-check.** The flow is correct: a non-student sees a different CTA ("Mon tableau de bord" link), a student sees enrollment state. The "if not logged in" case shows "Se connecter avec Google".

### F-5: 404 handler returns JSON even for browser visits

**Where:** `server/src/app.js` 404 catch-all returns `{ error: { code: 'NOT_FOUND', message: 'Not found' } }`. The client has a `*` route that renders `NotFoundPage`, so this is mostly invisible — but if a user navigates directly to e.g. `http://localhost:3001/api/foo` in a browser, they get a JSON 404 rather than an HTML error page.

**Impact:** Tiny. Only affects dev/QA exploring the API directly. Not a demo issue.

**Decision:** Leave as-is. It's a deliberate choice that the API is JSON-only.

### F-6: No `Access-Control-Allow-Credentials` preflight regression check

**Where:** `app.js` lines 13-16 set `cors({ origin: env.clientOrigin, credentials: true })`. This is the correct shape for cookie auth. CORS has been observed working in dev (cookies ride along on `/api/auth/me` returning 200 vs 401 with/without session).

**No fix needed.** Spot-check confirms configuration matches architecture.

### F-7: Admin role can demote self to "teacher" but the client doesn't warn — relies on server

**Where:** `AdminDashboardPage` `UserRow` has no "this is you" guard on the role select. The server's last-admin guard will reject the request with a 409 + the friendly French message, which the client surfaces in a per-row red banner. So the failure mode is correct UX, just not preventive.

**Impact:** For demo, this is acceptable — the admin will see the LAST_ADMIN error in a clear banner. A nicer UX would disable the demote control for the last admin on the client side, but that's a polish item, not a fix.

---

## 4. Nice-to-have improvements

*Polish that improves demo polish, observability, or DX, but won't block.*

### N-1: Add the public catalog ↔ API wiring (B-1/F-1)

This sits in B-1 because it IS a blocker for the headline demo flow. Re-listed under nice-to-have only if the demo runs on a "I'll click through the dashboards, not the public catalog" path.

### N-2: Root-level `package.json` with a `dev` script using `concurrently`

```json
{
  "name": "metableton-ecole",
  "private": true,
  "scripts": {
    "dev": "concurrently -k -n server,client -c blue,green \"npm --prefix server run dev\" \"npm --prefix client run dev\""
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

This matches the typical "clone and run" experience. Architecture explicitly said no monorepo tooling, but a 2-line `concurrently` dependency is barely a "tool" — it's a dev convenience.

### N-3: Server-side request logging

The current `errorHandler` only logs errors. Successful requests are silent. Adding a `morgan` or hand-rolled logger (`[method] [path] [status] [duration]`) would help diagnose issues during the demo. Not a blocker.

### N-4: `loading` skeleton for the public catalog on first paint

`CatalogPage` resolves synchronously from mock data, but once wired to the API, the first fetch will show an empty page for ~100ms. A skeleton placeholder (matching the card layout) would feel more polished. Pre-emptive.

### N-5: Suppress console errors on the OAuth cancel path

When a user clicks "Se connecter avec Google" then cancels at the consent screen, Google redirects back with `error=access_denied`. The server's `routes/auth.js` callback doesn't currently handle that case explicitly — it'll hit the `if (!code)` branch and return 400 JSON. The client probably just shows a 400 in the network tab. For the demo, this is fine. For polish, render a "Connexion annulée" toast.

### N-6: `classroom.courses.readonly` scope on initial sign-in

Story 3.8 explicitly accepted deferring this, but the demo flow is much smoother if a teacher's first OAuth already includes the Classroom scope. Tradeoff: makes the consent screen slightly more intimidating. If the founder is comfortable with that, it's a 1-line change in `routes/auth.js`. **Decision: leave as-is per Story 3.8 scope; revisit post-MVP.**

### N-7: ESLint / Prettier

No linting config in either `client/` or `server/`. Code style is consistent by hand but will drift as more contributors join. Not a demo concern, but a 10-minute install-and-config of ESLint + Prettier is high-leverage for the post-MVP phase.

### N-8: Add `description` to `package.json` for both apps

Both `package.json` files have `"name"` but no `description`, `version`, `author`, `license`. Cosmetic.

### N-9: A `production` build step in the README

The README explains `npm run dev` but does not document `npm run build` (client) and how to serve `client/dist/` from Express in production. Out of scope for the brief (deployment is not a MVP story), but a 4-line addition closes the loop.

### N-10: An `App.jsx` route for a student to view a single enrollment's course detail

Currently a student on their dashboard can click the Classroom link but not the course itself to see the description. The public `CourseDetailPage` is at `/catalog/:courseId`. Reusing that route from the student dashboard would be a one-line `<Link>`. Not a fix, but a nice touch.

---

## 5. Manual test checklist

*Pre-demo smoke test. Each item should take < 1 minute. Total ~20-30 minutes for the full sweep.*

### 5.1 Public surface (unauthenticated)

- [ ] **T-1:** Visit `http://localhost:5173/` — homepage loads with "Metableton Ecole" branding, tagline, and a "Browse Courses" / "Voir les cours" CTA. Footer is visible. No console errors.
- [ ] **T-2:** Visit `http://localhost:5173/catalog` — catalog renders. **Currently mock data; after B-1 fix, real data.** Cards show title, teacher name, skill level. Empty state if no published courses.
- [ ] **T-3:** Click a course card → navigates to `/catalog/:courseId`. CourseDetailPage shows title, description, topics, format, duration, "Propulsé par Google Classroom" note, and a CTA block.
- [ ] **T-4:** CTA block on a not-logged-in visit shows "Se connecter avec Google" button. Click it.
- [ ] **T-5:** Browser redirects to Google's consent screen. Cancel. **Currently**: lands on dashboard with 400 in console. **Polish target**: friendly "Connexion annulée" toast (N-5).
- [ ] **T-6:** Click "Se connecter avec Google" again, complete consent. Lands on `/dashboard` (or `/dashboard/teacher` / `/dashboard/admin` depending on role).

### 5.2 Auth bootstrap (first user)

- [ ] **T-7:** Before any users exist, the first Google sign-in creates a profile with `role = 'admin'`. Verify in the admin dashboard: this user appears in the user list.
- [ ] **T-8:** Second Google sign-in (different account) → role is `student`. Third + fourth: same. **Verify in admin user list.**

### 5.3 Student flow

- [ ] **T-9:** As a student, visit `/dashboard` — empty state if no enrollments. Click "Voir le catalogue" → goes to `/catalog`.
- [ ] **T-10:** Click a course card → "Demander l'inscription" button visible (since logged in as student).
- [ ] **T-11:** **CRITICAL — this is the B-1 failure path until fixed:** Click "Demander l'inscription" on a mock-data course. With B-1 unfixed, this returns "Cours introuvable" 404. After B-1 fix, it succeeds and shows "Demande en cours".
- [ ] **T-12:** Refresh `/dashboard`. The newly requested course appears with "En attente" badge.
- [ ] **T-13:** While the enrollment is pending, visit the course detail page. The button area shows "Demande en cours" (no clickable button).

### 5.4 Teacher flow

- [ ] **T-14:** As a teacher (or admin, since admin inherits teacher), visit `/dashboard/teacher`. Click "Créer un cours". Fill in title + description + skill level. Submit.
- [ ] **T-15:** Course is created with status `draft` and `teacher_id` = current user. Redirects to `/dashboard/teacher`. The new course appears in the list.
- [ ] **T-16:** Click "Modifier" on the course. Edit description. Save. Refresh — change persisted.
- [ ] **T-17:** On the edit page, scroll to "Lier Google Classroom" section. **Demo path 1 — happy path:** paste a valid Google Classroom ID or URL you have access to. Click "Lier le cours". After a few seconds, the link appears as "Classroom lié" with a green "Ouvrir Google Classroom" button. **Demo path 2 — friendly error:** paste a fake ID. See the validation error. **Demo path 3 — scope error:** if the teacher's OAuth didn't include Classroom scope, see the reconnect message (F-2).
- [ ] **T-18:** Back on `/dashboard/teacher`, look at "Demandes d'inscription" section. Pending requests appear with student name, email, course title, request date. Click "Approuver" on one. Row disappears. Click "Refuser" on another. Row disappears.
- [ ] **T-19:** After refresh, the teacher sees zero pending requests (empty state).

### 5.5 Admin flow

- [ ] **T-20:** As admin, visit `/dashboard/admin`. See the user list. Verify your own user is marked "(vous)".
- [ ] **T-21:** Change another user's role from `student` to `teacher`. UI updates immediately (optimistic), then refetches. The change persists after refresh.
- [ ] **T-22:** **Last-admin guard:** Try to change your own role from `admin` to `teacher`. Server returns 409 LAST_ADMIN. Red banner appears with the French message. Your role remains `admin`.
- [ ] **T-23:** Click "Voir tous les cours →" in the header. Lands on `/dashboard/admin/courses`. See 4 summary tiles: total, published, draft, with Classroom. Each course row shows status badge, skill level badge, teacher name + email, optional "Ouvrir Google Classroom" link, and a "Voir / modifier →" link.
- [ ] **T-24:** If you create a second admin (or use the seed approach), test demoting the non-self admin: should succeed.

### 5.6 Regression checks

- [ ] **T-25:** Logout from each role. The "Se déconnecter" button in the Header destroys the session. The next page load redirects through the OAuth flow.
- [ ] **T-26:** Try to navigate to `/dashboard/admin` as a student. RequireAuth redirects to `/dashboard`.
- [ ] **T-27:** Try to navigate to `/dashboard/teacher` as a student. Same — redirects to `/dashboard`.
- [ ] **T-28:** Visit `/nonexistent`. NotFoundPage renders.
- [ ] **T-29:** Open browser dev tools network tab. Click any action. Verify the request goes to `http://localhost:3001/api/...` and includes the `Cookie: connect.sid=...` header.
- [ ] **T-30:** Refresh the page on any dashboard. Session restores from cookie. No flicker. User is still logged in.

### 5.7 Security spot-checks

- [ ] **T-31:** Open the client-side bundle (`client/dist/assets/*.js` after a build, or DevTools sources). Search for `GOOGLE_CLIENT_SECRET`. Zero matches.
- [ ] **T-32:** Search the same bundle for `SUPABASE_SERVICE_ROLE_KEY`. Zero matches.
- [ ] **T-33:** With no session, `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/admin/users` returns `401`.
- [ ] **T-34:** With a student session cookie, the same curl returns `403` (after the 401 is satisfied, role middleware kicks in).
- [ ] **T-35:** Inspect the `connect.sid` cookie in DevTools → Application → Cookies. It has the `HttpOnly` flag set. In dev it does NOT have `Secure` (correct — Secure requires HTTPS). In production build with `NODE_ENV=production`, `Secure` is added.

### 5.8 Database / Supabase

- [ ] **T-36:** `supabase status` reports a healthy local stack. The `user_sessions` table exists (created by `connect-pg-simple` on first session).
- [ ] **T-37:** Run `supabase db reset` to drop and recreate the database. Then `supabase db push` to re-apply migrations. The `profiles`, `courses`, `enrollments` tables are recreated. **Confirm B-2 fix:** `pgcrypto` extension is created; no `gen_random_uuid` errors.
- [ ] **T-38:** Sign in a user. Check `profiles` table — one row, role=admin (if first user).
- [ ] **T-39:** Approve an enrollment. Check `enrollments.status` flips to `approved` and `updated_at` advances.

---

## 6. Recommended next 3 tasks

*Ordered by ROI. Each is small, contained, and either a blocker (B-1) or a meaningful UX win.*

### 1. Wire the public catalog and detail pages to the real `/api/courses` endpoint

**Why first:** This is the headline user journey. Until this is done, the public site shows fake content and enrollment from the catalog detail page is broken (the 404 path that the user explicitly called out in the story 3.5 spec). This is a 1-story-sized change.

**Scope:**
- `client/src/pages/CatalogPage.jsx` — replace `getAllCourses()` (mock) with `fetchCatalog()` (api/courses). Add loading/error/empty states that are already implemented in the pattern.
- `client/src/pages/CourseDetailPage.jsx` — replace `getCourseById(courseId)` (mock) with `fetchCourseById(courseId)`. Reuse the existing `EnrollmentCTA` logic — the only added state is "course not found yet" → loading, then "course is found" → render.
- Optionally: add a `created_at` display in the catalog cards and a "show 3 more / load all" if the catalog grows beyond the first paint.
- Optionally: a "seed" button on the admin courses page that publishes 3 demo courses for the demo, so a demo viewer doesn't have to wait for the founder to create them. (Could be a separate small story.)

**Acceptance:**
- Catalog renders real courses from the database.
- Empty state shows when no courses are `published`.
- Detail page renders the real description, topics, etc.
- "Demander l'inscription" actually creates an enrollment (no 404).

**Effort:** ~2 hours including build verification.

### 2. Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to the migration

**Why:** The migration uses `gen_random_uuid()` without enabling the extension. On a fresh `supabase init` or a non-Supabase Postgres, this can fail. Adding the extension declaration is a one-line, no-downside fix.

**Scope:** Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` at the top of `supabase/migrations/001_core_schema.sql`, before the `CREATE TYPE` statements.

**Acceptance:** `supabase db reset && supabase db push` works on a fresh local instance without errors.

**Effort:** 2 minutes.

### 3. Initialize Supabase CLI project and commit `config.toml`

**Why:** README step 2 (`cd supabase && supabase start`) is currently broken because the project was never initialized with `supabase init`. A new developer cloning the repo hits an immediate error.

**Scope:**
- Run `supabase init` in the project root.
- Either commit the resulting `supabase/config.toml` (with a documented project ID and ports) or add a `supabase init` step at the top of the README.
- The CLI-generated `supabase/.gitignore` (or update the root `.gitignore`) should keep local runtime files out of git.

**Acceptance:** README step 2 works on a fresh clone. A new dev can `supabase start` and get a working local DB.

**Effort:** 10 minutes.

---

## 7. Other notes (FYI, not action items)

### Known limitations from the PRD (already accepted as MVP-out-of-scope)

- No email/in-app notifications for enrollment status changes (PRD §6.2). Students must check the dashboard manually.
- No inline Meet link display — students click through to Classroom (FR-17 explicit).
- No programmatic Classroom course creation, no roster sync (FR-14 explicit).
- No payment, no progress tracking, no mobile app, no i18n (PRD §6.2).
- No bulk operations on admin lists (Story 4.2 explicit).
- No user deletion, no user invitation, no email-based account creation (Story 4.1 explicit).

These are deliberate scope decisions, not bugs. The demo should not promise them.

### Risks called out in the PRD (still relevant)

- **R-1 (Gmail consumer account + Classroom API):** MVP uses personal Gmail accounts, so all Classroom API usage is read-only (GET for validation). The code respects this — `classroomService` only does `courses.get`. ✅
- **R-2 (OAuth token refresh):** `classroomService.refreshIfNeeded` handles the silent refresh case. Has not been tested in practice because no demo run has exercised a long-lived session. The error path (refresh failure) does NOT have a tested 401 → re-auth flow; the client would just show the error and the user would have to navigate back to sign in manually. **Action:** add a test case for the refresh path before going to a "long session" demo. Not blocking.
- **R-3 (Supabase SPOF):** Out of MVP scope. The graceful error handler is in place.
- **R-4 (no notification channel):** Acknowledged; manual checking. At 5-student scale, acceptable.

### Architectural alignment

The implementation matches the architecture document's structure, naming, and patterns:
- Service layer owns all Supabase queries
- Routes own HTTP shape, validation, and ownership checks
- Middleware chain is consistent (`sessionMiddleware → requireAuth → requireRole → handler`)
- Error handler maps statusCode → code consistently
- `apiClient` is the single fetch wrapper
- `AuthContext` is the only shared state
- No ORM, no monorepo tooling, no TypeScript

### Code smells (minor, not blocking)

- `routes/auth.js` uses absolute paths (`/api/auth/...`) while mounted as `app.use(authRouter)`. Inconsistent with other routers which use `app.use('/api/...', router)` and relative paths. Works correctly, but a future reader might be confused.
- `AdminDashboardPage` and `TeacherDashboardPage` both define their own local `SKILL_LABELS` map. The map is also in `data/mockCourses.js` (used by the public pages). After the public-catalog wiring (task 1), this could be a shared util in `data/skillLabels.js` or similar. Cosmetic.
- `CourseFormPage` and `CourseDetailPage` both render a "Propulsé par Google Classroom" hint. The wording is slightly different. A future polish pass could extract a shared `ClassroomExplainer` component.

### Deployment readiness (out of MVP scope, but called out for completeness)

The README covers local dev. Production deployment would need:
- HTTPS termination (for the `Secure` cookie flag and Google's OAuth callback)
- Hosted Supabase project (with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` swapped to the cloud values)
- Production `CLIENT_ORIGIN` env var (e.g., `https://metableton-ecole.com`)
- A static host or Express static middleware to serve `client/dist/`
- Reverse proxy or path routing so `/api/*` goes to Express and everything else goes to the SPA
- A production Google OAuth client (not the localhost one)
- A backed-up session store (Supabase Postgres works)

None of this is in scope for MVP, but it should be a tracked post-MVP workstream before any real users hit the production URL.

---

## 8. Conclusion

**The MVP is feature-complete against the PRD and architecture.** All 21 stories ship working code, all NFR-SEC and NFR-REL requirements are met, and the demo flow (with one exception) is end-to-end. The one critical exception — public catalog still on mock data — is the single fix that moves the project from "feature-complete" to "demo-ready." The other items in this audit are polish, observability, and post-MVP hygiene.

**Recommended immediate action (in order):**
1. Wire public catalog + detail page to `/api/courses` (B-1)
2. Add `CREATE EXTENSION pgcrypto;` to the migration (B-2)
3. Initialize the Supabase CLI project so README step 2 works (B-3)
4. Run the manual test checklist (§5) once those are done
5. Run a full demo with a fresh demo dataset (3 published courses with Classroom links, 2 teachers, 1 admin, 2-3 students with mixed enrollment states)

After those five steps, the MVP is ready to show.
