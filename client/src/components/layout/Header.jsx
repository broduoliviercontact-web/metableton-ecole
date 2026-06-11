import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Header() {
  const { user, isLoading, isAuthenticated, isAdmin, isTeacher, login, logout } = useAuth();

  // Show skeleton while restoring session
  if (isLoading) {
    return (
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            Metableton<span className="text-emerald-400">Ecole</span>
          </Link>
          <div className="h-8 w-32 rounded-md bg-white/5" />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight text-white">
          Metableton<span className="text-emerald-400">Ecole</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/catalog"
            className="text-gray-300 transition-colors hover:text-white"
          >
            Cours
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={isAdmin ? '/dashboard/admin' : isTeacher ? '/dashboard/teacher' : '/dashboard'}
                className="text-gray-300 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <Badge variant={user.role}>{user.role}</Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                Se déconnecter
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={login}>
              Se connecter avec Google
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
