# Metableton UI — preview isolée

Sandbox visuelle pour la direction artistique Open Design. **Aucun composant de ce dossier
n'est utilisé par l'app de production.** Le contrat :

- Racine de scoping : `<div className="metableton-theme">` (cf. `DesignPreviewPage.jsx`).
- Variables CSS préfixées `--mt-*` — ne polluent ni `:root`, ni l'app existante.
- Zéro import depuis `client/src/components/ui/*`.
- Zéro appel API, zéro `useAuth`, zéro `localStorage`, zéro dépendance npm.
- Route preview : `/design-preview/*` (cf. `App.jsx`).

## Pourquoi ce dossier existe

Tester l'intégration visuelle d'Open Design **sans toucher** à :

- `HomePage.jsx`, `CatalogPage.jsx`, `CourseDetailPage.jsx`
- `pages/dashboard/*`
- `components/layout/DashboardLayout.jsx`
- `components/ui/Button.jsx`, `Badge.jsx`, …
- `main.jsx`, `AuthContext.jsx`, `RequireAuth.jsx`

Tant que la preview n'est pas validée, **rien** de ce qui est ici n'est consommé
par le code de production.

## Routes preview

| URL | Vue |
|---|---|
| `/design-preview` | index avec liens |
| `/design-preview/home` | HomePreview (anthracite + cyan + Spectrum) |
| `/design-preview/dashboard/student` | StudentDashboardPreview (orange + green ring + clip-grid) |
| `/design-preview/dashboard/teacher` | TeacherDashboardPreview (orange + bar-chart + table) |

## Pour itérer plus tard

Une fois la preview validée, le chemin d'intégration réaliste est :

1. Définir la fusion avec `client/src/components/ui/*` (Button, Badge).
2. Porter `HomePreview` dans `pages/HomePage.jsx` (sans casser la nav existante).
3. Porter les dashboards previews dans `pages/dashboard/*` (sans casser le routing).

Aucun de ces sauts n'est commencé tant que la preview n'est pas approuvée.
