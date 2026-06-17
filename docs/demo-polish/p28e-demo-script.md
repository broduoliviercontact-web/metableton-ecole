# P-28E — Script de démo MVP

> **Version**: 2026-06-17  
> **Tag git**: `mvp-demo-ready`

---

## Objectif de la démo

Présenter **Metableton École** comme une plateformeproduit MVP fonctionnel qui :

1. **Établit une école de musique en ligne** avec des cours structurés
2. **Gère les rôles** (étudiant, enseignant, administrateur)
3. **Synchronise avec Google Classroom** comme passerelle pédagogique
4. **Fournit une expérience utilisateur claire** pour les 3 profils utilisateur

> 💡 **Message clé à transmettre** : « Metableton École n'est pas une simple interface, mais une couche pédagogique qui connecte des cours de musique à Google Classroom pour une expérience d'apprentissage fluide. »

---

## Préparation avant démo

### Checklist technique (à faire 10 min avant la démo)

| Action | Status |
|--------|--------|
| Vérifier `https://your-app.vercel.app` chargé | ⬜ |
| Vérifier `/api/health` retourne `OK` | ⬜ |
| Vérifier `/catalog` affiche des cours | ⬜ |
| Avoir 1 cours **publié** dans le catalogue | ⬜ |
| Avoir 1 compte **admin** fonctionnel | ⬜ |
| Avoir 1 compte **enseignant** fonctionnel | ⬜ |
| Avoir 1 compte **étudiant** fonctionnel | ⬜ |
| Vérifier l'état de Classroom OAuth (activé/désactivé) | ⬜ |
| Ouvrir les onglets: Home → Catalog → Login → Dashboard | ⬜ |

### Comptes de démo recommandés

| Rôle | Email (exemple) | Usage |
|------|-----------------|-------|
| Admin | `admin@exemple.com` | Voir tous les utilisateurs et cours |
| Enseignant | `enseignant@exemple.com` | Voir les demandes d'inscription |
| Étudiant | `etudiant@exemple.com` | Consulter ses cours |

> 💡 **Conseil** : Utilisez des comptes Google réels mais séparés du votre pour une démo crédible.

---

## Version courte — 5 minutes

**Public cible** : Découverte rapide (investisseur, partenaire)

| Minute | Écran | Action | Explication orale |
|--------|-------|--------|-------------------|
| 0:00 | **Home** | Montrer le header | « Bienvenue sur Metableton École — une école de musique en ligne. » |
| 0:45 | **Catalog** | Scroller les cours | « Une sélection de cours pour différents niveaux et instruments. » |
| 1:30 | **Login** | Cliquer sur « Se connecter avec Google » | « Authentification simple avec Google. » |
| 2:15 | **Dashboard étudiant** | Montrer les inscriptions | « Un espace personnel pour suivre ses cours. » |
| 3:00 | **Google Classroom** | Montrer ClassroomLink | « Synchronisation avec Google Classroom. » |
| 4:00 | **Conclusion** | Récapituler | « MVP complet : site, catalogue, auth, rôles, Classroom. » |

---

## Version complète — 15 minutes

**Public cible** : Découverte approfondie (équipes, clients, financeurs)

### Partie 1 — 5 min (Home → Catalog → Login)

| Minute | Action | Énoncé |
|--------|--------|--------|
| 0:00 | **Home** | « Metableton École, l'école de musique en ligne connectée à Google Classroom. » |
| 1:00 | **Catalog** | « 3 niveaux (débutant, intermédiaire, avancé), 4 instruments. Cours prêts à l'emploi. » |
| 2:00 | **Course detail** | « Description claire, niveau indiqué, inscription possible en 1 clic. » |
| 3:00 | **Login Google** | « Authentification sécurisée via Google OAuth. » |
| 4:00 | **Dashboard étudiant** | « Espace personnel : demande d'inscription en attente. » |

### Partie 2 — 5 min (Enseignant → Admin → Inscription)

| Minute | Action | Énoncé |
|--------|--------|--------|
| 5:00 | **Login enseignant** | « Connecté en tant qu'enseignant. » |
| 5:30 | **Dashboard enseignant** | « Gestion de mes cours et demandes d'inscription. » |
| 6:00 | **Pending requests** | « Une demande en attente → Approver/Refuser. » |
| 7:00 | **Admin login** | « En tant qu'admin, gestion globale des utilisateurs. » |
| 8:00 | **Admin dashboard** | « Vue d'ensemble des utilisateurs et rôles. » |

