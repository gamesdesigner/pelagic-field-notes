// A transparent short-answer rubric, shared by the browser and server. This is
// concept/phrase matching, not an unrestricted essay or AI grading service.
export const isWrittenQuestion=question=>question?.kind==='written';
import {answerTokens as tokens,wordSpellingForms} from './answer-language.mjs';
// One edit is tolerated in longer scientific terms. Short terms stay exact so
// distinct concepts such as fish/fins and oral/orca cannot become equivalents.
function sameWord(actual,expected){
 if(actual===expected)return true;
 if(/^\d/.test(actual)||/^\d/.test(expected))return false;
 // Magnitudes carry numerical meaning; million and billion are not typos
 // for each other even though they differ by only one letter.
 if(['million','billion','trillion'].includes(actual)||['million','billion','trillion'].includes(expected))return false;
 return wordSpellingForms(expected).some(form=>oneSpellingSlip(actual,form));
}
function oneSpellingSlip(actual,expected){
 if(expected.length<6||actual.length<5||Math.abs(actual.length-expected.length)>1)return false;
 let i=0,j=0,edits=0;
 while(i<actual.length&&j<expected.length){
  if(actual[i]===expected[j]){i++;j++;continue;}
  if(++edits>1)return false;
  if(actual.length===expected.length&&actual[i]===expected[j+1]&&actual[i+1]===expected[j]){i+=2;j+=2;continue;}
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
  if(['is','are','was','were','does','do','can','could','will','would'].includes(wanted.at(-1))&&['not','never'].includes(after[0]))continue;
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
 const matches=groups=>!!groups?.length&&groups.every(group=>group.some(phrase=>positivePhrase(words,phrase)));
 return matches(question.concepts)||(question.alternativeConcepts||[]).some(matches);
}
