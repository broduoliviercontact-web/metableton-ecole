# Presentation Audit — Metableton Ecole

**Date**: 2026-06-10
**Objectif**: Préparer des diagrammes de présentation pour pitcher le projet

---

## 1. Résumé produit

Metableton Ecole est une **plateforme web pour écoles de musique en ligne**.
Elle connecte **étudiants**, **professeurs** et **administration** autour d'un catalogue de cours,
avec une intégration native de **Google OAuth** et **Google Classroom**.

> "Une couche de gestion musicale au-dessus de Google Classroom, sans réinventer le LMS."

---

## 2. Rôles détectés (confirmés dans le code)

| Rôle | Source | Description |
|------|--------|-------------|
| **visitor** | Inféré (pas de session) | Découvre le catalogue, lit les fiches cours |
| **student** | `user_role` enum | S'inscrit aux cours, suit son dashboard |
| **teacher** | `user_role` enum | Crée/gère ses cours, valide les inscriptions |
| **admin** | `user_role` enum | Supervise la plateforme, gère les rôles |

---

## 3. Fonctionnalités détectées (confirmées)

### Pages frontend
- ✅ HomePage (landing)
- ✅ CatalogPage (catalogue public)
- ✅ CourseDetailPage (fiche cours)
- ✅ StudentDashboardPage
- ✅ TeacherDashboardPage
- ✅ AdminDashboardPage
- ✅ AdminCoursesPage
- ✅ CourseFormPage (create + edit)
- ✅ NotFoundPage

### API backend
- ✅ Google OAuth 2.0 (login/logout/me)
- ✅ CRUD courses (create, read, update)
- ✅ Enrollment state machine (request → pending → approved/rejected)
- ✅ Admin user management (list users, change roles)
- ✅ Admin courses overview
- ✅ Google Classroom link validation
- ✅ Session management (PostgreSQL-backed, 7 days)

### Base de données
- ✅ 3 tables: profiles, courses, enrollments
- ✅ 4 enums: user_role, course_status, enrollment_status, skill_level
- ✅ 6 indexes pour les queries courantes

### Intégrations
- ✅ Google OAuth 2.0 (openid, profile, email)
- ✅ Google Classroom API (GET /v1/courses/{id})
- ✅ Supabase PostgreSQL
- ✅ Vercel hosting

---

## 4. Fonctionnalités inférées / non confirmées

- ⚠️ Pas de page profil utilisateur
- ⚠️ Pas d'archivage de cours (seulement draft/published)
- ⚠️ Classroom est read-only (pas de création, pas de sync roster)
- ⚠️ Pas de notifications (email, in-app)
- ⚠️ Pas de paiement / pricing
- ⚠️ Pas de whitelist utilisateurs
- ⚠️ Pas de limite d'étudiants par cours

---

## 5. Arguments de valeur (pour le pitch)

| Argument | Pour qui | Force |
|----------|----------|-------|
| **Authentification Google en 1 clic** | Tous | Forte — zéro friction |
| **Catalogue public clair** | Étudiants, visiteurs | Forte |
| **Validation humaine des inscriptions** | Écoles | Moyenne — qualité vs. automatisation |
| **Intégration Google Classroom native** | Profs, écoles | Très forte — ne pas réinventer le LMS |
| **Architecture moderne (React 19, Express 5)** | Développeurs, investisseurs | Forte |
| **Stack serverless-ready (Vercel + Supabase)** | Technique | Forte |
| **MVP extensible** | Investisseurs | Moyenne |
| **Open source / libre** | Partenaires | Variable |

---

## 6. Zones incertaines

1. **Pas de contenu pédagogique intégré** — la plateforme orchestre, n'héberge pas les cours
2. **Absence de pricing / monétisation** — le business model n'est pas encore défini dans le code
3. **Pas de multi-école** — une seule instance, une seule école
4. **Pas d'internationalisation** — interface en français seulement
5. **Classroom sync limité** — lien manuel, pas de provisioning automatique

---

## 7. Angles de présentation recommandés

1. **Pitch école de musique** → Diagrammes 01, 02, 03, 04, 05
2. **Pitch technique / développeur** → Diagrammes 01, 07, 08
3. **Pitch investisseur** → Diagrammes 02, 06, 08
4. **Documentation produit** → Diagrammes 03, 04, 05, 07
5. **Onboarding équipe** → Tous les diagrammes

---

## 8. Diagrammes à générer

| # | Fichier | Usage |
|---|---------|-------|
| 01 | product-vision | Vue d'ensemble hub-and-spoke |
| 02 | value-proposition | 4 piliers de valeur |
| 03 | user-ecosystem | Écosystème des rôles |
| 04 | student-experience | Parcours étudiant |
| 05 | teacher-experience | Parcours professeur |
| 06 | platform-flywheel | Boucle de croissance |
| 07 | google-classroom-integration | Comparaison Metableton ↔ Classroom |
| 08 | mvp-roadmap | Roadmap 4 phases |
