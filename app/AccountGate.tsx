"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Account = { username: string };
const AccountContext = createContext<{user: Account; signOut: () => Promise<void>} | null>(null);
export const useAccount = () => useContext(AccountContext);

export default function AccountGate({children}: {children: ReactNode}) {
  const [user, setUser] = useState<Account | null>(null);
  const [mode, setMode] = useState<'welcome'|'sign-in'|'sign-up'>('welcome');
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { const controller = new AbortController(); fetch('/api/auth', {signal:controller.signal}).then(r=>r.ok?r.json():{user:null}).then(data=>setUser(data.user)).catch(()=>{}).finally(()=>setChecking(false)); return ()=>controller.abort(); }, []);
  async function signOut() {
    setError('');
    try { const r = await fetch('/api/auth', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'sign-out'})}); if(!r.ok)throw Error('Could not sign out. Please try again.');setUser(null);setMode('welcome'); }
    catch(e){setError(e instanceof Error?e.message:'Please try again.');}
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(busy)return;setBusy(true);setError('');
    const data = new FormData(event.currentTarget);
    try {
      const r = await fetch('/api/auth', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:mode,username:data.get('username'),password:data.get('password'),...(mode==='sign-up'?{email:data.get('email')}: {})})});
      const result = await r.json(); if(!r.ok)throw Error(result.error || 'Please try again.');
      formRef.current?.reset();setUser(result.user);setVisible(false);
    } catch(e){setError(e instanceof Error?e.message:'Accounts are temporarily unavailable. Please try again shortly.');}
    finally {setBusy(false);}
  }
  if(user)return <AccountContext.Provider value={{user,signOut}}>{error&&<p className="account-global-error" role="alert">{error}</p>}{children}</AccountContext.Provider>;
  return <main className="account-opening">
    <div className="account-ocean-lines" aria-hidden="true"><i/><i/><i/></div>
    <section className={`account-welcome ${mode!=='welcome'?'with-form':''}`} aria-labelledby="account-title">
      <img className="account-logo" src="/assets/marine-biology-class-logo-transparent.png" alt="Marine Biology Class"/>
      <p className="account-eyebrow">A field guide to the living ocean</p>
      <h1 id="account-title">{mode==='welcome'?<>A little curiosity.<br/><em>An ocean to explore.</em></>:mode==='sign-up'?'Begin your ocean journey.':'Welcome back.'}</h1>
      {checking?<p className="account-intro" role="status">Opening your field notes…</p>:mode==='welcome'?<>
        <p className="account-intro">Follow the currents. Meet remarkable marine life.<br/>Explore at your own depth.</p>
        <div className="account-start-buttons"><button className="account-primary" onClick={()=>{setMode('sign-up');setError('');}}>Sign up</button><button className="account-secondary" onClick={()=>{setMode('sign-in');setError('');}}>Sign in</button></div>
        <div className="account-features"><span>12 ocean lessons</span><span>Two reading levels</span><span>Interactive discoveries</span></div>
      </>:<>
        <div className="account-mode-switch" role="group" aria-label="Account form"><button aria-pressed={mode==='sign-in'} onClick={()=>{setMode('sign-in');setError('');setVisible(false);}}>Sign in</button><button aria-pressed={mode==='sign-up'} onClick={()=>{setMode('sign-up');setError('');setVisible(false);}}>Sign up</button></div>
        <form ref={formRef} onSubmit={submit} className="account-form" key={mode}>
          <label>Username<input name="username" autoComplete="username" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}" spellCheck={false} autoCapitalize="none" aria-describedby="username-help"/></label>
          <p id="username-help" className="account-field-help">3–24 letters, numbers, or underscores.</p>
          <label htmlFor="account-password">{mode==='sign-up'?'Create password':'Password'}</label><div className="account-password"><input id="account-password" name="password" type={visible?'text':'password'} autoComplete={mode==='sign-up'?'new-password':'current-password'} required maxLength={128} aria-describedby="password-help"/><button type="button" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(v=>!v)}>{visible?'Hide':'Show'}</button></div>
          <p id="password-help" className="account-field-help">Choose a password. Short passwords are allowed.</p>
          {mode==='sign-up'&&<label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength={254}/></label>}
          {error&&<p className="account-form-error" role="alert">{error}</p>}
          <button className="account-primary account-submit" type="submit" disabled={busy}>{busy?'Please wait…':mode==='sign-up'?'Create account':'Sign in'}</button>
        </form>
        <button className="account-back" onClick={()=>{setMode('welcome');setError('');}}>← Back to welcome</button>
      </>}
    </section>
    <p className="account-opening-footer">Marine Biology Class <span>·</span> By Max Yang</p>
  </main>;
}
