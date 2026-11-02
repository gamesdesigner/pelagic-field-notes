// One deterministic scene drives the MP4 and its poster. All movement is authored;
// this is an explanatory reconstruction, not measured tracking or field footage.
export const HUNT_DURATION=14;
export const HUNT_FPS=24;
export const huntStages=[
 {start:0,title:'01 · Approach',caption:'Tail beats drive the swordfish toward a school of fish.'},
 {start:3.2,title:'02 · Lateral strike',caption:'A sideways bill sweep can stun or injure prey.'},
 {start:5.2,title:'03 · Return',caption:'The school scatters. The swordfish turns toward one slowed fish.'},
 {start:9.2,title:'04 · Capture',caption:'The mouth takes the prey; the bill does not swallow it.'},
 {start:11.1,title:'05 · Continue swimming',caption:'One illustrative successful hunt; real timing and outcomes vary.'},
];
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
const ease=n=>{const v=clamp(n);return v*v*(3-2*v);};
const mix=(a,b,n)=>a+(b-a)*n;
const f=n=>Number(n.toFixed(3));
export function huntState(seconds){
 const time=clamp(Number.isFinite(seconds)?seconds:0,0,HUNT_DURATION);
 let x=210,y=340,angle=0;
 if(time<3.2)x=mix(210,400,ease(time/3.2));
 else if(time<5.2){x=400;angle=-13*Math.sin((time-3.2)/2*Math.PI*2);}
 else if(time<9.2){const u=(time-5.2)/4;x=mix(400,650,ease(u));y=340-100*Math.sin(u*Math.PI);angle=-22*Math.sin(u*Math.PI*2);}
 else if(time<11.1){x=650;y=340;}
 else{x=mix(650,1040,ease((time-11.1)/2.9));y=mix(340,285,ease((time-11.1)/2.9));angle=-6;}
 const scattered=ease((time-4.1)/2.2);
 const capture=ease((time-9.25)/1.15);
 return {time,x,y,angle,scattered,capture,tail:Math.sin(time*Math.PI*4.8),stage:huntStages.findLast(stage=>time>=stage.start),jaw:Math.sin(clamp((time-9.2)/1.6)*Math.PI)};
}
function prey(x,y,angle,phase,opacity=1,stunned=false){
 const beat=Math.sin(phase)*5;
 return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})" opacity="${f(opacity)}"><path d="M-18 0 Q-27 ${-12+beat} -34 ${-13+beat} L-29 0 L-34 ${13+beat} Q-24 ${10+beat} -18 0" fill="#6b9d9f"/><path d="M-20 0 Q-5 -12 15 -5 Q24 0 15 5 Q-5 12 -20 0Z" fill="url(#prey)" stroke="#badbdb" stroke-width=".65"/><path d="M-12 -4 Q1 -1 17 -1" stroke="#e6f7ec" stroke-width="1.1" fill="none"/><circle cx="14" cy="-1" r="1.8" fill="#092831"/>${stunned?'<path d="M-1 -15 Q4 -20 9 -15" fill="none" stroke="#efc779" stroke-width="1.5"/>':''}</g>`;
}
export function renderHuntScene(seconds){
 const s=huntState(seconds),t=s.time;
 const others=Array.from({length:13},(_,i)=>{
  const bx=712+(i%4)*67,by=225+Math.floor(i/4)*60;
  const dir=i%2?1:-1;
  const x=bx+mix(0,160+(i%4)*35,s.scattered)+Math.sin(t*1.4+i)*6;
  const y=by+dir*(30+(i%3)*27)*s.scattered+Math.sin(t*2+i)*4;
  return prey(x,y,s.scattered*dir*28,t*10+i,1-s.scattered*.25);
 }).join('');
 const targetX=mix(694,739,ease((t-4.15)/1.05)),targetY=mix(304,340,ease((t-4.15)/1.05));
 const target=prey(mix(targetX,747,s.capture),targetY,8*s.scattered,t*(s.scattered>.8?1:10),1-s.capture,t>4.4&&t<10.2);
 const tail=s.tail*14,fin=s.tail*5;
 const strike=t>3.2&&t<5.2?`<path d="M655 246 Q740 335 653 417" fill="none" stroke="#edc77e" stroke-width="2" stroke-dasharray="5 7" opacity=".75"/><text x="725" y="440" font-family="sans-serif" font-size="14" fill="#f1d99e">sideways bill sweep</text>`:'';
 const particles=Array.from({length:36},(_,i)=>{const x=(i*113.7-t*(i%3+1)*4+1500)%1280,y=125+(i*71.2)%475;return `<circle cx="${f(x)}" cy="${f(y)}" r="${i%3===0?1.4:.7}" fill="#d5ece6" opacity="${.12+(i%4)*.05}"/>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
 <defs><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#124b59"/><stop offset=".48" stop-color="#083343"/><stop offset="1" stop-color="#051e30"/></linearGradient><linearGradient id="body" x2="0" y2="1"><stop stop-color="#254756"/><stop offset=".35" stop-color="#607e87"/><stop offset=".65" stop-color="#b8ccd0"/><stop offset="1" stop-color="#e0ebe4"/></linearGradient><linearGradient id="prey" x2="0" y2="1"><stop stop-color="#4b8c9c"/><stop offset=".5" stop-color="#cedfd7"/><stop offset="1" stop-color="#8fb5b6"/></linearGradient><linearGradient id="fin" x2="0" y2="1"><stop stop-color="#243d50"/><stop offset="1" stop-color="#547d86"/></linearGradient></defs>
 <rect width="1280" height="720" fill="url(#sea)"/>
 <path d="M75 100L340 630L440 630L140 100ZM470 100L800 630L875 630L540 100ZM950 100L1120 630L1190 630L1000 100Z" fill="#a8d4ce" opacity=".035"/>
 ${particles}
 <text x="44" y="49" fill="#a6c6c5" font-family="sans-serif" font-size="14" letter-spacing="3">FIELD NOTES / SWORDFISH</text><text x="44" y="85" fill="#f0eee3" font-family="serif" font-size="27">A bill strike, then a meal.</text>
 ${others}${target}${strike}
 <g transform="translate(${f(s.x)} ${f(s.y)}) rotate(${f(s.angle)}) scale(.86)">
 <ellipse cx="-35" cy="43" rx="172" ry="22" fill="#001725" opacity=".2"/>
 <path d="M-150 -17 Q-190 -31 -209 ${f(tail-5)} L-219 ${f(tail-83)} Q-177 ${f(tail-44)} -173 ${f(tail)} Q-177 ${f(tail+44)} -219 ${f(tail+83)} L-209 ${f(tail+5)} Q-186 27 -150 17Z" fill="url(#fin)" stroke="#92b2b6" stroke-width="1.2"/>
 <path d="M-158 -12 Q-89 -46 5 -40 Q69 -38 110 -12 L121 -3 L106 13 Q50 44 -23 37 Q-100 32 -158 12Z" fill="url(#body)" stroke="#d0dfda" stroke-width="1.1"/>
 <path d="M-66 -35 Q-49 -109 -16 -117 Q-18 -66 14 -39Z" fill="url(#fin)" stroke="#98b9bb" stroke-width=".9"/>
 <path d="M-45 35 Q-26 65 6 81 Q-9 49 13 39Z" fill="url(#fin)"/>
 <path d="M-142 -18 L-131 -35 L-117 -23M-134 22 L-124 38 L-112 25" fill="#5c8790"/>
 <path d="M68 -14 Q40 ${f(-47-fin)} -9 ${f(-58-fin)} L34 -23Z" fill="url(#fin)"/>
 <path d="M65 12 Q38 ${f(66+fin)} -7 ${f(87+fin)} L32 28Z" fill="url(#fin)" stroke="#91b3ba" stroke-width=".9"/>
 <path d="M105 -11 Q184 -11 320 -3 Q179 1 111 2Z" fill="#9fb9bc" stroke="#d2e4dc" stroke-width="1"/>
 <path d="M111 3 L156 ${f(7+s.jaw*9)} L113 ${f(10+s.jaw*7)}" fill="#c6d8d4" stroke="#63868d" stroke-width="1"/>
 <path d="M73 -25 Q57 -5 69 22" fill="none" stroke="#3d6570" stroke-width="2"/>
 <path d="M-144 -6 Q-50 -23 48 -18" fill="none" stroke="#d7e4dc" stroke-width="1" opacity=".6"/>
 <circle cx="91" cy="-14" r="9" fill="#b7c4bc" stroke="#294555" stroke-width="2"/><circle cx="93" cy="-14" r="5.7" fill="#051c29"/><circle cx="95" cy="-17" r="1.8" fill="#f6eee0"/>
 </g>
 <rect y="610" width="1280" height="110" fill="#061c29" opacity=".93"/><text x="44" y="646" fill="#edcd91" font-family="sans-serif" font-size="15" letter-spacing="1">${s.stage.title}</text><text x="44" y="677" fill="#e2ece5" font-family="sans-serif" font-size="19">${s.stage.caption}</text>
 <text x="1235" y="49" text-anchor="end" font-family="sans-serif" font-size="12" fill="#a6c6c5">ILLUSTRATED RECONSTRUCTION</text><text x="1235" y="79" text-anchor="end" font-family="sans-serif" font-size="12" fill="#a6c6c5">Oblique view · illustrative timing</text>
 <rect x="44" y="699" width="1192" height="3" fill="#42616a"/><rect x="44" y="699" width="${f(1192*t/HUNT_DURATION)}" height="3" fill="#e5be78"/>
 </svg>`;
}
