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

// ── DELETE /api/admin/users/:userId ──────────────────────────────────
// Admin only: Permanently delete a user profile.
//
// Guardrails:
//   - Cannot delete yourself
//   - Cannot delete the last remaining admin
router.delete('/users/:userId', deleteUserHandler);

export async function deleteUserHandler(req, res, next) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    console.log(`[admin] DELETE /users/${userId} requested by ${currentUserId}`);

    // 0. Validate URL parameter
    if (!userId) {
      return res.status(400).json({
        error: {
          code: 'USER_ID_REQUIRED',
          message: 'L\'identifiant utilisateur est requis dans l\'URL.',
        },
      });
    }

    // 1. Cannot delete yourself
    if (userId === currentUserId) {
      return res.status(403).json({
        error: {
          code: 'CANNOT_DELETE_SELF',
          message: 'Vous ne pouvez pas supprimer votre propre compte.',
        },
      });
    }

    // 2. Look up the target user
    const target = await adminService.getUserById(userId);
    if (!target) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Utilisateur introuvable.' },
      });
    }

    // 3. Last-admin guard
    if (target.role === 'admin') {
      const adminCount = await adminService.countAdmins();
      if (adminCount <= 1) {
        return res.status(409).json({
          error: {
            code: 'LAST_ADMIN',
            message:
              'Impossible de supprimer le dernier administrateur. Promouvez d\'abord un autre utilisateur.',
          },
        });
      }
    }

    // 4. Delete
    const result = await adminService.deleteUser(userId);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

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
