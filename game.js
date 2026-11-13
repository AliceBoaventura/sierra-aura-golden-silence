'use strict';
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d'),E=NeoEngine;
let state=E.create(),W=1100,H=650,camX=0,camY=330,last=0,scanToggle=false,sound=false,ac=null,radioUntil=0,ready=false;
let frameDelta=1/60,pausedRadioRemaining=0;
function updateBoot(){const n=Math.min(14,(cityLoaded?1:0)+(typeof loadedPoses!=='undefined'?loadedPoses.size:0)+(jinxMotionReady?1:0)+(typeof homeLoaded!=='undefined'&&homeLoaded?1:0)+(typeof districtLoaded!=='undefined'&&districtLoaded?1:0)+(typeof lifeLoaded!=='undefined'?Math.min(2,lifeLoaded):0));const pct=Math.round(n/14*100);const p=document.getElementById('bootProgress'),t=document.getElementById('bootCounter'),c=document.getElementById('bootCaption'),percent=document.getElementById('bootPercent'),bar=document.querySelector('#bootStatus .boot-track');if(p)p.style.width=pct+'%';if(t)t.textContent=n+' DE 14 RECURSOS';if(percent)percent.textContent=pct+'%';if(bar)bar.setAttribute('aria-valuenow',String(pct));if(c)c.textContent=n===14?'CANAL LOCAL ESTÁVEL · ENTRADA LIBERADA':n<2?'LENDO SETOR 07 / NÓ PRINCIPAL':n<10?'SINCRONIZANDO IDENTIDADES':n<13?'VERIFICANDO AMBIENTES':'RECONSTRUINDO SEQUÊNCIA';}

const tapQueue=new Set();
function cameraBlend(rate){return 1-Math.pow(1-rate,frameDelta*60);}
function resumePlay(){state.mode="playing";radioUntil=performance.now()+pausedRadioRemaining;$("overlay").classList.add("hidden");$("pause").textContent="Ⅱ";}
const input={left:false,right:false,jump:false,use:false,scan:false},keys=new Set(),touchKeys=new Set();
// Keep title/chapter panels visually isolated from the live gameplay HUD.
// This prevents the old chapter-1 objective, meters and touch controls from bleeding
// through translucent overlays before the player has entered the story.
const mainOverlay=$('overlay');
function syncOverlayChrome(){
  const open=!mainOverlay.classList.contains('hidden');
  $('game').classList.toggle('overlay-open',open);
}
const overlayObserver=new MutationObserver(syncOverlayChrome);
overlayObserver.observe(mainOverlay,{attributes:true,attributeFilter:['class']});
syncOverlayChrome();

