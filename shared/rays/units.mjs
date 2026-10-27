// Append destinations to preserve all saved lesson IDs and existing unit indices.
export const rayUnits=[
 {id:'giantPhantom',title:'Giant Phantom Jellyfish',scientific:'Stygiomedusa gigantea',summary:'Explore four ribbon-like mouth arms, deep-water observations, and a carefully scaled comparison with a bus.',tag:'Anatomy & size comparison'},
 {id:'rays',title:'Rays',scientific:'Batoid diversity · Cartilaginous fishes',summary:'Compare ray habitats, four examples, giant sizes, venom and electricity, and conservation challenges.',tag:'Chapter introduction'},
 {id:'mantaRay',title:'Manta Ray',scientific:'Mobula birostris · Giant oceanic manta',summary:'Follow feeding, migration, group behavior, and conservation, then explore an interactive mouth cutaway.',tag:'Filter feeding & mouth anatomy'},
].map((unit,index)=>({...unit,image:`/assets/rays/${unit.id}-diagram-v1.webp`,subjectId:'extensions',unit:17+index}));
