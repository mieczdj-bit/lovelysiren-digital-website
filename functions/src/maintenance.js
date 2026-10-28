import {NAMESPACE} from './accounts.js';
// Server-only maintenance helper. No scheduled function is deployed by this branch.
// Never deletes accounts, identities, reservations, policy history, RTA records or entitlements.
export async function pruneExpiredCapabilities(db,{now=Date.now(),limit=100,dryRun=true}={}){
 if(!Number.isInteger(limit)||limit<1||limit>500)throw new Error('Bounded cleanup limit required');
 const counts={};const updates={};
 for(const group of ['registrationGrants','linkGrants','throttles','testInvitations']){
  const snapshot=await db.ref(`${NAMESPACE}/${group}`).orderByChild('expiresAt').startAt(1).endAt(now).limitToFirst(limit).get();counts[group]=snapshot.numChildren();
  snapshot.forEach(child=>{updates[`${group}/${child.key}`]=null;});
 }
 if(!dryRun&&Object.keys(updates).length)await db.ref(NAMESPACE).update(updates);
 return{dryRun,counts};
}
