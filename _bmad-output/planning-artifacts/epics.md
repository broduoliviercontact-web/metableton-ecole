---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - _bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md
  - _bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/addendum.md
  - _bmad-output/planning-artifacts/prds/prd-metableton-ecole-2026-06-09/prd.md
  - _bmad-output/planning-artifacts/architecture.md
---

# metableton-ecole - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Metableton Ecole MVP, decomposing requirements from the PRD and Architecture into implementable stories. Each story is sized for implementation by an AI coding agent and follows the 14-step implementation order from the architecture.

## Requirements Inventory

### Functional Requirements

FR-1: A visitor can sign in with their Google account using the Google Identity Services OAuth 2.0 flow.
FR-2: On first sign-in, the system creates a profile in Supabase with the user's Google identity. First user ever gets role 'admin'; subsequent users default to 'student'.
FR-3: On each sign-in, the system updates the existing profile's email, display name, and avatar URL from the latest Google token data. Role is never overwritten.
FR-4: After sign-in, the system routes the user to the dashboard matching their role (student → /dashboard, teacher → /dashboard/teacher, admin → /dashboard/admin).
FR-5: Navigation and page content adapt to the user's role. Backend enforces role on every API request.
FR-6: A visitor can view a public homepage at `/` showing the school name, tagline, and a call-to-action linking to the course catalog.
FR-7: A visitor can browse published courses at `/catalog` and view course details at `/catalog/:courseId` without signing in.
FR-8: A teacher can create and edit courses they own (title, description, skill level, cover image URL, status: draft/published).
FR-9: A student can request enrollment in a published course. If not authenticated, redirected to sign-in, then returned to the enrollment action.
FR-10: A teacher can view and act on enrollment requests for courses they own (approve/reject).
FR-11: An admin can view and act on enrollment requests for any course.
FR-12: A student can see their enrollments with status and access Google Classroom links for approved enrollments from their dashboard.
FR-13: A teacher can view all courses they own and manage them from their dashboard.
FR-14: A teacher can link a course to a Google Classroom by providing a Classroom ID. The backend validates it via the Classroom API.
FR-15: An admin can view all users and change any user's role (student ↔ teacher ↔ admin) with last-admin protection.
FR-16: An admin can view all courses in the system regardless of owner.
FR-17: Students access live Meet sessions through the Google Classroom linked to their course. The portal stores and displays the Classroom link but does not generate or host Meet links.

### Non-Functional Requirements

**Security:**
NFR-SEC-1: All API routes except public catalog and auth callback require a valid server-side session. Unauthenticated requests return 401.
NFR-SEC-2: All role-gated routes verify the user's role from the server-side session on every request. The client role is never trusted.
NFR-SEC-3: GOOGLE_CLIENT_SECRET exists only in server environment variables. Never sent to client, bundled in client code, or logged.
NFR-SEC-4: Google OAuth tokens (access_token, refresh_token) are stored server-side only. Never exposed to the client.
NFR-SEC-5: Supabase database credentials and API keys are server-side only. Client never connects directly to Supabase; all data access goes through Express.

**Performance:**
NFR-PERF-1: Public pages (homepage, catalog) load in under 2 seconds on standard broadband.
NFR-PERF-2: Dashboard pages load in under 3 seconds for MVP data scale.
NFR-PERF-3: Google Classroom API calls respond in under 5 seconds or time out with a user-friendly error.

**Reliability:**
NFR-REL-1: If Supabase is unreachable, the system returns a graceful error page.
NFR-REL-2: If the Google Classroom API is unreachable during course linking, the system surfaces a specific error message.

**Browser Support:**
NFR-BRW-1: The application supports the latest two versions of Chrome, Firefox, Safari, and Edge.

### Additional Requirements (from Architecture)

- **No starter template** — fully specified stack. Project scaffolded manually: Vite + React (JS) for client, Express for server, Supabase CLI for database migrations.
- **JavaScript only, no TypeScript** — all files are `.js` / `.jsx`.
- **No ORM** — Supabase client (`@supabase/supabase-js`) for database queries. Direct SQL via Supabase client methods.
- **No global state library** — React Context (`AuthContext`) is the only shared state. Page-level data uses local `useState`.
- **No monorepo tooling** — Two separate `package.json` files in `/client` and `/server`. No Nx, Turborepo, or npm workspaces.
- **Express session middleware** — `express-session` with `connect-pg-simple` backed by Supabase PostgreSQL. HTTP-only, SameSite=Lax, Secure in production cookies.
- **Google OAuth 2.0 flow** — Authorization Code flow fully server-side. Scopes: `openid profile email`. Classroom scope requested incrementally for teachers.
- **Classroom API validation-only in MVP** — `GET /v1/courses/{id}` to verify Classroom exists and teacher has access. No course creation, no roster sync.
- **15 API routes** — 5 public (catalog, auth) + 10 protected (enrollments, courses management, admin).
- **14-step implementation order** — Supabase → server auth → middleware → client shell → auth context → courses CRUD → catalog → enrollments → dashboards → Classroom validation → admin.
- **3 database tables** — profiles, courses, enrollments. 4 enum types. Migration file: `001_core_schema.sql`.
- **10 React pages** — 3 public (Home, Catalog, CourseDetail) + 7 authenticated (student dashboard, teacher dashboard + course form + course manage, admin dashboard + courses, 404).
- **CORS:** Express configured to allow `CLIENT_ORIGIN` with credentials (`http://localhost:5173` in dev).
- **Environment variables:** `VITE_API_URL` only in client `.env`. All secrets server-side.

### UX Design Requirements

No UX design document found. UI will follow the functional requirements and architecture patterns directly: role-aware layouts, loading/error/empty state handling, Tailwind CSS for styling. No custom design tokens or design system beyond Tailwind defaults.

### FR Coverage Map

FR-1 → Epic 2 (Google OAuth sign-in)
FR-2 → Epic 2 (Profile creation, admin bootstrap)
FR-3 → Epic 2 (Profile update on sign-in)
FR-4 → Epic 2 (Role-gated dashboard routing)
FR-5 → Epic 2 (Role-based UI visibility)
FR-6 → Epic 1 (Public homepage)
FR-7 → Epic 1 (Public course catalog)
FR-8 → Epic 3 (Teacher course CRUD)
FR-9 → Epic 3 (Student enrollment request)
FR-10 → Epic 3 (Teacher enrollment review)
FR-11 → Epic 3 (Admin enrollment review)
FR-12 → Epic 3 (Student dashboard + Classroom links)
FR-13 → Epic 3 (Teacher dashboard)
FR-14 → Epic 3 (Classroom linking + validation)
FR-15 → Epic 4 (Admin user management)
FR-16 → Epic 4 (Admin course overview)
FR-17 → Epic 3 (Meet via Classroom link)

## Epic List

### Epic 1: School Foundation & Public Presence
Users can visit the Metableton Ecole website, see the school's identity, and browse available courses. The school exists online.
**FRs covered:** FR-6, FR-7

