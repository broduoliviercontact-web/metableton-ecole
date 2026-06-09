---
title: "PRD: Metableton Ecole"
status: draft
created: 2026-06-09
updated: 2026-06-09
---

# PRD: Metableton Ecole

*Online music school portal for modern music creation, built on Google Classroom.*

## 0. Document Purpose

This PRD defines the MVP for Metableton Ecole — a branded web portal for a music technology school that uses Google Classroom as its pedagogical backend. It is written for the product owner (founder), the implementing developer, and downstream architecture and epic-generation workflows. Features are grouped by functional area with globally numbered functional requirements (FR-1 through FR-N). Every `[ASSUMPTION]` is surfaced inline and indexed in §8. This PRD builds on the product brief at `_bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md` and its addendum; it does not duplicate those documents.

## 1. Vision

Metableton Ecole gives music technology teachers a professional online school without forcing them to build or buy a heavy LMS. Students discover courses through a clean, branded catalog. Teachers manage their classes and students from a dedicated dashboard. Underneath, Google Classroom runs silently — handling assignments, Drive materials, announcements, and Meet sessions.

The product deliberately stays small. It adds the three things Google Classroom lacks: a public storefront, a music-school identity, and role-based management. It does not become an LMS, a payment platform, or a video host.

MVP scope: 2 teachers, 5 students, 3 courses. No payments. Real, working, launchable.

## 2. Target User

### 2.1 Jobs To Be Done

**Students (beginner-to-intermediate music technology learners):**
- Discover courses in Ableton Live, production, sound design, synthesis, DJing, and creative workflows
- Enroll in a course and know the status of their request
- Access their Google Classroom course from a single dashboard — no link-hunting
- Join live Meet sessions without fumbling for the link

**Teachers (music technology instructors):**
- Publish and manage course listings with a public presence
- Link courses to Google Classroom classes they control
- Review and approve enrollment requests from students
- Focus on teaching, not on tool integration or student roster management

**Admin (school operator / founder):**
- See all users, courses, and enrollments in one place
- Change user roles (student ↔ teacher ↔ admin)
- Maintain the platform without touching the database directly

### 2.2 Non-Users (v1)

- Parents or guardians managing student accounts (no guardian workflows)
- Institutional administrators at schools or conservatories (single-school, not multi-tenant)
- Students under 13 (no COPPA-age considerations; Google OAuth handles age gates)
- Paying customers (no payment system in v1)

### 2.3 Key User Journeys

- **UJ-1. Léa discovers and requests enrollment in a course.**
  - **Persona + context:** Léa, 24, bedroom producer, wants to learn sound design with Ableton Live. She found Metableton Ecole through social media.
  - **Entry state:** Unauthenticated, on the public homepage.
  - **Path:** Léa browses the course catalog → clicks "Ableton Sound Design Fundamentals" → reads the course description → clicks "Request Enrollment" → the system prompts her to sign in with Google → she signs in → the system creates her profile (student role) and submits a pending enrollment request → she sees a confirmation: "Request sent — you'll be notified when approved."
  - **Climax:** Later, the teacher approves her request. Léa returns to her dashboard, sees the course listed under "My Courses," and clicks the Google Classroom link to access materials and the first Meet session.
  - **Resolution:** Léa now has one-click access to her Classroom from the portal. She returns to her dashboard for each session.
  - **Edge case:** If Léa is already signed in when she clicks "Request Enrollment," the system submits the request immediately without re-prompting for auth. If she already has a pending or approved enrollment for this course, the button shows the current status instead.

- **UJ-2. Teacher Julien creates a course and links it to Google Classroom.**
  - **Persona + context:** Julien, one of two founding teachers, runs Ableton workshops and already uses Google Classroom for his in-person students.
  - **Entry state:** Authenticated, teacher role, on the teacher dashboard.
  - **Path:** Julien clicks "Create Course" → fills in title, description, cover image URL, and skill level → clicks "Save" → the course appears in his course list with status "Not Linked" → he clicks "Link Classroom" → enters his Google Classroom course ID or URL → the system validates the ID by calling the Classroom API → on success, stores the link and updates the course status → students with approved enrollments can now see the Classroom link.
  - **Climax:** Julien sees the course status change to "Linked." He knows students can now access the Classroom.
  - **Resolution:** Julien manages all his courses from one dashboard. Google Classroom handles the actual teaching.
  - **Edge case:** If the Classroom ID is invalid or Julien's Google account lacks teacher access to that Classroom, the system shows a specific error: "Could not access this Classroom. Verify the ID and ensure you are a teacher in that class." If the course has approved students before linking, they automatically gain access to the Classroom link once linking succeeds.

