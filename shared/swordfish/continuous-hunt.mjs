export const HUNT_DURATION=14;
export const HUNT_FPS=30;
export const HUNT_PREVIEW_COUNT=32;
export const HUNT_CONTACT=6.5;
export const HUNT_RELEASE=9.7;
export const HUNT_MOUTH=12.6;
const clamp=n=>Math.max(0,Math.min(1,n));
const time=n=>Math.min(HUNT_DURATION,Math.max(0,Number.isFinite(n)?n:0));
const smooth=n=>{const v=clamp(n);return v*v*(3-2*v);};
const mix=(a,b,u)=>a+(b-a)*u;
const segment=(t,start,end,a,b)=>mix(a,b,smooth((t-start)/(end-start)));
// Integral of a smooth acceleration ramp, in seconds. Fish retain their
// velocity after accelerating; they do not stop at a scatter destination.
function travel(t,start,duration){
 const dt=Math.max(0,t-start),u=clamp(dt/duration);
 return dt>=duration?dt-duration/2:duration*(u*u*u-u*u*u*u/2);
}
function hermite(t,start,end,a,b,va=0,vb=0){
 const u=clamp((t-start)/(end-start)),d=end-start;
 return (2*u**3-3*u*u+1)*a+(u**3-2*u*u+u)*d*va+(-2*u**3+3*u*u)*b+(u**3-u*u)*d*vb;
}
export const huntFrameTime=index=>Math.round(Math.min(31,Math.max(0,index))*419/31)/30;
export const huntFramePath=index=>`/assets/swordfish/continuous-v5/frame-${String(Math.min(31,Math.max(0,Math.round(index)))).padStart(2,'0')}.webp`;
export function huntStage(t){if(t<3.8)return 'Pursuit';if(t<HUNT_CONTACT)return 'The school flees · bill sweep';if(t<HUNT_RELEASE)return 'Prey held on bill (dramatized)';if(t<10.5)return 'Bill withdrawn · prey released';if(t<HUNT_MOUTH)return 'Swordfish pursues released prey';if(t<12.9)return 'Mouth capture';return 'Continue swimming';}
// These world-space routes do not depend on the predator's position. Before
// contact, the highlighted fish accelerates to the right and away from it.
export function freeTargetState(input){
 const t=time(input),r=travel(t,3.8,2),u=smooth((t-3.8)/2);
 const vx=12+48*u,vy=-4-8*u;
 return {x:600+12*t+48*r,y:300-4*t-8*r,vx,vy,angle:Math.atan2(vx,-vy)};
}
export function schoolFishState(index,input){
 const t=time(input),side=index%2?1:-1,start=3.2+(index%3)*.18,duration=.9;
 const vx0=10+(index%3)*2,vy0=-3;
 const vx1=side*(65+(index%4)*9),vy1=-12-(index%3)*7;
 const r=travel(t,start,duration),flee=smooth((t-start)/duration);
 const vx=mix(vx0,vx1,flee),vy=mix(vy0,vy1,flee);
 return {x:440+(index%4)*96+vx0*t+(vx1-vx0)*r,y:225+Math.floor(index/4)*56+vy0*t+(vy1-vy0)*r,angle:Math.atan2(vx,-vy),flee};
}
function yawAt(t){
 if(t<3.8)return 0;
 if(t<5)return segment(t,3.8,5,0,-.62);
 if(t<HUNT_CONTACT)return segment(t,5,HUNT_CONTACT,-.62,.62);
 return segment(t,HUNT_CONTACT,7.8,.62,0);
}
function targetAfterContact(t){
 const q=freeTargetState(HUNT_CONTACT),dt=Math.max(0,t-HUNT_CONTACT);
 const coast=Math.min(dt,.6)-travel(Math.min(dt,.6),0,.6);
 return {x:q.x+q.vx*coast,y:q.y+q.vy*coast};
}
// After release the stunned prey drifts on a fixed world-space trajectory.
// Only the predator changes course to bring its mouth to the prey.
export function releasedPreyState(input){
 const t=time(input),dt=Math.max(0,t-HUNT_RELEASE),r=travel(dt,0,.3);
 return {x:800+18*r,y:238-4*r};
}
export function continuousHuntState(input){
 const t=time(input),yaw=yawAt(t),contact=freeTargetState(HUNT_CONTACT);
 const intercept={x:contact.x-Math.sin(.62)*137,y:contact.y+Math.cos(.62)*137};
 let x,y;
 if(t<3.8){x=hermite(t,0,3.8,475,600,20,25);y=hermite(t,0,3.8,500,430,-20,-20);}
 else if(t<5){x=hermite(t,3.8,5,600,620,25,25);y=hermite(t,3.8,5,430,405,-20,-15);}
 else if(t<HUNT_CONTACT){x=hermite(t,5,HUNT_CONTACT,620,intercept.x,25,contact.vx);y=hermite(t,5,HUNT_CONTACT,405,intercept.y,-15,contact.vy);}
 else if(t<7.8){const q=targetAfterContact(t),distance=segment(t,HUNT_CONTACT,7.1,137,92);x=q.x-Math.sin(yaw)*distance;y=q.y+Math.cos(yaw)*distance;}
 else if(t<HUNT_RELEASE){const q=targetAfterContact(7.8);x=segment(t,7.8,HUNT_RELEASE,q.x,800);y=segment(t,7.8,HUNT_RELEASE,q.y+92,330);}
 else if(t<10.5){const q=releasedPreyState(t),distance=segment(t,HUNT_RELEASE,10.5,92,165);x=q.x;y=q.y+distance;}
 else if(t<HUNT_MOUTH){
  const a=releasedPreyState(10.5),b=releasedPreyState(HUNT_MOUTH),u=clamp((t-10.5)/(HUNT_MOUTH-10.5));
  x=hermite(t,10.5,HUNT_MOUTH,a.x,b.x,18,18)+55*Math.sin(Math.PI*u)**2;
  y=hermite(t,10.5,HUNT_MOUTH,a.y+165,b.y,-4,-4);
 }else{const q=releasedPreyState(t);x=q.x;y=q.y;}
 return {t,x,y,yaw,scatter:smooth((t-3.2)/.9),capture:smooth((t-HUNT_MOUTH)/.3),stage:huntStage(t)};
}
export function capturedPreyState(input){
 const t=time(input),s=continuousHuntState(t);
 let q,angle;
 if(t<HUNT_CONTACT){q=freeTargetState(t);angle=q.angle;}
 else if(t<7.8){q=targetAfterContact(t);angle=mix(freeTargetState(HUNT_CONTACT).angle,Math.PI/2+s.yaw,smooth((t-HUNT_CONTACT)/.6));}
 else if(t<HUNT_RELEASE){q={x:s.x,y:s.y-92};angle=Math.PI/2;}
 else{q=releasedPreyState(t);angle=Math.PI/2;}
 return {...q,angle,alpha:1-s.capture,onBill:t>=HUNT_CONTACT&&t<HUNT_RELEASE,phase:t<HUNT_CONTACT?'fleeing':t<HUNT_RELEASE?'impaled':t<10.5?'released':t<HUNT_MOUTH?'pursued':t<12.9?'mouth':'consumed'};
}
