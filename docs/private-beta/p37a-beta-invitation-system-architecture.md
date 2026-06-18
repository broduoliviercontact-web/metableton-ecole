# P-37A — Beta Invitation System Architecture

**Date:** 2026-06-17  
**Tag git:** `mvp-demo-ready`  
**Statut:** Conception architecture - Aucun code implémenté

---

## Objectif

Concevoir un système officiel mais simple d'invitation à la bêta privée permettant à un admin de créer des invitations uniques pour des personnes spécifiques, avec un lien qui crée ou met à jour un profil et attribue le rôle bêta.

---

## Pourquoi ce système

**Problème actuel:**
- La bêta privée (P-29) nécessite 3-5 testeurs
- Actuellement, les testeurs doivent se créer un compte via Google OAuth
- Aucune mechanisme pour inviter officiellement des personnes spécifiques
- Aucune traçabilité des invitations (qui a invité qui, quand, avec quel rôle)
- Aucun contrôle sur qui peut accéder à la bêta

**Objectif du système:**
- Admin crée des invitations avec email cible
- Chaque invitation a un lien unique (token)
- Testeur clique sur le lien et accepte
- Profil est créé/mis à jour avec le rôle invité
- Invitation est marquée comme acceptée (une seule utilisation)

---

## Flow utilisateur

### Pour le testeur (invité)

```
1. L'utilisateur reçoit un email (manuellement envoyé par admin)
2. L'utilisateur clique sur le lien: /beta/invite/:token
3. La page affiche les détails de l'invitation (email invité, rôle, expiry)
4. L'utilisateur clique sur "Accepter l'invitation"
5. L'utilisateur est redirigé vers Google OAuth
6.Après OAuth, le backend vérifie:
   - Le token est valide et non expiré
   - L'email Google correspond à l'email invité
   - Le profil n'existe pas déjà (ou est mis à jour)
7. Le profil est créé/mis à jour avec le rôle invité
8. L'utilisateur est connecté automatiquement
9. L'invitation est marquée comme "accepted"
10. L'utilisateur accède à son dashboard (student/teacher/admin)
```

**Notes:**
- Aucun mot de passe n'est demandé
- L'invite accepte via Google OAuth existant
- L'email Google doit correspondre à l'email invité (sécurité)

---

### Pour l'admin (invitant)

```
1. Admin se connecte (rôle admin requis)
2. Admin va sur "Invitations bêta" (nouvelle page admin)
3. Admin clique "Créer une invitation"
4. Admin remplit le formulaire:
   - Email du testeur
   - Rôle souhaité (student/teacher/admin)
   - Date d'expiration (optionnelle)
   - Notes (optionnelles)
5. Admin clique "Envoyer l'invitation"
6. Le système génère un token unique
7. L'invitation est créée en base (statut: pending)
8. L'admin copie le lien et l'envoie manuellement au testeur
9. Plus tard, admin peut voir:
   - Liste de toutes les invitations
   - Statut de chaque invitation (pending/accepted/expired/revoked)
   - Détails de l'utilisateur connecté (si accepté)
10. Admin peut révoquer une invitation si nécessaire
```

---

## Modèle de données proposé

### Table `beta_invitations`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | `uuid` (primary key, default `gen_random_uuid()`) | ID unique de l'invitation |
| `email` | `text` (not null) | Email du testeur invité |
| `role` | `text` (not null, check constraint) | Rôle demandé: student/teacher/admin |
| `token_hash` | `text` (not null, unique) | Hash SHA-256 du token (jAMAIS le token brut) |
| `token_salt` | `text` (not null) | Salt aléatoire pour le hash |
| `status` | `text` (not null, default 'pending') | pending/accepted/expired/revoked |
| `expires_at` | `timestamptz` (nullable) | Date d'expiration (NULL = pas d'expiration) |
| `accepted_at` | `timestamptz` (nullable) | Date d'acceptation (NULL si non accepté) |
| `accepted_user_id` | `uuid` (nullable, foreign key → profiles.id) | ID de l'utilisateur qui a accepté |
| `created_by` | `uuid` (not null, foreign key → profiles.id) | ID de l'admin qui a créé l'invitation |
| `created_at` | `timestamptz` (default `now()`) | Date de création |
| `updated_at` | `timestamptz` (default `now()`) | Date de dernière mise à jour |
| `notes` | `text` (nullable) | Notes internes (optionnelles) |

