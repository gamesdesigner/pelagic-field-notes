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
test('Midnight Zone saves independent drafts and scores without replacing moved chapters or the old midnight lesson',async()=>{
 const {midnightUnits}=await import('../shared/midnight/units.mjs');
 const {progress,student,owner,students,store}=await setup();
 for(const lessonId of ['midnight','twilight','cuttlefish','shark'])await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student));
 for(const lessonId of ['twilight','cuttlefish','shark'])await progress(post('/api/progress',{action:'quiz',lessonId,attemptId:randomUUID(),answers:answers(lessonId)},student));
 const before=(await (await progress(get('/api/progress',student))).json()).progress;const states={};
 for(const {id:lessonId} of midnightUnits){
  assert.equal((await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2},student))).status,200);
  states[lessonId]={attemptId:randomUUID(),revision:1,index:1,selection:answers(lessonId)[1],submitted:false,answers:[answers(lessonId)[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state:states[lessonId]},student))).status,200);
 }
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 for(const {id} of midnightUnits){assert.equal(restored.quizSessions[id].index,1);assert.equal(restored.quizSessions[id].selection,answers(id)[1]);assert.equal(restored.lessons[id].readingLevel,2);}
 for(const {id:lessonId} of midnightUnits){
  const body={action:'quiz-draft',lessonId,previousAttemptId:null,state:{...states[lessonId],revision:2,index:7,selection:'',answers:answers(lessonId)}};
  assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
  assert.equal((await fresh(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student))).status,200);
 }
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 for(const {id} of midnightUnits){assert.equal(report.quizzes[id].latestScore,7,id);assert.equal(report.quizzes[id].attempts,1,id);assert.ok(report.lessons[id].completedAt);}
 for(const id of ['midnight','twilight','cuttlefish','shark'])assert.deepEqual(report.lessons[id],before.lessons[id]);
 for(const id of ['twilight','cuttlefish','shark'])assert.deepEqual(report.quizzes[id],before.quizzes[id]);
});
test('thirteen additional units persist separate drafts, completion, scores and owner reports while old records survive',async()=>{
 const {completionUnits}=await import('../shared/completion/units.mjs');
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'penguin',readingLevel:2,completed:true},student));
 await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:answers('shark')},student));
 const before=(await (await progress(get('/api/progress',student))).json()).progress;
 const states={};
 for(const {id:lessonId} of completionUnits){
  assert.equal((await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2},student))).status,200);
  states[lessonId]={attemptId:randomUUID(),revision:1,index:1,selection:answers(lessonId)[1],submitted:false,answers:[answers(lessonId)[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state:states[lessonId]},student))).status,200);
 }
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 for(const {id} of completionUnits){assert.equal(restored.quizSessions[id].selection,answers(id)[1]);assert.equal(restored.quizSessions[id].index,1);assert.equal(restored.lessons[id].readingLevel,2);}
 for(const {id:lessonId} of completionUnits){
  const state={...states[lessonId],revision:2,index:7,selection:'',answers:answers(lessonId)};
  const body={action:'quiz-draft',lessonId,previousAttemptId:null,state};
  assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
  assert.equal((await fresh(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student))).status,200);
 }
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 for(const {id} of completionUnits){assert.equal(report.quizzes[id].latestScore,7,id);assert.equal(report.quizzes[id].attempts,1,id);assert.ok(report.lessons[id].completedAt);}
 assert.deepEqual(report.lessons.penguin,before.lessons.penguin);assert.deepEqual(report.quizzes.shark,before.quizzes.shark);
});
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
test('all lessons persist completion and reading level without losing earlier completion',async()=>{
 const {progress,student,store}=await setup();
 for(const lessonId of Object.keys(lessonTitles)){const r=await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student));assert.equal(r.status,200);}
 await progress(post('/api/progress',{action:'lesson',lessonId:'shark',readingLevel:1},student));
 const fresh=createLearningHandler({store});const saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(Object.keys(saved.lessons).length,Object.keys(lessonTitles).length);assert.ok(saved.lessons.shark.completedAt);assert.equal(saved.lessons.shark.readingLevel,1);assert.equal(saved.lessons.enso.readingLevel,2);
});
test('all quiz banks are graded server-side; fake score fields are ignored',async()=>{
 const {progress,student}=await setup();
 for(const [lessonId,questions] of Object.entries(quizBank)){
  const r=await progress(post('/api/progress',{action:'quiz',lessonId,attemptId:randomUUID(),answers:answers(lessonId),score:0,bestScore:900},student));assert.equal(r.status,200);
  const saved=(await r.json()).progress.quizzes[lessonId];assert.equal(saved.latestScore,questions.length);assert.equal(saved.bestScore,questions.length);assert.equal(saved.total,questions.length);
 }
 const r=await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:quizBank.shark.map(()=> 'wrong answer'),score:7},student));const quiz=(await r.json()).progress.quizzes.shark;
 assert.equal(quiz.latestScore,0);assert.equal(quiz.bestScore,7);assert.equal(quiz.attempts,2);
});
test('server credits a plain-language low-light explanation and preserves the saved attempt',async()=>{
 const {progress,student,store}=await setup();
 const written=answers('twilight');written[5]='since there is no light.';
 const body={action:'quiz',lessonId:'twilight',attemptId:randomUUID(),answers:written};
 const response=await progress(post('/api/progress',body,student));
 assert.equal(response.status,200);
 const saved=(await response.json()).progress.quizzes.twilight;
 assert.equal(saved.latestScore,7);assert.equal(saved.total,7);assert.equal(saved.attempts,1);
 const fresh=createLearningHandler({store});
 await fresh(post('/api/progress',body,student));
 const restored=(await (await fresh(get('/api/progress',student))).json()).progress.quizzes.twilight;
 assert.deepEqual(restored,saved);
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

test('every quiz resumes checked feedback and an unchecked selection across fresh handlers',async()=>{
 const {progress,student,store,other}=await setup();
 for(const [lessonId,questions] of Object.entries(quizBank)){
  const attemptId=randomUUID();const correct=answers(lessonId);
  const checked={attemptId,revision:1,index:0,selection:correct[0],submitted:true,answers:[correct[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,state:checked,previousAttemptId:null},student))).status,200);
  const state={...checked,revision:2,index:1,submitted:false,selection:questions[1].options?.[0]||'partly typed'};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,state,previousAttemptId:null},student))).status,200);
  const saved=(await (await createLearningHandler({store})(get('/api/progress',student))).json()).progress;
  const {updatedAt,...restored}=saved.quizSessions[lessonId];assert.deepEqual(restored,state);assert.ok(updatedAt);assert.equal(saved.quizzes[lessonId],undefined);
 }
 const privateData=(await (await progress(get('/api/progress',other))).json()).progress;assert.equal(privateData.quizSessions,undefined);
});
test('finishing a draft saves exactly one graded score; retaking preserves best and rejects stale tabs',async()=>{
 const {progress,student,store}=await setup();const lessonId='shark';const attemptId=randomUUID();
 const send=state=>progress(post('/api/progress',{action:'quiz-draft',lessonId,state,previousAttemptId:null},student));
 const draft={attemptId,revision:1,index:0,selection:answers(lessonId)[0],submitted:false,answers:[]};
 assert.equal((await send(draft)).status,200);
 const completed={attemptId,revision:3,index:7,selection:'',submitted:false,answers:answers(lessonId)};
 const requests=await Promise.all([send(completed),send(completed)]);assert.ok(requests.every(r=>r.status===200));
 let saved=(await (await createLearningHandler({store})(get('/api/progress',student))).json()).progress;
 assert.equal(saved.quizzes.shark.attempts,1);assert.equal(saved.quizzes.shark.latestScore,7);assert.equal(saved.quizSessions.shark.index,7);
 // Delayed old writes cannot reopen a finished quiz or inflate the result.
 assert.equal((await send({...draft,revision:2})).status,200);
 assert.equal((await send({...draft,revision:4})).status,409);
 const nextId=randomUUID();const next={...draft,attemptId:nextId,revision:1};
 assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,state:next,previousAttemptId:attemptId},student))).status,200);
 assert.equal((await send(completed)).status,409);
 const final={...completed,attemptId:nextId,revision:2,answers:answers(lessonId).map((answer,i)=>i<5?answer:'wrong answer')};
 assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,state:final,previousAttemptId:attemptId},student))).status,200);
 saved=(await (await progress(get('/api/progress',student))).json()).progress;
 assert.equal(saved.quizzes.shark.attempts,2);assert.equal(saved.quizzes.shark.latestScore,5);assert.equal(saved.quizzes.shark.bestScore,7);
});
test('invalid cursors, answer rewrites and malformed draft requests cannot corrupt saved progress',async()=>{
 const {progress,student}=await setup();const state={attemptId:randomUUID(),revision:1,index:0,selection:answers('enso')[0],submitted:true,answers:[answers('enso')[0]]};
 const postDraft=state=>progress(post('/api/progress',{action:'quiz-draft',lessonId:'enso',state,previousAttemptId:null},student));
 assert.equal((await postDraft(state)).status,200);
 for(const invalid of [{...state,index:2},{...state,index:8},{...state,revision:0},{...state,revision:1.5},{...state,answers:[]},{...state,selection:'x'.repeat(513)},{...state,submitted:'yes'},{...state,answers:[null]}])assert.equal((await postDraft(invalid)).status,400);
 assert.equal((await postDraft({...state,revision:2,selection:'rewritten',answers:['rewritten']})).status,409);
 const saved=(await (await progress(get('/api/progress',student))).json()).progress;assert.deepEqual(saved.quizSessions.enso.answers,state.answers);assert.equal(saved.quizzes.enso,undefined);
});
test('refresh recovery chooses pending local edits only for the same or explicitly restarted attempt',async()=>{
 const {restoreQuizSession,quizPasses}=await import('../shared/quiz-attempts.mjs');
 const state={attemptId:randomUUID(),revision:1,index:0,selection:'a',submitted:false,answers:[]};
 const cached={state:{...state,revision:2,selection:'b'},previousAttemptId:null};
 assert.equal(restoreQuizSession(state,cached,7),cached);
 assert.equal(restoreQuizSession({...state,revision:3},cached,7),null);
 assert.equal(restoreQuizSession({...state,attemptId:randomUUID()},cached,7),null);
 assert.equal(restoreQuizSession(state,{...cached,state:{...state,attemptId:randomUUID()},previousAttemptId:state.attemptId},7).previousAttemptId,state.attemptId);
 for(const [score,total,pass] of [[7,10,true],[6,10,false],[5,7,true],[4,7,false],[10,15,false],[11,15,true],[0,0,false]])assert.equal(quizPasses(score,total),pass);
});

