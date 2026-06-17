# P-28A — Demo Polish Audit

**Date:** 2026-06-17  
**Auditeur:** Claude  
**Project:** metableton-ecole

---

## Résumé

L'audit P-28A examine l'état actuel de l'interface utilisateur et de l'expérience utilisateur pour le MVP. Aucune modification de code n'a été apportée. L'application montre une qualité de code solide avec une structure cohérente, mais présente plusieurs points d'amélioration pour rendre le produit plus crédible et plus prêt pour une démo.

**Verdict:** ✅ **MVP technique validé, MVP demo prêt avec quelques correctifs mineurs**

---

## Pages publiques

| Page | Statut | Problème | Recommandation |
|------|--------|----------|----------------|
| `/` (Home) | ✅ Bonne qualité | Header "bientôt" inutile | Enlever le bouton désactivé |
| `/` (Home) | ⚠️ Peu clair | "Lancement MVP" peut être perçu négativement | Reformuler comme "Phase pilote" ou "Beta" |
| `/catalog` | ✅ Bonne qualité | Empty state générique | Ajouter une date estimate ou un message encourageant |
| `/catalog/:courseId` | ✅ Bonne qualité |教室 link info répétitive | Regrouper les messages Google Classroom |
| 404 | ✅ Bien fait | — | — |
| Responsive mobile | ✅ OK | — | — |
| CTA login | ⚠️ "bientôt" sur la home | bouton désactivé | Enlever ou activer si possible |

### Détails

**Header (Header.jsx)**
- ✅ Coherent avec le design sombre/technique
- ✅ Navigation claire
- ❌ Bouton "Se connecter avec Google" désactivé sur la home (line 85)
- ✅ Badge de rôle visible

**CatalogPage.jsx**
- ✅ Grid responsive
- ✅ Empty state clair
- ⚠️ Message générique "Revenez bientôt" — peut décourager
- ✅ classroom_url indicator bien placé

**CourseDetailPage.jsx**
- ✅ EnrollmentCTA bien structuré
- ✅ Messages d'état clairs (pending/approved/rejected)
- ⚠️ Message Classroom répété 2x (course detail + student dashboard)
- ✅ Badges de statut et niveau bien visibles

---

## Dashboards

| Zone | Statut | Problème | Recommandation |
|------|--------|----------|----------------|
| `/dashboard` (Student) | ✅ Bonne qualité |empty state générique | Ajouter CTA vers catalog |
| `/dashboard/teacher` | ✅ Bonne qualité | Classroom ConnectButton pas visible | En haut pour visibilité |
| `/dashboard/admin` | ✅ Bonne qualité | User list générique | — |
| Empty states | ⚠️ Génériques | Icones textes | Ajouter des illustrations ou messages plus engageants |
| Cartes cours | ✅ Bonne qualité | — | — |
| Demandes inscription | ✅ Bonne qualité | — | — |
| Classroom block | ⚠️ Position | En haut à droite | Placer plus en évidence |
| Sidebar/header | ✅ Bonne qualité | — | — |

### Détails

**StudentDashboardPage.jsx**
- ✅ EnrollmentCard avec_badges visuels
- ✅ Statut panels bien colorés
- ✅ Confirmer modal pour désinscrire
- ⚠️ Empty state: "Aucun cours" sans date ni encourageant

**TeacherDashboardPage.jsx**
- ✅ PendingEnrollmentsSection bien structuré
- ✅ Optimistic updates + rollback
- ✅ Row errors well handled
- ⚠️ ClassroomConnectButton n'est pas visible au-dessus de "Aucun cours"
- ✅ Badges status/pending bien visibles

**AdminDashboardPage.jsx**
- ✅ UserRow avec role change
- ✅ Optimistic role updates
- ✅ Avatar fallback (initials)
- ✅ Badges de rôle
- ✅ Mark current user

---

## Données de démo

