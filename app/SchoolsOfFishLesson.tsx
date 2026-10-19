import {useId} from 'react';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';

const fishPositions=Array.from({length:24},(_,i)=>({x:145+(i%6)*95+(Math.floor(i/6)%2)*28,y:115+Math.floor(i/6)*65,scale:.65+(i%3)*.1}));
export function FishSchoolArt(){
 const id=useId();
 return <svg className="fish-school-art" viewBox="0 0 800 450" role="img" aria-labelledby={`${id}-title`}><title id={`${id}-title`}>Diagram of fish aligned and swimming together in a school</title><defs><linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#69a0a0"/><stop offset="1" stopColor="#1c4d5c"/></linearGradient><linearGradient id={`${id}-fish`} x2="0" y2="1"><stop stopColor="#759c9c"/><stop offset=".48" stopColor="#d7e1d3"/><stop offset="1" stopColor="#f1e8cf"/></linearGradient></defs><rect width="800" height="450" fill={`url(#${id}-water)`}/><g fill="#d9eadb" opacity=".12"><path d="M80 0H150L350 450H230Z"/><path d="M320 0H365L570 450H465Z"/><path d="M585 0H625L790 450H705Z"/></g><g stroke="#b9d1c9" fill="none" opacity=".35"><path d="M70 70H695l-12-9m12 9-12 9"/><path d="M70 410H695l-12-9m12 9-12 9"/></g>{fishPositions.map((fish,i)=><g key={i} transform={`translate(${fish.x} ${fish.y}) scale(${fish.scale})`}><path d="M-25 0L-47-17L-41 0L-47 17Z" fill="#99bab3"/><path d="M-31 0Q-6-22 30-8L44 0L30 8Q-6 22-31 0Z" fill={`url(#${id}-fish)`} stroke="#496f74" strokeWidth="1.5"/><path d="M-5-12L5-26L13-12M-4 12L4 21L12 11" fill="#9ab4a7"/><path d="M-19 0H28" stroke="#718f87" opacity=".5"/><circle cx="29" cy="-4" r="2.5" fill="#173e4a"/></g>)}</svg>;
}
export default function SchoolsOfFishLesson(){
 return <div className="schooling-unit"><figure className="schooling-hero"><FishSchoolArt/><figcaption><span>Sunlight-zone behavior</span><h2>Many neighbors, one moving pattern.</h2><p>Similar headings are a visible sign of schooling. This diagram simplifies spacing and size; it does not show a measured group.</p></figcaption></figure><LessonReading lessonId="schooling"/><LessonQuiz lessonId="schooling" title="Schools of Fish quiz" className="upwelling-quiz"/></div>;
}
