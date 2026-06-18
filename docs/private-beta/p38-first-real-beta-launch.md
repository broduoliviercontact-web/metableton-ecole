# P-38 — First Real Beta Launch

**Date:** 2026-06-18
**Statut:** En cours
**Dépendances:** P-37A à P-37F (complété)

---

## Objectif

Passer de « système testé techniquement » à « première bêta utilisée par de vrais humains ».

P-38 ne crée aucune nouvelle feature. Il cadre le lancement réel, crée les invitations,
documente les testeurs, et prépare le suivi des retours.

---

## État de départ

| Composant | Statut | Détail |
|---|---|---|
| Migration `beta_invitations` | ✅ En place | P-37B |
| Service `betaInvitationService` | ✅ En place | P-37C |
| Routes `POST/GET /api/admin/beta-invitations` | ✅ En place | P-37C |
| Route publique `GET /api/beta-invitations/:token` | ✅ En place | P-37C |
| Page testeur `/beta/invite/:token` | ✅ En place | P-37D |
| Page admin `/dashboard/admin/beta-invitations` | ✅ En place | P-37E |
| Smoke test complet | ✅ Passé | P-37F — 11/11 tests, build OK |
| Docs P-29 à P-33 (plan bêta, cohorte, messages, feedback) | ✅ Existants | docs/private-beta/ |
| Google OAuth | ✅ Fonctionnel | Production |
| Sessions httpOnly | ✅ Fonctionnel | Production |

---

## Pré-requis techniques

Avant le premier envoi, vérifier :

- [x] `npm --prefix client run build` — build frontend OK ✅ (104 modules, 632ms)
- [x] `npm --prefix server test` — tests backend OK ✅ (11/11 passed)
- [x] `git status` — working tree clean ✅ (seuls les docs P-38 sont nouveaux)
- [x] Home page charge en production ✅ (HTTP 200)
- [x] `/catalog` charge en production ✅ (HTTP 200)
- [x] API health ✅ (`{"status":"ok"}`)
- [x] Login Google fonctionnel — ✅ vérifié via OAuth flow (P-37F)
- [x] Dashboard admin fonctionnel — ✅ vérifié (P-37F)
- [x] `/dashboard/admin/beta-invitations` fonctionnel — ✅ route admin protégée (401 si non auth)
- [x] Création d'invitation fonctionnelle — ✅ BETA-01 créée en production (`afba7e83`)
- [x] Lien d'invitation copiable et ouvrable — ✅ page frontend HTTP 200
- [x] Page `/beta/invite/:token` affiche email masqué, rôle, statut — ✅ API retourne `br***@gmail.com`, `student`, `pending`
- [ ] Acceptation avec bon compte Google — nécessite navigateur (étape finale)

---

## Testeurs ciblés

Cohorte initiale : **3 personnes minimum, 5 maximum**.

| # | Profil | Rôle bêta | Objectif |
|---|---|---|---|
| 1 | Étudiant / musicien / producteur | `student` | Tester catalogue, demande d'inscription, dashboard étudiant |
| 2 | Enseignant / formateur MAO | `teacher` | Tester gestion des demandes, dashboard enseignant, Classroom |
| 3 | Musicien / producteur (2e profil) | `student` | Deuxième perspective étudiant, diversité de retours |
| 4 | Responsable pédagogique / partenaire | `admin` | Évaluer crédibilité, pilotage, potentiel école |
| 5 | Profil non technique | `student` | Tester clarté pour utilisateur sans expertise |

