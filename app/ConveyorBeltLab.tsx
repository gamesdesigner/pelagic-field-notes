"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// Equirectangular map coordinates: longitude -180…180, latitude 90…-90.
// Routes are schematic basin-scale pathways, following NOAA's conveyor lesson.
const routes = [
  { id: "atlantic-deep", kind: "deep", d: "M 490 108 C 458 135 460 170 455 203 C 447 243 463 285 480 323 C 501 375 508 427 535 463 C 557 493 615 493 695 488" },
  { id: "southern-deep", kind: "deep", d: "M 695 488 C 780 484 867 494 960 492 C 1023 490 1076 469 1115 430" },
  { id: "indian-deep", kind: "deep", d: "M 825 490 C 787 460 785 420 800 385 C 816 350 813 320 816 283 C 819 264 834 252 851 262" },
  { id: "pacific-deep", kind: "deep", d: "M 1115 430 C 1138 404 1157 365 1150 319 C 1143 270 1155 241 1168 225 C 1177 213 1193 213 1200 213" },
  { id: "pacific-deep-wrap", kind: "deep", d: "M 0 213 C 25 210 52 207 80 221 C 105 233 129 235 150 224" },
  { id: "pacific-surface-wrap", kind: "surface", d: "M 150 224 C 121 247 99 277 60 289 C 39 296 18 297 0 297" },
  { id: "pacific-surface", kind: "surface", d: "M 1200 297 C 1158 297 1110 310 1080 319 C 1055 327 1038 342 1010 346 C 984 350 963 347 935 357 C 899 371 862 376 836 369" },
  { id: "indian-surface", kind: "surface", d: "M 851 262 C 885 269 892 297 885 324 C 879 346 862 360 836 369" },
  { id: "cape-surface", kind: "surface", d: "M 836 369 C 810 379 798 398 776 426 C 753 456 704 460 672 446 C 650 437 630 427 604 425 C 572 423 544 409 519 382" },
  { id: "atlantic-surface", kind: "surface", d: "M 519 382 C 491 355 476 322 451 292 C 429 266 402 256 388 242 C 367 223 364 204 382 186 C 404 163 457 170 491 155 C 524 140 557 120 569 99 C 575 88 570 80 560 77" },
  { id: "north-atlantic-cooling", kind: "surface", d: "M 560 77 C 545 80 535 91 519 101 C 509 108 500 111 490 108" },
] as const;

const stages = [
  { title: "Cooling & sinking", location: "North Atlantic", x: 490, y: 108, text: "Surface water releases heat to the atmosphere. Cold, salty water becomes dense enough to sink, feeding the deep Atlantic current." },
  { title: "Deep-water transport", location: "Southern Ocean", x: 696, y: 488, text: "Deep water travels south through the Atlantic and exchanges with the Southern Ocean. The pathway branches toward the Indian and Pacific oceans." },
  { title: "Mixing & upwelling", location: "Indian & Pacific oceans", x: 851, y: 262, text: "Mixing and wind-driven upwelling return deep water toward the surface. This happens across broad regions, rather than at a single point." },
  { title: "Surface return", location: "Atlantic Ocean", x: 491, y: 155, text: "Warmer upper-ocean water returns through connected ocean basins. Northward flow carries heat toward the North Atlantic, completing the schematic cycle." },
];

