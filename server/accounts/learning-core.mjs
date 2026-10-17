import {createHash} from 'node:crypto';
import {readSessionUser,response} from './auth-core.mjs';
import {lessonTitles,quizBank,answerIsCorrect} from '../../shared/learning-content.mjs';
import {validQuizSession} from '../../shared/quiz-attempts.mjs';
const owns=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
export const learningKey=accountKey=>'learning/'+createHash('sha256').update(accountKey).digest('hex');
export const emptyLearning=()=>({lessons:{},quizzes:{}});
export function learningView(value){
 return {...(value?.quizSessions?{quizSessions:value.quizSessions}:{}),lessons:value?.lessons||{},quizzes:Object.fromEntries(Object.entries(value?.quizzes||{}).map(([id,{recentAttemptIds,...quiz}])=>[id,quiz]))};
}
export async function readLearning(store,key){return learningView((await store.read(learningKey(key)))?.value);}
export function learningSummary(value){return{started:Object.keys(value.lessons).length,completed:Object.values(value.lessons).filter(lesson=>lesson.completedAt).length,quizCount:Object.keys(value.quizzes).length,totalLessons:Object.keys(lessonTitles).length};}
export function createLearningHandler({store,now=()=>Date.now()}){return async req=>{
 try{
  const account=await readSessionUser(req,store,now);if(!account)return response({error:'Please sign in to save your progress.'},401);
  const key=learningKey(account.key);
  if(req.method==='GET')return response({progress:await readLearning(store,account.key)});
  if(req.method!=='POST')return response({error:'Method not allowed.'},405);
  if(req.headers.get('origin')!==new URL(req.url).origin)return response({error:'Please use this website to save progress.'},403);
  if(!req.headers.get('content-type')?.startsWith('application/json'))return response({error:'Please send your progress again.'},415);
  if(Number(req.headers.get('content-length')||0)>16384)return response({error:'Progress request is too large.'},413);
  const text=await req.text();if(text.length>16384)return response({error:'Progress request is too large.'},413);
  let body;try{body=JSON.parse(text);}catch{return response({error:'Please send valid progress.'},400);}
  if(!body||typeof body.lessonId!=='string'||!owns(lessonTitles,body.lessonId)||!['lesson','quiz','quiz-draft'].includes(body.action))return response({error:'Choose a valid lesson.'},400);
  if(body.action==='lesson'&&((body.readingLevel!==undefined&&![1,2].includes(body.readingLevel))||(body.completed!==undefined&&body.completed!==true)))return response({error:'Choose a valid reading level or completion status.'},400);
  let score,total,state;
  if(body.action==='quiz-draft'){
   if(!owns(quizBank,body.lessonId)||!validQuizSession(body.state,quizBank[body.lessonId].length)||(body.previousAttemptId!==null&&(typeof body.previousAttemptId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(body.previousAttemptId))))return response({error:'Please start a valid quiz attempt.'},400);
   const {attemptId,revision,index,selection,submitted,answers}=body.state;
   state={attemptId,revision,index,selection,submitted,answers};
   body.attemptId=attemptId;body.answers=answers;total=quizBank[body.lessonId].length;
  }
  const finished=body.action==='quiz'||(state&&state.index===total);
  if(finished){
   if(!owns(quizBank,body.lessonId)||typeof body.attemptId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(body.attemptId))return response({error:'Please start a valid quiz attempt.'},400);
   const questions=quizBank[body.lessonId];total=questions.length;
   if(!Array.isArray(body.answers)||body.answers.length!==total||body.answers.some(answer=>typeof answer!=='string'||!answer.trim()||answer.length>512))return response({error:'Answer every question before saving this quiz.'},400);
   // Grades always come from the shared question bank, never a submitted score.
   score=questions.reduce((sum,question,i)=>sum+(answerIsCorrect(question,body.answers[i])?1:0),0);
  }
  for(let attempt=0;attempt<10;attempt++){
   const current=await store.read(key);const value=current?.value||emptyLearning();const timestamp=now();const lesson=value.lessons[body.lessonId];
   const updated={...value,lessons:{...value.lessons},quizzes:{...value.quizzes}};
   if(body.action==='lesson')updated.lessons[body.lessonId]={...lesson,startedAt:lesson?.startedAt||timestamp,lastVisitedAt:timestamp,readingLevel:body.readingLevel||lesson?.readingLevel||1,...(body.completed?{completedAt:lesson?.completedAt||timestamp}:{})};
   else{
    if(state){
     const previousState=value.quizSessions?.[body.lessonId];
     if(previousState?.attemptId===state.attemptId){
      if(previousState.revision>=state.revision)return response({progress:learningView(value)});
      // A tab may advance a draft, but cannot change answers already checked.
      if(previousState.index===total||previousState.answers.some((answer,index)=>state.answers[index]!==answer))return response({error:'This quiz changed in another tab. Reopen the lesson to load its saved place.'},409);
     }else if((previousState?.attemptId||null)!==body.previousAttemptId||value.quizzes[body.lessonId]?.recentAttemptIds?.includes(state.attemptId))return response({error:'A newer quiz attempt is saved. Reopen the lesson to continue it.'},409);
     updated.quizSessions={...value.quizSessions,[body.lessonId]:{...state,updatedAt:timestamp}};
    }
    const previous=value.quizzes[body.lessonId];
    if(finished&&previous?.recentAttemptIds?.includes(body.attemptId))return response({progress:learningView(value)});
    if(finished)updated.quizzes[body.lessonId]={latestScore:score,bestScore:Math.max(previous?.bestScore||0,score),total,attempts:(previous?.attempts||0)+1,lastAttemptAt:timestamp,recentAttemptIds:[...(previous?.recentAttemptIds||[]),body.attemptId].slice(-100)};
    if(!lesson)updated.lessons[body.lessonId]={startedAt:timestamp,lastVisitedAt:timestamp,readingLevel:1};
   }
   // Recheck the session before committing: paused/revoked accounts cannot save.
   if(!await readSessionUser(req,store,now))return response({error:'Please sign in again to save progress.'},401);
   if(await store.write(key,updated,current?.etag))return response({progress:learningView(updated)});
  }return response({error:'Progress changed in another tab. Please try saving again.'},409);
 }catch{return response({error:'Progress could not be saved right now. Please try again.'},503);}
};}
