import { accountConfig } from './config.js';
import { registrationErrors, normalizeEmail, normalizePhone } from './validation.js';
const problem = code => Object.assign(new Error(code), { code });
export function createAccountService(config, dependencies = {}) {
  const loadSdk = dependencies.loadSdk || (() => import('./vendor/firebase-auth.js'));
  const request = dependencies.fetch || globalThis.fetch.bind(globalThis);
  const origin = dependencies.origin || globalThis.location?.origin;
  const now = dependencies.now || Date.now;
  let sdk, auth, initialization, revision = 0, lastSend = 0;
  let state = { status: 'unavailable', user: null, profile: null };
  const listeners = new Set();
  function emit(next) { state = next; listeners.forEach(listener => listener(state)); }
  function configured() {
    return config.enabled && config.firebase?.projectId === 'road-trip-arcade' && config.firebase.apiKey && config.firebase.appId &&
      config.allowedOrigins.includes(origin) && /^https:\/\//.test(config.backendBaseUrl || '');
  }
  function registrationReady() {
    return configured() && config.registrationEnabled && config.eligibilityApproved && config.policies.approved &&
      config.policies.termsUrl && config.policies.termsVersion && config.policies.privacyVersion;
  }
  async function backend(path, body = {}, authenticated = true) {
    if (!configured()) throw problem('service/not-ready');
    const headers = { 'Content-Type': 'application/json' };
    if (authenticated) {
      if (!auth.currentUser) throw problem('auth/requires-recent-login');
      headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
    }
    const response = await request(new URL(path, config.backendBaseUrl.endsWith('/') ? config.backendBaseUrl : config.backendBaseUrl+'/'), {
      method: 'POST', headers, body: JSON.stringify(body), credentials: 'omit', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) {
      if (response.status === 401) { await sdk.signOut(auth); throw problem('auth/requires-recent-login'); }
      if (response.status === 403) throw problem('service/setup-required');
      if (response.status === 429) throw problem('auth/too-many-requests');
      throw problem('service/not-ready');
    }
    return response.json();
  }
  function publicUser(user) {
    // No tokens, DOB, passwords or arbitrary photo URLs are exposed in app state.
    return { uid: user.uid, displayName: user.displayName || '', email: user.email || '', emailVerified: user.emailVerified,
      providers: user.providerData.map(provider => provider.providerId) };
  }
  async function reconcile(user) {
    const currentRevision = ++revision;
    if (!user) { emit({status:'signed-out',user:null,profile:null}); return; }
    emit({status:'checking',user:publicUser(user),profile:null});
    try {
      const token = await sdk.getIdTokenResult(user);
      if (!user.emailVerified || token.claims.email_verified !== true) {
        if (currentRevision === revision) emit({status:'verification-pending',user:publicUser(user),profile:null});
        return;
      }
      const result = await backend('profile/read');
      if (currentRevision !== revision || auth.currentUser?.uid !== user.uid) return;
      const record = result.profile;
      if (record?.firebaseUid !== user.uid || typeof record.lovelySirenId !== 'string' || !record.lovelySirenId ||
          typeof record.displayName !== 'string' || record.accountStatus !== 'active' ||
          (record.phone != null && typeof record.phone !== 'string')) throw problem('service/setup-required');
      const profile = { firebaseUid: record.firebaseUid, lovelySirenId: record.lovelySirenId,
        displayName: record.displayName, phone: record.phone || null, accountStatus: record.accountStatus };
      emit({status:'authenticated',user:publicUser(user),profile});
    } catch (error) {
      if (currentRevision === revision) emit({status:auth.currentUser?'setup-required':'signed-out',user:auth.currentUser?publicUser(auth.currentUser):null,profile:null,error});
    }
  }
  async function init() {
    if (!configured()) return state;
    if (!initialization) initialization = (async () => {
      sdk = await loadSdk();
      const app = sdk.getApps().find(app=>app.name==='lovelysiren-website') || sdk.initializeApp(config.firebase,'lovelysiren-website');
      auth = sdk.getAuth(app);
      await sdk.setPersistence(auth,sdk.browserLocalPersistence);
      await new Promise((resolve,reject)=>{
        let first=true;
        sdk.onIdTokenChanged(auth,user=>{
          void reconcile(user).then(()=>{ if(first){first=false;resolve();} });
        },error=>{emit({status:'unavailable',user:null,profile:null,error});if(first){first=false;reject(error);}});
      });
      return state;
    })().catch(error=>{initialization=null;emit({status:'unavailable',user:null,profile:null,error});throw error;});
    return initialization;
  }
  async function requireAuth() { await init(); if(!auth)throw problem('service/not-ready'); }
  function actionSettings() {
    const url = new URL(config.emailContinueUrl);
    if (url.origin !== 'https://lovelysirendigital.com') throw problem('service/not-ready');
    return {url:url.href,handleCodeInApp:false};
  }
  async function verifyAllowed() {
    await requireAuth();
    if (!auth.currentUser) throw problem('auth/requires-recent-login');
    await sdk.reload(auth.currentUser);
    const token=await sdk.getIdTokenResult(auth.currentUser,true);
    if (!auth.currentUser.emailVerified || token.claims.email_verified!==true) throw problem('service/verify-required');
  }
  async function prepareRegistration(values, method) {
    if(!registrationReady())throw problem('service/policy-pending');
    const errors=registrationErrors(values);
    if(method==='google'){delete errors.password;delete errors.confirmPassword;}
    if(Object.keys(errors).length)throw problem('service/invalid-input');
    // The backend must revalidate birth date/eligibility and policy versions. No client age category is trusted.
    return backend('registration/prepare',{
      method,displayName:values.displayName.trim(),birthDate:values.birthDate,email:normalizeEmail(values.email),
      ...(values.phone.trim()?{phone:normalizePhone(values.phone)}:{}),
      accepted:true,termsVersion:config.policies.termsVersion,privacyVersion:config.policies.privacyVersion
    },false);
  }
  const service = {
    init, getState:()=>state, available:()=>Boolean(configured()), registrationAvailable:()=>Boolean(registrationReady()),
    subscribe(listener){listeners.add(listener);listener(state);return()=>listeners.delete(listener);},
    async signIn(email,password){await requireAuth();await sdk.signInWithEmailAndPassword(auth,normalizeEmail(email),password);await reconcile(auth.currentUser);return state;},
    async googleSignIn(){
      await requireAuth();
      // A first Google sign-in creates a Firebase credential record. Keep this off until onboarding is approved.
      if(!registrationReady())throw problem('service/policy-pending');
      const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
      await sdk.signInWithPopup(auth,provider);await reconcile(auth.currentUser);return state;
    },
    async register(values,method='password'){
      await requireAuth();
      const grant=await prepareRegistration(values,method);
      if(typeof grant.registrationGrant!=='string'||!grant.registrationGrant)throw problem('service/not-ready');
      let result;
      if(method==='google'){
        const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
        result=await sdk.signInWithPopup(auth,provider);
      } else {
        const policy=await sdk.validatePassword(auth,values.password);
        if(!policy.isValid)throw problem('auth/password-does-not-meet-requirements');
        result=await sdk.createUserWithEmailAndPassword(auth,normalizeEmail(values.email),values.password);
      }
      // No browser-created IDs or profile writes. Server binds grant to the verified Firebase token identity.
      await backend('registration/complete',{registrationGrant:grant.registrationGrant});
      let verificationSent=false;
      if(!result.user.emailVerified){await service.resendVerification();verificationSent=true;}
      await reconcile(auth.currentUser);return {state,verificationSent};
    },
    async resetPassword(email){
      await requireAuth();
      try{await sdk.sendPasswordResetEmail(auth,normalizeEmail(email),actionSettings());}
      catch(error){if(error.code!=='auth/user-not-found')throw error;}
    },
    async resendVerification(){
      await requireAuth();if(!auth.currentUser)throw problem('auth/requires-recent-login');
      await sdk.reload(auth.currentUser);
      if(auth.currentUser.emailVerified){await reconcile(auth.currentUser);return false;}
      const cooldown=Math.max(60,config.resendCooldownSeconds || 60)*1000;
      if(now()-lastSend<cooldown)throw problem('service/resend-limited');
      // Server throttling is mandatory as well as this local cooldown; Firebase enforces its own quotas.
      await backend('verification/authorize');
      await sdk.sendEmailVerification(auth.currentUser,actionSettings());lastSend=now();return true;
    },
    resendSecondsRemaining(){return Math.max(0,Math.ceil((lastSend+Math.max(60,config.resendCooldownSeconds||60)*1000-now())/1000));},
    async refresh(){await requireAuth();if(auth.currentUser){await sdk.reload(auth.currentUser);await sdk.getIdTokenResult(auth.currentUser,true);}await reconcile(auth.currentUser);return state;},
    async signOut(){await requireAuth();revision++;await sdk.signOut(auth);emit({status:'signed-out',user:null,profile:null});},
    async updateProfile(values){
      await verifyAllowed();
      if(state.status!=='authenticated')throw problem('service/setup-required');
      const errors=registrationErrors({...values,birthDate:'2000-01-01',email:'validation@example.com',password:'validation only',confirmPassword:'validation only',accepted:true});
      if(errors.displayName||errors.phone)throw problem('service/invalid-input');
      await backend('profile/update',{displayName:values.displayName.trim(),phone:normalizePhone(values.phone || '')||null});
      await reconcile(auth.currentUser);return state;
    },
    async connectGoogle(password){
      await verifyAllowed();if(state.status!=='authenticated')throw problem('service/setup-required');
      const user=auth.currentUser;const uid=user.uid;
      if(user.providerData.some(p=>p.providerId==='google.com'))return state;
      if(!user.providerData.some(p=>p.providerId==='password')||!password)throw problem('auth/requires-recent-login');
      await sdk.reauthenticateWithCredential(user,sdk.EmailAuthProvider.credential(user.email,password));
      await sdk.getIdTokenResult(user,true);
      const grant=await backend('providers/google/prepare');
      if(!grant.linkGrant)throw problem('service/not-ready');
      const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
      await sdk.linkWithPopup(user,provider);
      if(auth.currentUser?.uid!==uid)throw problem('service/setup-required');
      await sdk.getIdTokenResult(auth.currentUser,true);
      await backend('providers/google/complete',{linkGrant:grant.linkGrant});await reconcile(auth.currentUser);return state;
    }
  };
  return service;
}
export const accountService = createAccountService(accountConfig);
