import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-4 text-6xl">🎛️</div>
      <h1 className="mb-2 text-4xl font-bold text-white">404</h1>
      <p className="mb-8 max-w-md text-gray-400">
        Cette page n&apos;existe pas. Peut-être un preset égaré dans la session ?
      </p>
      <Link to="/">
        <Button variant="secondary">Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