### Epic 2: Authentication & Role-Based Access
Users can sign in with Google, have their profile automatically created, and land on a role-appropriate dashboard. The school knows who you are.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5

### Epic 3: Courses, Enrollment & Google Classroom
Teachers create and publish courses. Students browse, request enrollment, and get approved. Students access Google Classroom from a single dashboard. Teachers link courses to Google Classroom and manage enrollments. The school works.
**FRs covered:** FR-8, FR-9, FR-10, FR-11, FR-12, FR-13, FR-14, FR-17

### Epic 4: Admin Operations
Admin sees all users, changes roles, views all courses, and manages the platform. The school is managed.
**FRs covered:** FR-15, FR-16

## Epic 1: School Foundation & Public Presence

Users can visit the Metableton Ecole website, see the school's identity, and browse available courses. The school exists online.

### Story 1.1: Project scaffolding and Supabase database

As a developer,
I want the project scaffolded with the monorepo structure and Supabase database initialized,
So that all subsequent stories have a foundation to build on.

**User value:** Foundation — no user-facing feature yet, but all subsequent stories depend on this.

**Scope:** Create the three-directory monorepo structure, initialize package.json files, and set up Supabase with the core schema migration.

**Technical notes:**
- Create `/client` with `npm create vite@latest client -- --template react` (JavaScript variant)
- Install Tailwind CSS 4: `npm install tailwindcss @tailwindcss/vite`
- Create `/server` with `npm init`, install `express`, `cors`, `dotenv`
- Create `/supabase/migrations/001_core_schema.sql` with the 3 tables + 4 enums + indexes from the architecture DDL
- Root `README.md` skeleton, `.gitignore`

**Acceptance criteria:**
- **Given** a clean directory, **when** the scaffolding steps are run, **then** `/client`, `/server`, and `/supabase` directories exist with correct `package.json` files
- **Given** Supabase CLI is installed, **when** `supabase start && supabase db push` is run, **then** the `profiles`, `courses`, and `enrollments` tables exist with correct columns and constraints
- **Given** the client is started with `npm run dev`, **when** a browser opens `http://localhost:5173`, **then** the default Vite + React page renders
- **Given** the server is started with `npm run dev`, **when** a request is sent to `http://localhost:3001`, **then** the Express server responds

**Dependencies:** None (first story)

**Files likely touched:**
- `/metableton-ecole/client/package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`
- `/metableton-ecole/server/package.json`, `src/index.js`
- `/metableton-ecole/supabase/migrations/001_core_schema.sql`
- `/metableton-ecole/README.md`, `.gitignore`

**Out of scope:** No routes beyond a health-check. No auth. No UI beyond default Vite page. No Tailwind configuration beyond package install.

### Story 1.2: Express server foundation with session middleware

As a developer,
I want the Express server configured with CORS, session middleware, environment variable loading, and Supabase and Google OAuth clients,
So that all API routes have a secure, configured runtime.

**User value:** Foundation — enables all backend features.

**Scope:** Server configuration files: env loader, Supabase client, Google OAuth client, session middleware.

**Technical notes:**
- `server/src/config/env.js` — loads and validates all environment variables, throws on missing required vars
- `server/src/config/supabase.js` — creates and exports Supabase client with `SERVICE_ROLE_KEY`
- `server/src/config/google.js` — creates and exports `google.auth.OAuth2` client with credentials from env
- `server/src/middleware/session.js` — configures `express-session` with `connect-pg-simple` backed by Supabase
- `server/src/middleware/errorHandler.js` — global error handler from architecture patterns
- `server/src/app.js` — wires: `cors({ origin: CLIENT_ORIGIN, credentials: true })`, `express.json()`, session middleware, routes placeholder, error handler
- `server/.env.example` with all required vars from architecture
- `client/.env.example` with `VITE_API_URL=http://localhost:3001/api`

**Acceptance criteria:**
- **Given** the server is started with a valid `.env`, **when** `GET /api/health` is called, **then** it returns `{ status: "ok" }`
- **Given** a request from `http://localhost:5173` with credentials, **when** CORS headers are checked, **then** `Access-Control-Allow-Origin` matches the client origin and `Access-Control-Allow-Credentials` is `true`
- **Given** a missing `SUPABASE_URL` env var, **when** the server starts, **then** it throws a clear error and exits
- **Given** `GOOGLE_CLIENT_SECRET` is set in `.env`, **when** the client bundle is inspected, **then** the secret does not appear in any client-side code
- **Given** any unhandled error in a route handler, **when** the error is thrown, **then** the client receives `{ error: { code, message } }` with an appropriate status code — never a stack trace

**Dependencies:** Story 1.1 (project scaffold exists)

**Files likely touched:**
- `/server/src/config/env.js`, `supabase.js`, `google.js`
- `/server/src/middleware/session.js`, `errorHandler.js`
- `/server/src/app.js`, `index.js`
- `/server/.env.example`
- `/client/.env.example`

**Out of scope:** No auth routes, no protected routes, no business logic. Session store creation but no actual auth sessions yet.

### Story 1.3: Client shell — Vite, Tailwind, and shared layout components

As a visitor,
I want a styled, navigable shell with a header and consistent layout,
So that the school site looks professional from the first visit.

**User value:** The site looks like a real school, not a default Vite template.

**Scope:** Tailwind CSS setup, shared layout components (Header, PublicLayout), shared UI primitives (Button, Badge, EmptyState, ErrorMessage, LoadingSpinner), and client-side routing setup.

**Technical notes:**
- Tailwind CSS 4 with Vite plugin (no PostCSS config needed)
- `react-router-dom` v7 for routing — install and wrap in `BrowserRouter`
- `Header.jsx` — logo/title "Metableton Ecole", nav links, "Sign in with Google" button placeholder (working button comes in Epic 2)
- `PublicLayout.jsx` — Header + `<main>` + footer
- UI components from architecture patterns — each a simple functional component with Tailwind classes
- `App.jsx` — route definitions for `/` and `/catalog/:courseId?` using `PublicLayout`

**Acceptance criteria:**
- **Given** the client dev server is running, **when** a visitor opens `/`, **then** they see the Header with "Metableton Ecole" branding, a navigation bar, and a "Sign in with Google" button
- **Given** the Header renders, **when** the visitor is not signed in, **then** the nav shows public links only (no dashboard links)
- **Given** any page renders, **when** Tailwind utility classes are applied, **then** styles are applied correctly with no unstyled elements
- **Given** the LoadingSpinner component, **when** it renders, **then** a centered loading indicator is visible
- **Given** the EmptyState component with message and actionLink props, **when** it renders, **then** the message and a link button are displayed

**Dependencies:** Story 1.1 (client scaffold exists)

**Files likely touched:**
- `/client/vite.config.js` (Tailwind plugin), `index.html`
- `/client/src/main.jsx`, `App.jsx`
- `/client/src/components/layout/Header.jsx`, `PublicLayout.jsx`
- `/client/src/components/ui/Button.jsx`, `Badge.jsx`, `EmptyState.jsx`, `ErrorMessage.jsx`, `LoadingSpinner.jsx`

