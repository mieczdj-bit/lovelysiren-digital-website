const http=require('http');const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');const base='http://127.0.0.1:18766';
const config={enabled:true,registrationEnabled:true,registrationMode:'controlled-test',googleEnabled:false,firebase:{projectId:'demo-road-trip-arcade',apiKey:'local-emulator-only',authDomain:'demo-road-trip-arcade.firebaseapp.com',appId:'local-emulator-app'},backendBaseUrl:'http://127.0.0.1:19501/demo-road-trip-arcade/us-central1/lovelysirenAccountsApi/',allowedOrigins:[base],emailContinueUrl:base+'/account/verify-email.html',emulators:{enabled:true},policies:{termsUrl:base+'/drafts/emulator-policy-fixture.html',termsVersion:'emulator-terms-v1',privacyUrl:base+'/drafts/emulator-policy-fixture.html',privacyVersion:'emulator-privacy-v1',approved:true},eligibilityApproved:true,resendCooldownSeconds:60};
http.createServer((req,res)=>{res.setHeader('Cache-Control','no-store');
 if(req.url.split('?')[0]==='/account/config.js'){res.setHeader('Content-Type','text/javascript');res.end('export const accountConfig = '+JSON.stringify(config)+';');return;}
 const segment=req.url.split('?')[0].split('/').filter(Boolean)[0]||'';if(segment.startsWith('.')||['work','functions','node_modules','scripts','tests','backend-contract'].includes(segment)){res.writeHead(403).end();return;}
 let target;try{target=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));}catch{res.writeHead(400).end();return;}
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');if(!fs.existsSync(target)){res.writeHead(404).end();return;}
 const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.webmanifest':'application/manifest+json'}[path.extname(target)]||'text/plain';res.setHeader('Content-Type',type);res.end(fs.readFileSync(target));
}).listen(18766,'127.0.0.1',()=>console.log('Local Firebase emulator preview: '+base+'/account/create.html (not real Firebase accounts or email)'));
