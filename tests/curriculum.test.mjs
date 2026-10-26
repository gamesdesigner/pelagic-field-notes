import {test} from 'node:test';
import assert from 'node:assert/strict';
import {introductoryArticles,teachingGuides} from '../shared/lesson-articles.mjs';
import {schoolingIntro,schoolingDive} from '../shared/schooling-articles.mjs';
import {lessonTitles,quizBank} from '../shared/learning-content.mjs';
import polarArticles from '../shared/polar-articles.json' with {type:'json'};
import {polarUnits,polarSources} from '../shared/polar-content.mjs';
import {courseOverview} from '../shared/course-introduction.mjs';
import {access,readFile} from 'node:fs/promises';

const words=article=>article.sections.flatMap(section=>section.paragraphs).join(' ').split(/\s+/).length;
test('every registered lesson has a complete foundation article and teaching guide',()=>{
 const ids=Object.keys(lessonTitles).sort();
 assert.deepEqual(Object.keys(introductoryArticles).sort(),ids);
 assert.deepEqual(Object.keys(teachingGuides).sort(),ids);
 for(const id of ids){
  const guide=teachingGuides[id],article=introductoryArticles[id];
  assert.ok(words(article)>=300,`${id} needs a substantive foundation article`);
  assert.ok(article.sections.length>=4,`${id} needs a developed explanation`);
  assert.equal(guide.goals.length,3);assert.equal(guide.advancedGoals.length,3);
  for(const value of [guide.title,guide.question,guide.abstract,guide.advancedAbstract,guide.recap,guide.application,guide.check.question,guide.check.explanation])assert.ok(value.trim().length>20,`${id}: missing teaching content`);
  assert.ok(guide.terms.length>=3);assert.ok(guide.sources.length>0);
  for(const section of article.sections){assert.ok(section.heading);assert.ok(section.paragraphs.every(p=>p.length>30));}
 }
});
test('schooling preserves the supplied survival themes and adds a substantially deeper second level',()=>{
 const text=schoolingIntro.sections.flatMap(s=>s.paragraphs).join(' ');
 for(const concept of ['bait ball','countershading','C-start','lateral line','parasites'])assert.ok(text.includes(concept),concept);
 assert.ok(words(schoolingIntro)>=800);
 assert.ok(words(schoolingDive)>2000);
 assert.ok(words(schoolingDive)>2*words(schoolingIntro));
 assert.ok(schoolingDive.sections.some(s=>s.sources?.includes('schoolLeadership')));
 assert.ok(schoolingDive.sections.some(s=>s.sources?.includes('schoolEnergy')));
 const questions=quizBank.schooling;
 assert.equal(questions.length,7);
 for(const q of questions){assert.equal(q.kind,"written");assert.equal(q.options,undefined);assert.ok(q.answer);assert.ok(q.explanation.length>20);}
});
test('existing lesson identifiers and long twilight foundation readings remain intact',()=>{
 for(const id of ['upwelling','conveyor','coriolis','ekman','enso','sunlight','turtle','shark','cuttlefish','plankton','twilightGeneral','twilight','midnight','general'])assert.ok(Object.hasOwn(lessonTitles,id));
 for(const id of ['twilightGeneral','twilight'])assert.ok(words(introductoryArticles[id])>=500);
});
test('the introduction is an approximately 500-word course summary',()=>{
 const text=courseOverview.map(s=>s.paragraph).join(' ');
 const count=text.split(/\s+/).length;
 assert.ok(count>=450&&count<=600,`overview is ${count} words`);
 for(const idea of ['Chapter 1- Ocean currents','Level 1','Level 2','one variable','quiz','Arctic','Antarctic'])assert.ok(text.includes(idea),idea);
});
test('polar lessons have complete reading levels and keep the Antarctic comparison explicit',async()=>{
 assert.deepEqual(polarUnits.map(u=>u.id),['penguin','orca','lionsmane']);
 for(const unit of polarUnits){
  const id=unit.id;assert.ok(Object.hasOwn(lessonTitles,id));
  assert.ok(words(introductoryArticles[id])>=500);
  assert.ok(words(polarArticles.advanced[id])>=1500);
  assert.ok(words(polarArticles.advanced[id])>2.5*words(introductoryArticles[id]));
  await access(new URL('../public'+unit.image,import.meta.url));
  for(const source of teachingGuides[id].sources)assert.ok(polarSources[source]?.url.startsWith('https://'));
 }
 const penguin=introductoryArticles.penguin.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(penguin,/Penguins do not naturally live in the Arctic/);
 assert.equal(polarUnits[0].region,'Antarctic comparison');
 for(const file of ['quiz-guide.svg','tank-guide.svg']){
  const svg=await readFile(new URL('../public/assets/introduction/'+file,import.meta.url),'utf8');
  assert.match(svg,/<title[^>]*>/);assert.match(svg,/<desc[^>]*>/);
 }
});

