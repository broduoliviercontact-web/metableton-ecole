/**
 * requireRole — gates access by role.
 *
 * Usage: router.get('/admin/users', requireAuth, requireRole('admin'), handler)
 *
 * Must be used AFTER requireAuth, which attaches req.user.
 * - If req.user.role is not in the allowed list → 403 FORBIDDEN
 * - If allowed → calls next()
 *
 * @param  {...string} allowedRoles — one or more roles (e.g. 'teacher', 'admin')
 * @returns {Function} Express middleware
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource.',
        },
      });
    }

    next();
  };
}
