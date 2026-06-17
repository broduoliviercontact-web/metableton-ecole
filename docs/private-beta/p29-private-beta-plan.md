# P-29 — Private Beta Plan

> **Date**: 2026-06-17  
> **Tag git**: `mvp-demo-ready`  
> **Statut**: Préparation bêta fermée

---

## Objectif

Créer un cadre de test réel avec un petit groupe de personnes (3-5) pour vérifier si Metableton École est :

1. **Compréhensible** — Les visiteurs comprennent-ils le concept ?
2. **Utile** — Les enseignants et élèves voient-ils de la valeur ?
3. **Présentable** — Est-ce que le MVP est prêt pour un lancement public ?

> **Important** : Ce n'est pas un MVP final. C'est un test de faisabilité produit avec des testeurs humains.

---

## Public cible de la bêta

| Profil | Nombre | Objectif |
|--------|--------|----------|
| **Étudiants** | 1-2 | Vérifier le flux d'inscription et d'accès aux cours |
| **Enseignants** | 1-2 | Vérifier le workflow de validation et gestion |
| **Admin** | 1 | Vérifier la gouvernance globale |
| **Musiciens/Producteurs** | 1 | Évaluer l'offre pédagogique |

**Total recommandé** : 3 à 5 personnes maximum

> **Raison** : Un petit groupe permet des feedbacks riches sans surcharge de gestion.

---

## Nombre de testeurs recommandé

| Phase | Testeurs | Justification |
|-------|----------|---------------|
| Bêta 1 | 3-5 | Test interne controlé, feedbacks profonds |
| Bêta 2 | 10-15 | Test plus large, validation des frictions |
| Bêta 3 | 50-100 | Test quasi-public, préparation V1 |

> **Conseil** : Commencer très petit. Un groupe de 5 personnes bien ciblées vaut mieux qu'un lancement massif mal préparé.

---

## Profils à inviter

### 1. Étudiant / Élève
- **Objectif** : Vérifier le parcours "visiteur → login → demande d'inscription → accès au cours"
- **Questions clés** : Est-ce clair ? Est-ce que je voudrais m'inscrire ?

### 2. Professeur
- **Objectif** : Vérifier le workflow "enseignant → demande d'inscription → validation"
- **Questions clés** : Est-ce que je peux gérer mes élèves ? Est-ce que Classroom est utile ?

### 3. Admin / Responsable pédagogique
- **Objectif** : Vérifier la gouvernance globale
- **Questions clés** : Est-ce que je peux gérer les utilisateurs et cours ? Est-ce stable ?

### 4. Musicien / Producteur
- **Objectif** : Évaluer l'offre pédagogique et le positionnement produit
- **Questions clés** : Est-ce que le contenu m'intéresse ? Est-ce que je choisirais cette plateforme ?

---

## Ce qu'on veut valider

### Cohérence produit

| Question | Priorité |
|----------|----------|
| Est-ce que la home explique clairement Metableton École ? | Haute |
| Est-ce que le catalogue donne envie ? | Haute |
| Est-ce que le concept "école de musique + Google Classroom" est compris ? | Haute |

### Utilisabilité

| Question | Priorité |
|----------|----------|
| Le login Google est-il fluide ? | Haute |
| Le dashboard étudiant est-il compréhensible ? | Haute |
| Le dashboard enseignant permet-il de gérer ses élèves ? | Haute |
| Le dashboard admin permet-il de piloter la plateforme ? | Moyenne |

### Intégration Google Classroom

| Question | Priorité |
|----------|----------|
| Le lien entre Metableton et Classroom est-il clair ? | Haute |
| classroom_url est-il suffisant pour l'enseignant ? | Moyenne |
| classroom_url est-il suffisant pour l'étudiant ? | Moyenne |

---

## Ce qui est inclus dans la bêta

| Composant | Status |
|-----------|--------|
| Home page (landing) | ✅ Inclus |
| Catalogue de cours | ✅ Inclus |
| Auth Google OAuth | ✅ Inclus |
| Dashboard étudiant | ✅ Inclus |
| Dashboard enseignant | ✅ Inclus |
| Dashboard admin | ✅ Inclus |
| Google Classroom OAuth | ✅ Inclus |
| Google Classroom Link | ✅ Inclus |
| Supabase RLS | ✅ Inclus |

> **Important** : Tout ce qui est inclus est considéré comme **final** pour cette bêta.

---

## Ce qui n'est pas inclus

