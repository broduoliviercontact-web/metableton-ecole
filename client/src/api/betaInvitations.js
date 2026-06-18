import { apiClient } from './client.js';

/**
 * Get beta invitation details by token.
 * Public endpoint - no auth required.
 * @param {string} token - The invitation token (plaintext, not hashed)
 * @returns {Promise<Object>} invitation row with status and email
 */
export async function getBetaInvitation(token) {
  const res = await apiClient(`/beta-invitations/${token}`);
  return res.data;
}

/**
 * Accept a beta invitation.
 * Requires authentication. Matches the token with the current user's email.
 * @param {string} token - The invitation token (plaintext, not hashed)
 * @returns {Promise<Object>} updated invitation row with user info
 */
export async function acceptBetaInvitation(token) {
  const res = await apiClient(`/beta-invitations/${token}/accept`, {
    method: 'POST',
  });
  return res.data;
}
