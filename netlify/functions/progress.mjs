import {accountStore} from '../lib/blob-store.mjs';
import {createLearningHandler} from '../../server/accounts/learning-core.mjs';
export default async request=>{
 try{return await createLearningHandler({store:accountStore()})(request);}
 catch{return Response.json({error:'Progress is temporarily unavailable. Please try again shortly.'},{status:503,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
};
export const config={path:'/api/progress'};
