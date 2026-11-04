// Reproducible, offline registration-only candidate. Output is ignored under work/.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
function replaceOnce(source,before,after,label){const at=source.indexOf(before);if(at<0||source.indexOf(before,at+before.length)>=0)throw Error(`Expected one ${label} source anchor`);return source.slice(0,at)+after+source.slice(at+before.length);}
function build(){
 const folder=require('./prepare-staging-007.cjs').build();
 const backend=path.join(folder,'functions-account'),src=path.join(backend,'src');
 let entry=fs.readFileSync(path.join(src,'index.js'),'utf8').replace(/\r\n/g,'\n');
 entry=replaceOnce(entry,"const local=process.env.FUNCTIONS_EMULATOR==='true';\nif(local&&projectId!=='demo-road-trip-arcade')throw new Error('Local tests must use the isolated demo namespace');\nif(!local&&(process.env.FIREBASE_AUTH_EMULATOR_HOST||process.env.FIREBASE_DATABASE_EMULATOR_HOST))throw new Error('Emulator hosts are forbidden in the live runtime');\nif(projectId!=='road-trip-arcade'&&!(local&&projectId==='demo-road-trip-arcade'))throw new Error('Unexpected Firebase project');", "const local=false;\nif(projectId!=='road-trip-arcade')throw new Error('Candidate is bound to the reviewed shared Firebase project');\nif(process.env.FUNCTIONS_EMULATOR==='true'||process.env.FIREBASE_AUTH_EMULATOR_HOST||process.env.FIREBASE_DATABASE_EMULATOR_HOST)throw new Error('Emulator configuration is forbidden in this deployment candidate');",'deployment project/emulator guard');
 entry=entry.replace("['preferences/read','readPreferences'],['preferences/update','updatePreferences'],",'');
 entry=replaceOnce(entry,'export const lovelysirenAccountsApi=','export const lovelysirenAccounts014Api=','staging function export');
 entry=replaceOnce(entry,"serviceAccount:'lovelysiren-accounts-test@road-trip-arcade.iam.gserviceaccount.com'","serviceAccount:'lovelysiren-accounts-staging@road-trip-arcade.iam.gserviceaccount.com'",'staging runtime identity');
 if(/identity|preferences\/(?:read|update)|maintenance|deletion|contact/i.test(entry))throw Error('Privileged or inactive feature route leaked into candidate entry');
 fs.writeFileSync(path.join(src,'index.js'),entry);

 let accounts=fs.readFileSync(path.join(src,'accounts.js'),'utf8').replace(/\r\n/g,'\n');
 let freshReader=fs.readFileSync(path.join(src,'fresh-reader.js'),'utf8').replace(/\r\n/g,'\n');
 const freshStart=freshReader.indexOf('export function createFreshReader(');
 if(freshStart<0||!freshReader.includes('databaseAuthVariableOverride.uid!==\'lovelysiren-account-service\''))throw Error('Fresh reader lacks the isolated database service boundary');
 freshReader=`import {ACCOUNT_NAMESPACE,LifecycleError} from './lifecycle.js';\nexport function createFreshReader(db){return async path=>{try{if(path!==ACCOUNT_NAMESPACE&&!path.startsWith(ACCOUNT_NAMESPACE+'/'))throw Error();const app=db.app?.options,url=app?.databaseURL,parsed=new URL(url);if(app?.projectId!=='road-trip-arcade'||url!==process.env.ACCOUNT_DATABASE_URL||app?.databaseAuthVariableOverride?.uid!=='lovelysiren-account-service'||parsed.protocol!=='https:'||!parsed.hostname.startsWith('road-trip-arcade-lovelysiren-accounts-')||!(/\\.firebaseio\\.com$|\\.firebasedatabase\\.app$/i).test(parsed.hostname))throw Error();const snapshot=await db.ref(path).get();return snapshot.exists()?snapshot.val():null;}catch{throw new LifecycleError(503,'company-read-unavailable');}};}\n`;
 fs.writeFileSync(path.join(src,'fresh-reader.js'),freshReader);
 const policyStart=accounts.indexOf('export function publishedPolicies('),policyEnd=accounts.indexOf('export function validatePreparation(',policyStart);
 if(policyStart<0||policyEnd<0)throw Error('Unable to isolate policy fixture guard');
 accounts=accounts.slice(0,policyStart)+`export function publishedPolicies(policy,now){
 if(policy?.approved!==true||policy.minimumAge!==18||!policy.termsVersion||!policy.privacyVersion)fail(503,'policy-pending');
 const result={};
 for(const [key,kind,version]of [['terms','website-terms',policy.termsVersion],['privacy','website-privacy',policy.privacyVersion]]){
  const doc=policy.documents?.[key];
  if(!doc||doc.status!=='published'||doc.kind!==kind||doc.version!==version||!/^\\d{4}-\\d{2}-\\d{2}$/.test(doc.effectiveDate||'')||!Number.isFinite(Date.parse(doc.effectiveDate))||new Date(doc.effectiveDate).toISOString().slice(0,10)!==doc.effectiveDate||Date.parse(doc.effectiveDate)>now||!/^([a-f0-9]{64})$/.test(doc.sha256||''))fail(503,'policy-pending');
  let url;try{url=new URL(doc.url);}catch{fail(503,'policy-pending');}
  if(url.origin!=='https://lovelysirendigital.com'||url.pathname!==(key==='terms'?'/terms.html':'/privacy.html')||url.search||url.hash)fail(503,'policy-pending');
  result[key]={version:doc.version,url:doc.url,sha256:doc.sha256,effectiveDate:doc.effectiveDate};
 }
 return result;
}
`+accounts.slice(policyEnd);
 accounts=replaceOnce(accounts,"import {address,localContactGate,recent,checkOwner,withdrawContact,createPreferences} from './contact-preferences.js';", "function recent(token,now){if(!Number.isFinite(token.auth_time)||token.auth_time>now/1000+30||now/1000-token.auth_time>300)fail(401,'recent-login-required');}",'contact preference import');
 accounts=replaceOnce(accounts,"if(process.env.FUNCTIONS_EMULATOR==='true')console.warn('controlled-provision-failure-code',error.code||error.name);",'','emulator-only diagnostic');
 accounts=replaceOnce(accounts,'  ...createPreferences({db,auth,clock,read,ownedProfile,config}),\n','', 'marketing preference route methods');
 accounts=replaceOnce(accounts,"if(Object.keys(input).some(k=>!['displayName','phone','address','contactRevision'].includes(k)))fail(400,'invalid-input');", "if(Object.keys(input).some(k=>!['displayName','phone'].includes(k)))fail(400,'invalid-input');",'profile allowlist');
 accounts=replaceOnce(accounts," return{displayName,phone:phone||null,...('address' in input?{address:address(input.address)}:{})};",' return{displayName,phone:phone||null};','optional address profile implementation');
 accounts=replaceOnce(accounts,'function view(p){return{firebaseUid:p.firebaseUid,lovelySirenId:p.lovelySirenId,displayName:p.displayName,phone:p.phone||null,address:p.address||null,contactRevision:p.contactRevision||0,accountStatus:\'active\'};}','function view(p){return{firebaseUid:p.firebaseUid,lovelySirenId:p.lovelySirenId,displayName:p.displayName,phone:p.phone||null,accountStatus:\'active\'};}','profile response');
 const profileStart=accounts.indexOf('  async updateProfile(input,token){'),profileEnd=accounts.indexOf('  async verification(input,token){',profileStart);
 if(profileStart<0||profileEnd<0)throw Error('Unable to isolate account profile update in candidate source');
 accounts=accounts.slice(0,profileStart)+"  async updateProfile(input,token){const p=await ownedProfile(token);recent(token,clock());const values=validateProfile(input);await guardedProfileUpdate(db,token.uid,p,current=>({...current,...values,updatedAt:clock()}));return{updated:true};},\n"+accounts.slice(profileEnd);
 const inactiveHits=[...accounts.matchAll(/createPreferences|marketingPreferences|contactPreferencesEnabled|address\s*\(|test-fixture|emulator|demo-road-trip-arcade|local-emulator/ig)].map(m=>m[0]);
 if(inactiveHits.length)throw Error('Inactive registration-candidate code remains: '+[...new Set(inactiveHits)].join(', '));
 fs.writeFileSync(path.join(src,'accounts.js'),accounts);
 for(const file of ['maintenance.js','contact-preferences.js'])fs.rmSync(path.join(src,file),{force:true});
 const outConfig=path.join(folder,'firebase.account-014.json');
 fs.writeFileSync(outConfig,JSON.stringify({functions:[{source:'functions-account',codebase:'lovelysiren-account-first-launch-014',ignore:['node_modules','.git','.env*','*.log']}]},null,2)+'\n');
 const staticConfig=fs.readFileSync(path.join(folder,'public/account/config.js'),'utf8');
 if(!staticConfig.includes('registrationEnabled: false')||!staticConfig.includes('backendBaseUrl: null')||!staticConfig.includes('privacyVersion: null'))throw Error('Client package is not inactive/unapproved');
 const controls=JSON.parse(fs.readFileSync(path.join(root,'staging/account-014-controls.review.json'),'utf8'));
 if(Object.entries(controls).some(([key,value])=>/Enabled$/.test(key)&&value!==false))throw Error('Control template contains an enabled feature');
 const required=['registration/google/prepare','registration/google/complete'];
 for(const route of required)if(!entry.includes(route))throw Error(`Required controlled registration route missing: ${route}`);
 const forbiddenFiles=['src/identity.js','src/identity-service-auth.js','src/deletion.js','src/operation-journal.js','src/maintenance.js','src/contact-entry.js','src/contact/submission.js','src/contact/store.js','src/contact/adapters.js','src/contact-preferences.js'];
 for(const file of forbiddenFiles)if(fs.existsSync(path.join(src,file)))throw Error('Inactive/privileged module packaged: '+file);
 const isolatedRules=path.join(root,'firebase/account-database-staging.review.rules.json'),candidateRules=path.join(folder,'account-database-staging.review.rules.json');
 fs.copyFileSync(isolatedRules,candidateRules);
 const serialized=JSON.stringify({entry,accounts,freshReader,config:staticConfig,controls,rules:fs.readFileSync(candidateRules,'utf8')});
 if(/emulator-policy-fixture|local-emulator-only|demo-road-trip-arcade|status==='test-fixture'|serviceAccount\.json|BEGIN (?:RSA|EC|OPENSSH) PRIVATE KEY/.test(serialized))throw Error('Fixture permission or credential pattern leaked');
 const manifest={status:'LOCAL REVIEW ONLY — INACTIVE; DO NOT DEPLOY WITHOUT APPROVAL',baseCommit:'7ab6d4b138b36df9c3377223edeeefeab33283e0',functionExports:['lovelysirenAccounts014Api'],requiredGoogleRoutes:required,included:['email/password invitation registration','explicit UID-bound existing-Google enrollment','verification/recovery/profile/account-policy routes','Realtime Database Admin SDK downscoped to a separate account-only database'],excluded:['identity resolver','contact delivery','marketing preference APIs/sending','deletion coordinator/worker','scheduled maintenance','purchase/entitlement services','emulator fixtures and emulator permission','all Hosting/deployment of public pages'],activation:{apiEnv:'ACCOUNT_TEST_API_ENABLED is unset/false',databaseEnv:'ACCOUNT_DATABASE_URL must name the approved isolated account database, never the shared default RTA database',databaseRules:'account-database-staging.review.rules.json; root access only for databaseAuthVariableOverride uid lovelysiren-account-service',controls:'staging/account-014-controls.review.json; every control false',client:'account/config.js; disabled, endpoint null, policy unapproved'},runtimeServiceAccount:'lovelysiren-accounts-staging@road-trip-arcade.iam.gserviceaccount.com (proposed name; not provisioned or granted)',databaseAuthVariableOverride:{uid:'lovelysiren-account-service'},firebaseConfig:'firebase.account-014.json; Functions only; no Hosting or Database target',files:{}};
 const collect=(dir,prefix='')=>{for(const name of fs.readdirSync(dir)){const full=path.join(dir,name),rel=path.join(prefix,name).replaceAll('\\','/');if(fs.statSync(full).isDirectory())collect(full,rel);else{const bytes=fs.readFileSync(full);manifest.files[rel]={bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}}};
 collect(path.join(folder,'functions-account'));for(const file of ['firebase.account-014.json','account-database-staging.review.rules.json']){const full=path.join(folder,file),bytes=fs.readFileSync(full);manifest.files[file]={bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
 fs.writeFileSync(path.join(folder,'registration-candidate-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 const baseManifestPath=path.join(folder,'manifest.json'),baseManifest=JSON.parse(fs.readFileSync(baseManifestPath,'utf8'));
 Object.assign(baseManifest,{status:manifest.status,backendExports:manifest.functionExports,identityExportAbsent:true,identityResolverExcluded:true,contactDeliveryExcluded:true,marketingPreferencesExcluded:true,deletionExcluded:true,maintenanceExcluded:true,registrationControlsAllOff:true,hostingTargetAbsent:true,isolatedAccountDatabaseRequired:true,databaseAuthVariableOverride:manifest.databaseAuthVariableOverride,candidateManifest:'registration-candidate-manifest.json'});
 fs.writeFileSync(baseManifestPath,JSON.stringify(baseManifest,null,2)+'\n');
 console.log(JSON.stringify({artifact:folder,functionExports:manifest.functionExports,requiredGoogleRoutes:required,activation:'off',hosting:false}));return folder;
}
module.exports={build};if(require.main===module)build();
