/* Sierra & Aura RC37 | campaign-wide journal & accessibility polish.
 * No replacement engines, no remote dependencies, no automatic story skipping.
 */
(()=>{
 'use strict';
 const game=document.getElementById('game'),menu=game?.querySelector('.hud .menu');
 if(!game||!menu)return;
 const KEY='sierra-aura-session-journal-v37';
 let entries=[];try{const saved=JSON.parse(sessionStorage.getItem(KEY)||'[]');if(Array.isArray(saved))entries=saved.slice(-160);}catch{}
 const labels={'-1':'PRÓLOGO','1':'SIERRA CORE','2':'APARTAMENTO DE AURA','3':'ENLACE','4':'ENTRE AS ESTRELAS','5':'ZONA CEGA','6':'GHOST TRACK','7':'47 MINUTOS','8':'CAFÉ ÀS 02:17'};
 let lastLine='',lastChapter='',showing=false,wasPaused=false,lastFocus=null;
 const id=()=>{try{return Number.isInteger(state.chapter)?state.chapter:null;}catch{return null;}};
 const title=()=>labels[id()]||'NEO ROCKFORD';
 function save(){try{sessionStorage.setItem(KEY,JSON.stringify(entries.slice(-160)));}catch{}}
 function add(kind,who,line){
  line=String(line||'').replace(/\s+/g,' ').trim().slice(0,650);
  who=String(who||'CIDADE').replace(/\s+/g,' ').trim().slice(0,70);
  if(!line||line.length<3)return;
  const chapter=title(),signature=[chapter,kind,who,line].join('|');
  if(lastLine===signature)return;lastLine=signature;
  entries.push({chapter,kind,who,line});if(entries.length>160)entries.shift();save();
  if(showing)draw();
 }
 const existingRadio=window.radio;
 if(typeof existingRadio==='function')window.radio=function(who,line,...rest){add('transmissão',who,line);return existingRadio.call(this,who,line,...rest);};
 const btn=document.createElement('button');btn.type='button';btn.id='rc37LogToggle';btn.textContent='L / DIÁRIO';btn.title='Registro de diálogos, investigações e escolhas';btn.setAttribute('aria-label','Abrir diário da sessão (tecla L)');menu.append(btn);
 const overlay=document.createElement('dialog');overlay.id='rc37Dossier';overlay.setAttribute('aria-label','Diário de investigação da campanha');
 overlay.innerHTML=`<div class="rc37-dossier-head"><div><small>NEO ROCKFORD / ARQUIVO LOCAL</small><h2>Diário de <em>investigação.</em></h2><p>Falas e escolhas que você realmente encontrou nesta sessão.</p></div><button id="rc37LogClose" aria-label="Fechar diário">×</button></div><div class="rc37-dossier-content" id="rc37DossierEntries" tabindex="0"></div><footer class="rc37-dossier-footer"><small>Registro local nesta aba · L abre e fecha · Esc fecha</small><div><button id="rc37CopyLog">COPIAR REGISTROS</button><button id="rc37ClearLog">LIMPAR DIÁRIO</button></div></footer>`;
 game.append(overlay);
 const container=overlay.querySelector('#rc37DossierEntries');
 function draw(){
  container.replaceChildren();
  const caseData=window.DemoDirector?.caseFile?.(typeof state!=='undefined'?state:null);
  if(caseData){
   const section=document.createElement('section');section.className='demo-case';section.setAttribute('aria-label','Foco atual da investigação');
   const heading=document.createElement('small');heading.textContent='CASO ABERTO / '+caseData.chapter;
   const question=document.createElement('strong');question.textContent=caseData.question;
   const known=document.createElement('p');known.textContent=caseData.observation;
   const tip=document.createElement('p');tip.className='demo-case-tip';tip.hidden=true;tip.textContent=caseData.help;
   const reveal=document.createElement('button');reveal.type='button';reveal.className='demo-case-reveal';reveal.textContent='VER DICA DE INVESTIGAÇÃO';reveal.setAttribute('aria-expanded','false');
   reveal.onclick=()=>{tip.hidden=!tip.hidden;reveal.textContent=tip.hidden?'VER DICA DE INVESTIGAÇÃO':'OCULTAR DICA';reveal.setAttribute('aria-expanded',String(!tip.hidden));};
   section.append(heading,question,known,reveal,tip);container.append(section);
  }
  if(!entries.length){const p=document.createElement('p');p.className='rc37-dossier-empty';p.textContent='Ainda não há registros. O diário acompanha suas descobertas, sem antecipar a história.';container.append(p);return;}
  let previous='';const frag=document.createDocumentFragment();
  for(const entry of entries){
   if(entry.chapter!==previous){previous=entry.chapter;const h=document.createElement('h3');h.textContent=previous;frag.append(h);}
   const article=document.createElement('article');article.className='rc37-dossier-entry';
   const heading=document.createElement('div');const who=document.createElement('strong');who.textContent=entry.who;
   const kind=document.createElement('span');kind.textContent=entry.kind.toUpperCase();heading.append(who,kind);
   const copy=document.createElement('p');copy.textContent=entry.line;article.append(heading,copy);frag.append(article);
  }
  container.append(frag);
 }
 function open(){
  if(showing||game.classList.contains('phase-select-open')||id()===null)return;
  lastFocus=document.activeElement;wasPaused=state.mode==='paused';
  if(!wasPaused&&state.mode!=='won'&&state.mode!=='title'){suspendGame();document.getElementById('pauseLayer')?.classList.add('hidden');}
  showing=true;draw();
  if(typeof overlay.showModal==='function')overlay.showModal();else overlay.setAttribute('open','');
  overlay.querySelector('#rc37LogClose').focus({preventScroll:true});
 }
 function close(){
  if(!showing)return;showing=false;
  if(typeof overlay.close==='function')overlay.close();else overlay.removeAttribute('open');
  if(state.mode==='paused'&&!wasPaused)resumeChapter();
  else if(wasPaused)document.getElementById('pauseLayer')?.classList.remove('hidden');
  (lastFocus?.isConnected?lastFocus:btn)?.focus({preventScroll:true});
 }
 btn.addEventListener('click',()=>showing?close():open());overlay.querySelector('#rc37LogClose').onclick=close;
 overlay.addEventListener('cancel',e=>{e.preventDefault();close();});
 overlay.querySelector('#rc37CopyLog').onclick=()=>{const data=entries.map(e=>`[${e.chapter}] ${e.who}: ${e.line}`).join('\n');if(navigator.clipboard?.writeText){navigator.clipboard.writeText(data).then(()=>{overlay.querySelector('#rc37CopyLog').textContent='COPIADO';}).catch(()=>{});}};
 overlay.querySelector('#rc37ClearLog').onclick=()=>{entries=[];lastLine='';save();draw();};
 // Prevent the global Escape-pause binding from consuming dossier shortcuts.
 window.addEventListener('keydown',e=>{
  if(showing){if(['KeyL','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();close();}return;}
  if(e.code!=='KeyL'||e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;
  const target=e.target;if(target?.closest?.('input,textarea,[contenteditable="true"]'))return;
  if(state.mode==='title'||game.classList.contains('phase-select-open'))return;
  e.preventDefault();e.stopImmediatePropagation();open();
 },true);
 // Record player choices, not synthetic scene outcomes or hidden future branches.
 document.addEventListener('click',e=>{
  const node=e.target.closest?.('.club-choices button,.terrace-choices button,.prologue-actions button');
  if(!node||showing||node.closest('#rc37Dossier'))return;
  if(node.closest('.prologue-actions'))return;
  const value=node.textContent?.replace(/^\s*[123]\s*/, '').trim();
  if(value)add('escolha','SIERRA',value);
 },true);
 const sceneIds=['prologueLine','talkLine','clubDialogue','ghostDialogue','intervalDialogue','interludeDialogue','terraceDialogue'];
 const seen=new Map();let refreshQueued=false;
 function discover(){
  refreshQueued=false;
  for(const n of sceneIds){
   const el=document.getElementById(n);if(!el||el.closest('.hidden')||!el.isConnected)continue;
   if(['prologueLine','talkLine'].includes(n)){
    const text=el.textContent?.trim(),who=n==='prologueLine'?'NARRAÇÃO':document.getElementById('talkSpeaker')?.textContent||'NARRAÇÃO';
    if(text&&seen.get(n)!==text){seen.set(n,text);add('narrativa',who,text);}
   } else {
    const h=el.querySelector('.club-dialogue-top span,.terrace-speaker');
    const line=el.querySelector('.club-line,.terrace-line,.terrace-chosen');
    const val=line?.textContent?.trim();
    if(val&&seen.get(n)!==val){seen.set(n,val);add('diálogo',h?.textContent?.trim()||'PERSONAGEM',val);}
   }
  }
  const chapter=document.getElementById('missionChapter')?.textContent?.trim();
  if(chapter&&chapter!==lastChapter&&id()>0){lastChapter=chapter;add('marco','CIDADE',chapter);}
 }
 function queueDiscover(){if(refreshQueued)return;refreshQueued=true;requestAnimationFrame(discover);}
 const nodes=sceneIds.map(n=>document.getElementById(n)).filter(Boolean);
 for(const node of nodes){new MutationObserver(queueDiscover).observe(node,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});}
 const header=document.getElementById('missionChapter');if(header)new MutationObserver(queueDiscover).observe(header,{childList:true,characterData:true});
 queueDiscover();
 // Reset only the UI after changing a chapter; old click callbacks are still epoch-protected.
 const reset=window.exitChapter;
 if(typeof reset==='function')window.exitChapter=function(...args){if(showing)close();seen.clear();lastChapter='';return reset.apply(this,args);};
})();
