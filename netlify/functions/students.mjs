import { accountStore } from '../lib/blob-store.mjs';
import { createStudentHandler } from '../lib/student-core.mjs';
import { response } from '../lib/auth-core.mjs';

export default async request => {
  try { return await createStudentHandler({ store: accountStore() })(request); }
  catch { return response({ error: 'Student accounts are temporarily unavailable. Please try again shortly.' }, 503); }
};
export const config = { path: '/api/students' };
