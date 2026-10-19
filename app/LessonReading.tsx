"use client";

import {useEffect,useId,useRef,useState} from "react";
import {deepDives,readingSources,type LessonId} from "./deepDives";
import {introductoryArticles,teachingGuides} from "../shared/lesson-articles.mjs";
import {useLearning} from "./LearningProgress";

export default function LessonReading({lessonId}:{lessonId:LessonId}) {
  const learning=useLearning();
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState('');
  const initialized=useRef<LessonId|null>(null);
  const [level,setLevel]=useState<1|2>(1);
  const root=useRef<HTMLDivElement>(null);
  const id=useId();
  const guide=teachingGuides[lessonId];
  const article=level===1?introductoryArticles[lessonId]:deepDives[lessonId];
  const bodyWords=article.sections.flatMap(section=>section.paragraphs).join(' ').split(/\s+/).length;
  const words=bodyWords+article.abstract.split(/\s+/).length;
  const ready=learning?.ready,savedLevel=learning?.data.lessons[lessonId]?.readingLevel,save=learning?.save;
  useEffect(()=>{
    if(!ready||initialized.current===lessonId||!save)return;
    initialized.current=lessonId;
    const preferred=savedLevel||1;setLevel(preferred);
    save({action:'lesson',lessonId,readingLevel:preferred}).catch(e=>setSaveError(e.message));
  },[ready,savedLevel,save,lessonId]);
  async function markComplete(){
    if(!save||saving)return;
    setSaving(true);setSaveError('');
    try{await save({action:'lesson',lessonId,readingLevel:level,completed:true});}
    catch(e){setSaveError(e instanceof Error?e.message:'Could not save progress.');}
    finally{setSaving(false);}
  }
  function selectLevel(next:1|2){
    if(next===level)return;
    const returnToArticle=(root.current?.getBoundingClientRect().top??0)<0;
    setLevel(next);
    if(save)void save({action:'lesson',lessonId,readingLevel:next}).then(()=>setSaveError('')).catch(e=>setSaveError(e.message));
    if(returnToArticle)requestAnimationFrame(()=>root.current?.scrollIntoView({block:'start',behavior:'auto'}));
  }
  const articleId=`${id}-level-${level}`;
  return <div className="lesson-reading" ref={root} data-lesson-id={lessonId} data-reading-level={level}>
    <div className="reading-level-picker" role="group" aria-label={`${guide.title} reading level`}>
      <p>Choose your reading level</p>
      <div><button type="button" disabled={!!learning&&!ready} aria-pressed={level===1} aria-controls={`${id}-level-1`} onClick={()=>selectLevel(1)}>Level 1 <span>Short article</span></button><button type="button" disabled={!!learning&&!ready} aria-pressed={level===2} aria-controls={`${id}-level-2`} onClick={()=>selectLevel(2)}>Level 2 <span>High-school deep dive</span></button></div>
    </div>
    <div id={`${id}-level-1`} hidden={level!==1}>
      {level===1&&<TeachingArticle articleId={articleId} lessonId={lessonId} level={level} bodyWords={bodyWords} words={words}/>}
    </div>
    <div id={`${id}-level-2`} hidden={level!==2}>
      {level===2&&<TeachingArticle articleId={articleId} lessonId={lessonId} level={level} bodyWords={bodyWords} words={words}/>}
    </div>
    {learning&&<div className="lesson-account-progress"><div><strong>{learning.data.lessons[lessonId]?.completedAt?'✓ Lesson complete':'Your lesson progress'}</strong><p>{learning.data.lessons[lessonId]?.completedAt?'Saved to your account. You can revisit this lesson anytime.':'Finished reading? Check off this article to save your completion.'}</p>{saveError&&<p role="alert">{saveError}</p>}{learning.error&&<p role="alert">{learning.error} <button type="button" onClick={learning.reload}>Load progress again</button></p>}</div><button type="button" disabled={!ready||saving||!!learning.data.lessons[lessonId]?.completedAt} onClick={markComplete} aria-label={learning.data.lessons[lessonId]?.completedAt?'Article checked complete':'Check article complete'}>{saving?'Saving…':learning.data.lessons[lessonId]?.completedAt?'✓ Checked':'✓ Check'}</button></div>}
  </div>;
}

function TeachingArticle({articleId,lessonId,level,bodyWords,words}:{articleId:string;lessonId:LessonId;level:1|2;bodyWords:number;words:number}){
  const guide=teachingGuides[lessonId];
  const article=level===1?introductoryArticles[lessonId]:deepDives[lessonId];
  const objectives=level===1?guide.goals:guide.advancedGoals;
  const terms=level===1?guide.terms:deepDives[lessonId].terms;
  const sources=Array.from(new Set([...guide.sources,...(level===2?deepDives[lessonId].sections.flatMap(s=>s.sources||[]):[])]));
  return <article className={`teaching-article ${level===2?'deep-dive-article':'foundation-article'}`} aria-labelledby={`${articleId}-title`} data-teaching-style="explain-apply-review">
    <header><p className="teaching-eyebrow">Level {level} · {level===1?'Foundation':'High-school science'} · {bodyWords.toLocaleString('en-US')} words · {Math.ceil(words/180)} minute read</p><h2 id={`${articleId}-title`}>{article.title}</h2><p className="teaching-guiding-question"><span>Guiding question</span>{guide.question}</p></header>
    <section className="teaching-abstract" aria-labelledby={`${articleId}-abstract`}><h3 id={`${articleId}-abstract`}>Abstract</h3><p>{article.abstract}</p></section>
    <section className="teaching-goals" aria-labelledby={`${articleId}-goals`}><h3 id={`${articleId}-goals`}>Learning goals</h3><p>By the end, you should be able to:</p><ul>{objectives.map(goal=><li key={goal}>{goal}</li>)}</ul></section>
    <nav className="teaching-contents" aria-label="In this article"><strong>Build the explanation</strong><ol>{article.sections.map((section,index)=><li key={section.heading}><a href={`#${articleId}-section-${index}`}>{section.heading.replace(/^\d+\.\s*/,'')}</a></li>)}</ol></nav>
    <div className="teaching-body">{article.sections.map((section,index)=><section className="teaching-section" key={section.heading} aria-labelledby={`${articleId}-section-${index}`}><h3 id={`${articleId}-section-${index}`}><span aria-hidden="true">{String(index+1).padStart(2,'0')} · </span>{section.heading.replace(/^\d+\.\s*/,'')}</h3>{section.paragraphs.map((paragraph,p)=><p key={p}>{paragraph}</p>)}</section>)}</div>
    <aside className="teaching-terms"><h3>Key terms</h3><dl>{terms.map(term=><div key={term.word}><dt>{term.word}</dt><dd>{term.definition}</dd></div>)}</dl></aside>
    <aside className="teaching-recap"><h3>Key takeaway</h3><p>{guide.recap}</p></aside>
    <aside className="teaching-check"><h3>Check your understanding</h3><p>{guide.check.question}</p><details><summary>See an explanation</summary><p>{guide.check.explanation}</p></details></aside>
    <aside className="teaching-apply"><h3>Apply your learning</h3><p>{level===1?guide.application:deepDives[lessonId].question}</p></aside>
    <footer className="teaching-sources"><h3>Sources and further reading</h3><p>Use these sources to check the science and explore the evidence.</p><ul>{sources.map(key=><li key={key}><a href={readingSources[key].url} target="_blank" rel="noreferrer">{readingSources[key].label}</a></li>)}</ul></footer>
  </article>;
}
