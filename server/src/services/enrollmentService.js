import { getSupabase } from '../config/supabase.js';

/**
 * Enrollment state machine
 *
 * Valid transitions:
 *   none        → pending    (student requests enrollment)
 *   pending     → approved   (teacher/admin approves)
 *   pending     → rejected   (teacher/admin rejects)
 *   rejected    → pending    (student re-requests — retryable)
 *   approved    → cancelled  (student cancels enrollment)
 *
 * Terminal states (no further transitions):
 *   approved    → cancelled  (student cancels)
 *   pending     → no change  (cannot re-request while pending)
 *   rejected    → no change  (final rejection)
 *   cancelled   → no change  (final cancellation)
 */

/**
 * Request an enrollment. Creates a new pending enrollment or resets
 * a rejected one back to pending.
 *
 * Returns the resulting enrollment. Caller can inspect `previousStatus`
 * to know if this was a fresh request or a retry.
 */
export async function requestEnrollment(studentId, courseId) {
  const supabase = await getSupabase();
  // 1. Verify course exists and is open for enrollment
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, status, title')
    .eq('id', courseId)
    .maybeSingle();

  if (courseError) throw courseError;
  if (!course) {
    throw Object.assign(new Error('Course not found'), { statusCode: 404 });
  }
  if (course.status !== 'published') {
    throw Object.assign(
      new Error('Course is not open for enrollment'),
      { statusCode: 400 }
    );
  }

  // 2. Check if enrollment already exists
  const { data: existing, error: lookupError } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (lookupError) throw lookupError;

  // State machine guards
  if (existing) {
    if (existing.status === 'pending') {
      throw Object.assign(
        new Error('You already have a pending request for this course.'),
        { statusCode: 409, code: 'ALREADY_PENDING' }
      );
    }
    if (existing.status === 'approved') {
      throw Object.assign(
        new Error('You are already enrolled in this course.'),
        { statusCode: 409, code: 'ALREADY_APPROVED' }
      );
    }
    // status === 'rejected' — retryable
  }

  // 3. Upsert: create or reset to pending
  const { data, error } = await supabase
    .from('enrollments')
    .upsert(
      {
        student_id: studentId,
        course_id: courseId,
        status: 'pending',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,course_id' }
    )
    .select('id, student_id, course_id, status, created_at, updated_at')
    .single();

  if (error) throw error;
  return { ...data, previousStatus: existing?.status || null };
}

/**
 * Approve a pending enrollment. Returns the updated enrollment.
 */
export async function approveEnrollment(enrollmentId) {
  return transitionEnrollment(enrollmentId, 'approved');
}

/**
 * Reject a pending enrollment. Returns the updated enrollment.
 */
export async function rejectEnrollment(enrollmentId) {
  return transitionEnrollment(enrollmentId, 'rejected');
}

/**
 * Cancel an approved enrollment. Returns the updated enrollment.
 * Only the student who owns the enrollment can cancel it.
 */
export async function cancelEnrollment(enrollmentId) {
  return transitionEnrollment(enrollmentId, 'cancelled');
}

async function transitionEnrollment(enrollmentId, newStatus) {
  const supabase = await getSupabase();
  // 1. Look up the enrollment
  const { data: enrollment, error: lookupError } = await supabase
    .from('enrollments')
    .select('id, status, course_id, student_id')
    .eq('id', enrollmentId)
    .maybeSingle();

  if (lookupError) throw lookupError;

  if (!enrollment) {
    throw Object.assign(
      new Error('Enrollment not found'),
      { statusCode: 404 }
    );
  }

  // 2. State machine guard - check valid transitions
  const currentStatus = enrollment.status;
  const allowedFrom = {
    'approved': ['cancelled'],
    'pending': ['approved', 'rejected', 'pending'],
  };

  // Special handling for cancelled - only approved enrollments can be cancelled
  if (newStatus === 'cancelled') {
    if (currentStatus !== 'approved') {
      throw Object.assign(
        new Error('Cannot cancel an enrollment that is not approved.'),
        { statusCode: 409, code: 'INVALID_TRANSITION' }
      );
    }
  } else if (newStatus === 'approved' || newStatus === 'rejected') {
    // For approve/reject, only pending enrollments can be transitioned
    if (currentStatus !== 'pending') {
      const verb = newStatus === 'approved' ? 'approve' : 'reject';
      throw Object.assign(
        new Error(`Cannot ${verb} an enrollment that is already ${currentStatus}.`),
        { statusCode: 400, code: 'INVALID_TRANSITION' }
      );
    }
  }

  // 3. Update
  const { data, error } = await supabase
    .from('enrollments')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', enrollmentId)
    .select('id, student_id, course_id, status, created_at, updated_at')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all enrollments for a student, with joined course data.
 * Includes the course title, status, classroom_url, and teacher name.
 */
export async function getEnrollmentsForStudent(studentId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, student_id, course_id, status, created_at, updated_at,
      courses!inner (
        id, title, description, skill_level, status, classroom_id, classroom_url, cover_image_url,
        profiles!courses_teacher_id_fkey ( display_name )
      )
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get pending enrollments for courses owned by a specific teacher.
 * Includes the student's display_name and email for review purposes.
 */
export async function getPendingEnrollmentsForTeacher(teacherId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, student_id, course_id, status, created_at, updated_at,
      courses!inner ( id, title, teacher_id ),
      profiles!enrollments_student_id_fkey ( display_name, email )
    `)
    .eq('courses.teacher_id', teacherId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get ALL pending enrollments (admin view).
 * Includes course title, teacher name, and student name/email.
 */
export async function getAllPendingEnrollments() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id, student_id, course_id, status, created_at, updated_at,
      courses!inner (
        id, title, teacher_id,
        profiles!courses_teacher_id_fkey ( display_name )
      ),
      profiles!enrollments_student_id_fkey ( display_name, email )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get the course that an enrollment belongs to (for ownership check on approve/reject).
 * Returns the course's teacher_id, or null if the enrollment doesn't exist.
 */
export async function getEnrollmentCourseTeacher(enrollmentId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('enrollments')
    .select('id, status, courses!inner ( id, teacher_id )')
    .eq('id', enrollmentId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  // data.courses is an object because of the !inner join
  const course = data.courses;
  return {
    id: data.id,
    status: data.status,
    courseId: course.id,
    teacherId: course.teacher_id,
  };
}
