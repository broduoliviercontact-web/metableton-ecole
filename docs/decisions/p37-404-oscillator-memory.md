# P-37 — 404 Oscillator Memory

**Date :** 2026-06-19  
**Statut :** Done  
**Responsable :** Claude Code  
**Projet :** Metableton École

---

## Contexte

Metableton École est une école de musique en ligne. L’identité visuelle et produit est sombre, technique, inspirée studio / DAW / synthétiseurs. La page 404 existante était fonctionnelle mais restait une impasse classique : un message d’erreur et un bouton de retour.

## Problème

Une page 404 est une friction inévitable. Plutôt que d’y afficher seulement un message d’erreur, nous voulions en faire une opportunité pédagogique qui renforce l’identité musicale du produit, sans ajouter de complexité backend ni de dépendance.

## Décision

Ajouter un mini-jeu musical, inspiré de Simon, mais orienté *ear training* de formes d’onde, directement sur la page 404. Le jeu reste **100 % frontend**, utilise la **Web Audio API native**, et est **totalement isolé** dans son propre dossier de feature.

## Implémentation

### Architecture

La feature est isolée dans `client/src/features/oscillator-memory/` :

- `useAudioContext.js` — création lazy de l’`AudioContext`, avec `resume()` sur interaction utilisateur.
- `playSound.js` — moteur audio natif pour les 6 oscillateurs (sine, triangle, square, saw, fm, noise) avec enveloppe ADSR anti-clic.
- `OscillatorPad.jsx` — pad accessible (`<button>`, `aria-label`, `aria-keyshortcuts`, raccourcis `1`–`6`).
- `GameStatus.jsx` — messages d’état, score, tour.
- `OscillatorMemoryGame.jsx` — orchestrateur avec state machine (`idle`, `playingSequence`, `waitingInput`, `success`, `failed`).

La page 404 (`client/src/pages/NotFoundPage.jsx`) intègre simplement le composant `OscillatorMemoryGame` sous le message principal, sans supprimer les liens de sortie.

### Gameplay

1. L’utilisateur arrive sur la 404.
2. Il clique sur « Écouter & jouer ».
3. Le jeu joue une séquence audio d’oscillateurs.
4. Pendant la lecture, les pads sont désactivés et **aucun indice visuel** ne montre la réponse.
5. Après la lecture, l’utilisateur doit rejouer la séquence à l’oreille.
6. Si la séquence est correcte, un nouveau tour commence avec un oscillateur supplémentaire.
7. Si l’utilisateur se trompe, le score final s’affiche avec un bouton « Recommencer ».

### Choix audio importants

- **Hauteur unique :** tous les oscillateurs tonals jouent à `BASE_FREQ = 220 Hz`. L’utilisateur compare le **timbre**, pas la hauteur.
- **Durée pédagogique :** `NOTE_DURATION = 1.5 s`, avec enveloppe ADSR douce (`attack 0.02`, `decay 0.08`, `sustain 0.65`, `release 0.25`).
- **Équilibrage des niveaux :**
  - sine : 0.32
  - triangle : 0.36
  - square : 0.28
  - saw : 0.26
  - fm : 0.24
  - noise : 0.18
- **Différenciation des timbres :**
  - sine : pur, aucun filtre.
  - triangle : doux, harmoniques impaires.
  - square : creux/chiptune, filtré lowpass ~3000 Hz.
  - saw : brillant/buzzy, filtré lowpass ~5000 Hz.
  - fm : carrier sine modulé par un sine à 3× la fréquence, modulation gain 180, timbre métallique/digital.
  - noise : bruit blanc filtré lowpass ~1600 Hz.

## Contraintes respectées

- ✅ Aucun backend touché.
- ✅ Aucune dépendance npm ajoutée.
- ✅ Aucun `package.json` / `package-lock.json` modifié.
- ✅ Aucun fichier env touché.
- ✅ Aucun route modifiée (hors affichage de la 404 existante).
- ✅ Aucune base de données utilisée.
- ✅ `localStorage` utilisé uniquement pour le hiscore local, sans donnée personnelle.
- ✅ Aucune donnée personnelle stockée (pas d’email, nom, userId, rôle).
- ✅ AudioContext créé uniquement après interaction utilisateur.
- ✅ Pas d’autoplay audio.
- ✅ Feature isolée et facilement supprimable.
- ✅ La page 404 reste utilisable si l’audio est indisponible (état `audioError` avec message doux).

## Fichiers concernés

Créés :

- `client/src/features/oscillator-memory/useAudioContext.js`
- `client/src/features/oscillator-memory/playSound.js`
- `client/src/features/oscillator-memory/OscillatorPad.jsx`
- `client/src/features/oscillator-memory/GameStatus.jsx`
- `client/src/features/oscillator-memory/OscillatorMemoryGame.jsx`
- `client/src/features/oscillator-memory/highScoreStorage.js`

Modifié :

- `client/src/pages/NotFoundPage.jsx`

## Tests réalisés

- `npm --prefix client run build` → ✅ passé.
- Tests manuels recommandés :
  - Page 404 accessible.
  - Démarrage du jeu sur interaction.
  - Sons durant ~1.5 s, reconnaissables.
  - Pads inactifs pendant la lecture.
  - Aucun indice visuel pendant la lecture.
  - Réécouter la séquence sans reset.
  - Raccourcis `1`–`6` fonctionnels.
  - Game over avec score + recommencer.
  - Page 404 utilisable si audio indisponible.

