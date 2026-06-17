# P-28D — Polish dashboards réels

## Statut

Complété.

## Objectif

Améliorer les dashboards réels student, teacher et admin pour une démo MVP plus claire, sans refonte majeure et sans changement de logique métier.

## Fichiers modifiés

- client/src/pages/dashboard/StudentDashboardPage.jsx
- client/src/pages/dashboard/TeacherDashboardPage.jsx
- client/src/pages/dashboard/AdminDashboardPage.jsx
- client/src/pages/dashboard/AdminCoursesPage.jsx
- client/src/components/ClassroomConnectButton.jsx

## Changements principaux

### Student dashboard

- Titre harmonisé vers “Mon espace étudiant”.
- Empty state plus clair.
- Textes Classroom rendus plus compréhensibles.
- Wording d’annulation simplifié.

### Teacher dashboard

- Titre harmonisé vers “Espace enseignant”.
- Icône et textes légèrement améliorés.
- Correction de structure JSX sans modification de logique métier.
- Conservation des actions de validation/refus des demandes d’inscription.

### Admin dashboard

- Titre harmonisé vers “Pilotage Metableton”.
- Wording plus orienté produit.

### Admin courses

- Icône harmonisée.
- Lien de retour renommé vers “Retour au pilotage”.

### ClassroomConnectButton

- Textes de connexion Classroom clarifiés.
- Empty states rendus plus pédagogiques.
- Aucun changement d’endpoint OAuth.

## Limites volontaires

- Pas de refonte globale des dashboards.
- Pas de modification backend.
- Pas de modification Supabase.
- Pas de modification Google OAuth ou Classroom OAuth.
- Pas de modification de la logique enrollment.
- Pas d’ajout de dépendance.

## Vérifications

A valider avant commit :

- npm --prefix client run build
- npm --prefix server test

## Critères d’acceptation

- Build frontend OK.
- Tests backend OK.
- Diff limité aux dashboards et au bouton Classroom.
- Aucun fichier BMAD ou design parasite dans le commit.
- Aucun changement de logique métier.
