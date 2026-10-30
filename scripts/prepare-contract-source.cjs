// Extract only pinned, hash-checked source into ignored work/. Never switch the RTA checkout.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),lock=require('../contracts/rta-source-lock.json');
const repo=process.env.RTA_SOURCE_REPO;if(!repo)throw Error('Set RTA_SOURCE_REPO to an existing RTA git checkout');
for(const item of lock.files){const bytes=execFileSync('git',['show',`${lock.commit}:${item.file}`],{cwd:repo,maxBuffer:8e6});if(crypto.createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw Error('Source hash mismatch: '+item.file);const target=path.join(root,'work/rta-rt038b-source',item.file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
console.log(`Verified ${lock.files.length} pinned files at ${lock.commit}`);
