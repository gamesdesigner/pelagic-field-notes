// One question bank is used by the lesson UI and server-side grading.

/** @type {{prompt:string,answer:string,options?:string[]}[]} */
export const upwellingQuestions = [
  { prompt: "What causes moving ocean water to deflect as Earth rotates?", answer: "The Coriolis Effect", options: ["The Coriolis Effect", "Marine snow", "Brine rejection", "The thermocline"] },
  { prompt: "In which direction is moving water deflected in the Northern Hemisphere?", answer: "To the right", options: ["To the right", "To the left", "Straight downward", "Toward the equator"] },
  { prompt: "What is the net movement of surface water at a 90-degree angle to the wind called?", answer: "Ekman Transport", options: ["Ekman Transport", "Tidal mixing", "Brine rejection", "Downwelling"] },
  { prompt: "During coastal upwelling, where does warm surface water move?", answer: "Away from the coast", options: ["Away from the coast", "Down the continental shelf", "Toward the seafloor", "Into a river"] },
  { prompt: "What rises to replace the surface water pushed offshore?", answer: "Cold, nutrient-rich deep water", options: ["Cold, nutrient-rich deep water", "Warm, nutrient-poor water", "Fresh river water", "Melting sea ice"] },
  { prompt: "What is the sunlit upper layer of the ocean called?", answer: "The photic zone", options: ["The photic zone", "The abyssal zone", "The benthic zone", "The trench zone"] },
  { prompt: "What name is given to organic material that sinks through the ocean?", answer: "Marine snow", options: ["Marine snow", "Sea foam", "Brine", "Coastal fog"] },
  { prompt: "What breaks down dead organisms and waste in the deep ocean?", answer: "Deep-sea bacteria", options: ["Deep-sea bacteria", "Ocean winds", "Sunlight", "Coral reefs"] },
  { prompt: "Nitrates are especially important for making which materials in marine plants?", answer: "Proteins and nucleic acids", options: ["Proteins and nucleic acids", "Salt and sand", "Calcium and shells", "Oxygen bubbles"] },
  { prompt: "Phosphates are important for which cellular job?", answer: "Energy transfer", options: ["Energy transfer", "Changing tides", "Producing salt", "Deflecting currents"] },
  { prompt: "Which microscopic organisms use silicates to build glass-like shells?", answer: "Diatoms", options: ["Diatoms", "Jellyfish", "Whales", "Sea turtles"] },
  { prompt: "What is a rapid increase in phytoplankton called?", answer: "An algal bloom", options: ["An algal bloom", "A spring tide", "A rain shadow", "A brine pool"] },
  { prompt: "Which organisms form the foundational base of the marine food web?", answer: "Phytoplankton", options: ["Phytoplankton", "Sharks", "Whales", "Seabirds"] },
  { prompt: "Spell the process in which deep ocean water rises toward the surface.", answer: "upwelling" },
  { prompt: "Spell the general name for tiny organisms that drift in ocean currents.", answer: "plankton" },
];

/** @type {{prompt:string,answer:string,options?:string[]}[]} */
export const coriolisQuestions = [
  { prompt: "What causes the Coriolis effect?", answer: "Earth's rotation", options: ["Earth's rotation", "The Moon's gravity", "Ocean salinity", "Solar heating"] },
  { prompt: "Which way are moving objects deflected in the Northern Hemisphere?", answer: "To the right", options: ["To the right", "To the left", "Straight upward", "Toward the equator"] },
  { prompt: "Which way are moving objects deflected in the Southern Hemisphere?", answer: "To the left", options: ["To the left", "To the right", "Toward the North Pole", "They are not deflected"] },
  { prompt: "Where is the Coriolis effect weakest?", answer: "At the equator", options: ["At the equator", "At the poles", "At 60° latitude", "It is equally strong everywhere"] },
  { prompt: "How do Northern Hemisphere hurricanes usually rotate?", answer: "Counterclockwise", options: ["Counterclockwise", "Clockwise", "East to west only", "They do not rotate"] },
  { prompt: "Spell the name of the apparent deflection caused by Earth's rotation.", answer: "coriolis" },
];