- **UJ-3. Admin (founder) onboards the second teacher.**
  - **Persona + context:** The founder, already set up as admin via first-login bootstrap, wants to give teacher access to the second instructor.
  - **Entry state:** Authenticated, admin role, on the admin dashboard.
  - **Path:** Admin navigates to the Users list → finds the second teacher's profile (currently student role, auto-assigned on sign-up) → clicks "Change Role" → selects "teacher" → confirms → the user's dashboard switches from student view to teacher view on their next login.
  - **Climax:** The second teacher now sees the teacher dashboard and can create courses.
  - **Resolution:** Admin can manage the full user roster from one screen.
  - **Edge case:** Admin cannot demote the last remaining admin (prevents lockout). If they try, the system shows: "Cannot remove the last admin. Promote another user to admin first."

## 3. Glossary

Terms used throughout this PRD. FRs, UJs, and SMs use these terms exactly; no synonyms.

- **User** — Any person who has signed in with Google and has a profile in Supabase. Has exactly one role.
- **Role** — One of `student`, `teacher`, `admin`. Determines dashboard access and permitted actions. Stored in the Supabase `profiles` table.
- **Student** — A user with the `student` role. Can browse the catalog, request enrollment, view enrolled courses, and access Classroom links for approved enrollments.
- **Teacher** — A user with the `teacher` role. Can create and edit courses, link courses to Google Classroom, and approve or reject enrollment requests for their own courses.
- **Admin** — A user with the `admin` role. Can view all users, change any user's role, and view all courses. Has teacher capabilities as well [ASSUMPTION: admin inherits teacher dashboard access — simplifies UI and prevents admin from being locked out of course management].
- **Course** — A learning offering with a title, description, skill level, and optional cover image. Owned by the teacher who created it. May be linked to exactly one Google Classroom.
- **Google Classroom** — A class created in Google Classroom (the Google Workspace product). Referenced by its Classroom ID. The portal links courses to Classrooms; it does not create or manage Classroom content.
- **Enrollment** — A relationship between a student and a course. Has a status: `pending` (student requested, awaiting review), `approved` (student has access), or `rejected` (request denied).
- **Enrollment Request** — The action a student takes on the course catalog page to express interest. Creates an enrollment record with `pending` status.
- **Profile** — The Supabase record for a user, created automatically on first Google sign-in. Contains Google `sub` (unique ID), email, display name, avatar URL, and role.
- **Dashboard** — The authenticated landing page for a user. Content and actions vary by role.
- **Catalog** — The public, unauthenticated-accessible listing of published courses.
- **Classroom Link** — A URL or Classroom ID stored on a course record, pointing to the associated Google Classroom. Displayed to students with approved enrollments.

## 4. Features

### 4.1 Authentication & Identity

**Description:** Users sign in exclusively with Google OAuth 2.0 (Google Identity Services). On first sign-in, the system creates a profile in Supabase. On subsequent sign-ins, the system updates the existing profile (email, display name, avatar). The first user to sign in is assigned the `admin` role; all subsequent users default to `student`. Realizes the authentication gate in UJ-1, UJ-2, and UJ-3.

**Functional Requirements:**

#### FR-1: Google OAuth sign-in
A visitor can sign in with their Google account using the Google Identity Services OAuth 2.0 flow.

**Consequences (testable):**
- Clicking "Sign in with Google" initiates the OAuth flow and redirects to Google's consent screen.
- On successful authentication, the system receives a Google ID token.
- The system exchanges the ID token for a server-side session (HTTP-only cookie).
- If the Google OAuth flow fails or the user cancels, the system returns to the previous page with no partial state.
- `GOOGLE_CLIENT_SECRET` is never included in the client bundle; the token exchange happens server-side only.

