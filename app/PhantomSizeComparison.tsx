import {useId} from 'react';

export default function PhantomSizeComparison(){
 const id=useId();
 return <section className="ray-lab phantom-size" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Size in perspective</p><h2 id={`${id}-title`}>An arm nearly as long as a bus</h2><p>Compare the measuring lines: all three use the same scale. The icons are symbolic.</p></header>
  <div className="phantom-measures">
   <div><strong>Bus reference</strong><span>12 m · chosen comparison, not every bus</span></div><div className="measure-track"><span className="measure-line bus-length" style={{width:'100%'}}><svg aria-hidden="true" viewBox="0 0 600 55" preserveAspectRatio="none"><rect x="1" y="3" width="598" height="43" rx="5" fill="#d0ac68" stroke="#574d36" strokeWidth="2"/>{Array.from({length:10},(_,i)=><rect key={i} x={18+i*51} y="10" width="39" height="20" rx="2" fill="#466f77"/>)}<rect x="546" y="9" width="40" height="33" fill="#466f77"/><circle cx="94" cy="46" r="8" fill="#293d40"/><circle cx="490" cy="46" r="8" fill="#293d40"/></svg></span></div>
   <div><strong>One extended oral arm</strong><span>10 m reference · real arms can exceed this</span></div><div className="measure-track"><span className="measure-line arm-length" style={{width:`${10/12*100}%`}}/></div>
   <div><strong>Bell diameter</strong><span>1 m reference · large bells can exceed this</span></div><div className="measure-track"><span className="measure-line bell-width" style={{width:`${1/12*100}%`}}/></div>
  </div>
  <p className="ray-lab-note"><strong>Read the dimensions separately.</strong> Ten meters is about 83% of the chosen bus’s length. It describes one arm, not a ten-meter-wide bell, combined arm lengths, or body mass. A folded arm’s appearance changes with its pose.</p>
  <a href="https://www.mbari.org/animal/giant-phantom-jelly/" target="_blank" rel="noreferrer">Size reference: MBARI ↗</a>
 </section>;
}
