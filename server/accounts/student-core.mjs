import {readSessionUser,response,findAccount,normalizeUsername,validUsername} from './auth-core.mjs';
const studentView=user=>({username:user.username,email:user.email||'',created:user.created,status:user.disabled?'paused':'active'});
export function createStudentHandler({store,now=()=>Date.now()}){return async req=>{
 try{
  const account=await readSessionUser(req,store,now);if(!account)return response({error:'Please sign in.'},401);
  if(account.user.role!=='owner')return response({error:'Only the owner can manage student accounts.'},403);
  if(req.method==='GET'){
   const url=new URL(req.url);const search=normalizeUsername(url.searchParams.get('search')||'');const after=normalizeUsername(url.searchParams.get('after')||'');
   if(!/^[a-z0-9_ ]{0,24}$/.test(search)||!/^[a-z0-9_ ]{0,24}$/.test(after))return response({error:'Search by the start of a username.'},400);
   const keys=(await store.list('users/')).filter(key=>key!==account.key);
   const rows=(await Promise.all(keys.map(key=>store.read(key)))).filter(Boolean).map(row=>row.value).filter(user=>normalizeUsername(user.username).startsWith(search)&&normalizeUsername(user.username)>after).sort((a,b)=>normalizeUsername(a.username)<normalizeUsername(b.username)?-1:1);
   return response({students:rows.slice(0,50).map(studentView),nextCursor:rows.length>50?normalizeUsername(rows[49].username):null});
  }
  if(req.method!=='POST')return response({error:'Method not allowed.'},405);
  if(req.headers.get('origin')!==new URL(req.url).origin)return response({error:'Please use the form on this website.'},403);
  if(!req.headers.get('content-type')?.startsWith('application/json'))return response({error:'Please send the form again.'},415);
  if(Number(req.headers.get('content-length')||0)>4096)return response({error:'Form is too large.'},413);
  const text=await req.text();if(text.length>4096)return response({error:'Form is too large.'},413);
  let body;try{body=JSON.parse(text);}catch{return response({error:'Please check the form.'},400);}
  if(!body||!['pause','activate'].includes(body.action)||!validUsername(body.username))return response({error:'Choose a student and an account action.'},400);
  for(let attempt=0;attempt<8;attempt++){
   const row=await findAccount(store,body.username);if(!row)return response({error:'Student account was not found.'},404);
   if(row.key===account.key)return response({error:'The owner account cannot be changed here.'},403);
   const disabled=body.action==='pause';const updated={...row.value,disabled,sessionVersion:(row.value.sessionVersion||0)+(disabled&&!row.value.disabled?1:0)};
   if(await store.write(row.key,updated,row.etag))return response({student:studentView(updated)});
  }return response({error:'This account changed elsewhere. Refresh and try again.'},409);
 }catch{return response({error:'Student accounts are temporarily unavailable. Please try again shortly.'},503);}
};}
