import { google } from 'googleapis';
import env from './env.js';

const oauth2Client = new google.auth.OAuth2(
  env.googleClientId,
  env.googleClientSecret,
  env.googleRedirectUri
);

export default oauth2Client;
