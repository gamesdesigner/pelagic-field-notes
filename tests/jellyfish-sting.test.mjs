import test from 'node:test';
import assert from 'node:assert/strict';
import {newStingCell, stingReducer as reduce, stingStageAt, stingStages} from '../shared/jellyfish-sting.mjs';

test('a capsule fires once; seeking and replay cannot recharge it',()=>{
  const fired=reduce(newStingCell(),{type:'trigger'});
  const spent=reduce(fired,{type:'tick',amount:2});
  assert.equal(spent.progress,1);
  assert.equal(spent.playing,false);
  assert.equal(reduce(spent,{type:'trigger'}),spent);
  const rewind=reduce(spent,{type:'seek',progress:0});
  assert.equal(rewind.fired,true);
  assert.equal(reduce(rewind,{type:'trigger'}),rewind);
  const replay=reduce(spent,{type:'replay'});
  assert.equal(replay.fired,true);
  assert.equal(replay.playing,true);
  assert.deepEqual(reduce(spent,{type:'new-cell'}),newStingCell());
});

test('pause, resume and manual discharge preserve the review position',()=>{
  let state=reduce(newStingCell(),{type:'trigger',manual:true});
  assert.equal(state.playing,false);
  assert.equal(stingStageAt(state.progress),1);
  assert.equal(reduce(state,{type:'tick',amount:.2}),state);
  state=reduce(state,{type:'resume'});
  state=reduce(state,{type:'tick',amount:.2});
  assert.equal(stingStageAt(state.progress),2);
  const paused=reduce(state,{type:'pause'});
  assert.equal(reduce(paused,{type:'tick',amount:.2}),paused);
  assert.equal(reduce(state,{type:'replay',manual:true}).playing,false);
});

test('review cannot start before discharge and invalid timeline input is ignored',()=>{
  const ready=newStingCell();
  for(const type of ['resume','replay','seek','tick']) assert.equal(reduce(ready,{type,progress:.7,amount:.5}),ready);
  const fired=reduce(ready,{type:'trigger'});
  assert.equal(reduce(fired,{type:'seek',progress:NaN}),fired);
  assert.equal(reduce(fired,{type:'tick',amount:-1}),fired);
  assert.equal(reduce(fired,{type:'tick',amount:Infinity}),fired);
  assert.equal(reduce(fired,{type:'seek',progress:-10}).progress,0);
  assert.equal(reduce(fired,{type:'seek',progress:10}).progress,1);
});

test('all five still views match their explanations, including spent endpoint',()=>{
  stingStages.forEach((stage,i)=>assert.equal(stingStageAt(stage.at),i));
  assert.equal(stingStageAt(.99),3);
  assert.equal(stingStageAt(1),4);
});
