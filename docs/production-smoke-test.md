# Checklist de démo production

## URLs de production

| Service | URL |
|---------|-----|
| Frontend | https://metableton-ecole.vercel.app |
| Backend health | https://metableton-ecole-api.onrender.com/api/health |
| API base | https://metableton-ecole-api.onrender.com/api |

---

## Règles importantes à connaître avant test

### Comportement par rôle

| Rôle | Cours visibles | Demandes d'inscription visibles | Actions possibles |
|------|---------------|--------------------------------|-------------------|
| **Student** | Cours publiés (catalogue public) | SEULEMENT ses propres inscriptions | Annuler SEULEMENT une demande `pending` |
| **Teacher** | SEULEMENT ses propres cours | SEULEMENT les demandes de SES cours | Approuver/Refuser demandes de SES cours |
| **Admin** | TOUS les cours | TOUTES les demandes d'inscription | Approuver/Refuser TOUTES les demandes |

### États d'une inscription

| Status | Description | Étudiant peut annuler ? |
|--------|-------------|------------------------|
| `pending` | Demande en attente | ✅ Oui |
| `approved` | Inscription approuvée | ❌ Non (bouton absent) |
| `rejected` | Demande refusée | ❌ Non (mais peut redemander) |

---

## Checklist après deploy

1. Vérifier `/api/health` → réponse `{"ok":true}`
2. Ouvrir le frontend → page d'accueil affichée
3. Vérifier les 3 premiers cours dans le catalogue

---

## Tests public (non connecté)

| Test | URL | Critère |
|------|-----|---------|
| Page d'accueil | `/` | Hero, features, cours visibles |
| Catalogue | `/catalog` | Liste des cours publiés |
| Détail cours | `/catalog/:id` | Page cours avec bouton inscription |
| Connexion | Clic "Se connecter" | Redirection Google OAuth |

---

## Tests étudiant (student)

| Test | Action | Critère |
|------|--------|---------|
| Dashboard | `/dashboard` | "Mes cours" visible, liste vide ou cours |
| Profil | `/dashboard/profile` | Nom, email, avatar affichés |
| Catalogue | `/catalog` | Bouton "Demander l'inscription" |
| Inscription | Clic inscription → confirmer | Message succès, statut `pending` |
| Profil étudiant | `/dashboard` | "Aucun cours pour le moment" si vide |
| Réinscription | Refuser → bouton "Redemander" | Bouton fonctionnel |
| Annuler demande (pending) | `/dashboard` (statut `pending`) | Bouton "Annuler la demande" visible et fonctionnel |
| Approved non annulable | `/dashboard` (statut `approved`) | PAS de bouton "Annuler la demande" |

---

## Tests enseignant (teacher)

| Test | Action | Critère |
|------|--------|---------|
| Dashboard | `/dashboard/teacher` | "Mes cours", "Créer un cours" |
| Créer cours | `/dashboard/teacher/courses/new` | Formulaire valide |
| Cours list | Vue liste cours | SEULEMENT les cours créés par ce professeur visibles |
| Review demandes | Section "Demandes d'inscription" | Affiche SEULEMENT les demandes pour SES cours |
| Approver demande | Clic "Approuver" | Request disparaît, student devient "Approuvée" |
| Refuser demande | Clic "Refuser" | Request disparaît, student voit "Demande refusée" |

---

## Tests admin

| Test | Action | Critère |
|------|--------|---------|
| Dashboard | `/dashboard/admin` | "Administration", liste utilisateurs |
| Profil admin | `/dashboard/profile` | Nom, email affichés |
| Utilisateurs | `/dashboard/admin` | Vue avec users + boutons rôle |
| Cours | `/dashboard/admin/courses` | TOUS les cours (owner + stats) |
| Review demandes | `/dashboard/teacher` (admin hérite) | Affiche TOUTES les demandes d'inscription |

---

## Problèmes fréquents

| Symptôme | Cause probable | Solution rapide |
|----------|----------------|-----------------|
| 404 sur `/dashboard/*` | SPA rewrite manquant | Vérifier `vercel.json` |
| Cookie session perdu | `sameSite` incorrect | Vérifier `session.js` |
| 500 sur API | DB pooler mal configuré | Vérifier `DATABASE_URL` pooler |
| OAuth redirect loop | `CLIENT_ORIGIN` incorrect | Vérifier Render env vars |
| 403 sur admin routes | Session non maintenue | Vérifier cookies cross-site |

---

## Critères de validation finale

- [ ] `/api/health` → `{"ok":true}`
- [ ] Connexion Google → redirect vers dashboard
- [ ] `/dashboard/profile` affiche nom/email pour tous les rôles
- [ ] Catalogue affiche les cours publiés
- [ ] Enseignant voit SEULEMENT ses cours + bouton créer
- [ ] Admin voit la liste des utilisateurs
- [ ] Aucun warning 404/500 dans la console

> **Note** : Ce test prend ~3-5 minutes. Cocher les cases après chaque déploiement.
