import { accountService as service } from './service.js';
import { accountConfig } from './config.js';
import { registrationErrors,validEmail,normalizeEmail,validPhone,displayNameError,friendlyError } from './validation.js';
const page=document.body.dataset.accountPage;
const message=document.getElementById('form-message');
let processing=false;
function announce(text,success=false){message.textContent=text;message.classList.toggle('success',success);}
function clearErrors(){document.querySelectorAll('.field-error').forEach(e=>{e.hidden=true;e.textContent='';});document.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));announce('');}
function showErrors(errors){
 let first;
 for(const [name,text]of Object.entries(errors)){const input=document.getElementById(name);const error=document.getElementById(name+'-error');if(input){input.setAttribute('aria-invalid','true');first ||= input;}if(error){error.textContent=text;error.hidden=false;}}
 announce('Please check the highlighted fields.');first?.focus();
}
function values(form){return Object.fromEntries(new FormData(form));}
async function run(action,operation){
 if(processing)return;
 processing=true;announce('Working…');
 const controls=[...document.querySelectorAll('button')].map(control=>({control,disabled:control.disabled}));
 controls.forEach(({control})=>control.disabled=true);document.querySelector('.account-card').setAttribute('aria-busy','true');
 try{await operation();}catch(error){announce(friendlyError(error,action));}
 finally{
  processing=false;controls.forEach(({control,disabled})=>control.disabled=disabled);document.querySelector('.account-card').removeAttribute('aria-busy');
  document.querySelectorAll('input[type="password"]').forEach(input=>input.value='');
  updateResendButton();
 }
}
function routeAfterSignIn(state){
 if(state.status==='authenticated')location.assign('index.html');
 else if(state.status==='verification-pending')location.assign('verify-email.html');
 else{announce('Your sign-in is recognized, but account setup is not complete. Full account access is unavailable.');location.assign('index.html');}
}
const dateInput=document.getElementById('birthDate');
if(dateInput){const today=new Date();dateInput.max=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;}
const createForm=document.getElementById('create-form');
if(createForm){
 const ready=service.registrationAvailable();
 document.getElementById('accepted').disabled=!ready;createForm.querySelector('button[type="submit"]').disabled=!ready;
 if(ready){const label=document.getElementById('terms-label');const link=document.createElement('a');link.textContent='Terms of Service';link.href=accountConfig.policies.termsUrl;label.replaceWith(link);document.querySelector('.account-acceptance a[href="../privacy.html"]').href=accountConfig.policies.privacyUrl;document.getElementById('policy-status').textContent='Please read and accept both policies before creating an account.';}
 createForm.addEventListener('submit',event=>{event.preventDefault();clearErrors();const data=values(createForm);data.accepted=document.getElementById('accepted').checked;const errors=registrationErrors(data);if(!data.invitationCode||data.invitationCode.trim().length<20)errors.invitationCode='Enter your authorized test invitation code.';if(Object.keys(errors).length){showErrors(errors);return;}void run('register',async()=>{const result=await service.register(data);createForm.reset();if(result.verificationSent)sessionStorage.setItem('lovelysiren-verification-sent','1');routeAfterSignIn(result.state);});});
}
const signinForm=document.getElementById('signin-form');
signinForm?.addEventListener('submit',event=>{event.preventDefault();clearErrors();const data=values(signinForm);const errors={};if(!validEmail(normalizeEmail(data.email)))errors.email='Enter a valid email address.';if(!data.password)errors.password='Enter your password.';if(Object.keys(errors).length){showErrors(errors);return;}void run('signin',async()=>routeAfterSignIn(await service.signIn(data.email,data.password)));});
document.getElementById('forgot-form')?.addEventListener('submit',event=>{event.preventDefault();clearErrors();const data=values(event.currentTarget);if(!validEmail(normalizeEmail(data.email))){showErrors({email:'Enter a valid email address.'});return;}void run('reset',async()=>{await service.resetPassword(data.email);announce("If an account is associated with that email address, you'll receive password-reset instructions.",true);});});
document.querySelectorAll('[data-google]').forEach(button=>{
 button.disabled=!(service.googleAvailable?.() ?? false);
 button.addEventListener('click',()=>{
  clearErrors();
  if(page==='create'){
   const data=values(createForm);data.accepted=document.getElementById('accepted').checked;const errors=registrationErrors(data);delete errors.password;delete errors.confirmPassword;
   if(Object.keys(errors).length){showErrors(errors);return;}
   void run('register',async()=>{const result=await service.register(data,'google');createForm.reset();routeAfterSignIn(result.state);});
  } else void run('signin',async()=>routeAfterSignIn(await service.googleSignIn()));
 });
});
function updateResendButton(){
 const button=document.getElementById('resend-verification');if(!button)return;
 const state=service.getState();const seconds=service.resendSecondsRemaining();
 button.disabled=processing||state.status!=='verification-pending'||seconds>0;
 document.getElementById('verification-cooldown').textContent=seconds>0?`You can request another email in ${seconds} seconds.`:'';
}
if(page==='verify'){
 if(sessionStorage.getItem('lovelysiren-verification-sent')==='1'){
  // Presentation only; never used as proof of email verification or authorization.
  document.getElementById('verification-description').textContent="We've sent a verification link to your email address. Open it to verify your LovelySiren Account.";
  sessionStorage.removeItem('lovelysiren-verification-sent');
 }
 document.getElementById('resend-verification').addEventListener('click',()=>void run('verify',async()=>{const sent=await service.resendVerification();announce(sent?'Verification email sent. Check your inbox.':'Your email is verified.',true);}));
 document.getElementById('recheck-verification').addEventListener('click',()=>void run('verify',async()=>{const state=await service.refresh();if(state.status==='authenticated')location.assign('index.html');else if(state.status==='verification-pending')announce('Your email is not verified yet. Open the link in your email, then try again.');else announce('Sign in first, or complete account setup before continuing.');}));
 setInterval(updateResendButton,1000);
}
document.querySelectorAll('[data-signout]').forEach(button=>button.addEventListener('click',()=>void run('signout',async()=>{await service.signOut();location.assign('sign-in.html');})));
document.getElementById('profile-form')?.addEventListener('submit',event=>{event.preventDefault();clearErrors();const data=values(event.currentTarget);const errors={};const nameError=displayNameError(data.displayName);if(nameError)errors.displayName=nameError;if(!validPhone(data.phone))errors.phone='Use international format with + and country code, or leave it blank.';if(Object.keys(errors).length){showErrors(errors);return;}void run('profile',async()=>{await service.updateProfile(data);announce('Profile updated.',true);});});
document.getElementById('connect-google-form')?.addEventListener('submit',event=>{event.preventDefault();clearErrors();const password=values(event.currentTarget).reauthPassword;if(!password){showErrors({reauthPassword:'Enter your current password to confirm this change.'});return;}void run('link',async()=>{await service.connectGoogle(password);announce('Google is connected to your existing account.',true);});});
service.subscribe(state=>{
 document.querySelectorAll('.account-notice').forEach(notice=>{notice.hidden=service.available()&&!accountConfig.emulators?.enabled;if(accountConfig.emulators?.enabled)notice.textContent='Local Firebase emulator test only. No real customer accounts or verification emails are created. Draft policies here are not approved for production.';});
 const dashboard=state.status==='authenticated';
 if(page==='signin')document.getElementById('signin-pending').hidden=state.status!=='verification-pending';
 if(page==='dashboard'){
  document.getElementById('signed-out-account').hidden=Boolean(state.user);document.getElementById('account-pending').hidden=!state.user||dashboard;
  document.getElementById('profile-view').hidden=!dashboard;
  if(state.user&&!dashboard){document.getElementById('pending-copy').textContent=state.status==='checking'?'Checking your account…':state.status==='verification-pending'?'Verify your email to continue.':'Your sign-in is recognized, but full account setup is not available yet.';document.getElementById('pending-verify').hidden=state.status!=='verification-pending';}
  if(dashboard){const fields={displayName:state.profile.displayName,email:state.user.email,verification:'Verified',lovelySirenId:state.profile.lovelySirenId,phone:state.profile.phone||'Not provided',providers:state.user.providers.map(p=>p==='password'?'Email/password':p==='google.com'?'Google':p).join(', ')};document.querySelectorAll('[data-profile]').forEach(el=>el.textContent=String(fields[el.dataset.profile]||''));}
 }
 if(page==='settings'){
  document.getElementById('settings-gate').hidden=dashboard;document.getElementById('settings-content').hidden=!dashboard;
  if(dashboard){document.getElementById('displayName').value=state.profile.displayName||'';document.getElementById('phone').value=state.profile.phone||'';document.getElementById('password-provider').textContent=state.user.providers.includes('password')?'Connected':'Not connected';const google=state.user.providers.includes('google.com');document.getElementById('google-provider').textContent=google?'Connected':'Not connected';document.getElementById('connect-google-form').hidden=google;document.querySelector('#connect-google-form button').disabled=!(service.googleAvailable?.() ?? false);}
 }
 if(page==='verify'){updateResendButton();document.getElementById('recheck-verification').disabled=!service.available();}
});
service.init().catch(error=>announce(friendlyError(error)));
