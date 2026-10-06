"use client";

import { useRef, useState } from "react";

const questions = [
  {prompt:"What do young great white sharks mainly eat?",options:["Only seals and sea lions","Seagrasses and algae","Fish, squid, rays, and smaller sharks","Only plankton","Coral and seaweed"],answer:2,explanation:"Young great whites eat smaller animal prey. Larger sharks can also hunt seals and sea lions."},
  {prompt:"Which part provides most of a great white shark’s swimming thrust?",options:["Its teeth","Its powerful tail","Its eyes","Its gill slits alone","Its sense of smell"],answer:1,explanation:"The muscular body and tail drive the shark through the water. Its fins help control its movement."},
  {prompt:"How do scientists track the long-distance movements of great white sharks?",options:["By following their footprints","By measuring waves on beaches","By counting shells on the seabed","By using electronic tags","By listening only to seabirds"],answer:3,explanation:"Electronic tags record or transmit information that helps researchers study shark movements and dives."},
  {prompt:"What can the ampullae of Lorenzini detect?",options:["Weak electrical signals from other animals","The age of nearby rocks","The exact depth of every ocean","Colors in distant clouds","Sunlight through solid land"],answer:0,explanation:"These sensory organs detect weak electrical signals, including those produced by other animals’ muscles and nerves."},
  {prompt:"Which statement best describes great white shark migration?",options:["They stay beside the same rock throughout their lives","They travel only in rivers","They never enter offshore waters","Every shark follows exactly the same route","Some travel thousands of kilometers between coastal and offshore areas"],answer:4,explanation:"Tagging studies show long journeys between feeding areas and offshore waters. Routes and timing can vary."},
  {prompt:"What role do great white sharks play in marine food webs?",options:["They produce food through photosynthesis","They are mainly plant grazers","They are top predators that influence prey populations and behavior","They turn seawater into freshwater","They eat only dead plants"],answer:2,explanation:"Great whites are top predators. Their hunting and presence can influence other animals in the food web."},
  {prompt:"Why can great white shark populations take a long time to recover after losses?",options:["They reproduce daily","They reproduce slowly and have relatively few young","They never migrate","They are unable to eat fish","Their teeth cannot regrow"],answer:1,explanation:"Slow reproduction and relatively few offspring mean populations recover gradually from threats such as accidental capture in fishing gear."},
];

export default function SharkQuiz() {
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
  return <section className="shark-quiz enso-quiz" aria-labelledby="shark-quiz-title"><div className="quiz-shell">
    <div className="quiz-header"><div><span>Knowledge check · 7 questions · 5 choices</span><h2 id="shark-quiz-title" ref={heading} tabIndex={-1}>Great White Shark quiz</h2></div><strong>{complete?"Complete":`Question ${index+1} of ${questions.length}`}</strong></div>
    <div className="quiz-progress" aria-hidden="true"><i style={{width:`${(index+(submitted?1:0))/questions.length*100}%`}} /></div>
    {complete?<div className="quiz-finish" aria-live="polite"><span>Quiz complete</span><strong>{score} / {questions.length}</strong><p>{score===questions.length?"Perfect score! You know this ocean predator.":"Review the lesson and swimming animation, then try again to strengthen what you learned."}</p><button type="button" onClick={()=>advance(true)}>Try the quiz again</button></div>:<div className="quiz-question">
      <p className="quiz-kind">Five-choice question · Choose one answer</p><h3 id="shark-question-prompt">{question.prompt}</h3>
      <div className="quiz-options" role="group" aria-labelledby="shark-question-prompt">{question.options.map((option,i)=><button type="button" key={`${index}-${i}`} aria-pressed={answer===i} disabled={submitted} onClick={()=>setAnswer(i)} className={`quiz-option ${answer===i?"selected":""} ${submitted&&i===question.answer?"correct":""} ${submitted&&answer===i&&!correct?"incorrect":""}`}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
      {submitted&&<div className={`quiz-feedback ${correct?"correct":"incorrect"}`} role="status"><p>{correct?"Correct!":<>Not quite. The correct answer is <strong>{question.options[question.answer]}</strong>.</>}</p><p>{question.explanation}</p></div>}
      <div className="quiz-actions"><span>Score: {score} / {index+(submitted?1:0)}</span>{submitted?<button type="button" onClick={()=>advance()}>{index===questions.length-1?"See results":"Next question →"}</button>:<button type="button" disabled={answer===null} onClick={submit}>Check answer</button>}</div>
    </div>}
  </div></section>;
}
