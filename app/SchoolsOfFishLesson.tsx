import LessonReading from './LessonReading';
import LessonQuiz from './LessonQuiz';

export function FishSchoolArt(){
 return <img className="fish-school-art" src="/assets/schooling/fish-school-v2.webp" width="1536" height="1024" alt="Detailed generated illustration of aligned silver fish with forked tails and darker backs, swimming through sunlit teal water." decoding="async"/>;
}
export default function SchoolsOfFishLesson(){
 return <div className="schooling-unit"><figure className="schooling-hero"><FishSchoolArt/><figcaption><span>Sunlight-zone behavior</span><h2>Many neighbors, one moving pattern.</h2><p>Similar headings are a visible sign of schooling. This generated illustration shows a simplified school; spacing, scale, and lighting are illustrative, not measured.</p></figcaption></figure><LessonReading lessonId="schooling"/><LessonQuiz lessonId="schooling" title="Fish defences quiz" className="upwelling-quiz"/></div>;
}
