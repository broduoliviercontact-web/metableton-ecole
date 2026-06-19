import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import requestLogger from './middleware/requestLogger.js';
import sessionMiddleware from './middleware/session.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import enrollmentsRouter from './routes/enrollments.js';
import adminRouter from './routes/admin.js';
import classroomRouter from './routes/classroom.js';
import oscillatorMemoryScoresRouter from './routes/oscillatorMemoryScores.js';
import { publicBetaInvitationsRouter, adminBetaInvitationsRouter } from './routes/betaInvitations.js';

const app = express();

// Render terminates TLS at the proxy layer. Trust the first proxy in production
// so secure session cookies can be set and read correctly.
if (env.isProduction) {
  app.set('trust proxy', 1);
}

// CORS — allow Vite dev server with credentials (cookies)
app.use(cors({
  origin: env.clientOrigin,
  credentials: true,
}));

// Body parsing
app.use(express.json());

// Request logger — logs method, path, status, duration
// Does NOT log query strings, body, cookies, or sensitive data
app.use(requestLogger);

// Session — HTTP-only cookie backed by PostgreSQL
app.use(sessionMiddleware);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes — Google OAuth, session, logout
app.use(authRouter);

// Course routes — public catalog + teacher/admin management
app.use('/api/courses', coursesRouter);

// Enrollment routes — student requests, teacher/admin review
app.use('/api/enrollments', enrollmentsRouter);

// Classroom routes — diagnostic + future Classroom integration
app.use('/api/classroom', classroomRouter);

// Admin routes — user management + courses overview
app.use('/api/admin', adminRouter);

// Beta invitations — public routes (token lookup, accept)
app.use('/api/beta-invitations', publicBetaInvitationsRouter);

// Beta invitations — admin routes (create, list, revoke)
app.use('/api/admin/beta-invitations', adminBetaInvitationsRouter);

// Oscillator Memory leaderboard — public anonymous scores (P-37E)
app.use('/api/oscillator-memory/scores', oscillatorMemoryScoresRouter);

// 404 — catch unknown routes
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.path} — no route matched`);
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Not found' },
  });
});

// Global error handler — always last
app.use(errorHandler);

export default app;
