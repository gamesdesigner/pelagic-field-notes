"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {answerIsCorrect,quizBank} from '../shared/learning-content.mjs';
import {quizPasses,restoreQuizSession,validQuizSession} from '../shared/quiz-attempts.mjs';
import {useLearning,type QuizSession} from './LearningProgress';
import type {LessonId} from './deepDives';
export type QuizId=keyof typeof quizBank;
type CachedAttempt={state:QuizSession;previousAttemptId:string|null};
export function useQuizAttempt(lessonId:QuizId){
 const learning=useLearning();
 const [state,setState]=useState<QuizSession|null>(null);
 const [status,setStatus]=useState<'saving'|'saved'|'error'|'idle'>('idle');
 const [error,setError]=useState('');const [celebrate,setCelebrate]=useState(false);
 const current=useRef<QuizSession|null>(null);const previousAttemptId=useRef<string|null>(null);
 const pending=useRef<ReturnType<typeof setTimeout>|null>(null);const mounted=useRef(false);
 const sequence=useRef(0);const initialized=useRef(false);
 const total=quizBank[lessonId].length;const save=learning?.save;
 const cacheKey=`marine-quiz-v1:${encodeURIComponent(learning?.identity.toLowerCase()||'guest')}:${lessonId}`;
 const persist=useCallback((snapshot:QuizSession)=>{
  if(!save)return;
  const version=++sequence.current;
  if(mounted.current){setStatus('saving');setError('');}
  void save({action:'quiz-draft',lessonId:lessonId as LessonId,state:snapshot,previousAttemptId:previousAttemptId.current}).then(progress=>{
   const saved=progress.quizSessions?.[lessonId as LessonId];
   if(!saved||saved.attemptId!==snapshot.attemptId||saved.index!==snapshot.index||saved.selection!==snapshot.selection||JSON.stringify(saved.answers)!==JSON.stringify(snapshot.answers))throw Error('This quiz changed in another tab. Reopen the lesson to load the saved place.');
   if(mounted.current&&sequence.current===version){setStatus('saved');setError('');}
  }).catch(e=>{if(mounted.current&&sequence.current===version){setStatus('error');setError(e instanceof Error?e.message:'Your place could not be saved.');}});
 },[save,lessonId]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 useEffect(()=>{
  if(initialized.current||!learning?.ready)return;
  initialized.current=true;
  const saved=learning.data.quizSessions?.[lessonId as LessonId];let cache:CachedAttempt|null=null;
  try{cache=JSON.parse(localStorage.getItem(cacheKey)||'null');}catch{/* The account copy still works if browser storage is unavailable. */}
  const recovered=restoreQuizSession(saved,cache,total) as CachedAttempt|null;
  const next=recovered?.state||(validQuizSession(saved,total)?saved:null)||{attemptId:crypto.randomUUID(),revision:1,index:0,selection:'',submitted:false,answers:[]};
  previousAttemptId.current=recovered?.previousAttemptId??saved?.attemptId??null;
  current.current=next;setState(next);
  if(recovered)persist(next);else if(saved)setStatus('saved');
 },[learning?.ready,learning?.data.quizSessions,lessonId,total,cacheKey,persist]);
 const flush=useCallback(()=>{if(pending.current){clearTimeout(pending.current);pending.current=null;if(current.current)persist(current.current);}},[persist]);
 useEffect(()=>{
  const retry=()=>{if(current.current)persist(current.current);};
  const hide=()=>{if(document.visibilityState==='hidden')flush();};
  window.addEventListener('pagehide',flush);window.addEventListener('online',retry);document.addEventListener('visibilitychange',hide);
  return()=>{window.removeEventListener('pagehide',flush);window.removeEventListener('online',retry);document.removeEventListener('visibilitychange',hide);flush();};
 },[flush,persist]);
 function update(next:QuizSession,debounce=false){
  current.current=next;setState(next);
  // Synchronous account-scoped recovery protects the very last keystroke on refresh.
  try{localStorage.setItem(cacheKey,JSON.stringify({state:next,previousAttemptId:previousAttemptId.current}));}catch{/* Save to the account even when browser storage is unavailable. */}
  if(pending.current)clearTimeout(pending.current);
  pending.current=null;
  if(debounce){setStatus('saving');pending.current=setTimeout(()=>{pending.current=null;persist(next);},250);}else persist(next);
 }
 function select(selection:string){const s=current.current;if(!s||s.submitted||s.index===total)return;update({...s,selection:selection.slice(0,512),revision:s.revision+1},true);}
 function check(){
  const s=current.current;if(!s||s.submitted||s.index===total||!s.selection.trim())return;
  const answers=[...s.answers,s.selection];const finished=answers.length===total;
  update({...s,answers,revision:s.revision+1,index:finished?total:s.index,submitted:!finished,selection:finished?'':s.selection});
  if(finished)setCelebrate(quizPasses(answers.reduce((score,answer,index)=>score+(answerIsCorrect(quizBank[lessonId][index],answer)?1:0),0),total));
 }
 function next(){const s=current.current;if(!s?.submitted)return;update({...s,index:s.index+1,selection:'',submitted:false,revision:s.revision+1});}
 function restart(){const s=current.current;if(!s||s.index!==total)return;previousAttemptId.current=s.attemptId;setCelebrate(false);update({attemptId:crypto.randomUUID(),revision:1,index:0,selection:'',submitted:false,answers:[]});}
 const score=state?.answers.reduce((sum,answer,index)=>sum+(answerIsCorrect(quizBank[lessonId][index],answer)?1:0),0)||0;
 return{state,status,error,celebrate,score,total,savedResult:learning?.data.quizzes[lessonId as LessonId],select,check,next,restart,retry:()=>{if(current.current)persist(current.current);},loadError:learning?.error,reload:learning?.reload};
}
