import supabase from '../config/supabase.js';

const VALID_ROLES = ['student', 'teacher', 'admin'];

// Shared column list — keeps response shape consistent across endpoints.
const USER_COLUMNS = 'id, email, display_name, avatar_url, role, created_at, updated_at';

/**
 * Get all users (profiles) for the admin dashboard.
 * Ordered by created_at desc so newly added users appear first.
 */
export async function listAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(USER_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get a single user by id, or null if not found.
 */
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(USER_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Count how many admins currently exist. Used by the last-admin guard
 * to prevent the system from being locked out of admin actions.
 */
export async function countAdmins() {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');

  if (error) throw error;
  return count || 0;
}

/**
 * Update a user's role. Returns the updated user.
 *
 * Caller is responsible for:
 *   - validating the new role against VALID_ROLES
 *   - the last-admin guard (check before calling this)
 */
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select(USER_COLUMNS)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all courses for the admin dashboard, with teacher info joined.
 * Includes both display name and email so the admin can identify
 * the teacher even if their display name is generic.
 */
export async function listAllCoursesForAdmin() {
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name, email)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export { VALID_ROLES };
