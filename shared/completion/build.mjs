import {ecologyLesson,section} from '../ecology-utils.mjs';
import {twilightCore,cephalopodCore,sharkCore} from './core.mjs';
import {completionWorkshops} from './workshops.mjs';
export const pair=(heading,basic,detail,sources)=>({heading,basic,detail:Array.isArray(detail)?detail:[detail],sources});
export function completeLesson(data){
 const {pairs,group,science=[],...rest}=data;
 const core=group==='twilight'?twilightCore:group==='cephalopod'?cephalopodCore:group==='shark'?sharkCore:[];
 const workshop=completionWorkshops[rest.id];
 return ecologyLesson({...rest,foundation:[...pairs.map(p=>section(p.heading,[p.basic],p.sources)),...(workshop?.basic?[workshop.basic]:[])],advanced:[...pairs.map(p=>section(p.heading,[p.basic,...p.detail],p.sources)),...core,...science,...(workshop?.basic?[workshop.basic]:[]),...(workshop?[workshop.advanced]:[])]});
}
