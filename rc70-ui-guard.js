/* RC70: synchronize radio clearance to the real rendered HUD height. */
(()=>{'use strict';
 const game=document.getElementById('game');
 const hud=game?.querySelector(':scope > .hud');
 if(!hud)return;
 let pending=false;
 function update(){
  pending=false;
  const top=game.getBoundingClientRect().top;
  const height=Math.max(0,Math.ceil(hud.getBoundingClientRect().bottom-top));
  const next=Math.min(240,height+1)+'px';
  if(game.style.getPropertyValue('--rc70-hud-bottom')!==next)
   game.style.setProperty('--rc70-hud-bottom',next);
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(update);}
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(hud);
 window.addEventListener('resize',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 document.fonts?.ready.then(schedule,()=>{});
 schedule();
})();
