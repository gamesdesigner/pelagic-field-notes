// Shared by the browser and API: a checked answer is immutable within an attempt.
export const quizPasses=(score,total)=>total>0&&score*100>=total*70;
export function validQuizSession(state,total){
 if(!state||typeof state.attemptId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(state.attemptId)||!Number.isSafeInteger(state.revision)||state.revision<1||!Number.isInteger(state.index)||state.index<0||state.index>total||typeof state.submitted!=='boolean'||typeof state.selection!=='string'||state.selection.length>512||!Array.isArray(state.answers)||state.answers.some(answer=>typeof answer!=='string'||!answer.trim()||answer.length>512))return false;
 if(state.index===total)return !state.submitted&&state.selection===''&&state.answers.length===total;
 return state.answers.length===state.index+(state.submitted?1:0)&&(!state.submitted||state.selection===state.answers[state.index]);
}
export function restoreQuizSession(saved,cached,total){
 if(!validQuizSession(cached?.state,total))return null;
 if(!saved)return cached.previousAttemptId===null?cached:null;
 if(cached.state.attemptId===saved.attemptId)return cached.state.revision>saved.revision?cached:null;
 return cached.previousAttemptId===saved.attemptId?cached:null;
}
