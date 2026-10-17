"use client";
import {useId,useState,type FormEvent} from 'react';
import {useAccount} from './AccountGate';

export default function AccountSettings({onClose}:{onClose:()=>void}){
 const account=useAccount();const id=useId();
 const [mode,setMode]=useState<'username'|'password'>('username');
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [notice,setNotice]=useState('');
 if(!account)return null;
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;const form=event.currentTarget;const data=new FormData(form);
  if(mode==='password'&&data.get('newPassword')!==data.get('confirmPassword')){setError('The new passwords do not match.');return;}
  setBusy(true);setError('');setNotice('');
  try{
   await account!.updateAccount({currentPassword:String(data.get('currentPassword')||''),...(mode==='username'?{newUsername:String(data.get('newUsername')||'')}:{newPassword:String(data.get('newPassword')||'')})});
   form.reset();setNotice(mode==='username'?'Your username is saved. Use it next time you sign in.':'Your password is saved. Use it next time you sign in.');
  }catch(e){setError(e instanceof Error?e.message:'Could not update your account.');}finally{setBusy(false);}
 }
 return <section className="account-settings" aria-labelledby={id+'title'}>
  <button className="student-back" type="button" onClick={onClose}>← Back to lessons</button>
  <p className="eyebrow">Your field notes</p><h1 id={id+'title'}>Account settings</h1>
  <p className="settings-description">Signed in as <strong>{account.user.username}</strong>. Your account stays saved when you leave.</p>
  <div className="account-mode-switch" role="group" aria-label="Choose what to change"><button type="button" disabled={busy} aria-pressed={mode==='username'} onClick={()=>{setMode('username');setError('');setNotice('');}}>Change username</button><button type="button" disabled={busy} aria-pressed={mode==='password'} onClick={()=>{setMode('password');setError('');setNotice('');}}>Change password</button></div>
  <form className="account-form" onSubmit={submit} key={mode}>
   <label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required maxLength={128}/></label>
   {mode==='username'?<><label>New username<input name="newUsername" autoComplete="username" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]+( [A-Za-z0-9_]+)*" defaultValue={account.user.username} aria-describedby={id+'help'}/></label><p className="account-field-help" id={id+'help'}>3–24 letters, numbers, underscores, or spaces between words.</p></>:<><label>New password<input name="newPassword" type="password" autoComplete="new-password" required maxLength={128}/></label><label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" required maxLength={128}/></label></>}
   <p className="account-field-help">Enter your current password to confirm. Other sign-in sessions will end after you save.</p>
   {error&&<p className="account-form-error" role="alert">{error}</p>}{notice&&<p className="student-notice" role="status">{notice}</p>}
   <button className="account-primary account-submit" disabled={busy} type="submit">{busy?'Saving…':mode==='username'?'Save username':'Save password'}</button>
  </form>
 </section>;
}
