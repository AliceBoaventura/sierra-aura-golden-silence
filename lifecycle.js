/* One application loop and listener set. Chapter-owned timers/audio/DOM expire on exit. */
const chapterTimers=new Set(),audioNodes=new Set(),pointers=new Map();let chapterEpoch=0;
// Timed chapter cues retain their remaining duration when the player pauses.
// The previous implementation discarded every pending cue, which could silently
// skip radio/music events and leave sequences incomplete after resuming.
function armChapterTimer(timer){
 timer.started=performance.now();
 timer.id=setTimeout(()=>{
  timer.id=null;
  if(!chapterTimers.has(timer))return;
  if(['paused','journal'].includes(state.mode)){timer.remaining=0;return;}
  chapterTimers.delete(timer);
  if(timer.epoch===chapterEpoch&&timer.owner===state)timer.fn();
 },timer.remaining);
}
function chapterLater(fn,ms){
 const timer={fn,remaining:Math.max(0,ms),epoch:chapterEpoch,owner:state,id:null,started:0};
 chapterTimers.add(timer);
 if(!['paused','journal'].includes(state.mode))armChapterTimer(timer);
 return timer;
}
function pauseChapterTimers(){
 for(const timer of chapterTimers)if(timer.id!==null){
  clearTimeout(timer.id);timer.id=null;
  timer.remaining=Math.max(0,timer.remaining-(performance.now()-timer.started));
 }
}
function resumeChapterTimers(){
 if(['paused','journal'].includes(state.mode))return;
 for(const timer of [...chapterTimers]){
  if(timer.epoch!==chapterEpoch||timer.owner!==state){chapterTimers.delete(timer);continue;}
  if(timer.id===null)armChapterTimer(timer);
 }
}
function stopChapterAudio(){for(const n of audioNodes){try{n.o.stop();}catch{}n.o.disconnect();n.g.disconnect();}audioNodes.clear();}
function cancelChapterTimers(){for(const timer of chapterTimers)if(timer.id!==null)clearTimeout(timer.id);chapterTimers.clear();}
function releasePointer(e){if(!e)return;const p=pointers.get(e.pointerId);if(!p)return;pointers.delete(e.pointerId);try{p.el.releasePointerCapture?.(e.pointerId);}catch{}if(![...pointers.values()].some(v=>v.key===p.key)){touchKeys.delete(p.key);p.el.classList.remove('active');}if(e.type==='pointercancel'||e.type==='lostpointercapture')tapQueue.delete(p.key);}
function bindTouch(el,key,tap=false){
 el.onpointerdown=e=>{e.preventDefault();if(state.mode!=='playing')return;try{el.setPointerCapture(e.pointerId);}catch{}pointers.set(e.pointerId,{key,el});touchKeys.add(key);if(tap)tapQueue.add(key);el.classList.add('active');};
 el.onpointerup=el.onpointercancel=el.onlostpointercapture=e=>{if(e)releasePointer(e);else {for(const [id,p]of pointers)if(p.el===el)releasePointer({pointerId:id});}};
}
// Release hardware/touch keys without discarding committed or in-progress scene state.
// Full transient reset is reserved for chapter exit, retries and fresh starts.
function resetInput(preserveGameplay=false){
 keys.clear();touchKeys.clear();tapQueue.clear();
 for(const id of [...pointers.keys()])releasePointer({pointerId:id,type:'pointercancel'});
 scanToggle=false;
 for(const k of Object.keys(input))input[k]=false;
 document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('active'));
 for(const id of ['touchScan','touchJump','touchUse','touchDash'])$(id)?.classList.remove('active');
 if(typeof syncTouchScanner==='function')syncTouchScanner();
 if(preserveGameplay){
  state.scan=false;state.scanWas=false;state.useWas=true;state.jumpWas=false;state.dashWas=false;
  if('vx' in state)state.vx=0;
  for(const who of ['jinx','aura','alex']){state[who+'Vx']=0;state[who+'Moving']=false;}
 }else NeoRuntime.reset(state);
}
function exitChapter(){document.getElementById('terraceUI')?.remove();document.getElementById('interludeCurtain')?.remove();document.getElementById('chapterSevenEnd')?.remove();chapterEpoch++;cancelChapterTimers();stopChapterAudio();resetInput();state.events?.splice(0);radioUntil=0;pausedRadioRemaining=0;last=0;
 for(const id of ['clubDialogue','clubPuzzle','ghostDialogue','ghostPuzzle','ghostNotes','ghostJournal','conversationBox','questToggle','questPanel','prologueUI','pauseLayer','intervalDialogue','intervalPuzzle','intervalNotes','intervalJournal','interludeDialogue'])$(id)?.classList.add('hidden');
 for(const id of ['clubDialogue','clubPuzzle','ghostDialogue','ghostPuzzle','ghostNotes','intervalDialogue','intervalPuzzle','intervalNotes','interludeDialogue'])$(id).innerHTML='';
 for(const id of ['continue','talkNext']){const el=$(id);if(el)el.onclick=null;}
 $('game').classList.remove('club-mode','club-talking','ghost-mode','ghost-talking','ghost-paused','cinematic','prelude','interval-mode','interval-talking','interlude-mode','interlude-talking','interlude-final-focus','interlude-cinematic','chapter-seven-outro','chapter-seven-ended','interlude-opening','interval-aftermath','rooftop-mode','sky-only','terrace-night','terrace-dawn');
 $('identityLabel').textContent='SIERRA / CORE';
 $('radio').style.display='none';$('hint').style.display='none';$('alert').style.display='none';document.querySelector('.hud').style.opacity='1';$('interludeSkip')?.classList.add('hidden');
 ctx.filter='none';ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.setLineDash([]);
}
function suspendGame(){if(['ready','title','lost','won','paused'].includes(state.mode))return;const savedBeforePause=window.SierraSave?.save()===true;state.resumeMode=state.mode;pausedRadioRemaining=Math.max(0,radioUntil-performance.now());state.mode='paused';resetInput(true);pauseChapterTimers();stopChapterAudio();
 const box=$('pauseLayer');box.innerHTML='<div class="panel"><h1>Sinal<br><em>suspenso.</em></h1><p class="intro">A investigação está pausada.</p><p class="small">'+(savedBeforePause?'PONTO SEGURO SALVO NESTE NAVEGADOR.':'O progresso retoma do último ponto seguro salvo.')+'</p><button class="primary" id="resumeChapter">CONTINUAR</button></div>';box.classList.remove('hidden');$('resumeChapter').onclick=resumeChapter;$('pause').textContent='▶';
}
function resumeChapter(){if(state.mode!=='paused')return;resetInput(true);state.mode=state.resumeMode||'playing';state.resumeMode=null;last=0;radioUntil=performance.now()+pausedRadioRemaining;resumeChapterTimers();$('pauseLayer').classList.add('hidden');$('pause').textContent='Ⅱ';}
qaListen(window,'pointerup',releasePointer);qaListen(window,'pointercancel',releasePointer);

