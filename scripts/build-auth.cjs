const esbuild = require('esbuild');
esbuild.buildSync({entryPoints:['account/firebase-entry.js'],outfile:'account/vendor/firebase-auth.js',bundle:true,format:'esm',minify:true,target:['es2022'],legalComments:'eof'});
