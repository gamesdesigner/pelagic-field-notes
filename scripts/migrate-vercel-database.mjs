import {readFile} from 'node:fs/promises';
import {neon} from '@neondatabase/serverless';

const url=process.env.DATABASE_URL || process.env.POSTGRES_URL;
if(!url) {
  process.stderr.write('Set DATABASE_URL for the Vercel account database before running this migration.\n');
  process.exitCode=1;
} else {
  try {
    const sql=neon(url);
    const migration=await readFile(new URL('../migrations/postgres/001_account_records.sql',import.meta.url),'utf8');
    await sql.query(migration);
    process.stdout.write('Account database schema is ready.\n');
  } catch {
    process.stderr.write('Account database migration failed. Check database access; no credentials were logged.\n');
    process.exitCode=1;
  }
}