const bg=new Image();let cityLoaded=false,actorsLoaded=false,jinxMotionReady=false;function finishLoading(){updateBoot();if(!cityLoaded||!actorsLoaded||!jinxMotionReady)return;ready=true;if(typeof interludeReady==='function')interludeReady();if(typeof intervalReady==='function')intervalReady();$('start').disabled=false;$('start').textContent='INICIAR INVESTIGAÇÃO';if(typeof preludeReady==='function')preludeReady();if(typeof apartmentReady==='function')apartmentReady();if(typeof uprisingReady==='function')uprisingReady();if(typeof terraceReady==='function')terraceReady();if(typeof clubReady==='function')clubReady();if(typeof ghostReady==='function')ghostReady();}bg.onload=()=>{cityLoaded=true;finishLoading();};bg.onerror=()=>{$('start').textContent='ERRO NA ARTE · RECARREGAR';$('start').disabled=false;$('start').onclick=()=>location.reload();};bg.src='assets/visual-v5/city-v5.png';
// Lossless frames from the intact original art; no runtime atlas cuts or second resampling.
// Body axis, sole baseline, nominal standing height in each frame's native pixels.
const poses=[],poseGeometry=[[153,424,421],[123,427,424],[162,424,421],[119,428,425],[101,479,476],[179,397,476],[102,501,498],[103,497,498]];
const loadedPoses=new Set();
for(let i=0;i<poseGeometry.length;i++){
 const tile=new Image();poses[i]=tile;
 tile.onload=()=>{loadedPoses.add(i);if(loadedPoses.size===poseGeometry.length){actorsLoaded=true;finishLoading();}};
 tile.onerror=()=>{ready=false;actorsLoaded=false;loadedPoses.delete(i);$('start').disabled=false;$('start').textContent='RECARREGAR PERSONAGENS';$('start').onclick=()=>location.reload();};
 tile.src='actor-restored-'+i+'.png';
}
// Reuse the approved walking sheet already bundled with the interlude.
// The two old Jinx frames are standing gestures, not a locomotion cycle.
const jinxMotionImage=new Image();
jinxMotionImage.onload=()=>{jinxMotionReady=true;finishLoading();};
jinxMotionImage.onerror=()=>{jinxMotionReady=false;ready=false;$('start').disabled=false;$('start').textContent='RECARREGAR PERSONAGENS';$('start').onclick=()=>location.reload();};
jinxMotionImage.src='coffee-character-poses.png';
const jinxMotionBounds=[[133,20,349,488,290],[639,16,254,492,762],[1080,17,342,492,1222],[191,513,198,500,280]];
function drawJinxFrame(foot,walking,height){
 const consistentFrame=window.NeoActors?.frame('jinx',walking,foot,'');
 if(window.NeoActors?.draw('jinx',consistentFrame,height))return;
 const index=walking?[0,1,2,1][Math.floor(Math.abs(foot))%4]:3;
 const [x,y,w,h,axis]=jinxMotionBounds[index],k=height/500;
 ctx.drawImage(jinxMotionImage,x,y,w,h,(x-axis)*k,-h*k,w*k,h*k);
}
function actorFrameBox(index,height){
 const tile=poses[index],[axis,sole,standing]=poseGeometry[index],scale=height/standing;
 return {left:-axis*scale,top:-sole*scale,width:tile.naturalWidth*scale,height:tile.naturalHeight*scale};
}
function drawActorFrame(index,height){
 const b=actorFrameBox(index,height);
 ctx.drawImage(poses[index],b.left,b.top,b.width,b.height);
 return b;
}
function resize(){
 const area=$('game').getBoundingClientRect();if(!area.width||!area.height)return;
 H=area.width/area.height>=1.35?(area.height<=540?500:560):650;W=H*area.width/area.height;const width=Math.round(W);
 if(canvas.width===width&&canvas.height===H)return;
 canvas.width=width;canvas.height=H;ctx.imageSmoothingEnabled=false;
 if(ready&&typeof chapterEpoch!=='undefined')draw();
}
qaListen(window,'resize',resize);qaListen(window,'orientationchange',()=>{resetInput();resize();});qaListen(document,'fullscreenchange',resize);resize();
function beep(freq=440,dur=.1,type='sine',vol=.025){if(!sound||state.mode==='paused'||document.hidden)return;try{ac??=new(window.AudioContext||window.webkitAudioContext)();const resumed=ac.resume();if(resumed?.catch)resumed.catch(()=>{});const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+dur);o.connect(g);g.connect(ac.destination);const owned={o,g};audioNodes.add(owned);o.onended=()=>{audioNodes.delete(owned);o.disconnect();g.disconnect();};o.start();o.stop(ac.currentTime+dur);}catch{sound=false;$('audio').textContent='SOM OFF';}}
function radio(speaker,text,seconds=6){$('speaker').textContent=speaker;$('line').textContent=window.DialogueDirector?.ambient(speaker,text,state)??text;$('radio').style.display='block';radioUntil=performance.now()+seconds*1000;}
function begin(){if(!ready)return;StoryContinuity.reset();if(typeof leaveTerrace==='function')leaveTerrace();$('overlay').classList.remove('encounter');state=E.create();state.mode='playing';scanToggle=false;keys.clear();touchKeys.clear();tapQueue.clear();document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('active'));$('overlay').classList.add('hidden');$('pause').textContent='Ⅱ';syncTouchScanner();radio('JINX / CANAL REBELDE','Aura usou rádio. Procure os sinais âmbar com seu scanner. Eu cubro sua retaguarda.',9);beep(220,.3);}
function showPanel(title,copy,label,action){$('overlay').classList.remove('hidden');$('overlay').innerHTML='<div class="panel"><div class="chapter">SIERRA AURA / GOLDEN SILENCE</div><p class="eyebrow">NEO ROCKFORD · DISTRITO 07</p><h1>'+title+'</h1><p class="intro">'+copy+'</p><button class="primary" id="continue">'+label+'</button><p class="small">A D / setas: mover · espaço: saltar · Q: scanner · E: usar</p></div>';const epoch=chapterEpoch,owner=state;$('continue').onclick=()=>{if(epoch===chapterEpoch&&owner===state)action();};}
function pause(){if(state.mode==='paused')resumeChapter();else suspendGame();}

