import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quizBank,answerIsCorrect,upwellingQuestions} from '../shared/learning-content.mjs';
const variants={
 penguin:[
  ['The South Pole.','They live in Antarctica, not the Arctic.','Not the Arctic. Antarctica.','ANTÁRCTICA!'],
  ['Their modified wings.','Flippers propel them, while feet help steer.','It uses its flippers.'],
  ['To stay warm.','They lose less body heat.','The huddle reduces their wind exposure.'],
  ['Oxygen.','They come up for air.','Air to breathe.'],
  ['His feet.','On the top of his feet under the skin fold.','On a foot.'],
  ['Consumers because they eat fish.','They are consumers, not producers, since they hunt prey.','A consumer that feeds on other animals.'],
  ['Time and depth.','How deep it goes and when.','Depths and the duration of a dive.'],
 ],
 orca:[
  ['It is a mammal, not a fish.','Dolphin.','A mamal.','An orca is a mammal that eats fish.'],
  ['Echo-location.','Echo-\nlocation','It is echolocation.','Echolocaton.'],
  ['Blubber.','A layer of blubber.','Bluber.'],
  ['They need air.','For oxygen from the atmosphere.','They obtain oxygen by surfacing.'],
  ['Social learning.','Social\nlearning','They learn by watching.','Learning from other orcas.'],
  ['They hide near shorelines.','Prey change their habitat.','Bowheads move into ice for shelter.'],
  ['More time watching can mean more sightings.','Different distance searched changes the count.','They may have watched for longer and seen more whales.'],
 ],
 lionsmane:[
  ['Cnidaria.','They are cnidarians.','A cnidarian that eats fish.'],
  ['Nematocyst.','Nematocysts.','The capsules are nematocysts.'],
  ['Oral arms.','Oral\narms','The oral arms, while tentacles catch prey.','An oral arm.'],
  ['Pulsing and currents.','It swims while moving water carries it.','Swimming plus advection.'],
  ['Medusa.','The medusa grows from an ephyra.','Medusae.'],
  ['Polyp.','Polyps produce ephyrae.','A polyp, not a medusa.'],
  ['Advection.','The currents move them into the bay.','Transport by moving water.'],
 ],
};
test('Midnight Zone quizzes accept concise answers and reject clear biological errors',()=>{
 const examples={
  midnightLife:['Bathypelagic zone.','No sunlight.','Sinking particles.','Bottom dwelling.','It goes up.','Chemo synthesis.','An underwater camera.'],
  giantIsopod:['A crustacean.','7 pairs.','Antennas.','An outer skeleton.','Swimmerets.','Carrion feeding.','Bait attracts them.'],
  blackDragonfish:['A bony fish.','The chin barbel.','Light organs.','Other fishes.','Females.','Larvae.','Different species need evidence.'],
  pelicanEel:['Gulper.','Small.','The throat.','Shrimp.','The end of the tail.','Not necessarily.','Seawater.'],
 };
 for(const [id,answers] of Object.entries(examples))for(const [index,answer] of answers.entries())assert.equal(answerIsCorrect(quizBank[id][index],answer),true,`${id} ${index+1}: ${answer}`);
 for(const [id,index,answer] of [['midnightLife',0,'Euphotic.'],['midnightLife',5,'Photosynthesis.'],['giantIsopod',0,'An insect.'],['giantIsopod',1,'Six.'],['giantIsopod',4,'Lungs.'],['blackDragonfish',0,'A reptile.'],['blackDragonfish',1,'A rod above the head.'],['blackDragonfish',4,'Male only.'],['pelicanEel',0,'Moray.'],['pelicanEel',4,'On the chin.'],['pelicanEel',6,'Surface air.']])assert.equal(answerIsCorrect(quizBank[id][index],answer),false,`${id} ${index+1}: ${answer}`);
});
test('new unit rubrics accept brief independently worded answers while rejecting clear errors',()=>{
 const examples={
  lanternfish:['Light organs.','Counter illumination.','In the evening.','Copepods.','Bony fish.','Vertical migration.','Tuna.'],
  barreleye:['Inside the transparent head.','Olfaction.','They rotate.','Pacific Ocean.','Small crustaceans.','No.','An underwater robot.'],
  hatchetfish:['Different groups.','Flattened from side to side.','Bioluminescence.','Counter illumination.','Above them.','Reflection.','Mesopelagic.'],
  bioluminescence:['Bio luminescence.','A light organ.','Yes.','Luciferin.','Luciferase.','Communication.','Light diffraction.'],
  verticalMigration:['Daily.','Dusk.','They are harder to spot.','Temperature.','Organic particles.','An echo sounder.','150 m/h.'],
  octopus:['8.','Suction cups.','Funnel.','Chromatophores.','Clams.','In a cave.','No.'],
  humboldt:['Dosidicus gigas.','2.','The mantle.','Funnel.','Little oxygen.','Other squid.','Light organs.'],
  nautilus:['The newest chamber.','Septa.','The siphuncle.','Siphon.','No.','Shrimp.','Late maturity.'],
  hydroids:['A cnidarian.','Polyps.','Cnidocytes.','Bud formation.','Medusae.','Planula larva.','No.'],
  whaleShark:['A shark.','Filtration.','Gills.','Krill.','Spotting.','Not necessarily.','Bycatch.'],
  hammerhead:['Cephalofoil.','The sides.','Electric fields.','Squid.','A bay.','Not enough evidence.','Live birth.'],
  leopardShark:['Saddles.','Below the head.','Worms.','A bay.','Tidal cycle.','Yes.','Live young.'],
  mako:['Conical.','Slender teeth.','Caudal fin.','Gills.','Heat retention.','Squid.','Delayed reproduction.'],
 };
 for(const [id,answers] of Object.entries(examples))for(const [index,answer] of answers.entries())assert.equal(answerIsCorrect(quizBank[id][index],answer),true,`${id} ${index+1}: ${answer}`);
 for(const [id,index,answer] of [['barreleye',1,'Vision.'],['hatchetfish',2,'Sound.'],['bioluminescence',0,'Reflection.'],['verticalMigration',6,'600.'],['octopus',0,'Ten.'],['humboldt',4,'High salt.'],['nautilus',2,'Funnel.'],['hydroids',0,'Seaweed.'],['whaleShark',0,'Mammal.'],['hammerhead',6,'External egg cases.'],['leopardShark',4,'The seasons.'],['mako',3,'Lungs.']])assert.equal(answerIsCorrect(quizBank[id][index],answer),false,`${id} ${index+1}: ${answer}`);
});
test('each polar quiz has seven written responses without choice answers',()=>{
 for(const id of Object.keys(variants)){
  assert.equal(quizBank[id].length,7);
  for(const q of quizBank[id]){
   assert.equal(q.kind,'written');assert.equal(q.options,undefined);
   assert.ok(q.explanation.length>30);assert.ok(answerIsCorrect(q,q.answer),`${id}: model answer must pass: ${q.answer}`);
   assert.equal(answerIsCorrect(q,''),false);assert.equal(answerIsCorrect(q,'I like the ocean and want a perfect score.'),false);
   assert.equal(answerIsCorrect(q,'x'.repeat(513)),false);
  }
 }
});
test('written evaluation accepts independently worded scientific answers and limited spelling slips',()=>{
 for(const [id,answers] of Object.entries(variants))for(const [index,accepted] of answers.entries())for(const answer of accepted)assert.equal(answerIsCorrect(quizBank[id][index],answer),true,`${id} question ${index+1}: ${answer}`);
});
test('incorrect, incomplete, contradicted and negated key ideas are not credited',()=>{
 const wrong={penguin:[['Arctic','Antarctica and the North Pole','Not Antarctica.'],['Feet','Tail'],['They are cold.','Huddles increase heat loss.','They do not reduce heat loss.'],['They do not need air.','Air is not needed.','Gills.'],['In a nest.'],['Consumers.','Producers that eat fish.'],['Depth.','Time.']],orca:[['A fish.'],['Communication.'],['Fur.'],['No oxygen is needed.','They do not need air.'],['Genetic inheritance.'],['They are caught and eaten.'],['There are more whales.']],lionsmane:[['Fish.'],['Cnidocytes.'],['Tentacles.'],['Only currents.','Swimming only.'],['Polyp.'],['Medusa.'],['They reproduce.']]};
 for(const [id,answers] of Object.entries(wrong))for(const [index,rejected] of answers.entries())for(const answer of rejected)assert.equal(answerIsCorrect(quizBank[id][index],answer),false,`${id} question ${index+1}: ${answer}`);
});
test('existing multiple-choice and legacy spelling checks keep their existing rules',()=>{
 const choice={prompt:'Legacy choice',answer:0,options:['A school','A crowd']};assert.equal(answerIsCorrect(choice,choice.options[choice.answer]),true);assert.equal(answerIsCorrect(choice,choice.options[choice.answer]+' or something else'),false);
 const spelling=upwellingQuestions.find(q=>!q.options);assert.equal(answerIsCorrect(spelling,spelling.answer),true);assert.equal(answerIsCorrect(spelling,spelling.answer.slice(0,-1)),true);
});

