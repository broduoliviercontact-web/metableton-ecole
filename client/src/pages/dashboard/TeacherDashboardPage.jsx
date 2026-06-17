import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { apiClient } from '../../api/client.js';
import {
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment,
} from '../../api/enrollments.js';
import ClassroomConnectButton from '../../components/ClassroomConnectButton.jsx';
import { SKILL_LABELS } from '../../constants.js';

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TeacherDashboardPage() {
  const [courses, setCourses] = useState(null); // null = not loaded yet
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Pending enrollments (Story 3.6) ─────────────────────────────
  const [pendingEnrollments, setPendingEnrollments] = useState(null); // null = not loaded
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState(null);
  // Track which enrollment id currently has an action in flight,
  // so we can disable ONLY that row's buttons and show a spinner.
  const [actionInFlight, setActionInFlight] = useState(null);
  // Per-row transient error (e.g., "Impossible d'approuver") shown next to the row.
  const [rowErrors, setRowErrors] = useState({});

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient('/courses/manage');
      setCourses(response.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPending = useCallback(async () => {
    setIsPendingLoading(true);
    setPendingError(null);
    try {
      const data = await getPendingEnrollments();
      setPendingEnrollments(data || []);
    } catch (err) {
      setPendingError(err);
    } finally {
      setIsPendingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
    loadPending();
  }, [loadCourses, loadPending]);

  // Approve / reject handler with optimistic removal + rollback on error.
  async function handleReview(enrollmentId, action) {
    setActionInFlight(enrollmentId);
    setRowErrors((prev) => ({ ...prev, [enrollmentId]: null }));

    // Optimistic removal: snapshot and remove from list immediately.
    const snapshot = pendingEnrollments;
    setPendingEnrollments((prev) =>
      prev ? prev.filter((e) => e.id !== enrollmentId) : prev
    );

    try {
      if (action === 'approve') {
        await approveEnrollment(enrollmentId);
      } else {
        await rejectEnrollment(enrollmentId);
      }
      // Server is the source of truth — refresh to catch any drift.
      await loadPending();
    } catch (err) {
      // Roll back to the snapshot so the row reappears.
      setPendingEnrollments(snapshot);
      setRowErrors((prev) => ({
        ...prev,
        [enrollmentId]:
          err.message ||
          (action === 'approve'
            ? "Impossible d'approuver la demande. Veuillez réessayer."
            : "Impossible de refuser la demande. Veuillez réessayer."),
      }));
    } finally {
      setActionInFlight(null);
    }
  }

  // Header with create button (shared across all states)
  const HeaderActions = () => (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Espace enseignant</h1>
      <div className="flex items-center gap-3">
        <ClassroomConnectButton />
        <Link to="/dashboard/teacher/courses/new">
          <Button>Créer un cours</Button>
        </Link>
      </div>
    </div>
  );

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div aria-busy="true" aria-live="polite">
        <HeaderActions />
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────
  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <HeaderActions />
        <ErrorMessage
          title="Impossible de charger vos cours"
          message={error.message || 'Une erreur est survenue lors du chargement.'}
          onRetry={loadCourses}
        />
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (!courses || courses.length === 0) {
    return (
      <div>
        <HeaderActions />
        <EmptyState
          icon="🎵"
          title="Aucun cours pour le moment"
          description="Cliquez sur « Créer un cours » pour commencer. Vous pourrez le publier plus tard."
        />
        {/* Pending enrollment requests are independent of having courses */}
        <PendingEnrollmentsSection
          isLoading={isPendingLoading}
          error={pendingError}
          pendingEnrollments={pendingEnrollments}
          onRetry={loadPending}
          onReview={handleReview}
          actionInFlight={actionInFlight}
          rowErrors={rowErrors}
        />
      </div>
    );
  }

  // ── Populated state ─────────────────────────────────────────────
  return (
    <div>
      <HeaderActions />

      {/* Pending enrollment requests (Story 3.6) */}
      <PendingEnrollmentsSection
        isLoading={isPendingLoading}
        error={pendingError}
        pendingEnrollments={pendingEnrollments}
        onRetry={loadPending}
        onReview={handleReview}
        actionInFlight={actionInFlight}
        rowErrors={rowErrors}
      />

      <p className="mb-6 text-sm text-gray-400">
        {courses.length} cours{courses.length > 1 ? '' : ''}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => {
          const updated = formatDate(course.updated_at || course.created_at);

          return (
            <article
              key={course.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant={course.status}>{course.status}</Badge>
                <Badge variant={course.skill_level}>
                  {SKILL_LABELS[course.skill_level] || course.skill_level}
                </Badge>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-white">
                {course.title}
              </h2>

              {course.description ? (
                <p className="mb-3 line-clamp-3 text-sm text-gray-400">
                  {course.description}
                </p>
              ) : (
                <p className="mb-3 text-sm italic text-gray-500">
                  Pas de description.
                </p>
              )}

              <div className="mt-4 flex items-center justify-end">
                <Link
                  to={`/dashboard/teacher/courses/${course.id}/edit`}
                  className="text-sm text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Modifier →
                </Link>
              </div>

              {updated && (
                <div className="mt-2 text-xs text-gray-500">
                  Mis à jour le {updated}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ── PendingEnrollmentsSection ───────────────────────────────────────
// Story 3.6: Teacher review of pending enrollment requests.
// Renders loading / error / empty / populated states, with per-row
// approve/reject actions that disable buttons while running.
function PendingEnrollmentsSection({
  isLoading,
  error,
  pendingEnrollments,
  onRetry,
  onReview,
  actionInFlight,
  rowErrors,
}) {
  return (
    <div className="mb-10" aria-busy={isLoading} aria-live="polite">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Demandes d&apos;inscription
      </h2>

      {isLoading && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <LoadingSpinner size="md" className="py-2" />
        </div>
      )}

      {!isLoading && error && (
        <ErrorMessage
          title="Impossible de charger les demandes d'inscription"
          message={error.message || 'Une erreur est survenue.'}
          onRetry={onRetry}
        />
      )}

      {!isLoading && !error && pendingEnrollments && pendingEnrollments.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-gray-400">
            Aucune demande d&apos;inscription en attente pour le moment.
          </p>
        </div>
      )}

      {!isLoading && !error && pendingEnrollments && pendingEnrollments.length > 0 && (
        <ul className="space-y-3">
          {pendingEnrollments.map((enrollment) => (
            <PendingEnrollmentRow
              key={enrollment.id}
              enrollment={enrollment}
              isActionInFlight={actionInFlight === enrollment.id}
              rowError={rowErrors[enrollment.id]}
              onApprove={() => onReview(enrollment.id, 'approve')}
              onReject={() => onReview(enrollment.id, 'reject')}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function PendingEnrollmentRow({
  enrollment,
  isActionInFlight,
  rowError,
  onApprove,
  onReject,
}) {
  const student = enrollment.profiles || {};
  const course = enrollment.courses || {};
  const requestedAt = formatDate(enrollment.created_at);

  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium text-white">
              {student.display_name || 'Étudiant'}
            </span>
            {student.email && (
              <span className="text-sm text-gray-400">{student.email}</span>
            )}
          </div>
          <div className="text-sm text-gray-300">
            Demande pour{' '}
            <span className="font-medium text-white">
              {course.title || 'Cours'}
            </span>
          </div>
          {requestedAt && (
            <div className="mt-1 text-xs text-gray-500">
              Demande reçue le {requestedAt}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            onClick={onReject}
            disabled={isActionInFlight}
            aria-label="Refuser la demande"
          >
            {isActionInFlight ? '…' : 'Refuser'}
          </Button>
          <Button
            size="sm"
            onClick={onApprove}
            disabled={isActionInFlight}
            aria-label="Approuver la demande"
          >
            {isActionInFlight ? '…' : 'Approuver'}
          </Button>
        </div>
      </div>

      {rowError && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {rowError}
        </div>
      )}
    </li>
  );
}
