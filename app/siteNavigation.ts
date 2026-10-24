"use client";
import {useSyncExternalStore} from 'react';
export type SitePage = 'learn'|'about'|'contact'|'sign-in'|'sign-up';
const eventName='marine-site-navigation';
function subscribe(notify:()=>void){
 window.addEventListener('popstate',notify);window.addEventListener(eventName,notify);
 return()=>{window.removeEventListener('popstate',notify);window.removeEventListener(eventName,notify);};
}
function snapshot(){return window.location.pathname+window.location.search;}
export function navigateSite(href:string,{replace=false}:{replace?:boolean}={}){
 if(href!==snapshot()+window.location.hash){window.history[replace?'replaceState':'pushState'](null,'',href);window.dispatchEvent(new Event(eventName));}
 window.scrollTo({top:0,left:0,behavior:'instant'});
}
export function useSiteNavigation(){
 const url=useSyncExternalStore(subscribe,snapshot,()=>'/');
 const pathname=url.split('?')[0].replace(/\/$/,'')||'/';
 const page:SitePage=pathname==='/about'?'about':pathname==='/contact'?'contact':pathname==='/sign-in'?'sign-in':pathname==='/sign-up'?'sign-up':'learn';
 return {page,search:url.includes('?')?url.slice(url.indexOf('?')):''};
}
