"use client";

import { useEffect, useState } from "react";

type Subject = {
  id: string;
  number: string;
  title: string;
  short: string;
  depth: string;
  animal: string;
  scientific: string;
  description: string;
  fact: string;
  tone: string;
  general?: boolean;
};

const subjects: Subject[] = [
  {
    id: "currents",
    number: "01",
    title: "Ocean Currents",
    short: "The moving pathways that connect every ocean basin.",
    depth: "Global circulation",
    animal: "Loggerhead sea turtle",
    scientific: "Caretta caretta",
    description: "Young loggerheads enter vast current systems soon after hatching. In the North Atlantic, many ride the warm Gulf Stream into a circular route called the North Atlantic gyre, where drifting seaweed offers food and shelter during their first years at sea.",
    fact: "Earth’s currents act like living highways, carrying heat, nutrients, larvae, and migrating animals around the planet.",
    tone: "current",
  },
  {
    id: "sunlight",
    number: "02",
    title: "Marine Life in Sunlight",
    short: "A bright, productive world powered by photosynthesis.",
    depth: "0–200 metres",
    animal: "Green sea turtle",
    scientific: "Chelonia mydas",
    description: "Green sea turtles spend much of their adult lives in shallow coastal waters. Unlike most sea turtles, adults are mainly herbivores, grazing on seagrass and algae. Their feeding helps keep seagrass meadows healthy and productive for many other species.",
    fact: "The sunlight zone contains most of the ocean’s visible life, even though it makes up only a thin layer of the water column.",
    tone: "sunlight",
  },
  {
    id: "twilight",
    number: "03",
    title: "Marine Life in Twilight",
    short: "Where sunlight fades and daily migrations begin.",
    depth: "200–1,000 metres",
    animal: "Vampire squid",
    scientific: "Vampyroteuthis infernalis",
    description: "Despite its dramatic name, the vampire squid is a gentle scavenger. It gathers drifting marine snow with two long, sticky filaments and wraps the particles in mucus before eating them. Its dark red body is nearly invisible in the twilight zone’s blue light.",
    fact: "Every night, animals from this zone rise toward the surface to feed—the largest migration on Earth by number of animals.",
    tone: "twilight",
  },
  {
    id: "midnight",
    number: "04",
    title: "Marine Life in Midnight",
    short: "A cold, pressurized realm illuminated by living light.",
    depth: "1,000–4,000 metres",
    animal: "Giant siphonophore",
    scientific: "Praya dubia",
    description: "A giant siphonophore looks like one animal, but it is actually a colony of specialized individuals called zooids. Some provide propulsion, others capture prey, and others digest food. Together they form a glowing, coordinated body that may stretch longer than a blue whale.",
    fact: "Bioluminescence is so common here that flashes of blue-green light may be the midnight zone’s main form of communication.",
    tone: "midnight",
  },
  {
    id: "general",
    number: "05",
    title: "The General Ocean",
    short: "See the complete water column from the surface to the deep.",
    depth: "0–4,000 metres",
    animal: "Moon jelly",
    scientific: "Aurelia aurita",
    description: "Moon jellies drift through coastal and open waters around the world. Their translucent bells are moved by gentle pulses, while four horseshoe-shaped gonads make them easy to identify. With no brain, heart, or bones, they rely on a simple nerve net to sense their surroundings.",
    fact: "The ocean is one connected system: energy begins near the bright surface and travels downward as food, waste, and marine snow.",
    tone: "general",
    general: true,
  },
];

export default function Home() {
  const [selected, setSelected] = useState<Subject | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setSelected(null)} aria-label="Return to all subjects">
          <span className="brand-mark">P</span>
          <span>Pelagic<br />Field Notes</span>
        </button>
        <p>Ocean Biology Study Guide</p>
        <span className="edition">Student edition · 2026</span>
      </header>

      {!selected ? (
        <section className="subject-index" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Explore by subject</p>
            <h1 id="page-title">Choose a path<br /><em>through the ocean.</em></h1>
            <p className="intro">Study how water moves, then meet one remarkable animal from each layer of the sea.</p>
          </div>

          <div className="subject-grid">
            {subjects.filter((subject) => !subject.general).map((subject) => (
              <button className={`subject-card ${subject.tone}`} key={subject.id} onClick={() => setSelected(subject)}>
                <span className="card-number">{subject.number}</span>
                <div className="card-placeholder" aria-hidden="true">
                  <span>{subject.tone === "current" ? "↝" : subject.tone === "sunlight" ? "☼" : subject.tone === "twilight" ? "◐" : "✦"}</span>
                  <small>Image placeholder</small>
                </div>
                <div className="card-copy"><span>{subject.depth}</span><h2>{subject.title}</h2><p>{subject.short}</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>

          <button className="general-card" onClick={() => setSelected(subjects[4])}>
            <img src="/assets/ocean-depths-slide.png" alt="Ocean depth zones from the sunlit surface to the midnight zone" />
            <span className="general-overlay" />
            <span className="card-number">05</span>
            <span className="general-copy"><small>Complete field plate · 0–4,000 m</small><strong>The General Ocean</strong><em>See the whole water column</em></span>
            <span className="general-arrow">Explore <b>→</b></span>
          </button>

          <footer><span>Pelagic Field Notes</span><span>Five subjects · Four depth zones · One connected ocean</span></footer>
        </section>
      ) : (
        <section className={`subject-detail ${selected.tone}`} aria-labelledby="detail-title">
          <button className="back-button" onClick={() => setSelected(null)}><span>←</span> All subjects</button>
          <div className="detail-copy">
            <div className="detail-meta"><span>{selected.number} · Ocean subject</span><span>{selected.depth}</span></div>
            <p className="eyebrow">Featured animal</p>
            <h1 id="detail-title">{selected.animal}</h1>
            <p className="scientific">{selected.scientific}</p>
            <p className="animal-description">{selected.description}</p>
            <aside className="field-note"><span>✦</span><div><strong>Field note</strong><p>{selected.fact}</p></div></aside>
            <div className="subject-switcher" aria-label="Choose another subject">
              {subjects.map((subject) => <button key={subject.id} className={subject.id === selected.id ? "active" : ""} onClick={() => setSelected(subject)} aria-label={subject.title}>{subject.number}</button>)}
            </div>
          </div>
          <div className={`detail-visual ${selected.general ? "has-image" : ""}`}>
            {selected.general ? (
              <img src="/assets/ocean-depths-slide.png" alt="Complete scientific illustration of ocean depth zones" />
            ) : (
              <div className="large-placeholder"><span>{selected.tone === "current" ? "↝" : selected.tone === "sunlight" ? "☼" : selected.tone === "twilight" ? "◐" : "✦"}</span><p>Animal image placeholder</p><small>{selected.animal}</small></div>
            )}
            <div className="visual-label"><span>Subject {selected.number}</span><p>{selected.title}</p></div>
          </div>
        </section>
      )}
    </main>
  );
}
