import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAuthHandler,createMemoryStore,normalizeUsername} from '../server/accounts/auth-core.mjs';
import {createStudentHandler} from '../server/accounts/student-core.mjs';
import {provisionOwner} from '../server/accounts/provision-owner.mjs';
const origin='https://marinebiology-learn.vercel.app';
const cookie=r=>r.headers.get('set-cookie').split(';')[0];
const post=(path,body,session,site=origin)=>new Request(origin+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:site,...(session?{Cookie:session}:{})},body:JSON.stringify(body)});
const get=(path,session)=>new Request(origin+path,{headers:session?{Cookie:session}:{}});
async function setup(){const store=createMemoryStore();await provisionOwner({store,username:'Test Owner',password:'test-owner-password'});const auth=createAuthHandler({store});const students=createStudentHandler({store});const owner=cookie(await auth(post('/api/auth',{action:'sign-in',username:'test owner',password:'test-owner-password'})));return{store,auth,students,owner};}
const signup=(auth,username)=>auth(post('/api/auth',{action:'sign-up',username,password:'a'}));

test('owner signup endpoint and availability are removed',async()=>{
 const {auth}=await setup();assert.deepEqual(await (await auth(get('/api/auth'))).json(),{user:null});
 assert.equal((await auth(post('/api/auth',{action:'owner-sign-up',username:'other_owner',password:'a'}))).status,400);
});
test('provisioned owner signs in normally with spaces and case-insensitive name',async()=>{
 const {auth,owner}=await setup();assert.equal((await (await auth(get('/api/auth',owner))).json()).user.role,'owner');
 const r=await auth(post('/api/auth',{action:'sign-in',username:'TEST OWNER',password:'test-owner-password'}));assert.deepEqual((await r.json()).user,{username:'Test Owner',role:'owner'});
});
test('current password is required for any credential change',async()=>{
 const {auth,owner}=await setup();
 for(const change of [{newPassword:'b'},{newUsername:'New Owner'}]){
  assert.equal((await auth(post('/api/auth',{action:'update-account',currentPassword:'wrong',...change},owner))).status,401);
  assert.equal((await auth(post('/api/auth',{action:'update-account',currentPassword:'test-owner-password',...change}))).status,401);
 }
 assert.equal((await auth(post('/api/auth',{action:'update-account',currentPassword:'test-owner-password',newPassword:'b'},owner,'https://other.example'))).status,403);
});
test('username changes preserve ownership and student records, revoke old sessions and prevent name takeovers',async()=>{
 const {auth,owner,students}=await setup();await signup(auth,'student_reader');
 const r=await auth(post('/api/auth',{action:'update-account',currentPassword:'test-owner-password',newUsername:'New Owner'},owner));assert.equal(r.status,200);assert.deepEqual((await r.json()).user,{username:'New Owner',role:'owner'});
 assert.equal((await (await auth(get('/api/auth',owner))).json()).user,null);
 assert.equal((await auth(post('/api/auth',{action:'sign-in',username:'Test Owner',password:'test-owner-password'}))).status,401);
 const login=await auth(post('/api/auth',{action:'sign-in',username:'NEW OWNER',password:'test-owner-password'}));assert.equal(login.status,200);
 assert.equal((await (await students(get('/api/students',cookie(login)))).json()).students[0].username,'student_reader');
 assert.equal((await signup(auth,'test owner')).status,409);assert.equal((await signup(auth,'new owner')).status,409);
});
test('password change persists, rejects old password and rotates the current session',async()=>{
 const {auth}=await setup();const r=await signup(auth,'student_reader');const old=cookie(r);
 const updated=await auth(post('/api/auth',{action:'update-account',currentPassword:'a',newPassword:'🌊'},old));assert.equal(updated.status,200);
 assert.equal((await (await auth(get('/api/auth',old))).json()).user,null);
 assert.equal((await (await auth(get('/api/auth',cookie(updated)))).json()).user.username,'student_reader');
 assert.equal((await auth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'a'}))).status,401);
 assert.equal((await auth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'🌊'}))).status,200);
});
test('conflicting, empty and invalid updates preserve the existing account',async()=>{
 const {auth,owner}=await setup();await signup(auth,'already_taken');
 for(const [change,status] of [[{newUsername:'already_taken'},409],[{newUsername:'../other'},400],[{newPassword:''},400],[{},400]])assert.equal((await auth(post('/api/auth',{action:'update-account',currentPassword:'test-owner-password',...change},owner))).status,status);
 assert.equal((await (await auth(get('/api/auth',owner))).json()).user.username,'Test Owner');
});
test('legacy users, sessions and owner pointers survive upgrade and rename',async()=>{
 const {store,auth}=await setup();const row=await store.read('users/test owner');
 await store.remove('names/test owner');const ownerRow=await store.read('settings/owner');await store.write('settings/owner',{username:'Test Owner',created:1},ownerRow.etag);
 const {createHash}=await import('node:crypto');const token='a'.repeat(64);await store.write('sessions/'+createHash('sha256').update(token).digest('hex'),{username:'test owner',sessionVersion:row.value.sessionVersion,expires:Date.now()+100000});
 assert.equal((await (await auth(get('/api/auth','mb_session='+token))).json()).user.role,'owner');
 const r=await auth(post('/api/auth',{action:'update-account',currentPassword:'test-owner-password',newUsername:'Updated Owner'},'mb_session='+token));assert.equal(r.status,200);assert.equal((await r.json()).user.role,'owner');
});
test('students cannot spoof owner permissions, and listing keeps hashes private',async()=>{
 const {auth,students,owner}=await setup();const r=await auth(post('/api/auth',{action:'sign-up',username:'Student Reader',password:'a',email:'reader@example.com',role:'owner'}));assert.equal((await r.json()).user.role,undefined);
 assert.equal((await students(get('/api/students',cookie(r)))).status,403);
 const list=await (await students(get('/api/students',owner))).json();assert.equal(list.students[0].username,'Student Reader');assert.doesNotMatch(JSON.stringify(list),/hash|salt|password|sessionVersion|Test Owner/);
});
test('renamed students remain searchable and pause revokes sessions permanently',async()=>{
 const {auth,students,owner}=await setup();const original=cookie(await signup(auth,'student_reader'));
 const renamed=await auth(post('/api/auth',{action:'update-account',currentPassword:'a',newUsername:'Ocean Reader'},original));const session=cookie(renamed);
 const list=await (await students(get('/api/students?search=ocean',owner))).json();assert.equal(list.students[0].username,'Ocean Reader');
 assert.equal((await students(post('/api/students',{action:'pause',username:'Ocean Reader'},owner))).status,200);
 assert.equal((await students(post('/api/students',{action:'activate',username:'Ocean Reader'},owner))).status,200);
 assert.equal((await (await auth(get('/api/auth',session))).json()).user,null);
 assert.equal((await auth(post('/api/auth',{action:'sign-in',username:'Ocean Reader',password:'a'}))).status,200);
});
test('owner search and pagination work with stable keys and spaced names',async()=>{
 const {auth,students,store,owner}=await setup();
 for(let i=0;i<53;i++)await store.write('users/'+i,{username:'Student '+String(i).padStart(3,'0'),created:1});
 const first=await (await students(get('/api/students?search=student',owner))).json();assert.equal(first.students.length,50);assert.equal(first.nextCursor,'student 049');
 const next=await (await students(get('/api/students?after='+encodeURIComponent(first.nextCursor),owner))).json();assert.equal(next.students.length,3);
 assert.equal((await students(post('/api/students',{action:'pause',username:'Test Owner'},owner))).status,403);
});
test('simultaneous updates cannot replace a changed password using stale authorization',async()=>{
 const {auth}=await setup();const session=cookie(await signup(auth,'student_reader'));
 const results=await Promise.all(['first','second'].map(newPassword=>auth(post('/api/auth',{action:'update-account',currentPassword:'a',newPassword},session))));
 assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
});
test('accounts and changed credentials survive independent handler instances for thirty days',async()=>{
 const {store,auth}=await setup();const r=await signup(auth,'saved_reader');assert.match(r.headers.get('set-cookie'),/Max-Age=2592000/);
 const fresh=createAuthHandler({store,now:()=>Date.now()+29*86400000});assert.equal((await (await fresh(get('/api/auth',cookie(r)))).json()).user.username,'saved_reader');
 const expired=createAuthHandler({store,now:()=>Date.now()+31*86400000});assert.equal((await (await expired(get('/api/auth',cookie(r)))).json()).user,null);
});
