/** A teaching playback, not a prediction of biological timing. */
export const stingStages = [
  {at:0, title:'Ready', text:'A cnidocyte is a whole stinging cell. Inside it, the nematocyst capsule holds a tightly packed, inverted thread.'},
  {at:.16, title:'Contact', text:'Contact bends the sensory hair, or cnidocil. Mechanical and chemical information can help regulate discharge; contact here represents a successful trigger.'},
  {at:.34, title:'Capsule opens', text:'The capsule opening releases the thread. Stored energy drives discharge; the thick base begins to turn outward.'},
  {at:.62, title:'Thread everts', text:'The hollow thread turns inside out as it extends, like an inside-out sleeve. In this penetrating type, it enters prey tissue and delivers venom.'},
  {at:1, title:'Spent', text:'The extended thread stays connected to its capsule. This capsule cannot fire again. The animal must replace used stinging cells; replay only reviews the event.'},
];

export function newStingCell() { return {fired:false, progress:0, playing:false}; }

/** @param {ReturnType<typeof newStingCell>} state
 * @param {{type:string, amount?:number, progress?:number, manual?:boolean}} action */
export function stingReducer(state, action) {
  switch (action.type) {
    case 'trigger':
      return state.fired ? state : {fired:true, progress:action.manual ? .16 : 0, playing:!action.manual};
    case 'tick': {
      if (!state.playing || !Number.isFinite(action.amount) || action.amount <= 0) return state;
      const progress = Math.min(1, state.progress + action.amount);
      return {...state, progress, playing:progress < 1};
    }
    case 'pause': return {...state, playing:false};
    case 'resume': return state.fired && state.progress < 1 ? {...state, playing:true} : state;
    case 'seek': return state.fired && Number.isFinite(action.progress)
      ? {...state, progress:Math.max(0, Math.min(1, action.progress)), playing:false} : state;
    case 'replay': return state.fired ? {...state, progress:0, playing:!action.manual} : state;
    case 'new-cell': return newStingCell();
    default: return state;
  }
}

export function stingStageAt(progress) {
  if (progress >= 1) return 4;
  if (progress >= .62) return 3;
  if (progress >= .34) return 2;
  if (progress >= .12) return 1;
  return 0;
}
