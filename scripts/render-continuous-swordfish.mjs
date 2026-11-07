// Offline composition of generated artwork, using one camera and continuous
// movement. No frame-to-frame regeneration, crossfades or optical-flow morphs.
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {writeFile,readFile,mkdir} from 'node:fs/promises';
import {HUNT_DURATION,HUNT_FPS,HUNT_PREVIEW_COUNT,continuousHuntState,capturedPreyState,schoolFishState,huntFrameTime} from '../shared/swordfish/continuous-hunt.mjs';
const [canvasModule,ffmpeg]=process.argv.slice(2);
if(!canvasModule||!ffmpeg)throw Error('Provide the temporary canvas module and FFmpeg paths.');
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require(canvasModule);
const root=new URL('../',import.meta.url),art=new URL('public/assets/swordfish/continuous-v3/',root),out=new URL('public/assets/swordfish/continuous-v5/',root);
await mkdir(out,{recursive:true});
const [predator,prey,water]=await Promise.all(['predator','prey','water'].map(name=>loadImage(new URL(name+'.webp',art).pathname)));
const canvas=createCanvas(1280,720),ctx=canvas.getContext('2d');
const previewFrames=new Map(Array.from({length:HUNT_PREVIEW_COUNT},(_,i)=>[Math.round(huntFrameTime(i)*HUNT_FPS),i]));
function animal(image,x,y,scale,angle,t,alpha=1,isPredator=false,anchor=.24,escape=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);ctx.translate(-image.width/2,-image.height*(isPredator?.344:anchor));ctx.globalAlpha=alpha;
 const rows=48,h=image.height/rows;
 for(let i=0;i<rows;i++){
  const y0=i*h,y1=(i+1)*h;
  const displacement=y=>{const u=Math.max(0,(y/image.height-(isPredator?.53:.43))/(isPredator?.47:.57));return (isPredator?68:110+90*escape)*u*u*Math.sin(t*Math.PI*(isPredator?2.8:8)-u*2.5);};
  const d0=displacement(y0),d1=displacement(y1),shear=(d1-d0)/h;
  ctx.save();ctx.transform(1,0,shear,1,d0-shear*y0,0);ctx.beginPath();ctx.rect(0,y0,image.width,h+.65);ctx.clip();ctx.drawImage(image,0,0);ctx.restore();
 }
 ctx.restore();
}
function draw(t){
 const s=continuousHuntState(t);ctx.drawImage(water,0,0,1280,720);
 for(let i=0;i<30;i++){ctx.globalAlpha=.1+(i%3)*.025;ctx.fillStyle='#c1e4e2';ctx.beginPath();ctx.arc((i*153.2+t*3)%1280,110+(i*51.7+t*1.2)%500,.7+(i%2)*.4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 for(let i=0;i<11;i++){
  const q=schoolFishState(i,t);
  animal(prey,q.x,q.y,.044,q.angle,t+i,1,false,.5,q.flee);
 }
 if(t>=3.8&&t<=7.8){
  const r=137;ctx.save();ctx.strokeStyle='rgba(242,204,126,.55)';ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.arc(s.x,s.y,r,-Math.PI/2-.62,-Math.PI/2+.62);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#e8cf9d';ctx.font='15px sans-serif';ctx.textAlign='center';ctx.fillText('LEFT',s.x-105,s.y-112);ctx.fillText('RIGHT',s.x+105,s.y-112);
  const tip={x:s.x+Math.sin(s.yaw)*137,y:s.y-Math.cos(s.yaw)*137};ctx.beginPath();ctx.arc(tip.x,tip.y,5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 animal(predator,s.x,s.y,.245,s.yaw,t,1,true);
 const caught=capturedPreyState(t);
 // Draw the crosswise prey above the bill so the middle is occluded while
 // the point and base remain visible on opposite sides. No blood or wounds.
 animal(prey,caught.x,caught.y,.052,caught.angle,t<6.5?t:t*.2,caught.alpha,false,.5,t<6.5?1:0);
 if(caught.onBill){
  const cx=1050,cy=337,r=104,zoom=2.6;
  ctx.save();ctx.strokeStyle='rgba(234,205,151,.75)';ctx.lineWidth=1.5;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(caught.x+27,caught.y);ctx.lineTo(cx-r,cy);ctx.stroke();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();ctx.fillStyle='#0b5267';ctx.fillRect(cx-r,cy-r,r*2,r*2);
  ctx.translate(cx,cy);ctx.scale(zoom,zoom);ctx.translate(-caught.x,-caught.y);
  animal(predator,s.x,s.y,.245,s.yaw,t,1,true);
  animal(prey,caught.x,caught.y,.052,caught.angle,0,1,false,.5);ctx.restore();
  ctx.save();ctx.strokeStyle='#eacd97';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  ctx.textAlign='center';ctx.fillStyle='#f3e7ce';ctx.font='bold 17px sans-serif';ctx.fillText('FISH CAUGHT ON BILL',cx,cy+r+31);ctx.font='14px sans-serif';ctx.fillText('Dramatized impalement',cx,cy+r+54);ctx.restore();
 }

 ctx.fillStyle='rgba(4,27,44,.74)';ctx.fillRect(0,0,1280,96);ctx.fillRect(0,628,1280,92);
 ctx.fillStyle='#b2d5d6';ctx.font='13px sans-serif';ctx.fillText('SWORDFISH / OVERHEAD STUDY',36,30);
 ctx.fillStyle='#f3eee0';ctx.font='28px serif';ctx.fillText('A clear side-to-side swipe',36,67);
 ctx.textAlign='right';ctx.font='13px sans-serif';ctx.fillStyle='#bed5d6';ctx.fillText('AI RECONSTRUCTION',1244,31);ctx.fillText('Fixed camera · continuous motion',1244,59);ctx.textAlign='left';
 ctx.fillStyle='#eacd97';ctx.font='18px sans-serif';ctx.fillText(s.stage,36,659);
 const caption=t<3.8?'The swordfish advances while the small fish swim continuously.':t<6.5?'Fish accelerate away. The predator closes the gap and sweeps its bill into their path.':t<9.7?'One fleeing fish is intercepted and held on the bill. Impalement is dramatized.':t<10.5?'The predator draws its bill back, releasing the stunned fish.':t<12.6?'The released fish drifts; the swordfish changes course and catches up to it.':t<12.9?'The mouth reaches the fish before it disappears.':'The remaining school continues to flee out of view.';
 ctx.font='17px sans-serif';ctx.fillStyle='#e3ece8';ctx.fillText(caption,36,689);
 ctx.fillStyle='#32566b';ctx.fillRect(36,708,1208,3);ctx.fillStyle='#ddbc82';ctx.fillRect(36,708,1208*t/HUNT_DURATION,3);
}
const encoder=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',String(HUNT_FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',new URL('public/assets/swordfish/swordfish-hunt-v5.mp4',root).pathname],{stdio:['pipe','ignore','pipe']});
let errors='';encoder.stderr.on('data',data=>{errors+=data;});const done=once(encoder,'close');
for(let f=0;f<HUNT_DURATION*HUNT_FPS;f++){
 draw(f/HUNT_FPS);
 if(previewFrames.has(f))await writeFile(new URL(`frame-${String(previewFrames.get(f)).padStart(2,'0')}.webp`,out),canvas.encodeSync('webp',88));
 if([60,120,165,195,240,330,372,384].includes(f))await writeFile(`/private/tmp/swordfish-v5-${f}.png`,canvas.toBuffer('image/png'));
 if(!encoder.stdin.write(canvas.toBuffer('image/png')))await once(encoder.stdin,'drain');
}
encoder.stdin.end();const [code]=await done;if(code!==0)throw Error(errors);
const path=new URL('docs/swordfish-continuous-v5-manifest.json',root),manifest=JSON.parse(await readFile(path,'utf8'));
manifest.previewTimes=Array.from({length:32},(_,i)=>huntFrameTime(i));manifest.validation={frames:420,duration:14,fps:30,rig:'Independent continuously swimming school with acceleration and visible tail beats. Predator intercepts fleeing target at6.5s, withdraws bill at9.7s, then pursues independently drifting prey until mouth contact12.6s.'};
await writeFile(path,JSON.stringify(manifest,null,2)+'\n');
console.log('Rendered 420 continuous frames: 14seconds at30fps.');
