# P-32 — Beta Cohort Setup

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Objectif

Organiser une bêta privée avec **3 à 5 testeurs maximum** pour valider le concept de Metableton École avant un lancement public.

Ce document sert de **pilote** pour :
- Suivre qui a été invité
- Traquer l'avancement de chaque testeur
- Documenter les retours
- Décider de la suite à donner

> **Important** : C'est une bêta **fermée**. Pas de lancement public. Pas de promesse de produit final.

---

## Taille recommandée de la cohorte

| Taille | Avantage | Désavantage |
|---|---|---|
| 2 personnes | Très rapide à gérer | Moins de variété de feedbacks |
| 3 personnes | Équilibre idéal | Besoin de diversité |
| 4 personnes | Bonne couverture | Gestion un peu plus lourde |
| 5 personnes | Couverture complète | Temps de gestion significatif |

### Recommandation

**Commencer avec 3 personnes** :
- 1 élève / musicien
- 1 professeur
- 1 admin / responsable pédagogique

Si les retours sont riches, passer à 4-5 personnes.

---

## Profils à couvrir

| Profil | Rôle testé | Objectif | Nombre |
|---|---|---|---|
| Élève / musicien / producteur | Student | Comprendre catalogue + demande d'accès | 1 |
| Professeur / formateur MAO | Teacher | Tester demandes d'inscription + Classroom | 1 |
| Responsable pédagogique | Admin | Comprendre pilotage + potentiel école | 1 |
| Partenaire école / organisme | Admin | Évaluer crédibilité du produit | 0-1 |
| Utilisateur non technique | Any | Tester clarté sans expertise | 0-1 |

**Total recommandé** : 3 à 5 personnes

---

## Cohorte recommandée

| ID | Nom | Profil | Rôle testé | Objectif du test | Statut |
|---|---|---|---|---|---|
| BETA-01 | [À définir] | Élève / musicien | Student | Comprendre catalogue + demande d'accès | À inviter |
| BETA-02 | [À définir] | Prof / formateur | Teacher | Tester demandes d'inscription + Classroom | À inviter |
| BETA-03 | [À définir] | Responsable pédagogique | Admin | Comprendre pilotage + potentiel école | À inviter |
| BETA-04 | [À définir] | Partenaire école | Admin | Évaluer crédibilité du produit | À inviter |
| BETA-05 | [À définir] | Utilisateur non technique | Any | Tester clarté sans expertise | À inviter |

> **Note** : Remplir ce tableau avec les vrais testeurs quand ils sont identifiés.

---

## Tableau de suivi

| ID | Nom | Profil | Rôle testé | Objectif du test | Message à envoyer | Statut | Date invitation | Date test | Feedback reçu | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| BETA-01 | À définir | Élève / musicien | Student | Comprendre catalogue + demande d'accès | WhatsApp étudiant | À inviter |  |  | Non |  |
| BETA-02 | À définir | Prof / formateur | Teacher | Tester demandes d'inscription + Classroom | Email professeur | À inviter |  |  | Non |  |
| BETA-03 | À définir | Responsable pédagogique | Admin | Comprendre pilotage + potentiel école | Email partenaire | À inviter |  |  | Non |  |
| BETA-04 | À définir | Partenaire école | Admin | Évaluer crédibilité du produit | Email partenaire | À inviter |  |  | Non |  |
| BETA-05 | À définir | Utilisateur non technique | Any | Tester clarté sans expertise | WhatsApp étudiant | À inviter |  |  | Non |  |

### Statuts possibles

| Statut | Description |
|---|---|
| À inviter | Pas encore contacté |
| Invité | Message envoyé, en attente réponse |
| A accepté | Testeur accepté de tester |
| Test planifié | Date de test fixée |
| Test effectué | Testeur a testé |
| Feedback reçu | Retours collectés |
| Relance nécessaire | Relance à envoyer |
| Terminé | Bêta terminée pour ce testeur |

---

## Scénarios de test par profil

### Student

**Objectif** : Comprendre le parcours complet "visiteur → inscription → accès"

1. Home page → Comprendre ce que c'est
2. Catalogue → Voir les cours
3. Login → Se connecter avec Google
4. Dashboard → Voir ses inscriptions
5. Demander l'accès à un cours
6. Comprendre les statuts (pending / approved / rejected)
7. Comprendre le rôle de Google Classroom

**Questions à se poser** :
- Est-ce que le workflow est clair ?
- Est-ce que je voudrais m'inscrire ?
- Google Classroom est-il perçu comme un avantage ?

---

### Teacher

**Objectif** : Tester le workflow de validation et la gestion Classroom

1. Login → Se connecter avec Google
2. Dashboard → Voir ses cours
3. Section "Demandes d'inscription" → Voir les demandes
4. Approuver une demande → Workflow
5. Refuser une demande → Workflow
6. Lien Classroom → Comprendre la liaison

**Questions à se poser** :
- Est-ce que je peux gérer mes élèves ?
- Le workflow d'inscription est-il clair ?
- Classroom est-il utile ou contraignant ?

---

### Admin / Responsable pédagogique

**Objectif** : Comprendre la gouvernance globale de la plateforme

1. Login → Se connecter avec Google
2. Dashboard admin → Voir les utilisateurs
3. Changer un rôle → Workflow
4. Cours de la plateforme → Vue d'ensemble
5. Stats → Comprendre les indicateurs

**Questions à se poser** :
- Est-ce que je peux gérer une école avec ça ?
- Les outils sont-ils suffisants ?
- Qu'est-ce qui manque pour la V1 ?

