import {useId,useState} from 'react';
import {ventChemicals,ventChemicalCategories} from '../shared/whales-deep/field-guide.mjs';
import {ecologySources} from '../shared/ecology-sources.mjs';
const sources:Record<string,{label:string;url:string}>=ecologySources;
export default function VentChemistry(){
 const id=useId();const [category,setCategory]=useState('all');const chemicals=category==='all'?ventChemicals:ventChemicals.filter(item=>item.categories.includes(category));
 return <section className="ray-lab vent-chemistry" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Chemical reference · Select a role</p><h2 id={`${id}-title`}>What is in vent water?</h2><p>These are examples from different systems. Composition changes from place to place, and oxygen often arrives with cooler seawater. Energy substrates, carbon sources, and mineral-forming substances do different jobs.</p></header>
  <div className="whale-choice-buttons" role="group" aria-label="Filter chemicals by role">{ventChemicalCategories.map(item=><button type="button" key={item.id} aria-pressed={category===item.id} aria-controls={`${id}-list`} onClick={()=>setCategory(item.id)}>{item.label}</button>)}</div>
  <p className="chemistry-count" role="status">{chemicals.length} chemical {chemicals.length===1?'entry':'entries'} shown</p>
  <dl id={`${id}-list`} className="vent-chemical-list">{chemicals.map(item=><div key={item.name}><dt><span className="chemical-formula">{item.formula}</span>{item.name}</dt><dd><p><strong>Where it comes from:</strong> {item.origin}</p><p><strong>What it does:</strong> {item.role}</p><a href={sources[item.source].url} target="_blank" rel="noreferrer">Science reference ↗</a></dd></div>)}</dl>
  <p className="ray-lab-note"><strong>Follow the whole pathway:</strong> chemical reaction → usable microbial energy → carbon fixation → organic matter → consumers. A hot rock or metal atom does not turn directly into a worm. Not every microbe fixes carbon, and not every listed substance occurs at every vent.</p>
 </section>;
}
