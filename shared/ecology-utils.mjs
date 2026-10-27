// New units reuse the course's reading, diagram, grading and account mechanics.
export const section=(heading,paragraphs,sources=[])=>({heading,paragraphs,sources});
export const written=(prompt,answer,alternatives,explanation,rejectConcepts=[])=>({kind:'written',prompt,answer,concepts:[alternatives],acceptedPhrases:[],explanation,rejectConcepts});
/**
 * @param {{id:string,title:string,readingTitle?:string,deck:string,question:string,abstract:string,advancedAbstract:string,goals:string[],advancedGoals:string[],terms:{word:string,definition:string}[],recap:string,check:{question:string,explanation:string},application:string,sources:string[],foundation:{heading:string,paragraphs:string[],sources?:string[]}[],advanced:{heading:string,paragraphs:string[],sources?:string[]}[],diagram:{title:string,image:string,alt:string,note:string,key:string[][]},questions:{kind:string,prompt:string,answer:string,concepts:string[][],acceptedPhrases:string[],explanation:string,rejectConcepts:string[]}[]} data
 */
export function ecologyLesson(data){
 const {id,title,readingTitle,deck,question,abstract,advancedAbstract,goals,advancedGoals,terms,recap,check,application,sources,foundation,advanced,diagram,questions}=data;
 return {id,title,deck,diagram,questions,intro:{sections:foundation},dive:{title:`${title}: mechanisms and evidence`,deck,abstract:advancedAbstract,terms,sections:advanced,question:application},guide:{title:readingTitle||title,question,abstract,advancedAbstract,goals,advancedGoals,terms,recap,check,application,sources}};
}
