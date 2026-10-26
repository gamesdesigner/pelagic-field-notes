// Rubrics align one-for-one with the original banks. Keep order and totals so
// existing checked answers, unfinished drafts, scores and owner reports survive.
const rubrics={
 plankton:[
  [['diatoms','diatom'],['phytoplankton','photosynthetic plankton']],
  [['frustule','frustules']],
  [['chloroplast','chloroplasts']],
  [['silicate','silicates','silicon','dissolved silicon']],
  [['eat','eating','consume','consuming','graze','grazing','predation'],['faster','more than','exceed','exceeds','greater than']],
  [['temperature'],['only','keep other','keeping other','same conditions','matching tanks','control other','constant']],
  [['growth exceeds losses','growth exceeds loss','grow faster than losses','growth is greater than losses','division exceeds losses','growth exceeds grazing'],['nutrients','nutrient depletion','grazing','grazers','fish']],
 ],
 upwelling:[
  [['coriolis','coriolis effect']],
  [['right','rightward']],
  [['ekman transport']],
  [['offshore','away from the coast','away from shore','out to sea']],
  [['cold','cool','colder'],['nutrient rich','nutrients'],['deep','deeper','below']],
  [['photic','euphotic','sunlit zone','sunlight zone']],
  [['marine snow']],
  [['bacteria','bacterial','microbes','decomposers']],
  [['protein','proteins'],['nucleic acids','dna','rna']],
  [['energy transfer','transfer energy','transferring energy','atp','energy storage']],
  [['diatom','diatoms']],
  [['bloom','algal bloom','phytoplankton bloom']],
  [['phytoplankton','photosynthetic plankton']],
  [['upwelling']],
  [['plankton']],
 ],
 coriolis:[
  [['earth','planet'],['rotation','rotates','rotating','spins','spin','spinning']],
  [['right','rightward']],
  [['left','leftward']],
  [['equator','equatorial','zero latitude','0 latitude']],
  [['counterclockwise','counter clockwise','anticlockwise','anti clockwise']],
  [['coriolis','coriolis effect']],
 ],
 sunlight:[
  [['blowhole','blow hole']],
  [['carapace']],
  [['bell']],
  [['dorsal fin','dorsal']],
  [['phytoplankton','photosynthetic plankton']],
  [['carapace']],
 ],
 turtle:[
  [['seagrass','seagrasses','sea grass','sea grasses'],['algae','alga']],
  [['air','oxygen'],['lung','lungs','breathe','breathes','breathing','surface','surfacing']],
  [['front flippers','fore flippers','foreflippers','forelimbs','front limbs']],
  [['beach','beaches','sandy shore','sand on land']],
  [['new growth','fresh growth','regrowth','grow back','new shoots','healthy growth']],
  [['seagrass','sea grass','seagrasses']],
 ],
 conveyor:[
  [['temperature','heat'],['salinity','salt','saltiness']],
  [['denser','higher density','more dense','greater density']],
  [['north atlantic','greenland','iceland','nordic seas','labrador sea']],
  [['indian'],['pacific']],
  [['mixing'],['upwelling','wind driven rise','wind driven rising']],
  [['1000','1 000','thousand','a millennium','one millennium']],
  [['lower density','less dense','decrease density','reduces density','reduce density','decreases density'],['weaken sinking','weaker sinking','less sinking','reduce sinking','slower sinking','weakens sinking','slow sinking','weakening sinking']],
 ],
 enso:[
  [['pacific'],['tropical','equatorial','central','eastern']],
  [['weaken','weaker','weakens','less strong','decrease','diminish','slower']],
  [['east','eastward','americas','south america']],
  [['nutrients','nutrient'],['fewer','less','reduced','decrease','lower','decline','reduction']],
  [['stronger winds','stronger trade winds','trade winds strengthen','winds strengthen'],['cooler','colder','cooling'],['eastern pacific','central pacific','east pacific']],
  [['chance','probability','probabilities','more likely','likelihood','odds'],['wet','wetter','rain','rainfall']],
  [['irregular','variable','varies','no fixed schedule','no fixed timetable','not a fixed schedule','not regular','not on a fixed schedule']],
 ],
 shark:[
  [['fish','fishes'],['squid','rays','smaller sharks','small sharks']],
  [['tail','caudal fin']],
  [['electronic tags','electronic tagging','satellite tags','satellite tagging','acoustic tags','tracking tags','tagging','tags']],
  [['electrical signals','electric signals','electric fields','electrical fields','electricity','bioelectric']],
  [['coastal','coast','inshore'],['offshore','open ocean'],['thousands','thousand','long distances','long distance']],
  [['top predator','top predators','apex predator','apex predators'],['prey','population','populations','behavior','behaviour','food web','food webs']],
  [['slow reproduction','reproduce slowly','reproduce slow','slow breeding','slowly reproducing','low reproductive rate'],['few young','few offspring','small litters','low offspring','few babies']],
 ],
 cuttlefish:[
  [['cuttlebone','cuttle bone']],
  [['eight arms','8 arms'],['two tentacles','2 tentacles','two feeding tentacles','2 feeding tentacles']],
  [['expands','expand','expansion','spread','spreads','larger','bigger','stretches'],['pigment','pigment sac','sac']],
  [['iridophore','iridophores']],
  [['scatter','scattering','scatters'],['light','incoming light']],
  [['texture','bumpy','bumpier','rough','rougher','outline','surface shape']],
  [['different','distinct','separate','complementary'],['together','combine','combined','combination'],['appearance','camouflage','color','colour','look']],
 ],
 twilightGeneral:[
  [['200','two hundred'],['1000','1 000','thousand']],
  [['photosynthesis','surface production','surface producers','sunlight near the surface','sunlight at the surface']],
  [['sinking','sink','falls','falling','sinks'],['organic','remains','waste','dead organisms','dead animals','mucus','fecal','faecal']],
  [['up at night','upward at night','surface at night','rise at night','feed at night','upwards at night'],['deeper by day','down by day','descend by day','deep during the day','down during the day','deeper during the day','down at dawn','descend at dawn','deeper in daytime']],
  [['counterillumination','counter illumination','match the light','matching light','match light','matching faint light','match faint light','match downwelling light'],['hide','hiding','silhouette','contrast','camouflage','less visible']],
  [['vary','varies','change','changes','different','variable'],['light','food','conditions','species','oxygen','region','regions']],
  [['sinking material','sinking particles','marine snow','waste at depth','respiration at depth','migration','migrating','vertical movement']],
 ],
 twilight:[
  [['marine snow','organic particles','drifting organic material','detritus']],
  [['filament','filaments','retractile filaments']],
  [['eight webbed arms','8 webbed arms','eight arms','8 arms'],['two mantle fins','2 mantle fins','two fins','2 fins'],['two fine filaments','2 fine filaments','two filaments','2 filaments']],
  [['less oxygen','lower oxygen demand','reduce oxygen demand','reduced oxygen demand','reduces oxygen demand','less need for oxygen','low oxygen demand']],
  [['mucus'],['luminous','glowing','bioluminescent','light emitting','luminous particles']],
  [['red light'],['little','less','absent','scarce','absorbed','fades','filtered','does not reach','cannot reach','no red light']],
  [['particles','food'],['attach','capture','collect','stick','catch'],['mouth','retrieve','retrieved','retrieval','pull back','pulled back']],
 ],
 schooling:[
  [['school','schooling']],
  [['harder','difficult','confuse','confuses','confusion'],['track','tracking','target','follow','single fish','one fish','individual']],
  [['compact','tight','dense','rounded','round','spherical','ball'],['fish','prey','school']],
  [['dark','darker'],['upper','top','back'],['light','lighter','pale'],['underside','belly','bottom','below']],
  [['water movement','water motion','vibrations','vibration','pressure changes']],
  [['nearby fish','neighbors','neighbours','local responses','local rules','each fish','other fish'],['adjust','adjusts','respond','responds','react','reacts','follow','align','coordinate']],
  [['attract predators','attracts predators','predators notice','easier to spot','more visible'],['competition','compete','competing','share food','less food']],
 ],
};

