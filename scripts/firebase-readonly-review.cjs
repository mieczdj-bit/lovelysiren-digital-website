const fs=require('fs'),path=require('path'),crypto=require('crypto');
const PROJECT='road-trip-arcade';
const requests=Object.freeze([
 ['rules','https://road-trip-arcade-default-rtdb.firebaseio.com','/.settings/rules.json'],
 ['project','https://firebase.googleapis.com',`/v1beta1/projects/${PROJECT}`],
 ['auth','https://identitytoolkit.googleapis.com',`/admin/v2/projects/${PROJECT}/config`],
 ['google','https://identitytoolkit.googleapis.com',`/admin/v2/projects/${PROJECT}/defaultSupportedIdpConfigs/google.com`],
 ['functionsV2','https://cloudfunctions.googleapis.com',`/v2/projects/${PROJECT}/locations/-/functions`],
 ['functionsV1','https://cloudfunctions.googleapis.com',`/v1/projects/${PROJECT}/locations/-/functions`],
 ['databases','https://firebasedatabase.googleapis.com',`/v1beta/projects/${PROJECT}/locations/-/instances`],
 ['hosting','https://firebasehosting.googleapis.com',`/v1beta1/projects/${PROJECT}/sites`],
 ['billing','https://cloudbilling.googleapis.com',`/v1/projects/${PROJECT}/billingInfo`],
 ['iam','https://cloudresourcemanager.googleapis.com',`/v1/projects/${PROJECT}:getIamPolicy`,'POST'],
 ['accountControls','https://road-trip-arcade-default-rtdb.firebaseio.com','/lovelySirenAccountsV1/controls/config.json']
]);
function safeSummary(kind,b){
 if(kind==='project')return{projectId:b.projectId,displayName:b.displayName,state:b.state};
 if(kind==='rules')return{topLevelPaths:Object.keys(b.rules||{}),rootRead:b.rules?.['.read'],rootWrite:b.rules?.['.write'],accountNamespacePresent:!!b.rules?.lovelySirenAccountsV1};
 if(kind==='auth')return{authorizedDomains:b.authorizedDomains,signIn:b.signIn?{email:b.signIn.email?{enabled:b.signIn.email.enabled,passwordRequired:b.signIn.email.passwordRequired}:null,anonymous:b.signIn.anonymous?{enabled:b.signIn.anonymous.enabled}:null,allowDuplicateEmails:b.signIn.allowDuplicateEmails}:null,passwordPolicyConfig:b.passwordPolicyConfig,emailPrivacyConfig:b.emailPrivacyConfig,blockingFunctionsConfigured:!!b.blockingFunctions&&Object.keys(b.blockingFunctions).length>0,notification:b.notification?.sendEmail?{method:b.notification.sendEmail.method,verifyEmailTemplateConfigured:!!b.notification.sendEmail.verifyEmailTemplate,resetPasswordTemplateConfigured:!!b.notification.sendEmail.resetPasswordTemplate}:null};
 if(kind==='google')return{enabled:b.enabled,clientIdConfigured:!!b.clientId};
 if(kind.startsWith('functions'))return{nextPageTokenPresent:!!b.nextPageToken,functions:(b.functions||[]).map(f=>({name:f.name,state:f.state||f.status,runtime:f.buildConfig?.runtime||f.runtime,url:f.serviceConfig?.uri||f.httpsTrigger?.url,serviceAccount:f.serviceConfig?.serviceAccountEmail? 'configured':undefined})),unreachable:b.unreachable};
 if(kind==='databases')return{instances:(b.instances||[]).map(i=>({name:i.name,databaseUrl:i.databaseUrl,type:i.type,state:i.state}))};
 if(kind==='hosting')return{sites:(b.sites||[]).map(s=>({name:s.name,defaultUrl:s.defaultUrl})),nextPageTokenPresent:!!b.nextPageToken};
 if(kind==='billing')return{billingEnabled:b.billingEnabled};
 if(kind==='iam')return{roles:(b.bindings||[]).map(x=>({role:x.role,memberCount:x.members?.length||0})),conditionalBindings:(b.bindings||[]).filter(x=>x.condition).length};
 if(kind==='accountControls')return b?{serviceEnabled:b.serviceEnabled,registrationEnabled:b.registrationEnabled,mode:b.mode,googleLinkingEnabled:b.googleLinkingEnabled,allowedOrigins:b.allowedOrigins,policyApproved:b.policy?.approved,termsVersion:b.policy?.termsVersion,privacyVersion:b.policy?.privacyVersion}: {present:false};
 return{};
}
async function main(){
 const root=path.resolve(__dirname,'..');const folder=path.join(root,'work','firebase-review-004');fs.mkdirSync(folder,{recursive:true});
 const report={projectId:PROJECT,observedAt:new Date().toISOString(),mode:'read-only',checks:{}};const save=()=>fs.writeFileSync(path.join(folder,'inspection-summary.json'),JSON.stringify(report,null,2)+'\n');save();
 // Use the existing CLI's credential handler in memory; never output tokens or raw provider/IAM responses.
 const auth=require('firebase-tools/lib/auth');const account=auth.getGlobalDefaultAccount();
 if(!account){report.authentication='interactive-cli-login-required';save();console.log(JSON.stringify({authentication:report.authentication,summary:'work/firebase-review-004/inspection-summary.json'}));return;}
 const {requireAuth}=require('firebase-tools/lib/requireAuth');const {Client}=require('firebase-tools/lib/apiv2');await requireAuth({project:PROJECT,nonInteractive:true,user:account.user,tokens:account.tokens},true);
 report.authentication='existing-cli-session';save();
 for(const [kind,origin,resource,method='GET']of requests){
  try{
   const fields={google:'enabled,clientId',auth:'authorizedDomains,signIn(email(enabled,passwordRequired),anonymous(enabled),allowDuplicateEmails),passwordPolicyConfig,emailPrivacyConfig,blockingFunctions,notification(sendEmail(method,verifyEmailTemplate,resetPasswordTemplate))',functionsV2:'functions(name,state,buildConfig(runtime),serviceConfig(uri,serviceAccountEmail)),unreachable,nextPageToken',functionsV1:'functions(name,status,runtime,httpsTrigger(url)),unreachable,nextPageToken'}[kind];
   // Do not request OAuth secrets or function environment values merely to inspect settings.
   const options={timeout:12000,retries:0,...(fields?{queryParams:{fields}}:{})};const client=new Client({urlPrefix:origin,auth:true});const result=method==='POST'?await client.post(resource,{},options):await client.get(resource,options);const b=result.body;
   if(kind==='rules'){
    if(!b?.rules)throw Object.assign(new Error('Invalid rules'),{code:'invalid-rules-response'});
    const raw=JSON.stringify(b,null,2)+'\n';const sha256=crypto.createHash('sha256').update(raw).digest('hex');const file='deployed-database.rules.json';fs.writeFileSync(path.join(folder,file),raw);fs.writeFileSync(path.join(folder,'rules-backup-manifest.json'),JSON.stringify({projectId:PROJECT,databaseUrl:origin,source:'live-authenticated-rules-api',capturedAt:new Date().toISOString(),file,sha256},null,2)+'\n');
   }
   report.checks[kind]={status:'VERIFIED AGAINST LIVE CONFIGURATION',summary:safeSummary(kind,b)};
  }catch(error){report.checks[kind]={status:'BLOCKED',httpStatus:error.status||error.context?.response?.statusCode||null,reason:typeof error.code==='string'&&/^[a-zA-Z0-9_/-]{1,60}$/.test(error.code)?error.code:'request-failed-or-permission-denied'};}
  save();console.log(JSON.stringify({check:kind,status:report.checks[kind].status}));
 }
 console.log('Sanitized inventory saved locally; actual rules backup, if successful, is private and ignored. No deployment or customer-record enumeration performed.');
}
module.exports={requests,safeSummary};if(require.main===module)main().catch(()=>{console.error('Read-only inspection could not authenticate or initialize. No private error payload was printed.');process.exitCode=1;});