test('new twilight units keep legacy vampire progress and independent resumable quizzes',async()=>{
 const {progress,student,store,students,owner}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'twilight',readingLevel:2,completed:true},student));
 await progress(post('/api/progress',{action:'lesson',lessonId:'twilightGeneral',readingLevel:1},student));
 const sessions={};
 for(const lessonId of ['twilightGeneral','twilight']){
  const state={attemptId:randomUUID(),revision:1,index:0,selection:answers(lessonId)[0],submitted:true,answers:[answers(lessonId)[0]]};sessions[lessonId]=state;
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,state,previousAttemptId:null},student))).status,200);
 }
 const fresh=createLearningHandler({store});let saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.ok(saved.lessons.twilight.completedAt);assert.equal(saved.lessons.twilight.readingLevel,2);assert.equal(saved.lessons.twilightGeneral.completedAt,undefined);assert.equal(saved.lessons.twilightGeneral.readingLevel,1);
 assert.notEqual(saved.quizSessions.twilightGeneral.attemptId,saved.quizSessions.twilight.attemptId);
 const state={...sessions.twilightGeneral,revision:2,index:7,selection:'',submitted:false,answers:answers('twilightGeneral')};
 assert.equal((await fresh(post('/api/progress',{action:'quiz-draft',lessonId:'twilightGeneral',state,previousAttemptId:null},student))).status,200);
 saved=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 assert.equal(saved.quizzes.twilightGeneral.latestScore,7);assert.equal(saved.quizzes.twilight,undefined);assert.equal(saved.quizSessions.twilight.index,0);assert.ok(saved.lessons.twilight.completedAt);
});
test('twilight curriculum has substantial introductory prose and two seven-question written quizzes',async()=>{
 const {twilightIntro,vampireIntro,twilightGeneralDive}=await import('../shared/twilight-articles.mjs');
 const words=reading=>reading.sections.flatMap(section=>section.paragraphs).join(' ').split(/\s+/).length;
 assert.ok(words(twilightIntro)>=500);assert.ok(words(vampireIntro)>=500);assert.ok(words(twilightGeneralDive)>words(twilightIntro)*2);assert.ok(twilightGeneralDive.abstract.length>200);
 for(const lessonId of ['twilightGeneral','twilight']){assert.equal(quizBank[lessonId].length,7);for(const question of quizBank[lessonId]){assert.equal(question.kind,"written");assert.equal(question.options,undefined);assert.equal(typeof question.answer,"string");}}
});

