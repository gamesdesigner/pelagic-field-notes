// Append after extensions0..19; chapter membership is independent of renderer order.
export const whaleDeepUnits=[
 {id:'whales',title:'Whales',scientific:'Cetaceans · Migration, reproduction, food, and diving',summary:'Compare feeding and breeding journeys, calving habitat, giant size, dive depths, and common prey.',tag:'Chapter introduction'},
 {id:'blueWhale',title:'Blue Whale',scientific:'Balaenoptera musculus',summary:'Explore baleen, expandable throat folds, krill feeding, seasonal movements, and conservation.',tag:'Bulk feeding & ocean journeys'},
 {id:'spermWhale',title:'Sperm Whale',scientific:'Physeter macrocephalus',summary:'Connect echolocation and oxygen stores with deep prey, social units, and sex-specific movements.',tag:'Sound & deep dives'},
 {id:'oarfish',title:'Oarfish',scientific:'Regalecus glesne · Shallower depth comparison',summary:'Identify a silver ribbon body and red fins while comparing actual habitat records with deep-sea stories.',tag:'Anatomy & depth comparison'},
 {id:'giantTubeworm',title:'Giant Tubeworms',scientific:'Riftia pachyptila',summary:'Look inside a plume-bearing vent worm to discover its trophosome, blood transport, and bacterial partners.',tag:'Internal symbiosis'},
 {id:'yetiCrab',title:'Yeti Crab',scientific:'Kiwa tyleri · Southern Ocean vents',summary:'Study chest setae, external microbes, and the narrow habitat between cold seawater and hot vent fluid.',tag:'External microbes & habitat'},
 {id:'hydrothermalVents',title:'Hydrothermal Vents',scientific:'Geology · Chemistry · Chemosynthetic food webs',summary:'Trace vent formation, explore a chemical reference, and meet region-specific deep-sea communities.',tag:'Formation & chemical energy'},
 {id:'anglerfish',title:'Anglerfish',scientific:'Melanocetus johnsonii · Female black seadevil',summary:'Examine a forehead lure, luminous bacterial partners, feeding anatomy, and a range crossing depth zones.',tag:'Light & ambush feeding'},
 {id:'coelacanth',title:'Coelacanth',scientific:'Latimeria chalumnae · Shallower rocky-habitat comparison',summary:'Compare lobed fins, sensory anatomy, evolutionary history, slow life history, and conservation evidence.',tag:'Anatomy & living lineages'},
].map((unit,index)=>({...unit,image:`/assets/whales-deep/${unit.id}-diagram-v1.webp`,subjectId:'extensions',unit:20+index}));