export default function ConveyorBeltLab() {
  const [warmTemperature, setWarmTemperature] = useState(27);
  const [coldTemperature, setColdTemperature] = useState(3);
  const [paused, setPaused] = useState(false);
  const [playback, setPlayback] = useState(1);
  const [layer, setLayer] = useState("both");
  const [stage, setStage] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const temperatureContrast = warmTemperature - coldTemperature;
  const strength = Math.max(8, Math.min(100, Math.round(((temperatureContrast - 8) / 26) * 100)));
  const status = strength >= 70 ? "Fast" : strength >= 40 ? "Steady" : "Slow";
  const motion = useRef({ strength, playback, paused });

  useEffect(() => { motion.current = { strength, playback, paused }; }, [strength, playback, paused]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Measure each rendered route once. Every arrow follows this exact geometry;
    // elapsed distance is retained when temperature or playback speed changes.
    const streams = routes.map((route) => {
      const path = svg.querySelector<SVGPathElement>(`#belt-${route.id}`)!;
      return { path, length: path.getTotalLength(), arrows: Array.from(svg.querySelectorAll<SVGGElement>(`[data-route="${route.id}"]`)) };
    });
    let distance = 0;
    let previous: number | undefined;
    let frame = 0;
    const animate = (time: number) => {
      const elapsed = previous === undefined ? 0 : Math.min((time - previous) / 1000, .08);
      previous = time;
      if (!motion.current.paused) distance += elapsed * (14 + motion.current.strength * .9) * motion.current.playback;
      for (const stream of streams) {
        stream.arrows.forEach((arrow, index) => {
          const position = (distance + index * stream.length / stream.arrows.length) % stream.length;
          const point = stream.path.getPointAtLength(position);
          const before = stream.path.getPointAtLength(Math.max(0, position - .8));
          const after = stream.path.getPointAtLength(Math.min(stream.length, position + .8));
          const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
          arrow.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
          // Fade at segment ends so branch and map-edge restarts stay unobtrusive.
          arrow.style.opacity = String(Math.min(1, position / 10, (stream.length - position) / 10));
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentStage = stages[stage];
  return (
    <section className="conveyor-simulator" aria-labelledby="conveyor-model-title">
      <header className="belt-heading">
        <div><span className="eyebrow">Interactive circulation atlas</span><h2 id="conveyor-model-title">Thermohaline Circulation</h2><p>Follow water from the sunlit surface into the deep ocean—and back again.</p></div>
        <div className="belt-legend"><span><i className="surface" /> Warm upper-ocean flow</span><span><i className="deep" /> Cold deep-water flow</span></div>
      </header>
      <div className="belt-toolbar">
        <div className="belt-layer-controls" role="group" aria-label="Current layers">
          {[["both", "All currents"], ["surface", "Surface"], ["deep", "Deep water"]].map(([value, label]) => <button type="button" key={value} aria-pressed={layer === value} onClick={() => setLayer(value)}>{label}</button>)}
        </div>
        <div className="belt-playback">
          <button type="button" onClick={() => setPaused(!paused)}>{paused ? "▶ Play currents" : "Ⅱ Pause currents"}</button>
          <label>Playback <select aria-label="Animation playback speed" value={playback} onChange={(event) => setPlayback(Number(event.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option><option value={3}>3×</option></select></label>
        </div>
      </div>
      <div className="belt-map-scroll" tabIndex={0} role="region" aria-label="Thermohaline circulation map; scroll horizontally on smaller screens">
        <svg ref={svgRef} className="belt-map" viewBox="0 0 1200 600" role="img" aria-labelledby="belt-map-title belt-map-description">
          <title id="belt-map-title">Animated global ocean circulation</title>
          <desc id="belt-map-description">Orange arrows travel along warm surface pathways returning to the North Atlantic. Blue arrows follow deep-water pathways south through the Atlantic and branch into the Indian and Pacific oceans. Map routes are schematic.</desc>
          <defs>
            <linearGradient id="belt-shade" x2="0" y2="1"><stop stopColor="#031525" stopOpacity=".18" /><stop offset="1" stopColor="#031525" stopOpacity=".52" /></linearGradient>
            <filter id="belt-route-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter>
            <radialGradient id="belt-focus"><stop stopColor="#fff" stopOpacity=".25" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
          </defs>
          <image href="/assets/earth-blue-marble.jpg" width="1200" height="600" preserveAspectRatio="none" />
          <rect width="1200" height="600" fill="url(#belt-shade)" />
          <g className="belt-graticule" aria-hidden="true">
            {[100,200,300,400,500,600,700,800,900,1000,1100].map((x) => <path key={`lon-${x}`} d={`M ${x} 0 V 600`} />)}
            {[100,200,300,400,500].map((y) => <path key={`lat-${y}`} d={`M 0 ${y} H 1200`} />)}
            <path className="belt-equator" d="M 0 300 H 1200" />
          </g>
          <g className="belt-ocean-labels"><text x="172" y="366">PACIFIC OCEAN</text><text x="522" y="260">ATLANTIC</text><text x="892" y="415">INDIAN OCEAN</text><text x="596" y="546">SOUTHERN OCEAN</text></g>
          {routes.map((route) => (
            <g key={route.id} className={`belt-stream ${route.kind} ${layer !== "both" && layer !== route.kind ? "is-hidden" : ""}`}>
              <path className="belt-route-halo" d={route.d} />
              <path id={`belt-${route.id}`} className="belt-route" d={route.d} />
              {Array.from({ length: route.d.length < 85 ? 3 : 7 }, (_, index) => <g key={index} data-route={route.id} className="belt-moving-arrow" aria-hidden="true"><path d="M -8 -6 L 7 0 L -8 6 L -3 0 Z" /></g>)}
            </g>
          ))}
          <g className="belt-process-markers" aria-hidden="true">
            <circle cx="490" cy="108" r="17" /><path d="M 490 98 V 118 M 484 112 L 490 118 L 496 112" />
            <circle cx="851" cy="262" r="17" /><path d="M 851 272 V 252 M 845 258 L 851 252 L 857 258" />
            <circle cx="150" cy="224" r="17" /><path d="M 150 234 V 214 M 144 220 L 150 214 L 156 220" />
            <text x="462" y="80">COLD WATER SINKS</text><text x="794" y="239">WATER RISES</text><text x="98" y="194">WATER RISES</text>
          </g>
          <g className="belt-focus" aria-hidden="true"><circle cx={currentStage.x} cy={currentStage.y} r="42" fill="url(#belt-focus)" /><circle cx={currentStage.x} cy={currentStage.y} r="24" /></g>
          <text className="belt-equator-label" x="16" y="315">EQUATOR · 0°</text>
        </svg>
      </div>
      <div className="belt-map-caption"><span>Detailed land relief, coastlines & ocean-floor texture</span><span>Schematic pathways · arrows follow the current lines</span></div>
      <div className="belt-stages" role="group" aria-label="Explore the circulation cycle">
        {stages.map((item, index) => <button key={item.title} type="button" aria-pressed={stage === index} onClick={() => setStage(index)}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.location}</small></button>)}
      </div>
      <div className="belt-stage-note" aria-live="polite"><strong>{currentStage.title}</strong><p>{currentStage.text}</p></div>
      <div className="conveyor-temperature-panel">
        <div className="conveyor-panel-heading"><span>Change the conditions</span><h2>Temperature drives the flow</h2><p>Increase the temperature contrast to see stronger, faster circulation. Warm the North Atlantic to slow the moving arrows.</p><small>Illustrative model with salinity held constant.</small></div>
        <div className="conveyor-controls">
          <label><span>Warm surface water <output>{warmTemperature}°C</output></span><input aria-label="Warm surface water temperature" type="range" min="20" max="32" step="1" value={warmTemperature} onChange={(event) => setWarmTemperature(Number(event.target.value))} /></label>
          <label><span>North Atlantic water <output>{coldTemperature}°C</output></span><input aria-label="North Atlantic water temperature" type="range" min="-2" max="12" step="1" value={coldTemperature} onChange={(event) => setColdTemperature(Number(event.target.value))} /></label>
          <div className="belt-contrast"><span>Temperature contrast</span><strong>{temperatureContrast}°C</strong></div>
        </div>
        <div className="conveyor-speed" aria-live="polite"><div className="speed-gauge" style={{ "--gauge-rotation": `${-120 + strength * 2.4}deg` } as CSSProperties}><i /><b /></div><div><span>Relative flow</span><strong>{status}</strong><small>{strength}% model strength</small><small>{paused ? "Animation paused" : `${playback}× playback`}</small></div></div>
      </div>
      <p className="belt-science-note">Time is compressed to make the circulation visible. A real conveyor journey can take about 1,000 years; temperature, salinity, winds and mixing all matter. <a href="https://oceanservice.noaa.gov/education/tutorial_currents/05conveyor2.html" target="_blank" rel="noreferrer">Explore NOAA’s conveyor lesson ↗</a></p>
    </section>
  );
}
