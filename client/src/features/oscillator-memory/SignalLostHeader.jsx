import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

export default function SignalLostHeader() {
  return (
    <header className="flex flex-col items-center text-center">
      <h1
        className="font-sans text-[5rem] font-bold leading-none tracking-tighter text-emerald-400"
        style={{ textShadow: '0 0 18px rgba(52,211,153,0.55), 0 0 42px rgba(52,211,153,0.35)' }}
      >
        404
      </h1>

      <div className="relative mt-4 overflow-hidden rounded border border-[#3c4a42] bg-[#0e0e0e] px-4 py-1.5">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03))',
            backgroundSize: '100% 4px, 3px 100%',
          }}
        />
        <span
          className="relative z-10 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-400"
          style={{ textShadow: '0 0 6px rgba(251,191,36,0.5)' }}
        >
          Signal perdu / Page introuvable
        </span>
      </div>

      <p className="mt-4 max-w-md text-sm text-[#bbcabf]">
        Cette page n&apos;existe pas. Peut-être un preset égaré dans la session ?
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <Link to="/">
          <Button variant="secondary">Retour à l&apos;accueil</Button>
        </Link>
        <Link to="/catalog">
          <Button variant="outline">Voir les cours</Button>
        </Link>
      </div>
    </header>
  );
}
