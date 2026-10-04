"use client";

import { useEffect, useRef, useState } from "react";

function CoastalScene({ upwelling }: { upwelling: boolean }) {
  const direction = upwelling ? "up" : "down";
  const paths = upwelling ? [
    "M 335 20 L 335 83",
    "M 305 52 L 190 52",
    "M 365 186 L 68 186",
    "M 215 278 C 290 278 345 257 345 228 L 345 207 C 345 199 326 198 300 198",
  ] : [
    "M 335 83 L 335 20",
    "M 190 52 L 305 52",
    "M 68 186 L 325 186 C 342 186 350 195 350 217 L 350 235 C 350 260 285 276 225 276",
  ];
  return (
    <article className={`ekman-scene ${direction}`}>
      <h3>{upwelling ? "Upwelling" : "Downwelling"}</h3>
      <svg viewBox="0 0 500 320" role="img" aria-labelledby={`ekman-${direction}-title ekman-${direction}-description`}>
        <title id={`ekman-${direction}-title`}>{upwelling ? "Offshore transport draws deeper water upward" : "Onshore transport pushes surface water downward"}</title>
        <desc id={`ekman-${direction}-description`}>Northern Hemisphere west coast. The top view shows {upwelling ? "southward" : "northward"} alongshore wind and {upwelling ? "offshore" : "onshore"} net Ekman transport. Below, animated arrows show {upwelling ? "surface water moving away from shore and cool deeper water rising" : "surface water moving toward shore, sinking and flowing outward at depth"}.</desc>
        <defs>
          <linearGradient id={`ekman-ocean-${direction}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c7689" /><stop offset="1" stopColor="#0a354f" />
          </linearGradient>
        </defs>
        <text x="24" y="23" className="ekman-svg-label">TOP VIEW</text>
        <text x="24" y="53" className="ekman-svg-small">N ↑</text>
        <text x="24" y="76" className="ekman-svg-small">Ocean</text>
        <rect x="365" y="8" width="107" height="86" rx="4" fill="#766f51" />
        <path d="M365 8 V94" stroke="#dbcda0" strokeWidth="2" />
        <text x="386" y="55" className="ekman-svg-small">Land</text>
        <text x="329" y="112" textAnchor="middle" className="ekman-svg-small">Alongshore wind</text>
        <text x="235" y="32" textAnchor="middle" className="ekman-svg-small">{upwelling ? "Offshore" : "Onshore"}</text>
        <text x="224" y="80" textAnchor="middle" className="ekman-svg-small">Net transport</text>
        <path d="M24 131 H476" stroke="#ffffff1c" />
        <text x="24" y="154" className="ekman-svg-label">SIDE VIEW · LOOKING NORTH</text>
        <path d="M24 173 H405 V202 L305 299 H24Z" fill={`url(#ekman-ocean-${direction})`} />
        <path d="M405 158 H476 V309 H24 V299 H305 L405 202Z" fill="#635f4c" />
        <path d="M24 173 H405" stroke="#90d6df" strokeWidth="2" />
        <path d="M24 299 H305 L405 202 V158" fill="none" stroke="#c4bb8d" strokeWidth="2" />
        <text x="418" y="189" className="ekman-svg-small">Coast</text>
        <text x="46" y="217" className="ekman-svg-small">Surface water {upwelling ? "moves away" : "moves shoreward"}</text>
        <text x="46" y="250" className="ekman-svg-small">{upwelling ? "Cool, nutrient-rich water rises" : "Surface water sinks"}</text>
        {paths.map((path, index) => (
          <g key={index} className={index === 0 ? "ekman-flow wind" : index === 3 ? "ekman-flow deep" : "ekman-flow surface"}>
            <path data-flow-path d={path} fill="none" stroke="currentColor" strokeWidth="2" opacity=".45" />
            {Array.from({ length: index < 2 ? 2 : 5 }, (_, arrow) => (
              <g key={arrow} data-flow-arrow data-phase={arrow / (index < 2 ? 2 : 5)}>
                <path d="M-7 -4 L2 0 L-7 4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="-13" cy="0" r="1.8" fill="currentColor" />
              </g>
            ))}
          </g>
        ))}
      </svg>
      <p>{upwelling ? "Wind drives net transport away from the coast. Deeper water rises to replace it, bringing nutrients toward the surface." : "Reverse the wind and net transport moves toward the coast. Water builds up near shore and sinks, carrying surface water downward."}</p>
    </article>
  );
}

export default function EkmanCoastalDiagram() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) setPlaying(false);
    const change = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const flows = Array.from(root.current?.querySelectorAll<SVGGElement>(".ekman-flow") ?? []).map(group => {
      const path = group.querySelector<SVGPathElement>("[data-flow-path]")!;
      return { path, length: path.getTotalLength(), arrows: Array.from(group.querySelectorAll<SVGGElement>("[data-flow-arrow]")) };
    });
    function paint() {
      flows.forEach(({ path, length, arrows }) => arrows.forEach(arrow => {
        const distance = ((progress.current * 35 + Number(arrow.dataset.phase) * length) % length);
        const point = path.getPointAtLength(distance);
        const ahead = path.getPointAtLength(Math.min(distance + 1, length));
        const behind = path.getPointAtLength(Math.max(distance - 1, 0));
        const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
        arrow.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
      }));
    }
    paint();
    if (!playing) return;
    let frame = 0;
    let previous: number | undefined;
    function animate(now: number) {
      if (previous !== undefined) progress.current += Math.min((now - previous) / 1000, .05) * speed;
      previous = now;
      paint();
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed]);

  return (
    <section className="ekman-coastal-lab" ref={root} aria-labelledby="ekman-coastal-title">
      <div className="ekman-coastal-header">
        <div><span className="ekman-eyebrow">Watch the water move</span><h2 id="ekman-coastal-title">One coast. Two directions.</h2></div>
        <div className="ekman-motion-controls">
          <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? "Pause animation" : "Play animation"}</button>
          <label>Speed <select aria-label="Animation speed" value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
        </div>
      </div>
      <p className="ekman-coastal-intro">Compare coastal upwelling and downwelling. Follow the moving arrows from the ocean surface into the water below.</p>
      <div className="ekman-scene-grid"><CoastalScene upwelling /><CoastalScene upwelling={false} /></div>
      <div className="ekman-diagram-legend"><span><i className="wind" /> Wind</span><span><i className="surface" /> Surface water / net transport</span><span><i className="deep" /> Deeper water</span></div>
      <p className="ekman-model-note">Idealized Northern Hemisphere west coast: net Ekman transport is 90° to the right of the wind. Arrows illustrate direction; speed and depth are not to scale. <a href="https://oceanservice.noaa.gov/education/tutorial_currents/03coastal4.html" target="_blank" rel="noreferrer">Learn more at NOAA ↗</a></p>
    </section>
  );
}
