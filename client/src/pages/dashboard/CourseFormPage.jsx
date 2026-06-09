import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import {
  getManageableCourseById,
  createCourse,
  updateCourse,
  linkClassroom,
} from '../../api/courses.js';

const SKILL_OPTIONS = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'all_levels', label: 'Tous niveaux' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Brouillon (non visible publiquement)' },
  { value: 'published', label: 'Publié (visible dans le catalogue)' },
];

export default function CourseFormPage({ mode }) {
  // mode: 'create' or 'edit'
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('all_levels');
  const [status, setStatus] = useState('draft');

  // Classroom link state (edit mode only)
  const [classroomId, setClassroomId] = useState(null);
  const [classroomUrl, setClassroomUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Load existing course for edit mode
  useEffect(() => {
    if (mode !== 'edit') return;

    let cancelled = false;
    async function load() {
      try {
        const data = await getManageableCourseById(courseId);
        if (cancelled) return;
        setTitle(data.title || '');
        setDescription(data.description || '');
        setSkillLevel(data.skill_level || 'all_levels');
        setStatus(data.status || 'draft');
        setClassroomId(data.classroom_id || null);
        setClassroomUrl(data.classroom_url || null);
      } catch (err) {
        if (!cancelled) setLoadError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mode, courseId]);

  // Called by the Classroom section after a successful link. The server
  // returns the updated course row, so we can lift its values directly.
  function handleClassroomLinked(updatedCourse) {
    setClassroomId(updatedCourse.classroom_id || null);
    setClassroomUrl(updatedCourse.classroom_url || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError(null);
    setSubmitError(null);

    if (!title.trim()) {
      setValidationError('Le titre est obligatoire.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      skillLevel,
      status,
    };

    setIsSaving(true);
    try {
      if (mode === 'create') {
        await createCourse(payload);
      } else {
        await updateCourse(courseId, payload);
      }
      navigate('/dashboard/teacher');
    } catch (err) {
      setSubmitError(err);
    } finally {
      setIsSaving(false);
    }
  }

  // ── Loading state (edit only) ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ── Load error (edit only) ──────────────────────────────────────
  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorMessage
          title="Impossible de charger le cours"
          message={loadError.message || 'Une erreur est survenue.'}
          action={
            <Link to="/dashboard/teacher">
              <Button variant="secondary" size="sm">
                Retour au tableau de bord
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/dashboard/teacher"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
      >
        &larr; Retour
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white">
        {mode === 'create' ? 'Nouveau cours' : 'Modifier le cours'}
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        {mode === 'create'
          ? 'Renseignez les informations de votre cours. Vous pourrez le publier plus tard.'
          : 'Mettez à jour les informations de votre cours.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-white">
            Titre <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
            maxLength={200}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
            placeholder="ex. Ableton Live — Les fondamentaux"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving}
            rows={5}
            className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
            placeholder="Décrivez le contenu et les objectifs du cours."
          />
        </div>

        {/* Skill level */}
        <div>
          <label htmlFor="skillLevel" className="mb-2 block text-sm font-medium text-white">
            Niveau
          </label>
          <select
            id="skillLevel"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            disabled={isSaving}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          >
            {SKILL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-white">
            Statut
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isSaving}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Validation error (client-side) */}
        {validationError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {validationError}
          </div>
        )}

        {/* Submit error (server-side) */}
        {submitError && (
          <ErrorMessage
            title="Erreur lors de l'enregistrement"
            message={submitError.message || 'Une erreur est survenue. Réessayez.'}
          />
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-6">
          <Link to="/dashboard/teacher">
            <Button type="button" variant="ghost" disabled={isSaving}>
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? 'Enregistrement…'
              : mode === 'create'
                ? 'Créer le cours'
                : 'Enregistrer'}
          </Button>
        </div>
      </form>

      {/* Google Classroom link — only after the course exists */}
      {mode === 'edit' && courseId && (
        <ClassroomSection
          courseId={courseId}
          classroomId={classroomId}
          classroomUrl={classroomUrl}
          onLinked={handleClassroomLinked}
        />
      )}
    </div>
  );
}

// ── ClassroomSection ────────────────────────────────────────────────
// Story 3.8: lets the teacher / admin link a Google Classroom course to
// this Metableton course. The server validates the Classroom via the
// Google API before persisting — we just collect the input and show
// loading / success / error states.
function ClassroomSection({ courseId, classroomId, classroomUrl, onLinked }) {
  const [input, setInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = input.trim();
    if (!trimmed) {
      setError("Saisissez un identifiant ou une URL Google Classroom.");
      return;
    }

    // Send whichever field the user filled in. The server treats them
    // equivalently and parses the ID out of either form.
    const payload = /classroom\.google\.com/.test(trimmed)
      ? { classroomUrl: trimmed }
      : { classroomId: trimmed };

    setIsLinking(true);
    try {
      const updated = await linkClassroom(courseId, payload);
      onLinked(updated);
      setSuccess('Google Classroom lié avec succès.');
      setInput('');
    } catch (err) {
      setError(err);
    } finally {
      setIsLinking(false);
    }
  }

  return (
    <section className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="mb-1 text-lg font-semibold text-white">
        Lier Google Classroom
      </h2>
      <p className="mb-5 text-sm text-gray-400">
        Collez l&apos;URL publique ou l&apos;identifiant du cours Google
        Classroom associé à ce cours. Le cours est validé via l&apos;API Google
        avant d&apos;être enregistré.
      </p>

      {/* Current link (if any) */}
      {classroomUrl && (
        <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Classroom lié
          </div>
          <a
            href={classroomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-sm text-emerald-400 transition-colors hover:text-emerald-300"
          >
            {classroomUrl}
          </a>
          {classroomId && (
            <div className="mt-1 text-xs text-gray-500">
              Identifiant : <span className="font-mono">{classroomId}</span>
            </div>
          )}
        </div>
      )}

      {/* Link form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="classroomInput"
            className="mb-2 block text-sm font-medium text-white"
          >
            {classroomUrl ? 'Remplacer par un autre cours' : 'URL ou identifiant'}
          </label>
          <input
            id="classroomInput"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLinking}
            placeholder="ex. https://classroom.google.com/c/123456789012"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          />
        </div>

        {error && (
          <ErrorMessage
            title="Erreur lors de la liaison"
            message={error.message || 'Une erreur est survenue.'}
          />
        )}

        {success && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isLinking}>
            {isLinking
              ? 'Vérification…'
              : classroomUrl
                ? 'Mettre à jour'
                : 'Lier le cours'}
          </Button>
        </div>
      </form>
    </section>
  );
}
