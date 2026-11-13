'use strict';
const clubImage=new Image(),backstageImage=new Image(),escapeSceneImage=new Image(),alexImage=new Image(),alexTiles=[];
escapeSceneImage.src='assets/visual-v105/service-corridor.png';let clubAssets=0,clubFailed=false,lastClubBeat=-1;
function clubReady(){const b=$('chapterFive');if(!b)return;if(clubFailed){b.disabled=false;b.textContent='RECARREGAR ZONA CEGA';b.onclick=()=>location.reload();return;}b.disabled=clubAssets<5||!ready||lifeLoaded<2;b.onclick=beginClub;}
function clubAssetLoaded(){clubAssets++;clubReady();}
clubImage.onload=clubAssetLoaded;clubImage.src='assets/visual-v5/club-v5.png';backstageImage.onload=clubAssetLoaded;backstageImage.src='assets/visual-v5/backstage-v5.png';
alexImage.onload=()=>{
 const cw=alexImage.naturalWidth/3,ch=alexImage.naturalHeight/2;
 for(let k=0;k<6;k++)alexTiles.push(figureMetrics(alexImage,k%3*cw,Math.floor(k/3)*ch,cw,ch));
 const h=Math.max(...alexTiles.map(p=>p.h));for(const p of alexTiles)p.standing=h;
 clubAssetLoaded();};alexImage.src='alexandra.png';
