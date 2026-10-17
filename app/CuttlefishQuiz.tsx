"use client";

import { useRef, useState } from "react";

import {cuttlefishQuestions as questions} from "../shared/learning-content.mjs";

import {QuizSave,useQuizAttempt} from "./LearningProgress";

export default function CuttlefishQuiz() {
  const attempt=useQuizAttempt();
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState<number|null>(null);
  const [submitted,setSubmitted]=useState(false);
  const [score,setScore]=useState(0);
  const checked=useRef(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const complete=index===questions.length;
  const question=questions[Math.min(index,questions.length-1)];
  const correct=answer===question.answer;
  function submit(){if(answer===null||checked.current||complete)return;attempt.record(index,questions[index].options[answer]);checked.current=true;setSubmitted(true);if(correct)setScore(value=>value+1);}
  function advance(restart=false){setIndex(value=>restart?0:value+1);setAnswer(null);setSubmitted(false);checked.current=false;if(restart){setScore(0);attempt.restart();}heading.current?.focus();}
  return <section className="cuttlefish-quiz enso-quiz" aria-labelledby="cuttlefish-quiz-title"><div className="quiz-shell"><QuizSave lessonId="cuttlefish" answers={attempt.answers} attemptId={attempt.attemptId}/>
    <div className="quiz-header"><div><span>Knowledge check · 7 questions · 5 choices</span><h2 id="cuttlefish-quiz-title" ref={heading} tabIndex={-1}>Common Cuttlefish quiz</h2></div><strong>{complete?"Complete":`Question ${index+1} of ${questions.length}`}</strong></div>
    <div className="quiz-progress" aria-hidden="true"><i style={{width:`${(index+(submitted?1:0))/questions.length*100}%`}} /></div>
    {complete?<div className="quiz-finish" aria-live="polite"><span>Quiz complete</span><strong>{score} / {questions.length}</strong><p>{score===questions.length?"Perfect score! You know your cuttlefish anatomy and camouflage.":"Review the lesson and skin model, then try again to strengthen what you learned."}</p><button type="button" onClick={()=>advance(true)}>Try the quiz again</button></div>:<div className="quiz-question">
      <p className="quiz-kind">Five-choice question · Choose one answer</p><h3 id="cuttlefish-question-prompt">{question.prompt}</h3>
      <div className="quiz-options" role="group" aria-labelledby="cuttlefish-question-prompt">{question.options.map((option,i)=><button type="button" key={`${index}-${i}`} aria-pressed={answer===i} disabled={submitted} onClick={()=>setAnswer(i)} className={`quiz-option ${answer===i?"selected":""} ${submitted&&i===question.answer?"correct":""} ${submitted&&answer===i&&!correct?"incorrect":""}`}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
      {submitted&&<div className={`quiz-feedback ${correct?"correct":"incorrect"}`} role="status"><p>{correct?"Correct!":<>Not quite. The correct answer is <strong>{question.options[question.answer]}</strong>.</>}</p><p>{question.explanation}</p></div>}
      <div className="quiz-actions"><span>Score: {score} / {index+(submitted?1:0)}</span>{submitted?<button type="button" onClick={()=>advance()}>{index===questions.length-1?"See results":"Next question →"}</button>:<button type="button" disabled={answer===null} onClick={submit}>Check answer</button>}</div>
    </div>}
  </div></section>;
}
