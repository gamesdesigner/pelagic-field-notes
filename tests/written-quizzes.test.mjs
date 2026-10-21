import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quizBank,answerIsCorrect} from '../shared/learning-content.mjs';
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
 const choice=quizBank.schooling[0];assert.equal(answerIsCorrect(choice,choice.options[choice.answer]),true);assert.equal(answerIsCorrect(choice,choice.options[choice.answer]+' or something else'),false);
 const spelling=quizBank.upwelling.find(q=>!q.options);assert.equal(answerIsCorrect(spelling,spelling.answer),true);assert.equal(answerIsCorrect(spelling,spelling.answer.slice(0,-1)),true);
});
