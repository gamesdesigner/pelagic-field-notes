"use client";

import { useRef, useState } from "react";

const questions = [
  {
    prompt: "Where does El Niño develop?",
    options: ["In the Arctic Ocean", "In the northern Atlantic Ocean", "In the central and eastern tropical Pacific Ocean", "Only in the Mediterranean Sea", "Only in the Southern Ocean"],
    answer: 2,
    explanation: "El Niño is the warm phase of ENSO in the tropical Pacific.",
  },
  {
    prompt: "What usually happens to the trade winds during El Niño?",
    options: ["They always blow twice as strongly", "They weaken", "They stop everywhere on Earth", "They turn into ocean tides", "They blow only from north to south"],
    answer: 1,
    explanation: "Weaker trade winds help warm surface water spread eastward.",
  },
  {
    prompt: "During El Niño, where does warm surface water spread?",
    options: ["Toward the Arctic", "Only deeper into the ocean", "Away from the equator toward Antarctica", "Eastward toward the Americas", "Only westward toward Indonesia"],
    answer: 3,
    explanation: "The warm pool spreads toward the central and eastern Pacific.",
  },
  {
    prompt: "Why can weaker upwelling during El Niño reduce food for marine life?",
    options: ["Fewer nutrients reach the surface from deep water", "All sunlight disappears", "The ocean loses all its salt", "Fish can no longer breathe any oxygen", "Seawater turns into freshwater"],
    answer: 0,
    explanation: "Less nutrient-rich deep water reaches the surface, which can reduce phytoplankton growth and affect the food web.",
  },
  {
    prompt: "Which combination best describes La Niña?",
    options: ["Weaker trade winds and warmer eastern Pacific water", "No trade winds and no currents", "Stronger trade winds and warmer eastern Pacific water", "Weaker trade winds and warmer water everywhere", "Stronger trade winds and cooler central and eastern Pacific water"],
    answer: 4,
    explanation: "Stronger winds push warm water west and strengthen eastern upwelling during La Niña.",
  },
  {
    prompt: "What does it mean when scientists say El Niño favors wetter winters in the southern United States?",
    options: ["Every day will have heavy rain", "Every place on Earth will become wetter", "It increases the chance of wetter conditions, but does not determine every storm", "Only ocean temperatures change; weather cannot change", "The exact same storms happen during every El Niño"],
    answer: 2,
    explanation: "ENSO changes weather probabilities. Local effects still depend on the season, event strength and other weather influences.",
  },
  {
    prompt: "Which statement about the ENSO cycle is correct?",
    options: ["El Niño starts on the same date every year", "Warm, cool and neutral phases occur on an irregular schedule", "La Niña always starts immediately after El Niño", "Each phase lasts exactly seven days", "El Niño and La Niña happen only once a century"],
    answer: 1,
    explanation: "ENSO has no fixed timetable. Events commonly recur about every 2–7 years and can last many months or longer.",
  },
];

export default function EnsoQuiz() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const title = useRef<HTMLHeadingElement>(null);
  const checked = useRef(false);
  const complete = index === questions.length;
  const question = questions[Math.min(index, questions.length - 1)];
  const correct = answer === question.answer;

  function checkAnswer() {
    if (answer === null || checked.current || complete) return;
    checked.current = true;
    setSubmitted(true);
    if (correct) setScore(value => value + 1);
  }

  function advance(restart = false) {
    setIndex(value => restart ? 0 : value + 1);
    setAnswer(null);
    setSubmitted(false);
    checked.current = false;
    if (restart) setScore(0);
    title.current?.focus();
  }

  return <section className="enso-quiz" aria-labelledby="enso-quiz-title">
    <div className="quiz-shell">
      <div className="quiz-header">
        <div><span>Knowledge check · 7 questions · 5 choices</span><h2 id="enso-quiz-title" ref={title} tabIndex={-1}>El Niño &amp; La Niña quiz</h2></div>
        <strong>{complete ? "Complete" : `Question ${index + 1} of ${questions.length}`}</strong>
      </div>
      <div className="quiz-progress" aria-hidden="true"><i style={{width:`${(index + (submitted ? 1 : 0)) / questions.length * 100}%`}} /></div>
      {complete ? <div className="quiz-finish" aria-live="polite">
        <span>Quiz complete</span><strong>{score} / {questions.length}</strong>
        <p>{score === questions.length ? "You connected the winds, water and weather. Perfect score!" : "Review the lesson and animation, then try again to strengthen what you learned."}</p>
        <button type="button" onClick={() => advance(true)}>Try the quiz again</button>
      </div> : <div className="quiz-question">
        <p className="quiz-kind">Five-choice question · Choose one answer</p>
        <h3 id="enso-question-prompt">{question.prompt}</h3>
        <div className="quiz-options" role="group" aria-labelledby="enso-question-prompt">
          {question.options.map((option, optionIndex) => <button type="button" key={`${index}-${optionIndex}`} aria-pressed={answer === optionIndex} disabled={submitted} onClick={() => setAnswer(optionIndex)} className={`quiz-option ${answer === optionIndex ? "selected" : ""} ${submitted && optionIndex === question.answer ? "correct" : ""} ${submitted && answer === optionIndex && !correct ? "incorrect" : ""}`}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}
        </div>
        {submitted && <div className={`quiz-feedback ${correct ? "correct" : "incorrect"}`} role="status"><p>{correct ? "Correct!" : <>Not quite. The correct answer is <strong>{question.options[question.answer]}</strong>.</>}</p><p>{question.explanation}</p></div>}
        <div className="quiz-actions"><span>Score: {score} / {index + (submitted ? 1 : 0)}</span>{submitted ? <button type="button" onClick={() => advance()}>{index === questions.length - 1 ? "See results" : "Next question →"}</button> : <button type="button" disabled={answer === null} onClick={checkAnswer}>Check answer</button>}</div>
      </div>}
    </div>
  </section>;
}