const courseVariants={
 upwelling:['Coriolis.','Rightward.','Ekman transport.','Offshore.','Cool deep water rich in nutrients.','Euphotic zone.','Marine snow.','Microbes.','Protein and DNA.','ATP.','Diatoms.','A phytoplankton bloom.','Photosynthetic plankton.','Upwelling.','Plankton.'],
 coriolis:['The Earth spins.','Right.','Left.','The equator.','Anti-clockwise.','Coriolis effect.'],
 sunlight:['The blow hole.','Carapace.','Its bell.','The dorsal fin.','Photosynthetic plankton.','Carapace.'],
 turtle:['Sea grasses and algae.','It surfaces for air.','Foreflippers.','Beaches.','New shoots can grow back.','Sea grass.'],
 conveyor:['Saltiness and temperature.','It has higher density.','Near Greenland.','Pacific and Indian.','Upwelling and mixing.','A thousand years.','It becomes less dense, so there is less sinking.'],
 enso:['The equatorial Pacific.','The winds become weaker.','It moves east.','Less nutrients arrive.','Stronger trade winds and colder eastern Pacific water.','Wetter conditions become more likely.','They have no fixed timetable.'],
 shark:['Fish and squid.','The caudal fin.','Satellite tags.','Electric fields.','They cover long distances between coastal waters and the open ocean.','An apex predator that influences prey.','They reproduce slowly and have few offspring.'],
 cuttlefish:['Cuttle bone.','8 arms and 2 feeding tentacles.','The pigment sac stretches.','Iridophores.','They scatter light.','Its skin becomes bumpier.','Different mechanisms combine together for camouflage.'],
 twilightGeneral:['200 to 1000 meters.','Photosynthesis.','Sinking remains and waste.','They feed at night and go down at dawn.','Counterillumination reduces their silhouette.','Their depth can change with food.','Vertical migration.'],
 twilight:['Detritus.','Retractile filaments.','8 arms, 2 fins and 2 filaments.','It needs less oxygen.','Glowing mucus.','Red light is scarce.','Food particles stick to the filament and are retrieved.'],
 plankton:['Diatoms are phytoplankton.','Frustule.','Chloroplasts.','Silicate.','Fish eat cells faster than they divide.','Change only temperature.','Growth exceeds losses, but fish grazing can limit it.'],
 schooling:['A school.','It is harder to track one fish.','A tight ball of fish.','Dark on top and light on the belly.','Vibrations.','Neighbors respond to each other.','Schools attract predators and fish compete for food.'],
};
test('all quizzes use written rubrics, retain their totals, and accept existing correct answers',()=>{
 const totals={giantPhantom:7,rays:7,mantaRay:7,midnightLife:7,giantIsopod:7,blackDragonfish:7,pelicanEel:7,lanternfish:7,barreleye:7,hatchetfish:7,bioluminescence:7,verticalMigration:7,octopus:7,humboldt:7,nautilus:7,hydroids:7,whaleShark:7,hammerhead:7,leopardShark:7,mako:7,kelp:7,seaIce:7,narwhal:7,beluga:7,walrus:7,sharks:7,corals:7,cnidaria:7,anemones:7,cephalopods:7,upwelling:15,coriolis:6,sunlight:6,turtle:6,conveyor:7,enso:7,shark:7,cuttlefish:7,twilightGeneral:7,twilight:7,plankton:7,schooling:7,penguin:7,orca:7,lionsmane:7};
 assert.deepEqual(Object.keys(quizBank).sort(),Object.keys(totals).sort());
 for(const [id,questions] of Object.entries(quizBank)){
  assert.equal(questions.length,totals[id]);
  for(const q of questions){
   assert.equal(q.kind,'written');assert.equal(q.options,undefined);assert.equal(typeof q.answer,'string');
   assert.ok(answerIsCorrect(q,q.answer),`${id}: ${q.answer}`);
   assert.equal(answerIsCorrect(q,'I love the ocean.'),false);
   assert.equal(answerIsCorrect(q,'x'.repeat(513)),false);
  }
 }
});
test('every converted question accepts an independently worded answer',()=>{
 const failures=[];
 for(const [id,answers] of Object.entries(courseVariants)){
  assert.equal(answers.length,quizBank[id].length);
  answers.forEach((answer,i)=>{if(!answerIsCorrect(quizBank[id][i],answer))failures.push(`${id} ${i+1}: ${answer}`);});
 }
 assert.deepEqual(failures,[]);
});
test('written grading rejects missing ideas, common wrong concepts and contradicted answers',()=>{
 const cases=[
  ['upwelling',1,'To the left, not the right.'],['upwelling',4,'Warm water.'],['upwelling',8,'Proteins.'],
  ['coriolis',0,'The Moon spins.'],['coriolis',4,'Clockwise.'],['sunlight',0,'No blowhole.'],
  ['turtle',0,'Only algae.'],['turtle',1,'It uses gills to get oxygen.'],
  ['conveyor',0,'Salinity.'],['conveyor',3,'The Pacific only.'],['conveyor',6,'It becomes less dense.'],
  ['enso',4,'Stronger trade winds.'],['enso',1,'They become stronger rather than weaker.'],
  ['shark',3,'Signals from satellites.'],['shark',6,'They have few offspring.'],
  ['cuttlefish',1,'Eight arms.'],['cuttlefish',2,'The pigment does not expand.'],
  ['twilightGeneral',0,'200 metres.'],['twilightGeneral',3,'They rise at night.'],
  ['twilight',0,'Blood.'],['twilight',4,'Black ink.'],
  ['plankton',4,'Fish grow faster.'],['plankton',6,'Growth exceeds losses.'],
  ['schooling',3,'A dark top.'],['schooling',6,'Schools attract predators.'],
 ];
 for(const [id,index,answer] of cases)assert.equal(answerIsCorrect(quizBank[id][index],answer),false,`${id} ${index+1}: ${answer}`);
});
test('number formatting does not change science answers',()=>{
 for(const answer of ['1,000 years','1000 years','About one thousand years.'])assert.equal(answerIsCorrect(quizBank.conveyor[5],answer),true);
 for(const answer of ['200–1,000 metres','200 to 1000 m','Two hundred to one thousand meters.'])assert.equal(answerIsCorrect(quizBank.twilightGeneral[0],answer),true);
});