**Commentaire:**
- Le `token_hash` et `token_salt` permettent de vérifier le token sans le stocker
- Le `token_hash` est unique pour éviter les collisions
- Le `accepted_user_id` permet de lier l'invitation à l'utilisateur final
- L'invitation ne peut être utilisée qu'une seule fois (statut change de `pending` à `accepted`)

---

## Statuts d'invitation

| Statut | Description | Utilisation |
|--------|-------------|-------------|
| `pending` | Invitation créée, en attente d'acceptation | Par défaut à la création |
| `accepted` | Invitation acceptée, utilisateur créé/mis à jour | Aprés OAuth et vérification |
| `expired` | Invitation dépassée sa date d'expiration | Vérifié avant acceptation |
| `revoked` | Invitation révoquée par l'admin | Action manuelle de l'admin |

**Transition diagram:**
```
pending ──[OAuth accepted]──> accepted
pending ──[expires]─────────> expired
pending ──[admin revokes]──> revoked
accepted ──[n/a]───────────> (terminal)
expired ──[n/a]────────────> (terminal)
revoked ──[n/a]────────────> (terminal)
```

---

## Rôles possibles

| Rôle | Description | Recommandation |
|------|-------------|----------------|
| `student` | Étudiant (peut s'inscrire à des cours) | ✅ Recommandé |
| `teacher` | Enseignant (peut gérer des cours) | ✅ Recommandé |
| `admin` | Administrateur (gouvernance complète) | ⚠️ Très prudent |

**Recommandation:**
- Commencer avec `student` et `teacher` principalement
- Réserver `admin` pour les tests très contrôlés
- Le rôle `admin` ne doit pas être donné à des testeurs externes

---

## Routes backend proposées

### Version MVP (implémentation progressive)

#### 1. Créer une invitation (POST)

```
POST /api/admin/beta-invitations
```

**Request body:**
```json
{
  "email": "testeur@example.com",
  "role": "student",
  "expires_at": "2026-07-31T23:59:59Z",
  "notes": "Invitation pour bêta P-29"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "email": "testeur@example.com",
    "role": "student",
    "token_hash": "sha256:...",
    "status": "pending",
    "expires_at": "2026-07-31T23:59:59Z",
    "created_by": "uuid",
    "created_at": "2026-06-17T12:00:00Z"
  }
}
```

**Middleware:** `requireAuth`, `requireRole('admin')`

**Logique:**
- Vérifier que l'utilisateur est admin
- Générer un token unique (UUID v4)
- Hasher le token avec salt (SHA-256)
- Créer l'invitation en base
- Retourner l'invitation (le token n'est jamais retourné)

**Note:** Le token doit être affiché ou envoyé à l'admin pour qu'il le copie/manually envoye

---

#### 2. Vérifier une invitation (GET)

```
GET /api/beta-invitations/:token
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "testeur@example.com",
    "role": "student",
    "status": "pending",
    "expires_at": "2026-07-31T23:59:59Z"
  }
}
```

