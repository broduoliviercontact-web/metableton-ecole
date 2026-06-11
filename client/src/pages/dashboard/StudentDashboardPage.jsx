import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { getMyEnrollments, cancelEnrollment, cancelApprovedEnrollment } from '../../api/enrollments.js';
import { SKILL_LABELS } from '../../constants.js';

// Status copy — French, kept here so all three messages live next to the
// statuses they describe.
const STATUS_LABELS = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Refusée',
  cancelled: 'Désinscrit',
};

const STATUS_MESSAGES = {
  pending: 'Demande en attente de validation',
  approved: 'Inscription approuvée',
  rejected: 'Demande refusée — vous pouvez redemander depuis la page du cours',
  cancelled: 'Vous avez quitté ce cours',
};

const STATUS_PANEL_CLASS = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-200',
  cancelled: 'border-gray-500/30 bg-gray-500/10 text-gray-400',
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

export default function StudentDashboardPage() {
  const [enrollments, setEnrollments] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEnrollments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyEnrollments();
      // Filter out cancelled enrollments - they are not shown in active dashboard
      setEnrollments((data || []).filter((e) => e.status !== 'cancelled'));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Callback for EnrollmentCard to remove enrollment after cancel
  const handleCancelEnrollment = useCallback((enrollmentId) => {
    setEnrollments((prev) =>
      prev ? prev.filter((e) => e.id !== enrollmentId) : []
    );
  }, []);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Mon tableau de bord</h1>
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Mon tableau de bord</h1>
        <ErrorMessage
          title="Impossible de charger vos inscriptions"
          message={error.message || 'Une erreur est survenue lors du chargement.'}
          onRetry={loadEnrollments}
        />
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (!enrollments || enrollments.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-white">Mon tableau de bord</h1>
        <EmptyState
          icon="📚"
          title="Aucun cours pour le moment"
          description="Parcourez le catalogue et demandez votre inscription à un cours."
          action={
            <Link to="/catalog">
              <Button>Voir le catalogue</Button>
            </Link>
          }
        />
      </div>
    );
  }

  // ── Populated state ─────────────────────────────────────────────
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Mon tableau de bord</h1>
      <p className="mb-6 text-sm text-gray-400">
        {enrollments.length} inscription{enrollments.length > 1 ? 's' : ''}
      </p>

      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <EnrollmentCard
            key={enrollment.id}
            enrollment={enrollment}
            onCancelEnrollment={handleCancelEnrollment}
          />
        ))}
      </div>
    </div>
  );
}

