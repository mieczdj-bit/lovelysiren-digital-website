import {ACCOUNT_NAMESPACE,confirmedTransaction,reject} from './lifecycle.js';

// Narrow journal updates never authorize a protected profile change, deletion,
// or an external effect. Those checks remain in the company-state transaction.
export async function operationJournal(db,id,lease,expected,clock,change){
 const ref=db.ref(`${ACCOUNT_NAMESPACE}/deletionOperations/${id}`);
 return confirmedTransaction(ref,current=>{
    if(current.operationId!==id||current.version!==1||current.firebaseUid!==expected.firebaseUid||current.lovelySirenId!==expected.lovelySirenId||current.scope!==expected.scope||current.lifecycleRevision!==expected.lifecycleRevision)reject(409,'operation-owner-conflict');
    if(current.state!=='in-progress'||current.interruption||current.lease?.id!==lease||current.lease.expiresAt<=clock())reject(409,'worker-lease-lost');
    const before=structuredClone(current);change(current);
    const mutable=new Set(['steps','products','externalEffects','updatedAt']);
    for(const key of new Set([...Object.keys(before),...Object.keys(current)]))if(!mutable.has(key)&&JSON.stringify(before[key])!==JSON.stringify(current[key]))reject(409,'operation-journal-scope-violation');
    if(JSON.stringify(Object.keys(before.externalEffects||{}).sort())!==JSON.stringify(Object.keys(current.externalEffects||{}).sort()))reject(409,'operation-journal-scope-violation');
    for(const[id,effect]of Object.entries(before.externalEffects||{}))for(const key of ['id','kind','target','attempt','leaseId','lifecycleRevision','authCreatedAt','startedAt'])if(effect[key]!==current.externalEffects[id][key])reject(409,'operation-journal-scope-violation');
    current.updatedAt=clock();return current;
 },'operation-write-conflict');
}
