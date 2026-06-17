# P-28C — Données de démo propres

## Objectif

Créer 3 cours de démo crédibles pour la démonstration produit, avec descriptions complètes, niveaux appropriés, et statut "published" pour qu'ils apparaissent dans le catalogue public.

## Cours de démo proposés

| Titre | Description | Niveau | Statut |
|-------|-------------|--------|--------|
| **Ableton Live — Fondations** | Initiation complète à Ableton Live : interface, arrangement, instruments virtuels, effets. Créer votre première boucle en 2 heures. | `beginner` | `published` |
| **Production musicale — Projet complet** | Du concept à la diffusion : composition, mixage, mastering. Un projet réaliste de 4 pistes avec feedback d'expert. | `intermediate` | `published` |
| **Synthèse modulaire — Initiation** | Comprendre les oscillateurs, filtres, LFOs. Créer vos propres sons depuis zéro avec une approche pratique et sonore. | `intermediate` | `published` |

## Stratégie de seeding

### Option A — Script SQL via Supabase SQL Editor (RECOMMANDÉ)

Fichier unique exécutable via l'interface SQL de Supabase Dashboard.

#### Avantages
- Simple et contrôlé
- Pas de dépendances externes
- Réversible facilement
- Fonctionne en local et en prod

#### Prérequis

Un profile professeur/admin doit exister dans la base de données. Deux options :