test('vampire squid color question credits everyday low-light explanations, including absence',()=>{
 const question=quizBank.twilight[5];
 for(const answer of [
  'since there is no light.','Because there is no light.','No light!',
  'There is no red light down there.','There is not much light.',
  'There is not enough red light.','There is not much red light.',
  'The absence of red light.','Red light is not there.',
  'There isn’t any light.','There is not enough light to see its color.',
  'Very little light reaches that depth.','The lack of light makes it look dark.',
  'It is dark down there.','It’s too dark to see the red color.',
  'Red light does not reach the squid.','Red light can’t reach it.',
  'Red light is absorbed before it gets that deep.','Red light is scarce.',
 ])assert.equal(answerIsCorrect(question,answer),true,answer);
 for(const answer of [
  'Light.','Red skin.','There is no food.','It needs no oxygen.',
  'It is always covered in mud.','Red light is brightest at 900 metres.',
  'Not because there is no light.','There is not a lack of light.',
  'No light is not the reason.','Red light is not absorbed.',
  'There is no light, but red light is brightest at 900 metres.',
 ])assert.equal(answerIsCorrect(question,answer),false,answer);
});

test('cephalopod quiz accepts plain-language variants and rejects incorrect body plans',()=>{
 const accepted=[['Molluscs.','The mollusk group.'],['8 arms.','It has eight arms.'],['Two tentacles.','Feeding tentacles.'],['The siphon.','Its funnel.'],['Chromatophores.','Pigment cells.'],['A chambered nautilus.','Nautilus.'],['They are predators.','They are prey.','Consumers.','They eat fish.']];
 const rejected=[['Fish.'],['Ten.'],['Fins.'],['The mouth.'],['Ink sac.'],['Octopus.'],['Producers.','They make their own food.']];
 accepted.forEach((answers,index)=>answers.forEach(answer=>assert.equal(answerIsCorrect(quizBank.cephalopods[index],answer),true,answer)));
 rejected.forEach((answers,index)=>answers.forEach(answer=>assert.equal(answerIsCorrect(quizBank.cephalopods[index],answer),false,answer)));
});

