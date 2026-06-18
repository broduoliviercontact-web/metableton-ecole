import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import * as betaInvitationService from '../services/betaInvitationService.js';
import env from '../config/env.js';

// ── Helper: Get client origin for invite URL ───────────────────────────
function getClientOrigin() {
  return env.clientOrigin || 'http://localhost:5173';
}

// ═══════════════════════════════════════════════════════════════════════
// Public router — mounted at /api/beta-invitations
// ═══════════════════════════════════════════════════════════════════════

export const publicBetaInvitationsRouter = Router();

// ── GET /api/beta-invitations/:token ────────────────────────────────
// Public: Get invitation details by token.
// Returns invitation info for display (masked email).
// Does NOT require authentication - the page itself is public.
publicBetaInvitationsRouter.get('/:token', async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Token est requis.' },
      });
    }

    const invitation = await betaInvitationService.getBetaInvitationByToken(token);

    if (!invitation) {
      return res.status(404).json({
        error: { code: 'INVITATION_NOT_FOUND', message: 'Invitation introuvable.' },
      });
    }

    if (invitation.status === 'expired') {
      return res.status(410).json({
        error: { code: 'INVITATION_EXPIRED', message: invitation.message },
      });
    }

    if (invitation.status === 'revoked') {
      return res.status(410).json({
        error: { code: 'INVITATION_REVOKED', message: invitation.message },
      });
    }

    if (invitation.status === 'accepted') {
      return res.status(409).json({
        error: { code: 'INVITATION_ALREADY_ACCEPTED', message: invitation.message },
      });
    }

    // Return masked invitation for display
    res.json({
      data: {
        invitation: {
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expires_at,
          createdAt: invitation.created_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/beta-invitations/:token/accept ────────────────────────
// Auth required: Accept an invitation after Google OAuth.
// Verifies token, email match, and updates user role.
publicBetaInvitationsRouter.post('/:token/accept', requireAuth, async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Token est requis.' },
      });
    }

    const result = await betaInvitationService.acceptBetaInvitation({
      token,
      userId: req.user.userId,
      userEmail: req.session.googleProfile?.email,
    });

    // Update session role if it changed
    if (result.role !== req.user.role) {
      req.session.role = result.role;
    }

    res.json({
      data: {
        status: result.status,
        role: result.role,
        redirectTo: result.redirectTo,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// Admin router — mounted at /api/admin/beta-invitations
// ═══════════════════════════════════════════════════════════════════════

export const adminBetaInvitationsRouter = Router();

// All admin routes require auth + admin role.
adminBetaInvitationsRouter.use(requireAuth, requireRole('admin'));

// ── POST /api/admin/beta-invitations ────────────────────────────────
// Admin only: Create a new beta invitation.
// Returns the invitation and the invite URL (with raw token).
adminBetaInvitationsRouter.post('/', async (req, res, next) => {
  try {
    const { email, role, expiresAt, notes } = req.body || {};

    // Validation
    if (!email) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Email est requis.' },
      });
    }

    if (!role || !['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Le rôle doit être l\'un de: student, teacher, admin.',
        },
      });
    }

    // Create the invitation
    const { invitation, rawToken } = await betaInvitationService.createBetaInvitation({
      email,
      role,
      expiresAt: expiresAt || null,
      notes: notes || null,
      createdBy: req.user.userId,
    });

    // Build the invite URL
    const clientOrigin = getClientOrigin();
    const inviteUrl = `${clientOrigin}/beta/invite/${rawToken}`;

    res.status(201).json({
      data: {
        invitation,
        inviteUrl,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/beta-invitations ────────────────────────────────
// Admin only: List all beta invitations.
adminBetaInvitationsRouter.get('/', async (req, res, next) => {
  try {
    const invitations = await betaInvitationService.listBetaInvitations();
    res.json({ data: invitations });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/beta-invitations/:invitationId/revoke ──────────
// Admin only: Revoke a pending invitation.
adminBetaInvitationsRouter.post('/:invitationId/revoke', async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    const result = await betaInvitationService.revokeBetaInvitation(
      invitationId,
      req.user.userId
    );

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/admin/beta-invitations/:invitationId/regenerate-link ─
// Admin only: Regenerate the invitation link with a new token.
// Works for pending and revoked invitations. Blocked for accepted.
adminBetaInvitationsRouter.post('/:invitationId/regenerate-link', async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    const { invitation, rawToken } =
      await betaInvitationService.regenerateBetaInvitationLink(
        invitationId,
        req.user.userId
      );

    const clientOrigin = getClientOrigin();
    const inviteUrl = `${clientOrigin}/beta/invite/${rawToken}`;

    res.json({
      data: {
        invitation,
        inviteUrl,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── DELETE /api/admin/beta-invitations/:invitationId ───────────────
// Admin only: Permanently delete an invitation.
adminBetaInvitationsRouter.delete('/:invitationId', async (req, res, next) => {
  try {
    const { invitationId } = req.params;

    const result = await betaInvitationService.deleteBetaInvitation(
      invitationId,
      req.user.userId
    );

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});
