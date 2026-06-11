import app from './app.js';
import env from './config/env.js';

// P-26C Debug log: verify CLASSROOM_OAUTH_ENABLED is loaded
// Remove after fixing - to be deleted
console.error('[server-start] CLASSROOM_OAUTH_ENABLED present:', Boolean(process.env.CLASSROOM_OAUTH_ENABLED));
console.error('[server-start] classroomOAuthEnabled:', env.classroomOAuthEnabled);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
