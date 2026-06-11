import { Router } from 'express';
import { getOauth2Client } from '../config/google.js';
import env from '../config/env.js';
import { findOrCreateGoogleProfile, getCurrentUserProfile } from '../services/profileService.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

// ── GET /api/auth/google ──────────────────────────────────────────
// Redirects the user to Google's OAuth 2.0 consent screen.
router.get('/api/auth/google', async (_req, res, next) => {
  try {
    const oauth2Client = await getOauth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'profile', 'email'],
    });

    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/google/callback ─────────────────────────────────
// Google redirects here with ?code=... after user consents.
// Exchanges the code for tokens, verifies the id_token, delegates
// profile upsert to profileService, creates a session, and redirects
// to the role-appropriate dashboard.
router.get('/api/auth/google/callback', async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Authorization code missing.' },
    });
  }

  try {
    const oauth2Client = await getOauth2Client();

    // 1. Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.id_token) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'No id_token in Google response.' },
      });
    }

    // 2. Verify the id_token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    const googleSub = payload.sub;
    const email = payload.email;
    const displayName = payload.name || email.split('@')[0];
    const avatarUrl = payload.picture || null;

    // 3. Upsert profile via profileService (admin bootstrap, role preservation)
    const { userId, role } = await findOrCreateGoogleProfile({
      googleSub,
      email,
      displayName,
      avatarUrl,
    });

    // 4. Create session
    req.session.userId = userId;
    req.session.role = role;
    req.session.googleTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expiry_date: tokens.expiry_date || null,
    };
    // Store Google profile data for /api/auth/me to use
    req.session.googleProfile = {
      email,
      displayName,
      avatarUrl,
    };

    // 5. Save session explicitly, then redirect
    req.session.save((err) => {
      if (err) return next(err);

      const dashboardPaths = {
        student: '/dashboard',
        teacher: '/dashboard/teacher',
        admin: '/dashboard/admin',
      };

      res.redirect(`${env.clientOrigin}${dashboardPaths[role] || '/dashboard'}`);
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/auth/google/classroom ────────────────────────────────
// Initiate OAuth flow for Google Classroom (teacher/admin only).
// Does NOT modify the main session - just redirects to Google.
router.get('/api/auth/google/classroom', requireAuth, requireRole('teacher', 'admin'), (_req, res) => {
  const oauth2Client = getOauth2ClientSync();
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/classroom.courses.readonly'],
  });
  res.redirect(authUrl);
});

// ── GET /api/auth/google/classroom/callback ───────────────────────
// Handle OAuth callback for Google Classroom.
// Exchanges code for tokens and stores them in session.
router.get('/api/auth/google/classroom/callback', async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Authorization code missing.' },
    });
  }

  try {
    const oauth2Client = getOauth2ClientSync();

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Store Classroom tokens in session
    if (!req.session) {
      return res.status(500).json({
        error: { code: 'SESSION_ERROR', message: 'Session not found.' },
      });
    }
    req.session.googleClassroomTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expiry_date: tokens.expiry_date || null,
    };
    req.session.hasClassroomAccess = true;

    // Save session explicitly, then redirect
    req.session.save((err) => {
      if (err) return next(err);

      const dashboardPaths = {
        teacher: '/dashboard/teacher',
        admin: '/dashboard/admin',
      };

      res.redirect(`${env.clientOrigin}${dashboardPaths[req.session.role] || '/dashboard'}`);
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/google/classroom/disconnect ────────────────────
// Remove Classroom tokens from session.
router.post('/api/auth/google/classroom/disconnect', requireAuth, (req, res, next) => {
  if (req.session) {
    req.session.googleClassroomTokens = null;
    req.session.hasClassroomAccess = false;
  }
  res.json({ ok: true });
});

// Sync version of getOauth2Client for route handlers (not async)
// This is defined AFTER all routes to avoid circular import issues
// when getOauth2Client is awaited in the main flow but called
// synchronously here.
function getOauth2ClientSync() {
  return getOauth2Client();
}

export default router;
