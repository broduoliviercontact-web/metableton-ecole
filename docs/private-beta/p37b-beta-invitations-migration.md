# P-37B — Beta Invitations Migration

**Date:** 2026-06-17  
**Migration:** `20260618082609_create_beta_invitations.sql`  
**Statut:** Terminé - Aucune erreur détectée

---

## Objectif

Créer la table `beta_invitations` dans Supabase pour le système d'invitation bêta privé (P-37A).

**Important:** Cette migration ne contient que la structure de données. Aucune logique backend ou frontend n'est implémentée ici.

---

## Migration créée

**Fichier:** `supabase/migrations/20260618082609_create_beta_invitations.sql`

**Table créée:** `beta_invitations`

---

## Table beta_invitations

### Colonnes

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | ID unique |
| `email` | `TEXT` | `NOT NULL` | Email du testeur invité |
| `role` | `user_role` | `NOT NULL DEFAULT 'student'` | Rôle invité: student/teacher/admin |
| `token_hash` | `TEXT` | `NOT NULL UNIQUE` | SHA-256 hash du token (jamais le token brut) |
| `token_salt` | `TEXT` | `NOT NULL` | Salt aléatoire pour le hash |
| `status` | `beta_invitation_status` | `NOT NULL DEFAULT 'pending'` | pending/accepted/expired/revoked |
| `expires_at` | `TIMESTAMPTZ` | nullable | Date d'expiration |
| `accepted_at` | `TIMESTAMPTZ` | nullable | Date d'acceptation |
| `accepted_user_id` | `UUID` | `REFERENCES profiles(id) ON DELETE SET NULL` | ID de l'utilisateur qui a accepté |
| `created_by` | `UUID` | `NOT NULL REFERENCES profiles(id) ON DELETE CASCADE` | ID de l'admin créateur |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Date de création |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Date de mise à jour |
| `notes` | `TEXT` | nullable | Notes internes |

---

## Index

| Index | Colonne(s) | Description |
|-------|------------|-------------|
| `idx_beta_invitations_email` | `email` | Recherche par email |
| `idx_beta_invitations_status` | `status` | Filtre par statut |
| `idx_beta_invitations_token_hash` | `token_hash` | Recherche par token (unique) |
| `idx_beta_invitations_created_by` | `created_by` | Recherche par admin créateur |
| `idx_beta_invitations_accepted_user_id` | `accepted_user_id` | Recherche par utilisateur accepté |

---

## RLS

| Configuration | Valeur | Description |
|---------------|--------|-------------|
| `ENABLE ROW LEVEL SECURITY` | `YES` | RLS activé sur la table |
| `FORCE ROW LEVEL SECURITY` | `YES` | Toutes les requêtes passent par RLS |

**Notes:**
- Aucune politique publique n'est créée
- L'accès se fait uniquement via Express avec la service role key
- Le frontend ne doit JAMAIS accéder directement à cette table

---

## Contraintes de sécurité

| Contrainte | Description |
|------------|-------------|
| `token_hash` UNIQUE | Empêche les doublons de token |
| `role` CHECK | Utilise `user_role` type (student/teacher/admin) |
| `status` CHECK | Utilise `beta_invitation_status` enum |
| `accepted_user_id` REFERENCES | Intégrité référentielle avec profiles |
| `created_by` REFERENCES | Intégrité référentielle avec profiles |
| `ON DELETE CASCADE` | Supprime les invitation si le créateur est supprimé |
| `ON DELETE SET NULL` | Garde l'invitation si l'utilisateur acceptant est supprimé |

---

## Ce qui n'est pas encore implémenté

**Exclus de P-37B:**
- Aucune route backend
- Aucun service JS
- Aucune page frontend
- Aucune admin UI
- Aucun email automatique
- Aucune logique de génération de token
- Aucun hashing JS
- Aucune logique d'acceptation d'invitation
- Aucune logique de vérification OAuth

**À implémenter dans P-37B (backend):**
- Routes:
  - `POST /api/admin/beta-invitations`
  - `GET /api/beta-invitations/:token`
  - `POST /api/beta-invitations/:token/accept`
  - `GET /api/admin/beta-invitations`
  - `POST /api/admin/beta-invitations/:id/revoke`
- Service: `betaInvitationService.js`
- Intégration dans `/api/auth/google/callback`

---

## Vérifications

### Build & Tests
```
✓ npm --prefix client run build - Passed (665ms)
✓ npm --prefix server test - 11 tests passed
```

### Migration SQL
- Syntaxe validée
- Types créés: `beta_invitation_status` enum
- Table créée avec toutes les colonnes
- Index créés
- RLS activé et forcé

### Commandes SQL utiles (à exécuter après migration)

```sql
-- Vérifier les colonnes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'beta_invitations'
ORDER BY ordinal_position;

-- Vérifier les index
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename = 'beta_invitations';

-- Vérifier RLS
SELECT tablename, rowsecurity, force_rowsecurity
FROM pg_tables
WHERE tablename = 'beta_invitations';

-- Vérifier les types créés
SELECT typname FROM pg_type WHERE typname IN ('user_role', 'beta_invitation_status');
```

---

## Critères d'acceptation

P-37B est terminé si:

- [x] Migration créée: `20260618082609_create_beta_invitations.sql`
- [x] Table `beta_invitations` créée
- [x] Colonnes prévues: id, email, role, token_hash, status, expires_at, accepted_at, accepted_user_id, created_by, created_at, updated_at, notes
- [x] `token_hash` est UNIQUE
- [x] `status` utilise enum avec: pending, accepted, expired, revoked
- [x] `accepted_user_id` référence `profiles(id)`
- [x] `created_by` référence `profiles(id)`
- [x] Index créés: email, status, token_hash, created_by, accepted_user_id
- [x] RLS activé
- [x] FORCE RLS activé
- [x] Aucun frontend modifié
- [x] Aucun backend JS modifié
- [x] Aucune dépendance ajoutée
- [x] Build frontend passe
- [x] Tests backend passent
- [x] Documentation P-37B créée
- [x] Aucun secret mentionné

---

**Fin de la migration.**

*Document généré le 2026-06-17*  
*Migration: 20260618082609_create_beta_invitations.sql*
