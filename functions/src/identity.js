import {NAMESPACE,publishedPolicies} from './accounts.js';

export class IdentityError extends Error{
 constructor(status,code,accountState='unknown',retryable=false){super(code);Object.assign(this,{status,code,accountState,retryable});}
}
const fail=(...args)=>{throw new IdentityError(...args);};
const uidPattern=/^[A-Za-z0-9_-]{1,128}$/;
const idPattern=/^lsid_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const invalidCredential=new Set(['auth/argument-error','auth/invalid-argument','auth/invalid-id-token','auth/id-token-expired','auth/id-token-revoked','auth/user-disabled','auth/user-not-found']);

// Read-only capability: deliberately has no registration/identity allocation dependency.
export function createIdentityResolver({db,auth,projectId,clock=Date.now}){
 const read=async path=>(await db.ref(`${NAMESPACE}/${path}`).get()).val();
 return async function resolve(input){
  const now=clock();let token,user;
  try{token=await auth.verifyIdToken(input.endUserIdToken,true);}
  catch(e){if(invalidCredential.has(e.code))fail(401,'unauthenticated');throw e;}
  if(!uidPattern.test(token.uid||'')||token.sub!==token.uid||token.aud!==projectId||token.iss!==`https://securetoken.google.com/${projectId}`||token.firebase?.tenant||!['password','google.com'].includes(token.firebase?.sign_in_provider))fail(401,'unauthenticated');
  try{user=await auth.getUser(token.uid);}catch(e){if(invalidCredential.has(e.code))fail(401,'unauthenticated');throw e;}
  if(user.disabled)fail(401,'unauthenticated');
  if(token.email_verified!==true||user.emailVerified!==true||!token.email||token.email!==user.email)fail(403,'email-verification-required','email-verification-required');
  const config=await read('controls/config');
  if(config?.serviceEnabled!==true||config.mode!=='controlled-test'||config.identityResolutionEnabled!==true)fail(503,'not-ready','unknown',true);
  const [profile,mapping]=await Promise.all([read('profiles/'+token.uid),read('identityByUid/'+token.uid)]);
  if(!profile&&!mapping)fail(404,'registration-required','missing-company-account');
  if(!profile||!mapping||!idPattern.test(mapping.lovelySirenId||'')||profile.firebaseUid!==token.uid||profile.lovelySirenId!==mapping.lovelySirenId)fail(503,'identity-conflict');
  const owner=await read('uidByIdentity/'+mapping.lovelySirenId);
  if(owner!==token.uid)fail(503,'identity-conflict');
  if(profile.state!=='active')fail(403,'account-unavailable',['pendingVerification','disabled','closing','deleted'].includes(profile.state)?profile.state:'unavailable');
  if(profile.ageCategory!=='adult')fail(403,'eligibility-required','eligibility-required');
  let docs;try{docs=publishedPolicies(config.policy,now);}catch{fail(503,'policy-pending','unknown',true);}
  const acceptance=profile.policyAcceptance;
  if(!acceptance||acceptance.termsVersion!==docs.terms.version||acceptance.privacyVersion!==docs.privacy.version||acceptance.termsSha256!==docs.terms.sha256||acceptance.privacySha256!==docs.privacy.sha256||!Number.isFinite(acceptance.acceptedAt)||acceptance.acceptedAt<=0||acceptance.acceptedAt>now)fail(428,'consent-required','consent-required');
  const revision=profile.lifecycleRevision??0;
  if(!Number.isSafeInteger(revision)||revision<0)fail(503,'identity-conflict');
  // Fail closed if lifecycle, policy or mappings changed while this lookup was in flight.
  const [latestProfile,latestMapping,latestOwner,latestConfig]=await Promise.all([read('profiles/'+token.uid),read('identityByUid/'+token.uid),read('uidByIdentity/'+mapping.lovelySirenId),read('controls/config')]);
  if(JSON.stringify(latestProfile)!==JSON.stringify(profile)||JSON.stringify(latestMapping)!==JSON.stringify(mapping)||latestOwner!==owner||JSON.stringify(latestConfig)!==JSON.stringify(config))fail(409,'resolution-changed','unknown',true);
  return{version:1,lovelySirenId:mapping.lovelySirenId,firebaseProjectId:projectId,firebaseUid:token.uid,accountState:'active',lifecycleRevision:revision,resolvedAt:new Date(clock()).toISOString()};
 };
}

// Shared by the deployed HTTP entry point and focused emulator tests.
export function createIdentityHandler({resolve,authorizeService,enabled=()=>false}){
 return async(req,res)=>{
  res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');
  let requestId;
  try{
   if(!enabled())fail(503,'not-ready','unknown',true);
   if(req.method!=='POST')fail(405,'method-not-allowed');
   if(req.path.replace(/^\/+|\/+$/g,'')!=='identity.resolve.v1')fail(404,'not-found');
   // Server-to-server only. No CORS grants, including preflight.
   if(req.get('Origin'))fail(403,'service-not-authorized');
   const service=await authorizeService(req.get('Authorization'));
   const body=req.body;
   if(!req.is('application/json')||req.rawBody?.length>16384||!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(k=>!['version','requestId','product','endUserIdToken'].includes(k))||body.version!==1||typeof body.requestId!=='string'||!/^[-A-Za-z0-9_]{8,100}$/.test(body.requestId)||body.product!==service.product||typeof body.endUserIdToken!=='string'||!/^[A-Za-z0-9_.-]{20,10000}$/.test(body.endUserIdToken))fail(400,'invalid-input');
   requestId=body.requestId;
   res.status(200).json({...await resolve(body),requestId});
  }catch(e){const known=e instanceof IdentityError;res.status(known?e.status:503).json({version:1,...(requestId?{requestId}:{}),accountState:known?e.accountState:'unknown',error:{code:known?e.code:'temporarily-unavailable',retryable:known?e.retryable:true}});}
 };
}
