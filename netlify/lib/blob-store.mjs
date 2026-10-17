import { getStore } from '@netlify/blobs';

export function accountStore() {
  const blobs = getStore({ name: 'marine-biology-private-accounts', consistency: 'strong' });
  return {
    async read(key) {
      const entry = await blobs.getWithMetadata(key, { type: 'json', consistency: 'strong' });
      return entry ? { value: entry.data, etag: entry.etag } : null;
    },
    async write(key, value, etag) {
      const result = await blobs.setJSON(key, value, etag ? { onlyIfMatch: etag } : { onlyIfNew: true });
      return result.modified;
    },
    async remove(key) { await blobs.delete(key); },
    async list(prefix) { return (await blobs.list({ prefix })).blobs.map(blob => blob.key); },
  };
}
