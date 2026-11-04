// Prepare a non-authorizing checklist for a later, separately approved policy publication.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=rel=>JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
function build(){
 const accountControls=source('staging/account-014-controls.review.json');
 const accountClient=fs.readFileSync(path.join(root,'account/config.js'),'utf8');
 const legal=source('legal/policy-versions.json');
 const gates={registrationDisabled:accountControls.registrationEnabled===false,googleEnrollmentDisabled:accountControls.googleEnrollmentEnabled===false,identityResolutionDisabled:accountControls.identityResolutionEnabled===false,contactDeliveryDisabled:accountControls.contactDeliveryEnabled===false,marketingSendingDisabled:accountControls.marketingSendingEnabled===false,deletionDisabled:accountControls.deletionEnabled===false,clientRegistrationDisabled:accountClient.includes('registrationEnabled: false')};
 if(Object.values(gates).some(v=>v!==true))throw Error('A first-account feature gate is not closed; stop and review before policy publication preparation');
 const output={status:'REVIEW ONLY — NOT APPROVED; NO PUBLICATION OR CONSENT AUTHORIZED',baseCommit:'5c9a4d8020670f5923ece9b100eb14f9d8c53ff9',policies:{website:{documentId:'website-privacy-v1.1',version:'1.1',route:'/privacy.html',effectiveDate:null,approvedFinalHtmlSha256:null,acceptanceRegistry:{status:'not-published',documentId:null,version:null,effectiveDate:null,contentSha256:null}},rta:{documentId:'rta-privacy-v1.1',version:'1.1',route:'/games/road-trip-arcade-privacy.html',effectiveDate:null,approvedFinalHtmlSha256:null,acceptanceRegistry:'not-a-company-account-consent-record; confirm RTA notice/link separately'}},deletionRequestPage:{route:'/delete-account.html',effectiveDate:null,publicationAuthorized:false},preservedCombinedPolicy:{effectiveDate:'2026-10-05',reviewArchiveRoute:'/legal/archive/privacy-2026-10-05.html',source:'legal/producer-015/archive/privacy-2026-10-05-combined.html'},checks:{approvedFinalText:false,actualEffectiveDateAssigned:false,servedHtmlSha256Captured:false,servedHtmlMatchesApprovedBytes:false,websiteAcceptanceRegistryUpdated:false,rtaPrivacyUrlConfirmedInRtaRelease:false,combinedPolicyArchiveVerified:false,gameAndWebsiteLinksVerified:false,executiveProducerApproval:false,rtaProducerReleaseFactsConfirmed:false},closedGateChecks:gates,requiredLaterAction:'After explicit approval, supply approved versions, real effective dates, exact final HTML SHA-256 values and the Website Account acceptance-registry values; verify exact served bytes and URLs. This tool does not publish, alter the registry or enable services.'};
 const out=path.join(root,'work/policy-publication-015.checklist.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({artifact:out,status:output.status,closedGateChecks:gates}));return output;
}
function verifyApprovedPublication({approval,publicRoot,registryPath=path.join(root,'legal/policy-versions.json')}){
 if(!approval||approval.status!=='approved'||typeof approval.approvalReference!=='string'||!approval.approvalReference.trim())throw Error('Explicit approved manifest is required');
 const registry=JSON.parse(fs.readFileSync(registryPath,'utf8')),results=[];
 for(const key of ['website','rta']){
  const expected=approval.policies?.[key];if(!expected||expected.documentId!==(key==='website'?'website-privacy-v1.1':'rta-privacy-v1.1')||expected.version!=='1.1'||!/^\d{4}-\d{2}-\d{2}$/.test(expected.effectiveDate||'')||!/^([a-f0-9]{64})$/i.test(expected.finalHtmlSha256||''))throw Error(`Approved ${key} document identity/date/hash is incomplete`);
  const route=key==='website'?'privacy.html':'games/road-trip-arcade-privacy.html',bytes=fs.readFileSync(path.join(publicRoot,route)),actual=require('node:crypto').createHash('sha256').update(bytes).digest('hex');
  if(actual!==expected.finalHtmlSha256.toLowerCase())throw Error(`${key} served HTML does not match the approved content hash`);
  const html=bytes.toString('utf8');if(html.includes('[SET ON APPROVED PUBLICATION]')||!html.includes(expected.effectiveDate)||!html.includes(expected.documentId))throw Error(`${key} served page is missing approved date or identity`);
  let registryStatus='notice-only';
  if(key==='website'){
   const registryEntry=registry.websitePrivacy;
   if(!registryEntry||registryEntry.documentId!==expected.documentId||registryEntry.version!==expected.version||registryEntry.effectiveDate!==expected.effectiveDate||registryEntry.contentSha256!==expected.finalHtmlSha256.toLowerCase()||registryEntry.publicationApproved!==true)throw Error('Website account acceptance registry metadata does not match the approved served HTML hash');
   registryStatus='matched';
  }else{
   const registryEntry=registry.rtaPrivacy;
   if(!registryEntry||registryEntry.documentId!==expected.documentId||registryEntry.version!==expected.version||registryEntry.effectiveDate!==expected.effectiveDate||registryEntry.contentSha256!==expected.finalHtmlSha256.toLowerCase()||registryEntry.publicationApproved!==true)throw Error('RTA privacy publication metadata does not match the approved served HTML hash');
  }
  results.push({documentId:expected.documentId,route:'/'+route,effectiveDate:expected.effectiveDate,servedHtmlSha256:actual,websiteAccountAcceptanceMetadata:registryStatus});
 }
 return{status:'verified-against-approved-manifest',approvalReference:approval.approvalReference,results};
}
module.exports={build,verifyApprovedPublication};if(require.main===module)build();
