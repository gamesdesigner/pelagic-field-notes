// Stable destinations are independent of the chapter position shown to learners.
export const completionUnits=[
 {id:'lanternfish',title:'Lanternfish',scientific:'Myctophidae',summary:'Follow light organs, feeding, and variable daily journeys in a diverse fish family.',tag:'Photophores & food webs'},
 {id:'barreleye',title:'Barreleye fish',scientific:'Macropinna microstoma',summary:'Look through a transparent head shield to rotating tubular eyes, then examine the evidence.',tag:'Eyes & observation'},
 {id:'hatchetfish',title:'Marine hatchetfish',scientific:'Sternoptychidae',summary:'Compare a compressed body, reflective skin, and downward light against different backgrounds.',tag:'Shape & concealment'},
 {id:'bioluminescence',title:'Bioluminescence',scientific:'Living light',summary:'Separate light production from reflection and fluorescence, and test possible functions.',tag:'Chemistry & communication'},
 {id:'verticalMigration',title:'Daily vertical migration',scientific:'Diel vertical migration',summary:'Connect daily depth changes with food, predators, oxygen, and carbon pathways.',tag:'Movement & carbon'},
 {id:'octopus',title:'Giant Pacific octopus',scientific:'Enteroctopus dofleini',summary:'Explore muscular arms, suckers, sensing, learning, and life along the bottom.',tag:'Arm control & learning'},
 {id:'humboldt',title:'Humboldt squid',scientific:'Dosidicus gigas',summary:'Connect powerful movement and feeding with oxygen limits and changing body patterns.',tag:'Jet propulsion & signals'},
 {id:'nautilus',title:'Chambered nautilus',scientific:'Nautilus pompilius',summary:'Trace the shell chambers and siphuncle, separating buoyancy from funnel propulsion.',tag:'Shells & buoyancy'},
 {id:'hydroids',title:'Hydroids',scientific:'Hydrozoa · An Obelia-type colony',summary:'Meet specialized colony parts, stinging cells, and the polyp–medusa life cycle.',tag:'Colonies & life cycles'},
 {id:'whaleShark',title:'Whale sharks',scientific:'Rhincodon typus',summary:'Follow a giant fish’s filtering system, feeding gatherings, and long-distance movements.',tag:'Filter feeding & tracking'},
 {id:'hammerhead',title:'Scalloped hammerheads',scientific:'Sphyrna lewini',summary:'Explore the cephalofoil, several senses, coastal young, and wider movements.',tag:'Sensory anatomy & nurseries'},
 {id:'leopardShark',title:'Leopard sharks',scientific:'Triakis semifasciata',summary:'Follow a patterned coastal shark through seafloor feeding and changing tides.',tag:'Bottom feeding & coasts'},
 {id:'mako',title:'Shortfin makos',scientific:'Isurus oxyrinchus',summary:'Connect a streamlined body with thrust, oxygen, regional heat retention, and life history.',tag:'Movement & physiology'},
].map((unit,index)=>({...unit,image:`/assets/completion/${unit.id}-diagram-v1.webp`,subjectId:'extensions',unit:index}));
