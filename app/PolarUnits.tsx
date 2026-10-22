"use client";
import {useEffect,useState} from 'react';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import JellyfishStingLab from './JellyfishStingLab';
import {polarUnits} from '../shared/polar-content.mjs';
import type {LessonId} from './deepDives';
export default function PolarUnits({onBack}:{onBack:()=>void}){
 const [unit,setUnit]=useState<number|null>(null);
 useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});},[unit]);
 if(unit!==null){const item=polarUnits[unit];return <section className="polar-lesson">
  <header className="polar-lesson-header"><button type="button" className="back-button" onClick={()=>setUnit(null)}>← Life in the Arctic</button><p className="eyebrow">Unit {unit+1} · {item.region}</p><h1>{item.title}</h1><p className="scientific">{item.scientific}</p><p className="polar-deck">{item.description}</p></header>
  {item.id==='penguin'&&<aside className="polar-location-note"><strong>Antarctica, at the South Pole.</strong><p>Emperor penguins do not naturally live in the Arctic. This unit is a southern comparison with the northern animals in this collection.</p></aside>}
  <figure className="polar-hero"><img src={item.image} alt={item.alt} width="1536" height="1024" decoding="async"/><figcaption>Generated educational illustration · {item.region}. Appearance and scale are illustrative; this is not a measured specimen or a documentary photograph.</figcaption></figure>
  <LessonReading key={item.id} lessonId={item.id as LessonId}/>
  {item.id==='lionsmane'&&<JellyfishStingLab/>}
  <LessonQuiz key={item.id} lessonId={item.id as 'penguin'|'orca'|'lionsmane'} title={`${item.title} written-answer quiz`} className="upwelling-quiz polar-written-quiz"/>
  <nav className="polar-unit-navigation" aria-label="More polar lessons"><button type="button" onClick={()=>setUnit(null)}>All polar lessons</button>{unit<polarUnits.length-1&&<button type="button" onClick={()=>setUnit(unit+1)}>Next: {polarUnits[unit+1].title} →</button>}</nav>
 </section>;}
 return <section className="currents-index polar-index" aria-labelledby="polar-title"><button type="button" className="back-button" onClick={onBack}>← All subjects</button><div className="currents-heading"><p className="eyebrow">Polar environments · Three animal studies</p><h1 id="polar-title">Life in<br/><em>the Arctic.</em></h1><p className="polar-deck">Explore northern orcas and lion’s mane jellyfish, then compare their lives with emperor penguins in Antarctica. Every unit has two reading levels and a seven-question written-answer quiz.</p></div>
 <aside className="polar-geography"><div><span>North · Arctic</span><h2>An ocean surrounded by land.</h2><p>Orcas visit Arctic and subarctic waters. Lion’s mane jellies live in cool northern seas.</p></div><div><span>South · Antarctic comparison</span><h2>A continent surrounded by ocean.</h2><p>Emperor penguins live around Antarctica. Penguins are not native Arctic animals.</p></div></aside>
 <div className="current-card-grid polar-unit-grid">{polarUnits.map((item,i)=><button type="button" className="current-subject-card" key={item.id} onClick={()=>setUnit(i)}><span className="card-number">{String(i+1).padStart(2,'0')}</span><div className="current-card-art has-topic-image"><img src={item.image} alt="" width="1536" height="1024"/></div><div className="card-copy"><span>{item.region}</span><h2>{item.title}</h2><p>{item.description}</p></div><span className="card-arrow">↗</span></button>)}</div></section>;
}
