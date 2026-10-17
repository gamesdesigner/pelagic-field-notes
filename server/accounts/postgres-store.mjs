import { randomUUID } from 'node:crypto';

// Conditional writes preserve singleton ownership and concurrent signup safety.
// The caller supplies a parameterized query function; request data never forms SQL.
export function postgresAccountStore(query) {
  async function rows(text, values) {
    const result = await query(text, values);
    return Array.isArray(result) ? result : result.rows;
  }
  return {
    async read(key) {
      const [row] = await rows('SELECT value, revision FROM marine_account_records WHERE key = $1', [key]);
      return row ? {value:typeof row.value==='string'?JSON.parse(row.value):row.value,etag:row.revision} : null;
    },
    async write(key,value,etag) {
      const revision=randomUUID();
      const result=etag
        ? await rows('UPDATE marine_account_records SET value = $1::jsonb, revision = $2 WHERE key = $3 AND revision = $4 RETURNING key',[JSON.stringify(value),revision,key,etag])
        : await rows('INSERT INTO marine_account_records (key, value, revision) VALUES ($1, $2::jsonb, $3) ON CONFLICT (key) DO NOTHING RETURNING key',[key,JSON.stringify(value),revision]);
      return result.length===1;
    },
    async remove(key) { await rows('DELETE FROM marine_account_records WHERE key = $1',[key]); },
    async list(prefix) {
      const result=await rows('SELECT key FROM marine_account_records WHERE starts_with(key, $1) ORDER BY key COLLATE "C"',[prefix]);
      return result.map(row=>row.key);
    },
  };
}
