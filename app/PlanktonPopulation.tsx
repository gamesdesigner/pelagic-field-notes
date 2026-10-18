"use client";
import {useCallback,useEffect,useId,useRef,useState,type PointerEvent} from 'react';
import {addNutrient,initialPlanktonState,nutrientDoses,stepPlankton,consumePlankton} from '../shared/plankton-model.mjs';
import PlanktonTank,{type NutrientDrop} from './PlanktonTank';
type Mineral = keyof typeof nutrientDoses;
const minerals: {key:Mineral;name:string;symbol:string;job:string}[]=[{key:'nitrogen',name:'Nitrogen',symbol:'N',job:'Proteins and genetic material'},{key:'phosphorus',name:'Phosphorus',symbol:'P',job:'Energy transfer and cell building'},{key:'silicate',name:'Silicate',symbol:'Si',job:'New diatom silica walls'}];
export default function PlanktonPopulation(){
 const id=useId();
 const [run,setRun]=useState(()=>({tank:initialPlanktonState(),history:[initialPlanktonState()],captures:0,eaten:0}));
 const [playing,setPlaying]=useState(false);
 const [message,setMessage]=useState('Drag a nutrient packet into the water. Add fish to watch them find and eat cell groups.');
 const [selected,setSelected]=useState<Mineral|null>(null);
 const [ghost,setGhost]=useState<{kind:Mineral;x:number;y:number}|null>(null);
 const [drop,setDrop]=useState<NutrientDrop|null>(null);const [stepSignal,setStepSignal]=useState(0);const [sceneKey,setSceneKey]=useState(0);
 const svgRef=useRef<SVGSVGElement>(null);const dropId=useRef(0);const suppressClick=useRef(false);
 const dragging=useRef<{kind:Mineral;pointerId:number;x:number;y:number;moved:boolean;element:HTMLButtonElement}|null>(null);
 const {tank,history}=run;
 const limited=tank.day>=120;
 const advance=useCallback(()=>{setRun(current=>{if(current.tank.day>=120)return current;const next=stepPlankton(current.tank,{externalGrazing:true});return {...current,tank:next,history:[...current.history,next].slice(-61)};});},[]);
 useEffect(()=>{if(!playing||limited)return;const timer=window.setInterval(advance,1000);return ()=>window.clearInterval(timer);},[playing,limited,advance]);
 useEffect(()=>{const pauseHidden=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',pauseHidden);return ()=>document.removeEventListener('visibilitychange',pauseHidden);},[]);
 const eat=useCallback((kind:'diatoms'|'flagellates',amount:number)=>setRun(current=>{
  const next=consumePlankton(current.tank,kind,amount);const removed=current.tank[kind]-next[kind];if(!removed)return current;
  return {...current,tank:next,captures:current.captures+1,eaten:current.eaten+removed,history:current.history.map((h,i)=>i===current.history.length-1?next:h)};
 }),[]);
 function dose(key:Mineral,x=350,y=180){
  if(limited)return;
  setRun(current=>({...current,tank:addNutrient(current.tank,key)}));setDrop({id:++dropId.current,kind:key,x:Math.max(18,Math.min(682,x)),y:Math.max(42,Math.min(335,y))});setSelected(null);setGhost(null);setPlaying(true);
  setMessage(`Released ${nutrientDoses[key]} ${key} units into the water. Watch the tracers disperse toward cells. Growth still depends on the other nutrients and temperature.`);
 }
 function startDrag(event:PointerEvent<HTMLButtonElement>,kind:Mineral){
  if(event.button!==0||limited)return;event.currentTarget.setPointerCapture(event.pointerId);event.currentTarget.focus();setSelected(kind);suppressClick.current=false;
  dragging.current={kind,pointerId:event.pointerId,x:event.clientX,y:event.clientY,moved:false,element:event.currentTarget};
 }
 function moveDrag(event:PointerEvent<HTMLButtonElement>){const drag=dragging.current;if(!drag||drag.pointerId!==event.pointerId)return;if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>5)drag.moved=true;if(drag.moved)setGhost({kind:drag.kind,x:event.clientX,y:event.clientY});}
 function endDrag(event:PointerEvent<HTMLButtonElement>){
  const drag=dragging.current;if(!drag||drag.pointerId!==event.pointerId)return;dragging.current=null;setGhost(null);suppressClick.current=drag.moved;
  if(drag.element.hasPointerCapture(event.pointerId))drag.element.releasePointerCapture(event.pointerId);
  if(!drag.moved)return;const box=svgRef.current?.getBoundingClientRect();
  if(box&&event.clientX>=box.left&&event.clientX<=box.right&&event.clientY>=box.top&&event.clientY<=box.bottom)dose(drag.kind,(event.clientX-box.left)/box.width*700,(event.clientY-box.top)/box.height*360);
  else{setSelected(null);setMessage('No nutrient added. Release the packet inside the water.');}
 }
 function cancelDrag(){const drag=dragging.current;dragging.current=null;if(drag?.element.hasPointerCapture(drag.pointerId))drag.element.releasePointerCapture(drag.pointerId);suppressClick.current=true;setGhost(null);setSelected(null);}
 function fish(change:number){setRun(current=>({...current,tank:{...current.tank,fish:Math.max(0,Math.min(12,current.tank.fish+change))}}));if(change>0&&!limited)setPlaying(true);setMessage('Fish swim toward nearby cells, open their mouths, and swallow cell groups. Each capture removes abundance from the population.');}
 function reset(){cancelDrag();setPlaying(false);setRun({tank:initialPlanktonState(),history:[initialPlanktonState()],captures:0,eaten:0});setStepSignal(0);setDrop(null);setSceneKey(value=>value+1);setMessage('Tank reset: 80 diatoms, 55 dinoflagellates, 18°C, no fish, and the original nutrient supply.');}
 const start=history[0].day,span=Math.max(1,tank.day-start);
 const chart=(key:'diatoms'|'flagellates')=>history.map((h,i)=>`${i?'L':'M'}${55+(h.day-start)/span*790},${265-Math.min(600,h[key])/600*225}`).join(' ');
 const previous=history.length>1?history[history.length-2]:tank;
 const change=tank.diatoms+tank.flagellates-previous.diatoms-previous.flagellates;
 const level=tank.nitrogen<1?'Nitrogen is nearly exhausted.':tank.phosphorus<.4?'Phosphorus is nearly exhausted.':tank.silicate<1?'Silicate is low: diatom growth is restricted.':tank.fish>=5?'Strong grazing can outweigh cell division.':'Nutrients remain available. Temperature, crowding and grazing still affect growth.';
 return <section className="discovery-panel plankton-population" aria-labelledby={`${id}-title`} onKeyDown={event=>{if(event.key==='Escape'&&(selected||ghost)){event.stopPropagation();cancelDrag();}}}>
  <div className="discovery-section-heading"><div><p className="eyebrow">Population lab · Make a prediction</p><h2 id={`${id}-title`}>A bloom is a balance.</h2></div><p>Drag nutrients into the water, adjust its temperature, and introduce filter-feeding fish. Watch cells respond and fish swim toward their next meal.</p></div>
  <div className="plankton-lab-toolbar"><div><strong>Day {tank.day}</strong><span>{limited?'120-day experiment complete':playing?'Running · 1 day per second':'Paused · advance at your own pace'}</span></div><div><button type="button" disabled={limited} aria-pressed={playing&&!limited} onClick={()=>setPlaying(value=>!value)}>{playing&&!limited?'Pause':'Run simulation'}</button><button type="button" disabled={limited||playing} onClick={()=>{advance();setStepSignal(value=>value+1);}}>Advance 1 day</button><button type="button" onClick={reset}>Reset experiment</button></div></div>
  <div className="plankton-lab-grid"><div>
   <div className="plankton-nutrient-tray" role="group" aria-label="Nutrients to drag into the tank"><p id={`${id}-drag-help`}>Drag a packet into the water. Or select it, then tap the water or use “Place nutrient”.</p><div>{minerals.map(m=><button type="button" key={m.key} className="nutrient-packet" disabled={limited||tank[m.key]>=60} aria-label={`Drag ${m.name.toLowerCase()} into water`} aria-describedby={`${id}-drag-help`} aria-pressed={selected===m.key} onPointerDown={event=>startDrag(event,m.key)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onClick={event=>{if(suppressClick.current&&event.detail>0){suppressClick.current=false;return;}suppressClick.current=false;setSelected(m.key);setMessage(`${m.name} selected. Drag it into the water, tap a water location, or use Place nutrient.`);}}><span className="nutrient-symbol">{m.symbol}</span><span>{m.name}<small>+{nutrientDoses[m.key]} units · drag to add</small></span><span aria-hidden="true">⠿</span></button>)}</div></div>
   <div className="plankton-tank" aria-label="Illustrative tank view, not individual cell counts"><PlanktonTank key={sceneKey} tank={tank} playing={playing&&!limited} stepSignal={stepSignal} drop={drop} svgRef={svgRef} selected={selected} onEat={eat} onPlace={(x,y)=>{if(selected)dose(selected,x,y);}}/><div className="tank-placement-row"><p>Each enlarged cell symbol is a group. Colored tracers show nutrient dispersal; they are not visible molecules at this scale.</p><button type="button" disabled={!selected||limited} onClick={()=>{if(selected)dose(selected);}}>Place nutrient</button></div><p className="plankton-feeding-count" aria-label="Fish feeding record"><strong>{run.captures}</strong> cell groups swallowed · <strong>{run.eaten.toFixed(1)}</strong> abundance units eaten</p></div>
   <div className="plankton-lab-counts"><div><span className="diatom-key">Diatoms</span><strong>{tank.diatoms.toFixed(1)}</strong></div><div><span className="flagellate-key">Dinoflagellates</span><strong>{tank.flagellates.toFixed(1)}</strong></div><div><span>Last day’s net change</span><strong>{change>=0?'+':''}{change.toFixed(1)}</strong></div></div>
   <figure className="plankton-chart"><svg viewBox="0 0 900 325" role="img" aria-labelledby={`${id}-chart-title`}><title id={`${id}-chart-title`}>Population history over the most recent 60 days. Diatoms are gold and dinoflagellates teal. Current values are in the readouts above.</title>{[0,200,400,600].map(y=><g key={y}><line x1="55" x2="845" y1={265-y/600*225} y2={265-y/600*225} stroke="#cad3c8"/><text x="43" y={270-y/600*225} textAnchor="end">{y}</text></g>)}<path d={chart('diatoms')} fill="none" stroke="#a16f28" strokeWidth="3"/><path d={chart('flagellates')} fill="none" stroke="#286d6f" strokeWidth="3"/>{history.length===1&&<><circle cx="55" cy={265-tank.diatoms/600*225} r="4" fill="#a16f28"/><circle cx="55" cy={265-tank.flagellates/600*225} r="4" fill="#286d6f"/></>}<text x="55" y="294">Day {start}</text><text x="845" y="294" textAnchor="end">Day {tank.day}</text><text x="450" y="319" textAnchor="middle">Relative abundance index · not cells per litre</text></svg><figcaption><span className="diatom-key">— Diatoms</span><span className="flagellate-key">— Dinoflagellates</span></figcaption></figure>
   <details className="plankton-history"><summary>Read the population data</summary><div><table><caption>Daily abundance indices (most recent 60 days)</caption><thead><tr><th>Day</th><th>Diatoms</th><th>Dinoflagellates</th></tr></thead><tbody>{history.map(h=><tr key={h.day}><th>{h.day}</th><td>{h.diatoms.toFixed(1)}</td><td>{h.flagellates.toFixed(1)}</td></tr>)}</tbody></table></div></details>
  </div><div className="plankton-lab-controls">
   <fieldset><legend>Nutrients in the water</legend><p>Use the draggable packets above the tank. New nutrients dissolve where you release them.</p>{minerals.map(m=><div key={m.key} className="nutrient-stock"><span className="nutrient-symbol">{m.symbol}</span><span><strong>{m.name}</strong><small>{m.job}</small><span>{tank[m.key].toFixed(1)} units available</span></span></div>)}</fieldset>
   <label className="plankton-temp" htmlFor={`${id}-temp`}>Water temperature <output>{tank.temperature}°C</output><input id={`${id}-temp`} type="range" aria-label="Water temperature" aria-valuetext={`${tank.temperature} degrees Celsius`} min="5" max="35" step="1" value={tank.temperature} onChange={event=>setRun(current=>({...current,tank:{...current.tank,temperature:Number(event.target.value)}}))}/><span>5°C <span>35°C</span></span></label>
   <div className="plankton-fish"><strong>Filter-feeding fish: {tank.fish}</strong><p>The fish eat both kinds of cells. Adding fish starts their feeding. Pause freezes the tank; fish numbers stay fixed until you change them.</p><div><button type="button" disabled={tank.fish===0} onClick={()=>fish(-1)}>Remove fish</button><button type="button" disabled={tank.fish===12} onClick={()=>fish(1)}>Add fish</button></div></div>
   <p className="plankton-lab-feedback" role="status">{message}</p><p className="plankton-lab-explanation">{level}</p>
  </div></div>
  <aside className="plankton-model-note"><strong>About this teaching model</strong><p>Both groups use nitrogen and phosphorus; only the diatoms also require silicate. Nutrients are consumed during growth. Division competes with background losses and fish grazing. Fish captures remove up to four abundance units per cell symbol. Advancing a paused day plays a short feeding step. Crowding reduces available light. The chosen temperature optima (16°C and 24°C) illustrate two example populations; real species differ. Light at the surface, water volume and fish survival are held constant. Nutrient recycling, zooplankton, oxygen, toxins and currents are omitted. These abundance and nutrient indices are invented classroom units, not measurements or environmental forecasts.</p><p>Try: reset, run 10 days, then add five fish. In another trial, compare 16°C with 30°C while keeping everything else the same.</p></aside>
  {ghost&&<div className="nutrient-drag-ghost" style={{left:ghost.x,top:ghost.y}} aria-hidden="true"><span>{minerals.find(m=>m.key===ghost.kind)?.symbol}</span><small>Release in the water</small></div>}
 </section>;
}
