export const projectId='demo-road-trip-arcade';
export const audience='https://identity.example.test/lovelysirenIdentityApi';
export const caller={subject:'123456789012345678901',email:'rta-staging@example-test.iam.gserviceaccount.com',product:'rta'};
export function policyConfig(){return{serviceEnabled:true,mode:'controlled-test',identityResolutionEnabled:true,registrationEnabled:false,policy:{approved:true,minimumAge:18,termsVersion:'emulator-terms-006',privacyVersion:'emulator-privacy-006',documents:{terms:{kind:'website-terms',status:'test-fixture',version:'emulator-terms-006',effectiveDate:'2026-01-01',sha256:'a'.repeat(64),url:'http://127.0.0.1:18766/terms-fixture'},privacy:{kind:'website-privacy',status:'test-fixture',version:'emulator-privacy-006',effectiveDate:'2026-01-01',sha256:'b'.repeat(64),url:'http://127.0.0.1:18766/privacy-fixture'}}}};}
export function records(uid='identity006',id='lsid_11111111-1111-4111-8111-111111111111'){
 const config=policyConfig(),p=config.policy;
 return{'controls/config':config,['profiles/'+uid]:{firebaseUid:uid,lovelySirenId:id,state:'active',ageCategory:'adult',policyAcceptance:{termsVersion:p.termsVersion,privacyVersion:p.privacyVersion,termsSha256:p.documents.terms.sha256,privacySha256:p.documents.privacy.sha256,acceptedAt:Date.parse('2026-02-01')}},['identityByUid/'+uid]:{lovelySirenId:id},['uidByIdentity/'+id]:uid};
}
export async function invoke(handler,body,headers={},overrides={}){
 const req={method:'POST',path:'/identity.resolve.v1',body,rawBody:Buffer.from(JSON.stringify(body)),get:key=>headers[key],is:type=>type==='application/json',...overrides};
 const res={headers:{},set(key,value){this.headers[key]=value;},status(code){this.code=code;return this;},json(body){this.body=body;}};
 await handler(req,res);return res;
}
