# P-30 — Beta Issue Template

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Instructions

Ce template est à utiliser pour créer des tickets à partir des retours de bêta.

**Avant de créer un ticket** :
1. Classer le feedback dans `p30-feedback-triage-board.md`
2. Identifier type, priorité, sévérité
3. Vérifier que le ticket est nécessaire (pas une simple amélioration)

**After creating a ticket** :
1. Link to feedback ID in triage board
2. Update triage board statut
3. Assign to sprint / milestone

---

## Structure du ticket

```
# TKT-### — [Titre synthétique]

## ID feedback source
[FB-XXX]

## Type
[bug / ux / feature / content / performance / auth / enrollment / classroom]

## Zone concernée
[home / catalog / dashboard / classroom / auth / admin]

## Problème
[description concise du problème]

## Comportement attendu
[ce qui devrait se passer]

## Comportement observé
[ce qui se passe réellement]

## Étapes pour reproduire
1. 
2. 
3. 

## Impact utilisateur
[quel impact sur l'utilisateur]

## Priorité
[P0 / P1 / P2 / P3]

## Sévérité
[Critical / High / Medium / Low]

## Fichiers probablement concernés
- 
- 

## Contraintes
[ce qu'on ne doit pas modifier]

## Vérifications à faire
- [ ]
- [ ]
- [ ]

## Critères d'acceptation
- [ ] 
- [ ] 
- [ ] 

## Notes
[informations supplémentaires]
```

---

## Prompt Claude Code prêt à coller

Si le ticket nécessite un développement :

```
[Title]

[Description du problème]

Fichiers concernés :
- client/src/xxx
- server/src/yyy

Actions à faire :
1. 
2. 
3. 

Critères d'acceptation :
- [ ]
- [ ]
- [ ]

Ne pas modifier :
- 
- 
- 
```

---

## Exemple complet

### Ticket créé à partir de FB-001

```
# TKT-101 — UX Classroom Link non visible après OAuth

## ID feedback source
FB-001

## Type
UX

## Zone concernée
classroom

## Problème
Après avoir connecté son compte Google Classroom, l'enseignant ne voit pas le bouton "Ouvrir Google Classroom" dans son dashboard. Il doit rafraîchir la page pour le voir.

## Comportement attendu
Le bouton "Ouvrir Google Classroom" s'affiche immédiatement après la connection OAuth.

## Comportement observé
Le bouton n'apparaît pas. L'utilisateur doit rafraîchir la page manuellement.

## Étapes pour reproduire
1. Se connecter en tant qu'enseignant
2. Cliquer sur "Connecter Google Classroom"
3. Valider l'OAuth
4. Retourner sur le dashboard

## Impact utilisateur
Medium - L'utilisateur doute de la configuration de Classroom, risque de faire une demande d'aide inutile.

## Priorité
P1 - Important avant prochaine démo

## Sévérité
High

## Fichiers probablement concernés
- client/src/pages/dashboard/TeacherDashboardPage.jsx
- client/src/components/ClassroomConnectButton.jsx

## Contraintes
- Ne pas modifier le workflow OAuth
- Ne pas modifier le design system
- Garder la structure des composants

## Vérifications à faire
- [ ] classroom_url est bien enregistré après OAuth
- [ ] ClassroomConnectButton re-rend correctement
- [ ] Pas de décalage de state

## Critères d'acceptation
- [ ] Le bouton s'affiche immédiatement après OAuth, sans refresh
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Pas de console error

## Notes
Peut être un problème de re-render du composant après update. Vérifier l'état "connected" de ClassroomConnectButton.
```

### Prompt Claude Code correspondant

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

## Checklist avant de créer un ticket

- [ ] Le feedback a été classification dans le triage board
- [ ] Le type est clairement identifié
- [ ] La priorité est justifiée
- [ ] La sévérité est correctement évaluée
- [ ] Le ticket n'est pas redondant (pas déjà ouvert)
- [ ] L'impact utilisateur est clair
- [ ] Les étapes de reproduction sont précises

---

## Guide de priorisation

### P0 - Bloquant

Créer le ticket **immédiatement**, assigner最高 priority.

**Critères** :
- Produit inutilisable
- Données perdues / corrompues
- Fuite de sécurité
- Erreur systématique bloquante

### P1 - Important

Créer le ticket **avant prochaine démo**, assigner haute priorité.

**Critères** :
- Détérioration forte UX
- Feedback de plusieurs testeurs
- Empêche démo / lancement

### P2 - Utile

Créer le ticket **pour bêta 2**, priorité moyenne.

**Critères** :
- Amélioration claire
- 1-2 testeurs l'ont demandé
- Facile à faire

### P3 - Plus tard

Documenter, **ne pas créer de ticket** (ou marquer "Future" dans titre).

**Critères** :
- Nice to have
- Pas urgent
- A aligner avec roadmap V1

---

## Guide de sévérité

### Critical

Créer le ticket **immédiatement**, correction urgente.

**Critères** :
- Productivité 0%
- Données perdues
- Sécurité compromise

### High

Créer le ticket **rapide**, correction dans 24h.

**Critères** :
- Productivité fortement réduite
- Erreur fréquente
- Message d'erreur système

### Medium

Créer le ticket **normal**, correction dans semaine.

**Critères** :
- Productivité légèrement réduite
- Annoyance occasionnelle

### Low

Créer le ticket **facultatif**, correction optionnelle.

**Critères** :
- Petit problème
- Cosmetic
- Pas gênant

---

**Fin du template.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
