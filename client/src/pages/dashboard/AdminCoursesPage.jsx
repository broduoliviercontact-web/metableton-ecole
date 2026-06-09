import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import { getAdminCourses } from '../../api/admin.js';

const SKILL_LABELS = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  all_levels: 'Tous niveaux',
};

const STATUS_LABELS = {
  draft: 'Brouillon',
  published: 'Publié',
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

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminCourses();
      setCourses(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

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
          title="Impossible de charger les cours"
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
        <PageHeader />
        <EmptyState
          icon="📚"
          title="Aucun cours pour le moment"
          description="Les cours créés par les enseignants apparaîtront ici."
        />
      </div>
    );
  }

  // ── Populated state ─────────────────────────────────────────────
  const stats = computeStats(courses);

  return (
    <div>
      <PageHeader />

      <SummaryStats stats={stats} />

      <h2 className="mb-4 text-lg font-semibold text-white">Tous les cours</h2>
      <div className="space-y-3">
        {courses.map((course) => (
          <CourseRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

// ── PageHeader ───────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Cours de la plateforme</h1>
      <Link
        to="/dashboard/admin"
        className="text-sm text-gray-400 transition-colors hover:text-white"
      >
        &larr; Retour à l&apos;administration
      </Link>
    </div>
  );
}

// ── SummaryStats ─────────────────────────────────────────────────────
// Four stat tiles at the top: total, published, draft, with Classroom.
function SummaryStats({ stats }) {
  const tiles = [
    { label: 'Cours au total', value: stats.total },
    { label: 'Publiés', value: stats.published },
    { label: 'Brouillons', value: stats.draft },
    { label: 'Classroom lié', value: stats.withClassroom },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="text-2xl font-bold text-white">{tile.value}</div>
          <div className="mt-1 text-xs uppercase tracking-widest text-gray-500">
            {tile.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function computeStats(courses) {
  return {
    total: courses.length,
    published: courses.filter((c) => c.status === 'published').length,
    draft: courses.filter((c) => c.status === 'draft').length,
    withClassroom: courses.filter((c) => !!c.classroom_url).length,
  };
}

// ── CourseRow ────────────────────────────────────────────────────────
function CourseRow({ course }) {
  const teacher = course.profiles || {};
  const updated = formatDate(course.updated_at || course.created_at);
  const created = formatDate(course.created_at);

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      {/* Top: badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant={course.status}>
          {STATUS_LABELS[course.status] || course.status}
        </Badge>
        <Badge variant={course.skill_level}>
          {SKILL_LABELS[course.skill_level] || course.skill_level}
        </Badge>
        {course.classroom_url && <Badge variant="approved">Classroom lié</Badge>}
      </div>

      {/* Title */}
      <h3 className="mb-1 text-lg font-semibold text-white">
        {course.title}
      </h3>

      {/* Teacher */}
      <p className="mb-3 text-sm text-gray-400">
        Par{' '}
        <span className="text-gray-300">{teacher.display_name || '—'}</span>
        {teacher.email && (
          <>
            {' '}
            <span className="text-gray-500">·</span>{' '}
            <span>{teacher.email}</span>
          </>
        )}
      </p>

      {/* Description */}
      {course.description ? (
        <p className="mb-4 line-clamp-3 text-sm text-gray-400">
          {course.description}
        </p>
      ) : (
        <p className="mb-4 text-sm italic text-gray-500">Pas de description.</p>
      )}

      {/* Classroom link */}
      {course.classroom_url && (
        <div className="mb-4">
          <a
            href={course.classroom_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 break-all text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Ouvrir Google Classroom <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}

      {/* Footer: dates + edit link */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <div>
          {created && <span>Créé le {created}</span>}
          {updated && updated !== created && (
            <>
              {' '}
              <span>·</span> mis à jour le {updated}
            </>
          )}
        </div>
        <Link
          to={`/dashboard/teacher/courses/${course.id}/edit`}
          className="text-emerald-400 transition-colors hover:text-emerald-300"
        >
          Voir / modifier →
        </Link>
      </div>
    </article>
  );
}