test('polar written drafts resume verbatim and server grades their ideas for owner reports',async()=>{
 const {progress,student,store,students,owner}=await setup();
 const lessonId='penguin',attemptId=randomUUID();
 const written=['Arctic','Feet','To stay warm.','Oxygen.','On his feet.','They are consumers because they eat other animals.','Depth and time.'];
 const draft={attemptId,revision:1,index:0,selection:'My unfinished\nanswer about Antarctica',submitted:false,answers:[]};
 assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,state:draft,previousAttemptId:null},student))).status,200);
 const fresh=createLearningHandler({store});
 let saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(saved.quizSessions.penguin.selection,draft.selection);
 const checked={...draft,revision:2,index:1,selection:'',answers:[written[0]]};
 assert.equal((await fresh(post('/api/progress',{action:'quiz-draft',lessonId,state:checked,previousAttemptId:null},student))).status,200);
 assert.equal((await fresh(post('/api/progress',{action:'quiz-draft',lessonId,state:{...checked,revision:3,answers:['Antarctica']},previousAttemptId:null},student))).status,409);
 const finish={...draft,revision:4,index:7,selection:'',answers:written};
 const body={action:'quiz-draft',lessonId,state:finish,previousAttemptId:null,score:7};
 assert.equal((await fresh(post('/api/progress',body,student))).status,200);
 assert.equal((await fresh(post('/api/progress',body,student))).status,200);
 saved=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 assert.equal(saved.quizzes.penguin.latestScore,5);assert.equal(saved.quizzes.penguin.attempts,1);assert.equal(saved.quizzes.penguin.total,7);
 assert.deepEqual(saved.quizSessions.penguin.answers,written);
});

