import { apiClient } from './client.js';

/**
 * Request enrollment in a course (or retry after rejection).
 * Student-facing. Server returns the enrollment row with a previousStatus
 * hint to indicate whether this was a fresh request or a retry.
 * @param {string} courseId
 * @returns {Promise<Object>} enrollment row with previousStatus hint
 */
export async function requestEnrollment(courseId) {
  const res = await apiClient('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
  return res.data;
}

/**
 * Get all enrollments for the current logged-in user, joined with course data.
 * Student-facing.
 * @returns {Promise<Array>}
 */
export async function getMyEnrollments() {
  const res = await apiClient('/enrollments/mine');
  return res.data;
}

/**
 * Get pending enrollment requests.
 * Teacher-facing: returns pending enrollments for the teacher's own courses.
 * Admin-facing: returns ALL pending enrollments (server-side behavior).
 * @returns {Promise<Array>}
 */
export async function getPendingEnrollments() {
  const res = await apiClient('/enrollments/pending');
  return res.data;
}

/**
 * Approve a pending enrollment request.
 * Teacher must own the course; admin can approve any.
 * @param {string} enrollmentId
 * @returns {Promise<Object>} updated enrollment row
 */
export async function approveEnrollment(enrollmentId) {
  const res = await apiClient(`/enrollments/${enrollmentId}/approve`, {
    method: 'POST',
  });
  return res.data;
}

/**
 * Reject a pending enrollment request.
 * Teacher must own the course; admin can reject any.
 * @param {string} enrollmentId
 * @returns {Promise<Object>} updated enrollment row
 */
export async function rejectEnrollment(enrollmentId) {
  const res = await apiClient(`/enrollments/${enrollmentId}/reject`, {
    method: 'POST',
  });
  return res.data;
}
