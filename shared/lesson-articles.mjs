import {ecologyIntros,ecologyGuides} from './ecology-content.mjs';
import {sharkOverviewIntro,sharkOverviewGuide} from './sharks-content.mjs';
import {coralIntro,coralGuide} from './coral-content.mjs';
import {cnidarianIntros,cnidarianGuides} from './cnidarian-content.mjs';
import {lionsManeFoundationOpening,greatWhiteFoundationOpening} from './chapter-structure.mjs';
import polarArticles from './polar-articles.json' with {type:'json'};
import originalArticles from './introductory-articles.json' with {type:'json'};
import guides from './teaching-guides.json' with {type:'json'};
import {cephalopodIntro,cephalopodGuide} from './cephalopod-content.mjs';
import {sunlightPlasticFoundation} from './sunlight-plastics.mjs';
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
export const teachingGuides={...guides,...ecologyGuides,sharks:sharkOverviewGuide,corals:coralGuide,...cnidarianGuides,cephalopods:cephalopodGuide};
const sourceArticles={...originalArticles,...ecologyIntros,sharks:sharkOverviewIntro,shark:{...originalArticles.shark,sections:originalArticles.shark.sections.map((section,index)=>index===0?{...section,paragraphs:[greatWhiteFoundationOpening,...section.paragraphs]}:section)},corals:coralIntro,...cnidarianIntros,cephalopods:cephalopodIntro,cuttlefish:{...originalArticles.cuttlefish,sections:originalArticles.cuttlefish.sections.map((section,index)=>index===0?{...section,paragraphs:['In the last unit, we explored cephalopods as a group. Now let’s focus on one member: the common cuttlefish (Sepia officinalis). This coastal hunter lives mainly in the eastern Atlantic Ocean and Mediterranean Sea, often over sandy or muddy sea floors. Its changing skin patterns, buoyancy control, and quick feeding tentacles make it a useful case study of how cephalopod structures work together.',...section.paragraphs.slice(1)]}:section)},sunlight:{...originalArticles.sunlight,sections:[...originalArticles.sunlight.sections,...sunlightPlasticFoundation]},...polarArticles.intro,lionsmane:{...polarArticles.intro.lionsmane,sections:polarArticles.intro.lionsmane.sections.map((section,index)=>index===0?{...section,paragraphs:[lionsManeFoundationOpening,...section.paragraphs]}:section)},plankton:planktonIntro,twilightGeneral:twilightIntro,twilight:vampireIntro,schooling:schoolingIntro};
export const introductoryArticles=Object.fromEntries(Object.entries(sourceArticles).map(([key,article])=>[key,{
 title:teachingGuides[key].title,abstract:teachingGuides[key].abstract,
 sections:article.sections.map(section=>({heading:editTeachingProse(section.heading.replace(/^\d+[.:]\s*/,'')),paragraphs:section.paragraphs.map(editTeachingProse)})),
 terms:teachingGuides[key].terms,
}]));