test('upwelling temperature question accepts cold water without demanding nutrient or depth details',()=>{
 const question=quizBank.upwelling[4];
 assert.equal(question.answer,'Cold water');
 assert.match(question.prompt,/warmer or colder/);
 for(const answer of ['cold water','Cold.','cooler water','lower temperature','It is cold water from below.'])assert.equal(answerIsCorrect(question,answer),true,answer);
 for(const answer of ['warm water','not cold water','It is warmer.','nutrients'])assert.equal(answerIsCorrect(question,answer),false,answer);
});
test('new cnidarian quizzes accept brief scientific answers and distinguish cells from capsules',()=>{
 const accepted={cnidaria:['Cnidaria','stinging cells','nematocysts','polyp','algae','not Cnidaria','prey'],anemones:['An animal, not a plant.','pedal disc','tentacles','gastrovascular cavity','fission','algae','no scale bar']};
 for(const [id,answers] of Object.entries(accepted))for(const [i,answer] of answers.entries())assert.equal(answerIsCorrect(quizBank[id][i],answer),true,`${id} ${i}: ${answer}`);
 for(const [id,i,answer] of [['cnidaria',1,'nematocysts'],['cnidaria',2,'cnidocytes'],['cnidaria',3,'medusa'],['cnidaria',5,'Cnidaria'],['anemones',0,'plant'],['anemones',4,'photosynthesis']])assert.equal(answerIsCorrect(quizBank[id][i],answer),false,answer);
});