**Out of Scope:**
- Email/password authentication
- Any non-Google identity provider (GitHub, Facebook, etc.)

#### FR-2: Automatic profile creation on first sign-in
On first sign-in, the system creates a profile in Supabase with the user's Google identity.

**Consequences (testable):**
- A new row is inserted into the `profiles` table with: Google `sub`, email, display name, avatar URL.
- The first user to ever sign in is assigned `role = 'admin'`.
- All subsequent first-time sign-ins are assigned `role = 'student'`.
- If the `profiles` insert fails (e.g., DB unavailable), the system returns a friendly error and does not leave the user in a partially-authenticated state.

#### FR-3: Profile update on subsequent sign-ins
On each sign-in, the system updates the existing profile's email, display name, and avatar URL from the latest Google token data.

**Consequences (testable):**
- If the user changed their Google display name, the profile reflects it after next sign-in.
- Role is never overwritten by profile update (role changes only via admin action, FR-13).

### 4.2 Role-Based Access Control

**Description:** Three roles — `student`, `teacher`, `admin` — gate dashboard access and permitted actions. The backend enforces role checks on every protected route. The frontend shows or hides UI elements by role but never trusts the client for authorization. Realizes UJ-2 (teacher-only course creation) and UJ-3 (admin-only role changes).

**Functional Requirements:**

#### FR-4: Role-gated dashboard routing
After sign-in, the system routes the user to the dashboard matching their role.

**Consequences (testable):**
- User with role `student` lands on the student dashboard (`/dashboard`).
- User with role `teacher` lands on the teacher dashboard (`/dashboard/teacher`).
- User with role `admin` lands on the admin dashboard (`/dashboard/admin`).
- Directly navigating to a dashboard URL for a different role returns 403.
- The backend verifies role on every API request to a protected route; client-side route guards are UX only.

#### FR-5: Role-based UI visibility
The navigation and page content adapt to the user's role.

**Consequences (testable):**
- `student` sees: "My Courses" and catalog link in navigation.
- `teacher` sees: "My Courses," "Create Course," and enrollment review in navigation.
- `admin` sees: "Users," "Courses," and all teacher navigation items [ASSUMPTION: admin inherits teacher nav — see Glossary].

### 4.3 Public Presence

**Description:** The public-facing surface of Metableton Ecole. Accessible without authentication. Includes a homepage establishing the school's identity and a course catalog where visitors browse available courses. Realizes the discovery phase of UJ-1.

**Functional Requirements:**

#### FR-6: Public homepage
A visitor can view a public homepage that communicates the school's identity and directs them to the course catalog.

**Consequences (testable):**
- Homepage loads at `/` without authentication.
- Displays: school name (Metableton Ecole), a short tagline about modern music creation, and a call-to-action linking to the course catalog.
- Displays a "Sign in with Google" button in the header.

#### FR-7: Public course catalog
A visitor can browse published courses without signing in.

**Consequences (testable):**
- Catalog loads at `/catalog` without authentication.
- Lists all courses with status `published`, each showing: title, teacher display name, skill level, short description excerpt.
- Clicking a course navigates to `/catalog/:courseId`, showing full description, skill level, and teacher name.
- If no courses are published, the catalog shows an empty state: "No courses available yet. Check back soon."
- The "Request Enrollment" button is visible on the course detail page. Clicking it triggers the enrollment flow (FR-9).

### 4.4 Course Management

**Description:** Teachers create, edit, and manage their courses. A course has a title, description, skill level, optional cover image URL, and an optional Google Classroom link. Courses are owned by the teacher who created them. Realizes UJ-2.

**Functional Requirements:**

#### FR-8: Teacher creates and edits courses
A teacher can create a new course and edit courses they own.

**Consequences (testable):**
- Teacher clicks "Create Course," fills in: title (required), description (required), skill level (required, one of: Beginner / Intermediate / Advanced / All Levels), cover image URL (optional).
- On save, the course is created with status `draft` and the teacher as owner.
- Teacher can edit any course they own: change title, description, skill level, cover image URL, or status (`draft` ↔ `published`).
- Only courses with status `published` appear in the public catalog (FR-7).
- A teacher cannot edit courses owned by another teacher. Attempting returns 403.

