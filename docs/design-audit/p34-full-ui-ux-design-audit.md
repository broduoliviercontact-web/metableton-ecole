# P-34 — Full UI/UX Design Audit

> **Date**: 2026-06-17  
> **Tags**: `mvp-demo-ready`, `design-audit`

---

## Résumé exécutif

### Score global : **6.5 / 10** (Bon, avec beaucoup de polish nécessaire)

**Verdict** : La plateforme Metableton École démontre une base solide avec un système de design bien défini et des motifs UX réfléchis. L'esthétique sombre inspirée studio s'aligne bien avec le thème de la production musicale. Cependant, les incohérences entre deux systèmes de UI, le manque de polish premium et les problèmes d'accessibilité empêchent d'atteindre le niveau premium.

### Points forts

- Language de design cohérent avec le système Open Design
- Workflow d'enrollment bien structuré
- Empty states réfléchis et patterns de loading
- fondations de layout responsive

### Failles critiques

- **Deux systèmes de design** en concurrence
- **Accessibilité manquante** - pas d'ARIA labels, pas de navigation clavier, pas d'indicateurs de focus
- **Sentiment premium insuffisant** - fonctionnel mais pas premium
- **Bouton de login désactivé** - créé une perception négative

---

## Score global

| Axe | Score /5 | Commentaire |
|---|---:|---|
| Clarté produit | 4/5 | Bonne compréhension globale, quelques ambiguïtés |
| Hiérarchie visuelle | 3/5 | Bonne structure, mais homogénéité à améliorer |
| Cohérence UI | 3/5 | Incohérence entre systèmes de composants |
| Qualité premium | 3/5 | Functional mais pas "studio quality" |
| Responsive | 4/5 | Base responsive solide |
| Accessibilité | 2/5 | Critique - manque ARIA, keyboard, focus |
| Cohérence Metableton | 4/5 | Aligné avec thème musique/studio |

**Total** : 6.5 / 10

---

## Pages auditées

### Pages publiques
- `/` - Home
- `/catalog` - Catalogue
- `/catalog/:courseId` - Détail cours
- 404 - Page non trouvée

### Auth / session
- Bouton login Google
- État connecté / déconnecté
- Logout
- Erreurs auth

### Dashboards
- StudentDashboardPage.jsx
- TeacherDashboardPage.jsx
- AdminDashboardPage.jsx
- AdminCoursesPage.jsx
- CourseFormPage.jsx

### Classroom
- ClassroomConnectButton.jsx
- État désactivé
- État connecté
- Liaison cours ↔ Classroom

### Enrollment
- Demande d'inscription
- États pending / approved / rejected
- Annulation / désinscription

---

## Points forts

| Page | Point fort |
|---|---|
| HomePage.jsx | Design sombre cohérent, titre clair |
| CatalogPage.jsx | Badges visibles, filtres simples |
| StudentDashboardPage.jsx | Empty state utile, status clair |
| TeacherDashboardPage.jsx | Workflow de validation logique |
| AdminDashboardPage.jsx | Vue d'ensemble claire |
| ClassroomConnectButton.jsx | États explicites |
| EnrollmentCard | Messages de statut clairs |

---

## Faiblesses principales

| Page | Faiblesse | Impact |
|---|---|---|
| HomePage.jsx | Deux home pages (HomePage + HomePageV2) | Confusion, code redondant |
| HomePage.jsx | Bouton login désactivé | Négatif pour l'image |
| CourseDetailPage.jsx | CTA inscription dominant | Déséquilibre visuel |
| TeacherDashboardPage.jsx | Pending avant cours | Confusion sur le workflow |
| DashboardPages | Pas de loading states | Mauvaise UX |
| Tout le site | Pas d'accessibilité (ARIA, keyboard, focus) | Inaccessible |

---

## Audit pages publiques

### HomePage.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - Concept clair, "bientôt" pour le bouton |
| Hiérarchie | 3/5 - Titre clair, mais structure à améliorer |
| Cohérence UI | 3/5 - Open Design vs components/ui |
| Premium | 3/5 - Pas assez "studio quality" |
| Responsive | 4/5 - Layout bien structuré |
| Accessibilité | 2/5 - ARIA labels manquants |

**Recommandations** :
- Fusionner les deux home pages
- Activer ou supprimer le bouton de login
- Ajouter des indicatifs de progression
- Améliorer la cohérence UI

### CatalogPage.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - Catalogue clair |
| Hiérarchie | 3/5 - Filtres à améliorer |
| Cohérence UI | 4/5 - Bonne cohérence |
| Premium | 3/5 - Peut être plus "studio" |
| Responsive | 4/5 - Bon responsive |
| Accessibilité | 2/5 - Pas d'ARIA labels |

