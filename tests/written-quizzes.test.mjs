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
test('all fifteen quizzes use written rubrics, retain their totals, and accept existing correct answers',()=>{
 const totals={upwelling:15,coriolis:6,sunlight:6,turtle:6,conveyor:7,enso:7,shark:7,cuttlefish:7,twilightGeneral:7,twilight:7,plankton:7,schooling:7,penguin:7,orca:7,lionsmane:7};
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
  ['upwelling',1,'To the left, not the right.'],['upwelling',4,'Cold water.'],['upwelling',8,'Proteins.'],
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
