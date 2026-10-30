import {OAuth2Client} from 'google-auth-library';
import {IdentityError} from './identity.js';

// Static deployment configuration, not client input or a public database allowlist.
// No production credentials are created, stored or granted by this module.
export function createServiceAuthorizer({audience,callers,clock=Date.now,verify}={}){
 const client=new OAuth2Client();
 const verifyToken=verify|| (async token=>(await client.verifyIdToken({idToken:token,audience})).getPayload());
 return async authorization=>{
  if(typeof audience!=='string'||!audience.startsWith('https://')||!Array.isArray(callers)||!callers.length||callers.some(c=>!c||typeof c.subject!=='string'||!/^\d{6,30}$/.test(c.subject)||!/^[-a-z0-9]+@[-a-z0-9.]+\.iam\.gserviceaccount\.com$/.test(c.email||'')||!/^[-a-z0-9]{1,40}$/.test(c.product||'')))throw new IdentityError(503,'service-auth-not-configured','unknown',true);
  if(typeof authorization!=='string'||!/^Bearer [A-Za-z0-9_.-]{20,10000}$/.test(authorization))throw new IdentityError(403,'service-not-authorized');
  let payload;try{payload=await verifyToken(authorization.slice(7));}catch(e){
   if(['ENOTFOUND','EAI_AGAIN','ECONNRESET','ECONNREFUSED','ETIMEDOUT'].includes(e.code)||e.response?.status>=500)throw new IdentityError(503,'temporarily-unavailable','unknown',true);
   throw new IdentityError(403,'service-not-authorized');
  }
  const now=Math.floor(clock()/1000);
  const caller=payload&&callers.find(c=>c.subject===payload.sub&&c.email===payload.email);
  if(!caller||!['https://accounts.google.com','accounts.google.com'].includes(payload.iss)||payload.aud!==audience||payload.email_verified!==true||!Number.isSafeInteger(payload.iat)||!Number.isSafeInteger(payload.exp)||payload.iat>now||now-payload.iat>300||payload.exp<=now||payload.exp<=payload.iat||payload.exp-payload.iat>3600)throw new IdentityError(403,'service-not-authorized');
  return{product:caller.product,subject:caller.subject};
 };
}
