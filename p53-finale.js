/* Sierra & Aura: Golden Silence · four-shot epilogue, editorial + direction pass.
 * Narrative only. The canonical sacrifice, consent flags, saves and credits
 * belong to the existing campaign. No auto-advance or new timers. */
(()=>{'use strict';
const beats=[
 {tag:'01 / NEO ROCKFORD',title:'A cidade seguiu.',text:'Alexandra não voltou.',image:'artes-cinematicas/epilogo-cidade.webp',focus:'center 45%',tone:'city'},
 {tag:'02 / ALEXANDRA',title:'Ela segurou a porta.',text:'Não teve tempo de sair.',image:'artes-cinematicas/epilogo-alexandra.webp',focus:'center 44%',tone:'alex'},
 {tag:'03 / JINX',title:'A chamada perdida.',text:'O telefone nunca mais tocou.',image:'artes-cinematicas/epilogo-jinx.webp',focus:'center 52%',tone:'jinx'},
 {tag:'04 / SIERRA & AURA',title:'Ainda estamos aqui.',text:'A escolha é sua.',image:'artes-cinematicas/epilogo-terraco.webp',focus:'center 47%',tone:'aura'}
];
function endingText(){
 const h=window.StoryContinuity?.history?.()||{};
 return h.loveLine==='intervene'?'Posso pedir que você fique. Não decidir por você.'
 :h.loveLine==='freedom'?'Seu caminho é seu. Eu escolho ficar perto.'
 :h.loveLine==='together'?'Vamos tentar juntas. Sem prometer o impossível.'
 :'Eu te amo. A escolha continua sendo sua.';
}
function open(){
 const host=document.getElementById('interludeCurtain');
 if(!host||host.querySelector('.p53-finale'))return false;
 let n=0;
 const stage=document.createElement('section');stage.className='p53-finale';stage.setAttribute('aria-label','Epílogo cinematográfico');stage.tabIndex=-1;
 const picture=document.createElement('div');picture.className='p53-finale-picture';
 const art=document.createElement('img');art.alt='';art.decoding='async';picture.appendChild(art);
 const visual=document.createElement('div');visual.className='p53-finale-visual';visual.setAttribute('aria-hidden','true');picture.appendChild(visual);
 const content=document.createElement('div');content.className='p53-finale-content';
 const preface=document.createElement('span');preface.className='p53-finale-preface';preface.textContent='GOLDEN SILENCE / ÚLTIMO SINAL';
 const tag=document.createElement('small');tag.className='p53-finale-tag';
 const title=document.createElement('h2');
 const line=document.createElement('p');line.className='p53-finale-line';line.setAttribute('aria-live','polite');
 const progression=document.createElement('div');progression.className='p53-finale-progression';progression.setAttribute('role','group');progression.setAttribute('aria-label','Cenas do epílogo');
 const markers=beats.map((b,i)=>{const dot=document.createElement('span');dot.className='p53-finale-marker';dot.setAttribute('aria-label',`Cena ${i+1} de ${beats.length}`);progression.appendChild(dot);return dot;});
 const nav=document.createElement('div');nav.className='p53-finale-nav';
 const previous=document.createElement('button');previous.type='button';previous.className='p53-finale-back';previous.textContent='CENA ANTERIOR';
 const next=document.createElement('button');next.type='button';next.className='p53-finale-next';
 const skip=document.createElement('button');skip.type='button';skip.className='p53-finale-skip';skip.textContent='IR PARA OS CRÉDITOS';
 nav.append(previous,next,skip);content.append(preface,tag,title,line,progression,nav);stage.append(picture,content);host.prepend(stage);
 const headline=host.querySelector('.demo-final-title');if(headline)headline.hidden=true;
 const actions=host.querySelector('.demo-final-actions');if(actions)actions.hidden=true;
 const close=()=>{stage.remove();if(headline)headline.hidden=false;if(actions)actions.hidden=false;actions?.querySelector('button')?.focus();};
 const show=()=>{
  const beat=beats[n];stage.dataset.shot=String(n+1);stage.dataset.tone=beat.tone;
  tag.textContent=beat.tag;title.textContent=beat.title;line.textContent=n===3?endingText():beat.text;
  // Use an image per beat, never a generated stock photograph. Previous and next
  // only change the presentation, not story flags or campaign progress.
  art.style.visibility='hidden';art.style.objectPosition=beat.focus;
  art.onload=()=>{art.style.visibility='visible'};
  art.onerror=()=>{art.style.visibility='hidden';picture.classList.add('p53-finale-missing-art')};
  art.src=beat.image;
  picture.classList.remove('p53-finale-missing-art');
  previous.disabled=n===0;next.textContent=n===beats.length-1?'VER CRÉDITOS':'PRÓXIMA CENA';
  markers.forEach((m,i)=>{m.classList.toggle('active',i===n);m.classList.toggle('visited',i<n);m.setAttribute('aria-current',i===n?'step':'false');});
  // Re-run per-scene entrance animation without affecting reduced-motion settings.
  content.classList.remove('p53-finale-show');void content.offsetWidth;content.classList.add('p53-finale-show');
 };
 previous.addEventListener('click',()=>{if(n>0){n--;show();}});
 next.addEventListener('click',()=>{if(n===beats.length-1){close();return;}n++;show();});
 skip.addEventListener('click',close);
 stage.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();close();}
  else if(e.key==='ArrowLeft'&&n>0){e.preventDefault();previous.click();}
  else if(e.key==='ArrowRight'){e.preventDefault();next.click();}
  else if((e.key==='Enter'||e.key===' ')&&e.target===stage){e.preventDefault();next.click();}
 });
 show();next.focus();return true;
}
window.P53Finale=Object.freeze({open,beats,endingText});
})();
