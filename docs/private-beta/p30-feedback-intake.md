# P-30 — Beta Feedback Intake

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Objectif

Créer un système **simple et actionnable** pour :

1. Collecter les retours des testeurs
2. Classer chaque retour (bug / UX / feature / etc.)
3. Prioriser les actions à prendre
4. Transformer les retours en tickets exploitables
5. Prendre des décisions claires après la bêta

> **Philosophie** : Un système léger qui ne prend pas plus de temps que le feedback lui-même.

---

## Où collecter les retours

| Canal | Usage | Priorité |
|-------|-------|----------|
| **Google Form** | Formulaire structuré pour tous les testeurs | Haute |
| **Slack / Discord** | Discussion rapide, questions | Moyenne |
| **Email** | Feedback formel, détails techniques | Faible |
| **Note partagée** | Notes rapides, brainstorming | Faible |

### Recommandation

Utiliser **Google Forms** comme canal principal :

- URL : `https://forms.gle/metableton-feedback`
- Formulaire basé sur `p29-feedback-form.md`
- Réponse directement dans ce document

> **Pourquoi Google Forms** : Pas de setup, interface simple pour testeurs, export CSV facile.

---

## Méthode recommandée

### Workflow de traitement (en 6 étapes)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Recevoir le retour (form, email, slack)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Copier dans le triage board (p30-feedback-triage-board)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Identifier : type, priorité, sévérité, zone              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Décider : bug / amélioration / feature / ignore          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Créer un ticket (p30-beta-issue-template) si nécessaire  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Documenter la décision (p30-post-beta-decision-log)      │
└───────────────────────────────────────────────────────────────┘
```

### Temps estimé par retour

| Étape | Temps |
|-------|-------|
| Copier dans le board | 2 min |
| Identifier type/priorité | 3 min |
| Décider | 1 min |
| Créer ticket si nécessaire | 5 min |
| **Total** | **11 min** |

> **Conseil** : Faire le triage en une session de 30-45 min après collecte.

---

## Format brut d'un retour

### Format minimal (à collecter)

```
Testeur: [prénom ou pseudonyme]
Rôle: [étudiant / enseignant / admin / musicien]
Date: [YYYY-MM-DD]
Type: [bug / UX / feature / content]
Zone: [home / catalog / dashboard / classroom]
Retour: [le feedback complet]
```

### Exemple de retour brut

```
Testeur: Thomas
Rôle: enseignant
Date: 2026-06-17
Type: UX
Zone: dashboard-teacher
Retour: "J'ai cliqué sur 'Approuver' et la demande est restée en attente pendant 5 secondes. J'ai cru que ça ne fonctionnait pas. Faut-il un spinner ou un message 'Traitement en cours' ?"
```

---

## Catégories de retours

| Catégorie | Description | Exemple |
|-----------|-------------|---------|
| **Bug** | Comportement incorrect ou cassé | "Le bouton ne répond pas", "Erreur 500" |
| **UX confusion** | Incompréhension de l'interface | "Je ne savais pas quoi faire ici", "Le bouton est discret" |
| **Design polish** | Amélioration visuelle / ergonomique | "Le texte est trop petit", "Trop de blanc" |
| **Content issue** | Problème de texte / copywriting | "Ce mot n'est pas clair", "Faute d'orthographe" |
| **Feature request** | Fonctionnalité manquante | "Je voudrais pouvoir exporter en CSV" |
| **Classroom issue** | Problème avec Google Classroom | "Le lien Classroom ne s'affiche pas" |
| **Auth issue** | Problème d'authentification | "Login Google ne fonctionne pas" |
| **Enrollment issue** | Problème d'inscription | "Impossible de demander l'inscription" |
| **Performance** | Lenteur ou mauvaise performance | "Chargement trop long", "Interface gelée" |
| **Security/privacy** | Problème de sécurité / confidentialité | "Je vois mes données d'autres utilisateurs" |
| **Out of scope** | hors scope de la bêta MVP | "Je voudrais un mode sombre" |

> **Conseil** : Une même feedback peut être classée en 2 catégories (ex: "Bug UX").

---

## Niveaux de priorité

| Priorité | Nom | Définition | Temps de réponse |
|----------|-----|------------|------------------|
| **P0** | Bloquant | Incapacité à utiliser le produit | Immédiat |
| **P1** | Important | Empêche l'usage ou dégrade fortement | < 24h |
| **P2** | Utile | Améliore l'expérience, pas critique | < 1 semaine |
| **P3** | Plus tard | Nice to have, pas urgent | Bêta 2+ |

### Guide de décision

```
┌─────────────────────────────────────────────────────────────┐
│ P0 Bloquant ?                                               │
│   - Produit ne charge pas ?                                 │
│   - Login impossible ?                                      │
│   - Fonctionnalité essentielle cassée ?                     │
│   → Priorité 0, action immédiate                            │
└─────────────────────────────────────────────────────────────┘
                              │ non
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ P1 Important ?                                              │
│   - Détérioration forte UX ?                                │
│   - Feedback de plusieurs testeurs ?                        │
│   - Empêche démo / lancement ?                              │
│   → Priorité 1, action rapide                              │
└─────────────────────────────────────────────────────────────┘
                              │ non
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ P2 Utile ?                                                  │
│   - Amélioration claire ?                                   │
│   - 1 testeur l'a demandé ?                                 │
│   - Facile à faire ?                                        │
│   → Priorité 2, planifier                                  │
└─────────────────────────────────────────────────────────────┘
                              │ non
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ P3 Plus tard ?                                              │
│   - Nice to have ?                                          │
│   - Pas urgent ?                                            │
│   → Priorité 3, bêta 2 ou plus tard                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Niveaux de sévérité