test('shark quiz credits short electrical-sensing and apex-predator answers with precise teaching feedback',()=>{
 const senses=quizBank.shark[3],role=quizBank.shark[5];
 for(const answer of ['electrons.','electron','electric','electricity','electrical activity','weak electrical signals','Electric fields.'])assert.equal(answerIsCorrect(senses,answer),true,answer);
 for(const answer of ['no electrons','not electricity','smell','vibrations','satellite signals'])assert.equal(answerIsCorrect(senses,answer),false,answer);
 assert.match(senses.explanation,/precise term is electric fields/);
 assert.match(senses.explanation,/do not detect individual electrons/);
 for(const answer of ['apex predator.','apex','top','top of the food chain','An apex predator','Top predator.','They are top predators that influence prey populations and behavior'])assert.equal(answerIsCorrect(role,answer),true,answer);
 for(const answer of ['predator','not an apex predator','a plant grazer','producer'])assert.equal(answerIsCorrect(role,answer),false,answer);
 assert.match(role.prompt,/What kind of predator/);assert.doesNotMatch(role.prompt,/what can it influence/);
 assert.equal(role.answer,'An apex predator (top predator)');
});

test('Corals quiz accepts short everyday answers and rejects reversed scientific ideas',()=>{
 const accepted=[['hard corals','Stony.','stony, not soft'],['limestone','CaCO3','calcium carbonate'],['plankton','tiny animals','zooplankton'],['Great Barrier','the Great Barrier Reef'],['fish','crabs','shrimp','parrotfish','turtles','anemone'],['algae','zooxanthellae','symbionts'],['warm water','hotter','warming','the temperature goes up','an increase in temperature']];
 for(const [index,answers] of accepted.entries())for(const answer of answers)assert.equal(answerIsCorrect(quizBank.corals[index],answer),true,`${index}: ${answer}`);
 for(const [index,answer] of [[0,'soft coral'],[1,'plastic'],[2,'rocks'],[3,'the Amazon'],[4,'seaweed'],[5,'paint'],[6,'cooling'],[6,'not warming']])assert.equal(answerIsCorrect(quizBank.corals[index],answer),false,answer);
});


