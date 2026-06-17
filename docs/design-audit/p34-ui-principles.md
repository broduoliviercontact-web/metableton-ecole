# P-34 — Principes UI Metableton

> **Date**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `design-audit`

---

## Palette de couleurs

| Nom | Hex | Usage |
|---|---|---|
| **Black** | `#000000` | Background principal |
| **Anthracite** | `#121212` | Secondary background |
| **Dark Slate** | `#1e1e1e` | Cards, containers |
| **Off White** | `#f5f5f5` | Texte principal |
| **Light Gray** | `#a0a0a0` | Texte secondaire |
| **Dark Gray** | `#525252` | Texte thirdaire |
| **Emerald 500** | `#10b981` | Accent principal |
| **Emerald 400** | `#34d399` | Hover, états positifs |
| **Amber 500** | `#f59e0b` | États d'attente |
| **Red 500** | `#ef4444` | États négatifs |

### Grille de couleurs

```
Background: #000000 (Black)
Surface:    #1e1e1e (Dark Slate)
Surface:    #121212 (Anthracite)
Text:       #f5f5f5 (Off White)
Text:       #a0a0a0 (Light Gray)
Accent:     #10b981 (Emerald 500)
Warning:    #f59e0b (Amber 500)
Danger:     #ef4444 (Red 500)
```

---

## Typographie

### Hiérarchie

| Niveau | Taille | Poids | Usage |
|---|---|---|---|
| **H1** | `text-2xl` / `md:text-3xl` | `font-bold` | Titres de page |
| **H2** | `text-xl` / `md:text-2xl` | `font-semibold` | Titres de section |
| **H3** | `text-lg` / `md:text-xl` | `font-semibold` | Titres de sous-section |
| **Body** | `text-base` | `font-normal` | Corps du texte |
| **Caption** | `text-sm` / `text-xs` | `font-normal` | Captions, dates |

### Principes typographiques

- **Lignes de base 1.5** pour lisibilité
- **Contraste minimum 4.5:1** pour textes
- **Taille minimum 16px** pour body text
- **Gras unique** pour hiérarchie (pas de bold+italic)

---

## Composants

### Boutons

| Type | Couleur | Usage |
|---|---|---|
| **Primary** | `bg-emerald-500` | Action principale |
| **Secondary** | `bg-white/5` | Action secondaire |
| **Danger** | `bg-red-500` | Action destructrice |
| **Ghost** | `bg-transparent` | Lien subtil |

**Variants** :
- `size="sm"` : `px-3 py-1.5`
- `size="md"` : `px-4 py-2`
- `size="lg"` : `px-6 py-3`

**États** :
- **Hover** : `bg-emerald-400` pour primary
- **Active** : `bg-emerald-600` pour primary
- **Disabled** : `opacity-50 cursor-not-allowed`

### Badges

| Type | Couleur | Usage |
|---|---|---|
| **Pending** | `bg-amber-500/10 border-amber-500/30 text-amber-200` | En attente |
| **Approved** | `bg-emerald-500/10 border-emerald-500/30 text-emerald-200` | Approuvé |
| **Rejected** | `bg-red-500/10 border-red-500/30 text-red-200` | Refusé |
| **Draft** | `bg-gray-500/10 border-gray-500/30 text-gray-300` | Brouillon |
| **Published** | `bg-emerald-500/10 border-emerald-500/30 text-emerald-200` | Publié |
| **Classroom** | `bg-emerald-500/10 border-emerald-500/30 text-emerald-200` | Classroom lié |

### Cartes

| Élément | Style |
|---|---|
| **Border** | `border-white/10` |
| **Background** | `bg-white/[0.03]` |
| **Hover** | `hover:border-white/20` |
| **Radius** | `rounded-xl` |
| **Padding** | `p-4` ou `p-5` |

### Empty States

| Élément | Style |
|---|---|
| **Icon** | `text-gray-500` |
| **Title** | `text-white` |
| **Description** | `text-gray-400 text-sm` |
| **Background** | `bg-white/[0.02] border-dashed` |
| **Padding** | `p-6 text-center` |

---

## Layouts

### Général

- **Container max-width** : `max-w-7xl`
- **Padding horizontal** : `px-4 sm:px-6 lg:px-8`
- **Gap** : `gap-4 sm:gap-6`

### Grid

