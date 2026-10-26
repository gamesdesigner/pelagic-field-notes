export const sunlightChapterTitle='Chapter 2: The Sunlight Zone';
export const polarChapterTitle='Chapter 3: Life in the Arctic';
// Display order is independent of legacy topic indices and saved lesson IDs.
export const sunlightLessonOrder=['sunlight','turtle','shark','cephalopods','cuttlefish','cnidaria','anemones','plankton','schooling'];
export function sunlightUnitReference(id){
 const index=sunlightLessonOrder.indexOf(id);
 if(index<0)throw Error(`Unknown sunlight unit: ${id}`);
 return `Chapter 2, Unit ${index+1}`;
}
export const lionsManeFoundationOpening=`In ${sunlightUnitReference('cnidaria')}, we explored Cnidaria: the group that includes corals, anemones, hydroids, and jellyfish. Now we look closer at the lion’s mane jellyfish, one of the largest jellyfish. Its long tentacles make a useful case study of how stinging cells and a soft body work together.`;
export const lionsManeAdvancedOpening=`In ${sunlightUnitReference('cnidaria')}, we compared cnidarian body plans, stinging cells, and feeding relationships. We now apply those ideas to the lion’s mane jellyfish, one of the largest jellyfish, while distinguishing bell diameter from tentacle length and an individual animal from a colony.`;
