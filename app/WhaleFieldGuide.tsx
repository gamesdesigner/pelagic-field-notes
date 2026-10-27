import {useId,useState} from 'react';
import {whaleComparisons} from '../shared/whales-deep/field-guide.mjs';
import {ecologySources} from '../shared/ecology-sources.mjs';
const sources:Record<string,{label:string;url:string}>=ecologySources;
export default function WhaleFieldGuide(){
 const id=useId();const [selected,setSelected]=useState(0);const whale=whaleComparisons[selected];
 return <section className="ray-lab whale-comparison" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Compare populations and lifestyles</p><h2 id={`${id}-title`}>One ocean, different journeys</h2><p>Choose a whale to compare its prey, movements, reproductive habitat, and diving. Routes describe named examples, not a single schedule for every animal.</p></header>
  <div className="whale-choice-buttons" role="group" aria-label="Choose a whale to compare">{whaleComparisons.map((item,index)=><button type="button" key={item.id} aria-pressed={index===selected} aria-controls={`${id}-panel`} onClick={()=>setSelected(index)}>{index+1}. {item.name}</button>)}</div>
  <div id={`${id}-panel`} className="whale-comparison-panel" aria-live="polite"><h3>{whale.name}</h3><dl><div><dt>Common prey</dt><dd>{whale.prey}</dd></div><div><dt>Movement pattern</dt><dd>{whale.movement}</dd></div><div><dt>Mating, calving & nursing</dt><dd>{whale.reproduction}</dd></div><div><dt>Depth in context</dt><dd>{whale.depth}</dd></div></dl><div className="whale-comparison-sources">{whale.sources.map(source=><a key={source} href={sources[source].url} target="_blank" rel="noreferrer">{sources[source].label} ↗</a>)}</div></div>
  <p className="ray-lab-note"><strong>Largest is different from deepest.</strong> Blue whales are the largest living animals. The cited Cuvier’s beaked whale study recorded a dive to 2,992 m—a specific observation, not the routine depth of every whale or a permanently current record.</p><a href="https://doi.org/10.1371/journal.pone.0092633" target="_blank" rel="noreferrer">Read the tagged-diving study ↗</a>
 </section>;
}
