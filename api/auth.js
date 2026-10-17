import {ipAddress} from '@vercel/functions';
import {createAuthHandler,response} from '../server/accounts/auth-core.mjs';
import {accountStore} from '../server/accounts/vercel-store.mjs';

export default {
  async fetch(request) {
    try {
      return await createAuthHandler({store:accountStore(),clientIP:()=>ipAddress(request)||'unknown'})(request);
    } catch {
      return response({error:'Accounts are temporarily unavailable. Please try again shortly.'},503);
    }
  },
};
