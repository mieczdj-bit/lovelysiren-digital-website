import {SUPPORT_MAILBOX,validEmail} from './submission.js';
// Server-only provider integration boundary. No SDK, vendor account or secret is
// configured by this source. Transport must classify definitive rejection only
// when the provider contract proves no message was accepted.
export function createDeliveryAdapter({transport,verifiedFrom,approved=false}){
 if(!approved||typeof transport!=='function'||!/^[-A-Za-z0-9._+]+@(?:[A-Za-z0-9-]+\.)*lovelysirendigital\.com$/.test(verifiedFrom||''))throw Error('Delivery approval and verified company sender required');
 return async(mail,context)=>{
  if(mail.to!==SUPPORT_MAILBOX||mail.from!==verifiedFrom||!validEmail(mail.replyTo)||typeof mail.subject!=='string'||mail.subject.length>160||/[\u0000-\u001F\u007F]/.test(mail.subject)||typeof mail.text!=='string'||mail.text.length>12000||!/^([a-f0-9]{64})$/.test(context?.idempotencyKey||''))throw Error('Invalid fixed support envelope');
  return transport({from:verifiedFrom,to:SUPPORT_MAILBOX,replyTo:mail.replyTo,subject:mail.subject,text:mail.text},{idempotencyKey:context.idempotencyKey});
 };
}
// A real bot provider's verified server response must bind hostname/action,
// expiry, one-time challenge and replay defense. Raw client success is not proof.
export function createBotVerifier({verify,hostname,approved=false}){
 if(!approved||typeof verify!=='function'||!hostname)throw Error('Bot provider approval required');
 return async input=>{const r=await verify(input);return{verified:r?.success===true&&r.hostname===hostname&&r.action==='support_contact'&&r.fresh===true&&r.replayProtected===true};};
}
export function createLocalAdapters({projectId,dbHost}){
 if(process.env.FUNCTIONS_EMULATOR!=='true'||projectId!=='demo-road-trip-arcade'||dbHost!=='127.0.0.1:19000')throw Error('Mock adapters require guarded demo emulator');
 const accepted=[];return{accepted,verifyBot:async({token})=>({verified:token==='local-contact-fixture'}),deliver:async mail=>{accepted.push(structuredClone(mail));return{accepted:true};}};
}

// Optional provider candidate, NOT approved/configured. Only stubbed fetch is
// exercised in tests. Caller secrets must come from approved server secret storage.
export function createResendAdapter({apiKey,verifiedFrom,approved=false,fetchImpl=globalThis.fetch}){
 if(!approved||typeof apiKey!=='string'||apiKey.length<16||apiKey.length>200||/[\r\n]/.test(apiKey))throw Error('Resend approval and server credential required');
 return createDeliveryAdapter({approved,verifiedFrom,transport:async(mail,context)=>{
  let response;try{response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Idempotency-Key':context.idempotencyKey},body:JSON.stringify({from:mail.from,to:[SUPPORT_MAILBOX],reply_to:mail.replyTo,subject:mail.subject,text:mail.text}),redirect:'error',signal:AbortSignal.timeout(10000)});}catch{throw Error('provider-unconfirmed');}
  if([400,401,403,422,429].includes(response.status))throw Object.assign(Error('provider-not-accepted'),{definitelyNotAccepted:true});
  if(response.status<200||response.status>=300)throw Error('provider-unconfirmed');
  let result;try{result=await response.json();}catch{throw Error('provider-unconfirmed');}
  if(typeof result.id!=='string'||!/^[a-zA-Z0-9_-]{8,100}$/.test(result.id))throw Error('provider-unconfirmed');
  return{accepted:true};
 }});
}
