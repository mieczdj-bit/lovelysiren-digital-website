import {createHash,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
export const NAMESPACE='lovelySirenAccountsV1';
export const hash=value=>createHash('sha256').update(String(value)).digest('hex');
export const normalizeEmail=value=>String(value||'').trim().toLowerCase();
export class AccountError extends Error{constructor(status,code){super(code);this.status=status;this.code=code;}}
export const fail=(status,code)=>{throw new AccountError(status,code);};
export function eligibleAdult(birthDate,now){
 const dob=String(birthDate||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(dob))fail(400,'invalid-input');
 const [y,m,d]=dob.split('-').map(Number);const date=new Date(0);date.setUTCFullYear(y,m-1,d);date.setUTCHours(0,0,0,0);
 if(y<1||date.getUTCFullYear()!==y||date.getUTCMonth()+1!==m||date.getUTCDate()!==d||date.getTime()>now)fail(403,'not-authorized');
 const today=new Date(now);let age=today.getUTCFullYear()-y;if(today.getUTCMonth()+1<m||(today.getUTCMonth()+1===m&&today.getUTCDate()<d))age--;
 return age>=18;
}
export function publishedPolicies(policy,now,{emulator=process.env.FUNCTIONS_EMULATOR==='true'}={}){
 if(policy?.approved!==true||policy.minimumAge!==18||!policy.termsVersion||!policy.privacyVersion)fail(503,'policy-pending');
 const result={};
 for(const [key,kind,version]of [['terms','website-terms',policy.termsVersion],['privacy','website-privacy',policy.privacyVersion]]){
  const doc=policy.documents?.[key];
  const fixture=emulator&&doc?.status==='test-fixture';
  if(!doc||(!fixture&&doc.status!=='published')||doc.kind!==kind||doc.version!==version||!/^\d{4}-\d{2}-\d{2}$/.test(doc.effectiveDate||'')||!Number.isFinite(Date.parse(doc.effectiveDate))||new Date(doc.effectiveDate).toISOString().slice(0,10)!==doc.effectiveDate||Date.parse(doc.effectiveDate)>now||!/^([a-f0-9]{64})$/.test(doc.sha256||''))fail(503,'policy-pending');
  let url;try{url=new URL(doc.url);}catch{fail(503,'policy-pending');}
  if(!fixture&&(url.origin!=='https://lovelysirendigital.com'||url.pathname!==(key==='terms'?'/terms.html':'/privacy.html')||url.search||url.hash))fail(503,'policy-pending');
  result[key]={version:doc.version,url:doc.url,sha256:doc.sha256,effectiveDate:doc.effectiveDate};
 }
 return result;
}
export function validatePreparation(input,policy,now){
 const documents=publishedPolicies(policy,now);
 if(input.accepted!==true||input.termsVersion!==policy.termsVersion||input.privacyVersion!==policy.privacyVersion)fail(403,'not-authorized');
 const name=String(input.displayName||'').trim();const email=normalizeEmail(input.email);const phone=String(input.phone||'').trim().replace(/[\s().-]/g,'');
 if([...name].length<2||[...name].length>40||!/^[\p{L}\p{M}\p{N} ._'’-]+$/u.test(name)||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||phone&&!/^\+[1-9]\d{6,14}$/.test(phone))fail(400,'invalid-input');
 if(!eligibleAdult(input.birthDate,now))fail(403,'not-authorized');
 if('password' in input||'uid' in input||'lovelySirenId' in input)fail(400,'invalid-input');
 return{displayName:name,email,...(phone?{phone}:{}),ageCategory:'adult',policyAcceptance:{termsVersion:policy.termsVersion,privacyVersion:policy.privacyVersion,termsSha256:documents.terms.sha256,privacySha256:documents.privacy.sha256,acceptedAt:now}};
}
export function validateProfile(input){
 if(Object.keys(input).some(k=>!['displayName','phone'].includes(k)))fail(400,'invalid-input');
 const displayName=String(input.displayName||'').trim();const phone=input.phone==null?null:String(input.phone).trim().replace(/[\s().-]/g,'');
 if([...displayName].length<2||[...displayName].length>40||!/^[\p{L}\p{M}\p{N} ._'’-]+$/u.test(displayName)||phone&&!/^\+[1-9]\d{6,14}$/.test(phone))fail(400,'invalid-input');
 return{displayName,phone:phone||null};
}
export function createAccountBackend({db,auth,clock=Date.now,uuid=randomUUID,secret=()=>randomBytes(32).toString('base64url')}){
 const ref=path=>db.ref(`${NAMESPACE}/${path}`);const read=async path=>(await ref(path).get()).val();
 async function config(){const c=await read('controls/config');if(!c?.serviceEnabled||c.mode!=='controlled-test')fail(503,'not-ready');return c;}
 async function throttle(key,limit,period){let allowed=false;const now=clock();const outcome=await ref('throttles/'+hash(key)).transaction(current=>{const value=current&&current.expiresAt>now?current:{count:0,expiresAt:now+period};allowed=value.count<limit;if(!allowed)return;return{count:value.count+1,expiresAt:value.expiresAt};},undefined,false);if(!allowed||!outcome.committed)fail(429,'rate-limited');}
 function checkCode(code,expected){if(typeof code!=='string'||code.length<20||code.length>200||typeof expected!=='string'||!/^[a-f0-9]{64}$/.test(expected))return false;return timingSafeEqual(Buffer.from(hash(code),'hex'),Buffer.from(expected,'hex'));}
 async function grant(token){if(typeof token!=='string'||token.length<30||token.length>200)fail(403,'not-authorized');const key=hash(token);const record=await read('registrationGrants/'+key);if(!record||!Number.isFinite(record.expiresAt)||record.expiresAt<=clock())fail(403,'not-authorized');return{key,record};}
 async function assertInvitation(emailKey){const invite=await read('testInvitations/'+emailKey);if(!invite?.enabled||!Number.isFinite(invite.expiresAt)||invite.expiresAt<=clock())fail(403,'not-authorized');return invite;}
 async function identity(uid){
  const existing=await read('identityByUid/'+uid);if(existing){const owner=(await ref('uidByIdentity/'+existing.lovelySirenId).transaction(current=>current||uid,undefined,false)).snapshot.val();if(owner!==uid)fail(503,'identity-conflict');return existing;}
  for(let attempt=0;attempt<5;attempt++){
   const proposed='lsid_'+uuid();const claim=(await ref('identityClaims/'+uid).transaction(current=>current||{lovelySirenId:proposed,createdAt:clock()},undefined,false)).snapshot.val();
   if(!claim?.lovelySirenId)fail(503,'retry-later');const id=claim.lovelySirenId;
   const owner=(await ref('uidByIdentity/'+id).transaction(current=>current||uid,undefined,false)).snapshot.val();
   if(owner===uid){const finalized=(await ref('identityByUid/'+uid).transaction(current=>current||{lovelySirenId:id,createdAt:claim.createdAt},undefined,false)).snapshot.val();if(finalized?.lovelySirenId!==id)fail(503,'identity-conflict');return finalized;}
   await ref('identityClaims/'+uid).transaction(current=>!current?null:current?.lovelySirenId===id?{lovelySirenId:'lsid_'+uuid(),createdAt:clock()}:undefined,undefined,false);
  }
  fail(503,'retry-later');
 }
 async function ownedProfile(token,verified=true,enforcePolicy=true){
  const c=await config();if(verified&&token.email_verified!==true)fail(403,'verify-required');
  const p=await read('profiles/'+token.uid);if(!p||p.firebaseUid!==token.uid||!['pendingVerification','active'].includes(p.state))fail(403,'setup-required');
  const canonical=await read('identityByUid/'+token.uid);const owner=canonical&&await read('uidByIdentity/'+canonical.lovelySirenId);
  if(!canonical||canonical.lovelySirenId!==p.lovelySirenId||owner!==token.uid)fail(403,'setup-required');
  if(enforcePolicy&&c.policy?.requiresReacceptance){publishedPolicies(c.policy,clock());if(p.policyAcceptance?.termsVersion!==c.policy.termsVersion||p.policyAcceptance?.privacyVersion!==c.policy.privacyVersion)fail(428,'policy-required');}
  return p;
 }
 function view(p){return{firebaseUid:p.firebaseUid,lovelySirenId:p.lovelySirenId,displayName:p.displayName,phone:p.phone||null,accountStatus:'active'};}
 return{
  config,
  async eligibility(input,context){const c=await config();if(!c.registrationEnabled)fail(403,'not-authorized');if(Object.keys(input).some(k=>k!=='birthDate'))fail(400,'invalid-input');await throttle('eligibility-ip:'+context.ip,30,3600000);return{eligible:eligibleAdult(input.birthDate,clock())};},
  async policyStatus(input,token){if(Object.keys(input).length)fail(400,'invalid-input');await ownedProfile(token,true,false);return publishedPolicies((await config()).policy,clock());},
  async acceptPolicies(input,token){
   if(Object.keys(input).some(k=>!['accepted','termsVersion','privacyVersion'].includes(k)))fail(400,'invalid-input');
   await ownedProfile(token,true,false);const c=await config();const documents=publishedPolicies(c.policy,clock());
   if(input.accepted!==true||input.termsVersion!==c.policy.termsVersion||input.privacyVersion!==c.policy.privacyVersion)fail(403,'not-authorized');
   const acceptance={termsVersion:c.policy.termsVersion,privacyVersion:c.policy.privacyVersion,termsSha256:documents.terms.sha256,privacySha256:documents.privacy.sha256,acceptedAt:clock()};
   const key=hash(acceptance.termsVersion+'|'+acceptance.privacyVersion);
   await ref('policyHistory/'+token.uid+'/'+key).transaction(current=>current||acceptance,undefined,false);
   await ref('profiles/'+token.uid).update({policyAcceptance:acceptance,updatedAt:clock()});return{accepted:true};
  },
  async prepare(input,context){
   const c=await config();if(!c.registrationEnabled)fail(403,'not-authorized');
   await throttle('registration-ip:'+context.ip,20,3600000);
   const emailKey=hash(normalizeEmail(input.email));await throttle('registration-email:'+emailKey,10,3600000);
   const invite=await assertInvitation(emailKey);if(invite.existingUid&&!/^[A-Za-z0-9_-]{1,128}$/.test(invite.existingUid))fail(503,'not-ready');if(!checkCode(input.invitationCode,invite.codeHash))fail(403,'not-authorized');
   const profile=validatePreparation(input,c.policy,clock());if(input.method!=='password')fail(403,'provider-disabled');
   const reservation=(await ref('registrationReservations/'+emailKey).transaction(current=>current||{authUid:invite.existingUid||'webtest_'+uuid(),createdAt:clock(),existingAccount:Boolean(invite.existingUid)},undefined,false)).snapshot.val();
   if(reservation.completed)fail(403,'not-authorized');
   const token=secret();await ref('registrationGrants/'+hash(token)).set({state:'prepared',emailKey,authUid:reservation.authUid,existingAccount:reservation.existingAccount,profile,createdAt:clock(),expiresAt:clock()+15*60000});
   return{registrationGrant:token,flow:reservation.existingAccount?'sign-in-existing':'controlled-provisioning'};
  },
  async provision(input,context){
   const c=await config();if(!c.registrationEnabled)fail(403,'not-authorized');const documents=publishedPolicies(c.policy,clock());await throttle('provision-ip:'+context.ip,20,3600000);
   const {key,record}=await grant(input.registrationGrant);await assertInvitation(record.emailKey);
   if(record.profile.policyAcceptance.termsVersion!==c.policy.termsVersion||record.profile.policyAcceptance.privacyVersion!==c.policy.privacyVersion||record.profile.policyAcceptance.termsSha256!==documents.terms.sha256||record.profile.policyAcceptance.privacySha256!==documents.privacy.sha256)fail(403,'policy-pending');
   if(record.existingAccount)fail(403,'existing-sign-in-required');
   if(typeof input.password!=='string'||input.password.length<15||input.password.length>128)fail(400,'password-policy');
   const lease=secret();const now=clock();
   const leaseResult=await ref('registrationGrants/'+key).transaction(current=>{
    if(!current)return null;
    if(current.expiresAt<=now||current.state==='completed')return;
    if(current.state==='provisioning'&&current.leaseUntil>now)return;
    return{...current,state:'provisioning',lease,leaseUntil:now+60000};
   },undefined,false);
   if(!leaseResult.committed||leaseResult.snapshot.val()?.lease!==lease)fail(409,'retry-later');
   try{
    let account;
    try{account=await auth.createUser({uid:record.authUid,email:record.profile.email,password:input.password,displayName:record.profile.displayName,emailVerified:false});}
    catch(error){if(error.code!=='auth/uid-already-exists')throw error;account=await auth.getUser(record.authUid);}
    if(normalizeEmail(account.email)!==record.profile.email||account.disabled)fail(403,'not-authorized');
    await ref('registrationGrants/'+key).transaction(current=>!current?null:current?.lease===lease?{...current,state:'provisioned',lease:null,leaseUntil:null}:undefined,undefined,false);
    return{provisioned:true};
   }catch(error){if(process.env.FUNCTIONS_EMULATOR==='true')console.warn('controlled-provision-failure-code',error.code||error.name);await ref('registrationGrants/'+key).transaction(current=>!current?null:current?.lease===lease?{...current,state:'prepared',lease:null,leaseUntil:null}:undefined,undefined,false);if(error instanceof AccountError)throw error;fail(409,'registration-not-completed');}
  },
  async complete(input,token){
   const c=await config();if(!c.registrationEnabled)fail(403,'not-authorized');const documents=publishedPolicies(c.policy,clock());const {key,record}=await grant(input.registrationGrant);
   if(record.authUid!==token.uid||normalizeEmail(token.email)!==record.profile.email)fail(403,'not-authorized');
   if(record.state!=='completed'){
    try{await assertInvitation(record.emailKey);}catch(error){const prior=await read('profiles/'+token.uid);if(prior?.registrationGrantHash!==key)throw error;}
    if(!record.existingAccount&&record.state!=='provisioned')fail(403,'not-authorized');
    if(record.profile.policyAcceptance.termsVersion!==c.policy?.termsVersion||record.profile.policyAcceptance.privacyVersion!==c.policy?.privacyVersion||record.profile.policyAcceptance.termsSha256!==documents.terms.sha256||record.profile.policyAcceptance.privacySha256!==documents.privacy.sha256||c.policy?.approved!==true)fail(403,'policy-pending');
   }
   const canonical=await identity(token.uid);
   const now=clock();const proposed={registrationGrantHash:key,firebaseUid:token.uid,lovelySirenId:canonical.lovelySirenId,displayName:record.profile.displayName,...(record.profile.phone?{phone:record.profile.phone}:{}),ageCategory:'adult',policyAcceptance:record.profile.policyAcceptance,state:token.email_verified?'active':'pendingVerification',createdAt:now,updatedAt:now};
   const result=(await ref('profiles/'+token.uid).transaction(current=>current||proposed,undefined,false)).snapshot.val();
   if(result.firebaseUid!==token.uid||result.lovelySirenId!==canonical.lovelySirenId)fail(503,'identity-conflict');
   const acceptanceKey=hash(record.profile.policyAcceptance.termsVersion+'|'+record.profile.policyAcceptance.privacyVersion);
   await ref('policyHistory/'+token.uid+'/'+acceptanceKey).transaction(current=>current||record.profile.policyAcceptance,undefined,false);
   await ref('registrationGrants/'+key).update({state:'completed',completedAt:record.completedAt||now});
   await ref('registrationReservations/'+record.emailKey).update({completed:true});
   await ref('testInvitations/'+record.emailKey).update({enabled:false});
   return{completed:true,verificationRequired:token.email_verified!==true};
  },
  async readProfile(input,token){
   if(Object.keys(input).length)fail(400,'invalid-input');const p=await ownedProfile(token);if(p.state!=='active')await ref('profiles/'+token.uid).update({state:'active',verifiedAt:clock()});return{profile:view(p)};
  },
  async updateProfile(input,token){
   await ownedProfile(token);if(clock()/1000-token.auth_time>300)fail(401,'recent-login-required');
   const values=validateProfile(input);await ref('profiles/'+token.uid).update({...values,updatedAt:clock()});
   // Do not mutate RTA users/{uid} or its display-name token invariant in this pass.
   return{updated:true};
  },
  async verification(input,token){
   if(Object.keys(input).length)fail(400,'invalid-input');await ownedProfile(token,false);if(token.email_verified)fail(409,'already-verified');
   await throttle('verification:'+token.uid,1,60000);return{authorized:true};
  },
  async prepareLink(input,token){
   const c=await config();if(!c.googleLinkingEnabled)fail(403,'provider-disabled');await ownedProfile(token);
   if(clock()/1000-token.auth_time>300)fail(401,'recent-login-required');
   const account=await auth.getUser(token.uid);if(account.providerData.some(p=>p.providerId==='google.com'))return{connected:true};
   const linkGrant=secret();const p=await ownedProfile(token);await ref('linkGrants/'+hash(linkGrant)).set({uid:token.uid,lovelySirenId:p.lovelySirenId,expiresAt:clock()+5*60000});return{linkGrant};
  },
  async completeLink(input,token){
   const c=await config();if(!c.googleLinkingEnabled)fail(403,'provider-disabled');const p=await ownedProfile(token);
   if(typeof input.linkGrant!=='string'||input.linkGrant.length>200)fail(403,'not-authorized');const key=hash(input.linkGrant);const g=await read('linkGrants/'+key);
   if(!g||g.uid!==token.uid||g.lovelySirenId!==p.lovelySirenId||!Number.isFinite(g.expiresAt)||g.expiresAt<=clock()||clock()/1000-token.auth_time>300)fail(403,'not-authorized');
   const account=await auth.getUser(token.uid);if(!account.providerData.some(provider=>provider.providerId==='google.com'))fail(403,'not-linked');
   // Actual Firebase linking enforces provider uniqueness; no email lookup, reassignment or entitlement mutation.
   await ref('linkGrants/'+key).transaction(current=>!current?null:!current.completedAt?{...current,completedAt:clock()}:undefined,undefined,false);return{connected:true};
  }
 };
}