test('legacy choice selections resume alongside new written responses without losing scores',async()=>{
 const {progress,student,store,students,owner}=await setup();
 const legacy=['Blowhole','Carapace','Bell','Dorsal fin','Phytoplankton','carapace'];
 const oldResult=await progress(post('/api/progress',{action:'quiz',lessonId:'sunlight',attemptId:randomUUID(),answers:legacy},student));
 assert.equal((await oldResult.json()).progress.quizzes.sunlight.bestScore,6);
 const attemptId=randomUUID();
 const draft={attemptId,revision:10,index:1,selection:'A carapace, the upper\nshell',submitted:false,answers:['Blowhole']};
 assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId:'sunlight',state:draft,previousAttemptId:null},student))).status,200);
 const fresh=createLearningHandler({store});
 let saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(saved.quizSessions.sunlight.selection,draft.selection);assert.equal(saved.quizSessions.sunlight.index,1);
 assert.deepEqual(saved.quizSessions.sunlight.answers,['Blowhole']);
 const state={...draft,revision:11,index:6,selection:'',submitted:false,answers:['Blowhole','A carapace.','Its bell.','The dorsal fin.','Photosynthetic plankton.','I forgot.']};
 const body={action:'quiz-draft',lessonId:'sunlight',state,previousAttemptId:null};
 for(let i=0;i<2;i++)assert.equal((await fresh(post('/api/progress',body,student))).status,200);
 saved=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 assert.equal(saved.quizzes.sunlight.latestScore,5);assert.equal(saved.quizzes.sunlight.bestScore,6);assert.equal(saved.quizzes.sunlight.attempts,2);
 assert.equal(saved.quizSessions.sunlight.index,6);
});

