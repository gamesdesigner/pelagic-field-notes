"use client";
import {createContext,useContext,useEffect,useRef,useState,type ReactNode,type FormEvent} from 'react';

import {LearningProvider} from './LearningProgress';

type Account={username:string;role?:'owner'};
type AccountUpdate={currentPassword:string;newUsername?:string;newPassword?:string};
const AccountContext=createContext<{user:Account;signOut:()=>Promise<void>;updateAccount:(change:AccountUpdate)=>Promise<void>}|null>(null);
export const useAccount=()=>useContext(AccountContext);

export default function AccountGate({children}:{children:ReactNode}){
 const [user,setUser]=useState<Account|null>(null);
 const [mode,setMode]=useState<'sign-in'|'sign-up'>('sign-up');
 const [checking,setChecking]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [visible,setVisible]=useState(false);
 const formRef=useRef<HTMLFormElement>(null);const requestVersion=useRef(0);
 useEffect(()=>{
  const controller=new AbortController();
  const refresh=async()=>{const version=requestVersion.current;try{const r=await fetch('/api/auth',{signal:controller.signal});if(!r.ok)return;const data=await r.json();if(version===requestVersion.current&&!controller.signal.aborted)setUser(data.user);}catch{}finally{if(!controller.signal.aborted)setChecking(false);}};
  void refresh();const timer=window.setInterval(()=>{if(document.visibilityState==='visible')void refresh();},60000);
  const onVisible=()=>{if(document.visibilityState==='visible')void refresh();};document.addEventListener('visibilitychange',onVisible);
  return()=>{controller.abort();window.clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);};
 },[]);
 async function signOut(){requestVersion.current++;setError('');try{const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'sign-out'})});if(!r.ok)throw Error('Could not sign out. Please try again.');setUser(null);setMode('sign-in');}catch(e){setError(e instanceof Error?e.message:'Please try again.');}}
 async function updateAccount(change:AccountUpdate){
  requestVersion.current++;
  const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'update-account',...change})});
  const data=await r.json();if(!r.ok)throw Error(data.error||'Could not update your account.');setUser(data.user);
 }
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;requestVersion.current++;setBusy(true);setError('');const data=new FormData(event.currentTarget);
  try{const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:mode,username:data.get('username'),password:data.get('password'),...(mode==='sign-up'?{email:data.get('email')}: {})})});const result=await r.json();if(!r.ok)throw Error(result.error||'Please try again.');formRef.current?.reset();setUser(result.user);setVisible(false);}catch(e){setError(e instanceof Error?e.message:'Accounts are temporarily unavailable. Please try again shortly.');}finally{setBusy(false);}
 }
 if(user)return <AccountContext.Provider value={{user,signOut,updateAccount}}>{error&&<p className="account-global-error" role="alert">{error}</p>}<LearningProvider identity={user.username}>{children}</LearningProvider></AccountContext.Provider>;
 return <main className="account-landing">
  <header className="account-landing-header"><span className="landing-edition">A living ocean field guide</span><img src="/assets/marine-biology-class-logo-transparent.png" alt="Marine Biology Class"/><span className="landing-age">For curious minds, ages 13+</span></header>
  <div className="account-landing-grid">
   <section className="account-discover" aria-labelledby="discover-title">
    <p className="account-eyebrow"><span/>Look closer. Go deeper.</p>
    <h1 id="discover-title">An ocean of<br/><em>understanding.</em></h1>
    <p className="landing-description">Discover marine life and the forces that move our oceans. Explore clear lessons, moving diagrams, and quizzes—from your first look to a high-school deep dive.</p>
    <figure className="landing-hero"><img src="/assets/turtles/green-turtle-grazing.png" alt="A green sea turtle grazing in a sunlit seagrass meadow" fetchPriority="high"/><figcaption><span>Inside the sunlight zone</span><strong>A closer look at life below.</strong><small>Green sea turtle · Lesson preview</small></figcaption><span className="landing-image-label">01 / FIELD NOTES</span></figure>
    <div className="landing-preview-grid"><figure><img src="/assets/sunlight/common-cuttlefish.png" alt="A common cuttlefish showing its patterned skin" loading="lazy"/><figcaption><small>Marine life</small><strong>The art of camouflage</strong></figcaption></figure><figure><img src="/assets/enso/el-nino-pacific.png" alt="Illustration of warm Pacific water and winds during El Niño" loading="lazy"/><figcaption><small>Ocean currents</small><strong>Why our oceans move</strong></figcaption></figure></div>
   </section>
   <aside className="account-entry" aria-labelledby="account-title">
    <div className="landing-form-card">
     <p className="account-eyebrow">Your next discovery starts here</p>
     <h2 id="account-title">{mode==='sign-up'?'Make room for curiosity.':'Welcome back, explorer.'}</h2>
     <p className="landing-form-description">{mode==='sign-up'?'Create your account and explore the living ocean at your own pace.':'Sign in to return to your ocean field guide.'}</p>
     <div className="account-mode-switch" role="group" aria-label="Account form"><button disabled={busy} aria-pressed={mode==='sign-up'} onClick={()=>{setMode('sign-up');setError('');setVisible(false);}}>Sign up</button><button disabled={busy} aria-pressed={mode==='sign-in'} onClick={()=>{setMode('sign-in');setError('');setVisible(false);}}>Sign in</button></div>
     {checking?<p className="account-intro" role="status">Opening your field notes…</p>:<form ref={formRef} onSubmit={submit} className="account-form" key={mode}>
      <label>Username<input name="username" placeholder="Your username" autoComplete="username" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]+( [A-Za-z0-9_]+)*" spellCheck={false} autoCapitalize="none" aria-describedby="username-help"/></label>
      <p id="username-help" className="account-field-help">3–24 letters, numbers, underscores, or spaces between words.</p>
      <label htmlFor="account-password">{mode==='sign-in'?'Password':'Create password'}</label><div className="account-password"><input id="account-password" name="password" type={visible?'text':'password'} placeholder={mode==='sign-in'?'Enter your password':'Choose a password'} autoComplete={mode==='sign-in'?'current-password':'new-password'} required maxLength={128}/><button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(v=>!v)}>{visible?'Hide':'Show'}</button></div>
      {mode==='sign-up'&&<label>Email <span>(optional)</span><input name="email" placeholder="you@example.com" type="email" autoComplete="email" maxLength={254}/></label>}
      {error&&<p className="account-form-error" role="alert">{error}</p>}
      <button className="account-primary account-submit" type="submit" disabled={busy}>{busy?'Opening your field guide…':mode==='sign-up'?'Create account →':'Sign in →'}</button>
      <p className="landing-persistence"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2"/><path d="M7 8V5a3 3 0 0 1 6 0v3"/></svg>Your account is saved. Stay signed in for 30 days.</p>
     </form>}
    </div>
    <div className="landing-learning-notes"><p>One ocean. Many ways to explore.</p><div><strong>12</strong><span>ocean lessons</span></div><div><strong>2</strong><span>reading levels</span></div><div><strong>∞</strong><span>reasons to wonder</span></div></div>
   </aside>
  </div>
  <footer className="account-landing-footer"><span>Marine Biology Class · By Max Yang</span><span>Stay curious. The ocean has more to teach us.</span></footer>
 </main>;
}
