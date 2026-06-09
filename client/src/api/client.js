const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Base fetch wrapper with credentials and error handling.
 * Sends cookies on every request so the server-side session is preserved.
 */
export async function apiClient(path, options = {}) {
  const url = `${BASE_URL}${path}`;

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
