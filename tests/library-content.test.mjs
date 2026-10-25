import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {libraryGroups,findLibraryLesson,lessonQuery} from '../shared/library-content.mjs';
import {lessonTitles} from '../shared/learning-content.mjs';

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
