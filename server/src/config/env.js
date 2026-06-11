import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',

  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  databaseUrl: requireEnv('DATABASE_URL'),

  googleClientId: requireEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
  googleRedirectUri: requireEnv('GOOGLE_REDIRECT_URI'),

  sessionSecret: requireEnv('SESSION_SECRET'),
  clientOrigin: requireEnv('CLIENT_ORIGIN'),

  // P-26B: Classroom diagnostic feature flag
  // When false (default), /api/classroom/diagnostic returns 404
  // When true, diagnostic endpoint returns status info
  classroomDiagnosticEnabled: process.env.CLASSROOM_DIAGNOSTIC_ENABLED === 'true',

  isProduction: process.env.NODE_ENV === 'production',
};

export default env;
