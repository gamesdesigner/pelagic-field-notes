import {useRef,useState} from 'react';
import './swordfish.css';
import {REALISTIC_FRAME_COUNT,realisticFramePath,realisticStage} from '../shared/swordfish/realistic-hunt.mjs';
const beats=[{time:0,label:'Watch approach',play:true},{time:1.35,label:'Inspect bill strike',play:false},{time:3,label:'Watch capture',play:true}];
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
  <header><p className="eyebrow">AI-generated hunting sequence · 4-second video</p><h2 id="swordfish-hunt-title">Watch the bill. Then watch the mouth.</h2><p>Follow a hunt reconstructed with realistic generated images. Pause the bill sweep, slow the action, or inspect each source frame below.</p></header>
  <video ref={video} controls playsInline preload="metadata" poster={realisticFramePath(0)} aria-label="AI-generated realistic swordfish hunting sequence" aria-describedby="swordfish-video-description" onLoadedMetadata={()=>setReady(true)} onError={()=>setError(true)}>
   <source src="/assets/swordfish/swordfish-hunt-v2.mp4" type="video/mp4"/>
   <track kind="captions" src="/assets/swordfish/swordfish-hunt-v2.vtt" srcLang="en" label="English descriptions"/>
   Your browser cannot play this video. <a href="/assets/swordfish/swordfish-hunt-v2.mp4">Open the MP4</a>.
  </video>
  <div className="swordfish-video-controls"><div className="swordfish-beats" role="group" aria-label="Explore hunting stages">{beats.map(beat=><button type="button" disabled={!ready} key={beat.time} onClick={()=>inspect(beat.time,beat.play)}>{beat.label}</button>)}<button type="button" disabled={!ready} onClick={()=>inspect(0,true)}>Replay</button></div><label>Playback speed <select aria-label="Playback speed" value={rate} onChange={event=>{const next=event.target.value;setRate(next);if(video.current)video.current.playbackRate=Number(next);}}><option value="0.5">0.5× · Slow motion</option><option value="1">1× · Normal</option><option value="1.5">1.5× · Faster</option></select></label></div>
  {error&&<p role="status">If playback is unavailable, <a href="/assets/swordfish/swordfish-hunt-v2.mp4">open the video directly</a> or inspect the source frames below.</p>}
  <p className="swordfish-video-note" id="swordfish-video-description">AI reconstruction, not wildlife footage. The sequence uses 32 separately generated source images, with intermediate motion interpolated for 24-frame-per-second playback. Minor visual differences can remain. The bill sweep, prey scattering, and mouth capture explain a possible successful hunt; poses, spacing, and timing are illustrative.</p>
  <details className="swordfish-frame-viewer" onToggle={event=>setShowFrames(event.currentTarget.open)}><summary>Inspect all 32 generated frames</summary>{showFrames&&<div className="swordfish-frame-content"><p>Each step shows an original generated image, rather than an interpolated video frame.</p><figure><img src={realisticFramePath(frame)} width="1672" height="941" alt={`Generated source frame ${frame+1} of ${REALISTIC_FRAME_COUNT}: ${realisticStage(frame)} in the swordfish hunting reconstruction.`}/><figcaption aria-live="polite">Source frame {frame+1} / {REALISTIC_FRAME_COUNT} · {realisticStage(frame)}</figcaption></figure><label className="swordfish-frame-slider">Source frame<input aria-label="Generated source frame" aria-valuetext={`Source frame ${frame+1} of ${REALISTIC_FRAME_COUNT}`} type="range" min="0" max={REALISTIC_FRAME_COUNT-1} step="1" value={frame} onChange={event=>setFrame(Number(event.target.value))}/></label><div className="swordfish-beats" role="group" aria-label="Step through generated frames"><button type="button" disabled={frame===0} onClick={()=>setFrame(current=>Math.max(0,current-1))}>Previous frame</button><button type="button" disabled={frame===REALISTIC_FRAME_COUNT-1} onClick={()=>setFrame(current=>Math.min(REALISTIC_FRAME_COUNT-1,current+1))}>Next frame</button></div></div>}</details>
  <ol className="swordfish-sequence"><li><strong>Approach</strong><span>The tail provides thrust toward potential prey.</span></li><li><strong>Strike</strong><span>A lateral bill sweep can stun or injure a fish.</span></li><li><strong>Capture</strong><span>The mouth takes prey after the strike.</span></li></ol>
  <p className="swordfish-video-note">Science: <a href="https://www.fisheries.noaa.gov/species/north-atlantic-swordfish" target="_blank" rel="noreferrer">NOAA Fisheries</a> · <a href="https://doi.org/10.1002/ar.24059" target="_blank" rel="noreferrer">Bill biomechanics research</a></p>
 </section>;
}
