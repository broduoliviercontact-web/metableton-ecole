import supabase from '../config/supabase.js';

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
