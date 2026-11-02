import {createHmac,randomUUID} from 'node:crypto';
export const SUPPORT_MAILBOX='lovelysirenstudios@gmail.com';
export const PRODUCTS=['LovelySiren Account','Billing / Purchases','LovelySiren Website','Road Trip Arcade (RTA)','Other'];
export const validEmail=value=>typeof value==='string'&&value.length<=254&&/^[-A-Za-z0-9.!#$%&'*+/=?^_`{|}~]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/.test(value)&&!value.includes('..');
export class ContactError extends Error {constructor(status,code){super(code);Object.assign(this,{status,code});}}
const fail=(status,code)=>{throw new ContactError(status,code);};
export function validateMessage(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['name','email','product','subject','message','requestId','botToken','website'].includes(k)))fail(400,'invalid-input');
 const text=(key,max,multiline=false)=>{const value=input[key];if(typeof value!=='string'||value.length>max||(!multiline&&/[\p{Cc}\p{Cf}]/u.test(value))||(multiline&&/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(value)))fail(400,'invalid-input');return value.trim();};
 const name=text('name',100),email=text('email',254),message=text('message',5000,true),product=text('product',80),subject=text('subject',160);
 if(!name||!message||!PRODUCTS.includes(product)||!validEmail(email)||!/^contact_[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(input.requestId||'')||typeof input.botToken!=='string'||!input.botToken||input.botToken.length>4096||typeof input.website!=='string'||input.website.length>200)fail(400,'invalid-input');
 if(['Other','Billing / Purchases'].includes(product)?!subject:Boolean(subject))fail(400,'invalid-input');
 if(input.website)fail(403,'bot-rejected');
 return {name,email,product,subject,message,requestId:input.requestId,botToken:input.botToken};
}
export function mailFor(data,from){return{from,to:SUPPORT_MAILBOX,replyTo:data.email,subject:'LovelySiren Digital support — '+data.product,text:['Name: '+data.name,'Reply email: '+data.email,'Product: '+data.product,...(data.subject?['Product / subject: '+data.subject]:[]),'','Message:',data.message,'','Support submission does not verify account ownership or authorize billing/deletion actions.'].join('\n')};}
export function createSubmission({store,verifyBot,deliver,from,secret,clock=Date.now}){
 if(typeof secret!=='string'||secret.length<32||!store||typeof verifyBot!=='function'||typeof deliver!=='function'||typeof from!=='string'||!/^[-A-Za-z0-9._+]+@(?:[A-Za-z0-9-]+\.)*lovelysirendigital\.com$/.test(from))throw Error('Contact service configuration is incomplete');
 const hash=value=>createHmac('sha256',secret).update(value).digest('hex');
 return async function submit(input,{ip}){
  const data=validateMessage(input),now=clock();
  if(typeof ip!=='string'||!ip||ip.length>100)fail(503,'temporarily-unavailable');
  // Persistent attempt quotas run BEFORE potentially paid bot verification.
  await store.limit({ip:hash('ip:'+ip),email:hash('email:'+data.email.toLowerCase()),now});
  let bot;try{bot=await verifyBot({token:data.botToken,ip,action:'support_contact',requestId:data.requestId});}catch{fail(503,'verification-unavailable');}
  if(bot?.verified!==true)fail(403,'bot-rejected');
  const payload=hash(JSON.stringify([data.name,data.email,data.product,data.subject,data.message]));
  const request=hash('request:'+data.requestId),lease=randomUUID();
  const claim=await store.claim({payload,request,lease,now});
  if(claim.status==='accepted')return {accepted:true,duplicate:true};
  if(claim.status==='pending'||claim.status==='unknown')fail(409,claim.status==='unknown'?'delivery-unconfirmed':'submission-pending');
  let result;
  try{result=await deliver(mailFor(data,from),{idempotencyKey:payload});}
  catch(error){
   // Only a trusted adapter's explicit NOT-ACCEPTED receipt permits retry.
   const status=error?.definitelyNotAccepted===true?'retryable':'unknown';
   await store.finish({payload,lease,status,now:clock()});
   fail(status==='retryable'?503:409,status==='retryable'?'delivery-rejected':'delivery-unconfirmed');
  }
  if(result?.accepted!==true){await store.finish({payload,lease,status:'unknown',now:clock()});fail(409,'delivery-unconfirmed');}
  // Persistence must confirm the provider result before the browser sees success.
  await store.finish({payload,lease,status:'accepted',now:clock()});
  return {accepted:true,duplicate:false};
 };
}
export function createContactHandler({submit,enabled=()=>false,origins=[]}){
 return async(req,res)=>{
  res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');
  try{
   if(!enabled())fail(503,'contact-inactive');
   const origin=req.get('Origin');if(!origins.includes(origin))fail(403,'origin-not-allowed');
   res.set('Access-Control-Allow-Origin',origin);res.set('Vary','Origin');res.set('Access-Control-Allow-Methods','POST, OPTIONS');res.set('Access-Control-Allow-Headers','Content-Type');
   if(req.method==='OPTIONS'){res.status(204).send('');return;}
   if(req.method!=='POST')fail(405,'method-not-allowed');
   if(req.path!=='/'&&req.path!=='/submit')fail(404,'not-found');
   if(!req.is('application/json')||!req.rawBody||req.rawBody.length>32768)fail(400,'invalid-input');
   const result=await submit(req.body,{ip:req.ip});res.status(200).json(result);
  }catch(error){const known=error instanceof ContactError;res.status(known?error.status:503).json({error:known?error.code:'temporarily-unavailable'});}
 };
}