**Response (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Invitation not found or already used."
  }
}
```

**Logique:**
- Hasher le token avec le salt de l'invitation
- Rechercher l'invitation par token_hash
- Vérifier le statut (pending, pas expired)
- Vérifier l'expiration
- Retourner les détails (sans token_hash)

---

#### 3. Accepter une invitation (POST)

```
POST /api/beta-invitations/:token/accept
```

**Request body:**
```json
{
  "google_email": "testeur@example.com"
}
```

**Response (200):**
```json
{
  "data": {
    "userId": "uuid",
    "role": "student",
    "redirect": "/dashboard"
  }
}
```

**Response (403 - email mismatch):**
```json
{
  "error": {
    "code": "EMAIL_MISMATCH",
    "message": "The Google email does not match the invited email."
  }
}
```

**Response (403 - expired):**
```json
{
  "error": {
    "code": "EXPIRED",
    "message": "This invitation has expired."
  }
}
```

**Logique:**
- Vérifier le token (GET /api/beta-invitations/:token)
- Vérifier que l'email Google correspond
- Mettre à jour l'invitation (status: accepted, accepted_at, accepted_user_id)
- Créer ou mettre à jour le profil (via `findOrCreateGoogleProfile`)
- Créer la session
- Retourner les données de redirection

---

#### 4. Lister les invitations (GET)

```
GET /api/admin/beta-invitations
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "testeur@example.com",
      "role": "student",
      "status": "pending",
      "expires_at": "2026-07-31T23:59:59Z",
      "created_by": "uuid",
      "created_at": "2026-06-17T12:00:00Z"
    }
  ]
}
```

**Middleware:** `requireAuth`, `requireRole('admin')`

---

#### 5. Révoquer une invitation (POST)

```
POST /api/admin/beta-invitations/:id/revoke
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "status": "revoked",
    "revoked_at": "2026-06-17T13:00:00Z"
  }
}
```

**Middleware:** `requireAuth`, `requireRole('admin')`

---

#### 6. Récupérer le token après création

```
GET /api/admin/beta-invitations/:id/token
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "token": "unique-token-string"
  }
}
```

**Middleware:** `requireAuth`, `requireRole('admin')`

**Note:** Cette route doit être utilisée immédiatement après la création pour récupérer le token à copier/envoyer.

---

## Page frontend proposée

### `/beta/invite/:token`

Page publique (pas besoin d'être connecté) affichée quand un testeur clique sur son lien d'invitation.

**États à gérer:**

| État | Message à afficher |
|------|-------------------|
| `loading` | "Vérification de l'invitation..." |
| `invitation_valid` | "Invitation valide pour **role**<br>Email invité: **email**<br>Expiration: **date**<br><button>Accepter l'invitation</button>" |
| `invitation_expired` | "Invitation expirée<br>Ce lien est périmé. Contactez l'administrateur." |
| `invitation_already_used` | "Invitation déjà utilisée<br>Ce lien a déjà été utilisé. Si vous n'avez pas de compte, créez-en un." |
| `invitation_revoked` | "Invitation révoquée<br>Ce lien n'est plus valide." |
| `email_mismatch` | "Email incorrect<br>Le lien a été envoyé à **email_invité**, mais vous êtes connecté en tant que **email_google**." |
| `accept_success` | "Invitation acceptée<br>Bienvenue sur Métableton École !<br>Redirection..." |
| `error` | "Une erreur est survenue.<br>Veuillez réessayer plus tard." |

**Design:**
- Layout simple sans Header/Footer (comme page de login)
- Style cohérent avec le design existing (sombre, studio/DAW)
- Bouton "Accepter" qui redirige vers `/api/auth/google`

---

### `/dashboard/admin/invitations` (admin only)

Page admin pour gérer les invitations.

**Fonctionnalités:**
- Bouton "Créer une invitation"
- Formulaire modale pour créer:
  - Email (required)
  - Rôle (required)
  - Expiration (optional)
  - Notes (optional)
- Tableau des invitations:
  - Email, Role, Status, Created, Expires, Action (revoke)
- Filtres:
  - Status (pending/accepted/expired/revoked)
  - Rôle
- Pagination (si nécessaire)

---

## Règles de sécurité

### Règles générales

1. **Service role key never exposed** - La service role key n'est utilisée que dans le backend (server/src/config/supabase.js)
2. **Token never stored** - Le token brut n'est jamais stocké en base, seul le hash (SHA-256 + salt)
3. **Email matching required** - L'email Google doit correspondre à l'email invité
4. **One-time use** - Une invitation ne peut être utilisée qu'une seule fois
5. **Expiration** - Les invitations peuvent avoir une date d'expiration
6. **Revocation** - Les invitations peuvent être révoquées
7. **Admin only** - Toutes les actions admin nécessitent le rôle `admin`

### Règles détaillées

#### Sécurité des tokens

```js
// Génération
const token = crypto.randomUUID() // UUID v4
const salt = crypto.randomUUID()
const tokenHash = sha256(token + salt) // stocké en base

