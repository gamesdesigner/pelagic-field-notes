import { getStore } from '@netlify/blobs';
import { createAuthHandler } from '../lib/auth-core.mjs';

export default async (request, context) => {
 try {
  const blobs = getStore({ name: 'marine-biology-private-accounts', consistency: 'strong' });
  const store = {
    async read(key) {
      const entry = await blobs.getWithMetadata(key, { type: 'json', consistency: 'strong' });
      return entry ? { value: entry.data, etag: entry.etag } : null;
    },
    async write(key, value, etag) {
      const result = await blobs.setJSON(key, value, etag ? { onlyIfMatch: etag } : { onlyIfNew: true });
      return result.modified;
    },
    async remove(key) { await blobs.delete(key); },
  };
  return await createAuthHandler({ store, clientIP: () => context.ip || 'unknown' })(request);
 } catch {
   return Response.json({ error: 'Accounts are temporarily unavailable. Please try again shortly.' }, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
 }
};
export const config = { path: '/api/auth' };