for(const im of [clubImage,backstageImage,alexImage])im.onerror=()=>{clubFailed=true;const b=$('chapterFive');if(b){b.disabled=false;b.textContent='RECARREGAR ZONA CEGA';b.onclick=()=>location.reload();}};
function beginClub(){if(clubFailed||clubAssets<5||!ready||lifeLoaded<2){showPanel('Zona<br><em>cega.</em>','O cenário está carregando.','ENTRAR NO CAPÍTULO 5',beginClub);return;}StoryContinuity.capture(state);const prior=state.chapter===4?state.ending:state.chapter===5?state.previous:'study';leaveTerrace();clearControl();$('prologueUI').classList.add('hidden');$('conversationBox').classList.add('hidden');$('game').classList.remove('cinematic','prelude');$('game').classList.add('club-mode');document.querySelector('.hud').style.opacity='1';$('overlay').classList.add('hidden');$('overlay').classList.remove('encounter','hacking');$('pause').textContent='Ⅱ';$('radio').style.display='none';$('clubPuzzle').classList.add('hidden');state=Club.create(prior);camX=0;camY=350;lastClubBeat=-1;Club.speak(state,'brief');clubEvents();updateUI();window.SceneDirector?.enter(5);}
function drawAlex(x,y,masked=false){
 const mode=sceneMode(),line=typeof ClubStory!=='undefined'?ClubStory[state.dialogue]?.[state.dialogueStep]:null;
 const speaking=mode==='clubDialogue'&&state.response===null&&line?.who==='ALEXANDRA';
 const p=alexTiles[masked?5:speaking?1:0];if(!p)return;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(state.x<x?-1:1,1);drawFigure(p,218);ctx.restore();
}
function clubMusic(){if(!sound||document.hidden||state.mode==='paused'||state.mode==='won')return;const b=Math.floor(state.time/.48);if(b===lastClubBeat)return;lastClubBeat=b;if(state.stage==='club'){beep(b%4===0?55:110,.13,'sine',.016);if(b%2===0)beep([220,261.63,329.63,293.66][Math.floor(b/4)%4],.28,'triangle',.009);}else if(state.stage==='booth'&&b%4===0)beep(55,.18,'sine',.006);}
function drawClubPursuit(s){
 const chase=s.pursuit;if(!chase)return;
 // All enemies are upright and anchored by their boots at the same floor.
 for(const guard of chase.guards){
   if(guard.x<camX-120||guard.x>camX+W+120)continue;
   ctx.save();
   const direction=s.x<guard.x?-1:1;
   ctx.translate(Math.round(guard.x),800);ctx.scale(direction,1);
   ctx.fillStyle='#050a1688';ctx.beginPath();ctx.ellipse(0,2,34,5,0,0,Math.PI*2);ctx.fill();
   // Images use an alpha-trimmed bounding box; no transparent padding is laid
   // across the floor and no cut-out head is pasted outside a body.
   drawClubGuard(0,0);
   if(guard.flash>0){
     ctx.fillStyle='#ffe7bb';ctx.beginPath();ctx.arc(52,-108,6+guard.flash*25,0,Math.PI*2);ctx.fill();
     ctx.strokeStyle='#ffb07b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,-108);ctx.lineTo(82,-109);ctx.stroke();
   }
   ctx.restore();
 }
 for(const bullet of chase.shots){
   if(bullet.x<camX-40||bullet.x>camX+W+40)continue;
   ctx.strokeStyle='#ff8d95';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bullet.x,bullet.y);ctx.lineTo(bullet.x-bullet.vx*.035,bullet.y);ctx.stroke();
   ctx.fillStyle='#fff4cf';ctx.fillRect(bullet.x-2,bullet.y-2,4,4);
 }
 if(chase.flash>0){
   ctx.save();ctx.globalAlpha=chase.flash*.9;ctx.strokeStyle='#7cf2e4';ctx.lineWidth=5;
   ctx.beginPath();ctx.arc(s.jinxX,704,39+Math.sin(s.time*19)*4,-1.8,1.4);ctx.stroke();ctx.restore();
 }
 // Steady readable companion marker. Never draw a giant floating portrait.
 // Combat feedback belongs to the shield HUD, not a label above Jinx.
}
function drawClubPursuitHUD(s){
 const chase=s.pursuit;if(!chase)return;
 ctx.save();const w=Math.min(170,W*.27),x=innerWidth<600?18:W-w-24,y=H-42;
 ctx.fillStyle='#06131dbd';ctx.fillRect(x-9,y-16,w+18,41);
 ctx.strokeStyle='#78b9c657';ctx.strokeRect(x-9,y-16,w+18,41);
 ctx.font='12px monospace';ctx.fillStyle='#e7f6fa';ctx.textAlign='left';
 ctx.fillText('JINX / COBERTURA',x,y-3);
 ctx.fillStyle='#23434e';ctx.fillRect(x,y+9,w,7);
 ctx.fillStyle='#76e5d2';ctx.fillRect(x,y+9,w*(chase.shield/4),7);
 ctx.restore();
}
function drawClub(){ctx.clearRect(0,0,W,H);const s=state;if(s.stage==='drive'){drawClubDrive();return;}const wide=Club.width[s.stage];camX+=(Math.max(0,Math.min(Math.max(0,wide-W),s.x-W*(s.stage==='club'&&W<560?.60:.38)))-camX)*cameraBlend(.08);camY+=((H<650?Math.max(205,s.y-H*.74):Math.max(205,Math.min(390,s.y-H*.70)))-camY)*cameraBlend(.05);boundCamera(wide);ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY));const im=['club','raid'].includes(s.stage)?clubImage:s.stage==='booth'?backstageImage:(escapeSceneImage.complete&&escapeSceneImage.naturalWidth?escapeSceneImage:backstageImage);const ih=wide*im.naturalHeight/im.naturalWidth;ctx.drawImage(s.scan&&s.stage==='escape'?spectralImage(im):im,0,800-ih*(s.stage==='escape'?.54:.61),wide,ih);SceneryFinish.practical(s.stage==='booth'?'booth':'club',s.time);SceneryFinish.floor(wide,800,s.stage==='booth'?'domestic':'industrial',s.time);window.P52SceneDirection?.club(ctx,s.stage,wide,s.time,s);if(s.mode==='playing')SceneryFinish.interactionAnchor(Club.near(s),800,s.stage==='booth'?'warm':'cool',s.time);
window.ScenePropsP61?.draw('club',s);if(['club','raid'].includes(s.stage)){
 // The crowd lives on the dance floor, never in the evacuation corridor.
 if(s.stage==='club'){
  const gentle=matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.sin(s.time*2);
  for(let k=0;k<4;k++){ctx.save();ctx.globalAlpha=.026+gentle*.012;ctx.fillStyle=k%2?'#ec64cf':'#4edcfc';ctx.beginPath();ctx.moveTo(650+k*600,190);ctx.lineTo(430+k*600+gentle*35,790);ctx.lineTo(890+k*600+gentle*35,790);ctx.closePath();ctx.fill();ctx.restore();}
  for(const guest of ClubCrowd.visitors)citizen({...guest,face:guest.x%2?1:-1},800,false);
  drawAlex(2520,800,!s.flags.met&&!(s.dialogue==='meet'&&sceneMode()==='clubDialogue'));
  citizen({id:'bartender',x:1230,sprite:4,h:206},800);
 }else{
  // The short evacuation shows only Sierra, Jinx and the advancing patrol.
  // Alexandra stays inside at her console; she is heard over the local radio.
  ctx.save();ctx.fillStyle='#06101d7d';ctx.fillRect(camX,camY,W,H);ctx.restore();
  if(s.mode==='playing'&&s.pursuit?.time<4)label('SAÍDA DE SERVIÇO',3160,560,'#c1e4e8',12);
 }
 if(!s.flags.gate&&s.stage==='club'){
  rect(760,520,8,280,'#e17ea766');
  if(s.mode==='playing'&&Math.abs(s.x-760)<260)label(s.hold>0?'JINX / SEGURANDO':'TRAVA SOLDADA',760,560,'#deb995',12);
 }
 actor(s.jinxX,800,s.jinxFace||1,s.jinxFoot||0,s.jinxMoving,'jinx');
}
if(s.stage==='booth'){drawAlex(s.alexX,800);prop(2,410,780,86);prop(3,810,680,61);prop(5,1230,800,180);if(!s.flags.module){rect(1717,703,28,16,'#35435a');rect(1721,706,20,3,'#7be8cf');}if(s.flags.correlated)label('CORRELAÇÃO / 31%',1230,585,'#e9b991',13);}
if(s.stage==='escape'){
 // One physically consistent service corridor. The architecture from the
 // provided concept artwork is embedded in the wall, not floating over play.
 // The latch scanner remains a real interaction, not a painted tooltip.
 if(!(escapeSceneImage.complete&&escapeSceneImage.naturalWidth))drawEscapeBulkhead(1530,800,!s.flags.latch,s.time);
 if(s.flags.latch&&s.mode==='playing'&&Math.abs(s.x-1370)<185)
  label('PORTA ABERTA',1370,558,'#9bf1d5',12);
 // V10.6: physically plausible 1980s Cadillac next to 278-unit Jinx.
 // Keep the exit hotspot at x=2630; car size must never change collision/mission state.
 drawCadillac(2500,800,760);
 if(s.mode==='playing'&&Math.abs(s.x-2630)<285)label('CADILLAC 80 / EMBARQUE',2525,560,'#c9ede5',12);
 actor(s.jinxX,800,s.jinxFace||1,s.jinxFoot||0,s.jinxMoving,'jinx');
}
if(s.stage==='raid'||s.stage==='escape'){
 drawClubPursuit(s);
 if((s.pursuit?.time||0)<6){
   label('CORRER / SHIFT     ABAIXAR / S',Math.max(camX+W/2,Math.min(wide-W/2,s.x)),495,'#bdd7d9',11);
 }
 }