// Choice-oriented wording becomes a focused, answerable writing prompt.
const prompts={
 upwelling:{13:'Name the process in which deep ocean water rises toward the surface.',14:'What is the general name for tiny organisms that drift in ocean currents?'},
 coriolis:{5:'Name the apparent deflection caused by Earth’s rotation.'},
 sunlight:{5:'Name a turtle’s hard upper shell.'},
 turtle:{5:'Name the underwater plant that forms meadows where adult green turtles often feed.'},
 enso:{4:'During La Niña, how do the trade winds and central/eastern tropical Pacific temperatures change compared with neutral conditions?',6:'Does ENSO follow a fixed timetable? Describe the timing of its warm, cool, and neutral phases.'},
 shark:{0:'Name fish and at least one other type of prey young great white sharks eat.',4:'Describe the distances and coastal/offshore areas covered by some great white shark migrations.',5:'What kind of predator is a great white shark, and what can it influence in a marine food web?'},
 cuttlefish:{6:'How do pigment, reflection, and texture contribute together to a cuttlefish’s appearance?'},
 twilightGeneral:{5:'Are twilight animals fixed at one depth? Name one factor that can change their depth.',6:'Name one process through which twilight animals help move carbon downward.'},
 twilight:{2:'Describe a vampire squid’s body: how many arms, mantle fins, and fine filaments does it have?',6:'What feeding behavior would you observe to test whether a filament collects food? Describe capture and retrieval.'},
 plankton:{0:'How are diatoms related to phytoplankton?',5:'How would you test temperature’s effect on population growth while keeping the comparison fair?',6:'What balance of growth and losses allows a bloom, and what can limit it?'},
 schooling:{0:'What do we call a group of fish swimming together with coordinated headings?',5:'How do nearby fish coordinate their movement in a school?',6:'Name two costs of schooling: one involving predators and one involving food.'},
};

