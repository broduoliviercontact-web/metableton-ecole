# Production Deployment Notes

## Current production topology

- Frontend: Vercel
- Backend: Render
- Database/Auth/Data API: Supabase Cloud
- OAuth provider: Google

## Working production configuration

### Vercel

- Root Directory: `client`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

### Frontend routing

This is a SPA. Vercel must rewrite application routes back to the app shell.

Files:
- `client/vercel.json`
- `vercel.json`

Both currently use:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/|vite.svg|favicon.ico|.*\\..*).*)",
      "destination": "/"
    }
  ]
}
```

This avoids rewriting built JS/CSS assets to HTML, which causes module MIME errors.

### Render environment variables

- `CLIENT_ORIGIN=https://metableton-ecole.vercel.app`
- `GOOGLE_REDIRECT_URI=https://metableton-ecole-api.onrender.com/api/auth/google/callback`
- `SUPABASE_URL=https://txpfdjwpdjflkkpymkto.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<service_role key from the same Supabase project>`
- `DATABASE_URL=<Supabase Session Pooler URI>`
- `SESSION_SECRET=<strong random secret>`
- `NODE_ENV=production`

### Database URL rule

`DATABASE_URL` must use the Supabase **Session pooler** URI, not the direct database host.

Use a URI shaped like:

```txt
postgresql://postgres.<project-ref>:<password>@aws-<region>.pooler.supabase.com:5432/postgres
```

Do not use:

```txt
db.<project-ref>.supabase.co:5432
```

Render is effectively IPv4-only for this use case, and the direct connection can fail with `ENETUNREACH` on IPv6.

### Password encoding

If the Postgres password contains special characters, URL-encode them inside `DATABASE_URL`.

Example:

- raw password: `secret!`
- in URL: `secret%21`

## Backend production cookie/session requirements

These are required for cross-site cookies between Vercel and Render:

- `sameSite: 'none'` in production
- `secure: true` in production
- `app.set('trust proxy', 1)` in production

Relevant files:
- `server/src/middleware/session.js`
- `server/src/routes/auth.js`
- `server/src/app.js`

Without these settings, login can succeed but the frontend gets redirected back to `/` because `/api/auth/me` cannot see the session cookie.

## Common failure modes we hit

### 1. `Invalid API key`

Cause:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` did not belong to the same Supabase project

### 2. `ENETUNREACH ... :5432`

Cause:
- `DATABASE_URL` used the direct connection instead of the session pooler

### 3. `password authentication failed for user "postgres"`

Cause:
- wrong `DATABASE_URL`
- wrong username format
- wrong password

For pooler access, the username must be shaped like:

```txt
postgres.<project-ref>
```

### 4. Vercel `404 NOT_FOUND` on `/dashboard/admin`

Cause:
- missing SPA rewrite rules

### 5. `Failed to load module script ... MIME type "text/html"`

Cause:
- Vercel rewrite rule also caught static assets

Fix:
- exclude files with extensions and known asset paths from SPA rewrites

## Post-debug security follow-up

Several secrets were exposed during debugging and should be rotated:

- Google OAuth client secret
- Supabase service role key
- Session secret
- Supabase/Postgres database password if exposed

## Recommended smoke tests

After any production deploy:

1. Open `/`
2. Log in with Google
3. Confirm redirect to a dashboard
4. Open `/dashboard/admin` as admin
5. Check `/api/auth/me` returns a user
6. Test logout