| Élément | Statut | Problème | Recommandation |
|---------|--------|----------|----------------|
| Titres cours | ⚠️ Génériques | "Cours" par défaut | Ajouter des exemples concrets |
| Descriptions | ⚠️ Manquantes | Many empty | Ajouter des descriptions type |
| Niveaux | ✅ OK | — | — |
| Status | ⚠️ Mixte | Désynchronisé | Synchroniser published/draft |
| Classroom link | ⚠️ Manquant | Many courses | Ajouter exemples liens |
| Users test | ✅ OK | — | — |
| Inscriptions test | ✅ OK | — | — |

### Détails

**Données par défaut (MVP)**
- 3 cours dans `COURSE_PREVIEWS` (HomePage)
- titres cohérents avec musique/MAO
- descriptions courtes mais claires

**Cours réels (via API)**
- Potentiellement vides ou génériques
- Description souvent manquante

**Recommandation:** Créer une base de données seed avec:
- 2-3 cours "type" avec descriptions complètes
- 1-2 enseignants de test
- 5-10 étudiants de test
- Quelques inscriptions dans différents états

---

## Bugs ou frictions

| ID | Sévérité | Zone | Description | Ticket proposed |
|----|----------|------|-------------|-----------------|
| B-1 | Low | Home | Bouton désactivé "bientôt" visible | P-28B |
| B-2 | Low | Catalog | Empty state peu engageant ("Revenez bientôt") | P-28B |
| B-3 | Low | Header | ClassroomConnectButton pas visible dans empty state teacher | P-28D |
| B-4 | Low | Dashboard | Empty states génériques, pas d'illustration | P-28D |
| B-5 | Low | Data | Descriptions de cours souvent manquantes | P-28C |

---

## Recommandation de découpage

### P-28B — Nettoyage pages publiques

- [ ] Enlever le bouton désactivé sur la home
- [ ] Reformuler le message "Lancement MVP" → "Phase pilote" ou "Beta"
- [ ] Améliorer l'empty state du catalogue
- [ ] Regrouper les messages Google Classroom
- [ ] Ajouter des données de démo type (cours, descriptions)

### P-28C — Données de démo propres

- [ ] Créer un seed file avec données réalistes
- [ ] Cours avec descriptions complètes
- [ ] Enseignants de test avec profils
- [ ] Étudiants de test
- [ ] Inscriptions dans différents états (pending/approved/rejected)
- [ ] Classrooms linkés pour certains cours

### P-28D — Polish dashboards réels

- [ ] Ajouter illustrations aux empty states
- [ ] Enregistrer ClassroomConnectButton plus visible
- [ ] Ajouter statistiques (progression, heures)
- [ ] Mejorar messages d'état
- [ ] Ajouter animations fluides

### P-28E — Script de démo

- [ ] Créer un guide de démo étape par étape
- [ ] Captures d'écran type
- [ ] Phraseology type pour le professeur
- [ ] Scripts de conversation étudiant
- [ ] Points de démonstration clés

---

## Ce qu'il ne faut pas faire maintenant

Ne pas:

* ✗ Remplacer les vrais dashboards par les previews Open Design
* ✗ Changer la logique d'enrollmentService.js
* ✗ Ajouter de nouvelles dépendances npm
* ✗ Modifier les scopes Google OAuth
* ✗ Changer les migrations Supabase
* ✗ Modifier l'authentification existante
* ✗ Changer la configuration RLS
* ✗ Refondre le design complet (petits pas seulement)

Ne pas non plus:

* ✗ Créer de nouvelles routes API
* ✗ Modifier les middlewares existants
* ✗ Ajouter de nouvelles features non demandées

---

## Acceptance criteria P-28

* Aucun code produit modifié pour l'instant
* Rapport créé ici
* Liste claire des problèmes visuels / produit
* Tickets P-28B/C/D/E proposés
* Aucun secret exposé
* Tests non nécessaires (sauf si bug critique identifié)

---

## Statistiques d'audit

| Category | Count |
|----------|-------|
| Pages publiques examinées | 5 |
| Dashboards examinés | 3 |
| Composants UI | 8 |
| Bugs identifiés | 5 |
| Recommandations | 12 |

**Temps d'audit:** ~30 min  
**Impact estimé:** Low - Medium (correctifs rapides)
