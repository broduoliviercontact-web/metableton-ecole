-- P-26K — Supabase RLS Security Hardening
-- Enable RLS on public tables exposed through PostgREST.
-- IF EXISTS keeps local/dev schemas from failing when optional tables are absent.

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.courses FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.enrollments FORCE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_sessions FORCE ROW LEVEL SECURITY;
