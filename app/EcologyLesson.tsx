import {useId} from 'react';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import {ecologyLessons,ecologySources} from '../shared/ecology-content.mjs';
export type EcologyLessonId=keyof typeof ecologyLessons;
const sources:Record<string,{label:string;url:string}>=ecologySources;
export default function EcologyLesson({lessonId}:{lessonId:EcologyLessonId}){
 const lesson=ecologyLessons[lessonId];
 return <>
  <LessonReading key={`reading-${lessonId}`} lessonId={lessonId}/>
  <EcologyDiagram diagram={lesson.diagram}/>
  <LessonQuiz key={`quiz-${lessonId}`} lessonId={lessonId} title={`${lesson.title} written-answer quiz`}/>
 </>;
}
function EcologyDiagram({diagram}:{diagram:{title:string;image:string;alt:string;note:string;key:string[][]}}){
 const id=useId();
 return <section className="cephalopod-atlas ecology-diagram" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Numbered field diagram</p><h2 id={`${id}-title`}>{diagram.title}</h2><p>Match each number in the illustration with the name and explanation below. Open the full-size diagram for a closer look.</p></header>
  <figure className="ecology-diagram-image"><a href={diagram.image} target="_blank" rel="noreferrer" aria-label={`Open full-size diagram: ${diagram.title}`}><img src={diagram.image} alt={diagram.alt} width="1536" height="1024" loading="lazy"/></a><figcaption>Generated educational illustration · Numbered key below</figcaption></figure>
  <p className="cephalopod-plate-note">{diagram.note}</p>
  <ol className="cephalopod-specimen-key" aria-label="Names and explanations of the numbered diagram features">{diagram.key.map(([name,description,sourceId],index)=><li key={`${index}-${name}`}><h3>{name}</h3><p>{description}</p><a href={sources[sourceId].url} target="_blank" rel="noreferrer">Science reference ↗</a></li>)}</ol>
 </section>;
}
