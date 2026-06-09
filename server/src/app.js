import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import sessionMiddleware from './middleware/session.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import coursesRouter from './routes/courses.js';
import enrollmentsRouter from './routes/enrollments.js';
import adminRouter from './routes/admin.js';

const app = express();

// CORS — allow Vite dev server with credentials (cookies)
app.use(cors({
  origin: env.clientOrigin,
  credentials: true,
}));

// Body parsing
app.use(express.json());

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

// Admin routes — user management + courses overview
app.use('/api/admin', adminRouter);

// 404 — catch unknown routes
app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Not found' },
  });
});

// Global error handler — always last
app.use(errorHandler);

export default app;
