# P-29 — Known Limitations

> **Version**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `private-beta`

---

## Disclaimer

Metableton École est actuellement en **bêta fermée**. Ce document liste les limites connues du MVP pour poser les bonnes attentes avant de lancer la bêta.

---

## État actuel

| État | Signification |
|------|---------------|
| ✅ Final | Fonctionnalité complète et testée |
| 🧪 MVP | Fonctionnalité fonctionnelle, mais basique |
| 🚧 En cours | Fonctionnalité implémentée mais incomplète |
| ⏳ À venir | Fonctionnalité non encore implémentée |

---

## Fonctionnalités non incluses dans cette bêta

### Authentification

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Login Google OAuth | ✅ Final | Fonctionnel et testé |
| Création de compte manuel | ⏳ À venir | Non implémenté pour le MVP |
| 2FA / Multi-factor auth | ⏳ À venir | Nécessaire pour production |

### Notifications

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Notifications email | ⏳ À venir | Non implémenté |
| Notifications push | ⏳ À venir | Nécessaire pour engagement |

### Gestion d'école

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Gestion des équipes pédagogiques | ⏳ À venir | Nécessaire pour grandes écoles |
| Gestion des cycles / parcours | ⏳ À venir | Nécessaire pour curriculum |
| Gestion des ressources pédagogiques | ⏳ À venir | Nécessaire pour contenu |

### Espace étudiant

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Barre de progression | ⏳ À venir | Non implémenté |
| Certificat généré | ⏳ À venir | Nécessaire pour valeur ajoutée |
| Commentaires sur cours | ⏳ À venir | Nécessaire pour engagement |

### Espace enseignant

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Gestion de classe | 🚧 En cours | MVP fonctionnel, limité |
| Export des élèves | ⏳ À venir | Nécessaire pour reporting |
| Outils de création de cours | 🧪 MVP | Basique, à améliorer |

### Espace admin

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Analytics GA4 | ⏳ À venir | Nécessaire pour suivi |
| Export CSV | ⏳ À venir | Nécessaire pour reporting |
| Backup des données | ⏳ À venir | Nécessaire pour production |
| Gestion des espaces | ⏳ À venir | Nécessaire pour multi-écoles |

### Espace technique

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Search avancée | ⏳ À venir | Nécessaire pour catalogue |
| Filter multi-critères | 🧪 MVP | Basique, à améliorer |
| API publique | ⏳ À venir | Nécessaire pour partenaires |
| Mobile app | ⏳ À venir | PWA à développer |

---

## Limites d'API externes

### Google Classroom

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Synchronisation Classroom | 🧪 MVP | Basique, via `classroom_url` |
| Notifications Classroom | ⏳ À venir | Non intégré |
| Export depuis Classroom | ⏳ À partir | Nécessaire pour reporting |

> **Note** : Metableton École utilise Google Classroom comme **outil externe**, pas comme LMS complet. L'intégration est simplifiée pour le MVP.

### Supabase

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| RLS (Row Level Security) | ✅ Final | Activé et testé |
| Storage | ⏳ À venir | Nécessaire pour fichiers |
| Realtime | ⏳ À venir | Nécessaire pour notifications |

---

## Limites de données de démo

| Limitation | Détail |
|------------|--------|
| Données de démo | 3 cours simulés seulement |
| Utilisateurs simulés | 3 comptes (admin/teacher/student) |
| Cours Classroom | Seulement si OAuth est activé |
| Données réelles | Nécessaires pour test final |

> **Note** : Les données de démo sont suffisantes pour tester le workflow, mais pas pour une évaluation complète.

---

## Limites de sécurité

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| HTTPS | ✅ Final | Activé sur Vercel |
| RLS Supabase | ✅ Final | Activé et testé |
| XSS / CSRF | ✅ Final | Protégé par React / Next.js |
| Auth basique | ⚠️ MVP | OAuth uniquement pour le MVP |
| Audit logs | ⏳ À venir | Nécessaire pour production |

---

## Limites de performance

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Temps de chargement | ✅ MVP | <2s acceptable |
| Scaling horizontal | ⏳ À venir | Nécessaire pour 100+ users |
| Cache | 🧪 MVP | Basique, à optimiser |

---

## Limites connues (bugs mineurs)

| Bug | Impact | Priority | Statut |
|-----|--------|----------|--------|
| Empty state ambigu | Faible | Bas | En attente feedbacks |
| Texte "franglais" | Faible | Bas | Corrigé dans P-28B |
| Icônes parfois floues | Faible | Bas | À améliorer V1+ |

---

## Ce qui est volontairement simplifié

| Fonctionnalité | Pourquoi simplifié |
|----------------|-------------------|
| Design system | MVP fonctionnel, pas de design system complet |
| Analytics | Nécessaire pour production, pas pour MVP |
| API publique | Nécessaire pour partenaires, pas pour MVP |
| Mobile app | PWA à développer pour engagement |
| Notifications | Nécessaire pour engagement, pas pour MVP |

---

## Ce qui est en attente de feedbacks

| Fonctionnalité | Question |
|----------------|----------|
| Workflow d'inscription | Est-il trop complexe ? |
| Dashboard enseignant | Est-il suffisant ? |
| Intégration Classroom | Est-ce un avantage ou une contrainte ? |
| Textes / Copy | Sont-ils clairs ? |

---

## Conclusion

> **Le MVP est fonctionnel, pas complet**. C'est une base stable pour tester le concept, pas une plateforme finale.

> **Les limites listées ici sont volontaires** pour concentrer l'effort sur l'essentiel : une expérience utilisateur claire et un workflow fluide.

> **Après la bêta**, les fonctionnalités manquantes seront priorisées selon les retours des testeurs.

---

**Fin des limitations connues.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*