test('cephalopods introduces the group before cuttlefish with two substantial levels and numbered plates',async()=>{
 const {cephalopodIntro,cephalopodDive,cephalopodSpecimens,cephalopodSources}=await import('../shared/cephalopod-content.mjs');
 const {libraryGroups}=await import('../shared/library-content.mjs');
 const chapter=libraryGroups.find(group=>group.id==='cephalopods');
 assert.equal(chapter.title,'Chapter 5- Cephalopods');
 const cephIndex=chapter.lessons.findIndex(unit=>unit.id==='cephalopods');
 assert.equal(chapter.lessons[cephIndex+1].id,'cuttlefish');
 assert.equal(chapter.lessons.length,3);
 assert.equal(chapter.lessons[cephIndex].topic,6);
 assert.deepEqual(chapter.lessons.map(unit=>unit.id),['cephalopods','cuttlefish','twilight']);
 assert.ok(words(cephalopodIntro)>=500);
 assert.ok(words(cephalopodDive)>=2000);
 assert.ok(words(cephalopodDive)>3*words(cephalopodIntro));
 assert.ok(introductoryArticles.cuttlefish.sections[0].paragraphs[0].includes('last unit'));
 assert.deepEqual(cephalopodSpecimens.map(item=>item.id),['octopus','squid','cuttlefish','nautilus']);
 for(const item of cephalopodSpecimens){
  await access(new URL(`../public${item.image}`,import.meta.url));
  assert.ok(item.alt.length>50&&item.description.length>100&&item.scientific);
  assert.ok(cephalopodSources[item.source]);
 }
 for(const section of cephalopodDive.sections)for(const source of section.sources)assert.ok(cephalopodSources[source]);
 assert.equal(quizBank.cephalopods.length,7);
});

test('Cnidaria and Anemones have substantial paired readings, sourced plates, and stable destinations',async()=>{
 const {cnidarianIntros,cnidarianDives,cnidarianSpecimens,cnidarianSources}=await import('../shared/cnidarian-content.mjs');
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 const {chapters,chapterUnitReference,polarChapterTitle,lionsManeFoundationOpening,lionsManeAdvancedOpening}=await import('../shared/chapter-structure.mjs');
 assert.deepEqual(libraryGroups.map(g=>g.id),['currents','sunlight','polar','depths','cephalopods','cnidaria']);
 assert.equal(libraryGroups[2].title,polarChapterTitle);
 assert.equal(polarChapterTitle,'Chapter 3- The Arctic');
 assert.deepEqual(libraryGroups[1].lessons.map(l=>l.id),chapters[1].lessonIds);
 assert.equal(chapterUnitReference('cnidaria'),'Chapter 6, Unit 1');
 assert.ok(introductoryArticles.lionsmane.sections[0].paragraphs.includes(lionsManeFoundationOpening));
 assert.match(lionsManeAdvancedOpening,/Chapter 6, Unit 1/);
 assert.match(lionsManeAdvancedOpening,/one of the largest jellyfish/);
 const deepSource=await readFile(new URL('../app/deepDives.ts',import.meta.url),'utf8');
 assert.match(deepSource,/deepDives\.lionsmane\.sections\[0\]\.paragraphs\.unshift\(lionsManeAdvancedOpening\)/);
 for(const [id,topic] of [['cnidaria',7],['anemones',8]]){
  assert.equal(findLibraryLesson(id).topic,topic);
  assert.ok(words(cnidarianIntros[id])>=500);
  assert.ok(words(cnidarianDives[id])>=2000);
  assert.ok(words(cnidarianDives[id])>3*words(cnidarianIntros[id]));
  assert.equal(cnidarianSpecimens[id].length,4);
  for(const item of cnidarianSpecimens[id]){
   assert.ok(item.alt.length>50&&item.description.length>100&&item.scientific);
   assert.ok(cnidarianSources[item.source]);await access(new URL('../public'+item.image,import.meta.url));
  }
  for(const section of cnidarianDives[id].sections)for(const source of section.sources)assert.ok(cnidarianSources[source]);
  assert.equal(quizBank[id].length,7);
 }
 const component=await readFile(new URL('../app/CnidarianLesson.tsx',import.meta.url),'utf8');
 assert.ok(component.indexOf('<ScientificPlate')<component.indexOf('<LessonQuiz'));
});

test('Corals is a complete Chapter 2 unit with two reading levels and six sourced scientific plates',async()=>{
 const {coralIntro,coralDive,coralGuide,coralSpecimens,coralSources}=await import('../shared/coral-content.mjs');
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 const {chapterForLesson,lessonChapterLabel}=await import('../shared/chapter-structure.mjs');
 assert.equal(libraryGroups[2].title,'Chapter 3- The Arctic');
 assert.equal(chapterForLesson('corals').id,'sunlight');assert.equal(lessonChapterLabel('corals'),'Chapter 2- The Sunlight Zone · Unit 2');
 assert.equal(findLibraryLesson('corals').topic,9);
 assert.ok(words(coralIntro)>=500);assert.ok(words(coralDive)>=2000);assert.ok(words(coralDive)>3*words(coralIntro));
 assert.deepEqual(teachingGuides.corals,coralGuide);
 const text=coralIntro.sections.flatMap(s=>s.paragraphs).join(' ');
 for(const idea of ['stony','Sea fans','zooplankton','calcium carbonate','Great Barrier Reef','2,300','fish, crabs','warming','bleaching','not automatically dead','acidification'])assert.ok(text.includes(idea),idea);
 assert.equal(coralSpecimens.length,6);assert.equal(new Set(coralSpecimens.map(s=>s.image)).size,6);
 assert.deepEqual(coralSpecimens.map(s=>s.id),['elkhorn','staghorn','brain','pillar','sea-fan','leather']);
 for(const item of coralSpecimens){assert.ok(item.scientific&&item.alt.length>80&&item.description.length>100);assert.ok(coralSources[item.source]);await access(new URL('../public'+item.image,import.meta.url));}
 for(const section of coralDive.sections)for(const source of section.sources)assert.ok(coralSources[source]);
 for(const source of coralGuide.sources)assert.ok(coralSources[source]);
 assert.equal(quizBank.corals.length,7);
 const component=await readFile(new URL('../app/CoralsLesson.tsx',import.meta.url),'utf8');
 assert.ok(component.indexOf('<LessonReading')<component.indexOf('<ScientificPlate'));
 assert.ok(component.indexOf('<ScientificPlate')<component.indexOf('<LessonQuiz'));
});
