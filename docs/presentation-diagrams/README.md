# Metableton Ecole — Presentation Diagrams

Diagrammes de présentation pour pitcher le projet Metableton Ecole.
8 diagrammes HTML/SVG autonomes, dark-themed, conçus pour montrer la valeur du projet
à des publics variés : professeurs de musique, écoles, partenaires, investisseurs, développeurs.

**Date de génération**: 2026-06-10
**Source**: Analyse de `client/src/`, `server/src/`, `supabase/migrations/`

---

## Fichiers

| Fichier | Description | Public cible |
|---------|-------------|-------------|
| `00-presentation-audit.md` | Audit : résumé produit, rôles, features, arguments de valeur, angles de présentation | — |
| `index.html` | Index visuel avec liens vers les 8 diagrammes | — |
| `01-product-vision.html` | Vue d'ensemble hub-and-spoke | Tous publics |
| `02-value-proposition.html` | 4 piliers de valeur (students, teachers, schools, tech) | Investisseurs, partenaires |
| `03-user-ecosystem.html` | Écosystème des 4 rôles autour de la plateforme | Documentation, onboarding |
| `04-student-experience.html` | Parcours étudiant en 7 étapes | Étudiants, site web |
| `05-teacher-experience.html` | Parcours professeur : créer, gérer, lier Classroom | Professeurs, écoles |
| `06-platform-flywheel.html` | Boucle de croissance circulaire | Investisseurs, roadmap |
| `07-google-classroom-integration.html` | Comparaison Metableton ↔ Classroom | Technique, partenaires Google |
| `08-mvp-roadmap.html` | Roadmap 4 phases (done / active / next / future) | Planification, investisseurs |

---

## Ouvrir les diagrammes

```bash
# Index (liste tous les diagrammes)
open docs/presentation-diagrams/index.html

# Diagrammes individuels
open docs/presentation-diagrams/01-product-vision.html
open docs/presentation-diagrams/02-value-proposition.html
open docs/presentation-diagrams/03-user-ecosystem.html
open docs/presentation-diagrams/04-student-experience.html
open docs/presentation-diagrams/05-teacher-experience.html
open docs/presentation-diagrams/06-platform-flywheel.html
open docs/presentation-diagrams/07-google-classroom-integration.html
open docs/presentation-diagrams/08-mvp-roadmap.html
```

---

## Hypothèses et limites

1. **Les features marquées ✓ sont confirmées** dans le code source
2. **Les features marquées ○ sont planifiées** mais pas encore implémentées
3. **Classroom est read-only** dans le MVP actuel — pas de création ni sync de roster
4. **Le business model n'est pas défini** dans le code — la roadmap Phase 3-4 est spéculative
5. **Pas de multi-école** dans le code actuel — Phase 4 est une projection

---

## Notes techniques

- Tous les fichiers HTML sont autonomes (CSS inline, SVG inline)
- Export intégré : Copy PNG, Download PNG, Download PDF (toolbar `⋯`)
- Police : JetBrains Mono (Google Fonts, chargée via CDN)
- Background : `#020617` (slate-950) avec grid pattern
- Design system cohérent avec `architecture-diagram-generator`
