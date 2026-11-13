/* P12: illustrations are separate from the animated gameplay sprite atlases.
   The viewer never modifies narrative flags, dialogue branches or save data. */
(()=>{
 'use strict';
 const gallery=[
  {id:'alexandra',title:'47 Minutos · Alexandra',src:'artes-cinematicas/alexandra-despedida.png'},
  {id:'chuva',title:'Interlúdio · A despedida',src:'artes-cinematicas/jinx-chuva.png'},
  {id:'sierra-aura',title:'Sierra e Aura · Estudo de personagens',src:'artes-cinematicas/sierra-aura-prancha.png'},
  {id:'jinx-alexandra',title:'Jinx e Alexandra · Estudo de personagens',src:'artes-cinematicas/jinx-alexandra-prancha.png'}
 ];
 const seen=new Set();
 const root=document.createElement('section');root.id='neoArtViewer';root.className='neo-art-viewer';root.hidden=true;
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Ilustrações cinematográficas');
 root.innerHTML='<div class="neo-art-inner"><div class="neo-art-top"><strong id="neoArtTitle"></strong><button id="neoArtClose" type="button" aria-label="Fechar ilustração">VOLTAR AO JOGO ×</button></div><img id="neoArtImage" alt="Ilustração cinematográfica do jogo"><div class="neo-art-bottom"><button id="neoArtPrev" type="button">◀ ANTERIOR</button><span id="neoArtCounter"></span><button id="neoArtNext" type="button">PRÓXIMA ▶</button></div></div>';
 document.body.appendChild(root);
 const image=root.querySelector('#neoArtImage');let index=0,lastFocus=null;
 function render(){const entry=gallery[index];root.querySelector('#neoArtTitle').textContent=entry.title;image.src=entry.src;image.alt=entry.title;root.querySelector('#neoArtCounter').textContent=(index+1)+' / '+gallery.length;}
 function close(){root.hidden=true;document.body.classList.remove('neo-art-open');image.removeAttribute('src');lastFocus?.focus?.();}
 function show(id){index=Math.max(0,gallery.findIndex(a=>a.id===id));lastFocus=document.activeElement;render();root.hidden=false;document.body.classList.add('neo-art-open');root.querySelector('#neoArtClose').focus();}
 function showOnce(id){if(seen.has(id))return;seen.add(id);show(id);}
 root.querySelector('#neoArtClose').addEventListener('click',close);
 root.querySelector('#neoArtPrev').addEventListener('click',()=>{index=(index+gallery.length-1)%gallery.length;render();});
 root.querySelector('#neoArtNext').addEventListener('click',()=>{index=(index+1)%gallery.length;render();});
 root.addEventListener('click',e=>{if(e.target===root)close();});
 document.addEventListener('keydown',e=>{if(root.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopImmediatePropagation();index=(index+(e.key==='ArrowLeft'?-1:1)+gallery.length)%gallery.length;render();}},true);
 const menu=document.querySelector('.hud .menu');if(menu){const button=document.createElement('button');button.id='neoArtGallery';button.type='button';button.textContent='ARTES';button.title='Ver ilustrações da história';button.addEventListener('click',()=>show('sierra-aura'));menu.appendChild(button);}
 window.NeoCinematicArt={show,showOnce};
})();