| Sévérité | Nom | Définition | Impact |
|----------|-----|------------|--------|
| **Critical** | Critique | Productivité 0%, données perdues, sécurité compromise | 10 |
| **High** | Élevé | Productivité fortement réduite, erreur fréquente | 7 |
| **Medium** | Moyen | Productivité légèrement réduite, annoyance | 4 |
| **Low** | Faible | Petit problème, cosmetic | 1 |

### Guide de décision

```
┌─────────────────────────────────────────────────────────────┐
│ Sévérité Critique ?                                         │
│   - Produit inutilisable ?                                  │
│   - Données perdues / corrompues ?                          │
│   - Fuite de sécurité ?                                     │
│   → Sévérité Critical                                      │
└─────────────────────────────────────────────────────────────┘
                              │ non
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Sévérité Élevée ?                                           │
│   - Erreur systématique ?                                   │
│   - Utilisateurs bloqués ?                                  │
│   - Message d'erreur fréquent ?                             │
│   → Sévérité High                                          │
└─────────────────────────────────────────────────────────────┘
                              │ non
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Sévérité Moyenne ?                                          │
│   - Annoyance occasionnelle ?                               │
│   - UX non optimale ?                                       │
│   → Sévérité Medium                                        │
└─────────────────────────────────────────────────────────────┘
                              │ non
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Sévérité Faible ?                                           │
│   - Petits détails ?                                        │
│   - Cosmetic ?                                              │
│   → Sévérité Low                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow de traitement

### Cas 1 : Bug simple

```
Feedback reçu → Copié dans board → Identifié comme Bug → 
Sévérité évaluée → Ticket créé → Priorité assignée → 
Fermé quand corrigé
```

**Temps total** : ~15 min

### Cas 2 : Incompréhension UX

```
Feedback reçu → Copié dans board → Identifié comme UX confusion → 
Analyse de l'interface → Décision (texte, design, workflow) → 
Ticket créé ou non → Documenté
```

**Temps total** : ~20 min (nécessite analyse)

### Cas 3 : Feature request

```
Feedback reçu → Copié dans board → Identifié comme Feature → 
Évaluation (scope, priorité, alignement MVP) → 
Décision (in MVP, report, out of scope) → 
Ticket créé ou documentation
```

**Temps total** : ~25 min (nécessite décision produit)

### Cas 4 : Retour hors scope

```
Feedback reçu → Copié dans board → Identifié comme Out of scope → 
Documentation "Feature future" → Archivé → Fermé
```

**Temps total** : ~5 min

---

## Règles de tri

### Règle 1 : Un retour, un ID

Chaque feedback reçoit un ID unique : `FB-001`, `FB-002`, etc.

```
FB-001 | 2026-06-17 | Thomas | enseignant | UX | dashboard-teacher | "Le bouton est discret..."
```

### Règle 2 : Classification obligatoire

Avant de traiter un feedback, classifier :
- Type : bug / UX / feature / content / performance / auth / enrollment / classroom / out of scope
- Zone : home / catalog / dashboard / classroom / auth / admin

### Règle 3 : Priorité = min(pour les testeurs, pour le projet)

Si plusieurs testeurs demandent la même chose → priorité augmente
Si un seul testeur demande une feature "nice to have" → priorité basse

### Règle 4 : Si impossible à reproduire, mettre en attente

```
FB-009 | 2026-06-17 | Jean | étudiant | Bug | dashboard | "Le dashboard ne charge pas"
Statut : Needs reproduction
Notes : "Veuillez essayer avec un autre navigateur"
```

---

## Ce qu'on ne doit pas faire

### ❌ À éviter

| Action | Raison |
|--------|--------|
| Ne pas trier les retours | Permettre l'oubli et le chaos |
| Classer tous les retours comme "High priority" | Dévaloriser les vrais bugs |
| Créer un ticket pour chaque petit feedback | Surcharge, perte de sens |
| Ignorer les retours "hors scope" | Frustration testeurs |
| Ne pas documenter les décisions | Perte de mémoire, discussions répétées |

### ✅ À faire

| Action | Raison |
|--------|--------|
| Classer chaque retour | Maintenir l'ordre, prioriser |
| Documenter les décisions | Mémoire, traçabilité |
| Fermer les tickets proprement | Progression visible |
| Réutiliser les ID dans les tickets | Traçabilité feedback → action |
| Répondre aux testeurs | Engagement, remerciement |

---

## Exemple de retour bien traité

### Feedback brut (reçu par email)

```
De: jean.dupont@example.com
Objet: Feedback bêta Metableton

