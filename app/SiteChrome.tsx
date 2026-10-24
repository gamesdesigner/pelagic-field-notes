"use client";
import type {ReactNode} from 'react';
import {contactEmail} from '../shared/library-content.mjs';
import {navigateSite,type SitePage} from './siteNavigation';

export function SiteLink({href,children,className,current,onNavigate}:{href:string;children:ReactNode;className?:string;current?:boolean;onNavigate?:()=>void}){
 return <a href={href} className={className} aria-current={current?'page':undefined} onClick={event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();onNavigate?.();navigateSite(href);
 }}>{children}</a>;
}
export function SiteHeader({page,onLearn,accountTools}:{page:SitePage;onLearn?:()=>void;accountTools?:ReactNode}){
 return <header className="site-header library-header"><div className="library-header-main">
  <SiteLink href="/" className="brand" onNavigate={onLearn}><img src="/assets/marine-biology-class-logo-transparent.png" alt="Marine Biology Class home" width="320" height="98"/></SiteLink>
  <nav className="library-main-nav" aria-label="Main navigation"><SiteLink href="/" current={page==='learn'} onNavigate={onLearn}>Learn</SiteLink><SiteLink href="/about" current={page==='about'}>About</SiteLink><SiteLink href="/contact" current={page==='contact'}>Contact</SiteLink></nav>
 </div>{accountTools||<div className="library-auth-links"><SiteLink href="/sign-in" current={page==='sign-in'}>Sign in</SiteLink><SiteLink href="/sign-up" className="library-join" current={page==='sign-up'}>Join now</SiteLink></div>}</header>;
}
export function SiteFooter({onLearn}:{onLearn?:()=>void}={}){
 return <footer className="library-footer"><div><strong>Marine Biology Class</strong><p>Made with curiosity. By Max Yang.</p></div><nav aria-label="Footer navigation"><SiteLink href="/" onNavigate={onLearn}>Learn</SiteLink><SiteLink href="/about">About</SiteLink><SiteLink href="/contact">Contact</SiteLink><a href={`mailto:${contactEmail}`}>{contactEmail}</a></nav><small>© 2026 Marine Biology Class</small></footer>;
}