/** @type {{prompt:string,answer:string,options?:string[]}[]} */
export const sunlightQuestions = [
  { prompt: "Which body part lets a dolphin breathe at the ocean surface?", answer: "Blowhole", options: ["Blowhole", "Dorsal fin", "Gill cover", "Tail fluke"] },
  { prompt: "What is the hard upper shell of a green sea turtle called?", answer: "Carapace", options: ["Carapace", "Bell", "Rostrum", "Operculum"] },
  { prompt: "Which part forms the rounded top of a moon jelly?", answer: "Bell", options: ["Bell", "Oral arm", "Tentacle", "Gonad"] },
  { prompt: "Which fin helps stabilize a bluefin tuna along the top of its body?", answer: "Dorsal fin", options: ["Dorsal fin", "Pectoral fin", "Tail fin", "Gill cover"] },
  { prompt: "Which organisms use sunlight to form the base of many ocean food webs?", answer: "Phytoplankton", options: ["Phytoplankton", "Dolphins", "Sea turtles", "Tuna"] },
  { prompt: "Spell the word for a turtle's hard upper shell.", answer: "carapace" },
];

/** @type {{prompt:string,answer:string,options?:string[]}[]} */
export const turtleQuestions = [
  { prompt: "What do most adult green sea turtles mainly eat?", answer: "Seagrasses and algae", options: ["Seagrasses and algae", "Tuna and squid", "Coral skeletons", "Deep-sea bacteria"] },
  { prompt: "How does a green sea turtle get oxygen?", answer: "It breathes air with lungs", options: ["It breathes air with lungs", "It uses gills", "It absorbs oxygen through its shell", "It gets oxygen from seagrass"] },
  { prompt: "Which body parts provide most of a green turtle's swimming power?", answer: "Front flippers", options: ["Front flippers", "Carapace scutes", "Rear claws", "Beak"] },
  { prompt: "Where do female green sea turtles lay their eggs?", answer: "On sandy beaches", options: ["On sandy beaches", "Inside seagrass beds", "On coral reefs", "In the open ocean"] },
  { prompt: "How can green turtle grazing help a seagrass meadow?", answer: "It encourages fresh growth", options: ["It encourages fresh growth", "It removes all sunlight", "It turns grass into coral", "It makes the water saltier"] },
  { prompt: "Spell the name of the underwater plant meadow where adult green turtles often feed.", answer: "seagrass" },
];

/** @type {{prompt:string,answer:string,options:string[],explanation:string}[]} */
export const conveyorQuestions = [
  {
    prompt: "Which two properties of seawater give thermohaline circulation its name?",
    options: ["Wave height and tides", "Temperature and salinity", "Sunlight and oxygen", "Wind speed and rainfall"],
    answer: "Temperature and salinity",
    explanation: "Thermo means temperature and haline refers to salt. Both affect seawater density, which helps drive deep-ocean circulation.",
  },
  {
    prompt: "Why does cold, salty water sink in the North Atlantic?",
    options: ["It contains more sunlight", "It is pushed down by fish", "It is less dense than warmer water", "It is denser than the water around it"],
    answer: "It is denser than the water around it",
    explanation: "Cooling and high salinity can make surface water dense enough to sink and feed the deep Atlantic current.",
  },
  {
    prompt: "Where does an important sinking region of the global conveyor belt form?",
    options: ["The North Atlantic near Greenland and Iceland", "The middle of the Sahara Desert", "The Amazon River", "The equatorial Pacific coastline"],
    answer: "The North Atlantic near Greenland and Iceland",
    explanation: "The lesson's sinking marker highlights the North Atlantic, where surface water loses heat and dense water moves into deeper layers.",
  },
  {
    prompt: "After deep water moves south through the Atlantic, which two ocean basins receive major branches of the conveyor pathway?",
    options: ["The Mediterranean and Caribbean seas", "The Arctic and Mediterranean", "The Indian and Pacific oceans", "Only the Atlantic Ocean"],
    answer: "The Indian and Pacific oceans",
    explanation: "Deep water exchanges with the Southern Ocean and branches toward the Indian and Pacific basins in the schematic conveyor pathway.",
  },
  {
    prompt: "What helps deep water return toward the ocean surface?",
    options: ["The ocean floor becoming dry", "Mixing and wind-driven upwelling", "The Moon turning water into ice", "All deep currents stopping"],
    answer: "Mixing and wind-driven upwelling",
    explanation: "Mixing and upwelling bring deep water back toward the upper ocean across broad regions, helping connect the deep and surface pathways.",
  },
  {
    prompt: "About how long can a parcel of water take to complete a journey around the global conveyor belt?",
    options: ["One day", "One month", "Ten years", "1,000 years"],
    answer: "1,000 years",
    explanation: "A complete journey can take roughly 1,000 years. The map speeds up the animation so you can see the movement.",
  },
  {
    prompt: "How can fresh water from melting ice affect sinking in the North Atlantic?",
    options: ["It can lower surface-water density and weaken sinking", "It always makes seawater saltier", "It instantly stops every ocean current", "It makes surface water denser than before"],
    answer: "It can lower surface-water density and weaken sinking",
    explanation: "Fresh water lowers salinity and can make surface water less dense. This can weaken the sinking that helps sustain Atlantic overturning.",
  },
];

