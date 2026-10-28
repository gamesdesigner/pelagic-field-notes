import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {libraryGroups,findLibraryLesson,lessonQuery} from '../shared/library-content.mjs';
import {lessonTitles} from '../shared/learning-content.mjs';
import {scrollPageToStart} from '../shared/page-scroll.mjs';

test('navigation resets the active page scrollport without scrolling the document behind it',()=>{
 const calls=[];
 const page={scrollTo:options=>calls.push(['page',options])};
 const viewport={scrollTo:options=>calls.push(['window',options])};
 scrollPageToStart(page,viewport);
 assert.deepEqual(calls,[['page',{top:0,left:0,behavior:'instant'}]]);
 calls.length=0;
 scrollPageToStart(null,viewport);
 assert.deepEqual(calls,[['window',{top:0,left:0,behavior:'instant'}]]);
});

test('library reaches every registered lesson exactly once and serves existing images',async()=>{
 const lessons=libraryGroups.flatMap(group=>group.lessons);
 assert.equal(lessons.length,new Set(lessons.map(lesson=>lesson.id)).size);
 assert.deepEqual(lessons.filter(lesson=>lesson.kind!=='introduction').map(lesson=>lesson.id).sort(),Object.keys(lessonTitles).sort());
 for(const lesson of lessons){
  assert.ok(lesson.summary&&lesson.title&&lesson.tag);
  assert.deepEqual(findLibraryLesson(lesson.id).subjectId,lesson.subjectId);
  await access(new URL(`../public${lesson.image}`,import.meta.url));
 }
 const targets=lessons.map(lesson=>`${lesson.subjectId}:${lesson.topic??''}:${lesson.unit??''}`);
 assert.equal(targets.length,new Set(targets).size,'two cards must not open the same destination');
});

test('sign-in preserves a known lesson and discards unrelated or invalid destinations',()=>{
 for(const lesson of libraryGroups.flatMap(group=>group.lessons))assert.equal(lessonQuery(`?lesson=${lesson.id}&next=https://example.com`),`?lesson=${lesson.id}`);
 assert.equal(lessonQuery('?lesson=introduction'),'?lesson=introduction');
 for(const search of ['', '?lesson=unknown','?next=https://example.com','?lesson=%2Fabout','?lesson=__proto__'])assert.equal(lessonQuery(search),'');
 for(const id of [undefined,null,{},'unknown'])assert.equal(findLibraryLesson(id),undefined);
});

test('ocean currents introduction is the first standalone chapter unit and survives sign-in links',()=>{
 const currents=libraryGroups.find(group=>group.id==='currents');
 const intro=currents.lessons[0];
 assert.equal(intro.id,'currentsIntro');
 assert.equal(intro.kind,'introduction');
 assert.equal(currents.lessons.length,6);
 assert.deepEqual(findLibraryLesson('currentsIntro'),intro);
 assert.equal(lessonQuery('?lesson=currentsIntro'),'?lesson=currentsIntro');
 assert.equal(intro.topic,-1);
 // Existing topic indices and saved lesson identities must stay stable.
 assert.deepEqual(currents.lessons.slice(1).map(lesson=>[lesson.id,lesson.topic]),[
  ['upwelling',0],['conveyor',1],['coriolis',2],['ekman',3],['enso',4],
 ]);
});

test('ten hyphenated chapters classify each lesson once without changing saved IDs or renderer destinations',async()=>{
 const {chapters,chapterForLesson,chapterUnitReference,lessonChapterLabel}=await import('../shared/chapter-structure.mjs');
 const expected=[
  ['Chapter 1- Ocean currents',['currentsIntro','upwelling','conveyor','coriolis','ekman','enso']],
  ['Chapter 2- The Sunlight Zone',['sunlight','corals','turtle','plankton','schooling','kelp']],
  ['Chapter 3- The Arctic',['seaIce','orca','narwhal','beluga','walrus','penguin']],
  ['Chapter 4- Twilight Zone',['twilightGeneral','lanternfish','barreleye','hatchetfish','bioluminescence','verticalMigration']],
  ['Chapter 5- Midnight Zone',['midnightLife','giantIsopod','blackDragonfish','pelicanEel','oarfish','giantTubeworm','yetiCrab','hydrothermalVents','anglerfish','coelacanth']],
  ['Chapter 6- Cephalopods',['cephalopods','cuttlefish','octopus','humboldt','nautilus','twilight']],
  ['Chapter 7- Cnidaria',['cnidaria','anemones','lionsmane','midnight','general','hydroids','giantPhantom']],
  ['Chapter 8- Sharks',['sharks','shark','whaleShark','hammerhead','leopardShark','mako']],
  ['Chapter 9- Rays',['rays','mantaRay']],
  ['Chapter 10- Whales',['whales','blueWhale','spermWhale']],
 ];
 assert.deepEqual(libraryGroups.map(group=>[group.title,group.lessons.map(lesson=>lesson.id)]),expected);
 assert.ok(libraryGroups.filter(group=>!['midnightZone','cnidaria','rays','whales'].includes(group.id)).every(group=>group.lessons.length===6));
 assert.equal(libraryGroups.find(group=>group.id==='midnightZone').lessons.length,10);
 assert.equal(libraryGroups.flatMap(group=>group.lessons).length,58);
 for(const chapter of chapters)for(const [index,id] of chapter.lessonIds.entries()){
  assert.equal(chapterForLesson(id).id,chapter.id);
  assert.equal(chapterUnitReference(id),`Chapter ${chapter.number}, Unit ${index+1}`);
  assert.equal(lessonChapterLabel(id),`${chapter.title} · Unit ${index+1}`);
 }
 assert.equal(chapterForLesson('unknown'),undefined);assert.equal(lessonChapterLabel(undefined),'');
 assert.throws(()=>chapterUnitReference('unknown'));
 const stable={sunlight:['sunlight',0],turtle:['sunlight',1],shark:['sunlight',2],cuttlefish:['sunlight',3],plankton:['sunlight',4],schooling:['sunlight',5],cephalopods:['sunlight',6],cnidaria:['sunlight',7],anemones:['sunlight',8]};
 for(const [id,destination] of Object.entries(stable)){const lesson=findLibraryLesson(id);assert.deepEqual([lesson.subjectId,lesson.topic],destination);}
 for(const [id,subjectId,unit] of [['twilightGeneral','twilight',0],['twilight','twilight',1],['penguin','polar',0],['orca','polar',1],['lionsmane','polar',2]]){
  const lesson=findLibraryLesson(id);assert.equal(lesson.subjectId,subjectId);assert.equal(lesson.unit,unit);
 }
 assert.equal(findLibraryLesson('schooling').title,'Fish defences');
 assert.equal(lessonTitles.schooling,'Fish defences');
});