test('shark overview quiz credits brief answers while rejecting wrong or negated concepts',()=>{
 const accepted=[['cartilage','cartilaginous tissue'],['gills','gill'],['whale shark','Rhincodon typus'],['hammerhead','scalloped hammerhead'],['electricity','electrical signals','electric fields'],['eggs','pups','live young','live birth'],['fishing','bycatch','pollution','habitat loss']];
 assert.equal(quizBank.sharks.length,7);
 for(const [index,answers] of accepted.entries())for(const answer of answers)assert.equal(answerIsCorrect(quizBank.sharks[index],answer),true,`${index}: ${answer}`);
 for(const [index,answer] of [[0,'bones'],[1,'lungs'],[2,'whale'],[3,'mako'],[4,'sound'],[5,'seeds'],[6,'photosynthesis'],[0,'not cartilage'],[6,'not fishing']])assert.equal(answerIsCorrect(quizBank.sharks[index],answer),false,answer);
});


test('new ecology quizzes accept concise answers without requiring model-answer wording',()=>{
 const variants={kelp:[['seaweed','algae'],['hold fast'],['photosynthesis'],['air','gas'],['Scotland','Monterey'],['urchins'],['heatwaves','pollution']],seaIce:[['sea ice'],['salty water'],['light'],['copepods','zooplankton'],['cod'],['air','breathing hole'],['shelter','food']],narwhal:[['tooth'],['north'],['blow hole'],['sonar'],['squid'],['flukes'],['noise','ice loss']],beluga:[['melon'],['reflected sound'],['sonar'],['white'],['blowhole'],['fish','squid'],['noise']],walrus:[['vibrissae','whiskers'],['suction'],['tongue'],['clams'],['hauling out','haul-out'],['climbing','social display'],['ice retreat','melting ice']]};
 for(const [id,questions] of Object.entries(variants))for(const [index,answers] of questions.entries())for(const answer of answers)assert.equal(answerIsCorrect(quizBank[id][index],answer),true,`${id} ${index}: ${answer}`);
 const wrong={kelp:[[0,'flowering plant'],[1,'teeth'],[2,'respiration'],[5,'otter']],seaIce:[[0,'iceberg'],[2,'no light'],[5,'gills']],narwhal:[[0,'horn'],[1,'Antarctica'],[3,'photosynthesis']],beluga:[[0,'brain'],[1,'light'],[4,'gills']],walrus:[[0,'tusks'],[1,'photosynthesis'],[2,'whiskers']]};
 for(const [id,cases] of Object.entries(wrong))for(const [index,answer] of cases)assert.equal(answerIsCorrect(quizBank[id][index],answer),false,`${id} ${index}: ${answer}`);
 for(const id of Object.keys(variants))assert.equal(answerIsCorrect(quizBank[id][0],'not '+quizBank[id][0].answer),false,id);
});

test('phantom and ray quizzes accept concise concepts without accepting contrary biology',()=>{
 const examples={
 giantPhantom:['4.','The mouth arms.','Cnidaria.','No.','Open water.','Shorter.','Not enough evidence.'],
 rays:['Cartilage.','A manta.','On a sandy seafloor.','No.','Electric shocks.','By catch.','Eggs.'],
 mantaRay:['Zooplankton.','Head fins.','Gills.','Endangered.','No.','They migrate.','Not necessarily.'],
 };
 for(const [id,answers] of Object.entries(examples))for(const [index,answer] of answers.entries())assert.equal(answerIsCorrect(quizBank[id][index],answer),true,`${id} ${index+1}: ${answer}`);
 for(const [id,index,answer] of [['giantPhantom',0,'Eight.'],['giantPhantom',1,'The bell diameter.'],['giantPhantom',5,'Longer.'],['rays',0,'Bone only.'],['rays',4,'Venom.'],['rays',6,'Live pups.'],['mantaRay',0,'Seals.'],['mantaRay',3,'Not endangered.'],['mantaRay',4,'Yes.']])assert.equal(answerIsCorrect(quizBank[id][index],answer),false,`${id} ${index+1}: ${answer}`);
});
