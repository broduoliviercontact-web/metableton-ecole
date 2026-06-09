import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import * as adminService from '../services/adminService.js';
import { VALID_ROLES } from '../services/adminService.js';

const router = Router();

// All admin routes require auth + admin role.
router.use(requireAuth, requireRole('admin'));

// ── GET /api/admin/users ───────────────────────────────────────────
// Returns every user/profile in the system.
router.get('/users', async (_req, res, next) => {
  try {
    const users = await adminService.listAllUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

// ── PUT /api/admin/users/:id/role ──────────────────────────────────
// Update a user's role. Body: { role } in { student, teacher, admin }.
//
// Last-admin guard: if the target user is currently an admin and the
// new role is not admin, we reject the request when they are the only
// remaining admin. Otherwise the system would be permanently locked
// out of admin actions.
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body || {};

    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `role must be one of: ${VALID_ROLES.join(', ')}.`,
        },
      });
    }

    // 1. Look up the target user
    const target = await adminService.getUserById(req.params.id);
    if (!target) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    // 2. Last-admin guard
    if (target.role === 'admin' && role !== 'admin') {
      const adminCount = await adminService.countAdmins();
      if (adminCount <= 1) {
        return res.status(409).json({
          error: {
            code: 'LAST_ADMIN',
            message:
              'Impossible de retirer le rôle administrateur au dernier administrateur. Promouvez d\'abord un autre utilisateur.',
          },
        });
      }
    }

    // 3. Persist
    const updated = await adminService.updateUserRole(req.params.id, role);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/admin/courses ─────────────────────────────────────────
// Returns every course in the system, with teacher display name and
// email joined in.
router.get('/courses', async (_req, res, next) => {
  try {
    const courses = await adminService.listAllCoursesForAdmin();
    res.json({ data: courses });
  } catch (err) {
    next(err);
  }
});

export default router;