### Partie 3 — 5 min (Classroom → Conclusion)

| Minute | Action | Énoncé |
|--------|--------|--------|
| 9:00 | **Classroom OAuth** | « OAuth 2.0 sécurisé pour la connexion Classroom. » |
| 10:00 | **Classroom link** | « Le cours est now synchronisé avec Google Classroom. » |
| 11:00 | **Étudiant voit Classroom** | « L'étudiant accède directement à son cours Classroom. » |
| 12:00 | **Rôle de la plateforme** | « Metableton n'est pas un LMS, mais une couche pédagogique. » |
| 13:30 | **Conclusion produit** | « MVP complet: auth, rôles, catalogue, Classroom, dashboard. » |

---

## Parcours 1 — Visiteur public

### Objectif : Montrer la first impression

1. **Home page** (`/`)
   - Montrer le header avec logo et bouton login
   - Le ton est professionnel, orienté musique
   - Le call-to-action est clair

2. **Catalog** (`/catalog`)
   - Scroller les cours publics
   - Montrer les badges de niveau et status
   - Montrer les filtres (instruments, niveaux)

3. **Page de cours** (`/catalog/:id`)
   - Montrer la description complète
   - Montrer les informations de l'enseignant
   - Montrer le bouton « Demander l'inscription »

### Oratoire recommandé :

> « Vous arrivez sur Metableton École. Vous comprenez immédiatement qu'il s'agit d'une école de musique en ligne, pas d'un simple site vitrine. Chaque cours a une description claire, un niveau, et vous pouvez demander l'inscription en un clic. »

---

## Parcours 2 — Étudiant

### Objectif : Montrer l'expérience utilisateur après authentification

1. **Login** → se connecter avec Google
2. **Dashboard étudiant** (`/dashboard/student`)
   - Empty state ou liste d'inscriptions
   - Card d'enrollment avec status (en attente/approuvée/refusée)
   - ClassroomLink (si cours approuvé)

3. **Actions possibles**
   - Demander l'inscription à un cours
   - Annuler une demande en attente
   - Accéder à Google Classroom (si autorisé)

### Oratoire recommandé :

> « En tant qu'étudiant, votre dashboard affiche vos inscriptions. Quand une demande est approuvée, vous voyez immédiatement le lien vers Google Classroom. C'est une passerelle — pas un LMS complet — ce qui rend la maintenance légère. »

---

## Parcours 3 — Enseignant

### Objectif : Montrer le workflow d'approbation

1. **Login enseignant**
2. **Dashboard enseignant** (`/dashboard/teacher`)
   - Liste des cours créés
   - Section « Demandes d'inscription »

3. **Workflow d'approbation**
   - Montrer une demande en attente
   - Approuver ou refuser
   - Voir l'optimistic update (disparition immédiate)

### Oratoire recommandé :

> « L'enseignant voit clairement ses cours et les demandes. Quand il clique « Approuver », la demande disparaît de la liste — l'interface est réactive. Le système est simple mais complet. »

---

## Parcours 4 — Admin

### Objectif : Montrer la gouvernance globale

1. **Login admin**
2. **Dashboard admin** (`/dashboard/admin`)
   - Liste des utilisateurs
   - Bouton « Changer le rôle »

3. **Gestion des rôles**
   - Passer d'étudiant à enseignant
   - Optimistic update + rollback en cas d'erreur

4. **Cours admin** (`/dashboard/admin/courses`)
   - Vue d'ensemble de tous les cours
   - Stats: total, publié, brouillon, Classroom lié

### Oratoire recommandé :

> « L'admin a une vue d'ensemble du système. Il peut gérer les utilisateurs, les cours, et vérifier l'état de synchronisation avec Google Classroom. C'est essentiel pour la mise à l'échelle. »

---

## Moment Google Classroom

### Ce qu'il faut expliquer

> **Google Classroom n'est pas le produit**, c'est l'intégration.

| Point | Message |
|-------|---------|
| **Architecture** | Metableton = plateforme + Google Classroom (outil existant) |
| **Synchronisation** | Les cours Metableton sont liés à Classroom via `classroom_url` |
| **OAuth 2.0** | Authentification sécurisée sans exposer les tokens |
| **Rôle de la plateforme** | Couche pédagogique, pas un LMS complet |

