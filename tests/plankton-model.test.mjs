import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialPlanktonState,stepPlankton,addNutrient,consumePlankton,absorbNutrient,growthRate,CELL_LIMIT} from '../shared/plankton-model.mjs';
const after=(state,days)=>{for(let i=0;i<days;i++)state=stepPlankton(state);return state;};
const rich=()=>({...initialPlanktonState(),nitrogen:60,phosphorus:60,silicate:60,temperature:17});
test('tank starts with exactly one actual cell of each kind',()=>{
 const s=initialPlanktonState();assert.equal(s.diatoms,1);assert.equal(s.flagellates,1);
 assert.equal(s.cycles.diatoms.length,1);assert.equal(s.cycles.flagellates.length,1);assert.equal(CELL_LIMIT,50);
});
test('published rates use natural-log units and the correct doubling conversion',()=>{
 for(const [t,mu] of [[4,.41],[17,1.28],[28,.66]])assert.ok(Math.abs(growthRate('diatoms',t)-mu)<1e-10);
 assert.equal(growthRate('flagellates',22),.51);
 assert.ok(Math.abs(24*Math.LN2/1.28-13)<.01);
});
test('successive generations multiply instead of adding a fixed number each day',()=>{
 let s=rich();const counts=[];for(let i=0;i<3;i++){s=stepPlankton(s);counts.push(s.diatoms);}
 assert.deepEqual(counts,[2,8,32]);assert.ok(counts[2]-counts[1]>counts[1]-counts[0]);
 assert.ok(s.births>20);
});
test('division halts without required nutrients; extinct groups never spontaneously respawn',()=>{
 const start={...initialPlanktonState(),nitrogen:0,phosphorus:0};const end=after(start,45);
 assert.equal(end.births,0);assert.equal(end.diatoms,0);assert.equal(end.flagellates,0);
 assert.equal(end.nitrogen,0);assert.equal(end.phosphorus,0);
 let empty=consumePlankton(consumePlankton(initialPlanktonState(),'diatoms'),'flagellates');
 for(const key of ['nitrogen','phosphorus','silicate'])empty=addNutrient(empty,key);
 const later=after(empty,30);assert.equal(later.diatoms,0);assert.equal(later.flagellates,0);
 assert.deepEqual(later.cycles,{diatoms:[],flagellates:[]});
});
test('only diatom division depends on silicate',()=>{
 const start={...rich(),silicate:0};const limited=after(start,4);
 assert.equal(limited.diatoms,1);assert.ok(limited.flagellates>1);
 assert.ok(after(addNutrient(start,'silicate'),4).diatoms>limited.diatoms);
 assert.equal(absorbNutrient(start,'flagellates','silicate'),start);
});
test('thermal responses are not an always-faster-when-hot rule',()=>{
 const cool=after({...rich(),temperature:17},3),hot=after({...rich(),temperature:35},3);
 assert.ok(cool.diatoms>hot.diatoms);assert.ok(growthRate('flagellates',22)>growthRate('flagellates',35));
});
test('long replenished experiments have integer populations with a strict cap of 50 each',()=>{
 let reachedD=false,reachedF=false;
 for(const temperature of [5,17,22,28,35]){
  let state={...rich(),temperature};
  for(let day=0;day<500;day++){
   for(const mineral of ['nitrogen','phosphorus','silicate'])state=addNutrient(state,mineral);
   state=stepPlankton(state);
   for(const group of ['diatoms','flagellates']){
    assert.ok(Number.isInteger(state[group]));assert.ok(state[group]>=0&&state[group]<=50);
    assert.equal(state.cycles[group].length,state[group]);assert.ok(state.cycles[group].every(p=>p>=0&&p<=1));
    for(const amount of Object.values(state.stores[group]))assert.ok(Number.isFinite(amount)&&amount>=0);
   }
   for(const key of ['nitrogen','phosphorus','silicate'])assert.ok(Number.isFinite(state[key])&&state[key]>=0&&state[key]<=60);
   reachedD ||= state.diatoms===50;reachedF ||= state.flagellates===50;
  }
 }
 assert.ok(reachedD&&reachedF);
});
test('a visible fish capture removes exactly one cell and its cell-cycle entry',()=>{
 const start=after(rich(),2);const caught=consumePlankton(start,'diatoms');
 assert.equal(caught.diatoms,start.diatoms-1);assert.equal(caught.flagellates,start.flagellates);
 assert.equal(caught.cycles.diatoms.length,caught.diatoms);assert.equal(start.diatoms,8);
 assert.equal(consumePlankton(start,'diatoms',100).diatoms,0);
 for(const amount of [NaN,Infinity,.5,0,-1])assert.equal(consumePlankton(start,'diatoms',amount),start);
 assert.equal(consumePlankton(start,'fish'),start);
 // Fish are handled by actual collisions, never subtracted a second time in a daily step.
 assert.deepEqual(stepPlankton({...start,fish:12}),{...stepPlankton(start),fish:12});
});
test('patch uptake conserves nutrient budgets and fills finite living-cell reserves',()=>{
 let state=initialPlanktonState();const budget=state.nitrogen;
 state=absorbNutrient(state,'diatoms','nitrogen');
 assert.ok(state.nitrogen<budget);assert.ok(state.stores.diatoms.nitrogen>0);
 assert.equal(state.nitrogen+state.stores.diatoms.nitrogen,budget);
 for(let i=0;i<100;i++)state=absorbNutrient(state,'diatoms','nitrogen');
 assert.ok(state.stores.diatoms.nitrogen<=.36);assert.ok(state.nitrogen>=0);
 assert.equal(absorbNutrient(state,'missing','nitrogen'),state);
 const extinct=consumePlankton(state,'diatoms');assert.equal(absorbNutrient(extinct,'diatoms','nitrogen'),extinct);
 const dry={...initialPlanktonState(),nitrogen:0};assert.equal(absorbNutrient(dry,'diatoms','nitrogen'),dry);
});
test('saved nutrient reserves can sustain a partial cell cycle after dissolved supply is exhausted',()=>{
 let s=initialPlanktonState();for(const m of ['nitrogen','phosphorus','silicate'])for(let i=0;i<8;i++)s=absorbNutrient(s,'diatoms',m);
 const stored={...s,nitrogen:0,phosphorus:0,silicate:0};const next=stepPlankton(stored);
 assert.ok(next.cycles.diatoms[0]>0);assert.ok(next.stores.diatoms.nitrogen<stored.stores.diatoms.nitrogen);
});
test('steps, uptake and nutrient additions are immutable; inventories are capped',()=>{
 const start=initialPlanktonState(),copy=structuredClone(start);
 stepPlankton(start);absorbNutrient(start,'diatoms','nitrogen');consumePlankton(start,'diatoms');addNutrient(start,'nitrogen');assert.deepEqual(start,copy);
 assert.equal(addNutrient({...start,nitrogen:59},'nitrogen').nitrogen,60);
 assert.equal(addNutrient(start,'unknown'),start);
});

test('mature cells waiting at the display cap do not repeatedly consume a growth budget',()=>{
 const state=rich();state.diatoms=50;state.flagellates=50;state.cycles={diatoms:Array(50).fill(1),flagellates:Array(50).fill(1)};
 const next=stepPlankton(state);assert.ok(state.nitrogen-next.nitrogen<1);assert.ok(state.phosphorus-next.phosphorus<.25);
 assert.ok(next.diatoms<=50&&next.flagellates<=50);
});

test('the whole-cell ledger balances after growth, stress losses and fish captures',()=>{
 let s=rich(),eaten=0;
 for(let day=0;day<90;day++){
  s=stepPlankton(s);
  for(const group of ['diatoms','flagellates'])if(day%3===0&&s[group]){s=consumePlankton(s,group);eaten++;}
  assert.equal(s.diatoms+s.flagellates,2+s.births-s.losses-eaten);
 }
});
