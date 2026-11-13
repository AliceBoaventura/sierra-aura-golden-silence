/* RC29 - camada visual não destrutiva, sem alterar lógica narrativa. */
(()=>{'use strict';
 const root=document.getElementById('game');if(!root)return;
 const sceneNames={'-1':'prologo','0':'distrito','1':'distrito','2':'apartamento','3':'enlace','4':'terraco','5':'zona-cega','6':'ghost-track','7':'intervalo','8':'cafe'};
 let current='',lastUpdate=0;
 function update(now){
  if(now-lastUpdate>180){lastUpdate=now;
   try{const chapter=typeof state!=='undefined'?state.chapter:0;
    const scene=sceneNames[String(chapter)]||'distrito';
    if(scene!==current){if(current)root.classList.remove('rc29-'+current);root.classList.add('rc29-'+scene);root.dataset.scene=scene;current=scene;}
    root.classList.toggle('rc29-paused',typeof state!=='undefined'&&state.mode==='paused');
   }catch(e){/* A camada de polimento nunca pode interromper o jogo. */}
  }

 }
 globalThis.ScenePolish={update};
 const overlay=document.getElementById('overlay');const start=document.getElementById('start');
 if(overlay&&start){
  const status=document.createElement('div');status.className='rc29-intro-status';status.setAttribute('aria-hidden','true');
  status.textContent='NEO ROCKFORD  /  SINAL INSTÁVEL';overlay.appendChild(status);
  const scene=document.createElement('div');scene.className='rc29-intro-light';scene.setAttribute('aria-hidden','true');overlay.appendChild(scene);
  // O botão original permanece o único controle da abertura.
  const observer=new MutationObserver(()=>{const active=!overlay.classList.contains('hidden')&&!!document.getElementById('cadillacWeather');status.hidden=!active;scene.hidden=!active;});
  observer.observe(overlay,{attributes:true,childList:true,attributeFilter:['class']});
 }
})();
