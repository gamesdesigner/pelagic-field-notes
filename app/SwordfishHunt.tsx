import {useRef,useState} from 'react';
import './swordfish.css';
const beats=[{time:0,label:'Watch approach',play:true},{time:4.2,label:'Inspect bill strike',play:false},{time:8.5,label:'Watch capture',play:true}];
export default function SwordfishHunt(){
 const video=useRef<HTMLVideoElement>(null);
 const [rate,setRate]=useState('1');
 const [ready,setReady]=useState(false);
 const [error,setError]=useState(false);
 const inspect=(time:number,play:boolean)=>{
  const player=video.current;if(!player)return;
  player.currentTime=time;
  if(play)void player.play().catch(()=>setError(true));else player.pause();
 };
 return <section className="swordfish-hunt" aria-labelledby="swordfish-hunt-title">
  <header><p className="eyebrow">Hunting sequence · 14-second video</p><h2 id="swordfish-hunt-title">Watch the bill. Then watch the mouth.</h2><p>Follow one illustrated hunt. Pause the sideways strike, slow the action, or jump ahead to capture.</p></header>
  <video ref={video} controls playsInline preload="metadata" poster="/assets/swordfish/swordfish-hunt-poster-v1.png" aria-label="Illustrated swordfish hunting sequence" aria-describedby="swordfish-video-description" onLoadedMetadata={()=>setReady(true)} onError={()=>setError(true)}>
   <source src="/assets/swordfish/swordfish-hunt-v1.mp4" type="video/mp4"/>
   <track kind="captions" src="/assets/swordfish/swordfish-hunt-v1.vtt" srcLang="en" label="English descriptions"/>
   Your browser cannot play this video. <a href="/assets/swordfish/swordfish-hunt-v1.mp4">Open the MP4</a>.
  </video>
  <div className="swordfish-video-controls"><div className="swordfish-beats" role="group" aria-label="Explore hunting stages">{beats.map(beat=><button type="button" disabled={!ready} key={beat.time} onClick={()=>inspect(beat.time,beat.play)}>{beat.label}</button>)}<button type="button" disabled={!ready} onClick={()=>inspect(0,true)}>Replay</button></div><label>Playback speed <select value={rate} onChange={event=>{const next=event.target.value;setRate(next);if(video.current)video.current.playbackRate=Number(next);}}><option value="0.5">0.5× · Slow motion</option><option value="1">1× · Normal</option><option value="1.5">1.5× · Faster</option></select></label></div>
  {error&&<p role="status">If playback is unavailable, <a href="/assets/swordfish/swordfish-hunt-v1.mp4">open the video directly</a> or read the sequence below.</p>}
  <p className="swordfish-video-note" id="swordfish-video-description">An authored animated reconstruction, not wildlife footage. Tail beats drive an approach; the bill sweeps sideways; the school scatters; the predator returns and takes one slowed fish into its mouth. Movement, spacing, and timing are illustrative. This successful example does not mean every strike succeeds.</p>
  <ol className="swordfish-sequence"><li><strong>Approach</strong><span>The tail provides thrust toward potential prey.</span></li><li><strong>Strike</strong><span>A lateral bill sweep can stun or injure a fish.</span></li><li><strong>Capture</strong><span>The mouth takes prey after the strike.</span></li></ol>
  <p className="swordfish-video-note">Science: <a href="https://www.fisheries.noaa.gov/species/north-atlantic-swordfish" target="_blank" rel="noreferrer">NOAA Fisheries</a> · <a href="https://doi.org/10.1002/ar.24059" target="_blank" rel="noreferrer">Bill biomechanics research</a></p>
 </section>;
}