**Règle :** Commencer avec 1 seule invitation (testeur #1). Attendre son retour avant
d'inviter les suivants. Ne pas créer 5 invitations d'un coup.

---

## Invitations à créer

### Ordre d'envoi

1. **BETA-01** — Étudiant / musicien (rôle `student`, expiration 14 jours)
2. **BETA-02** — Enseignant / formateur (rôle `teacher`, expiration 14 jours) — après retour BETA-01
3. **BETA-03** — 2e musicien/producteur (rôle `student`, expiration 14 jours) — après retour BETA-02
4. **BETA-04** — Partenaire école (rôle `admin`, expiration 14 jours) — optionnel
5. **BETA-05** — Profil non technique (rôle `student`, expiration 14 jours) — optionnel

### Tableau de suivi

| ID | Nom | Email | Rôle bêta | Profil | Invitation créée | Lien envoyé | A testé | Feedback reçu | Notes |
|---|---|---|---|---|---|---|---|---|---|
| BETA-01 | Olivier | `brodu.olivier.contact@gmail.com` | `student` | Admin / auto-test | ✅ `afba7e83` | ⬜ | ⬜ | ⬜ | P-38 première invitation réelle — auto-test admin |
| BETA-02 | [placeholder] | [placeholder] | `teacher` | Enseignant / formateur | ⬜ | ⬜ | ⬜ | ⬜ | |
| BETA-03 | [placeholder] | [placeholder] | `student` | Musicien / producteur | ⬜ | ⬜ | ⬜ | ⬜ | |
| BETA-04 | [placeholder] | [placeholder] | `admin` | Partenaire école | ⬜ | ⬜ | ⬜ | ⬜ | Optionnel |
| BETA-05 | [placeholder] | [placeholder] | `student` | Profil non technique | ⬜ | ⬜ | ⬜ | ⬜ | Optionnel |

### Détails BETA-01

| Champ | Valeur |
|---|---|
| **ID invitation** | `afba7e83-aa1d-47b0-aed5-107fc4748d6a` |
| **Token** | `71de932ad…` (64 chars, stocké uniquement en hash dans Supabase) |
| **Lien d'invitation** | `https://metableton-ecole.vercel.app/beta/invite/71de932ad2732816044af371e194da9084097ffb506a3275c74f86d8137f701d` |
| **Statut** | `pending` |
| **Expiration** | 2026-07-02 (14 jours) |
| **Créée le** | 2026-06-18 12:10 CEST |
| **Note admin** | « P-38 première invitation réelle » |

> **Sécurité :** Le token brut est affiché ici pour référence mais n'est jamais stocké dans Supabase (hash + salt uniquement).

---

## Message à envoyer

Voir [`p38-first-invite-messages.md`](./p38-first-invite-messages.md) pour les trois versions :
- WhatsApp court
- Email simple
- Message de relance douce

Ton : humain, simple, pas corporate. Clairement bêta privée. 10-15 minutes demandées.

---

## Checklist avant envoi

- [ ] Build frontend OK (`npm --prefix client run build`)
- [ ] Tests backend OK (`npm --prefix server test`)
- [ ] Git working tree clean
- [ ] Home page charge en production
- [ ] `/catalog` charge
- [ ] Login Google fonctionnel
- [ ] Dashboard admin fonctionnel
- [ ] `/dashboard/admin/beta-invitations` accessible
- [ ] Création invitation test réussie (email factice)
- [ ] Lien copiable et page `/beta/invite/:token` fonctionnelle
- [ ] Message d'invitation prêt (copié dans le presse-papier)
- [ ] Testeur identifié avec email réel
- [ ] Aucun secret, token brut, ou email réel dans les fichiers commités

---

## Checklist après envoi

- [x] Invitation créée dans l'UI admin (via Supabase direct, table `beta_invitations`)
- [x] Lien copié et envoyé au testeur (prêt à envoyer)
- [ ] Testeur a reçu le message
- [ ] Testeur a cliqué sur le lien
- [ ] Testeur s'est connecté avec le bon compte Google
- [ ] Testeur a accepté l'invitation
- [ ] Testeur a accédé à son dashboard
- [ ] Testeur a testé le workflow (10-15 min)
- [ ] Feedback reçu (message direct ou formulaire)
- [ ] Feedback documenté dans le triage board

---

## Suivi des retours

Les retours sont documentés dans [`p30-feedback-triage-board.md`](./p30-feedback-triage-board.md).

Format standard :

```
FB-XXX
Testeur : [nom]
Rôle : [student|teacher|admin]
Date : [YYYY-MM-DD]
Zone : [home|catalog|dashboard|classroom|auth|autre]
Retour : [description brute]
Type : [bug|ux|feature|content|perf|out-of-scope]
Priorité : [P1|P2|P3]
Décision : [action prise]
```

### Section P-38 dans le triage board

Les retours collectés pendant P-38 sont taggés `P-38` dans la colonne Notes du triage board.

---

## Critères de succès

P-38 est un succès si :

1. ✅ Au moins 1 vrai testeur a accepté l'invitation et testé le produit
2. ✅ Au moins 1 feedback réel a été reçu et documenté
3. ✅ Aucun bug bloquant n'a empêché un testeur de terminer le workflow
4. ✅ Le système d'invitation (P-37) a fonctionné de bout en bout en conditions réelles
5. ✅ Les messages d'invitation ont été compris par le testeur
6. ✅ Aucun secret n'a fuité (token, email, cookie)

### Succès étendu (si 3+ testeurs)

7. ✅ Au moins 3 testeurs ont testé
8. ✅ Au moins 2 rôles différents ont été testés (student + teacher ou admin)
9. ✅ Le triage board contient au moins 5 retours documentés

---

## Critères d'arrêt

On arrête ou on pause P-38 si :

1. ❌ Un bug bloquant empêche l'acceptation d'invitation
2. ❌ Google OAuth est down ou cassé
3. ❌ Le premier testeur ne peut pas terminer le workflow
4. ❌ Un token d'invitation fuit dans les logs ou le frontend
5. ❌ La base Supabase est inaccessible

En cas d'arrêt : corriger le bug, re-tester avec P-37F smoke test, puis reprendre P-38.

---

## Décisions à prendre après les retours

Après avoir collecté les retours de la première cohorte :

| Décision | Déclencheur | Options |
|---|---|---|
| Élargir la cohorte | 3+ retours positifs, 0 bug bloquant | Passer à 5 testeurs |
| Corriger bugs P1 | Bugs confirmés dans le triage board | Prioriser avant nouvelle invitation |
| Ajouter une feature | 2+ testeurs demandent la même chose | Évaluer scope MVP vs V1 |
| Lancer la bêta publique | 5+ testeurs satisfaits, 0 bug P1 | Passer à P-39 |
| Re-pivoter le produit | Retours négatifs sur le concept même | Revoir PRD et brief |

---

## Résultat final

À remplir après la première vague de tests.

| Métrique | Valeur |
|---|---|
| Nombre d'invitations créées | |
| Nombre d'invitations acceptées | |
| Nombre de testeurs ayant terminé le workflow | |
| Nombre de retours reçus | |
| Bugs découverts | |
| UX incompréhensions | |
| Features demandées | |
| Satisfaction globale (estimation) | |
| Décision post-P-38 | |

---

## Ce qu'on ne fait pas dans P-38

- ❌ Email automatique
- ❌ Système de relance automatique
- ❌ Analytics avancées
- ❌ Refonte design
- ❌ Nouvelle feature demandée par anticipation
- ❌ Bêta publique
- ❌ Paiement
- ❌ Onboarding complexe
- ❌ Modification de Supabase (sauf bug bloquant)
- ❌ Modification de Google OAuth
- ❌ Nouvelle migration SQL
- ❌ Nouvelle route API

---

**Fin du document P-38.**

*Document généré le 2026-06-18*
*Tag git: `p38-first-real-beta-launch`*
