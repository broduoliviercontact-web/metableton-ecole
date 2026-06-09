import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pg from 'pg';
import env from '../config/env.js';

const PgSessionStore = pgSession(session);

const pgPool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
});

const sessionMiddleware = session({
  store: new PgSessionStore({
    pool: pgPool,
    tableName: 'user_sessions',      // auto-created by connect-pg-simple
    createTableIfMissing: true,
  }),
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

export default sessionMiddleware;
