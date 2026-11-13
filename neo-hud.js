/* Context stays visible; secondary readouts are available on demand. */
(()=>{
 let details=false;
 window.NeoHUD={update(){
  const root=document.getElementById('game'),hint=document.getElementById('hint'),radio=document.getElementById('radio');
  if(!root||!hint||!radio)return;
  let toggle=document.getElementById('hudDetails');
  if(!toggle){
   const menu=root.querySelector('.menu');if(!menu)return;
   toggle=document.createElement('button');toggle.id='hudDetails';toggle.type='button';toggle.textContent='INFO';
   toggle.setAttribute('aria-label','Mostrar ou recolher informações e controles');toggle.setAttribute('aria-expanded','false');
   toggle.onclick=()=>{details=!details;toggle.setAttribute('aria-expanded',String(details));};menu.prepend(toggle);
  }
  // P46: scanner status is derived from the same runtime contract as input.
  const status=document.getElementById('scannerStatus');
  if(typeof state!=='undefined'){
   const profile=window.NeoRuntime?.scannerProfile?.(state)||(state.chapter===6?'echo':state.chapter===7&&state.avatar==='alex'?'interface':'battery');
   const energy=Math.round(Math.max(0,Math.min(100,Number.isFinite(state.energy)?state.energy:100)));
   const playing=state.mode==='playing';
   const mode=profile==='unavailable'?'unavailable':profile==='interface'?'interface':!playing?'waiting':state.scan?'active':profile==='battery'&&(state.scanLock||energy<(window.NeoRuntime?.scannerBalance?.minimum||12))?'charging':'ready';
   const label=profile==='unavailable'?'SCAN · INDISPONÍVEL':profile==='interface'?'INTERFACE LOCAL · SEM EMISSOR':profile==='echo'?(mode==='active'?'ECHO · ATIVO':'ECHO · PRONTO'):mode==='active'?'SCAN · ATIVO':mode==='charging'?'SCAN · RECARREGANDO':mode==='waiting'?'SCAN · EM ESPERA':'SCAN · PRONTO';
   if(status){status.textContent=label;status.dataset.mode=mode;status.title=profile==='echo'?'ECHO não consome bateria':profile==='interface'?'Alexandra usa apenas a interface local':profile==='battery'?'Segure Q ou toque SCAN. Ativa a partir de 12%.':'';}
   if(root.dataset){root.dataset.scanner=mode;root.dataset.scannerKind=profile;}
   root.classList.toggle('hud-scanner-visible',mode==='active'||mode==='charging'||mode==='interface');
   const bar=document.getElementById('energy');
   if(bar){if(bar.style)bar.style.width=profile==='battery'?energy+'%':'100%';bar.setAttribute('aria-label',profile==='battery'?`Bateria do scanner ${energy}%`:profile==='echo'?'ECHO sem consumo de bateria':profile==='interface'?'Interface local sem emissor':'Scanner indisponível');}
   // Single scanner readout: keep #energy and #scannerStatus in the main HUD.
   document.getElementById('p46ScannerReadout')?.remove();
  }
  root.classList.toggle('hud-compact',!details);
  root.classList.toggle('hud-danger',typeof state!=='undefined'&&(state.alarm>2||state.hp<3));
  const visible=getComputedStyle(radio).display!=='none'&&radio.textContent.trim().length>0;
  hint.style.visibility='';root.classList.toggle('radio-visible',visible);
 }};
})();
