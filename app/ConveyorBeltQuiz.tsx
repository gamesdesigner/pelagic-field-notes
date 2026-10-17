"use client";

import { useEffect, useRef, useState } from "react";

import {conveyorQuestions as questions} from "../shared/learning-content.mjs";

import {QuizSave,useQuizAttempt} from "./LearningProgress";

export default function ConveyorBeltQuiz() {
  const attempt=useQuizAttempt();
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
    attempt.record(index,answer);
    setSubmitted(true);
    if (correct) setScore((value) => value + 1);
  };
  const nextQuestion = () => {
    setIndex((value) => value + 1);
    setAnswer("");
    setSubmitted(false);
  };
  const restart = () => {
    attempt.restart();
    setIndex(0);
    setAnswer("");
    setSubmitted(false);
    setScore(0);
  };

  return (
    <section className="upwelling-quiz conveyor-quiz" aria-labelledby="conveyor-quiz-title">
      <div className="quiz-shell"><QuizSave lessonId="conveyor" answers={attempt.answers} attemptId={attempt.attemptId}/>
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