### 4.5 Enrollment Flow

**Description:** Moderated enrollment — students request to join a course, teachers or admins approve or reject. This is the central workflow connecting the catalog to the classroom. Realizes the full arc of UJ-1.

**Functional Requirements:**

#### FR-9: Student requests enrollment
A student can request enrollment in a published course from the catalog.

**Consequences (testable):**
- Student clicks "Request Enrollment" on a course detail page (`/catalog/:courseId`).
- If not authenticated, the system redirects to Google sign-in, then returns to the enrollment action post-auth.
- If already enrolled (any status: `pending`, `approved`, `rejected`), the button shows the current status and is disabled: "Pending Approval," "Enrolled," or "Request Denied."
- On first request, the system creates an enrollment record with `status = 'pending'` and `student_id` / `course_id`.
- Student sees a confirmation: "Enrollment requested. You'll be notified when the teacher reviews it."
- Duplicate requests for the same course are idempotent — second request returns the existing enrollment status.

#### FR-10: Teacher reviews enrollment requests
A teacher can view and act on enrollment requests for courses they own.

**Consequences (testable):**
- Teacher dashboard shows pending enrollment requests for their courses, grouped by course.
- For each pending request, the teacher sees: student display name, student email, course title, request date.
- Teacher can click "Approve" → enrollment status changes to `approved` → student gains access to the Classroom link for that course.
- Teacher can click "Reject" → enrollment status changes to `rejected` → student sees "Request Denied" on the catalog and their dashboard.
- Approving or rejecting is idempotent — acting on an already-resolved request returns the current status with no side effects.

#### FR-11: Admin reviews any enrollment request
An admin can approve or reject enrollment requests for any course, not just their own.

**Consequences (testable):**
- Admin dashboard shows all pending enrollment requests across all courses.
- Admin has the same approve/reject capabilities as the course-owning teacher (FR-10).
- [ASSUMPTION: Admin can manage enrollments for any course — prevents bottleneck if a teacher is unavailable.]

### 4.6 Student Dashboard

**Description:** The authenticated home for students. Shows enrolled courses with Classroom access links. Realizes the resolution phase of UJ-1.

**Functional Requirements:**

#### FR-12: Student views enrolled courses and Classroom links
A student can see their approved courses and access associated Google Classroom links from a single dashboard.

**Consequences (testable):**
- Student dashboard at `/dashboard` lists all enrollments with their status.
- Approved enrollments show: course title, teacher name, a clickable link/button to open the Google Classroom.
- Pending enrollments show: course title, "Pending Approval" badge, no Classroom link.
- Rejected enrollments show: course title, "Request Denied" badge, no Classroom link.
- If the student has no enrollments, the dashboard shows an empty state: "You haven't enrolled in any courses yet. Browse the catalog."
- Clicking a Classroom link opens Google Classroom in a new tab.

### 4.7 Teacher Dashboard

**Description:** The authenticated home for teachers. Shows their courses, enrollment requests for each course, and course management actions. Realizes UJ-2.

**Functional Requirements:**

#### FR-13: Teacher views and manages their courses
A teacher can see all courses they own and manage them from a single dashboard.

**Consequences (testable):**
- Teacher dashboard at `/dashboard/teacher` lists all courses owned by the authenticated teacher.
- Each course shows: title, status (draft/published), Classroom link status (linked/not linked), enrollment count.
- Clicking a course opens its detail/edit view.
- "Create Course" button is prominent on the dashboard.

#### FR-14: Teacher links a course to Google Classroom
A teacher can associate a course with a Google Classroom by providing the Classroom ID.

