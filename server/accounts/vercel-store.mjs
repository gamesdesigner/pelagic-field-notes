import * as vercelBlob from '@vercel/blob';

// All account data is private. Bypass CDN caches so pauses and session revocation
// take effect immediately. Conditional writes protect usernames and sole ownership.
export function vercelAccountStore({client=vercelBlob,prefix='marine-accounts/v1/'+(process.env.VERCEL_ENV==='production'?'production':'preview')+'/'}={}) {
  const path=key=>prefix+key+'.json';
  return {
    async read(key) {
      const blob=await client.get(path(key),{access:'private',useCache:false});
      if(!blob)return null;
      return {value:await new Response(blob.stream).json(),etag:blob.blob.etag};
    },
    async write(key,value,etag) {
      try {
        await client.put(path(key),JSON.stringify(value),{access:'private',addRandomSuffix:false,allowOverwrite:!!etag,...(etag?{ifMatch:etag}:{}),contentType:'application/json',cacheControlMaxAge:60});
        return true;
      } catch(error) {
        if(error instanceof vercelBlob.BlobPreconditionFailedError)return false;
        // Duplicate insert errors are generic BlobError in the SDK. Confirm the
        // record exists before reporting a conflict; propagate real outages.
        if(!etag&&await this.read(key))return false;
        throw error;
      }
    },
    async remove(key) {await client.del(path(key));},
    async list(keyPrefix) {
      let cursor;const keys=[];
      do {
        const page=await client.list({prefix:prefix+keyPrefix,cursor,limit:1000});
        keys.push(...page.blobs.filter(blob=>blob.pathname.endsWith('.json')).map(blob=>blob.pathname.slice(prefix.length,-5)));
        if(!page.hasMore)break;
        if(!page.cursor||page.cursor===cursor)throw Error('Account listing did not advance');
        cursor=page.cursor;
      } while(true);
      return keys.sort();
    },
  };
}

export function accountStore(environment=process.env) {
  if(!environment.BLOB_READ_WRITE_TOKEN&&!(environment.BLOB_STORE_ID&&environment.VERCEL_OIDC_TOKEN))throw Error('Private account storage is not configured');
  return vercelAccountStore();
}
