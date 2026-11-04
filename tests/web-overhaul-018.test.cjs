const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
test('homepage and About use the approved motto, program heading, and complete founder content',()=>{
 const home=read('index.html'),about=read('about.html'),studio=read('studio.html');
 assert.match(home,/<h2 id="programs-title">Featured Programs<\/h2>/);assert.match(home,/Games we want to play\. Apps we want to use\./);assert.doesNotMatch(home,/Featured Games|We make games worth playing and apps worth keeping/i);
 for(const text of ['A Different Kind of Beginning','Why We Create','Our Philosophy','Ideas First. Technology Second.','Looking Toward the Future','A Note from Our Founder','You shouldn\x27t have to be a professional programmer','AI-assisted development','At the end of the day, I\x27d rather be remembered for something that made someone smile than something that simply made a dollar.'])assert.ok(about.includes(text),`About copy missing: ${text}`);
 assert.ok(about.indexOf('A Note from Our Founder')>about.indexOf('Looking Toward the Future'));assert.doesNotMatch(about,/founder-photo|founder portrait/i);assert.match(about,/assets\/siren-mascot\.png/);
 assert.match(studio,/Our Studio/);assert.match(studio,/How We Work/);assert.match(studio,/aria-label="Main navigation"/);
});
test('creator credits are compact, scrollable, verified, and keep licensed asset notices separate',()=>{
 const studio=read('studio.html'),styles=read('styles.css'),rta=read('games/road-trip-arcade.html'),audit=read('audit/STUDIO-CREATOR-CREDITS-018.md');
 assert.equal((studio.match(/class="credits-panel"/g)||[]).length,1);assert.match(studio,/<details class="credits-disclosure" open>/);assert.match(studio,/Browse project and contributor credits/);assert.match(studio,/role="region"[^>]*tabindex="0"/);assert.match(styles,/\.credits-panel\{[^}]*overflow-y:auto/);assert.match(styles,/\.credits-disclosure>summary/);assert.match(rta,/Created by: LovelySiren Digital/);assert.doesNotMatch(studio,/Freesound|Scavenger_Complete_Fanfare|Bingo_Opening/);
 assert.match(audit,/CC BY audio requiring credit is recorded in the RTA app credits/);assert.match(audit,/NOT SHIPPED/);assert.match(audit,/did not modify the RTA repository/);
});
test('navigation cleanup, metadata, account off-state, and Website Terms v1.0 legal text are preserved',()=>{
 const files=['index.html','about.html','studio.html','games/road-trip-arcade.html','terms.html',...fs.readdirSync(path.join(root,'account')).filter(f=>f.endsWith('.html')).map(f=>'account/'+f)];
 for(const rel of files){const html=read(rel);assert.doesNotMatch(html,/Disclaimers — in preparation/);assert.doesNotMatch(html,/href="(?:\.\.\/)?index\.html#about">Our Studio/);assert.match(html,/href="(?:\.\.\/)?studio\.html"[^>]*>Our Studio/);}
 for(const rel of ['index.html','about.html','studio.html','games/road-trip-arcade.html'])assert.match(read(rel),/<link rel="canonical"/);
 const config=read('account/config.js');assert.match(config,/enabled: false/);assert.match(config,/registrationEnabled: false/);assert.match(config,/googleEnabled: false/);
 for(const rel of ['account/sign-in.html','account/forgot-password.html','account/verify-email.html'])assert.match(read(rel),/disabled/);
 const before=execFileSync('git',['show','origin/main:terms.html'],{cwd:root,encoding:'utf8'}),after=read('terms.html');
 const article=html=>html.match(/<article class="legal-reading">[\s\S]*?<\/article>/)?.[0].replace(/\r\n/g,'\n');assert.ok(article(before));assert.equal(article(after),article(before));
 const versions=JSON.parse(read('legal/policy-versions.json'));assert.equal(versions.websiteTerms.documentId,'website-terms-v1.0');assert.equal(versions.websiteTerms.effectiveDate,'2026-10-28');assert.equal(versions.websiteTerms.contentSha256,'963bac3c70804f34e9aa184149b46c714d720e37ba6181529744d7d465ef44de');
});
test('developer prototypes are unlinked, local-only in the release manifest, and do not store or transmit proposals',()=>{
 const home=read('index.html'),rta=read('games/road-trip-arcade.html'),form=read('developers/submit.html'),js=read('developers/developer-prototype.js'),exec=read('executive/index.html'),execJs=read('executive/dashboard.js'),data=read('executive/dashboard-data.js'),sitemap=read('staging/sitemap-018-draft.xml');
 assert.doesNotMatch(home+rta,/developers\/|executive\//);assert.match(form,/no upload endpoint, email delivery, backend, or storage/);assert.match(form,/autocomplete="off"/);assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon/);assert.match(js,/form\.reset\(\)/);
 assert.match(exec,/NOT SECURE OR ACCESS-CONTROLLED/);assert.match(data,/Fabricated layout data only/);assert.doesNotMatch(execJs,/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/);
 assert.doesNotMatch(sitemap,/developers\/|executive\/|delete-account/);assert.match(sitemap,/studio\.html/);assert.match(sitemap,/games\/road-trip-arcade\.html/);
 const allow=JSON.parse(read('staging/account-007-static-allowlist.json'));assert.ok(!allow.files.some(f=>f.startsWith('developers/')||f.startsWith('executive/')));
});