// Vérification (côté serveur)
const inputHash = sha256(requestToken + storedSalt)
if (inputHash !== storedHash) {
  return 404 // pas de détails si token invalide
}
```

#### RLS (Row Level Security) sur `beta_invitations`

```sql
-- Admin peut lire/écrire ses propres invitations
-- Admin peut lire toutes les invitations
-- Public ne peut pas lire (sauf via le token hash)

-- Policy: admin can see all
CREATE POLICY "admin_view_invitations"
ON beta_invitations FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'admin'
));

-- Admin can create
CREATE POLICY "admin_create_invitation"
ON beta_invitations FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'admin'
));

-- Profile with matching email can accept (via API, not direct DB access)
-- (Enforced by API logic, not RLS)
```

#### Limites côté serveur

```js
// Rate limiting
// - Max 10 invitations créées par minute
// - Max 100 invitations par jour
// - Max 10 tentatives d'acceptation par email par minute

// Validation
// - Email: format RFC 5322
// - Role: 'student' | 'teacher' | 'admin'
// - expires_at: future date, max 365 days
```

---

## Interaction avec Google OAuth

### Flow intégré

```
1. Testeur clique "Accepter" → /api/auth/google
2. Google OAuth flow standard
3. Callback vers /api/auth/google/callback
4. Dans le callback, après vérification Google:
   - Rechercher l'invitation par email
   - Vérifier le statut
   - Mettre à jour le profil
   - Marquer l'invitation comme acceptée
   - Créer la session
5. Redirection vers le dashboard
```

### Modifications nécessaires

**Fichier:** `server/src/routes/auth.js`

Le callback `/api/auth/google/callback` doit être modifié pour:

1. Avant la création de session, vérifier si l'utilisateur a une invitation
2. Si oui, vérifier le statut et l'expiration
3. Si valide, marquer l'invitation comme acceptée
4. Créer ou mettre à jour le profil avec le rôle invité
5. Créer la session normalement

**Code à ajouter (approximatif):**

```js
// Dans /api/auth/google/callback, après la vérification Google

// 6. Check for beta invitation
const invitation = await checkBetaInvitation(email)
if (invitation && invitation.status === 'pending' && !isExpired(invitation)) {
  // Mark invitation as accepted
  await acceptBetaInvitation(invitation.id, userId)
  // Update role if different from default
  if (invitation.role !== 'student') {
    await updateUserRole(userId, invitation.role)
  }
  // Link invitation to user
  await linkInvitationToUser(invitation.id, userId)
}
```

---

## Interaction avec les rôles user

### Rôle par défaut

- **Premier utilisateur:** `admin` (admin bootstrap, déjà existant)
- **Nouveaux utilisateurs (OAuth standard):** `student`
- **Via invitation:** rôle spécifié dans l'invitation

### Mise à jour du rôle

```js
// Dans acceptBetaInvitation()
await updateUserRole(userId, invitation.role)

