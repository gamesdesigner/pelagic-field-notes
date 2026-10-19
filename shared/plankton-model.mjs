// Individual-cell classroom model. Rates and limitations: design/plankton-growth-research.md.
export const CELL_LIMIT = 5000;
export const CELLS_PER_SYMBOL = 50;
// The last symbol is a partial group; its weight keeps displayed totals exact.
export function planktonSymbolWeights(count){
 if(!Number.isInteger(count)||count<0||count>CELL_LIMIT)throw new RangeError('Invalid cell count');
 return Array.from({length:Math.ceil(count/CELLS_PER_SYMBOL)},(_,i)=>Math.min(CELLS_PER_SYMBOL,count-i*CELLS_PER_SYMBOL));
}
export const nutrientDoses = { nitrogen:10, phosphorus:3, silicate:10 };
// Rescale the illustrative budgets so a 50-cell symbol has the former unit cost.
export const cellCosts = { nitrogen:.18/50, phosphorus:.045/50, silicate:.16/50 };
const groups = ['diatoms','flagellates'];
const minerals = Object.keys(nutrientDoses);
const emptyStores = () => ({nitrogen:0,phosphorus:0,silicate:0});
export const initialPlanktonState = () => ({
 day:0,diatoms:1,flagellates:1,nitrogen:14,phosphorus:5,silicate:12,temperature:18,fish:0,
 cycles:{diatoms:[0],flagellates:[0]},stores:{diatoms:emptyStores(),flagellates:emptyStores()},
 lossCredit:{diatoms:0,flagellates:0},births:0,losses:0,
});
export function addNutrient(state,nutrient) {
 if(!Object.hasOwn(nutrientDoses,nutrient))return state;
 return {...state,[nutrient]:Math.min(60,state[nutrient]+nutrientDoses[nutrient])};
}
// mu is the natural-log specific growth rate, NOT doublings per day.
export function growthRate(group,temperature) {
 if(group==='diatoms'){
  // Nutrient-replete T. pseudonana: .41, 1.28, .66 d^-1 at 4, 17, 28 C (Gleich et al. 2020).
  if(temperature<=17)return Math.max(0,.41+(temperature-4)*(1.28-.41)/13);
  if(temperature<=28)return 1.28+(temperature-17)*(.66-1.28)/11;
  return Math.max(0,.66*(35-temperature)/7);
 }
 // .51 d^-1 is within Matsuda et al.'s .47-.55 range; thermal shape is illustrative.
 return .51*Math.exp(-(((temperature-22)/12)**2));
}
function copyState(state){
 return {...state,cycles:Object.fromEntries(groups.map(g=>[g,state.cycles[g].length===state[g]?[...state.cycles[g]]:Array(state[g]).fill(0)])),
  stores:{diatoms:{...state.stores.diatoms},flagellates:{...state.stores.flagellates}},lossCredit:{...state.lossCredit}};
}
function useResource(state,group,mineral,amount){
 const stored=Math.min(state.stores[group][mineral],amount);
 state.stores[group][mineral]-=stored;state[mineral]=Math.max(0,state[mineral]-(amount-stored));
}
function removeCells(state,group,amount){
 const before=state[group],removed=Math.min(before,amount);if(!removed)return;
 state[group]-=removed;state.cycles[group].splice(-removed);
 for(const mineral of minerals)state.stores[group][mineral]*=state[group]/before;
 state.lossCredit[group]*=state[group]/before;
}
// A bite removes the exact number of cells represented by its targeted symbol.
export function consumePlankton(state,group,amount=1) {
 if(!groups.includes(group)||!Number.isInteger(amount)||amount<=0||!state[group])return state;
 const next=copyState(state);removeCells(next,group,amount);return next;
}
// A visual patch encounter transfers dissolved nutrients into finite cellular reserves.
export function absorbNutrient(state,group,mineral,cells=1){
 if(!groups.includes(group)||!Object.hasOwn(nutrientDoses,mineral)||!state[group]||!Number.isInteger(cells)||cells<1||cells>CELLS_PER_SYMBOL||(group==='flagellates'&&mineral==='silicate'))return state;
 const room=Math.max(0,state[group]*cellCosts[mineral]*2-state.stores[group][mineral]);
 const amount=Math.min(state[mineral],room,cellCosts[mineral]*.5*Math.min(cells,state[group]));
 if(amount<=1e-9)return state;
 return {...state,[mineral]:state[mineral]-amount,stores:{...state.stores,[group]:{...state.stores[group],[mineral]:state.stores[group][mineral]+amount}}};
}
export function stepPlankton(state){
 const next=copyState(state);
 // Hourly substeps allow daughters to divide again: exponential reproduction, not a fixed +1.
 for(let hour=0;hour<24;hour++)for(const group of groups){
  const count=next[group];if(!count)continue;
  const required=group==='diatoms'?minerals:['nitrogen','phosphorus'];
  const available=m=>next[m]+next.stores[group][m];
  const limitation=Math.min(...required.map(m=>available(m)/(available(m)+({nitrogen:.8,phosphorus:.2,silicate:.6}[m]))));
  let progress=growthRate(group,state.temperature)/Math.LN2*limitation/24;
  if(count>=CELL_LIMIT)progress=0;
  // A mature cell waits for space without repeatedly spending a full growth budget.
  const increments=next.cycles[group].map(phase=>Math.min(progress,Math.max(0,1-phase)));
  const total=increments.reduce((sum,value)=>sum+value,0);
  const scale=Math.min(1,...required.map(m=>total?available(m)/(total*cellCosts[m]):1));
  for(const m of required)useResource(next,group,m,total*scale*cellCosts[m]);
  const cycles=next.cycles[group].map((phase,i)=>Math.min(1,phase+increments[i]*scale));
  // Process only cells present at this hour's start, never newly born daughters twice.
  const daughters=[];let births=0;
  for(const phase of cycles){
   if(phase>=1-1e-10&&count+births<CELL_LIMIT){daughters.push(0,0);births++;}
   else daughters.push(phase);
  }
  next.cycles[group]=daughters;next[group]=daughters.length;next.births+=births;
  // Maintenance and stress losses are classroom assumptions, not universal measured rates.
  for(const m of required)useResource(next,group,m,Math.min(available(m),next[group]*cellCosts[m]*.012/24));
  const mortality=.015+.18*(1-limitation)+Math.max(0,state.temperature-30)*.04;
  next.lossCredit[group]+=next[group]*(-Math.expm1(-mortality/24));
  const deaths=Math.min(next[group],Math.floor(next.lossCredit[group]));
  if(deaths){next.lossCredit[group]-=deaths;removeCells(next,group,deaths);next.losses+=deaths;}
 }
 return {...next,day:state.day+1};
}
