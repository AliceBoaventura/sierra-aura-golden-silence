/* P57: relocate existing journal controls, do not clone them or replace handlers. */
(()=>{'use strict';
 function init(){
  const menu=document.querySelector('#game>.hud .menu');
  if(!menu)return;
  for(const id of ['ghostJournal','intervalJournal']){
   const button=document.getElementById(id);
   if(button&&button.parentElement!==menu){
    menu.appendChild(button);
    button.setAttribute('aria-label',id==='ghostJournal'?'Abrir caderno da investigação':'Abrir registros da investigação');
    button.title=id==='ghostJournal'?'Caderno (J)':'Registros (J)';
    button.textContent=id==='ghostJournal'?'CADERNO':'REGISTROS';
   }
  }
  // The objective itself reveals the existing INFO details on touch.
  const mission=document.querySelector('#game>.hud .mission');
  if(mission&&!mission.dataset.p57){
   mission.dataset.p57='1';mission.setAttribute('role','button');mission.tabIndex=0;
   mission.setAttribute('aria-label','Mostrar informações adicionais da missão');
   const show=()=>document.getElementById('hudDetails')?.click();
   mission.addEventListener('click',show);
   mission.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show();}});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
