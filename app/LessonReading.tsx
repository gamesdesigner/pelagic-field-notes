"use client";

import { type ReactNode, useId, useRef, useState } from "react";
import { deepDives, readingSources, type LessonId } from "./deepDives";

export default function LessonReading({ lessonId, children }: { lessonId: LessonId; children: ReactNode }) {
  const [level, setLevel] = useState<1 | 2>(1);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const lesson = deepDives[lessonId];
  const bodyWords = lesson.sections.flatMap(section => section.paragraphs).join(" ").split(/\s+/).length;
  const words = bodyWords + lesson.abstract.split(/\s+/).length;
  function selectLevel(next: 1 | 2) {
    if (next === level) return;
    const returnToArticle = (root.current?.getBoundingClientRect().top ?? 0) < 0;
    setLevel(next);
    if (returnToArticle) requestAnimationFrame(() => root.current?.scrollIntoView({ block: "start", behavior: "auto" }));
  }
  return <div className="lesson-reading" ref={root} data-lesson-id={lessonId} data-reading-level={level}>
    <div className="reading-level-picker" role="group" aria-label={`${lesson.title} reading level`}>
      <p>Choose your reading level</p>
      <div><button type="button" aria-pressed={level === 1} aria-controls={`${id}-short`} onClick={() => selectLevel(1)}>Level 1 <span>Short article</span></button><button type="button" aria-pressed={level === 2} aria-controls={`${id}-deep`} onClick={() => selectLevel(2)}>Level 2 <span>High-school deep dive</span></button></div>
    </div>
    <div id={`${id}-short`} hidden={level !== 1}>{children}</div>
    <div id={`${id}-deep`} hidden={level !== 2}>
      {level === 2 && <article className="deep-dive-article" aria-labelledby={`${id}-title`}>
        <header><p className="deep-dive-eyebrow">Level 2 · High-school science · {bodyWords.toLocaleString("en-US")} words · {Math.ceil(words / 180)} minute read</p><h2 id={`${id}-title`}>{lesson.title}</h2><p className="deep-dive-deck">{lesson.deck}</p></header>
        <section className="deep-dive-abstract" aria-labelledby={`${id}-abstract`}><h3 id={`${id}-abstract`}>Abstract</h3><p>{lesson.abstract}</p></section>
        <nav className="deep-dive-contents" aria-label="In this article"><strong>In this article</strong><ol>{lesson.sections.map((section, index) => <li key={section.heading}><a href={`#${id}-section-${index}`}>{section.heading}</a></li>)}</ol></nav>
        {lesson.sections.map((section, index) => <section className="deep-dive-section" key={section.heading} aria-labelledby={`${id}-section-${index}`}><h3 id={`${id}-section-${index}`}>{section.heading}</h3>{section.paragraphs.map((paragraph, p) => <p key={p}>{paragraph}</p>)}{section.sources && <p className="deep-dive-citation">Explore the evidence: {section.sources.map((key, s) => <span key={key}>{s > 0 ? " · " : ""}<a href={readingSources[key].url} target="_blank" rel="noreferrer">{readingSources[key].label}</a></span>)}</p>}</section>)}
        <aside className="deep-dive-concepts"><h3>Key terms</h3><dl>{lesson.terms.map(term => <div key={term.word}><dt>{term.word}</dt><dd>{term.definition}</dd></div>)}</dl></aside>
        <aside className="deep-dive-question"><h3>Think like a scientist</h3><p>{lesson.question}</p></aside>
        <p className="deep-dive-end">Use the Level 1 button above to return to the original article. Explore the lesson’s images, models, and available quizzes below.</p>
      </article>}
    </div>
  </div>;
}
