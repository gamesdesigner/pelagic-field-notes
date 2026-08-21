"use client";

import { useEffect, useRef, useState } from "react";

const chapters = [
  { eyebrow: "01 · Light & life", title: "The sunlit surface", depth: "0–200 m", target: 0, copy: "Nearly all ocean food webs begin in this bright, restless layer. Phytoplankton turn sunlight and dissolved carbon into living tissue—feeding everything from copepods to blue whales.", note: "Although it is the ocean’s thinnest major zone, the epipelagic produces roughly half of Earth’s oxygen.", label: "Primary production" },
  { eyebrow: "02 · Dimming blue", title: "Into the twilight", depth: "200–1,000 m", target: 1, copy: "Below the reach of photosynthesis, light fades rapidly. Every evening, countless animals rise toward surface waters to feed, then retreat before sunrise—the planet’s largest daily migration.", note: "Red wavelengths disappear first. Many twilight animals are red or black, making them nearly invisible in blue light.", label: "Diel migration" },
  { eyebrow: "03 · Form & function", title: "Anatomy of a drifter", depth: "Moon jelly · Aurelia aurita", target: 2, copy: "A moon jelly is more water than animal. Its translucent bell pulses gently, while a network of canals distributes nutrients through a body with no heart, brain, or bones.", note: "The four horseshoe-shaped forms visible through the bell are gonads—the easiest field mark for this widespread species.", label: "Jelly anatomy" },
  { eyebrow: "04 · Living light", title: "Signals in the dark", depth: "1,000–4,000 m", target: 3, copy: "In the midnight zone, bioluminescence replaces sunlight. Animals make light to hunt, hide, find mates, and confuse predators. A flash can be lure, language, or last defense.", note: "Blue-green light travels farthest through seawater, so most deep-sea bioluminescence glows within this narrow range.", label: "Bioluminescence" },
];

const questions = [
  { prompt: "Why is blue-green bioluminescence most common in the deep sea?", choices: ["It requires less oxygen", "It travels farthest in seawater", "It is warmer than red light"], answer: 1, target: 3 },
  { prompt: "Which structure is the best field mark for a moon jelly?", choices: ["Four visible gonads", "A rigid outer shell", "A single long tentacle"], answer: 0, target: 2 },
  { prompt: "What powers most food webs in the sunlit zone?", choices: ["Hydrothermal vents", "Marine snow", "Photosynthesis"], answer: 2, target: 0 },
];

const positions = ["0%", "-23%", "-31%", "-51%"];

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.target));
    }, { root, threshold: [0.35, 0.55, 0.75] });
    root.querySelectorAll("[data-target]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const goToChapter = (index: number) => {
    scrollRef.current?.querySelector(`[data-chapter="${index}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(chapters[index].target);
  };
  const nextQuestion = () => {
    const next = (question + 1) % questions.length;
    setQuestion(next); setSelected(null); setAnswered(false); setActive(questions[next].target);
  };
  const currentQuestion = questions[question];

  return (
    <main className="study-shell">
      <section className="study-panel" aria-label="Ocean biology lesson">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Pelagic Field Notes home"><span className="brand-mark">P</span><span>Pelagic<br />Field Notes</span></a>
          <span className="course-tag">Lesson 04 / 06</span>
          <button className="sound-button" aria-label="Play lesson audio">◖))</button>
        </header>
        <nav className="chapter-rail" aria-label="Lesson chapters">
          {chapters.map((chapter, index) => <button key={chapter.title} className={active === chapter.target ? "is-active" : ""} onClick={() => goToChapter(index)} aria-label={`Go to ${chapter.title}`}><span>{String(index + 1).padStart(2, "0")}</span></button>)}
        </nav>
        <div className="study-scroll" ref={scrollRef} id="top">
          <div className="lesson-intro">
            <p className="kicker">Ocean systems · Field lesson</p>
            <h1>Life between<br /><em>light & darkness</em></h1>
            <p className="dek">Follow one column of water from the brilliant surface to the midnight zone.</p>
            <div className="scroll-cue"><span>↓</span> Scroll to descend</div>
          </div>
          {chapters.map((chapter, index) => (
            <article className="chapter" key={chapter.title} data-target={chapter.target} data-chapter={index}>
              <div className="chapter-meta"><span>{chapter.eyebrow}</span><span>{chapter.depth}</span></div>
              <p className="vertical-label">{chapter.label}</p><h2>{chapter.title}</h2>
              <p className="chapter-copy">{chapter.copy}</p>
              <aside className="field-note"><span className="note-icon">✦</span><div><strong>Field note</strong><p>{chapter.note}</p></div></aside>
            </article>
          ))}
          <section className="quiz" data-target={currentQuestion.target} aria-labelledby="quiz-title">
            <div className="quiz-heading"><div><p className="kicker">Knowledge check</p><h2 id="quiz-title">Test your depth</h2></div><span>{question + 1} / {questions.length}</span></div>
            <p className="quiz-prompt">{currentQuestion.prompt}</p>
            <div className="choices" role="radiogroup" aria-label="Answer choices">
              {currentQuestion.choices.map((choice, index) => {
                const correct = answered && index === currentQuestion.answer;
                const wrong = answered && selected === index && index !== currentQuestion.answer;
                return <button key={choice} className={`${selected === index ? "selected" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} onClick={() => { if (!answered) setSelected(index); }} role="radio" aria-checked={selected === index}><span>{String.fromCharCode(65 + index)}</span>{choice}<i>{correct ? "✓" : wrong ? "×" : ""}</i></button>;
              })}
            </div>
            {answered && <p className="feedback" aria-live="polite">{selected === currentQuestion.answer ? "Exactly. " : "Not quite. "}{currentQuestion.answer === 1 ? "Blue-green wavelengths are absorbed least by seawater." : currentQuestion.answer === 0 ? "The four gonads show clearly through the translucent bell." : "Phytoplankton use sunlight to form the base of the food web."}</p>}
            <div className="quiz-actions">
              {!answered ? <button className="primary-button" disabled={selected === null} onClick={() => setAnswered(true)}>Check answer <span>→</span></button> : <button className="primary-button" onClick={nextQuestion}>Next question <span>→</span></button>}
              <span className="quiz-label">Observe the slide sheet<br />as you answer</span>
            </div>
          </section>
          <footer><span>Pelagic Field Notes</span><span>Sources: NOAA Ocean Service · MBARI</span></footer>
        </div>
      </section>
      <aside className="slide-frame" aria-label="Ocean depth infographic">
        <div className="depth-scale" aria-hidden="true"><span>0 m</span><span>200</span><span>1,000</span><span>4,000</span></div>
        <img src="/assets/ocean-depths-slide.png" alt="A vertical scientific illustration of marine life from the sunlit surface through the twilight and midnight zones" style={{ transform: `translate3d(0, ${positions[active]}, 0)` }} />
        <div className="slide-caption"><span>PLATE 04</span><p><strong>{chapters.find((chapter) => chapter.target === active)?.title}</strong><br />Ocean water column study</p></div>
        <div className="coordinates">36.6185° N<br />121.9018° W</div>
      </aside>
    </main>
  );
}
