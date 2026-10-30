// No cloud calls. Build a unique ignored review artifact; never upload it.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const root=path.resolve(__dirname,'..');
function safePublicPath(file){return typeof file==='string'&&!file.includes('\\')&&!file.split('/').some(p=>!p||p==='..'||p.startsWith('.'))&&!/^(work|audit|drafts|staging|functions|scripts|tests|contracts|node_modules|firebase)\//.test(file)&&!/\.(env|log|map)$/.test(file)&&file!=='legal/policy-versions.json';}
function build(){const spec=JSON.parse(fs.readFileSync(path.join(root,'staging/account-007-static-allowlist.json'))),aliases=spec.aliases||[],entries=[...spec.files.map(file=>({file,source:file})),...aliases];if(spec.status!=='review-only-inactive'||new Set(entries.map(e=>e.file)).size!==entries.length||entries.some(e=>!safePublicPath(e.file)||!spec.files.includes(e.source)))throw Error('Unsafe public allowlist');
 const base=path.join(root,'work');fs.mkdirSync(base,{recursive:true});const dest=fs.mkdtempSync(path.join(base,'staging-007-')),publicDir=path.join(dest,'public');fs.mkdirSync(publicDir);const manifest=[];
 for(const {file,source} of entries){const src=path.join(root,source);if(fs.realpathSync(src)!==src||!fs.statSync(src).isFile())throw Error('Public inputs must be ordinary files: '+source);const bytes=fs.readFileSync(src),out=path.join(publicDir,file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);manifest.push({file,source,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});}
 // Account-only deployment discovery package: eliminate the private identity export entirely.
 const input=fs.readFileSync(path.join(root,'functions/src/index.js'),'utf8');
 const start=input.indexOf('let identityCallers;'),end=input.indexOf('const anonymous=',start);
 if(start<0||end<start)throw Error('Unexpected function entry layout; review extraction');
 let entry=(input.slice(0,start)+input.slice(end)).replace(/^import .* from '\.\/identity(?:-service-auth)?\.js';\r?\n/gm,'');
 if(entry.includes('identity')||!entry.includes('export const lovelysirenAccountsApi='))throw Error('Account-only export isolation failed');
 // Candidate runtime identity only; this account does not yet exist and has no grants.
 const options="onRequest({region:'us-central1',maxInstances:2";
 if(!entry.includes(options))throw Error('Function options changed; review runtime binding');
 entry=entry.replace(options,"onRequest({region:'us-central1',serviceAccount:'lovelysiren-accounts-test@road-trip-arcade.iam.gserviceaccount.com',minInstances:0,maxInstances:2");
 const backend=path.join(dest,'functions-account');fs.mkdirSync(path.join(backend,'src'),{recursive:true});fs.writeFileSync(path.join(backend,'src/index.js'),entry);
 for(const file of ['src/accounts.js','src/lifecycle.js','src/maintenance.js','package.json','package-lock.json'])fs.copyFileSync(path.join(root,'functions',file),path.join(backend,file));
 fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify({status:'LOCAL REVIEW ONLY — NOT DEPLOYED',publicFiles:manifest,backendExports:['lovelysirenAccountsApi'],identityExportAbsent:true,activation:false},null,2)+'\n');
 console.log(JSON.stringify({artifact:dest,publicFiles:manifest.length,backendExports:['lovelysirenAccountsApi'],activation:false}));return dest;
}
module.exports={safePublicPath,build};if(require.main===module)build();
