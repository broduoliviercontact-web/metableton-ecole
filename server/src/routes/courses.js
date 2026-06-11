import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import * as courseService from '../services/courseService.js';
import { VALID_SKILL_LEVELS, VALID_STATUSES } from '../services/courseService.js';
import * as classroomService from '../services/classroomService.js';

const router = Router();

// ── GET /api/courses ──────────────────────────────────────────────
// Public — list all published courses (used by /catalog)
router.get('/', async (_req, res, next) => {
  try {
    const courses = await courseService.getPublishedCourses();
    res.json({ data: courses });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/courses/manage ───────────────────────────────────────
// Auth required, teacher or admin.
// Teachers see only their own courses; admins see all courses.
// NOTE: must be declared BEFORE /:id so it isn't shadowed by the param route.
router.get(
  '/manage',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const courses =
        req.user.role === 'admin'
          ? await courseService.getAllCourses()
          : await courseService.getCoursesByTeacher(req.user.userId);

      res.json({ data: courses });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/courses/manage/:id ───────────────────────────────────
// Auth required, teacher or admin. Used by the edit form to load a
// manageable course (any status, including drafts).
// Teachers can read only their own courses; admins can read any course.
// NOTE: must be declared BEFORE the public /:id route.
router.get(
  '/manage/:id',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const course = await courseService.getCourseById(req.params.id);

      if (!course) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Course not found.' },
        });
      }

      if (req.user.role !== 'admin' && course.teacher_id !== req.user.userId) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only view your own courses.',
          },
        });
      }

      res.json({ data: course });
    } catch (err) {
      next(err);
    }
  }
);

// ── GET /api/courses/:id ──────────────────────────────────────────
// Public — fetch a single published course.
router.get('/:id', async (req, res, next) => {
  try {
    const course = await courseService.getPublishedCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Course not found.' },
      });
    }

    res.json({ data: course });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/courses ─────────────────────────────────────────────
// Auth required, teacher or admin. Creates a course owned by the caller.
router.post(
  '/',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const { title, description, skillLevel, coverImageUrl, status } = req.body || {};

      // Validation
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Title is required.' },
        });
      }

      if (skillLevel !== undefined && !VALID_SKILL_LEVELS.includes(skillLevel)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: `skill_level must be one of: ${VALID_SKILL_LEVELS.join(', ')}.`,
          },
        });
      }

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: `status must be one of: ${VALID_STATUSES.join(', ')}.`,
          },
        });
      }

      const course = await courseService.createCourse({
        teacherId: req.user.userId,
        title: title.trim(),
        description: description || '',
        skillLevel: skillLevel || 'all_levels',
        coverImageUrl: coverImageUrl || null,
        status: status || 'draft',
      });

      res.status(201).json({ data: course });
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /api/courses/:id ──────────────────────────────────────────
// Auth required, teacher or admin. Teachers can update only their own courses;
// admins can update any course.
router.put(
  '/:id',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const existing = await courseService.getCourseById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Course not found.' },
        });
      }

      // Ownership check: teacher must own the course, admin can edit any
      if (req.user.role !== 'admin' && existing.teacher_id !== req.user.userId) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only edit your own courses.',
          },
        });
      }

      // Field validation on update
      const { title, skillLevel, status } = req.body || {};

      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Title cannot be empty.' },
        });
      }

      if (skillLevel !== undefined && !VALID_SKILL_LEVELS.includes(skillLevel)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: `skill_level must be one of: ${VALID_SKILL_LEVELS.join(', ')}.`,
          },
        });
      }

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: `status must be one of: ${VALID_STATUSES.join(', ')}.`,
          },
        });
      }

      const updated = await courseService.updateCourse(req.params.id, req.body);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ── PUT /api/courses/:id/classroom ─────────────────────────────────
// Auth required, teacher or admin. Links (or relinks) a Google Classroom
// course to this Metableton course. The Classroom course is validated
// against the live Google API before anything is persisted.
//
// Body accepts EITHER:
//   { classroomId: "123456789012" }
//   { classroomUrl: "https://classroom.google.com/c/123456789012" }
//
// On success: stores classroom_id and classroom_url, returns the course.
router.put(
  '/:id/classroom',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const { classroomId, classroomUrl } = req.body || {};
      const rawInput = classroomId || classroomUrl;

      if (!rawInput || typeof rawInput !== 'string' || rawInput.trim() === '') {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'classroomId or classroomUrl is required.',
          },
        });
      }

      // 1. Course must exist
      const existing = await courseService.getCourseById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Course not found.' },
        });
      }

      // Debug log: user role and course ownership
      console.error(
        `[classroom-link] user.role=${req.user.role}, userId=${req.user.userId}, ` +
        `course.teacher_id=${existing.teacher_id}, isOwner=${existing.teacher_id === req.user.userId}`
      );

      // 2. Ownership check: teacher must own the course, admin can edit any
      if (req.user.role !== 'admin' && existing.teacher_id !== req.user.userId) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only link a Classroom to your own courses.',
          },
        });
      }

      // 3. Parse the raw input into a bare Classroom course ID
      const parsedId = classroomService.parseClassroomId(rawInput);
      if (!parsedId) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message:
              "Impossible d'extraire un identifiant Google Classroom. Utilisez l'URL complète de la page du cours ou l'identifiant numerique.",
          },
        });
      }

      // 4. Check if user is connected to Classroom
      const tokens = req.session?.googleClassroomTokens;
      if (!tokens || !tokens.access_token) {
        return res.status(401).json({
          error: {
            code: 'CLASSROOM_NOT_CONNECTED',
            message: 'Vous devez d\'abord connecter votre compte Google Classroom.',
          },
        });
      }

      // 5. Validate the course against the Google Classroom API.
      // validateClassroomCourse throws with statusCode set; the global
      // errorHandler maps 400/403/404 to JSON, and any other upstream
      // error becomes a 502.
      await classroomService.validateClassroomCourse(tokens, parsedId);

      // 5. Persist
      const finalUrl = classroomService.buildClassroomUrl(parsedId);
      const updated = await courseService.setClassroomLink(req.params.id, {
        classroomId: parsedId,
        classroomUrl: finalUrl,
      });

      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
