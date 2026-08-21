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
    animal: "Ocean Currents",
    scientific: "Three connected systems",
    description: "ABCDE",
    fact: "ABCDE",
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

const currentTopics = ["Upwelling", "Global Conveyor Belt", "Ocean Temperatures"];

export default function Home() {
  const [selected, setSelected] = useState<Subject | null>(null);
  const [currentTopic, setCurrentTopic] = useState<number | null>(null);

  const openSubject = (subject: Subject) => {
    setSelected(subject);
    if (subject.id === "currents") setCurrentTopic(null);
  };

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
              <button className={`subject-card ${subject.tone}`} key={subject.id} onClick={() => openSubject(subject)}>
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

          <button className="general-card" onClick={() => openSubject(subjects[4])}>
            <img src="/assets/ocean-depths-slide.png" alt="Ocean depth zones from the sunlit surface to the midnight zone" />
            <span className="general-overlay" />
            <span className="card-number">05</span>
            <span className="general-copy"><small>Complete field plate · 0–4,000 m</small><strong>The General Ocean</strong><em>See the whole water column</em></span>
            <span className="general-arrow">Explore <b>→</b></span>
          </button>

          <footer><span>Pelagic Field Notes</span><span>Five subjects · Four depth zones · One connected ocean</span></footer>
        </section>
      ) : selected.id === "currents" && currentTopic === null ? (
        <section className="currents-index" aria-labelledby="currents-title">
          <button className="back-button" onClick={() => setSelected(null)}><span>←</span> All subjects</button>
          <div className="currents-heading">
            <p className="eyebrow">Ocean Currents · Choose a topic</p>
            <h1 id="currents-title">Follow the<br /><em>moving ocean.</em></h1>
          </div>
          <div className="current-card-grid">
            {currentTopics.map((topic, index) => (
              <button className={`current-subject-card topic-${index + 1}`} key={topic} onClick={() => setCurrentTopic(index)}>
                <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="current-card-art" aria-hidden="true"><span>{index === 0 ? "↑" : index === 1 ? "∞" : "°"}</span><small>Study topic</small></div>
                <div className="card-copy"><span>Ocean currents</span><h2>{topic}</h2><p>Click to reveal this topic.</p></div>
                <span className="card-arrow">↗</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className={`subject-detail ${selected.tone}`} aria-labelledby="detail-title">
          <button className="back-button" onClick={() => selected.id === "currents" ? setCurrentTopic(null) : setSelected(null)}><span>←</span> {selected.id === "currents" ? "Ocean Currents" : "All subjects"}</button>
          <div className={`detail-copy ${selected.id === "currents" ? "currents-copy" : ""}`}>
            <div className="detail-meta"><span>{selected.number} · Ocean subject</span><span>{selected.depth}</span></div>
            {selected.id === "currents" ? (
              <>
                <p className="eyebrow">Ocean Currents · Topic {Number(currentTopic) + 1}</p>
                <h1 id="detail-title">{currentTopics[currentTopic as number]}</h1>
                {currentTopic === 0 ? (
                  <article className="current-article" role="tabpanel">
                    <h2>The Physics of Moving Water</h2>
                    <p>In the open ocean, wind does not simply push water in a straight line. Because Earth rotates on its axis, moving objects are deflected across the globe. This phenomenon is known as the <strong>Coriolis Effect</strong>. In the Northern Hemisphere, water is deflected to the <strong>right</strong> of the wind&apos;s direction; in the Southern Hemisphere, it is deflected to the <strong>left</strong>.</p>
                    <p>When strong coastal winds blow parallel to a coastline, the Coriolis Effect—combined with friction between layers of water—creates a net movement of surface water away from the coast at a 90-degree angle. This structural bulk movement of water is called <strong>Ekman Transport</strong>. As the warm, sunlit surface water is systematically stripped away and pushed offshore, it leaves behind a physical void. To fill this space, dense, cold water from the deep ocean is drawn upward toward the sunlit surface layer. This process is called <strong>ocean upwelling</strong>.</p>

                    <h2>The Marine Conveyor of Nutrients</h2>
                    <p>The deep ocean is essentially a massive biological recycling bin. In the upper, sunlit layers of the ocean (the photic zone), marine organisms live, reproduce, and die. Waste products, decaying organic matter, and dead organisms constantly sink downward into the dark depths—a phenomenon known as <strong>marine snow</strong>.</p>
                    <p>Deep-sea bacteria decompose this material, breaking it down into basic inorganic chemical compounds. Because there is no sunlight in the deep ocean, photosynthetic plants cannot grow to consume these minerals. As a result, the deep ocean acts as a massive reservoir for critical, life-sustaining nutrients:</p>
                    <ul>
                      <li><strong>Nitrates (NO<sub>3</sub><sup>−</sup>):</strong> Essential for synthesizing proteins and nucleic acids in marine plants.</li>
                      <li><strong>Phosphates (PO<sub>4</sub><sup>3−</sup>):</strong> Required for cellular energy transfer and genetic structural building blocks.</li>
                      <li><strong>Silicates (SiO<sub>4</sub><sup>4−</sup>):</strong> Crucial for microscopic organisms like <strong>diatoms</strong>, which use silica to construct glass-like protective shells.</li>
                    </ul>
                    <p>When upwelling occurs, it acts like an ecological elevator, hoisting these concentrated nutrients up into the photic zone. Suddenly exposed to sunlight, microscopic marine plants called <strong>phytoplankton</strong> rapidly consume the nutrients, fueling explosive population growths known as <strong>algal blooms</strong>. These microscopic cells form the foundational base of the marine food web, instantly attracting zooplankton, small baitfish, and massive top-tier predators like whales, sharks, and commercial fish stocks.</p>
                  </article>
                ) : (
                  <div className="current-placeholder" role="tabpanel">
                    <span>{currentTopics[currentTopic as number]}</span>
                    <strong>ABCDE</strong>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="eyebrow">Featured animal</p>
                <h1 id="detail-title">{selected.animal}</h1>
                <p className="scientific">{selected.scientific}</p>
                <p className="animal-description">{selected.description}</p>
                <aside className="field-note"><span>✦</span><div><strong>Field note</strong><p>{selected.fact}</p></div></aside>
              </>
            )}
          </div>
          <div className={`detail-visual ${selected.general ? "has-image" : ""}`}>
            {selected.general ? (
              <img src="/assets/ocean-depths-slide.png" alt="Complete scientific illustration of ocean depth zones" />
            ) : selected.id === "currents" ? (
              <div className="large-placeholder currents-placeholder"><span>↝</span><p>{currentTopics[currentTopic as number]}</p><small>{currentTopic === 0 ? "Nutrients rise · life follows" : "ABCDE"}</small></div>
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
