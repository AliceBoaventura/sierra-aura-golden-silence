'use strict';
/* Cinematic chapter cards only on campaign transitions. No chapter mechanics changed. */
(function(root){
 const chapters={
  1:['CHAPTER 01','O ÚLTIMO SINAL','Um erro no sistema. Uma pessoa do outro lado.'],
  2:['CHAPTER 02','SILÊNCIO DOURADO','A confiança começa onde o acesso termina.'],
  3:['CHAPTER 03','ENLACE','Entrar é fácil. Sair sem entregar ninguém, não.'],
  4:['CHAPTER 04','ENTRE AS ESTRELAS','Amar alguém não é decidir por ela.'],
  5:['CHAPTER 05','ZONA CEGA','O original não pode cair nas mãos erradas.'],
  6:['CHAPTER 06','GHOST TRACK','Uma ausência não é uma explicação.'],
  7:['CHAPTER 07','47 MINUTOS','O monitor registra. Quem responde pelo que aconteceu?'],
  8:['INTERLUDE','CAFÉ ÀS 02:17','O silêncio também deixa provas.']
 };
 let active=false,serial=0;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const el=document.createElement('div');el.id='chapterCurtain';el.setAttribute('role','status');el.setAttribute('aria-live','off');el.setAttribute('aria-label','Transição de capítulo');el.innerHTML='<div class="cc-content"><p class="cc-overline">SIERRA & AURA · GOLDEN SILENCE</p><h2 class="cc-heading"></h2><div class="cc-rule"></div><p class="cc-subtitle"></p><p class="cc-thesis"></p></div><div class="cc-footer">NEO ROCKFORD / DISTRITO 07</div>';
 document.body.appendChild(el);
 const title=el.querySelector('.cc-heading'),subtitle=el.querySelector('.cc-subtitle'),thesis=el.querySelector('.cc-thesis');
 async function to(chapter,enter){
  if(typeof enter!=='function'||!chapters[chapter]||active)return false;
  active=true;const id=++serial;
  const [headline,sub,idea]=chapters[chapter];title.textContent=headline;subtitle.textContent=sub;thesis.textContent=idea;title.classList.toggle('cc-interlude',chapter===8);
  el.classList.remove('cc-title');el.classList.add('cc-active');
  try{
   await wait(600);if(id!==serial)return false;
   // Enter the next scene while the display is fully black.
   enter();
   await wait(140);if(id!==serial)return false;
   el.classList.add('cc-title');
   await wait(1750);if(id!==serial)return false;
   el.classList.remove('cc-title');
   await wait(240);if(id!==serial)return false;
   el.classList.remove('cc-active');
   await wait(620);
   return true;
  }catch(error){console.error('Chapter curtain failed:',error);return false;}
  finally{if(id===serial){active=false;el.classList.remove('cc-active','cc-title');}}
 }
 root.ChapterCurtain={to,get active(){return active;},chapters};
})(window);
