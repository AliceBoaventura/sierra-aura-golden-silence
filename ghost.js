'use strict';
const ghostHome=new Image(),ghostAlex=new Image(),ghostSleep=new Image(),ghostAlexWalk=new Image(),ghostTiles=[];const ghostOpenStudioP61=new Image();ghostOpenStudioP61.src='assets/production/estudio-ghost-fridge-open-p61.png';const ghostFridge=new Image(),ghostFridgeOpen=new Image();ghostFridge.src='assets/production/interactive/alex-fridge.png';ghostFridgeOpen.src='assets/production/interactive/alex-fridge-open.png';let ghostAssets=0,ghostFailed=false,ghostLastBeat=-1;
function ghostReady(){const b=$('chapterSix');if(!b)return;if(ghostFailed){b.disabled=false;b.textContent='RECARREGAR GHOST TRACK';b.onclick=()=>location.reload();return;}b.disabled=ghostAssets<5||!ready||!auraLoaded||!homeLoaded;b.onclick=beginGhost;}
function ghostLoaded(){ghostAssets++;ghostReady();if(typeof intervalReady==='function')intervalReady();}
ghostHome.onload=ghostLoaded;ghostHome.src='assets/visual-v5/alex-home-v5.png';ghostSleep.onload=ghostLoaded;ghostSleep.src='assets/visual-v5/ghost-sleep-v5.png';ghostAlexWalk.onload=ghostLoaded;ghostAlexWalk.src='assets/rebuild/actors/alexandra-walk-ghost.png';ghostAlex.onload=()=>{const cw=ghostAlex.naturalWidth/3,split=Math.round(ghostAlex.naturalHeight*535/1024);for(let k=0;k<6;k++){const sy=k<3?0:split,ch=k<3?split:ghostAlex.naturalHeight-split;const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d');g.drawImage(ghostAlex,k%3*cw,sy,cw,ch,0,0,cw,ch);const p=figureMetrics(c,0,0,c.width,c.height);ghostTiles.push(p);}registerPair(ghostTiles[0],ghostTiles[1]);ghostLoaded();};ghostAlex.src='alex-casual.png';
for(const im of [ghostHome,ghostSleep,ghostAlex,ghostAlexWalk])im.onerror=()=>{ghostFailed=true;const b=$('chapterSix');if(b){b.disabled=false;b.textContent='RECARREGAR GHOST TRACK';b.onclick=()=>location.reload();}};
function beginGhost(){if(ghostAssets<5||ghostFailed||!ready||!auraLoaded||!homeLoaded){showPanel('Ghost<br><em>Track.</em>','O apartamento está carregando.','ENTRAR NO CAPÍTULO 6',beginGhost);return;}StoryContinuity.capture(state);const prior=state.chapter===5?state.closeness:state.prior;leaveTerrace();clearControl();for(const id of ['clubDialogue','clubPuzzle','conversationBox','prologueUI','ghostDialogue','ghostPuzzle','ghostNotes'])$(id).classList.add('hidden');$('game').classList.remove('cinematic','prelude','club-mode','club-talking');$('game').classList.add('ghost-mode');$('overlay').classList.add('hidden');$('overlay').classList.remove('hacking','encounter');document.querySelector('.hud').style.opacity='1';$('radio').style.display='none';$('pause').textContent='Ⅱ';state=Ghost.create(prior);camX=0;camY=340;ghostLastBeat=-1;radio('COMUNICADOR','Uma mensagem de Alexandra aguarda leitura. E / USAR perto do aparelho.',8);updateUI();window.SceneDirector?.enter(6);}
function ghostPause(){pause();}
function ghostResume(){resumeChapter();}
function ghostAlexDraw(x,y,pose=0,alpha=1){
 const onSofa=state.mode==='ghostDialogue'&&['drink','intimacy','late'].includes(state.dialogue)&&pose>=3;
 const h=onSofa?190:pose===4?180:226;
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(Math.round(x),Math.round(y));
 if((state.x<x&&pose<3)||onSofa)ctx.scale(-1,1);
 const frame=pose===4?5:pose===3?4:pose===2?2:pose===1?1:0;
 // Mesmo conjunto de sprites oficial usado nos outros capítulos.
 const rendered=window.NeoActors?.draw('alexandra',frame,h);
 if(!rendered){const fallback=ghostTiles[pose]||ghostTiles[0];if(fallback)drawFigure(fallback,h);}
 ctx.restore();
}
// RC55: Chapter-specific animation uses the same illustrated Alexandra in every frame.
// Walking frames are registered to one torso axis / ground anchor, and advance
// by *distance travelled*, not by an unrelated clock or Sierra's position.
function ghostAlexWalkBeat(s){return Math.floor(Math.abs(s.alexFoot||0)*1.55)%4;}
function ghostAlexPose(){
 const s=state;
 // The same seated asset/height/face must persist before, during and after dialogue.
 if(['floor','couch','decoded','sleep'].includes(s.phase)||s.mode==='ghostDialogue'&&['drink','intimacy','late'].includes(s.dialogue))return 3;
 if(s.alexMoving&&Math.abs(s.alexVx||0)>7)return 2;
 const line=GhostStory[s.dialogue]?.[s.dialogueStep];
 return s.mode==='ghostDialogue'&&s.response===null&&line?.who==='ALEXANDRA'?1:0;
}
function ghostAlexDraw(x,y,pose=0,alpha=1,echo=false){
 const seated=pose===3;
 const moving=!echo&&pose===2&&state.alexMoving&&Math.abs(state.alexVx||0)>7;
 const h=seated?190:pose===4?180:226;
 // The sprite faces its *own velocity* when walking. A conversation turns to Sierra.
 const left=seated || (moving ? state.alexFace===-1 : !echo&&pose<3&&state.x<x);
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(Math.round(x),Math.round(y));
 if(left)ctx.scale(-1,1);
 const beat=ghostAlexWalkBeat(state);
 const walkReady=ghostAlexWalk.complete&&ghostAlexWalk.naturalWidth===1696;
 if(moving){
  // Ghost Track keeps Alexandra's jacket-and-cap outfit; the casual C7 body
  // would be a costume regression. Shared V10 sole registration prevents sliding.
  // New jacket/hat walk uses four full-length contact frames.
  if(window.NeoActors?.draw('alexandra',20+beat,h)){ctx.restore();return;}
  if(window.NeoActors?.drawCostume('alex-ghost',beat,h)){ctx.restore();return;}
  if(walkReady){const unit=h/628;
   ctx.drawImage(ghostAlexWalk,beat*424,0,424,700,-212*unit,-672*unit,424*unit,700*unit);
   ctx.restore();return;}
 }
 const frame=pose===4?5:pose===5?7:seated?4:pose===2?2:pose===1?1:0;
 if(!window.NeoActors?.draw('alexandra',frame,h)&&walkReady){
  // Never fall back to alex-casual.png: that sheet depicts a visibly different actor.
  const unit=h/628;
  ctx.drawImage(ghostAlexWalk,0,0,424,700,-212*unit,-672*unit,424*unit,700*unit);
 }
 ctx.restore();
}
function ghostAuraDraw(x,y){
 // Ghost Track: the idle artwork faces left; flip only if Sierra is to Aura's right.
 // Do not inherit Sierra's last movement input, which can reverse a stationary Aura.
 const faceRight=x<state.x;
 ctx.save();ctx.translate(x,y);ctx.scale(faceRight?-1:1,1);
 if(!window.NeoActors?.draw('aura',0,228)){const h=228,w=h*590/1505;ctx.drawImage(auraSprite,260,12,590,1505,-w/2,-h,w,h);}ctx.restore();
}
function ghostMorning(){return ['missing','echo','call','arrival','team','ghost','ready'].includes(state.phase);}
function drawGhost(){ctx.clearRect(0,0,W,H);const s=state;
if(s.mode==='ghostSleep'||s.mode==='paused'&&s.resumeMode==='ghostSleep'){const ratio=ghostSleep.naturalWidth/ghostSleep.naturalHeight,iw=Math.max(W,H*ratio),ih=iw/ratio;ctx.drawImage(ghostSleep,(W-iw)/2,(H-ih)/2,iw,ih);rect(0,0,W,H,'#000000'+Math.round(Math.min(.97,Math.max(0,(s.sleepTime-4)/2))*255).toString(16).padStart(2,'0'));if(s.sleepTime>6){label('04:47:00',W/2,H*.43,'#c7d8d5',24);label('SIGNAL INTERRUPTION',W/2,H*.51,'#e0adba',Math.min(16,W/25));label('SECONDARY PRESENCE LOST',W/2,H*.56,'#8babb2',Math.min(13,W/30));}return;}
const wide=s.stage==='home'?Prelude.widths.home:2600;const sofaTalk=s.stage==='apartment'&&(s.mode==='ghostSleep'||sceneMode()==='ghostDialogue'&&['intimacy','late','wake'].includes(s.dialogue));const sceneZoom=1;const cameraFocus=sofaTalk?Ghost.sofa.camera:s.x;camX+=(Math.max(0,Math.min(Math.max(0,wide*sceneZoom-W),cameraFocus*sceneZoom-W*(sofaTalk?.5:.43)))-camX)*(sofaTalk?1:cameraBlend(.08));camY=H<650?800-H*.74:s.stage==='home'?Math.max(205,Math.min(390,s.y-H*.70)):340;boundCamera(wide*sceneZoom);ctx.save();const homeFrameOffset=s.stage==='home'?Math.max(0,(W-Prelude.widths.home)/2):0;ctx.translate(homeFrameOffset-Math.round(camX),-camY);ctx.scale(sceneZoom,sceneZoom);rect(0,0,wide,1300,'#080e18');const im=s.stage==='home'?homeBg:ghostHome,ih=im.naturalWidth?wide*im.naturalHeight/im.naturalWidth:0;const studio=s.stage!=='home'&&ProductionArt.ok('estudio-ghost');if(studio){const original=ProductionArt.images['estudio-ghost'];const art=s.flags.fridgeUsed&&ghostOpenStudioP61.complete&&ghostOpenStudioP61.naturalWidth?ghostOpenStudioP61:original;const artH=wide*art.naturalHeight/art.naturalWidth;ctx.drawImage(art,0,800-artH*(380/683),wide,artH);}else if(ih>0)ctx.drawImage(im,0,800-ih*(s.stage==='home'?600/941:.68),wide,ih);SceneryFinish.floor(wide,800,'domestic',s.time);if(s.mode==='playing')SceneryFinish.interactionAnchor(Ghost.near(s),800,'warm',s.time);// P57: the high-resolution studio background already contains a refrigerator
// at this location. The former 160x270 placeholder was painted ON TOP of it,
// producing the blocky duplicate seen on mobile. Preserve the interactive
// station, but render no second cabinet or low-resolution overlay.
// P59: the studio painting owns its furniture; fridge state stays interactive.

if(ghostMorning()){rect(0,800-ih*(s.stage==='home'?600/941:.68),wide,ih,'#a9bdca27');rect(0,350,wide,450,'#c1cddc10');}else if(['floor','couch','decoded','sleep'].includes(s.phase))rect(0,300,wide,700,'#080e221e');
if(s.stage==='home'){
 // RC48: The illustrated workbench already owns its instruments and radio.
 // Never paste a second module or a floor-mounted communicator over the painting.
 // Ghost stations now refer to those illustrated, physical surfaces.
 window.ScenePropsP61?.draw('ghost',s);
}
else{
ctx.save();ctx.beginPath();ctx.rect(900,260,610,290);ctx.clip();ctx.strokeStyle='#b9d9ee27';ctx.beginPath();const rainTime=matchMedia('(prefers-reduced-motion: reduce)').matches?0:s.time;for(let j=0;j<35;j++){const rx=900+(j*71+rainTime*20)%610,ry=260+(j*39+rainTime*170)%290;ctx.moveTo(rx,ry);ctx.lineTo(rx-3,ry+13);}ctx.stroke();ctx.restore();
window.ScenePropsP61?.draw('ghost',s);
// Studio equipment: props are separate transparent sprites, not a flat collage.
// P59: remove floor-mounted duplicates of radio, terminal and scanner.
// If the painted studio is unavailable, keep one visible terminal as fallback.
if(!studio)ProductionArt.prop('terminal',1850,790,195,.94);
const late=['floor','couch','decoded','sleep'].includes(s.phase);if(!ghostMorning()){const pose=ghostAlexPose();const sits=pose===3;ghostAlexDraw(sits?Ghost.sofa.alexandra:s.alexX,sits?Ghost.sofa.seatY:800,pose);}
// Background already includes the table accessories; no flat-color props.
if(s.phase==='arrival'||s.flags.arrived){ghostAuraDraw(Math.round(s.auraX),800);ctx.save();ctx.translate(Math.round(s.jinxX),800);// Align Jinx's 226px sprite with Sierra/Aura and keep his head clear of the mobile HUD.
actor(0,0,s.jinxFace||1,s.jinxFoot||0,s.jinxMoving,'jinx');ctx.restore();}
if(s.phase==='echo'||s.phase==='call'||s.phase==='team'||s.phase==='ghost'||s.phase==='ready'){if(s.scan||s.dialogue==='replay'){const xs=Ghost.traceX;for(let k=0;k<Math.min(s.trace+1,4);k++){ghostAlexDraw(xs[k],k===0?Ghost.sofa.seatY:800,k===0?3:2,.14+k*.055,true);label(['04:44','04:45','04:46','04:47'][k],xs[k],395,'#8cdbc7',13);}ctx.strokeStyle='#77d6c777';ctx.setLineDash([3,8]);ctx.beginPath();ctx.moveTo(xs[0],792);ctx.lineTo(xs[Math.min(s.trace,3)],792);ctx.stroke();ctx.setLineDash([]);if(s.trace===4)label('TRACE TERMINATED / NO EXIT VECTOR',2250,428,'#eab7bf',11);}}
if(s.phase==='echo'&&s.trace<4){const tx=Ghost.traceX[s.trace];actionHalo(tx,410);label('Q / ECHO · '+['04:44','04:45','04:46','04:47'][s.trace],tx,385,'#e7c79e',13);rect(tx-45,430,90,4,'#294a50');rect(tx-45,430,90*Math.min(1,s.traceProgress/1.2),4,'#b9e0cb');}
}
if(s.stage==='home'&&typeof drawCat==='function')drawCat(338,800);
ghostDrawSierra();
 // The sofa is painted in the environment. No hard-edged rectangle is
 // pasted over the actors' legs; sprite and environment retain their own art.
 // RC48: Painted props own the scene. The HUD displays E / USAR only when
 // the character stands near a concrete station. Do not overlay scene-wide
 // markers, floating labels, or floor-level duplicates.
if(s.mode==='ghostFuture'||s.mode==='paused'&&s.resumeMode==='ghostFuture'){label('CANAL RECUPERADO / ORIGEM NÃO VALIDADA',s.x,375,'#e7b5bd',14);}
ctx.restore();if(s.mode==='ghostFuture')drawGhostCellFeed(s);if(s.glitch>0)signalGlitch();ghostAmbience();}
function drawGhostCellFeed(s){
 // A few recovered CCTV frames. No teleportation and no confirmation Alexandra is safe.
 const t=s.echoTime||0;ctx.save();rect(0,0,W,H,'#01040ae0');
 const margin=Math.max(10,Math.min(35,W*.045)),left=margin,top=Math.max(36,H*.13),fw=W-margin*2,fh=Math.min(H*.69,fw*.65);
 ctx.fillStyle='#09151c';ctx.fillRect(left,top,fw,fh);ctx.strokeStyle='#82bcc0aa';ctx.lineWidth=2;ctx.strokeRect(left,top,fw,fh);
 ctx.save();ctx.beginPath();ctx.rect(left+3,top+3,fw-6,fh-6);ctx.clip();
 const flicker=t>.35&&t<2.75;
 if(flicker){
  const cx=left+fw*.56,fy=top+fh*.93;
  const wall=ctx.createLinearGradient(left,top,left+fw,top+fh);wall.addColorStop(0,'#202e3a');wall.addColorStop(1,'#0b121a');ctx.fillStyle=wall;ctx.fillRect(left,top,fw,fh);
  ctx.fillStyle='#303744';ctx.fillRect(left+fw*.12,top,fw*.08,fh);ctx.fillRect(left+fw*.81,top,fw*.05,fh);
  ctx.fillStyle='#080d17';ctx.fillRect(left+fw*.04,top+fh*.82,fw*.92,fh*.19);
  // Alexandra sits on the far end of a concrete cell; physically contained in the frame.
  ctx.save();ctx.translate(cx,fy);ctx.filter='grayscale(1) contrast(1.25)';
  if(!window.NeoActors?.draw('alexandra',4,fh*.55)&&ghostAlexWalk.complete&&ghostAlexWalk.naturalWidth){const unit=fh*.55/628;ctx.drawImage(ghostAlexWalk,0,0,424,700,-212*unit,-672*unit,424*unit,700*unit);}
  ctx.filter='none';ctx.restore();
  ctx.strokeStyle='#10151ec9';ctx.lineWidth=Math.max(6,fw*.013);for(const bx of [.27,.40,.73,.84]){ctx.beginPath();ctx.moveTo(left+fw*bx,top-10);ctx.lineTo(left+fw*(bx+.012),top+fh+10);ctx.stroke();}
  ctx.fillStyle='#a6c5c688';for(let j=0;j<23;j++){const scanY=top+((j*43+t*177)%fh);ctx.fillRect(left,scanY,fw,1);}
  if(t>1.86){ctx.fillStyle='#111826c9';ctx.fillRect(left,top+fh*.50,fw,fh*.11);}
 }else{ctx.fillStyle='#18212d';for(let i=0;i<75;i++){const xx=left+(i*104.7+Math.floor(t*24))%fw,yy=top+(i*61.3)%fh;ctx.fillRect(xx,yy,Math.max(1,fw*.002),2);}}
 ctx.restore();ctx.font=`bold ${Math.max(10,Math.min(18,W*.017))}px monospace`;ctx.textAlign='left';ctx.fillStyle='#d1e3e9';ctx.fillText('CAM 03 / SETOR 0  ·  QUADRO NÃO AUTENTICADO',left+18,top+27);
 ctx.textAlign='right';ctx.fillStyle='#ff687c';ctx.fillText(t<2.75?'● REC  /  04:47:08':'SINAL PERDIDO',left+fw-18,top+27);
 ctx.textAlign='center';ctx.fillStyle='#fae8f0';ctx.font=`bold ${Math.max(18,Math.min(33,W*.04))}px Georgia`;ctx.fillText(t<2.75?'SIERRA: Espera...':'FOI ISSO QUE ELA VIU?',W*.5,Math.min(H-25,top+fh+45));
 ctx.restore();
}
function ghostAmbience(){if(!sound||document.hidden||state.mode==='paused'||ghostMorning())return;const n=Math.floor(state.time/1.4);if(n===ghostLastBeat)return;ghostLastBeat=n;if(state.stage==='apartment')beep([130.81,164.81,196,146.83][n%4],.5,'triangle',.006);}
function ghostObjective(){const s=state;if(s.mode==='ghostDialogue'&&['intimacy','late'].includes(s.dialogue))return 'Escute Alexandra. A investigação pode esperar um instante.';return s.stage==='home'?s.flags.invited?'Saia de casa; Jinx fará a chamada combinada':'Leia a mensagem no comunicador':({explore:'Explore a casa e examine a mesa de áudio',mix:'Separe os seis canais na mesa de áudio',work:'Confira a cópia no arquivo de fitas à direita',floor:'Volte à mesa de áudio e confira os intervalos',couch:'Converse com Alexandra sem interromper a noite',decoded:'Sente-se com Alexandra depois da investigação',missing:'Confira porta, banheiro, quarto e pertences; volte ao sofá',echo:s.trace<4?'Siga os quatro vestígios com Q / SCAN':'Recalibre a leitura junto à parede',call:'Use o terminal para chamar Jinx',arrival:'Aguarde Aura e Jinx; preserve os vestígios',team:'Mostre o ECHO junto à parede',ghost:'Abra GHOST_TRACK_47 na mesa de áudio',ready:!s.flags.alexLogRead?'Converse com Aura; opcional: confira o último buffer que Alex deixou na mesa':'Converse com Aura junto à parede'}[s.phase]||'Acompanhe a cena');}
function updateGhostUI(){$('missionChapter').textContent='CAPÍTULO 6 / GHOST TRACK';$('health').textContent='▰ ▰ ▰';$('energy').style.width='100%';$('clues').textContent=(Ghost.clocks[state.phase]||'04:47')+' / '+(state.stage==='home'?'CASA DE SIERRA':ghostMorning()?'APARTAMENTO / SEM ALEXANDRA':'CASA DE ALEXANDRA');$('objective').textContent=ghostObjective();$('alert').style.display='none';const o=Ghost.near(state);$('hint').textContent=o?'E / USAR · '+o.name:'';$('hint').style.display=o&&state.mode==='playing'?'block':'none';$('game').classList.toggle('ghost-talking',state.mode!=='playing');$('ghostJournal').classList.toggle('hidden',state.chapter!==6);if(performance.now()>radioUntil)$('radio').style.display='none';}
function GhostResponseWithoutDuplicateSpeaker(text,who){
 const label=String(who||'').trim(),value=String(text??'');
 if(!label)return value;
 return value.toUpperCase().startsWith(label.toUpperCase()+':')?value.slice(label.length+1).trimStart():value;
}
function renderGhostDialogue(){
 clearControl();$('radio').style.display='none';
 const lines=GhostStory?.[state.dialogue];
 const b=lines?.[state.dialogueStep];
 const box=$('ghostDialogue');
 // Preserve the checkpoint rather than crashing or inventing a substitute line.
 if(!b||typeof b.line!=='string'||!Array.isArray(b.choices)||b.choices.length!==3){
  console.error('[GHOST TRACK] dialogue entry unavailable',state.dialogue,state.dialogueStep);
  box.classList.add('hidden');state.mode='playing';state.useWas=true;
  radio('LENTE / REGISTRO LOCAL','O trecho do diálogo não pôde ser carregado. A investigação permanece neste ponto.',9);
  return;
 }
 const displayed=state.response===null?null:(window.DialogueDirector?.response?.(state.response,b.who)||{speaker:b.who,text:GhostResponseWithoutDuplicateSpeaker(state.response,b.who)});box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>'+(displayed?.speaker||b.who)+'</span><small>'+Ghost.clocks[state.phase]+'</small></div>'+(state.response===null?(b.aside?'<p class="club-aside">'+b.aside+'</p>':'')+'<p class="club-line">'+(window.DialogueDirector?.line(b.line,state,state.dialogue+':'+state.dialogueStep)??b.line).replace(/\n/g,'<br>')+'</p><div class="club-choices">'+b.choices.map((c,i)=>'<button id="ghostAnswer'+i+'"><span>'+(i+1)+'</span>'+c[0]+'</button>').join('')+'</div>':'<p class="club-line">'+displayed.text+'</p><button class="club-next" id="ghostNext">CONTINUAR</button>')+'<p class="club-help">'+(state.response===null?'1, 2, 3 · Responder':'Enter / E · Continuar')+'</p>';if(state.response===null)for(let i=0;i<3;i++)$('ghostAnswer'+i).onclick=()=>ghostChoose(i);else $('ghostNext').onclick=ghostAdvance;if(state.response===null)StoryContinuity.render(box,6,state.dialogue,state.dialogueStep);box.scrollTop=0;ownChapterUI('ghostDialogue');window.DialogueDirector?.attach(box,state);box.classList.toggle('ghost-sofa-compact',state.stage==='apartment'&&['intimacy','late'].includes(state.dialogue));}
const ghostChannelNames=['Bateria','Baixo','Sintetizadores','Voz','Ruído','Portadora ultrassônica'];
function openGhostPuzzle(){clearControl();if(state.puzzleKind==='ghost'){openGhostEchoDeduction();return;}const box=$('ghostPuzzle');box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>'+ (state.puzzleKind==='ghost'?'GHOST_TRACK_47 / 04:47':'SESSÃO / CÓPIA LOCAL')+'</span><small>ORIGINAL PRESERVADO</small></div><h2>'+ (state.puzzleKind==='ghost'?'Uma faixa que não estava aqui.':'O que ficou fora dos monitores.')+'</h2><p>A gravação contém algo que não acompanha a música. Use SCAN. A faixa de dados é diferente dos cinco canais musicais: isole-a com um comando ou ajuste manualmente os canais. Você trabalha numa cópia; frequências ultrassônicas são apenas visualizadas.</p><canvas id="ghostSpectrum" width="680" height="170" aria-label="Visualização dos seis canais e da portadora de dados"></canvas><button id="ghostScan" class="club-next">Q / SCAN · ANALISAR ESPECTRO</button><button id="ghostIsolate" class="club-next">ISOLAR O SINAL QUE NÃO É MÚSICA</button><div class="ghost-channels">'+ghostChannelNames.map((n,i)=>'<button id="ghostChannel'+i+'" aria-pressed="'+state.channels[i]+'">'+n+'</button>').join('')+'</div><p id="ghostMixStatus" role="status"></p><div class="wave-actions"><button id="ghostDecode">RECONSTRUIR DADOS</button><button id="ghostHelp">PEDIR UMA PISTA</button><button id="ghostBack">VOLTAR À SALA</button></div>';let helpStep=0;$('ghostIsolate').onclick=()=>{if(state.mode!=='ghostPuzzle')return; if(!state.flags.spectrum){$('ghostMixStatus').textContent='Primeiro faça a leitura com Q / SCAN; depois isole o canal não musical.';return;}state.channels=[false,false,false,false,false,true];for(let i=0;i<6;i++)$('ghostChannel'+i).setAttribute('aria-pressed',String(state.channels[i]));paintGhostSpectrum();};$('ghostHelp').onclick=()=>{const hints=['ALEX: O sinal que procuramos não acompanha o ritmo. Tenta ouvir menos coisas de uma vez.','ALEX: Os monitores não reproduzem todas as frequências do arquivo. Olha o último canal.','ALEX: Compara a forma que parece transmitir dados com a que acompanha a música. O que sobra quando você isola a primeira?'];$('ghostMixStatus').textContent=hints[Math.min(helpStep++,2)];};for(let i=0;i<6;i++)$('ghostChannel'+i).onclick=()=>{state.channels[i]=!state.channels[i];$('ghostChannel'+i).setAttribute('aria-pressed',String(state.channels[i]));paintGhostSpectrum();if(sound&&i<5&&state.channels[i])beep([160,65,220,330,95][i],.1,'triangle',.008);};$('ghostScan').onclick=()=>{if(state.mode!=='ghostPuzzle')return;state.flags.spectrum=true;paintGhostSpectrum();};$('ghostDecode').onclick=()=>{if(state.mode!=='ghostPuzzle')return;if(!state.flags.spectrum||!Ghost.isolated(state)){$('ghostMixStatus').textContent='Ainda não há um sinal legível. Analise o espectro e compare o desenho ao alternar os canais.';return;}$('ghostPuzzle').classList.add('hidden');if(state.puzzleKind==='ghost'){Ghost.speak(state,'packet');}else Ghost.solve(state);ghostEvents();};$('ghostBack').onclick=()=>{if(state.mode!=='ghostPuzzle')return;$('ghostPuzzle').classList.add('hidden');state.mode='playing';state.useWas=true;clearControl();};paintGhostSpectrum();ownChapterUI('ghostPuzzle');}
// The second visit to the audio terminal is not a repeat of the six-channel mixer.
// The player now interprets the ECHO timeline they just reconstructed.
function openGhostEchoDeduction(){
 const box=$('ghostPuzzle');box.classList.remove('hidden');$('radio').style.display='none';
 const samples=['04:44','04:45','04:46','04:47','04:48'];
 const labels=['VETOR +0.8','VETOR +1.2','VETOR +0.1','VETOR ∅','AMOSTRA ∅'];
 let selected=null,attempts=0;
 box.innerHTML='<div class="club-dialogue-top"><span>ECHO / QUADRO DE TEMPO</span><small>LEITURA LOCAL · INTEGRIDADE 87%</small></div><h2>Onde o rastro deixou de existir?</h2><p>Dois registros ausentes podem significar coisas diferentes. Compare o último quadro com movimento, a primeira leitura sem vetor e o primeiro instante sem amostra. A parede não tem passagem.</p><div class="ghost-echo-bins">'+samples.map((v,i)=>'<button type="button" class="ghost-echo-bin" data-echo="'+i+'"><b>'+v+'</b><small>'+labels[i]+'</small></button>').join('')+'</div><p class="ghost-inference-label">Qual hipótese explica melhor os registros?</p><div id="ghostHypotheses" class="ghost-inference-options" role="group" aria-label="Hipóteses do desaparecimento"><button type="button" data-theory="0">Ela saiu pela porta, fora do alcance da lente.</button><button type="button" data-theory="1">O rastro termina na parede, sem trajeto de saída.</button><button type="button" data-theory="2">A gravação foi interrompida antes de ela acordar.</button></div><p id="echoDeductionStatus" role="status">Consulte os registros do caderno (J). Selecione o horário e uma hipótese.</p><div class="wave-actions"><button id="ghostValidateEcho">CONFRONTAR EVIDÊNCIAS</button><button id="ghostBack">VOLTAR À SALA</button></div>';
 let theory=null;
 const status=box.querySelector('#echoDeductionStatus');
 box.querySelectorAll('[data-echo]').forEach((button,i)=>button.onclick=()=>{selected=i;box.querySelectorAll('[data-echo]').forEach(el=>el.classList.toggle('ghost-selected',el===button));status.textContent='Horário '+samples[i]+' marcado. Qual hipótese os outros vestígios sustentam?';});
 box.querySelectorAll('[data-theory]').forEach((button,i)=>button.onclick=()=>{theory=i;box.querySelectorAll('[data-theory]').forEach(el=>el.classList.toggle('ghost-selected',el===button));});
 box.querySelector('#ghostValidateEcho').onclick=()=>{
  if(state.mode!=='ghostPuzzle')return;
  if(selected===null||theory===null){status.textContent='Marque um instante e uma hipótese antes de concluir.';return;}
  if(selected!==3||theory!==1){attempts++;state.flags.echoAttempts=(state.flags.echoAttempts||0)+1;
   status.textContent=attempts<2?'A hipótese não explica o conjunto das evidências. Compare a porta trancada, a parede e a diferença entre vetor ausente e amostra ausente.':'O caderno registra movimento até 04:46; às 04:47 não há vetor e às 04:48 já não existe amostra. A porta permanece trancada.';return;
  }
  state.flags.echoTheory='transfer-without-exit';state.flags.spectrum=true;
  Ghost.note(state,'inference','Hipótese confrontada · 04:47','04:46 ainda registra deslocamento; 04:47 apresenta ausência de vetor, não uma rota até a porta. A primeira amostra totalmente ausente é posterior. É uma inferência apoiada nos vestígios, não prova da causa.');
  box.classList.add('hidden');Ghost.speak(state,'packet');ghostEvents();
 };
 box.querySelector('#ghostBack').onclick=()=>{if(state.mode!=='ghostPuzzle')return;box.classList.add('hidden');state.mode='playing';state.useWas=true;clearControl();};
 ownChapterUI('ghostPuzzle');
}
function paintGhostSpectrum(){const c=$('ghostSpectrum'),g=c.getContext('2d');g.fillStyle='#07101b';g.fillRect(0,0,680,170);if(!state.flags.spectrum){g.fillStyle='#8b9aab';g.font='15px monospace';g.fillText('SCAN / aguardando análise',30,90);$('ghostMixStatus').textContent='O espectro ainda não foi lido.';return;}const colors=['#9b798d','#667d9d','#b1a57f','#aa8cba','#71898e','#92efd3'];for(let k=0;k<6;k++)if(state.channels[k]){g.strokeStyle=colors[k];g.lineWidth=k===5?2:1;g.beginPath();for(let x=0;x<680;x++){let y=85+Math.sin(x*(.022+k*.018)+k)*(k===5?27:12+k*3);if(k===5&&Ghost.isolated(state))y=60+(Math.floor(x/85)%3)*25;g[x?'lineTo':'moveTo'](x,y);}g.stroke();}const ok=Ghost.isolated(state);if(ok){g.strokeStyle='#bce8d3';g.fillStyle='#bce8d3';for(let k=0;k<6;k++){const x=70+k*108,y=45+(k%3)*35;g.fillRect(x-4,y-4,8,8);if(k){g.beginPath();g.moveTo(x-108,45+((k-1)%3)*35);g.lineTo(x,y);g.stroke();}}} $('ghostMixStatus').textContent=ok?'Portadora isolada. Estrutura não musical detectada. Pode reconstruir.':'Cinco canais acompanham a música; o sexto contém pulsos de dados. Use ISOLAR O SINAL ou faça a seleção manual.';}
function ghostNotes(){if(state.mode==='paused'||state.mode==='won')return;if(state.mode==='ghostNotes'){state.mode=state.notesReturn;$('ghostNotes').classList.add('hidden');clearControl();return;}state.notesReturn=state.mode;state.mode='ghostNotes';clearControl();const box=$('ghostNotes');box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>CADERNO / CÓPIA LOCAL</span><button id="ghostNotesClose">FECHAR</button></div><h2>O que sabemos.</h2>'+(state.journal.length?state.journal.map(n=>'<article><h3>'+n.title+'</h3><p>'+n.text+'</p></article>').join(''):'<p>A investigação ainda não tem registros.</p>');$('ghostNotesClose').onclick=ghostNotes;ownChapterUI('ghostNotes');}
function ghostEnding(){showPanel('Ghost<br><em>Track.</em>','CAPÍTULO 6 CONCLUÍDO<br><br>Sierra acertou a sintonia por um instante: uma câmera de segurança mostrou Alexandra dentro de uma cela. Apenas segundos; o canal caiu antes que pudesse verificar a origem, a data ou se ela ainda está lá. É uma pista, não prova de resgate.<br><br>QUADRO RECUPERADO: <strong>04:47:08 / CAM 03</strong>.<br>INTEGRIDADE: <strong>NÃO AUTENTICADA</strong>.<br><br>PRÓXIMO CAPÍTULO · 47 MINUTOS','CONTINUAR · 47 MINUTOS',()=>ChapterCurtain.to(7,beginInterval));}
/* RC37: optional, local-only post-disappearance terminal. Never blocks main campaign. */
function renderAlexandraTerminal(){
 if(state.chapter!==6||state.mode!=='ghostTerminal')return;
 clearControl();$('radio').style.display='none';
 const box=$('ghostPuzzle');box.classList.remove('hidden');box.classList.add('rc37-terminal');
 const options=RC37Adaptation.terminalOptions;
 box.replaceChildren();
 const header=document.createElement('div');header.className='club-dialogue-top';header.innerHTML='<span>TERMINAL / ALEXANDRA</span><small>BUFFER LOCAL · 04:47</small>';box.append(header);
 const heading=document.createElement('h2');heading.textContent='O último buffer que Alexandra preservou.';box.append(heading);
 const memo=document.createElement('p');memo.className='club-aside';memo.textContent='INVESTIGAÇÃO OPCIONAL / Este computador guardou uma cópia local feita por Alexandra, antes de desaparecer. O ECHO mostrou um rastro sem saída; aqui há apenas os carimbos de tempo e uma nota sem autoria confirmada: “Não recalcule a ponte.” Você pode isolar, extrair ou selar a cópia. Nenhuma dessas opções altera a rota principal. BUFFER 04:47 · INTEGRIDADE 88%.';box.append(memo);
 const row=document.createElement('div');row.className='club-choices';
 options.forEach((option,i)=>{const b=document.createElement('button');b.type='button';b.textContent=(i+1)+'  '+option.label;b.onclick=()=>{
  if(state.chapter!==6||state.mode!=='ghostTerminal')return;
  const result=RC37Adaptation.terminal(state,i);if(!result)return;
  Ghost.note(state,'terminal-alexandra','Nota preservada · 04:47',memo.textContent+' / Decisão: '+option.label);
  row.remove();memo.textContent=result.text;
  heading.textContent=result.who;
  const next=document.createElement('button');next.className='club-next';next.textContent='VOLTAR À INVESTIGAÇÃO';next.onclick=close;box.append(next);ownChapterUI('ghostPuzzle');
 };row.append(b);});box.append(row);
 const close=()=>{if(state.chapter!==6||state.mode!=='ghostTerminal')return;state.mode='playing';state.useWas=true;clearControl();box.classList.add('hidden');box.classList.remove('rc37-terminal');box.replaceChildren();};
 const exit=document.createElement('button');exit.className='club-next';exit.textContent='DEIXAR PARA DEPOIS';exit.onclick=close;box.append(exit);
 ownChapterUI('ghostPuzzle');
}
function ghostEvents(){for(const e of state.events.splice(0)){if(e.type==='terminal')renderAlexandraTerminal();if(e.type==='dialogue')renderGhostDialogue();if(e.type==='puzzle')openGhostPuzzle();if(e.type==='radio')radio(e.who,e.line,8);if(e.type==='ending')ghostEnding();if(e.type==='phase'){clearControl();$('radio').style.display='none';}}}
$('ghostJournal').onclick=ghostNotes;
qaListen(window,'keydown',e=>{if(e.target?.closest?.('.dialogue-auto'))return;if(['Enter','Space'].includes(e.code)&&e.target?.closest?.('.rc36-toggle'))return;if(state.chapter!==6||state.mode==='paused')return;if(e.code==='KeyJ'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)ghostNotes();return;}if(state.mode==='ghostDialogue'){const i=['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].indexOf(e.code)%3;const focused=e.target?.closest?.('#ghostDialogue .club-choices button');const focusIndex=focused&&/^ghostAnswer[0-2]$/.test(focused.id)?Number(focused.id.slice(-1)):-1;if(i>=0||['KeyE','Enter','Space'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(i>=0)ghostChoose(i);else if(state.response===null&&focusIndex>=0&&['Enter','Space'].includes(e.code))ghostChoose(focusIndex);else if(state.response!==null)ghostAdvance();}}else if(state.mode==='ghostPuzzle'&&['KeyQ','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)$(e.code==='KeyQ'?'ghostScan':'ghostBack')?.click();}else if(state.mode==='ghostNotes'&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();ghostNotes();}},true);
ghostReady();

const ghostSierra=new Image(),ghostSierraTiles=[];
ghostSierra.onload=()=>{const cw=ghostSierra.naturalWidth/3;for(let k=0;k<3;k++){const c=document.createElement('canvas');c.width=cw;c.height=ghostSierra.naturalHeight;c.getContext('2d').drawImage(ghostSierra,k*cw,0,cw,c.height,0,0,cw,c.height);const p=clubTrim(c);p.im=c;ghostSierraTiles.push(p);}ghostLoaded();};ghostSierra.src='sierra-casual.png';ghostSierra.onerror=()=>{ghostFailed=true;ghostReady();};
function ghostDrawSierra(){const s=state,seated=(s.mode==='ghostSleep'&&s.phase==='sleep')||(sceneMode()==='ghostDialogue'&&['intimacy','late','wake'].includes(s.dialogue));if(seated){
 ctx.save();ctx.translate(Ghost.sofa.sierra,Ghost.sofa.seatY);ctx.scale(1,1);
 if(window.NeoActors?.draw('sierra',4,226)){ctx.restore();return;}
 ctx.restore();const p=ghostSierraTiles[0];if(p){const h=183,w=h*p.w/p.h;ctx.drawImage(p.im,p.x,p.y,p.w,p.h,Ghost.sofa.sierra-w/2,Ghost.sofa.seatY-h,w,h);}return;
}if(s.stage==='apartment'&&!ghostMorning()){
 if(s.mode==='playing'&&s.reachT>0&&['fridge','jacket','desk','tapes','records'].includes(s.reachTarget)&&window.NeoActors){ctx.save();ctx.translate(s.x,800);ctx.scale(s.face||1,1);if(NeoActors.draw('sierra',6,226)){ctx.restore();return;}ctx.restore();}
 ctx.save();ctx.translate(Math.round(s.x),800);ctx.scale(s.face,1);const reconstructed=window.NeoActors?.draw('sierra',NeoActors.frame('sierra',Math.abs(s.vx)>0,s.foot,'',s.grounded===false),226);ctx.restore();if(reconstructed)return;
 const p=ghostSierraTiles[2];if(!p)return;const h=226,w=h*p.w/p.h;ctx.save();ctx.translate(s.x,800-(Math.abs(s.vx)?Math.abs(Math.sin(s.foot))*2:0));ctx.scale(s.face,1);ctx.drawImage(p.im,p.x,p.y,p.w,p.h,-w/2,-h,w,h);ctx.restore();return;}ctx.save();ctx.translate(s.x,800);const scale=1;ctx.scale(scale,scale);actor(0,0,s.face,s.foot,Math.abs(s.vx)>0);ctx.restore();}
