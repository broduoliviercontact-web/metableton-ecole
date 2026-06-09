import { useParams, Link } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getCourseById, SKILL_LABELS } from '../data/mockCourses.js';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);

  // ── Not found ──────────────────────────────────────────────────
  if (!course) {
    return (
      <div className="px-4 py-16">
        <div className="mx-auto max-w-lg">
          <EmptyState
            icon="🔍"
            title="Cours introuvable"
            description="Ce cours n'existe pas ou a été retiré du catalogue. Parcourez les autres cours disponibles."
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
          <Badge variant={course.skillLevel}>
            {SKILL_LABELS[course.skillLevel]}
          </Badge>
        </div>

        {/* Title + teacher */}
        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
          {course.title}
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          Par <span className="text-gray-300">{course.teacherName}</span>
        </p>

        {/* Description card */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            À propos du cours
          </h2>
          <p className="leading-relaxed text-gray-300">
            {course.longDescription}
          </p>
        </div>

        {/* Format + duration */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-1 text-2xl">📅</div>
            <h3 className="mb-1 text-sm font-semibold text-white">Format</h3>
            <p className="text-sm text-gray-400">{course.format}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-1 text-2xl">⏱️</div>
            <h3 className="mb-1 text-sm font-semibold text-white">Durée</h3>
            <p className="text-sm text-gray-400">{course.duration}</p>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Ce que vous apprendrez
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {course.topics.map((topic) => (
              <li
                key={topic}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <span className="mt-0.5 shrink-0 text-emerald-400">▸</span>
                {topic}
              </li>
            ))}
          </ul>
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

        {/* CTA */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <h2 className="mb-2 font-semibold text-white">
            Prêt à apprendre ?
          </h2>
          <p className="mb-4 text-sm text-gray-400">
            Connectez-vous avec votre compte Google pour demander
            l&apos;inscription à ce cours.
          </p>
          <Button disabled>
            Se connecter pour s&apos;inscrire
          </Button>
        </div>
      </div>
    </div>
  );
}
