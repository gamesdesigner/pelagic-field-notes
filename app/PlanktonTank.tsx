"use client";
import {useEffect,useId,useRef,type RefObject} from 'react';
import {initialPlanktonState,cellCosts,planktonSymbolWeights,CELLS_PER_SYMBOL} from '../shared/plankton-model.mjs';
export type NutrientKind='nitrogen'|'phosphorus'|'silicate';
export type NutrientDrop={id:number;kind:NutrientKind;x:number;y:number};
type CellKind='diatoms'|'flagellates';
type Cell={id:number;kind:CellKind;x:number;y:number;alive:boolean;glow:number;weight:number};
type Fish={x:number;y:number;angle:number;target:number;budget:number;cooldown:number;bite:number};
type Tracer={x:number;y:number;target:number;life:number;color:string};
type Patch={id:number;kind:NutrientKind;x:number;y:number;life:number;pulse:number};
const colors={nitrogen:'#b5e3fa',phosphorus:'#dfb7f0',silicate:'#f7d88d'};
export default function PlanktonTank({tank,playing,stepSignal,drop,svgRef,onEat,onAbsorb,onPlace,selected}:{tank:ReturnType<typeof initialPlanktonState>;playing:boolean;stepSignal:number;drop:NutrientDrop|null;svgRef:RefObject<SVGSVGElement|null>;onEat:(kind:CellKind,amount:number)=>void;onAbsorb:(kind:CellKind,nutrient:NutrientKind,cells:number)=>void;onPlace:(x:number,y:number)=>void;selected:NutrientKind|null}){
 const id=useId();const root=useRef<SVGGElement>(null);const current=useRef({tank,playing,onEat,onAbsorb});
 const engine=useRef<{cells:Cell[];fish:Fish[];tracers:Tracer[];patches:Patch[];lastDay:number;burstUntil:number;clock:number;version:number}>({cells:[],fish:[],tracers:[],patches:[],lastDay:tank.day,burstUntil:0,clock:0,version:0});
 // Read the current committed controls without restarting the animation loop.
 useEffect(()=>{current.current={tank,playing,onEat,onAbsorb};},[tank,playing,onEat,onAbsorb]);
 useEffect(()=>{
  const scene=engine.current;scene.version++;
  for(const kind of ['diatoms','flagellates'] as const){
   const weights=planktonSymbolWeights(tank[kind]);const desired=weights.length;const alive=scene.cells.filter(c=>c.kind===kind&&c.alive);
   if(alive.length>desired)alive.slice(desired).forEach(c=>{c.alive=false;});
   for(let i=alive.length;i<desired;i++){
    const spare=scene.cells.find(c=>c.kind===kind&&!c.alive);const index=spare?.id??scene.cells.length;
    const cell=spare??{id:index,kind,x:0,y:0,alive:true,glow:0,weight:1};
    const parent=alive[(i-alive.length)%Math.max(1,alive.length)];
    cell.x=parent?Math.max(25,Math.min(675,parent.x+Math.cos(index*2.4)*32)):kind==='diatoms'?230:470;cell.y=parent?Math.max(65,Math.min(325,parent.y+Math.sin(index*2.4)*32)):180;cell.alive=true;cell.glow=scene.clock?scene.clock+950:0;
    if(!spare)scene.cells.push(cell);
   }
   scene.cells.filter(c=>c.kind===kind&&c.alive).forEach((c,i)=>{c.weight=weights[i];});
  }
  while(scene.fish.length<tank.fish){const i=scene.fish.length;scene.fish.push({x:65+(i*179)%565,y:100+(i*59)%200,angle:0,target:-1,budget:1,cooldown:0,bite:0});}
  scene.fish.length=tank.fish;
  const days=Math.max(0,tank.day-scene.lastDay);if(days)scene.fish.forEach(f=>{f.budget=Math.min(3,f.budget+days);});scene.lastDay=tank.day;
 },[tank.diatoms,tank.flagellates,tank.fish,tank.day]);
 useEffect(()=>{if(!playing)engine.current.burstUntil=0;},[playing]);
 useEffect(()=>{if(stepSignal)engine.current.burstUntil=engine.current.clock+2500;},[stepSignal]);
 useEffect(()=>{
  if(!drop)return;const scene=engine.current;scene.version++;
  scene.patches=[...scene.patches.slice(-5),{...drop,life:45000,pulse:0}];
 },[drop]);
 useEffect(()=>{
  const node=root.current;if(!node)return;const scene=engine.current;
  const cellLayer=node.querySelector<SVGGElement>('[data-cell-layer]')!;const fishLayer=node.querySelector<SVGGElement>('[data-fish-layer]')!;const tracerLayer=node.querySelector<SVGGElement>('[data-tracer-layer]')!;const patchLayer=node.querySelector<SVGGElement>('[data-patch-layer]')!;
  const ns='http://www.w3.org/2000/svg';const cellNodes=new Map<number,SVGGElement>();const fishNodes:SVGGElement[]=[];
  const create=(tag:string,attributes:Record<string,string>)=>{const e=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attributes))e.setAttribute(key,value);return e;};
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');let last=0,frame=0,stopped=false,renderedVersion=-1;
  function tick(now:number){
   if(stopped)return;const dt=Math.min(50,last?now-last:16);last=now;scene.clock+=dt;
   const {playing:running,onEat:eat,onAbsorb:absorb}=current.current;const active=running||scene.clock<scene.burstUntil;
   if(!active&&renderedVersion===scene.version){frame=window.requestAnimationFrame(tick);return;}renderedVersion=scene.version;
   const claimed=new Set<number>();
   scene.fish.forEach((f,i)=>{
    if(active){
     f.cooldown=Math.max(0,f.cooldown-dt);f.bite=Math.max(0,f.bite-dt);
     let prey=scene.cells.find(c=>c.id===f.target&&c.alive&&!claimed.has(c.id));
     if(!prey||f.budget<=0){prey=f.budget>0?scene.cells.filter(c=>c.alive&&!claimed.has(c.id)).sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y))[0]:undefined;f.target=prey?.id??-1;}
     if(prey)claimed.add(prey.id);
     const tx=prey?.x??(i%2?90:610),ty=prey?.y??(90+(i*59)%210);const dx=tx-f.x,dy=ty-f.y;const distance=Math.hypot(dx,dy);
     if(distance>21){f.angle=Math.atan2(dy,dx);const travel=Math.min(distance-20,(prey?175:45)*dt/1000);if(media.matches){if(prey&&f.cooldown===0){f.x=tx-Math.cos(f.angle)*20;f.y=ty-Math.sin(f.angle)*20;}}else{f.x+=dx/distance*travel;f.y+=dy/distance*travel;}}
     if(prey&&Math.hypot(prey.x-f.x,prey.y-f.y)<=23&&f.cooldown===0){prey.alive=false;f.budget--;f.cooldown=650;f.bite=400;f.target=-1;eat(prey.kind,prey.weight);}
    }
    let g=fishNodes[i];if(!g){g=create('g',{'data-swimming-fish':String(i)}) as SVGGElement;g.innerHTML='<path data-tail d="M-20 0 L-39 -14 L-35 0 L-39 14Z" fill="#a8c8c6"/><path d="M-23 0 Q-7 -15 22 -4 L28 0 L22 4 Q-7 15 -23 0Z" fill="#d3e2d9" stroke="#92b8b4"/><path d="M-7 -9 L0 -21 L8 -9 M-5 9 L2 17 L7 9" fill="#98b9b6"/><circle cx="16" cy="-4" r="2.2" fill="#173f4e"/><path data-mouth d="M28 0 l-6 0" stroke="#244c54" stroke-width="2"/><ellipse data-bite cx="29" cy="0" rx="12" ry="9" fill="none" stroke="#f7ddb0" stroke-width="2"/>';fishLayer.appendChild(g);fishNodes[i]=g;}
    g.setAttribute('transform',`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${(f.angle*180/Math.PI).toFixed(1)})`);
    g.setAttribute('data-feeding',String(f.bite>0));
    g.querySelector('[data-tail]')!.setAttribute('transform',`rotate(${active&&!media.matches?Math.sin(scene.clock*.018+i)*18:0} -20 0)`);
    g.querySelector('[data-mouth]')!.setAttribute('d',f.bite>0?'M23 -5 L28 0 L23 5':'M28 0 l-6 0');
    g.querySelector('[data-bite]')!.setAttribute('opacity',f.bite>0?String(f.bite/400):'0');
   });
   while(fishNodes.length>scene.fish.length)fishNodes.pop()!.remove();
   scene.cells.forEach(c=>{
    let g=cellNodes.get(c.id);if(!g){g=create('g',{'data-tank-cell':c.kind}) as SVGGElement;const source=c.kind==='diatoms'?'/assets/plankton/diatom-detailed-v1.webp':'/assets/plankton/dinoflagellate-detailed-v1.webp';
     g.innerHTML=`<circle data-glow r="22" fill="none" stroke="${c.kind==='diatoms'?'#f9df9b':'#c3e8ce'}" stroke-width="2"/><image data-cell-art href="${source}" x="-18" y="-18" width="36" height="36"/><circle data-partial-ring r="20" fill="none" stroke="#e6ead5" stroke-width="2" transform="rotate(-90)"/><rect data-partial-badge x="7" y="9" width="20" height="15" rx="5" fill="#173f4e"/><text data-partial-label x="17" y="20" text-anchor="middle" fill="#f5eed8" font-size="10"/>`;cellLayer.appendChild(g);cellNodes.set(c.id,g);}
    if(active&&c.alive){
     const patch=scene.patches.filter(p=>p.life>0&&(p.kind!=='silicate'||c.kind==='diatoms')).sort((a,b)=>Math.hypot(a.x-c.x,a.y-c.y)-Math.hypot(b.x-c.x,b.y-c.y))[0];
     if(patch){const dx=patch.x-c.x,dy=patch.y-c.y,dist=Math.hypot(dx,dy);if(media.matches){c.x=Math.max(20,Math.min(680,patch.x+(c.id%20-9.5)*26));c.y=Math.max(52,Math.min(335,patch.y+(Math.floor(c.id/20)%10-4.5)*26));}else if(dist>28){const travel=Math.min(dist-28,(c.kind==='flagellates'?65:24)*dt/1000);c.x+=dx/dist*travel;c.y+=dy/dist*travel;}}
     else if(!media.matches){c.y+=Math.sin(scene.clock*.0008+c.id)*dt*.003;c.x+=Math.cos(scene.clock*.0006+c.id)*dt*.004;}
     // Spread representative groups apart while keeping at most 200 moving sprites.
     for(const other of scene.cells){if(media.matches||!other.alive||other.id===c.id)continue;const dx=c.x-other.x,dy=c.y-other.y,dist=Math.hypot(dx,dy);if(dist>0&&dist<36){c.x+=dx/dist*(36-dist)*dt*.006;c.y+=dy/dist*(36-dist)*dt*.006;}}
     c.x=Math.max(20,Math.min(680,c.x));c.y=Math.max(52,Math.min(335,c.y));
    }
    g.setAttribute('transform',`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`);g.setAttribute('display',c.alive?'inline':'none');g.setAttribute('data-alive',String(c.alive));g.setAttribute('data-cells-represented',c.alive?String(c.weight):'0');
    const partial=c.weight<CELLS_PER_SYMBOL;g.querySelector('[data-cell-art]')!.setAttribute('opacity',partial?'.55':'1');
    const ring=g.querySelector('[data-partial-ring]')!;ring.setAttribute('opacity',partial?'1':'0');ring.setAttribute('stroke-dasharray',`${c.weight/CELLS_PER_SYMBOL*125.66} 125.66`);
    g.querySelector('[data-partial-badge]')!.setAttribute('opacity',partial?'1':'0');const label=g.querySelector('[data-partial-label]')!;label.textContent=partial?String(c.weight):'';
    g.querySelector('[data-glow]')!.setAttribute('opacity',String(Math.max(0,Math.min(1,(c.glow-scene.clock)/650))));
   });
   patchLayer.replaceChildren();
   scene.patches=scene.patches.filter(p=>p.life>0);
   scene.patches.forEach(p=>{
    if(active){p.life-=dt;p.pulse-=dt;}
    const strength=Math.min(1,p.life/8000),color=colors[p.kind];
    patchLayer.appendChild(create('circle',{cx:String(p.x),cy:String(p.y),r:'67',fill:color,opacity:String(.12*strength),'data-nutrient-patch':p.kind}));
    patchLayer.appendChild(create('circle',{cx:String(p.x),cy:String(p.y),r:'34',fill:'none',stroke:color,'stroke-dasharray':'3 8',opacity:String(.65*strength)}));
    const label=create('text',{x:String(Math.max(100,Math.min(600,p.x))),y:String(Math.max(47,p.y-73)),fill:color,'text-anchor':'middle','font-size':'13'});label.textContent=p.kind==='nitrogen'?'N · dissolved nutrient':p.kind==='phosphorus'?'P · dissolved nutrient':'Si · dissolved nutrient';patchLayer.appendChild(label);
    // The pale curved flow lines distinguish passive diatom transport from swimming.
    patchLayer.appendChild(create('path',{d:`M${p.x-110} ${p.y+32} Q${p.x-90} ${p.y-30} ${p.x-44} ${p.y-12} l-8 -8 m8 8 l-11 2`,fill:'none',stroke:'#d0e3db',opacity:String(.35*strength),'stroke-width':'1.5'}));
    if(active&&p.pulse<=0){
     p.pulse=500;
     const stock=current.current.tank;const near=scene.cells.filter(c=>c.alive&&stock[p.kind]>0&&(p.kind!=='silicate'||c.kind==='diatoms')&&stock.stores[c.kind][p.kind]<stock[c.kind]*cellCosts[p.kind]*2-1e-9&&Math.hypot(c.x-p.x,c.y-p.y)<82).slice(0,5);
     near.forEach(c=>{absorb(c.kind,p.kind,c.weight);c.glow=scene.clock+650;scene.tracers.push({x:p.x+Math.cos(c.id+scene.clock)*25,y:p.y+Math.sin(c.id+scene.clock)*25,target:c.id,life:650,color});});
    }
   });
   tracerLayer.replaceChildren();scene.tracers=scene.tracers.filter(p=>p.life>0);
   scene.tracers.forEach(p=>{if(active){p.life-=dt;const target=scene.cells.find(c=>c.id===p.target&&c.alive);if(target){const dx=target.x-p.x,dy=target.y-p.y,dist=Math.hypot(dx,dy);const travel=Math.min(dist,160*dt/1000);if(media.matches){p.life=0;}else if(dist>3){p.x+=dx/dist*travel;p.y+=dy/dist*travel;}else p.life=0;}else p.life=0;}tracerLayer.appendChild(create('circle',{cx:p.x.toFixed(1),cy:p.y.toFixed(1),r:'2.5',fill:p.color,opacity:String(Math.min(1,p.life/200)),'data-nutrient-tracer':'true'}));});
   frame=window.requestAnimationFrame(tick);
  }
  frame=window.requestAnimationFrame(tick);return ()=>{stopped=true;window.cancelAnimationFrame(frame);cellLayer.replaceChildren();fishLayer.replaceChildren();tracerLayer.replaceChildren();patchLayer.replaceChildren();};
 },[]);
 return <svg ref={svgRef} className={`plankton-water ${selected?'can-place-nutrient':''}`} viewBox="0 0 700 360" role="img" aria-labelledby={`${id}-title`} onClick={event=>{if(!selected)return;const box=event.currentTarget.getBoundingClientRect();onPlace((event.clientX-box.left)/box.width*700,(event.clientY-box.top)/box.height*360);}}><title id={`${id}-title`}>Animated tank on day {tank.day}: {tank.diatoms} diatom cells, {tank.flagellates} dinoflagellate cells, {tank.fish} filter-feeding fish. Fish pursue representative groups and remove the number of cells in each captured group. Each full symbol represents 50 cells. A partial symbol shows the exact remainder from 1 to 49. Each type has a 5,000-cell limit. Dinoflagellates swim toward nutrient patches; teaching currents carry diatoms. Both absorb dissolved nutrients.</title><defs><linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#3e8085"/><stop offset="1" stopColor="#173f4e"/></linearGradient><clipPath id={`${id}-clip`}><rect width="700" height="360" rx="12"/></clipPath></defs><rect width="700" height="360" rx="12" fill={`url(#${id}-water)`}/><path d="M0 27 Q60 18 120 27 T360 27 T700 27" fill="none" stroke="#c5e8d9" opacity=".5"/><g ref={root} clipPath={`url(#${id}-clip)`}><g data-patch-layer/><g data-cell-layer/><g data-fish-layer/><g data-tracer-layer/></g>{selected&&<g pointerEvents="none"><rect x="8" y="8" width="684" height="344" rx="10" fill="none" stroke="#d8edcf" strokeWidth="3" strokeDasharray="10 7"/><rect x="145" y="9" width="410" height="30" rx="10" fill="#173f4e"/><text className="plankton-drop-hint" x="350" y="30" fill="#f3f4d8" textAnchor="middle">Drop {selected} here</text></g>}</svg>;
}
