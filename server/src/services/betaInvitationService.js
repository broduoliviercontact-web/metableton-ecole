import crypto from 'node:crypto';
import { getSupabase } from '../config/supabase.js';

/**
 * Generate a random token for beta invitation.
 * Returns a URL-safe base64 string (32 bytes = 43 chars).
 */
export function generateRawToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a random salt for token hashing.
 * Returns a hex string (16 bytes = 32 chars).
 */
export function generateTokenSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash a token with salt using SHA-256.
 * Format: SHA256(salt:token)
 */
export function hashToken(token, salt) {
  return crypto
    .createHash('sha256')
    .update(`${salt}:${token}`)
    .digest('hex');
}

/**
 * Normalize email to lowercase for consistent matching.
 */
export function normalizeEmail(email) {
  return (email || '').toLowerCase().trim();
}

/**
 * Create a new beta invitation.
 * Returns the invitation with the raw token (to be sent to admin).
 * The token is NEVER stored in the database - only the hash + salt.
 *
 * @param {Object} params
 * @param {string} params.email - Email of the invitee
 * @param {string} params.role - Role: student, teacher, or admin
 * @param {string} [params.expiresAt] - ISO timestamp for expiration
 * @param {string} [params.notes] - Internal notes for admin
 * @param {string} params.createdBy - User ID of the admin creating the invitation
 * @returns {Promise<{ invitation: Object, rawToken: string }>}
 */
export async function createBetaInvitation({
  email,
  role,
  expiresAt,
  notes,
  createdBy,
}) {
  const supabase = await getSupabase();

  // Normalize and validate email
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw Object.assign(
      new Error('Email is required'),
      { statusCode: 400, code: 'VALIDATION_ERROR' }
    );
  }

  // Validate role
  const validRoles = ['student', 'teacher', 'admin'];
  if (!validRoles.includes(role)) {
    throw Object.assign(
      new Error(`Role must be one of: ${validRoles.join(', ')}`),
      { statusCode: 400, code: 'INVITATION_ROLE_INVALID' }
    );
  }

  // Warn if admin role is being used
  if (role === 'admin') {
    console.warn(
      `WARNING: Creating beta invitation with admin role for ${normalizedEmail}. ` +
      'Use admin role with extreme caution.'
    );
  }

  // Generate token and salt
  const rawToken = generateRawToken();
  const salt = generateTokenSalt();
  const tokenHash = hashToken(rawToken, salt);

  // Parse expiresAt if provided
  let parsedExpiresAt = null;
  if (expiresAt) {
    parsedExpiresAt = new Date(expiresAt).toISOString();
  }

  // Insert the invitation
  const { data: invitation, error } = await supabase
    .from('beta_invitations')
    .insert({
      email: normalizedEmail,
      role,
      token_hash: tokenHash,
      token_salt: salt,
      status: 'pending',
      expires_at: parsedExpiresAt,
      created_by: createdBy,
      notes,
    })
    .select('id, email, role, status, expires_at, created_at, updated_at, notes')
    .single();

  if (error) throw error;

  return {
    invitation,
    rawToken,
  };
}

/**
 * Get an invitation by its raw token.
 * Returns the invitation with masked email, or null if not found.
 * Checks status, expiration, and validity.
 *
 * @param {string} token - Raw token from URL
 * @returns {Promise<Object|null>} Invitation data or null
 */