function ownChapterUI(id){const owner=state,epoch=chapterEpoch;for(const el of $(id)?.querySelectorAll('button,input')||[])for(const key of ['onclick','oninput']){const action=el[key];if(action)el[key]=function(...args){if(state===owner&&chapterEpoch===epoch&&state.mode!=='paused'&&el.isConnected!==false)return action.apply(this,args);};}}
function boundCamera(width){camX=Math.max(0,Math.min(Math.max(0,width-W),camX));}

function showChapterMenu(){
 // Public ALFA ending screens offer MENU too; reload restores the real title
 // and its local checkpoint, without exposing the QA chapter selector.
 if(!new URLSearchParams(location.search).has('qa')){location.reload();return;}
 if(window.SierraChapterSelect){window.SierraChapterSelect.open();return;}
 exitChapter();state=NeoEngine.create();clearControl();
 showPanel('Sierra & Aura<br><em>Golden Silence</em>','Prólogo, capítulos 1–7 e interlúdio.','COMEÇAR PELO PRÓLOGO',beginPrologue);
 const panel=$('overlay').querySelector('.panel'),list=document.createElement('div');list.className='chapter-menu-list';
 for(const [name,action] of [['01 · DISTRITO 07',beginPrelude],['02 · APARTAMENTO DE AURA',beginApartment],['03 · ENLACE',beginUprising],['04 · ENTRE AS ESTRELAS',beginTerrace],['05 · ZONA CEGA',beginClub],['06 · GHOST TRACK',beginGhost],['07 · 47 MINUTOS',beginInterval],['INTERLÚDIO · CAFÉ ÀS 02:17',openInterlude]]){
  const button=document.createElement('button');button.className='secondary';button.textContent=name;button.onclick=action;list.appendChild(button);
 }
 panel.appendChild(list);
}