**Out of scope:** Dashboard layout (Epic 2), auth context, actual sign-in functionality, any data fetching, page content beyond a placeholder.

### Story 1.4: Public homepage

As a prospective student,
I want to visit the Metableton Ecole homepage and understand what the school offers,
So that I can decide whether to explore the courses.

**User value:** The school has a public identity. First impression for all visitors.

**Scope:** HomePage component at `/` with school branding, tagline, and a call-to-action linking to the course catalog.

**Technical notes:**
- Static content — no API calls needed
- School name, tagline ("Online school for modern music creation"), brief description
- Call-to-action button: "Browse Courses" → links to `/catalog`
- Tailwind for all styling, no custom CSS

**Acceptance criteria:**
- **Given** a visitor navigates to `/`, **when** the page loads, **then** they see the school name "Metableton Ecole", a tagline about modern music creation, and a call-to-action button labeled "Browse Courses"
- **Given** the homepage renders, **when** the visitor clicks "Browse Courses", **then** they navigate to `/catalog`
- **Given** the homepage renders, **when** viewed on the latest Chrome, Firefox, Safari, and Edge, **then** the layout is intact and readable

**Dependencies:** Story 1.3 (layout components and routing exist)

**Files likely touched:**
- `/client/src/pages/public/HomePage.jsx`
- `/client/src/App.jsx` (route already defined in 1.3, page component now filled)

**Out of scope:** Course data, dynamic content, testimonials, images, SEO metadata beyond basic `<title>`. Any auth-gated content.

### Story 1.5: Course catalog and detail pages

As a prospective student,
I want to browse published courses and read details about each one,
So that I can find a course that matches my interests.

**User value:** The core discovery experience. Students can see what's available before committing to sign in.

**Scope:** CatalogPage listing published courses, CourseDetailPage showing full course info, and the server-side public course API routes.

**Technical notes:**
- Server: `GET /api/courses` returns all published courses with teacher display name (joined from profiles)
- Server: `GET /api/courses/:courseId` returns single course with teacher display name
- Client: `CatalogPage.jsx` — fetches from `GET /api/courses`, renders course cards in a grid, each linking to `/catalog/:courseId`
- Client: `CourseDetailPage.jsx` — fetches from `GET /api/courses/:courseId`, shows title, teacher name, skill level badge, full description
- Client: `api/client.js` — fetch wrapper with `credentials: 'include'`, JSON parsing, error handling
- Client: `api/courses.js` — `fetchCatalog()` and `fetchCourse(id)` functions
- Loading, error, and empty states per the architecture pattern (LoadingSpinner, ErrorMessage, EmptyState)

**Acceptance criteria:**
- **Given** no published courses exist, **when** a visitor navigates to `/catalog`, **then** an EmptyState is shown: "No courses available yet. Check back soon."
- **Given** at least one published course exists, **when** a visitor navigates to `/catalog`, **then** each course card shows the title, teacher name, and skill level
- **Given** a published course exists, **when** a visitor clicks a course card, **then** they navigate to `/catalog/:courseId` and see the full title, description, teacher name, and skill level badge
- **Given** a course with `status = 'draft'` exists, **when** the catalog is fetched, **then** the draft course does not appear in the listing
- **Given** the server returns an error, **when** the catalog page fetches data, **then** an ErrorMessage is displayed with a human-readable message (not a stack trace)
- **Given** the catalog is loading, **when** data is being fetched, **then** a LoadingSpinner is displayed

**Dependencies:** Story 1.2 (Express server with Supabase client), Story 1.4 (HomePage + routing)

**Files likely touched:**
- `/server/src/app.js` (mount courses router)
- `/server/src/routes/courses.js` (new)
- `/server/src/services/courseService.js` (new)
- `/client/src/api/client.js` (new)
- `/client/src/api/courses.js` (new)
- `/client/src/pages/public/CatalogPage.jsx` (new)
- `/client/src/pages/public/CourseDetailPage.jsx` (new)
- `/client/src/App.jsx` (add catalog routes)

**Out of scope:** Enrollment button (Epic 3), pagination, search, filtering. No auth required for these public endpoints.

## Epic 2: Authentication & Role-Based Access

Users can sign in with Google, have their profile automatically created, and land on a role-appropriate dashboard. The school knows who you are.

### Story 2.1: Google OAuth server routes

As a visitor,
I want to sign in with my Google account,
So that the platform recognizes me without creating a separate password.

**User value:** The identity foundation. Every user must sign in before doing anything role-specific.

**Scope:** Google OAuth 2.0 Authorization Code flow — initiation route, callback route, token exchange, session creation.

