"use client";

import { useId, useState } from 'react';

const bodyParts = [
  {id:'jaws',name:'Jaws & teeth',tag:'Feeding',text:'Triangular, serrated teeth cut prey. Replacement teeth develop behind the working rows and move forward as older teeth are lost.',fact:'The jaw can project forward during a bite.',x:18,y:80,tip:[175,275]},
  {id:'eye',name:'Eyes',tag:'Vision',text:'Eyes on the sides of the head detect light, contrast and movement. Vision works alongside smell, hearing and other senses.',fact:'White sharks roll their eyes back for protection during a bite.',x:12,y:19,tip:[181,247]},
  {id:'gills',name:'Five gill slits',tag:'Breathing',text:'Water passes over delicate gill surfaces, where oxygen enters the blood and carbon dioxide leaves. Five slits open on each side.',fact:'Great whites use forward movement to drive water over the gills.',x:32,y:17,tip:[343,270]},
  {id:'pectoral',name:'Pectoral fins',tag:'Lift & steering',text:'The paired fins behind the gills help control lift, pitch and turning. They work with the body and tail to guide the shark.',fact:'Pectoral fins guide the animal; the tail supplies most forward thrust.',x:42,y:85,tip:[426,350]},
  {id:'dorsal',name:'Dorsal fins',tag:'Stability',text:'The large first dorsal fin helps resist rolling. A much smaller second dorsal fin sits farther back along the body.',fact:'The tall triangular fin is only one part of the shark’s stabilizing system.',x:54,y:12,tip:[501,137]},
  {id:'lateral',name:'Lateral line',tag:'Water movement',text:'A sensory canal along each side detects local water movement and pressure changes, helping the shark notice nearby disturbances.',fact:'It senses movement in water; electrical signals use a different sensory system.',x:69,y:21,tip:[637,238]},
  {id:'tail',name:'Tail & caudal keel',tag:'Propulsion',text:'The crescent-shaped tail pushes against water. A ridge on the narrow tail base—the caudal keel—helps streamline this powerful region.',fact:'The tail sweeps from side to side, rather than up and down.',x:88,y:82,tip:[867,274]},
];
const adaptations = [
  {id:'ampullae',name:'Electrical sensors',tag:'Ampullae of Lorenzini',text:'Tiny pores around the snout connect to jelly-filled canals and sensory organs that detect weak electrical fields from nearby animals.',fact:'The colored pores are enlarged so you can see them.',x:14,y:76,tip:[158,252]},
  {id:'denticles',name:'Tooth-like skin scales',tag:'Dermal denticles',text:'Tiny ridged scales cover the skin. These dermal denticles protect the surface and influence how water flows over the body.',fact:'The inset magnifies a simplified patch of scales; it is not their actual size.',x:34,y:17,tip:[391,220]},
  {id:'heat',name:'Heat-retaining vessels',tag:'Regional endothermy',text:'Closely arranged blood vessels exchange heat, helping retain warmth in swimming muscles and some organs even in cooler water.',fact:'Only some body regions stay warmer; the whole shark is not kept at one constant temperature.',x:56,y:17,tip:[560,253]},
  {id:'liver',name:'Oil-rich liver',tag:'Buoyancy & energy',text:'A large liver stores low-density oils that help reduce sinking and provide an energy reserve. Sharks have no gas-filled swim bladder.',fact:'This translucent overlay shows an approximate internal position.',x:49,y:83,tip:[475,285]},
  {id:'skeleton',name:'Cartilage skeleton',tag:'Support',text:'The skeleton is made mainly of cartilage, strengthened in places by mineral deposits. It supports the body without a bony-fish skeleton.',fact:'The highlighted spine is a simplified guide, not a complete skeletal reconstruction.',x:80,y:75,tip:[725,249]},
];

