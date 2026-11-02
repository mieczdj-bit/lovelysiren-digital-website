import {onRequest} from 'firebase-functions/v2/https';
import {createContactHandler} from './contact/submission.js';
// Activation requires a separately reviewed dedicated runtime, provider, bot
// verifier, secret and private store. No implicit account Admin app or credentials.
export const lovelysirenContactApi=onRequest({region:'us-central1',maxInstances:2,timeoutSeconds:30,memory:'256MiB'},createContactHandler({enabled:()=>false}));
