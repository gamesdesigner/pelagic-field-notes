import * as vercelBlob from '@vercel/blob';

// All account data is private. Bypass CDN caches so pauses and session revocation
// take effect immediately. Conditional writes protect usernames and sole ownership.
export function vercelAccountStore({client=vercelBlob,prefix='marine-accounts/v1/'+(process.env.VERCEL_ENV==='production'?'production':'preview')+'/'}={}) {
  const path=key=>prefix+key+'.json';
  return {
    async read(key) {
      for(let attempt=0;attempt<3;attempt++){
        const blob=await client.get(path(key),{access:'private',useCache:false,headers:{'Accept-Encoding':'identity'}});
        if(!blob)return null;
        const value=await new Response(blob.stream).json();let etag=blob.blob.etag;
        // A delivery proxy may weaken the HTTP validator. Never pass that weak
        // tag to ifMatch or strip it and assume it is an authoritative version.
        // Confirm the same version through Blob's metadata API. If an overwrite
        // happened between the two reads, fetch the new body and try again.
        if(etag?.startsWith('W/')){
          const metadata=await client.head(path(key));
          if(!metadata.etag||metadata.etag.startsWith('W/'))throw Error('Storage did not return a strong version');
          if(etag!==`W/${metadata.etag}`)continue;
          etag=metadata.etag;
        }
        if(!etag)throw Error('Storage did not return a version');
        return {value,etag};
      }
      throw Error('Storage changed while reading its version');
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