/** @type {{prompt:string,answer:number,options:string[],explanation:string}[]} */
export const ensoQuestions = [
  {
    prompt: "Where does El Niño develop?",
    options: ["In the Arctic Ocean", "In the northern Atlantic Ocean", "In the central and eastern tropical Pacific Ocean", "Only in the Mediterranean Sea", "Only in the Southern Ocean"],
    answer: 2,
    explanation: "El Niño is the warm phase of ENSO in the tropical Pacific.",
  },
  {
    prompt: "What usually happens to the trade winds during El Niño?",
    options: ["They always blow twice as strongly", "They weaken", "They stop everywhere on Earth", "They turn into ocean tides", "They blow only from north to south"],
    answer: 1,
    explanation: "Weaker trade winds help warm surface water spread eastward.",
  },
  {
    prompt: "During El Niño, where does warm surface water spread?",
    options: ["Toward the Arctic", "Only deeper into the ocean", "Away from the equator toward Antarctica", "Eastward toward the Americas", "Only westward toward Indonesia"],
    answer: 3,
    explanation: "The warm pool spreads toward the central and eastern Pacific.",
  },
  {
    prompt: "Why can weaker upwelling during El Niño reduce food for marine life?",
    options: ["Fewer nutrients reach the surface from deep water", "All sunlight disappears", "The ocean loses all its salt", "Fish can no longer breathe any oxygen", "Seawater turns into freshwater"],
    answer: 0,
    explanation: "Less nutrient-rich deep water reaches the surface, which can reduce phytoplankton growth and affect the food web.",
  },
  {
    prompt: "Which combination best describes La Niña?",
    options: ["Weaker trade winds and warmer eastern Pacific water", "No trade winds and no currents", "Stronger trade winds and warmer eastern Pacific water", "Weaker trade winds and warmer water everywhere", "Stronger trade winds and cooler central and eastern Pacific water"],
    answer: 4,
    explanation: "Stronger winds push warm water west and strengthen eastern upwelling during La Niña.",
  },
  {
    prompt: "What does it mean when scientists say El Niño favors wetter winters in the southern United States?",
    options: ["Every day will have heavy rain", "Every place on Earth will become wetter", "It increases the chance of wetter conditions, but does not determine every storm", "Only ocean temperatures change; weather cannot change", "The exact same storms happen during every El Niño"],
    answer: 2,
    explanation: "ENSO changes weather probabilities. Local effects still depend on the season, event strength and other weather influences.",
  },
  {
    prompt: "Which statement about the ENSO cycle is correct?",
    options: ["El Niño starts on the same date every year", "Warm, cool and neutral phases occur on an irregular schedule", "La Niña always starts immediately after El Niño", "Each phase lasts exactly seven days", "El Niño and La Niña happen only once a century"],
    answer: 1,
    explanation: "ENSO has no fixed timetable. Events commonly recur about every 2–7 years and can last many months or longer.",
  },
];

/** @type {{prompt:string,answer:number,options:string[],explanation:string}[]} */
export const sharkQuestions = [
  {prompt:"What do young great white sharks mainly eat?",options:["Only seals and sea lions","Seagrasses and algae","Fish, squid, rays, and smaller sharks","Only plankton","Coral and seaweed"],answer:2,explanation:"Young great whites eat smaller animal prey. Larger sharks can also hunt seals and sea lions."},
  {prompt:"Which part provides most of a great white shark’s swimming thrust?",options:["Its teeth","Its powerful tail","Its eyes","Its gill slits alone","Its sense of smell"],answer:1,explanation:"The muscular body and tail drive the shark through the water. Its fins help control its movement."},
  {prompt:"How do scientists track the long-distance movements of great white sharks?",options:["By following their footprints","By measuring waves on beaches","By counting shells on the seabed","By using electronic tags","By listening only to seabirds"],answer:3,explanation:"Electronic tags record or transmit information that helps researchers study shark movements and dives."},
  {prompt:"What can the ampullae of Lorenzini detect?",options:["Weak electrical signals from other animals","The age of nearby rocks","The exact depth of every ocean","Colors in distant clouds","Sunlight through solid land"],answer:0,explanation:"These sensory organs detect weak electrical signals, including those produced by other animals’ muscles and nerves."},
  {prompt:"Which statement best describes great white shark migration?",options:["They stay beside the same rock throughout their lives","They travel only in rivers","They never enter offshore waters","Every shark follows exactly the same route","Some travel thousands of kilometers between coastal and offshore areas"],answer:4,explanation:"Tagging studies show long journeys between feeding areas and offshore waters. Routes and timing can vary."},
  {prompt:"What role do great white sharks play in marine food webs?",options:["They produce food through photosynthesis","They are mainly plant grazers","They are top predators that influence prey populations and behavior","They turn seawater into freshwater","They eat only dead plants"],answer:2,explanation:"Great whites are top predators. Their hunting and presence can influence other animals in the food web."},
  {prompt:"Why can great white shark populations take a long time to recover after losses?",options:["They reproduce daily","They reproduce slowly and have relatively few young","They never migrate","They are unable to eat fish","Their teeth cannot regrow"],answer:1,explanation:"Slow reproduction and relatively few offspring mean populations recover gradually from threats such as accidental capture in fishing gear."},
];