test('new cephalopod progress resumes independently and appears in owner reports without replacing cuttlefish',async()=>{
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'cuttlefish',readingLevel:2,completed:true},student));
 const attemptId=randomUUID();
 const state={attemptId,revision:1,index:1,selection:'Eight arms.',submitted:false,answers:['Mollusks.']};
 const draft=await progress(post('/api/progress',{action:'quiz-draft',lessonId:'cephalopods',previousAttemptId:null,state},student));
 assert.equal(draft.status,200);
 const fresh=createLearningHandler({store});
 const saved=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(saved.quizSessions.cephalopods.selection,'Eight arms.');
 assert.equal(saved.quizSessions.cephalopods.index,1);
 assert.ok(saved.lessons.cuttlefish.completedAt);
 const written=['Mollusks.','Eight arms.','Tentacles.','Siphon.','Pigment cells.','Nautilus.','They are prey.'];
 const complete=await fresh(post('/api/progress',{action:'quiz-draft',lessonId:'cephalopods',previousAttemptId:null,state:{attemptId,revision:2,index:7,selection:'',submitted:false,answers:written}},student));
 assert.equal(complete.status,200);
 const report=await students(get('/api/students?student=Student%20Reader',owner));
 assert.equal(report.status,200);
 const data=await report.json();
 assert.equal(data.progress.quizzes.cephalopods.latestScore,7);
 assert.equal(data.progress.quizzes.cephalopods.total,7);
 assert.ok(data.progress.lessons.cuttlefish.completedAt);
 assert.equal(data.progress.lessons.cuttlefish.readingLevel,2);
});

test('server credits cold water and restores the same completed upwelling attempt',async()=>{
 const {progress,student,store}=await setup();const written=answers('upwelling');written[4]='cold water';
 const body={action:'quiz',lessonId:'upwelling',attemptId:randomUUID(),answers:written};
 const response=await progress(post('/api/progress',body,student));assert.equal(response.status,200);
 const saved=(await response.json()).progress.quizzes.upwelling;
 assert.equal(saved.latestScore,15);assert.equal(saved.total,15);assert.equal(saved.attempts,1);
 const fresh=createLearningHandler({store});await fresh(post('/api/progress',body,student));
 assert.deepEqual((await (await fresh(get('/api/progress',student))).json()).progress.quizzes.upwelling,saved);
});

test('new cnidarian units keep separate drafts and owner-visible scores while preserving lion’s mane progress',async()=>{
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'lionsmane',readingLevel:2,completed:true},student));
 const attempts={};
 for(const lessonId of ['cnidaria','anemones']){
  attempts[lessonId]=randomUUID();const state={attemptId:attempts[lessonId],revision:1,index:1,selection:lessonId==='cnidaria'?'stinging cells':'pedal disc',submitted:false,answers:[answers(lessonId)[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state},student))).status,200);
 }
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(restored.quizSessions.cnidaria.selection,'stinging cells');assert.equal(restored.quizSessions.anemones.selection,'pedal disc');assert.ok(restored.lessons.lionsmane.completedAt);
 for(const lessonId of ['cnidaria','anemones']){
  const state={attemptId:attempts[lessonId],revision:2,index:7,selection:'',submitted:false,answers:answers(lessonId)};
  assert.equal((await fresh(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state},student))).status,200);
 }
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 for(const lessonId of ['cnidaria','anemones'])assert.equal(report.quizzes[lessonId].latestScore,7);
 assert.equal(report.lessons.lionsmane.readingLevel,2);assert.ok(report.lessons.lionsmane.completedAt);
});

test('server credits the reported short shark answers and preserves the saved score on retry',async()=>{
 const {progress,student,store}=await setup();const written=answers('shark');written[3]='electrons.';written[5]='apex predator.';
 const body={action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:written};
 const response=await progress(post('/api/progress',body,student));assert.equal(response.status,200);
 const saved=(await response.json()).progress.quizzes.shark;
 assert.equal(saved.latestScore,7);assert.equal(saved.total,7);assert.equal(saved.attempts,1);
 const fresh=createLearningHandler({store});await fresh(post('/api/progress',body,student));
 assert.deepEqual((await (await fresh(get('/api/progress',student))).json()).progress.quizzes.shark,saved);
});

