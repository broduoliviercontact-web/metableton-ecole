# Graph Report - metableton-ecole  (2026-06-11)

## Corpus Check
- 112 files · ~57,360 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 625 nodes · 777 edges · 68 communities (32 shown, 36 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e93b6af2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 27 edges
2. `apiClient()` - 25 edges
3. `Session Handoff — Metableton Ecole` - 16 edges
4. `useAuth()` - 13 edges
5. `4. Nice-to-have improvements` - 11 edges
6. `PRD: Metableton Ecole` - 11 edges
7. `4. Features` - 11 edges
8. `Metableton Ecole` - 10 edges
9. `2026-06-09 — PRD Creation Session` - 10 edges
10. `Section Definitions` - 9 edges

## Surprising Connections (you probably didn't know these)
- `listManageableCourses()` --calls--> `apiClient()`  [EXTRACTED]
  client/src/api/courses.js → client/src/api/client.js
- `getMyEnrollments()` --calls--> `apiClient()`  [EXTRACTED]
  client/src/api/enrollments.js → client/src/api/client.js
- `RequireAuth()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/RequireAuth.jsx → client/src/hooks/useAuth.js
- `DashboardLayout()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/layout/DashboardLayout.jsx → client/src/hooks/useAuth.js
- `Header()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/components/layout/Header.jsx → client/src/hooks/useAuth.js

## Import Cycles
- None detected.

## Communities (68 total, 36 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (31): getMyEnrollments(), DEFAULT_DASHBOARDS, RequireAuth(), AdminCoursesPage(), computeStats(), CourseRow(), formatDate(), STATUS_LABELS (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (46): env, getOauth2Client(), getSupabase(), requireAuth(), errorHandler(), mapStatusCodeToErrorCode(), requireRole(), pgPool (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (38): Additional Requirements (from Architecture), Epic 1: School Foundation & Public Presence, Epic 1: School Foundation & Public Presence, Epic 2: Authentication & Role-Based Access, Epic 2: Authentication & Role-Based Access, Epic 3: Courses, Enrollment & Google Classroom, Epic 3: Courses, Enrollment & Google Classroom, Epic 4: Admin Operations (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (26): getAdminCourses(), getUsers(), updateUserRole(), getMe(), logout(), apiClient(), createCourse(), getManageableCourseById() (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (28): 4.10 Supabase Data Model (Product-Level), 4.1 Authentication & Identity, 4.2 Role-Based Access Control, 4.3 Public Presence, 4.4 Course Management, 4.5 Enrollment Flow, 4.6 Student Dashboard, 4.7 Teacher Dashboard (+20 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (26): 1. Data Architecture, 2. Authentication & Security, 3. Google Classroom Integration (Validation-Only), 4. Frontend Architecture, 5. Environment Variables, 6. Local Development, 7. Implementation Order, Architectural Decisions This Stack Encodes (+18 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (21): 0. Document Purpose, 1. Vision, 2.1 Jobs To Be Done, 2.2 Non-Users (v1), 2.3 Key User Journeys, 2. Target User, 3. Glossary, 5.1 Security (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (19): API surface — final state, Architecture rules (do not violate), Completed BMAD artifacts, Current route tree (`client/src/App.jsx`), Important instructions (for the next session), Important production reference, Known limitations (deliberate, MVP-scope), Manual demo checklist (high-level) (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): 1. Install dependencies, 2. Start Supabase locally, 3. Run migrations, 4. Configure environment variables, 5. Google Cloud setup, 6. Start the app, Backend (server), Build & Start (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (18): dependencies, connect-pg-simple, cors, dotenv, express, express-session, googleapis, pg (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (17): dependencies, react, react-dom, react-router-dom, devDependencies, tailwindcss, @tailwindcss/vite, vite (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (14): Path, deep_merge(), _detect_keyed_merge_field(), extract_key(), find_project_root(), load_toml(), main(), _merge_arrays() (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (11): 2026-06-09 — PRD Creation Session, Admin Bootstrap, Admin Course Editing, Decision Log — Metableton Ecole PRD, Enrollment Flow, Google Classroom Integration Depth, Meet Link Display, Mode & Approach (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): Addendum — Metableton Ecole, Backend Routes (MVP), Competitive Landscape Context, Database (Supabase Migrations), Google Classroom API Notes, Project Structure, README Requirements (User-Specified), Security Constraints (User-Specified) (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (10): 2026-06-09 — Brief Creation Session, Architecture, Decision Log — Metableton Ecole Brief, Domain Focus, Live Course Delivery, Mode & Approach, MVP Scope Boundaries, Product Name (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (11): 4. Nice-to-have improvements, N-10: An `App.jsx` route for a student to view a single enrollment's course detail, N-1: Add the public catalog ↔ API wiring (B-1/F-1), N-2: Root-level `package.json` with a `dev` script using `concurrently`, N-3: Server-side request logging, N-4: `loading` skeleton for the public catalog on first paint, N-5: Suppress console errors on the OAuth cancel path, N-6: `classroom.courses.readonly` scope on initial sign-in (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (9): Executive Summary, Product Brief: Metableton Ecole, Scope, Success Criteria, The Problem, The Solution, Vision, What Makes This Different (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.42
Nodes (8): Path, deep_merge(), _detect_keyed_merge_field(), extract_key(), load_toml(), main(), _merge_arrays(), _merge_by_key()

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (9): 5.1 Public surface (unauthenticated), 5.2 Auth bootstrap (first user), 5.3 Student flow, 5.4 Teacher flow, 5.5 Admin flow, 5.6 Regression checks, 5.7 Security spot-checks, 5.8 Database / Supabase (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (8): 3. Important fixes before demo, F-1: Public catalog ↔ live data wiring (B-1 above), F-2: Classroom scope not requested — first link will fail with a friendly error, F-3: Post-OAuth redirect always goes to dashboard, never back to the course, F-4: Course detail page shows no "already a teacher" / "already an admin" subtle UX for non-students, F-5: 404 handler returns JSON even for browser visits, F-6: No `Access-Control-Allow-Credentials` preflight regression check, F-7: Admin role can demote self to "teacher" but the client doesn't warn — relies on server

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (7): [0.1.3](https://github.com/supabase/agent-skills/compare/v0.1.2...v0.1.3) (2026-06-02), [0.1.4](https://github.com/supabase/agent-skills/compare/v0.1.3...v0.1.4) (2026-06-05), Bug Fixes, Bug Fixes, Changelog, Features, Features

### Community 24 - "Community 24"
Cohesion: 0.25
Nodes (7): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), Bug Fixes, Bug Fixes, Changelog, Features, Features

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (7): Core Principles, Making and Committing Schema Changes, Reference Guides, Supabase, Supabase CLI, Supabase Documentation, Supabase MCP Server

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (6): 1. Wire the public catalog and detail pages to the real `/api/courses` endpoint, 2. Add `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to the migration, 3. Initialize Supabase CLI project and commit `config.toml`, 6. Recommended next 3 tasks, 8. Conclusion, MVP Stabilization Audit — Metableton Ecole

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (6): 7. Other notes (FYI, not action items), Architectural alignment, Code smells (minor, not blocking), Deployment readiness (out of MVP scope, but called out for completeness), Known limitations from the PRD (already accepted as MVP-out-of-scope), Risks called out in the PRD (still relevant)

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 29 - "Community 29"
Cohesion: 0.40
Nodes (5): 1.1 Backlog status, 1.2 FR coverage (PRD), 1.3 NFR coverage, 1.4 What the codebase actually contains, 1. Summary of completion

### Community 30 - "Community 30"
Cohesion: 0.40
Nodes (5): 2. Critical blockers, B-1 (critical): Public catalog still uses mock data, B-2 (critical): `pgcrypto` / `gen_random_uuid()` not explicitly enabled, B-3 (high): `supabase init` never run — README setup step is broken, B-4 (high): No root-level `package.json` / no setup convenience scripts

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (3): Fix suggestion, Source, What happened

## Knowledge Gaps
- **322 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+317 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MVP Stabilization Audit — Metableton Ecole` connect `Community 26` to `Community 17`, `Community 21`, `Community 22`, `Community 27`, `Community 29`, `Community 30`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `4. Features` connect `Community 5` to `Community 7`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `Return 'code' or 'id' if every table item carries that *same* field.      All it`, `Shape-aware array merge. Base + override combined tables may opt into     keyed`, `Recursively merge override into base using structural rules.     - Table + table` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05516431924882629 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05432595573440644 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._