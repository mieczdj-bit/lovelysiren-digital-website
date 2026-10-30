import {NAMESPACE} from './accounts.js';
// Server-only helper, dry-run by default. Never scans permanent account or RTA paths.
const GROUPS=Object.freeze(['registrationGrants','linkGrants','throttles','testInvitations']);
export async function pruneExpiredCapabilities(db,{now=Date.now(),limit=100,dryRun=true}={}){
 if(!Number.isInteger(limit)||limit<1||limit>500||!Number.isFinite(now)||now<0||typeof dryRun!=='boolean')throw new Error('Valid time, boolean dry-run and bounded cleanup limit required');
 const counts={},removed={},skipped={};
 for(const group of GROUPS){
  const snapshot=await db.ref(`${NAMESPACE}/${group}`).orderByChild('expiresAt').startAt(1).endAt(now).limitToFirst(limit).get();
  const keys=[];snapshot.forEach(child=>{keys.push(child.key);});counts[group]=keys.length;removed[group]=0;skipped[group]=0;
  if(dryRun)continue;
  for(const key of keys){
   // Recheck at deletion time: an invitation/counter can have been renewed since the query.
   // Transactions make partial failure/retry idempotent and cannot erase a renewed record.
   const result=await db.ref(`${NAMESPACE}/${group}/${key}`).transaction(current=>{
    // A cold RTDB transaction may first see null locally. Propose the no-op delete
    // so server compare-and-swap can return its actual value before deciding.
    if(current===null)return null;
    if(!Number.isFinite(current.expiresAt)||current.expiresAt<=0||current.expiresAt>now)return;
    return null;
   },undefined,false);
   if(result.committed)removed[group]++;else skipped[group]++;
  }
 }
 return{dryRun,counts,removed,skipped};
}
