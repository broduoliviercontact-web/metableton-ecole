import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { getBetaInvitation, acceptBetaInvitation } from '../api/betaInvitations.js';

// Status labels for display
const STATUS_LABELS = {
  pending: 'En attente',
  accepted: 'Acceptée',
  expired: 'Expirée',
  revoked: 'Révoquée',
};

export default function BetaInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [invitation, setInvitation] = useState(null); // null = not loaded, object = loaded, false = error
  const [invitationLoading, setInvitationLoading] = useState(true);
  const [invitationError, setInvitationError] = useState(null);

  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  // Load invitation on mount
  useEffect(() => {
    const loadInvitation = async () => {
      setInvitationLoading(true);
      setInvitationError(null);
      try {
        const data = await getBetaInvitation(token);
        setInvitation(data);
        setInvitationError(null);
      } catch (err) {
        setInvitation(false);
        setInvitationError(err);
        // Don't show generic error for expired/revoked - those are valid states
        if (err.status === 404) {
          setInvitationError(new Error('Invitation invalide ou inexistante'));
        }
      } finally {
        setInvitationLoading(false);
      }
    };
    loadInvitation();
  }, [token]);

  // Auto-accept if user is authenticated and invitation is valid
  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated &&
      user &&
      invitation &&
      !accepting &&
      !acceptSuccess &&
      invitation.status === 'pending' &&
      invitation.email.toLowerCase() === user.email?.toLowerCase()
    ) {
      handleAccept();
    }
  }, [authLoading, isAuthenticated, user, invitation, accepting, acceptSuccess]);

  const handleAccept = async () => {
    if (accepting || acceptSuccess) return;

    setAccepting(true);
    setAcceptError(null);

    try {
      const data = await acceptBetaInvitation(token);
      setAcceptSuccess(true);
      setInvitation(data);
    } catch (err) {
      setAcceptError(err);
    } finally {
      setAccepting(false);
    }
  };

  const handleLogin = () => {
    // Login triggers a redirect, so we don't need to do anything else
    // The useEffect will trigger again after auth restores
  };

  // ── Loading state ───────────────────────────────────────────────
  if (invitationLoading || authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true" aria-live="polite">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Error state (invalid token) ─────────────────────────────────
  if (!invitation && invitationError) {
    return (
      <div className="px-4 py-16" role="alert" aria-live="assertive">
        <ErrorMessage
          title="Lien d'invitation invalide"
          message={invitationError.message || 'Le lien que vous avez suivi ne fonctionne pas.'}
        />
      </div>
    );
  }

  // ── Valid invitation states ─────────────────────────────────────
  const inv = invitation;

  // Expired
  if (inv.status === 'expired') {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-red-500/20 bg-red-500/5 px-8 py-12 text-center">
          <div className="mb-4 text-4xl">⏱️</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Lien expiré</h2>
          <p className="mb-8 text-gray-400">
            Ce lien d'invitation a expiré. Les invitations bêta sont valables 30 jours.
          </p>
          <Link to="/" aria-label="Retour à la page d'accueil">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Revoked
  if (inv.status === 'revoked') {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-red-500/20 bg-red-500/5 px-8 py-12 text-center">
          <div className="mb-4 text-4xl">🚫</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Invitation révoquée</h2>
          <p className="mb-8 text-gray-400">
            Ce lien a été révoqué par l'administrateur. Veuillez contacter l'équipe si vous pensez que c'est une erreur.
          </p>
          <Link to="/" aria-label="Retour à la page d'accueil">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Already accepted
  if (inv.status === 'accepted') {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-12 text-center">
          <div className="mb-4 text-4xl">✅</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Invitation déjà acceptée</h2>
          <p className="mb-8 text-gray-400">
            Vous avez déjà accepté cette invitation. Votre compte a été mis à jour avec les privilèges bêta.
          </p>
          <Link to="/dashboard" aria-label="Accéder à votre tableau de bord">
            <Button variant="primary">Aller à mon espace</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Pending - main acceptance flow
  // ── Email mismatch ──────────────────────────────────────────────
  if (isAuthenticated && user && inv.status === 'pending') {
    if (inv.email.toLowerCase() !== user.email?.toLowerCase()) {
      return (
        <div className="px-4 py-16">
          <div className="mx-auto max-w-lg rounded-xl border border-amber-500/20 bg-amber-500/5 px-8 py-12 text-center">
            <div className="mb-4 text-4xl">⚠️</div>
            <h2 className="mb-4 text-2xl font-bold text-white">Email incorrect</h2>
            <p className="mb-6 text-gray-400">
              Cette invitation est destinée à <strong>{inv.email}</strong>, mais vous êtes connecté en tant que{' '}
              <strong>{user.email}</strong>.
            </p>
            <p className="mb-8 text-sm text-gray-500">Déconnectez-vous et reconnectez-vous avec le bon compte.</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Retour
              </Button>
              <Button variant="danger" onClick={() => navigate('/')}>
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  // ── Not authenticated - show login prompt ───────────────────────
  if (!isAuthenticated && inv.status === 'pending') {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-12 text-center">
          <div className="mb-4 text-4xl"> invitation invite</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Invitation bêta valide</h2>
          <p className="mb-2 text-gray-300">Email: <strong>{inv.email}</strong></p>
          <p className="mb-8 text-gray-400">
            Connectez-vous avec Google pour accepter cette invitation et obtenir accès au programme bêta.
          </p>
          <Button variant="primary" size="lg" onClick={handleLogin} aria-label="Se connecter avec Google pour accepter l'invitation">
            <span className="mr-2">🔑</span>
            Se connecter avec Google
          </Button>
          <p className="mt-6 text-xs text-gray-500">
            En vous connectant, vous acceptez nos conditions d'utilisation.
          </p>
        </div>
      </div>
    );
  }

  // ── Authenticated & email matches - auto-accepting or accepting ─
  if (isAuthenticated && user && inv.status === 'pending') {
    if (accepting) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true" aria-live="polite">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-400">Traitement de votre invitation...</p>
          </div>
        </div>
      );
    }

    if (acceptSuccess) {
      return (
        <div className="px-4 py-16">
          <div className="mx-auto max-w-lg rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-12 text-center">
            <div className="mb-4 text-4xl">🎉</div>
            <h2 className="mb-4 text-2xl font-bold text-white">Bienvenue dans la bêta !</h2>
            <p className="mb-6 text-gray-400">
              Votre compte a été mis à jour avec le rôle <strong>{inv.role || 'testeur'}</strong>.
            </p>
            <p className="mb-8 text-sm text-gray-500">Vous pouvez maintenant accéder aux fonctionnalités bêta.</p>
            <Link to="/dashboard" aria-label="Aller à votre tableau de bord">
              <Button variant="primary" size="lg">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    // Accept button state
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-8 py-12 text-center">
          <div className="mb-4 text-4xl"> invitation invite</div>
          <h2 className="mb-4 text-2xl font-bold text-white">Invitation bêta valide</h2>
          <p className="mb-2 text-gray-300">Email: <strong>{inv.email}</strong></p>
          <p className="mb-6 text-gray-400">
            Vous êtes prêt à accepter cette invitation et devenir un testeur bêta.
          </p>
          {acceptError && (
            <ErrorMessage
              title="Erreur lors de l'acceptation"
              message={acceptError.message}
              onRetry={handleAccept}
              className="mb-6"
            />
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleAccept}
            disabled={accepting}
            aria-label="Accepter l'invitation bêta et activer votre compte"
          >
            {accepting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Acceptation...</span>
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Accepter l'invitation
              </>
            )}
          </Button>
          <p className="mt-6 text-xs text-gray-500">
            En acceptant, vous confirmez que vous êtes {inv.email} et vous engagez à garder confidentielles les
            fonctionnalités bêta.
          </p>
        </div>
      </div>
    );
  }

  // Fallback - should not be reached
  return (
    <div className="px-4 py-16">
      <ErrorMessage
        title="Erreur inattendue"
        message="Une erreur imprévue est survenue. Veuillez rafraîchir la page ou contacter le support."
      />
    </div>
  );
}
