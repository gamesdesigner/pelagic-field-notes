import {useRef,useState} from 'react';
import './swordfish.css';
import {HUNT_PREVIEW_COUNT,huntFramePath,huntFrameTime,huntStage} from '../shared/swordfish/continuous-hunt.mjs';
const beats=[{time:0,label:'Watch approach',play:true},{time:5,label:'Inspect left swipe',play:false},{time:6.5,label:'Inspect right swipe',play:false},{time:10.4,label:'Watch capture',play:true}];
export default function SwordfishHunt(){
 const video=useRef<HTMLVideoElement>(null);
 const [rate,setRate]=useState('1');
 const [ready,setReady]=useState(false);
 const [error,setError]=useState(false);
 const [showFrames,setShowFrames]=useState(false);
 const [frame,setFrame]=useState(0);
 const inspect=(time:number,play:boolean)=>{
  const player=video.current;if(!player)return;
  player.pause();
  player.currentTime=time;
  if(play)void player.play().catch(()=>setError(true));else player.pause();
 };
 return <section className="swordfish-hunt" aria-labelledby="swordfish-hunt-title">
  <header><p className="eyebrow">Continuous hunting reconstruction · 14-second video</p><h2 id="swordfish-hunt-title">Watch the bill. Then watch the mouth.</h2><p>A fixed overhead camera makes the bill’s side-to-side sweep clear. Pause either side of the swipe, slow the action, or inspect stills from the continuous animation below.</p></header>
  <video ref={video} controls playsInline preload="metadata" poster={huntFramePath(0)} aria-label="14-second continuous swordfish hunting reconstruction" aria-describedby="swordfish-video-description" onLoadedMetadata={()=>setReady(true)} onError={()=>setError(true)}>
   <source src="/assets/swordfish/swordfish-hunt-v3.mp4" type="video/mp4"/>
   <track kind="captions" src="/assets/swordfish/swordfish-hunt-v3.vtt" srcLang="en" label="English descriptions"/>
   Your browser cannot play this video. <a href="/assets/swordfish/swordfish-hunt-v3.mp4">Open the MP4</a>.
  </video>
  <div className="swordfish-video-controls"><div className="swordfish-beats" role="group" aria-label="Explore hunting stages">{beats.map(beat=><button type="button" disabled={!ready} key={beat.time} onClick={()=>inspect(beat.time,beat.play)}>{beat.label}</button>)}<button type="button" disabled={!ready} onClick={()=>inspect(0,true)}>Replay</button></div><label>Playback speed <select aria-label="Playback speed" value={rate} onChange={event=>{const next=event.target.value;setRate(next);if(video.current)video.current.playbackRate=Number(next);}}><option value="0.5">0.5× · Slow motion</option><option value="1">1× · Normal</option><option value="1.5">1.5× · Faster</option></select></label></div>
  {error&&<p role="status">If playback is unavailable, <a href="/assets/swordfish/swordfish-hunt-v3.mp4">open the video directly</a> or inspect the source frames below.</p>}
  <p className="swordfish-video-note" id="swordfish-video-description">AI reconstruction, not wildlife footage. Generated artwork moves through one continuous 14-second shot at 30 frames per second. The camera and background stay steady while the rigid head and bill turn left, then right. Tail movement, spacing, and timing are illustrative; mouth capture is shown schematically from above, not as measured hunting kinematics.</p>
  <details className="swordfish-frame-viewer" onToggle={event=>setShowFrames(event.currentTarget.open)}><summary>Inspect 32 animation stills</summary>{showFrames&&<div className="swordfish-frame-content"><p>These 32 stills are sampled across the continuous animation. They are not separate image generations.</p><figure><img src={huntFramePath(frame)} width="1280" height="720" alt={`Animation still ${frame+1} of ${HUNT_PREVIEW_COUNT}: ${huntStage(huntFrameTime(frame))} in the swordfish hunting reconstruction.`}/><figcaption aria-live="polite">Animation still {frame+1} / {HUNT_PREVIEW_COUNT} · {huntStage(huntFrameTime(frame))}</figcaption></figure><label className="swordfish-frame-slider">Animation still<input aria-label="Animation still" aria-valuetext={`Animation still ${frame+1} of ${HUNT_PREVIEW_COUNT}`} type="range" min="0" max={HUNT_PREVIEW_COUNT-1} step="1" value={frame} onChange={event=>setFrame(Number(event.target.value))}/></label><div className="swordfish-beats" role="group" aria-label="Step through animation stills"><button type="button" disabled={frame===0} onClick={()=>setFrame(current=>Math.max(0,current-1))}>Previous frame</button><button type="button" disabled={frame===HUNT_PREVIEW_COUNT-1} onClick={()=>setFrame(current=>Math.min(HUNT_PREVIEW_COUNT-1,current+1))}>Next frame</button></div></div>}</details>
  <ol className="swordfish-sequence"><li><strong>Approach</strong><span>The tail provides thrust toward potential prey.</span></li><li><strong>Strike</strong><span>A lateral bill sweep can stun or injure a fish.</span></li><li><strong>Capture</strong><span>The mouth takes prey after the strike.</span></li></ol>
  <p className="swordfish-video-note">Science: <a href="https://www.fisheries.noaa.gov/species/north-atlantic-swordfish" target="_blank" rel="noreferrer">NOAA Fisheries</a> · <a href="https://doi.org/10.1002/ar.24059" target="_blank" rel="noreferrer">Bill biomechanics research</a></p>
 </section>;
}