**Consequences (testable):**
- Teacher opens a course, clicks "Link Classroom," enters a Google Classroom ID.
- The backend calls the Google Classroom API (`GET /v1/courses/{id}`) using the teacher's OAuth token to verify the Classroom exists and the teacher has access.
- On success, the `classroom_id` and `classroom_url` are stored on the course record.
- On failure, the teacher sees a specific error: "Could not access this Classroom. Verify the ID and ensure you are a teacher in that class."
- A course can be linked to at most one Google Classroom. Linking a different Classroom replaces the previous link.
- [ASSUMPTION: The system stores the Classroom ID but does not programmatically create Classrooms or manage rosters via the API in MVP — the teacher manages the Classroom roster manually in Google Classroom. The portal only stores and displays the link.]

### 4.8 Admin Dashboard

**Description:** The authenticated home for admins. Provides visibility and control over all users, roles, and courses. Realizes UJ-3.

**Functional Requirements:**

#### FR-15: Admin views and manages users
An admin can see all users in the system and change any user's role.

**Consequences (testable):**
- Admin dashboard at `/dashboard/admin` has a "Users" section listing all profiles.
- Each user row shows: display name, email, current role, sign-up date.
- Admin can change a user's role via a dropdown or button: `student` ↔ `teacher` ↔ `admin`.
- The system prevents demoting the last remaining admin. Attempting returns: "Cannot remove the last admin. Promote another user to admin first."
- Role changes take effect immediately — the affected user sees their new dashboard on next page load.

#### FR-16: Admin views all courses
An admin can see all courses in the system, regardless of owner.

**Consequences (testable):**
- Admin dashboard "Courses" section lists all courses with: title, owner name, status, Classroom link status, enrollment count.
- Admin can view any course's detail page (read-only by default).
- [ASSUMPTION: Admin can also edit any course in MVP — avoids the "orphaned course" problem if a teacher leaves. Confirmed 2026-06-09: admin needs full operational control for a small-school MVP.]

### 4.9 Google Meet Access

**Description:** Live course sessions happen via Google Meet. The portal does not host or schedule meetings; it surfaces the Meet link that Google Classroom already provides. Realizes the live-session access in UJ-1.

**Functional Requirements:**

#### FR-17: Student accesses Meet sessions via Classroom
Students access live Meet sessions through the Google Classroom linked to their course.

**Consequences (testable):**
- The Classroom link on the student dashboard (FR-12) opens Google Classroom, where the Meet link for the class is available in the stream or header.
- The portal does not generate, schedule, or host Meet links. Google Classroom is the single source of truth for Meet sessions.
- [ASSUMPTION: In MVP, the portal does not extract and display the Meet link directly. Students click through to Classroom and find the Meet link there. A future enhancement could fetch the Meet link via Classroom API and display it inline on the dashboard.]

### 4.10 Supabase Data Model (Product-Level)

**Description:** The database stores users, courses, and enrollments. This section describes what data exists and why — not the schema DDL (that belongs in the architecture phase).

**profiles table:**
- `id` — UUID, primary key
- `google_sub` — Google's unique user identifier, unique constraint
- `email` — user's Google email
- `display_name` — from Google profile
- `avatar_url` — from Google profile
- `role` — enum: `student`, `teacher`, `admin`
- `created_at`, `updated_at` — timestamps

**courses table:**
- `id` — UUID, primary key
- `teacher_id` — foreign key to `profiles.id`
- `title` — text, required
- `description` — text, required
- `skill_level` — enum: `beginner`, `intermediate`, `advanced`, `all_levels`
- `cover_image_url` — text, nullable
- `status` — enum: `draft`, `published`
- `classroom_id` — text, nullable, the Google Classroom ID
- `classroom_url` — text, nullable, the full Classroom URL
- `created_at`, `updated_at` — timestamps

**enrollments table:**
- `id` — UUID, primary key
- `student_id` — foreign key to `profiles.id`
- `course_id` — foreign key to `courses.id`
- `status` — enum: `pending`, `approved`, `rejected`
- `created_at`, `updated_at` — timestamps
- Unique constraint on `(student_id, course_id)` — one enrollment record per student per course

## 5. Cross-Cutting NFRs

### 5.1 Security

