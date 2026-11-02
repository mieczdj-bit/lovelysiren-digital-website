// Shared company-state guards. No product paths, credentials or deletion privileges.
export const ACCOUNT_NAMESPACE='lovelySirenAccountsV1';
export class LifecycleError extends Error{constructor(status,code){super(code);Object.assign(this,{status,code});}}
export const reject=(status,code)=>{throw new LifecycleError(status,code);};
export const OPEN_STATES=Object.freeze(['pendingVerification','active']);
export const TRANSITIONS=Object.freeze({pendingVerification:['active','disabled','closing'],active:['disabled','closing'],disabled:['active','pendingVerification','closing'],closing:['deletionBlocked','deleted'],deletionBlocked:['closing'],deleted:[]});
export function revision(profile){const r=profile?.lifecycleRevision??0;if(!Number.isSafeInteger(r)||r<0)reject(409,'invalid-lifecycle-revision');return r;}
export function changedState(profile,state,now){const r=revision(profile);if(profile.state===state)return profile;if(!TRANSITIONS[profile.state]?.includes(state))reject(409,'invalid-lifecycle-transition');if(r===Number.MAX_SAFE_INTEGER)reject(409,'invalid-lifecycle-revision');return{...profile,state,lifecycleRevision:r+1,updatedAt:now};}
export function assertOpen(profile,expected){if(!profile||!OPEN_STATES.includes(profile.state))reject(403,'account-unavailable');revision(profile);if(expected&&(profile.firebaseUid!==expected.firebaseUid||profile.lovelySirenId!==expected.lovelySirenId||profile.state!==expected.state||revision(profile)!==revision(expected)))reject(409,'lifecycle-changed');}
// A failed validation returns the ORIGINAL value, forcing server CAS validation.
// Aborting against the SDK's first, partial/stale local cache can falsely reject
// a concurrent user's valid record. Never return a partially mutated candidate.
export async function confirmedTransaction(ref,change,conflictCode='company-write-conflict',conflictStatus=409){
 for(let attempt=0;attempt<4;attempt++){
  let failure,result;
  try{
   // Do not warm an overlapping SDK query with get(): a concurrent response
   // can replace its server cache while transaction callbacks are in flight.
   // The transaction protocol itself obtains/validates authoritative state.
   result=await ref.transaction(current=>{failure=undefined;if(current===null)return null;try{return change(structuredClone(current));}catch(e){failure=e;return current;}},undefined,false);
  }catch(e){
   // Local set/update calls can cancel overlapping SDK transactions. Retry only
   // these explicit cancellation results; never replay an ambiguous network error.
   if(['set','overriddenBySet'].includes(e.message)&&attempt<3){await new Promise(resolve=>setTimeout(resolve,20*(attempt+1)));continue;}
   if(e instanceof LifecycleError||Number.isInteger(e.status)&&e.status>=400&&e.status<600&&/^[a-z-]+$/.test(e.code||''))throw e;
   reject(503,'company-store-unavailable');
  }
  if(failure)throw failure;
  if(!result.committed||!result.snapshot.val())reject(conflictStatus,conflictCode);
  return result.snapshot.val();
 }
 reject(409,conflictCode);
}
export async function companyTransaction(db,mutate){return confirmedTransaction(db.ref(ACCOUNT_NAMESPACE),mutate);}
export async function guardedProfileUpdate(db,uid,expected,update){const p=await confirmedTransaction(db.ref(`${ACCOUNT_NAMESPACE}/profiles/${uid}`),current=>{assertOpen(current,expected);return update(current);},'account-unavailable',403);assertOpen(p);return p;}