export async function getBetaInvitationByToken(token) {
  const supabase = await getSupabase();

  if (!token) {
    throw Object.assign(
      new Error('Token is required'),
      { statusCode: 400, code: 'VALIDATION_ERROR' }
    );
  }

  // Get the salt and hash from the database by token
  const salt = await getSaltByToken(token, supabase);
  if (!salt) {
    return null;
  }

  // Get the invitation
  const { data: invitation, error } = await supabase
    .from('beta_invitations')
    .select(`
      id,
      email,
      role,
      status,
      expires_at,
      accepted_at,
      accepted_user_id,
      created_at,
      updated_at,
      notes
    `)
    .eq('token_hash', hashToken(token, salt))
    .maybeSingle();

  if (error) throw error;
  if (!invitation) {
    return null;
  }

  // Check expiration
  if (invitation.expires_at) {
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    if (now > expiresAt) {
      return {
        status: 'expired',
        message: 'Cette invitation a expiré.',
      };
    }
  }

  // Check status
  if (invitation.status === 'revoked') {
    return {
      status: 'revoked',
      message: 'Cette invitation a été révoquée.',
    };
  }

  if (invitation.status === 'accepted') {
    return {
      status: 'accepted',
      message: 'Cette invitation a déjà été utilisée.',
    };
  }

  // Return masked email for display
  const maskedEmail = maskEmail(invitation.email);

  return {
    ...invitation,
    email: maskedEmail,
  };
}

/**
 * Get the salt for a token (internal helper).
 * Used to verify the token without storing it.
 */
async function getSaltByToken(token, supabase) {
  // First get the token_hash
  const tokenHash = hashToken(token, 'dummy');
  // Then query with the actual hash to get the salt
  // This requires storing the hash in the query first
  // We'll do it differently: hash the token and query directly
  const hashedToken = hashToken(token, '');
  const { data, error } = await supabase
    .from('beta_invitations')
    .select('token_salt')
    .eq('token_hash', hashedToken)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return data.token_salt;
}

/**
 * Accept a beta invitation after Google OAuth.
 * Updates the invitation status, user role, and session.
 *
 * @param {Object} params
 * @param {string} params.token - Raw token from URL
 * @param {string} params.userId - User ID from session
 * @param {string} params.userEmail - Email from Google profile
 * @returns {Promise<{ status: string, role: string, redirectTo: string }>}
 */