### Ce que vous ne devez PAS dire

❌ « Nous avons développé un LMS avec Google Classroom »  
❌ « Notre propre plateforme pédagogique complète »  
✅ « Metableton connecte des cours à Google Classroom »  
✅ « Une passerelle pédagogique légère »  

---

## Phrases clés à dire

### Le message produit (à dire à la fin)

> « Metableton École est un MVP complet qui réunit trois éléments essentiels :
> 1. Une école de musique en ligne avec cours structurés
> 2. Un système de rôles clair (étudiant, enseignant, admin)
> 3. Une synchronisation avec Google Classroom comme passerelle pédagogique
>
> Ce n'est pas un LMS développé de A à Z — c'est une couche pédagogique qui utilise Google Classroom pour la partie cours. Cela rend le MVP stable, léger, et facile à maintenir. »

---

## Ce qu'il ne faut pas montrer

### Absolute (jamais)

| Chose | Raison |
|-------|--------|
| **Supabase dashboard** | Clés exposées, risque sécurité |
| **Fichier `.env`** | Clés API, tokens, secrets |
| **Console logs avec tokens** | Fuites d'information |
| **Routes `/preview/*` non utilisées** | Code non fini, mauvaise impression |

### À éviter

| Situation | Recommandation |
|-----------|----------------|
| **Bug mineur** | Ne pas insister, passer rapidement |
| **Design imparfait** | Se concentrer sur la fonctionnalité |
| **Performance lente** | Ne pas montrer en démo |
| **Documentation incomplete** | Se concentrer sur l'essentiel |

### À dire si question sur limites

> « Le MVP est centré sur l'expérience utilisateur. Certaines fonctionnalités sont en développement (ex: notifications, analytics). Le focus est la stabilité et la clarté de l'offre. »

---

## Checklist avant de lancer la démo

### 10 minutes avant

- [ ] Vérifier `https://your-app.vercel.app` → 200 OK
- [ ] Vérifier `/api/health` → `{"status":"ok"}`
- [ ] Vérifier `/catalog` → Affiche au moins 3 cours
- [ ] Avoir 1 cours **publié** dans le catalogue
- [ ] Avoir 1 compte admin fonctionnel
- [ ] Avoir 1 compte enseignant fonctionnel  
- [ ] Avoir 1 compte étudiant fonctionnel
- [ ] Connaître l'état de Classroom OAuth (activé/désactivé)
- [ ] Ouvrir les onglets: Home → Catalog → Login → Dashboard
- [ ] Se connecter avec le compte étudiant

### 2 minutes avant

- [ ] Redémarrer la démo si une erreur inattendue
- [ ] Vérifier la connexion internet
- [ ] Avoir le microphone/testé
- [ ] Avoir la bonne version du navigateur
- [ ] Fermer les onglets inutiles

---

## Conclusion produit

### Message final à transmettre

> « Metableton École est un **produit MVP** prêt pour la démonstration.
> 
> Il combine :
> - Une **expérience utilisateur claire** pour 3 profils
> - Une **intégration avec Google Classroom** via OAuth 2.0
> - Une **architecture stable** avec Supabase et RLS
> - Une **architecture légère** qui évite de réinventer un LMS
> 
> Le MVP est **testé**, **documenté**, et **prêt** pour la prochaine étape :
> - Recueillir des retours utilisateurs
> - Déployer en production limitée
> - Développer les fonctionnalités futures (analytics, notifications, etc.) »

---

## Prochaines étapes possibles après la démo

### Immédiates (décision du stakeholder)

| Option | Description |
|--------|-------------|
| **Production limitée** | Déployer en production avec 5-10 utilisateurs tests |
| **Retours utilisateurs** | Collecter feedbacks qualitatifs |
| **Features manquantes** | Développer analytics, notifications, CRM |
| **Marketing site** | Créer une landing page dédiée |

### Courte terme (2-4 semaines)

| Feature | Priorité |
|---------|----------|
| Analytics (GA4) | Haute |
| Notifications email | Haute |
| Search dans catalogue | Moyenne |
| Export CSV (admin) | Moyenne |

### Moyen terme (1-2 mois)

| Feature | Description |
|---------|-------------|
| Abonnements | Mode freemium/paid |
| Certificate | Génération de certificats |
| API publique | Pour partenaires |
| Mobile app | PWA ou native |

---

**Fin du script de démo.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
