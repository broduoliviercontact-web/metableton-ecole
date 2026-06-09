---
title: "Product Brief: Metableton Ecole"
status: draft
created: 2026-06-09
updated: 2026-06-09
---

# Product Brief: Metableton Ecole

## Executive Summary

Metableton Ecole is an online school portal for modern music creation, built on top of Google Classroom. Students discover and enroll in courses through a clean, branded web experience. Teachers manage their classes and students from a dedicated dashboard. Underneath, Google Classroom runs silently as the pedagogical engine — handling assignments, Drive materials, announcements, and Google Meet sessions.

The product deliberately does not rebuild a learning management system. It adds what Google Classroom lacks: a public storefront, a music-school identity, role-based access for students and teachers, and a single place to manage the relationship between learners, courses, and their Classroom counterparts.

Metableton Ecole targets the growing market for electronic music and music technology education — Ableton Live, production, sound design, synthesis, DJing, and creative workflows — where existing platforms either go broad (Yousician, Simply) or build expensive custom infrastructure instead of leveraging tools students and teachers already use.

## The Problem

Music technology teachers today piece together a fragmented toolchain: a website or social media page to promote courses, Google Forms or DMs for enrollment, Google Classroom for coursework, Drive for materials, Meet for live sessions, and manual spreadsheets to track who is in what. Students bounce between links with no unified experience.

Existing music education platforms (Yousician, Tonebase, Soundfly) are either instrument-specific gamified apps or closed platforms that do not serve teachers running their own curriculum. Full-featured music school management tools like Pinokee bundle scheduling, billing, and a custom classroom — heavy, expensive, and disconnected from Google Workspace that many teachers already rely on.

No one has built a lightweight, Google Classroom-native school portal specifically for modern music creation. Teachers who want to run an online music school today are either over-tooled or under-served.

## The Solution

Metableton Ecole is the branded front door that a modern music school needs. It has three layers:

**The public layer** — a homepage and course catalog where prospective students discover what is offered, read about instructors, and understand the school's identity.

**The identity and access layer** — Google OAuth sign-in, automatic profile creation in Supabase, and a role system (student, teacher, admin) that gates what each user sees and can do.

**The management layer** — dashboards where students see their enrolled courses and Classroom links, teachers create and manage courses and link them to Google Classroom classes, and admins oversee users and content.

Google Classroom handles the rest: the stream, assignments, materials in Drive, and Meet sessions. The platform does not duplicate what Classroom already does well. It wraps it, brands it, and adds the music-school-specific management that Classroom was never designed to provide.

## What Makes This Different

**Google Classroom as backend infrastructure.** No music education competitor — not Yousician, not Tonebase, not Pinokee — uses Google Classroom as their course delivery engine. This is an under-exploited architectural choice: proven by general-purpose projects like EduTrack, but uncontested in music education. It gives Metableton Ecole a full-featured, battle-tested classroom layer at near-zero infrastructure cost while competitors build and maintain their own.

**Focused on modern music creation.** The platform is built for Ableton Live, production, synthesis, sound design, DJing, and creative workflows — not generic "music lessons." The identity, catalog, and teaching model are shaped for this domain from day one.

**Lightweight by design.** The product explicitly avoids scope creep into billing, custom video hosting, or a custom LMS. It does one thing: be the best possible school portal on top of Google Classroom for music technology education.

## Who This Serves

**Students** — beginner to intermediate music technology learners, Ableton users, aspiring producers and sound designers. They want a clear path to learn modern music creation from instructors they trust, without navigating a patchwork of tools. Success for them: they find a course, enroll, and everything they need — assignments, materials, live sessions — is accessible through one coherent experience.

**Teachers** — music technology instructors (starting with two, including the founder). They want to focus on teaching, not on tool integration and student administration. Success for them: they create a course, link it to a Google Classroom, and the platform handles student access, role management, and the connection between their portal presence and their Classroom workflow.

**Admin** — the school operator (founder). Success: visibility across users, courses, and roles from a single dashboard, without manual database queries or Google Admin console gymnastics.

## Success Criteria

**12-month targets (modest, bootstrapped launch):**

- 5 active students enrolled in at least one course
- 2 active teachers with courses live on the platform
- At least 3 courses published and linked to Google Classroom classes
- Students can authenticate with Google, see their dashboard, and access their Classroom course from the portal
- Teachers can create and manage courses without developer intervention

**Quality signals:**
- Zero manual steps for a student to go from "visiting the homepage" to "inside their Google Classroom course"
- Teachers spend zero time on student account management (all handled by the platform and Classroom roster)
- The platform feels like Metableton Ecole, not like Google Classroom with a different logo

## Scope

**MVP — in:**

- Public homepage with school identity
- Course catalog page (static or database-driven, listing available courses)
- Google OAuth sign-in (Google Identity Services)
- Automatic profile creation/update in Supabase on first login
- Role system: student, teacher, admin
- Student dashboard: enrolled courses, associated Google Classroom links
- Teacher dashboard: create/edit courses, link courses to Google Classroom classes
- Admin dashboard: user list, role management, course overview
- Express backend with routes for auth, users, courses, enrollments, and Google Classroom integration
- Supabase PostgreSQL database with migration files
- Comprehensive README covering Google Cloud project setup, API enablement, OAuth credentials, Supabase configuration, .env setup, and local development

**MVP — explicitly out:**

- Payment processing, pricing, or subscription management
- Custom video hosting or streaming infrastructure
- Custom assignment creation or grading (handled by Google Classroom)
- Course content authoring (teachers create content in Google Classroom, not in the portal)
- Student progress tracking or analytics beyond what Classroom provides
- Twitch integration (future consideration, not MVP)
- Mobile app or responsive beyond basic usability
- Multi-language support

**Future considerations (post-MVP, not committed):**
- Payment integration for paid courses
- Twitch streaming as a live course alternative to Meet
- Student progress dashboards aggregating Classroom assignment data
- Direct Drive file browsing within the portal
- Cohort management and enrollment workflows

## Vision

If Metableton Ecole succeeds at its modest launch scale, it becomes the reference platform for music technology schools that want a professional online presence without building or buying a heavy LMS.

In 2-3 years, it could serve multiple independent music schools, each with their own branded portal, their own Google Workspace, and their own teacher roster — all running on the same lightweight infrastructure. The platform stays focused: it does not become an LMS, it does not become a marketplace. It remains the best front door to Google Classroom for music technology education, period.
