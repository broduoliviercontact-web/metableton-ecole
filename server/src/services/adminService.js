import { getSupabase } from '../config/supabase.js';

const VALID_ROLES = ['student', 'teacher', 'admin'];

// Shared column list — keeps response shape consistent across endpoints.
const USER_COLUMNS = 'id, email, display_name, avatar_url, role, created_at, updated_at';

/**
 * Get all users (profiles) for the admin dashboard.
 * Ordered by created_at desc so newly added users appear first.
 */
export async function listAllUsers() {
  const supabase = await getSupabase();
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
  const supabase = await getSupabase();
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
  const supabase = await getSupabase();
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
  const supabase = await getSupabase();
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
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, skill_level, cover_image_url, status, classroom_id, classroom_url, created_at, updated_at, teacher_id, profiles!courses_teacher_id_fkey(display_name, email)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export { VALID_ROLES };

/**
 * Permanently delete a user profile.
 *
 * Guardrails (enforced by the caller):
 *   - Admin only
 *   - Cannot delete yourself
 *   - Cannot delete the last remaining admin
 *
 * This also cascades to:
 *   - beta_invitations (accepted_user_id SET NULL, created_by CASCADE)
 *   - enrollments (user_id CASCADE)
 *   - courses (teacher_id SET NULL)
 *
 * We chain `.select('id')` after the delete so PostgREST returns the rows that
 * were actually removed. Without it, a silent failure (e.g. RLS filtering out
 * the row) returns `error: null` while leaving the row in place.
 *
 * @param {string} userId - The profile id to delete
 * @returns {Promise<{ deleted: boolean, id: string }>}
 */
export async function deleteUser(userId) {
  const supabase = await getSupabase();

  // Verify the user exists
  const { data: profile, error: lookupError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (!profile) {
    throw Object.assign(
      new Error('User not found'),
      { statusCode: 404, code: 'NOT_FOUND' }
    );
  }

  console.log(
    `[adminService.deleteUser] Attempting deletion of profile ${userId} (role=${profile.role})`
  );

  // Delete the profile and ask PostgREST to return the removed row ids.
  const { data: deletedRows, error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)
    .select('id');

  if (deleteError) {
    console.error(
      `[adminService.deleteUser] Supabase error deleting profile ${userId}:`,
      deleteError.message || deleteError
    );
    throw deleteError;
  }

  if (!deletedRows || deletedRows.length === 0) {
    console.error(
      `[adminService.deleteUser] Profile ${userId} was not removed — database returned zero deleted rows`
    );
    throw Object.assign(
      new Error(
        'La suppression a été refusée par la base de données. Vérifiez les droits ou les dépendances.'
      ),
      { statusCode: 409, code: 'DELETE_FAILED' }
    );
  }

  console.log(
    `[adminService.deleteUser] Deleted profile ${userId} (${deletedRows.length} row${deletedRows.length > 1 ? 's' : ''})`
  );

  return {
    deleted: true,
    id: userId,
  };
}
