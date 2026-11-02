// Offline authoring only. Dependencies live outside the repository; the site
// serves the finished MP4 and does not execute this encoder in production.
// node scripts/render-swordfish-video.mjs /path/to/resvg-module /path/to/ffmpeg
import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir,writeFile} from 'node:fs/promises';
import {HUNT_DURATION,HUNT_FPS,renderHuntScene} from '../shared/swordfish/hunt-scene.mjs';
const [renderer,encoder]=process.argv.slice(2);
if(!renderer||!encoder)throw Error('Provide the temporary renderer module and FFmpeg binary paths.');
const require=createRequire(import.meta.url);
const {Resvg}=require(renderer);
const output=new URL('../public/assets/swordfish/',import.meta.url);
await mkdir(output,{recursive:true});
const fontFile='/System/Library/Fonts/Supplemental/Arial.ttf';
const render=svg=>new Resvg(svg,{font:{fontFiles:[fontFile],loadSystemFonts:true}}).render().asPng();
await writeFile(new URL('swordfish-hunt-poster-v1.png',output),render(renderHuntScene(1.3)));
const ffmpeg=spawn(encoder,['-y','-f','image2pipe','-vcodec','png','-framerate',String(HUNT_FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',new URL('swordfish-hunt-v1.mp4',output).pathname],{stdio:['pipe','ignore','pipe']});
let diagnostics='';ffmpeg.stderr.on('data',chunk=>{diagnostics+=chunk;});
const done=once(ffmpeg,'close');
for(let frame=0;frame<HUNT_DURATION*HUNT_FPS;frame++){
 if(!ffmpeg.stdin.write(render(renderHuntScene(frame/HUNT_FPS))))await once(ffmpeg.stdin,'drain');
}
ffmpeg.stdin.end();const [code]=await done;
if(code!==0)throw Error(diagnostics);
console.log(`Rendered ${HUNT_DURATION}s, ${HUNT_FPS}fps, 1280×720 H.264 MP4.`);
