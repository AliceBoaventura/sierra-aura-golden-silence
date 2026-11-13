/* RC33: Phase selection without altering chapter logic or the original Cadillac opening. */
(()=>{'use strict';
 const chapterSelectionEnabled=true; // Public optional phase selection; campaign checkpoint stays isolated.
 const root=document.getElementById('game');
 const screen=document.getElementById('chapterPicker');
 const titleOverlay=document.getElementById('overlay');
 const initialStart=document.getElementById('start');
 if(!root||!screen||!titleOverlay||!initialStart)return;
 // Accessible chapter control for cinematic views that intentionally hide the HUD.
 const quick=document.createElement('button');
 quick.id='chapterQuickSelect';quick.type='button';quick.textContent='FASES';
 quick.setAttribute('aria-label','Voltar à seleção de fases');
 quick.addEventListener('click',()=>open('game'));
 if(!chapterSelectionEnabled)quick.classList.add('hidden');
 root.appendChild(quick);
 const episodes=[
  {tag:'00',title:'PRÓLOGO',sub:'Antes de sair, um segundo desaparece.',image:'assets/visual-v5/city-v5.png',play:()=>beginPrologue(),check:()=>ready&&homeLoaded&&districtLoaded&&lifeLoaded>=2},
  {tag:'01',title:'SIERRA CORE',sub:'Quem ficou de fora do registro?',image:'assets/visual-v5/sierra-home-v5.png',play:()=>beginPrelude(),check:()=>ready&&homeLoaded&&districtLoaded&&lifeLoaded>=2},
  {tag:'02',title:'APARTAMENTO DE AURA',sub:'Ela pode abrir a porta. Não a vida de Aura.',image:'assets/visual-v5/apartment-v5.png',play:()=>beginApartment(),check:()=>ready&&aptLoaded&&auraLoaded},
  {tag:'03',title:'ENLACE',sub:'Três relés. Um vínculo sob controle.',image:'relay-corridor.png',play:()=>beginUprising(),check:()=>ready&&relayLoaded&&aptLoaded&&auraLoaded},
  {tag:'04',title:'ENTRE AS ESTRELAS',sub:'O que se pode prometer a quem vai partir?',image:'assets/visual-v5/terrace-v5.png',play:()=>beginTerrace(),check:()=>ready&&terraceLoaded&&dreamLoaded&&wakingLoaded&&auraLoaded},
  {tag:'05',title:'ZONA CEGA',sub:'Salvar a fita. Sair com Jinx.',image:'assets/visual-v5/club-v5.png',play:()=>beginClub(),check:()=>ready&&!clubFailed&&clubAssets>=5&&lifeLoaded>=2},
  {tag:'06',title:'GHOST TRACK',sub:'O último rastro não explica a ausência.',image:'ghost-sleep.png',play:()=>beginGhost(),check:()=>ready&&!ghostFailed&&ghostAssets>=4&&auraLoaded&&homeLoaded},
  {tag:'07',title:'47 MINUTOS',sub:'O registro não diz tudo que aconteceu.',image:'interval-facility.png',play:()=>beginInterval(),check:()=>ready&&!intervalFailed&&intervalLoaded>=2&&alexandraFallReady&&auraGriefReady&&auraLoaded&&ghostTiles.length>=6},
  {tag:'08',title:'CAFÉ ÀS 02:17',sub:'O luto também exige escolhas.',image:'assets/visual-v5/cafe-0217-v5.png',play:()=>openInterlude(),check:()=>ready&&!interludeFailed&&!coffeePoseFailed&&interludeAssets>=5&&coffeePoseReady&&coffeeTableReady}
 ];
 let previous='title', refreshId=null, alreadyPaused=false, returnFocus=null;
 const inactiveSiblings=new Map();
 function isolateMenu(){
  for(const el of root.children)if(el!==screen){inactiveSiblings.set(el,!!el.inert);el.inert=true;}
 }
 function restoreScene(){for(const [el,inert]of inactiveSiblings)el.inert=inert;inactiveSiblings.clear();}
 function selectedButtons(){return Array.from(screen.querySelectorAll('button[data-episode]'));}
 function build(){
  screen.innerHTML=`<div class="chapter-picker__ambient" aria-hidden="true"></div>
   <div class="chapter-picker__body">
    <header class="chapter-picker__header">
     <div><div class="chapter-picker__brand">SIERRA / AURA <span>·</span> GOLDEN SILENCE</div>
      <div class="chapter-picker__eyebrow">NEO ROCKFORD // DIRETÓRIO DE CAPÍTULOS</div>
      <h2 id="chapterPickerTitle">Escolha sua <em>fase.</em></h2>
      <p>Explore qualquer capítulo com escolhas reiniciadas. Este modo não salva sobre sua campanha; CONTINUAR recupera o último checkpoint.</p></div>
     <button type="button" class="chapter-picker__back" id="chapterPickerBack">← VOLTAR</button>
    </header>
    <div class="chapter-picker__grid" role="group" aria-label="Capítulos disponíveis"></div>
    <footer class="chapter-picker__footer"><span><b>IMPORTANTE</b> · Entrar diretamente em uma fase usa os estados iniciais dela, sem reproduzir as decisões de capítulos anteriores.</span><span>↑ ↓ PARA ESCOLHER · ENTER PARA ENTRAR · ESC PARA VOLTAR</span></footer>
   </div>`;
  const grid=screen.querySelector('.chapter-picker__grid');
  episodes.forEach((ep,i)=>{
   const card=document.createElement('button');card.type='button';card.className='chapter-picker__card';card.dataset.episode=String(i);
   card.setAttribute('aria-label',`${ep.tag}, ${ep.title}: ${ep.sub}`);
   const image=document.createElement('span');image.className='chapter-picker__art';image.style.backgroundImage=`linear-gradient(180deg,transparent 42%,#020612a8 100%),url("./${ep.image}")`;
   const number=document.createElement('span');number.className='chapter-picker__number';number.textContent=ep.tag;
   image.append(number);
   const info=document.createElement('span');info.className='chapter-picker__info';
   const name=document.createElement('strong');name.textContent=ep.title;
   const desc=document.createElement('small');desc.textContent=ep.sub;
   const stateLabel=document.createElement('span');stateLabel.className='chapter-picker__state';stateLabel.textContent='CARREGANDO…';
   info.append(name,desc,stateLabel);card.append(image,info);grid.append(card);
   card.addEventListener('click',()=>enter(i));
  });
  screen.querySelector('#chapterPickerBack').addEventListener('click',close);
 }
 function refresh(){if(screen.classList.contains('hidden'))return;
  selectedButtons().forEach((button,i)=>{
   let active=false;try{active=Boolean(episodes[i].check());}catch{}
   button.disabled=!active;
   const status=button.querySelector('.chapter-picker__state');
   status.textContent=active?'ENTRAR NA FASE  ↗':'CARREGANDO RECURSOS…';
  });
 }
 function open(origin='title'){
  if(!screen.classList.contains('hidden'))return;
  previous=origin;
  returnFocus=document.activeElement;
  alreadyPaused=state.mode==='paused';
  if(origin==='game'){
   // Stop the live simulation while the player chooses. Do not discard it until a phase is selected.
   if(state.mode!=='paused')suspendGame();
   document.getElementById('pauseLayer').classList.add('hidden');
  }else{
   titleOverlay.classList.add('hidden');
  }
  screen.classList.remove('hidden');root.classList.add('phase-select-open');
  isolateMenu();
  refresh();refreshId=window.setInterval(refresh,250);
  requestAnimationFrame(()=>{if(screen.classList.contains('hidden'))return;const first=selectedButtons().find(b=>!b.disabled);(first||screen.querySelector('#chapterPickerBack')).focus({preventScroll:true});});
 }
 function close(){
  if(screen.classList.contains('hidden'))return;
  screen.classList.add('hidden');root.classList.remove('phase-select-open');
  restoreScene();
  window.clearInterval(refreshId);refreshId=null;
  if(previous==='game'){
   if(state.mode==='paused'&&!alreadyPaused)resumeChapter();
   else if(state.mode==='paused')document.getElementById('pauseLayer').classList.remove('hidden');
   if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
  }else{
   titleOverlay.classList.remove('hidden');
   initialStart.focus({preventScroll:true});
  }
 }
 function enter(index){
  const ep=episodes[index];if(!ep)return;
  try{if(!ep.check())return;}catch{return;}
  // Optional chapter jumps must never replace the player's actual campaign checkpoint.
  window.SierraSave?.stopTracking();
  // Commit the phase change only after selecting a ready episode.
  screen.classList.add('hidden');root.classList.remove('phase-select-open');
  restoreScene();
  window.clearInterval(refreshId);refreshId=null;
  window.SceneDirector?.reset();
  exitChapter();
  StoryContinuity.reset();
  state=NeoEngine.create();
  clearControl();
  ep.play();
 }
 build();
 // The primary start follows the actual campaign. Chapter jumping stays optional
 // for itch.io testers and does not silently skip introductions.
 initialStart.onclick=()=>{if(!initialStart.disabled){window.SierraSave?.newRun();beginPrologue();}};
 const chooseFromTitle=document.createElement('button');
 chooseFromTitle.type='button';chooseFromTitle.id='chooseFromTitle';
 chooseFromTitle.className='secondary';chooseFromTitle.textContent='SELECIONAR FASE';
 chooseFromTitle.addEventListener('click',()=>open('title'));
 if(chapterSelectionEnabled)initialStart.insertAdjacentElement('afterend',chooseFromTitle);
 // Reuse the existing selector and keep its campaign save isolation.
 if(!chapterSelectionEnabled){
  document.querySelector('#overlay .chapter-select')?.classList.add('hidden');
  document.getElementById('chapterMenuOpen')?.classList.add('hidden');
 }
 const menuOpen=document.getElementById('chapterMenuOpen');
 if(menuOpen&&chapterSelectionEnabled)menuOpen.addEventListener('click',()=>open('game'));
 // Expose a non-destructive option in the native pause overlay.
 const originalPause=suspendGame;
 suspendGame=function(...args){
  originalPause(...args);
  // The same optional selector is available from pause.
  if(!chapterSelectionEnabled)return;
  const layer=document.getElementById('pauseLayer');
  if(state.mode!=='paused'||!layer||!layer.querySelector('#resumeChapter')||layer.querySelector('#pausePhaseSelect'))return;
  const button=document.createElement('button');button.type='button';button.id='pausePhaseSelect';button.className='secondary';button.textContent='ESCOLHER OUTRA FASE';
  button.onclick=()=>open('game');layer.querySelector('.panel').append(button);
 };
 window.addEventListener('keydown',e=>{
  if(screen.classList.contains('hidden'))return;
  if(e.key==='Escape'||e.key==='Backspace'){e.preventDefault();e.stopImmediatePropagation();close();return;}
  if(e.key==='Tab'){
   e.preventDefault();e.stopImmediatePropagation();
   const list=[screen.querySelector('#chapterPickerBack'),...selectedButtons().filter(b=>!b.disabled)];
   const n=list.indexOf(document.activeElement),step=e.shiftKey?-1:1;
   list[n<0?(e.shiftKey?list.length-1:0):(n+step+list.length)%list.length].focus();return;
  }
  if(e.ctrlKey||e.altKey||e.metaKey)return;
  if(/^[1-9]$/.test(e.key)){e.preventDefault();e.stopImmediatePropagation();const target=selectedButtons()[Number(e.key)-1];if(target&&!target.disabled){target.focus();target.click();}return;}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
   e.preventDefault();e.stopImmediatePropagation();const list=selectedButtons().filter(b=>!b.disabled);if(!list.length)return;
   let n=list.indexOf(document.activeElement);const step=e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1;n=(n+step+list.length)%list.length;list[n].focus();return;
  }
  // Keep pause, scanner, journal and movement shortcuts out of the modal.
  // Enter/Space retain native button activation; Tab retains native focus traversal.
  if(!['Enter',' ','Tab','Shift','Control','Alt','Meta'].includes(e.key)){
   e.preventDefault();e.stopImmediatePropagation();
  }
 },true);
 window.SierraChapterSelect={open:()=>open('game'),close,get available(){return episodes.map(e=>{try{return!!e.check();}catch{return false;}});}};
})();

