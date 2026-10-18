"use client";
import {useEffect,useId,useState} from 'react';
import TwilightCreatureArt from './TwilightCreatureArt';
const stages=[
 {title:'1. Hover in midwater',text:'The vampire squid conserves energy. Its ordinary red-brown color is shown brighter here so you can study the body.'},
 {title:'2. Arm-tip light',text:'When disturbed, the animal can change its webbed-arm posture and make its arm tips glow. Light is one of several defensive responses.'},
 {title:'3. Release glowing mucus',text:'Luminous mucus leaves the arm tips and spreads into small blue-white points. This is not black ink from an ink sac, mouth, or siphon.'},
 {title:'4. Retreat',text:'The squid moves away while the luminous material remains behind as a possible distraction. Natural behavior, light output, and timing vary.'}
];
export default function VampireDefense(){
 const [step,setStep]=useState(0);const [playing,setPlaying]=useState(false);const [speed,setSpeed]=useState(1);const id=useId();
 useEffect(()=>{if(!playing)return;const timer=window.setTimeout(()=>{if(step===3)setPlaying(false);else setStep(value=>value+1);},2600/speed);return()=>window.clearTimeout(timer);},[playing,step,speed]);
 function play(){if(step===3)setStep(0);setPlaying(value=>!value);}
 return <section className="vampire-defense" aria-labelledby={`${id}-title`}>
  <div className="twilight-lab-heading"><p className="eyebrow">Unit 2 · Animated defense sequence</p><h2 id={`${id}-title`}>A glowing escape.</h2><p>Vampire squid release luminous mucus instead of ordinary ink. Follow the material from the arm tips as the animal retreats.</p></div>
  <div className="vampire-defense-toolbar"><button type="button" onClick={play}>{playing?'Pause defense':step===3?'Replay defense':'Play defense'}</button><button type="button" onClick={()=>{setPlaying(false);setStep(0);}}>Reset</button><label>Playback speed <select value={speed} aria-label="Defense playback speed" onChange={e=>setSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
  <div className={`defense-view defense-step-${step} ${playing?'is-playing':'is-paused'}`}>
   <svg viewBox="0 0 1000 400" role="img" aria-labelledby={`${id}-scene ${id}-description`}><title id={`${id}-scene`}>{stages[step].title}</title><desc id={`${id}-description`}>{stages[step].text}</desc>
    <defs><radialGradient id={`${id}-sea`}><stop stopColor="#163c50"/><stop offset="1" stopColor="#061320"/></radialGradient><radialGradient id={`${id}-mucus`}><stop stopColor="#b0eafb" stopOpacity=".24"/><stop offset="1" stopColor="#8bd1ee" stopOpacity="0"/></radialGradient></defs>
    <rect width="1000" height="400" fill={`url(#${id}-sea)`}/>
    <g aria-hidden="true" fill="#7793a0" opacity=".3">{Array.from({length:32},(_,i)=><circle key={i} cx={35+(i*137)%930} cy={25+(i*83)%350} r={i%3===0?1.5:.8}/>)}</g>
    <g className="defense-predator" transform="translate(255 0) scale(-1 1)" opacity={step===0?.1:.4}><path d="M55 210 Q88 155 150 180 L193 157 L185 201 L200 234 L151 219 Q89 253 55 210Z" fill="#5d8291"/><circle cx="77" cy="205" r="4" fill="#a1b5bb"/></g>
    <g className="defense-cloud" opacity={step>=2?1:0}><ellipse cx="355" cy="195" rx="165" ry="115" fill={`url(#${id}-mucus)`}/>
     {Array.from({length:44},(_,i)=><g key={i} className="luminous-droplet" style={{animationDelay:`${-i*.17}s`}}><path d={`M${470-(i%9)*25} ${118+(i*29)%150} q-22 ${(i%3-1)*13} -37 6`} fill="none" stroke="#8dcfe5" strokeWidth="1" opacity=".35"/><circle cx={470-(i%9)*25} cy={118+(i*29)%150} r={1.6+i%3} fill="#bfefff"/></g>)}
    </g>
    <g className="defense-animal"><svg x="450" y="105" width="280" height="162" viewBox="0 0 260 150"><TwilightCreatureArt kind="vampire" lit={step>0} filaments={false}/></svg></g>
    {step>=2&&<g className="defense-emitter" stroke="#a9e5f6" fill="none" strokeWidth="1.4"><path d="M455 280 L476 242"/><text x="390" y="307" fill="#d2edf3" stroke="none" fontSize="17">Arm-tip mucus</text></g>}
    <text x="32" y="365" fill="#8eaebd" fontSize="16">Open midwater · No seabed</text><text x="968" y="365" textAnchor="end" fill="#8eaebd" fontSize="16">Simplified sequence · Not to scale</text>
   </svg>
  </div>
  <div className="defense-stage-tabs" role="group" aria-label="Defense stages">{stages.map((stage,i)=><button type="button" key={stage.title} aria-pressed={step===i} onClick={()=>{setPlaying(false);setStep(i);}}>{stage.title}</button>)}</div>
  <div className="defense-stage-copy" aria-live="polite"><h3>{stages[step].title}</h3><p>{stages[step].text}</p></div>
  <p className="twilight-model-note">The steps compare defensive actions; every encounter does not follow the same sequence. Use the stage buttons to study still views. <a href="https://www.mbari.org/animal/vampire-squid/" target="_blank" rel="noreferrer">Science: MBARI’s vampire squid guide</a>.</p>
 </section>;
}
