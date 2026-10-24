import {polarUnits} from './polar-content.mjs';

export const contactEmail = 'anomalocaris.m@gmail.com';
export const libraryGroups = [
  {id:'currents',title:'Ocean currents',label:'Moving water',overview:'Discover how wind, Earth’s rotation, and water density connect the oceans and influence climate.',lessons:[
    {id:'upwelling',title:'Upwelling',summary:'Follow cold, nutrient-rich water toward the sunlit surface.',image:'/assets/upwelling-side-view.png',tag:'Wind & nutrients',subjectId:'currents',topic:0},
    {id:'conveyor',title:'The global conveyor belt',summary:'Trace the surface and deep currents that link ocean basins.',image:'/assets/field-guide-v2/global-conveyor-belt.webp',tag:'Global circulation',subjectId:'currents',topic:1},
    {id:'coriolis',title:'The Coriolis effect',summary:'Explore how a rotating Earth changes the paths of moving water.',image:'/assets/coriolis-effect-illustration.png',tag:'Earth’s rotation',subjectId:'currents',topic:2},
    {id:'ekman',title:'Ekman transport',summary:'Connect wind and moving water with upwelling and downwelling.',image:'/assets/ekman-transport-illustration.png',tag:'Coastal processes',subjectId:'currents',topic:3},
    {id:'enso',title:'El Niño & La Niña',summary:'Compare changing Pacific winds, temperatures, and circulation.',image:'/assets/field-guide-v2/el-nino-pacific.webp',tag:'Ocean & climate',subjectId:'currents',topic:4},
  ]},
  {id:'sunlight',title:'Marine life in sunlight',label:'0–200 metres',overview:'Meet the animals and tiny producers of the bright surface ocean, from grazing turtles to microscopic cells.',lessons:[
    {id:'sunlight',title:'Life in the sunlight zone',summary:'Start with the habitats and food webs powered by sunlight.',image:'/assets/sunlight/marine-life-in-sunlight.png',tag:'Unit overview',subjectId:'sunlight',topic:0},
    {id:'turtle',title:'Green sea turtles',summary:'Watch a grazer feed and explore how its environment affects activity.',image:'/assets/turtles/green-turtle-grazing.png',tag:'Feeding & habitat',subjectId:'sunlight',topic:1},
    {id:'shark',title:'Great white sharks',summary:'Look closely at the anatomy and senses of a powerful predator.',image:'/assets/sunlight/great-white-shark.png',tag:'Anatomy & senses',subjectId:'sunlight',topic:2},
    {id:'cuttlefish',title:'Common cuttlefish',summary:'Uncover camouflage, color-changing cells, and clever hunting.',image:'/assets/sunlight/common-cuttlefish.png',tag:'Color & camouflage',subjectId:'sunlight',topic:3},
    {id:'plankton',title:'Planktons & diatoms',summary:'Explore cells and experiment with a growing plankton population.',image:'/assets/plankton/diatom-detailed-v1.webp',tag:'Microscopic life',subjectId:'sunlight',topic:4},
    {id:'schooling',title:'Schools of fish',summary:'Discover how small fish move together and respond to danger.',image:'/assets/schooling/fish-school-v2.webp',tag:'Animal behavior',subjectId:'sunlight',topic:5},
  ]},
  {id:'depths',title:'Below the surface',label:'Twilight & the deep ocean',overview:'Travel through fading light and deeper water to explore unusual bodies, feeding strategies, and connected ocean layers.',lessons:[
    {id:'twilightGeneral',title:'Life in the twilight zone',summary:'Explore food webs, living light, and daily migrations.',image:'/assets/twilight/general-twilight.webp',tag:'200–1,000 metres',subjectId:'twilight',unit:0},
    {id:'twilight',title:'Vampire squid',summary:'Meet a marine-snow collector with an unusual glowing defense.',image:'/assets/twilight/vampire-squid.webp',tag:'Twilight animal study',subjectId:'twilight',unit:1},
    {id:'midnight',title:'Life in the midnight zone',summary:'Investigate deep-ocean conditions and the giant siphonophore.',image:'/assets/ocean-depths-slide.png',tag:'1,000–4,000 metres',subjectId:'midnight'},
    {id:'general',title:'The general ocean',summary:'Bring the water column together, with a closer look at moon jellies.',image:'/assets/sunlight-creatures/moon-jelly.png',tag:'The connected ocean',subjectId:'general'},
  ]},
  {id:'polar',title:'Life in the Arctic',label:'Northern seas · Antarctic comparison',overview:'Study northern orcas and lion’s mane jellyfish, then compare them with emperor penguins in Antarctica.',lessons:polarUnits.map((item,unit)=>({id:item.id,title:item.title,summary:item.description,image:item.image,tag:item.region,subjectId:'polar',unit})),
  },
];

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
