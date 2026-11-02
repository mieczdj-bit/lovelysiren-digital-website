import {createHash} from 'node:crypto';
import {assertOpen,companyTransaction,revision,reject} from './lifecycle.js';
export const WORDING='promotional-preferences-review-010';
export const CHANNELS=['email','sms','postal'];
const digest=value=>createHash('sha256').update(value).digest('hex');
export function address(input){
 if(input==null)return null;
 if(typeof input!=='object'||Array.isArray(input))reject(400,'invalid-address');
 const limits={street:160,line2:160,city:100,region:100,postalCode:32,country:80},result={};
 if(Object.keys(input).some(k=>!Object.hasOwn(limits,k)))reject(400,'invalid-address');
 for(const [key,max]of Object.entries(limits)){const v=input[key]??'';if(typeof v!=='string'||[...v].length>max||/[\p{Cc}\p{Cf}]/u.test(v))reject(400,'invalid-address');if(v.trim())result[key]=v.trim();}
 return Object.keys(result).length?result:null;
}
export const usableAddress=a=>Boolean(a?.street&&a?.city&&a?.country);
export function localContactGate(db,c){if(process.env.FUNCTIONS_EMULATOR!=='true'||process.env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:19099'||process.env.FIREBASE_DATABASE_EMULATOR_HOST!=='127.0.0.1:19000'||db.app?.options?.projectId!=='demo-road-trip-arcade'||c.contactPreferencesEnabled!==true||c.marketingDisclosure?.status!=='test-fixture'||c.marketingDisclosure?.version!==WORDING)reject(503,'contact-preferences-inactive');}
export function recent(token,now){if(!Number.isFinite(token.auth_time)||token.auth_time>now/1000+30||now/1000-token.auth_time>300)reject(401,'recent-login-required');}
export function checkOwner(root,p){const current=root.profiles?.[p.firebaseUid];assertOpen(current,p);if(root.identityByUid?.[p.firebaseUid]?.lovelySirenId!==p.lovelySirenId||root.uidByIdentity?.[p.lovelySirenId]!==p.firebaseUid)reject(409,'identity-conflict');return current;}
export function preferenceView(record,p,user){const result={};for(const channel of CHANNELS){const c=record?.channels?.[channel];const matches=channel==='email'?user.emailVerified===true&&c?.binding===digest((user.email||'').toLowerCase()):channel==='sms'?Boolean(p.phone)&&c?.binding===digest(p.phone):usableAddress(p.address)&&c?.binding===digest(JSON.stringify(p.address));result[channel]={selected:Boolean(c?.selected&&matches),revision:c?.revision||0,status:c?.selected&&matches?(channel==='sms'?'pending-verification-and-disclosure':'permission-recorded-sending-inactive'):'off',deliveryEligible:false};}return{wordingVersion:WORDING,channels:result};}
export function withdrawContact(root,p,channel,now){const record=root.marketingPreferences?.[p.firebaseUid],c=record?.channels?.[channel];if(!c?.selected)return;if(record.firebaseUid!==p.firebaseUid||record.lovelySirenId!==p.lovelySirenId)reject(409,'identity-conflict');c.selected=false;c.status='withdrawn';c.revision++;c.withdrawnAt=now;delete c.binding;record.history??={};record.history[channel+'_'+c.revision]={channel,selected:false,at:now,reason:'contact-changed',wordingVersion:WORDING};}
export function createPreferences({db,auth,clock,read,ownedProfile,config}){
 async function context(token){const c=await config();localContactGate(db,c);if(auth.app?.options?.projectId!=='demo-road-trip-arcade')reject(503,'contact-preferences-inactive');const p=await ownedProfile(token);const user=await auth.getUser(token.uid);if(user.disabled||user.uid!==p.firebaseUid)reject(403,'account-unavailable');return{c,p,user};}
 return{
 async readPreferences(input,token){if(Object.keys(input).length)reject(400,'invalid-input');const {p,user}=await context(token);const record=await read('marketingPreferences/'+token.uid);if(record?.closed)reject(403,'account-unavailable');if(record&&(record.firebaseUid!==p.firebaseUid||record.lovelySirenId!==p.lovelySirenId))reject(409,'identity-conflict');return preferenceView(record,p,user);},
 async updatePreferences(input,token){
 if(Object.keys(input).some(k=>!['channel','selected','expectedRevision','requestId','wordingVersion'].includes(k))||!CHANNELS.includes(input.channel)||typeof input.selected!=='boolean'||!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<0||!/^pref_[a-zA-Z0-9-]{16,80}$/.test(input.requestId||'')||input.wordingVersion!==WORDING)reject(400,'invalid-input');
 const {c,p,user}=await context(token);recent(token,clock());
 if(input.selected&&(user.emailVerified!==true||user.email?.toLowerCase()!==token.email?.toLowerCase()))reject(403,'verify-required');
 const binding=input.channel==='email'?digest((user.email||'').toLowerCase()):input.channel==='sms'?p.phone&&digest(p.phone):usableAddress(p.address)&&digest(JSON.stringify(p.address));
 if(input.selected&&input.channel!=='email'&&!(p.contactRevision>0))reject(409,'contact-refresh-required');
 if(input.selected&&!binding)reject(400,'contact-required');
 const now=clock();await companyTransaction(db,root=>{const current=checkOwner(root,p);if(JSON.stringify(root.controls?.config)!==JSON.stringify(c))reject(409,'configuration-changed');if((current.contactRevision||0)!==(p.contactRevision||0))reject(409,'contact-changed');root.marketingPreferences??={};let r=root.marketingPreferences[token.uid];if(r&&(r.firebaseUid!==p.firebaseUid||r.lovelySirenId!==p.lovelySirenId))reject(409,'identity-conflict');if(r?.closed)reject(403,'account-unavailable');r??={firebaseUid:p.firebaseUid,lovelySirenId:p.lovelySirenId,channels:{},history:{}};const old=r.channels[input.channel]||{revision:0,selected:false};const prior=r.history[input.requestId]||(old.lastRequestId===input.requestId?{channel:input.channel,selected:old.selected,expectedRevision:old.lastExpectedRevision}:null);if(prior){if(prior.channel!==input.channel||prior.selected!==input.selected||prior.expectedRevision!==input.expectedRevision)reject(409,'request-id-conflict');return root;}
 if(old.revision!==input.expectedRevision)reject(409,'preference-changed');if(!Number.isSafeInteger(old.revision)||old.revision>=Number.MAX_SAFE_INTEGER)reject(409,'preference-history-review-required');if(input.selected&&old.selected&&old.binding===binding)return root;if(input.selected&&Object.keys(r.history).length>=1000)reject(409,'preference-history-review-required');
 r.channels[input.channel]={selected:input.selected,revision:old.revision+1,status:input.selected?(input.channel==='sms'?'pending-enrollment':'permission-recorded'):'withdrawn',wordingVersion:WORDING,lastRequestId:input.requestId,lastExpectedRevision:input.expectedRevision,...(input.selected?{selectedAt:now,binding}:{withdrawnAt:now})};if(input.selected||old.selected)r.history[input.requestId]={channel:input.channel,selected:input.selected,expectedRevision:input.expectedRevision,revision:old.revision+1,at:now,wordingVersion:WORDING,action:'authenticated-settings-selection',lifecycleRevision:revision(current)};root.marketingPreferences[token.uid]=r;return root;});return this.readPreferences({},token);
 }
 };
}
