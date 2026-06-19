import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import OscillatorMemoryGame from '../features/oscillator-memory/OscillatorMemoryGame.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 text-6xl">🎛️</div>
      <h1 className="mb-2 text-4xl font-bold text-white">404</h1>
      <p className="mb-2 max-w-md text-gray-300 font-medium">
        Signal perdu / page introuvable
      </p>
      <p className="mb-8 max-w-md text-sm text-gray-500">
        Cette page n&apos;existe pas. Peut-être un preset égaré dans la session ?
      </p>
      <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row">
        <Link to="/">
          <Button variant="secondary">Retour à l&apos;accueil</Button>
        </Link>
        <Link to="/catalog">
          <Button variant="outline">Voir les cours</Button>
        </Link>
      </div>
      <OscillatorMemoryGame />
    </div>
  );
}