- **NFR-SEC-1:** All API routes except public catalog and auth callback require a valid server-side session. Unauthenticated requests return 401.
- **NFR-SEC-2:** All role-gated routes verify the user's role from the server-side session on every request. The client role is never trusted.
- **NFR-SEC-3:** `GOOGLE_CLIENT_SECRET` exists only in server environment variables. It is never sent to the client, bundled in client code, or logged.
- **NFR-SEC-4:** Google OAuth tokens (access token, refresh token) are stored server-side only (in the session or encrypted in the database). They are never exposed to the client.
- **NFR-SEC-5:** Supabase database credentials and API keys are server-side only. The client never connects directly to Supabase; all database access goes through the Express API.

### 5.2 Performance

- **NFR-PERF-1:** Public pages (homepage, catalog) load in under 2 seconds on a standard broadband connection.
- **NFR-PERF-2:** Dashboard pages load in under 3 seconds for the MVP data scale (≤ 10 courses, ≤ 10 users, ≤ 20 enrollments).
- **NFR-PERF-3:** Google Classroom API calls (FR-14 validation) respond in under 5 seconds or time out with a user-friendly error.

### 5.3 Reliability

- **NFR-REL-1:** If Supabase is unreachable, the system returns a graceful error page — not a blank screen or stack trace.
- **NFR-REL-2:** If the Google Classroom API is unreachable during course linking (FR-14), the system surfaces a specific error: "Google Classroom is temporarily unavailable. Try again in a few minutes."

### 5.4 Browser Support

- **NFR-BRW-1:** The application supports the latest two versions of Chrome, Firefox, Safari, and Edge.

## 6. Non-Goals & MVP Scope

Metableton Ecole is not an LMS, not a payment platform, not a video host, not a mobile app. These are identity boundaries, not just deferred features. Google Classroom handles the heavy lifting; the portal adds the school-specific layer Classroom lacks.

### 6.1 In Scope

- Public homepage with school branding
- Public course catalog with course detail pages
- Google OAuth sign-in (exclusive authentication method)
- Automatic Supabase profile creation with role bootstrap (first user = admin)
- Role system: student, teacher, admin
- Role-gated dashboards (student, teacher, admin)
- Course CRUD by teachers (title, description, skill level, cover image, draft/published status)
- Moderated enrollment flow (request → pending → approve/reject by teacher or admin)
- Google Classroom linking (teacher enters Classroom ID, system validates via API)
- Student access to Classroom links for approved enrollments
- Admin user management (list users, change roles)
- Admin course overview (list all courses)
- Last-admin protection (cannot demote the sole admin)
- Server-side session management with HTTP-only cookies
- Express API with auth middleware and role enforcement
- Comprehensive README (Google Cloud setup, Supabase setup, local dev instructions)

### 6.2 Out of Scope for MVP

- Payment processing or pricing — deferred to v2
- Automated Google Classroom creation via API — deferred to v2; manual linking only in v1
- Automated roster sync between portal enrollments and Google Classroom — deferred to v2; teachers manually manage Classroom rosters in v1
- Inline Meet link display on dashboard — deferred to v2; students click through to Classroom in v1
- Twitch streaming integration — deferred to v2
- Email or in-app notifications for enrollment status changes — deferred to v2; students check dashboard manually in v1 [NOTE FOR PM: This is the most load-bearing deferral. Students have no way to know their enrollment was approved except by checking back. Consider moving to v1 if manual checking creates a poor experience for the 5-student MVP.]
- Course content authoring (rich text, file uploads, etc.)
- Student progress dashboards or grade views
- Mobile app or mobile-optimized responsive design
- Multi-language support
- Direct Drive file browsing within the portal
- Cohort or batch enrollment management

## 7. Success Metrics

Metrics are lightweight for the MVP scale (5 students, 2 teachers, 3 courses). Quantitative targets will be noisy at this sample size; prioritize qualitative signals.

**Primary**
- **SM-1: Enrollment completion rate** — % of students who request enrollment and are approved within 48 hours. Target: ≥ 80%. Validates FR-9, FR-10.
- **SM-2: Classroom link access rate** — % of approved students who click through to Google Classroom from their dashboard at least once. Target: 100% (all 5 students). Validates FR-12, FR-14.

