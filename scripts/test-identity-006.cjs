const {spawnSync}=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'..'),env={...process.env,FUNCTIONS_EMULATOR:'true',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:19099',FIREBASE_DATABASE_EMULATOR_HOST:'127.0.0.1:19000'};
for(const file of ['tests/identity-resolver.test.js','tests/identity-resolver.emulator.mjs']){const result=spawnSync(process.execPath,['--test','--test-timeout=60000',file],{cwd:root,env,stdio:'inherit',timeout:90000});if(result.error||result.status!==0)process.exit(result.status||1);}
