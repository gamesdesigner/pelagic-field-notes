"use client";
import {useEffect,useState} from 'react';
import {twilightChapterTitle,cephalopodsChapterTitle,lessonChapterLabel} from '../shared/chapter-structure.mjs';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import TwilightExplorer from './TwilightExplorer';
import VampireDefense from './VampireDefense';
const units=[
 {title:'General Marine Life in Twilight',image:'/assets/twilight/general-twilight.webp',description:'Explore 200–1,000 metres: food webs, living light, and the daily journey between depths.'},
 {title:'Vampire Squid',image:'/assets/twilight/vampire-squid.webp',description:'Meet an unusual particle collector and discover its webbed arms and glowing mucus defense.'}
];
export default function TwilightUnits({onBack,initialUnit=null}:{onBack:()=>void;initialUnit?:number|null}){
 const [unit,setUnit]=useState<number|null>(initialUnit);
 useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});},[unit]);
 if(unit===null)return <section className="currents-index twilight-index" aria-labelledby="twilight-index-title"><button type="button" className="back-button" onClick={onBack}>← Main page</button><div className="currents-heading"><p className="eyebrow">{twilightChapterTitle} · Choose a unit</p><h1 id="twilight-index-title">{twilightChapterTitle}</h1><p className="twilight-index-deck">Explore fading light, daily migrations, and food webs between 200 and 1,000 metres. The Vampire Squid lesson is now in {cephalopodsChapterTitle}.</p></div><div className="current-card-grid twilight-unit-grid">{units.slice(0,1).map((item,i)=><button type="button" className="current-subject-card" key={item.title} onClick={()=>setUnit(i)}><span className="card-number">{String(i+1).padStart(2,'0')}</span><div className="current-card-art has-topic-image"><img src={item.image} alt="" width="1536" height="1024"/></div><div className="card-copy"><span>Unit {i+1} · Twilight zone</span><h2>{item.title}</h2><p>{item.description}</p></div><span className="card-arrow">↗</span></button>)}</div></section>;
 return <TwilightLesson key={unit} unit={unit} onBack={onBack}/>;
}
function TwilightLesson({unit,onBack}:{unit:number;onBack:()=>void}){
 const general=unit===0;const item=units[unit];const lessonId=general?'twilightGeneral':'twilight';
 return <div className="twilight-unit">
  <header className="twilight-unit-header"><button type="button" className="back-button" onClick={onBack}>← Main page</button><p className="eyebrow">{lessonChapterLabel(lessonId)}</p><h1>{item.title}</h1>{!general&&<p className="scientific">Vampyroteuthis infernalis</p>}<p className="twilight-unit-deck">{item.description}</p></header>
  <figure className="twilight-hero"><img src={item.image} width="1536" height="1024" alt={general?'Illustrated open-water twilight community: lanternfish, hatchetfish, bristlemouth, krill, a red jelly, and a vampire squid among sinking marine snow.':'Scientific illustration of a red-brown vampire squid with mantle fins, a large eye, webbed arms, fine feeding filaments, and blue-white luminous mucus particles near its arm tips.'} decoding="async"/><figcaption>{general?'An illustrated midwater community. Animals are shown together for comparison; their size and positions are not a measured scene.':'Artist’s reconstruction under illustrative lighting. The blue-white particles represent luminous mucus, not ordinary ink.'}</figcaption></figure>
  <div className="twilight-reading-wrap"><LessonReading lessonId={lessonId} /></div>
  {general?<TwilightExplorer/>:<VampireDefense/>}
  <LessonQuiz lessonId={lessonId} title={general?'General Twilight Life quiz':'Vampire Squid quiz'} className="upwelling-quiz twilight-quiz"/>
 </div>;
}
