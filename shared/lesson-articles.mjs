import originalArticles from './introductory-articles.json' with {type:'json'};
import guides from './teaching-guides.json' with {type:'json'};
import {planktonIntro} from './plankton-articles.mjs';
import {twilightIntro,vampireIntro} from './twilight-articles.mjs';
import {schoolingIntro} from './schooling-articles.mjs';

// One editorial convention for both reading levels. Scientific names and equations
// retain their case and meaning; US spelling and direct sentence openings are shared.
export function editTeachingProse(text){
 const spelling={metres:'meters',metre:'meter',kilometres:'kilometers',kilometre:'kilometer',millimetres:'millimeters',centimetres:'centimeters',litres:'liters',litre:'liter',behaviour:'behavior',behaviours:'behaviors',colour:'color',colours:'colors',colouring:'coloring',analyse:'analyze',analysed:'analyzed',analysing:'analyzing',centre:'center',centres:'centers',specialised:'specialized',organised:'organized',travelling:'traveling',travelled:'traveled'};
 return text.replace(/\b(?:kilometres|kilometre|millimetres|centimetres|metres|metre|litres|litre|behaviours|behaviour|colouring|colours|colour|analysing|analysed|analyse|centres|centre|specialised|organised|travelling|travelled)\b/g,word=>spelling[word])
  .replace(/^(?:It is important to note that |In other words, |In reality, )(.?)/,(_,first)=>first.toUpperCase())
  .replace('Imagine floating in an enormous blue room whose ceiling grows fainter as you descend.','Light from above grows fainter with depth.');
}
export const teachingGuides=guides;
const sourceArticles={...originalArticles,plankton:planktonIntro,twilightGeneral:twilightIntro,twilight:vampireIntro,schooling:schoolingIntro};
export const introductoryArticles=Object.fromEntries(Object.entries(sourceArticles).map(([key,article])=>[key,{
 title:guides[key].title,abstract:guides[key].abstract,
 sections:article.sections.map(section=>({heading:editTeachingProse(section.heading.replace(/^\d+[.:]\s*/,'')),paragraphs:section.paragraphs.map(editTeachingProse)})),
 terms:guides[key].terms,
}]));