// ── EnrollmentCard ──────────────────────────────────────────────────
// Renders one enrollment row with course details, status panel, and
// (for approved enrollments) a Classroom link if the course has one.
function EnrollmentCard({ enrollment, onCancelEnrollment }) {
  const course = enrollment.courses || {};
  const teacher = course.profiles || {};
  const status = enrollment.status;
  const statusLabel = STATUS_LABELS[status] || status;
  const statusMessage = STATUS_MESSAGES[status];
  const statusPanelClass = STATUS_PANEL_CLASS[status] || 'border-white/10 bg-white/5 text-gray-300';

  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // The "updated" timestamp is the most recent state change — for a pending
  // request that's the submission time, for approved/rejected it's the
  // decision time. Prefer it; fall back to created_at.
  const lastChange = formatDate(enrollment.updated_at || enrollment.created_at);
  const requestedAt = formatDate(enrollment.created_at);

  // Handler for canceling a pending enrollment
  async function handleCancel() {
    setIsCanceling(true);
    setCancelError(null);
    try {
      await cancelEnrollment(enrollment.id);
      if (onCancelEnrollment) {
        onCancelEnrollment(enrollment.id);
      }
    } catch (err) {
      // Map server errors to user-friendly messages
      if (err?.status === 409) {
        setCancelError('Cette demande ne peut pas être annulée.');
      } else if (err?.status === 403) {
        setCancelError('Vous n\'avez pas les droits pour annuler cette demande.');
      } else {
        setCancelError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsCanceling(false);
    }
  }

  // Handler for cancelling an approved enrollment
  async function handleCancelApproved() {
    setIsCanceling(true);
    setCancelError(null);
    setShowConfirmModal(false);
    try {
      await cancelApprovedEnrollment(enrollment.id);
      if (onCancelEnrollment) {
        onCancelEnrollment(enrollment.id);
      }
    } catch (err) {
      // Map server errors to user-friendly messages
      if (err?.status === 409) {
        setCancelError('Vous ne pouvez pas quitter ce cours.');
      } else if (err?.status === 403) {
        setCancelError('Vous n\'avez pas les droits pour quitter ce cours.');
      } else {
        setCancelError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsCanceling(false);
    }
  }

  // Confirm dialog for cancelling approved enrollment
  const ConfirmModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-gray-900 p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold text-white">
          Confirmer la désinscription
        </h3>
        <p className="mb-6 text-sm text-gray-300">
          Voulez-vous vraiment quitter ce cours ? Vous perdrez l'accès depuis
          votre dashboard et ne pourrez plus accéder au contenu ni au
          Google Classroom.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowConfirmModal(false)}
            disabled={isCanceling}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancelApproved}
            disabled={isCanceling}
          >
            {isCanceling ? 'Désinscription en cours…' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      {/* Top: skill + status badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {course.skill_level && (
          <Badge variant={course.skill_level}>
            {SKILL_LABELS[course.skill_level] || course.skill_level}
          </Badge>
        )}
        <Badge variant={status}>{statusLabel}</Badge>
      </div>

      {/* Title + teacher */}
      <h2 className="mb-1 text-lg font-semibold text-white">
        {course.title || 'Cours'}
      </h2>
      {teacher.display_name && (
        <p className="mb-3 text-sm text-gray-400">
          Par <span className="text-gray-300">{teacher.display_name}</span>
        </p>
      )}

      {/* Description */}
      {course.description && (
        <p className="mb-4 line-clamp-3 text-sm text-gray-400">
          {course.description}
        </p>
      )}

      {/* Status panel */}
      {statusMessage && (
        <div
          className={`mb-4 rounded-lg border px-3 py-2 text-sm ${statusPanelClass}`}
        >
          {statusMessage}
        </div>
      )}

      {/* Classroom link — only for approved enrollments */}
      {status === 'approved' && (
        <ClassroomLink classroomUrl={course.classroom_url} courseId={course.id} />
      )}

      {/* Rejected → link to the course to retry */}
      {status === 'rejected' && course.id && (
        <div className="mt-2">
          <Link
            to={`/catalog/${course.id}`}
            className="text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Voir la page du cours →
          </Link>
        </div>
      )}

      {/* Footer dates */}
      {(lastChange || requestedAt) && (
        <div className="mt-4 text-xs text-gray-500">
          {status === 'pending' && requestedAt && (
            <span>Demande envoyée le {requestedAt}</span>
          )}
          {status === 'approved' && lastChange && (
            <span>Approuvée le {lastChange}</span>
          )}
          {status === 'rejected' && lastChange && (
            <span>Refusée le {lastChange}</span>
          )}
        </div>
      )}

      {/* Cancel button — only for pending enrollments */}
      {status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-white/5">
          {cancelError && (
            <div className="mb-2 text-xs text-red-400">
              {cancelError}
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCancel}
            disabled={isCanceling}
          >
            {isCanceling ? 'Annulation en cours…' : 'Annuler la demande'}
          </Button>
        </div>
      )}

      {/* Cancel button — only for approved enrollments */}
      {status === 'approved' && (
        <div className="mt-4 pt-4 border-t border-white/5">
          {cancelError && (
            <div className="mb-2 text-xs text-red-400">
              {cancelError}
            </div>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowConfirmModal(true)}
            disabled={isCanceling}
          >
            {isCanceling ? 'Désinscription en cours…' : 'Se désinscrire'}
          </Button>
        </div>
      )}

      {/* Confirm modal for approved enrollment cancellation */}
      {showConfirmModal && <ConfirmModal />}
    </article>
  );
}

// ── ClassroomLink ───────────────────────────────────────────────────
// Renders the right control for an approved enrollment:
//   - classroom_url present → external "Ouvrir Google Classroom" link
//   - classroom_url missing → fallback "Classroom pas encore lié par le professeur"
function ClassroomLink({ classroomUrl, courseId }) {
  if (classroomUrl) {
    return (
      <a
        href={classroomUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
      >
        Ouvrir Google Classroom
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-gray-400">
      Classroom pas encore lié par le professeur.
      {courseId && (
        <>
          {' '}
          <Link
            to={`/catalog/${courseId}`}
            className="text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Voir le cours
          </Link>
        </>
      )}
    </div>
  );
}
