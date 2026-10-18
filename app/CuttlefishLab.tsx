"use client";
import { useState, type CSSProperties } from 'react';

const parts = [
 {name:'Mantle',x:30,y:47,text:'The muscular mantle surrounds the main organs. Water enters the mantle cavity and can be expelled through the siphon for jet propulsion.'},
 {name:'Fin skirt',x:28,y:19,text:'The thin fin runs along both sides of the mantle. Rippling movements help the cuttlefish hover, steer, and swim slowly.'},
 {name:'Eyes',x:56,y:34,text:'Large eyes detect contrast and movement. Common cuttlefish have distinctive W-shaped pupils; this artwork simplifies the eye.'},
 {name:'Eight arms',x:74,y:47,text:'Eight shorter arms surround the mouth and help hold captured prey. A hard beak lies among them.'},
 {name:'Two feeding tentacles',x:79,y:18,text:'Two longer tentacles extend rapidly to capture prey. Their enlarged clubs carry suckers; the arms then bring the meal toward the mouth.'},
 {name:'Cuttlebone',x:30,y:62,text:'A chambered internal shell helps control buoyancy. Its approximate position is highlighted here; it is normally hidden beneath the skin.'},
];
const cells = [
 {name:'Chromatophores',tag:'Pigment organs',text:'An elastic pigment sac is surrounded by radial muscles. When the muscles contract, the sac spreads and shows more pigment. When they relax, it becomes a small dot. Nerves coordinate the pattern.',color:'#965f39'},
 {name:'Iridophores',tag:'Reflective cells',text:'Microscopic reflective structures return selected wavelengths of light, producing iridescent colors. These use structural reflection, a different mechanism from spreading pigment.',color:'#518d93'},
 {name:'Leucophores',tag:'Light-scattering cells',text:'These structures scatter incoming light broadly and can provide a pale or white background. They reflect available light; they do not create their own light.',color:'#dbd7c9'},
 {name:'Papillae',tag:'Skin texture structures',text:'Muscular skin projections make the surface smoother or bumpier. Papillae change texture and outline; they are not pigment cells.',color:'#bb876d'},
];
export default function CuttlefishLab(){
 const [part,setPart]=useState(0);const [cell,setCell]=useState(0);const [expansion,setExpansion]=useState(45);const [animate,setAnimate]=useState(false);const [texture,setTexture]=useState(false);
 const radius=7+expansion*.34;
 return <div className="cuttlefish-discovery">
  <section className="discovery-panel anatomy-panel" aria-labelledby="cuttle-anatomy-title">
   <div className="discovery-section-heading"><div><p className="eyebrow">Anatomy · Explore the structures</p><h2 id="cuttle-anatomy-title">A body built for disguise.</h2></div><p>Select a numbered marker or a body part to look closer.</p></div>
   <div className="anatomy-layout"><div className="anatomy-plate">
    <img src="/assets/cuttlefish/anatomy-plate.png" alt="Dorsal illustration of a common cuttlefish with an oval mantle, fin skirt, eyes, eight short arms and two long feeding tentacles"/>
    {part===5&&<svg className="internal-anatomy" viewBox="0 0 1536 1024" aria-hidden="true"><ellipse cx="425" cy="475" rx="290" ry="150" fill="#f1eee5ba" stroke="#245e6b" strokeWidth="5" strokeDasharray="12 9"/><path d="M170 475 H680 M200 430 H650 M200 520 H650" stroke="#245e6b" strokeWidth="3" opacity=".55"/></svg>}
    {parts.map((p,i)=><button key={p.name} className="anatomy-marker" style={{left:`${p.x}%`,top:`${p.y}%`}} aria-label={`Inspect ${p.name.toLowerCase()}`} aria-pressed={part===i} onClick={()=>setPart(i)}>{i+1}</button>)}
    <span className="plate-caption">Dorsal view · Educational illustration</span>
   </div><aside className="anatomy-detail"><p className="anatomy-detail-number">Structure {String(part+1).padStart(2,'0')}</p><h3>{parts[part].name}</h3><p role="status">{parts[part].text}</p><div className="anatomy-part-list" role="group" aria-label="Cuttlefish body parts">{parts.map((p,i)=><button key={p.name} aria-pressed={part===i} onClick={()=>setPart(i)}><span>{i+1}</span>{p.name}</button>)}</div></aside></div>
  </section>
  <section className="discovery-panel cell-panel" aria-labelledby="cuttle-cells-title">
   <div className="discovery-section-heading"><div><p className="eyebrow">Cell biology · Beneath the camouflage</p><h2 id="cuttle-cells-title">Small structures. Remarkable changes.</h2></div><p>Explore pigment, reflected light, and texture—three different ways to change appearance.</p></div>
   <figure className="skin-art-figure skin-mechanism-figure">
    <a href="/assets/cuttlefish/color-change-mechanism.png" target="_blank" rel="noreferrer" aria-label="Open the cuttlefish color-change diagram at full size"><img src="/assets/cuttlefish/color-change-mechanism.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="How cuttlefish change color: contracted radial muscles spread a chromatophore’s pigment sac; relaxed muscles let it retract. Below the pigment organs are iridophore reflectors and light-scattering leucophores."/></a>
    <figcaption>A simplified view of the skin’s color-changing system. Pigment sacs change their visible area; the layers beneath reflect and scatter incoming light. Layer spacing and sizes are not to scale. <a href="/assets/cuttlefish/color-change-mechanism.png" target="_blank" rel="noreferrer">Open the full-size diagram ↗</a></figcaption>
   </figure>
   <ol className="skin-mechanism-steps" aria-label="How the skin changes its appearance">
    <li><strong>Nerves signal the muscles</strong><p>Radial muscles pull outward on an elastic pigment sac.</p></li>
    <li><strong>The pigment changes area</strong><p>Muscle contraction spreads the sac. Relaxation lets it shrink, exposing more of the background.</p></li>
    <li><strong>Deeper structures return light</strong><p>Iridophores reflect selected colors; leucophores scatter light broadly.</p></li>
   </ol>
   <details className="skin-cutaway-details"><summary>Explore the anatomical skin cutaway</summary>
   <figure className="skin-art-figure"><img src="/assets/field-guide-v2/cuttlefish-skin-cells.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Magnified cuttlefish skin cutaway: pigment sacs with radial muscles and nerves near the surface, stacked iridophore reflectors beneath, pale leucophores deeper down, and raised papillae on top"/><figcaption>Artist’s reconstruction, not a microscope image. Chromatophores spread pigment near the surface; iridophores reflect selected wavelengths beneath them; deeper leucophores scatter light. Papillae change skin texture. Structure sizes and layer thicknesses are simplified.</figcaption></figure>
   </details>
   <div className="cell-selector" role="group" aria-label="Skin structure">{cells.map((c,i)=><button key={c.name} aria-pressed={cell===i} onClick={()=>setCell(i)}><i style={{background:c.color}}/>{c.name}</button>)}</div>
   <div className="cell-lab-grid"><div className={`cell-model ${animate?'is-animating':''}`}>
    <div className="cell-model-title"><span>Magnified teaching model</span><strong>{expansion}% pigment expansion</strong></div>
    <svg viewBox="0 0 640 430" role="img" aria-label="Skin model showing expanding pigment sacs, radial muscles, nerves, reflective plates and white light-scattering cells">
     <defs><linearGradient id="cuttle-reflection"><stop stopColor="#6caaa6"/><stop offset=".5" stopColor="#cbddc8"/><stop offset="1" stopColor="#6d9dae"/></linearGradient></defs>
     <rect x="20" y="38" width="600" height="350" rx="22" fill="#e9e3d4"/>
     <path d={texture?'M20 80 Q45 80 55 52 Q67 25 83 80 H180 Q195 80 207 45 Q218 17 234 80 H355 Q372 80 383 50 Q396 20 411 80 H525 Q544 80 555 48 Q569 23 583 80 H620':'M20 80 H620'} stroke="#aa8b6a" strokeWidth="5" fill="none"/>
     <g opacity={cell===0?1:.5}>{[130,320,510].map((cx,i)=><g key={cx}>{Array.from({length:12},(_,j)=>{const a=j*Math.PI/6;return <line key={j} x1={cx+Math.cos(a)*radius} y1={160+Math.sin(a)*radius} x2={cx+Math.cos(a)*65} y2={160+Math.sin(a)*65} stroke="#bd8b74" strokeWidth="5"/>;})}<circle className="cell-pigment" cx={cx} cy="160" r={radius} fill={['#aa6939','#804f33','#bd843b'][i]} style={{'--cell-min':Math.max(.2,7/radius)} as CSSProperties}/><path d={`M${cx-60} 95 Q${cx-40} 60 ${cx} 85 Q${cx+25} 100 ${cx+45} 110`} stroke="#c29d56" strokeWidth="3" fill="none"/></g>)}</g>
     <g opacity={cell===1?1:.5}>{[0,1,2,3,4].map(i=><g key={i} transform={`translate(${50+i*115} 260) rotate(-10)`}>{[0,1,2].map(j=><rect key={j} y={j*12} width="90" height="8" rx="4" fill="url(#cuttle-reflection)" stroke="#53878c"/>)}</g>)}</g>
     <g opacity={cell===2?1:.5}>{[0,1,2,3,4,5,6].map(i=><circle key={i} cx={65+i*85} cy="350" r="27" fill="#faf9ed" stroke="#c9c9b5" strokeWidth="2"/>)}</g>
    </svg>
    <div className="cell-model-legend"><span><i className="pigment-key"/>Pigment sac</span><span><i className="muscle-key"/>Radial muscle</span><span><i className="nerve-key"/>Nerve</span></div>
   </div><div className="cell-detail"><p className="eyebrow">{cells[cell].tag}</p><h3>{cells[cell].name}</h3><p role="status">{cells[cell].text}</p>
    <label className="expansion-control">Pigment expansion <output>{expansion}%</output><input type="range" min="0" max="100" value={expansion} onChange={e=>{setExpansion(Number(e.target.value));setAnimate(false);setCell(0);}}/></label>
    <div className="cell-presets" role="group" aria-label="Pigment presets">{[['Pale sand',15],['Mottled rock',65],['Dark display',95]].map(([name,value])=><button key={name} onClick={()=>{setExpansion(Number(value));setAnimate(false);setCell(0);}}>{name}</button>)}</div>
    <label className="cell-toggle"><input type="checkbox" checked={animate} onChange={e=>{setAnimate(e.target.checked);setCell(0);}}/>Animate pigment expansion</label>
    <label className="cell-toggle"><input type="checkbox" checked={texture} onChange={e=>{setTexture(e.target.checked);setCell(3);}}/>Raise the papillae</label>
    <p className="cell-model-note">The slider spreads existing pigment; it does not make new pigment or turn every cell a new color. This model simplifies scale, timing, and anatomy.</p>
   </div></div>
   <p className="cuttle-science-sources">Explore the science: <a href="https://www.mbl.edu/news/hanlon-award-aims-reveal-dynamic-interplay-pigments-reflectors-cephalopod-skin" target="_blank" rel="noreferrer">MBL · Pigments and reflectors</a><span> · </span><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3928930/" target="_blank" rel="noreferrer">Chromatophore research</a><span> · </span><a href="https://www.mbl.edu/news/how-cuttlefish-spikes-out-its-skin-neurological-study-reveals-surprising-control" target="_blank" rel="noreferrer">MBL · Papillae and texture</a></p>
  </section>
 </div>;
}
