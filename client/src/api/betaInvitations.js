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

/**
 * Create a new beta invitation (admin only).
 * @param {Object} options
 * @param {string} options.email - Email of the invitee
 * @param {'student'|'teacher'|'admin'} [options.role] - Role to grant
 * @param {string} [options.expiresAt] - ISO date string for expiration
 * @param {string} [options.notes] - Optional notes
 * @returns {Promise<Object>} created invitation with raw token
 */
export async function createBetaInvitation({ email, role, expiresAt, notes }) {
  const res = await apiClient('/admin/beta-invitations', {
    method: 'POST',
    body: JSON.stringify({ email, role, expiresAt, notes }),
  });
  return res.data;
}

/**
 * Get all beta invitations (admin only).
 * @returns {Promise<Array>} list of invitation rows
 */
export async function listBetaInvitations() {
  const res = await apiClient('/admin/beta-invitations');
  return res.data;
}

/**
 * Revoke a pending beta invitation (admin only).
 * @param {string} invitationId - The invitation ID
 * @returns {Promise<Object>} updated invitation row
 */
export async function revokeBetaInvitation(invitationId) {
  const res = await apiClient(`/admin/beta-invitations/${invitationId}/revoke`, {
    method: 'POST',
  });
  return res.data;
}

/**
 * Regenerate the invitation link with a new token (admin only).
 * Works for pending and revoked invitations. Blocked for accepted.
 * @param {string} invitationId - The invitation ID
 * @returns {Promise<Object>} { invitation, inviteUrl }
 */
export async function regenerateBetaInvitationLink(invitationId) {
  const res = await apiClient(`/admin/beta-invitations/${invitationId}/regenerate-link`, {
    method: 'POST',
  });
  return res.data;
}

/**
 * Permanently delete a beta invitation (admin only).
 * @param {string} invitationId - The invitation ID
 * @returns {Promise<Object>} { deleted: true, id }
 */
export async function deleteBetaInvitation(invitationId) {
  const res = await apiClient(`/admin/beta-invitations/${invitationId}`, {
    method: 'DELETE',
  });
  return res.data;
}
