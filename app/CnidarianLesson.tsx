import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';
import ScientificPlate from './ScientificPlate';
import {cnidarianSpecimens,cnidarianSources} from '../shared/cnidarian-content.mjs';

export default function CnidarianLesson({lessonId}:{lessonId:'cnidaria'|'anemones'}){
 const isGroup=lessonId==='cnidaria';
 return <>
  <p className="cephalopod-deck">{isGroup?'Corals, jellyfish, hydroids, and anemones: different forms connected by shared cellular machinery.':'Meet the animals behind the flowerlike shapes. Explore attachment, tentacle feeding, and partnerships.'}</p>
  <LessonReading key={lessonId} lessonId={lessonId}/>
  <ScientificPlate title={isGroup?'Cnidaria: four ways of living.':'Anemones: four species to compare.'} specimens={cnidarianSpecimens[lessonId]} sources={cnidarianSources} note="Generated educational illustrations, not drawn to the same scale. Appearance varies with posture, individual, and conditions. The descriptions distinguish individual animals from colonies."/>
  <LessonQuiz key={`quiz-${lessonId}`} lessonId={lessonId} title={`${isGroup?'Cnidaria':'Anemones'} written-answer quiz`}/>
 </>;
}
