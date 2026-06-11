import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import env from '../config/env.js';
import { getOauth2Client } from '../config/google.js';

const router = Router();

// ── GET /api/classroom/diagnostic ────────────────────────────────────
// Feature flag: CLASSROOM_DIAGNOSTIC_ENABLED
//
// When disabled (default):
//   → Returns 404 Not Found
//
// When enabled:
//   → Auth required (requireAuth)
//   → Role must be 'teacher' or 'admin'
//   → Returns safe status JSON (no tokens, no secrets)
//
// This route serves as infrastructure verification for future
// Classroom integration, without exposing any OAuth flow.
router.get('/diagnostic', requireAuth, requireRole('teacher', 'admin'), (req, res, next) => {
  try {
    if (!env.classroomDiagnosticEnabled) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Classroom diagnostic is disabled.' },
      });
    }

    res.json({
      authenticated: true,
      role: req.user.role,
      classroomDiagnosticEnabled: true,
      message: 'Classroom diagnostic route ready',
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/classroom/oauth/start ───────────────────────────────────
// Feature flag: CLASSROOM_OAUTH_ENABLED
//
// Initiate Google Classroom OAuth flow.
// Redirects user to Google OAuth consent screen with:
//   - scope: classroom.courses.readonly
//   - redirect_uri: CLIENT_ORIGIN/api/classroom/oauth/callback
//
// Access:
//   - requireAuth (user must be logged in)
//   - requireRole('teacher', 'admin')
//
// Returns 404 if feature flag is disabled.
router.get('/oauth/start', requireAuth, requireRole('teacher', 'admin'), (req, res, next) => {
  try {
    if (!env.classroomOAuthEnabled) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Classroom OAuth is disabled. Set CLASSROOM_OAUTH_ENABLED=true in Render env vars.'
        },
      });
    }

    // Use dedicated redirect URI for Classroom OAuth
    const redirectUri = env.clientOrigin + '/api/classroom/oauth/callback';
    const oauth2Client = getOauth2Client(redirectUri);

    oauth2Client.then((client) => {
      const scopes = ['https://www.googleapis.com/auth/classroom.courses.readonly'];
      const state = 'classroom_oauth_' + Math.random().toString(36).substring(2);

      // Store state in session to verify callback
      req.session.classroomOAuthState = state;

      const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        redirect_uri: redirectUri,
        state: state,
        prompt: 'consent',
      });

      res.redirect(authorizeUrl);
    }).catch(next);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/classroom/oauth/callback ────────────────────────────────
// Feature flag: CLASSROOM_OAUTH_ENABLED
//
// Handle OAuth callback from Google.
// Exchanges authorization code for tokens.
// Stores tokens in session: req.session.googleClassroomTokens
//
// Access:
//   - requireAuth (session must be valid)
//   - requireRole('teacher', 'admin')
//
// Redirects to:
//   - /dashboard/teacher if role is 'teacher'
//   - /dashboard/admin if role is 'admin'
//
// Returns 404 if feature flag is disabled.
router.get('/oauth/callback', requireAuth, requireRole('teacher', 'admin'), (req, res, next) => {
  try {
    if (!env.classroomOAuthEnabled) {
      return res.status(404).json({
        error: {
          code: 'CLASSROOM_OAUTH_DISABLED',
          message: 'Classroom OAuth is disabled. Set CLASSROOM_OAUTH_ENABLED=true in Render env vars.'
        },
      });
    }

    const code = req.query.code;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Authorization code is required.' },
      });
    }

    // Verify state from session matches query parameter
    const storedState = req.session.classroomOAuthState;
    if (!storedState || storedState !== req.query.state) {
      return res.status(400).json({
        error: { code: 'INVALID_STATE', message: 'Invalid OAuth state.' },
      });
    }

    // Use same redirect URI as in /oauth/start for token exchange
    const redirectUri = env.clientOrigin + '/api/classroom/oauth/callback';
    const oauth2Client = getOauth2Client(redirectUri);
    oauth2Client.then((client) => {
      return client.getToken(code);
    }).then(({ tokens }) => {

      // Store tokens in session (not in DB)
      req.session.googleClassroomTokens = tokens;

      // Set flag to indicate classroom access
      req.session.hasClassroomAccess = Boolean(tokens.access_token);

      // Clear the state from session (one-time use)
      req.session.classroomOAuthState = null;

      // Redirect based on role
      const redirectUrl = req.user.role === 'teacher'
        ? '/dashboard/teacher'
        : '/dashboard/admin';
      res.redirect(redirectUrl);
    }).catch(next);
  } catch (err) {
    next(err);
  }
});

// ── GET /api/classroom/oauth/status ──────────────────────────────────
// Feature flag: CLASSROOM_OAUTH_ENABLED
//
// Returns current OAuth status without exposing tokens.
//
// Access:
//   - requireAuth (user must be logged in)
//   - requireRole('teacher', 'admin')
//
// Returns JSON:
//   - connected: true if googleClassroomTokens exists
//   - oauthEnabled: true if CLASSROOM_OAUTH_ENABLED is set
//   - role: current user role
//
// Returns 404 if feature flag is disabled.
router.get('/oauth/status', requireAuth, requireRole('teacher', 'admin'), (req, res, next) => {
  try {
    if (!env.classroomOAuthEnabled) {
      return res.status(404).json({
        error: {
          code: 'CLASSROOM_OAUTH_DISABLED',
          message: 'Classroom OAuth is disabled. Set CLASSROOM_OAUTH_ENABLED=true in Render env vars.'
        },
      });
    }

    // Disable caching - prevents 304 Not Modified
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Check if we have a valid access token in session
    const hasAccessToken = Boolean(req.session?.googleClassroomTokens?.access_token);

    res.json({
      connected: hasAccessToken,
      oauthEnabled: env.classroomOAuthEnabled,
      hasClassroomAccess: hasAccessToken,
      role: req.user.role,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
