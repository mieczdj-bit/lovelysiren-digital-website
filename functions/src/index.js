import {initializeApp,getApps} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getDatabase} from 'firebase-admin/database';
import {onRequest} from 'firebase-functions/v2/https';
import {createAccountBackend,AccountError} from './accounts.js';
import {LifecycleError} from './lifecycle.js';
import {createIdentityResolver,createIdentityHandler} from './identity.js';
import {createServiceAuthorizer} from './identity-service-auth.js';
const projectId=process.env.GCLOUD_PROJECT||process.env.GOOGLE_CLOUD_PROJECT||'road-trip-arcade';
const local=process.env.FUNCTIONS_EMULATOR==='true';
if(local&&projectId!=='demo-road-trip-arcade')throw new Error('Local tests must use the isolated demo namespace');
if(!local&&(process.env.FIREBASE_AUTH_EMULATOR_HOST||process.env.FIREBASE_DATABASE_EMULATOR_HOST))throw new Error('Emulator hosts are forbidden in the live runtime');
if(projectId!=='road-trip-arcade'&&!(local&&projectId==='demo-road-trip-arcade'))throw new Error('Unexpected Firebase project');
const app=getApps()[0]||initializeApp({projectId,databaseURL:`https://${projectId}-default-rtdb.firebaseio.com`});
const auth=getAuth(app);const db=getDatabase(app);const backend=createAccountBackend({db,auth});
let identityCallers;try{identityCallers=JSON.parse(process.env.IDENTITY_SERVICE_CALLERS||'[]');}catch{identityCallers=[];}
export const lovelysirenIdentityApi=onRequest({region:'us-central1',invoker:'private',maxInstances:2,timeoutSeconds:30,memory:'256MiB'},createIdentityHandler({
 resolve:createIdentityResolver({db,auth,projectId}),
 authorizeService:createServiceAuthorizer({audience:process.env.IDENTITY_SERVICE_AUDIENCE,callers:identityCallers}),
 enabled:()=>process.env.IDENTITY_RESOLVER_ENABLED==='true'
}));
const anonymous=new Map([['registration/eligibility','eligibility'],['registration/prepare','prepare'],['registration/provision','provision']]);
const protectedRoutes=new Map([['policies/status','policyStatus'],['policies/accept','acceptPolicies'],['registration/complete','complete'],['profile/read','readProfile'],['profile/update','updateProfile'],['verification/authorize','verification'],['providers/google/prepare','prepareLink'],['providers/google/complete','completeLink']]);
export const lovelysirenAccountsApi=onRequest({region:'us-central1',maxInstances:2,timeoutSeconds:30,memory:'256MiB'},async(req,res)=>{
 res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');
 try{
  // Deployment alone does not enable the API. This server environment gate must be approved separately.
  if(process.env.ACCOUNT_TEST_API_ENABLED!=='true')throw new AccountError(503,'not-ready');
  const config=await backend.config();const origin=req.get('Origin');
  if(!origin||!Array.isArray(config.allowedOrigins)||!config.allowedOrigins.includes(origin))throw new AccountError(403,'not-authorized');
  res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');res.set('Access-Control-Allow-Headers','Content-Type, Authorization');res.set('Access-Control-Allow-Methods','POST, OPTIONS');
  if(req.method==='OPTIONS'){res.status(204).send('');return;}
  if(req.method!=='POST')throw new AccountError(405,'method-not-allowed');
  if(!req.is('application/json')||req.rawBody?.length>16384||!req.body||Array.isArray(req.body)||typeof req.body!=='object')throw new AccountError(400,'invalid-input');
  const path=req.path.replace(/^\/+|\/+$/g,'');let result;
  if(anonymous.has(path))result=await backend[anonymous.get(path)](req.body,{ip:req.ip||'unknown'});
  else if(protectedRoutes.has(path)){
   const bearer=req.get('Authorization')||'';if(!/^Bearer [A-Za-z0-9_.-]{20,8000}$/.test(bearer))throw new AccountError(401,'sign-in-required');
   let token;try{token=await auth.verifyIdToken(bearer.slice(7),true);}catch{throw new AccountError(401,'sign-in-required');}
   if(!/^[A-Za-z0-9_-]{1,128}$/.test(token.uid))throw new AccountError(403,'not-authorized');
   result=await backend[protectedRoutes.get(path)](req.body,token);
  }else throw new AccountError(404,'not-found');
  res.status(200).json(result);
 }catch(error){
  // Do not log raw request bodies, passwords, DOB, tokens or Firebase errors containing account information.
  const known=error instanceof AccountError||error instanceof LifecycleError;res.status(known?error.status:503).json({error:known?error.code:'temporarily-unavailable'});
 }
});
