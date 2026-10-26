import {useId} from 'react';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import {cephalopodSpecimens,cephalopodSources} from '../shared/cephalopod-content.mjs';

export default function CephalopodsLesson(){
 const id=useId();
 return <>
  <p className="cephalopod-deck">Octopuses, squids, cuttlefish, and nautiluses: compare the structures behind their different ways of living.</p>
  <LessonReading lessonId="cephalopods"/>
  <section className="cephalopod-atlas" aria-labelledby={`${id}-title`}>
   <header><p className="eyebrow">Comparative plate · 01–04</p><h2 id={`${id}-title`}>Four forms. A shared body plan.</h2><p>Study the illustrations, then match each number with the name and description below. Select an image to inspect the full-size plate.</p></header>
   <div className="cephalopod-specimen-grid">{cephalopodSpecimens.map((specimen,index)=><figure key={specimen.id}>
    <a href={specimen.image} target="_blank" rel="noreferrer" aria-label={`Open full-size illustration ${index+1}: ${specimen.name}`}><img src={specimen.image} alt={specimen.alt} width="1536" height="1024" loading="lazy"/></a>
    <figcaption><a href={`#${id}-${specimen.id}`} aria-label={`Read description ${index+1}: ${specimen.name}`}>{index+1}.</a></figcaption>
   </figure>)}</div>
   <p className="cephalopod-plate-note">Educational illustrations, not drawn to the same scale. Appendages may overlap. These examples span different habitats, including deeper reef slopes.</p>
   <ol className="cephalopod-specimen-key" aria-label="Names and descriptions of the numbered specimens">{cephalopodSpecimens.map(specimen=><li id={`${id}-${specimen.id}`} key={specimen.id}><h3>{specimen.name}</h3><p className="cephalopod-scientific"><i>{specimen.scientific}</i></p><p>{specimen.description}</p><a href={cephalopodSources[specimen.source as keyof typeof cephalopodSources].url} target="_blank" rel="noreferrer">Species and anatomy reference ↗</a></li>)}</ol>
  </section>
  <LessonQuiz lessonId="cephalopods" title="Cephalopods quiz"/>
 </>;
}
