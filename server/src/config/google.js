import env from './env.js';

let oauth2ClientPromise;

/**
 * Get OAuth2 client for Google APIs.
 *
 * @param {string} [redirectUri] - Optional redirect URI. If not provided,
 *   uses env.googleRedirectUri (the main login redirect URI).
 *   For Classroom OAuth, pass `env.clientOrigin + '/api/classroom/oauth/callback'`.
 */
export async function getOauth2Client(redirectUri) {
  // If redirectUri is provided, we need a new client with that URI
  // (cannot reuse the singleton with different redirect URI)
  if (redirectUri) {
    const { google } = await import('googleapis');
    return new google.auth.OAuth2(
      env.googleClientId,
      env.googleClientSecret,
      redirectUri
    );
  }

  // Use singleton for default redirect URI (login flow)
  if (!oauth2ClientPromise) {
    oauth2ClientPromise = import('googleapis').then(({ google }) => (
      new google.auth.OAuth2(
        env.googleClientId,
        env.googleClientSecret,
        env.googleRedirectUri
      )
    ));
  }

  return oauth2ClientPromise;
}
