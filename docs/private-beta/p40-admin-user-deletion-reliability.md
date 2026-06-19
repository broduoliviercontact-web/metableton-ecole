# P-40 — Fiabilisation de la suppression utilisateur admin

## Problème

Le bouton 🗑 sur `/dashboard/admin` appelait bien `DELETE /api/admin/users/:id`, mais après suppression le profil `pliskain@gmail.com` (`78e6e0a2-d114-4f3b-a304-25cd2c0f686b`) était encore présent dans Supabase.

## Investigation

1. **Frontend** : le bouton appelle `deleteUser(userId)` et recharge la liste.
2. **API client** : `DELETE /api/admin/users/${userId}` est correct.
3. **Backend** : la route `DELETE /api/admin/users/:id` existe, les guardrails
   `CANNOT_DELETE_SELF` et `LAST_ADMIN` sont en place, et `adminService.deleteUser()`
   ciblait bien la table `profiles`.
4. **Contraintes FK** :
   - `courses.teacher_id` → `ON DELETE CASCADE`
   - `enrollments.student_id` → `ON DELETE CASCADE`
   - `beta_invitations.accepted_user_id` → `ON DELETE SET NULL`
   - `beta_invitations.created_by` → `ON DELETE CASCADE`
5. **Test direct SQL** : `DELETE FROM profiles WHERE id = '...'` dans une transaction
   `BEGIN … ROLLBACK` a fonctionné sans erreur FK.
6. **Cause probable** : la suppression via le client Supabase JS utilisait `.delete()`
   sans `.select()`. PostgREST/Supabase renvoie `error: null` dans ce cas même
   quand aucune ligne n'est réellement supprimée (par exemple si une politique
   RLS filtre la ligne ou si la requête REST ne retourne pas les lignes détruites).
   Voir :
   - [supabase/supabase-js#902](https://github.com/supabase/supabase-js/issues/902)
   - [supabase/postgrest-js#353](https://github.com/supabase/postgrest-js/issues/353)

## Correctif

### Backend

`server/src/services/adminService.js` :

- `.delete()` est maintenant suivi de `.select('id')` pour demander à PostgREST
  de renvoyer les lignes supprimées.
- Si aucune ligne n'est retournée, on lève une erreur explicite
  `DELETE_FAILED` (HTTP 409) au lieu de renvoyer `{ deleted: true }` silencieusement.
- Logs temporaires et sans données sensibles pour tracer les tentatives de
  suppression en production.

### Frontend

`client/src/pages/dashboard/AdminDashboardPage.jsx` :

- Remplacement de l'`alert()` par un message d'erreur inline sous la ligne concernée.
- Bouton de suppression désactivé et affichant `…` pendant l'appel API.
- La liste est toujours rechargée après suppression (succès ou échec).

### Tests

- Ajout de `server/src/services/adminService.test.js` :
  - `deleteUser` supprime bien la ligne et vide le tableau mocké.
  - `deleteUser` renvoie 404 si le profil n'existe pas.
  - `deleteUser` renvoie `DELETE_FAILED` si PostgREST ne retourne aucune ligne.
  - Tests des fonctions annexes : `listAllUsers`, `getUserById`, `countAdmins`,
    `updateUserRole`.

## Vérifications

```bash
npm --prefix server test
npm --prefix client run build
```

## Vérification manuelle en production

1. Ouvrir `/dashboard/admin` avec un hard-refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`).
2. Supprimer un compte test.
3. Dans Network, vérifier :
   - `DELETE /api/admin/users/:id` → status 200.
4. Vérifier dans Supabase :

```sql
select id, email, role, created_at
from profiles
where email = 'pliskain@gmail.com';
```

Résultat attendu : `0 rows`.

5. Vérifier que le bouton 🗑 est absent de sa propre ligne admin.
6. Vérifier qu'on ne peut pas supprimer le dernier admin.

## Commit

```bash
git add server/src client/src docs
```
