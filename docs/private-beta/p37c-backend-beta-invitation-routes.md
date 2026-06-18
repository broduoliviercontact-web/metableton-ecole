# P-37C — Backend Beta Invitation Service + Routes

**Date:** 2026-06-17  
**Statut:** Terminé

---

## Objectif

Créer la couche backend pour gérer les invitations bêta:
- API admin pour créer, lister, révoquer des invitations
- API publique pour vérifier une invitation par token
- API protégée pour accepter une invitation après OAuth

---

## Routes ajoutées

| Route | Méthode | Protection | Description |
|-------|---------|------------|-------------|
| `/api/admin/beta-invitations` | POST | admin | Créer une invitation |
| `/api/beta-invitations/:token` | GET | publique | Lire une invitation |
| `/api/beta-invitations/:token/accept` | POST | auth | Accepter une invitation |
| `/api/admin/beta-invitations` | GET | admin | Lister les invitations |
| `/api/admin/beta-invitations/:id/revoke` | POST | admin | Révoquer une invitation |

---

## Service créé

**Fichier:** `server/src/services/betaInvitationService.js`

### Fonctions publiques

| Fonction | Description |
|----------|-------------|
| `generateRawToken()` | Génère un token UUID v4 |
| `generateTokenSalt()` | Génère un salt aléatoire |
| `hashToken(token, salt)` | Hash SHA-256 du token |
| `normalizeEmail(email)` | Met l'email en minuscule |
| `createBetaInvitation()` | Crée une invitation |
| `getBetaInvitationByToken()` | Récupère une invitation par token |
| `acceptBetaInvitation()` | Accepte une invitation |
| `listBetaInvitations()` | Liste toutes les invitations |
| `revokeBetaInvitation()` | Révoque une invitation |

### Fonctions internes

| Fonction | Description |
|----------|-------------|
| `getSaltByToken()` | Récupère le salt d'une invitation |
| `maskEmail()` | Masque l'email pour affichage |

---

## Sécurité

| Contrainte | Implémentation |
|------------|----------------|
| Token never stored | Seul le hash (SHA-256 + salt) est stocké |
| Email matching | Vérifié côté service avant acceptation |
| One-time use | Statut `pending` → `accepted` |
| Expiration | Vérifiée avant acceptation |
| Revocation | Statut `revoked` interdit l'acceptation |
| Admin only | Routes protégées par `requireRole('admin')` |

---

## Token et hash

```js
// Génération
const rawToken = crypto.randomBytes(32).toString('hex'); // 64 chars
const salt = crypto.randomBytes(16).toString('hex'); // 32 chars
const tokenHash = SHA256(`${salt}:${token}`);
```

**Stockage en base:**
- `token_hash`: SHA256(salt:token)
- `token_salt`: salt aléatoire

**Jamais stocké:**
- Le token brut (retourné uniquement à la création)

**Jamais exposé:**
- Le token brut dans les logs
- Le token_hash ou token_salt au client

---

## Acceptation d'invitation

### Flow

```
1. Token envoyé via email
2. Utilisateur clique → /beta/invite/:token
3. Page affiche les détails (email masqué)
4. Utilisateur accepte → redirection OAuth
5. OAuth callback + query param: ?invitation=token
6. Backend vérifie le token:
   - Hash correspondant dans la base
   - Statut = pending
   - Pas expiré
   - Email Google == email invité
7. Invitation mise à jour (status: accepted)
8. Rôle mis à jour si upgrade autorisé
9. Session créée avec le nouveau rôle
```

### Logique d'upgrade de rôle

| De | À | Action |
|----|---|--------|
| student | teacher | ✅ Allowed |
| student | admin | ✅ Allowed |
| teacher | admin | ✅ Allowed |
| teacher | student | ❌ Not allowed |
| admin | student | ❌ Not allowed |
| admin | teacher | ❌ Not allowed |

---

## Révocation

Seulement les invitations `pending` peuvent être révoquées.

```sql
UPDATE beta_invitations
SET status = 'revoked', updated_at = now()
WHERE id = :invitationId;
```

---

## Erreurs

| Code | HTTP | Message |
|------|------|---------|
| `VALIDATION_ERROR` | 400 | Email/rôle requis |
| `INVITATION_NOT_FOUND` | 404 | Token invalide |
| `INVITATION_EXPIRED` | 410 | Invitation expirée |
| `INVITATION_ALREADY_ACCEPTED` | 409 | Déjà utilisée |
| `INVITATION_REVOKED` | 410 | Révoquée |
| `INVITATION_EMAIL_MISMATCH` | 403 | Email incorrect |
| `INVITATION_ROLE_INVALID` | 400 | Rôle invalide |
| `INVALID_STATUS` | 400 | Statut incompatible |

---

## Tests

Aucun test unitaire ajouté pour P-37C. Les tests de la vitesse de test actuelle passent:

```
✓ npm --prefix server test - 11 tests passed
✓ npm --prefix client run build - Passed
```

Les fonctions à tester:
- `hashToken()`: hash SHA256 correct
- `normalizeEmail()`: lowercase
- `generateRawToken()`: token unique
- `generateTokenSalt()`: salt unique
- Logique de validation
- Logique de transition de statut

---

## Ce qui n'est pas encore fait

### Exclus de P-37C:
- Aucune page frontend (`/beta/invite/:token`)
- Aucune admin UI (`/dashboard/admin/invitations`)
- Email automatique (SendGrid/Resend/Mailgun)
- Génération de token dans l'interface admin
- Affichage du token après création
- Pagination des invitations
- Filtres (status, rôle, date)
- Relances automatiques

### À implémenter dans P-37D/P-37E:
- Frontend: `/beta/invite/:token` page
- Frontend: `/dashboard/admin/invitations` page
- Email: intégration SMTP
- Analytics: tracking des invitations

---

## Vérifications

### Build & Tests
```
✓ npm --prefix server test - 11 tests passed
✓ npm --prefix client run build - Passed
```

### Routes
```bash
✓ grep -R "beta-invitations" -n server/src/routes/betaInvitations.js
✓ grep -R "beta-invitations" -n server/src/app.js
```

### Sécurité
```bash
✓ grep -R "token_hash\|token_salt" -n client/src  # Empty - no exposure
✓ grep -R "requireRole('admin')" -n server/src/routes  # Correctly applied
```

---

## Critères d'acceptation

P-37C est terminé si:

- [x] `betaInvitationService.js` créé
- [x] `betaInvitations.js` routes créées
- [x] Routes admin protégées par `requireAuth` + `requireRole('admin')`
- [x] Route d'acceptation protégée par `requireAuth`
- [x] Token brut jamais stocké
- [x] Token brut retourné uniquement à la création
- [x] `token_hash` et `token_salt` jamais retournés au client
- [x] Email Google/profil doit correspondre à l'email invité
- [x] Invitation accepted/revoked/expired ne peut pas être acceptée
- [x] `req.session.role` mis à jour après acceptation si rôle changé
- [x] Aucun frontend modifié
- [x] Aucune migration ajoutée
- [x] Aucune dépendance ajoutée
- [x] Tests backend passent
- [x] Build frontend passe
- [x] Documentation P-37C créée
- [x] Aucun secret mentionné

---

**Fin de la documentation.**

*Document généré le 2026-06-17*
