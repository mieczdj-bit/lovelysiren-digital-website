// Builds an explicit local-only file set and serves it on loopback. This is not Hosting.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const files=[
 'index.html','about.html','studio.html','support.html','terms.html','privacy.html','delete-account.html',
 'styles.css','legal.css','rta.css','site.js','rta.js','favicon.ico','apple-touch-icon.png','site.webmanifest',
 'games/road-trip-arcade.html','support/config.js','support/form.js','support/contact.css',
 'account/index.html','account/create.html','account/sign-in.html','account/settings.html','account/verify-email.html','account/forgot-password.html',
 'account/account.css','account/config.js','account/service.js','account/validation.js','account/nav.js','account/ui.js','account/vendor/firebase-auth.js',
 'assets/hero-frameless.jpg','assets/road-trip-arcade.jpg','assets/rta-icon.png','assets/siren-mascot.png','assets/brand/google-g.svg','assets/brand/icon-16.png','assets/brand/icon-32.png','assets/brand/icon-48.png','assets/brand/icon-192.png','assets/brand/icon-512.png',
 'assets/rta/game-selection.webp','assets/rta/music-wheel.webp','assets/rta/scavenger-hunt.webp','assets/rta/license-plate-hunt.webp','assets/rta/state-information.webp',
 'assets/rta/game-selection.png','assets/rta/music-wheel.png','assets/rta/scavenger-hunt.png','assets/rta/license-plate-hunt.png','assets/rta/state-information.png',
 'developers/index.html','developers/proposal-guide.html','developers/resources.html','developers/tiers.html','developers/submit.html','developers/dashboard.html','developers/developer.css','developers/developer-prototype.js',
 'executive/index.html','executive/dashboard.js','executive/dashboard-data.js','executive/dashboard-data-contract.md'
];
function build(){
 const folder=fs.mkdtempSync(path.join(root,'work','overhaul-018-')),pub=path.join(folder,'public');fs.mkdirSync(pub,{recursive:true});
 for(const rel of files){const src=path.join(root,rel);if(!fs.existsSync(src)||!fs.statSync(src).isFile())throw Error('Missing explicit preview input: '+rel);const dest=path.join(pub,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);}
 const policyFolder=require('./prepare-privacy-review-017.cjs').build(),policyPub=path.join(policyFolder,'public');
 for(const rel of ['privacy.html','games/road-trip-arcade-privacy.html','delete-account.html','legal/archive/privacy-2026-10-05.html']){const src=path.join(policyPub,rel),dest=path.join(pub,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);}
 fs.copyFileSync(path.join(root,'staging/sitemap-018-draft.xml'),path.join(pub,'sitemap-review.xml'));
 const manifest={status:'LOCAL PREVIEW ONLY — NOT A DEPLOYMENT PACKAGE',routes:['/','/about.html','/studio.html','/games/road-trip-arcade.html','/privacy.html','/games/road-trip-arcade-privacy.html','/delete-account.html','/legal/archive/privacy-2026-10-05.html','/terms.html','/developers/index.html','/developers/proposal-guide.html','/developers/resources.html','/developers/tiers.html','/developers/submit.html','/developers/dashboard.html','/executive/index.html'],excluded:['functions','firebase config','contracts','audit','drafts','tokens','private work artifacts'],privacyReviewNoindex:true,developerAndExecutiveRoutesNotInProductionSitemap:true,files:{}};
 const walk=dir=>{for(const name of fs.readdirSync(dir)){const full=path.join(dir,name),rel=path.relative(pub,full).replaceAll('\\','/');if(fs.statSync(full).isDirectory())walk(full);else{const b=fs.readFileSync(full);manifest.files[rel]={bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')};}}};walk(pub);fs.writeFileSync(path.join(folder,'preview-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return{folder,pub,manifest};
}
function serve(){const{pub,manifest}=build(),types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.json':'application/json','.md':'text/markdown; charset=utf-8','.xml':'application/xml; charset=utf-8'};
 http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400).end();return;}if(pathname==='/')pathname='/index.html';const target=path.resolve(pub,'.'+pathname);if(!target.startsWith(pub+path.sep)){res.writeHead(403).end('Forbidden');return;}let stat;try{stat=fs.statSync(target);}catch{res.writeHead(404).end('Not found');return;}if(!stat.isFile()){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});fs.createReadStream(target).pipe(res);}).listen(18768,'127.0.0.1',()=>console.log(JSON.stringify({preview:'http://127.0.0.1:18768/',routes:manifest.routes,artifact:pub,localOnly:true})));}
module.exports={build,serve};if(require.main===module)serve();
