const form=document.querySelector('#proposal-form');
form?.addEventListener('submit',event=>{
 event.preventDefault();
 const status=document.querySelector('#proposal-status');
 if(!form.reportValidity())return;
 const firstPlatform=form.querySelector('[name="platform"]:checked');
 if(!firstPlatform){status.textContent='Choose at least one intended platform. Nothing was sent or saved.';form.querySelector('[name="platform"]').focus();return;}
 status.textContent='Prototype validation complete. Nothing was submitted, uploaded, sent, or saved. The entered fields have been cleared.';
 form.reset();
 status.focus();
});