$('start').onclick=begin;$('pause').onclick=pause;$('audio').onclick=()=>{sound=!sound;if(!sound){stopChapterAudio();}$('audio').textContent=sound?'SOM ON':'SOM OFF';beep(330,.15);};$('full').onclick=()=>{const p=document.fullscreenElement?document.exitFullscreen?.():$('game').requestFullscreen?.();if(p?.catch)p.catch(()=>radio('SISTEMA','Tela cheia indisponível neste navegador.',3));};
qaListen(window,'keydown',e=>{
 // Native keyboard interaction wins over world movement while an editable
 // control has focus. This includes audio sliders AND the access-policy selects
 // in chapter 7; the latter previously swallowed ArrowUp/ArrowDown globally.
 const editControl=e.target?.closest?.('input,select,textarea,[contenteditable="true"],[role="slider"]');
 if(editControl){
  // Escape remains available for pause/closing the puzzle.
  if(e.code!=='Escape'&&e.code!=='KeyP'){
   keys.delete(e.code);
   return;
  }
 }
 if(document.getElementById('rc37Dossier')?.open)return;
 // Let the browser activate a *visible, focused* native control with Enter/Space.
 // Previously Space was cancelled globally even on INICIAR, CONTINUAR and puzzle
 // selectors. A hidden title button may retain focus after play starts: it must
 // not steal Space from Sierra's jump input.
 const focusedControl=e.target?.closest?.('button,select,input,textarea,a[href],[role="button"]');
 if(['Enter','Space'].includes(e.code)&&focusedControl&&
    !focusedControl.closest('.hidden,[inert]')&&focusedControl.getClientRects().length)return;
 if(['Space','KeyW','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyS','KeyQ','KeyE','Escape','KeyP'].includes(e.code))e.preventDefault();
 if(!e.repeat&&(e.code==='Escape'||e.code==='KeyP')){pause();return;}
 if(state.mode!=='playing')return;
 const firstPress=!e.repeat&&!keys.has(e.code);
 keys.add(e.code);
 // Remember discrete actions until a frame consumes them, just like touch taps.
 // Keyup may arrive before requestAnimationFrame on a busy or slow browser.
 if(firstPress){
  const action={KeyE:'use',Space:'jump',KeyW:'jump',ArrowUp:'jump',ShiftLeft:'dash',ShiftRight:'dash'}[e.code];
  if(action)tapQueue.add(action);
 }
});qaListen(window,'keyup',e=>keys.delete(e.code));qaListen(window,'blur',()=>{resetInput(true);suspendGame();});qaListen(document,'visibilitychange',()=>{if(document.hidden){resetInput(true);suspendGame();}});
for(const el of document.querySelectorAll('[data-hold]'))bindTouch(el,el.dataset.hold);
function momentary(id,key){bindTouch($(id),key,true);}
momentary('touchDash','dash');momentary('touchJump','jump');momentary('touchUse','use');
// Keep the mobile scanner's visual, keyboard and screen-reader state synchronized.
function syncTouchScanner(){
 const button=$('touchScan');if(!button)return;
 const profile=typeof NeoRuntime==='undefined'?(state.chapter===7&&state.avatar==='alex'?'interface':state.chapter===6?'echo':'battery'):NeoRuntime.scannerProfile(state);
 const active=state.mode==='playing'&&!!state.scan;
 button.classList.toggle('active',active);
 button.setAttribute('aria-pressed',String(active));
 button.disabled=profile==='unavailable'||state.mode!=='playing';
 button.textContent=profile==='echo'?'ECHO':profile==='interface'?'DADOS':'SCAN';
 button.setAttribute('aria-label',profile==='unavailable'?'Scanner indisponível nesta cena':profile==='interface'?'Consultar interface de Alexandra (sem emissor)':profile==='echo'?(active?'Desativar reconstrução ECHO':'Ativar reconstrução ECHO'):active?'Desativar scanner':'Ativar scanner');
}
function activateTouchScan(){
 if(state.mode!=='playing')return;
 if(!scanToggle&&!NeoRuntime.scannerCanStart(state))return;
 scanToggle=!scanToggle;syncTouchScanner();
}
// Pointerdown is immediate on Android. click with detail=0 preserves accessibility keyboard use.
$('touchScan').addEventListener?.('pointerdown',e=>{if(e.pointerType!=='mouse'){e.preventDefault();activateTouchScan();}});
// Chromium may emit a touch click with detail=0 after pointerdown; do not toggle twice.
$('touchScan').onclick=e=>{if(e.pointerType==='mouse'||(e.detail===0&&!e.pointerType))activateTouchScan();};
syncTouchScanner();
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function label(text,x,y,color='#aaf5f2',size=12){ctx.fillStyle=color;ctx.font=`${size}px monospace`;ctx.textAlign='center';ctx.fillText(text,x,y);}
// Distinct walk, idle and airborne poses with stable foot anchors.
// Unified character anchors across chapters. Frame phase follows travelled distance,
// not wall-clock time: stopping never leaves the feet cycling in place.
function actor(x,y,face,time,walking,kind='sierra',ghost=false){
 if(!actorsLoaded)return;
 const airborne=kind==='sierra'&&!ghost&&state.grounded===false;
 const phase=Math.floor(Math.abs(time)*.91);
 const index=kind==='jinx'?(walking?6+(phase%2):6):airborne?6:walking?phase%4:4;
 const targetH=kind==='jinx'?(state.chapter===4?156:278):(state.chapter===4?122:218);
 const box=actorFrameBox(index,targetH);
 const f=face<0?-1:1;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));
 if(!airborne&&!ghost&&window.P60Visual)P60Visual.contact(ctx,0,0,kind,1);
 // The contact shadow belongs to the character, not to the background painting.
 if(!airborne&&!ghost){ctx.fillStyle='#01061178';ctx.beginPath();ctx.ellipse(0,2,kind==='jinx'?34:22,3.6,0,0,Math.PI*2);ctx.fill();}
 if(kind==='sierra'&&!ghost&&state.inv>0){ctx.strokeStyle='#bce8e5';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,3,27,5,0,0,Math.PI*2);ctx.stroke();}
 ctx.scale(f,1);
 // P52: directional momentum is communicated through the existing illustrated
 // poses. A slight torso lean follows actual movement; soles and hitboxes stay
 // at the original anchor, and the effect vanishes at rest.
 if(walking&&!ghost&&!airborne&&state.mode==='playing'){
   const velocity=Number.isFinite(state.vx)?Math.min(1,Math.abs(state.vx)/210):.5;
   const lean=(kind==='jinx'?.020:.014)+velocity*.012;
   ctx.transform(1,0,-lean,1,0,0);
   // No whole-body vertical bob: boots stay on the painted floor each frame.
 }
 // Almost imperceptible breathing for a resting actor; preserved foot anchor
 // and shadow. No idle sway while a character is walking or in midair.
 if(!walking&&!airborne&&!ghost&&state.mode==='playing'){
   const phase=state.time*1.65+({sierra:0,aura:1.5,jinx:2.2,alexandra:.7}[kind]||0);
   const breath=(Math.sin(phase)+1)*.5;
   ctx.translate(Math.sin(phase*.52)*.35,0); // planted soles never float at idle
   // Subtle opposing shoulder lean, planted feet never drift or resize.
   ctx.transform(1,0,Math.sin(phase*.6)*.003,1,0,0);
 }
 window.P53Performance?.apply(ctx,kind,state,walking,airborne,ghost);
 ctx.imageSmoothingEnabled=false;
 if(ghost){ctx.globalAlpha=.3+.12*Math.sin(state.time*5);ctx.filter='sepia(1) saturate(4)';}
 let emotion=state.scan&&kind==='sierra'?'tension':'';
 // Pose changes are keyed to authored moments and local threat, not random
 // frames. All poses are original illustrated assets with registered soles.
 if(!walking&&!airborne&&!ghost&&state.mode==='playing'&&!emotion){
  const cycle=state.time+({sierra:0,jinx:2.6,aura:4.2,alexandra:1.3}[kind]||0);
  if(state.alarm>45||state.detected)emotion='tension';
  else if(kind==='jinx'&&state.chapter===8&&state.stage==='depot'&&state.flags?.depotMemory)emotion='grief';
  else if(state.chapter===8&&state.stage==='depot'&&state.flags?.depotArchive&&kind==='sierra')emotion='reach';
  // P59: no random reach/crouch in idle; poses change only for authored actions.
 }
 if(state.chapter===7&&state.stage==='aftermath')emotion=kind==='jinx'?'grief':'grief';
 if(state.chapter===1&&kind==='jinx'&&state.alarm>30)emotion='tension';
 if(state.chapter===8&&state.stage==='homeEnd'&&state.flags?.sleeping)emotion='grief';
 if(kind==='sierra'&&!ghost&&!airborne&&state.crouch)emotion='crouch';
 const newFrame=window.NeoActors?.frame(kind,walking,time,emotion,airborne);
 // Only the investigation gets the expanded, foot-registered 8-phase walk.
 const traceMovement=kind==='sierra'&&walking&&!ghost&&!airborne&&
   ((state.narrative&&['trace','approach'].includes(state.stage))||
    (state.chapter===2&&!state.flags?.metAura));
 const investigated=traceMovement&&window.NeoActors?.drawInvestigation?.(time,targetH);
 if(!investigated&&!window.NeoActors?.draw(kind,newFrame,targetH)){if(kind==='jinx'&&jinxMotionReady)drawJinxFrame(time,walking,targetH);else drawActorFrame(index,targetH);}
 ctx.filter='none';
 // Sprite-only antialiasing never leaks to platform drawing.
 ctx.imageSmoothingEnabled=false;
 // The reflection is confined to rainy exterior streets, never apartment or café floors.
 const wet=state.chapter===8&&['walk','returnWalk','doorstep'].includes(state.stage);
 if(!ghost&&wet){ctx.save();ctx.globalAlpha=.075;ctx.translate(0,6);ctx.scale(1,-.16);if(!window.NeoActors?.draw(kind,newFrame,targetH)){if(kind==='jinx'&&jinxMotionReady)drawJinxFrame(time,walking,targetH);else drawActorFrame(index,targetH);}ctx.restore();}
 if(ghost){for(let sy=box.top;sy<0;sy+=6)rect(-box.width*.22,sy,box.width*.44,1,'#ffe2a530');}
 ctx.restore();
}
function platform(p){if(p.ground||p.x+p.w<camX-32||p.x>camX+W+32)return;rect(p.x,p.y,p.w,p.h,'#0a1222');rect(p.x,p.y,p.w,2,'#a1f5ef');rect(p.x,p.y+2,p.w,3,'#377983');rect(p.x,p.y+6,p.w,8,'#25384c');rect(p.x,p.y+14,p.w,3,'#060c19');for(let x=p.x+5;x<p.x+p.w-10;x+=24){rect(x,p.y+8,12,2,'#566378');rect(x+2,p.y+11,2,2,'#b9aabe');}for(const x of [p.x+8,p.x+p.w-13]){rect(x,p.y+16,7,800-p.y-16,'#101c2c');rect(x,p.y+16,2,800-p.y-16,'#40526a');for(let y=p.y+30;y<790;y+=32)rect(x-2,y,11,4,'#23334a');}ctx.strokeStyle='#2b3b54';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x+15,p.y+19);ctx.lineTo(p.x+p.w-13,795);ctx.moveTo(p.x+p.w-15,p.y+19);ctx.lineTo(p.x+13,795);ctx.stroke();for(let x=p.x+16;x<p.x+p.w-10;x+=48)rect(x,p.y+17,12,2,'#e65ba7');}
function droneBody(d){ctx.save();ctx.translate(Math.round(d.x),Math.round(d.y));const pulse=.6+.4*Math.sin(state.time*8);rect(-32,-5,64,8,'#0a1020');rect(-20,-10,40,17,'#21293c');rect(-15,-13,28,3,'#5e6180');rect(-21,-7,4,9,'#72758e');rect(17,-7,4,9,'#414d6d');rect(-12,-8,24,13,'#141c30');rect(-7,-5,14,3,'#8da4bf');rect(-6,3,12,7,'#fa58b8');rect(-2,4,4,4,'#ffd1f4');for(const x of [-34,23]){rect(x,-12,11,17,'#27324b');rect(x+2,-10,7,3,'#b576c4');rect(x+2,0,7,2,'#e975da');rect(x-5,-15,21,2,'#614574');}ctx.globalAlpha=pulse;rect(-29,8,4,5,'#6ae9f2');rect(26,8,4,5,'#6ae9f2');ctx.restore();}
function draw(){if(state.chapter===8){drawInterlude();return;}if(state.chapter===7){drawInterval();return;}if(state.chapter===6){drawGhost();return;}if(state.chapter===5){drawClub();return;}if(state.chapter===-1){drawPrologue();return;}if(state.narrative){drawPrelude();return;}if(state.chapter===4){drawTerrace();return;}if(state.chapter===3){drawUprising();return;}if(state.chapter===2){drawApartment();return;}ctx.clearRect(0,0,W,H);const cameraTarget=Math.max(0,Math.min(3200-W,state.x-W*.38));camX+=(cameraTarget-camX)*cameraBlend(.09);camY+=((H<650?Math.max(205,state.y-H*.74):Math.max(205,Math.min(390,state.y-H*.67)))-camY)*cameraBlend(.05);boundCamera(3200);ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY));
if(bg.complete&&bg.naturalWidth){ctx.save();ctx.drawImage(bg,0,43,3200,1067);ctx.restore();}else rect(0,0,3200,1100,'#0c1429');
ProductionArt.urbanNPC(1490+Math.sin(state.time*.12)*70,800,state.time,true,-1);ProductionArt.urbanNPC(2330,800,state.time,false,1);
rect(0,800,3200,3,'#567889');rect(0,803,3200,2,'#0a1c33');E.platforms.forEach(platform);
actor(state.jinxX,800,state.jinxFace||1,state.jinxFoot||0,state.jinxMoving,'jinx');label(state.jinxPulse>0?'JINX / EMP':'JINX',state.jinxX,510,'#80eadd',12);if(state.jinxPulse>0){ctx.strokeStyle='#75fff5';ctx.beginPath();ctx.arc(state.jinxX,730,110+Math.sin(state.time*8)*30,0,Math.PI*2);ctx.stroke();}
// Signal fragments are faint when scanner is off, reconstructed when active.
state.clues.forEach((c,i)=>{if(c.found){label('✓',c.x,c.y-35,'#7cf4f1',21);return;}const pulse=.5+.5*Math.sin(state.time*3);ctx.globalAlpha=state.scan?1:.4;ctx.strokeStyle='#fbc570';ctx.lineWidth=2;ctx.beginPath();ctx.arc(c.x,c.y-30,9+pulse*5,0,Math.PI*2);ctx.stroke();rect(c.x-3,c.y-33,6,6,'#ffda8a');ctx.globalAlpha=1;if(state.scan){actor(c.x,c.y,1,0,false,'sierra',true);label('VESTÍGIO 0'+(i+1),c.x,c.y-144,'#ffd58a',13);ctx.strokeStyle='#ffdb8966';ctx.setLineDash([3,9]);ctx.beginPath();ctx.moveTo(c.x-100,c.y-4);ctx.lineTo(c.x+100,c.y-4);ctx.stroke();ctx.setLineDash([]);if(c.progress>0){rect(c.x-30,c.y-134,60,4,'#382b21');rect(c.x-30,c.y-134,60*c.progress/1.25,4,'#ffcb75');}}});
// Relay console and exit are solid world objects with interaction markers.
if(!window.ConsoleArt?.draw(ctx,2655,625,{kind:'relay',height:58,status:state.relay?'active':'idle',scan:state.scan})){rect(2632,574,46,51,'#101629');rect(2628,570,54,5,'#43647e');rect(2638,581,34,20,state.relay?'#77e9d0':'#a34e91');rect(2644,585,22,2,'#dcfdff');rect(2644,592,12,2,'#dcfdff');}label(state.relay?'RELÉ ATIVO':'RELÉ / E',2655,551,state.relay?'#85f5d6':'#efa8d3',13);
rect(3017,682,106,118,'#081120');rect(3017,682,4,118,'#728a9b');rect(3119,682,4,118,'#728a9b');rect(3017,682,106,4,state.relay?'#6bf1de':'#e4559e');if(!state.relay)for(let x=3025;x<3116;x+=14)rect(x,688,4,110,'#657284');else{for(let y=730;y<800;y+=12)rect(3023,y,94,4,'#22475c');rect(3023,690,94,35,'#0b2634');}label('ACESSO B-3',3070,665,'#bce6f2',14);
for(const d of E.drones(state)){let endY=800;const shield=E.platforms.filter(p=>!p.ground&&d.x>p.x&&d.x<p.x+p.w&&p.y>d.y).sort((a,b)=>a.y-b.y)[0];if(shield)endY=shield.y;const grad=ctx.createLinearGradient(d.x,d.y,d.x,endY);grad.addColorStop(0,'#f153b840');grad.addColorStop(1,'#f153b809');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(d.x,d.y+12);ctx.lineTo(d.x-d.range,endY);ctx.lineTo(d.x+d.range,endY);ctx.closePath();ctx.fill();droneBody(d);}
if(state.scan){ctx.strokeStyle='#7af8f459';ctx.lineWidth=2;ctx.beginPath();ctx.arc(state.x,state.y-50,130+Math.sin(state.time*4)*8,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#48dadb07';ctx.fill();ctx.strokeStyle='#74fff254';ctx.setLineDash([5,10]);ctx.beginPath();ctx.arc(state.x,state.y-65,95,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);for(let k=0;k<6;k++){const a=state.time*.8+k*Math.PI/3;rect(state.x+Math.cos(a)*130,state.y-65+Math.sin(a)*130,3,3,'#abfff2');}}
actor(state.x,state.y,state.face,state.foot,Math.abs(state.vx)>0);
// Small cyan player marker distinguishes Sierra from the painted background.
label('▼',state.x,state.y-235,'#9bfff2',13);ctx.restore();
// Screen-space rain, restrained scanlines and vignette.
ctx.strokeStyle='#9ebede2c';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<95;i++){const x=((i*83.71-state.time*140-camX*.2)%W+W)%W,y=(i*67.37+state.time*470)%H;ctx.moveTo(x,y);ctx.lineTo(x-4,y+14);}ctx.stroke();for(let y=0;y<H;y+=4)rect(0,y,W,1,'#00000010');const vig=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,W*.8);vig.addColorStop(0,'transparent');vig.addColorStop(1,'#02051366');ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);if(state.detected)rect(0,0,W,3,'#f766aa');
}
const clueLines=['O sinal é dela. Há uma segunda assinatura na passarela. Alguém a seguia.','Kieran: Esse pacote traz a chave do relé. Falta um fragmento. Continue para leste.','AURA / GRAVAÇÃO: Se alguém ouvir… acesso B-3. Meu apartamento. Não use a rede.'];
function updateUI(){if(state.chapter===8){updateInterludeUI();return;}if(state.chapter===7){updateIntervalUI();return;}if(state.chapter===6){updateGhostUI();return;}if(state.chapter===5){updateClubUI();return;}if(state.chapter===-1)return;if(state.narrative){updatePreludeUI();return;}$('game').classList.remove('prelude');if(state.chapter===4)return;$('missionChapter').textContent=state.chapter===3?'ENLACE':state.chapter===2?'SILÊNCIO DOURADO':'O ÚLTIMO SINAL';if(state.chapter===3){updateUprisingUI();return;}if(state.chapter===2){updateApartmentUI();return;}const n=state.clues.filter(c=>c.found).length;$('health').textContent='▰ '.repeat(Math.max(0,state.hp))+'▱ '.repeat(3-Math.max(0,state.hp));$('energy').style.width=state.energy+'%';$('clues').textContent='VESTÍGIOS '+n+' / 3';$('objective').textContent=state.relay?'Entre no acesso B-3':n===3?'Ative o relé na passarela':'Localize os vestígios de Aura';$('alert').style.display=state.alarm>2?'block':'none';$('alarm').style.width=state.alarm+'%';
let hint='';const c=state.clues.find(c=>!c.found&&Math.abs(state.x-c.x)<110&&Math.abs(state.y-c.y)<80);if(c)hint=state.scan?'RECONSTRUINDO VESTÍGIO…':'Q / SCAN · Reconstruir vestígio';else if(Math.abs(state.x-2655)<110&&Math.abs(state.y-625)<80&&!state.relay)hint='E / USAR · Desbloquear relé';else if(Math.abs(state.x-3070)<100)hint=state.relay?'E / USAR · Entrar no subsolo':'ACESSO BLOQUEADO · Ative o relé';else if(Math.abs(state.x-state.jinxX)<150)hint='E / USAR · Falar com Jinx';$('hint').textContent=hint;$('hint').style.display=hint&&state.mode==='playing'?'block':'none';if(state.mode==='playing'&&performance.now()>radioUntil)$('radio').style.display='none';}
function events(){if(state.chapter===8){interludeEvents();return;}if(state.chapter===7){intervalEvents();return;}if(state.chapter===6){ghostEvents();return;}if(state.chapter===5){clubEvents();return;}if(state.chapter===-1)return;if(state.narrative){preludeEvents();return;}if(state.chapter===4)return;if(state.chapter===3){uprisingEvents();return;}if(state.chapter===2){apartmentEvents();return;}for(const ev of state.events){if(ev.type==='clue'){radio(ev.text===2?'KIERAN / CANAL CIFRADO':'SIERRA / RECONSTRUÇÃO',clueLines[ev.text-1],8);beep(660,.25,'sine');}if(ev.type==='jump')beep(150,.07,'triangle',.014);if(ev.type==='message')radio('CANAL REBELDE',ev.text,5);if(ev.type==='damage'){radio('SIERRA / ALERTA','Rastreamento confirmado. Voltando ao último vestígio recuperado.',5);beep(85,.4,'sawtooth');}if(ev.type==='relay'){radio('KIERAN / CANAL CIFRADO','Acesso B-3 aberto. Desça da passarela e siga até a entrada à direita.',8);beep(880,.4);}if(ev.type==='lost')showPanel('Sinal<br><em>perdido.</em>','Os drones fecharam o cerco. Fique sob as plataformas para interromper o rastreamento e desligue o scanner ao atravessar os fachos.','TENTAR NOVAMENTE',begin);if(ev.type==='won'){beep(523,.6);showPanel('Além do<br><em>último sinal.</em>','O acesso B-3 leva aos corredores de serviço do prédio de Aura. Jinx abre a passagem com a mão mecânica e fica protegendo a saída. Sierra sobe sozinha.','ENTRAR NO APARTAMENTO',beginApartment);}}state.events.length=0;}
// A restrained, screen-space confirmation that the scanner is really active.
// The ring is drawn after each chapter scene, so no individual level can forget it.
function drawScannerPulse(){
 if(!state.scan||state.mode!=='playing'||state.chapter===4||state.chapter===-1)return;
 const px=state.x-camX,py=state.y-camY-112;
 if(!Number.isFinite(px)||!Number.isFinite(py)||px<-90||px>W+90)return;
 const t=state.time||0;
 ctx.save();ctx.strokeStyle='#91f8e47d';ctx.fillStyle='#aaf9edc8';ctx.lineWidth=1;
 ctx.setLineDash([5,9]);ctx.strokeRect(px-48,py-76,96,155);ctx.setLineDash([]);
 ctx.globalAlpha=.5+.2*Math.sin(t*5);
 ctx.beginPath();ctx.arc(px,py,52,0,Math.PI*2);ctx.stroke();
 ctx.globalAlpha=1;ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(state.chapter===6?'ECHO // ON':'SCAN // ON',px,py-83);
 ctx.restore();
}
let p10LastTerracePaint=0;
function frame(now){for(const action of tapQueue)state[action+'Was']=false;const elapsed=last?Math.max(0,(now-last)/1000):.016;last=now;frameDelta=Math.min(elapsed,.2);if(globalThis.ChapterCurtain?.active){try{draw();}catch(error){reportGameFault('chapter curtain draw',error);}finally{tapQueue.clear();queueGameFrame();}return;}input.left=keys.has('KeyA')||keys.has('ArrowLeft')||touchKeys.has('left');input.right=keys.has('KeyD')||keys.has('ArrowRight')||touchKeys.has('right');input.jump=keys.has('Space')||keys.has('KeyW')||keys.has('ArrowUp')||touchKeys.has('jump')||tapQueue.has('jump');input.use=keys.has('KeyE')||touchKeys.has('use')||tapQueue.has('use');input.scan=(keys.has('KeyQ')||scanToggle)&&NeoRuntime.scannerProfile(state)!=='unavailable';input.dash=keys.has('ShiftLeft')||keys.has('ShiftRight')||touchKeys.has('dash')||tapQueue.has('dash');input.crouch=keys.has('KeyS')||keys.has('ArrowDown')||touchKeys.has('crouch');for(const dt of NeoRuntime.frameSteps(elapsed)){const owner=state,modeBefore=state.mode;const sharedPause=globalThis.SharedMoments?.beforeStep(state,input)===true;if(sharedPause){input.use=false;}if(!sharedPause&&state.chapter===-1){if(state.mode==='prologue')state.time+=dt;}else if(!sharedPause&&state.chapter===8)Interlude.step(state,input,dt);else if(!sharedPause&&state.chapter===7)Interval.step(state,input,dt);else if(!sharedPause&&state.chapter===6)Ghost.step(state,input,dt);else if(!sharedPause&&state.chapter===5)Club.step(state,input,dt);else if(!sharedPause&&state.narrative)Prelude.step(state,input,dt);else if(!sharedPause&&state.chapter===4){if(state.mode!=='paused')state.time+=dt;}else if(!sharedPause&&state.chapter===3)Uprising.step(state,input,dt);else if(!sharedPause&&state.chapter===2)Apartment.step(state,input,dt);else if(!sharedPause)E.step(state,input,dt);if(state.events?.some(e=>e.type==='damage'||e.type==='lost')){resetInput();cancelChapterTimers();stopChapterAudio();}events();if(owner!==state||modeBefore!==state.mode||sharedPause)break;}
// A latched touch scanner must release automatically when its battery empties.
// Otherwise scanLock stays set until a second tap, even after the meter recharges.
if(scanToggle&&state.scannerState==='depleted'){
 scanToggle=false;syncTouchScanner();
}
if(scanToggle&&NeoRuntime.scannerProfile(state)==='unavailable'){
 scanToggle=false;syncTouchScanner();
}
// A conversation or puzzle cancels the latched mobile scanner. It must not
// silently reactivate after the overlay closes or drain battery behind it.
if(scanToggle&&state.mode!=='playing'){
 scanToggle=false;syncTouchScanner();
}
syncTouchScanner();if(globalThis.DebugQA)DebugQA.sample(now,frameDelta,state);
 // An interrupted dialogue must never leave the movement engine locked while
 // no dialogue panel is visible. Recover the chapter 2 interaction in-place.
 if(state.chapter===2&&state.mode==='dialogue'&&$('overlay').classList.contains('hidden')){
  state.mode='playing';state.useWas=true;reportGameFault('diálogo sem painel',new Error('Interação sem painel restaurada'));
 }
 // P6: Chapter 3 can lose its panel after a focus/scene transition, leaving
 // physics frozen in dialogue or puzzle mode. Restore only a truly orphaned UI.
 if(state.chapter===3&&state.mode==='dialogue'&&$('overlay').classList.contains('hidden')&&$('pauseLayer').classList.contains('hidden')){
  state.mode='playing';state.useWas=true;
  reportGameFault('enlace sem painel',new Error('Diálogo do episódio 3 restaurado'));
 }
 if(state.chapter===3&&state.mode==='puzzle'&&state.puzzle&&$('overlay').classList.contains('hidden')&&$('pauseLayer').classList.contains('hidden')){
  try{showOpticalPuzzle();}catch(error){reportGameFault('circuito sem painel',error);state.mode='playing';state.puzzle=null;state.useWas=true;}
 }

 // A cancelled phase selector or lost-focus event can also leave the mode
 // paused after all pause surfaces disappear. That is not an intentional pause.
 if(state.mode==='paused'&&$('pauseLayer').classList.contains('hidden')&&$('chapterPicker').classList.contains('hidden')&&$('overlay').classList.contains('hidden')&&!$('rc37Dossier')?.open){
  reportGameFault('pausa sem painel',new Error('Pausa invisível restaurada'));
  resumeChapter();
 }
 // A bad graphic is not allowed to stop the input/physics loop or leave an
 // objective belonging to the last chapter on screen.
 try{if(state.chapter!==4||now-p10LastTerracePaint>=40||!p10LastTerracePaint){draw();drawScannerPulse();globalThis.P46Atmosphere?.render(state,ctx,W,H);globalThis.P52SceneDirection?.screen(state,ctx,W,H);globalThis.HotspotsV108?.draw(ctx,state,camX,camY,W,H);if(state.chapter===4)p10LastTerracePaint=now;}}catch(error){reportGameFault('desenho',error);}
 try{updateUI();globalThis.NeoHUD?.update();globalThis.SharedMoments?.update(state);globalThis.ScenePolish?.update(now);globalThis.SceneAtmosphere?.render(now);}
 catch(error){reportGameFault('atualização de interface',error);}
 finally{tapQueue.clear();queueGameFrame();}}queueGameFrame();
// RC72: keep the optional GPT investigation tool out of the itch.io sandbox.
// Some hosts reject registerTool asynchronously; a synchronous try/catch alone
// leaves an unhandled rejection. No game mechanics depend on this integration.
function registerInvestigationContextTool(){
 const model=document.modelContext;
 if(typeof model?.registerTool!=='function')return false;
 const isItchHost=name=>name==='itch.io'||name.endsWith('.itch.io')||name==='itch.zone'||name.endsWith('.itch.zone');
 let parentHost='';
 try{if(document.referrer)parentHost=new URL(document.referrer).hostname.toLowerCase();}catch{}
 const ownHost=String(location.hostname||'').toLowerCase();
 if(isItchHost(ownHost)||isItchHost(parentHost))return false;
 try{
  const registration=model.registerTool({name:'read_investigation_status',description:'Lê o estado atual da fase sem mover Sierra.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({chapter:state.chapter,stage:state.stage,mode:state.mode,clues:(state.clues||[]).filter(c=>c.found).length,relay:state.relay,health:state.hp})});
  if(registration&&typeof registration.catch==='function')registration.catch(()=>{});
  return true;
 }catch{return false;}
}
registerInvestigationContextTool();
