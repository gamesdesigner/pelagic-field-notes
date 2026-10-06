"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function SharkSwimmingLab() {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const time = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) setPlaying(false);
    const change = () => { if (preference.matches) setPlaying(false); };
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const scene = root.current;
    if (!scene) return;
    const shark = scene.querySelector<SVGGElement>(".swimming-shark")!;
    const tail = scene.querySelector<SVGGElement>(".shark-tail")!;
    const fin = scene.querySelector<SVGGElement>(".shark-pectoral")!;
    const backFin = scene.querySelector<SVGGElement>(".shark-back-fin")!;
    const body = scene.querySelector<SVGPathElement>(".shark-flex-body")!;
    const belly = scene.querySelector<SVGPathElement>(".shark-flex-belly")!;
    const seabed = scene.querySelector<SVGGElement>(".shark-swim-seabed")!;
    const specks = Array.from(scene.querySelectorAll<SVGCircleElement>(".shark-water-speck"));
    const fish = Array.from(scene.querySelectorAll<SVGGElement>(".shark-background-fish"));
    let visible = true;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, {rootMargin:"100px"});
    observer.observe(scene);

    function paint() {
      const t = time.current;
      const stroke = Math.sin(t * 3.8);
      const wave = Math.sin(t * 3.8 - .65) * 7;
      shark.setAttribute("transform", `translate(${Math.sin(t * .35) * 12} ${Math.sin(t * .7) * 6}) rotate(${Math.sin(t * .5) * .7} 440 244)`);
      tail.setAttribute("transform", `translate(0 ${wave}) rotate(${stroke * 9} 218 243) scale(${1 - Math.abs(stroke) * .075} 1)`);
      fin.setAttribute("transform", `rotate(${Math.sin(t * 1.9) * 4} 479 253)`);
      backFin.setAttribute("transform", `rotate(${Math.sin(t * 1.9 + 1) * 3} 443 267)`);
      body.setAttribute("d", `M224 ${218+wave} Q341 ${177+wave*.4} 476 202 Q575 207 662 235 Q689 243 718 261 Q690 278 658 284 Q559 300 447 284 Q320 ${288+wave*.45} 216 ${257+wave} L179 ${243+wave}Z`);
      belly.setAttribute("d", `M224 ${250+wave} Q353 ${263+wave*.4} 475 255 Q592 266 706 264 Q681 279 658 284 Q559 300 447 284 Q320 ${288+wave*.45} 216 ${257+wave}Z`);
      seabed.setAttribute("transform", `translate(${-((t*21)%800)} 0)`);
      specks.forEach((point,i) => { point.setAttribute("cx", String(((i*157-t*(15+i%4*6))%840+840)%840-20)); point.setAttribute("cy", String(60+(i*83)%270+Math.sin(t*.6+i)*5)); });
      fish.forEach((group,i) => group.setAttribute("transform", `translate(${((i*290-t*(17+i*4))%1000+1000)%1000-100} ${90+i*42+Math.sin(t*1.1+i)*4}) scale(${.55+i*.12})`));
      scene!.dataset.swimTime=t.toFixed(3);
    }
    paint();
    if (!playing) { observer.disconnect(); return; }
    let frame = 0, previous: number | undefined, lastPaint = 0;
    function tick(now: number) {
      if (previous !== undefined && visible) time.current += Math.min((now-previous)/1000,.1)*speed;
      previous=now;
      if (visible && now-lastPaint>=1000/30) { paint(); lastPaint=now; }
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [playing, speed]);

  return <section className="shark-swimming-lab" ref={root} aria-labelledby="shark-swim-title">
    <div className="shark-swim-heading"><div><span>Watch it swim · 2D animation</span><h2 id="shark-swim-title">A great white in motion</h2></div><div className="shark-swim-controls"><button type="button" onClick={() => setPlaying(value=>!value)}>{playing ? "Pause swimming" : "Play swimming"}</button><label>Speed <select aria-label="Shark swimming animation speed" value={speed} onChange={event=>setSpeed(Number(event.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div></div>
    <p>The tail drives the shark forward as its body flexes. Its broad pectoral fins help it hold a steady course. Follow the moving water and seabed as the view travels with the shark.</p>
    <svg viewBox="0 0 800 450" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>A swimming great white shark</title><desc id={`${id}-description`}>A two-dimensional shark with a flexing body, sweeping tail and gently adjusting pectoral fins. Water particles and the seabed drift past while the view follows it.</desc>
      <defs><linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#4096b2" /><stop offset="1" stopColor="#062d49" /></linearGradient><linearGradient id={`${id}-skin`} x2="0" y2="1"><stop stopColor="#3c5768" /><stop offset=".6" stopColor="#74919b" /><stop offset="1" stopColor="#c6d7d7" /></linearGradient></defs>
      <rect width="800" height="450" fill={`url(#${id}-water)`} />
      <g fill="#d8f3ec" opacity=".1"><path d="M80 0 H125 L265 450 H155Z" /><path d="M350 0 H380 L550 450 H470Z" /><path d="M650 0 H675 L800 325 V450 H760Z" /></g>
      <g className="shark-swim-seabed">{[0,800].map(offset=><g key={offset} transform={`translate(${offset} 0)`}><path d="M0 388 Q90 359 190 386 T410 388 T630 375 T800 391 V450 H0Z" fill="#194a5b" /><path d="M0 430 Q120 390 210 413 T410 426 T650 404 T800 430 V450 H0Z" fill="#285766" /><g fill="#547d82" opacity=".7"><ellipse cx="115" cy="419" rx="18" ry="5" /><ellipse cx="466" cy="433" rx="26" ry="6" /><path d="M310 420 L315 399 L319 420 M625 421 L618 390 L630 411Z" /></g></g>)}</g>
      {Array.from({length:18},(_,i)=><circle className="shark-water-speck" key={i} cx={(i*157)%800} cy={60+(i*83)%270} r={i%3===0?2:1} fill="#ddf2ec" opacity=".32" />)}
      {Array.from({length:3},(_,i)=><g className="shark-background-fish" key={i} opacity=".45" fill="#153e51"><path d="M0 0 Q22 -10 40 0 Q22 10 0 0 L-9 -8 V8Z" /></g>)}
      <g className="swimming-shark">
        <g className="shark-tail"><path d="M219 226 Q159 181 128 108 Q145 198 179 243 Q150 280 136 329 Q175 281 219 255Z" fill="#577582" stroke="#2c4f62" strokeWidth="2" /></g>
        <path d="M350 208 Q379 149 421 114 Q415 175 452 202Z" fill="#39576a" />
        <g className="shark-back-fin"><path d="M466 267 Q437 316 403 340 Q423 287 423 267Z" fill="#375a6b" /></g>
        <path className="shark-flex-body" d="M224 218 Q341 177 476 202 Q575 207 662 235 Q689 243 718 261 Q690 278 658 284 Q559 300 447 284 Q320 288 216 257 L179 243Z" fill={`url(#${id}-skin)`} stroke="#355565" strokeWidth="2" />
        <path className="shark-flex-belly" d="M224 250 Q353 263 475 255 Q592 266 706 264 Q681 279 658 284 Q559 300 447 284 Q320 288 216 257Z" fill="#e2e7df" />
        <path d="M296 211 L283 187 L323 204 M302 273 L290 298 L330 281" fill="#688795" />
        <g className="shark-pectoral"><path d="M514 254 Q461 312 385 346 Q427 286 455 251Z" fill="#567988" stroke="#3b5d6d" strokeWidth="2" /><path d="M456 263 Q427 301 391 336" fill="none" stroke="#83a0a8" strokeWidth="2" /></g>
        <g fill="none" stroke="#385661" strokeWidth="3" strokeLinecap="round">{[0,1,2,3,4].map(i=><path key={i} d={`M${559-i*12} ${232-i*2} Q${546-i*12} ${250-i*2} ${549-i*12} ${268-i*2}`} />)}</g>
        <circle cx="657" cy="246" r="6" fill="#112c38" /><circle cx="659" cy="244" r="1.6" fill="#e2eeeb" />
        <path d="M641 272 Q670 280 695 267 M690 254 L697 253" fill="none" stroke="#395363" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
    <p className="shark-swim-note">This is a 2D teaching illustration. The fin and tail movements are exaggerated to make them easy to follow; the speed control changes playback speed.</p>
  </section>;
}
