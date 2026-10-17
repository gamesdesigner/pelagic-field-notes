import { accountStore } from '../lib/blob-store.mjs';
import { createAuthHandler } from '../lib/auth-core.mjs';

export default async (request, context) => {
 try {
  return await createAuthHandler({ store: accountStore(), clientIP: () => context.ip || 'unknown', ownerSignupCode: process.env.MARINE_OWNER_SETUP_CODE || '' })(request);
 } catch {
   return Response.json({ error: 'Accounts are temporarily unavailable. Please try again shortly.' }, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
 }
};
export const config = { path: '/api/auth' };
