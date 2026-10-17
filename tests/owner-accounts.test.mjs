import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAuthHandler,createMemoryStore} from '../netlify/lib/auth-core.mjs';
import {createStudentHandler} from '../netlify/lib/student-core.mjs';

const origin='https://marinebiology-study.netlify.app';
const setupCode='private-test-only-owner-code';
const cookie=r=>r.headers.get('set-cookie').split(';')[0];
function post(path,body,session,site=origin){return new Request(origin+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:site,...(session?{Cookie:session}:{})},body:JSON.stringify(body)});}
const get=(path,session)=>new Request(origin+path,{headers:session?{Cookie:session}:{}});
function setup(){const store=createMemoryStore();return{store,auth:createAuthHandler({store,ownerSignupCode:setupCode}),students:createStudentHandler({store})};}
const signup=(auth,username,extra={})=>auth(post('/api/auth',{action:'sign-up',username,password:'a',...extra}));
const claim=(auth,username='owner_reader',extra={})=>auth(post('/api/auth',{action:'owner-sign-up',username,password:'a',setupCode,...extra}));

test('owner signup requires a configured private code, without creating an account on rejection',async()=>{
 const {auth,store}=setup();
 assert.equal((await claim(auth,'owner_reader',{setupCode:'wrong'})).status,403);
 assert.equal(await store.read('users/owner_reader'),null);
 const unconfigured=createAuthHandler({store});assert.equal((await claim(unconfigured)).status,503);
 assert.deepEqual(await (await auth(get('/api/auth'))).json(),{user:null,ownerSignupAvailable:true});
});
test('ownership is claimed once and persists across sign-in and session restoration',async()=>{
 const {auth}=setup();const r=await claim(auth);assert.equal(r.status,200);
 assert.deepEqual(await r.json(),{user:{username:'owner_reader',role:'owner'}});
 const state=await (await auth(get('/api/auth',cookie(r)))).json();assert.equal(state.user.role,'owner');assert.equal(state.ownerSignupAvailable,false);
 assert.equal((await claim(auth,'another_owner')).status,409);
 const login=await auth(post('/api/auth',{action:'sign-in',username:'owner_reader',password:'a'}));assert.equal((await login.json()).user.role,'owner');
});
test('an existing student must prove their password to claim ownership',async()=>{
 const {auth,store}=setup();await signup(auth,'existing_reader');
 assert.equal((await claim(auth,'existing_reader',{password:'wrong'})).status,401);assert.equal(await store.read('settings/owner'),null);
 const r=await claim(auth,'existing_reader');assert.equal((await r.json()).user.role,'owner');
});
test('concurrent owner claims have exactly one winner',async()=>{
 const {auth,store}=setup();const rows=await Promise.all([claim(auth,'first_reader'),claim(auth,'second_reader')]);
 assert.deepEqual(rows.map(r=>r.status).sort(),[200,409]);const owner=(await store.read('settings/owner')).value.username;
 for(const username of ['first_reader','second_reader']){const r=await auth(post('/api/auth',{action:'sign-in',username,password:'a'}));assert.equal((await r.json()).user.role,username===owner?'owner':undefined);}
});
test('ordinary signup cannot grant owner access by spoofing fields',async()=>{
 const {auth,students}=setup();const r=await signup(auth,'student_reader',{role:'owner',owner:true,setupCode});assert.equal((await r.json()).user.role,undefined);
 assert.equal((await students(get('/api/students',cookie(r)))).status,403);assert.equal((await students(get('/api/students'))).status,401);
 assert.equal((await students(post('/api/students',{action:'pause',username:'another_reader'},cookie(r)))).status,403);
});
test('owner can list students with optional emails, without passwords, owner record, or session secrets',async()=>{
 const {auth,students}=setup();const owner=cookie(await claim(auth));await signup(auth,'student_reader',{email:'student@example.com'});
 const r=await students(get('/api/students',owner));assert.equal(r.status,200);const data=await r.json();assert.equal(data.students.length,1);assert.equal(data.students[0].email,'student@example.com');assert.equal(data.students[0].status,'active');assert.equal(data.nextCursor,null);assert.doesNotMatch(JSON.stringify(data),/hash|salt|password|setupCode|owner_reader|sessionVersion/);
});
test('pausing revokes old sessions permanently; reactivation permits only a fresh sign-in',async()=>{
 const {auth,students}=setup();const owner=cookie(await claim(auth));const old=cookie(await signup(auth,'student_reader'));const another=cookie(await auth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'a'})));
 const pause=await students(post('/api/students',{action:'pause',username:'student_reader'},owner));assert.equal((await pause.json()).student.status,'paused');
 assert.equal((await (await auth(get('/api/auth',another))).json()).user,null);
 assert.equal((await auth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'a'}))).status,403);
 assert.equal((await students(post('/api/students',{action:'activate',username:'student_reader'},owner))).status,200);
 assert.equal((await (await auth(get('/api/auth',old))).json()).user,null);
 const login=await auth(post('/api/auth',{action:'sign-in',username:'student_reader',password:'a'}));assert.equal(login.status,200);assert.equal((await (await auth(get('/api/auth',cookie(login)))).json()).user.username,'student_reader');
});
test('owner changes reject cross-origin requests, missing students, invalid actions, and changes to the owner',async()=>{
 const {auth,students}=setup();const owner=cookie(await claim(auth));
 assert.equal((await students(post('/api/students',{action:'pause',username:'owner_reader'},owner))).status,403);
 assert.equal((await students(post('/api/students',{action:'pause',username:'student_reader'},owner,'https://another.example'))).status,403);
 assert.equal((await students(post('/api/students',{action:'promote',username:'student_reader'},owner))).status,400);
 assert.equal((await students(post('/api/students',{action:'pause',username:'../private'},owner))).status,400);
 assert.equal((await students(post('/api/students',{action:'pause',username:'unknown_reader'},owner))).status,404);
});
test('owner list supports prefix search and fifty-record pages',async()=>{
 const {auth,students,store}=setup();const owner=cookie(await claim(auth));
 for(let i=0;i<53;i++)await store.write('users/student_'+String(i).padStart(3,'0'),{username:'student_'+String(i).padStart(3,'0'),created:1000});
 const first=await (await students(get('/api/students?search=student_',owner))).json();assert.equal(first.students.length,50);assert.equal(first.nextCursor,'student_049');
 const second=await (await students(get('/api/students?search=student_&after='+first.nextCursor,owner))).json();assert.equal(second.students.length,3);assert.equal(second.nextCursor,null);
 const filtered=await (await students(get('/api/students?search=STUDENT_052',owner))).json();assert.equal(filtered.students.length,1);
});
test('logged-out owner sessions cannot read or change students',async()=>{
 const {auth,students}=setup();const owner=cookie(await claim(auth));await auth(post('/api/auth',{action:'sign-out'},owner));
 assert.equal((await students(get('/api/students',owner))).status,401);assert.equal((await students(post('/api/students',{action:'pause',username:'student_reader'},owner))).status,401);
});
test('invalid owner codes share the login attempt limit',async()=>{
 const {auth}=setup();for(let i=0;i<20;i++)assert.equal((await claim(auth,'owner_reader',{setupCode:'wrong'})).status,403);
 assert.equal((await claim(auth)).status,429);
});
