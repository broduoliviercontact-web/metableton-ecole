# P-33 — Beta Feedback Triage Session

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Objectif

Transformer les retours de bêta en **décisions produit** et **tickets actionnables**.

Cette session doit durer 60-90 minutes après la collecte des retours.

> **Objectif final** : Avoir une liste priorisée de ce qu'on doit corriger/développer pour la prochaine étape.

---

## Quand lancer cette session

### Timing recommandé

| Jour | Action |
|---|---|
| Jour 1 | Invitations envoyées |
| Jour 2-4 | Tests individuels |
| **Jour 5** | **Session de triage** |
| Jour 6-7 | Décisions et planification |

### Conditions préalables

- [ ] Tous les feedbacks ont été collectés (ou deadline passée)
- [ ] Tableau triage `p30-feedback-triage-board.md` créé
- [ ] Template tickets `p30-beta-issue-template.md` accessible
- [ ] Decision log `p30-post-beta-decision-log.md` prêt

---

## Préparation

### À faire avant la session (15 min)

| Tâche | Responsable | Temps |
|---|---|---|
| Copier tous les feedbacks dans `p30-feedback-triage-board.md` | Product / PO | 10 min |
| Vérifier que chaque feedback a un ID | Product / PO | 5 min |

### À préparer

- [ ] Tableau `p30-feedback-triage-board.md` ouvert
- [ ] Template `p30-beta-issue-template.md` ouvert
- [ ] Document `p30-post-beta-decision-log.md` ouvert
- [ ] Liste des retours (Google Form, Slack, etc.)
- [ ] Accès au repository GitHub
- [ ] Accès à Claude Code (pour créer les tickets)

---

## Inputs nécessaires

### Sources de feedback

- Google Form (export CSV ou direct)
- Messages Slack / Discord
- Emails de retour
- Notes prises pendant les appels

### Ce qu'on doit avoir

- [ ] Liste des retours avec ID (FB-001, FB-002, etc.)
- [ ] Profil de chaque testeur (étudiant / prof / admin)
- [ ] Zone concernée (home / catalog / dashboard / classroom)
- [ ] Type de feedback (bug / UX / feature / etc.)

---

## Étape 1 — Centraliser les retours

### Action

Copier chaque feedback dans le tableau `p30-feedback-triage-board.md` dans la section **Inbox**.

### Format

| ID | Date | Testeur | Rôle | Type | Zone | Retour brut | Priorité | Sévérité | Statut | Ticket |
|---|---|---|---|---|---|---|---|---|---|---|

### Exemple

| FB-001 | 2026-06-17 | Jean | enseignant | UX | classroom | "Le bouton Classroom ne s'affiche pas immédiatement après OAuth" | P1 | High | New | TKT-101 |

---

## Étape 2 — Nettoyer les doublons

### Action

Regrouper les feedbacks similaires.

### Méthode

- Si 2 feedbacks sont identiques → ne garder qu'un ID, mettre les autres comme "doublon"
- Si 2 feedbacks sont similaires mais pas identiques → fusionner, garder les deux IDs

### Exemple

```
FB-001 et FB-007 sont identiques → FB-007 est un doublon de FB-001
FB-002 et FB-005 sont similaires → fusionner en FB-002, mentionner FB-005
```

---

## Étape 3 — Classer les retours

### Action

Pour chaque feedback, identifier :

- **Type** : bug / UX / feature / content / performance / auth / enrollment / classroom / out of scope
- **Zone** : home / catalog / dashboard / classroom / auth / admin

### Règles de classification

| Type | Définition |
|---|---|
| Bug | Comportement incorrect ou cassé |
| UX | Incompréhension de l'interface |
| Feature | Demande de nouvelle fonctionnalité |
| Content | Problème de texte / copywriting |
| Performance | Lenteur ou mauvaise performance |
| Auth | Problème d'authentification |
| Enrollment | Problème d'inscription |
| Classroom | Problème avec Google Classroom |
| Out of scope | Hors scope MVP |

---

## Étape 4 — Prioriser

### Action

Attribuer une **priorité** (P0-P3) et une **sévérité** (Critical-High-Medium-Low) à chaque feedback.

### Priorité

| Priorité | Définition | Action |
|---|---|---|
| P0 | Bloquant | Action immédiate |
| P1 | Important | Action avant prochaine démo |
| P2 | Utile | Action pour bêta 2 |
| P3 | Plus tard | Action après V1 |

### Sévérité

