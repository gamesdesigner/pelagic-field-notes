import {test} from 'node:test';
import assert from 'node:assert/strict';
import {introductoryArticles,teachingGuides} from '../shared/lesson-articles.mjs';
import {schoolingIntro,schoolingDive} from '../shared/schooling-articles.mjs';
import {lessonTitles,quizBank} from '../shared/learning-content.mjs';
import polarArticles from '../shared/polar-articles.json' with {type:'json'};
import {polarUnits,polarSources} from '../shared/polar-content.mjs';
import {courseOverview} from '../shared/course-introduction.mjs';
import {completionLessons} from '../shared/completion/content.mjs';
import {completionUnits} from '../shared/completion/units.mjs';
import {completionSources} from '../shared/completion/sources.mjs';
import {access,readFile} from 'node:fs/promises';

const words=article=>article.sections.flatMap(section=>section.paragraphs).join(' ').split(/\s+/).length;
test('new Midnight Zone chapter has four complete units while later chapter IDs and destinations stay stable',async()=>{
 const {midnightLessons}=await import('../shared/midnight/content.mjs');
 const {midnightSources}=await import('../shared/midnight/sources.mjs');
 const {midnightUnits}=await import('../shared/midnight/units.mjs');
 const {chapters,chapterForLesson,cephalopodsChapterTitle,sharksChapterTitle}=await import('../shared/chapter-structure.mjs');
 const {findLibraryLesson,libraryGroups}=await import('../shared/library-content.mjs');
 assert.equal(chapters.length,9);assert.equal(libraryGroups.flatMap(c=>c.lessons).length,49);
 assert.equal(chapters[4].title,'Chapter 5- Midnight Zone');
 assert.deepEqual(chapters[4].lessonIds,['midnightLife','giantIsopod','blackDragonfish','pelicanEel']);
 assert.equal(cephalopodsChapterTitle,'Chapter 6- Cephalopods');assert.equal(sharksChapterTitle,'Chapter 8- Sharks');
 assert.equal(chapterForLesson('cnidaria').number,7);assert.equal(chapterForLesson('midnight').id,'cnidaria');
 assert.equal(findLibraryLesson('midnight').subjectId,'midnight');assert.equal(findLibraryLesson('twilight').unit,1);
 for(const [index,unit] of midnightUnits.entries()){
  const lesson=midnightLessons[unit.id];assert.ok(lesson);
  assert.equal(findLibraryLesson(unit.id).unit,13+index);assert.equal(findLibraryLesson(unit.id).subjectId,'extensions');
  assert.ok(words(lesson.intro)>=500,unit.id);assert.ok(words(lesson.dive)>=2000,unit.id);assert.ok(words(lesson.dive)>3*words(lesson.intro),unit.id);
  assert.deepEqual(teachingGuides[unit.id],lesson.guide);assert.equal(introductoryArticles[unit.id].abstract,lesson.guide.abstract);
  assert.equal(quizBank[unit.id].length,7);assert.ok(quizBank[unit.id].every(q=>q.kind==='written'&&!q.options));
  assert.equal(lesson.diagram.image,unit.image);assert.equal(lesson.diagram.key.length,index===3?5:6);
  assert.ok(lesson.diagram.alt.length>80&&lesson.diagram.note.length>100);await access(new URL('../public'+unit.image,import.meta.url));
  for(const [name,description,source] of lesson.diagram.key){assert.ok(name&&description.length>30);assert.ok(midnightSources[source],source);}
  for(const source of lesson.guide.sources)assert.ok(midnightSources[source],source);
  for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(midnightSources[source],source);
 }
 const text=id=>midnightLessons[id].dive.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(text('midnightLife'),/concentration.*flux/is);assert.match(text('giantIsopod'),/seven pairs/i);
 assert.match(text('blackDragonfish'),/Idiacanthus atlanticus/);assert.match(text('blackDragonfish'),/beneath the chin/);
 assert.match(text('blackDragonfish'),/larvae|larval/i);assert.match(text('pelicanEel'),/capacity.*diet/is);
});
test('thirteen earlier additions retain distinct readings, diagrams, and stable destinations',async()=>{
 assert.equal(completionUnits.length,13);assert.equal(Object.keys(completionLessons).length,13);
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 assert.equal(Object.keys(lessonTitles).length,48);assert.equal(Object.keys(quizBank).length,45);
 assert.ok(libraryGroups.filter(chapter=>!['midnightZone','cnidaria','rays'].includes(chapter.id)).every(chapter=>chapter.lessons.length===6));
 const images=new Set(),headings=new Set();
 for(const [index,unit] of completionUnits.entries()){
  const lesson=completionLessons[unit.id];assert.ok(lesson,unit.id);
  assert.equal(findLibraryLesson(unit.id).subjectId,'extensions');assert.equal(findLibraryLesson(unit.id).unit,index);
  assert.ok(words(lesson.intro)>=500,`${unit.id} Level 1`);assert.ok(words(lesson.dive)>=2000,`${unit.id} Level 2`);
  assert.ok(words(lesson.dive)>3*words(lesson.intro),`${unit.id} needs substantially deeper Level 2`);
  assert.deepEqual(introductoryArticles[unit.id].sections,lesson.intro.sections.map(({heading,paragraphs})=>({heading,paragraphs})));assert.deepEqual(teachingGuides[unit.id],lesson.guide);
  assert.equal(quizBank[unit.id].length,7);assert.ok(quizBank[unit.id].every(q=>q.kind==='written'&&!q.options));
  assert.equal(unit.image,lesson.diagram.image);images.add(unit.image);headings.add(lesson.intro.sections[0].heading);
  assert.equal(lesson.diagram.key.length,index>=9||unit.id==='humboldt'||unit.id==='nautilus'?6:5);
  assert.ok(lesson.diagram.alt.length>80&&lesson.diagram.note.length>100);
  await access(new URL('../public'+unit.image,import.meta.url));
  for(const [name,description,source] of lesson.diagram.key){assert.ok(name&&description.length>20);assert.ok(completionSources[source],`${unit.id}: ${source}`);}
  for(const source of lesson.guide.sources)assert.ok(completionSources[source],source);
  for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(completionSources[source],source);
 }
 assert.equal(images.size,13);assert.equal(headings.size,13);
 const text=id=>completionLessons[id].dive.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(text('barreleye'),/hypothes/i);assert.match(text('nautilus'),/siphuncle/);
 assert.match(text('hydroids'),/planula/);assert.match(text('mako'),/regional endothermy/i);
 const component=await readFile(new URL('../app/AdditionalUnits.tsx',import.meta.url),'utf8');
 assert.match(component,/lessonChapterLabel\(item.id\)/);assert.match(component,/onOpen\(next\)/);assert.match(component,/onBack/);
});
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
 assert.deepEqual(polarUnits.slice(0,3).map(u=>u.id),['penguin','orca','lionsmane']);
 for(const unit of polarUnits.slice(0,3)){
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
 assert.equal(chapter.title,'Chapter 6- Cephalopods');
 const cephIndex=chapter.lessons.findIndex(unit=>unit.id==='cephalopods');
 assert.equal(chapter.lessons[cephIndex+1].id,'cuttlefish');
 assert.equal(chapter.lessons.length,6);
 assert.equal(chapter.lessons[cephIndex].topic,6);
 assert.deepEqual(chapter.lessons.map(unit=>unit.id),['cephalopods','cuttlefish','octopus','humboldt','nautilus','twilight']);
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
 assert.deepEqual(libraryGroups.map(g=>g.id),['currents','sunlight','polar','depths','midnightZone','cephalopods','cnidaria','sharks','rays']);
 assert.equal(libraryGroups[2].title,polarChapterTitle);
 assert.equal(polarChapterTitle,'Chapter 3- The Arctic');
 assert.deepEqual(libraryGroups[1].lessons.map(l=>l.id),chapters[1].lessonIds);
 assert.equal(chapterUnitReference('cnidaria'),'Chapter 7, Unit 1');
 assert.ok(introductoryArticles.lionsmane.sections[0].paragraphs.includes(lionsManeFoundationOpening));
 assert.match(lionsManeAdvancedOpening,/Chapter 7, Unit 1/);
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


test('Sharks opens Chapter 8 with four comparative plates before the preserved great white unit',async()=>{
 const {sharkOverviewIntro,sharkOverviewDive,sharkOverviewGuide,sharkOverviewSpecimens,sharkOverviewSources}=await import('../shared/sharks-content.mjs');
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 const {lessonChapterLabel,greatWhiteFoundationOpening,greatWhiteAdvancedOpening}=await import('../shared/chapter-structure.mjs');
 assert.deepEqual(libraryGroups[7].lessons.map(l=>l.id),['sharks','shark','whaleShark','hammerhead','leopardShark','mako']);
 assert.equal(libraryGroups[7].title,'Chapter 8- Sharks');
 assert.equal(libraryGroups[1].lessons.some(l=>l.id==='shark'),false);
 assert.equal(findLibraryLesson('shark').subjectId,'sunlight');assert.equal(findLibraryLesson('shark').topic,2);
 assert.equal(findLibraryLesson('sharks').subjectId,'sharks');
 assert.equal(lessonChapterLabel('shark'),'Chapter 8- Sharks · Unit 2');
 assert.ok(words(sharkOverviewIntro)>=500);assert.ok(words(sharkOverviewDive)>=2000);assert.ok(words(sharkOverviewDive)>3*words(sharkOverviewIntro));
 assert.deepEqual(teachingGuides.sharks,sharkOverviewGuide);
 assert.equal(sharkOverviewSpecimens.length,4);assert.equal(new Set(sharkOverviewSpecimens.map(s=>s.image)).size,4);
 for(const item of sharkOverviewSpecimens){assert.ok(item.alt.length>80&&item.description.length>100&&item.scientific);assert.ok(sharkOverviewSources[item.source]);await access(new URL('../public'+item.image,import.meta.url));}
 for(const section of sharkOverviewDive.sections)for(const key of section.sources)assert.ok(sharkOverviewSources[key]);
 for(const key of sharkOverviewGuide.sources)assert.ok(sharkOverviewSources[key]);
 assert.ok(introductoryArticles.shark.sections[0].paragraphs.includes(greatWhiteFoundationOpening));
 assert.match(greatWhiteAdvancedOpening,/Chapter 8, Unit 1/);
 const deep=await readFile(new URL('../app/deepDives.ts',import.meta.url),'utf8');
 assert.match(deep,/deepDives\.shark\.sections\[0\]\.paragraphs\.unshift\(greatWhiteAdvancedOpening\)/);
 const component=await readFile(new URL('../app/SharksLesson.tsx',import.meta.url),'utf8');
 assert.ok(component.indexOf('<LessonReading')<component.indexOf('<ScientificPlate'));assert.ok(component.indexOf('<ScientificPlate')<component.indexOf('<LessonQuiz'));
});


test('kelp and four Arctic units have substantial levels, sourced numbered diagrams, and seven written questions',async()=>{
 const {ecologyLessons,ecologySources}=await import('../shared/ecology-content.mjs');
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 const {lessonChapterLabel}=await import('../shared/chapter-structure.mjs');
 assert.equal(libraryGroups[1].lessons.length,6);assert.equal(libraryGroups[2].lessons.length,6);
 assert.deepEqual(libraryGroups[2].lessons.map(l=>l.id),['seaIce','orca','narwhal','beluga','walrus','penguin']);
 assert.equal(findLibraryLesson('kelp').topic,10);
 assert.equal(lessonChapterLabel('kelp'),'Chapter 2- The Sunlight Zone · Unit 6');
 assert.equal(lessonChapterLabel('seaIce'),'Chapter 3- The Arctic · Unit 1');
 for(const [id,index] of [['penguin',0],['orca',1],['lionsmane',2],['seaIce',3],['narwhal',4],['beluga',5],['walrus',6]])assert.equal(findLibraryLesson(id).unit,index);
 for(const id of ['kelp','seaIce','narwhal','beluga','walrus']){const lesson=ecologyLessons[id];
  assert.ok(words(lesson.intro)>=500,id);assert.ok(words(lesson.dive)>=2000,id);assert.ok(words(lesson.dive)>3*words(lesson.intro),id);
  assert.equal(introductoryArticles[id].abstract,lesson.guide.abstract);assert.deepEqual(teachingGuides[id],lesson.guide);
  assert.ok(lesson.diagram.alt.length>80&&lesson.diagram.note.length>100);
  assert.equal(lesson.diagram.key.length,{kelp:7,seaIce:6,narwhal:5,beluga:6,walrus:5}[id]);
  await access(new URL('../public'+lesson.diagram.image,import.meta.url));
  for(const [name,description,source] of lesson.diagram.key){assert.ok(name&&description.length>45);assert.ok(ecologySources[source]);}
  for(const source of lesson.guide.sources)assert.ok(ecologySources[source]);
  for(const section of lesson.dive.sections)for(const source of section.sources)assert.ok(ecologySources[source],source);
  assert.equal(quizBank[id].length,7);assert.ok(quizBank[id].every(q=>q.kind==='written'&&!q.options));
 }
 const component=await readFile(new URL('../app/EcologyLesson.tsx',import.meta.url),'utf8');
 assert.ok(component.indexOf('<LessonReading')<component.indexOf('<EcologyDiagram'));
 assert.ok(component.indexOf('<EcologyDiagram')<component.indexOf('<LessonQuiz'));
 const polar=await readFile(new URL('../app/PolarUnits.tsx',import.meta.url),'utf8');
 assert.match(polar,/setUnit\(next.index\)/);assert.match(polar,/chapterIndex>=0/);
});

test('phantom jelly and Chapter 9 rays provide complete readings, references, diagrams, and distinct destinations',async()=>{
 const {rayLessons}=await import('../shared/rays/content.mjs');
 const {rayUnits}=await import('../shared/rays/units.mjs');
 const {ecologySources}=await import('../shared/ecology-sources.mjs');
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 const {chapterUnitReference}=await import('../shared/chapter-structure.mjs');
 assert.equal(libraryGroups.length,9);assert.equal(libraryGroups.at(-1).title,'Chapter 9- Rays');
 assert.deepEqual(libraryGroups.at(-1).lessons.map(x=>x.id),['rays','mantaRay']);
 assert.equal(chapterUnitReference('giantPhantom'),'Chapter 7, Unit 7');
 for(const [i,unit] of rayUnits.entries()){
  const lesson=rayLessons[unit.id];assert.equal(findLibraryLesson(unit.id).unit,17+i);
  assert.equal(findLibraryLesson(unit.id).subjectId,'extensions');
  assert.ok(words(lesson.intro)>=500,unit.id);assert.ok(words(lesson.dive)>=2000,unit.id);assert.ok(words(lesson.dive)>3*words(lesson.intro),unit.id);
  assert.equal(quizBank[unit.id].length,7);assert.ok(quizBank[unit.id].every(q=>q.kind==='written'&&!q.options));
  assert.deepEqual(teachingGuides[unit.id],lesson.guide);assert.equal(lesson.diagram.image,unit.image);
  assert.equal(lesson.diagram.key.length,i===2?5:4);await access(new URL('../public'+unit.image,import.meta.url));
  for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(ecologySources[source],source);
  for(const [name,description,source] of lesson.diagram.key){assert.ok(name&&description.length>35);assert.ok(ecologySources[source],source);}
 }
 const text=id=>rayLessons[id].dive.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(text('giantPhantom'),/four.*oral arms/is);assert.match(text('giantPhantom'),/twelve-meter bus/);
 assert.match(text('rays'),/venom.*electrical/is);assert.match(text('rays'),/2025/);
 assert.match(text('mantaRay'),/ricochet separation/);assert.match(text('mantaRay'),/Endangered.*threatened/is);
 assert.match(text('mantaRay'),/reef-manta studies.*oceanic/is);
 const reading=await readFile(new URL('../app/EcologyLesson.tsx',import.meta.url),'utf8');
 assert.ok(reading.indexOf('{children}')>reading.indexOf('<EcologyDiagram'));assert.ok(reading.indexOf('{children}')<reading.indexOf('<LessonQuiz'));
});