/* RC48 · Persistent checkpoint in the existing chapter selector, not a second engine.
   The save is deliberately conservative: only free-roaming states are serialized.
   During dialogue, puzzles and cinematics, resume returns to the last safe
   checkpoint (or the start of the chapter), never to a broken half-dialogue. */
(()=>{'use strict';
 const KEY='sierra-aura-golden-silence-main-checkpoint-v1',VERSION=1;
 const names={'-1':'PRÓLOGO','1':'SIERRA CORE','2':'SILÊNCIO DOURADO','3':'ENLACE','4':'ENTRE AS ESTRELAS','5':'ZONA CEGA','6':'GHOST TRACK','7':'47 MINUTOS','8':'CAFÉ ÀS 02:17'};
 const start={[-1]:beginPrologue,1:beginPrelude,2:beginApartment,3:beginUprising,4:beginTerrace,5:beginClub,6:beginGhost,7:beginInterval,8:beginInterlude};
 let tracking=false,lastChapter=null,lastStage=null,lastWritten=0;
 const overlay=$('overlay'),titleButton=$('start');
 const valid=s=>s&&s.version===VERSION&&Number.isInteger(s.chapter)&&s.chapter>=-1&&s.chapter<=8&&s.chapter!==0&&typeof s.savedAt==='number'&&s.memory&&typeof s.memory==='object'&&(!s.state||(s.state.chapter===s.chapter&&(s.chapter===4?((s.state.mode==='conversation'&&['question','response','night'].includes(s.state.stage)||s.state.mode==='won'&&s.state.stage==='ending')&&Number.isInteger(s.state.beat)&&s.state.beat>=0&&s.state.beat<40):(s.state.mode==='playing'&&Number.isFinite(s.state.x)&&Number.isFinite(s.state.y)))));
 function read(){try{const raw=localStorage.getItem(KEY);const saved=raw?JSON.parse(raw):null;return valid(saved)?saved:null;}catch{return null;}}
 function canResume(saved){
  if(!saved||!ready)return false;
  const index=saved.chapter===-1?0:saved.chapter;
  return window.SierraChapterSelect?.available?.[index]===true;
 }
 function save(){
  if(!tracking||$('chapterPicker')?.classList.contains('hidden')===false)return false;
  const chapter=state?.chapter;
  if(!Number.isInteger(chapter)||!(chapter in names)||state.mode==='title'||state.mode==='paused')return false;
  const terraceConversation=chapter===4&&(state.mode==='conversation'||state.mode==='won'&&state.stage==='ending')&&overlay.classList.contains('hidden')&&!!$('terraceDialogue')&&!!$('terraceUI');
  const playing=terraceConversation||(state.mode==='playing'&&overlay.classList.contains('hidden')&&!['clubDialogue','ghostDialogue','intervalDialogue','interludeDialogue','clubPuzzle','ghostPuzzle','intervalPuzzle'].some(id=>!$(id).classList.contains('hidden')));
  const changed=chapter!==lastChapter;
  // Never replace a playable snapshot with an incomplete conversation.
  if(!playing&&!changed&&chapter!==-1)return false;
  StoryContinuity.capture(state);
  let safeState=null;
  if(playing){try{safeState=JSON.parse(JSON.stringify(state));safeState.events=[];safeState.useWas=true;safeState.jumpWas=true;}catch{return false;}}
  const data={version:VERSION,chapter,stage:state.stage||null,slide:chapter===-1?Math.max(0,Math.min(4,state.slide||0)):null,savedAt:Date.now(),memory:StoryContinuity.history(),arcFlags:window.CharacterArcs?.flags?{...window.CharacterArcs.flags}:{},state:safeState};
  try{localStorage.setItem(KEY,JSON.stringify(data));lastChapter=chapter;lastStage=state.stage||null;lastWritten=data.savedAt;refresh();return true;}catch{return false;}
 }
 function refresh(){
  const existing=$('continueSaved');if(!existing)return;
  const saved=read(),visible=!!saved&&canResume(saved);
  existing.classList.toggle('hidden',!visible);
  if(!visible)return;
  existing.disabled=!canResume(saved);
  existing.textContent='CONTINUAR · '+names[saved.chapter]+(saved.state&&saved.stage?' / '+String(saved.stage).toUpperCase():'');
  existing.title='Retomar o último ponto seguro salvo neste navegador';
 }
 function stopTracking(){tracking=false;}
 function newRun(){
  stopTracking();try{localStorage.removeItem(KEY);}catch{}
  StoryContinuity.reset();
  lastChapter=null;lastStage=null;lastWritten=0;tracking=true;refresh();
 }
 function resume(){
  const saved=read();if(!canResume(saved))return false;
  const fn=start[saved.chapter];if(!fn)return false;
  tracking=false;
  // Preserve prior relationships BEFORE the chapter constructor runs.
  StoryContinuity.restore(saved.memory);
  // CharacterArcs adds consequences to the canonical dialogue renderer. Their
  // numeric decisions must survive reload just like StoryContinuity choices.
  if(window.CharacterArcs?.flags){
   for(const key of Object.keys(window.CharacterArcs.flags)){
    const choice=saved.arcFlags?.[key];
    window.CharacterArcs.flags[key]=Number.isInteger(choice)&&choice>=0&&choice<=2?choice:null;
   }
  }
  if(saved.chapter===5)state={chapter:4,ending:saved.memory.terrace||'study',flags:{},events:[]};
  else if(saved.chapter===6)state={chapter:5,closeness:saved.memory.club||'boundary',flags:{},events:[]};
  else if(saved.chapter===7)state={chapter:6,nearChoice:saved.memory.ghost||'boundary',flags:{},events:[]};
  else state=NeoEngine.create();
  fn();
  if(state.chapter!==saved.chapter){tracking=false;return false;}
  if(saved.chapter===-1){state.slide=saved.slide||0;paintPrologue();}
  else if(saved.state){
   // Constructors install scene-specific DOM and camera; replace only serializable
   // state after that setup. Keep defaults introduced by later build revisions.
   clearControl();
   state={...state,...saved.state,events:[],mode:saved.chapter===4?saved.state.mode:'playing',useWas:true,jumpWas:true};
   for(const id of ['clubDialogue','clubPuzzle','ghostDialogue','ghostPuzzle','ghostNotes','intervalDialogue','intervalPuzzle','intervalNotes','interludeDialogue','conversationBox','pauseLayer'])$(id)?.classList.add('hidden');
   overlay.classList.add('hidden');$('radio').style.display='none';
   if(state.chapter===8)$('interludeSkip')?.classList.add('hidden');
   if(state.chapter===4)renderTerraceDialogue();
   updateUI();
   // P57: force chapter-specific HUD after checkpoint rehydration.
   if(saved.chapter===5&&typeof updateClubUI==='function')updateClubUI();
  }
  lastChapter=saved.chapter;lastStage=saved.stage;lastWritten=saved.savedAt;
  tracking=true;
  refresh();return true;
 }
 const button=document.createElement('button');button.type='button';button.id='continueSaved';button.className='secondary hidden';button.disabled=true;
 button.onclick=resume;
 titleButton.insertAdjacentElement('afterend',button);
 // Autosave is local only; no server, cookies, telemetry or remote requests.
 setInterval(()=>{
  if(tracking&&state?.chapter in names){
   const changed=state.chapter!==lastChapter||state.stage!==lastStage;
   if(changed||Date.now()-lastWritten>5000)save();
  }
  if(state?.mode==='title')refresh();
 },1500);
 qaListen(window,'pagehide',()=>{if(tracking)save();});
 window.SierraSave={read,save,resume,newRun,stopTracking,get tracking(){return tracking;}};
 refresh();
})();