| Sévérité | Définition | Impact |
|---|---|---|
| Critical | Productivité 0%, données perdues, sécurité | 10 |
| High | Productivité fortement réduite | 7 |
| Medium | Productivité légèrement réduite | 4 |
| Low | Petit problème, cosmetic | 1 |

---

## Étape 5 — Décider

### Action

Pour chaque feedback, décider :

- **Corriger maintenant** → P0 / P1, créer ticket
- **Reporter** → P2 / P3, mettre dans backlog
- **Ignorer** → Out of scope, documenter
- **Approfondir** → Besoin de plus d'info, demander précision

### Guide de décision

```
┌─────────────────────────────────────────────────────────────┐
│ P0 ou P1 ?                                                  │
│   Oui → Créer ticket, actionner Claude Code                 │
│   Non → Passer à la suite                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Out of scope ?                                              │
│   Oui → Documenter, marquer Won't fix                       │
│   Non → Passer à la suite                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Besoin d'info ?                                             │
│   Oui → Demander précision, marquer Needs reproduction      │
│   Non → Finir                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Étape 6 — Créer les tickets

### Action

Pour chaque feedback validé, créer un ticket dans GitHub en utilisant le template `p30-beta-issue-template.md`.

### Méthode

1. Copier le template
2. Remplir avec les détails du feedback
3. Créer le ticket sur GitHub
4. Mettre à jour le tableau triage avec le ticket ID
5. Mettre à jour le statut (Converted to ticket)

### Exemple

| ID | Date | Testeur | Rôle | Type | Zone | Retour brut | Priorité | Sévérité | Statut | Ticket |
|---|---|---|---|---|---|---|---|---|---|---|
| FB-001 | 2026-06-17 | Jean | enseignant | UX | classroom | "Le bouton Classroom ne s'affiche pas..." | P1 | High | Done | TKT-101 |

---

## Étape 7 — Mettre à jour le decision log

### Action

Remplir `p30-post-beta-decision-log.md` avec :

- Résumé de la bêta
- Retours collectés
- Bugs critiques
- Features les plus demandées
- Décision produit (Go Live / Improve / Pivot)

---

## Règles de décision

### Règle 1 : Un feedback, un ID

Chaque feedback garde son ID unique. Ne pas créer de sous-ID.

### Règle 2 : Priorité = min(pour les testeurs, pour le projet)

Si plusieurs testeurs demandent la même chose → priorité augmente
Si un seul testeur demande une feature "nice to have" → priorité basse

### Règle 3 : Si impossible à reproduire, mettre en attente

```
Statut : Needs reproduction
Notes : "Veuillez essayer avec un autre navigateur"
```

### Règle 4 : Tous les P0 et P1 doivent avoir un ticket

Les P2 et P3 peuvent être reportés sans ticket (backlog future).

---

## Ce qu'il ne faut pas faire

| Action | Raison |
|---|---|
| Ne pas trier les retours | Permettre l'oubli et le chaos |
| Classer tous les retours comme "High priority" | Dévaloriser les vrais bugs |
| Créer un ticket pour chaque petit feedback | Surcharge, perte de sens |
| Ignorer les retours "hors scope" | Frustration testeurs |
| Ne pas documenter les décisions | Perte de mémoire, discussions répétées |
| Modifier le code pendant la triage | Introduction de bugs, perte de focus |

---

## Résultat attendu de la session

### Livrables

- [ ] Tableau `p30-feedback-triage-board.md` complet et trié
- [ ] Tickets GitHub créés pour P0 / P1
- [ ] Backlog `p33-priority-ticket-backlog.md` rempli
- [ ] Decision log `p30-post-beta-decision-log.md` rempli
- [ ] Plan de travail pour la prochaine étape

### KPIs de la session

| KPI | Cible |
|---|---|
| Feedbacks triés | 100% |
| Décisions prises | 100% |
| Tickets créés (P0/P1) | ≥1 |
| Décisions documentées | 100% |

---

## Checklist finale

- [ ] Tous les feedbacks sont dans le tableau
- [ ] Doublons nettoyés
- [ ] Chaque feedback a un type et une zone
- [ ] Priorité attribuée (P0-P3)
- [ ] Sévérité attribuée (Critical-High-Medium-Low)
- [ ] Décision prise (corriger / reporter / ignorer / approfondir)
- [ ] Tickets créés pour P0 / P1
- [ ] Backlog rempli
- [ ] Decision log rempli

---

**Fin de la session de triage.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*

---

*Note : Cette session est à faire en une fois, avec le produit en main pour tester les corrections potentielles.*
