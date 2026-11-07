// Offline composition of generated artwork, using one camera and continuous
// movement. No frame-to-frame regeneration, crossfades or optical-flow morphs.
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {writeFile,readFile} from 'node:fs/promises';
import {HUNT_DURATION,HUNT_FPS,HUNT_PREVIEW_COUNT,continuousHuntState,huntFrameTime} from '../shared/swordfish/continuous-hunt.mjs';
const [canvasModule,ffmpeg]=process.argv.slice(2);
if(!canvasModule||!ffmpeg)throw Error('Provide the temporary canvas module and FFmpeg paths.');
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require(canvasModule);
const root=new URL('../',import.meta.url),out=new URL('public/assets/swordfish/continuous-v3/',root);
const [predator,prey,water]=await Promise.all(['predator','prey','water'].map(name=>loadImage(new URL(name+'.webp',out).pathname)));
const canvas=createCanvas(1280,720),ctx=canvas.getContext('2d');
const ease=x=>{const u=Math.max(0,Math.min(1,x));return u*u*(3-2*u);};
const previewFrames=new Map(Array.from({length:HUNT_PREVIEW_COUNT},(_,i)=>[Math.round(huntFrameTime(i)*HUNT_FPS),i]));
function animal(image,x,y,scale,angle,t,alpha=1,isPredator=false){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);ctx.translate(-image.width/2,-image.height*(isPredator?.344:.24));ctx.globalAlpha=alpha;
 const rows=48,h=image.height/rows;
 for(let i=0;i<rows;i++){
  const y0=i*h,y1=(i+1)*h;
  const displacement=y=>{const u=Math.max(0,(y/image.height-.53)/.47);return (isPredator?68:35)*u*u*Math.sin(t*Math.PI*(isPredator?2.8:5)-u*2.5);};
  const d0=displacement(y0),d1=displacement(y1),shear=(d1-d0)/h;
  ctx.save();ctx.transform(1,0,shear,1,d0-shear*y0,0);ctx.beginPath();ctx.rect(0,y0,image.width,h+.65);ctx.clip();ctx.drawImage(image,0,0);ctx.restore();
 }
 ctx.restore();
}
function draw(t){
 const s=continuousHuntState(t);ctx.drawImage(water,0,0,1280,720);
 for(let i=0;i<30;i++){ctx.globalAlpha=.1+(i%3)*.025;ctx.fillStyle='#c1e4e2';ctx.beginPath();ctx.arc((i*153.2+t*3)%1280,110+(i*51.7+t*1.2)%500,.7+(i%2)*.4,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 for(let i=0;i<11;i++){
  const bx=500+(i%5)*72,by=135+Math.floor(i/5)*49;
  const side=i%2?1:-1;
  const x=bx+side*s.scatter*(95+(i%3)*35)+Math.sin(t*1.2+i)*4;
  const y=by-s.scatter*(65+(i%4)*24)+Math.cos(t+i)*3;
  animal(prey,x,y,.027,side*s.scatter*.7,t+i,1-s.scatter*.22);
 }
 const preyX=680+10*ease((t-6.4)/2),preyY=220+15*ease((t-6.4)/2);
 // The caught prey becomes occluded by the mouth in this dorsal teaching view.
 animal(prey,preyX,preyY,.029,.18*ease((t-6.4)/1.5),t*(t>6.4?.2:1),1-s.capture);
 if(t>=3.8&&t<=7.8){
  const r=132;ctx.save();ctx.strokeStyle='rgba(242,204,126,.55)';ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.arc(640,290,r,-Math.PI/2-.62,-Math.PI/2+.62);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#e8cf9d';ctx.font='15px sans-serif';ctx.textAlign='center';ctx.fillText('LEFT',535,182);ctx.fillText('RIGHT',745,182);
  const tip={x:s.x+Math.sin(s.yaw)*137,y:s.y-Math.cos(s.yaw)*137};ctx.beginPath();ctx.arc(tip.x,tip.y,5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 animal(predator,s.x,s.y,.245,s.yaw,t,1,true);
 ctx.fillStyle='rgba(4,27,44,.74)';ctx.fillRect(0,0,1280,96);ctx.fillRect(0,628,1280,92);
 ctx.fillStyle='#b2d5d6';ctx.font='13px sans-serif';ctx.fillText('SWORDFISH / OVERHEAD STUDY',36,30);
 ctx.fillStyle='#f3eee0';ctx.font='28px serif';ctx.fillText('A clear side-to-side swipe',36,67);
 ctx.textAlign='right';ctx.font='13px sans-serif';ctx.fillStyle='#bed5d6';ctx.fillText('AI RECONSTRUCTION',1244,31);ctx.fillText('Fixed camera · continuous motion',1244,59);ctx.textAlign='left';
 ctx.fillStyle='#eacd97';ctx.font='18px sans-serif';ctx.fillText(s.stage,36,659);
 const caption=t<3.8?'A steady approach with articulated tail beats.':t<7.8?'The rigid head and bill turn left, then right across the swimming direction.':t<10.4?'The school scatters; the predator follows one slowed fish.':t<11.5?'Mouth capture is indicated schematically in this overhead view.':'The swordfish continues swimming. Timing and poses are illustrative.';
 ctx.font='17px sans-serif';ctx.fillStyle='#e3ece8';ctx.fillText(caption,36,689);
 ctx.fillStyle='#32566b';ctx.fillRect(36,708,1208,3);ctx.fillStyle='#ddbc82';ctx.fillRect(36,708,1208*t/HUNT_DURATION,3);
}
const encoder=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',String(HUNT_FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',new URL('public/assets/swordfish/swordfish-hunt-v3.mp4',root).pathname],{stdio:['pipe','ignore','pipe']});
let errors='';encoder.stderr.on('data',data=>{errors+=data;});const done=once(encoder,'close');
for(let f=0;f<HUNT_DURATION*HUNT_FPS;f++){
 draw(f/HUNT_FPS);
 if(previewFrames.has(f))await writeFile(new URL(`frame-${String(previewFrames.get(f)).padStart(2,'0')}.webp`,out),canvas.encodeSync('webp',88));
 if([150,195,315].includes(f))await writeFile(`/private/tmp/swordfish-v3-${f}.png`,canvas.toBuffer('image/png'));
 if(!encoder.stdin.write(canvas.toBuffer('image/png')))await once(encoder.stdin,'drain');
}
encoder.stdin.end();const [code]=await done;if(code!==0)throw Error(errors);
const path=new URL('docs/swordfish-continuous-v3-manifest.json',root),manifest=JSON.parse(await readFile(path,'utf8'));
manifest.previewTimes=Array.from({length:32},(_,i)=>huntFrameTime(i));manifest.validation={frames:420,duration:14,fps:30,rig:'Posterior body shears continuously; head and bill remain rigid. Whole animal yaw is eased left/right.'};
await writeFile(path,JSON.stringify(manifest,null,2)+'\n');
console.log('Rendered 420 continuous frames: 14seconds at30fps.');
