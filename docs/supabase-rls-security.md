# Supabase RLS Security Hardening

**P-26K** | Date: 2026-06-17 | Status: Implemented

## Contexte

Le Supabase Security Advisor signalait 4 erreurs critiques :
- `public.profiles` — RLS Disabled in Public
- `public.courses` — RLS Disabled in Public
- `public.enrollments` — RLS Disabled in Public
- `public.user_sessions` — RLS Disabled in Public

## Architecture

### Flux de données actuel

```
┌─────────┐     HTTPS      ┌─────────────┐     Service Role      ┌─────────────┐
│ Frontend│ ──────────────> │ Express API │ ─────────────────────> │ Supabase    │
│ (React) │   /api/* routes │ (Backend)   │   SUPABASE_SERVICE_ROLE_KEY │ (PG)        │
└─────────┘                 └─────────────┘                        └─────────────┘
                                    │
                                    └─> Google Auth
                                    └─> Google Classroom
```

### Règle de sécurité

> **Le frontend ne doit jamais accéder directement à Supabase.**
>
> Toutes les requêtes passent par `/api/*` routes du backend Express.

### Service Role bypass RLS

Quand on utilise `SUPABASE_SERVICE_ROLE_KEY`, Postgres exécute les requêtes avec le rôle `postgres` qui **bypass RLS**. C'est pourquoi le backend continue de fonctionner normalement.

## Tables concernées

| Table | Sensibilité | Policy publique | Accès |
|-------|-------------|-----------------|-------|
| `profiles` | haute (user data) | aucune | backend only |
| `courses` | moyenne (content) | aucune | backend only |
| `enrollments` | haute (student data) | aucune | backend only |
| `user_sessions` | critique (auth) | aucune | backend only |

## Migration applicée

**Fichier**: `supabase/migrations/20260617070957_enable_rls_security_hardening.sql`

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Force RLS (all queries must go through policy check)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.courses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions FORCE ROW LEVEL SECURITY;
```

## Pourquoi aucune policy `USING (true)` ?

On **n'ajoute pas** de policies avec `USING (true)` (allow all) car :

1. **Le frontend n'utilise pas Supabase directement** — tout passe par `/api/*`
2. **Service role bypass RLS** — le backend continue à fonctionner sans policy
3. **Zéro accès public** — si jamais quelqu'un tente un accès direct, il sera bloqué
4. **Sécurité par défaut** — zero-trust architecture

## Dépannage

### Erreur: "permission denied for table X"

**Cause** : Le code essaie d'accéder à Supabase directement avec RLS activé.

**Solution** : Vérifier que l'accès passe par `/api/*` et non par `createClient()`.

### Backend ne peut plus lire les données

**Cause** : Inattention sur le service role.

**Vérification** :
```javascript
// server/src/config/supabase.js
export async function getSupabase() {
  return createClient(
    env.supabaseUrl,
    env.supabaseServiceRoleKey, // ← doit être service role, pas anon
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
```

## Rollback (si besoin)

```bash
# Local
supabase migration down

# Production
supabase migration up --version <previous_version>
```

## Acceptance criteria

- [x] RLS activé sur `profiles`, `courses`, `enrollments`, `user_sessions`
- [x] Supabase Security Advisor ne signale plus "RLS Disabled in Public"
- [x] `/api/*` routes fonctionnent (backend service role bypass RLS)
- [x] Frontend ne utilise pas Supabase directement (Vérifié: `createClient` absent de `client/src`)
- [x] Google Auth non affecté (utilise `service_role_key`)
- [x] Google Classroom non affecté (backend only)
- [x] Open Design non affecté (backend only)
- [x] Aucun secret exposé
- [x] `.env` non commit (gitignore présent)

## Liens

- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
