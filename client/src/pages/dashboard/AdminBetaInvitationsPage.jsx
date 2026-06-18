import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import {
  createBetaInvitation,
  listBetaInvitations,
  revokeBetaInvitation,
} from '../../api/betaInvitations.js';

const STATUS_LABELS = {
  pending: 'En attente',
  accepted: 'Acceptée',
  expired: 'Expirée',
  revoked: 'Révoquée',
};

const STATUS_VARIANTS = {
  pending: 'pending',
  accepted: 'approved',
  expired: 'pending',
  revoked: 'rejected',
};

const ROLE_LABELS = {
  student: 'Étudiant',
  teacher: 'Enseignant',
  admin: 'Administrateur',
};

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminBetaInvitationsPage() {
  const { user: currentUser } = useAuth();

  const [invitations, setInvitations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('student');
  const [formExpiresAt, setFormExpiresAt] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Created invitation state (to show the link)
  const [createdInvitation, setCreatedInvitation] = useState(null);

  const loadInvitations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listBetaInvitations();
      setInvitations(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreatedInvitation(null);

    // Validate email
    if (!formEmail || !formEmail.includes('@')) {
      setCreateError('Veuillez entrer un email valide.');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createBetaInvitation({
        email: formEmail,
        role: formRole,
        expiresAt: formExpiresAt || undefined,
        notes: formNotes || undefined,
      });

      setCreatedInvitation(result);
      setFormEmail('');
      setFormRole('student');
      setFormExpiresAt('');
      setFormNotes('');
      await loadInvitations();
    } catch (err) {
      setCreateError(err.message || 'Erreur lors de la création de l\'invitation.');
    } finally {
      setIsCreating(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <PageHeader />
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <PageHeader />
        <ErrorMessage
          title="Impossible de charger les invitations"
          message={error.message || 'Une erreur est survenue lors du chargement.'}
          onRetry={loadInvitations}
        />
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (!invitations || invitations.length === 0) {
    return (
      <div>
        <PageHeader />
        <EmptyState
          icon="✉️"
          title="Aucune invitation bêta pour le moment"
          description="Créez une première invitation pour tester le parcours privé."
          action={
            <Button size="sm" onClick={() => document.getElementById('email-input')?.focus()}>
              Créer une invitation
            </Button>
          }
        />
      </div>
    );
  }

  // ── Populated state ─────────────────────────────────────────────
  return (
    <div>
      <PageHeader />

      {/* Creation Form */}
      <section className="mb-10 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Nouvelle invitation
        </h2>
        {createError && (
          <div
            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            role="alert"
            aria-live="assertive"
          >
            {createError}
          </div>
        )}
        {createdInvitation && (
          <div
            className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-4"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <p className="mb-2 font-medium text-emerald-200">
                  Invitation créée
                </p>
                <p className="mb-2 text-sm text-gray-300">
                  Lien d'invitation :
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={createdInvitation.inviteUrl || ''}
                    className="flex-1 rounded-lg border border-emerald-500/30 bg-black/30 px-3 py-2 text-sm text-emerald-100 focus:outline-none"
                    aria-label="Lien d'invitation généré"
                  />
                  <CopyButton
                    text={createdInvitation.inviteUrl || ''}
                    onSuccess={() => setCreatedInvitation(null)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Copiez ce lien et partagez-le avec le testeur.
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleCreateInvitation}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="email-input"
                className="block text-sm font-medium text-gray-300"
              >
                Email
                <span className="ml-1 text-red-400">*</span>
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="exemple@domaine.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                aria-required="true"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="role-select"
                className="block text-sm font-medium text-gray-300"
              >
                Rôle
              </label>
              <select
                id="role-select"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              >
                <option value="student">Étudiant</option>
                <option value="teacher">Enseignant</option>
                <option value="admin">Administrateur</option>
              </select>
              {formRole === 'admin' && (
                <div
                  id="admin-warning"
                  className="text-xs text-amber-400"
                  aria-describedby="admin-warning"
                >
                  ⚠️ Accès administrateur élevé
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="expires-at"
                className="block text-sm font-medium text-gray-300"
              >
                Date d'expiration
                <span className="ml-1 text-gray-500">(optionnel)</span>
              </label>
              <input
                id="expires-at"
                type="date"
                value={formExpiresAt}
                onChange={(e) => setFormExpiresAt(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="notes-input"
                className="block text-sm font-medium text-gray-300"
              >
                Notes
                <span className="ml-1 text-gray-500">(optionnel)</span>
              </label>
              <input
                id="notes-input"
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Détails sur le testeur..."
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Création en cours...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Créer l'invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      {/* Invitations List */}
      <h2 className="mb-4 text-lg font-semibold text-white">
        Invitations existantes
      </h2>
      <div className="space-y-3">
        {invitations.map((inv) => (
          <InvitationRow
            key={inv.id}
            invitation={inv}
            onRevoke={() => {
              loadInvitations();
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── PageHeader ───────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">Invitations bêta</h1>
      <p className="mt-1 text-sm text-gray-400">
        Créez des accès privés pour les premiers testeurs de Metableton École.
      </p>
    </div>
  );
}

// ── InvitationRow ────────────────────────────────────────────────────
function InvitationRow({ invitation, onRevoke }) {
  const { id, email, role, status, created_at, accepted_at, expires_at, notes } =
    invitation;

  const isPending = status === 'pending';
  const isRevoked = status === 'revoked';
  const isExpired = status === 'expired';
  const isAccepted = status === 'accepted';

  const formattedCreated = formatDate(created_at);
  const formattedAccepted = formatDate(accepted_at);
  const formattedExpires = formatDate(expires_at);

  const handleRevoke = () => {
    if (window.confirm(`Révoquer l'invitation pour ${email} ?`)) {
      revokeBetaInvitation(id)
        .then(() => onRevoke())
        .catch((err) => {
          alert(
            `Impossible de révoquer : ${err.message || 'Erreur inconnue'}`
          );
        });
    }
  };

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: info */}
        <div className="flex min-w-0 gap-3">
          <div className="shrink-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isAccepted
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isRevoked
                  ? 'bg-red-500/20 text-red-400'
                  : isExpired
                  ? 'bg-gray-500/20 text-gray-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
              aria-hidden="true"
            >
              {isAccepted ? '✅' : isRevoked ? '🚫' : isExpired ? '⏱️' : '✉️'}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-0.5 truncate text-base font-medium text-white">
              {email}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
              <span>Role: {ROLE_LABELS[role] || role}</span>
              {formattedCreated && (
                <>
                  <span>·</span>
                  <span>Créé: {formattedCreated}</span>
                </>
              )}
              {formattedExpires && (
                <>
                  <span>·</span>
                  <span>Expire: {formattedExpires}</span>
                </>
              )}
            </div>
            {notes && (
              <div className="mt-1 text-xs italic text-gray-500">
                "{notes}"
              </div>
            )}
          </div>
        </div>

        {/* Right side: status + action */}
        <div className="flex shrink-0 items-center gap-2">
          <Badge
            variant={STATUS_VARIANTS[status] || 'pending'}
            className="min-w-[80px]"
          >
            {STATUS_LABELS[status] || status}
          </Badge>
          {isPending && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleRevoke}
              aria-label={`Révoquer l'invitation pour ${email}`}
            >
              Révoquer
            </Button>
          )}
          {formattedAccepted && (
            <span className="text-xs text-emerald-400">
              Accepté: {formattedAccepted}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ── CopyButton ───────────────────────────────────────────────────────
function CopyButton({ text, onSuccess }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      aria-label={copied ? "Lien copié" : "Copier le lien"}
    >
      {copied ? 'Copié !' : 'Copier'}
    </Button>
  );
}

// ── Helper ───────────────────────────────────────────────────────────
function getInvitationUrl(token) {
  const baseUrl =
    import.meta.env.VITE_APP_URL || 'https://metableton-ecole.vercel.app';
  return `${baseUrl}/beta/invite/${token}`;
}