---

### Partenaire / École

**Objectif** : Évaluer la crédibilité et le positionnement produit

1. Home page → Comprendre l'offre
2. Catalogue → Évaluer la qualité
3. Login → Vérifier la simplicité
4. Dashboard → Évaluer la clarté
5. Classroom → Comprendre le positionnement

**Questions à se poser** :
- Est-ce que je dirais que c'est un produit sérieux ?
- Est-ce que ça correspond à mon besoin ?
- Qu'est-ce qui me manque ?

---

## Messages à utiliser

### Profils

| Profil | Message d'invitation | Message d'onboarding | Message de relance |
|---|---|---|---|
| Élève / musicien | WhatsApp étudiant | Onboarding étudiant | Follow-up doux |
| Professeur | Email professeur | Onboarding professeur | Follow-up doux |
| Partenaire / admin | Email partenaire | Onboarding admin | Follow-up doux |
| Utilisateur non technique | WhatsApp étudiant | Onboarding étudiant | Follow-up doux |

### Fichiers de référence

- **Invitations** : `docs/private-beta/p31-private-beta-invitations.md`
- **Onboarding** : `docs/private-beta/p31-beta-onboarding-message.md`
- **Follow-up** : `docs/private-beta/p31-beta-follow-up-message.md`

---

## Planning recommandé

### Jour 0 — Préparation

- [ ] Choisir 3 testeurs (minimum)
- [ ] Vérifier la plateforme (vercel, /api/health, /catalog)
- [ ] Vérifier les comptes de test (admin / teacher / student)
- [ ] Documenter le plan dans ce document
- [ ] Préciser les messages à envoyer

### Jour 1 — Invitations

- [ ] Envoyer messages d'invitation
- [ ] Noter les réceptions / refus
- [ ] Planifier relances si nécessaire

### Jour 2-4 — Tests individuels

- [ ] Testeurs testent selon leur rôle
- [ ] Recueillir feedbacks
- [ ] Mettre à jour le tableau de suivi
- [ ] Répondre aux questions

### Jour 5 — Tri des retours

- [ ] Copier les retours dans `p30-feedback-triage-board.md`
- [ ] Classifier (bug / UX / feature / etc.)
- [ ] Évaluer priorité et sévérité
- [ ] Décider des actions à entreprendre

### Jour 6-7 — Décision

- [ ] Analyser les retours
- [ ] Décider : Go Live / Improve / Pivot / Pause
- [ ] Documenter dans `p30-post-beta-decision-log.md`
- [ ] Planifier prochaine étape

---

## Critères de réussite

### Critères minimums

| Critère | Threshold | Commentaire |
|---|---|---|
| Testeurs actifs | ≥3 | Minimum pour significativité |
| Rôle student | ≥1 | Workflow inscription validé |
| Rôle teacher | ≥1 | Workflow validation validé |
| Rôle admin | ≥1 | Gouvernance validée |
| Bugs critiques | 0 | Aucun bloquant |
| Feedbacks utiles | ≥5 | suffisant pour décision |

### Score de satisfaction

```
Satisfaction = (Testeurs satisfaits / Total testeurs) × 100

Si ≥80% → Go Live possible
Si 60-80% → Improve avant relance
Si <60% → Pivot ou Pause
```

---

## Critères d'arrêt

### Arrêter ou suspendre si :

| Critère | Action |
|---|---|
| Login Google casse | Suspendre, corriger |
| Dashboard inaccessible | Suspendre, corriger |
| Enrollment flow cassé | Suspendre, corriger |
| Bug de sécurité | Arrêter, corriger |
| Classroom crée confusion majeure | Analyser, décider |
| Produit incompréhensible sans explication | Pivoter |

### Note sur les bugs

- **Bugs mineurs** : Documenter, corriger après bêta
- **Bugs moyens** : Corriger pendant bêta
- **Bugs majeurs** : Arrêter, corriger

---

## Notes privées

> **Important** : Ce document est à garder privé. Ne pas share avec les testeurs.

- Les invitations sont à envoyer un par un (personnaliser)
- Les feedbacks sont à recueillir avant triage
- Les décisions sont à documenter dans `p30-post-beta-decision-log.md`
- Le repo git est public → ne pas mettre d'infos sensibles

### À éviter dans ce document

- Emails personnels
- Numéros de téléphone
- Tokens / clés API
- Comptes Google
- Informations sensibles

### Utiliser plutôt

- "Testeur 1", "Testeur 2", etc.
- "Prof MAO", "Responsable pédagogique"
- "Élève testeur", "Musicien producteur"
- "Partenaire école"

---

## Prochaine étape

Après avoir sélectionné les testeurs :

1. Remplir le tableau de suivi
2. Envoyer les invitations
3. Suivre l'avancement
4. Recueillir les feedbacks
5. Trier dans `p30-feedback-triage-board.md`
6. Décider la suite dans `p30-post-beta-decision-log.md`

### Checklist avant de lancer

- [ ] 3 testeurs sélectionnés
- [ ] Messages d'invitation préparés
- [ ] Plateforme vérifiée (vercel, /api/health, /catalog)
- [ ] Comptes de test disponibles
- [ ] Tableau de suivi prêt
- [ ] Planning défini

---

**Fin du setup de cohorte.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*

---

*Note : Ce document est à maintenir à jour pendant toute la durée de la bêta. Le mettre à jour à chaque étape importante.*
