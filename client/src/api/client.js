const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Build a normalized API URL from the configured base and a path.
 * Ensures the result is absolute (domain-relative or full origin) and
 * prevents double slashes or duplicate path segments like /api/api/....
 */
function buildApiUrl(path) {
  let base = BASE_URL.trim().replace(/\/+$/, '');

  // If the base is a relative path without a leading slash, make it absolute
  // so the request is never resolved relative to the current page path.
  if (!base.startsWith('/') && !/^[a-z][a-z0-9+.-]*:\/\//i.test(base)) {
    base = `/${base}`;
  }

  let normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // If the base already ends with /api and the path also starts with /api,
  // avoid the duplicate segment (e.g. "/api" + "/api/xyz" -> "/api/xyz").
  if (base.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    normalizedPath = normalizedPath.slice(4); // remove leading "/api"
  }

  return `${base}${normalizedPath}`;
}

/**
 * Base fetch wrapper with credentials and error handling.
 * Sends cookies on every request so the server-side session is preserved.
 */
export async function apiClient(path, options = {}) {
  const url = buildApiUrl(path);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.error?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.code = body.error?.code;
    throw error;
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
