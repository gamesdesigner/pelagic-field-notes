// A transparent short-answer rubric, shared by the browser and server. This is
// concept/phrase matching, not an unrestricted essay or AI grading service.
export const isWrittenQuestion=question=>question?.kind==='written';
function tokens(text){
 return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'").replace(/(?<=\d),(?=\d)/g,'')
  .replace(/\b(can't|cannot)\b/g,'can not').replace(/\bwon't\b/g,'will not').replace(/n't\b/g,' not')
  .replace(/[.!?;,]/g,' | ').match(/[a-z0-9]+|\|/g)||[];
}
// One edit is tolerated in longer scientific terms. Short terms stay exact so
// distinct concepts such as fish/fins and oral/orca cannot become equivalents.
function sameWord(actual,expected){
 if(actual===expected)return true;
 if(expected.length<6||actual.length<5||Math.abs(actual.length-expected.length)>1)return false;
 let i=0,j=0,edits=0;
 while(i<actual.length&&j<expected.length){
  if(actual[i]===expected[j]){i++;j++;continue;}
  if(++edits>1)return false;
  if(actual.length>=expected.length)i++;
  if(expected.length>=actual.length)j++;
 }
 return edits+(i<actual.length||j<expected.length?1:0)<=1;
}
function positivePhrase(answer,phrase){
 const wanted=tokens(phrase).filter(token=>token!=='|');
 if(!wanted.length)return false;
 for(let i=0;i<=answer.length-wanted.length;i++){
  if(!wanted.every((word,j)=>sameWord(answer[i+j],word)))continue;
  const before=answer.slice(Math.max(0,i-5),i);
  const boundary=before.findLastIndex(word=>['|','but','however','yet'].includes(word));
  const context=before.slice(boundary+1);
  if(context.some(word=>['no','not','never','without'].includes(word)))continue;
  if(context.join(' ').endsWith('rather than')||context.join(' ').endsWith('rather than the')||context.join(' ').endsWith('instead of')||context.join(' ').endsWith('instead of the'))continue;
  const after=answer.slice(i+wanted.length,i+wanted.length+3);
  if(['is','are','was','were','does','do','can','should'].includes(after[0])&&['not','never'].includes(after[1]))continue;
  return true;
 }
 return false;
}
export function writtenAnswerIsCorrect(question,answer){
 if(typeof answer!=='string'||!answer.trim()||answer.length>512)return false;
 const words=tokens(answer);
 if((question.rejectConcepts||[]).some(phrase=>positivePhrase(words,phrase)))return false;
 if((question.acceptedPhrases||[]).some(phrase=>positivePhrase(words,phrase)))return true;
 return !!question.concepts?.length&&question.concepts.every(group=>group.some(phrase=>positivePhrase(words,phrase)));
}
