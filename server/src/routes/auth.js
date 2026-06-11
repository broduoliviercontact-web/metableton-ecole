import { Router } from 'express';
import { getOauth2Client } from '../config/google.js';
import env from '../config/env.js';
import { findOrCreateGoogleProfile, getCurrentUserProfile } from '../services/profileService.js';

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

// ── GET /api/auth/me ──────────────────────────────────────────────
// Returns the current session user, or null if not logged in.
// Now includes full profile data for user profile page display.
router.get('/api/auth/me', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.json({ user: null });
  }

  try {
    const profile = await getCurrentUserProfile(
      req.session.userId,
      req.session.googleProfile || null
    );
    res.json({
      user: {
        userId: req.session.userId,
        role: req.session.role,
        ...profile,
      },
    });
  } catch (err) {
    // Fallback if profile lookup fails
    res.json({
      user: {
        userId: req.session.userId,
        role: req.session.role,
      },
    });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────
// Destroys the session and clears the cookie.
router.post('/api/auth/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
    });

    res.json({ ok: true });
  });
});

export default router;