**Recommandations** :
- Ajouter une fonction de recherche
- Améliorer les filtres
- Ajouter un aperçu de cours
- Afficher les infos enseignant

### CourseDetailPage.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - Détails clairs |
| Hiérarchie | 3/5 - CTA dominant |
| Cohérence UI | 4/5 - Bonne cohérence |
| Premium | 3/5 - Peut être plus soigné |
| Responsive | 4/5 - Responsive bien |
| Accessibilité | 2/5 - ARIA labels manquants |

**Recommandations** :
- Rééquilibrer la hiérarchie
- Ajouter un syllabus
- Réduire la répétition Classroom

---

## Audit dashboards

### StudentDashboardPage.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - Workflow clair |
| Hiérarchie | 4/5 - Bonne structure |
| Cohérence UI | 4/5 - Consistent |
| Premium | 3/5 - Peut être plus premium |
| Responsive | 4/5 - Bon responsive |
| Accessibilité | 2/5 - ARIA labels manquants |

**Recommandations** :
- Ajouter progression/avancement
- Ajouter alertes de session à venir
- Clarifier l'accès Classroom

### TeacherDashboardPage.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 3/5 - Pending avant cours (confusion) |
| Hiérarchie | 3/5 - Structure à améliorer |
| Cohérence UI | 4/5 - Bonne cohérence |
| Premium | 3/5 - Peut être plus soigné |
| Responsive | 4/5 - Responsive bien |
| Accessibilité | 2/5 - ARIA labels manquants |

**Recommandations** :
- Mettre courses avant pending
- Ajouter liste élèves par cours
- Ajouter actions en masse

### AdminDashboardPage.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - Vue d'ensemble claire |
| Hiérarchie | 3/5 - Filtres à améliorer |
| Cohérence UI | 4/5 - Consistent |
| Premium | 3/5 - Peut être plus soigné |
| Responsive | 4/5 - Responsive bien |
| Accessibilité | 2/5 - ARIA labels manquants |

**Recommandations** :
- Ajouter recherche/filtres
- Ajouter metrics d'activité
- Faciliter l'édition cours

---

## Audit Classroom

### ClassroomConnectButton.jsx

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - États clairs |
| Hiérarchie | 4/5 - Bonne structure |
| Cohérence UI | 4/5 - Consistent |
| Premium | 3/5 - Peut être plus premium |
| Responsive | 4/5 - Responsive bien |
| Accessibilité | 2/5 - Pas d'ARIA labels |

**Recommandations** :
- Ajouter indicateur visuel quand non lié
- Ajouter statut de sync
- Ajouter états d'erreur

---

## Audit enrollment

| Critère | Évaluation |
|---|---|
| Clarté produit | 4/5 - Workflow clair |
| Hiérarchie | 4/5 - Bonne structure |
| Cohérence UI | 4/5 - Consistent |
| Premium | 3/5 - Peut être plus premium |
| Responsive | 4/5 - Responsive bien |
| Accessibilité | 2/5 - ARIA labels manquants |

**Recommandations** :
- Ajouter communications par email
- Clarifier les statuts
- Améliorer empty states

---

## Audit responsive

| Component | Desktop | Mobile | Tablet |
|---|---|---|---|
| HomePage.jsx | ✅ | ✅ | ⚠️ |
| CatalogPage.jsx | ✅ | ✅ | ⚠️ |
| StudentDashboardPage.jsx | ✅ | ✅ | ⚠️ |
| TeacherDashboardPage.jsx | ✅ | ✅ | ⚠️ |
| AdminDashboardPage.jsx | ✅ | ✅ | ⚠️ |
| ClassroomConnectButton.jsx | ✅ | ✅ | ✅ |

**Observations** :
- Layout responsive bien structuré
- Media queries correctes
- Quelques ajustements à faire sur tablette

---

## Audit accessibilité (CRITIQUE)

### Problèmes identifiés

1. **Pas de ARIA labels**
   - Boutons sans `aria-label`
   - Inputs sans `aria-describedby`
   - Navigation sans `aria-label`

2. **Pas de navigation clavier**
   - Pas de focus visible sur les éléments interactifs
   - Tab order non optimisé

3. **Pas de focus indicators**
   - Boutons ne montrent pas le focus
   - Pas de `:focus-visible` styles

4. **Pas de loading state announcements**
   - Pas de `aria-live` pour les changements dynamiques
   - Pas de `aria-busy` pendant les chargements

### Exemple

```jsx
<Button size="sm" onClick={() => window.location.href = '/api/classroom/oauth/start'}>
  Connecter Google Classroom
</Button>
```

