# P-39 — Beta Invitation Admin Actions

**Date:** 2026-06-18
**Dépendances:** P-37, P-38

---

## Objectif

Ajouter deux actions admin sur les invitations bêta :

1. **Régénérer un lien** — génère un nouveau token pour une invitation existante
2. **Supprimer définitivement** — supprime une invitation de la base

---

## Endpoints ajoutés

### POST /api/admin/beta-invitations/:invitationId/regenerate-link

- Admin uniquement (`requireAuth` + `requireRole('admin')`)
- Génère un nouveau `token_hash` + `token_salt`
- Remet le statut à `pending`
- Bloqué pour les invitations `accepted` (erreur 400)
- Retourne `{ invitation, inviteUrl }`

### DELETE /api/admin/beta-invitations/:invitationId

- Admin uniquement
- Supprime définitivement la ligne
- Tous les statuts autorisés
- Retourne `{ deleted: true, id }`

---

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `server/src/services/betaInvitationService.js` | + `regenerateBetaInvitationLink()`, + `deleteBetaInvitation()` |
| `server/src/routes/betaInvitations.js` | + 2 routes dans `adminBetaInvitationsRouter` |
| `client/src/api/betaInvitations.js` | + `regenerateBetaInvitationLink()`, + `deleteBetaInvitation()` |
| `client/src/pages/dashboard/AdminBetaInvitationsPage.jsx` | Boutons Régénérer/Supprimer dans `InvitationRow` |

---

## Sécurité

- Token brut jamais stocké en base (hash + salt uniquement)
- `token_hash` et `token_salt` jamais exposés au frontend
- Aucun token brut dans les logs console
- Régénération bloquée pour les invitations déjà acceptées

---

**Fin du document.**
