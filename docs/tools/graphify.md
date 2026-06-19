# Graphify — Guide d’usage dans Metableton École

**Rôle :** outil d’aide à la compréhension structurelle du repository.  
**Ce qu’il fait :** visualiser les relations entre fichiers, fonctions, composants et communautés de code.  
**Ce qu’il ne fait pas :** remplacer `git diff`, les tests, le build, ou la réflexion humaine.

---

## En une phrase

Graphify sert à **comprendre et vérifier l’architecture du code** avant, pendant et après une modification structurelle. Il aide à repérer les fichiers trop connectés, à confirmer qu’une feature reste isolée, et à orienter les reviews d’architecture.

---

## Quand utiliser Graphify

Utilisez Graphify dans les cas suivants :

1. **Après une nouvelle feature structurante**
   - Vérifier que les nouveaux fichiers forment une communauté cohérente.
   - Confirmer qu’ils n’ont pas créé de dépendances inattendues avec le reste du projet.

2. **Avant une refactorisation**
   - Identifier tous les fichiers qui dépendent d’un composant ou d’une fonction à modifier.
   - Repérer les fichiers à risque avant d’y toucher.

3. **Après une refactorisation**
   - Valider que les dépendances ont bien été réduites ou réorganisées comme prévu.
   - Détecter les liens résiduels ou les fichiers orphelins.

4. **Pour préparer un audit d’architecture**
   - Obtenir une vue synthétique du graphe de dépendances.
   - Préparer les questions à creuser manuellement.

5. **Pour aider Claude Code à comprendre le repo**
   - Poser des questions ciblées (`graphify query`, `graphify explain`, `graphify path`) avant de lire du code brut.
   - Obtenir un sous-graphe plus digeste qu’un grep global.

---

## Quand ne pas l’utiliser

N’utilisez pas Graphify dans les cas suivants :

- **Petit changement de texte** : un libellé, une traduction, un wording.
- **Petit ajustement CSS** : couleur, spacing, typo, breakpoint.
- **Micro-fix audio ou UI** : durée d’un son, gain, état visuel d’un bouton.
- **Quand `graphify update` refuse et que vous ne comprenez pas pourquoi** : ne forcez pas avec `--force` sans validation.

---

## Commandes utiles

```bash
# Poser une question ciblée sur la structure du repo
graphify query "page 404 components dependencies"

# Comprendre un concept/fichier spécifique
graphify explain "PublicLayout"

# Voir le chemin entre deux éléments
graphify path "NotFoundPage" "OscillatorMemoryGame"

# Mettre à jour le graphe après un changement structurel
graphify update .
```

> **Important :** `graphify update .` peut refuser de s’exécuter si le nombre de nœuds du graphe change de manière inattendue. Cela signale souvent qu’un fichier temporaire, un cache ou un dossier a été pris en compte différemment. Ne forcez pas avec `--force` sans comprendre la raison du changement.

---

## Workflow recommandé

Lors d’une modification structurelle, suivez ces étapes :

1. **Avant de coder**
   ```bash
   git status -sb
   graphify query "<élément concerné>"
   ```

2. **Après avoir modifié le code**
   ```bash
   npm --prefix client run build       # si changement frontend
   npm --prefix server test            # si changement backend
   graphify update .                   # seulement si changement structurel
   ```

3. **Avant le commit**
   ```bash
   git diff --stat
   git diff --name-only
   ```

4. **Attention au commit**
   - Ne pas ajouter automatiquement les fichiers `graphify-out/` au commit.
   - Les fichiers de graphe sont des artefacts d’aide, pas du code applicatif.
   - Ajoutez-les au `.gitignore` si nécessaire, ou mentionnez-les explicitement dans le commit.

---

## Règles de prudence

- Graphify **complète** `git diff`, il ne le remplace pas.
- Graphify **ne remplace pas** les tests unitaires, les tests manuels ou le build.
- Graphify peut indiquer une **structure**, pas une **sémantique** exacte. Relisez toujours le code concerné.
- Si le graphe refuse de se mettre à jour à cause d’une différence de nombre de nœuds, documentez le cas et demandez validation avant d’utiliser `--force`.

---

## Exemple concret

Lors du ticket P-37 (404 Oscillator Memory), Graphify a permis de :

- Confirmer que `NotFoundPage.jsx` importe uniquement `OscillatorMemoryGame.jsx`.
- Vérifier que les fichiers du mini-jeu forment une communauté isolée (`client/src/features/oscillator-memory/`).
- S’assurer qu’aucune dépendance vers l’auth, Supabase ou le backend n’a été créée.

---

*Document rédigé par Claude Code — 2026-06-19*
