// Appended destinations preserve every earlier extensions index.
export const midnightUnits=[
 {id:'midnightLife',title:'Life in the Midnight Zone',scientific:'Bathypelagic ocean · Approximately 1,000–4,000 m',summary:'Explore darkness, pressure, food pathways, and the difference between deep midwater and the seafloor.',tag:'Chapter introduction'},
 {id:'giantIsopod',title:'Giant Isopods',scientific:'Bathynomus · Giant marine crustaceans',summary:'Follow armored body segments, jointed legs, underwater breathing, and scavenging along the deep seafloor.',tag:'Seafloor anatomy & feeding'},
 {id:'blackDragonfish',title:'Black Dragonfish',scientific:'Idiacanthus atlanticus',summary:'Meet a slender predator with fang-like teeth, a luminous chin barbel, and dramatically different life stages.',tag:'Living light & life stages'},
 {id:'pelicanEel',title:'Pelican Eels',scientific:'Eurypharynx pelecanoides',summary:'Investigate enormous jaws, an expandable throat, a narrow body, and a luminous tail tip.',tag:'Feeding anatomy & evidence'},
].map((unit,index)=>({...unit,image:`/assets/midnight/${unit.id}-diagram-v1.webp`,subjectId:'extensions',unit:13+index}));