// Le rôle de l'invitation est maintenu
// Même si l'utilisateur change de rôle plus tard
```

### Limites de sécurité

- Un utilisateur peut avoir plusieurs invitations (une par rôle)
- Le rôle invité est maintenu même si l'utilisateur change de rôle
- L'invitation ne change pas le rôle si elle est acceptée après expiration

---

## Cas d'erreur

| Code | Message | Cause | Action |
|------|---------|-------|--------|
| `NOT_FOUND` | "Invitation not found" | Token invalide ou déjà utilisé | Rediriger vers home |
| `EXPIRED` | "Invitation expired" | Date d'expiration dépassée | Contacter admin |
| `ALREADY_ACCEPTED` | "Invitation already used" | Lien déjà utilisé | Contacter admin |
| `REVOKED` | "Invitation revoked" | Lien révoqué par admin | Contacter admin |
| `EMAIL_MISMATCH` | "Email does not match" | Email Google ≠ email invité | Se connecter avec le bon email |
| `UNAUTHORIZED` | "Sign in required" | Pas de session | Se connecter avec Google |
| `FORBIDDEN` | "You do not have permission" | Rôle non admin pour création | Contacter admin |

---

## Ce qu'on ne fait pas maintenant

### Exclus de P-37A

| Fonctionnalité | Priorité | Justification |
|----------------|----------|---------------|
| Email automatique (SendGrid/Resend/Mailgun) | P-37C | Infrastructure externe à configurer |
| Dashboard admin complexe | P-37B | Page simple suffisante pour MVP |
| Relances automatiques | P-37D | Non essentiel pour MVP |
| Invitation publique | P-37E | Bêta privée = invités directs |
| Paiement / Abonnement | V1+1 | Hors scope bêta |
| Analytics avancé | V1+1 | Hors scope bêta |
| Mobile app | V1+3 | Hors scope bêta |

### Ce qui reste en l'état

- L'authentification Google OAuth existante (pas modifiée)
- Le système de rôles existant (profiles.role)
- Le dashboard admin existant (ajout d'une section)
- Les middlewares existants (requireAuth, requireRole)

---

## Découpage en tickets

### P-37B — Backend: API & Routes

**Objectif:** Mettre en place l'API complète

**Tâches:**
1. Créer la table `beta_invitations` (migration)
2. Créer le service `betaInvitationService.js`
3. Ajouter les routes:
   - `POST /api/admin/beta-invitations`
   - `GET /api/beta-invitations/:token`
   - `POST /api/beta-invitations/:token/accept`
   - `GET /api/admin/beta-invitations`
   - `POST /api/admin/beta-invitations/:id/revoke`
4. Intégrer la vérification dans `/api/auth/google/callback`
5. Ajouter les middlewares RLS si nécessaire

**Estimation:** ~4h

---

### P-37C — Frontend: Admin UI

**Objectif:** Créer l'interface admin pour gérer les invitations

**Tâches:**
1. Créer la page `/dashboard/admin/invitations`
2. Formulaire de création (email, rôle, expiration, notes)
3. Tableau des invitations avec filtres
4. Modale pour créer l'invitation
5. Bouton "Revoir l'invitation" (affiche le token à copier)
6. Fonction "Révoquer" avec confirmation

**Estimation:** ~3h

---

### P-37D — Frontend: User flow

**Objectif:** Créer la page `/beta/invite/:token` pour les testeurs

**Tâches:**
1. Créer la page `/beta/invite/:token` (PublicLayout)
2. États d'affichage (loading, valid, expired, etc.)
3. Bouton "Accepter" qui redirige vers OAuth
4. Message de succès après acceptation
5. Redirection vers le dashboard

**Estimation:** ~2h

---

### P-37E — Documentation & Testing

**Objectif:** Documenter et tester le système

**Tâches:**
1. Mettre à jour la documentation interne
2. Créer un guide pour les admins
3. Tests de bout en bout (manuels):
   - Création d'invitation
   - Acceptation avec OAuth
   - Vérification du rôle
   - Expiration
   - Révocation
4. Documentation des cas d'erreur

**Estimation:** ~2h

---

## Critères d'acceptation

### Fonctionnels

- [ ] Admin peut créer une invitation avec email et rôle
- [ ] L'invitation a une date d'expiration (optionnelle)
- [ ] L'invitation génère un lien unique
- [ ] Le testeur voit la page `/beta/invite/:token`
- [ ] Le testeur voit les détails de l'invitation
- [ ] Le testeur peut accepter via Google OAuth
- [ ] Après OAuth, le profil est créé/mis à jour avec le bon rôle
- [ ] L'invitation est marquée comme acceptée
- [ ] Le testeur est connecté automatiquement
- [ ] Le testeur est redirigé vers son dashboard

### Sécurité

- [ ] Le token n'est jamais stocké en base (seul le hash est stocké)
- [ ] L'email Google doit correspondre à l'email invité
- [ ] Une invitation ne peut être utilisée qu'une seule fois
- [ ] L'expiration est vérifiée
- [ ] Seuls les admins peuvent créer des invitations
- [ ] Aucune service role key exposée côté client

### Tests

- [ ] Build frontend passe
- [ ] Tests backend passent
- [ ] Migration Supabase créée (si P-37B)
- [ ] Documentation interne créée

---

**Fin de l'architecture.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
