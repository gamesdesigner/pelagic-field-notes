import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import PlanktonCells from './PlanktonCells';
import PlanktonPopulation from './PlanktonPopulation';
export default function PlanktonLesson(){
 return <div className="plankton-unit"><p className="plankton-deck">Tiny cells. Planet-sized connections. Explore the microscopic producers that support ocean food webs.</p><LessonReading lessonId="plankton" /><PlanktonCells/><PlanktonPopulation/><LessonQuiz lessonId="plankton" title="Planktons & Diatoms quiz" className="upwelling-quiz"/></div>;
}
