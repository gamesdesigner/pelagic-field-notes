// Chapter membership is presentation metadata. Saved lesson IDs and renderer
// destinations remain stable when a lesson moves between chapters.
export const chapters=[
 {id:'currents',number:1,name:'Ocean currents',lessonIds:['currentsIntro','upwelling','conveyor','coriolis','ekman','enso']},
 {id:'sunlight',number:2,name:'The Sunlight Zone',lessonIds:['sunlight','turtle','shark','plankton','schooling']},
 {id:'polar',number:3,name:'Life in the Arctic',lessonIds:['penguin','orca']},
 {id:'depths',number:4,name:'Twilight Zone',lessonIds:['twilightGeneral']},
 {id:'cephalopods',number:5,name:'Cephalopods',lessonIds:['cephalopods','cuttlefish','twilight']},
 {id:'cnidaria',number:6,name:'Cnidaria',lessonIds:['cnidaria','anemones','lionsmane','midnight','general']},
].map(chapter=>({...chapter,title:`Chapter ${chapter.number}- ${chapter.name}`}));
export const sunlightChapterTitle=chapters[1].title;
export const polarChapterTitle=chapters[2].title;
export const twilightChapterTitle=chapters[3].title;
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
