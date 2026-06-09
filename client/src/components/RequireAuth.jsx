import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from './ui/LoadingSpinner.jsx';

const DEFAULT_DASHBOARDS = {
  student: '/dashboard',
  teacher: '/dashboard/teacher',
  admin: '/dashboard/admin',
};

/**
 * RequireAuth — client-side route guard.
 *
 * - If still loading session → render LoadingSpinner
 * - If not authenticated → redirect to "/"
 * - If authenticated but no allowed role match → redirect to user's default dashboard
 * - Otherwise → render children
 *
 * Role redirect rules (cascading, first match wins):
 *   - admin can access student, teacher, and admin routes
 *   - teacher can access student and teacher routes (not admin)
 *   - student can only access student routes
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - content to render when access is granted
 * @param {string} [props.allow] - required role: 'student' | 'teacher' | 'admin'
 *                                 If omitted, any authenticated user passes.
 *                                 If set, only that role (or a more permissive one) passes.
 */
export default function RequireAuth({ children, allow }) {
  const { user, isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // If no allow constraint, just being authenticated is enough
  if (!allow) {
    return children;
  }

  // Role hierarchy: admin > teacher > student
  // A route with allow='student' is accessible by student, teacher, and admin
  // A route with allow='teacher' is accessible by teacher and admin
  // A route with allow='admin'   is accessible by admin only
  const roleRank = { student: 1, teacher: 2, admin: 3 };
  const userRank = roleRank[role] || 0;
  const requiredRank = roleRank[allow] || 0;

  if (userRank >= requiredRank) {
    return children;
  }

  // Insufficient role — redirect to the user's default dashboard
  return <Navigate to={DEFAULT_DASHBOARDS[role] || '/dashboard'} replace />;
}
