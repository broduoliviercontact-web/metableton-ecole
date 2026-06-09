import { apiClient } from './client.js';

/**
 * Get all users (admin only).
 * @returns {Promise<Array>} list of profile rows:
 *   { id, email, display_name, avatar_url, role, created_at, updated_at }
 */
export async function getUsers() {
  const res = await apiClient('/admin/users');
  return res.data;
}

/**
 * Update a user's role (admin only).
 * Server enforces the last-admin guard; throws with status 409 / code
 * 'LAST_ADMIN' if the request would leave the system with no admins.
 * @param {string} userId
 * @param {'student'|'teacher'|'admin'} role
 * @returns {Promise<Object>} updated user
 */
export async function updateUserRole(userId, role) {
  const res = await apiClient(`/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
  return res.data;
}

/**
 * Get all courses for the admin overview (admin only).
 * Each course has teacher info joined in via `profiles`:
 *   { display_name, email }
 * @returns {Promise<Array>} list of course rows
 */
export async function getAdminCourses() {
  const res = await apiClient('/admin/courses');
  return res.data;
}
