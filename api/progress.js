import {response} from '../server/accounts/auth-core.mjs';
import {createLearningHandler} from '../server/accounts/learning-core.mjs';
import {accountStore} from '../server/accounts/vercel-store.mjs';
export default {async fetch(request){try{return await createLearningHandler({store:accountStore()})(request);}catch{return response({error:'Progress is temporarily unavailable. Please try again.'},503);}}};
