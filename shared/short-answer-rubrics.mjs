// Reviewed concise equivalents for every question, in stable quiz order.
// An alias credits the required idea without extra words supplied in the prompt.
// Explicit multi-part questions still need all requested ideas.
const no='no|nope|false';
const uncertain='not necessarily|not always|not proven';
const yes='yes|yep|true';
export const shortAnswerRubrics={
 bobbitWorm:['bristle worm|segmented worm','below the seabed|in a hole','ambush|surprise attack','jaws|mouth','back into its hole|below the seabed','water jets|water','trace fossil'],
 bigfinSquid:['magnapinna','big fins|fins','ten|10','filaments|threads','elbow',uncertain+'|unknown|not known|not fully known','deep ocean|deep sea|deep water'],
 stromatolites:['microbes|microbial mats','about three point five billion years|3.5 billion years ago','cyanobacteria|blue green microbes','sticky slime|microbial glue','calcium carbonate|carbonate minerals',no,'hamelin pool|shark bay'],
 kelp:['brown seaweed','holdfast|rootlike holdfast','making food with sunlight|photosynthesis','gas bubbles|gas filled floats','coast of california|new zealand','sea urchins','ocean warming|too many urchins'],
 seaIce:['frozen seawater','concentrated saltwater','sun energy','tiny copepods|krill','polar cod','a breathing hole|oxygen from air','a place to rest|shelter from predators'],
 narwhal:['a modified tooth','the northern arctic','a blow hole','sonar|echoes from clicks','arctic cod|squid','tail lobes','noisy ships|melting sea ice'],
 beluga:['melon|fatty forehead melon','a returning sound','sonar|echoes from clicks','white skin','a blow hole','small fish|shrimp','boat noise|loud ships'],
 walrus:['sensitive whiskers','sucking in prey','its tongue','bottom dwelling clams','haul out|coming out to rest','climbing onto ice|self defense','less sea ice|ice melting'],
 lanternfish:['light organs','matching light from above','after dark','tiny shrimp|copepods','a bony fish','daily up and down migration','larger fish|squid'],
 barreleye:['inside its clear head|inside the transparent shield','sense of smell','the eyes rotate|yes','pacific ocean','tiny crustaceans|planktonic animals',no,'underwater robot|remotely operated submarine'],
 hatchetfish:[uncertain,'thin from side to side|sideways flattened','biological light','matching light from above','toward the surface','reflection|bounces light back','dim twilight waters'],
 bioluminescence:['biological light|making its own light','light organ','it needs outside light|yes','luciferin','luciferase','hiding|attracting prey|signalling','light diffraction'],
 verticalMigration:['daily|every day','after dark','harder for predators to see|less visible','water temperature|oxygen levels','sinking debris','echo sounder|acoustic sonar','150 metres per hour|one hundred fifty'],
 octopus:['eight arms','suction cups','water funnel','pigment sacs|chromatophores','a clam|a crab','a sheltered den|a cave',uncertain],
 humboldt:['dosidicus gigas','two feeding tentacles','mantle muscles','water funnel','not much oxygen','small fish|another squid','light from photophores|biological light'],
 nautilus:['the outer chamber|the last chamber','chamber walls|septa','siphuncle','water funnel',no,'shrimp|crabs','slow reproduction|late maturity'],
 hydroids:['an animal','a polyp','stinging cells|cnidocytes','growing buds','a swimming medusa','planula larva',uncertain],
 whaleShark:['a shark','filtering water for food','gills','tiny plankton|krill','spot pattern',uncertain,'hit by boats|fishing nets'],
 hammerhead:['hammer shaped cephalofoil','each side of the head|outer tips','electricity|electrical activity','a squid|a small fish','shallow nursery waters',uncertain,'live birth|living pups'],
 leopardShark:['spots and saddles','below the head','small crabs|worms','a sheltered bay','rising and falling tides',yes,'live pups'],
 mako:['pointy','thin smooth teeth','tail fin','gills','retaining body heat|regional endothermy','squid|small fish','late maturity|slow reproduction'],
 midnightLife:['bathypelagic zone',no,'falling organic debris','bottom dwelling','higher|rises|goes up|gets higher','food from chemical energy','underwater robot|manned submersible'],
 giantIsopod:['a crustacean','14 walking legs','feelers','outer skeleton','swimming legs|pleopods','eating dead animals',uncertain],
 blackDragonfish:['a bony fish','a chin barbel','light organs','other fish','adult females','the larval stage',uncertain],
 pelicanEel:['gulper','small eyes','an expanding throat pouch','small crustaceans|shrimp','the end of the tail',uncertain,'seawater'],
 giantPhantom:['4 oral arms','an oral arm','a cnidarian',no,'open water|pelagic','the arm is shorter',uncertain],
 rays:['flexible cartilage','oceanic manta|giant manta ray','a muddy bottom|sandy seafloor',no,'an electric shock','accidental catch','eggs in cases'],
 mantaRay:['tiny drifting animals|zooplankton','cephalic fins|head lobes','through the gills','endangered',no,'they migrate|yes',uncertain],
 whales:['marine mammals','baleen plates','the blue whale','tiny krill','birthing grounds|calving habitat','routes differ|not all',yes],
 blueWhale:['krill','baleen filters','expandable throat folds','water is filtered out|yes','2 blowholes','routes vary|not all','ship collisions|entanglement'],
 spermWhale:['a whale with teeth','biosonar|sonar','large squid','myoglobin','1 blowhole','social groups|yes',no],
 oarfish:['a bony fish','reddish','back fin|dorsal','small krill',no,'it also lives shallower|no','an underwater camera|underwater robot'],
 giantTubeworm:['trophosome',no,'chemical energy makes food','H2S|hydrogen sulphide','CO2','cooler mixing water|no','red plume'],
 yetiCrab:['a crustacean','bristles','external surface','antarctic waters|southern ocean','cooler mixing water|no','species differ|no','chemosynthetic bacteria'],
 hydrothermalVents:['saltwater|ocean water','hot rocks|earth heat','mineral particles|no','chemical energy makes food','hydrogen sulphide|methane','vent crabs|tube worms','cooler mixed water|no'],
 anglerfish:['top of the head','esca','symbiotic bacteria','making light biologically','twilight zone','strategies vary|no','capture is not guaranteed|no'],
 coelacanth:['fleshy lobed fins','a living modern fish','it also lives shallower|no','2 dorsal fins','electricity','evolution continues|no','DNA in the water'],
 southernStingray:['cartilage','bottom dwelling crabs','spiracle','under its body','self protection','live birth','sandy shallows'],
 shortTailStingray:['smooth ray','southern african waters','tail barb','self protection','no ranking is established|no','small fish|clams','live birth'],
 clearnoseSkate:['see through snout patches','it lacks a sting|no','two dorsal fins','leathery egg pouch','egg yolk','small shrimp','western atlantic'],
 bluespottedRibbontail:['taeniura lymma','solid blue spots','reef shelter','water covers shallow feeding grounds','small shrimp','underside tail fold','self protection'],
 blueRingedOctopus:['eight arms','TTX','stops breathing|respiratory paralysis','bouncing back incoming light','reflective iridophores','unsafe|no','small fish|crabs'],
 swordfish:['xiphias gladius','cutting prey|wounding fish','small fish|squid','better eyesight|seeing fast movement','daytime','a small one','gills'],
 sharks:['cartilage','gills','whale shark','hammerhead','electricity','live pups|eggs','people overfishing|fishing nets'],
 corals:['hard coral','calcium carbonate|CaCO3','tiny drifting animals','great barrier reef','reef fish|sea stars','symbiotic algae','seawater heats up'],
 cnidaria:['cnidarians','cnidocytes','nematocysts','a polyp','symbiotic algae','ctenophores','eating prey|being eaten'],
 anemones:['animals','basal disc','tentacles','digestive chamber','splitting in two|releasing eggs','symbiotic algae','follow light|find food|avoid danger'],
 cephalopods:['molluscs','eight arms','feeding tentacles','jet funnel','chromatophores','chambered nautilus','hunting prey|being eaten'],
 penguin:['antarctic','modified wings','keep warm|save body heat','air to breathe','on his feet','consumers that hunt|consumers eating fish','time and depth'],
 orca:['a dolphin','sonar','insulating blubber','air to breathe','copying other orcas|learning from the group','hide near ice|move to safer habitat','different time spent searching|more searching means more sightings'],
 lionsmane:['cnidarians','nematocysts|stinging capsules','oral arms','bell pulses and currents','adult medusa','attached polyp','water flowing into the bay'],
 schooling:['schooling','confuses predators|hard to track individuals|hard to follow one fish|hard to pick one fish','a tight ball of fish','dark back and pale belly','water vibrations','following nearby fish|matching neighbours','predators spot groups and fish compete for food'],
 plankton:['a type of phytoplankton|phytoplankton','silica shell|frustule','chloroplast','silicate','fish eat them|they get eaten','only change temperature','more births than deaths but fish can limit growth'],
 upwelling:['coriolis','right','ekman transport','away from land','cold','sunlit zone','falling organic debris','decomposers','protein and DNA','moving energy|ATP','diatoms','a bloom','photosynthetic plankton','upwelling','plankton'],
 conveyor:['heat and salt|salt and temperature','higher density','near greenland','indian and pacific|pacific and indian','upwelling|mixing','roughly a thousand years','less dense so less sinking|freshening slows sinking'],
 coriolis:['rotation|spinning','right','left','equator','anticlockwise','coriolis effect'],
 enso:['pacific ocean','weaker winds','toward south america','less food nutrients','stronger winds and colder water','rain is more likely','irregular|not fixed'],
 sunlight:['blowhole','upper shell|carapace','bell','top fin','phytoplankton','upper shell|carapace'],
 turtle:['seagrass|algae','air|lungs|surfacing','front flippers','sandy beach','helps grass regrow|new grass growth','seagrass'],
 shark:['fish and squid|fish and rays','tail fin','tracking tags','electricity','very far from coasts to open sea','apex predator','slow breeding|few babies'],
 cuttlefish:['cuttlebone|internal shell','8 arms and 2 tentacles','pigment expands|sac gets bigger','iridophores','light scattering','bumpy skin','they combine for camouflage'],
 twilightGeneral:['200 to 1000 metres|200 m to 1 km|200 metres to 1 kilometre|0.2 to 1 kilometres','sun|sunlight|surface photosynthesis','falling remains','up at night and down in daytime','light camouflage|counterillumination','food|light|oxygen|depth changes with food|depth varies with light','vertical migration'],
 twilight:['marine debris|detritus','collecting filaments','8 arms 2 fins 2 filaments','needs less oxygen','glowing slime','red light is missing|no light','food sticks and is pulled to the mouth'],
};

