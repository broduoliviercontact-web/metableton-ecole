import { getSupabase } from '../config/supabase.js';

const VALID_SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'all_levels'];
const VALID_STATUSES = ['draft', 'published'];

/**
 * List all published courses with teacher info.
 * Public — used by /catalog and HomePage.
 */
export async function getPublishedCourses() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get a single course by ID with teacher info.
 * Returns null if not found.
 */
export async function getCourseById(courseId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name)')
    .eq('id', courseId)
    .maybeSingle();

  if (error) throw error;
  return data; // null if not found
}

/**
 * Get a single published course by ID (for public detail page).
 * Returns null if not found OR not published.
 */
export async function getPublishedCourseById(courseId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name)')
    .eq('id', courseId)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * List all courses for a specific teacher (any status).
 * Used by the teacher's "manage" view.
 */
export async function getCoursesByTeacher(teacherId) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name)')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * List all courses in the system (admin "manage" view).
 */
export async function getAllCourses() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new course owned by teacherId.
 * Defaults: skill_level = 'all_levels', status = 'draft'.
 */
export async function createCourse({
  teacherId,
  title,
  description = '',
  skillLevel = 'all_levels',
  coverImageUrl = null,
  status = 'draft',
}) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .insert({
      teacher_id: teacherId,
      title,
      description,
      skill_level: skillLevel,
      cover_image_url: coverImageUrl,
      status,
    })
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing course.
 * Caller is responsible for ownership/admin check.
 * Maps camelCase request body fields to snake_case DB columns.
 */
export async function updateCourse(courseId, fields) {
  const supabase = await getSupabase();
  const dbFields = {};

  if (fields.title !== undefined) dbFields.title = fields.title;
  if (fields.description !== undefined) dbFields.description = fields.description;
  if (fields.skillLevel !== undefined) dbFields.skill_level = fields.skillLevel;
  if (fields.coverImageUrl !== undefined) dbFields.cover_image_url = fields.coverImageUrl;
  if (fields.status !== undefined) dbFields.status = fields.status;

  // Classroom fields are set by Story 3.8, not by direct PUT here
  if (fields.classroomId !== undefined) dbFields.classroom_id = fields.classroomId;
  if (fields.classroomUrl !== undefined) dbFields.classroom_url = fields.classroomUrl;

  dbFields.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('courses')
    .update(dbFields)
    .eq('id', courseId)
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id')
    .single();

  if (error) throw error;
  return data;
}

export { VALID_SKILL_LEVELS, VALID_STATUSES };

/**
 * Set the Google Classroom link on a course.
 * Used by Story 3.8 — the route validates the Classroom course via the
 * Google API before persisting, so this helper just writes the values.
 *
 * Returns the updated course row.
 */
export async function setClassroomLink(courseId, { classroomId, classroomUrl }) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .update({
      classroom_id: classroomId,
      classroom_url: classroomUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId)
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id')
    .single();

  if (error) throw error;
  return data;
}
