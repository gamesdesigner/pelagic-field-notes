"use client";
import {useId} from 'react';
import {oceanCurrentsIntroduction as introduction} from '../shared/ocean-currents-introduction.mjs';

export default function OceanCurrentsIntroduction({collapsible=false}:{collapsible?:boolean}){
 const id=useId();
 const words=introduction.sections.flatMap(section=>section.paragraphs).join(' ').split(/\s+/).length;
 const article=<article className="currents-intro-article" aria-labelledby={`${id}-title`}>
  <header><p className="eyebrow">Chapter introduction · {words} words</p><h2 id={`${id}-title`}>{introduction.title}</h2><p className="currents-intro-question">{introduction.question}</p></header>
  <div className="currents-intro-abstract"><h3>Abstract</h3><p>{introduction.abstract}</p></div>
  {introduction.sections.map((section,index)=><section key={section.heading} aria-labelledby={`${id}-${index}`}><h3 id={`${id}-${index}`}>{section.heading}</h3>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.sources.length>0&&<p className="currents-intro-sources">{section.sources.map(source=>{const item=introduction.sources[source as keyof typeof introduction.sources];return <a key={source} href={item.url} target="_blank" rel="noreferrer">{item.label} ↗</a>;})}</p>}</section>)}
  <aside className="currents-intro-takeaway"><h3>Key takeaway</h3><p>{introduction.takeaway}</p></aside>
 </article>;
 return collapsible?<details className="currents-chapter-intro"><summary><span><small>Start here · Chapter introduction</small><strong>Why currents matter—and how warming changes them</strong></span><span className="currents-intro-toggle" aria-hidden="true"><span className="currents-intro-open-label">Read introduction ↓</span><span className="currents-intro-close-label">Close introduction ↑</span></span></summary>{article}</details>:<div className="currents-chapter-intro is-expanded">{article}</div>;
}
