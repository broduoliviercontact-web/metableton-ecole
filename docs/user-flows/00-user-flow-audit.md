# User Flow Audit — Metableton Ecole

**Date**: 2026-06-10
**Source**: Analyse du code source de metableton-ecole (client/, server/, supabase/)

---

## 1. Rôles utilisateur

| Rôle | Source dans le code | Confiance |
|------|---------------------|-----------|
| **visitor** | Inféré — pas de session = non authentifié, accès aux pages publiques | ✅ Certain |
| **student** | `user_role` enum (`'student'`) — rôle par défaut, dashboard `/dashboard` | ✅ Certain |
| **teacher** | `user_role` enum (`'teacher'`) — dashboard `/dashboard/teacher` | ✅ Certain |
| **admin** | `user_role` enum (`'admin'`) — 1er utilisateur = admin, dashboard `/dashboard/admin` | ✅ Certain |

**Notes**:
- Le rôle est stocké dans `profiles.role` (enum PostgreSQL)
- Le rôle est persisté dans la session (`req.session.role`)
- Le rôle n'est **jamais** écrasé lors d'une re-connexion Google (`services/profileService.js`)
- Admin bootstrap : le premier utilisateur Google à se connecter devient admin (`count === 0 ? 'admin' : 'student'`)

---

## 2. Pages Frontend (React Router)

| Route | Page/Composant | Layout | Auth | Rôle |
|-------|---------------|--------|------|------|
| `/` | `HomePage` | PublicLayout | ❌ | visitor |
| `/catalog` | `CatalogPage` | PublicLayout | ❌ | visitor/any |
| `/catalog/:courseId` | `CourseDetailPage` | PublicLayout | ❌ | visitor/any |
| `/dashboard` | `StudentDashboardPage` | DashboardLayout (RequireAuth) | ✅ | student (teacher/admin aussi) |
| `/dashboard/teacher` | `TeacherDashboardPage` | DashboardLayout (RequireAuth) | ✅ | teacher, admin |
| `/dashboard/teacher/courses/new` | `CourseFormPage` (mode=create) | DashboardLayout | ✅ | teacher, admin |
| `/dashboard/teacher/courses/:courseId/edit` | `CourseFormPage` (mode=edit) | DashboardLayout | ✅ | teacher, admin |
| `/dashboard/admin` | `AdminDashboardPage` | DashboardLayout | ✅ | admin only |
| `/dashboard/admin/courses` | `AdminCoursesPage` | DashboardLayout | ✅ | admin only |
| `*` | `NotFoundPage` | Aucun | ❌ | any |

**Incertaines / inférées**:
- Login page dédiée : ❌ **n'existe pas** — le login est un redirect vers Google OAuth (`AuthContext.login()`)
- Unauthorized page : ❌ **n'existe pas en page dédiée** — géré par `RequireAuth` qui renvoie probablement vers la 401/403 de l'API
- Page de profil utilisateur : ❌ **n'existe pas** dans le MVP

---

## 3. Routes Backend API

### Auth (`routes/auth.js`)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/auth/google` | ❌ | Redirige vers Google OAuth |
| GET | `/api/auth/google/callback` | ❌ | Callback OAuth, échange code→tokens, upsert profil, crée session |
| GET | `/api/auth/me` | ❌ (lit juste la session) | Retourne `{ user: { userId, role } }` ou `{ user: null }` |
| POST | `/api/auth/logout` | ❌ | Détruit la session, clear cookie |

### Courses (`routes/courses.js`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/api/courses` | ❌ | — | Catalogue public (published uniquement) |
| GET | `/api/courses/manage` | ✅ | teacher, admin | Liste cours du teacher ou tous (admin) |
| GET | `/api/courses/manage/:id` | ✅ | teacher, admin | Détail cours (y compris drafts) |
| GET | `/api/courses/:id` | ❌ | — | Détail cours publié (public) |
| POST | `/api/courses` | ✅ | teacher, admin | Créer un cours |
| PUT | `/api/courses/:id` | ✅ | teacher, admin | Modifier un cours (ownership check) |
| PUT | `/api/courses/:id/classroom` | ✅ | teacher, admin | Lier un Google Classroom (validation API) |

### Enrollments (`routes/enrollments.js`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| POST | `/api/enrollments` | ✅ | any | Demander une inscription |
| GET | `/api/enrollments/mine` | ✅ | any | Liste des inscriptions de l'utilisateur |
| GET | `/api/enrollments/pending` | ✅ | teacher, admin | Demandes en attente |
| POST | `/api/enrollments/:id/approve` | ✅ | teacher, admin | Approuver (ownership check) |
| POST | `/api/enrollments/:id/reject` | ✅ | teacher, admin | Refuser (ownership check) |
| DELETE | `/api/enrollments/:id` | ✅ | any | Annuler sa propre demande (pending only) |

### Admin (`routes/admin.js`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/api/admin/users` | ✅ | admin | Liste tous les utilisateurs |
| PUT | `/api/admin/users/:id/role` | ✅ | admin | Changer le rôle (last-admin guard) |
| GET | `/api/admin/courses` | ✅ | admin | Tous les cours (avec teacher info) |

