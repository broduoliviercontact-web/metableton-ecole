---
name: p37e-admin-beta-invitation-ui
description: P-37E admin UI for beta invitation management
metadata:
  type: project
---

# P-37E — Admin Beta Invitation UI

**Date:** 2026-06-18  
**Status:** Completed  
**Related:** [[p37a-beta-invitation-system-architecture]] [[p37b-beta-invitation-migration]] [[p37c-backend-beta-invitation-service]] [[p37d-frontend-beta-invite-page]]

---

## Objectif

Créer une interface admin permettant de gérer les invitations bêta :
- Créer une nouvelle invitation avec email, rôle, expiration et notes
- Copier le lien d'invitation généré
- Lister toutes les invitations existantes
- Voir le statut de chaque invitation (pending/accepted/expired/revoked)
- Révoquer une invitation en attente

---

## Route ajoutée

| Route | Accès | Component |
|-------|-------|-----------|
| `/dashboard/admin/beta-invitations` | Admin only | `AdminBetaInvitationsPage` |

**File:** `client/src/App.jsx:95-102`

```javascript
<Route
  path="admin/beta-invitations"
  element={
    <RequireAuth allow="admin">
      <AdminBetaInvitationsPage />
    </RequireAuth>
  }
/>
```

**Navigation link** added to `DashboardLayout.jsx:20`.

---

## API frontend

**File:** `client/src/api/betaInvitations.js`

### Functions from P-37D (kept)
- `getBetaInvitation(token)` - Public endpoint, no auth
- `acceptBetaInvitation(token)` - Public endpoint, auth required for accept

### New admin functions
- `createBetaInvitation({ email, role, expiresAt, notes })` - POST `/admin/beta-invitations`
- `listBetaInvitations()` - GET `/admin/beta-invitations`
- `revokeBetaInvitation(invitationId)` - POST `/admin/beta-invitations/:id/revoke`

---

## Formulaire de création

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Email | text | Yes | Type: email, placeholder included |
| Rôle | select | No | Default: `student`, options: student/teacher/admin |
| Date expiration | date | No | HTML5 date picker |
| Notes | text | No | Single line input |

**UI elements:**
- Warning message when `admin` role selected (aria-describedby)
- "Création en cours..." loading state
- Success card with generated link shown after creation
- Error display with `role="alert"`

**Important:** The generated URL is **only visible after creation**, not stored in state or localStorage.

---

## Liste des invitations

Display as a list of cards (not a table), matching admin dashboard design.

### Card content:
- Email (primary text)
- Role label
- Creation date
- Expiration date (if set)
- Notes (if provided, italic)
- Status badge with color coding
- Action button (revocation for pending only)

### Status badges:
| Status | Color variant | Label |
|--------|---------------|-------|
| pending | `pending` | En attente |
| accepted | `approved` | Acceptée |
| expired | `pending` | Expirée |
| revoked | `rejected` | Révoquée |

**No exposed data:**
- `token_hash` - never shown
- `token_salt` - never shown
- `token` - only in success card after creation
- `accepted_user_id` - never shown

---

## Copie du lien

**Function:** `CopyButton` component

```javascript
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  } catch {
    // Fallback: document.execCommand('copy')
  }
}
```

**Features:**
- Clipboard API with fallback to document.execCommand
- Visual feedback: "Copié !" after successful copy
- Input field shown only after successful creation
- No localStorage or persistent storage of URLs

---

## Révocation

**Flow:**
1. User clicks "Révoquer" button on pending invitation
2. `window.confirm()` confirmation dialog
3. API call to `revokeBetaInvitation(id)`
4. On success, refresh the list via `loadInvitations()`
5. On error, show alert with message

**Safety:**
- Confirmation before revoking
- Error handling with user-friendly message
- List refresh only on success

---

## Sécurité

| Requirement | Implementation |
|-------------|----------------|
| No `token_hash` exposed | Only API gets it; never rendered |
| No `token_salt` exposed | Never sent to frontend |
| No tokens in localStorage | Clean state, no persistence |
| No tokens in console | No `console.log()` of invitation data |
| Only show token after creation | State reset after copy/success |
| Admin-only route | Protected with `RequireAuth allow="admin"` |

---

## Accessibilité (P-35)

- All inputs have explicit `<label>` with `for`
- Email input has `aria-required="true"`
- Admin warning has `id="admin-warning"` referenced by `aria-describedby`
- Loading state has `aria-busy="true"` and `aria-live="polite"`
- Error messages have `role="alert"` and `aria-live="assertive"`
- All buttons have descriptive `aria-label`
- Focus-visible ring with emerald-400
- Status indicated by both color and text

---

## Fichiers modifiés

| File | Changes |
|------|---------|
| `client/src/api/betaInvitations.js` | Added `createBetaInvitation`, `listBetaInvitations`, `revokeBetaInvitation` |
| `client/src/App.jsx` | Added import and route for `AdminBetaInvitationsPage` |
| `client/src/components/layout/DashboardLayout.jsx` | Added "Invitations bêta" nav item |
| `client/src/pages/dashboard/AdminBetaInvitationsPage.jsx` | **NEW** - full admin page |

---

## Ce qui n'est pas encore fait

- Email notification to invitee (manual sharing required)
- Bulk actions (delete multiple at once)
- Export to CSV
- Search/filter on list
- Pagination on list
- Resend invitation feature
- Analytics dashboard

---

## Vérifications

```bash
# Build passes
npm --prefix client run build  # ✓

# Routes exist
grep -R "AdminBetaInvitations\|beta-invitations" client/src -n  # ✓

# No secret exposure
grep -R "token_hash\|token_salt" client/src || true  # ✓

# Clipboard usage
grep -R "navigator.clipboard" client/src  # ✓

# ARIA attributes
grep -R "aria-describedby\|role=\"alert\"\|aria-busy" client/src  # ✓
```

---

## Critères d'acceptation

- [x] Route `/dashboard/admin/beta-invitations` exists
- [x] Protected with admin role (`RequireAuth allow="admin"`)
- [x] Form to create invitation with email, role, expiresAt, notes
- [x] Email validation (HTML5 type="email")
- [x] Role selection with warning for admin
- [x] Success card shows URL only after creation
- [x] Copy button uses clipboard API with fallback
- [x] List shows all invitations with status badges
- [x] Revocation button only for pending status
- [x] Confirmation before revocation
- [x] List refreshes after revocation
- [x] No `token_hash` or `token_salt` exposed
- [x] No localStorage usage
- [x] No console logging of secrets
- [x] P-35 accessibility compliance
- [x] Dark studio/DAW design theme
- [x] Build passes
- [x] Documentation created
