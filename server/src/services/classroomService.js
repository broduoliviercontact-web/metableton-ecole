import { getOauth2Client } from '../config/google.js';

// How Google represents a public Classroom course page.
// Examples that should resolve to id "123456789012":
//   https://classroom.google.com/c/123456789012
//   https://classroom.google.com/u/0/c/123456789012
//   https://classroom.google.com/u/1/c/123456789012?usp=sharing
const CLASSROOM_URL_RE = /classroom\.google\.com\/(?:u\/\d+\/)?c\/([A-Za-z0-9_-]+)/;

// Errors with shape: code + statusCode — matches the global errorHandler contract
function httpError(statusCode, message, code) {
  return Object.assign(new Error(message), { statusCode, code });
}

/**
 * Extract a Classroom course ID from a raw user input.
 *
 * Accepts:
 *   - the raw ID (e.g. "123456789012")
 *   - a full Classroom URL containing "/c/{id}"
 *
 * Returns the bare ID, or null if no ID could be extracted.
 */
export function parseClassroomId(input) {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;

  // Looks like a URL → try the regex
  if (/^https?:\/\//i.test(trimmed)) {
    const match = trimmed.match(CLASSROOM_URL_RE);
    return match ? match[1] : null;
  }

  // Bare ID — accept alphanumeric / dash / underscore (Google IDs are
  // typically numeric but defensively allow a broader charset).
  if (/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Build the public Classroom course URL for a given course ID.
 * This is the URL the user opens to access the course after approval.
 */
export function buildClassroomUrl(classroomId) {
  return `https://classroom.google.com/c/${classroomId}`;
}

/**
 * Refresh the OAuth tokens stored in the session if the access token is
 * expired (or within a 60s safety window) AND a refresh_token is present.
 *
 * Mutates the supplied tokens object in place. Returns the same object for
 * convenience. If no refresh is needed / possible, returns it unchanged.
 */
async function refreshIfNeeded(tokens) {
  if (!tokens) return tokens;
  const now = Date.now();
  const expiresAt = tokens.expiry_date || 0;
  const isExpired = expiresAt > 0 && expiresAt - now < 60_000;

  if (!isExpired || !tokens.refresh_token) {
    return tokens;
  }

  const oauth2Client = await getOauth2Client();
  oauth2Client.setCredentials({
    refresh_token: tokens.refresh_token,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  if (credentials.access_token) {
    tokens.access_token = credentials.access_token;
  }
  if (credentials.expiry_date) {
    tokens.expiry_date = credentials.expiry_date;
  }
  // refresh_token is occasionally rotated; persist it if so.
  if (credentials.refresh_token) {
    tokens.refresh_token = credentials.refresh_token;
  }
  return tokens;
}

/**
 * Validate a Google Classroom course by calling
 *   GET /v1/courses/{id}
 *
 * @param {Object} tokens — { access_token, refresh_token, expiry_date }
 * @param {string} classroomId — the bare Classroom course ID
 * @returns {Promise<Object>} the course resource from Google
 *
 * Throws with `statusCode` set so the global errorHandler maps it cleanly:
 *   - 400 if the ID is malformed or Google rejects the format (NOT_FOUND
 *     from Google with this shape is treated as a bad ID).
 *   - 403 if Google says the user has no access OR if the OAuth token
 *     lacks the `classroom.courses.readonly` scope (insufficient_scope).
 *   - 404 if the course genuinely does not exist.
 *   - 502 for any other upstream / network failure.
 */
export async function validateClassroomCourse(tokens, classroomId) {
  if (!classroomId || typeof classroomId !== 'string') {
    throw httpError(400, 'Identifiant Google Classroom invalide.', 'VALIDATION_ERROR');
  }

  await refreshIfNeeded(tokens);
  const { google } = await import('googleapis');

  // Build a one-shot auth client so we never mutate the shared oauth2Client
  // (which is also used by the OAuth flow itself).
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: tokens?.access_token });

  const classroom = google.classroom({ version: 'v1', auth });

  try {
    const res = await classroom.courses.get({ id: classroomId });
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    const reason = err?.response?.data?.error?.errors?.[0]?.reason;
    const message = err?.response?.data?.error?.message;

    // Insufficient scope — the user connected Google for sign-in but never
    // granted the Classroom read scope. Tell them clearly what to do.
    if (status === 403 && (reason === 'insufficient_scope' || reason === 'forbidden')) {
      throw httpError(
        403,
        "Google Classroom refuse l'accès : votre compte n'a pas la permission requise. Reconnectez-vous avec l'autorisation Google Classroom.",
        'CLASSROOM_SCOPE_MISSING'
      );
    }

    if (status === 404) {
      // Google returns 404 for both "bad ID format" and "no such course".
      // We expose a friendly validation error rather than leaking 404
      // (a 404 here means the user typed a wrong ID, not a server bug).
      throw httpError(
        400,
        "Cours Google Classroom introuvable. Vérifiez l'identifiant ou l'URL.",
        'CLASSROOM_NOT_FOUND'
      );
    }

    if (status === 403) {
      throw httpError(
        403,
        message || "Vous n'avez pas accès à ce cours Google Classroom.",
        'CLASSROOM_FORBIDDEN'
      );
    }

    if (status === 400) {
      throw httpError(
        400,
        message || 'Identifiant Google Classroom invalide.',
        'VALIDATION_ERROR'
      );
    }

    // Anything else — treat as upstream failure (handled by errorHandler's
    // generic 502 branch via the `response` shape).
    throw err;
  }
}

/**
 * List all Google Classroom courses for the authenticated user.
 * Calls GET /v1/courses with a simple filter (courseState=ACTIVE).
 *
 * @param {Object} tokens — { access_token, refresh_token, expiry_date }
 * @returns {Promise<Array>} array of course objects with id, name, section, courseState
 *
 * Throws with `statusCode` set so the global errorHandler maps it cleanly.
 */
export async function listClassroomCourses(tokens) {
  await refreshIfNeeded(tokens);
  const { google } = await import('googleapis');

  // Build a one-shot auth client so we never mutate the shared oauth2Client
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: tokens?.access_token });

  const classroom = google.classroom({ version: 'v1', auth });

  try {
    const res = await classroom.courses.list({
      courseId: '',
      courseStates: ['ACTIVE', 'ARCHIVED', 'PROVISIONED', 'DRAFT'],
      pageSize: 100,
    });

    // Normalize the response to a minimal shape
    return (res.data.courses || []).map((course) => ({
      id: course.id,
      name: course.name || '',
      section: course.section || '',
      courseState: course.courseState || '',
      alternateLink: course.alternateLink || '',
    }));
  } catch (err) {
    const status = err?.response?.status;
    const reason = err?.response?.data?.error?.errors?.[0]?.reason;
    const message = err?.response?.data?.error?.message;

    if (status === 403 && (reason === 'insufficient_scope' || reason === 'forbidden')) {
      throw httpError(
        403,
        "Google Classroom refuse l'accès : votre compte n'a pas la permission requise. Reconnectez-vous avec l'autorisation Google Classroom.",
        'CLASSROOM_SCOPE_MISSING'
      );
    }

    if (status === 401 || status === 403) {
      throw httpError(
        status,
        message || "Accès refusé à Google Classroom. Vérifiez que vous êtes connecté.",
        status === 401 ? 'UNAUTHORIZED' : 'CLASSROOM_FORBIDDEN'
      );
    }

    if (status === 500 || status === 503) {
      throw httpError(
        503,
        message || 'Google Classroom est temporairement indisponible.',
        'CLASSROOM_UNAVAILABLE'
      );
    }

    // Anything else — treat as upstream failure
    throw err;
  }
}
