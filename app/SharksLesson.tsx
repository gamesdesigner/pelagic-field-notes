import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import ScientificPlate from './ScientificPlate';
import {sharkOverviewSpecimens,sharkOverviewSources} from '../shared/sharks-content.mjs';

export default function SharksLesson(){
 return <>
  <p className="cephalopod-deck">One shared body plan, many ways to live: compare shark anatomy, feeding, senses, and habitats before meeting the great white.</p>
  <LessonReading lessonId="sharks"/>
  <ScientificPlate title="Four sharks to compare." specimens={sharkOverviewSpecimens} sources={sharkOverviewSources} note="Generated educational illustrations, reviewed against the linked species references. Animals are not shown at a shared scale or as one natural community. Individual colors and proportions vary; use several features together when identifying a species."/>
  <LessonQuiz lessonId="sharks" title="Sharks written-answer quiz"/>
 </>;
}
