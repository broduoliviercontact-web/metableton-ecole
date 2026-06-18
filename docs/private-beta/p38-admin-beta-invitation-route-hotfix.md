# P-38 — Admin Beta Invitation Route Hotfix

**Date:** 2026-06-18
**Commit:** `dca4d1e` (OAuth fix) + route hotfix

---

## Problème

La page admin `/dashboard/admin/beta-invitations` appelait :

```txt
GET /api/admin/beta-invitations
```

Mais le router Express était uniquement monté sous `/api/beta-invitations`. L'API retournait `404 Not Found`.

## Cause

Dans `server/src/routes/betaInvitations.js`, les routes publiques et admin étaient mélangées dans un seul router monté à `/api/beta-invitations`. Les commentaires indiquaient `/api/admin/beta-invitations` mais le montage Express ne correspondait pas.

## Correction

Séparation en deux routers exportés :

| Router | Routes | Montage |
|---|---|---|
| `publicBetaInvitationsRouter` | `GET /:token`, `POST /:token/accept` | `/api/beta-invitations` |
| `adminBetaInvitationsRouter` | `POST /`, `GET /`, `POST /:invitationId/revoke` | `/api/admin/beta-invitations` |

### Fichiers modifiés

- `server/src/routes/betaInvitations.js` — split en deux exports nommés
- `server/src/app.js` — import nommé + deux `app.use()`

### Routes finales

```txt
# Publiques
GET  /api/beta-invitations/:token
POST /api/beta-invitations/:token/accept

# Admin (require auth + admin role)
POST /api/admin/beta-invitations
GET  /api/admin/beta-invitations
POST /api/admin/beta-invitations/:invitationId/revoke
```

---

**Fin du document.**
