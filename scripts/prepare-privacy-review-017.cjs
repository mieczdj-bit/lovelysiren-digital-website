// Builds local-only policy review pages, with explicit RTA B2 deployment status.
// Never changes tracked public pages or publication metadata.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
function build(){
 const folder=require('./prepare-privacy-review-015.cjs').build();
 const pub=path.join(folder,'public');
 const note='<aside class="legal-notice rta-release-status" role="note"><strong>RTA release-status review note:</strong><p>The RTA B2 deletion implementation is on a development branch only. It has not been verified as deployed or made available to live customers. The current live-service disclosure that complete automatic removal of all online RTA records is not currently available remains the applicable customer-facing statement.</p><p>A website request or email intake is not completion of an RTA deletion. RTA-only deletion and company-wide LovelySiren Account deletion have separate scopes and require their own verified workflows.</p></aside>';
 for(const target of ['games/road-trip-arcade-privacy.html','delete-account.html']){
  const full=path.join(pub,target);let html=fs.readFileSync(full,'utf8');
  if(!html.includes('<article class="legal-reading">'))throw Error('Missing legal article in '+target);
  html=html.replace('<article class="legal-reading">',note+'<article class="legal-reading">');
  fs.writeFileSync(full,html);
 }
 const manifestPath=path.join(folder,'policy-review-015-manifest.json');
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 Object.assign(manifest,{pass:'LSD-ACCOUNT-017',rtaB2Status:'development-only-not-deployed-or-live-verified',reviewNotes:{rta:'B2 is not available to live customers; current live disclosures remain controlling.',deletion:'Website request intake is not proof or completion of RTA data deletion; company-wide deletion is a separate workflow.'},publication:{effectiveDates:null,approvedPolicyHashes:null,publicationApproval:false},preserved:{websiteTerms:'website-terms-v1.0 unchanged',combinedPrivacyArchive:'source preserved; review wrapper only'}});
 for(const name of Object.keys(manifest.files)){const bytes=fs.readFileSync(path.join(pub,name));manifest.files[name]={bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({artifact:folder,routes:manifest.routes,rtaB2:manifest.rtaB2Status,noindex:true,publication:'not approved'}));return folder;
}
module.exports={build};if(require.main===module)build();
