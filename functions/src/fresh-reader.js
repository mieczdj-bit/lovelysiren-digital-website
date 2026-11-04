import {ACCOUNT_NAMESPACE,LifecycleError} from './lifecycle.js';

// Read-only server GETs avoid the Admin SDK's active transaction-query cache.
// Writes still require their existing CAS/lifecycle transactions.
export function createFreshReader(db){
 return async path=>{
  try{
   if(path!==ACCOUNT_NAMESPACE&&!path.startsWith(ACCOUNT_NAMESPACE+'/'))throw Error();
   const project=db.app?.options?.projectId,configured=db.app?.options?.databaseURL;
   const host=process.env.FIREBASE_DATABASE_EMULATOR_HOST,local=Boolean(host);
   if(!['road-trip-arcade','demo-road-trip-arcade'].includes(project))throw Error();
   if(local){if(host!=='127.0.0.1:19000'||process.env.FUNCTIONS_EMULATOR!=='true'||project!=='demo-road-trip-arcade'||configured!==`https://${project}-default-rtdb.firebaseio.com`||db.app?.options?.databaseAuthVariableOverride!==undefined)throw Error();}
   else{
    if(process.env.FUNCTIONS_EMULATOR==='true'||project!=='road-trip-arcade'||configured!==process.env.ACCOUNT_DATABASE_URL||!db.app?.options?.databaseAuthVariableOverride||db.app.options.databaseAuthVariableOverride.uid!=='lovelysiren-account-service')throw Error();
    const url=new URL(configured);if(url.protocol!=='https:'||url.origin===`https://${project}-default-rtdb.firebaseio.com`||!url.hostname.startsWith('road-trip-arcade-lovelysiren-accounts-')||!(/\.firebaseio\.com$|\.firebasedatabase\.app$/i).test(url.hostname))throw Error();
   }
   const snapshot=await db.ref(path).get();return snapshot.exists()?snapshot.val():null;
  }catch{throw new LifecycleError(503,'company-read-unavailable');}
 };
}
