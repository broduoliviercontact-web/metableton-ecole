import { apiClient } from './client.js';

export async function getMe() {
  return apiClient('/auth/me');
}

export async function logout() {
  return apiClient('/auth/logout', { method: 'POST' });
}
