import { createAuthHandler, createMemoryStore } from './auth-core.mjs';
import { createStudentHandler } from './student-core.mjs';
export function localAccounts(_options = {}) {
  const store = createMemoryStore();
  const routes = { '/api/auth': createAuthHandler({store,clientIP:()=> 'local-preview'}), '/api/students': createStudentHandler({store}) };
  return {
    name:'local-account-preview',
    configureServer(server) {
      for (const [path, handler] of Object.entries(routes)) server.middlewares.use(path,async(req,res)=> {
        try {
          const chunks=[];let size=0;
          for await(const chunk of req){size+=chunk.length;if(size>4096){res.statusCode=413;res.end('{"error":"Form is too large."}');return;}chunks.push(chunk);}
          const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(', '):value);
          const request=new Request(`http://${req.headers.host}${path}${req.url === '/' ? '' : req.url || ''}`,{method:req.method,headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
          const result=await handler(request);res.statusCode=result.status;for(const [key,value] of result.headers)res.setHeader(key,value);res.end(await result.text());
        } catch{res.statusCode=503;res.end('{"error":"Local accounts are temporarily unavailable."}');}
      });
    },
  };
}