// Alternate concept paths let common definitions be expressed in a different
// word order. Only named processes get these paths; numerical/anatomical
// relationships continue to use their question-specific structure.
const definitions={
 photosynthesis:[['sun','sunlight','light'],['make','produce','build'],['food','sugar','organic matter']],
 chemosynthesis:[['chemical','chemical energy','chemical reactions'],['make','produce','build'],['food','sugar','organic matter','organic material']],
 echolocation:[['click','sound','echo'],['return','bounce','reflect'],['find','locate','detect','sense']],
 filtration:[['filter','strain'],['water','food','plankton']],
 counterillumination:[['match'],['light','brightness']],
};
const definitionQuestions={kelp:{2:'photosynthesis'},midnightLife:{5:'chemosynthesis'},giantTubeworm:{2:'chemosynthesis'},hydrothermalVents:{3:'chemosynthesis'},narwhal:{3:'echolocation'},beluga:{2:'echolocation'},orca:{1:'echolocation'},spermWhale:{1:'echolocation'},whaleShark:{1:'filtration'},lanternfish:{1:'counterillumination'},hatchetfish:{3:'counterillumination'},twilightGeneral:{4:'counterillumination'}};

// Remove requirements already supplied by the question, or ask explicitly
// for one cause where several causes are valid. Keep requested pairs intact.
const adjustments={
 turtle:{0:{prompt:'Name one food that most adult green sea turtles mainly eat.',concepts:[['seagrass','algae']],rejectConcepts:['only algae','only seagrass']}},
 plankton:{0:{concepts:[['phytoplankton','photosynthetic plankton']]},4:{concepts:[['eat','consume','graze','predation']] }},
 coriolis:{0:{concepts:[['rotation','spinning']],rejectConcepts:['moon','ocean rotation','water rotation']}},
 enso:{0:{concepts:[['pacific']]},4:{concepts:[['stronger','strengthen'],['cooler','colder','cooling']]}},
 conveyor:{6:{concepts:[['weaken sinking','less sinking','slower sinking','slow sinking','sinking slows','sinking weakens','sink less','reduces sinking']],acceptedPhrases:['makes water float']}},
 shark:{6:{prompt:'Name one reason great white shark populations can take a long time to recover after losses.',concepts:[['slow reproduction','reproduce slowly','slow breeding','late maturity','few young','few offspring','few babies','small litters']] }},
 cuttlefish:{2:{concepts:[['expand','spread','larger','bigger','stretch']],rejectConcepts:['muscles expand','muscles get bigger']},4:{concepts:[['scatter','pale background','white background']] }},
 schooling:{3:{rejectConcepts:['light on top','light on back','pale on top','dark on belly','dark on underside','dark on bottom','light back','pale back','white back','light top','lighter upper','dark belly','dark underside','dark bottom']},5:{concepts:[['adjust','respond','react','follow','align','coordinate']] }},
};

/** @template {Record<string,Array<{acceptedPhrases:string[],rejectConcepts:string[]}>>} T @param {T} bank @returns {T} */
export function addShortAnswerRubrics(bank){
 return /** @type {T} */(Object.fromEntries(Object.entries(bank).map(([id,questions])=>{
  const rules=shortAnswerRubrics[id];
  if(!rules||rules.length!==questions.length)throw Error(`Missing short-answer review for ${id}`);
  return [id,questions.map((question,index)=>{
   const extra=adjustments[id]?.[index]??{};
   return {...question,...extra,
    alternativeConcepts:definitionQuestions[id]?.[index]?[definitions[definitionQuestions[id][index]]]:[],
    acceptedPhrases:[...new Set([...question.acceptedPhrases,...rules[index].split('|'),...(extra.acceptedPhrases??[])])],
    rejectConcepts:[...new Set([...question.rejectConcepts,...(extra.rejectConcepts??[])])],
   };
  })];
 })));
}
