# Modèle Google Classroom comme campus central Metableton

## Vue d'ensemble

Metableton École est conçu comme **un portail au-dessus de Google Classroom**, pas comme un remplacement complet. L'architecture favorise un **campus central** géré par l'école/admin, avec Google Classroom comme système pédagogique principal.

```
┌─────────────────────────────────────────────────────────────┐
│         Google Classroom (Campus Central / Source of Truth) │
│  - Cours officiels créés par admin/école                   │
│  - Professeurs invités comme co-enseignants                │
│  - Roster élèves, devoirs, materials, Meet                 │
└─────────────────────────────────────────────────────────────┘
                            ↑
                            | (link via Metableton)
                            |
┌─────────────────────────────────────────────────────────────┐
│              Metableton Portal (Front Door)                 │
│  - Catalogue public des cours                               │
│  - Inscriptions (request → pending → approved)             │
│  - Student dashboard (Classroom links)                     │
│  - Admin view (all users/courses/enrollments)              │
└─────────────────────────────────────────────────────────────┘
```

## Principes directeurs

| Principes | Description |
|-----------|-------------|
| **Source de vérité unique** | Google Classroom est la source principale des données pédagogiques |
| **Pas de duplication** | Metableton ne recode pas un LMS, il orchestre Google Classroom |
| **Campus central** | L'école/admin crée et gère les cours "officiels" |
| **Flexibilité** | Les teachers peuvent créer des cours spéciaux avec leur propre Classroom |

## Rôle de Google Classroom

Google Classroom est le **système pédagogique principal** :

- Création et gestion des cours officiels
- Roster élèves (qui est inscrit à quel cours)
- Devoirs (coursework et deadlines)
- Rendus élèves (student submissions)
- Notes et évaluations
- Materials Drive (support de cours, fichiers)
- Annonces et stream
- Google Meet pour les sessions live
- Communication entre professeurs et élèves

## Rôle de Metableton Portal

Metableton agit comme **la vitrine et l'orchestrateur** :

| Fonction | Description |
|----------|-------------|
| Catalogue public | Listing des cours disponibles, accessibles sans authentification |
| Inscriptions | Workflow "request → pending → approved/rejected" |
| Student dashboard | Vue unifiée des inscriptions + liens vers Classroom |
| Dashboard teacher | Gestion des cours créés + revue des demandes |
| Dashboard admin | Vue globale sur tous les utilisateurs/cours/demandes |
| Lien Classroom | Validation via API avant affichage du bouton |

**Metableton ne crée PAS de cours Google Classroom.** Il référence et organize les cours existants.

## Responsabilités Admin / École

| Responsabilité | Détails |
|----------------|---------|
| Créer les cours Google Classroom | Via l'interface Google Classroom (pas Metableton) |
| Inviter les professeurs | Ajouter les teachers comme co-enseignants dans les Classroom officiels |
| Créer les cours Metableton | SEULEMENT pour les cours sans Classroom officiel |
| Gérer les demandes d'inscription | Via `/dashboard/admin` (toutes les demandes) |
| Voir tous les cours | `/dashboard/admin/courses` (tous, avec ou sans Classroom) |
| Gestion des rôles | Changer `student ↔ teacher ↔ admin` |
| Co-enseignant | Pouvant enseigner dans les Classroom officiels |

**L'admin est le créateur principal des cours officiels.** Les teachers sont invités comme co-enseignants dans les Classroom admin.

## Responsabilités Teacher

| Responsabilité | Détails |
|----------------|---------|
| Enseigner dans Google Classroom | C'est l'endroit où se passe le cours réel |
| Être invité dans les Classroom officiels | Pour enseigner dans les cours Metableton "officiels" |
| Créer des cours Metableton | SEULEMENT pour des cas spéciaux (expérimentaux) |
| Lier leur propre Classroom | Pour des cours personnels ou hors campus central |
| Approuver/rejeter les demandes | Via `/dashboard/teacher` (SEULEMENT pour leurs cours) |

**Restriction importante :** Un teacher ne peut pas lier un Classroom qu'il ne possède pas ou n'est pas co-enseignant. Il doit d'abord être invité.

## Expérience Student

