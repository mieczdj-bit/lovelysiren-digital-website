// Build a local, noindex review site from the Producer's exact Pass 015 copy.
// All outputs are ignored under work/; this never edits production-served pages.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const sourceDir=path.join(root,'legal/producer-015');
const sourceFiles={
 website:'01-Website-and-Account-Privacy-v1.1.md',
 rta:'02-Road-Trip-Arcade-Privacy-v1.1.md',
 deletion:'03-Account-and-Data-Deletion-Page.md',
 internal:'04-Internal-Data-Retention-and-Support-SOP.md',
 verification:'05-Release-Verification-and-Sources.md',
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageTargets={
 '/privacy.html':'privacy.html',
 '/games/road-trip-arcade-privacy.html':'games/road-trip-arcade-privacy.html',
 '/delete-account.html':'delete-account.html',
 '/support.html':'support.html',
 '/terms.html':'terms.html',
};
function localTarget(href,page){
 let url;try{url=new URL(href,'https://lovelysirendigital.com/');}catch{return href;}
 if(url.origin!=='https://lovelysirendigital.com')return href;
 const target=pageTargets[url.pathname];if(!target)return href;
 let relative=path.posix.relative(path.posix.dirname(page),target);if(!relative)relative=path.posix.basename(target);return relative+(url.search||'')+(url.hash||'');
}
function inline(markdown,page){
 const pattern=/\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|(?<!\*)\*[^*]+\*(?!\*)|https?:\/\/[^\s)<>]+|mailto:[^\s)<>]+/g;
 let out='',at=0,m;
 while((m=pattern.exec(markdown))){out+=esc(markdown.slice(at,m.index));const token=m[0];
  if(token.startsWith('[')){const match=token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(!match)out+=esc(token);else out+=`<a href="${esc(localTarget(match[2],page))}">${esc(match[1])}</a>`;}
  else if(token.startsWith('**'))out+=`<strong>${inline(token.slice(2,-2),page)}</strong>`;
  else if(token.startsWith('`'))out+=`<code>${esc(token.slice(1,-1))}</code>`;
  else if(token.startsWith('*'))out+=`<em>${inline(token.slice(1,-1),page)}</em>`;
  else {let visible=token,tail='';while(/[.,;:!?]$/.test(visible)){tail=visible.slice(-1)+tail;visible=visible.slice(0,-1);}out+=`<a href="${esc(localTarget(visible,page))}">${esc(visible)}</a>${esc(tail)}`;}
  at=pattern.lastIndex;
 }
 return out+esc(markdown.slice(at));
}
function slug(text){return text.toLowerCase().replace(/<[^>]*>/g,'').replace(/&amp;/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function renderMarkdown(source,page){
 let html='',paragraph=[],listType=null,toc=[];
 const closeList=()=>{if(listType){html+=`</${listType}>\n`;listType=null;}};
 const paragraphHtml=()=>paragraph.map((x,index)=>inline(x.text,page)+(index<paragraph.length-1?(x.hardBreak?'<br>':' '):'')).join('');
 const flush=()=>{if(paragraph.length){html+=`<p>${paragraphHtml()}</p>\n`;paragraph=[];}closeList();};
 for(const raw of source.replace(/\r\n/g,'\n').split('\n')){
  const hardBreak=/ {2,}$/.test(raw),line=raw.trim();if(!line){flush();continue;}
  const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){flush();const level=heading[1].length,text=heading[2],id=slug(text);html+=`<h${level}${id?` id="${esc(id)}"`:''}>${inline(text,page)}</h${level}>\n`;if(level===2)toc.push({id,text:text.replace(/\*\*|`|\*/g,'')});continue;}
  if(/^---+$/.test(line)){flush();html+='<hr>\n';continue;}
  const item=line.match(/^(-|\d+\.)\s+(.+)$/);if(item){if(paragraph.length){html+=`<p>${paragraphHtml()}</p>\n`;paragraph=[];}const next=item[1]==='-'?'ul':'ol';if(listType&&listType!==next)closeList();if(!listType){listType=next;html+=`<${listType}>\n`;}html+=`<li>${inline(item[2],page)}</li>\n`;continue;}
  closeList();paragraph.push({text:line,hardBreak});
 }
 flush();return{html,toc};
}
function rebaseAttrs(fragment,prefix){
 return fragment.replace(/\b(href|src)="(?!https?:|mailto:|data:|#)([^"]*)"/g,(_,attr,value)=>`${attr}="${prefix}${value}"`);
}
function htmlShell(sourceHome,title,target,content,reviewLinks){
 const prefix='../'.repeat(target.split('/').length-1);
 let header=sourceHome.match(/<header[\s\S]*?<\/header>/)?.[0],footer=sourceHome.match(/<footer[\s\S]*?<\/footer>/)?.[0];
 if(!header||!footer)throw Error('Expected accessible site header and footer');
 header=header.replace('<a href="privacy.html">Privacy Policy</a>', '<a href="privacy.html">Website &amp; Account Privacy</a><a href="games/road-trip-arcade-privacy.html">Road Trip Arcade Privacy</a><a href="delete-account.html">Account &amp; Data Deletion</a>');
 footer=footer.replace('<a href="privacy.html">Privacy</a>', '<a href="privacy.html">Website Privacy</a><a href="games/road-trip-arcade-privacy.html">RTA Privacy</a><a href="delete-account.html">Account &amp; Data Deletion</a>');
 header=rebaseAttrs(header,prefix);footer=rebaseAttrs(footer,prefix);
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} | LovelySiren Digital — Review</title><link rel="stylesheet" href="${prefix}styles.css"><link rel="stylesheet" href="${prefix}legal.css"><link rel="icon" href="${prefix}favicon.ico"><link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png"></head><body><a class="skip" href="#main">Skip to content</a>${header}<main id="main" class="wrap legal-shell"><aside class="legal-notice"><strong>Local review preview — NOT APPROVED, NOT PUBLISHED, NOT EFFECTIVE.</strong><p>Producer-authored copy is shown for review. No publication date or approved content hash has been assigned.</p><p>Viewing this page does not record account consent or change account activation.</p><nav aria-label="Related review pages">${reviewLinks}</nav></aside>${content}</main>${footer}<script src="${prefix}site.js" defer></script></body></html>`;
}
function archiveCopy(source,target){
 let html=source;const base='<base href="../../../">';
 if(!html.includes('</head>')||!html.includes('<body'))throw Error('Archived policy is not a complete HTML document');
 html=html.replace(/<head([^>]*)>/i,`<head$1>${base}<meta name="robots" content="noindex,nofollow"><style>.archive-review-banner{margin:16px auto;max-width:1000px;padding:14px 20px;border:2px solid #a44;border-radius:12px;background:#fff1d6;color:#421}</style>`);
 html=html.replace(/<body([^>]*)>/,`<body$1><aside class="archive-review-banner"><strong>Archived review copy — combined Privacy Policy effective October 5, 2026.</strong> Retained for comparison only; this local page is noindex and is not the proposed replacement.</aside>`);
 return html;
}
function build(){
 for(const file of Object.values(sourceFiles))if(!fs.existsSync(path.join(sourceDir,file)))throw Error(`Missing Producer source: ${file}`);
 const folder=require('./prepare-staging-007.cjs').build(),pub=path.join(folder,'public'),home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const website=fs.readFileSync(path.join(sourceDir,sourceFiles.website),'utf8');
 const rta=fs.readFileSync(path.join(sourceDir,sourceFiles.rta),'utf8');
 const deletion=fs.readFileSync(path.join(sourceDir,sourceFiles.deletion),'utf8');
 const render=(md,page)=>{const result=renderMarkdown(md,page);const nav=result.toc.length?`<details class="legal-contents"><summary>On this page</summary><nav aria-label="Document sections"><ol>${result.toc.map(x=>`<li><a href="#${esc(x.id)}">${esc(x.text)}</a></li>`).join('')}</ol></nav></details>`:'';return `${nav}<article class="legal-reading">${result.html}</article>`;};
 const pages=[
  ['privacy.html','Website & LovelySiren Account Privacy Policy',website,'<a href="games/road-trip-arcade-privacy.html">Road Trip Arcade Privacy</a> · <a href="delete-account.html">Account &amp; Data Deletion</a> · <a href="legal/archive/privacy-2026-10-05.html">Archived combined policy</a>'],
  ['games/road-trip-arcade-privacy.html','Road Trip Arcade Privacy Policy',rta,'<a href="../privacy.html">Website &amp; Account Privacy</a> · <a href="../delete-account.html">Account &amp; Data Deletion</a> · <a href="../legal/archive/privacy-2026-10-05.html">Archived combined policy</a>'],
  ['delete-account.html','Account and Data Deletion — LovelySiren Digital',deletion,'<a href="privacy.html">Website &amp; Account Privacy</a> · <a href="games/road-trip-arcade-privacy.html">Road Trip Arcade Privacy</a>'],
 ];
 for(const [target,title,md,links] of pages){const output=path.join(pub,target);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,htmlShell(home,title,target,render(md,target),links));}
 const archiveSource=path.join(sourceDir,'archive/privacy-2026-10-05-combined.html');
 if(!fs.existsSync(archiveSource))throw Error('Missing preserved October 5 combined Privacy Policy source');
 const archiveTarget='legal/archive/privacy-2026-10-05.html',archiveOut=path.join(pub,archiveTarget);fs.mkdirSync(path.dirname(archiveOut),{recursive:true});fs.writeFileSync(archiveOut,archiveCopy(fs.readFileSync(archiveSource,'utf8'),archiveTarget));
 const game=path.join(pub,'games/road-trip-arcade.html');let gameHtml=fs.readFileSync(game,'utf8');
 if(!gameHtml.includes('name="robots"'))gameHtml=gameHtml.replace(/<head([^>]*)>/i,'<head$1><meta name="robots" content="noindex,nofollow">');
 gameHtml=gameHtml.replace('<a href="../privacy.html">Privacy Policy</a>','<a href="../privacy.html">Website &amp; Account Privacy</a><a href="road-trip-arcade-privacy.html">Road Trip Arcade Privacy</a>');
 gameHtml=gameHtml.replace('<a href="../privacy.html">Privacy</a>','<a href="../privacy.html">Website Privacy</a><a href="road-trip-arcade-privacy.html">RTA Privacy</a>');fs.writeFileSync(game,gameHtml);
 const accountConfig=fs.readFileSync(path.join(pub,'account/config.js'),'utf8');if(!accountConfig.includes('registrationEnabled: false')||!accountConfig.includes('googleEnabled: false'))throw Error('Account activation controls changed in preview inputs');
 const manifest={reviewOnly:true,noindex:true,notForDeployment:true,policyIds:{website:'website-privacy-v1.1',rta:'rta-privacy-v1.1'},routes:{website:'/privacy.html',rta:'/games/road-trip-arcade-privacy.html',deletion:'/delete-account.html',archive:'/legal/archive/privacy-2026-10-05.html'},effectiveDates:{website:null,rta:null},approvedPolicyHashes:{website:null,rta:null},accountActivation:{registrationEnabled:false,googleEnrollmentEnabled:false,accountBackendEnabled:false},internalDocumentsExcluded:true,archivedSource:'legal/producer-015/archive/privacy-2026-10-05-combined.html',files:{}};
 for(const name of [...pages.map(x=>x[0]),archiveTarget,'games/road-trip-arcade.html']){const bytes=fs.readFileSync(path.join(pub,name));manifest.files[name]={bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
 fs.writeFileSync(path.join(folder,'policy-review-015-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({artifact:folder,routes:manifest.routes,noindex:true,accountGates:'off',notForDeployment:true}));return folder;
}
module.exports={build,renderMarkdown,localTarget};if(require.main===module)build();
