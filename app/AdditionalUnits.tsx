"use client";
import EcologyLesson,{type EcologyLessonId} from './EcologyLesson';
import {completionUnits} from '../shared/completion/units.mjs';
import {chapterForLesson,lessonChapterLabel} from '../shared/chapter-structure.mjs';
import {libraryGroups} from '../shared/library-content.mjs';
import type {LibrarySelection} from './CourseLibrary';

export default function AdditionalUnits({initialUnit,onBack,onOpen}:{initialUnit:number|null;onBack:()=>void;onOpen:(selection:LibrarySelection)=>void}){
 const item=completionUnits[initialUnit??0];
 if(!item)return <section className="polar-lesson"><button type="button" className="back-button" onClick={onBack}>← Main page</button><h1>Choose a lesson from the main page</h1></section>;
 const chapter=chapterForLesson(item.id)!;
 const nextId=chapter.lessonIds[chapter.lessonIds.indexOf(item.id)+1];
 const next=nextId?libraryGroups.flatMap(group=>group.lessons).find(unit=>unit.id===nextId):undefined;
 return <section className="polar-lesson" aria-labelledby="additional-unit-title">
  <header className="polar-lesson-header"><button type="button" className="back-button" onClick={onBack}>← Main page</button><p className="eyebrow">{lessonChapterLabel(item.id)} · {item.tag}</p><h1 id="additional-unit-title">{item.title}</h1><p className="scientific">{item.scientific}</p><p className="polar-deck">{item.summary}</p></header>
  <EcologyLesson lessonId={item.id as EcologyLessonId}/>
  <nav className="polar-unit-navigation" aria-label={`More ${chapter.name} lessons`}><button type="button" onClick={onBack}>Main page</button>{next&&<button type="button" onClick={()=>onOpen(next)}>Next: {next.title} →</button>}</nav>
 </section>;
}