**Problèmes** :
- Pas de `aria-label`
- Pas de loading state
- Pas de keyboard support visible
- Pas de focus indicator

---

## Cohérence Metableton

### Ce qui fonctionne

- Palette de couleurs cohérente (dark, emerald)
- Style sombre inspiré studio/DAW
- Icônes musicales (🎵)
- Titres en français, clairs
- Badges visibles

### Ce qui manque

- Polymorphisme "premium"
- Micro-interactions
- Typographie plus fine
- Gravité visuelle plus marquée

---

## Risques UX

| Risque | Page | Impact | Probabilité |
|---|---|---|---|
| Bouton login désactivé | HomePage | Négatif pour image | Haute |
| Deux home pages | HomePage | Confusion | Haute |
| Pas d'accessibilité | Tout le site | Inaccessible | Haute |
| Pas de loading states | Dashboard | Mauvaise UX | Haute |
| Empty state pauvre | CatalogPage | Perte d'intérêt | Moyenne |
| Jargon technique | Classroom | Confusion | Moyenne |

---

## Recommandations prioritaires

### P0 - Bloquant (Avant bêta 2)

| ID | Page | Problème | Impact | Recommandation |
|---|---|---|---|---|
| D-001 | HomePage | Deux home pages | Confusion | Fuser les deux pages |
| D-002 | HomePage | Bouton login désactivé | Négatif | Activer ou supprimer |
| D-003 | Tout | Pas d'accessibilité | Inaccessible | ARIA labels, keyboard, focus |
| D-004 | Dashboards | Pas de loading states | Mauvaise UX | Ajouter loading states |
| D-005 | CourseDetail | CTA dominant | Déséquilibre | Rééquilibrer hiérarchie |

### P1 - Important (Avant launch)

| ID | Page | Problème | Impact | Recommandation |
|---|---|---|---|---|
| D-006 | Catalog | Pas de recherche | UX lente | Ajouter search |
| D-007 | Catalog | Filtres simples | UX limitée | Améliorer filtres |
| D-008 | TeacherDashboard | Pending avant cours | Confusion | Mettre cours avant |
| D-009 | StudentDashboard | Pas de progression | Manque d'info | Ajouter progression |
| D-010 | Tout | Emails manquants | Manque de follow-up | Ajouter notifications |

### P2 - Polish (Post-launch)

| ID | Page | Problème | Impact | Recommandation |
|---|---|---|---|---|
| D-011 | Tout | Pas assez premium | Pas "studio quality" | Plus de polish |
| D-012 | Dashboard | Pas de metrics | Manque d'info | Ajouter stats |
| D-013 | CourseDetail | Répétition Classroom | Redondance | Réduire répétition |
| D-014 | Admin | Pas de filtres | Recherche lente | Ajouter filtres |

### P3 - Plus tard

| ID | Page | Problème | Impact | Recommandation |
|---|---|---|---|---|
| D-015 | Tout | Design system à unifier | Incohérence | Choisir un système |
| D-016 | Tout | Pas de documentation | Maintenance | Documenter UI |

---

## Ce qu'il ne faut pas refaire maintenant

### Ne pas faire

- ❌ Supprimer le système Open Design
- ❌ Changer la palette de couleurs (dark, emerald)
- ❌ Restructurer la navigation globale
- ❌ Supprimer le code legacy sans migration
- ❌ Changer le thème musical/studio

### Garder tel quel

- ✅ Workflow d'enrollment
- ✅ Intégration Google Classroom
- ✅ Layout des dashboards
- ✅ Langue française
- ✅ Palette de couleurs

---

## Conclusion

Avec les modifications recommandées, Metableton École a le potentiel d'être une plateforme pédagogique musicale exceptionnelle.

### Points à prioriser

1. **Unifier le design system** - Choisir entre `components/ui/` et `metableton-ui/`
2. **Audit complet d'accessibilité** - ARIA labels, keyboard, focus rings
3. **Ajouter communication** - Emails, notifications pour l'enrollment
4. **Polish visuel** - Typographie, micro-interactions

### Prochaine étape

1. Corriger les bugs P0
2. Nouvelle bêta avec 5-10 personnes
3. Recueillir feedbacks sur les corrections
4. Planifier P-35 (refonte UI/UX)

---

**Fin de l'audit.**

*Document généré le 2026-06-17*  
*Tag git: `mvp-demo-ready`*

---

*Note : Cet audit est basé sur l'analyse du code actuel. Une inspection visuelle plus poussée avec outils de développement pourrait révéler des problèmes supplémentaires.*
