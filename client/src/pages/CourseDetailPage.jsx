import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { getPublishedCourseById } from '../api/courses.js';
import { SKILL_LABELS } from '../data/mockCourses.js';
import { useAuth } from '../hooks/useAuth.js';
import { getMyEnrollments, requestEnrollment } from '../api/enrollments.js';

/**
 * Returns the current user's enrollment for this course, or null if none.
 * Looks up by joining enrollments → courses (id).
 */
function useEnrollmentForCourse(enrollments, courseId) {
  if (!enrollments) return null;
  return enrollments.find((e) => e.course_id === courseId || e.courses?.id === courseId) || null;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();

  const { user, isLoading: isAuthLoading, isAuthenticated, isStudent, isTeacher, isAdmin, login } = useAuth();

  const [course, setCourse] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [enrollments, setEnrollments] = useState(null); // null = not loaded
  const [isEnrollmentsLoading, setIsEnrollmentsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [retryMessage, setRetryMessage] = useState(null);

  // Load the published course by id
  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getPublishedCourseById(courseId);
      setCourse(data);
    } catch (err) {
      // 404 from the server means "no published course with this id"
      if (err.status === 404) {
        setCourse(null);
      } else {
        setLoadError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Load the user's enrollments once authenticated
  const loadEnrollments = useCallback(async () => {
    if (!isAuthenticated) {
      setEnrollments([]);
      return;
    }
    setIsEnrollmentsLoading(true);
    try {
      const data = await getMyEnrollments();
      setEnrollments(data || []);
    } catch (err) {
      // If /mine fails (e.g., 401), still proceed with empty list
      console.error('Failed to load enrollments:', err);
      setEnrollments([]);
    } finally {
      setIsEnrollmentsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    // Wait for auth to finish initializing before deciding to fetch
    if (isAuthLoading) return;
    loadEnrollments();
  }, [isAuthLoading, loadEnrollments]);

  const currentEnrollment = useEnrollmentForCourse(enrollments, courseId);

  async function handleRequestEnrollment() {
    setIsRequesting(true);
    setRequestError(null);
    setRetryMessage(null);
    try {
      const result = await requestEnrollment(courseId);
      // Refresh enrollments to pick up the new state
      await loadEnrollments();
      if (result?.previousStatus === 'rejected') {
        setRetryMessage('Votre nouvelle demande a été enregistrée.');
      }
    } catch (err) {
      setRequestError(err);
    } finally {
      setIsRequesting(false);
    }
  }

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <LoadingSpinner size="lg" className="py-12" />
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg">
          <ErrorMessage
            title="Impossible de charger le cours"
            message={loadError.message || 'Une erreur est survenue lors du chargement.'}
            onRetry={loadCourse}
          />
        </div>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────
  if (!course) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg">
          <EmptyState
            icon="🔍"
            title="Cours introuvable"
            description="Ce cours n'existe pas, a été retiré du catalogue ou n'a pas encore été publié. Parcourez les autres cours disponibles."
            action={
              <Link to="/catalog">
                <Button variant="secondary" size="sm">
                  Voir le catalogue
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  // ── Course found ───────────────────────────────────────────────
  const teacherName = course.profiles?.display_name || 'Enseignant';
  const skillLabel =
    SKILL_LABELS[course.skill_level] || course.skill_level;

  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          to="/catalog"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
        >
          &larr; Retour au catalogue
        </Link>

        {/* Skill badge */}
        <div className="mb-4">
          <Badge variant={course.skill_level}>{skillLabel}</Badge>
        </div>

        {/* Title + teacher */}
        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
          {course.title}
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          Par <span className="text-gray-300">{teacherName}</span>
        </p>

        {/* Description card */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            À propos du cours
          </h2>
          {course.description ? (
            <p className="whitespace-pre-line leading-relaxed text-gray-300">
              {course.description}
            </p>
          ) : (
            <p className="text-sm italic text-gray-500">
              Pas de description pour le moment.
            </p>
          )}
        </div>

        {/* Classroom note */}
        <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="mb-2 text-2xl">🔗</div>
          <h2 className="mb-2 font-semibold text-white">
            Propulsé par Google Classroom
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-400">
            Une fois inscrit, vous recevrez un lien vers le Google Classroom du
            cours. C&apos;est là que tout se passe : les devoirs, les supports de
            cours dans Drive, les annonces du professeur et les sessions live
            via Google Meet.
          </p>
          <p className="text-xs text-gray-500">
            L&apos;inscription sera disponible après la connexion avec votre compte
            Google.
          </p>
        </div>

        {/* Enrollment CTA — state-aware */}
        <EnrollmentCTA
          isAuthLoading={isAuthLoading}
          isAuthenticated={isAuthenticated}
          isStudent={isStudent}
          isTeacher={isTeacher}
          isAdmin={isAdmin}
          login={login}
          isEnrollmentsLoading={isEnrollmentsLoading}
          currentEnrollment={currentEnrollment}
          isRequesting={isRequesting}
          requestError={requestError}
          retryMessage={retryMessage}
          onRequest={handleRequestEnrollment}
        />
      </div>
    </div>
  );
}

// ── EnrollmentCTA ──────────────────────────────────────────────────
// Subcomponent that renders the right CTA based on auth + enrollment state.
function EnrollmentCTA({
  isAuthLoading,
  isAuthenticated,
  isStudent,
  isTeacher,
  isAdmin,
  login,
  isEnrollmentsLoading,
  currentEnrollment,
  isRequesting,
  requestError,
  retryMessage,
  onRequest,
}) {
  // 1. Auth is still loading
  if (isAuthLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <LoadingSpinner size="md" className="py-2" />
      </div>
    );
  }

  // 2. Logged out — prompt to sign in
  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <h2 className="mb-2 font-semibold text-white">Prêt à apprendre ?</h2>
        <p className="mb-4 text-sm text-gray-400">
          Connectez-vous avec votre compte Google pour demander
          l&apos;inscription à ce cours.
        </p>
        <Button onClick={login}>Se connecter avec Google</Button>
      </div>
    );
  }

  // 3. Logged in as teacher or admin — they don't enroll as students
  if (isTeacher || isAdmin) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <h2 className="mb-2 font-semibold text-white">
          Vous êtes {isAdmin ? 'administrateur' : 'enseignant'}
        </h2>
        <p className="text-sm text-gray-400">
          Les enseignants et administrateurs ne s&apos;inscrivent pas aux cours
          en tant qu&apos;étudiants. Rendez-vous sur votre tableau de bord pour
          gérer vos cours.
        </p>
        <div className="mt-4">
          <Link to={isAdmin ? '/dashboard/admin' : '/dashboard/teacher'}>
            <Button variant="secondary" size="sm">
              Mon tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 4. Logged in as student — load enrollment state
  if (isEnrollmentsLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <LoadingSpinner size="md" className="py-2" />
      </div>
    );
  }

  // 4a. Already approved — show success state (no Classroom link yet — Story 3.7)
  if (currentEnrollment?.status === 'approved') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <div className="mb-2 text-2xl">✅</div>
        <h2 className="mb-2 font-semibold text-white">Inscription approuvée</h2>
        <p className="text-sm text-gray-300">
          Vous êtes inscrit à ce cours. Le lien vers le Google Classroom sera
          disponible sur votre tableau de bord.
        </p>
        <div className="mt-4">
          <Link to="/dashboard">
            <Button size="sm">Mon tableau de bord</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 4b. Pending — show waiting state
  if (currentEnrollment?.status === 'pending') {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <div className="mb-2 text-2xl">⏳</div>
        <h2 className="mb-2 font-semibold text-white">Demande en cours</h2>
        <p className="text-sm text-gray-300">
          Votre demande d&apos;inscription est en attente d&apos;approbation par
          l&apos;enseignant. Vous serez notifié dès qu&apos;elle sera traitée.
        </p>
      </div>
    );
  }

  // 4c. Rejected — show retry option
  if (currentEnrollment?.status === 'rejected') {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <div className="mb-2 text-2xl">⚠️</div>
        <h2 className="mb-2 font-semibold text-white">Demande refusée</h2>
        <p className="mb-4 text-sm text-gray-300">
          Votre précédente demande a été refusée. Vous pouvez soumettre une
          nouvelle demande.
        </p>
        {requestError && (
          <ErrorMessage
            title="Erreur lors de la nouvelle demande"
            message={requestError.message || 'Une erreur est survenue.'}
          />
        )}
        {retryMessage && (
          <p className="mb-3 text-sm text-emerald-400">{retryMessage}</p>
        )}
        <Button onClick={onRequest} disabled={isRequesting}>
          {isRequesting ? 'Envoi…' : 'Redemander l’inscription'}
        </Button>
      </div>
    );
  }

  // 4d. No enrollment yet — show request button
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
      <h2 className="mb-2 font-semibold text-white">Prêt à apprendre ?</h2>
      <p className="mb-4 text-sm text-gray-400">
        Demandez votre inscription à ce cours. L&apos;enseignant examinera votre
        demande et vous donnera accès au Google Classroom.
      </p>
      {requestError && (
        <ErrorMessage
          title="Erreur lors de la demande"
          message={requestError.message || 'Une erreur est survenue.'}
        />
      )}
      <Button onClick={onRequest} disabled={isRequesting}>
        {isRequesting ? 'Envoi…' : 'Demander l’inscription'}
      </Button>
    </div>
  );
}
