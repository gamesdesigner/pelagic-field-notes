import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCallback);
export const SESSION_AGE=60*60*24*30;
const digest=value=>createHash('sha256').update(value).digest('hex');
export const normalizeUsername=value=>typeof value==='string'?value.trim().replace(/ +/g,' ').toLowerCase():'';
export const validUsername=value=>typeof value==='string'&&value.trim().length>=3&&value.trim().length<=24&&/^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/.test(value.trim());
const displayUsername=value=>value.trim().replace(/ +/g,' ');
const validPassword=value=>typeof value==='string'&&value.length>0&&value.length<=128;
export async function passwordRecord(password){const salt=randomBytes(16).toString('hex');return{salt,hash:(await scrypt(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024})).toString('hex'),passwordVersion:1};}
export async function passwordMatches(password,record){
 const actual=await scrypt(password,record?.salt||'00000000000000000000000000000000',64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
 const expected=record?Buffer.from(record.hash,'hex'):Buffer.alloc(64);
 return actual.length===expected.length&&timingSafeEqual(actual,expected)&&!!record;
}
const publicUser=(user,owner)=>({username:user.username,...(owner?{role:'owner'}:{})});
const cookieValue=req=>(req.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('mb_session='))?.slice(11);
const sessionCookie=(req,value,age)=>`mb_session=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(req.url).protocol==='https:'?'; Secure':''}`;
export function response(data,status=200,cookie){const headers={'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};if(cookie)headers['Set-Cookie']=cookie;return new Response(JSON.stringify(data),{status,headers});}
export async function findAccount(store,name){
 const normalized=normalizeUsername(name);if(!validUsername(normalized))return null;
 const alias=await store.read('names/'+normalized);
 const key=alias?.value.accountKey||'users/'+normalized;
 const row=await store.read(key);
 return row&&normalizeUsername(row.value.username)===normalized?{...row,key}:null;
}
export async function isOwner(store,key,record){const owner=await store.read('settings/owner');return !!owner&&(owner.value.accountKey?owner.value.accountKey===key:normalizeUsername(owner.value.username)===normalizeUsername(record.username));}
export async function readSessionUser(req,store,now=()=>Date.now()){
 const token=cookieValue(req);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
 const sessionKey='sessions/'+digest(token);const session=await store.read(sessionKey);if(!session)return null;
 const key=session.value.accountKey||'users/'+session.value.username;
 const row=await store.read(key);
 if(session.value.expires<=now()||!row||row.value.disabled||(row.value.sessionVersion||0)!==(session.value.sessionVersion||0)){await store.remove(sessionKey);return null;}
 return {user:publicUser(row.value,await isOwner(store,key,row.value)),record:row.value,etag:row.etag,key};
}
// Names are reserved permanently to the stable account key. An old username can
// never be used to take over a renamed account or its earlier sessions.
export async function reserveName(store,name,key){
 const normalized=normalizeUsername(name);const legacy=await store.read('users/'+normalized);
 if(legacy&&key!=='users/'+normalized)return false;
 const alias=await store.read('names/'+normalized);
 if(alias)return alias.value.accountKey===key;
 if(await store.write('names/'+normalized,{accountKey:key}))return true;
 return (await store.read('names/'+normalized))?.value.accountKey===key;
}
export function createAuthHandler({store,now=()=>Date.now(),clientIP=()=> 'local'}){
 async function rateLimit(req){
  const key='limits/'+digest(clientIP(req));
  for(let attempt=0;attempt<8;attempt++){
   const current=await store.read(key);const fresh=!current||current.value.reset<=now();
   const value=fresh?{count:1,reset:now()+15*60*1000}:{...current.value,count:current.value.count+1};
   if(value.count>20)return false;if(await store.write(key,value,current?.etag))return true;
  }return false;
 }
 async function startSession(req,key,user){
  const token=randomBytes(32).toString('hex');
  if(!await store.write('sessions/'+digest(token),{accountKey:key,username:user.username,sessionVersion:user.sessionVersion||0,expires:now()+SESSION_AGE*1000}))throw Error('Session could not be saved');
  return response({user:publicUser(user,await isOwner(store,key,user))},200,sessionCookie(req,token,SESSION_AGE));
 }
 return async function handler(req){
  try {
   if(req.method==='GET'){const current=await readSessionUser(req,store,now);return response({user:current?.user||null},200,!current&&cookieValue(req)?sessionCookie(req,'',0):undefined);}
   if(req.method!=='POST')return response({error:'Method not allowed.'},405);
   if(req.headers.get('origin')!==new URL(req.url).origin)return response({error:'Please use the form on this website.'},403);
   if(!req.headers.get('content-type')?.startsWith('application/json'))return response({error:'Please send the account form again.'},415);
   if(Number(req.headers.get('content-length')||0)>4096)return response({error:'Form is too large.'},413);
   const text=await req.text();if(text.length>4096)return response({error:'Form is too large.'},413);
   let body;try{body=JSON.parse(text);}catch{return response({error:'Please check the form.'},400);}
   if(!body||typeof body!=='object')return response({error:'Please check the form.'},400);
   if(body.action==='sign-out'){const token=cookieValue(req);if(token&&/^[a-f0-9]{64}$/.test(token))await store.remove('sessions/'+digest(token));return response({user:null},200,sessionCookie(req,'',0));}
   if(!['sign-in','sign-up','update-account'].includes(body.action))return response({error:'Unknown account action.'},400);
   if(!await rateLimit(req))return response({error:'Too many attempts. Please try again in 15 minutes.'},429);
   if(body.action==='update-account'){
    const account=await readSessionUser(req,store,now);if(!account)return response({error:'Please sign in again.'},401);
    if(!validPassword(body.currentPassword)||!await passwordMatches(body.currentPassword,account.record))return response({error:'Your current password is incorrect.'},401);
    const changingName=body.newUsername!==undefined;const changingPassword=body.newPassword!==undefined;
    if(!changingName&&!changingPassword)return response({error:'Enter a new username or password.'},400);
    if(changingName&&!validUsername(body.newUsername))return response({error:'Use 3–24 letters, numbers, underscores, or spaces between words.'},400);
    if(changingPassword&&!validPassword(body.newPassword))return response({error:'Enter a new password (up to 128 characters).'},400);
    const name=changingName?displayUsername(body.newUsername):account.record.username;
    if(!await reserveName(store,name,account.key))return response({error:'That username is already in use or reserved. Please choose another.'},409);
    // Upgrade old owner pointers before renaming, without changing ownership.
    const owner=await store.read('settings/owner');
    if(account.user.role==='owner'&&owner&&!owner.value.accountKey&&!await store.write('settings/owner',{...owner.value,accountKey:account.key},owner.etag))return response({error:'This account changed elsewhere. Please try again.'},409);
    const updated={...account.record,username:name,...(changingPassword?await passwordRecord(body.newPassword):{}),sessionVersion:(account.record.sessionVersion||0)+1,updated:now()};
    if(!await store.write(account.key,updated,account.etag))return response({error:'This account changed elsewhere. Sign in again and retry.'},409);
    return await startSession(req,account.key,updated);
   }
   if(!validUsername(body.username))return response({error:'Use 3–24 letters, numbers, underscores, or spaces between words.'},400);
   if(!validPassword(body.password))return response({error:'Enter a password (up to 128 characters).'},400);
   const normalized=normalizeUsername(body.username);const found=await findAccount(store,normalized);
   if(body.action==='sign-up'){
    const email=typeof body.email==='string'?body.email.trim():'';
    if(email.length>254||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return response({error:'Enter a valid email or leave it blank.'},400);
    const key='users/'+normalized;
    if(found||await store.read(key))return response({error:'That username is already in use. Please choose another.'},409);
    if(!await reserveName(store,normalized,key))return response({error:'That username is already in use or reserved. Please choose another.'},409);
    const user={username:displayUsername(body.username),...await passwordRecord(body.password),...(email?{email}:{}),created:now()};
    if(!await store.write(key,user))return response({error:'That username is already in use. Please choose another.'},409);
    return await startSession(req,key,user);
   }
   if(!await passwordMatches(body.password,found?.value))return response({error:'Username or password is incorrect.'},401);
   if(found.value.disabled)return response({error:'This account is paused. Please contact the website owner.'},403);
   return await startSession(req,found.key,found.value);
  }catch{return response({error:'Accounts are temporarily unavailable. Please try again shortly.'},503);}
 };
}
export function createMemoryStore(){const entries=new Map();let revision=0;return{
 async read(key){return entries.has(key)?structuredClone(entries.get(key)):null;},
 async write(key,value,etag){const current=entries.get(key);if(etag?current?.etag!==etag:!!current)return false;entries.set(key,{value:structuredClone(value),etag:String(++revision)});return true;},
 async remove(key){entries.delete(key);},async list(prefix){return [...entries.keys()].filter(key=>key.startsWith(prefix)).sort();},
};}
