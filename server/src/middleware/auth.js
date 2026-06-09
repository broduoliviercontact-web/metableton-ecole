/**
 * requireAuth — ensures a valid session exists.
 *
 * Usage: router.get('/protected', requireAuth, handler)
 *
 * - If no session or no userId → 401 UNAUTHORIZED
 * - If valid session → attaches req.user = { userId, role } and calls next()
 */
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Sign in required.' },
    });
  }

  // Attach user to request for downstream middleware and route handlers
  req.user = {
    userId: req.session.userId,
    role: req.session.role,
  };

  next();
}