### Autres

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/health` | ❌ | Health check `{ status: 'ok' }` |
| * | `*` (404) | ❌ | `{ error: { code: 'NOT_FOUND' } }` |

---

## 4. Tables / Entités (Supabase PostgreSQL)

Migration: `supabase/migrations/001_core_schema.sql`

### Tables

| Table | Colonnes principales | Notes |
|-------|---------------------|-------|
| **profiles** | id, google_sub (UNIQUE), email, display_name, avatar_url, role, created_at, updated_at | 1er user → admin, les autres → student |
| **courses** | id, teacher_id (FK profiles), title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at | FK vers profiles. classroom_id/url sont nullable |
| **enrollments** | id, student_id (FK profiles), course_id (FK courses), status, created_at, updated_at | UNIQUE(student_id, course_id). ON DELETE CASCADE sur les 2 FK |
| **user_sessions** | (auto-créé par connect-pg-simple) | Stocke les sessions express |

### Enums

- `user_role`: `'student'`, `'teacher'`, `'admin'`
- `course_status`: `'draft'`, `'published'` — pas d'état `archived` ni `deleted`
- `enrollment_status`: `'pending'`, `'approved'`, `'rejected'`
- `skill_level`: `'beginner'`, `'intermediate'`, `'advanced'`, `'all_levels'`

### Indexes

- `idx_profiles_role`, `idx_courses_teacher`, `idx_courses_status`, `idx_enrollments_student`, `idx_enrollments_course`, `idx_enrollments_status`

---

## 5. Intégrations externes

| Service | Utilisation | Fichier clé |
|---------|------------|-------------|
| **Google OAuth 2.0** | Authentification (openid, profile, email) | `config/google.js`, `routes/auth.js` |
| **Google Classroom API** | Validation de cours (GET /v1/courses/{id}), lien classroom_url | `services/classroomService.js` |
| **Supabase** | Base de données PostgreSQL, SDK JS (service_role key) | `config/supabase.js` |
| **express-session** | Sessions HTTP-only cookies (7 jours) | `middleware/session.js` |
| **connect-pg-simple** | Store sessions dans PostgreSQL | `middleware/session.js` |
| **Vercel** | Hébergement (client + server) | `vercel.json`, trust proxy en production |

---

## 6. États métier

### Enrollment State Machine

```
none → pending (requestEnrollment)
pending → approved (approveEnrollment)
pending → rejected (rejectEnrollment)
rejected → pending (re-request, retryable via upsert)
approved → terminal
```

**Guards**:
- Course doit être `published` (sinon 400)
- Déjà `pending` → 409 ALREADY_PENDING
- Déjà `approved` → 409 ALREADY_APPROVED
- `rejected` → retryable (upsert remet à `pending`)

### Course States

- `draft` — visible seulement par le teacher propriétaire et les admins (via `/manage`)
- `published` — visible dans le catalogue public

**Pas d'état `archived` ni `deleted`** dans le schéma actuel.

### Auth States

- Non authentifié → session absente ou `userId` manquant
- Authentifié → session avec `userId`, `role`, `googleTokens`
- Session 7 jours, httpOnly cookie

---

## 7. Middleware

| Middleware | Effet |
|-----------|-------|
| `requireAuth` | Vérifie `req.session.userId` → 401 si absent, attache `req.user` |
| `requireRole('teacher','admin')` | Vérifie `req.user.role` → 403 si non autorisé |
| `errorHandler` | Global — transforme les erreurs en JSON `{ error: { code, message } }` |

---

## 8. Hypothèses et zones incertaines

1. **Pas de whitelist utilisateurs** — tout compte Google peut se connecter
2. **Pas de limitation du nombre d'étudiants par cours** — pas trouvé dans le code
3. **Pas de page de profil utilisateur** — le MVP ne semble pas en avoir
4. **Pas d'archivage de cours** — seulement draft/published
5. **Google Classroom est READ-ONLY** — validation seulement, pas de création de cours ni sync de roster
6. **Classroom accessible via lien uniquement** — pas d'intégration iframe ou API directe côté client
7. **Pas de notifications** (email, in-app) — confirmé par le README ("No notifications in v1")
8. **DashboardLayout** — inféré du code (`components/layout/DashboardLayout.jsx`), probablement un layout avec sidebar/nav
9. **RequireAuth** — composant wrapper qui vérifie l'auth avant de render les enfants
10. **apiClient** — envoie `credentials: 'include'` pour que les cookies de session soient envoyés

---

## 9. Résumé pour génération de diagrammes

- **3 rôles réels** + visitor (non-auth)
- **10 pages frontend** (dont NotFound et CourseForm en mode create/edit)
- **16 routes API** (hors health et 404)
- **3 tables métier** + 1 table session auto-gérée
- **4 enums** (user_role, course_status, enrollment_status, skill_level)
- **2 intégrations Google** (OAuth + Classroom API read-only)
- **1 state machine** (enrollments avec 4 transitions valides)
- **Pas d'archivage, pas de notifications, pas de paiement, pas de whitelist**
