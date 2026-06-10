import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

const NAV_BY_ROLE = {
  student: [
    { to: '/dashboard', label: 'Mes cours', end: true },
  ],
  teacher: [
    { to: '/dashboard/teacher', label: 'Mes cours', end: true },
    { to: '/dashboard/teacher/courses/new', label: 'Créer un cours', end: false },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Vue d’ensemble', end: true },
    { to: '/dashboard/admin', label: 'Utilisateurs', end: false },
    { to: '/dashboard/admin/courses', label: 'Tous les cours', end: false },
  ],
};

export default function DashboardLayout() {
  const { user, role, isAdmin, isTeacher, isStudent, logout } = useAuth();

  // Determine which nav to show: admin sees admin nav, teacher sees teacher nav,
  // student sees student nav. If role is unknown, default to empty.
  let navItems = [];
  if (isAdmin) {
    navItems = NAV_BY_ROLE.admin;
  } else if (isTeacher) {
    navItems = NAV_BY_ROLE.teacher;
  } else if (isStudent) {
    navItems = NAV_BY_ROLE.student;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            Metableton<span className="text-emerald-400">Ecole</span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            {user && (
              <span className="hidden text-gray-400 sm:inline">
                {user.displayName || user.email}
              </span>
            )}
            {role && <Badge variant={role}>{role}</Badge>}
            <Button variant="ghost" size="sm" onClick={logout}>
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8">
        {/* Sidebar nav */}
        <aside className="hidden w-56 shrink-0 sm:block">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Cross-role links: admin sees teacher link, admin/teacher see student link */}
            {(isAdmin || isTeacher) && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-white/5 text-white'
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                    }`
                  }
                >
                  Vue étudiant
                </NavLink>
              </div>
            )}

            {isAdmin && (
              <NavLink
                to="/dashboard/teacher"
                end
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-white/5 text-white'
                      : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                  }`
                }
              >
                Vue enseignant
              </NavLink>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
