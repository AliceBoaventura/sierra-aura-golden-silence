/* RC70: title actions remain in a fixed DOM group; only state changes. */
(()=>{'use strict';
 const overlay=document.getElementById('overlay');
 const start=document.getElementById('start');
 const actions=overlay?.querySelector('.panel > .title-actions');
 const boot=document.getElementById('bootStatus');
 const retry=document.getElementById('bootRetry');
 if(!overlay||!start||!actions||!boot||!retry)return;
 function sync(){
  const loading=start.disabled;
  const state=loading?'loading':'ready';
  if(overlay.dataset.bootState!==state)overlay.dataset.bootState=state;
  overlay.setAttribute('aria-busy',String(loading&&!overlay.classList.contains('hidden')));
  actions.inert=loading;
  actions.setAttribute('aria-hidden',String(loading));
  boot.setAttribute('aria-hidden',String(!loading));
  if(!loading||overlay.classList.contains('hidden'))retry.hidden=true;
 }
 retry.addEventListener('click',()=>location.reload());
 const changes=new MutationObserver(sync);
 changes.observe(start,{attributes:true,attributeFilter:['disabled']});
 changes.observe(overlay,{attributes:true,attributeFilter:['class']});
 sync();
 // Give slow assets a visible recovery control; do not reveal it after readiness.
 window.setTimeout(()=>{
  if(start.disabled&&!overlay.classList.contains('hidden'))retry.hidden=false;
 },18000);
})();
