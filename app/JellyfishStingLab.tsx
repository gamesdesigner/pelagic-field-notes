"use client";
import {useEffect, useId, useReducer, useState} from 'react';
import {newStingCell, stingReducer, stingStageAt, stingStages} from '../shared/jellyfish-sting.mjs';

const parts = [
  {name:'Whole cell', term:'Cnidocyte', text:'The living cell around the capsule. Its membrane separates the cell interior from the surrounding seawater and tissue.'},
  {name:'Sensory hair', term:'Cnidocil', text:'A contact-sensitive projection at the exposed end of the cell. Trigger regulation is more complex than a simple hair switch and varies among cnidarians.'},
  {name:'Capsule', term:'Nematocyst', text:'The specialized organelle inside the cell. Its tough wall encloses the packed thread before discharge. Cell and capsule are different structures.'},
  {name:'Hollow thread', term:'Eversible tubule', text:'The thread extends by turning inside out. The cutaway uses coral for the outer wall and cream for the inner space. Its base remains attached to the capsule.'},
  {name:'Nucleus', term:'Cell nucleus', text:'The nucleus belongs to the living cell, outside the nematocyst capsule. It is not fired into prey.'},
];
const clamp = (n:number) => Math.max(0, Math.min(1,n));

export default function JellyfishStingLab() {
  const id = useId();
  const [state,dispatch] = useReducer(stingReducer, undefined, newStingCell);
  const [speed,setSpeed] = useState(1);
  const [part,setPart] = useState(2);
  const [manual,setManual] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const stage = stingStageAt(state.progress);
  const contact = clamp(state.progress / .16);
  const opening = clamp((state.progress-.24)/.16);
  const extension = clamp((state.progress-.34)/.48);
  const delivery = clamp((state.progress-.75)/.25);
  const preyX = 580 + 70*(1-contact);

  useEffect(() => {
    if (!state.playing) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      // Hidden tabs do not skip the sequence when the student returns.
      const elapsed = document.hidden ? 0 : Math.min(100,now-previous);
      previous = now;
      dispatch({type:'tick',amount:elapsed*speed/8000});
    },40);
    return () => window.clearInterval(timer);
  },[state.playing,speed]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    function preferenceChanged(event:MediaQueryListEvent) {
      if (event.matches) {setManual(true); dispatch({type:'pause'});}
    }
    media.addEventListener('change',preferenceChanged);
    return () => media.removeEventListener('change',preferenceChanged);
  },[]);

  return <section className="jelly-sting-lab" aria-labelledby={`${id}-heading`}>
    <header className="sting-heading"><p className="eyebrow">Interactive microscope · Capture & defense</p><h2 id={`${id}-heading`}>How does a jellyfish sting?</h2><p>A lion’s mane jellyfish has stinging cells along its tentacles. Explore one cell in cross-section: trigger a discharge, then slow down the tiny mechanism inside.</p></header>
    <div className="sting-context"><span>Jellyfish tentacle</span><svg viewBox="0 0 300 55" aria-hidden="true"><path d="M8 40 Q70 4 155 29 T290 14" fill="none" stroke="#af7060" strokeWidth="15" strokeLinecap="round"/>{[35,68,103,137,172,208,242,275].map((x,i)=><circle key={x} cx={x} cy={i<4?28-i*2:34-(i-4)*5} r={i===3?8:4} fill={i===3?'#173f47':'#f4e3c7'} stroke="#173f47" strokeWidth="1.5"/>)}<circle cx="137" cy="22" r="14" fill="none" stroke="#173f47" strokeDasharray="3 3"/></svg><span>→ One cell, enlarged below</span></div>
    <div className="sting-toolbar">
      <button type="button" className="sting-primary" disabled={state.fired} onClick={()=>dispatch({type:'trigger',manual})}>Trigger a sting</button>
      <button type="button" disabled={!state.fired || (state.progress===1 && !state.playing)} onClick={()=>dispatch({type:state.playing?'pause':'resume'})}>{state.playing?'Pause':'Play'}</button>
      <button type="button" disabled={!state.fired} onClick={()=>dispatch({type:'replay',manual})}>Replay discharge</button>
      <button type="button" onClick={()=>dispatch({type:'new-cell'})}>Use a new cell</button>
      <label>Playback <select aria-label="Sting playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={.5}>0.5× · slower</option><option value={1}>1× · slow motion</option><option value={2}>2× · faster</option></select></label>
      <label className="sting-manual"><input type="checkbox" checked={manual} onChange={e=>{setManual(e.target.checked);dispatch({type:'pause'});}}/>Start paused</label>
    </div>
    <div className="sting-layout">
      <figure className="sting-microscope">
        <div className="sting-view-label"><span>Cell cross-section</span><span>{state.fired?'One discharge · review':'Unused capsule'}</span></div>
        <svg viewBox="0 0 740 480" role="img" aria-labelledby={`${id}-scene ${id}-desc`}>
          <title id={`${id}-scene`}>{stingStages[stage].title}: a jellyfish stinging cell</title><desc id={`${id}-desc`}>{stingStages[stage].text} Selected structure: {parts[part].term}.</desc>
          <defs>
            <radialGradient id={`${id}-water`}><stop stopColor="#e2ece6"/><stop offset="1" stopColor="#c9ded8"/></radialGradient>
            <linearGradient id={`${id}-cell`} x2="1" y2="1"><stop stopColor="#fff9e9"/><stop offset="1" stopColor="#b7d1bf"/></linearGradient>
            <linearGradient id={`${id}-capsule`}><stop stopColor="#f8ddae"/><stop offset=".6" stopColor="#f7ebd0"/><stop offset="1" stopColor="#d0a975"/></linearGradient>
            <clipPath id={`${id}-prey`}><ellipse cx={preyX} cy="245" rx="230" ry="205"/></clipPath>
          </defs>
          <rect width="740" height="480" fill={`url(#${id}-water)`}/>
          <g fill="#fffdf3" opacity=".65" aria-hidden="true">{Array.from({length:22},(_,i)=><circle key={i} cx={25+(i*97)%690} cy={40+(i*57)%390} r={i%3+1}/>)}</g>
          <path d="M0 402 Q150 382 310 410 L340 480 H0Z" fill="#a2c2b5"/>
          <ellipse cx={preyX} cy="245" rx="230" ry="205" fill="#eac6b1" stroke="#b27e68" strokeWidth="3"/>
          <g clipPath={`url(#${id}-prey)`} stroke="#bd8f7e" strokeWidth="1" fill="none" opacity=".55">{Array.from({length:7},(_,i)=><path key={i} d={`M${370+i*62} 10 l25 125 -35 100 22 120 -15 130`}/>)}{[140,245,350].map(y=><path key={y} d={`M340 ${y} Q530 ${y-36} 740 ${y+15}`}/>)}</g>
          <path d="M300 268 Q326 277 329 319 C356 402 290 452 178 447 C62 446 43 400 63 321 Q83 253 143 222 Q238 190 300 268Z" fill={`url(#${id}-cell)`} stroke={part===0?'#173f47':'#658f7a'} strokeWidth={part===0?6:3}/>
          <g opacity=".5" fill="#678e75">{Array.from({length:13},(_,i)=><ellipse key={i} cx={94+(i*39)%192} cy={285+(i*23)%125} rx="4" ry="2" transform={`rotate(${i*31} ${94+(i*39)%192} ${285+(i*23)%125})`}/>)}</g>
          <ellipse cx="114" cy="390" rx="27" ry="21" transform="rotate(-18 114 390)" fill="#889c9f" stroke={part===4?'#173f47':'#657e85'} strokeWidth={part===4?6:2}/><circle cx="115" cy="389" r="7" fill="#526c7d"/>
          <path d="M298 280 Q307 244 344 229" fill="none" stroke={part===1?'#173f47':'#527b79'} strokeWidth={part===1?7:4} transform={`rotate(${contact*12} 298 280)`}/>
          <path d="M300 281 C257 230 179 227 150 273 C113 328 161 384 223 377 C281 371 304 337 308 304" fill={`url(#${id}-capsule)`} stroke={part===2?'#173f47':'#9d7046'} strokeWidth={part===2?6:3}/>
          <path d="M301 281 Q316 290 308 304" fill="none" stroke="#805637" strokeWidth="6" transform={`rotate(${-opening*85} 301 281)`}/>
          <g opacity={1-extension} fill="none" stroke={part===3?'#173f47':'#b36c50'} strokeWidth={part===3?5:3}>
            <path d="M302 294 C277 287 274 265 245 269 C212 274 177 266 172 290 C166 320 267 277 272 307 C278 337 168 300 172 330 C178 354 256 325 251 349 C246 370 202 355 202 350"/>
          </g>
          {extension>0&&<g fill="none" strokeLinecap="round"><path d="M306 296 C374 313 420 263 479 269 S563 295 618 259" pathLength="1" stroke={part===3?'#173f47':'#b3674d'} strokeWidth={part===3?12:10} strokeDasharray={`${extension} 1`}/><path d="M306 296 C374 313 420 263 479 269 S563 295 618 259" pathLength="1" stroke="#fff2d4" strokeWidth="4" strokeDasharray={`${extension} 1`}/></g>}
          {extension>.6&&<g stroke="#9f5d44" strokeWidth="2">{[0,1,2,3,4].map(i=><path key={i} opacity={clamp((extension-.6-i*.06)*9)} d={`M${470+i*24} ${269+i*3} l-5 -11 m5 11 -9 8`}/>)}</g>}
          <g fill="#785e99" opacity={delivery} aria-hidden="true">{Array.from({length:10},(_,i)=><circle key={i} cx={608+Math.cos(i*2.4)*delivery*(12+i*4)} cy={262+Math.sin(i*2.4)*delivery*(12+i*4)} r="3.5"/>)}</g>
          {contact>.6&&opening<.5&&<g fill="none" stroke="#b46c4d" strokeWidth="2.5"><path d="M355 236 l12 -10 m-14 19 18 0 m-20 9 12 8"/></g>}
          <g fontFamily="Arial,sans-serif" fontSize="17" fill="#345b60"><text x="28" y="35">SEAWATER</text><text x="570" y="112" textAnchor="middle">PREY TISSUE</text><text x="28" y="465">TENTACLE SURFACE</text></g>
          <g stroke="#345b60" fill="none" strokeWidth="1.3"><path d="M95 193 L151 249"/><path d="M252 162 L330 243"/><path d="M75 426 L100 400"/></g>
          <g fontFamily="Arial,sans-serif" fontSize="18" fill="#234b50"><text x="29" y="183">Capsule</text><text x="204" y="150">Sensory hair</text><text x="20" y="447">Nucleus</text></g>
        </svg>
        <figcaption>Illustrative cutaway · Enlarged and slowed for study. Coral = thread wall; cream = hollow interior; purple = venom. Geometry, colors, and timing are not measurements.</figcaption>
      </figure>
      <aside className="sting-inspector" aria-label="Explore stinging cell anatomy"><p className="eyebrow">Inside the cell</p><h3>Choose a structure.</h3><div className="sting-part-buttons" role="group" aria-label="Cell structures">{parts.map((item,i)=><button type="button" key={item.name} aria-pressed={part===i} aria-controls={`${id}-part`} onClick={()=>setPart(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.name}</button>)}</div><div id={`${id}-part`} className="sting-part-description" aria-live="polite"><h4>{parts[part].term}</h4><p>{parts[part].text}</p></div></aside>
    </div>
    <div className="sting-timeline"><label htmlFor={`${id}-timeline`}>Discharge playback <span>{Math.round(state.progress*100)}%</span></label><input id={`${id}-timeline`} type="range" min="0" max="100" value={Math.round(state.progress*100)} disabled={!state.fired} aria-valuetext={`${Math.round(state.progress*100)} percent: ${stingStages[stage].title}`} onChange={e=>dispatch({type:'seek',progress:Number(e.target.value)/100})}/><p>Trigger once, then drag the timeline or choose a stage to inspect a still view.</p></div>
    <div className="sting-stages" role="group" aria-label="Sting stages">{stingStages.map((item,i)=><button type="button" disabled={!state.fired} key={item.title} aria-pressed={stage===i} onClick={()=>dispatch({type:'seek',progress:item.at})}><span>{i+1}</span>{item.title}</button>)}</div>
    <div className="sting-explanation" aria-live="polite" aria-atomic="true"><p className="eyebrow">Stage {stage+1} of 5</p><h3>{stingStages[stage].title}</h3><p>{stingStages[stage].text}</p></div>
    <details className="sting-science"><summary>What this model shows — and what it simplifies</summary><p>This is a representative penetrating nematocyst, not a measured reconstruction of a particular lion’s mane capsule. Cnidarians have several capsule types; not all penetrate prey. Discharge happens far faster than this playback. The stage spacing is for teaching, not a biological clock.</p><p>The contact button assumes an effective stimulus. Chemical cues, sensory cells, and physiological state also influence triggering. “Use a new cell” replaces the model instantly for study; natural replacement takes biological development.</p><p>Research: <a href="https://www.nature.com/articles/s41467-022-31090-0" target="_blank" rel="noreferrer">Karabulut et al. (2022), thread architecture and eversion</a>; <a href="https://elifesciences.org/articles/57578" target="_blank" rel="noreferrer">Weir et al. (2020), sensory control of discharge</a>. These experiments studied sea anemones; exact structures and regulation differ among species.</p></details>
  </section>;
}
