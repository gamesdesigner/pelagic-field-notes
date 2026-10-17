"use client";

import { useRef, useState } from "react";

import {ensoQuestions as questions} from "../shared/learning-content.mjs";

import {QuizSave,useQuizAttempt} from "./LearningProgress";

export default function EnsoQuiz() {
  const attempt=useQuizAttempt();
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
    attempt.record(index,questions[index].options[answer]);
    checked.current = true;
    setSubmitted(true);
    if (correct) setScore(value => value + 1);
  }

  function advance(restart = false) {
    setIndex(value => restart ? 0 : value + 1);
    setAnswer(null);
    setSubmitted(false);
    checked.current = false;
    if (restart) {setScore(0);attempt.restart();}
    title.current?.focus();
  }

  return <section className="enso-quiz" aria-labelledby="enso-quiz-title">
    <div className="quiz-shell"><QuizSave lessonId="enso" answers={attempt.answers} attemptId={attempt.attemptId}/>
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
