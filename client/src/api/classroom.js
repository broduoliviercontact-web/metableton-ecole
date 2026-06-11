import { apiClient } from './client.js';

/**
 * Get the current OAuth status for Google Classroom.
 * @returns {Promise<{ connected: boolean; hasClassroomAccess: boolean; oauthEnabled: boolean }>}
 */
export async function getClassroomOAuthStatus() {
  return apiClient('/classroom/oauth/status');
}

/**
 * List Google Classroom courses for the authenticated user.
 * @returns {Promise<{ courses: Array }>} list of course objects
 */
export async function getGoogleClassroomCourses() {
  return apiClient('/classroom/courses');
}

/**
 * Redirect to Google Classroom OAuth flow.
 * This triggers a full page redirect, not an API call.
 */
export function connectGoogleClassroom() {
  // Use relative path to respect VITE_API_URL or proxy
  window.location.href = '/api/classroom/oauth/start';
}
