// Append after extensions0..28. Never renumber older renderer destinations.
export const rayExtraUnits=[
 {id:'southernStingray',title:'Southern Stingray',scientific:'Hypanus americanus',summary:'Follow a sandy-bottom hunter through breathing, buried prey, live birth, and defensive tail anatomy.',tag:'Seagrass, sand & feeding'},
 {id:'shortTailStingray',title:'Short-tail Stingray',scientific:'Bathytoshia brevicaudata · Also called smooth stingray',summary:'Explore a huge coastal ray whose venomous defensive spine can cause serious or potentially fatal injury.',tag:'Large rays & defensive spines'},
 {id:'clearnoseSkate',title:'Clearnose Skate',scientific:'Rostroraja eglanteria',summary:'Identify a translucent snout, compare skates with stingrays, and follow development inside an egg case.',tag:'Skates, thorns & egg cases'},
 {id:'bluespottedRibbontail',title:'Bluespotted Ribbontail Ray',scientific:'Taeniura lymma',summary:'Study blue spots, a ribbon-like tail fold, reef shelters, and feeding trips into tidal shallows.',tag:'Reef edges & tidal feeding'},
 {id:'blueRingedOctopus',title:'Blue-ringed Octopuses',scientific:'Hapalochlaena species · Plate: H. lunulata',summary:'Connect reflective warning rings, eight flexible arms, and potentially deadly venom without confusing danger with aggression.',tag:'Warning colors & venom'},
].map((unit,index)=>({...unit,image:`/assets/rays-extra/${unit.id}-diagram-${unit.id==='shortTailStingray'?'v2':'v1'}.webp`,subjectId:'extensions',unit:29+index}));
