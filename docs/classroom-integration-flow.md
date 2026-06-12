# P-26 - Integration Google Classroom - Flow Complet

**Date**: 2026-06-12  
**Statut**: Document technique  
**Dernière mise à jour**: 2026-06-12

---

## Vue d'ensemble

Metableton intègre Google Classroom comme **campus central pédagogique**. L'architecture sépare complètement:

- **Login principal**: OAuth Google pour l'authentification (`/api/auth/google`)
- **Classroom OAuth**: OAuth séparé pour accéder aux cours Classroom (`/api/classroom/*`)

```
┌─────────────────────────────────────────────────────────────┐
│                    Login Principal (OAuth)                   │
│  Scope: openid, profile, email                              │
│  Token: req.session.googleTokens                            │
│  Usage: Authentification utilisateur                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Google Classroom OAuth                   │
│  Scope: classroom.courses.readonly                          │
│  Token: req.session.googleClassroomTokens                   │
│  Usage: Lister/lier les cours Classroom                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Flag: `CLASSROOM_OAUTH_ENABLED`

| Valeur | Comportement |
|--------|--------------|
| `false` (défaut) | Routes Classroom renvoient 404, UI affiche "désactivé" |
| `true` | OAuth Classroom opérationnel, users peuvent lier |

**En production**: Laisser `CLASSROOM_OAUTH_ENABLED=false` par défaut.

---

## Variables d'environnement nécessaires

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `GOOGLE_CLIENT_ID` | Client ID OAuth Google | ✅ Oui |
| `GOOGLE_CLIENT_SECRET` | Client Secret OAuth Google | ✅ Oui |
| `GOOGLE_REDIRECT_URI` | Redirect URI pour login principal | ✅ Oui |
| `CLIENT_ORIGIN` | URL du frontend (ex: https://metableton-ecole.vercel.app) | ✅ Oui |
| `CLASSROOM_OAUTH_ENABLED` | Feature flag pour Classroom | ❌ Non (false par défaut) |

---

## Différence: Google login vs Google Classroom OAuth

| Aspect | Login Principal | Classroom OAuth |
|--------|-----------------|-----------------|
| **URL** | `/api/auth/google` | `/api/classroom/oauth/start` |
| **Scope** | `openid, profile, email` | `classroom.courses.readonly` |
| **Token storage** | `req.session.googleTokens` | `req.session.googleClassroomTokens` |
| **Redirect** | `/dashboard/{role}` | `/dashboard/{role}` |
| **Utilisation** | Authentification | Lister/lier Classroom |

---

## Routes backend

### OAuth Flow

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| `GET` | `/api/classroom/oauth/start` | Redirect to Google OAuth | requireAuth, teacher/admin |
| `GET` | `/api/classroom/oauth/callback` | Handle OAuth callback | requireAuth, teacher/admin |
| `GET` | `/api/classroom/oauth/status` | Get OAuth status | requireAuth, teacher/admin |

### Course Management

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| `GET` | `/api/classroom/courses` | List Classroom courses | requireAuth, teacher/admin |
| `PUT` | `/api/courses/:id/classroom` | Link course to Classroom | requireAuth, teacher/admin |

---

## Flow teacher/admin

### Étape 1: Se connecter à Metableton
```
GET /api/auth/google
→ Redirect Google OAuth
→ Callback: /api/auth/google/callback
→ Session: googleTokens (login principal)
→ Redirect: /dashboard/{role}
```

### Étape 2: Connecter Google Classroom
```
Clic "Connecter Google Classroom"
→ GET /api/classroom/oauth/start
→ Redirect Google OAuth (scope: classroom.courses.readonly)
→ Callback: /api/classroom/oauth/callback
→ Session: googleClassroomTokens (Classroom OAuth)
→ Redirect: /dashboard/{role}
```

### Étape 3: Voir les Classroom disponibles
```
GET /api/classroom/courses
→ Google Classroom API: courses.list()
→ Retour: Array de cours avec id, name, section, courseState, alternateLink
```

### Étape 4: Modifier un cours Metableton
```
/dashboard/teacher/courses/:id/edit
→ ClassroomSection component affiche la liste
→ Teacher voit cours disponibles
```

### Étape 5: Choisir un Classroom depuis la liste
```
Clic "Lier ce cours" (pour un course dans la liste)
→ linkClassroom(courseId, { classroomUrl: course.alternateLink })
→ Serveur valide via Google API
→ Stocke classroom_id + classroom_url
```

### Étape 6: Lier le cours
```
POST PUT /api/courses/:id/classroom
→ validateClassroomCourse(tokens, parsedId)
→ buildClassroomUrl(parsedId) ou use alternateLink
→ setClassroomLink(courseId, { classroomId, classroomUrl })
→ Retour: course mis à jour
```

---

## Flow student

### Étape 1: Être approuvé dans Metableton
```
Enrollment: status = 'approved'
→ Student voit le cours dans son dashboard
```

### Étape 2: Voir le lien Classroom
```
StudentDashboardPage.jsx
→ ClassroomLink component
→ Affiche "Ouvrir Google Classroom"
→ Affiche message d'invitation
```

### Étape 3: Accepter l'invitation Google
```
Professeur invite élève dans Google Classroom
→ Google envoie email d'invitation
→ Élève clique dans l'email
→ Accepte l'invitation
```

### Étape 4: Ouvrir Classroom avec le bon compte
```
Clic "Ouvrir Google Classroom"
→ redirect vers classroom_url (alternateLink)
→ Student ouvre le cours Google Classroom
→ Accès aux devoirs, materials, Meet
```

---

## Limites actuelles

| Fonctionnalité | Status | Raison |
|----------------|--------|--------|
| Invitation automatique | ❌ | Teacher doit inviter manuellement |
| Création Classroom | ❌ | Création via Google Classroom uniquement |
| Synchronisation élèves | ❌ | Pas de scope `classroom.rosters` |
| Synchronisation devoirs | ❌ | Pas de scope `classroom.coursework` |
| Synchronisation notes | ❌ | Pas de scope `classroom.grades` |
| Webhook notifications | ❌ | Non implémenté |

**Responsabilité du professeur**: Inviter les élèves directement dans Google Classroom.

---

## Checklist de test prod (P-26I)

### Mode safe (CLASSROOM_OAUTH_ENABLED=false)

- [ ] `/api/classroom/oauth/status` → 200 avec `oauthEnabled: false`
- [ ] `/api/classroom/oauth/start` → 404 Not Found
- [ ] `/api/classroom/oauth/callback` → 404 Not Found
- [ ] `/api/classroom/courses` → 404 Not Found
- [ ] UI admin/teacher affiche "Google Classroom désactivé"

### Mode test (CLASSROOM_OAUTH_ENABLED=true)

- [ ] OAuth Google consent s'ouvre
- [ ] Callback revient dashboard avec badge "Connecté"
- [ ] `/api/classroom/oauth/status` → `connected: true`
- [ ] `/api/classroom/courses` → array de cours (ex: `ETM 101 / PROD / ACTIVE`)
- [ ] CourseFormPage affiche la liste Classroom
- [ ] "Lier ce cours" fonctionne
- [ ] `classroom_url` sauvegarde l'alternateLink officiel
- [ ] Student approuvé voit le lien "Ouvrir Google Classroom"
- [ ] Student voit message d'aide invitation
- [ ] Lien ouvre le bon cours Google Classroom

### Rollback

Si besoin de rollback:
```bash
git revert HEAD~1  # Revert P-26H
git revert HEAD~1  # Revert P-26F-polish
git revert HEAD~1  # Revert P-26F
```

---

## Logs utiles (à conserver)

| Log | Emplacement | Raison |
|-----|-------------|--------|
| `[classroom-courses] Google API error status` | `classroomService.js:255` | Troubleshooting API errors |
| `[classroom-courses] Google API error reason` | `classroomService.js:256` | Troubleshooting API errors |
| `[classroom-courses] Google API error message` | `classroomService.js:257` | Troubleshooting API errors |

**Ne jamais logger**: tokens, cookies, code OAuth, session complète.

---

## Erreurs spécifiques

| Code | HTTP | Message | Action |
|------|------|---------|--------|
| `CLASSROOM_OAUTH_DISABLED` | 404 | Feature flag désactivé | Activer CLASSROOM_OAUTH_ENABLED |
| `CLASSROOM_NOT_CONNECTED` | 401 | Token non présent | Se connecter via Google Classroom |
| `CLASSROOM_NOT_FOUND` | 400 | ID/URL invalide | Vérifier l'identifiant |
| `CLASSROOM_FORBIDDEN` | 403 | Accès refusé | Être invité dans le Classroom |
| `CLASSROOM_SCOPE_MISSING` | 403 | Scope manquant | Reconnecter avec autorisation Classroom |
| `CLASSROOM_INVALID_ARGUMENT` | 400 | Argument invalide | Vérifier les paramètres |

---

**Document généré par P-26I**  
**Date**: 2026-06-12  
**Statut**: Document technique actif
