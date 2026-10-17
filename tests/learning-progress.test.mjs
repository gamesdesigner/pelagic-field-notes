import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createAuthHandler,createMemoryStore} from '../server/accounts/auth-core.mjs';
import {createStudentHandler} from '../server/accounts/student-core.mjs';
import {provisionOwner} from '../server/accounts/provision-owner.mjs';
import {createLearningHandler,learningKey} from '../server/accounts/learning-core.mjs';
import {lessonTitles,quizBank} from '../shared/learning-content.mjs';
const origin='https://marinebiology-learn.vercel.app';
const get=(path,cookie)=>new Request(origin+path,{headers:cookie?{Cookie:cookie}:{}});
const post=(path,body,cookie,site=origin)=>new Request(origin+path,{method:'POST',headers:{Origin:site,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});
const cookie=r=>r.headers.get('set-cookie').split(';')[0];
const answers=id=>quizBank[id].map(question=>typeof question.answer==='number'?question.options[question.answer]:question.answer);
async function setup(store=createMemoryStore()){
 await provisionOwner({store,username:'Test Owner',password:'owner-test'});
 const auth=createAuthHandler({store});const students=createStudentHandler({store});const progress=createLearningHandler({store});
 const owner=cookie(await auth(post('/api/auth',{action:'sign-in',username:'TestOwner',password:'owner-test'})));
 const signup=await auth(post('/api/auth',{action:'sign-up',username:'Student Reader',password:'a'}));assert.equal(signup.status,200);const student=cookie(signup);
 const other=cookie(await auth(post('/api/auth',{action:'sign-up',username:'Other Reader',password:'a'})));
 return{store,auth,students,progress,owner,student,other};
}
test('compact and spaced owner names authenticate the same owner without resetting credentials',async()=>{
 const {auth,other}=await setup();
 for(const username of ['TestOwner','TESTOWNER','Test Owner']){const r=await auth(post('/api/auth',{action:'sign-in',username,password:'owner-test'}));assert.equal(r.status,200);assert.equal((await r.json()).user.role,'owner');}
 assert.equal((await auth(post('/api/auth',{action:'sign-up',username:'TestOwner',password:'a'}))).status,409);
 assert.equal((await auth(post('/api/auth',{action:'update-account',currentPassword:'a',newUsername:'TestOwner'},other))).status,409);
});
test('the compact owner spelling cannot shadow a pre-existing separate account',async()=>{
 const store=createMemoryStore();const auth=createAuthHandler({store});const existing=await auth(post('/api/auth',{action:'sign-up',username:'TestOwner',password:'a'}));assert.equal(existing.status,200);
 await provisionOwner({store,username:'Test Owner',password:'owner-test'});
 const student=await auth(post('/api/auth',{action:'sign-in',username:'TestOwner',password:'a'}));assert.equal((await student.json()).user.role,undefined);
 assert.equal((await auth(post('/api/auth',{action:'sign-in',username:'TestOwner',password:'owner-test'}))).status,401);
});
test('all twelve lessons persist completion and reading level without losing earlier completion',async()=>{
 const {progress,student,store}=await setup();
 for(const lessonId of Object.keys(lessonTitles)){const r=await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student));assert.equal(r.status,200);}
 await progress(post('/api/progress',{action:'lesson',lessonId:'shark',readingLevel:1},student));
 const fresh=createLearningHandler({store});const saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(Object.keys(saved.lessons).length,12);assert.ok(saved.lessons.shark.completedAt);assert.equal(saved.lessons.shark.readingLevel,1);assert.equal(saved.lessons.enso.readingLevel,2);
});
test('all eight quiz banks are graded server-side; fake score fields are ignored',async()=>{
 const {progress,student}=await setup();
 for(const [lessonId,questions] of Object.entries(quizBank)){
  const r=await progress(post('/api/progress',{action:'quiz',lessonId,attemptId:randomUUID(),answers:answers(lessonId),score:0,bestScore:900},student));assert.equal(r.status,200);
  const saved=(await r.json()).progress.quizzes[lessonId];assert.equal(saved.latestScore,questions.length);assert.equal(saved.bestScore,questions.length);assert.equal(saved.total,questions.length);
 }
 const r=await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:quizBank.shark.map(()=> 'wrong answer'),score:7},student));const quiz=(await r.json()).progress.quizzes.shark;
 assert.equal(quiz.latestScore,0);assert.equal(quiz.bestScore,7);assert.equal(quiz.attempts,2);
});
test('quiz retries are idempotent and concurrent saves preserve lessons and attempts',async()=>{
 const {progress,student}=await setup();const body={action:'quiz',lessonId:'enso',attemptId:randomUUID(),answers:answers('enso')};
 const both=await Promise.all([progress(post('/api/progress',body,student)),progress(post('/api/progress',body,student))]);assert.ok(both.every(r=>r.status===200));
 const saves=await Promise.all([progress(post('/api/progress',{action:'lesson',lessonId:'ekman',completed:true},student)),progress(post('/api/progress',{...body,attemptId:randomUUID()},student))]);assert.ok(saves.every(r=>r.status===200));
 const data=(await (await progress(get('/api/progress',student))).json()).progress;assert.equal(data.quizzes.enso.attempts,2);assert.ok(data.lessons.ekman.completedAt);assert.ok(data.lessons.enso);
 assert.equal(data.quizzes.enso.recentAttemptIds,undefined);
});
test('progress is isolated by account, and owner-only reports survive student renaming',async()=>{
 const {progress,student,other,owner,students,auth}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'shark',completed:true},student));
 await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:answers('shark'),username:'Other Reader'},student));
 assert.deepEqual((await (await progress(get('/api/progress',other))).json()).progress,{lessons:{},quizzes:{}});
 assert.equal((await students(get('/api/students?student=Student%20Reader',other))).status,403);
 const rename=await auth(post('/api/auth',{action:'update-account',currentPassword:'a',newUsername:'Ocean Reader'},student));const renamed=cookie(rename);
 assert.equal((await (await progress(get('/api/progress',renamed))).json()).progress.quizzes.shark.bestScore,7);
 const report=await students(get('/api/students?student=Ocean%20Reader',owner));assert.equal(report.status,200);const data=await report.json();assert.equal(data.progress.quizzes.shark.latestScore,7);assert.ok(data.progress.lessons.shark.completedAt);assert.doesNotMatch(JSON.stringify(data),/hash|salt|accountKey|recentAttemptIds|sessionVersion|password/);
 const list=(await (await students(get('/api/students',owner))).json()).students.find(student=>student.username==='Ocean Reader');assert.equal(list.learning.completed,1);assert.equal(list.learning.quizCount,1);
});
test('invalid, forged, cross-origin and paused-account writes are rejected',async()=>{
 const {progress,student,owner,students}=await setup();
 assert.equal((await progress(get('/api/progress'))).status,401);
 assert.equal((await progress(post('/api/progress',{action:'lesson',lessonId:'shark'},student,'https://other.example'))).status,403);
 for(const body of [{action:'lesson',lessonId:'__proto__'},{action:'lesson',lessonId:'shark',readingLevel:3},{action:'lesson',lessonId:'shark',completed:false},{action:'quiz',lessonId:'ekman',attemptId:randomUUID(),answers:[]},{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:[]},{action:'quiz',lessonId:'shark',attemptId:'invalid',answers:answers('shark')}])assert.equal((await progress(post('/api/progress',body,student))).status,400);
 await students(post('/api/students',{action:'pause',username:'Student Reader'},owner));
 assert.equal((await progress(post('/api/progress',{action:'lesson',lessonId:'shark'},student))).status,401);
});
test('storage outages return a safe JSON error, never a false saved response',async()=>{
 const handler=createLearningHandler({store:{read(){throw Error('secret infrastructure details');}}});
 const r=await handler(get('/api/progress','mb_session='+'a'.repeat(64)));assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/secret infrastructure details/);
});
export async function verifyPersistentLearning(store){
 const {progress,student,owner,students}=await setup(store);
 await progress(post('/api/progress',{action:'lesson',lessonId:'shark',readingLevel:2,completed:true},student));
 const attempt={action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:answers('shark')};
 for(let i=0;i<2;i++)assert.equal((await progress(post('/api/progress',attempt,student))).status,200);
 const fresh=createLearningHandler({store});const saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(saved.quizzes.shark.bestScore,7);assert.equal(saved.quizzes.shark.attempts,1);assert.ok(saved.lessons.shark.completedAt);
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;assert.deepEqual(report,saved);
 assert.ok(await store.read(learningKey('users/student reader')));
}
test('live private Vercel storage preserves learning and owner reports across fresh handlers',{skip:!process.env.MARINE_BLOB_INTEGRATION},async()=>{
 const {vercelAccountStore}=await import('../server/accounts/vercel-store.mjs');const store=vercelAccountStore({prefix:'marine-accounts/learning-integration/'+randomUUID()+'/'});
 try{await verifyPersistentLearning(store);}finally{for(const key of await store.list(''))await store.remove(key);}
});
