import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import env from '../config/env.js';

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

export default router;