1. **Si un admin existe déjà** (premier utilisateur qui s'est connecté) :
   ```sql
   SELECT id, email, role FROM profiles WHERE role IN ('admin', 'teacher') LIMIT 1;
   ```

2. **Si aucun profil professeur n'existe** : créer un profil admin temporaire
   ```sql
   INSERT INTO profiles (google_sub, email, display_name, role)
   VALUES ('demo-teacher-001', 'teacher@demo.metableton.fr', 'Prof Démonstrateur', 'admin')
   RETURNING id;
   ```

#### Script SQL complet

Copiez-collez ce bloc dans le Supabase SQL Editor :

```sql
-- ============================================
-- P-28C : Données de démo pour Metableton
-- ============================================
-- Ce script ajoute 3 cours de démo crédibles pour la démonstration produit.
--
-- Avertissement : Ne pas exécuter plusieurs fois sans nettoyer au préalable.
-- Pour recharger les données : supprimez les cours existants (voir section Rollback).

-- 1. Configuration - choisir le teacher_id à utiliser
-- Option A : Utiliser un admin existant
-- Décommenter cette requête pour trouver un profil admin/teacher
-- SELECT id FROM profiles WHERE role IN ('admin', 'teacher') LIMIT 1;

-- Option B : Créer un profil démo (à décommenter si nécessaire)
/*
INSERT INTO profiles (google_sub, email, display_name, role)
VALUES ('demo-teacher-001', 'teacher@demo.metableton.fr', 'Prof Démonstrateur', 'admin')
RETURNING id;
*/

-- Variables pour le teacher_id (remplacer par l'ID réel)
-- Pour trouver l'ID, exécutez: SELECT id FROM profiles LIMIT 1;
SET LOCAL enable_row_level_security = OFF; -- Nécessaire si RLS est activé

-- 2. Insertion des cours (3 démos crédibles)
INSERT INTO courses (teacher_id, title, description, skill_level, status)
VALUES
  -- Cours 1 : Ableton Live pour débutants
  (
    (SELECT id FROM profiles WHERE role IN ('admin', 'teacher') LIMIT 1),
    'Ableton Live — Fondations',
    'Initiation complète à Ableton Live : interface, arrangement, instruments virtuels, effets. Vous créerez votre première boucle en 2 heures.',
    'beginner',
    'published'
  ),
  
  -- Cours 2 : Production musicale niveau intermédiaire
  (
    (SELECT id FROM profiles WHERE role IN ('admin', 'teacher') LIMIT 1),
    'Production musicale — Projet complet',
    'Du concept à la diffusion : composition, mixage, mastering. Un projet réaliste de 4 pistes avec feedback d''expert et workflow de studio.',
    'intermediate',
    'published'
  ),
  
  -- Cours 3 : Synthèse modulaire
  (
    (SELECT id FROM profiles WHERE role IN ('admin', 'teacher') LIMIT 1),
    'Synthèse modulaire — Initiation',
    'Comprendre les oscillateurs, filtres, LFOs. Créer vos propres sons depuis zéro avec une approche pratique et sonore. Analyse de synthés célèbres.',
    'intermediate',
    'published'
  );

-- 3. Vérification
SELECT 
  c.id,
  c.title,
  c.skill_level,
  c.status,
  c.created_at,
  p.display_name as teacher
FROM courses c
JOIN profiles p ON c.teacher_id = p.id
WHERE c.title LIKE '%Ableton%' OR c.title LIKE '%Production%' OR c.title LIKE '%Synthèse%'
ORDER BY c.created_at DESC;
```

#### Validation checklist

Après exécution, vérifier :

- [ ] 3 lignes insérées (select count(*) FROM courses WHERE title LIKE '%Ableton%' OR title LIKE '%Production%' OR title LIKE '%Synthèse%')
- [ ] Tous les cours ont `status = 'published'`
- [ ] Tous les cours ont un `teacher_id` valide
- [ ] Le catalogue public `/catalog` affiche les 3 cours

#### Rollback / Nettoyage

Pour supprimer les cours de démo :

```sql
-- Désactiver RLS temporairement si nécessaire
SET LOCAL enable_row_level_security = OFF;

-- Supprimer les cours de démo (par titre)
DELETE FROM courses 
WHERE title IN (
  'Ableton Live — Fondations',
  'Production musicale — Projet complet',
  'Synthèse modulaire — Initiation'
);

-- Vérifier la suppression
SELECT COUNT(*) as remaining FROM courses 
WHERE title LIKE '%Ableton%' OR title LIKE '%Production%' OR title LIKE '%Synthèse%';
```

Pour supprimer aussi le profil professeur démo (si créé) :

```sql
DELETE FROM profiles 
WHERE google_sub = 'demo-teacher-001';
```

### Option B — Script Node.js (AVANCÉ)

Si vous préférez une approche programmatique via le backend :

```javascript
// scripts/createDemoCourses.js
import { getSupabase } from '../src/config/supabase.js';
import { createCourse } from '../src/services/courseService.js';

const demoCourses = [
  {
    title: 'Ableton Live — Fondations',
    description: 'Initiation complète à Ableton Live : interface, arrangement, instruments virtuels, effets. Vous créerez votre première boucle en 2 heures.',
    skillLevel: 'beginner',
  },
  {
    title: 'Production musicale — Projet complet',
    description: 'Du concept à la diffusion : composition, mixage, mastering. Un projet réaliste de 4 pistes avec feedback d\'expert et workflow de studio.',
    skillLevel: 'intermediate',
  },
  {
    title: 'Synthèse modulaire — Initiation',
    description: 'Comprendre les oscillateurs, filtres, LFOs. Créer vos propres sons depuis zéro avec une approche pratique et sonore.',
    skillLevel: 'intermediate',
  },
];

async function createDemoCourses() {
  const supabase = await getSupabase();
  
  // Trouver un professeur/admin
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'teacher'])
    .limit(1);
  
  if (!profiles?.[0]) {
    console.error('Aucun profil admin/teacher trouvé. Créer un profil d\'abord.');
    process.exit(1);
  }
  
  const teacherId = profiles[0].id;
  
  for (const course of demoCourses) {
    try {
      const result = await createCourse({
        teacherId,
        status: 'published',
        ...course,
      });
      console.log(`Créé: ${result.title}`);
    } catch (err) {
      console.error(`Erreur pour ${course.title}:`, err.message);
    }
  }
}

createDemoCourses();
```

Exécution :
```bash
cd /Users/zub/metableton-ecole/server
node ../../scripts/createDemoCourses.js
```

## Stratégie de démonstration

### Scénario 1 : Démarrage rapide (5 min)
1. Premier utilisateur se connecte → devient admin
2. Exécuter le script SQL (Option A)
3. Accéder à `/catalog` → voir les 3 cours
4. Accéder à `/catalog/:courseId` → page de détail fonctionnelle

### Scénario 2 : Professeur complet (15 min)
1. Un administrateur crée un cours via l'interface
2. Lier un Google Classroom
3. L'étudiant s'inscrit
4. L'admin approuve l'inscription
5. L'étudiant accède au cours

## Notes techniques

### RLS (Row Level Security)
- Le script utilise `SET LOCAL enable_row_level_security = OFF` si RLS est activé
- Sinon, le service_role_key du backend contourne RLS naturellement

### Environnements
- **Local** : `supabase start` + Script SQL
- **Prod (Vercel)** : Dashboard Supabase → SQL Editor
- **Preview** : Idem prod

### Sécurité
- Aucun secret exposé (les tokens Google sont dans session)
- Le script n'utilise que des données ID ou créées localement
- Rien n'est commité dans le repo (fichier docs/ only)
