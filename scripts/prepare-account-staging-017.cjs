// Produces ignored local-only Hosting + isolated database staging configuration.
// No Firebase services are created and no deployment is performed.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function build(){
 const folder=require('./prepare-account-candidate-014.cjs').build();
 const root=path.resolve(__dirname,'..');
 const hosting={public:'public',ignore:['firebase.account-017.json','.*','**/.*','**/node_modules/**','**/*.map'],headers:[{source:'**',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'X-Content-Type-Options',value:'nosniff'}]}]};
 const config={functions:[{source:'functions-account',codebase:'lovelysiren-account-first-launch-014',ignore:['node_modules','.git','.env*','*.log']}],database:[{target:'account-staging',rules:'account-database-staging.review.rules.json'}],hosting:[{target:'account-staging',...hosting}]};
 const denyRules={rules:{'.read':false,'.write':false}};
 const rollbackConfig={database:[{target:'account-staging',rules:'account-database-staging.deny-all.rollback.json'}]};
 const controls={status:'review-only-inactive',hosting:{siteId:null,publicAccess:'noindex review preview only'},account:{enabled:false,registrationEnabled:false,googleEnabled:false,linkingEnabled:false,identityResolverEnabled:false,marketingEnabled:false,contactDeliveryEnabled:false,deletionEnabled:false,backendApiEnabled:false},policies:{terms:{version:'website-terms-v1.0',published:true},privacy:{version:null,published:false,approved:false}},database:{instanceId:null,isolated:true,defaultRtaRulesUntouched:true}};
 for(const [name,obj]of Object.entries({'firebase.account-017.json':config,'account-database-staging.deny-all.rollback.json':denyRules,'firebase.account-017.rollback.json':rollbackConfig,'account-017-controls.review.json':controls}))fs.writeFileSync(path.join(folder,name),JSON.stringify(obj,null,2)+'\n');
 const manifest={status:'LOCAL REVIEW ONLY — NOT DEPLOYABLE; NO CLOUD RESOURCES CREATED',base:'Pass 016',targets:{hosting:'account-staging (unbound)',database:'account-staging (unbound)'},functions:['lovelysirenAccounts014Api'],activation:controls,rollback:{database:'deny-all rules lock the isolated account DB; does not erase data',hosting:'clone a previously reviewed Hosting version to the review channel',functions:'redeploy the reviewed artifact with gates disabled'},files:{}};
 for(const name of ['firebase.account-017.json','account-database-staging.deny-all.rollback.json','firebase.account-017.rollback.json','account-017-controls.review.json']){const bytes=fs.readFileSync(path.join(folder,name));manifest.files[name]={bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
 fs.writeFileSync(path.join(folder,'account-staging-017-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({artifact:folder,hostingTarget:'unbound account-staging',databaseTarget:'unbound account-staging',activation:'off',cloudChanges:false}));return folder;
}
module.exports={build};if(require.main===module)build();
