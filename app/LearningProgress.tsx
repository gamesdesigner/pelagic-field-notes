"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {lessonTitles,quizBank} from '../shared/learning-content.mjs';
import type {LessonId} from './deepDives';
export type LessonProgress={startedAt:number;lastVisitedAt:number;readingLevel:1|2;completedAt?:number};
export type QuizProgress={latestScore:number;bestScore:number;total:number;attempts:number;lastAttemptAt:number};
export type LearningData={lessons:Partial<Record<LessonId,LessonProgress>>;quizzes:Partial<Record<LessonId,QuizProgress>>};
const empty=():LearningData=>({lessons:{},quizzes:{}});
type Change={action:'lesson'|'quiz';lessonId:LessonId;readingLevel?:1|2;completed?:true;attemptId?:string;answers?:string[]};
const LearningContext=createContext<{data:LearningData;ready:boolean;error:string;reload:()=>void;save:(change:Change)=>Promise<void>}|null>(null);
export const useLearning=()=>useContext(LearningContext);
export function LearningProvider({identity,children}:{identity:string;children:ReactNode}){
 const [data,setData]=useState<LearningData>(empty);const [ready,setReady]=useState(false);const [error,setError]=useState('');const [reloadIndex,setReloadIndex]=useState(0);
 const epoch=useRef(0);const mutation=useRef(0);const queue=useRef<Promise<void>>(Promise.resolve());
 useEffect(()=>{
  const generation=++epoch.current;const controller=new AbortController();const version=mutation.current;setReady(false);setError('');
  fetch('/api/progress',{signal:controller.signal}).then(async r=>{const result=await r.json();if(!r.ok)throw Error(result.error||'Could not load saved progress.');if(epoch.current===generation&&mutation.current===version){setData(result.progress);setReady(true);}}).catch(e=>{if(!controller.signal.aborted&&epoch.current===generation&&mutation.current===version)setError(e instanceof Error?e.message:'Could not load saved progress.');});
  return()=>{controller.abort();epoch.current++;};
 },[identity,reloadIndex]);
 const reload=useCallback(()=>setReloadIndex(value=>value+1),[]);
 const save=useCallback((change:Change)=>{
  const generation=epoch.current;mutation.current++;
  const operation=queue.current.catch(()=>{}).then(async()=>{
   if(epoch.current!==generation)throw Error('Your sign-in changed. Please try again.');
   const r=await fetch('/api/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(change)});const result=await r.json();if(!r.ok)throw Error(result.error||'Progress could not be saved.');
   if(epoch.current===generation){setData(result.progress);setReady(true);setError('');}
  });queue.current=operation;return operation;
 },[]);
 return <LearningContext.Provider value={{data,ready,error,reload,save}}>{children}</LearningContext.Provider>;
}
export function useQuizAttempt(){
 const [answers,setAnswers]=useState<string[]>([]);const [attemptId,setAttemptId]=useState(()=>crypto.randomUUID());
 return {answers,attemptId,record:(index:number,answer:string)=>setAnswers(current=>{const next=[...current];next[index]=answer;return next;}),restart:()=>{setAnswers([]);setAttemptId(crypto.randomUUID());}};
}
export function QuizSave({lessonId,answers,attemptId}:{lessonId:LessonId;answers:string[];attemptId:string}){
 const learning=useLearning();const [status,setStatus]=useState<'idle'|'saving'|'saved'|'error'>('idle');const [error,setError]=useState('');const [retry,setRetry]=useState(0);
 const payload=JSON.stringify(answers);const total=quizBank[lessonId as keyof typeof quizBank]?.length||0;
 const complete=answers.length===total&&answers.filter(answer=>typeof answer==='string'&&answer.length>0).length===total;
 const save=learning?.save;
 useEffect(()=>{
  if(!complete||!save){setStatus('idle');return;}
  let active=true;setStatus('saving');setError('');
  save({action:'quiz',lessonId,attemptId,answers:JSON.parse(payload)}).then(()=>{if(active)setStatus('saved');}).catch(e=>{if(active){setStatus('error');setError(e instanceof Error?e.message:'Could not save this score.');}});
  return()=>{active=false;};
 },[complete,save,lessonId,attemptId,payload,retry]);
 if(!learning)return null;
 const saved=learning.data.quizzes[lessonId];
 return <div className="quiz-save-status" aria-live="polite">
  {status==='saving'?<p>Saving your score to your account…</p>:status==='saved'?<p>✓ Score saved to your account.</p>:status==='error'?<p role="alert">{error} <button type="button" onClick={()=>setRetry(value=>value+1)}>Retry saving score</button></p>:<p>{learning.ready?'Finish every question to save this attempt.':'Loading saved scores…'}</p>}
  {learning.error&&<p role="alert">{learning.error} <button type="button" onClick={learning.reload}>Load saved scores</button></p>}
  {saved&&<p>Latest: <strong>{saved.latestScore}/{saved.total}</strong> · Best: <strong>{saved.bestScore}/{saved.total}</strong> · {saved.attempts} saved attempt{saved.attempts===1?'':'s'}</p>}
 </div>;
}
export function LearningReport({data}:{data:LearningData}){
 const completed=Object.values(data.lessons).filter(lesson=>lesson?.completedAt).length;
 return <div className="learning-report">
  <div className="learning-report-summary"><strong>{completed} / {Object.keys(lessonTitles).length}</strong><span>lessons marked complete</span><strong>{Object.keys(data.quizzes).length} / {Object.keys(quizBank).length}</strong><span>quizzes attempted</span></div>
  <p className="learning-report-note">Lesson completion is marked by the learner. Quiz scores are checked and saved by the server.</p>
  <ul className="learning-lesson-list">{Object.entries(lessonTitles).map(([id,title])=>{const lesson=data.lessons[id as LessonId];const quiz=data.quizzes[id as LessonId];return <li key={id}><div><h3>{title}</h3><span className={`lesson-state ${lesson?.completedAt?'complete':lesson?'started':''}`}>{lesson?.completedAt?'Complete':lesson?'In progress':'Not started'}</span></div><p>{lesson?`Last reading level: ${lesson.readingLevel} · Visited ${new Date(lesson.lastVisitedAt).toLocaleDateString()}`:'Not opened yet.'}</p>{quiz?<p className="learning-quiz-score">Quiz · Latest <strong>{quiz.latestScore}/{quiz.total}</strong> · Best <strong>{quiz.bestScore}/{quiz.total}</strong> · {quiz.attempts} attempt{quiz.attempts===1?'':'s'}<span>Last attempt: {new Date(quiz.lastAttemptAt).toLocaleString()}</span></p>:<p className="learning-quiz-score">{Object.hasOwn(quizBank,id)?'Quiz not attempted yet.':'No quiz in this lesson.'}</p>}</li>;})}</ul>
 </div>;
}
export function MyLearning({onClose}:{onClose:()=>void}){
 const learning=useLearning();if(!learning)return null;
 return <section className="my-learning"><button type="button" className="student-back" onClick={onClose}>← Back to lessons</button><p className="eyebrow">Your field notes</p><h1>My progress</h1><p>Your completed lessons and quiz scores stay with your account, including when you sign in on another device.</p>{learning.error?<p className="account-form-error" role="alert">{learning.error} <button type="button" onClick={learning.reload}>Try again</button></p>:!learning.ready?<p role="status">Loading your progress…</p>:<LearningReport data={learning.data}/>}</section>;
}
