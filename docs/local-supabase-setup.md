# P-26J — Repair local Supabase catalog setup

**Date**: 2026-06-12  
**Statut**: Document technique actif
**Dernière mise à jour**: 2026-06-12

---

## 📋 Préalables

| Élément | Status |
|---------|--------|
| `GOOGLE_CLIENT_ID` config | [ ] |
| `GOOGLE_CLIENT_SECRET` config | [ ] |
| `CLASSROOM_OAUTH_ENABLED` config | [ ] |
| `CLIENT_ORIGIN` config | [ ] |
| Build frontend (type-check) | [ ] |
| Build backend (type-check) | [ ] |

---

## 🧪 Phase 1: Mode Safe (CLASSROOM_OAUTH_ENABLED=false)

### Test de détection

| Test | Commande/Action | Attendu | Statut |
|------|-----------------|---------|--------|
| 1.1 Status endpoint | `GET /api/classroom/oauth/status` | `{"oauthEnabled": false}` | [ ] |
| 1.2 OAuth start | `GET /api/classroom/oauth/start` | 404 Not Found | [ ] |
| 1.3 OAuth callback | `GET /api/classroom/oauth/callback` | 404 Not Found | [ ] |
| 1.4 List courses | `GET /api/classroom/courses` | 404 Not Found | [ ] |
| 1.5 Link course | `PUT /api/courses/1/classroom` | 404 Not Found | [ ] |

### Test UI

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 2.1 Dashboard teacher | Connecté → Dashboard | "Google Classroom désactivé" | [ ] |
| 2.2 Dashboard admin | Connecté → Dashboard | "Google Classroom désactivé" | [ ] |
| 2.3 CourseFormPage | Édition cours | "Liste indisponible" ou message similaire | [ ] |

---

## 🧪 Phase 2: Mode Test (CLASSROOM_OAUTH_ENABLED=true)

### Prérequis
- Compte Google avec accès Classroom
- Autorisation `classroom.courses.readonly` activée
- Course Metableton avec `teacherId` correct

### Test OAuth

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 1.1 OAuth start | Clic "Connecter Google Classroom" | Consent screen Google ouvert | [ ] |
| 1.2 OAuth callback | Autoriser | Redirect `/dashboard/teacher` | [ ] |
| 1.3 Status après login | `GET /api/classroom/oauth/status` | `{"connected": true, "expiresAt": ...}` | [ ] |

### Test List Courses

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 2.1 List courses | `GET /api/classroom/courses` | Array de cours (ex: `[{"id":"867627730178","name":"ETM 101",...}]`) | [ ] |
| 2.2 Format cours | Vérifier structure | `id`, `name`, `section`, `courseState`, `alternateLink` | [ ] |

### Test Lien Course (teacher/admin)

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 3.1 Sélectionner cours | Clic "Lier ce cours" sur une option | Course Metableton mis à jour | [ ] |
| 3.2 Vérifier URL | `GET /api/courses/:id` | `classroomUrl` contient `classroom.google.com` | [ ] |
| 3.3alternateLink | URL contenue | Commence par `https://classroom.google.com/...` | [ ] |
| 3.4 Base64url | Entrer alternateLink (ex: `ODY3NjI3NzMwMTc4`) | Décode vers ID numérique | [ ] |

### Test UI CourseFormPage

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 4.1 Affichage liste | Édition cours | Liste déroulante des cours Classroom | [ ] |
| 4.2 Loading state | Pendant chargement | "Chargement..." ou spinner | [ ] |
| 4.3 Vider liste | Après reload | Listefresh (pas de cache) | [ ] |
| 4.4 Message vide | Aucun cours | Message "Aucun cours disponible" | [ ] |

### Test Student Flow

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 5.1 Enrollment | Élève approuvé | `status = 'approved'` | [ ] |
| 5.2 Dashboard student | Connecté → Dashboard | Lien "Ouvrir Google Classroom" | [ ] |
| 5.3 Message invitation | Student approuvé | Message d'invitation visible | [ ] |
| 5.4 Message prof | Admin voit cours | Reminder d'invitation visible | [ ] |

### Test Error Handling

| Test | Action | Attendu | Statut |
|------|--------|---------|--------|
| 6.1 Token expiré | Token `googleClassroomTokens` expiré | 401 avec `CLASSROOM_NOT_CONNECTED` | [ ] |
| 6.2 Course non trouvé | ID Classroom invalide | 400 avec `CLASSROOM_NOT_FOUND` | [ ] |
| 6.3 Accès refusé | Non invité dans Classroom | 403 avec `CLASSROOM_FORBIDDEN` | [ ] |

---

## 📊 Checklist finale

| Élément | Status |
|---------|--------|
| Tous les tests Phase 1 passés | [ ] |
| Tous les tests Phase 2 passés | [ ] |
| Aucun log debug résiduel | [ ] |
| Build type-check OK (frontend) | [ ] |
| Build type-check OK (backend) | [ ] |
| Documentation à jour | [ ] |

---

## 🔄 Rollback Procedure

Si test échoue ou besoin de rollback:

```bash
# Revert les commits P-26
git log --oneline | grep "P-26"
git revert HEAD~1  # Dernier commit P-26H/P-26I
git revert HEAD~1  # P-26F-polish
git revert HEAD~1  # P-26F
```

---

## 📝 Notes de test

| Date | Testeur | Phase | Notes |
|------|---------|-------|-------|
| 2026-06-12 | CI/CD | Toutes | Build OK, type-check OK |