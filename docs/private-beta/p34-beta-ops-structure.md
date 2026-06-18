# P-34 — Structure opérationnelle de la bêta privée

> **Version**: 2026-06-18
> **Tags**: `private-beta`, `ops`, `google-forms`

---

## Objectif

Avoir une bêta privée **simple à piloter** avec :

1. une petite cohorte bien choisie
2. un parcours de test court
3. un formulaire principal facile à remplir
4. un canal séparé pour les bugs détaillés
5. un rituel de triage rapide

> **Principe** : moins de complexité pour les testeurs, plus de structure pour l'équipe.

---

## Structure recommandée

### Taille de cohorte

- **3 testeurs pour le premier batch**
- **5 testeurs maximum** avant une seconde itération

### Profils à couvrir

| Profil | Nombre | Ce qu'on veut apprendre |
|---|---|---|
| Élève / musicien | 1 | Compréhension de l'offre, clarté du parcours d'inscription |
| Enseignant | 1 | Utilité du dashboard, workflow d'approbation |
| Admin / responsable pédagogique | 1 | Lisibilité du pilotage et crédibilité du produit |
| Optionnel : partenaire école | 0-1 | Perception produit / potentiel business |
| Optionnel : non-tech | 0-1 | Clarté générale sans contexte |

---

## Ce que chaque testeur reçoit

Chaque testeur doit recevoir seulement **4 éléments** :

1. le lien de la bêta
2. un message d'onboarding adapté à son profil
3. une checklist courte
4. un lien vers le **formulaire principal**

Le document sur les limitations connues peut être joint si besoin, mais il ne doit pas devenir une lecture obligatoire trop lourde.

---

## Flux recommandé

### Phase 1 — Préparation

- Vérifier les comptes et rôles de test
- Vérifier les pages critiques : home, catalog, login, dashboard, classroom
- Préparer la cohorte dans `p32-beta-cohort.md`
- Créer les deux formulaires Google

### Phase 2 — Invitation

- Envoyer un message d'invitation ciblé
- Noter qui a accepté
- Assigner un rôle de test clair à chaque personne

### Phase 3 — Test

- Demander un test de **10 à 15 minutes**
- Laisser le testeur finir sans trop guider
- Faire remplir le **formulaire principal**
- Si un bug important est vu, envoyer aussi le **formulaire bug**

### Phase 4 — Centralisation

- Exporter ou relire les réponses Google Forms
- Copier les points utiles dans `p30-feedback-triage-board.md`
- Créer des IDs `FB-001`, `FB-002`, etc.

### Phase 5 — Triage

- Regrouper les doublons
- Classer : bug / UX / contenu / feature
- Prioriser : P0 à P3
- Transformer les P0/P1 en tickets

### Phase 6 — Décision

- Remplir `p30-post-beta-decision-log.md`
- Décider : continuer, corriger, relancer une bêta 2, ou repositionner

---

## Source de vérité

Pour éviter la dispersion, utiliser ces rôles :

| Besoin | Document source |
|---|---|
| Plan global | `p29-private-beta-plan.md` |
| Cohorte et avancement | `p32-beta-cohort.md` |
| Message d'invitation | `p31-private-beta-invitations.md` |
| Onboarding | `p31-beta-onboarding-message.md` |
| Checklist testeur | `p29-beta-test-checklist.md` |
| Réponses testeurs | Google Forms |
| Triage équipe | `p30-feedback-triage-board.md` |
| Décision finale | `p30-post-beta-decision-log.md` |

---

## Formulaires à utiliser

### Formulaire 1 — Feedback principal

Usage :
- obligatoire pour tous les testeurs
- court
- centré sur compréhension, utilité, friction, priorité

### Formulaire 2 — Signalement de bug

Usage :
- seulement si le testeur rencontre un vrai bug
- plus détaillé
- orienté reproduction

> **Important** : ne pas mélanger tout dans un seul formulaire trop long. Sinon les testeurs abandonnent ou répondent mal.

---

## KPI minimaux à suivre

| KPI | Cible |
|---|---|
| Taux de réponse au formulaire principal | > 80% |
| Testeurs qui comprennent le concept | 4/5 |
| Testeurs qui voient une utilité | 3/5 |
| Bugs P0 | 0 |
| Bugs P1 | <= 2 |
| Frictions UX récurrentes | <= 3 |

---

## Cadence simple sur 7 jours

| Jour | Action |
|---|---|
| J0 | Préparer cohorte, comptes, formulaires |
| J1 | Envoyer invitations |
| J2-J4 | Tests + relances douces |
| J5 | Centraliser et trier |
| J6 | Décider les actions |
| J7 | Répondre aux testeurs et lancer les corrections |

---

## Recommandation pratique

Si tu veux aller vite, le plus simple est :

1. lancer avec **3 testeurs**
2. utiliser **1 formulaire principal + 1 formulaire bug**
3. faire un triage unique en fin de batch
4. corriger les P0/P1
5. seulement ensuite élargir à 5-10 personnes

---

## Liens utiles

- Checklist : `p29-beta-test-checklist.md`
- Formulaire source actuel : `p29-feedback-form.md`
- Intake / triage : `p30-feedback-intake.md`
- Cohorte : `p32-beta-cohort.md`

---

**Fin du document.**
