import { accountService } from './service.js';
import { friendlyError } from './validation.js';
const menu=document.querySelector('.account-list');
const summary=document.querySelector('.account>summary');
if(menu && summary){
 const signedOutContent=[...menu.childNodes].map(node=>node.cloneNode(true));
 const originalLabel=summary.getAttribute('aria-label');
 const signInLabel=summary.children[1];
 const avatar=summary.querySelector('.profile');
 const base=new URL('./',import.meta.url);
 const addLink=(text,path)=>{const link=document.createElement('a');link.textContent=text;link.href=new URL(path,base).href;menu.append(link);};
 accountService.subscribe(state=>{
  if(!state.user){menu.replaceChildren(...signedOutContent.map(node=>node.cloneNode(true)));if(signInLabel)signInLabel.textContent='Sign In';if(avatar)avatar.textContent='♟';summary.setAttribute('aria-label',originalLabel||'Sign-in options');return;}
  const name=state.profile?.displayName || state.user.displayName || 'Your Account';
  if(signInLabel)signInLabel.textContent=[...name].slice(0,24).join('');
  if(avatar)avatar.textContent=Array.from(name.trim())[0]?.toUpperCase()||'A';
  summary.setAttribute('aria-label','Account options');menu.replaceChildren();
  addLink('Manage Account','index.html');
  if(state.status==='authenticated')addLink('Account Settings','settings.html');
  else if(state.status==='verification-pending')addLink('Verify Email','verify-email.html');
  else{const note=document.createElement('p');note.textContent='Account setup is not complete.';menu.append(note);}
  const signout=document.createElement('button');signout.type='button';signout.className='account-menu-signout';signout.textContent='Sign Out';
  signout.addEventListener('click',async()=>{signout.disabled=true;try{await accountService.signOut();}catch(error){signout.disabled=false;const note=document.createElement('p');note.setAttribute('role','alert');note.textContent=friendlyError(error);menu.append(note);}});menu.append(signout);
 });
 // Loading disabled account configuration performs no network requests or SDK initialization.
 accountService.init().catch(()=>{});
}
