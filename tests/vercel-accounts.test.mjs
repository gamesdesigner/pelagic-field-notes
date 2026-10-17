import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {BlobPreconditionFailedError} from '@vercel/blob';
import {vercelAccountStore} from '../server/accounts/vercel-store.mjs';
import {createAuthHandler} from '../server/accounts/auth-core.mjs';
import {createStudentHandler} from '../server/accounts/student-core.mjs';
import authEndpoint from '../api/auth.js';
import studentsEndpoint from '../api/students.js';

const origin='https://marinebiology-learn.vercel.app';
const code='test-only-owner-bootstrap-code';
const get=(path,session)=>new Request(origin+path,{headers:session?{Cookie:session}:{}});
const post=(path,body,session)=>new Request(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(session?{Cookie:session}:{})},body:JSON.stringify(body)});
const cookie=response=>response.headers.get('set-cookie').split(';')[0];

function fixture(){
 const rows=new Map();let sequence=0;
 return {
  async get(key,options){
   assert.equal(options.access,'private');assert.equal(options.useCache,false);
   const row=rows.get(key);return row?{stream:new Response(row.value).body,blob:{etag:row.etag}}:null;
  },
  async put(key,value,options){
   assert.equal(options.access,'private');assert.equal(options.addRandomSuffix,false);
   if(options.ifMatch&&rows.get(key)?.etag!==options.ifMatch)throw new BlobPreconditionFailedError();
   if(!options.allowOverwrite&&rows.has(key))throw Error('Duplicate blob');
   rows.set(key,{value,etag:String(++sequence)});
  },
  async del(key){rows.delete(key);},
  async list({prefix,cursor}){
   const keys=[...rows.keys()].filter(key=>key.startsWith(prefix)).sort();const start=Number(cursor||0);
   return{blobs:keys.slice(start,start+2).map(pathname=>({pathname})),hasMore:keys.length>start+2,cursor:String(start+2)};
  },
 };
}

async function exerciseStore(store){
 const inserts=await Promise.all([store.write('settings/concurrent',{username:'one'}),store.write('settings/concurrent',{username:'two'})]);
 assert.deepEqual(inserts.sort(),[false,true]);
 const record=await store.read('settings/concurrent');
 assert.equal(await store.write('settings/concurrent',{username:'next'},record.etag),true);
 assert.equal(await store.write('settings/concurrent',{username:'stale'},record.etag),false);
 assert.equal((await store.read('settings/concurrent')).value.username,'next');
 await store.remove('settings/concurrent');assert.equal(await store.read('settings/concurrent'),null);
 for(const username of ['sea_a','seaba','sea_b'])await store.write('users/'+username,{username});
 assert.deepEqual(await store.list('users/sea_'),['users/sea_a','users/sea_b']);
 assert.equal((await store.list('users/')).length,3);
}

async function exerciseAccounts(store){
 const auth=createAuthHandler({store,ownerSignupCode:code});const students=createStudentHandler({store});
 const claims=await Promise.all(['owner_first','owner_second'].map(username=>auth(post('/api/auth',{action:'owner-sign-up',username,password:'a',setupCode:code}))));
 assert.deepEqual(claims.map(row=>row.status).sort(),[200,409]);const claimed=claims.find(row=>row.status===200);const owner=cookie(claimed);
 const signup=await auth(post('/api/auth',{action:'sign-up',username:'student_reader',password:'a',email:'student@example.com'}));
 assert.equal(signup.status,200);const old=cookie(signup);
 const freshAuth=createAuthHandler({store,ownerSignupCode:code});
 assert.equal((await (await freshAuth(get('/api/auth',owner))).json()).user.role,'owner');
 assert.equal((await students(get('/api/students',old))).status,403);
 const list=await (await students(get('/api/students',owner))).json();
 assert.ok(list.students.some(row=>row.username==='student_reader'));
 assert.doesNotMatch(JSON.stringify(list),/hash|salt|password|setupCode|sessionVersion/);
 assert.equal((await students(post('/api/students',{action:'pause',username:'student_reader'},owner))).status,200);
 assert.equal((await students(post('/api/students',{action:'activate',username:'student_reader'},owner))).status,200);
 assert.equal((await (await freshAuth(get('/api/auth',old))).json()).user,null);
 const login=await freshAuth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'a'}));
 assert.equal(login.status,200);
 assert.equal((await (await freshAuth(get('/api/auth',cookie(login)))).json()).user.username,'student_reader');
 await freshAuth(post('/api/auth',{action:'sign-out'},cookie(login)));
 assert.equal((await (await freshAuth(get('/api/auth',cookie(login)))).json()).user,null);
}

test('Vercel Blob uses private uncached reads, conditional writes and complete paginated lists',async()=>{
 await exerciseStore(vercelAccountStore({client:fixture(),prefix:'test/'}));
});
test('Vercel Blob adapter preserves single ownership, short passwords and immediate session revocation',async()=>{
 await exerciseAccounts(vercelAccountStore({client:fixture(),prefix:'test/'}));
});
test('Vercel Blob storage failures propagate instead of pretending records are missing',async()=>{
 const store=vercelAccountStore({client:{get(){throw Error('Storage unavailable');},put(){throw Error('Storage unavailable');}}});
 await assert.rejects(()=>store.read('settings/owner'));await assert.rejects(()=>store.write('settings/owner',{username:'owner'}));
});
test('Vercel endpoints fail safely when persistent storage is not configured',async()=>{
 const keys=['BLOB_READ_WRITE_TOKEN','BLOB_STORE_ID','VERCEL_OIDC_TOKEN'];const saved=keys.map(key=>process.env[key]);
 keys.forEach(key=>delete process.env[key]);
 try {
  for(const endpoint of [authEndpoint,studentsEndpoint]){
   const result=await endpoint.fetch(get('/api/auth'));
   assert.equal(result.status,503);assert.match(result.headers.get('content-type'),/application\/json/);
   assert.doesNotMatch(JSON.stringify(await result.json()),/BLOB_|stack|password/i);
  }
 } finally {keys.forEach((key,i)=>saved[i]===undefined?delete process.env[key]:process.env[key]=saved[i]);}
});
test('Vercel SPA fallback leaves API responses intact',async()=>{
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
 const pattern=new RegExp('^'+config.rewrites[0].source+'$');
 assert.equal(pattern.test('/api/auth'),false);assert.equal(pattern.test('/api/students'),false);
 assert.equal(pattern.test('/ocean-currents'),true);assert.equal(pattern.test('/'),true);
});
test('live private Vercel Blob integration: races, fresh reads, owner controls and cleanup',{skip:!process.env.MARINE_BLOB_INTEGRATION},async()=>{
 const store=vercelAccountStore({prefix:'marine-accounts/integration/'+randomUUID()+'/'});
 try {await exerciseStore(store);await exerciseAccounts(store);}
 finally {for(const key of await store.list(''))await store.remove(key);}
});
