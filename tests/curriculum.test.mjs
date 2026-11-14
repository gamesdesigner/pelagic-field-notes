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
test('Bobbit worm and bigfin squid are distinct complete units with the requested media',async()=>{
 const {ambushBigfinLessons:lessons}=await import('../shared/ambush-and-bigfin/content.mjs');
 const {ambushBigfinUnits:units}=await import('../shared/ambush-and-bigfin/units.mjs');
 const {ambushBigfinSources:sources}=await import('../shared/ambush-and-bigfin/sources.mjs');
 const {findLibraryLesson}=await import('../shared/library-content.mjs');
 const {chapterForLesson}=await import('../shared/chapter-structure.mjs');
 for(const [i,unit] of units.entries()){
  const lesson=lessons[unit.id];
  assert.equal(findLibraryLesson(unit.id).unit,36+i);
  assert.equal(chapterForLesson(unit.id).id,i===0?'sunlight':'cephalopods');
  assert.ok(words(lesson.intro)>=500);assert.ok(words(lesson.dive)>=2000);
  assert.ok(words(lesson.dive)>3*words(lesson.intro));
  assert.deepEqual(teachingGuides[unit.id],lesson.guide);
  assert.deepEqual(introductoryArticles[unit.id].sections,lesson.intro.sections.map(({heading,paragraphs})=>({heading,paragraphs})));
  assert.equal(quizBank[unit.id].length,7);
  for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(sources[source]);
  for(const source of lesson.guide.sources)assert.ok(sources[source]);
  await access(new URL('../public'+unit.image,import.meta.url));
 }
 const media=await readFile(new URL('../app/CreatureStudyMedia.tsx',import.meta.url),'utf8');
 assert.match(media,/bobbit\?<video/);assert.match(media,/preload="none"/);
 assert.doesNotMatch(media,/bigfin-squid[^'"\n]*\.(mp4|gif)|autoPlay/);
 const still=await readFile(new URL('../public'+units[1].image,import.meta.url));
 assert.equal(still.toString('ascii',0,4),'RIFF');assert.doesNotMatch(still.toString('ascii'),/ANIM/);
 const captions=await readFile(new URL('../public/assets/ambush-and-bigfin/bobbit-worm-strike-v1.vtt',import.meta.url),'utf8');
 assert.match(captions,/00:04.000/);
});
test('four additional Rays units and a blue-ringed octopus unit retain full readings, diagrams, and precise risk teaching',async()=>{
 const {rayExtraUnits}=await import('../shared/rays-extra/units.mjs');
 const {rayExtraLessons}=await import('../shared/rays-extra/content.mjs');
 const {ecologySources}=await import('../shared/ecology-sources.mjs');
 const {findLibraryLesson}=await import('../shared/library-content.mjs');
 const {chapterForLesson}=await import('../shared/chapter-structure.mjs');
 assert.equal(rayExtraUnits.length,5);
 for(const [index,unit] of rayExtraUnits.entries()){
  const lesson=rayExtraLessons[unit.id];assert.ok(lesson,unit.id);
  assert.equal(findLibraryLesson(unit.id).unit,29+index);assert.equal(findLibraryLesson(unit.id).subjectId,'extensions');
  assert.equal(chapterForLesson(unit.id).id,index===4?'cephalopods':'rays');
  assert.ok(words(lesson.intro)>=500,unit.id);assert.ok(words(lesson.dive)>=2000,unit.id);assert.ok(words(lesson.dive)>3*words(lesson.intro),unit.id);
  assert.deepEqual(teachingGuides[unit.id],lesson.guide);assert.equal(introductoryArticles[unit.id].abstract,lesson.guide.abstract);
  assert.equal(quizBank[unit.id].length,7);assert.ok(quizBank[unit.id].every(q=>q.kind==='written'&&!q.options));
  assert.equal(lesson.diagram.image,unit.image);assert.equal(lesson.diagram.key.length,5);
  await access(new URL('../public'+unit.image,import.meta.url));
  for(const [name,description,source] of lesson.diagram.key){assert.ok(name&&description.length>35);assert.ok(ecologySources[source],source);}
  for(const source of lesson.guide.sources)assert.ok(ecologySources[source],source);
  for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(ecologySources[source],source);
 }
 const text=id=>rayExtraLessons[id].dive.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(text('shortTailStingray'),/serious|severe/);assert.match(text('shortTailStingray'),/potentially fatal/);
 assert.match(text('shortTailStingray'),/do not establish.*most dangerous/i);
 assert.match(text('clearnoseSkate'),/does not have the venomous stinging barb/);assert.match(text('clearnoseSkate'),/egg case/i);
 assert.match(text('blueRingedOctopus'),/bite can be fatal/);assert.match(text('blueRingedOctopus'),/absence of visible blue rings is not a safety test/i);
 assert.match(text('blueRingedOctopus'),/reflect incoming light rather than making their own light/);
 assert.match(text('bluespottedRibbontail'),/tide changes access/);
});
test('original Midnight Zone additions retain four complete units while later chapter IDs and destinations stay stable',async()=>{
 const {midnightLessons}=await import('../shared/midnight/content.mjs');
 const {midnightSources}=await import('../shared/midnight/sources.mjs');
 const {midnightUnits}=await import('../shared/midnight/units.mjs');
 const {chapters,chapterForLesson,cephalopodsChapterTitle,sharksChapterTitle}=await import('../shared/chapter-structure.mjs');
 const {findLibraryLesson,libraryGroups}=await import('../shared/library-content.mjs');
 assert.equal(chapters.length,10);assert.equal(libraryGroups.flatMap(c=>c.lessons).length,67);
 assert.equal(chapters[4].title,'Chapter 5- Midnight Zone');
 assert.deepEqual(chapters[4].lessonIds.slice(0,4),['midnightLife','giantIsopod','blackDragonfish','pelicanEel']);
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
 assert.equal(Object.keys(lessonTitles).length,66);assert.equal(Object.keys(quizBank).length,63);
 assert.ok(libraryGroups.filter(chapter=>!['sunlight','midnightZone','cnidaria','cephalopods','rays','whales'].includes(chapter.id)).every(chapter=>chapter.lessons.length===6));
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
 assert.equal(chapter.lessons.length,8);
 assert.equal(chapter.lessons[cephIndex].topic,6);
 assert.deepEqual(chapter.lessons.map(unit=>unit.id),['cephalopods','cuttlefish','octopus','humboldt','nautilus','twilight','blueRingedOctopus','bigfinSquid']);
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
 assert.deepEqual(libraryGroups.map(g=>g.id),['currents','sunlight','polar','depths','midnightZone','cephalopods','cnidaria','sharks','rays','whales']);
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
 assert.equal(libraryGroups[1].lessons.length,9);assert.equal(libraryGroups[2].lessons.length,6);
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
 assert.equal(libraryGroups.length,10);assert.equal(libraryGroups.find(x=>x.id==='rays').title,'Chapter 9- Rays');
 assert.deepEqual(libraryGroups.find(x=>x.id==='rays').lessons.map(x=>x.id),['rays','mantaRay','southernStingray','shortTailStingray','clearnoseSkate','bluespottedRibbontail']);
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

test('Whales chapter and six Midnight additions have substantial sourced readings, accurate habitat context, and stable destinations',async()=>{
 const {whaleDeepLessons}=await import('../shared/whales-deep/content.mjs');
 const {whaleDeepUnits}=await import('../shared/whales-deep/units.mjs');
 const {ecologySources}=await import('../shared/ecology-sources.mjs');
 const {chapters,chapterForLesson}=await import('../shared/chapter-structure.mjs');
 const {libraryGroups,findLibraryLesson}=await import('../shared/library-content.mjs');
 assert.equal(chapters.length,10);assert.equal(libraryGroups.flatMap(c=>c.lessons).length,67);
 assert.equal(Object.keys(lessonTitles).length,66);assert.equal(Object.keys(quizBank).length,63);
 assert.equal(chapters.at(-1).title,'Chapter 10- Whales');assert.deepEqual(chapters.at(-1).lessonIds,['whales','blueWhale','spermWhale']);
 assert.deepEqual(chapters[4].lessonIds,['midnightLife','giantIsopod','blackDragonfish','pelicanEel','oarfish','giantTubeworm','yetiCrab','hydrothermalVents','anglerfish','coelacanth']);
 for(const [index,unit] of whaleDeepUnits.entries()){
  const lesson=whaleDeepLessons[unit.id];assert.ok(lesson,unit.id);
  assert.equal(findLibraryLesson(unit.id).unit,20+index);assert.equal(findLibraryLesson(unit.id).subjectId,'extensions');
  assert.equal(chapterForLesson(unit.id).id,index<3?'whales':'midnightZone');
  assert.ok(words(lesson.intro)>=500,unit.id);assert.ok(words(lesson.dive)>=2000,unit.id);assert.ok(words(lesson.dive)>3*words(lesson.intro),unit.id);
  assert.deepEqual(teachingGuides[unit.id],lesson.guide);assert.equal(introductoryArticles[unit.id].abstract,lesson.guide.abstract);
  assert.equal(quizBank[unit.id].length,7);assert.ok(quizBank[unit.id].every(q=>q.kind==='written'&&!q.options));
  assert.equal(unit.image,lesson.diagram.image);await access(new URL('../public'+unit.image,import.meta.url));
  assert.equal(lesson.diagram.key.length,index===0?4:index===6?6:5);
  for(const [name,description,source] of lesson.diagram.key){assert.ok(name&&description.length>35);assert.ok(ecologySources[source],source);}
  for(const source of lesson.guide.sources)assert.ok(ecologySources[source],source);
  for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(ecologySources[source],source);
 }
 const text=id=>whaleDeepLessons[id].dive.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(text('whales'),/mating.*calving.*nursing/is);assert.match(text('whales'),/2,992/);
 assert.match(text('blueWhale'),/315.*not a limit/is);assert.match(text('spermWhale'),/echolocation/i);
 for(const id of ['oarfish','coelacanth'])assert.match(text(id),/comparison/i);
 assert.match(text('giantTubeworm'),/lacks.*mouth.*gut/is);assert.match(text('yetiCrab'),/Kiwa tyleri/);
 assert.match(text('hydrothermalVents'),/carbon source.*energy/is);assert.match(text('hydrothermalVents'),/not smoke/);
 assert.match(text('anglerfish'),/580.*twilight/is);assert.match(text('coelacanth'),/does not mean.*unchanged/is);
});

test('whale comparison and vent chemical reference preserve roles, sources, and population-specific claims',async()=>{
 const {whaleComparisons,ventChemicals,ventChemicalCategories}=await import('../shared/whales-deep/field-guide.mjs');
 const {ecologySources}=await import('../shared/ecology-sources.mjs');
 assert.equal(whaleComparisons.length,4);
 for(const item of whaleComparisons){for(const field of ['prey','movement','reproduction','depth'])assert.ok(item[field].length>35);for(const source of item.sources)assert.ok(ecologySources[source]);}
 assert.match(whaleComparisons[0].reproduction,/not completely mapped/);assert.match(whaleComparisons[1].movement,/Age and sex/);
 assert.equal(ventChemicals.length,9);
 for(const item of ventChemicals){assert.ok(item.formula&&item.origin.length>25&&item.role.length>50);assert.ok(ecologySources[item.source]);for(const category of item.categories)assert.ok(ventChemicalCategories.some(c=>c.id===category));}
 assert.deepEqual(ventChemicals.find(c=>c.formula==='O₂').categories,['acceptor']);
 assert.match(ventChemicals.find(c=>c.formula==='O₂').origin,/seawater/);
 assert.ok(ventChemicals.find(c=>c.formula==='CH₄').categories.includes('carbon'));
 assert.match(ventChemicals[0].role,/do not supply carbon/);
});

test('Swordfish is a complete seventh Sunlight Zone unit with evidence-aware diet teaching and a playable hunting asset',async()=>{
 const {swordfishLesson:lesson}=await import('../shared/swordfish/content.mjs');
 const {swordfishSources}=await import('../shared/swordfish/sources.mjs');
 const {findLibraryLesson,libraryGroups}=await import('../shared/library-content.mjs');
 const {HUNT_PREVIEW_COUNT,HUNT_DURATION,HUNT_FPS,huntFramePath}=await import('../shared/swordfish/continuous-hunt.mjs');
 assert.deepEqual(libraryGroups.find(c=>c.id==='sunlight').lessons.map(l=>l.id),['sunlight','corals','turtle','plankton','schooling','kelp','swordfish','stromatolites','bobbitWorm']);
 assert.equal(findLibraryLesson('swordfish').unit,34);assert.equal(findLibraryLesson('swordfish').subjectId,'extensions');
 assert.ok(words(lesson.intro)>=500);assert.ok(words(lesson.dive)>3*words(lesson.intro));
 assert.equal(quizBank.swordfish.length,7);assert.ok(quizBank.swordfish.every(q=>q.kind==='written'&&!q.options));
 const text=lesson.dive.sections.flatMap(s=>s.paragraphs).join(' ');
 assert.match(text,/small, mature male Architeuthis/);assert.match(text,/does not show that they routinely fight enormous adult giant squid/);assert.match(text,/sideways/);assert.match(text,/temporal resolution/);
 for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(swordfishSources[source],source);
 for(const source of lesson.guide.sources)assert.ok(swordfishSources[source],source);
 for(const [,description,source] of lesson.diagram.key){assert.ok(description.length>35);assert.ok(swordfishSources[source]);}
 await access(new URL('../public'+lesson.diagram.image,import.meta.url));
 const video=await readFile(new URL('../public/assets/swordfish/swordfish-hunt-v6.mp4',import.meta.url));
 assert.ok(video.length>100000);assert.equal(video.subarray(4,8).toString(),'ftyp');assert.ok(video.includes(Buffer.from('moov')));assert.ok(video.includes(Buffer.from('mdat')));
 const captions=await readFile(new URL('../public/assets/swordfish/swordfish-hunt-v6.vtt',import.meta.url),'utf8');assert.match(captions,/WEBVTT/);assert.match(captions,/00:14.000/);
 const manifest=JSON.parse(await readFile(new URL('../docs/swordfish-continuous-v6-manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.frameCount,420);assert.equal(manifest.previewCount,HUNT_PREVIEW_COUNT);assert.equal(manifest.durationSeconds,HUNT_DURATION);assert.equal(manifest.outputFps,HUNT_FPS);
 assert.equal(manifest.tool,'built-in image_gen.imagegen');assert.match(manifest.method,/continuous trajectory/);
 assert.equal(manifest.validation.frames,420);assert.equal(manifest.previewTimes.length,32);
 for(const art of Object.values(manifest.sourceArtwork)){assert.ok(art.prompt.length>100);assert.ok(art.original.endsWith('.png'));}
 for(let index=0;index<HUNT_PREVIEW_COUNT;index++){
  const image=await readFile(new URL('../public'+huntFramePath(index),import.meta.url));assert.equal(image.subarray(0,4).toString(),'RIFF');assert.equal(image.subarray(8,12).toString(),'WEBP');assert.ok(image.length>20000);
 }
});

test('continuous hunting motion spans fourteen seconds with bounded per-frame changes and opposite swipe extremes',async()=>{
 const {continuousHuntState:state,HUNT_DURATION,HUNT_FPS,huntFrameTime,huntStage}=await import('../shared/swordfish/continuous-hunt.mjs');
 assert.equal(HUNT_DURATION,14);assert.equal(HUNT_FPS,30);
 assert.equal(state(5).yaw,-.62);assert.equal(state(6.5).yaw,.62);assert.equal(state(7.8).yaw,0);
 for(let frame=1;frame<=420;frame++){
  const a=state((frame-1)/30),b=state(frame/30);
  assert.ok(Math.hypot(b.x-a.x,b.y-a.y)<7,'no position jumps');assert.ok(Math.abs(b.yaw-a.yaw)<.16,'no angle jumps');
  assert.ok(b.scatter>=a.scatter&&b.capture>=a.capture);
 }
 assert.equal(huntFrameTime(0),0);assert.equal(huntFrameTime(31),419/30);
 assert.equal(huntStage(5),'The school flees · bill sweep');assert.equal(huntStage(12.7),'Mouth capture');assert.equal(state(14).capture,1);
});

test('Stromatolites adds an eighth Sunlight unit with deep paired readings, four sourced stages and seven written questions',async()=>{
 const {stromatoliteLesson:lesson,stromatoliteSteps,stromatoliteSources}=await import('../shared/stromatolites-content.mjs');
 const {findLibraryLesson}=await import('../shared/library-content.mjs');
 const {lessonChapterLabel}=await import('../shared/chapter-structure.mjs');
 assert.equal(lessonChapterLabel('stromatolites'),'Chapter 2- The Sunlight Zone · Unit 8');assert.equal(findLibraryLesson('stromatolites').unit,35);
 assert.equal(findLibraryLesson('swordfish').unit,34);assert.equal(findLibraryLesson('stromatolites').subjectId,'extensions');
 assert.ok(words(lesson.intro)>=500);assert.ok(words(lesson.dive)>=2000);assert.ok(words(lesson.dive)>3*words(lesson.intro));
 assert.deepEqual(teachingGuides.stromatolites,lesson.guide);assert.equal(quizBank.stromatolites.length,7);
 assert.ok(quizBank.stromatolites.every(q=>q.kind==='written'&&!q.options));
 assert.deepEqual(stromatoliteSteps.map(s=>s.title),['Microbial mat','Sediment trapping','Mineral precipitation','Layered growth']);
 for(const step of stromatoliteSteps){assert.ok(step.detail.length>100);assert.ok(stromatoliteSources[step.source]);}
 for(const section of [...lesson.intro.sections,...lesson.dive.sections])for(const source of section.sources)assert.ok(stromatoliteSources[source],source);
 const text=lesson.dive.sections.flatMap(s=>s.paragraphs).join(' ');
 for(const concept of ['3.5 billion','living fossils','EPS','precipitation','cooperation','compete','Hamelin Pool'])assert.ok(text.includes(concept),concept);
 await access(new URL('../public'+lesson.diagram.image,import.meta.url));
});


test('predator intercepts independently fleeing prey, then pursues the released fish rather than pulling it to the mouth',async()=>{
 const {continuousHuntState:state,capturedPreyState:prey,freeTargetState:free,releasedPreyState:released,schoolFishState:school}=await import('../shared/swordfish/continuous-hunt.mjs');
 for(let t=0;t<6.5;t+=1/30){assert.equal(prey(t).x,free(t).x);assert.equal(prey(t).y,free(t).y);assert.ok(free(t).vx>0);assert.ok(free(t).vy<0);}
 const impact=prey(6.5),predator=state(6.5);assert.ok(Math.hypot(impact.x-predator.x-Math.sin(predator.yaw)*137,impact.y-predator.y+Math.cos(predator.yaw)*137)<1e-8,'bill tip reaches fleeing prey');
 for(let t=7.1;t<9.7;t+=1/30){const s=state(t),q=prey(t);assert.ok(q.onBill);assert.ok(Math.abs(q.x-s.x-Math.sin(s.yaw)*92)<1e-8);assert.ok(Math.abs(q.y-s.y+Math.cos(s.yaw)*92)<1e-8);assert.equal(q.alpha,1);}
 for(let i=1;i<=420;i++){const a=prey((i-1)/30),b=prey(i/30);assert.ok(Math.hypot(b.x-a.x,b.y-a.y)<7,'continuous prey path');assert.ok(Math.abs(b.angle-a.angle)<.3,'no prey rotation jump');}
 for(let i=0;i<11;i++){
  assert.ok(Math.hypot(school(i,2).x-school(i,0).x,school(i,2).y-school(i,0).y)>19,'school swims before attack');
  const a=school(i,5),b=school(i,6),c=school(i,7);assert.ok(Math.hypot(b.x-a.x,b.y-a.y)>60,'visible escape speed');assert.ok(Math.hypot(c.x-b.x,c.y-b.y)>60,'escape continues');
  assert.ok(Math.abs(Math.atan2(b.x-a.x,-(b.y-a.y))-b.angle)<1e-8,'fish face their travel direction');
 }
 for(const t of [10.5,11,12,12.5]){assert.equal(prey(t).x,released(t).x);assert.equal(prey(t).y,released(t).y);assert.equal(prey(t).alpha,1);}
 const gap=t=>Math.hypot(state(t).x-prey(t).x,state(t).y-prey(t).y);assert.ok(gap(10.5)>160);assert.ok(gap(11.8)<gap(11));assert.ok(gap(12.6)<1e-8);assert.equal(prey(13).alpha,0);
 const component=await readFile(new URL('../app/SwordfishHunt.tsx',import.meta.url),'utf8');assert.match(component,/Watch the school flee/);assert.match(component,/does not establish impaling as their usual feeding method/);
});


test('swordfish chases and carrying movement lead with the head along the swimming path',async()=>{
 const {continuousHuntState:state}=await import('../shared/swordfish/continuous-hunt.mjs');
 const facingDot=t=>{const a=state(t-.0002),b=state(t+.0002),s=state(t),dx=b.x-a.x,dy=b.y-a.y;return (Math.sin(s.yaw)*dx-Math.cos(s.yaw)*dy)/Math.hypot(dx,dy);};
 for(const [start,end] of [[.01,3.79],[6.51,9.69],[10.51,13.99]])for(let t=start;t<end;t+=1/30)assert.ok(facingDot(t)>.9999,`body follows travel at ${t}`);
 assert.ok(state(2).yaw>.7,'initial diagonal pursuit visibly turns right');
 assert.ok(state(10.55).yaw>state(11.5).yaw+.7,'final pursuit turns nose upward as it accelerates');
 assert.ok(state(12.85).yaw>1,'after capture body follows rightward travel');
});