**Secondary**
- **SM-3: Teacher course creation success** — both teachers create at least one course and successfully link it to Google Classroom within the first week. Validates FR-8, FR-14.
- **SM-4: Admin role management success** — admin successfully changes at least one user's role without requiring developer intervention. Validates FR-15.

**Qualitative (ask the 5 students)**
- "I always know where to find my course and the Classroom link."
- "The sign-in flow felt natural — I didn't get lost."
- "The platform feels like a music school, not like Google with a different logo."

**Counter-metrics (do not optimize)**
- **SM-C1: Page views on the catalog** — we are not optimizing for browsing volume; we optimize for enrollment completion. Counterbalances any temptation to add SEO content bloat.
- **SM-C2: Time spent on dashboard** — the dashboard is a launchpad, not a destination. Less time = faster access to Classroom. Counterbalances any temptation to add "engagement" features to the dashboard.

## 8. Assumptions Index

Every `[ASSUMPTION]` from the document, surfaced for explicit confirmation:

1. **§3 Glossary, Admin role** — Admin inherits teacher dashboard access (teacher nav items + admin-only sections). Simplifies UI and prevents admin lockout from course management.
2. **§4.2 FR-5, Admin navigation** — Admin sees all teacher navigation items plus admin-only sections.
3. **§4.5 FR-11, Admin enrollment management** — Admin can manage enrollments for any course, not just their own. Prevents bottleneck if a teacher is unavailable.
4. **§4.7 FR-14, Classroom linking** — The portal only stores the Classroom ID and validates it; it does not programmatically create Classrooms, manage rosters, or sync enrollments in MVP. Teacher manages the Classroom roster manually.
5. **§4.8 FR-16, Admin course editing** — Admin can edit any course in MVP. May be contentious with teachers; marked for review.
6. **§4.9 FR-17, Meet link display** — In MVP, the portal does not extract and display the Meet link directly. Students click through to Classroom to find it. Future enhancement could fetch via Classroom API.

## 9. Risks and Open Questions

### Risks

- **R-1: Google Classroom API consumer-account restrictions.** `@gmail.com` accounts cannot create courses in `ACTIVE` state via the Classroom API. Since MVP uses personal Gmail accounts (OQ-4 resolved), all Classroom API usage is read-only (GET for validation). Mitigation: MVP only validates/looks up Classrooms via API (GET), it does not create them (POST). This is an architectural constraint, not just a risk — the API integration strategy must assume `@gmail.com` accounts.
- **R-2: Google OAuth token refresh.** Long-lived sessions require token refresh. If a teacher's Google token expires, the Classroom API validation (FR-14) will fail mid-session. Mitigation: store refresh tokens server-side and implement silent refresh.
- **R-3: Single point of failure on Supabase.** If Supabase is down, the entire application is unavailable (auth, profiles, courses, enrollments). Mitigation: graceful error handling (NFR-REL-1). No multi-region failover in MVP budget.
- **R-4: No notification channel for enrollment status.** Students must manually check their dashboard to see if their enrollment was approved (see §7.2 note). Mitigation: acceptable at 5-student scale; becomes a v2 priority.

### Open Questions

1. **OQ-1:** Should admin be able to edit courses they don't own? **Resolved 2026-06-09: Yes.** Admin can edit any course. Metableton Ecole is a small school; admin needs full operational control.
2. **OQ-2:** What happens when a teacher links a Classroom, then later changes the Classroom ID? Should previously approved students automatically see the new link? Current behavior: yes, since the course record is updated and students read from it. Confirm this is the desired behavior.
3. **OQ-3:** Should rejected enrollments be retryable? **Resolved 2026-06-09: Yes.** A rejected enrollment request is retryable — the student can re-request the same course. Re-submission creates a new pending enrollment (or resets the rejected one to pending). Rejection is not permanent.
4. **OQ-4:** What Google Workspace setup will the school use? **Resolved 2026-06-09: Personal Gmail accounts for MVP.** No dedicated Google Workspace domain in V1. Google Workspace may be considered later but is out of scope.
5. **OQ-5:** Should the teacher dashboard show enrollment counts per course? Current assumption: yes (FR-13). Confirm.
