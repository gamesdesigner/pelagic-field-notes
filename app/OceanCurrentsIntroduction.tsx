"use client";
import {useId} from 'react';
import {oceanCurrentsIntroduction as introduction} from '../shared/ocean-currents-introduction.mjs';

export default function OceanCurrentsIntroduction({onBack}:{onBack:()=>void}){
 const id=useId();
 const words=introduction.sections.flatMap(section=>section.paragraphs).join(' ').split(/\s+/).length;
 return <section className="currents-intro-unit" aria-labelledby={`${id}-unit-title`}>
  <button type="button" className="back-button" onClick={onBack}>← Main page</button>
  <header className="currents-intro-heading"><p className="eyebrow">Chapter 1 · Start here</p><h1 id={`${id}-unit-title`}>Introduction to ocean currents</h1><p>Follow the moving water that connects climate, habitats, and ocean life.</p></header>
  <figure className="field-guide-overview currents-intro-hero">
   <img src="/assets/field-guide-v2/ocean-surface-currents.webp" width="1536" height="1024" alt="Illustrated world map showing warm and cool surface currents linking ocean basins and circulating around continents." decoding="async"/>
   <figcaption><span>A connected ocean</span><h2>Moving water. Shared connections.</h2><p>Currents carry heat and nutrients between places. This simplified map shows broad surface pathways; deeper circulation connects another part of the ocean.</p></figcaption>
  </figure>
  <article className="currents-intro-article" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Chapter introduction · {words} words</p><h2 id={`${id}-title`}>{introduction.title}</h2><p className="currents-intro-question">{introduction.question}</p></header>
  <div className="currents-intro-abstract"><h3>Abstract</h3><p>{introduction.abstract}</p></div>
  {introduction.sections.map((section,index)=><section key={section.heading} aria-labelledby={`${id}-${index}`}><h3 id={`${id}-${index}`}>{section.heading}</h3>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.sources.length>0&&<p className="currents-intro-sources">{section.sources.map(source=>{const item=introduction.sources[source as keyof typeof introduction.sources];return <a key={source} href={item.url} target="_blank" rel="noreferrer">{item.label} ↗</a>;})}</p>}</section>)}
  <aside className="currents-intro-takeaway"><h3>Key takeaway</h3><p>{introduction.takeaway}</p></aside>
  <button type="button" className="currents-intro-return" onClick={onBack}>← Main page</button>
  </article>
 </section>;
}
