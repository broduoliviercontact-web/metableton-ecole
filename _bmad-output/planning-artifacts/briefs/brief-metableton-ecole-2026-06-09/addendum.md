# Addendum — Metableton Ecole

Supporting detail captured during brief creation. This content informs downstream documents (PRD, architecture, solution design) but sits outside the brief to keep it tight.

## Technical Specifications (User-Provided)

### Stack
- **Frontend:** React, Vite, JavaScript (no TypeScript), Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Supabase (PostgreSQL)
- **Auth:** Google Identity Services / OAuth 2.0
- **External API:** Google Classroom API

### Project Structure
```
/online-music-school
  /client        # React + Vite + Tailwind
  /server        # Node + Express
  /supabase      # SQL migrations
  README.md
  .env.example
```

### Backend Routes (MVP)
- Auth routes (Google OAuth flow, token management)
- Users routes (profile CRUD, role management)
- Courses routes (create, read, update, list)
- Enrollments routes (enroll, unenroll, list by user)
- Google Classroom routes (create/link courses, fetch Classroom data)

### Database (Supabase Migrations)
- Users table (linked to Google identity, role field)
- Courses table (metadata, linked teacher, linked Google Classroom ID)
- Enrollments table (student-course relationships)
- Role-based access patterns

### Security Constraints (User-Specified)
- `GOOGLE_CLIENT_SECRET` must never be exposed client-side
- `VITE_` prefix only for frontend environment variables
- Profiles stored in Supabase, not in client-side state
- `.env.example` must be comprehensive for new developer onboarding

### README Requirements (User-Specified)
- How to create a Google Cloud project
- How to enable Google Classroom API
- How to create OAuth credentials
- How to configure Supabase
- How to populate `.env`
- How to run the project locally

## Competitive Landscape Context

From research conducted during brief creation:

- Global online music education market: ~$180M (2022), projected $829M by 2031
- Major players: Yousician, Simply (JoyTunes), Tonebase, ArtistWorks, Soundfly, Pinokee
- **Key finding:** No competitor uses Google Classroom as a backend. Closest general-purpose reference is EduTrack (open source, 2025), which proves architectural viability.
- **Strategic positioning:** Uncontested architectural choice in music education; blue-ocean opportunity at the intersection of Google Classroom API + music technology education.

## Google Classroom API Notes

Key capabilities relevant to MVP:
- Full CRUD on courses (create via API, link in portal)
- Roster management (students, teachers, invitations)
- Coursework/assignments with Drive file attachments, YouTube videos, links
- Announcements (the "wall" / stream)
- Google Meet integration via Meet REST API
- Drive API for materials management

Key constraints to be aware of:
- `@gmail.com` accounts cannot create courses in `ACTIVE` state via API (requires Google Workspace for Education)
- Apps can only modify coursework they created (same GCP project); cannot touch assignments a teacher creates manually in Classroom
- No traditional webhooks; Pub/Sub push notifications with 7-day registration expiry
- Rate limits: 1,200 queries/min per user, 4M queries/day per client

These constraints should inform architecture decisions in the PRD phase.
