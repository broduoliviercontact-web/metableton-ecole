import { Link } from 'react-router-dom';

export default function Header() {
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
        </nav>
      </div>
    </header>
  );
}