// Some answers explain a missing resource. Match the complete idea so words
// such as "no" and "not" are not mistaken for denying the correct explanation.
const paraphrases={
 twilight:{5:[
  'no light','no sunlight','no red light','no red wavelengths',
  'not any light','not much light','not enough light',
  'not any red light','not much red light','not enough red light',
  'little light','low light','lack of light','absence of light','lack of red light','absence of red light',
  'light is absent','light is scarce','light is limited','light is not present','light is not there',
  'light does not reach','light cannot reach','light does not get',
  'light is absorbed','light has been absorbed','red wavelengths are absorbed',
  'it is dark','too dark','dark water','in darkness',
 ]},
};

const explanations={
 upwelling:[
  'Earth’s rotation produces the Coriolis effect, an apparent deflection of motion over its surface.',
  'Moving water is deflected to the right of its motion in the Northern Hemisphere.',
  'Net Ekman transport is perpendicular to the wind in the idealized model.',
  'When wind-driven transport moves surface water offshore, deeper water can rise to replace it.',
  'Upwelling brings cooler deep water carrying dissolved nutrients toward the surface.',
  'The photic or euphotic zone is the sunlit upper ocean that supports photosynthesis.',
  'Marine snow is sinking organic material, including remains and waste.',
  'Microbial decomposition recycles organic matter and releases nutrients.',
  'Nitrogen from nitrate is used to build proteins and nucleic acids such as DNA and RNA.',
  'Phosphate is part of ATP, which transfers usable energy within cells.',
  'Diatoms use dissolved silicon to build their silica frustules.',
  'A bloom develops when population growth temporarily exceeds losses.',
  'Photosynthetic plankton convert light energy into organic matter used by marine food webs.',
  'Upwelling is the upward movement of water from deeper layers.',
  'Plankton are organisms whose distribution is strongly influenced by currents.',
 ],
 coriolis:[
  'Earth rotates beneath moving air and water, producing an apparent deflection in an Earth-fixed frame.',
  'The deflection is toward the right of motion in the Northern Hemisphere.',
  'The deflection is toward the left of motion in the Southern Hemisphere.',
  'The horizontal Coriolis parameter is zero at the equator and grows in magnitude toward the poles.',
  'Northern Hemisphere tropical cyclones normally have counterclockwise circulation around low pressure.',
  'The Coriolis effect describes apparent deflection in a rotating reference frame.',
 ],
 sunlight:[
  'The blowhole opens at the surface so a dolphin can exchange air using its lungs.',
  'The carapace is the upper shell; the lower shell is the plastron.',
  'A jelly’s bell contracts to help propel it through the water.',
  'The dorsal fin is on the upper side of the tuna and contributes stability.',
  'Phytoplankton use photosynthesis to support many marine food webs.',
  'A turtle’s hard upper shell is called the carapace.',
 ],
 turtle:[
  'Most adult green turtles mainly graze on seagrasses and algae, though diets vary.',
  'Turtles have lungs and must surface to obtain oxygen from air.',
  'The front flippers provide most propulsion, while the rear flippers help steer.',
  'Females come ashore and bury their eggs in nests on sandy beaches.',
  'Grazing can encourage new seagrass growth; its effects depend on grazing intensity and habitat.',
  'Seagrasses are flowering plants that form underwater meadows, unlike algae.',
 ],
};

const conflicts={
 upwelling:{1:['left','leftward'],3:['toward the coast','towards the coast','onshore'],4:['warm water','nutrient poor']},
 coriolis:{1:['left','leftward'],2:['right','rightward'],3:['poles']},
 turtle:{1:['gills','breathe water'],2:['rear flippers']},
 enso:{1:['stronger','strengthen'],2:['westward'],4:['warmer eastern pacific','weaker trade winds'],6:['every year','fixed annual schedule']},
 shark:{0:['only seals','only sea lions','seagrass']},
 twilight:{0:['blood'],4:['ordinary ink','black ink'],5:['red light is brightest','plenty of red light','red light is not absorbed','always covered in mud','eyes paint the water','all deep animals are white']},
};

/**
 * @typedef {{kind:'written',prompt:string,answer:string,concepts:string[][],acceptedPhrases:string[],rejectConcepts:string[],explanation:string}} WrittenQuestion
 * @returns {WrittenQuestion[]}
 */
export function makeWrittenQuiz(lessonId,questions){
 if(questions.every(question=>question.kind==='written'))return questions;
 const rules=rubrics[lessonId];
 if(!rules||rules.length!==questions.length)throw Error(`Missing written rubrics for ${lessonId}`);
 return questions.map((question,index)=>{
  const answer=typeof question.answer==='number'?question.options[question.answer]:question.answer;
  return {kind:'written',prompt:prompts[lessonId]?.[index]??question.prompt,answer,
   concepts:rules[index],acceptedPhrases:[answer,...(paraphrases[lessonId]?.[index]??[])],rejectConcepts:conflicts[lessonId]?.[index]??[],
   explanation:question.explanation??explanations[lessonId]?.[index]??answer,
  };
 });
}
