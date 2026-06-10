import env from './env.js';

let oauth2ClientPromise;

export async function getOauth2Client() {
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
