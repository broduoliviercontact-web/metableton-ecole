import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getAllCourses, SKILL_LABELS } from '../data/mockCourses.js';

export default function CatalogPage() {
  const courses = getAllCourses();

  if (courses.length === 0) {
    return (
      <div className="px-4 py-16">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Catalogue des cours
        </h1>
        <EmptyState
          icon="🎓"
          title="Aucun cours pour le moment"
          description="Revenez bientôt pour découvrir les cours disponibles."
        />
      </div>
    );
  }

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
              <Badge variant={course.skillLevel}>
                {SKILL_LABELS[course.skillLevel]}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
              {course.title}
            </h2>

            {/* Description */}
            <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-400">
              {course.description}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Par {course.teacherName}</span>
              <span>{course.duration}</span>
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