/** @type {{prompt:string,answer:number,options:string[],explanation:string}[]} */
export const cuttlefishQuestions = [
 {prompt:"Which structure helps a cuttlefish control its buoyancy?",options:["Its beak","Its W-shaped pupil","Its cuttlebone","Its chromatophores","Its ink"],answer:2,explanation:"The gas-and-liquid chamber system of the internal cuttlebone helps control overall density and buoyancy."},
 {prompt:"How many short arms and longer feeding tentacles does a common cuttlefish have?",options:["Six arms and four tentacles","Eight arms and two tentacles","Ten arms and no tentacles","Two arms and eight tentacles","Four arms and four tentacles"],answer:1,explanation:"Eight shorter arms handle prey, while two longer feeding tentacles extend to seize it."},
 {prompt:"What happens when a chromatophore’s radial muscles contract?",options:["The animal grows a new shell","The pigment disappears","The eye changes position","The pigment sac expands and shows more pigment","The skin produces sunlight"],answer:3,explanation:"Radial muscles pull the elastic pigment sac outward, increasing its visible area."},
 {prompt:"Which structures produce iridescent effects by reflecting selected wavelengths?",options:["Iridophores","The beak","Leucophores alone","Feeding tentacles","The cuttlebone"],answer:0,explanation:"Iridophores use microscopic reflective structures; they work differently from pigment sacs."},
 {prompt:"What is the main role of leucophores in the skin model?",options:["Pumping blood","Grabbing shrimp","Storing eggs","Generating electrical light","Scattering incoming light to give a pale background"],answer:4,explanation:"Leucophores scatter light broadly. They do not make their own light."},
 {prompt:"What changes when a cuttlefish raises its papillae?",options:["The number of arms","The hardness of its beak","The skin’s texture and outline","The length of its cuttlebone","The amount of seawater salt"],answer:2,explanation:"Papillae are muscular skin projections that can make the surface bumpier. They are not pigment cells."},
 {prompt:"Why does this lesson combine pigment, reflection, and texture?",options:["All three are the same type of cell","They are different mechanisms that work together to change appearance","Only texture can help camouflage","Cuttlefish cannot respond to visual information","Every skin structure makes its own light"],answer:1,explanation:"Pigment expansion, reflective and scattering structures, and papillae contribute in different ways to the cuttlefish’s appearance."},
];

export const lessonTitles = {
 upwelling:'Upwelling',conveyor:'Global Conveyor Belt',coriolis:'Coriolis Effect',ekman:'Ekman transport',enso:'El Niño & La Niña',sunlight:'Marine Life in Sunlight',turtle:'Green Sea Turtle',shark:'Great White Shark',cuttlefish:'Common Cuttlefish',twilight:'Marine Life in Twilight',midnight:'Marine Life in Midnight',general:'The General Ocean',
};
export const quizBank = {upwelling:upwellingQuestions,conveyor:conveyorQuestions,coriolis:coriolisQuestions,enso:ensoQuestions,sunlight:sunlightQuestions,turtle:turtleQuestions,shark:sharkQuestions,cuttlefish:cuttlefishQuestions};
export const normalizeAnswer = answer=>answer.trim().toLowerCase().replace(/[^a-z0-9]/g,'');
export function spellingDistance(entered,expected){
 const row=Array.from({length:expected.length+1},(_,i)=>i);
 for(let i=1;i<=entered.length;i++){let diagonal=row[0];row[0]=i;for(let j=1;j<=expected.length;j++){const previous=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,diagonal+(entered[i-1]===expected[j-1]?0:1));diagonal=previous;}}
 return row[expected.length];
}
export function answerIsCorrect(question,answer){
 if(typeof answer!=='string'||!answer.trim())return false;
 const expected=typeof question.answer==='number'?question.options[question.answer]:question.answer;
 return question.options?normalizeAnswer(answer)===normalizeAnswer(expected):spellingDistance(normalizeAnswer(answer),normalizeAnswer(expected))<=2;
}
