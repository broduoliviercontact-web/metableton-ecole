# P-34 — Design Issues Backlog

> **Date**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `design-audit`

---

## P0 — Bloquant

| ID | Page | Problème | Impact | Recommandation | Ticket |
|---|---|---|---|---|---|
| D-001 | HomePage | Deux home pages (HomePage + HomePageV2) | Confusion, code redondant | Fuser les deux pages, supprimer HomePageV2 | TKT-D-001 |
| D-002 | HomePage | Bouton login "bientôt" désactivé | Perception négative, annulation de confiance | Activer le bouton ou le supprimer | TKT-D-002 |
| D-003 | Tout le site | Pas d'ARIA labels | Inaccessible aux lecteurs d'écran | Ajouter ARIA labels à tous les composants | TKT-D-003 |
| D-004 | Dashboards | Pas de loading states | Mauvaise UX, incertitude | Ajouter LoadingSpinner sur toutes les actions async | TKT-D-004 |
| D-005 | CourseDetailPage | CTA inscription dominant | Déséquilibre visuel | Rééquilibrer hiérarchie, afficher contenu avant CTA | TKT-D-005 |

---

## P1 — Important avant bêta 2

| ID | Page | Problème | Impact | Recommandation | Ticket |
|---|---|---|---|---|---|
| D-006 | CatalogPage | Pas de recherche | UX lente, frustration | Ajouter search bar et filtres avancés | TKT-D-006 |
| D-007 | CatalogPage | Filtres simples | UX limitée | Ajouter filtres multiples (instruments, niveaux, dates) | TKT-D-007 |
| D-008 | TeacherDashboardPage | Pending enrollments avant cours | Confusion sur le workflow | Mettre cours avant pending enrollments | TKT-D-008 |
| D-009 | StudentDashboardPage | Pas de progression visible | Manque d'information | Ajouter barre de progression, modules complétés | TKT-D-009 |
| D-010 | Tout le site | Pas de notifications email | Manque de follow-up | Ajouter emails pour statuts enrollment | TKT-D-010 |

---

## P2 — Polish utile

| ID | Page | Problème | Impact | Recommandation | Ticket |
|---|---|---|---|---|---|
| D-011 | Tout le site | Pas assez "premium" | Pas "studio quality" | Améliorer typographie, espacements, micro-interactions | TKT-D-011 |
| D-012 | AdminDashboardPage | Pas de filtres/recherche | Recherche lente | Ajouter filtres sur utilisateurs et cours | TKT-D-012 |
| D-013 | CourseDetailPage | Répétition Classroom | Redondance, ennui | Réduire la répétition, afficher une seule fois | TKT-D-013 |
| D-014 | TeacherDashboardPage | Pas de liste élèves par cours | Manque d'info | Ajouter section élèves par cours | TKT-D-014 |
| D-015 | AdminDashboardPage | Pas de metrics d'activité | Manque d'insight | Ajouter graphes d'activité, conversions | TKT-D-015 |

---

## P3 — Plus tard

| ID | Page | Problème | Impact | Recommandation | Ticket |
|---|---|---|---|---|---|
| D-016 | Tout le site | Design system à unifier | Incohérence, maintenance difficile | Choisir un système, documenter | TKT-D-016 |
| D-017 | HomePage | Pas de social proof | Moins de confiance | Ajouter compteurs, témoignages | TKT-D-017 |
| D-018 | CourseDetail | Pas de syllabus | Manque de transparence | Ajouter curriculum détaillé | TKT-D-018 |
| D-019 | DashboardPages | Pas de navigation latérale | Moins de structure | Ajouter sidebar pour navigation | TKT-D-019 |
| D-020 | Tout le site | Pas de documentation UI | Maintenance difficile | Documenter design system | TKT-D-020 |

---

## Status Legend

| Statut | Description |
|---|---|
| **To define** | À définir |
| **Ready for Claude** | Prêt pour développement |
| **In progress** | En cours de développement |
| **Done** | Corrigé |
| **Deferred** | Reporté |

---

## Catégorie de tickets

| Catégorie | Description |
|---|---|
| **UI polish** | Ajustements visuels, typo, espacements |
| **UX copy** | Textes, libellés, empty states |
| **Responsive** | Adjustements mobile/tablette |
| **Accessibility** | ARIA labels, keyboard, focus |
| **Component consistency** | Unification des composants |
| **Design system** | Documentation et standardisation |
| **Classroom clarity** | Explication de l'intégration |
| **Dashboard clarity** | Clarté des dashboards |
| **Public page conversion** | Optimisation des pages publiques |

---

## Prochaine action

1. Prioriser les tickets P0
2. Créer les tickets GitHub
3. Assigner aux sprints
4. Planifier le développement

---

**Fin du backlog.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
