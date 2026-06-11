# P-26A — Roadmap sécurisée pour Google Classroom

**Date**: 2026-06-11  
**Statut**: Documentation planning only  
**Dernière mise à jour**: 2026-06-11

---

## Contexte

Le MVP est stable :

| Composant | Status |
|-----------|--------|
| Auth student/teacher/admin | ✅ OK |
| Proxy Vercel `/api/*` | ✅ OK |
| Inscriptions (POST /api/enrollments) | ✅ OK |
| Désinscription (DELETE/PATCH /api/enrollments/:id) | ✅ OK |
| Dashboard (student/teacher/admin) | ✅ OK |

### Échec précédent : P-24E

P-24E "Connexion Google Classroom séparée" a tenté d'intégrer Classroom dans le flux principal OAuth. Cela a cassé l'auth principale (students unable to login, teachers unable to login).

**Commit**: c7acc08 (revert)  
**Action**: Rollback complet du commit P-24E

---

## Objectif

Créer une roadmap technique prudente pour réintroduire Google Classroom **en micro-étapes**, sans casser l'auth principale.

**Principe directeur** : Aucune story Classroom ne doit modifier le login principal `/api/auth/google`.

---

## 1. Pourquoi Classroom doit être séparé du login principal

| Raison | Explication |
|--------|-------------|
| **Scope minimal** | Le scope `classroom.courses.readonly` n'est nécessaire que pour les fonctionnalités avancées, pas pour l'auth de base |
| **Isolation des erreurs** | Un bug dans le flux Classroom ne doit pas impacter l'auth principale |
| **Dépendances externes** | Classroom API est un service externe avec latence variable — ne pas risquer l'auth principal |
| **Permissions granulaires** | Les users ont le droit de refuser Classroom sans être bloqués dans l'auth |
| **Rollback simple** | Si Classroom casse, on revert une feature complète sans toucher à l'auth |

### Constat historique

P-24E a intégré Classroom dans `server/src/routes/auth.js` → modification du flux principal → **casse l'auth pour tous les users**.

**Lesson learned**: Séparer complètement les deux flows.

---

## 2. Règles Graphify à respecter

### Règle #1: Aucune modification sans `graphify query`

Avant toute modification, exécuter:
```bash
graphify query "<feature|function>"
```

**Cas d'usage**:
- `graphify query "getSupabase()"` — voir tous les callers
- `graphify query "findOrCreateGoogleProfile()"` — check OAuth impact
- `graphify query "requireAuth()"` — vérifier l'ordre des middlewares

### Règle #2: Centralité entreness = danger

| Fonction | Centralité | Impact d'une modif |
|----------|------------|-------------------|
| `getSupabase()` | 27 edges | **CRITICAL** — casse tout le backend |
| `getOauth2Client()` | 16+ edges | **HIGH** — affecte auth + Classroom |
| `findOrCreateGoogleProfile()` | 34 nodes | **HIGH** — bootstrap admin |
| `requireAuth()` | 16+ edges | **HIGH** — gatekeeper de la sécurité |
| `requireRole()` | 13+ edges | **HIGH** — contrôle d'accès |

### Règle #3: Aucun changement SQL sans audit

Toute modification de schema doit être préalablement auditée via:
```bash
graphify explain "enrollment state machine"
```

---

## 3. Fonctions/fichiers sensibles

### Fichiers interdits à modifier (sauf analyse Graphify complète)

| Fichier | Raison | Fonctions critiques |
|---------|--------|---------------------|
| `server/src/routes/auth.js` | Login principal | OAuth callback, token exchange, session creation |
| `server/src/config/google.js` | OAuth client | `getOauth2Client()` — singleton partagé |
| `server/src/middleware/session.js` | Session | `PgSessionStore`, cookie options |
| `server/src/middleware/auth.js` | Auth guard | `requireAuth()` — attache `req.user` |
| `server/src/services/profileService.js` | User provisioning | `findOrCreateGoogleProfile()` — admin bootstrap |
| `server/src/routes/courses.js` | Course management | Linking Classroom, classroomService |
| `server/src/services/enrollmentService.js` | Business logic | State machine, ownership checks |

### Pattern à éviter (P-24E)

```javascript
// ❌ WRONG: Classroom OAuth intégré dans auth.js
// Le scope classroom.courses.readonly modifie le flux principal
const oauth2Client = getOauth2Client({
  scopes: ['openid', 'profile', 'email', 'classroom.courses.readonly']
  //                                               ^^^^^^^^^^^^^^^^^
  // Ce scope ajouté au flux principal a cassé l'auth
});
```

### Pattern à privilégier (P-26A)

```javascript
// ✅ CORRECT: Classroom OAuth complètement séparé
// Pas de modification de auth.js, google.js pour Classroom
// Nouveau service: classroomService.js (déjà existant)
// Nouvelle route: /api/classroom/* (à créer)
```

---

## 4. Micro-stories proposées

