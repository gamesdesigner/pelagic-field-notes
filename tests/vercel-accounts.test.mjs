import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {postgresAccountStore} from '../server/accounts/postgres-store.mjs';
import {createAuthHandler} from '../server/accounts/auth-core.mjs';
import {createStudentHandler} from '../server/accounts/student-core.mjs';
import authEndpoint from '../api/auth.js';
import studentsEndpoint from '../api/students.js';

const migration=await readFile(new URL('../migrations/postgres/001_account_records.sql',import.meta.url),'utf8');
const origin='https://marinebiology-learn.vercel.app';
const code='test-only-owner-bootstrap-code';
const get=(path,session)=>new Request(origin+path,{headers:session?{Cookie:session}:{}});
const post=(path,body,session)=>new Request(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(session?{Cookie:session}:{})},body:JSON.stringify(body)});
const cookie=response=>response.headers.get('set-cookie').split(';')[0];
async function setup(t){
 const db=new PGlite();t.after(()=>db.close());await db.exec(migration);
 const store=postgresAccountStore(db.query.bind(db));
 return {db,store,auth:createAuthHandler({store,ownerSignupCode:code}),students:createStudentHandler({store})};
}

test('Postgres records preserve JSON, reject stale writes and permit exactly one concurrent insert',async t=>{
 const {db,store}=await setup(t);
 const results=await Promise.all([store.write('settings/owner',{username:'one'}),store.write('settings/owner',{username:'two'})]);
 assert.deepEqual(results.sort(),[false,true]);
 const record=await store.read('settings/owner');
 assert.equal(await store.write('settings/owner',{username:'next'},record.etag),true);
 assert.equal(await store.write('settings/owner',{username:'stale'},record.etag),false);
 await db.exec(migration);
 assert.equal((await store.read('settings/owner')).value.username,'next');
 await store.remove('settings/owner');assert.equal(await store.read('settings/owner'),null);
});

test('Postgres prefix search treats underscore and SQL punctuation literally',async t=>{
 const {store}=await setup(t);
 for(const username of ['sea_a','seaba','sea_b',"x'; DROP TABLE marine_account_records; --"]){await store.write('users/'+username,{username});}
 assert.deepEqual(await store.list('users/sea_'),['users/sea_a','users/sea_b']);
 assert.equal((await store.read("users/x'; DROP TABLE marine_account_records; --")).value.username,"x'; DROP TABLE marine_account_records; --");
 assert.equal((await store.list('users/')).length,4);
});

test('Postgres supports short-password signup, durable owner sessions, student controls and revocation',async t=>{
 const {db,auth,students}=await setup(t);
 const claimed=await auth(post('/api/auth',{action:'owner-sign-up',username:'owner_reader',password:'a',setupCode:code}));
 assert.equal(claimed.status,200);const owner=cookie(claimed);
 const signup=await auth(post('/api/auth',{action:'sign-up',username:'student_reader',password:'a',email:'student@example.com'}));
 assert.equal(signup.status,200);const old=cookie(signup);
 const freshStore=postgresAccountStore(db.query.bind(db));
 const freshAuth=createAuthHandler({store:freshStore,ownerSignupCode:code});
 assert.equal((await (await freshAuth(get('/api/auth',owner))).json()).user.role,'owner');
 assert.equal((await students(get('/api/students',old))).status,403);
 const list=await (await students(get('/api/students',owner))).json();
 assert.equal(list.students[0].username,'student_reader');
 assert.doesNotMatch(JSON.stringify(list),/hash|salt|password|setupCode|sessionVersion/);
 assert.equal((await students(post('/api/students',{action:'pause',username:'student_reader'},owner))).status,200);
 assert.equal((await students(post('/api/students',{action:'activate',username:'student_reader'},owner))).status,200);
 assert.equal((await (await freshAuth(get('/api/auth',old))).json()).user,null);
 const login=await freshAuth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'a'}));
 assert.equal(login.status,200);
 assert.equal((await (await freshAuth(get('/api/auth',cookie(login)))).json()).user.username,'student_reader');
});

test('Vercel endpoints fail safely when persistent storage is not configured',async()=>{
 const saved=[process.env.DATABASE_URL,process.env.POSTGRES_URL];
 delete process.env.DATABASE_URL;delete process.env.POSTGRES_URL;
 try {
  for(const endpoint of [authEndpoint,studentsEndpoint]){
   const result=await endpoint.fetch(get('/api/auth'));
   assert.equal(result.status,503);assert.match(result.headers.get('content-type'),/application\/json/);
   assert.doesNotMatch(JSON.stringify(await result.json()),/postgres|DATABASE_URL|stack|password/i);
  }
 } finally {
  for(const [index,key] of ['DATABASE_URL','POSTGRES_URL'].entries())if(saved[index]===undefined)delete process.env[key];else process.env[key]=saved[index];
 }
});

test('Vercel SPA fallback leaves API responses intact',async()=>{
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
 const pattern=new RegExp('^'+config.rewrites[0].source+'$');
 assert.equal(pattern.test('/api/auth'),false);assert.equal(pattern.test('/api/students'),false);
 assert.equal(pattern.test('/ocean-currents'),true);assert.equal(pattern.test('/'),true);
});
