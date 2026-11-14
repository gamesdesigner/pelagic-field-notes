import {useId} from 'react';
import {ambushBigfinLessons} from '../shared/ambush-and-bigfin/content.mjs';
import './creature-study-media.css';

export default function CreatureStudyMedia({lessonId}:{lessonId:'bobbitWorm'|'bigfinSquid'}){
 const id=useId();
 const lesson=ambushBigfinLessons[lessonId];
 const bobbit=lessonId==='bobbitWorm';
 return <section className="creature-study-media" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">{bobbit?'Observe the sequence · 4 seconds':'Look closely · Still illustration'}</p><h2 id={`${id}-title`}>{bobbit?'Wait. Strike. Retreat.':'Big fins. Delicate filaments.'}</h2><p>{bobbit?'Press play to follow the ambush. Pause or scrub the video to find the instant the jaws contact the fish.':'Take your time with this still image. Trace the broad fins, compact mantle, dark eyes, and long, elbow-like appendages.'}</p></header>
  <figure>
   {bobbit?<video controls loop playsInline preload="none" poster={lesson.diagram.image} aria-label="Four-second generated Bobbit worm ambush reconstruction" aria-describedby={`${id}-caption`}>
    <source src="/assets/ambush-and-bigfin/bobbit-worm-strike-v1.mp4" type="video/mp4"/>
    <track default kind="captions" src="/assets/ambush-and-bigfin/bobbit-worm-strike-v1.vtt" srcLang="en" label="English scene descriptions"/>
    Your browser cannot play this video. <a href="/assets/ambush-and-bigfin/bobbit-worm-strike-v1.mp4">Open the four-second animation</a>.
   </video>:<a href={lesson.diagram.image} target="_blank" rel="noreferrer" aria-label="Open full-size bigfin squid still illustration"><img src={lesson.diagram.image} alt={lesson.diagram.alt} width="1672" height="941" loading="lazy"/></a>}
   <figcaption id={`${id}-caption`}>{bobbit?'Generated educational animation · Silent · 4 seconds. Timing illustrates the sequence and is not a measured strike speed.':'Generated educational still illustration · Not a photograph or scale drawing. Lighting reveals structures that are difficult to see in natural darkness.'}</figcaption>
  </figure>
  <div className="creature-study-observations"><h3>{bobbit?'Follow the action':'Features to find'}</h3>
   {bobbit?<ol><li><strong>Wait:</strong> most of the segmented body stays beneath the sand.</li><li><strong>Strike and catch:</strong> the head rises and the jaws grasp the passing fish.</li><li><strong>Retreat:</strong> the worm and captured prey disappear into the burrow.</li></ol>:<ul><li><strong>Paired fins:</strong> two broad surfaces beside the mantle.</li><li><strong>Head and mantle:</strong> a compact central body with dark eyes.</li><li><strong>Arms and tentacles:</strong> eight arms and two tentacles with long, thin filaments; some overlap in this view.</li><li><strong>Elbow-like bends:</strong> a familiar posture, with no human-style bony joints.</li></ul>}
   <p>{bobbit?'The waiting and hidden portions are included. Use the controls to replay without rushing to the next question.':'Feeding with the filaments is a scientific hypothesis; the image does not show or establish a completed meal.'}</p>
  </div>
 </section>;
}
