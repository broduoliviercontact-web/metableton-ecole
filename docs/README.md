# Documentation Map

Ce dossier contient la documentation opérationnelle de Metableton Ecole.
Le cadrage produit initial généré avec BMAD reste dans [`/_bmad-output/planning-artifacts`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts).

## Par où commencer

1. Lire [`PROJECT_STATUS.md`](/Users/zub/metableton-ecole/docs/PROJECT_STATUS.md) pour comprendre l'état actuel du projet.
2. Relire le cadrage BMAD:
   - [`brief.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md)
   - [`prd.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/prds/prd-metableton-ecole-2026-06-09/prd.md)
   - [`architecture.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/architecture.md)
   - [`epics.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/epics.md)
3. Passer ensuite aux documents de validation récents dans `docs/`.

## Structure recommandee

### 1. Vision produit et cadrage BMAD

Source de verite pour le "pourquoi" et le "quoi":

- [`/_bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/briefs/brief-metableton-ecole-2026-06-09/brief.md)
- [`/_bmad-output/planning-artifacts/prds/prd-metableton-ecole-2026-06-09/prd.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/prds/prd-metableton-ecole-2026-06-09/prd.md)
- [`/_bmad-output/planning-artifacts/architecture.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/architecture.md)
- [`/_bmad-output/planning-artifacts/epics.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/epics.md)

Usage:

- `brief.md`: positionnement et ambition produit
- `prd.md`: exigences fonctionnelles et scope MVP
- `architecture.md`: decisions techniques et patterns
- `epics.md`: decomposition backlog/story

### 2. Etat reel du MVP

Documents qui disent ce qui est effectivement construit et teste:

- [`PROJECT_STATUS.md`](/Users/zub/metableton-ecole/docs/PROJECT_STATUS.md)
- [`smoke-tests/p27-mvp-smoke-test-report.md`](/Users/zub/metableton-ecole/docs/smoke-tests/p27-mvp-smoke-test-report.md)
- [`production-smoke-test.md`](/Users/zub/metableton-ecole/docs/production-smoke-test.md)
- [`/_bmad-output/planning-artifacts/mvp-stabilization-audit.md`](/Users/zub/metableton-ecole/_bmad-output/planning-artifacts/mvp-stabilization-audit.md)

Usage:

- `PROJECT_STATUS.md`: vue de pilotage rapide
- `p27-mvp-smoke-test-report.md`: resultat du dernier passage de validation du 2026-06-17
- `production-smoke-test.md`: checklist de revalidation avant demo/deploiement
- `mvp-stabilization-audit.md`: ecarts entre la promesse BMAD et l'implementation

### 3. Google Classroom

Documents specifiques a l'integration Classroom:

- [`classroom-ownership-model.md`](/Users/zub/metableton-ecole/docs/classroom-ownership-model.md)
- [`classroom-integration-roadmap.md`](/Users/zub/metableton-ecole/docs/classroom-integration-roadmap.md)
- [`classroom-integration-flow.md`](/Users/zub/metableton-ecole/docs/classroom-integration-flow.md)
- [`classroom-prod-test-checklist.md`](/Users/zub/metableton-ecole/docs/classroom-prod-test-checklist.md)

Usage:

- `ownership-model`: vision produit et repartition des responsabilites entre Metableton et Classroom
- `integration-roadmap`: garde-fous techniques et ordre de travail
- `integration-flow`: parcours teacher/admin/student
- `prod-test-checklist`: validation en conditions de production

### 4. Design, UX et demo

Documents de lisibilite produit et de polish:

- [`design-audit/p34-full-ui-ux-design-audit.md`](/Users/zub/metableton-ecole/docs/design-audit/p34-full-ui-ux-design-audit.md)
- [`design-audit/p35-accessibility-ui-safety-pass.md`](/Users/zub/metableton-ecole/docs/design-audit/p35-accessibility-ui-safety-pass.md)
- [`design-audit/p36-design-p0-cleanup.md`](/Users/zub/metableton-ecole/docs/design-audit/p36-design-p0-cleanup.md)
- [`demo-polish/p28-demo-polish-audit.md`](/Users/zub/metableton-ecole/docs/demo-polish/p28-demo-polish-audit.md)
- [`demo-polish/p28e-demo-script.md`](/Users/zub/metableton-ecole/docs/demo-polish/p28e-demo-script.md)
- [`design/open-design/metableton-home-final.html`](/Users/zub/metableton-ecole/docs/design/open-design/metableton-home-final.html)

Usage:

- `p34`: audit global UX/UI
- `p35` et `p36`: corrections prioritaires deja passees
- `p28*`: preparation demo, donnees et polish
- `open-design/`: references visuelles

### 5. Beta privee et lancement

Documents pour la phase de confrontation au reel:

- [`private-beta/p29-private-beta-plan.md`](/Users/zub/metableton-ecole/docs/private-beta/p29-private-beta-plan.md)
- [`private-beta/p29-beta-test-checklist.md`](/Users/zub/metableton-ecole/docs/private-beta/p29-beta-test-checklist.md)
- [`private-beta/p29-feedback-form.md`](/Users/zub/metableton-ecole/docs/private-beta/p29-feedback-form.md)
- [`private-beta/p30-feedback-triage-board.md`](/Users/zub/metableton-ecole/docs/private-beta/p30-feedback-triage-board.md)
- [`private-beta/p30-post-beta-decision-log.md`](/Users/zub/metableton-ecole/docs/private-beta/p30-post-beta-decision-log.md)
- [`private-beta/p33-priority-ticket-backlog.md`](/Users/zub/metableton-ecole/docs/private-beta/p33-priority-ticket-backlog.md)

Usage:

- `p29*`: preparation de la beta
- `p30*`: collecte et arbitrage des retours
- `p33*`: transformation des retours en backlog

### 6. Flows, schemas et support

Documents d'explication transverse:

- [`user-flows/README.md`](/Users/zub/metableton-ecole/docs/user-flows/README.md)
- [`presentation-diagrams/README.md`](/Users/zub/metableton-ecole/docs/presentation-diagrams/README.md)
- [`architecture/01-system-overview.html`](/Users/zub/metableton-ecole/docs/architecture/01-system-overview.html)
- [`local-supabase-setup.md`](/Users/zub/metableton-ecole/docs/local-supabase-setup.md)
- [`production-deployment-notes.md`](/Users/zub/metableton-ecole/docs/production-deployment-notes.md)
- [`supabase-rls-security.md`](/Users/zub/metableton-ecole/docs/supabase-rls-security.md)

## Regle de lecture simple

Quand vous reprenez le projet, suivez cet ordre:

1. `PROJECT_STATUS.md`
2. `p27-mvp-smoke-test-report.md`
3. `p29-private-beta-plan.md`
4. Les docs specifiques a la tache en cours

## Proposition de gouvernance documentaire

Pour eviter que la doc se re-disperse:

- `/_bmad-output/` = cadre d'origine, on y touche peu
- `/docs/PROJECT_STATUS.md` = etat courant vivant
- `/docs/README.md` = index d'entree
- `/docs/private-beta/` = documents d'experimentation terrain
- `/docs/design-audit/` = audits et corrections UI/UX
- `/docs/classroom-*` = integration Google Classroom

Si vous voulez aller plus loin ensuite, le prochain nettoyage utile sera de renommer les documents `p27`, `p28`, `p29`... avec un prefixe plus parlant, sans supprimer les references historiques.
