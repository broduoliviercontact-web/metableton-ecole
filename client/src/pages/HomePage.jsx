import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const FEATURES = [
  {
    icon: '🏫',
    title: 'Un vrai portail école',
    description:
      'Une plateforme unique pour découvrir les cours, suivre votre progression, et accéder à vos classes — sans jongler entre dix onglets.',
  },
  {
    icon: '🔗',
    title: 'Connecté à Google Classroom',
    description:
      'Toute la puissance de Classroom en arrière-plan : devoirs, supports Drive, annonces et sessions Meet. On s\'occupe du lien, vous vous concentrez sur la musique.',
  },
  {
    icon: '🎛️',
    title: 'Pédagogie musique moderne',
    description:
      'Des cours pensés pour la MAO, le sound design, la synthèse, le DJing et la performance live. Pas de solfège abstrait : du concret, tout de suite.',
  },
];

const COURSE_PREVIEWS = [
  {
    title: 'Ableton Live — Les fondamentaux',
    level: 'beginner',
    levelLabel: 'Débutant',
    description:
      'Interface, clips, arrangement, effets, export. Prenez en main Ableton Live de A à Z.',
  },
  {
    title: 'Sound Design avec Operator et Wavetable',
    level: 'intermediate',
    levelLabel: 'Intermédiaire',
    description:
      'Créez vos propres sons avec les synthés natifs d\'Ableton. De la théorie à la pratique.',
  },
  {
    title: 'Production électro — Du track au mastering',
    level: 'advanced',
    levelLabel: 'Avancé',
    description:
      'Composition, arrangement, mixage et mastering d\'un morceau électro complet.',
  },
];

const MVP_STATS = [
  { value: '3', label: 'Cours au lancement' },
  { value: '2', label: 'Professeurs' },
  { value: '5', label: 'Places pilotes' },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center sm:pt-28">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute inset-0 -top-40 flex items-start justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-emerald-400">
            Métableton École
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Apprenez la création musicale moderne
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-400">
            Des cours en ligne pour Ableton Live, le sound design, la synthèse,
            le DJing et la production. Propulsé par Google Classroom pour une
            expérience d&apos;apprentissage fluide et connectée.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/catalog" aria-label="Voir le catalogue complet des cours">
              <Button size="lg">
                Voir les cours
              </Button>
            </Link>
            <a href="/api/auth/google" aria-label="Se connecter avec votre compte Google">
              <Button variant="secondary" size="lg">
                Se connecter avec Google
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-white sm:text-3xl">
            Pourquoi Métableton École&nbsp;?
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            {FEATURES.map(({ icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="mb-4 text-4xl">{icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course previews ─────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              Les premiers cours
            </h2>
            <p className="text-gray-400">
              Un aperçu des cours disponibles au lancement de la plateforme.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {COURSE_PREVIEWS.map(({ title, level, levelLabel, description }) => (
              <Link
                key={title}
                to="/catalog"
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06]"
                aria-label={`Voir le cours ${title}`}
              >
                <div className="mb-4">
                  <Badge variant={level}>{levelLabel}</Badge>
                </div>
                <h3 className="mb-2 font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/catalog" aria-label="Voir le catalogue complet">
              <Button variant="outline" size="sm">
                Voir le catalogue complet
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MVP launch ─────────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Lancement MVP
          </p>
          <h2 className="mb-4 text-2xl font-bold text-white">
            Démarrage en petit comité
          </h2>
          <p className="mb-10 text-gray-400">
            La plateforme ouvre ses portes avec un groupe pilote réduit pour
            garantir un accompagnement de qualité.
          </p>

          <div className="grid grid-cols-3 gap-6">
            {MVP_STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="mb-1 text-3xl font-bold text-emerald-400">
                  {value}
                </div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-gray-500">
            Intéressé(e)&nbsp;? Parcourez le catalogue et inscrivez-vous avec
            votre compte Google dès l&apos;ouverture des inscriptions.
          </p>
        </div>
      </section>
    </>
  );
}
