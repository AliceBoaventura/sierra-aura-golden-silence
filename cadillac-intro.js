/* RC30: abertura original preservada; interação segura e sem observer recursivo. */
(()=>{'use strict';
const overlay=document.getElementById('overlay'),start=document.getElementById('start');
if(!overlay||!start)return;
const caption='INICIAR JOGO';
function syncCaption(){if(!start.disabled&&typeof ready!=='undefined'&&ready&&start.textContent!==caption)start.textContent=caption;}
const observer=new MutationObserver(syncCaption);
observer.observe(start,{attributes:true,attributeFilter:['disabled']});
syncCaption();
let starting=false;
function activate(e){
 if(starting||!['ready','title'].includes(state.mode)||overlay.classList.contains('hidden')||start.disabled)return;
 // Let focused CONTINUAR / FASES buttons receive their native Enter/Space
 // activation. Preventing the key before checking the target made the saved
 // game inaccessible from the keyboard on the cinematic title.
 if(e.target&&e.target.closest&&e.target.closest('button:not(#start),details,input,textarea,select'))return;
 if(e.type==='keydown'){
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||['Tab','Shift','Control','Alt','Meta','Escape','CapsLock'].includes(e.key))return;
  e.preventDefault();
 }
 starting=true;start.click();
 window.setTimeout(()=>{starting=false;},1200);
}
window.addEventListener('keydown',activate,true);
overlay.addEventListener('pointerdown',e=>{if(e.target!==start)activate(e);});
})();
