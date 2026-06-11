import { apiClient } from './client.js';

export async function getMe() {
  return apiClient('/auth/me');
}

export async function logout() {
  return apiClient('/auth/logout', { method: 'POST' });
}

export async function connectClassroom() {
  // Redirect to Classroom OAuth flow
  window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/google/classroom`;
}

export async function disconnectClassroom() {
  return apiClient('/auth/google/classroom/disconnect', { method: 'POST' });
}
