import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';
import {initializeApp as initClient,deleteApp} from 'firebase/app';import {getAuth as clientAuth,connectAuthEmulator,signInWithEmailAndPassword,sendEmailVerification,applyActionCode,reload,sendPasswordResetEmail,confirmPasswordReset,signOut,GoogleAuthProvider,linkWithCredential,signInWithCredential} from 'firebase/auth';
import {pruneExpiredCapabilities} from '../functions/src/maintenance.js';
import {hash,NAMESPACE,createAccountBackend} from '../functions/src/accounts.js';
if(process.env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:19099'||process.env.FIREBASE_DATABASE_EMULATOR_HOST!=='127.0.0.1:19000')throw Error('Refusing tests without both loopback emulator hosts');
const require=createRequire(new URL('../functions/package.json',import.meta.url));const {initializeApp}=require('firebase-admin/app');const {getAuth}=require('firebase-admin/auth');const {getDatabase}=require('firebase-admin/database');
const adminApp=initializeApp({projectId:'demo-road-trip-arcade',databaseURL:'https://demo-road-trip-arcade-default-rtdb.firebaseio.com'},'account-e2e');const adminAuth=getAuth(adminApp);const db=getDatabase(adminApp);const base='http://127.0.0.1:19501/demo-road-trip-arcade/us-central1/lovelysirenAccountsApi/';const origin='http://127.0.0.1:18766';const invitation='emulator-only-invitation-code-256-bit-fixture';const password='Emulator only passphrase 987!';
const config={serviceEnabled:true,mode:'controlled-test',registrationEnabled:true,googleLinkingEnabled:true,allowedOrigins:[origin],policy:{approved:true,minimumAge:18,termsVersion:'emulator-terms-v1',privacyVersion:'emulator-privacy-v1',documents:{terms:{kind:'website-terms',status:'test-fixture',version:'emulator-terms-v1',effectiveDate:'2026-01-01',sha256:'a'.repeat(64),url:'http://127.0.0.1:18766/drafts/emulator-policy-fixture.html'},privacy:{kind:'website-privacy',status:'test-fixture',version:'emulator-privacy-v1',effectiveDate:'2026-01-01',sha256:'b'.repeat(64),url:'http://127.0.0.1:18766/drafts/emulator-policy-fixture.html'}}}};
const body=(email,overrides={})=>({method:'password',invitationCode:invitation,displayName:'Captain Test',birthDate:'1990-01-01',email,accepted:true,termsVersion:config.policy.termsVersion,privacyVersion:config.policy.privacyVersion,...overrides});
async function invite(email,extra={}){await db.ref(`${NAMESPACE}/testInvitations/${hash(email.toLowerCase())}`).set({enabled:true,codeHash:hash(invitation),expiresAt:Date.now()+3600000,...extra});}
async function api(path,data={},token){const res=await fetch(base+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data)});return{status:res.status,body:await res.json()};}
function client(name){const app=initClient({apiKey:'emulator-test-key',appId:'emulator-test-app',projectId:'demo-road-trip-arcade'},name);const auth=clientAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:19099',{disableWarnings:true});return{app,auth};}
async function action(email,type){const res=await fetch('http://127.0.0.1:19099/emulator/v1/projects/demo-road-trip-arcade/oobCodes');const codes=(await res.json()).oobCodes;return codes.filter(c=>c.email===email&&c.requestType===type).at(-1);}
await test('real Firebase emulators: controlled registration, ownership, verification, recovery and RTA compatibility',async t=>{
 await fetch('http://127.0.0.1:19099/emulator/v1/projects/demo-road-trip-arcade/accounts',{method:'DELETE'});
 await db.ref(NAMESPACE).remove();await db.ref(NAMESPACE+'/controls/config').set(config);
 const sentinel={displayName:'Existing RTA Player',playerId:'Otter0042',createdAt:123};await db.ref('users/existing_rta_test_uid').set(sentinel);await db.ref('playerIds/otter0042').set('existing_rta_test_uid');await db.ref('playerIdClaims/existing_rta_test_uid').set('Otter0042');
 await adminAuth.createUser({uid:'existing_rta_test_uid',email:'rta-existing@example.test',password,emailVerified:true,displayName:'Existing RTA Player'}).catch(e=>{if(e.code!=='auth/uid-already-exists')throw e;});
 const a=client('emulator-a-'+Date.now());let grant,token,uid,id;
 await t.test('unauthorized, bad invitation, underage and stale policy requests create no ownership',async()=>{
  assert.equal((await api('registration/prepare',body('unauthorized@example.test'))).status,403);
  await invite('blocked@example.test');for(const overrides of [{invitationCode:'wrong-invitation-code-1234567890'},{birthDate:'2015-01-01'},{termsVersion:'unapproved'},{accepted:false}])assert.equal((await api('registration/prepare',body('blocked@example.test',overrides))).status,403);
  assert.equal((await db.ref(NAMESPACE+'/identityByUid').get()).exists(),false);
 });
 await t.test('allowed invitation provisions a real emulator Auth user, without storing DOB or password',async()=>{
  await invite('captain-a@example.test');const prepared=await api('registration/prepare',body('captain-a@example.test'));assert.equal(prepared.status,200);grant=prepared.body.registrationGrant;assert.equal(prepared.body.flow,'controlled-provisioning');
  const provision=await api('registration/provision',{registrationGrant:grant,password});assert.equal(provision.status,200);
  const login=await signInWithEmailAndPassword(a.auth,'captain-a@example.test',password);uid=login.user.uid;token=await login.user.getIdToken();
  const grants=JSON.stringify((await db.ref(NAMESPACE+'/registrationGrants').get()).val());assert.equal(grants.includes(password),false);assert.equal(grants.includes('1990-01-01'),false);
 });
 await t.test('simultaneous completion and retries allocate one immutable company ID',async()=>{
  const results=await Promise.all(Array.from({length:6},()=>api('registration/complete',{registrationGrant:grant},token)));assert.ok(results.every(r=>r.status===200),JSON.stringify(results));
  const identity=(await db.ref(NAMESPACE+'/identityByUid/'+uid).get()).val();id=identity.lovelySirenId;assert.match(id,/^lsid_[0-9a-f-]{36}$/);assert.equal((await db.ref(NAMESPACE+'/uidByIdentity/'+id).get()).val(),uid);
  assert.equal((await api('registration/complete',{registrationGrant:grant},token)).status,200);assert.equal((await db.ref(NAMESPACE+'/identityByUid/'+uid).get()).val().lovelySirenId,id);
 });
 await t.test('unverified account denied; real Auth emulator verification action enables access',async()=>{
  assert.equal((await api('profile/read',{},token)).status,403);assert.equal((await api('verification/authorize',{},token)).status,200);assert.equal((await api('verification/authorize',{},token)).status,429);
  await sendEmailVerification(a.auth.currentUser,{url:origin+'/account/verify-email.html'});const code=await action('captain-a@example.test','VERIFY_EMAIL');assert.ok(code?.oobCode);await applyActionCode(a.auth,code.oobCode);await reload(a.auth.currentUser);token=await a.auth.currentUser.getIdToken(true);assert.equal(a.auth.currentUser.emailVerified,true);
  const profile=await api('profile/read',{},token);assert.equal(profile.status,200);assert.equal(profile.body.profile.lovelySirenId,id);
 });
 await t.test('own-profile editing works, but supplied identity fields cannot change ownership',async()=>{
  assert.equal((await api('profile/update',{displayName:'New Captain',phone:'+12125550123'},token)).status,200);
  assert.equal((await api('profile/update',{displayName:'Other',phone:null,firebaseUid:'victim'},token)).status,400);
  const profile=await api('profile/read',{},token);assert.equal(profile.body.profile.displayName,'New Captain');assert.equal(profile.body.profile.phone,'+12125550123');assert.equal(profile.body.profile.lovelySirenId,id);
 });
 await t.test('duplicate registration cannot replace a password or allocate a second identity',async()=>{assert.equal((await api('registration/prepare',body('captain-a@example.test'))).status,403);assert.equal((await db.ref(NAMESPACE+'/identityByUid/'+uid).get()).val().lovelySirenId,id);});
 await t.test('wrong password, reset action, sign-out and signing in again use the real Auth emulator',async()=>{
  await signOut(a.auth);await assert.rejects(signInWithEmailAndPassword(a.auth,'captain-a@example.test','incorrect password'),e=>['auth/wrong-password','auth/invalid-credential'].includes(e.code));
  await sendPasswordResetEmail(a.auth,'captain-a@example.test');const code=await action('captain-a@example.test','PASSWORD_RESET');assert.ok(code?.oobCode);const updated='A new emulator passphrase 456!';await confirmPasswordReset(a.auth,code.oobCode,updated);await signInWithEmailAndPassword(a.auth,'captain-a@example.test',updated);token=await a.auth.currentUser.getIdToken(true);assert.equal((await api('profile/read',{},token)).body.profile.lovelySirenId,id);
 });
 await t.test('cross-account access and direct client writes are denied by backend and actual RTDB rules',async()=>{
  await adminAuth.createUser({uid:'unapproved_test_uid',email:'unapproved@example.test',password,emailVerified:true});const b=client('emulator-b-'+Date.now());await signInWithEmailAndPassword(b.auth,'unapproved@example.test',password);const bt=await b.auth.currentUser.getIdToken();assert.equal((await api('profile/read',{},bt)).status,403);assert.equal((await api('registration/complete',{registrationGrant:grant},bt)).status,403);assert.equal((await api('profile/read',{uid},token)).status,400);
  for(const method of ['GET','PUT']){const res=await fetch(`http://127.0.0.1:19000/${NAMESPACE}/identityByUid/${uid}.json?ns=demo-road-trip-arcade-default-rtdb&auth=${bt}`,{method,...(method==='PUT'?{body:JSON.stringify({lovelySirenId:'stolen'})}:{})});assert.equal(res.status,401);}
  await deleteApp(b.app);
 });
 await t.test('disabled provider linking fails closed; RTA existing records stay byte-for-byte intact',async()=>{
  await db.ref(NAMESPACE+'/controls/config/googleLinkingEnabled').set(false);assert.equal((await api('providers/google/prepare',{},token)).status,403);await db.ref(NAMESPACE+'/controls/config/googleLinkingEnabled').set(true);
  assert.deepEqual((await db.ref('users/existing_rta_test_uid').get()).val(),sentinel);assert.equal((await db.ref('playerIds/otter0042').get()).val(),'existing_rta_test_uid');assert.equal((await db.ref('playerIdClaims/existing_rta_test_uid').get()).val(),'Otter0042');
 });
 await t.test('identity collision and interrupted reservation recover without a second ID',async()=>{
  const backend=createAccountBackend({db,auth:adminAuth});await db.ref(NAMESPACE+'/identityClaims/recover_test_uid').set({lovelySirenId:'lsid_recovered',createdAt:123});await db.ref(NAMESPACE+'/uidByIdentity/lsid_recovered').set('recover_test_uid');
  await invite('recover@example.test',{existingUid:'recover_test_uid'});await adminAuth.createUser({uid:'recover_test_uid',email:'recover@example.test',password,emailVerified:true});const c=client('recover-'+Date.now());await signInWithEmailAndPassword(c.auth,'recover@example.test',password);const ct=await c.auth.currentUser.getIdToken();const g=await api('registration/prepare',body('recover@example.test'));assert.equal(g.status,200);assert.equal((await api('registration/complete',{registrationGrant:g.body.registrationGrant},ct)).status,200);assert.equal((await db.ref(NAMESPACE+'/identityByUid/recover_test_uid').get()).val().lovelySirenId,'lsid_recovered');await deleteApp(c.app);
 });
 await t.test('real Auth emulator Google linking preserves UID; duplicate provider is rejected',async()=>{
  const linkGrant=await api('providers/google/prepare',{},token);assert.equal(linkGrant.status,200);
  const credential=GoogleAuthProvider.credential(JSON.stringify({sub:'emulator-google-owner-a',email:'google-a@example.test',email_verified:true}));
  await linkWithCredential(a.auth.currentUser,credential);token=await a.auth.currentUser.getIdToken(true);assert.equal((await api('providers/google/complete',{linkGrant:linkGrant.body.linkGrant},token)).status,200);assert.equal((await api('profile/read',{},token)).body.profile.lovelySirenId,id);
  await invite('unapproved@example.test',{existingUid:'unapproved_test_uid'});const b=client('link-conflict-'+Date.now());await signInWithEmailAndPassword(b.auth,'unapproved@example.test',password);let bt=await b.auth.currentUser.getIdToken();const setup=await api('registration/prepare',body('unapproved@example.test'));assert.equal((await api('registration/complete',{registrationGrant:setup.body.registrationGrant},bt)).status,200);const bId=(await api('profile/read',{},bt)).body.profile.lovelySirenId;
  const bg=await api('providers/google/prepare',{},bt);assert.equal(bg.status,200);await assert.rejects(linkWithCredential(b.auth.currentUser,credential),e=>e.code==='auth/credential-already-in-use');bt=await b.auth.currentUser.getIdToken(true);assert.equal((await api('providers/google/complete',{linkGrant:bg.body.linkGrant},bt)).status,403);assert.equal((await api('profile/read',{},bt)).body.profile.lovelySirenId,bId);assert.notEqual(bId,id);await deleteApp(b.app);
 });
 await t.test('forced ID collision retries without taking ownership of another UID',async()=>{
  await adminAuth.createUser({uid:'collision_test_uid',email:'collision@example.test',password,emailVerified:true});await invite('collision@example.test',{existingUid:'collision_test_uid'});const c=client('collision-'+Date.now());await signInWithEmailAndPassword(c.auth,'collision@example.test',password);const ct=await c.auth.currentUser.getIdToken();const decoded=await adminAuth.verifyIdToken(ct,true);const g=await api('registration/prepare',body('collision@example.test'));
  await db.ref(NAMESPACE+'/uidByIdentity/lsid_collision_fixed').set('different_uid');let first=true;const backend=createAccountBackend({db,auth:adminAuth,uuid:()=>{if(first){first=false;return 'collision_fixed';}return 'recovered_'+Date.now();}});await backend.complete({registrationGrant:g.body.registrationGrant},decoded);
  assert.equal((await db.ref(NAMESPACE+'/uidByIdentity/lsid_collision_fixed').get()).val(),'different_uid');assert.notEqual((await db.ref(NAMESPACE+'/identityByUid/collision_test_uid').get()).val().lovelySirenId,'lsid_collision_fixed');await deleteApp(c.app);
 });
 await t.test('credential-create response failure recovers the same UID without resetting its password',async()=>{
  await invite('retry@example.test');const g=await api('registration/prepare',body('retry@example.test'));const flakyAuth={createUser:async options=>{await adminAuth.createUser(options);throw Object.assign(new Error('Emulator injected transport failure'),{code:'test/transport-failure'});},getUser:uid=>adminAuth.getUser(uid)};
  const backend=createAccountBackend({db,auth:flakyAuth});await assert.rejects(backend.provision({registrationGrant:g.body.registrationGrant,password},{ip:'retry-case'}));assert.equal((await api('registration/provision',{registrationGrant:g.body.registrationGrant,password})).status,200);const c=client('retry-'+Date.now());await signInWithEmailAndPassword(c.auth,'retry@example.test',password);const ct=await c.auth.currentUser.getIdToken();assert.equal((await api('registration/complete',{registrationGrant:g.body.registrationGrant},ct)).status,200);await deleteApp(c.app);
 });
 await t.test('expired capabilities are pruned without deleting profiles, identities or existing RTA data',async()=>{
  await db.ref(NAMESPACE+'/registrationGrants/expired_test').set({expiresAt:Date.now()-1000,state:'prepared'});await db.ref(NAMESPACE+'/throttles/expired_test').set({expiresAt:Date.now()-1000,count:1});
  const dry=await pruneExpiredCapabilities(db);assert.ok(dry.counts.registrationGrants>=1);assert.ok((await db.ref(NAMESPACE+'/registrationGrants/expired_test').get()).exists());await pruneExpiredCapabilities(db,{dryRun:false});assert.equal((await db.ref(NAMESPACE+'/registrationGrants/expired_test').get()).exists(),false);assert.equal((await db.ref(NAMESPACE+'/identityByUid/'+uid).get()).val().lovelySirenId,id);assert.deepEqual((await db.ref('users/existing_rta_test_uid').get()).val(),sentinel);
 });
 await t.test('backend kill switch and disallowed origins fail closed',async()=>{
  const denied=await fetch(base+'profile/read',{method:'POST',headers:{Origin:'https://unapproved.invalid','Content-Type':'application/json',Authorization:'Bearer '+token},body:'{}'});assert.equal(denied.status,403);
  await db.ref(NAMESPACE+'/controls/config/serviceEnabled').set(false);assert.equal((await api('profile/read',{},token)).status,503);await db.ref(NAMESPACE+'/controls/config/serviceEnabled').set(true);
 });
 await t.test('explicitly invited existing RTA user reconciles without changing the friendly Player ID or profile',async()=>{
  await invite('rta-existing@example.test',{existingUid:'existing_rta_test_uid'});const g=await api('registration/prepare',body('rta-existing@example.test'));assert.equal(g.status,200);assert.equal(g.body.flow,'sign-in-existing');assert.equal((await api('registration/provision',{registrationGrant:g.body.registrationGrant,password})).status,403);
  const c=client('existing-rta-'+Date.now());await signInWithEmailAndPassword(c.auth,'rta-existing@example.test',password);const ct=await c.auth.currentUser.getIdToken();assert.equal((await api('registration/complete',{registrationGrant:g.body.registrationGrant},ct)).status,200);const profile=await api('profile/read',{},ct);assert.equal(profile.status,200);assert.match(profile.body.profile.lovelySirenId,/^lsid_/);assert.deepEqual((await db.ref('users/existing_rta_test_uid').get()).val(),sentinel);assert.equal((await db.ref('playerIds/otter0042').get()).val(),'existing_rta_test_uid');await deleteApp(c.app);
 });
 await t.test('failure after canonical allocation recovers without allocating a different ID',async()=>{
  await adminAuth.createUser({uid:'profile_retry_uid',email:'profile-retry@example.test',password,emailVerified:true});await invite('profile-retry@example.test',{existingUid:'profile_retry_uid'});const c=client('profile-retry-'+Date.now());await signInWithEmailAndPassword(c.auth,'profile-retry@example.test',password);const ct=await c.auth.currentUser.getIdToken();const decoded=await adminAuth.verifyIdToken(ct,true);const g=await api('registration/prepare',body('profile-retry@example.test'));
  let inject=true;const flakyDb={ref:path=>{const reference=db.ref(path);if(path===NAMESPACE+'/profiles/profile_retry_uid'&&inject){inject=false;return new Proxy(reference,{get(target,key){if(key==='transaction')return async()=>{throw Error('Injected profile transaction interruption')};const value=target[key];return typeof value==='function'?value.bind(target):value;}});}return reference;}};
  const backend=createAccountBackend({db:flakyDb,auth:adminAuth});await assert.rejects(backend.complete({registrationGrant:g.body.registrationGrant},decoded));const firstId=(await db.ref(NAMESPACE+'/identityByUid/profile_retry_uid').get()).val().lovelySirenId;assert.equal((await api('registration/complete',{registrationGrant:g.body.registrationGrant},ct)).status,200);assert.equal((await db.ref(NAMESPACE+'/profiles/profile_retry_uid').get()).val().lovelySirenId,firstId);await deleteApp(c.app);
 });
 await t.test('age-only eligibility rejects unrelated fields and creates no permanent identity',async()=>{
  const before=(await db.ref(NAMESPACE+'/identityByUid').get()).val();
  assert.deepEqual((await api('registration/eligibility',{birthDate:'2020-01-01'})).body,{eligible:false});
  assert.deepEqual((await api('registration/eligibility',{birthDate:'1990-01-01'})).body,{eligible:true});
  assert.equal((await api('registration/eligibility',{birthDate:'1990-01-01',email:'not-collected@example.test'})).status,400);
  assert.deepEqual((await db.ref(NAMESPACE+'/identityByUid').get()).val(),before);
 });
 await t.test('draft policies block preparation and provision; version-aware renewal keeps identity and history',async()=>{
  await invite('policy-gate@example.test');const prepared=await api('registration/prepare',body('policy-gate@example.test'));assert.equal(prepared.status,200);
  await db.ref(NAMESPACE+'/controls/config/policy/documents/terms/status').set('review');
  assert.equal((await api('registration/prepare',body('policy-gate@example.test'))).status,503);
  assert.equal((await api('registration/provision',{registrationGrant:prepared.body.registrationGrant,password})).status,503);
  await db.ref(NAMESPACE+'/controls/config/policy').set({...config.policy,requiresReacceptance:true,termsVersion:'emulator-terms-v2',documents:{...config.policy.documents,terms:{...config.policy.documents.terms,version:'emulator-terms-v2'}}});
  assert.equal((await api('profile/read',{},token)).status,428);
  assert.equal((await api('profile/update',{displayName:'No change',phone:null},token)).status,428);
  const current=await api('policies/status',{},token);assert.equal(current.status,200);assert.equal(current.body.terms.version,'emulator-terms-v2');
  assert.equal((await api('policies/accept',{accepted:true,termsVersion:config.policy.termsVersion,privacyVersion:config.policy.privacyVersion},token)).status,403);
  assert.equal((await api('policies/accept',{accepted:false,termsVersion:'emulator-terms-v2',privacyVersion:config.policy.privacyVersion},token)).status,403);
  assert.equal((await api('policies/accept',{accepted:true,termsVersion:'emulator-terms-v2',privacyVersion:config.policy.privacyVersion},token)).status,200);
  assert.equal((await api('profile/read',{},token)).body.profile.lovelySirenId,id);
  const history=(await db.ref(NAMESPACE+'/policyHistory/'+uid).get()).val();assert.equal(Object.keys(history).length,2);assert.ok(Object.values(history).every(a=>typeof a.acceptedAt==='number'&&!a.rtaTermsVersion));
  await db.ref(NAMESPACE+'/controls/config/policy').set(config.policy);
 });
 await signOut(a.auth);await deleteApp(a.app);
});
await db.goOffline();
