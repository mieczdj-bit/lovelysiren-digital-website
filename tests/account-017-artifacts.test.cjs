const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('Pass 017 policy package is local, noindex, unchanged and explicit about undeployed RTA B2',()=>{
 const folder=require('../scripts/prepare-privacy-review-017.cjs').build(),pub=path.join(folder,'public');
 const manifest=JSON.parse(fs.readFileSync(path.join(folder,'policy-review-015-manifest.json'),'utf8'));
 assert.equal(manifest.rtaB2Status,'development-only-not-deployed-or-live-verified');
 assert.equal(manifest.publication.publicationApproval,false);assert.equal(manifest.effectiveDates.website,null);assert.equal(manifest.approvedPolicyHashes.rta,null);
 for(const route of ['/privacy.html','/games/road-trip-arcade-privacy.html','/delete-account.html']){
  const html=fs.readFileSync(path.join(pub,route.slice(1)),'utf8');assert.match(html,/<meta name="robots" content="noindex,nofollow">/);assert.match(html,/Local review preview/);
 }
 const archive=fs.readFileSync(path.join(pub,'legal/archive/privacy-2026-10-05.html'),'utf8');assert.match(archive,/<meta name="robots" content="noindex,nofollow">/);assert.match(archive,/Archived review copy/);
 const rta=fs.readFileSync(path.join(pub,'games/road-trip-arcade-privacy.html'),'utf8');assert.match(rta,/not been verified as deployed/);assert.ok(rta.indexOf('rta-release-status')<rta.indexOf('<article class="legal-reading">'));
 assert.match(fs.readFileSync(path.join(pub,'delete-account.html'),'utf8'),/not completion of an RTA deletion/);
 assert.match(fs.readFileSync(path.join(pub,'account/config.js'),'utf8'),/registrationEnabled: false/);
 const source=fs.readFileSync(path.join(root,'legal/producer-015/archive/privacy-2026-10-05-combined.html'),'utf8');const main=source.slice(source.indexOf('<main>'),source.indexOf('</main>')+'</main>'.length);assert.ok(archive.includes(main));assert.match(archive,/combined Privacy Policy effective October 5, 2026/);
 assert.match(rta,/Complete automatic removal of all online RTA records is not currently available/);
});
test('Pass 017 staging config is isolated, deny-by-default, noindex and inactive',()=>{
 const folder=require('../scripts/prepare-account-staging-017.cjs').build();
 const config=JSON.parse(fs.readFileSync(path.join(folder,'firebase.account-017.json'),'utf8'));
 assert.equal(config.hosting[0].target,'account-staging');assert.equal(config.database[0].target,'account-staging');assert.equal(config.functions[0].source,'functions-account');
 const controls=JSON.parse(fs.readFileSync(path.join(folder,'account-017-controls.review.json'),'utf8'));
 for(const [name,value]of Object.entries(controls.account))if(typeof value==='boolean')assert.equal(value,false,name);
 assert.equal(controls.policies.privacy.approved,false);assert.equal(controls.database.defaultRtaRulesUntouched,true);
 assert.ok(config.hosting[0].headers.some(x=>x.headers.some(h=>h.key==='X-Robots-Tag'&&h.value.includes('noindex'))));
 const rules=JSON.parse(fs.readFileSync(path.join(folder,'account-database-staging.review.rules.json'),'utf8'));assert.match(rules.rules['.read'],/lovelysiren-account-service/);assert.match(rules.rules['.write'],/lovelysiren-account-service/);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(folder,'account-database-staging.deny-all.rollback.json'),'utf8')).rules,{'.read':false,'.write':false});
 const files=fs.readdirSync(folder,{recursive:true}).filter(x=>String(x).includes('firebase.account-017'));assert.ok(files.length>=2);
});
