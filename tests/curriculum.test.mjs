import {test} from 'node:test';
import assert from 'node:assert/strict';
import {introductoryArticles,teachingGuides} from '../shared/lesson-articles.mjs';
import {schoolingIntro,schoolingDive} from '../shared/schooling-articles.mjs';
import {lessonTitles,quizBank} from '../shared/learning-content.mjs';

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
 for(const q of questions){assert.equal(q.options.length,5);assert.ok(q.options[q.answer]);assert.ok(q.explanation.length>20);}
});
test('existing lesson identifiers and long twilight foundation readings remain intact',()=>{
 for(const id of ['upwelling','conveyor','coriolis','ekman','enso','sunlight','turtle','shark','cuttlefish','plankton','twilightGeneral','twilight','midnight','general'])assert.ok(Object.hasOwn(lessonTitles,id));
 for(const id of ['twilightGeneral','twilight'])assert.ok(words(introductoryArticles[id])>=500);
});