| Scénario | Comportement |
|----------|--------------|
| Inscription à un cours officiel | Vue "Ouvrir Google Classroom" dans le dashboard |
| Inscription à un cours expérimental | Message "Classroom pas encore lié" |
| Déjà inscrit à un cours | Vue "En attente" ou "Approuvée" selon le statut |
| Inscription refusée | Bouton "Redemander l'inscription" |
| En attente de validation | Message "Demande en attente de validation" |

**Important : Pour accéder au Google Classroom, l'étudiant doit être invité/ajouté comme élève dans le Classroom Google.** Metableton ne synchronise pas encore automatiquement le roster. Le teacher/admin doit inviter manuellement les élèves dans Google Classroom pour qu'ils puissent accéder au cours.

**Le dashboard étudiant affiche l'état réel des inscriptions et les liens Classroom disponibles.**

## Implications futures pour les fonctionnalités Classroom

| Fonctionnalité | Scope OAuth requis | Source de vérité | Direction |
|----------------|-------------------|------------------|-----------|
| **Roster élèves** | `classroom.rosters.readonly` | Classroom → Metableton | Lecture seule |
| **Devoirs** | `classroom.coursework.me` | Classroom → Metableton | Lecture seule |
| **Rendus** | `classroom.coursework.student.submissions.readonly` | Classroom → Metableton | Lecture seule |
| **Notes** | `classroom.gradebook.readonly` | Classroom → Metableton | Lecture seule |
| **Materials Drive** | `classroom.coursework.materials.readonly` | Classroom → Metableton | Lecture seule |
| **Annonces** | `classroom.announcements.readonly` | Classroom → Metableton | Lecture seule |
| **Synchronisation élèves** | `classroom.rosters` | Classroom ↔ Metableton | Sync (à définir) |
| ** Création devoirs** | `classroom.coursework.items` | Metableton → Classroom | Écriture (à définir) |

**Règle future :** La source de vérité reste Google Classroom. Metableton peut afficher ou envoyer des données, mais ne doit pas être la source principale.

## Risques et mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Double cours (Metableton + Classroom) | Medium | Medium | Documentation claire + validation admin |
| Professeurs créent cours sans Classroom | Medium | Low | Message UI "Créer d'abord le Classroom" |
| Scopes OAuth trop larges | Low | High | Ajouter scopes un par un, documenter |
| Classroom API rate limits | Medium | Medium | Caching, retry logic, UI feedback |
| Permissions 403 pour co-enseignants | Medium | High | Gestion d'erreur claire + fallback UI |

## Non-goals (ce que Metableton ne fait PAS)

- ❌ **Création automatique** de Google Classroom depuis Metableton
- ❌ **Synchronisation automatique** des élèves (roster sync)
- ❌ **Récupération automatique** des devoirs/note/Drive
- ❌ **Stockage local** des données Classroom (synchronisation à la demande seulement)
- ❌ **Modification de la base de données** pour stocker les données Classroom
- ❌ **Notifications automatiques** (email ou in-app)
- ❌ **Webhook/Google Pub/Sub** (à définir pour future v2)
- ❌ **Génération de Meet links** (pass-through vers Classroom)
- ❌ **Création de materials Drive** via Metableton

## Conflits de source de vérité à éviter

| Scénario à éviter | Raison | Solution |
|-------------------|--------|----------|
| Créer cours dans Metableton, puis Classroom | Duplication, confusion | Créer d'abord dans Classroom |
| Modifier cours Metableton sans sync Classroom | Incohérence | Lier Classroom avant modification |
| Un seul teacher gère tout | Single point of failure | Inviter co-enseignants dans Classroom |
| Classroom sans cours Metableton | Pas visible dans le catalogue | Créer le cours Metableton pour référencer |

## Migration de données future

Si Metableton **trouve** besoin d'afficher des données Classroom (élèves, devoirs) :

1. **Récupération à la demande** : Appeler l'API Classroom quand l'utilisateur clique
2. **Caching intelligent** : Stocker temporairement pour éviter les rate limits
3. **Fallback gracieux** : Si Classroom indisponible, afficher un message clair
4. **Refresh token automatique** : Gérer l'expiration des tokens OAuth

---

**Date de cette décision :** 2026-06-11 (P-24B)  
**Version :** 1.0  
**Auteur :** Metableton Team
