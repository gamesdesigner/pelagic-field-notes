"use client";

import { useEffect, useRef, useState } from "react";

const questions = [
  {
    prompt: "Which two properties of seawater give thermohaline circulation its name?",
    options: ["Wave height and tides", "Temperature and salinity", "Sunlight and oxygen", "Wind speed and rainfall"],
    answer: "Temperature and salinity",
    explanation: "Thermo means temperature and haline refers to salt. Both affect seawater density, which helps drive deep-ocean circulation.",
  },
  {
    prompt: "Why does cold, salty water sink in the North Atlantic?",
    options: ["It contains more sunlight", "It is pushed down by fish", "It is less dense than warmer water", "It is denser than the water around it"],
    answer: "It is denser than the water around it",
    explanation: "Cooling and high salinity can make surface water dense enough to sink and feed the deep Atlantic current.",
  },
  {
    prompt: "Where does an important sinking region of the global conveyor belt form?",
    options: ["The North Atlantic near Greenland and Iceland", "The middle of the Sahara Desert", "The Amazon River", "The equatorial Pacific coastline"],
    answer: "The North Atlantic near Greenland and Iceland",
    explanation: "The lesson's sinking marker highlights the North Atlantic, where surface water loses heat and dense water moves into deeper layers.",
  },
  {
    prompt: "After deep water moves south through the Atlantic, which two ocean basins receive major branches of the conveyor pathway?",
    options: ["The Mediterranean and Caribbean seas", "The Arctic and Mediterranean", "The Indian and Pacific oceans", "Only the Atlantic Ocean"],
    answer: "The Indian and Pacific oceans",
    explanation: "Deep water exchanges with the Southern Ocean and branches toward the Indian and Pacific basins in the schematic conveyor pathway.",
  },
  {
    prompt: "What helps deep water return toward the ocean surface?",
    options: ["The ocean floor becoming dry", "Mixing and wind-driven upwelling", "The Moon turning water into ice", "All deep currents stopping"],
    answer: "Mixing and wind-driven upwelling",
    explanation: "Mixing and upwelling bring deep water back toward the upper ocean across broad regions, helping connect the deep and surface pathways.",
  },
  {
    prompt: "About how long can a parcel of water take to complete a journey around the global conveyor belt?",
    options: ["One day", "One month", "Ten years", "1,000 years"],
    answer: "1,000 years",
    explanation: "A complete journey can take roughly 1,000 years. The map speeds up the animation so you can see the movement.",
  },
  {
    prompt: "How can fresh water from melting ice affect sinking in the North Atlantic?",
    options: ["It can lower surface-water density and weaken sinking", "It always makes seawater saltier", "It instantly stops every ocean current", "It makes surface water denser than before"],
    answer: "It can lower surface-water density and weaken sinking",
    explanation: "Fresh water lowers salinity and can make surface water less dense. This can weaken the sinking that helps sustain Atlantic overturning.",
  },
];

export default function ConveyorBeltQuiz() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const complete = index === questions.length;
  const question = questions[Math.min(index, questions.length - 1)];
  const correct = answer === question.answer;

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  const checkAnswer = () => {
    if (!answer || submitted || complete) return;
    setSubmitted(true);
    if (correct) setScore((value) => value + 1);
  };
  const nextQuestion = () => {
    setIndex((value) => value + 1);
    setAnswer("");
    setSubmitted(false);
  };
  const restart = () => {
    setIndex(0);
    setAnswer("");
    setSubmitted(false);
    setScore(0);
  };

  return (
    <section className="upwelling-quiz conveyor-quiz" aria-labelledby="conveyor-quiz-title">
      <div className="quiz-shell">
        <div className="quiz-header">
          <div><span>Knowledge check · 7 questions</span><h2 id="conveyor-quiz-title">Global conveyor belt quiz</h2></div>
          <strong>{complete ? "Complete" : `Question ${index + 1} of ${questions.length}`}</strong>
        </div>
        <div className="quiz-progress" aria-hidden="true"><i style={{ width: `${(index + (submitted ? 1 : 0)) / questions.length * 100}%` }} /></div>
        {complete ? (
          <div className="quiz-finish" aria-live="polite">
            <h3 ref={headingRef} tabIndex={-1}>Quiz complete</h3>
            <strong>{score} / {questions.length}</strong>
            <p>{score === questions.length ? "Perfect score—you understand the global conveyor belt." : "Review the circulation map and explanations, then try again."}</p>
            <button type="button" onClick={restart}>Try the quiz again</button>
          </div>
        ) : (
          <div className="quiz-question">
            <p className="quiz-kind">Choose one answer</p>
            <h3 ref={headingRef} tabIndex={-1}>{question.prompt}</h3>
            <div className="quiz-options" role="group" aria-label={`Answers for question ${index + 1}`}>
              {question.options.map((option, optionIndex) => (
                <button type="button" key={option} aria-pressed={answer === option} disabled={submitted} onClick={() => setAnswer(option)} className={`quiz-option ${answer === option ? "selected" : ""} ${submitted && option === question.answer ? "correct" : ""} ${submitted && answer === option && !correct ? "incorrect" : ""}`}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>
              ))}
            </div>
            {submitted && <div className={`quiz-feedback ${correct ? "correct" : "incorrect"}`} role="status"><p>{correct ? "Correct!" : <>Not quite. The correct answer is <strong>{question.answer}</strong>.</>}</p><p>{question.explanation}</p></div>}
            <div className="quiz-actions"><span>Score: {score} / {index + (submitted ? 1 : 0)}</span>{submitted ? <button type="button" onClick={nextQuestion}>{index === questions.length - 1 ? "See results" : "Next question →"}</button> : <button type="button" disabled={!answer} onClick={checkAnswer}>Check answer</button>}</div>
          </div>
        )}
      </div>
    </section>
  );
}