| Composant | Status |
|-----------|--------|
| Paiement / Abonnement | ❌ Non inclus (V1+1) |
| Notifications email | ❌ Non inclus (V1+1) |
| Messagerie interne | ❌ Non inclus (V1+2) |
| Analytics GA4 | ❌ Non inclus (V1+1) |
| Search avancée | ❌ Non inclus (V1+2) |
| Export CSV | ❌ Non inclus (V1+2) |
| Certificate généré | ❌ Non inclus (V1+3) |
| Video intégrée native | ❌ Non inclus (V1+3) |
| Mobile app | ❌ Non inclus (V1+3) |

> **Communication claire** : Ces fonctionnalités sont mentionnées dans la documentation pour poser les limites du MVP.

---

## Déroulé recommandé

### Phase 1 — Invitation (Jour 0)

1. Envoyer un email aux testeurs avec :
   - Lien vers la bêta privée
   - Checklist de test (`p29-beta-test-checklist.md`)
   - Formulaire de feedback (`p29-feedback-form.md`)
   - Limitations connues (`p29-known-limitations.md`)

### Phase 2 — Test (Jour 1-3)

1. Les testeurs suivent leur checklist
2. Remplissent le formulaire de feedback
3. Note les bugs et incompréhensions

### Phase 3 — Débrief (Jour 4)

1. Réunir les testeurs (ou discussion asynchrone)
2. Recueillir les feedbacks qualitatifs
3. Documenter les frictions majeures

### Phase 4 — Décision (Jour 5)

1. Analyser les données
2. Décider de la suite :
   - `go-live` → préparer launch public
   - `improve` → développement features manquantes
   - `pivot` → changer le positioning produit

---

## Critères de succès

| Critère | Threshold |
|---------|-----------|
| >80% comprennent le concept | 4/5 testeurs |
| >70% trouvent utile | 3/5 testeurs |
| >60% veulent réutiliser | 3/5 testeurs |
| Aucune friction majeure bloquante | ≤2 mineures |
| Google Classroom perçu comme avantage | >70% |

> **Note** : Ces critères sont flexibles. L'objectif est d'avoir des données qualitatives, pas des stats parfaites.

---

## Critères d'arrêt

| Critère | Action |
|---------|--------|
| >50% ne comprennent pas le concept | Pivot de positioning |
| >3 friction majeures bloquantes | Arrêt bêta, developpement urgent |
| Bugs critiques non résolvables | Report à version future |
| Feedbacks négatifs unanimes | Arrêt bêta, réflexion stratégique |

> **Note** : Ces critères sont des garde-fous, pas des règles strictes.

---

## Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Testeurs ne comprennent pas le concept | Moyenne | Haut | Présenter le "why" clairement |
| Google Classroom OAuth ne fonctionne pas | Faible | Haut | Avoir un plan B |
| Feedbacks biaisés (amis/équipes) | Haute | Moyenne | Sélectionner des testeurs neutres |
| Bugs bloquants non anticipés | Moyenne | Haut | Tester en interne d'abord |

---

## Plan de rollback

| Scénario | Action |
|----------|--------|
| Bugs mineurs | Documenter, corriger après bêta |
| Bugs moyens | Corriger pendant bêta, tests rapides |
| Bugs majeurs | Arrêt bêta, développement urgent |
| Problème auth/Classroom | Désactiver OAuth temporairement, mode "test only" |
| Feedbacks catastrophiques | Arrêt bêta, réflexion stratégique |

> **Note** : Le code n'est pas modifié pendant la bêta sauf bugs critiques.

---

## Décision après bêta

### Option 1 — Go Live (launch public)

**Conditions** :
- >80% comprennent le concept
- <2 friction majeures
- Google Classroom perçu comme avantage

**Prochaines étapes** :
- Documenter les corrections mineures
- Préparer launch public
- Commencer analytics GA4

### Option 2 — Improve (développement feature)

**Conditions** :
- Concept compris mais usage limité
- Fonctionnalités manquantes clairement identifiées

**Prochaines étapes** :
- Prioriser features manquantes
- Développer pour V1
- Planifier nouvelle bêta

### Option 3 — Pivot (changer le positioning)

**Conditions** :
- Concept mal compris malgré explication
- Feedbacks négatifs unanimes

**Prochaines étapes** :
- Analyser le positionning
- Définir nouveau positionning
- Planifier re-test

---

**Fin du plan de bêta.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