## Limites connues

- Pas de test runner côté client : validation par build + tests manuels.
- Le son dépend de la qualité des haut-parleurs/casque de l’utilisateur.
- Le FM reste subjectif : selon le retour utilisateur, le ratio modulateur ou le gain de modulation pourra être affiné.
- Le record est local au navigateur et à l’appareil : il n’est pas synchronisé entre machines.

## Décisions futures possibles

- Ajouter un mode « facile / difficile » avec plus ou moins d’oscillateurs.
- Ajouter un mode visuel optionnel pour les débutants (mais désactivé par défaut pour préserver l’ear training).
- Extraire le moteur audio dans un module réutilisable pour d’autres features pédagogiques (accordeur, spectrogramme simplifié, etc.).

---

## Addendum P-37D — Record local

**Date :** 2026-06-19  
**Sujet :** Ajout d’un record local via `localStorage`, sans donnée personnelle ni backend.

### Contexte

Après la livraison initiale de P-37, le score du mini-jeu était éphémère : il disparaissait à chaque fin de partie. Pour renforcer l’engagement sans ajouter de complexité infrastructure, nous avons ajouté un **record local** stocké uniquement dans le navigateur.

### Décision

Stocker le meilleur score dans `localStorage` avec la clé explicite :

```
metableton-oscillator-memory-hiscore
```

### Pourquoi localStorage et pas un classement global

- Le mini-jeu est une expérience isolée sur la page 404, pas une feature sociale.
- Un classement global nécessiterait un backend, une authentification et du stockage de données personnelles.
- `localStorage` est suffisant pour un hiscore personnel, local au navigateur.
- Aucune donnée personnelle n’est stockée : pas d’email, nom, userId ou rôle.

### Robustesse

- Le module `highScoreStorage.js` encapsule toutes les lectures/écritures.
- Tous les accès à `localStorage` sont protégés par `try/catch`.
- Si `localStorage` est indisponible, la valeur lue est invalide ou le parse échoue, le jeu retourne `0` et continue de fonctionner.
- La page 404 reste entièrement utilisable même si le stockage local est désactivé.

### Fichiers concernés par P-37D

Créé :

- `client/src/features/oscillator-memory/highScoreStorage.js`

Modifiés :

- `client/src/features/oscillator-memory/OscillatorMemoryGame.jsx`
- `client/src/features/oscillator-memory/GameStatus.jsx`

---

## Addendum P-37E — Leaderboard global anonyme

**Date :** 2026-06-19  
**Sujet :** Ajout d’un tableau de scores public, sans auth Google, sans donnée personnelle.

### Contexte

Après le record local (P-37D), nous avons ajouté un **leaderboard global expérimental** pour donner une dimension sociale légère au mini-jeu, sans pour autant transformer la page 404 en plateforme de gamification lourde.

### Décision

- Stocker les scores dans une table Supabase dédiée : `oscillator_memory_scores`.
- Chaque entrée contient uniquement :
  - un pseudo choisi par le joueur ;
  - un score entier ;
  - un timestamp.
- Aucun lien avec les comptes utilisateurs, Google Auth, ou profils existants.
- Aucune donnée personnelle stockée : pas d’email, nom, userId, rôle, IP.

### Pourquoi un leaderboard anonyme

- La feature est volontairement « fun / expérimentale ».
- Un système authentifié et anti-triche serait disproportionné pour une page 404.
- L’anonymat évite les problèmes de consentement RGPD et de gestion d’identité.
- Le joueur reste libre de choisir n’importe quel pseudo, comme sur un classement arcade classique.

### Architecture

- **Base de données :** table `oscillator_memory_scores` avec contraintes SQL (`pseudo` 2–20 caractères, `score` 0–100).
- **Backend :** route publique Express `/api/oscillator-memory/scores` (GET top 10, POST soumission).
- **Service :** `oscillatorMemoryScoreService.js` valide et sanitize le pseudo avant insertion.
- **Frontend :** module API + composants `LeaderboardPanel.jsx` et `SubmitScoreForm.jsx`.
- **Pas d’accès direct Supabase côté client :** toutes les requêtes passent par Express.

### Robustesse

- Validation serveur stricte du pseudo et du score.
- Sanitization côté serveur : trim, collapse des espaces, suppression des caractères de contrôle.
- Le frontend n’affiche jamais de HTML brut : les pseudos sont rendus comme du texte React normal.
- Si l’API est indisponible, le leaderboard affiche un message d’erreur et le jeu reste utilisable.
- La soumission d’un score ne bloque jamais le bouton « Recommencer ».

### Fichiers concernés par P-37E

Créés :

- `supabase/migrations/20260619120000_create_oscillator_memory_scores.sql`
- `server/src/services/oscillatorMemoryScoreService.js`
- `server/src/routes/oscillatorMemoryScores.js`
- `client/src/api/oscillatorMemoryScores.js`
- `client/src/features/oscillator-memory/LeaderboardPanel.jsx`
- `client/src/features/oscillator-memory/SubmitScoreForm.jsx`

Modifiés :

- `server/src/app.js`
- `client/src/features/oscillator-memory/OscillatorMemoryGame.jsx`

---

*Décision enregistrée par Claude Code — 2026-06-19*