export default function SharkAnatomy() {
  const uid = useId();
  const [mode,setMode] = useState<'body'|'adaptations'>('body');
  const [selected,setSelected] = useState(0);
  const parts = mode==='body'?bodyParts:adaptations;
  const part = parts[selected];

  function changeMode(value:'body'|'adaptations') { setMode(value); setSelected(0); }

  return <section className="shark-anatomy discovery-panel" aria-labelledby="shark-anatomy-title">
    <div className="discovery-section-heading"><div><p className="eyebrow">Anatomy · Great white shark</p><h2 id="shark-anatomy-title">Built for life in motion.</h2></div><p>Explore the structures behind a great white’s senses, strength and survival. Select a number or a named part.</p></div>
    <div className="shark-anatomy-modes" role="group" aria-label="Anatomy view">
      <button type="button" aria-pressed={mode==='body'} onClick={()=>changeMode('body')}>Body parts <span>07 structures</span></button>
      <button type="button" aria-pressed={mode==='adaptations'} onClick={()=>changeMode('adaptations')}>Special adaptations <span>05 close-ups</span></button>
    </div>
    <figure className="shark-anatomy-figure">
      <div className="shark-anatomy-plate">
        <svg viewBox="0 0 1000 500" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
          <title id={`${uid}-title`}>Great white shark anatomy: {part.name}</title>
          <desc id={`${uid}-desc`}>A stationary side-view diagram, head to the left and tail to the right, with numbered callouts. {part.text} {part.id==='liver'||part.id==='skeleton'||part.id==='heat'?'Internal structures are shown as simplified overlays.':''}</desc>
          <image href="/assets/shark/great-white-anatomy-realistic.webp" x="100" y="65" width="840" height="400" preserveAspectRatio="none"/>
          <path d="M70 478 H930" stroke="#bac6bb" strokeWidth="1"/>
          <text x="70" y="496" className="shark-plate-label">CARCHARODON CARCHARIAS</text><text x="930" y="496" textAnchor="end" className="shark-plate-label">SIDE VIEW · NOT TO SCALE</text>
          {mode==='body'&&part.id!=='lateral'&&<ellipse cx={part.tip[0]} cy={part.tip[1]} rx={part.id==='gills'?44:part.id==='tail'?48:24} ry={part.id==='gills'?48:part.id==='tail'?70:24} fill="#be775e15" stroke="#aa6049" strokeWidth="2" strokeDasharray="5 4"/>}
          {part.id==='lateral'&&<path d="M245 239 Q450 215 650 262 Q730 278 837 276" fill="none" stroke="#be775e" strokeWidth="4" strokeDasharray="6 5"/>}
          {part.id==='ampullae'&&<g fill="#be775e" stroke="#fff9e9" strokeWidth="1">{[[144,254],[154,260],[165,267],[177,269],[179,252],[188,258],[159,243]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="4"/>)}</g>}
          {part.id==='liver'&&<path d="M350 269 Q421 248 579 268 Q637 278 663 282 Q586 309 470 305 Q406 301 350 283Z" fill="#c58b56aa" stroke="#a26340" strokeWidth="2" strokeDasharray="7 4"/>}
          {part.id==='skeleton'&&<g stroke="#f6f0d3" strokeWidth="5" fill="none"><path d="M219 241 Q402 228 571 251 Q694 260 832 247"/>{Array.from({length:24},(_,i)=><path key={i} d={`M${290+i*21} ${235+Math.sin(i/10)*15} l-2 13`}/>)}</g>}
          {part.id==='heat'&&<g fill="none" strokeWidth="5"><path d="M369 243 Q478 225 631 259 M369 257 Q479 239 631 273" stroke="#b96e55"/><path d="M369 250 Q479 232 631 266 M369 264 Q479 246 631 280" stroke="#417783"/>{[0,1,2,3,4,5].map(i=><path key={i} d={`M${420+i*31} 239 v31`} stroke="#f1cf9c" strokeWidth="2"/>)}</g>}
          {part.id==='denticles'&&<g><circle cx="391" cy="220" r="32" fill="#c08b6355" stroke="#be775e" strokeWidth="2"/><path d="M417 203 L681 94" stroke="#be775e" strokeDasharray="6 5"/><rect x="680" y="42" width="220" height="120" rx="12" fill="#f1eadb" stroke="#baaa91"/>{[0,1,2,3,4,5].map(i=><g key={i} transform={`translate(${709+(i%3)*60} ${65+Math.floor(i/3)*43})`} fill="#799194" stroke="#486771"><path d="M0 4 Q15 -7 30 4 L39 22 L21 17 L5 22Z"/><path d="M10 3 L16 15 M20 1 L25 15" fill="none" stroke="#dae1d1"/></g>)}</g>}
          <g fill="none" strokeWidth="1.5">{parts.map((p,i)=><path key={p.id} d={`M${p.x*10} ${p.y*5} L${p.tip[0]} ${p.tip[1]}`} stroke={i===selected?'#a65e47':'#91a4a0'} strokeDasharray={i===selected?undefined:'4 4'}/>)}</g>
        </svg>
        {parts.map((p,i)=><button type="button" key={p.id} className="shark-anatomy-marker" style={{left:`${p.x}%`,top:`${p.y}%`}} aria-label={`Inspect ${p.name}`} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{i+1}</button>)}
      </div>
      <figcaption>AI-generated natural-history illustration with interactive teaching overlays. Highlighted internal structures, pores, teeth and skin scales are simplified or enlarged. Other organs are omitted.</figcaption>
    </figure>
    <div className="shark-anatomy-explore">
      <div className="shark-anatomy-list" role="group" aria-label={mode==='body'?'Shark body parts':'Shark special adaptations'}>{parts.map((p,i)=><button type="button" key={p.id} aria-pressed={selected===i} aria-controls={`${uid}-detail`} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,'0')}</span>{p.name}<span aria-hidden="true">↗</span></button>)}</div>
      <div className="shark-anatomy-detail" id={`${uid}-detail`} role="status" aria-live="polite" aria-atomic="true"><p className="eyebrow">{part.tag}</p><h3>{part.name}</h3><p>{part.text}</p><p className="shark-anatomy-fact"><strong>Look closer</strong>{part.fact}</p></div>
    </div>
    <p className="shark-anatomy-sources">Explore the science: <a href="https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/white-shark/" target="_blank" rel="noreferrer">Florida Museum · White shark</a><span> · </span><a href="https://www.floridamuseum.ufl.edu/discover-fish/sharks/shark-biology/" target="_blank" rel="noreferrer">Senses &amp; physiology</a><span> · </span><a href="https://www.amnh.org/explore/ology/marine-biology/all-about-sharks" target="_blank" rel="noreferrer">AMNH · Shark anatomy</a><span> · </span><a href="https://www.fisheries.noaa.gov/feature-story/sharpen-your-shark-facts" target="_blank" rel="noreferrer">NOAA · Senses and skin</a></p>
  </section>;
}
