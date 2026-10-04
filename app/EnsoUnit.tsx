"use client";

import { useEffect, useRef, useState } from "react";

export function EnsoCardArt() {
  return <svg viewBox="0 0 360 250" className="enso-card-art" aria-hidden="true">
    <rect width="360" height="250" fill="#0a2c40" />
    <path d="M0 130 Q100 90 210 132 T360 128 V250 H0Z" fill="#147b96" />
    <path d="M0 130 Q100 90 210 132 T360 128 V174 Q180 147 0 193Z" fill="#eb9871" />
    <path d="M62 69 H290 M276 60 L290 69 L276 78" fill="none" stroke="#f4e4cb" strokeWidth="3" />
    <path d="M295 214 H65 M79 205 L65 214 L79 223" fill="none" stroke="#8bd6e4" strokeWidth="3" />
    <text x="28" y="40" fill="#f4e4cb" fontSize="19">Ocean ↔ Atmosphere</text>
    <text x="28" y="151" fill="#08283c" fontSize="22">El Niño</text>
    <text x="250" y="190" fill="#eaf5f5" fontSize="22">La Niña</text>
  </svg>;
}

function EnsoAnimation() {
  const [phase, setPhase] = useState<"nino" | "nina">("nino");
  const [playing, setPlaying] = useState(true);
  const [autoSwap, setAutoSwap] = useState(false);
  const [speed, setSpeed] = useState(1);
  const root = useRef<HTMLElement>(null);
  const clock = useRef(0);
  const nino = phase === "nino";
  const name = nino ? "El Niño" : "La Niña";
  const convectionX = nino ? 650 : 285;
  const thermocline = nino ? "M110 402 Q540 403 990 385" : "M110 449 Q540 418 990 328";
  const flows = [
    { id: "wind", d: "M900 245 L200 245", color: "#f0ead0", count: nino ? 4 : 7, rate: nino ? 28 : 80 },
    { id: "warm", d: nino ? "M250 317 Q580 308 890 317" : "M840 313 Q490 313 220 317", color: "#773a24", count: 5, rate: nino ? 48 : 65 },
    { id: "cold", d: nino ? "M925 460 L925 407" : "M940 460 C965 416 960 372 940 306", color: "#7cdeed", count: nino ? 2 : 4, rate: nino ? 12 : 40 },
    { id: "rise", d: `M${convectionX} 221 L${convectionX} 125`, color: "#ffbc88", count: 3, rate: nino ? 24 : 36 },
  ];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setPlaying(false);
    const change = (event: MediaQueryListEvent) => { if (event.matches) { setPlaying(false); setAutoSwap(false); } };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (!autoSwap || !playing) return;
    const timer = window.setInterval(() => setPhase(value => value === "nino" ? "nina" : "nino"), 10000);
    return () => window.clearInterval(timer);
  }, [autoSwap, playing]);

  useEffect(() => {
    const groups = Array.from(root.current?.querySelectorAll<SVGGElement>(".enso-flow") ?? []).map(group => {
      const path = group.querySelector<SVGPathElement>(".enso-flow-path")!;
      return { path, length: path.getTotalLength(), rate: Number(group.dataset.rate), arrows: Array.from(group.querySelectorAll<SVGGElement>(".enso-moving-arrow")) };
    });
    function paint() {
      groups.forEach(({ path, length, rate, arrows }) => arrows.forEach((arrow, index) => {
        const distance = (clock.current * rate + index * length / arrows.length) % length;
        const point = path.getPointAtLength(distance);
        const before = path.getPointAtLength(Math.max(0, distance - 1));
        const after = path.getPointAtLength(Math.min(length, distance + 1));
        const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
        arrow.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
      }));
    }
    paint();
    if (!playing) return;
    let frame = 0;
    let previous: number | undefined;
    function tick(now: number) {
      if (previous !== undefined) clock.current += Math.min((now - previous) / 1000, .05) * speed;
      previous = now;
      paint();
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, playing, speed]);

  return <section className={`enso-lab ${phase}`} ref={root} aria-labelledby="enso-lab-title">
    <div className="enso-lab-inner">
      <p className="enso-kicker">Animated Pacific · Follow the arrows</p>
      <div className="enso-lab-heading"><h2 id="enso-lab-title">Switch the Pacific.</h2><div className="enso-phase-controls" role="group" aria-label="Choose an ENSO phase"><button aria-pressed={nino} onClick={() => setPhase("nino")}>El Niño</button><button aria-pressed={!nino} onClick={() => setPhase("nina")}>La Niña</button></div></div>
      <p className="enso-lab-intro">A slice through the tropical Pacific, looking along the equator. West is on the left; east is on the right.</p>
      <div className="enso-playback"><button onClick={() => setPlaying(value => !value)}>{playing ? "Pause animation" : "Play animation"}</button><label>Speed <select aria-label="ENSO animation speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label><label><input type="checkbox" checked={autoSwap} onChange={event => setAutoSwap(event.target.checked)} /> Auto-swap every 10 seconds</label></div>
      <p className="enso-scroll-hint">Swipe across the diagram to explore the whole Pacific ↔</p>
      <div className="enso-svg-wrap" tabIndex={0} aria-label="Scrollable Pacific diagram">
        <svg viewBox="0 0 1100 530" role="img" aria-labelledby="enso-svg-title enso-svg-description">
          <title id="enso-svg-title">{name}: winds, warm water and upwelling in the Pacific</title>
          <desc id="enso-svg-description">{nino ? "Weaker east-to-west trade winds allow warm surface water to spread eastward. Rainfall shifts toward the central and eastern Pacific, the eastern thermocline deepens, and cold-water upwelling is reduced." : "Stronger east-to-west trade winds push warm surface water westward. Moist air rises over the western warm pool. The thermocline is shallow in the east, where stronger upwelling brings cool water to the surface."}</desc>
          <defs><linearGradient id="enso-warm-gradient"><stop offset="0" stopColor="#e87c55" /><stop offset={nino ? ".8" : ".35"} stopColor="#eda66c" /><stop offset="1" stopColor={nino ? "#d38f64" : "#4eaec4"} /></linearGradient><linearGradient id="enso-deep-gradient" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#176782" /><stop offset="1" stopColor="#09344f" /></linearGradient></defs>
          <rect x="110" y="288" width="880" height="208" fill="url(#enso-deep-gradient)" />
          <path d={`M110 288 H990 L990 ${nino ? 385 : 328} ${nino ? "Q540 403 110 402" : "Q540 418 110 449"}Z`} fill="url(#enso-warm-gradient)" />
          <path d={thermocline} fill="none" stroke="#eae0b5" strokeWidth="2" strokeDasharray="9 8" />
          <path d="M110 288 H990" stroke="#c9e9ed" strokeWidth="3" />
          <path d="M30 275 L75 234 L110 288 V496 H30Z M990 288 L1020 248 L1070 270 V496 H990Z" fill="#7d795b" />
          <text x="110" y="40" className="enso-svg-region">WEST · Indonesia / Australia</text><text x="990" y="40" textAnchor="end" className="enso-svg-region">EAST · South America</text>
          <text x="550" y="80" textAnchor="middle" className="enso-svg-title">{name}</text>
          <g transform={`translate(${convectionX - 64} 96)`}><path d="M0 28 C-18 3 14 -8 30 2 C35 -28 80 -27 88 3 C115 -5 142 24 121 37 H10Z" fill="#bcd3dc" /><path d="M24 45 L19 58 M52 46 L47 59 M80 46 L75 59 M108 45 L103 58" stroke="#7cdeed" strokeWidth="3" /></g>
          <text x={convectionX + 23} y="183" className="enso-svg-label">Warm, moist</text><text x={convectionX + 23} y="208" className="enso-svg-label">air rises</text>
          <text x="200" y="229" className="enso-svg-label">{nino ? "Weaker trade winds ←" : "Stronger trade winds ←"}</text>
          <text x="550" y="280" textAnchor="middle" className="enso-svg-small">Ocean surface</text>
          <text x={nino ? 570 : 290} y="351" textAnchor="middle" className="enso-svg-label enso-water-label">{nino ? "Warm water spreads east →" : "← Warm water piles up west"}</text>
          <text x="500" y="472" textAnchor="middle" className="enso-svg-label">Cooler deep water</text>
          <text x="790" y={nino ? 445 : 390} textAnchor="middle" className="enso-svg-label">{nino ? "Less upwelling" : "More upwelling ↑"}</text>
          <text x="550" y="522" textAnchor="middle" className="enso-svg-small">Dashed line: thermocline — transition between warmer and cooler water</text>
          {flows.map(flow => <g key={flow.id} className="enso-flow" data-rate={flow.rate} style={{color:flow.color}}><path className="enso-flow-path" d={flow.d} fill="none" stroke="currentColor" strokeWidth={flow.id === "wind" && !nino ? 3 : 2} opacity=".38" />{Array.from({length:flow.count},(_,index)=><g className="enso-moving-arrow" key={index}><path d="M-12 -7 L2 0 L-12 7 M-22 0 H0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>)}</g>)}
        </svg>
      </div>
      <div className="enso-legend"><span><i className="wind" /> Trade winds</span><span><i className="warm" /> Warm water / rising air</span><span><i className="cold" /> Cool upwelling water</span></div>
      <div className="enso-phase-readout" aria-live="polite"><h3>{name}: {nino ? "the warm phase" : "the cool phase"}</h3><p>{nino ? "The central and eastern tropical Pacific become warmer than usual. Weak trade winds let the warm pool spread east, and less cold water reaches the surface. The main rain zone shifts eastward." : "The central and eastern tropical Pacific become cooler than usual. Strong trade winds gather warm water in the west and strengthen cold-water upwelling in the east. The main rain zone stays farther west."}</p></div>
      <p className="enso-model-note">Simplified teaching model: arrow speed, ocean depth and temperature colors are illustrative. El Niño winds can sometimes reverse; the model shows the usual weakening of the trade winds. Switching phases compares conditions, rather than showing how quickly they develop in nature.</p>
    </div>
  </section>;
}

export default function EnsoUnit({ onBack }: { onBack: () => void }) {
  return <section className="enso-unit" aria-labelledby="enso-unit-title">
    <div className="enso-lesson">
      <button className="back-button" onClick={onBack}><span>←</span> All subjects</button>
      <p className="eyebrow">Unit 06 · Ocean & climate · Ages 13+</p>
      <h1 id="enso-unit-title">El Niño <em>&</em> La Niña</h1>
      <p className="enso-deck">Small changes across a huge ocean can reshape weather around the world. Meet the Pacific’s warm and cool climate phases.</p>
      <div className="enso-learning-goal"><strong>Your goal</strong><span>Explain how winds, water temperature and upwelling work together, then use the animation below to compare both phases.</span></div>
      <div className="enso-lesson-grid">
        <article><h2>First, meet the usual Pacific</h2><p>Near the equator, <strong>trade winds</strong> usually blow from east to west: from the Americas toward Indonesia. They push warm surface water westward. In the eastern Pacific, cooler water rises from below to replace it. This is <strong>upwelling</strong>, which brings nutrients that help tiny drifting organisms grow.</p><p>Above the warm western ocean, moist air rises, cools and forms rain clouds. The ocean and atmosphere act as a connected system. Its changing pattern is called <strong>ENSO</strong>, short for El Niño–Southern Oscillation. ENSO has warm, cool and neutral phases.</p></article>
        <article><h2>El Niño: the warm phase</h2><p>During El Niño, the trade winds weaken. Warm surface water spreads toward the central and eastern tropical Pacific, making those areas warmer than usual. The boundary between warmer surface water and cooler deep water—the <strong>thermocline</strong>—deepens in the east.</p><p>Less cool, nutrient-rich water reaches the surface there. This can reduce the food available to marine ecosystems. Meanwhile, the region where moist air rises and heavy rain develops shifts east. Changes in ocean temperature and winds can reinforce each other: weaker winds favor warming, and that warming can help weaken the winds further.</p></article>
        <article><h2>La Niña: the cool phase</h2><p>During La Niña, trade winds become stronger than usual. They push more warm water toward the western Pacific. In the east, the thermocline becomes shallower and upwelling strengthens, helping make the central and eastern tropical Pacific cooler than usual.</p><p>The western warm pool favors rising moist air and rainfall. Parts of Indonesia and Australia are often wetter during La Niña and drier during El Niño. La Niña is El Niño’s counterpart, but it does not always follow it.</p></article>
        <article><h2>Why does the rest of the world care?</h2><p>A shift in tropical heat and rainfall changes circulation high in the atmosphere, including the <strong>jet stream</strong>, a fast-moving band of air that helps steer storms. This can alter the chances of floods, droughts and unusual temperatures far from the Pacific.</p><p>For example, El Niño often favors wetter winters across the southern United States; La Niña often favors drier ones there. These are patterns of probability. The exact effects depend on location, season and the strength of the event—every storm still has other causes.</p></article>
      </div>
      <aside className="enso-takeaway"><h2>A cycle with no fixed schedule</h2><p>Events often last around 9–12 months, and some persist for years. They recur irregularly, roughly every 2–7 years, with neutral conditions in between. Scientists monitor ocean temperatures and winds with satellites, buoys and models to help predict what may come next.</p></aside>
      <p className="enso-sources">Explore the science: <a href="https://oceanservice.noaa.gov/facts/ninonina.html" target="_blank" rel="noreferrer">NOAA’s ENSO overview</a> · <a href="https://www.noaa.gov/jetstream/tropical/enso" target="_blank" rel="noreferrer">Ocean–atmosphere connections</a> · <a href="https://pmel.noaa.gov/elnino/lanina-faq/" target="_blank" rel="noreferrer">La Niña questions</a> · <a href="https://www.noaa.gov/jetstream/enso_impacts" target="_blank" rel="noreferrer">Weather effects</a></p>
    </div>
    <EnsoAnimation />
  </section>;
}
