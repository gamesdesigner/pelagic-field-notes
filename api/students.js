import {createStudentHandler} from '../server/accounts/student-core.mjs';
import {response} from '../server/accounts/auth-core.mjs';
import {accountStore} from '../server/accounts/vercel-store.mjs';

export default {
  async fetch(request) {
    try { return await createStudentHandler({store:accountStore()})(request); }
    catch { return response({error:'Student accounts are temporarily unavailable. Please try again shortly.'},503); }
  },
};
