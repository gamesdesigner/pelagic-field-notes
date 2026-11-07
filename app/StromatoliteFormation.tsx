import {Fragment,useId,useState} from 'react';
import {stromatoliteSteps,stromatoliteSources} from '../shared/stromatolites-content.mjs';
import './stromatolites.css';

export default function StromatoliteFormation(){
 const id=useId();
 const [selected,setSelected]=useState(0);
 const [pulse,setPulse]=useState(true);
 const step=stromatoliteSteps[selected];
 const source=stromatoliteSources[step.source as keyof typeof stromatoliteSources];
 return <section className={`strom-formation${pulse?' strom-pulsing':''}`} aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Explore the formation sequence</p><h2 id={`${id}-title`}>A living surface. A lasting record.</h2><p>Choose a stage to examine how a microbial community can build a layered structure. The scenes stay still; only the connecting arrows change color.</p></header>
  <div className="strom-controls"><button type="button" aria-pressed={pulse} onClick={()=>setPulse(current=>!current)}>{pulse?'Pause arrow colors':'Play arrow colors'}</button><span>Slow color pulses · Reduced-motion settings keep arrows still.</span></div>
  <div className="strom-stages" role="group" aria-label="Four stromatolite formation stages">
   {stromatoliteSteps.map((item,index)=><Fragment key={item.title}>
    <button type="button" className="strom-stage" aria-pressed={selected===index} aria-controls={`${id}-detail`} onClick={()=>setSelected(index)}>
     <span className={`strom-scene strom-scene-${index}`} aria-hidden="true"/>
     <span className="strom-stage-text"><span className="strom-number">{index+1}.</span><strong>{item.title}</strong><span>{item.short}</span></span>
    </button>
    {index<3&&<span className={`strom-arrow strom-arrow-${index}`} aria-hidden="true">➜</span>}
   </Fragment>)}
  </div>
  <div className="strom-detail" id={`${id}-detail`} aria-live="polite" aria-atomic="true">
   <div className={`strom-detail-scene strom-scene strom-scene-${selected}`} role="img" aria-label={['A thin green microbial mat with an inset showing filaments.','Sediment grains caught in the surface of a green microbial mat.','Pale mineral cement forms beneath a thin living surface.','A cutaway dome reveals older layers beneath its green living surface.'][selected]}/>
   <div><p className="eyebrow">Stage {selected+1} of 4</p><h3>{step.title}</h3><p>{step.detail}</p><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></div>
  </div>
  <p className="strom-note">Generated scientific illustration, adapted from your four-stage reference. Processes can overlap in nature. Arrows show connections, not measured water flow or growth speed. Ancient stromatolites do not all preserve the same builders or conditions.</p>
 </section>;
}