| Colonne | Largeur |
|---|---|
| **1 colonne** | `w-full` |
| **2 colonnes** | `sm:grid-cols-2` |
| **3 colonnes** | `sm:grid-cols-3` |
| **4 colonnes** | `sm:grid-cols-4` |

---

## États

### Loading

- Utiliser `LoadingSpinner` avec `size="lg"` ou `size="md"`
- Overlay avec `bg-gray-900/50 backdrop-blur-sm` pour full-page
- Spinner inline pour elements spécifiques

### Error

- Background : `bg-red-500/10 border-red-500/30`
- Texte : `text-red-300`
- Message : `text-sm`

### Success

- Background : `bg-emerald-500/10 border-emerald-500/30`
- Texte : `text-emerald-200`
- Message : `text-sm`

---

## Accessibilité

### Contraste minimum

| Élément | Ratio minimum |
|---|---|
| Texte principal | 4.5:1 |
| Texte secondaire | 3:1 |
| Liens sur fond | 3:1 |
| Boutons | 3:1 |

### Keyboard navigation

- **Focus visible** sur tous les éléments interactifs
- **Tab order** logique (gauche à droite, haut en bas)
- **Skip links** pour navigation rapide

### ARIA labels

- **Boutons** : `aria-label="Nom de l'action"`
- **Inputs** : `aria-describedby="ID du descriptif"`
- **Notifications** : `aria-live="polite"`
- **Menu** : `aria-label="Navigation principale"`

---

## Vocabulaire

### Terms à utiliser

| Terme | Usage |
|---|---|
| **Cours** | Unité pédagogique |
| **Inscription** | Demande d'accès à un cours |
| **Demande d'inscription** | Requête d'un utilisateur |
| **Validation** | Approbation de la demande |
| **Google Classroom** | Outil externe de partage de contenu |

### Terms à éviter

| Terme | Pourquoi |
|---|---|
| LMS | Trop technique, pas compris par tous |
| LMS maison | Contradictoire (LMS = Learning Management System) |
| Pédagogie | Trop académique |
| Enseignement | Trop générique |

---

## Cohérence Metableton

### Thème musical

- Icônes : 🎵, 🎹, 🎸, 🎼
- Couleurs : sombre, emerald (synth audio), amber (doute)
- Style : studio, DAW, Ableton

### Thème pédagogique

- Clarté sur le contenu
- Progression visible
- Feedback clair
- Accès facilité

---

## Empty States utiles

| Page | Empty State | Action |
|---|---|---|
| **Catalog** | "Aucun cours pour le moment" | "Voir le catalogue" |
| **Student Dashboard** | "Aucun cours validé" | "Voir le catalogue" |
| **Teacher Dashboard** | "Aucun cours pour le moment" | "Créer un cours" |
| **Pending Requests** | "Aucune demande en attente" | - |
| **Classroom** | "Aucun cours Google Classroom" | "Connecter Google Classroom" |

---

## Messages d'erreur

| Type | Message | Style |
|---|---|---|
| **Generic** | "Une erreur est survenue" | Neutral |
| **Auth** | "Impossible de se connecter" | Neutral |
| **Enrollment** | "Demande déjà envoyée" | Neutral |
| **Permission** | "Vous n'avez pas les droits" | Neutral |
| **Network** | "Problème de connexion" | Warning |

---

## Design system

### Open Design System (future)

Le projet a un Open Design System actif. Ne pas le remplacer, mais s'y aligner progressivement.

### Composants à unifier

| Composant | Source | Recommendation |
|---|---|---|
| **Button** | `components/ui/Button.jsx` | Standardiser |
| **Badge** | `components/ui/Badge.jsx` | Standardiser |
| **EmptyState** | `components/ui/EmptyState.jsx` | Standardiser |
| **LoadingSpinner** | `components/ui/LoadingSpinner.jsx` | Standardiser |
| **ErrorMessage** | `components/ui/ErrorMessage.jsx` | Standardiser |

---

## Checklist de design

Avant de déployer un nouveau composant ou page :

- [ ] Respecte la palette de couleurs
- [ ] A un ARIA label
- [ ] Est accessible au clavier
- [ ] A un loading state
- [ ] A un état d'erreur
- [ ] A un empty state
- [ ] Est responsive (desktop, mobile)
- [ ] Utilise la typographie correcte
- [ ] A un gap cohérent
- [ ] Respecte les contraintes de contraste

---

**Fin des principes UI.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*

---

*Note : Ce document est une guide vivant. Il peut être mis à jour en fonction des retours et des évolutions du produit.*