const o=Club.near(s);if(o){const y=o.id==='alex'||o.id==='bar'?550:o.id==='photo'?580:600;actionHalo(o.x,y);if(s.mode==='playing'&&(o.id!=='alex'||s.flags.met))label(o.name,o.x,y-24,'#f1d3a1',13);}
ctx.save();if(s.crouch){ctx.translate(0,s.y*.38);ctx.scale(1,.62);}actor(s.x,s.y,s.face,s.foot,Math.abs(s.vx)>0);ctx.restore();if(s.scan&&s.stage==='club'){ctx.strokeStyle='#cd89bf66';ctx.setLineDash([4,7]);for(let k=0;k<5;k++)ctx.strokeRect(s.x-170+k*77,580+(k%2)*22,65,180);ctx.setLineDash([]);label(s.x>2350&&s.x<2660?'SUBJECT NOT REGISTERED':'NETWORK SATURATION / 47 IDENTITIES / 0 VERIFIED',s.x,camY+150,'#f0b4d2',12);}if(o&&['gate','latch'].includes(o.id)&&!s.flags[o.id+'Read']){const v=Math.min(1,(s.progress[o.id]||0)/.80);rect(o.x-40,640,80,4,'#163c42');rect(o.x-40,640,80*v,4,s.scan?'#8ce1d5':'#42656b');if(s.scan)label('SCAN / '+Math.round(v*100)+'%',o.x,625,'#a4f3e8',11);}ctx.restore();if((s.stage==='raid'||s.stage==='escape')&&s.mode==='playing')drawClubPursuitHUD(s);if(s.glitch>0)signalGlitch();clubMusic();}
function updateClubUI(){const s=state;updateNPCJournal();$('missionChapter').textContent='CAPÍTULO 5 / ZONA CEGA';$('health').textContent='▰ '.repeat(s.hp)+'▱ '.repeat(Math.max(0,3-s.hp));$('energy').style.width=s.energy+'%';$('clues').textContent=s.stage==='club'?'PÍER AZUL / 23:43':s.stage==='booth'?'ENLACE EXTERNO / OFFLINE':s.stage==='raid'?'GUARDA / BUSCA POR SIERRA':s.stage==='drive'?'SIERRA + JINX / A BORDO':'JINX / COM VOCÊ';$('objective').textContent=s.stage==='club'?(!s.flags.gate?'Abra a passagem com Jinx':!s.flags.met?'Encontre a DJ na pista':'Entre na cabine ao fim da pista'):s.stage==='booth'?(!s.flags.record?'Ouça a fita à esquerda':!s.flags.correlated?'Reconstrua o sinal na mesa':!s.flags.module?'Recolha o módulo físico':s.flags.evidencePath==='protect'?'Cópia lacrada · saia pela porta de serviço':s.flags.evidencePath==='aura'?'Aura autorizou o trecho · saia pela porta':s.flags.evidencePath==='trace'?'Origem NR-731/04:47 · saia pela porta':'Saia pela porta de serviço'):s.stage==='raid'?'Saída dos fundos · corra com Jinx':s.stage==='drive'?'Cadillac em movimento / fuga pelo canal':!s.flags.latch?'Jinx segura os guardas · escaneie a trava':'Corra ao Cadillac · Jinx precisa embarcar junto';$('alert').style.display=['raid','escape'].includes(s.stage)?'block':'none';if(['raid','escape'].includes(s.stage))$('alarm').style.width=(s.pursuit?.guards.length?95:30)+'%';const o=Club.near(s);let hint=o?'E / USAR · '+o.name:'';if(o&&['gate','latch'].includes(o.id)&&!s.flags[o.id])hint=s.flags[o.id+'Read']?'E / USAR · Pedir ajuda a Jinx':'SEGURE Q / SCAN · Localizar a fragilidade';if(o?.id==='alex'||o?.id.startsWith('guest')||o?.id==='bar')hint='E / CONVERSAR · '+o.name;$('hint').textContent=hint;$('hint').style.display=hint&&s.mode==='playing'?'block':'none';if(performance.now()>radioUntil)$('radio').style.display='none';$('game').classList.toggle('club-talking',s.mode==='clubDialogue'||s.mode==='clubPuzzle'||s.stage==='drive');}
function ClubResponseWithoutDuplicateSpeaker(text,who){
 const label=String(who||'').trim(),value=String(text??'');
 if(!label)return value;
 return value.toUpperCase().startsWith(label.toUpperCase()+':')?value.slice(label.length+1).trimStart():value;
}
// A decision made in person on the terrace can be acknowledged briefly over the
// Chapter 5 radio without stacking a second continuity monologue. A fresh
// chapter-select starts from the canonical line, with no invented promise.
function v104ClubBriefLine(original){
 if(state.dialogue!=='brief'||state.dialogueStep!==0)return original;
 const promise=window.StoryContinuity?.history?.()?.auraPromise;
 return ({
  research:'Alex encontrou seis minutos da minha voz numa gravação que não lembro de fazer. O original está no clube. A cópia que isolamos no terraço pode ajudar; não conecte a lente à rede daqui.',
  personal:'Alex encontrou seis minutos da minha voz numa gravação que não lembro de fazer. O original está no clube. Depois conversamos sem um canal aberto, como você pediu.',
  boundary:'Alex encontrou seis minutos da minha voz numa gravação que não lembro de fazer. O original está no clube. Sem outro enlace até acertarmos uma saída segura, como combinamos.'
 })[promise]||original;
}
function renderClubDialogue(){clearControl();$('radio').style.display='none';const b=ClubStory[state.dialogue][state.dialogueStep],box=$('clubDialogue');const v104Line=v104ClubBriefLine(b.line);const displayed=state.response===null?null:(window.DialogueDirector?.response?.(state.response,b.who)||{speaker:b.who,text:ClubResponseWithoutDuplicateSpeaker(state.response,b.who)});box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>'+(displayed?.speaker||b.who)+'</span><small>ZONA CEGA</small></div>'+(state.response===null?(b.aside?'<p class="club-aside">'+b.aside+'</p>':'')+'<p class="club-line">'+(window.DialogueDirector?.line(v104Line,state,state.dialogue+':'+state.dialogueStep)??v104Line)+'</p><div class="club-choices">'+b.choices.map((c,i)=>'<button id="clubAnswer'+i+'"><span>'+ (i+1) +'</span>'+c[0]+'</button>').join('')+'</div>':'<p class="club-line">'+displayed.text+'</p><button class="club-next" id="clubNext">CONTINUAR</button>')+'<p class="club-help">'+(state.response===null?'1, 2, 3 · Responder':'Enter / E · Continuar')+'</p>';if(state.response===null)for(let i=0;i<3;i++)$('clubAnswer'+i).onclick=()=>clubChoose(i);else $('clubNext').onclick=clubAdvance;if(state.response===null)StoryContinuity.render(box,5,state.dialogue,state.dialogueStep);box.scrollTop=0;ownChapterUI('clubDialogue');window.DialogueDirector?.attach(box,state);}
function openClubPuzzle(){clearControl();$('clubDialogue').classList.add('hidden');$('radio').style.display='none';const box=$('clubPuzzle');box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>RECONSTRUÇÃO / CÓPIA LOCAL</span><small>SEM TRANSMISSÃO</small></div><h2>O que entrou naquela noite.</h2><p>Alinhe o sinal ciano à referência âmbar. Ajuste atraso e filtro; depois compare.</p><canvas id="wavePlot" width="640" height="170" aria-label="Forma de onda de referência âmbar e leitura ciano ajustável"></canvas><label>Atraso <output id="phaseValue"></output><input id="wavePhase" type="range" min="0" max="4" step="1" value="'+state.puzzle.phase+'"></label><label>Filtro <output id="filterValue"></output><input id="waveFilter" type="range" min="0" max="4" step="1" value="'+state.puzzle.filter+'"></label><p id="waveStatus" role="status"></p><div class="wave-actions"><button id="waveCompare">COMPARAR COM A LENTE</button><button id="waveBack">DESCONECTAR</button></div>';for(const [id,k]of [['wavePhase','phase'],['waveFilter','filter']])$(id).oninput=()=>{state.puzzle[k]=Number($(id).value);paintClubWaves();};$('waveCompare').onclick=()=>{if(state.mode!=='clubPuzzle')return;if(Club.solve(state)){$('clubPuzzle').classList.add('hidden');clubEvents();}else $('waveStatus').textContent='A leitura ainda está instável. Aumente a qualidade antes de comparar.';};$('waveBack').onclick=()=>{if(state.mode!=='clubPuzzle')return;$('clubPuzzle').classList.add('hidden');state.mode='playing';state.useWas=true;clearControl();};paintClubWaves();ownChapterUI('clubPuzzle');}
function paintClubWaves(){const c=$('wavePlot'),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.fillStyle='#060e18';g.fillRect(0,0,640,170);g.strokeStyle='#2e485533';for(let x=0;x<640;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x,170);g.stroke();}for(let k=0;k<2;k++){g.strokeStyle=k?'#80eddd':'#efb87d';g.lineWidth=2;g.beginPath();for(let x=0;x<640;x++){const phase=k?(state.puzzle.phase-(state.puzzle.targetPhase??2))*.32:0,noise=k?(state.puzzle.filter-(state.puzzle.targetFilter??3))*6:0,y=85+Math.sin(x*.026+phase)*35+Math.sin(x*.067+phase)*15+Math.sin(x*.39)*noise;if(x===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();}$('phaseValue').textContent=state.puzzle.phase;$('filterValue').textContent=state.puzzle.filter;$('waveStatus').textContent='QUALIDADE DA LEITURA: '+Club.quality(state)+'%'+(Club.quality(state)===100?' · Sinal estável. Pode comparar.':' · Ajuste o atraso e o filtro.');}
function showClubEnding(){
 const outcomes={
  approach:'Aura decidirá o que pode ser aberto.',
  jealous:'A pergunta sobre Alexandra fica para depois.',
  boundary:'O módulo permanece lacrado até Aura decidir.'
 };
 const feeling=outcomes[state.closeness]||'Sierra preservou a cópia local para que Aura possa decidir por si mesma.';
 showPanel('Depois<br><em>das sirenes.</em>','CAPÍTULO 5 CONCLUÍDO<br><br>O Cadillac deixa o bloqueio para trás. Jinx dirige; Sierra protege o módulo. Alexandra confirma sua retirada pelo rádio.<br><br>'+feeling,'CONTINUAR · GHOST TRACK',()=>ChapterCurtain.to(6,beginGhost));
}
function clubEvents(){for(const e of state.events.splice(0)){if(e.type==='dialogue')renderClubDialogue();if(e.type==='puzzle')openClubPuzzle();if(e.type==='radio')radio(e.who,e.line,7);if(e.type==='transition'){camX=Math.max(0,state.x-W*.38);camY=350;clearControl();$('radio').style.display='none';}if(e.type==='solved'){beep(440,.4);Club.speak(state,'result');renderClubDialogue();state.events.length=0;}if(e.type==='protection'){beep(80,.18,'sawtooth',.02);radio('JINX','Atrás de mim. Pegou na placa, não em mim. Continua.',6);}
if(e.type==='pursuitShot')beep(95,.08,'sawtooth',.007);
if(e.type==='pursuitBlock'){beep(190,.10,'triangle',.014);if(state.pursuit?.blocked===1||state.pursuit?.blocked%5===0)radio('JINX / BLINDAGEM','Eu seguro a linha! Você corre. Não para por minha causa.',2);}
if(e.type==='pursuitHit'){beep(77,.20,'sawtooth',.027);radio('SIERRA / FERIDA','Tiro na cobertura! Abaixa, salta ou usa o impulso para atravessar.',2);}
if(e.type==='pursuitRetry'){radio('JINX / REAGRUPANDO','Eu te puxei para trás da cobertura. Vamos tentar de novo, juntos.',4);}
}}
qaListen(window,'keydown',e=>{if(e.target?.closest?.('.dialogue-auto'))return;if(['Enter','Space'].includes(e.code)&&e.target?.closest?.('.rc36-toggle'))return;if(state.chapter!==5||state.mode==='paused')return;if(state.mode==='clubDialogue'){const index=['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].indexOf(e.code)%3;const focused=e.target?.closest?.('#clubDialogue .club-choices button');const focusIndex=focused&&/^clubAnswer[0-2]$/.test(focused.id)?Number(focused.id.slice(-1)):-1;if(index>=0||['Enter','Space','KeyE','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(index>=0)clubChoose(index);else if(state.response===null&&focusIndex>=0&&['Enter','Space'].includes(e.code))clubChoose(focusIndex);else if(state.response!==null&&e.code!=='Escape')clubAdvance();}}else if(state.mode==='clubPuzzle'&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();$('waveBack').click();}},true);
clubReady();

const cadillacImage=new Image(),clubGuardImage=new Image();let cadillacTile,clubGuardTile;
function clubTrim(im){const w=im.naturalWidth||im.width||0,h=im.naturalHeight||im.height||0;if(!w||!h)return null;const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>40){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}if(x1<x0||y1<y0)return null;return {im,x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};}
cadillacImage.onload=()=>{cadillacTile=clubTrim(cadillacImage);clubAssetLoaded();};cadillacImage.src='cadillac-80.png';clubGuardImage.onload=()=>{clubGuardTile=clubTrim(clubGuardImage);clubAssetLoaded();};clubGuardImage.src='club-guard.png';
for(const im of [cadillacImage,clubGuardImage])im.onerror=()=>{clubFailed=true;clubReady();};
function drawClubGuard(x,y){const p=clubGuardTile;if(!p)return;const h=224,w=h*p.w/p.h;ctx.drawImage(p.im,p.x,p.y,p.w,p.h,x-w/2,y-h,w,h);}
// The source artwork faces right. Positive road distance always means forward.
const cadillacWheelArt=[new Image(),new Image()];
cadillacWheelArt[0].src='assets/vehicles/cadillac-wheel-rear.png';
cadillacWheelArt[1].src='assets/vehicles/cadillac-wheel-front.png';
function paintCadillac(p,x,y,w,distance=0){
 if(!p)return;
 const k=w/p.w,h=p.h*k,left=x-w/2,top=y-h;
 ctx.save();ctx.fillStyle='#03071380';ctx.beginPath();ctx.ellipse(x,y-1,w*.46,Math.max(4,w*.014),0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(p.im,p.x,p.y,p.w,p.h,left,top,w,h);
 if(distance){
  // Rotate only the original wire hubs; the body and whitewall anchors never jump.
  const radius=87,angle=distance/(radius*k);
  for(const [index,axle,cy] of [[0,405,576],[1,1372,574]]){
   ctx.save();ctx.translate(left+(axle-p.x)*k,top+(cy-p.y)*k);
   ctx.beginPath();ctx.arc(0,0,radius*k,0,Math.PI*2);ctx.clip();ctx.rotate(angle);
   const wheel=typeof cadillacWheelArt!=='undefined'?cadillacWheelArt[index]:null;
   if(wheel?.complete&&wheel.naturalWidth)ctx.drawImage(wheel,-radius*k,-radius*k,radius*2*k,radius*2*k);
   else ctx.drawImage(p.im,axle-radius,cy-radius,radius*2,radius*2,-radius*k,-radius*k,radius*2*k,radius*2*k);
   ctx.restore();
  }
 }
 ctx.restore();
}
function drawEscapeBulkhead(x,ground,closed,time){
 // RC38: replace the flat 18-pixel wall with a mechanically plausible shutter.
 const top=closed?ground-308:ground-450,visible=closed?308:172,w=86;
 ctx.save();ctx.translate(Math.round(x-w/2),Math.round(top));
 ctx.fillStyle='#0a101d';ctx.fillRect(-13,-24,w+26,visible+24);
 const rail=ctx.createLinearGradient(0,0,w,0);
 rail.addColorStop(0,'#111c28');rail.addColorStop(.16,'#435262');
 rail.addColorStop(.43,'#202e3c');rail.addColorStop(.81,'#324859');rail.addColorStop(1,'#0b1320');
 ctx.fillStyle=rail;ctx.fillRect(0,0,w,visible);
 for(let yy=0;yy<visible;yy+=29){ctx.fillStyle='#71839b66';ctx.fillRect(8,yy+3,w-16,2);ctx.fillStyle='#050b12ac';ctx.fillRect(8,yy+7,w-16,3);}
 for(const bx of [5,w-6]){ctx.fillStyle='#8b9fa2';ctx.fillRect(bx,0,2,visible);for(let yy=13;yy<visible;yy+=38){ctx.fillStyle='#d6b6a7';ctx.fillRect(bx-1,yy,4,4);}}
 ctx.fillStyle=closed?'#e58d76':'#76dfd4';ctx.fillRect(w-17,17,6,5);
 if(!closed){ctx.fillStyle='#030713b3';ctx.fillRect(12,visible-9,w-24,6);}
 ctx.restore();
}
function drawCadillac(x,y,w,distance=0){paintCadillac(cadillacTile,x,y,w,distance);}
function drawClubDrive(){
 if(!cadillacTile)return;
 const s=state,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,t=s.driveTime,travel=reduced?0:t*185;
 ctx.fillStyle='#080f22';ctx.fillRect(0,0,W,H);
 const bw=H*bg.naturalWidth/bg.naturalHeight;
 for(let x=-(travel*.2%bw);x<W;x+=bw)ctx.drawImage(bg,x,-H*.15,bw,H);
 const road=ctx.createLinearGradient(0,H*.69,0,H);road.addColorStop(0,'#101728');road.addColorStop(1,'#101522');
 ctx.fillStyle=road;ctx.fillRect(0,H*.69,W,H*.31);rect(0,H*.705,W,2,'#56667b');
 for(let i=0;i<Math.ceil(W/170)+2;i++){const x=i*170-travel%170;rect(x,H*.9,90,3,'#ac9aa6');}
 const carW=Math.min(850,W*.92),cx=W*.52,cy=H*.83;
 drawCadillac(cx,cy,carW,reduced?0:travel);
 const p=cadillacTile,k=carW/p.w,left=cx-carW/2,top=cy-p.h*k;
 // Seat the occupants behind the original glass: never paste heads on the door skin.
 const windowCorners=[[700,258],[969,258],[1077,371],[700,371]];
 ctx.save();ctx.beginPath();
 windowCorners.forEach(([x,y],i)=>{const px=left+(x-p.x)*k,py=top+(y-p.y)*k;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});
 ctx.closePath();ctx.clip();ctx.globalAlpha=.68;
 for(const [index,axle] of [[4,815],[6,951]]){
  const face=poses[index],ph=face.height*.27,hh=100*k,ww=hh*face.width/ph;
  ctx.drawImage(face,0,0,face.width,ph,left+(axle-p.x)*k-ww/2,top+(282-p.y)*k,ww,hh);
 }
 ctx.restore();
 if(t<5){ctx.save();ctx.globalAlpha=(1-t/5)*.09;rect(0,0,W,H,'#e5679c');ctx.restore();}
 label(t<3?'JINX / MOTORISTA · SIERRA / PASSAGEIRA':t<6?'RAMPA DO CANAL / DESVIO DO BLOQUEIO':'PATRULHA PERDIDA / ENLACE RESTABELECENDO',W/2,H*.24,'#d1dae7',Math.min(14,W/36));
 if(sound&&s.mode==='playing'){const beat=Math.floor(t*5);if(beat!==lastClubBeat){lastClubBeat=beat;beep(45+t*3,.15,'sawtooth',.005);}}
}
