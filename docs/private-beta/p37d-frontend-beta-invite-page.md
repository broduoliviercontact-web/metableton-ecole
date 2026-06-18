---
name: p37d-frontend-beta-invite-page
description: P-37D frontend page for beta invitation acceptance
metadata:
  type: project
---

# P-37D — Frontend Beta Invitation Acceptance Page

**Date:** 2026-06-18  
**Status:** Completed  
**Related:** [[p37a-beta-invitation-system-architecture]] [[p37b-beta-invitation-migration]] [[p37c-backend-beta-invitation-service]]

---

## Overview

Created a complete frontend page at `/beta/invite/:token` allowing beta invitees to view and accept their invitations. The page handles all invitation states and integrates with the existing authentication flow.

---

## Files Created

### 1. `client/src/api/betaInvitations.js`

API wrapper for beta invitation operations.

**Functions:**
- `getBetaInvitation(token)` - Fetch invitation by token (public endpoint)
- `acceptBetaInvitation(token)` - Accept invitation (auth required)

```javascript
import { apiClient } from './client.js';

export async function getBetaInvitation(token) {
  const res = await apiClient(`/beta-invitations/${token}`);
  return res.data;
}

export async function acceptBetaInvitation(token) {
  const res = await apiClient(`/beta-invitations/${token}/accept`, {
    method: 'POST',
  });
  return res.data;
}
```

---

### 2. `client/src/pages/BetaInvitePage.jsx`

Main React component implementing the invitation acceptance flow.

**Key Features:**
- Public route (no auth required for viewing)
- Auto-accepts when authenticated with matching email
- All invitation states handled with accessible UI
- Follows dark studio/DAW design theme
- P-35 accessibility compliance (focus-visible, ARIA labels)

**State Flow:**

| State | HTTP Status | UI Component |
|-------|-------------|--------------|
| Loading | - | LoadingSpinner overlay |
| Invalid Token | 404 | ErrorMessage |
| Expired | 200 | Error state (red theme) |
| Revoked | 200 | Error state (red theme) |
| Already Accepted | 200 | Success state (green theme) |
| Pending + Unauthenticated | 200 | Login prompt |
| Pending + Email Mismatch | 200 | Warning with logout link |
| Pending + Authenticated | 200 | Accept button |

**User States:**

```
┌─────────────────────────────────────────────────────────────┐
│                         Loading                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Invitation Loaded?                      │
│                    (404, 200)                               │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
         ▼                                         ▼
┌───────────────────────┐              ┌───────────────────────┐
│  Invalid Token        │              │  Valid Invitation     │
│  (404)                │              │  (200)                │
│  - Show error message │              │  - Check status:      │
└───────────────────────┘              │    - pending          │
         │                             │    - accepted         │
         │                             │    - expired          │
         ▼                             │    - revoked          │
┌───────────────────────┐              └───────────────────────┘
│  Expired              │                             │
│  - Time limit reached │                             ▼
│  - 30-day expiration  │              ┌───────────────────────┐
│  - Show renewal       │              │  Status: pending      │
└───────────────────────┘              │  - Check auth state   │
                                       └───────────────────────┘
┌───────────────────────┐                             │
│  Revoked              │                             ▼
│  - Admin revoked      │              ┌───────────────────────┐
│  - Contact support    │              │  Authenticated?       │
└───────────────────────┘              │  - yes / no           │
                                       └───────────────────────┘
┌───────────────────────┐                             │
│  Already Accepted     │                             ▼
│  - Already used       │              ┌───────────────────────┐
│  - Redirect to        │              │  Email matches?       │
│    dashboard          │              │  - yes / no           │
└───────────────────────┘              └───────────────────────┘
                                           │         │
                                           ▼         ▼
                                  ┌────────────┐ ┌────────────┐
                                  │  Match     │ │  Mismatch  │
                                  │  - Accept  │ │  - Warning │
                                  │    button  │ │  - Logout  │
                                  └────────────┘ └────────────┘
                                         │
                                         ▼
                                  ┌────────────┐
                                  │  Success   │
                                  │  - Role   │
                                  │  - Redirect│
                                  └────────────┘
```

---

## Route Configuration

Added to `client/src/App.jsx`:

```javascript
import BetaInvitePage from './pages/BetaInvitePage.jsx';

// Inside Routes:
<Route path="beta/invite/:token" element={<BetaInvitePage />} />
```

**Route:** `/beta/invite/:token` (public, no auth required)

---

## API Integration

The page integrates with P-37C backend routes:

| Frontend Call | Backend Route | Method | Auth Required |
|--------------|---------------|--------|---------------|
| `GET /beta-invitations/:token` | `/api/beta-invitations/:token` | GET | No |
| `POST /beta-invitations/:token/accept` | `/api/beta-invitations/:token/accept` | POST | Yes |

---

## Accessibility (P-35 Compliance)

All interactive elements include:
- Focus visible states with emerald-400 ring
- ARIA labels on buttons
- Loading states with `aria-busy` and `aria-live`
- Error states with `role="alert"` and `aria-live="assertive"`

**Keyboard Navigation:**
- Tab through all interactive elements
- Focus ring visible on all buttons
- Cancel buttons have explicit `aria-label`

---

## Testing Checklist

- [x] Valid token displays invitation details
- [x] Expired token shows appropriate error
- [x] Revoked token shows appropriate error
- [x] Already accepted invitation shows success state
- [x] Unauthenticated user shows login prompt
- [x] Email mismatch shows warning
- [x] Authenticated matching user auto-accepts
- [x] Accept button shows loading state
- [x] Success shows role update
- [x] Focus-visible ring appears on all buttons
- [x] ARIA labels on all interactive elements
- [x] Build completes without errors

---

## Security Notes

1. **Token hash comparison** - Server compares `SHA256(salt:token)` hashed tokens, never plaintext
2. **Email verification** - User email must match invitation email on accept
3. **Role upgrade only** - Cannot downgrade existing accounts
4. **RLS enforced** - Database table uses `FORCE RLS` for all queries

---

## Future Enhancements

- Auto-login from email link (one-click acceptance)
- Shareable success page with social sharing
- Analytics tracking for acceptance rate
- Expiration countdown timer
- Resend invitation link (admin only)
