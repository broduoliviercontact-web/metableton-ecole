/* dashboardFixtures — données mockées pour les dashboards preview.
   Retirer une entrée (ou mettre un tableau vide) fait disparaître la zone
   correspondante du dashboard. */

export const studentDashboardConfig = {
  profile: {
    initials: 'AL',
    name: 'Alex L.',
    role: 'Élève',
  },
  navItems: [
    { label: 'Tableau de bord', href: '#' },
    { label: 'Mes cours',        href: '#' },
    { label: 'Agenda',           href: '#' },
    { label: 'Devoirs',          href: '#' },
    { label: 'Progression',      href: '#' },
  ],
  activeIndex: 0,
  header: {
    title: 'Bonjour, Alex',
    rightSlot: { type: 'badge', variant: 'orange', label: 'Niveau 4 — Intermédiaire' },
  },
  stats: [
    { label: 'Cours actifs',       value: '3',  change: '+1 ce mois' },
    { label: 'Heures de pratique', value: '48h', change: '+12h cette semaine' },
    { label: 'Progression moyenne', value: '72%', change: '+5% vs janvier' },
  ],
  courseProgress: [
    { percent: 78, label: '78%', title: 'Ableton Live',  subtitle: 'Leçon 16/20 · Opérateurs FX' },
    { percent: 45, label: '45%', title: 'Synthèse sonore', subtitle: 'Leçon 7/16 · FM Basics' },
  ],
  sessions: [
    { title: 'Correction projet', time: 'Mer 14h', variant: 'orange' },
    { title: 'Q&A Mix',           time: 'Ven 10h', variant: 'green' },
    { title: '—',                 time: 'Lun',     variant: 'empty' },
    { title: '—',                 time: 'Mar',     variant: 'empty' },
  ],
};

export const teacherDashboardConfig = {
  profile: {
    initials: 'LM',
    name: 'L. Martin',
    role: 'Professeur',
  },
  navItems: [
    { label: "Vue d'ensemble", href: '#' },
    { label: 'Mes classes',    href: '#' },
    { label: 'Élèves',         href: '#' },
    { label: 'Devoirs',        href: '#' },
    { label: 'Analytique',     href: '#' },
  ],
  activeIndex: 0,
  header: {
    title: 'Tableau de bord',
    rightSlot: { type: 'button', variant: 'primaryOrange', label: '+ Nouveau devoir', size: 'sm' },
  },
  stats: [
    { label: 'Élèves actifs',       value: '124', change: '+8 cette semaine' },
    { label: 'Cours publiés',       value: '6',   change: '2 en brouillon' },
    { label: 'Taux de complétion',  value: '81%', change: '+3% vs septembre' },
  ],
  weeklyActivity: {
    values: [55, 72, 48, 90, 66, 78, 60], // Lun → Dim, % d'une hauteur de 130px
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  },
  assignments: [
    { initials: 'AL', name: 'Alex L.',  assignment: 'Drum pattern polymètre', status: 'Rendu',     variant: 'green'  },
    { initials: 'SM', name: 'Sam M.',   assignment: 'Session Wavetable',     status: 'En cours',  variant: 'orange' },
    { initials: 'JD', name: 'Jules D.', assignment: 'Mix critique',          status: 'Non rendu', variant: 'danger' },
  ],
};
