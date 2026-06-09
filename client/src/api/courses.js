import { apiClient } from './client.js';

/**
 * Public — list all published courses (used by /catalog).
 * @returns {Promise<Array>} published course rows
 */
export async function getPublishedCourses() {
  const res = await apiClient('/courses');
  return res.data;
}

/**
 * Public — fetch a single published course by id.
 * @param {string} courseId
 * @returns {Promise<Object|null>} the course row, or null if not found
 *   (apiClient throws on 404, so callers may rely on the thrown error)
 */
export async function getPublishedCourseById(courseId) {
  const res = await apiClient(`/courses/${courseId}`);
  return res.data;
}

export async function listManageableCourses() {
  const res = await apiClient('/courses/manage');
  return res.data;
}

export async function getManageableCourseById(courseId) {
  const res = await apiClient(`/courses/manage/${courseId}`);
  return res.data;
}

export async function createCourse(payload) {
  const res = await apiClient('/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateCourse(courseId, payload) {
  const res = await apiClient(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/**
 * Link a Google Classroom course to this Metableton course.
 * The server validates the Classroom course via the Google API before
 * persisting classroom_id + classroom_url.
 *
 * Accepts EITHER { classroomId } OR { classroomUrl } in `input`.
 */
export async function linkClassroom(courseId, input) {
  const res = await apiClient(`/courses/${courseId}/classroom`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return res.data;
}
