"use client";
import {useEffect,useState} from 'react';
import {scrollPageToStart} from '../shared/page-scroll.mjs';
import EcologyLesson,{type EcologyLessonId} from './EcologyLesson';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import JellyfishStingLab from './JellyfishStingLab';
import {polarChapterTitle,chapters,lessonChapterLabel} from '../shared/chapter-structure.mjs';
import {polarUnits} from '../shared/polar-content.mjs';
import type {LessonId} from './deepDives';
export default function PolarUnits({onBack,initialUnit=null}:{onBack:()=>void;initialUnit?:number|null}){
 const chapterUnits=chapters.find(chapter=>chapter.id==='polar')!.lessonIds.map(id=>{const index=polarUnits.findIndex(item=>item.id===id);return {...polarUnits[index],index};});
 const [unit,setUnit]=useState<number|null>(initialUnit);
 useEffect(()=>{scrollPageToStart();},[unit]);
 if(unit!==null){const item=polarUnits[unit];const chapterIndex=chapterUnits.findIndex(entry=>entry.index===unit);const next=chapterIndex>=0?chapterUnits[chapterIndex+1]:undefined;return <section className="polar-lesson">
  <header className="polar-lesson-header"><button type="button" className="back-button" onClick={onBack}>← Main page</button><p className="eyebrow">{lessonChapterLabel(item.id)} · {item.region}</p><h1>{item.title}</h1><p className="scientific">{item.scientific}</p><p className="polar-deck">{item.description}</p></header>
  {item.id==='penguin'&&<aside className="polar-location-note"><strong>Antarctica, at the South Pole.</strong><p>Emperor penguins do not naturally live in the Arctic. This unit is a southern comparison with the northern animals in this collection.</p></aside>}
  {item.ecology ? <EcologyLesson lessonId={item.id as EcologyLessonId}/> : <>
  <figure className="polar-hero"><img src={item.image} alt={item.alt} width={item.width??1536} height={item.height??1024} decoding="async"/><figcaption>{item.photo?<>Lion’s mane jellyfish in {item.photo.location}. <PhotoCredit photo={item.photo}/></>:<>Generated educational illustration · {item.region}. Appearance and scale are illustrative; this is not a measured specimen or a documentary photograph.</>}</figcaption></figure>
  {/* Article and quiz are siblings: separate keys let React remove both on exit. */}
  <LessonReading key={`reading-${item.id}`} lessonId={item.id as LessonId}/>
  {item.id==='lionsmane'&&<JellyfishStingLab/>}
  <LessonQuiz key={`quiz-${item.id}`} lessonId={item.id as 'penguin'|'orca'|'lionsmane'} title={`${item.title} written-answer quiz`} className="upwelling-quiz polar-written-quiz"/>
  </>}
  <nav className="polar-unit-navigation" aria-label="More polar lessons"><button type="button" onClick={onBack}>Main page</button>{next&&<button type="button" onClick={()=>setUnit(next.index)}>Next: {next.title} →</button>}</nav>
 </section>;}
 return <section className="currents-index polar-index" aria-labelledby="polar-title"><button type="button" className="back-button" onClick={onBack}>← Main page</button><div className="currents-heading"><p className="eyebrow">Polar environments · Six connected units</p><h1 id="polar-title">{polarChapterTitle}</h1><p className="polar-deck">Begin beneath sea ice, meet orcas, narwhals, belugas, and walruses, then compare northern life with emperor penguins in Antarctica. Every unit has two reading levels and a seven-question written-answer quiz.</p></div>
 <aside className="polar-geography"><div><span>North · Arctic</span><h2>An ocean surrounded by land.</h2><p>Orcas visit Arctic and subarctic waters and respond to changing food supplies and sea ice.</p></div><div><span>South · Antarctic comparison</span><h2>A continent surrounded by ocean.</h2><p>Emperor penguins live around Antarctica. Penguins are not native Arctic animals.</p></div></aside>
 <div className="current-card-grid polar-unit-grid">{chapterUnits.map((item,i)=><button type="button" className="current-subject-card" key={item.id} onClick={()=>setUnit(item.index)}><span className="card-number">{String(i+1).padStart(2,'0')}</span><div className="current-card-art has-topic-image"><img src={item.image} alt="" width={item.width??1536} height={item.height??1024}/></div><div className="card-copy"><span>{item.region}</span><h2>{item.title}</h2><p>{item.description}</p></div><span className="card-arrow">↗</span></button>)}</div><div className="polar-photo-credits">{chapterUnits.filter(item=>item.photo).map(item=><p key={item.id}>{item.title} · <PhotoCredit photo={item.photo!}/></p>)}</div></section>;
}

function PhotoCredit({photo}:{photo:{author:string;sourceUrl:string;license:string;licenseUrl:string}}){
 return <>Photo: <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>. Resized and compressed for the web.</>;
}
