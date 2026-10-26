import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import ScientificPlate from './ScientificPlate';
import {coralSpecimens,coralSources} from '../shared/coral-content.mjs';

export default function CoralsLesson(){
 return <>
  <p className="cephalopod-deck">From a single polyp to a reef: explore coral forms, feeding, the animals they shelter, and a changing climate.</p>
  <LessonReading lessonId="corals"/>
  <ScientificPlate title="Six coral forms to compare." specimens={coralSpecimens} sources={coralSources} note="Generated educational illustrations, checked against the linked anatomy and species references. Colonies are not shown at a shared scale. They come from different regions and do not represent one natural reef. Growth form and color vary; the leather coral is a genus-level example."/>
  <LessonQuiz lessonId="corals" title="Corals written-answer quiz"/>
 </>;
}
