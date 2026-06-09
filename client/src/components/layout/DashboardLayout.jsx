import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold tracking-tight text-white">
            Metableton<span className="text-emerald-400">Ecole</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-300">
            <Link to="/dashboard" className="hover:text-white">
              Tableau de bord
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
