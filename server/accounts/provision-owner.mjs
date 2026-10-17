import {normalizeUsername,validUsername,passwordRecord,reserveName} from './auth-core.mjs';

// Administrative setup only. Never expose this operation through a public API.
export async function provisionOwner({store,username,password,now=()=>Date.now()}){
 if(!validUsername(username)||typeof password!=='string'||!password.length||password.length>128)throw Error('Valid owner credentials are required');
 const owner=await store.read('settings/owner');
 const key=owner?.value.accountKey||'users/'+normalizeUsername(owner?.value.username||username);
 const existing=await store.read(key);
 if(!owner&&existing)throw Error('The requested owner name belongs to an existing student; no account was overwritten');
 if(owner&&!existing)throw Error('The existing owner record needs repair before setup');
 if(!await reserveName(store,username,key))throw Error('Owner name is already reserved by another account');
 const value={...existing?.value,username:username.trim(),...await passwordRecord(password),created:existing?.value.created||now(),sessionVersion:(existing?.value.sessionVersion||0)+1,disabled:false};
 if(!owner){
  if(!await store.write(key,value))throw Error('Owner account changed during setup');
  if(!await store.write('settings/owner',{accountKey:key,username:username.trim(),created:now()}))throw Error('Ownership was claimed elsewhere');
 }else{
  if(!await store.write('settings/owner',{...owner.value,accountKey:key,username:username.trim()},owner.etag))throw Error('Owner changed during setup');
  if(!await store.write(key,value,existing.etag))throw Error('Owner account changed during setup');
 }
 return {username:value.username};
}
