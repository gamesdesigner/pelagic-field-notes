export const HUNT_DURATION=14;
export const HUNT_FPS=30;
export const HUNT_PREVIEW_COUNT=32;
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const v=clamp(n);return v*v*(3-2*v);};
const mix=(a,b,u)=>a+(b-a)*u;
function segment(t,start,end,a,b){return mix(a,b,smooth((t-start)/(end-start)));}
export const huntFrameTime=index=>Math.round(Math.min(31,Math.max(0,index))*419/31)/30;
export const huntFramePath=index=>`/assets/swordfish/continuous-v4/frame-${String(Math.min(31,Math.max(0,Math.round(index)))).padStart(2,'0')}.webp`;
export function huntStage(t){if(t<3.8)return 'Approach';if(t<7.8)return 'Side-to-side bill sweep';if(t<10.4)return 'Prey held on bill (dramatized)';if(t<11.2)return 'Release from bill';if(t<12.8)return 'Mouth capture';return 'Continue swimming';}
export function continuousHuntState(input){
 const t=Math.min(HUNT_DURATION,Math.max(0,Number.isFinite(input)?input:0));
 let x=640,y=segment(t,0,3.8,350,290),yaw=0;
 if(t>=3.8&&t<5)yaw=segment(t,3.8,5,0,-.62);
 else if(t>=5&&t<6.5)yaw=segment(t,5,6.5,-.62,.62);
 else if(t>=6.5&&t<7.8)yaw=segment(t,6.5,7.8,.62,0);
 if(t>=7.8){x=segment(t,7.8,10.6,640,690);y=segment(t,7.8,10.6,290,235);}
 if(t>=11.5){x=segment(t,11.5,14,690,720);y=segment(t,11.5,14,235,225);yaw=segment(t,11.5,14,0,.08);}
 return {t,x,y,yaw,scatter:smooth((t-6.3)/1.5),capture:smooth((t-12.1)/.7),stage:huntStage(t)};
}

// Body-center coordinates for the same highlighted prey throughout the shot.
// The impalement is a requested dramatization, not typical feeding evidence.
export function capturedPreyState(input){
 const s=continuousHuntState(input),t=s.t;
 const point=distance=>({x:s.x+Math.sin(s.yaw)*distance,y:s.y-Math.cos(s.yaw)*distance});
 const held=point(92),engage=smooth((t-5.8)/.7);
 let x=mix(680,held.x,engage),y=mix(220,held.y,engage),angle=mix(0,Math.PI/2+s.yaw,engage);
 if(t>=10.4&&t<11.2){const u=smooth((t-10.4)/.8),p=point(mix(92,165,u));x=p.x;y=p.y;angle=Math.PI/2+s.yaw;}
 if(t>=11.2){const u=smooth((t-11.2)/1.2),p=point(165);x=mix(p.x,s.x,u)+65*Math.sin(Math.PI*u);y=mix(p.y,s.y,u);angle=mix(Math.PI/2+s.yaw,.25,u);}
 return {x,y,angle,alpha:1-s.capture,onBill:t>=6.5&&t<10.4,phase:t<6.5?'free':t<10.4?'impaled':t<11.2?'released':t<12.8?'mouth':'consumed'};
}
