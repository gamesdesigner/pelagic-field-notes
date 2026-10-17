"use client";

import { useRef, useState } from "react";

const questions = [
 {prompt:"Which structure helps a cuttlefish control its buoyancy?",options:["Its beak","Its W-shaped pupil","Its cuttlebone","Its chromatophores","Its ink"],answer:2,explanation:"The gas-and-liquid chamber system of the internal cuttlebone helps control overall density and buoyancy."},
 {prompt:"How many short arms and longer feeding tentacles does a common cuttlefish have?",options:["Six arms and four tentacles","Eight arms and two tentacles","Ten arms and no tentacles","Two arms and eight tentacles","Four arms and four tentacles"],answer:1,explanation:"Eight shorter arms handle prey, while two longer feeding tentacles extend to seize it."},
 {prompt:"What happens when a chromatophore’s radial muscles contract?",options:["The animal grows a new shell","The pigment disappears","The eye changes position","The pigment sac expands and shows more pigment","The skin produces sunlight"],answer:3,explanation:"Radial muscles pull the elastic pigment sac outward, increasing its visible area."},
 {prompt:"Which structures produce iridescent effects by reflecting selected wavelengths?",options:["Iridophores","The beak","Leucophores alone","Feeding tentacles","The cuttlebone"],answer:0,explanation:"Iridophores use microscopic reflective structures; they work differently from pigment sacs."},
 {prompt:"What is the main role of leucophores in the skin model?",options:["Pumping blood","Grabbing shrimp","Storing eggs","Generating electrical light","Scattering incoming light to give a pale background"],answer:4,explanation:"Leucophores scatter light broadly. They do not make their own light."},
 {prompt:"What changes when a cuttlefish raises its papillae?",options:["The number of arms","The hardness of its beak","The skin’s texture and outline","The length of its cuttlebone","The amount of seawater salt"],answer:2,explanation:"Papillae are muscular skin projections that can make the surface bumpier. They are not pigment cells."},
 {prompt:"Why does this lesson combine pigment, reflection, and texture?",options:["All three are the same type of cell","They are different mechanisms that work together to change appearance","Only texture can help camouflage","Cuttlefish cannot respond to visual information","Every skin structure makes its own light"],answer:1,explanation:"Pigment expansion, reflective and scattering structures, and papillae contribute in different ways to the cuttlefish’s appearance."},
];

export default function CuttlefishQuiz() {
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState<number|null>(null);
  const [submitted,setSubmitted]=useState(false);
  const [score,setScore]=useState(0);
  const checked=useRef(false);
  const heading=useRef<HTMLHeadingElement>(null);
  const complete=index===questions.length;
  const question=questions[Math.min(index,questions.length-1)];
  const correct=answer===question.answer;
  function submit(){if(answer===null||checked.current||complete)return;checked.current=true;setSubmitted(true);if(correct)setScore(value=>value+1);}
  function advance(restart=false){setIndex(value=>restart?0:value+1);setAnswer(null);setSubmitted(false);checked.current=false;if(restart)setScore(0);heading.current?.focus();}
  return <section className="cuttlefish-quiz enso-quiz" aria-labelledby="cuttlefish-quiz-title"><div className="quiz-shell">
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
