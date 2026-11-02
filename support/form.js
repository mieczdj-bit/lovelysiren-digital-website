import {contactConfig as config} from './config.js';
const form=document.getElementById('contact-form'),status=document.getElementById('contact-status'),button=document.getElementById('contact-submit');
const product=document.getElementById('contact-product'),extra=document.getElementById('contact-subject'),group=document.getElementById('contact-subject-group');
let busy=false,attempt=null;
function announce(text,state=''){status.textContent=text;status.dataset.state=state;}
function conditional(){const required=['Other','Billing / Purchases'].includes(product.value);group.hidden=!required;extra.required=required;extra.disabled=!required;document.getElementById('contact-subject-label').textContent=product.value==='Billing / Purchases'?'Which game or application was the purchase for?':'Product or subject';if(!required)extra.value='';}
product.addEventListener('change',conditional);conditional();
const ready=config.enabled===true&&typeof config.endpoint==='string'&&(new URL(config.endpoint,location.href).protocol==='https:'||config.localMock===true&&location.hostname==='127.0.0.1'&&new URL(config.endpoint,location.href).origin===location.origin);
button.disabled=!ready;
if(config.localMock)document.getElementById('contact-availability').textContent='Local mock delivery preview. No email is sent. Please use synthetic information.';
else if(!ready)document.getElementById('contact-availability').textContent='The contact form is being prepared and cannot send messages yet. Please use the support email below.';
// Real integration must implement a reviewed challenge UI and one-use token.
// The local fixture token is only supplied by the loopback preview configuration.
async function botToken(){if(config.localMock===true&&location.hostname==='127.0.0.1')return 'local-contact-fixture';throw Error('bot-not-ready');}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy)return;
 if(!form.reportValidity())return;
 if(!ready){announce('The form is unavailable. Please use the support email below.','error');return;}
 const body={name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),product:product.value,subject:extra.disabled?'':extra.value.trim(),message:form.elements.message.value.trim(),website:form.elements.website.value};
 if(!body.name||!body.message||(['Other','Billing / Purchases'].includes(body.product)&&!body.subject)){announce('Please complete all required fields.','error');return;}
 const fingerprint=JSON.stringify(body);if(attempt?.fingerprint!==fingerprint)attempt={fingerprint,id:'contact_'+crypto.randomUUID()};
 const controls=[...form.querySelectorAll('input,select,textarea')].map(control=>({control,disabled:control.disabled}));controls.forEach(({control})=>control.disabled=true);
 busy=true;button.disabled=true;form.setAttribute('aria-busy','true');announce('Submitting your message…','submitting');
 try{
  const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,requestId:attempt.id,botToken:await botToken()}),credentials:'omit',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(20000)});
  const result=await response.json();
  if(!response.ok||result.accepted!==true){const code=result.error;announce(code==='rate-limited'||code==='retry-later'?'Please wait before trying again. You can also use the support email below.':code==='bot-rejected'?'Verification failed. Please try again or use the support email below.':code==='delivery-unconfirmed'||code==='submission-pending'?'We cannot confirm acceptance yet. Retrying unchanged will check this submission without sending a duplicate. You can also contact support by email.':'Your message was not confirmed as accepted. Please retry or use the support email below.','error');return;}
  announce(config.localMock?'Mock delivery accepted your message. No real email was sent.':'The delivery service accepted your message. This confirms acceptance, not final inbox delivery.','success');form.reset();conditional();attempt=null;
 }catch{announce('We could not confirm acceptance. Retry unchanged to check the same submission, or use the support email below.','error');}
 finally{controls.forEach(({control,disabled})=>control.disabled=disabled);conditional();busy=false;button.disabled=!ready;form.removeAttribute('aria-busy');}
});
