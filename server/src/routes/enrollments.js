import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import * as enrollmentService from '../services/enrollmentService.js';
import { getSupabase } from '../config/supabase.js';

const router = Router();

// ── POST /api/enrollments ──────────────────────────────────────────
// Auth required. Student requests enrollment in a course (or retries
// after a rejection). Body: { courseId }
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { courseId } = req.body || {};

    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'courseId is required.' },
      });
    }

    const enrollment = await enrollmentService.requestEnrollment(
      req.user.userId,
      courseId
    );

    res.status(201).json({ data: enrollment });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/enrollments/mine ──────────────────────────────────────
// Auth required. Returns the current user's enrollments with joined
// course data. Must be declared BEFORE the /:id routes so it isn't
// shadowed by the param route.
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getEnrollmentsForStudent(
      req.user.userId
    );
    res.json({ data: enrollments });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/enrollments/pending ───────────────────────────────────
// Auth required, teacher/admin only. Teachers see pending enrollments
// for their own courses; admins see all pending enrollments.
router.get(
  '/pending',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const enrollments =
        req.user.role === 'admin'
          ? await enrollmentService.getAllPendingEnrollments()
          : await enrollmentService.getPendingEnrollmentsForTeacher(
              req.user.userId
            );

      res.json({ data: enrollments });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/enrollments/:id/approve ──────────────────────────────
// Auth required, teacher/admin only. Teacher must own the course;
// admin can approve any.
router.post(
  '/:id/approve',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const enrollmentInfo = await enrollmentService.getEnrollmentCourseTeacher(
        req.params.id
      );

      if (!enrollmentInfo) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Enrollment not found.' },
        });
      }

      // Ownership check
      if (
        req.user.role !== 'admin' &&
        enrollmentInfo.teacherId !== req.user.userId
      ) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only review enrollments for your own courses.',
          },
        });
      }

      const updated = await enrollmentService.approveEnrollment(req.params.id);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ── POST /api/enrollments/:id/reject ───────────────────────────────
// Auth required, teacher/admin only. Teacher must own the course;
// admin can reject any.
router.post(
  '/:id/reject',
  requireAuth,
  requireRole('teacher', 'admin'),
  async (req, res, next) => {
    try {
      const enrollmentInfo = await enrollmentService.getEnrollmentCourseTeacher(
        req.params.id
      );

      if (!enrollmentInfo) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Enrollment not found.' },
        });
      }

      // Ownership check
      if (
        req.user.role !== 'admin' &&
        enrollmentInfo.teacherId !== req.user.userId
      ) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only review enrollments for your own courses.',
          },
        });
      }

      const updated = await enrollmentService.rejectEnrollment(req.params.id);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
);

// ── DELETE /api/enrollments/:id ─────────────────────────────────────
// Auth required. Student can cancel their own pending enrollment request.
// - If enrollment is pending and belongs to user → delete, return 204
// - If enrollment is not pending (already approved/rejected) → 409 CONFLICT
// - If enrollment belongs to another user → 403 FORBIDDEN
// - If enrollment not found → 404 NOT_FOUND
router.delete(
  '/:id',
  requireAuth,
  async (req, res, next) => {
    try {
      const enrollmentInfo = await enrollmentService.getEnrollmentCourseTeacher(
        req.params.id
      );

      if (!enrollmentInfo) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Enrollment not found.' },
        });
      }

      // Check ownership: student can only cancel their own enrollment
      if (enrollmentInfo.studentId !== req.user.userId) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only cancel your own enrollment requests.',
          },
        });
      }

      // Check status: only pending enrollments can be canceled
      if (enrollmentInfo.status !== 'pending') {
        return res.status(409).json({
          error: {
            code: 'INVALID_TRANSITION',
            message: `Cannot cancel an enrollment that is ${enrollmentInfo.status}.`,
          },
        });
      }

      const { getSupabase } = await import('../config/supabase.js');
      const supabase = await getSupabase();
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', req.params.id);

      if (error) throw error;

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

// ── PATCH /api/enrollments/:id/cancel ──────────────────────────────
// Auth required. Student can cancel their own approved enrollment.
// - If enrollment is approved and belongs to user → cancel, return 200
// - If enrollment is not approved → 409 CONFLICT
// - If enrollment belongs to another user → 403 FORBIDDEN
// - If enrollment not found → 404 NOT_FOUND
router.patch(
  '/:id/cancel',
  requireAuth,
  async (req, res, next) => {
    try {
      const enrollmentInfo = await enrollmentService.getEnrollmentCourseTeacher(
        req.params.id
      );

      if (!enrollmentInfo) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Enrollment not found.' },
        });
      }

      // Check ownership: student can only cancel their own enrollment
      if (enrollmentInfo.studentId !== req.user.userId) {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You can only cancel your own enrollment requests.',
          },
        });
      }

      // Check status: only approved enrollments can be cancelled
      if (enrollmentInfo.status !== 'approved') {
        return res.status(409).json({
          error: {
            code: 'INVALID_TRANSITION',
            message: `Cannot cancel an enrollment that is ${enrollmentInfo.status}.`,
          },
        });
      }

      const supabase = await getSupabase();
      const { error } = await supabase
        .from('enrollments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', req.params.id);

      if (error) throw error;

      res.status(200).json({ message: 'Enrollment cancelled.' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