export async function acceptBetaInvitation({ token, userId, userEmail }) {
  const supabase = await getSupabase();

  if (!token) {
    throw Object.assign(
      new Error('Token is required'),
      { statusCode: 400, code: 'VALIDATION_ERROR' }
    );
  }

  if (!userId) {
    throw Object.assign(
      new Error('User ID is required'),
      { statusCode: 400, code: 'VALIDATION_ERROR' }
    );
  }

  // Verify the token and get the invitation
  const salt = await getSaltByToken(token, supabase);
  if (!salt) {
    throw Object.assign(
      new Error('Invitation not found'),
      { statusCode: 404, code: 'INVITATION_NOT_FOUND' }
    );
  }

  const { data: invitation, error: lookupError } = await supabase
    .from('beta_invitations')
    .select(`
      id,
      email,
      role,
      status,
      expires_at,
      accepted_at,
      accepted_user_id
    `)
    .eq('token_hash', hashToken(token, salt))
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (!invitation) {
    throw Object.assign(
      new Error('Invitation not found'),
      { statusCode: 404, code: 'INVITATION_NOT_FOUND' }
    );
  }

  // Check expiration
  if (invitation.expires_at) {
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    if (now > expiresAt) {
      throw Object.assign(
        new Error('This invitation has expired'),
        { statusCode: 410, code: 'INVITATION_EXPIRED' }
      );
    }
  }

  // Check status
  if (invitation.status === 'revoked') {
    throw Object.assign(
      new Error('This invitation has been revoked'),
      { statusCode: 410, code: 'INVITATION_REVOKED' }
    );
  }

  if (invitation.status === 'accepted') {
    throw Object.assign(
      new Error('This invitation has already been used'),
      { statusCode: 409, code: 'INVITATION_ALREADY_ACCEPTED' }
    );
  }

  // Check email match
  const normalizedInviteEmail = normalizeEmail(invitation.email);
  const normalizedUserEmail = normalizeEmail(userEmail);
  if (normalizedInviteEmail !== normalizedUserEmail) {
    throw Object.assign(
      new Error('You must sign in with the Google account that was invited'),
      { statusCode: 403, code: 'INVITATION_EMAIL_MISMATCH' }
    );
  }

  // Update the invitation
  const { error: updateError } = await supabase
    .from('beta_invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      accepted_user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', invitation.id);

  if (updateError) throw updateError;

  // Update the user's role if it's an upgrade
  // Don't downgrade from admin or teacher
  // Allow student -> teacher, student -> admin
  // Don't allow teacher -> student, admin -> student, admin -> teacher
  if (invitation.role !== 'student') {
    const currentRole = invitation.role === 'admin' ? 'admin' :
                       invitation.role === 'teacher' ? 'teacher' :
                       'student';
    const userRole = invitation.role;

    // Only upgrade if user is currently below the invitation role
    const currentRoleValue = { admin: 2, teacher: 1, student: 0 }[currentRole] || 0;
    const newRoleValue = { admin: 2, teacher: 1, student: 0 }[userRole] || 0;

    if (newRoleValue > currentRoleValue) {
      const { error: roleError } = await supabase
        .from('profiles')
        .update({
          role: userRole,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (roleError) {
        console.error('Failed to update user role:', roleError);
        // Don't fail the invitation if role update fails
      }
    }
  }

  // Get the dashboard path for the role
  const dashboardPaths = {
    student: '/dashboard',
    teacher: '/dashboard/teacher',
    admin: '/dashboard/admin',
  };

  return {
    status: 'accepted',
    role: invitation.role,
    redirectTo: dashboardPaths[invitation.role] || '/dashboard',
  };
}

/**
 * List all beta invitations (admin only).
 * Excludes token_hash and token_salt from response.
 *
 * @returns {Promise<Array>} List of invitations
 */
export async function listBetaInvitations() {
  const supabase = await getSupabase();

  const { data: invitations, error } = await supabase
    .from('beta_invitations')
    .select(`
      id,
      email,
      role,
      status,
      expires_at,
      accepted_at,
      created_at,
      updated_at,
      notes
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Mask emails for security
  return invitations.map(inv => ({
    ...inv,
    email: maskEmail(inv.email),
  }));
}

/**
 * Revoke a pending beta invitation.
 * Only pending invitations can be revoked.
 *
 * @param {string} invitationId - ID of the invitation to revoke
 * @param {string} adminUserId - ID of the admin performing the revocation
 * @returns {Promise<Object>} Updated invitation
 */
export async function revokeBetaInvitation(invitationId, adminUserId) {
  const supabase = await getSupabase();

  // First, check if the invitation exists and is pending
  const { data: invitation, error: lookupError } = await supabase
    .from('beta_invitations')
    .select('id, status, created_by')
    .eq('id', invitationId)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (!invitation) {
    throw Object.assign(
      new Error('Invitation not found'),
      { statusCode: 404, code: 'INVITATION_NOT_FOUND' }
    );
  }

  // Only pending invitations can be revoked
  if (invitation.status !== 'pending') {
    throw Object.assign(
      new Error('Only pending invitations can be revoked'),
      { statusCode: 400, code: 'INVALID_STATUS' }
    );
  }

  // Verify admin ownership (only admin who created can revoke, or any admin)
  // For simplicity, allow any admin to revoke
  // If we want strict ownership: check invitation.created_by === adminUserId

  // Revoke the invitation
  const { error: updateError } = await supabase
    .from('beta_invitations')
    .update({
      status: 'revoked',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invitationId);

  if (updateError) throw updateError;

  return {
    id: invitationId,
    status: 'revoked',
    revoked_at: new Date().toISOString(),
  };
}

/**
 * Mask an email for display (show first 2 chars + ***).
 * Example: "test@example.com" -> "te***@example.com"
 */
function maskEmail(email) {
  if (!email) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return email;

  const localPart = parts[0];
  const domain = parts[1];

  if (localPart.length <= 2) {
    return `${localPart}***@${domain}`;
  }

  return `${localPart.substring(0, 2)}***@${domain}`;
}