Bonjour,

J'ai testé la bêta hier. Je suis enseignant de musique.

Le workflow est globalement clair, mais j'ai un doute sur la liaison avec Google Classroom.

Quand je clique sur "Connecter Google Classroom", je suis redirigé, mais je ne vois pas le lien apparaître dans mon dashboard.

Est-ce normal ? Est-ce que Classroom doit être lié manuellement par l'admin ?

Merci pour votre travail,
Jean
```

### Classification dans le triage board

| ID | Date | Testeur | Rôle | Type | Zone | Retour | Priorité | Sévérité | Statut | Ticket |
|---|---|---|---|---|---|---|---|---|---|---|
| FB-001 | 2026-06-17 | Jean | enseignant | UX | classroom | "Quand je clique sur Connecter Google Classroom, je ne vois pas le lien apparaître dans mon dashboard. Est-ce normal ?" | P1 | High | Confirmed | TKT-101 |

### Décision

| Date | Retour lié | Décision | Raison |
|---|---|---|---|
| 2026-06-17 | FB-001 | Créer ticket UX classroom link | Feedback important, plusieurs utilisateurs pourraient être bloqués ici |

### Ticket créé (p30-beta-issue-template)

```
# TKT-101 — UX Classroom Link non visible

## ID feedback source
FB-001

## Type
UX confusion

## Zone concernée
Classroom connection flow

## Problème
Après avoir cliqué sur "Connecter Google Classroom" et validé l'OAuth, l'utilisateur ne voit pas le lien Classroom apparaître dans son dashboard enseignant.

## Comportement attendu
Après OAuth validé, le bouton "Ouvrir Google Classroom" doit apparaître si un cours a un classroom_url.

## Comportement observé
Le bouton n'apparaît pas après OAuth. L'utilisateur doit rafraîchir la page pour le voir.

## Étapes pour reproduire
1. Se connecter en tant qu'enseignant
2. Cliquer sur "Connecter Google Classroom"
3. Valider l'OAuth
4. Retourner sur le dashboard

## Impact utilisateur
Bloquant pour l'utilisateur : il ne sait pas si Classroom est correctement lié ou non.

## Priorité
P1 - Important avant prochaine démo

## Sévérité
High

## Fichiers probablement concernés
- client/src/pages/dashboard/TeacherDashboardPage.jsx
- client/src/components/ClassroomConnectButton.jsx

## Contraintes
Ne pas modifier l'OAuth, juste améliorer la UI après connection.

## Vérifications à faire
- [ ] ClassroomLink s'affiche après OAuth sans refresh
- [ ] State "connected" est bien mis à jour après OAuth
- [ ] Test sur Chrome, Firefox, Safari

## Critères d'acceptation
- L'utilisateur voit le bouton "Ouvrir Google Classroom" immédiatement après OAuth
- Pas de refresh de page nécessaire
- Testé sur 3 navigateurs

## Notes
Peut être un problème de re-render du composant après update.
```

### Prompt Claude Code prêt à coller

```
Fixer le problème d'affichage du bouton "Ouvrir Google Classroom" après OAuth.

Problème : Après que l'enseignant connecte son compte Classroom, le bouton n'apparaît pas immédiatement dans le dashboard. Il faut rafraîchir la page.

Fichiers concernés :
- client/src/pages/dashboard/TeacherDashboardPage.jsx
- client/src/components/ClassroomConnectButton.jsx

Actions à faire :
1. Analyser le flux OAuth Classroom
2. Vérifier la mise à jour du state "connected" après OAuth
3. S'assurer que ClassroomConnectButton re-rend correctement
4. Ajouter un test si nécessaire

Critères d'acceptation :
- Le bouton s'affiche immédiatement après OAuth, sans refresh
- Testé sur Chrome, Firefox, Safari

Ne pas modifier :
- Le workflow OAuth lui-même
- Les dependances existantes
- Le design system

Faire une PR avec les modifications.
```

---

**Fin du guide d'intake.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
