import {ACCOUNT_NAMESPACE,LifecycleError} from './lifecycle.js';

// Read-only server GETs avoid the Admin SDK's active transaction-query cache.
// Writes still require their existing CAS/lifecycle transactions.
export function createFreshReader(db,{fetchImpl=globalThis.fetch}={}){
 return async path=>{
  try{
   if(path!==ACCOUNT_NAMESPACE&&!path.startsWith(ACCOUNT_NAMESPACE+'/'))throw Error();
   const project=db.app?.options?.projectId,configured=db.app?.options?.databaseURL;
   if(db.app?.options?.databaseAuthVariableOverride!==undefined)throw Error();
   if(!['road-trip-arcade','demo-road-trip-arcade'].includes(project)||configured!==`https://${project}-default-rtdb.firebaseio.com`)throw Error();
   const host=process.env.FIREBASE_DATABASE_EMULATOR_HOST,local=Boolean(host);
   if(local&&(host!=='127.0.0.1:19000'||process.env.FUNCTIONS_EMULATOR!=='true'||project!=='demo-road-trip-arcade'))throw Error();
   if(!local&&(process.env.FUNCTIONS_EMULATOR==='true'||project!=='road-trip-arcade'))throw Error();
   const url=new URL(db.ref(path).toString());
   if(url.origin!==(local?'http://127.0.0.1:19000':`https://${project}-default-rtdb.firebaseio.com`)||url.username||url.password||url.hash)throw Error();
   url.pathname=url.pathname.replace(/\/$/,'')+'.json';url.search='';if(local)url.searchParams.set('ns',`${project}-default-rtdb`);
   const token=local?'owner':(await db.app.options.credential.getAccessToken()).access_token;
   if(typeof token!=='string'||!token)throw Error();
   const response=await fetchImpl(url,{method:'GET',headers:{Authorization:'Bearer '+token,'Cache-Control':'no-cache'},cache:'no-store',redirect:'error',signal:AbortSignal.timeout(5000)});
   if(response.status!==200)throw Error();return await response.json();
  }catch{throw new LifecycleError(503,'company-read-unavailable');}
 };
}
