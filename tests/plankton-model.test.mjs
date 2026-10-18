import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialPlanktonState,stepPlankton,addNutrient} from '../shared/plankton-model.mjs';
const after=(state,days)=>{for(let i=0;i<days;i++)state=stepPlankton(state);return state;};
test('nutrient exhaustion prevents division without creating negative inventories',()=>{
 const start={...initialPlanktonState(),nitrogen:0,phosphorus:0};const end=after(start,20);
 assert.ok(end.diatoms<start.diatoms);assert.ok(end.flagellates<start.flagellates);
 assert.equal(end.nitrogen,0);assert.equal(end.phosphorus,0);
 const empty={...initialPlanktonState(),diatoms:0,flagellates:0};
 assert.deepEqual({...stepPlankton(empty),day:0},empty);
});
test('silicate depletion constrains diatoms while the other group can still divide',()=>{
 const start={...initialPlanktonState(),silicate:0};const limited=stepPlankton(start);
 assert.ok(limited.diatoms<start.diatoms);assert.ok(limited.flagellates>start.flagellates);
 assert.ok(stepPlankton(addNutrient(start,'silicate')).diatoms>limited.diatoms);
});
test('direct fish grazing reduces both populations under otherwise identical conditions',()=>{
 const start=initialPlanktonState();const ungrazed=after(start,10),grazed=after({...start,fish:8},10);
 assert.ok(grazed.diatoms<ungrazed.diatoms);assert.ok(grazed.flagellates<ungrazed.flagellates);
 assert.equal(grazed.fish,8);
});
test('temperature responses distinguish example groups instead of always rewarding heat',()=>{
 const start={...initialPlanktonState(),nitrogen:60,phosphorus:60,silicate:60};
 const cool=stepPlankton({...start,temperature:16}),warm=stepPlankton({...start,temperature:30});
 assert.ok(cool.diatoms>warm.diatoms);assert.ok(warm.flagellates>cool.flagellates);
});
test('long experiments with repeated nutrient doses stay finite and nonnegative',()=>{
 for(const temperature of [5,16,24,35])for(const fish of [0,12]){
  let state={...initialPlanktonState(),temperature,fish};
  for(let day=0;day<500;day++){
   if(day%9===0)for(const mineral of ['nitrogen','phosphorus','silicate'])state=addNutrient(state,mineral);
   state=stepPlankton(state);
   for(const key of ['diatoms','flagellates','nitrogen','phosphorus','silicate']){assert.ok(Number.isFinite(state[key]));assert.ok(state[key]>=0);}
   assert.ok(state.diatoms+state.flagellates<=600);
  }
 }
});
test('steps and capped nutrient additions preserve previous states for chart comparisons',()=>{
 const start=initialPlanktonState(),copy={...start};stepPlankton(start);addNutrient(start,'nitrogen');assert.deepEqual(start,copy);
 const full={...start,nitrogen:59};assert.equal(addNutrient(full,'nitrogen').nitrogen,60);
 assert.equal(addNutrient(start,'unknown'),start);
});
