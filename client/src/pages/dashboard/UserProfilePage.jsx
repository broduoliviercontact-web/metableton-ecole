import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function UserProfilePage() {
  const { user, role } = useAuth();

  // ── Not logged in ──────────────────────────────────────────────
  if (!user) {
    return (
      <div className="px-4 py-16">
        <EmptyState
          icon="🔒"
          title="Veuillez vous connecter"
          description="Vous devez être connecté pour voir votre profil."
        />
      </div>
    );
  }

  // ── Loading state ───────────────────────────────────────────────
  if (!user) {
    return (
      <div className="px-4 py-16">
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  // Get available data from user object
  const displayName = user.displayName || user.display_name || 'Utilisateur';
  const email = user.email || 'Aucun email disponible';
  const avatarUrl = user.avatarUrl || user.avatar_url;
  const roleLabel =
    role === 'admin' ? 'Administrateur' : role === 'teacher' ? 'Enseignant' : 'Étudiant';

  // ── Profile page ────────────────────────────────────────────────
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
        >
          &larr; Retour au tableau de bord
        </Link>

        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Mon profil
        </h1>

        {/* Profile card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
          {/* Avatar + name row */}
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-20 w-20 shrink-0 rounded-full border-2 border-emerald-500/20 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500/20 bg-emerald-500/10 text-2xl font-bold text-emerald-400">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{displayName}</h2>
              <Badge variant={role}>{roleLabel}</Badge>
            </div>
          </div>

          {/* Email */}
          <div className="mt-6">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              Email
            </p>
            <p className="mt-1 text-gray-300">{email}</p>
          </div>

          {/* Created at */}
          {user.created_at && (
            <div className="mt-6">
              <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
                Inscrit le
              </p>
              <p className="mt-1 text-gray-300">{formatDate(user.created_at)}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/5 pt-6">
            <Link to="/catalog">
              <Button variant="secondary" size="sm">
                Voir le catalogue
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">Fermer</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
