export const HUNT_DURATION=14;
export const HUNT_FPS=30;
export const HUNT_PREVIEW_COUNT=32;
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const v=clamp(n);return v*v*(3-2*v);};
const mix=(a,b,u)=>a+(b-a)*u;
function segment(t,start,end,a,b){return mix(a,b,smooth((t-start)/(end-start)));}
export const huntFrameTime=index=>Math.round(Math.min(31,Math.max(0,index))*419/31)/30;
export const huntFramePath=index=>`/assets/swordfish/continuous-v3/frame-${String(Math.min(31,Math.max(0,Math.round(index)))).padStart(2,'0')}.webp`;
export function huntStage(t){if(t<3.8)return 'Approach';if(t<7.8)return 'Side-to-side bill sweep';if(t<10.4)return 'Follow slowed prey';if(t<11.5)return 'Mouth capture';return 'Continue swimming';}
export function continuousHuntState(input){
 const t=Math.min(HUNT_DURATION,Math.max(0,Number.isFinite(input)?input:0));
 let x=640,y=segment(t,0,3.8,350,290),yaw=0;
 if(t>=3.8&&t<5)yaw=segment(t,3.8,5,0,-.62);
 else if(t>=5&&t<6.5)yaw=segment(t,5,6.5,-.62,.62);
 else if(t>=6.5&&t<7.8)yaw=segment(t,6.5,7.8,.62,0);
 if(t>=7.8){x=segment(t,7.8,10.6,640,690);y=segment(t,7.8,10.6,290,235);}
 if(t>=11.5){x=segment(t,11.5,14,690,720);y=segment(t,11.5,14,235,225);yaw=segment(t,11.5,14,0,.08);}
 return {t,x,y,yaw,scatter:smooth((t-6.3)/1.5),capture:smooth((t-10.5)/.9),stage:huntStage(t)};
}
