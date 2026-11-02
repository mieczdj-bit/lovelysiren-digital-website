import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {randomBytes,randomUUID} from 'node:crypto';
import {createSubmission,createContactHandler} from '../functions/src/contact/submission.js';import {createContactStore} from '../functions/src/contact/store.js';import {createLocalAdapters} from '../functions/src/contact/adapters.js';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function startPreview({port=18771,namespace='contactPreview011',secret,adapters,limits}={}){
 if(process.versions.node.split('.')[0]!=='22')throw Error('Use isolated Node22');
 for(const [key,value]of Object.entries({FUNCTIONS_EMULATOR:'true',FIREBASE_DATABASE_EMULATOR_HOST:'127.0.0.1:19000'})){process.env[key]??=value;if(process.env[key]!==value)throw Error('Only guarded demo emulator permitted');}
 if(!/^(contactPreview011|contactTest011\/[a-z0-9-]+)$/.test(namespace))throw Error('Unexpected local namespace');
 const require=createRequire(new URL('../functions/package.json',import.meta.url)),{initializeApp,deleteApp}=require('firebase-admin/app'),{getDatabase}=require('firebase-admin/database');
 const projectId='demo-road-trip-arcade',app=initializeApp({projectId,databaseURL:`https://${projectId}-default-rtdb.firebaseio.com`},'contact011_'+randomUUID()),db=getDatabase(app),ref=db.ref(namespace);
 if(!secret){const folder=path.join(root,'work/contact-011');fs.mkdirSync(folder,{recursive:true});const keyfile=path.join(folder,'local-hash-key.txt');if(!fs.existsSync(keyfile))fs.writeFileSync(keyfile,randomBytes(32).toString('hex'),{flag:'wx'});secret=fs.readFileSync(keyfile,'utf8');}
 const local=adapters||createLocalAdapters({projectId,dbHost:process.env.FIREBASE_DATABASE_EMULATOR_HOST}),store=createContactStore(ref,limits);let base;
 const submit=createSubmission({store,verifyBot:local.verifyBot,deliver:local.deliver,from:'support@lovelysirendigital.com',secret});
 const files=new Set(JSON.parse(fs.readFileSync(path.join(root,'staging/account-007-static-allowlist.json'))).files);
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');const url=new URL(req.url,base);
  if(url.pathname==='/api/contact'){
   let size=0,chunks=[];try{for await(const chunk of req){size+=chunk.length;if(size<=32768)chunks.push(chunk);}}catch{res.end();return;}if(size>32768){res.writeHead(400,{'Content-Type':'application/json'}).end('{"error":"invalid-input"}');return;}
   let body;try{body=chunks.length?JSON.parse(Buffer.concat(chunks)):{};}catch{res.writeHead(400,{'Content-Type':'application/json'}).end('{"error":"invalid-input"}');return;}
   const response={set:(k,v)=>res.setHeader(k,v),status(n){res.statusCode=n;return this;},json(value){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));},send:()=>res.end()};
   const localHandler=createContactHandler({submit,enabled:()=>true,origins:[base]});
   await localHandler({method:req.method,path:'/submit',body,rawBody:Buffer.concat(chunks),ip:req.socket.remoteAddress,get:k=>req.headers[k.toLowerCase()],is:kind=>kind==='application/json'&&req.headers['content-type']?.split(';')[0]==='application/json'},response);return;
  }
  if(url.pathname==='/support/config.js'){res.setHeader('Content-Type','text/javascript');res.end('export const contactConfig='+JSON.stringify({enabled:true,endpoint:base+'/api/contact',localMock:true})+';');return;}
  let file;try{file=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';}catch{res.writeHead(400).end();return;}
  if(!files.has(file)){res.writeHead(404).end();return;}const target=path.join(root,file);if(fs.realpathSync(target)!==target){res.writeHead(403).end();return;}
  res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.ico':'image/x-icon'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(target));
 });
 server.requestTimeout=10000;server.headersTimeout=10000;server.maxHeadersCount=32;
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});base='http://127.0.0.1:'+server.address().port;
 return{base,ref,db,adapters:local,submit,store,async close({erase=false}={}){await new Promise(r=>server.close(r));if(erase&&namespace.startsWith('contactTest011/'))await ref.remove();await deleteApp(app);}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const preview=await startPreview();console.log('Local MOCK delivery only (no email sent): '+preview.base+'/support.html');}