test('Corals resumes its own draft and saves an owner-visible score while preserving previous lessons',async()=>{
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'cnidaria',readingLevel:2,completed:true},student));
 await progress(post('/api/progress',{action:'lesson',lessonId:'corals',readingLevel:2},student));
 const attemptId=randomUUID();const state={attemptId,revision:1,index:1,selection:'limestone',submitted:false,answers:['hard coral']};
 assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId:'corals',previousAttemptId:null,state},student))).status,200);
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(restored.quizSessions.corals.index,1);assert.equal(restored.quizSessions.corals.selection,'limestone');assert.equal(restored.lessons.corals.readingLevel,2);assert.ok(restored.lessons.cnidaria.completedAt);
 const final={...state,revision:2,index:7,selection:'',answers:['hard coral','limestone','plankton','Great Barrier','crabs','algae','hotter']};
 const body={action:'quiz-draft',lessonId:'corals',previousAttemptId:null,state:final};
 assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 assert.equal(report.quizzes.corals.latestScore,7);assert.equal(report.quizzes.corals.attempts,1);assert.ok(report.lessons.cnidaria.completedAt);
});


test('shark overview draft and score stay independent of the relocated great white records',async()=>{
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'shark',readingLevel:2,completed:true},student));
 await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:answers('shark')},student));
 const before=(await (await progress(get('/api/progress',student))).json()).progress;
 await progress(post('/api/progress',{action:'lesson',lessonId:'sharks',readingLevel:2},student));
 const state={attemptId:randomUUID(),revision:1,index:1,selection:'gills',submitted:false,answers:['cartilage']};
 assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId:'sharks',previousAttemptId:null,state},student))).status,200);
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 assert.equal(restored.quizSessions.sharks.index,1);assert.equal(restored.quizSessions.sharks.selection,'gills');assert.equal(restored.lessons.sharks.readingLevel,2);
 assert.deepEqual(restored.lessons.shark,before.lessons.shark);assert.deepEqual(restored.quizzes.shark,before.quizzes.shark);
 const body={action:'quiz-draft',lessonId:'sharks',previousAttemptId:null,state:{...state,revision:2,index:7,selection:'',answers:['cartilage','gills','whale shark','hammerhead','electricity','pups','bycatch']}};
 assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 assert.equal(report.quizzes.sharks.latestScore,7);assert.equal(report.quizzes.sharks.attempts,1);assert.deepEqual(report.quizzes.shark,before.quizzes.shark);assert.deepEqual(report.lessons.shark,before.lessons.shark);
});


test('five ecology units restore independent drafts and owner-visible scores while earlier polar and shark records survive',async()=>{
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'penguin',readingLevel:2,completed:true},student));
 await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:answers('shark')},student));
 const before=(await (await progress(get('/api/progress',student))).json()).progress;
 const ids=['kelp','seaIce','narwhal','beluga','walrus'];const states={};
 for(const lessonId of ids){
  await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2},student));
  states[lessonId]={attemptId:randomUUID(),revision:1,index:1,selection:answers(lessonId)[1],submitted:false,answers:[answers(lessonId)[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state:states[lessonId]},student))).status,200);
 }
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 for(const id of ids){assert.equal(restored.quizSessions[id].selection,answers(id)[1]);assert.equal(restored.quizSessions[id].index,1);assert.equal(restored.lessons[id].readingLevel,2);}
 for(const lessonId of ids){
  const state={...states[lessonId],revision:2,index:7,selection:'',answers:answers(lessonId)};
  const body={action:'quiz-draft',lessonId,previousAttemptId:null,state};
  assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
  assert.equal((await fresh(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student))).status,200);
 }
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 for(const id of ids){assert.equal(report.quizzes[id].latestScore,7);assert.equal(report.quizzes[id].attempts,1);assert.ok(report.lessons[id].completedAt);}
 assert.deepEqual(report.lessons.penguin,before.lessons.penguin);assert.deepEqual(report.quizzes.shark,before.quizzes.shark);
});

