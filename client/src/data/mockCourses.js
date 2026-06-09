const MOCK_COURSES = [
  {
    id: '1',
    title: 'Ableton Live — Les fondamentaux',
    description:
      'Prenez en main Ableton Live de A à Z : interface, clips, arrangement, effets, et export.',
    skillLevel: 'beginner',
    teacherName: 'Zub',
    coverImageUrl: null,
    format: 'Modules progressifs avec exercices pratiques',
    duration: '~8 semaines',
    longDescription:
      'Ce cours couvre l\'interface d\'Ableton Live, le mode Session vs Arrangement, ' +
      'les instruments et effets natifs, le warping, l\'automation, et l\'export. ' +
      'Chaque module est accompagné d\'exercices pratiques dans Google Classroom. ' +
      'Que vous partiez de zéro ou souhaitiez consolider vos bases, ce cours vous ' +
      'guide pas à pas.',
    topics: [
      'Interface et navigation',
      'Mode Session vs Arrangement',
      'Instruments natifs (Simpler, Impulse, Drum Rack)',
      'Effets audio et MIDI',
      'Warping et time-stretching',
      'Automation et modulation',
      'Export et rendu final',
    ],
  },
  {
    id: '2',
    title: 'Sound Design avec Operator et Wavetable',
    description:
      'Créez vos propres sons avec les synthés natifs d\'Ableton. De la théorie à la pratique.',
    skillLevel: 'intermediate',
    teacherName: 'Zub',
    coverImageUrl: null,
    format: 'Ateliers pratiques + projets sonores',
    duration: '~6 semaines',
    longDescription:
      'Explorez la synthèse FM avec Operator et la synthèse par table d\'ondes ' +
      'avec Wavetable. Apprenez à concevoir des basses, des leads, des pads et ' +
      'des textures sonores originales. Chaque module débouche sur une création ' +
      'sonore concrète que vous pourrez réutiliser dans vos productions.',
    topics: [
      'Fondamentaux de la synthèse sonore',
      'Synthèse FM avec Operator',
      'Synthèse par table d\'ondes avec Wavetable',
      'Création de basses et sub-basses',
      'Design de leads et arpèges',
      'Pads, textures et atmosphères',
      'Banque de sons personnelle',
    ],
  },
  {
    id: '3',
    title: 'Production électro — De l\'idée au track fini',
    description:
      'Un parcours complet : composition, arrangement, mixage et mastering d\'un morceau électro.',
    skillLevel: 'advanced',
    teacherName: 'Zub',
    coverImageUrl: null,
    format: 'Projet fil rouge sur toute la durée du cours',
    duration: '~10 semaines',
    longDescription:
      'De la conception initiale au rendu final : ce cours vous accompagne à ' +
      'travers tout le processus de création d\'un morceau électro. Composition, ' +
      'sound design, arrangement, mixage et mastering. Vous terminez le cours ' +
      'avec un track complet, prêt à être partagé.',
    topics: [
      'Idéation et direction artistique',
      'Composition et structure',
      'Sound design avancé',
      'Arrangement et progression',
      'Mixage : EQ, compression, spatialisation',
      'Mastering : loudness, clarté, cohésion',
      'Export et diffusion',
    ],
  },
];

export const SKILL_LABELS = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  all_levels: 'Tous niveaux',
};

export function getCourseById(id) {
  return MOCK_COURSES.find((c) => c.id === id) || null;
}

export function getAllCourses() {
  return MOCK_COURSES;
}

export default MOCK_COURSES;
