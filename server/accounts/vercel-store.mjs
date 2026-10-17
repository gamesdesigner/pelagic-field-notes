import {neon} from '@neondatabase/serverless';
import {postgresAccountStore} from './postgres-store.mjs';

let cached;
export function accountStore(environment=process.env) {
  const url=environment.DATABASE_URL || environment.POSTGRES_URL;
  if(!url)throw Error('Account database is not configured.');
  if(!cached || cached.url!==url) {
    const sql=neon(url);
    cached={url,store:postgresAccountStore((text,values)=>sql.query(text,values))};
  }
  return cached.store;
}
