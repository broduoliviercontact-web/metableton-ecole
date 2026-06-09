# Session Handoff — Metableton Ecole

**Date:** 2026-06-09
**Branch:** main

---

## Project

**metableton-ecole** — Online music school portal for modern music creation, built on top of Google Classroom.

---

## Completed BMAD artifacts

| Artifact | Path |
|---|---|
| Product brief | `_bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md` |
| PRD | `_bmad-output/planning-artifacts/prds/prd-metableton-ecole-2026-06-09/prd.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| Epics & stories | `_bmad-output/planning-artifacts/epics.md` |

---

## Completed stories

| Story | Description | Status |
|---|---|---|
| 1.1 | Project scaffolding + Supabase database | ✅ |
| 1.2 | Express server foundation + session middleware | ✅ |
| 1.3 | Client shell — Vite, Tailwind, layout + UI components | ✅ |
| 1.4 | Public homepage | ✅ |
| 1.5 | Static course catalog + detail pages | ✅ |
| 2.1 | Google OAuth server routes | ✅ |
| 2.2 | Profile service with admin bootstrap | ✅ |
| 2.3 | Auth + role middleware | ✅ |

**8 of 21 stories complete. Epics 1 complete. Epic 2 in progress (3/5).**

---

## Current next story

**Story 2.4 — AuthContext and client login flow**

Create:
- `client/src/context/AuthContext.jsx` — `{ user, isLoading, isAuthenticated, logout }`
- `client/src/hooks/useAuth.js` — convenience hook
- `client/src/api/auth.js` — `getMe()`, `logout()`
- `client/src/api/client.js` — fetch wrapper with `credentials: 'include'`

Modify:
- `client/src/main.jsx` — wrap App in AuthProvider
- `client/src/components/layout/Header.jsx` — wire sign-in button to `/api/auth/google`

Out of scope: role-gated routing (Story 2.5), RequireAuth (Story 2.5), dashboard content (Epics 3-4).

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

## Important instructions

- **Continue one story at a time** — do not start multiple stories at once
- **Do not rewrite completed work** unless explicitly asked
- **Verify acceptance criteria** before marking a story complete
- **Do not modify the database schema** unless the story explicitly requires it
- **Keep the server `.env` out of version control** — `.gitignore` already covers it

---

## Exact next prompt

```
Continue with Story 2.4 — AuthContext and client login flow.

Implement:
- client/src/context/AuthContext.jsx
- client/src/hooks/useAuth.js
- client/src/api/auth.js
- client/src/api/client.js
- Update client/src/main.jsx to wrap App in AuthProvider
- Update Header.jsx to wire the sign-in button to /api/auth/google

Acceptance criteria:
- AuthContext calls GET /api/auth/me on mount to restore session
- user is null when logged out, contains { userId, role } when logged in
- isLoading transitions from true to false after initial check
- "Sign in with Google" button redirects to /api/auth/google
- Logout calls POST /api/auth/logout and clears user state
- LoadingSpinner shown while auth state is loading
- npm run build passes
- No unrelated features added
```
