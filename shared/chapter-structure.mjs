// Chapter membership is presentation metadata. Saved lesson IDs and renderer
// destinations remain stable when a lesson moves between chapters.
export const chapters=[
 {id:'currents',number:1,name:'Ocean currents',lessonIds:['currentsIntro','upwelling','conveyor','coriolis','ekman','enso']},
 {id:'sunlight',number:2,name:'The Sunlight Zone',lessonIds:['sunlight','corals','turtle','plankton','schooling','kelp']},
 {id:'polar',number:3,name:'The Arctic',lessonIds:['seaIce','orca','narwhal','beluga','walrus','penguin']},
 {id:'depths',number:4,name:'Twilight Zone',lessonIds:['twilightGeneral','lanternfish','barreleye','hatchetfish','bioluminescence','verticalMigration']},
 {id:'midnightZone',number:5,name:'Midnight Zone',lessonIds:['midnightLife','giantIsopod','blackDragonfish','pelicanEel']},
 {id:'cephalopods',number:6,name:'Cephalopods',lessonIds:['cephalopods','cuttlefish','octopus','humboldt','nautilus','twilight']},
 {id:'cnidaria',number:7,name:'Cnidaria',lessonIds:['cnidaria','anemones','lionsmane','midnight','general','hydroids']},
 {id:'sharks',number:8,name:'Sharks',lessonIds:['sharks','shark','whaleShark','hammerhead','leopardShark','mako']},
].map(chapter=>({...chapter,title:`Chapter ${chapter.number}- ${chapter.name}`}));
export const sunlightChapterTitle=chapters[1].title;
export const polarChapterTitle=chapters[2].title;
export const twilightChapterTitle=chapters[3].title;
export const midnightChapterTitle=chapters.find(chapter=>chapter.id==='midnightZone').title;
export const cephalopodsChapterTitle=chapters.find(chapter=>chapter.id==='cephalopods').title;
export function chapterForLesson(id){return chapters.find(chapter=>chapter.lessonIds.includes(id));}
export function chapterUnitReference(id){
 const chapter=chapterForLesson(id);
 if(!chapter)throw Error(`Unknown chapter lesson: ${id}`);
 return `Chapter ${chapter.number}, Unit ${chapter.lessonIds.indexOf(id)+1}`;
}
export function lessonChapterLabel(id){
 const chapter=chapterForLesson(id);
 return chapter?`${chapter.title} · Unit ${chapter.lessonIds.indexOf(id)+1}`:'';
}
export const lionsManeFoundationOpening=`Earlier in ${chapterUnitReference('cnidaria')}, we explored Cnidaria: the group that includes corals, anemones, hydroids, and jellyfish. Now we look closer at the lion’s mane jellyfish, one of the largest jellyfish. Its long tentacles make a useful case study of how stinging cells and a soft body work together.`;
export const lionsManeAdvancedOpening=`Earlier in ${chapterUnitReference('cnidaria')}, we compared cnidarian body plans, stinging cells, and feeding relationships. We now apply those ideas to the lion’s mane jellyfish, one of the largest jellyfish, while distinguishing bell diameter from tentacle length and an individual animal from a colony.`;

export const sharksChapterTitle=chapters.find(chapter=>chapter.id==='sharks').title;
export const greatWhiteFoundationOpening=`Earlier in ${chapterUnitReference('sharks')}, we compared shark body plans, feeding, and four different species. Now let’s focus on one shark: the great white, Carcharodon carcharias. Its anatomy and senses show how the shared shark body plan supports a large predator.`;
export const greatWhiteAdvancedOpening=`Following the general comparison in ${chapterUnitReference('sharks')}, we now examine the great white, Carcharodon carcharias, in detail. Apply the same structure–function reasoning to its anatomy, sensory systems, movements, and ecological role without extending every conclusion to all sharks.`;