### P-26B : Route backend diagnostic Classroom (désactivée par défaut)

**Objectif**: Vérifier que Classroom API est accessible sans casser l'auth.

**Scope**: 
- `/api/classroom/health` → 200 OK (disabled by default)
- Configuration dans `.env`: `CLASSROOM_DIAGNOSTIC_ENABLED=false`

**Fichiers à créer/modifier**:
- `server/src/routes/classroom.js` (nouveau)
- `server/src/app.js` (ajouter route)

**Tâches**:
1. Créer route `/api/classroom/health` → 404 par défaut
2. Si `CLASSROOM_DIAGNOSTIC_ENABLED=true` → ping Classroom API
3. Retour JSON: `{ status: 'ok', classroomApi: true/false }`

**Tests**:
```bash
# Par défaut (disabled)
curl -X GET http://localhost:3000/api/classroom/health
# → 404 Not Found

# With flag enabled
curl -X GET http://localhost:3000/api/classroom/health
# → 200 OK
# → { "status": "ok", "classroomApi": true }
```

**Rollback**: Supprimer `server/src/routes/classroom.js` et remove route dans `app.js`.

---

### P-26C : Test OAuth Classroom manuel sans UI

**Objectif**: Tester le flow OAuth Classroom complet sans interaction UI.

**Scope**:
- `GET /api/classroom/oauth/start` → Redirect vers Google
- `GET /api/classroom/oauth/callback` → Handle callback
- Stockage dans `req.session.googleClassroomTokens`

**Fichiers à modifier**:
- `server/src/routes/classroom.js` (à étendre)
- `server/src/services/classroomService.js` (existant, déjà importé)

**Tâches**:
1. Créer route `/api/classroom/oauth/start` (redirect to Google)
2. Créer route `/api/classroom/oauth/callback` (handle token exchange)
3. Stocker `tokens` dans `req.session.googleClassroomTokens`
4. Redirect vers `/dashboard` (ou page de confirmation)

**Tests**:
```bash
# Start OAuth flow
curl -L -X GET http://localhost:3000/api/classroom/oauth/start
# → Redirect to Google OAuth consent screen

# After user consent
curl -L -X GET "http://localhost:3000/api/classroom/oauth/callback?code=..."
# → Store tokens in session
# → Redirect to dashboard
```

**Rollback**: Supprimer les deux routes OAuth dans `classroom.js`.

---

### P-26D : Bouton UI teacher/admin

**Objectif**: Ajouter bouton "Connecter Google Classroom" pour teacher/admin.

**Scope**:
- `DashboardLayout.jsx` — bouton visible pour teacher/admin
- `client/src/api/classroom.js` — API wrapper
- State: connected/disconnected/connecting

**Fichiers à créer/modifier**:
- `client/src/api/classroom.js` (nouveau)
- `client/src/components/layout/DashboardLayout.jsx` (modification mineure)

**Tâches**:
1. Créer `client/src/api/classroom.js` avec:
   - `connectClassroom()` → GET `/api/classroom/oauth/start`
   - `getGoogleClassroomTokens()` → check session
2. Ajouter bouton dans `DashboardLayout` pour teacher/admin
3. Afficher state: `Connect`, `Connected`, `Disconnect`

**Conditions d'affichage**:
```javascript
// Only for teacher or admin
if (user.role === 'teacher' || user.role === 'admin') {
  // Show "Connect Google Classroom" button
}
```

**Rollback**: Supprimer `client/src/api/classroom.js` et bouton dans `DashboardLayout.jsx`.

---

### P-26E : Linking Classroom avec tokens Classroom

**Objectif**: Lier un cours à une classe Classroom existante.

**Scope**:
- `/api/courses/:id/link-classroom` → POST avec `classroomId`
- Stocker `classroom_id` et `classroom_url` dans `courses` table
- Utiliser `req.session.googleClassroomTokens` pour validation

**Fichiers à modifier**:
- `server/src/routes/courses.js` (étendre route existante)
- `server/src/services/classroomService.js` (existant)

**Tâches**:
1. Créer route `POST /api/courses/:id/link-classroom`
2. Valider `req.session.googleClassroomTokens.access_token`
3. Appeler Classroom API pour vérifier le `classroomId`
4. Store `classroom_id`, `classroom_url` dans `courses` table

**Validation**:
```javascript
// Check Classroom tokens exist
if (!req.session?.googleClassroomTokens?.access_token) {
  return res.status(400).json({
    error: { code: 'CLASSROOM_NOT_CONNECTED', message: '...' }
  });
}
```

**Rollback**: Supprimer la route `POST /api/courses/:id/link-classroom`.

---

### P-26F : Sélection d'un Classroom depuis une liste

**Objectif**: Lister les cours Classroom disponibles pour le teacher.

**Scope**:
- `GET /api/classroom/courses` → Liste des classes Classroom
- Mapping avec cours existants
- UI de sélection