test('new ray and phantom units restore independent quiz drafts and owner-visible completion without changing older records',async()=>{
 const {rayUnits}=await import('../shared/rays/units.mjs');
 const {progress,student,owner,students,store}=await setup();
 await progress(post('/api/progress',{action:'lesson',lessonId:'cnidaria',readingLevel:2,completed:true},student));
 await progress(post('/api/progress',{action:'quiz',lessonId:'shark',attemptId:randomUUID(),answers:answers('shark')},student));
 const before=(await (await progress(get('/api/progress',student))).json()).progress;
 const states={};
 for(const {id:lessonId} of rayUnits){
  await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2},student));
  states[lessonId]={attemptId:randomUUID(),revision:1,index:1,selection:answers(lessonId)[1],submitted:false,answers:[answers(lessonId)[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state:states[lessonId]},student))).status,200);
 }
 const fresh=createLearningHandler({store});const restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 for(const {id} of rayUnits){assert.equal(restored.quizSessions[id].index,1);assert.equal(restored.quizSessions[id].selection,answers(id)[1]);assert.equal(restored.lessons[id].readingLevel,2);}
 for(const {id:lessonId} of rayUnits){
  const body={action:'quiz-draft',lessonId,previousAttemptId:null,state:{...states[lessonId],revision:2,index:7,selection:'',answers:answers(lessonId)}};
  assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
  assert.equal((await fresh(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student))).status,200);
 }
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 for(const {id} of rayUnits){assert.equal(report.quizzes[id].latestScore,7,id);assert.equal(report.quizzes[id].attempts,1,id);assert.ok(report.lessons[id].completedAt);}
 assert.deepEqual(report.lessons.cnidaria,before.lessons.cnidaria);assert.deepEqual(report.quizzes.shark,before.quizzes.shark);
});

test('nine whale and deep-sea lessons restore separate drafts and report scores to owner while preserving earlier units',async()=>{
 const {whaleDeepUnits}=await import('../shared/whales-deep/units.mjs');
 const {progress,student,owner,students,store}=await setup();
 for(const lessonId of ['midnightLife','mantaRay','coelacanth'])assert.equal((await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2},student))).status,200);
 await progress(post('/api/progress',{action:'quiz',lessonId:'mantaRay',attemptId:randomUUID(),answers:answers('mantaRay')},student));
 const before=(await (await progress(get('/api/progress',student))).json()).progress,states={};
 for(const {id:lessonId} of whaleDeepUnits){
  assert.equal((await progress(post('/api/progress',{action:'lesson',lessonId,readingLevel:2},student))).status,200);
  states[lessonId]={attemptId:randomUUID(),revision:1,index:1,selection:answers(lessonId)[1],submitted:false,answers:[answers(lessonId)[0]]};
  assert.equal((await progress(post('/api/progress',{action:'quiz-draft',lessonId,previousAttemptId:null,state:states[lessonId]},student))).status,200);
 }
 const fresh=createLearningHandler({store}),restored=(await (await fresh(get('/api/progress',student))).json()).progress;
 for(const {id} of whaleDeepUnits){assert.equal(restored.quizSessions[id].index,1);assert.equal(restored.quizSessions[id].selection,answers(id)[1]);assert.equal(restored.lessons[id].readingLevel,2);}
 for(const {id:lessonId} of whaleDeepUnits){
  const body={action:'quiz-draft',lessonId,previousAttemptId:null,state:{...states[lessonId],revision:2,index:7,selection:'',answers:answers(lessonId)}};
  assert.equal((await fresh(post('/api/progress',body,student))).status,200);assert.equal((await fresh(post('/api/progress',body,student))).status,200);
  assert.equal((await fresh(post('/api/progress',{action:'lesson',lessonId,readingLevel:2,completed:true},student))).status,200);
 }
 const report=(await (await students(get('/api/students?student=Student%20Reader',owner))).json()).progress;
 for(const {id} of whaleDeepUnits){assert.equal(report.quizzes[id].latestScore,7,id);assert.equal(report.quizzes[id].attempts,1,id);assert.ok(report.lessons[id].completedAt);}
 assert.deepEqual(report.lessons.midnightLife,before.lessons.midnightLife);assert.deepEqual(report.quizzes.mantaRay,before.quizzes.mantaRay);
});
