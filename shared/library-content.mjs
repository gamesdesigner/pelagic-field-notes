import {rayUnits} from './rays/units.mjs';
import {polarUnits} from './polar-content.mjs';
import {completionUnits} from './completion/units.mjs';
import {midnightUnits} from './midnight/units.mjs';

import {chapters,sunlightChapterTitle,polarChapterTitle} from './chapter-structure.mjs';
export {sunlightChapterTitle,polarChapterTitle};
export const contactEmail = 'anomalocaris.m@gmail.com';
// Renderer destinations stay stable independently of chapter membership.
const lessons = [
    ...completionUnits,
    ...midnightUnits,
    ...rayUnits,
    {id:'sharks',title:'Introduction to sharks',summary:'Explore shark body plans, senses, feeding, and four illustrated species before studying the great white.',image:'/assets/sharks-overview/whale-shark-plate-v1.webp',tag:'Body plans & diversity',subjectId:'sharks'},
    {id:'currentsIntro',title:'Introduction to ocean currents',summary:'Learn how moving water supports ocean life and climate, and how global warming changes those connections.',image:'/assets/field-guide-v2/ocean-surface-currents.webp',tag:'Start here',kind:'introduction',subjectId:'currents',topic:-1},
    {id:'upwelling',title:'Upwelling',summary:'Follow cold, nutrient-rich water toward the sunlit surface.',image:'/assets/upwelling-side-view.png',tag:'Wind & nutrients',subjectId:'currents',topic:0},
    {id:'conveyor',title:'Thermohaline Circulation',summary:'Trace the surface and deep currents that link ocean basins.',image:'/assets/field-guide-v2/global-conveyor-belt.webp',tag:'Global circulation',subjectId:'currents',topic:1},
    {id:'coriolis',title:'The Coriolis effect',summary:'Explore how a rotating Earth changes the paths of moving water.',image:'/assets/coriolis-effect-illustration.png',tag:'Earth’s rotation',subjectId:'currents',topic:2},
    {id:'ekman',title:'Ekman transport',summary:'Connect wind and moving water with upwelling and downwelling.',image:'/assets/ekman-transport-illustration.png',tag:'Coastal processes',subjectId:'currents',topic:3},
    {id:'enso',title:'El Niño & La Niña',summary:'Compare changing Pacific winds, temperatures, and circulation.',image:'/assets/field-guide-v2/el-nino-pacific.webp',tag:'Ocean & climate',subjectId:'currents',topic:4},
    {id:'sunlight',title:'Life in the sunlight zone',summary:'Start with the habitats and food webs powered by sunlight.',image:'/assets/sunlight/marine-life-in-sunlight.png',tag:'Unit overview',subjectId:'sunlight',topic:0},
    {id:'kelp',title:'Kelp forests',summary:'Follow kelp growth, forest animals, cool-water habitats, and threats from warming and overgrazing.',image:'/assets/ecology/kelp-diagram-v1.webp',tag:'Forest habitats & food webs',subjectId:'sunlight',topic:10},
    {id:'corals',title:'Corals',summary:'Compare coral types, discover how reefs form, meet reef animals, and explore warming and bleaching.',image:'/assets/corals/elkhorn-plate-v1.webp',tag:'Reef builders & climate',subjectId:'sunlight',topic:9},
    {id:'turtle',title:'Green sea turtles',summary:'Watch a grazer feed and explore how its environment affects activity.',image:'/assets/turtles/green-turtle-grazing.png',tag:'Feeding & habitat',subjectId:'sunlight',topic:1},
    {id:'shark',title:'Great white sharks',summary:'Look closely at the anatomy and senses of a powerful predator.',image:'/assets/sunlight/great-white-shark.png',tag:'Anatomy & senses',subjectId:'sunlight',topic:2},
    {id:'cephalopods',title:'Cephalopods',summary:'Compare octopuses, squids, cuttlefish, and nautiluses through their shared body plan and different ways of living.',image:'/assets/cephalopods/octopus-plate-v1.webp',tag:'Body plans & diversity',subjectId:'sunlight',topic:6},
    {id:'cuttlefish',title:'Common cuttlefish',summary:'Uncover camouflage, color-changing cells, and clever hunting.',image:'/assets/sunlight/common-cuttlefish.png',tag:'Color & camouflage',subjectId:'sunlight',topic:3},
    {id:'cnidaria',title:'Cnidaria',summary:'Compare jellyfish, corals, hydroids, and anemones through their shared stinging cells and different body plans.',image:'/assets/cnidarians/moon-jelly-plate-v1.webp',tag:'Body plans & stinging cells',subjectId:'sunlight',topic:7},
    {id:'anemones',title:'Anemones',summary:'Study tentacle feeding, soft bodies, and partnerships through four illustrated species.',image:'/assets/cnidarians/bubble-tip-plate-v1.webp',tag:'Anatomy & ecology',subjectId:'sunlight',topic:8},
    {id:'plankton',title:'Planktons & diatoms',summary:'Explore cells and experiment with a growing plankton population.',image:'/assets/plankton/diatom-detailed-v1.webp',tag:'Microscopic life',subjectId:'sunlight',topic:4},
    {id:'schooling',title:'Fish defences',summary:'Discover how small fish move together and respond to danger.',image:'/assets/schooling/fish-school-v2.webp',tag:'Animal behavior',subjectId:'sunlight',topic:5},
    {id:'twilightGeneral',title:'Life in the twilight zone',summary:'Explore food webs, living light, and daily migrations.',image:'/assets/twilight/general-twilight.webp',tag:'200–1,000 metres',subjectId:'twilight',unit:0},
    {id:'twilight',title:'Vampire squid',summary:'Meet a marine-snow collector with an unusual glowing defense.',image:'/assets/twilight/vampire-squid.webp',tag:'Twilight animal study',subjectId:'twilight',unit:1},
    {id:'midnight',title:'Giant siphonophores',summary:'Investigate deep-ocean conditions and the giant siphonophore.',image:'/assets/ocean-depths-slide.png',tag:'Cnidarian colony · Midnight zone',subjectId:'midnight'},
    {id:'general',title:'Moon jellies & the connected ocean',summary:'Bring the water column together, with a closer look at moon jellies.',image:'/assets/sunlight-creatures/moon-jelly.png',tag:'Cnidarian case study',subjectId:'general'},
  ...polarUnits.map((item,unit)=>({id:item.id,title:item.title,summary:item.description,image:item.image,tag:item.region,subjectId:'polar',unit})),
];
const chapterDetails={
 rays:{label:'Ray diversity & manta feeding',overview:'Compare four ray examples, habitats, defenses, and conservation, then explore the giant oceanic manta through an interactive mouth cutaway.'},
 sharks:{label:'Diversity, anatomy & ecology',overview:'Begin with shark biology, then compare great whites, whale sharks, scalloped hammerheads, leopard sharks, and shortfin makos.'},
 currents:{label:'Moving water',overview:'Discover how wind, Earth’s rotation, and water density connect the oceans and influence climate.'},
 sunlight:{label:'0–200 metres',overview:'Explore the bright surface ocean: habitats, coral reefs, grazing turtles, microscopic producers, fish defences, and kelp forests.'},
 polar:{label:'Sea ice, northern mammals & Antarctic comparison',overview:'Begin beneath Arctic sea ice, then study orcas, narwhals, belugas, and walruses before an Antarctic penguin comparison.'},
 depths:{label:'200–1,000 metres',overview:'Meet lanternfish, barreleyes, and marine hatchetfish, then investigate living light and daily journeys between depths.'},
 midnightZone:{label:'1,000–4,000 metres',overview:'Begin with life beyond sunlight, then study giant isopods, the Black Dragonfish, and pelican eels through food, sensing, and distinctive anatomy.'},
 cephalopods:{label:'Octopuses, squids, cuttlefish & nautiluses',overview:'Compare the common cuttlefish, giant Pacific octopus, Humboldt squid, chambered nautilus, and vampire squid through their shared body plan.'},
 cnidaria:{label:'Anemones, hydroids & jellyfish',overview:'Connect shared stinging cells with anemones, lion’s mane jellies, giant siphonophores, moon jellies, attached hydroid colonies, and the giant phantom jellyfish.'},
};
/** @typedef {{id:string,title:string,summary:string,image:string,tag:string,kind?:string,subjectId:string,topic?:number,unit?:number}} LibraryLesson */
/** @type {{id:string,title:string,label:string,overview:string,lessons:LibraryLesson[]}[]} */
export const libraryGroups=chapters.map(chapter=>({
 id:chapter.id,title:chapter.title,...chapterDetails[chapter.id],
 lessons:chapter.lessonIds.map(id=>{
  const lesson=lessons.find(item=>item.id===id);
  if(!lesson)throw Error(`Missing library lesson: ${id}`);
  return lesson;
 }),
}));

/** @returns {{id:string,subjectId:string,topic?:number,unit?:number}|undefined} */
export function findLibraryLesson(id) {
  if (typeof id !== 'string') return undefined;
  if (id === 'introduction') return {id:'introduction',subjectId:'introduction'};
  return libraryGroups.flatMap(group=>group.lessons).find(lesson=>lesson.id===id);
}

/** Preserve only a recognized lesson destination across the sign-in form. */
export function lessonQuery(search) {
  const id = new URLSearchParams(search).get('lesson');
  return findLibraryLesson(id) ? `?lesson=${encodeURIComponent(id)}` : '';
}
