"use client";
import {useEffect,useId,useRef,type CSSProperties} from 'react';
import {answerIsCorrect,quizBank} from '../shared/learning-content.mjs';
import {isWrittenQuestion} from '../shared/written-answer-grading.mjs';
import {quizPasses} from '../shared/quiz-attempts.mjs';
import {useQuizAttempt,type QuizId} from './useQuizAttempt';

export default function LessonQuiz({lessonId,title,className='upwelling-quiz'}:{lessonId:QuizId;title:string;className?:string}){
 const quiz=useQuizAttempt(lessonId);const id=useId();const heading=useRef<HTMLHeadingElement>(null);const previousIndex=useRef<number|null>(null);
 const {state,score,total}=quiz;const index=state?.index??0;
 const hasState=state!==null;
 // Restoring an attempt must not pull a reader from the article to the quiz.
 useEffect(()=>{if(!hasState)return;if(previousIndex.current!==null&&previousIndex.current!==index)heading.current?.focus({preventScroll:true});previousIndex.current=index;},[index,hasState]);
 const questions=quizBank[lessonId];const complete=index===total;
 const question=questions[Math.min(index,total-1)];
 const expected=typeof question.answer==='number'?question.options![question.answer]:question.answer;
 const shift=['upwelling','coriolis','sunlight','turtle'].includes(lessonId)&&question.options?(index*3+1)%question.options.length:0;
 const options=question.options?[...question.options.slice(shift),...question.options.slice(0,shift)]:undefined;
 const written=isWrittenQuestion(question);
 const correct=!!state&&answerIsCorrect(question,state.selection);
 const passed=quizPasses(score,total);
 return <section className={className} aria-labelledby={`${id}-title`}><div className="quiz-shell">
  <div className="quiz-header"><div><span>Knowledge check · {total} questions</span><h2 id={`${id}-title`}>{title}</h2></div><strong>{!state?'Loading…':complete?'Complete':`Question ${index+1} of ${total}`}</strong></div>
  <div className="quiz-save-status" aria-live="polite">
   {!state?<p>{quiz.loadError||'Loading your saved place…'} {quiz.loadError&&<button type="button" onClick={quiz.reload}>Try loading again</button>}</p>:quiz.status==='error'?<p role="alert">{quiz.error} Retry to sync your place to your account. <button type="button" onClick={quiz.retry}>Retry saving</button></p>:<p>{quiz.status==='saving'?'Saving your place…':quiz.status==='saved'?(complete?'✓ Quiz complete. Score saved to your account.':'✓ Your place is saved. Reopen this lesson to continue.'):'Your place saves automatically as you answer.'}</p>}
   {quiz.savedResult&&<p>Latest: <strong>{quiz.savedResult.latestScore}/{total}</strong> · Best: <strong>{quiz.savedResult.bestScore}/{total}</strong> · {quiz.savedResult.attempts} saved attempt{quiz.savedResult.attempts===1?'':'s'}</p>}
  </div>
  {state&&<><div className="quiz-progress" aria-hidden="true"><i style={{width:`${state.answers.length/total*100}%`}}/></div>
   {complete?<div className="quiz-finish" aria-live="polite">
    {passed&&<div className={`quiz-ta-da ${quiz.celebrate?'animate':''}`}><div className="quiz-sparkles" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{'--spark':i} as CSSProperties}/>)}</div><span className="quiz-achievement" aria-hidden="true">✓</span><p>{quiz.celebrate?'Ta-da!':'Well done!'} You reached 70% or higher.</p></div>}
    <h3 ref={heading} tabIndex={-1}>Quiz complete</h3><strong>{score} / {total}</strong><p>{Math.round(score/total*100)}% correct · {passed?'Great work exploring the ocean.':'Keep exploring the lesson, then try again.'}</p>
    <details className="quiz-answer-review"><summary>Review your answers</summary><ol>{questions.map((item,i)=>{const right=answerIsCorrect(item,state.answers[i]);const answer=typeof item.answer==='number'?item.options![item.answer]:item.answer;return <li key={i}><strong>{item.prompt}</strong><p>{right?'✓ Correct':'Review'} · Your answer: {state.answers[i]}</p>{!right&&<p>{isWrittenQuestion(item)?'Model answer':'Correct answer'}: {answer}</p>}{'explanation' in item&&<p>{item.explanation}</p>}</li>;})}</ol></details>
    <button type="button" disabled={quiz.status!=='saved'} onClick={quiz.restart}>Try the quiz again</button>
   </div>:<div className="quiz-question">
    <p className="quiz-kind">{written?'Written answer · Use your own words':question.options?'Choose one answer':'Spelling question · Type your answer'}</p><h3 id={`${id}-prompt`} ref={heading} tabIndex={-1}>{question.prompt}</h3>
    {question.options?<div className="quiz-options" role="group" aria-labelledby={`${id}-prompt`}>{options!.map((option,i)=><button type="button" key={`${index}-${i}`} aria-pressed={state.selection===option} disabled={state.submitted} onClick={()=>quiz.select(option)} className={`quiz-option ${state.selection===option?'selected':''} ${state.submitted&&option===expected?'correct':''} ${state.submitted&&state.selection===option&&!correct?'incorrect':''}`}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>:written?<div className="quiz-written"><label htmlFor={`${id}-answer`}>Your written answer</label><textarea id={`${id}-answer`} aria-describedby={`${id}-answer-help`} rows={3} autoComplete="off" spellCheck maxLength={512} value={state.selection} disabled={state.submitted} onChange={e=>quiz.select(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();quiz.check();}}}/><small id={`${id}-answer-help`}>Use a word or a short explanation that answers every part of the question. Automatic checking looks for the key ideas and accepted phrases; your wording can differ from the model answer. Ctrl/⌘ + Enter checks your answer.</small></div>:<div className="quiz-spelling"><label htmlFor={`${id}-answer`}>Your answer</label><input id={`${id}-answer`} type="text" autoComplete="off" spellCheck={false} maxLength={512} value={state.selection} disabled={state.submitted} onChange={e=>quiz.select(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')quiz.check();}}/><small>Small spelling slips are okay.</small></div>}
    {state.submitted&&<div className={`quiz-feedback ${correct?'correct':'incorrect'}`} role="status"><p>{correct?'Correct!':<>{written?'Not quite yet. A model answer is':'Not quite. The correct answer is'} <strong>{expected}</strong>{written?'':'.'}</>}</p>{written&&correct&&<p>Model answer: {expected}</p>}{'explanation' in question&&<p>{question.explanation}</p>}</div>}
    <div className="quiz-actions"><span>Score: {score} / {state.answers.length}</span>{state.submitted?<button type="button" onClick={quiz.next}>Next question →</button>:<button type="button" disabled={!state.selection.trim()} onClick={quiz.check}>Check answer</button>}</div>
   </div>}
  </>}
 </div></section>;
}
