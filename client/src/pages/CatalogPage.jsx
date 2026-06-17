import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import { getPublishedCourses } from '../api/courses.js';
import { SKILL_LABELS } from '../constants.js';

export default function CatalogPage() {
  const [courses, setCourses] = useState(null); // null = not loaded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPublishedCourses();
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
      <div className="px-4 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Catalogue des cours
        </h1>
        <LoadingSpinner size="lg" className="py-12" />
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="px-4 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Catalogue des cours
        </h1>
        <ErrorMessage
          title="Impossible de charger le catalogue"
          message={error.message || 'Une erreur est survenue lors du chargement.'}
          onRetry={loadCourses}
        />
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────
  if (!courses || courses.length === 0) {
    return (
      <div className="px-4 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Catalogue des cours
        </h1>
        <EmptyState
          icon="🎵"
          title="Le catalogue est en préparation"
          description="Nos premiers parcours Metableton arrivent bientôt. Revenez prochainement ou connectez-vous pour préparer votre espace."
          action={
            <Link to="/" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                Retour à l&apos;accueil
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // ── Populated state ─────────────────────────────────────────────
  return (
    <div className="px-4 py-16">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
          Catalogue des cours
        </h1>
        <p className="mx-auto max-w-lg text-gray-400">
          Découvrez les cours disponibles et commencez votre apprentissage de la
          création musicale moderne.
        </p>
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/catalog/${course.id}`}
            className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06]"
          >
            {/* Skill badge */}
            <div className="mb-4">
              <Badge variant={course.skill_level}>
                {SKILL_LABELS[course.skill_level] || course.skill_level}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {course.title}
            </h2>

            {/* Description — truncated on cards for readability */}
            {course.description ? (
              <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-3">
                {course.description}
              </p>
            ) : (
              <p className="mb-4 flex-1 text-sm italic text-gray-500">
                Pas de description.
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Par {course.profiles?.display_name || 'Enseignant'}
              </span>
              {course.classroom_url && (
                <span className="text-emerald-400">Classroom lié</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer note ─────────────────────────────────────────── */}
      <p className="mt-10 text-center text-xs text-gray-600">
        Les cours sont dispensés via Google Classroom. L&apos;inscription sera
        disponible après connexion avec votre compte Google.
      </p>
    </div>
  );
}
