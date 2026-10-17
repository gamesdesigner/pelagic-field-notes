"use client";
import { useEffect, useState, type FormEvent } from 'react';
import { useAccount } from './AccountGate';

type Student = {username:string; email:string; created:number; status:'active'|'paused'};

export default function StudentAccounts({onClose}:{onClose:()=>void}) {
  const account=useAccount();
  const [students,setStudents]=useState<Student[]>([]);
  const [input,setInput]=useState('');const [search,setSearch]=useState('');
  const [cursor,setCursor]=useState('');const [history,setHistory]=useState<string[]>([]);
  const [next,setNext]=useState<string|null>(null);const [refresh,setRefresh]=useState(0);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  const [busy,setBusy]=useState('');const [confirm,setConfirm]=useState('');const [notice,setNotice]=useState('');
  const isOwner=account?.user.role==='owner';
  useEffect(()=>{
    if(!isOwner)return;
    const controller=new AbortController();setLoading(true);setError('');setConfirm('');
    const query=new URLSearchParams({search,after:cursor});
    fetch('/api/students?'+query,{signal:controller.signal}).then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||'Could not load student accounts.');if(!controller.signal.aborted){setStudents(data.students);setNext(data.nextCursor);}}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Could not load student accounts.');}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[isOwner,search,cursor,refresh]);
  async function change(student:Student,action:'pause'|'activate') {
    if(busy)return;setBusy(student.username);setError('');setNotice('');
    try {const r=await fetch('/api/students',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:student.username,action})});const data=await r.json();if(!r.ok)throw Error(data.error||'Could not update this account.');setStudents(rows=>rows.map(row=>row.username===student.username?data.student:row));setConfirm('');setNotice(`${student.username} is now ${action==='pause'?'paused':'active'}.`);}
    catch(e){setError(e instanceof Error?e.message:'Could not update this account.');}finally{setBusy('');}
  }
  function find(event:FormEvent) {event.preventDefault();setSearch(input.trim().toLowerCase());setCursor('');setHistory([]);setRefresh(value=>value+1);setNotice('');}
  if(!isOwner)return null;
  return <main className="site-shell owner-shell">
    <header className="site-header"><button className="brand" onClick={onClose} aria-label="Return to lessons"><img src="/assets/marine-biology-class-logo-transparent.png" alt="Marine Biology Class"/></button><div className="account-header-tools"><span className="owner-badge">Owner</span><button onClick={account.signOut}>Sign out</button></div></header>
    <section className="student-manager" aria-labelledby="student-manager-title">
      <button className="student-back" onClick={onClose}>← Back to lessons</button><p className="eyebrow">Owner workspace</p><h1 id="student-manager-title">Student accounts</h1><p className="student-manager-intro">Find a student, check their account, and manage access to your ocean lessons.</p>
      <form className="student-search" onSubmit={find}><label>Find a student<input value={input} onChange={e=>setInput(e.target.value)} placeholder="Username starts with…" pattern="[A-Za-z0-9_]*" maxLength={24} autoComplete="off"/></label><button type="submit">Search</button><button type="button" onClick={()=>{setInput('');setSearch('');setCursor('');setHistory([]);setRefresh(v=>v+1);}}>Show all</button></form>
      <div className="student-toolbar"><span>{loading?'Loading accounts…':`${students.length} student${students.length===1?'':'s'} on this page`}</span><button onClick={()=>setRefresh(v=>v+1)} disabled={loading||!!busy}>Refresh</button></div>
      {error&&<p className="account-form-error" role="alert">{error}</p>}{notice&&<p className="student-notice" role="status">{notice}</p>}
      {!loading&&!error&&students.length===0&&<div className="student-empty"><h2>{search?'No matching students yet.':'Your students will appear here.'}</h2><p>{search?'Try a different username prefix.':'Students can create an account using the regular Sign up button.'}</p></div>}
      {!loading&&!error&&<ul className="student-list">{students.map(student=><li key={student.username}><div className="student-identity"><h2>{student.username}</h2><p>{student.email||'No email provided'}</p><p>Joined {new Date(student.created).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})}</p></div><span className={`student-status ${student.status}`}>{student.status==='active'?'Active':'Paused'}</span><div className="student-actions">{confirm===student.username?<><p>Pause {student.username}? They will be signed out at their next session check and cannot sign in until reactivated.</p><div><button className="student-pause" disabled={!!busy} onClick={()=>change(student,'pause')}>{busy?'Saving…':'Confirm pause'}</button><button disabled={!!busy} onClick={()=>setConfirm('')}>Cancel</button></div></>:<button disabled={!!busy} onClick={()=>student.status==='active'?setConfirm(student.username):change(student,'activate')}>{busy===student.username?'Saving…':student.status==='active'?'Pause account':'Reactivate account'}</button>}</div></li>)}</ul>}
      <nav className="student-pages" aria-label="Student account pages"><button disabled={!history.length||loading||!!busy} onClick={()=>{setCursor(history.at(-1)||'');setHistory(value=>value.slice(0,-1));}}>Previous</button><button disabled={!next||loading||!!busy} onClick={()=>{setHistory(value=>[...value,cursor]);setCursor(next||'');}}>Next</button></nav>
      <p className="student-access-note">Pausing preserves the student’s account and ends their sessions. Reactivating lets them sign in again. Passwords and setup codes are never shown here.</p>
    </section>
  </main>;
}
