import ScientificPlate from './ScientificPlate';
import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import {cephalopodSpecimens,cephalopodSources} from '../shared/cephalopod-content.mjs';

export default function CephalopodsLesson(){
 return <>
  <p className="cephalopod-deck">Octopuses, squids, cuttlefish, and nautiluses: compare the structures behind their different ways of living.</p>
  <LessonReading lessonId="cephalopods"/>
  <ScientificPlate title="Four forms. A shared body plan." specimens={cephalopodSpecimens} sources={cephalopodSources} note="Educational illustrations, not drawn to the same scale. Appendages may overlap. These examples span different habitats, including deeper reef slopes."/>
  <LessonQuiz lessonId="cephalopods" title="Cephalopods quiz"/>
 </>;
}