**Technical notes:**
- `GET /api/auth/google` — generates OAuth URL with scopes `openid profile email`, redirects user to Google
- `GET /api/auth/google/callback` — receives authorization code, exchanges for tokens via `google-auth-library`, verifies id_token, extracts claims
- At this stage: creates session with Google tokens + user info, but does NOT create/update profile in Supabase (that's story 2.2)
- `POST /api/auth/logout` — destroys session, clears cookie
- `GET /api/auth/me` — returns `{ data: { user: { id, email, displayName, avatarUrl, role } } }` if session exists, `{ data: { user: null } }` if not
- All Google secrets stay server-side. Client never receives tokens.

**Acceptance criteria:**
- **Given** a visitor clicks "Sign in with Google", **when** the redirect to `/api/auth/google` completes, **then** the browser redirects to Google's OAuth consent screen
- **Given** a user completes Google authentication, **when** Google redirects back to `/api/auth/google/callback`, **then** a server-side session is created with an HTTP-only cookie
- **Given** a user has an active session, **when** `GET /api/auth/me` is called, **then** it returns the user's Google profile data from the session
- **Given** no active session exists, **when** `GET /api/auth/me` is called, **then** it returns `{ data: { user: null } }` (not an error)
- **Given** a user clicks logout, **when** `POST /api/auth/logout` is called, **then** the session is destroyed and the cookie is cleared
- **Given** the OAuth flow fails (user cancels, Google returns error), **when** the callback is reached, **then** the server redirects to `/` with no session created
- **Given** `GOOGLE_CLIENT_SECRET` is configured, **when** the client bundle is inspected, **then** the secret does not appear in any client-side JavaScript

**Dependencies:** Story 1.2 (session middleware, env config, Supabase client, Google OAuth client configured)

**Files likely touched:**
- `/server/src/routes/auth.js` (new)
- `/server/src/app.js` (mount auth router)

**Out of scope:** Profile creation in Supabase (Story 2.2). No UI changes — routes are server-side only. No token refresh logic yet (added in Story 3.8 when Classroom API needs it).

### Story 2.2: Profile service with admin bootstrap

As a new user signing in for the first time,
I want my profile automatically created in the system,
So that I don't need to fill out a registration form.

**User value:** Zero-friction onboarding. Sign in with Google and you exist in the system.

**Scope:** Server-side profile upsert logic that creates/updates profiles on sign-in, with admin bootstrap for the first user.

**Technical notes:**
- `server/src/services/profileService.js` — `upsertProfile()`, `getUserById()` functions per architecture patterns
- Admin bootstrap: first row in `profiles` table gets `role = 'admin'`. Subsequent new users default to `role = 'student'` (DB default)
- Returning users: email, display_name, avatar_url updated from latest Google data. Role is never overwritten
- Called from the auth callback route (Story 2.1) after token verification
- `GET /api/auth/me` updated to fetch full profile from Supabase (not just Google session data)

**Acceptance criteria:**
- **Given** the profiles table is empty, **when** a user signs in with Google for the first time, **then** a profile row is created with `role = 'admin'`, `google_sub` matching the Google user ID, and email/display_name/avatar_url from Google
- **Given** at least one profile exists, **when** a second user signs in for the first time, **then** their profile is created with `role = 'student'`
- **Given** a user signed in previously, **when** they sign in again after changing their Google display name, **then** their `display_name` is updated but their `role` remains unchanged
- **Given** the profiles insert fails (e.g., DB unavailable), **when** the auth callback runs, **then** the user is not left in a partially-authenticated state and a clear error is returned

**Dependencies:** Story 2.1 (OAuth routes exist, session created with Google tokens)

**Files likely touched:**
- `/server/src/services/profileService.js` (new)
- `/server/src/routes/auth.js` (update callback to call profileService)

**Out of scope:** Role changes (Epic 4), profile editing, avatar upload. No client-side profile page.

### Story 2.3: Auth and role middleware

As the platform,
I want every protected API route to verify the user's session and role,
So that unauthorized access is blocked at the server level, not just the UI.

**User value:** Security foundation. Protects all future features.

**Scope:** `requireAuth` and `requireRole` middleware functions, applied to route definitions.

**Technical notes:**
- `server/src/middleware/auth.js` — `requireAuth`: checks `req.session.userId`, returns 401 if missing
- `server/src/middleware/role.js` — `requireRole(...allowedRoles)`: checks `req.session.role`, returns 403 if not in allowed list
- Apply to a test protected route to verify the chain works: `GET /api/auth/me` already returns user data (Story 2.1), add a protected test route or verify the middleware is ready for use in epics 3-4

**Acceptance criteria:**
- **Given** no active session, **when** any protected route is called, **then** the server returns 401 with `{ error: { code: "UNAUTHORIZED", message: "Sign in required." } }`
- **Given** a user with `student` role, **when** a route protected by `requireRole('teacher', 'admin')` is called, **then** the server returns 403 with `{ error: { code: "FORBIDDEN", message: "You do not have permission to perform this action." } }`
- **Given** a user with `teacher` role, **when** a route protected by `requireRole('teacher', 'admin')` is called, **then** the request proceeds to the route handler
- **Given** a user with `admin` role, **when** a route protected by `requireRole('teacher', 'admin')` is called, **then** the request proceeds to the route handler (admin inherits teacher access)

**Dependencies:** Story 2.2 (profiles exist with roles), Story 2.1 (sessions exist)

**Files likely touched:**
- `/server/src/middleware/auth.js` (new)
- `/server/src/middleware/role.js` (new)
- `/server/src/routes/auth.js` (apply middleware to /me if desired)
- `/server/src/app.js` (no changes — middleware applied per-route, not globally)

**Out of scope:** Client-side route guards (Story 2.5). Applying middleware to specific routes — that happens in each feature story (Epics 3-4).

### Story 2.4: AuthContext and client login flow

As a visitor,
I want a seamless Google sign-in experience from the UI,
So that I can sign in and see my dashboard without page refreshes or confusion.

**User value:** The sign-in flow feels natural. Users know their authentication state at all times.

**Scope:** AuthContext provider, useAuth hook, and wiring the "Sign in with Google" button to the OAuth flow.

**Technical notes:**
- `client/src/context/AuthContext.jsx` — per architecture pattern: `user`, `isLoading`, `isAuthenticated`, role boolean getters, `logout()`
- `client/src/hooks/useAuth.js` — convenience hook
- `client/src/api/auth.js` — `getMe()` calls `GET /api/auth/me`, `logout()` calls `POST /api/auth/logout`
- Header "Sign in with Google" button → `window.location.href = '/api/auth/google'` (full-page redirect, not fetch)
- AuthContext calls `getMe()` on mount to restore session on page reload
- While loading, show `LoadingSpinner`. Once loaded, children render.

**Acceptance criteria:**
- **Given** the app loads and no session exists, **when** AuthContext initializes, **then** `user` is `null`, `isLoading` transitions from `true` to `false`, and `isAuthenticated` is `false`
- **Given** an active session exists, **when** the app loads, **then** `user` contains `{ id, email, displayName, avatarUrl, role }` and `isAuthenticated` is `true`
- **Given** a visitor clicks "Sign in with Google", **when** the button is clicked, **then** the browser redirects to `/api/auth/google` (initiating the OAuth flow)
- **Given** a signed-in user clicks "Sign out", **when** logout completes, **then** `user` becomes `null` and `isAuthenticated` becomes `false`
- **Given** the AuthContext is loading, **when** children components render, **then** a LoadingSpinner is shown instead of content that depends on auth state

**Dependencies:** Story 2.1 (auth routes exist), Story 1.3 (Header component with button placeholder, layout components)

**Files likely touched:**
- `/client/src/context/AuthContext.jsx` (new)
- `/client/src/hooks/useAuth.js` (new)
- `/client/src/api/auth.js` (new)
- `/client/src/components/layout/Header.jsx` (wire sign-in/sign-out buttons)
- `/client/src/main.jsx` (wrap App in AuthProvider)
- `/client/src/api/client.js` (may need updates for auth headers — but sessions use cookies, so `credentials: 'include'` is sufficient)

**Out of scope:** Role-gated routing (Story 2.5). Dashboard content (Epics 3-4). Profile page. Token refresh UI.

### Story 2.5: Role-gated routing and dashboard layout shells

As a signed-in user,
I want to be routed to the correct dashboard for my role and see a navigation that matches my permissions,
So that I always know where I am and what I can do.

**User value:** Each user type sees their own space. Students don't see teacher controls. Teachers don't see admin panels.

**Scope:** DashboardLayout component, RequireAuth component, role-based route definitions in App.jsx, dashboard page shells for each role.

**Technical notes:**
- `client/src/components/RequireAuth.jsx` — checks `isAuthenticated`, redirects to `/` if not; optionally checks `roles` array
- `client/src/components/layout/DashboardLayout.jsx` — Header (role-aware) + sidebar (role-aware nav links) + `<main>`
- Dashboard shells: `StudentDashboard.jsx`, `TeacherDashboard.jsx`, `AdminDashboard.jsx` — each renders within `DashboardLayout` with role-appropriate heading and empty state ("Your courses will appear here" etc.)
- App.jsx route definitions with role enforcement per architecture section
- After Google OAuth callback, server redirects to the correct dashboard path (update Story 2.1 callback)

**Acceptance criteria:**
- **Given** a user with role `student` signs in, **when** auth completes, **then** they are redirected to `/dashboard` and see the Student Dashboard shell with student-specific navigation
- **Given** a user with role `teacher` signs in, **when** auth completes, **then** they are redirected to `/dashboard/teacher` and see the Teacher Dashboard shell with "Create Course" in the nav
- **Given** a user with role `admin` signs in, **when** auth completes, **then** they are redirected to `/dashboard/admin` and see navigation with "Users", "Courses", and all teacher nav items
- **Given** a signed-in student, **when** they try to navigate to `/dashboard/teacher` directly, **then** the frontend redirects them to `/dashboard`
- **Given** an unauthenticated visitor, **when** they try to navigate to `/dashboard`, **then** they are redirected to `/`
- **Given** a signed-in user, **when** the sidebar navigation renders, **then** only links permitted for their role are visible
- **Given** a signed-in student, **when** they view their dashboard, **then** they see an empty state message indicating content will come from course enrollment

**Dependencies:** Story 2.4 (AuthContext exists). Story 2.3 (middleware ready — server redirect after auth uses it). Story 1.3 (layout components).

**Files likely touched:**
- `/client/src/components/RequireAuth.jsx` (new)
- `/client/src/components/layout/DashboardLayout.jsx` (new)
- `/client/src/pages/dashboard/student/StudentDashboard.jsx` (new — shell)
- `/client/src/pages/dashboard/teacher/TeacherDashboard.jsx` (new — shell)
- `/client/src/pages/dashboard/admin/AdminDashboard.jsx` (new — shell)
- `/client/src/App.jsx` (add protected routes)
- `/server/src/routes/auth.js` (update callback redirect to role-based path)

**Out of scope:** Dashboard content — shells only. Actual course lists, enrollment data, user management come in Epics 3 and 4. Sidebar is functional but minimal.

## Epic 3: Courses, Enrollment & Google Classroom

Teachers create and publish courses. Students browse, request enrollment, and get approved. Students access Google Classroom from a single dashboard. Teachers link courses to Google Classroom and manage enrollments. The school works.

### Story 3.1: Course CRUD server routes and service

As a teacher,
I want to create, edit, and manage courses through the API,
So that I can build my course catalog.

**User value:** Teachers can create courses — the core content of the school.

**Scope:** Full course CRUD API with ownership model.

**Technical notes:**
- `server/src/services/courseService.js` — `getPublishedCourses()`, `getCourseById()`, `getCoursesByTeacher()`, `createCourse()`, `updateCourse()` per architecture patterns
- `server/src/routes/courses.js` — public routes (no auth) + protected routes (teacher/admin):
  - `GET /api/courses` — public, returns published courses with teacher name
  - `GET /api/courses/:courseId` — public, single course detail
  - `GET /api/courses/manage` — teacher/admin, returns courses owned by authenticated teacher
  - `POST /api/courses` — teacher/admin, create with title/description/skillLevel/coverImageUrl
  - `PUT /api/courses/:courseId` — owner or admin, update fields including status (draft/published)
- Ownership check: teacher can only edit their own courses; admin can edit any (FR-8, FR-16)
- Validation: title and description required; skillLevel defaults to 'all_levels'; status toggles between 'draft' and 'published'
- CamelCase → snake_case field mapping in the route handler

**Acceptance criteria:**
- **Given** a teacher is authenticated, **when** `POST /api/courses` with `{ title: "Ableton Basics", description: "..." }` is called, **then** a course is created with `status = 'draft'` and `teacher_id` matching the session user
- **Given** a course exists in draft status, **when** `PUT /api/courses/:id` with `{ status: "published" }` is called, **then** the course status changes to `published` and it appears in the public catalog
- **Given** a teacher owns a course, **when** `GET /api/courses/manage` is called, **then** only that teacher's courses are returned, not other teachers' courses
- **Given** a teacher tries to edit another teacher's course, **when** `PUT /api/courses/:otherId` is called, **then** the server returns 403 FORBIDDEN
- **Given** an admin tries to edit any course, **when** `PUT /api/courses/:anyId` is called, **then** the update succeeds (admin may edit any course)
- **Given** no title or description, **when** `POST /api/courses` is called, **then** the server returns 400 with VALIDATION_ERROR

**Dependencies:** Story 2.3 (middleware exists). Story 1.2 (Supabase client, session). Story 1.1 (database schema).

**Files likely touched:**
- `/server/src/services/courseService.js` (new)
- `/server/src/routes/courses.js` (update — add protected routes; public routes from Story 1.5 already exist)
- `/server/src/app.js` (no change — courses router already mounted in Story 1.5)

**Out of scope:** Classroom linking (Story 3.8). Enrollment routes (Story 3.4). Client-side course forms (Story 3.3).

### Story 3.2: Teacher dashboard — course list

As a teacher,
I want to see all my courses on my dashboard with their status,
So that I can manage my teaching from one place.

**User value:** Teachers have a home base where they see everything they're teaching.

**Scope:** TeacherDashboard content — fetches and displays the teacher's courses with status badges and action links.

**Technical notes:**
- `client/src/api/courses.js` — add `fetchMyCourses()` calling `GET /api/courses/manage`
- `TeacherDashboard.jsx` — per dashboard page pattern: fetch → loading → error → empty → list
- Each course card shows: title, status badge (draft/published), Classroom link status (linked/not linked), enrollment count placeholder
- Links: click course → `/dashboard/teacher/courses/:id` (CourseManagePage built in Story 3.3)
- "Create Course" button prominent on the dashboard
- Empty state: "You haven't created any courses yet."

**Acceptance criteria:**
- **Given** a teacher with no courses signs in, **when** the teacher dashboard loads, **then** an EmptyState is shown with "Create Course" action
- **Given** a teacher with published and draft courses signs in, **when** the dashboard loads, **then** all their courses are listed with correct status badges (green for published, gray for draft)
- **Given** the dashboard is loading course data, **when** the request is in flight, **then** a LoadingSpinner is displayed
- **Given** the server returns an error, **when** the dashboard fetches data, **then** an ErrorMessage is displayed

**Dependencies:** Story 3.1 (courses API), Story 2.5 (TeacherDashboard shell exists), Story 2.4 (AuthContext)

**Files likely touched:**
- `/client/src/api/courses.js` (add fetchMyCourses)
- `/client/src/pages/dashboard/teacher/TeacherDashboard.jsx` (fill from shell)

**Out of scope:** Course creation form (Story 3.3), enrollment review section (Story 3.6), Classroom linking UI (Story 3.8).

### Story 3.3: Course creation and edit forms

As a teacher,
I want a form to create and edit courses,
So that I can publish new offerings without touching the database.

**User value:** Teachers can self-serve course creation. The catalog grows without developer intervention.

**Scope:** CourseFormPage (create mode + edit mode) and CourseManagePage (edit course + Classroom linking placeholder).

**Technical notes:**
- `CourseFormPage.jsx` — form component per architecture pattern: title, description, skillLevel dropdown, coverImageUrl. Works in create mode (`/dashboard/teacher/courses/new`) and edit mode (pre-populated fields)
- `CourseManagePage.jsx` — edit form + Classroom linking section (placeholder for Story 3.8) + status toggle (draft ↔ published)
- `client/src/api/courses.js` — add `createCourse(data)` and `updateCourse(id, data)`
- Form validation: title required, description required. Client-side + server-side (already built in Story 3.1)
- On successful create: navigate to `/dashboard/teacher/courses/:newId`
- On successful update: show confirmation, stay on page

**Acceptance criteria:**
- **Given** a teacher is on the "Create Course" page, **when** they fill in title, description, select "Intermediate", and click Save, **then** a new course is created and they are redirected to the course management page
- **Given** a teacher is on the "Create Course" page, **when** they submit with an empty title, **then** a validation error is displayed and the form is not submitted
- **Given** a teacher owns a course, **when** they edit the description and click Save, **then** the course is updated and a confirmation is shown
- **Given** a teacher is editing a course, **when** they toggle status from "Draft" to "Published", **then** the course becomes visible in the public catalog
- **Given** a teacher is editing a course, **when** they change the skill level from "Beginner" to "Advanced", **then** the course detail page reflects the new skill level

**Dependencies:** Story 3.1 (courses API), Story 3.2 (TeacherDashboard with navigation), Story 2.5 (DashboardLayout)

**Files likely touched:**
- `/client/src/api/courses.js` (add createCourse, updateCourse)
- `/client/src/pages/dashboard/teacher/CourseFormPage.jsx` (new)
- `/client/src/pages/dashboard/teacher/CourseManagePage.jsx` (new)
- `/client/src/pages/dashboard/teacher/TeacherDashboard.jsx` (link to form pages)
- `/client/src/App.jsx` (add form/manage routes)

**Out of scope:** Classroom linking UI (Story 3.8), image upload (cover_image_url is a URL text input, not file upload), rich text editor (description is plain text).

### Story 3.4: Enrollment request server routes and service

As a student,
I want to request enrollment in a course through the API,
So that I can express interest and be considered for the class.

**User value:** The enrollment pipeline exists. Students can ask to join; teachers can review.

**Scope:** Enrollment service with state machine enforcement, enrollment API routes: request, list, approve, reject.

**Technical notes:**
- `server/src/services/enrollmentService.js` — per architecture patterns:
  - `requestEnrollment(studentId, courseId)` — verifies course is published, upserts with status='pending' (handles retryable rejection)
  - `getEnrollmentsForStudent(studentId)` — returns enrollments with joined course + teacher data
  - `getPendingEnrollments(teacherId)` — returns pending enrollments for courses owned by teacher
  - `approveEnrollment(enrollmentId, reviewerId)` / `rejectEnrollment()` — state machine enforces only pending→approved/rejected
- `server/src/routes/enrollments.js`:
  - `POST /api/enrollments` — student: `{ courseId }` → creates/retries enrollment
  - `GET /api/enrollments/mine` — student: returns all enrollments with course + teacher data
  - `GET /api/enrollments/pending` — teacher/admin: pending requests for their courses
  - `POST /api/enrollments/:id/approve` — teacher(owner)/admin: approve
  - `POST /api/enrollments/:id/reject` — teacher(owner)/admin: reject
- Idempotent requests: second request for same course returns existing enrollment status
- Rejected retryable: re-requesting a rejected enrollment resets to pending

**Acceptance criteria:**
- **Given** a student is authenticated, **when** `POST /api/enrollments` with a valid published `courseId` is called, **then** an enrollment record with `status = 'pending'` is created
- **Given** a student already has a pending enrollment for a course, **when** they request enrollment again, **then** the existing pending enrollment is returned (idempotent)
- **Given** a student's enrollment was rejected, **when** they request enrollment again for the same course, **then** the status resets to `pending` (retryable)
- **Given** a teacher is reviewing a pending enrollment for their course, **when** `POST /api/enrollments/:id/approve` is called, **then** the status changes to `approved`
- **Given** an enrollment is already approved, **when** `POST /api/enrollments/:id/approve` is called again, **then** it returns the existing approved enrollment (idempotent, no error)
- **Given** a student tries to enroll in a draft course, **when** `POST /api/enrollments` is called, **then** the server returns 400 with an error
- **Given** a teacher tries to approve an enrollment for another teacher's course, **when** the approve endpoint is called, **then** the server returns 403
- **Given** an admin tries to approve any enrollment, **when** the approve endpoint is called, **then** the approval succeeds

**Dependencies:** Story 3.1 (courses API — need course data to check published status). Story 2.3 (middleware). Story 1.1 (enrollments table exists).

**Files likely touched:**
- `/server/src/services/enrollmentService.js` (new)
- `/server/src/routes/enrollments.js` (new)
- `/server/src/app.js` (mount enrollments router)

**Out of scope:** Client-side enrollment UI (Story 3.5). Enrollment review UI (Story 3.6). No email notifications for status changes (deferred to v2).

### Story 3.5: Enrollment request from course catalog

As a student browsing the catalog,
I want to request enrollment in a course,
So that I can join a class that interests me.

**User value:** Students can act on their interest. The enrollment flow is complete from the student's perspective.

**Scope:** Enrollment button on CourseDetailPage, enrollment API client functions, handling of auth-gating.

**Technical notes:**
- `client/src/api/enrollments.js` — `requestEnrollment(courseId)` calling `POST /api/enrollments`
- CourseDetailPage updated: "Request Enrollment" button visible for published courses
- If not authenticated: click triggers redirect to Google sign-in. After auth callback, server redirects to dashboard (not back to catalog). Acceptable for MVP — student can navigate back to catalog.
- If already enrolled (any status): button shows current status — "Pending Approval", "Enrolled" (with Classroom link), "Request Denied — try again"
- After successful request: button changes to "Pending Approval" with a confirmation message
- Follow the dashboard page pattern: fetch enrollment status on mount, loading/error/empty states

**Acceptance criteria:**
- **Given** a published course and an unauthenticated visitor, **when** they click "Request Enrollment", **then** they are redirected to sign in with Google
- **Given** a published course and an authenticated student with no enrollment, **when** they click "Request Enrollment", **then** an enrollment is created and the button shows "Pending Approval"
- **Given** a student already has a pending enrollment, **when** they view the course detail page, **then** the button shows "Pending Approval" and is disabled
- **Given** a student has an approved enrollment, **when** they view the course detail page, **then** the button shows "Enrolled" and the Google Classroom link is displayed
- **Given** a student has a rejected enrollment, **when** they view the course detail page, **then** the button shows "Request Denied — try again" and is clickable to re-request

**Dependencies:** Story 3.4 (enrollment API). Story 1.5 (CourseDetailPage exists). Story 2.4 (AuthContext). Story 2.5 (routing).

**Files likely touched:**
- `/client/src/api/enrollments.js` (new)
- `/client/src/pages/public/CourseDetailPage.jsx` (add enrollment button + logic)

**Out of scope:** Post-sign-in redirect back to the course (returns to dashboard — acceptable MVP tradeoff). Enrollment list in student dashboard (Story 3.7).

### Story 3.6: Enrollment review on teacher dashboard

As a teacher,
I want to see and act on enrollment requests for my courses,
So that I can approve students who should join my class.

**User value:** Teachers can manage their class roster. The enrollment loop is closed.

**Scope:** Enrollment review section on TeacherDashboard, approve/reject API client functions.

**Technical notes:**
- `client/src/api/enrollments.js` — add `fetchPendingEnrollments()`, `approveEnrollment(id)`, `rejectEnrollment(id)`
- TeacherDashboard updated with "Enrollment Requests" section below course list
- Each pending request shows: student display name, student email, course title, requested date
- "Approve" and "Reject" buttons per request
- After action: button area shows result (checkmark for approved, X for rejected), then row fades
- Section is collapsible or below course list — not the primary dashboard view
- Admin can also access — admin dashboard gets this same section (they inherit teacher nav)

**Acceptance criteria:**
- **Given** a teacher has pending enrollment requests, **when** they view their dashboard, **then** each request shows the student's name, email, course title, and request date
- **Given** a teacher clicks "Approve" on a pending request, **when** the API call succeeds, **then** the request shows as approved and the student can now see the Classroom link on their dashboard
- **Given** a teacher clicks "Reject" on a pending request, **when** the API call succeeds, **then** the request shows as rejected and the student sees "Request Denied — try again" on the catalog
- **Given** a teacher has no pending requests, **when** they view their dashboard, **then** the enrollment review section shows "No pending requests" or is hidden
- **Given** an admin views their dashboard, **when** they navigate to the enrollment review section, **then** they see pending requests for all courses (not just their own)

**Dependencies:** Story 3.4 (enrollment API), Story 3.2 (TeacherDashboard), Story 2.5 (AdminDashboard shell for admin access)

**Files likely touched:**
- `/client/src/api/enrollments.js` (add review functions)
- `/client/src/pages/dashboard/teacher/TeacherDashboard.jsx` (add enrollment review section)
- `/client/src/pages/dashboard/admin/AdminDashboard.jsx` (add enrollment review section, admin sees all)

**Out of scope:** Batch approve/reject. Filtering or sorting enrollment requests. Notification to student (deferred v2).

### Story 3.7: Student dashboard — enrollments and Classroom links

As a student,
I want to see all my enrolled courses and access the Google Classroom for each,
So that I can attend class without hunting for links.

**User value:** The student's home base. One dashboard = all courses + one-click Classroom access. This is the main student-facing value proposition.

**Scope:** StudentDashboard content — enrollment list with status badges and Classroom link buttons.

**Technical notes:**
- `client/src/api/enrollments.js` — add `fetchMyEnrollments()` calling `GET /api/enrollments/mine`
- StudentDashboard per the architecture pattern: fetch → loading → error → empty → list
- Each enrollment card shows: course title, teacher name, skill level badge, enrollment status badge
- Approved enrollments: display a prominent "Open Google Classroom" button linking to `classroom_url` (opens in new tab)
- Pending enrollments: "Pending Approval" badge, no Classroom link
- Rejected enrollments: "Request Denied" badge with note "You can try again"
- Empty state: "You haven't enrolled in any courses yet. [Browse Catalog]"

**Acceptance criteria:**
- **Given** a student with approved enrollments signs in, **when** their dashboard loads, **then** each approved course shows title, teacher name, and a working "Open Google Classroom" button that opens the Classroom URL in a new tab
- **Given** a student has a pending enrollment, **when** their dashboard loads, **then** the course shows a "Pending Approval" badge and no Classroom link
- **Given** a student has a rejected enrollment, **when** their dashboard loads, **then** the course shows a "Request Denied" badge with a note that they can try again
- **Given** a student with no enrollments, **when** their dashboard loads, **then** an EmptyState is shown with a link to the catalog
- **Given** a student's enrollment was just approved, **when** they refresh their dashboard, **then** the Classroom link appears without requiring re-authentication

**Dependencies:** Story 3.4 (enrollment API). Story 3.5 (enrollment requests can be created). Story 2.5 (StudentDashboard shell). Story 2.4 (AuthContext).

**Files likely touched:**
- `/client/src/api/enrollments.js` (add fetchMyEnrollments)
- `/client/src/pages/dashboard/student/StudentDashboard.jsx` (fill from shell)

**Out of scope:** Inline Meet link display (students click through to Classroom per FR-17). Course progress or grade data. Direct Drive file browsing.

### Story 3.8: Google Classroom validation and course linking

As a teacher,
I want to link my course to a Google Classroom by entering the Classroom ID,
So that students get one-click access to the actual class.

**User value:** The core architectural differentiator. Classroom linking connects the portal to the teaching engine.

**Scope:** Classroom validation service, link/unlink API route, Classroom linking UI on CourseManagePage.

**Technical notes:**
- `server/src/services/classroomService.js` — `validateClassroom(classroomId, accessToken)` per architecture pattern
  - Extracts ID from raw ID or full URL
  - Calls `GET https://classroom.googleapis.com/v1/courses/{id}` with teacher's OAuth token
  - Returns `{ valid, classroomId, classroomUrl, name }` or `{ valid: false, reason }`
  - Handles 404 (not found), 403 (no access), timeouts (>5s)
- `PUT /api/courses/:courseId/classroom` — accepts `{ classroomId }`, calls validateClassroom, stores `classroom_id` and `classroom_url` on course record
- Teacher's OAuth token extracted from `req.session.googleTokens.access_token`
- Token refresh: check expiry before Classroom API call; if expired, use refresh_token
- Google OAuth scope `classroom.courses.readonly` — if teacher doesn't have it, return specific error: "Classroom access not authorized. Please sign in again to grant permission."
- Client: `CourseManagePage.jsx` — Classroom linking section with text input + "Link Classroom" button
- Client: `client/src/api/courses.js` — add `linkClassroom(courseId, classroomId)`

**Acceptance criteria:**
- **Given** a teacher enters a valid Classroom ID for a class they teach, **when** they click "Link Classroom", **then** the server validates it via the Classroom API, stores the classroom_id and classroom_url, and shows success with the Classroom name
- **Given** a teacher enters an invalid Classroom ID, **when** they click "Link Classroom", **then** they see "Classroom not found. Verify the ID."
- **Given** a teacher enters a Classroom ID for a class they don't have access to, **when** they click "Link Classroom", **then** they see "You do not have access to this Classroom. Ensure you are a teacher in that class."
- **Given** the Google Classroom API is unreachable, **when** the teacher clicks "Link Classroom", **then** after 5 seconds they see "Google Classroom is temporarily unavailable. Try again in a few minutes."
- **Given** a course is already linked to a Classroom, **when** the teacher links a different Classroom, **then** the old link is replaced with the new one
- **Given** a teacher's Google access token has expired, **when** they attempt to link a Classroom, **then** the server silently refreshes the token and proceeds — the teacher doesn't notice the refresh
- **Given** a teacher links a Classroom, **when** an approved student views their dashboard (Story 3.7), **then** the Classroom link button works and opens the correct Classroom
- **Given** the teacher's Google OAuth token refresh fails, **when** they attempt to link a Classroom, **then** the server returns 401 and the teacher is prompted to sign in again

**Dependencies:** Story 3.1 (courses API). Story 3.3 (CourseManagePage exists with Classroom section placeholder). Story 2.1 (Google OAuth tokens stored in session).

**Files likely touched:**
- `/server/src/services/classroomService.js` (new)
- `/server/src/routes/courses.js` (add PUT /:courseId/classroom route)
- `/client/src/api/courses.js` (add linkClassroom)
- `/client/src/pages/dashboard/teacher/CourseManagePage.jsx` (fill Classroom linking section)

**Out of scope:** Programmatic Classroom creation via API. Roster sync between portal and Classroom. Fetching Meet link from Classroom API (students click through). Displaying Classroom stream or assignments inline in the portal.

## Epic 4: Admin Operations

Admin sees all users, changes roles, views all courses, and manages the platform. The school is managed.

### Story 4.1: Admin server routes — users and courses

As an admin,
I want API endpoints to list all users, change roles, and see all courses,
So that I can manage the platform without touching the database directly.

**User value:** Admin operations are API-driven, not database-driven. All management goes through the same secure API layer.

**Scope:** Admin API routes for user listing, role changes, and course overview.

**Technical notes:**
- `server/src/routes/admin.js`:
  - `GET /api/admin/users` — returns all profiles (id, email, display_name, role, created_at). Admin only.
  - `PUT /api/admin/users/:userId/role` — changes role. Body: `{ role: "teacher" }`. Admin only.
  - `GET /api/admin/courses` — returns all courses with teacher display_name, regardless of owner. Admin only.
- `server/src/services/profileService.js` — add `getAllUsers()`, `changeUserRole(userId, newRole)` with last-admin guard per architecture pattern
- `server/src/services/courseService.js` — add `getAllCourses()` (admin override — no teacher_id filter)
- Last-admin guard: cannot demote the sole admin. Returns 400 with message.
- All routes protected with `requireAuth` + `requireRole('admin')`

**Acceptance criteria:**
- **Given** an admin is authenticated, **when** `GET /api/admin/users` is called, **then** all profiles are returned with id, email, display_name, role, and created_at
- **Given** an admin changes a user's role from `student` to `teacher`, **when** `PUT /api/admin/users/:id/role` is called with `{ role: "teacher" }`, **then** the user's role is updated and the response returns the updated profile
- **Given** there is only one admin, **when** an admin tries to demote themselves to `teacher`, **then** the server returns 400 with "Cannot remove the last admin. Promote another user to admin first."
- **Given** a non-admin user (student or teacher), **when** any `/api/admin/*` route is called, **then** the server returns 403 FORBIDDEN
- **Given** an admin is authenticated, **when** `GET /api/admin/courses` is called, **then** all courses are returned regardless of owner
- **Given** a user ID does not exist, **when** `PUT /api/admin/users/:badId/role` is called, **then** the server returns 404 NOT_FOUND

**Dependencies:** Story 2.3 (middleware). Story 2.2 (profileService exists). Story 3.1 (courseService exists).

**Files likely touched:**
- `/server/src/services/profileService.js` (add getAllUsers, changeUserRole)
- `/server/src/services/courseService.js` (add getAllCourses)
- `/server/src/routes/admin.js` (new)
- `/server/src/app.js` (mount admin router)

**Out of scope:** User deletion. User creation (only via Google sign-in). Admin activity audit log. Batch operations.

### Story 4.2: Admin dashboard — user list and role management

As an admin,
I want to see all users and change their roles from a dashboard,
So that I can onboard new teachers and manage access without code.

**User value:** Admin can run the school from the UI. This is the primary admin workflow.

**Scope:** AdminDashboard content — user list with role change controls.

**Technical notes:**
- `client/src/api/admin.js` — `fetchUsers()`, `changeUserRole(userId, role)` calling admin API routes
- `AdminDashboard.jsx` — user table/list: display_name, email, current role badge, role change dropdown/buttons
- Role change UX: dropdown or button group to select new role, confirm action (simple click, no dialog needed for MVP)
- After role change: row updates immediately with new role badge
- Last-admin guard UX: if the change fails due to last-admin protection, show the server error message
- Dashboard also includes enrollment review section (built in Story 3.6, admin sees all)
- Follow dashboard page pattern: loading → error → data

**Acceptance criteria:**
- **Given** an admin signs in, **when** their dashboard loads, **then** all users are listed with display name, email, and current role
- **Given** an admin clicks "Make Teacher" on a student user, **when** the API call succeeds, **then** the user's role badge updates to "teacher"
- **Given** an admin tries to demote the last admin, **when** the API returns an error, **then** the error message "Cannot remove the last admin..." is displayed
- **Given** the user list is loading, **when** data is being fetched, **then** a LoadingSpinner is displayed
- **Given** the server returns an error, **when** the admin dashboard fetches data, **then** an ErrorMessage is displayed

**Dependencies:** Story 4.1 (admin API routes). Story 2.5 (AdminDashboard shell). Story 3.6 (enrollment review component — admin inherits it).

**Files likely touched:**
- `/client/src/api/admin.js` (new)
- `/client/src/pages/dashboard/admin/AdminDashboard.jsx` (fill from shell)

**Out of scope:** User profile editing beyond role changes. User creation. Sorting, filtering, pagination of user list. Bulk operations.

### Story 4.3: Admin courses overview

As an admin,
I want to see all courses in the system,
So that I can oversee the full catalog regardless of which teacher owns each course.

**User value:** Admin has full visibility into the school's course offerings.

**Scope:** AdminCoursesPage — all-courses view with course details and owner information.

**Technical notes:**
- `client/src/api/admin.js` — add `fetchAllCourses()` calling `GET /api/admin/courses`
- `AdminCoursesPage.jsx` — course table/list: title, owner name, status badge, Classroom link status, enrollment count (placeholder or from enrollment count query)
- Click through to course detail (read-only or edit — admin can edit per FR-16, so link to CourseManagePage would work, or a read-only variant)
- Dashboard pattern: loading → error → data

**Acceptance criteria:**
- **Given** an admin signs in, **when** they navigate to "Courses" in the dashboard, **then** all courses from all teachers are listed with title, owner, status, and Classroom link status
- **Given** no courses exist, **when** the admin views the courses page, **then** an EmptyState is shown
- **Given** a course is listed, **when** the admin clicks it, **then** they can view or edit the course details
- **Given** the courses page is loading, **when** data is being fetched, **then** a LoadingSpinner is displayed

**Dependencies:** Story 4.1 (admin API routes). Story 2.5 (AdminDashboard with nav to courses). Story 3.3 (CourseManagePage — can reuse for admin editing).

**Files likely touched:**
- `/client/src/api/admin.js` (add fetchAllCourses)
- `/client/src/pages/dashboard/admin/AdminCoursesPage.jsx` (new)
- `/client/src/App.jsx` (add admin courses route)

**Out of scope:** Course deletion. Advanced filtering. Course analytics or metrics.