**Fichiers à modifier**:
- `server/src/routes/classroom.js` (étendre)
- `client/src/api/classroom.js` (étendre)
- `client/src/pages/dashboard/TeacherDashboardPage.jsx` (étendre)

**Tâches**:
1. Créer route `GET /api/classroom/courses`
2. Appeler Classroom API `courses.list()` avec pagination
3. Afficher liste avec:
   - `courseName` (titre)
   - `id` (Classroom ID)
   - `courseState` (active, archived, etc.)
4. Si déjà linked → afficher badge

**Rollback**: Supprimer la route `GET /api/classroom/courses`.

---

## 5. Tests obligatoires après chaque micro-story

### Test #1: Auth principale intacte

Après chaque story, **impérativement** tester:
```bash
# Student login
curl -X GET http://localhost:3000/api/auth/me
# → 200 OK, role: "student"

# Teacher login
curl -X GET http://localhost:3000/api/auth/me
# → 200 OK, role: "teacher"

# Admin login
curl -X GET http://localhost:3000/api/auth/me
# → 200 OK, role: "admin"
```

### Test #2: Aucune modification de `server/src/routes/auth.js`

```bash
git diff server/src/routes/auth.js
# → doit être vide (ou seulement commentaires)
```

### Test #3: Aucune modification de `server/src/config/google.js`

```bash
git diff server/src/config/google.js
# → doit être vide (ou seulement commentaires)
```

### Test #4: Session cookie intacte

```bash
# Vérifier que la session stocke uniquement les scopes attendus
# Pas de `classroom.courses.readonly` dans le flux principal
```

---

## 6. Conditions de rollback

### Rollback automatique (si auth cassée)

```
1. Le commit est déployé en production
2. Student/teacher unable to login
3. classroom.courses.readonly intégré dans auth principal

Action: git revert <commit-hash-P-26X>
```

### Rollback manuel (story P-26X)

| Story | Commande |
|-------|----------|
| P-26B | `rm server/src/routes/classroom.js` + remove route |
| P-26C | Supprimer routes OAuth dans `classroom.js` |
| P-26D | Supprimer `client/src/api/classroom.js` + bouton |
| P-26E | Supprimer route `link-classroom` |
| P-26F | Supprimer route `/api/classroom/courses` |

### Rollback complet (si plusieurs stories)

```bash
git log --oneline | grep P-26
# Voir tous les commits P-26X

# Revert dans l'ordre inverse
git revert HEAD~4  # P-26F
git revert HEAD~3  # P-26E
git revert HEAD~2  # P-26D
git revert HEAD~1  # P-26C
git revert HEAD    # P-26B
```

---

## 7. Non-goals

### Ce qui n'est PAS inclus dans cette roadmap:

| Feature | Status | Raison |
|---------|--------|--------|
| Roster (liste d'étudiants) | ❌ Out of scope | Nécessite scope `classroom.rosters.readonly` |
| Devoirs (homework) | ❌ Out of scope | Nécessite scope `classroom.course-work` |
| Notes (grades) | ❌ Out of scope | Nécessite scope `classroom.grades` |
| Drive integration | ❌ Out of scope | Nécessite scope Drive |
| Création automatique de Classroom | ❌ Out of scope | Risque de duplication |
| Synchronisation horaire | ❌ Out of scope | Complexité élevée |

### Scope limité à:

- ✅ Lister les cours Classroom existants
- ✅ Lier un cours existant à une classe Classroom
- ✅ Afficher l'URL du cours Classroom dans le dashboard

---

## 8. Règle finale

### Aucune story Classroom ne doit modifier le login principal `/api/auth/google`

**Vérification avant chaque commit**:

```bash
# Vérifier que auth.js n'a PAS été modifié
git diff server/src/routes/auth.js | grep -v "^\+" | grep -v "^diff" | grep -v "^index" | grep -v "^+++" | grep -v "^@@" | grep -v "^$"
# → doit être vide

# Vérifier que google.js n'a PAS été modifié (sauf pour Classroom)
git diff server/src/config/google.js
# → doit être vide (ou seulement additions pour Classroom)
```

**Pattern à suivre**:

```javascript
// server/src/app.js
import authRouter from './routes/auth.js';        // ✅ Login principal (unchanged)
import classroomRouter from './routes/classroom.js'; // ✅ Classroom séparé

app.use(authRouter);       // Login principal
app.use(classroomRouter);  // Classroom séparé
```

---

## Raccourcis Graphify pour validation

```bash
# Avant chaque story
graphify query "getSupabase()"           # Check centralité
graphify query "findOrCreateGoogleProfile()"  # Check OAuth impact
graphify query "requireAuth()"           # Check middleware order
graphify diagnose multigraph             # Check import cycles

# Après chaque story
graphify update .                        # Update AST graph
```

---

**Document généré par P-26A**  
**Date**: 2026-06-11  
**Statut**: Planning only — aucune modification de code
