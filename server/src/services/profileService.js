import { getSupabase } from '../config/supabase.js';

// Columns to return for user profile data
const USER_COLUMNS = 'id, email, display_name, avatar_url, role, created_at, updated_at';

/**
 * Find an existing profile by Google subject, or create one.
 *
 * Admin bootstrap: the first profile ever created gets role 'admin'.
 * All subsequent new profiles default to 'student'.
 *
 * Returning users get their email, display name, and avatar updated
 * from the latest Google token data. Their role is NEVER overwritten.
 *
 * @param {Object} params
 * @param {string} params.googleSub   - Google account unique ID (sub claim)
 * @param {string} params.email       - Google account email
 * @param {string} params.displayName - Google account display name
 * @param {string|null} params.avatarUrl - Google account avatar URL
 * @returns {Promise<{ userId: string, role: string }>}
 */
export async function findOrCreateGoogleProfile({
  googleSub,
  email,
  displayName,
  avatarUrl,
}) {
  const supabase = await getSupabase();

  // 1. Look up existing profile by Google sub
  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('google_sub', googleSub)
    .maybeSingle();

  if (lookupError) throw lookupError;

  // 2. Returning user — update metadata, preserve role
  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from('profiles')
      .update({
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('id, role')
      .single();

    if (updateError) throw updateError;

    return { userId: updated.id, role: updated.role };
  }

  // 3. New user — determine role via admin bootstrap
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  // ADMIN BOOTSTRAP: first user ever → admin, everyone else → student
  const assignedRole = count === 0 ? 'admin' : 'student';

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({
      google_sub: googleSub,
      email,
      display_name: displayName,
      avatar_url: avatarUrl,
      role: assignedRole,
    })
    .select('id, role')
    .single();

  if (insertError) throw insertError;

  return { userId: created.id, role: created.role };
}

/**
 * Get the current user's profile by session ID.
 * Returns full profile data for the user in the session.
 * Updates email, display_name, avatar_url from Google if they're missing.
 * @param {string} userId - The user ID from session
 * @param {Object} [googleProfile] - Optional Google profile data to update if missing
 * @returns {Promise<Object|null>} User profile with email, display_name, avatar_url, role, created_at
 */
export async function getCurrentUserProfile(userId, googleProfile) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select(USER_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;

  // If profile exists but missing Google data, update it
  if (data && googleProfile) {
    const needsUpdate =
      (!data.email || !data.display_name || !data.avatar_url) &&
      (googleProfile.email || googleProfile.displayName || googleProfile.avatarUrl);

    if (needsUpdate) {
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({
          email: googleProfile.email || data.email,
          display_name: googleProfile.displayName || data.display_name,
          avatar_url: googleProfile.avatarUrl || data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select(USER_COLUMNS)
        .maybeSingle();

      if (updateError) throw updateError;
      return updated;
    }
  }

  return data;
}
