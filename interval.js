'use strict';
const intervalHolding=new Image(),intervalFacility=new Image();let intervalLoaded=0,intervalFailed=false;
function intervalReady(){const b=$('chapterSeven');if(!b)return;if(intervalFailed){b.disabled=false;b.textContent='RECARREGAR 47 MINUTOS';b.onclick=()=>location.reload();return;}b.disabled=intervalLoaded<2||!alexandraFallReady||!auraGriefReady||!ready||!auraLoaded||ghostTiles.length<6;b.onclick=beginInterval;}
for(const [im,src]of [[intervalHolding,'assets/visual-v5/interval-holding-v5.png'],[intervalFacility,'interval-facility.png']]){im.onload=()=>{intervalLoaded++;intervalReady();};im.onerror=()=>{intervalFailed=true;const b=$('chapterSeven');if(b){b.disabled=false;b.textContent='RECARREGAR 47 MINUTOS';b.onclick=()=>location.reload();}};im.src=src;}
function beginInterval(){if(intervalFailed||intervalLoaded<2||!alexandraFallReady||!auraGriefReady||!ready||!auraLoaded||ghostTiles.length<6){showPanel('47<br><em>Minutos.</em>','A instalação está carregando.','ENTRAR NO CAPÍTULO 7',beginInterval);return;}StoryContinuity.capture(state);const prior=state.nearChoice||state.prior||'unknown';leaveTerrace();state=Interval.create(prior);clearControl();camX=0;camY=340;$('game').classList.add('interval-mode');$('overlay').classList.add('hidden');$('overlay').classList.remove('hacking','encounter');$('pause').textContent='Ⅱ';$('intervalJournal').classList.remove('hidden');radio('ALEXANDRA / HORA DESCONHECIDA','Frio sob os pés. O comunicador ficou em casa. Nenhum som de rua. A / D ou ◀ ▶ para explorar.',9);updateUI();window.SceneDirector?.enter(7);}
// P60: one costume across the playable Alexandra chapter and her death.
// The death atlas already uses the black T-shirt, dark trousers and bare feet.
// Draw the standing/walking poses from that same approved casual costume.
const alexCasualChapter7=new Image();alexCasualChapter7.src='alex-casual.png';
const alexCasualWalkRC73=new Image();alexCasualWalkRC73.src='assets/rebuild/actors/alexandra-casual-walk-rc73.png';
const alexCasualWalkFramesRC73=[{box:[0,0,512,535],axis:256,sole:533},{box:[512,0,512,535],axis:256,sole:533},{box:[1024,0,512,535],axis:256,sole:533},{box:[1536,0,512,535],axis:256,sole:533}];
function intervalAlex(x,y){
 const walking=Math.abs(state.vx)>0.5;
 // Never use the cap/jacket costume from Ghost Track for Chapter 7:
 // Alexandra is barefoot in a separate authored casual outfit here.
 if(walking){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(state.face||1,1);
  const beat=Math.floor(Math.abs(state.foot)*.72)%4;
  const ok=window.NeoActors?.drawCostume('alex-casual',beat,232);
  ctx.restore();if(ok)return;
 }
 if(walking&&alexCasualWalkRC73.complete&&alexCasualWalkRC73.naturalWidth===2048){
  const frame=alexCasualWalkFramesRC73[Math.floor(Math.abs(state.foot)*.72)%4],k=232/512;
  const [sx,sy,sw,sh]=frame.box;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(state.face||1,1);
  ctx.drawImage(alexCasualWalkRC73,sx,sy,sw,sh,-frame.axis*k,-frame.sole*k,sw*k,sh*k);ctx.restore();return;
 }
 if(alexCasualChapter7.complete&&alexCasualChapter7.naturalWidth){
  const frame=walking?(Math.floor(Math.abs(state.foot)*.85)%2?2:0):0;
  const sx=frame*512;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(state.face||1,1);
  const h=232,w=232;const sourceHeight=534,sole=533;
  // Atlas tiles use the same ground line, so the feet do not jump in motion.
  ctx.drawImage(alexCasualChapter7,sx,0,512,sourceHeight,-w*.5,-sole*h/512,w,sourceHeight*h/512);
  ctx.restore();return;
 }
 // Costume-matched fallback from the death atlas, not the jacket/cap sprite.
 if(alexandraFallReady){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(state.face||1,1);
  ctx.drawImage(alexandraFallImage,20,35,460,660,-90,-232,180,232);ctx.restore();}
}

function intervalConsole(x,y,on=false,status){
 if(window.ConsoleArt?.draw(ctx,x,y,{kind:'facility',status:status||(on?'isolated':'idle'),scan:Math.abs(state.x-x)<120&&state.scan}))return;
 ctx.drawImage(intervalHolding,intervalHolding.naturalWidth*.945,intervalHolding.naturalHeight*.388,intervalHolding.naturalWidth*.054,intervalHolding.naturalHeight*.259,Math.round(x-48),y-155,96,155);
 if(on){rect(x+10,y-118,15,2,'#aed3bb');rect(x+10,y-111,10,2,'#789f8b');}
}
function drawInterval(){const s=state;if(s.stage!=='aftermath')$('game').classList.remove('interval-aftermath');if(s.mode==='intervalMemorial'||s.mode==='won'||s.mode==='paused'&&s.resumeMode==='intervalMemorial'){drawAlexandraMemorial(s);return;}if(s.mode==='intervalExecution'||s.mode==='paused'&&s.resumeMode==='intervalExecution'){drawAlexandraExecution(s);return;}if(s.stage==='aftermath'){drawAlexandraAftermath(s);return;}ctx.clearRect(0,0,W,H);const wide=Interval.widths[s.stage],target=Math.max(0,Math.min(Math.max(0,wide-W),s.x-W*(W<560&&s.avatar!=='alex'?.82:s.mode==='won'&&s.stage==='aftermath'?.79:s.stage==='archive'?.58:.40)));if(drawInterval.lastStage!==s.stage){camX=target;drawInterval.lastStage=s.stage;}else camX+=(target-camX)*cameraBlend(W<560?.22:.09);camY=H<650?800-H*.74:340;boundCamera(wide);ctx.save();ctx.translate(-Math.round(camX),-camY);rect(0,0,wide,1300,'#080f14');const im=s.avatar==='alex'?intervalHolding:intervalFacility,ih=wide*im.naturalHeight/im.naturalWidth;if(s.stage==='sacrifice'&&ProductionArt.ok('corredor-47')){const art=ProductionArt.images['corredor-47'],ah=wide*art.naturalHeight/art.naturalWidth;ProductionArt.background('corredor-47',0,800-ah*.62,wide,ah);}else ctx.drawImage(im,0,800-ih*(s.avatar==='alex'?.66:.57),wide,ih);SceneryFinish.service(wide,s.stage==='sacrifice'?'corridor':'facility',s.time);if(s.mode==='playing')SceneryFinish.interactionAnchor(Interval.near(s),800,'cool',s.time);
 window.ScenePropsP61?.draw('interval',s);
 if(s.stage==='access'){
  // P10: the high-detail facility painting already contains columns and
  // conduits. Flat repeated bars were floating over its existing perspective.
  // Keep the brace puzzle and all coordinates; display only its status glow.
  rect(0,300,wide,490,'#09232e17');
  if(s.flags.brace&&Math.abs(s.x-1910)<450){ctx.save();ctx.globalAlpha=.60;
   rect(1883,735,54,3,'#9dc8c6');rect(1883,739,54,2,'#426b70');ctx.restore();}
 }
 if(s.avatar==='alex'){const consoles=s.stage==='sacrifice'?[[1240,s.flags.override],[2150,s.flags.sacrificed]]:[[1240,s.flags.patch],[1670,s.flags.pulse],[2150,s.flags.identified]];for(const [x,on]of consoles)intervalConsole(x,800,on,s.stage==='sacrifice'&&s.flags.sacrificed?'sealed':undefined);if(W>=560)label('731 / 204',840,624,'#b9b2a2',13);if(s.flags.pulse){label(Interval.patterns[s.pulsePattern],1670,661,'#a3cebf',12);}if(s.flags.identified)label('ALEXANDRA',2150,647,'#d5c399',13);intervalAlex(s.x,800);if(s.stage==='sacrifice'){rect(2550,410,18,390,'#323f41');label('SAÍDA LOCAL / '+(s.flags.sacrificed?'SELADA':'SERÁ SELADA'),2450,462,'#dbbaa6',12);if(s.sacrificeProgress>0&&!s.flags.sacrificed){rect(s.x-65,535,130,6,'#263633');rect(s.x-65,535,130*s.sacrificeProgress/4,6,'#e3c28d');label('MANTENHA A PONTE',s.x,521,'#e3c28d',11);}}}
 else{if(s.stage==='archive'){intervalConsole(1540,800,s.flags.hack);intervalConsole(2150,800,s.flags.alive);intervalConsole(2570,800,s.flags.secondRead);if(s.flags.alive)rect(2140,688,18,3,'#9abca5');if(s.flags.secondRead){label(s.flags.instance?'TESLA, AURA':'SEGUNDA PRESENÇA',2570,603,'#dab8a7',12);if(s.flags.instance)label('INSTANCE 02',2570,625,'#e3ccc0',17);}}
 if(s.flags.captured&&!s.flags.freed){for(const x of [s.x-250,s.x+70]){rect(x,350,14,450,'#4c5c60');for(let y=380;y<790;y+=30)rect(x-4,y,22,5,'#a5aaa088');}}// P59: sort companions by actual world-space foot anchor and maintain a common scale.
 const gap=145,jx=Number.isFinite(s.jinxX)?s.jinxX:s.x-gap*2,ax=Number.isFinite(s.auraX)?s.auraX:s.x-gap;
 const trio=[{x:jx,kind:'jinx'},{x:ax,kind:'aura'},{x:s.x,kind:'sierra'}].sort((a,b)=>a.x-b.x);
 // On narrow screens the camera cannot fit three 226px actors at full world
 // separation. Use a single, uniform cast scale and group framing; do not
 // modify the saved positions, physics, scan targets or interactions.
 const portrait=W<560&&(s.stage==='access'||s.stage==='archive');
 // Preserve readable silhouette spacing on portrait screens. The previous
 // 0.65 spread compressed the 145px companion gaps into 94px and visually
 // fused three actors, even though their saved world coordinates were apart.
 // Bound the spread by the visible camera margin so Jinx remains on-screen.
 const castScale=portrait?.64:1;
 const castSpread=portrait?Math.max(.70,Math.min(1.04,(W*.82-46)/290)):1;
 for(const p of trio){const px=s.x+(p.x-s.x)*castSpread;
  ctx.save();ctx.translate(px,800);ctx.scale(castScale,castScale);ctx.translate(-px,-800);
  ctx.save();const contact=ctx.createRadialGradient(px,799,4,px,799,54);
  contact.addColorStop(0,'#02060cc0');contact.addColorStop(.6,'#06142555');contact.addColorStop(1,'#06142500');
  ctx.fillStyle=contact;ctx.beginPath();ctx.ellipse(px,799,54,8,0,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.shadowColor=p.kind==='aura'?'#b938d9':p.kind==='jinx'?'#2388b6':'#e5488c';ctx.shadowBlur=3;
  if(p.kind==='jinx')actor(px,800,s.jinxFace||1,s.jinxFoot||0,s.jinxMoving,'jinx');
  else if(p.kind==='aura'){
   const auraLooksRight=px<s.x?1:-1;
   const auraDirection=s.auraMoving&&Math.abs(s.auraVelocity||0)>0.1?Math.sign(s.auraVelocity):auraLooksRight;
   drawAuraAt(px,800,auraDirection,s.mode==='playing'&&s.auraMoving,s.auraFoot||0);
  }
  else actor(px,800,s.face,s.foot,Math.abs(s.vx)>0);
  ctx.restore();
 }
 if(s.stage==='access'){for(let k=0;k<3;k++){const x=[670,1260,2410][k];if(x<camX-100||x>camX+W+100)continue;ctx.strokeStyle=k<s.trace?'#85bdaa':s.scan?'#e5c48c':'#695e46';ctx.setLineDash([3,5]);ctx.strokeRect(x-50,665,100,132);ctx.setLineDash([]);label(k<s.trace?'REGISTRO PRESERVADO':'VESTÍGIO '+(k+1),x,641,k<s.trace?'#a3caba':'#c5b699',11);if(s.trace===k&&s.traceProgress){rect(x-44,652,88,3,'#24312f');rect(x-44,652,88*s.traceProgress/1.25,3,'#ddc597');}}}
 if(s.scan){ctx.strokeStyle='#99c9b745';ctx.beginPath();ctx.arc(s.x,680,125,0,Math.PI*2);ctx.stroke();}}
 const o=Interval.near(s);if(o&&s.mode==='playing'){actionHalo(o.x,520);if(W>=560)label(o.name,o.x,494,'#d4c9b1',12);}ctx.restore();
 // Damp motes remain subtle; no ambient music under the confinement sequence.
 ctx.strokeStyle='#92a5a421';ctx.beginPath();for(let k=0;k<12;k++){const x=((k*191.7-camX*.15)%W+W)%W,y=(k*87+s.time*90)%H;ctx.moveTo(x,y);ctx.lineTo(x,y+5);}ctx.stroke();const v=ctx.createRadialGradient(W*.5,H*.55,H*.25,W*.5,H*.55,Math.max(W,H)*.7);v.addColorStop(0,'#00000000');v.addColorStop(1,'#02080a77');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);if(s.glitch>0)signalGlitch();}
function intervalObjective(){const f=state.flags;if(state.mode==='intervalCapture')return 'O trio foi capturado';if(state.stage==='sacrifice')return !f.override?'Examine a derivação manual à esquerda':'Segure E / USAR no contato para libertar o trio';if(state.stage==='aftermath')return 'Sinal vital encerrado';if(state.stage==='holding')return !f.wrist?'Examine a interface pessoal':!f.names?'Leia os nomes riscados na parede':!f.patch?'Restaure o circuito na caixa de manutenção':!f.pulse?'Deixe um pulso no barramento local':!f.identified?'Examine o leitor da porta':'Tente abrir a trava de serviço';if(state.stage==='access')return state.trace<2?'Reconstrua os vestígios com Q / SCAN':!f.brace?'Peça a Jinx para abrir a passagem':state.trace<3?'Reconstrua o último registro':'Entre pela escotilha antiga';return !f.files?'Compare os nomes no arquivo':!f.keane?'Examine o índice de Keane':!f.hack?'Ajude Aura a isolar o terminal':!f.alive?'Consulte o retorno biométrico de Alexandra':!f.secondRead?'Use SCAN no módulo à direita':'Abra a segunda leitura';}
function updateIntervalUI(){const ending=state.stage==='aftermath'||state.mode==='intervalExecution'||state.mode==='paused'&&state.resumeMode==='intervalExecution';$('game').dataset.intervalEnding=ending?'true':'false';$('identityLabel').textContent=state.avatar==='alex'?'ALEXANDRA':'SIERRA / CORE';$('missionChapter').textContent='CAPÍTULO 7 / 47 MINUTOS';$('health').textContent='▰ ▰ ▰';$('energy').style.width=(state.avatar==='alex'?0:state.energy)+'%';$('clues').textContent=state.avatar==='alex'?'HORA DESCONHECIDA / SEM CANAL':state.stage==='access'?'COTA −12 / '+state.trace+' DE 3 REGISTROS':'INSTALAÇÃO / CONSULTA LOCAL';$('objective').textContent=intervalObjective();$('alert').style.display='none';const o=Interval.near(state);$('hint').textContent=o?.id==='contact'&&state.flags.override?'SEGURE E / USAR · Manter a ponte fechada':o?(o.id.startsWith('trace')?'Q / SCAN · ':'E / USAR · ')+o.name:'';$('hint').style.display=o&&state.mode==='playing'?'block':'none';$('game').classList.toggle('interval-talking',state.mode!=='playing');if(state.mode==='playing'&&performance.now()>radioUntil)$('radio').style.display='none';}
/* RC34: respostas contextualizadas sem modificar a ordem dos objetivos. */
function intervalContextLine(s,line){
 if(!line||!s)return line;
 const answer=(s.answers||[]).slice().reverse().find(a=>a.dialogue===s.dialogue);
 if(!answer)return line;
 if(s.dialogue==='keane'&&s.lineIndex===4){
  const variants=[
   'Primeiro encontramos Alex. Depois eu te mostro o que reconheci no índice.',
   'Reconheci a letra antes de conferir a data. Você fez bem em perguntar.',
   'Minha mão não para. Segura o cabo por um instante? Eu consigo ler.'
  ];
  return {...line,text:variants[answer.index]||line.text};
 }
 if(s.dialogue==='pulse'&&s.lineIndex===1){
  return {...line,text:'PADRÃO LOCAL REGISTRADO\n'+Interval.patterns[answer.index]+'\nDESTINO EXTERNO: INDISPONÍVEL'};
 }
 return line;
}
function renderIntervalDialogue(){
 clearControl();$('radio').style.display='none';
 const entry=IntervalStory?.[state.dialogue]?.[state.lineIndex];
 const box=$('intervalDialogue');
 // A missing beat is an integrity error, not permission to skip the narrative.
 if(!entry||typeof entry.text!=='string'||typeof entry.who!=='string'){
  console.error('[47 MINUTOS] dialogue entry unavailable',state.dialogue,state.lineIndex);
  box.classList.add('hidden');state.mode='playing';state.useWas=true;
  radio('REGISTRO LOCAL','O trecho do diálogo não pôde ser carregado. O progresso foi preservado.',9);
  return;
 }
 const line=intervalContextLine(state,entry);
 box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>'+line.who+'</span><small>47 MINUTOS</small></div>'+(line.aside?'<p class="club-aside">'+line.aside+'</p>':'')+'<p class="club-line">'+(window.DialogueDirector?.line(line.text,state,state.dialogue+':'+state.lineIndex)??line.text).replaceAll('\n','<br>')+'</p>'+(line.choices?'<div class="club-choices">'+line.choices.map((t,i)=>'<button id="intervalChoice'+i+'"><span>'+(i+1)+'</span>'+t+'</button>').join('')+'</div>':'<button class="club-next" id="intervalNext">CONTINUAR</button>')+'<p class="club-help">'+(line.choices?'1, 2, 3 · Escolher':'E / Enter · Continuar')+'</p>';if(line.choices)for(let i=0;i<3;i++)$('intervalChoice'+i).onclick=()=>{Interval.choose(state,i);intervalAfterDialogue();};else $('intervalNext').onclick=()=>{Interval.advance(state);intervalAfterDialogue();};StoryContinuity.render(box,7,state.dialogue,state.lineIndex);box.scrollTop=0;ownChapterUI('intervalDialogue');window.DialogueDirector?.attach(box,state);}
function intervalAfterDialogue(){if(state.mode!=='intervalDialogue'){$('intervalDialogue').classList.add('hidden');clearControl();}intervalEvents();}
const intervalSymbols=['●','▲','■'];
function renderIntervalPuzzle(){clearControl();if(state.puzzle?.kind==='hack'){renderIsolationContract();return;}const box=$('intervalPuzzle');box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>'+(state.puzzle.kind==='patch'?'ALEXANDRA / CIRCUITO DE SERVIÇO':'AURA / ISOLAMENTO LOCAL')+'</span><small>SEM CONEXÃO EXTERNA</small></div><h2>Fechar o circuito.</h2><p>Cada entrada deve chegar ao retorno com o mesmo símbolo. Toque nos retornos para alternar. Nenhuma tentativa envia dados à rede.</p><div class="interval-routing">'+intervalSymbols.map((v,i)=>'<div><span>'+v+' <small>ENTRADA '+(i+1)+'</small></span><b>→</b><button id="intervalPath'+i+'" aria-label="Alternar retorno '+(i+1)+'"></button></div>').join('')+'</div><p id="intervalPuzzleStatus" role="status"></p><div class="wave-actions"><button id="intervalConnect">FECHAR CIRCUITO</button><button id="intervalBack">DESCONECTAR</button></div><p>Teclado: 1 / 2 / 3 alternam · E confirma · Esc volta</p>';for(let i=0;i<3;i++)$('intervalPath'+i).onclick=()=>{Interval.rotate(state,i);paintIntervalPuzzle();};$('intervalConnect').onclick=()=>{if(Interval.solve(state)){$('intervalPuzzle').classList.add('hidden');intervalEvents();}else paintIntervalPuzzle();};$('intervalBack').onclick=()=>{if(state.mode!=='intervalPuzzle')return;state.puzzle=null;state.mode='playing';clearControl();box.classList.add('hidden');};paintIntervalPuzzle();ownChapterUI('intervalPuzzle');}
// Aura's second circuit must not repeat Alexandra's three-symbol wiring puzzle.
function renderIsolationContract(){
 const box=$('intervalPuzzle');box.classList.remove('hidden');
 const labels=['ORIGEM DO ARQUIVO','RETORNO DE DADOS','CHAVE DE ACESSO'];
 const options=[['REDE PÚBLICA','CÓPIA LOCAL','CACHE DA GUARDA'],['CONSOLE DA GUARDA','TERMINAL REMOTO','NENHUM / OFFLINE'],['GUARDAR NO TERMINAL','ENVIAR AO SERVIDOR','EXIBIR EM CANAL ABERTO']];
 box.innerHTML='<div class="club-dialogue-top"><span>AURA / ISOLAMENTO LOCAL</span><small>SEM CONEXÃO EXTERNA</small></div><h2>Quem pode ler?</h2><p>A interface pede origem, retorno e custódia. A cópia de Alexandra deve permanecer offline: escolha três políticas de acesso antes de consultar os dados.</p><div class="isolation-options">'+labels.map((l,i)=>'<label>'+l+'<select id="iso'+i+'">'+options[i].map((v,j)=>'<option value="'+j+'">'+v+'</option>').join('')+'</select></label>').join('')+'</div><p role="status" id="isoStatus">A leitura só será iniciada depois de conferir os três parâmetros.</p><div class="wave-actions"><button id="isoCommit">ISOLAR E CONSULTAR</button><button id="isoBack">VOLTAR</button></div>';
 for(let i=0;i<3;i++)$('iso'+i).onchange=()=>{state.puzzle.paths[i]=Number($('iso'+i).value);$('isoStatus').textContent='Alteração local. Nenhum pacote enviado.';};
 $('isoCommit').onclick=()=>{if(state.mode!=='intervalPuzzle')return;if(Interval.solve(state)){$('intervalPuzzle').classList.add('hidden');intervalEvents();}else $('isoStatus').textContent='A política ainda permite vazamento. Origem local, nenhum retorno remoto, chave sob custódia do terminal.';};
 $('isoBack').onclick=()=>{if(state.mode!=='intervalPuzzle')return;state.puzzle=null;state.mode='playing';clearControl();box.classList.add('hidden');};ownChapterUI('intervalPuzzle');
}
function paintIntervalPuzzle(){if(state.mode!=='intervalPuzzle')return;for(let i=0;i<3;i++)$('intervalPath'+i).textContent=intervalSymbols[state.puzzle.paths[i]];$('intervalPuzzleStatus').textContent=state.puzzle.error?'Os retornos ainda estão cruzados. Compare os símbolos.':'Rádio externo isolado. Apenas continuidade local.';}
function intervalNotes(){if(state.chapter!==7||state.mode==='paused'||state.mode==='won'||['intervalExecution','intervalDeparture','intervalMemorial'].includes(state.mode))return;if(state.mode==='intervalNotes'){state.mode=state.notesReturn;$('intervalNotes').classList.add('hidden');clearControl();return;}state.notesReturn=state.mode;state.mode='intervalNotes';clearControl();const box=$('intervalNotes');box.classList.remove('hidden');box.innerHTML='<div class="club-dialogue-top"><span>REGISTROS LOCAIS</span><button id="intervalNotesClose">FECHAR</button></div><h2>O que foi preservado.</h2>'+(state.journal.length?state.journal.map(n=>'<article><h3>'+n.title+'</h3><p>'+n.text+'</p></article>').join(''):'<p>Nenhum registro ainda.</p>');$('intervalNotesClose').onclick=intervalNotes;ownChapterUI('intervalNotes');}
function intervalEnding(){stopChapterAudio();clearControl();$('intervalDialogue').classList.add('hidden');$('overlay').classList.add('hidden');$('game').classList.add('chapter-seven-ended');
 const end=document.createElement('div');end.id='chapterSevenEnd';end.innerHTML='<p>FIM DE 47 MINUTOS</p><button id="chapterSevenContinue">CONTINUAR · CAFÉ ÀS 02:17</button><button id="chapterSevenMenu">MENU</button>';$('game').appendChild(end);$('chapterSevenContinue').onclick=()=>ChapterCurtain.to(8,openInterlude);$('chapterSevenMenu').onclick=showChapterMenu;}
function intervalEvents(){for(const e of state.events.splice(0)){if(e.type==='radio')radio(e.who,e.text,8);if(e.type==='dialogue')renderIntervalDialogue();if(e.type==='puzzle')renderIntervalPuzzle();if(e.type==='transition'){clearControl();stopChapterAudio();cancelChapterTimers();camX=0;camY=340;$('radio').style.display='none';}if(e.type==='capture'){clearControl();radio('INSTALAÇÃO','CONTENÇÃO: TRÊS PRESENÇAS RETIDAS',4);}if(e.type==='execution'||e.type==='quiet'){clearControl();stopChapterAudio();$('intervalDialogue').classList.add('hidden');$('radio').style.display='none';}if(e.type==='shot')intervalGunshot();if(e.type==='memorial'){$('game').classList.add('chapter-seven-ended');$('radio').style.display='none';}if(e.type==='ending')intervalEnding();}}
$('intervalJournal').onclick=intervalNotes;
qaListen(window,'keydown',e=>{if(e.target?.closest?.('.dialogue-auto'))return;if(['Enter','Space'].includes(e.code)&&e.target?.closest?.('.rc36-toggle'))return;if(state.chapter!==7||state.mode==='paused')return;const i=['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].indexOf(e.code)%3;if(e.code==='KeyJ'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)intervalNotes();return;}if(state.mode==='intervalDialogue'&&(i>=0||['KeyE','Enter','Space'].includes(e.code))){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;const line=IntervalStory[state.dialogue]?.[state.lineIndex];const focused=e.target?.closest?.('#intervalDialogue .club-choices button');const focusIndex=focused&&/^intervalChoice[0-2]$/.test(focused.id)?Number(focused.id.slice(-1)):-1;if(i>=0)Interval.choose(state,i);else if(line?.choices&&focusIndex>=0&&['Enter','Space'].includes(e.code))Interval.choose(state,focusIndex);else if(!line?.choices)Interval.advance(state);intervalAfterDialogue();}else if(state.mode==='intervalPuzzle'&&(i>=0||['KeyE','Enter','Escape'].includes(e.code))){if(e.code==='Enter'&&e.target?.closest?.('#intervalPuzzle button, #intervalPuzzle select'))return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(state.puzzle?.kind==='hack'){if(e.code==='Escape')$('isoBack').click();else if(e.code==='KeyE'||e.code==='Enter')$('isoCommit').click();}else if(i>=0){Interval.rotate(state,i);paintIntervalPuzzle();}else $(e.code==='Escape'?'intervalBack':'intervalConnect').click();}else if(state.mode==='intervalNotes'&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();intervalNotes();}},true);

// Additional physical poses. No original atlas is altered and no character alpha
// is animated: the camera sees the same solid body from the fall to the exit.
const alexandraFallImage=new Image();let alexandraFallReady=false;
alexandraFallImage.onload=()=>{alexandraFallReady=true;intervalReady();};
alexandraFallImage.onerror=()=>{intervalFailed=true;const b=$('chapterSeven');b.disabled=false;b.textContent='RECARREGAR 47 MINUTOS';b.onclick=()=>location.reload();};
alexandraFallImage.src='alexandra-fall-poses.png';
const auraGriefImage=new Image();let auraGriefReady=false;
auraGriefImage.onload=()=>{auraGriefReady=true;intervalReady();};
auraGriefImage.onerror=()=>{intervalFailed=true;intervalReady();};
auraGriefImage.src='aura-grief-poses.png';
function intervalGunshot(){
 if(!sound||document.hidden||state.mode==='paused')return;
 try{ac??=new(window.AudioContext||window.webkitAudioContext)();ac.resume().catch(()=>{});
  const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*.095),ac.sampleRate),d=b.getChannelData(0);
  for(let k=0;k<d.length;k++)d[k]=(Math.random()*2-1)*Math.exp(-k/(d.length*.14));
  const o=ac.createBufferSource(),g=ac.createGain();o.buffer=b;g.gain.value=.07;o.connect(g);g.connect(ac.destination);const n={o,g};audioNodes.add(n);o.onended=()=>{audioNodes.delete(n);o.disconnect();g.disconnect();};o.start();
 }catch{}
}
const serviceDroneImage=new Image();serviceDroneImage.src='security-drone-detailed.png';
function serviceDrone(x,y,t,flash=false){
 ctx.save();ctx.translate(x,y);const im=serviceDroneImage;
 if(im.complete&&im.naturalWidth){ctx.imageSmoothingEnabled=true;const w=168,h=w*im.naturalHeight/im.naturalWidth;ctx.drawImage(im,-w/2,-h*.56,w,h);}
 if(flash){ctx.translate(-41,0);const glow=ctx.createRadialGradient(0,33,0,0,33,50);glow.addColorStop(0,'#fff7cddd');glow.addColorStop(.2,'#ffd28399');glow.addColorStop(1,'#d87a2100');ctx.fillStyle=glow;ctx.fillRect(-50,-17,100,100);ctx.fillStyle='#fff1cb';ctx.beginPath();ctx.moveTo(-4,29);ctx.lineTo(-10,41);ctx.lineTo(-3,38);ctx.lineTo(1,51);ctx.lineTo(8,32);ctx.closePath();ctx.fill();}
 ctx.restore();
}
function drawServiceRoom(t){
 const phase=Interval.executionPhase(t),floor=435;
 rect(0,0,960,520,'#10121a');
 if(ProductionArt.ok('corredor-47')){
  const im=ProductionArt.images['corredor-47'],k=floor/316;
  // Keep the corridor's proportions and place its walkway on the actors' floor.
  ctx.save();ctx.beginPath();ctx.rect(0,0,960,520);ctx.clip();
  ctx.drawImage(im,960-im.naturalWidth*k,0,im.naturalWidth*k,im.naturalHeight*k);ctx.restore();
 }
 else if(intervalHolding.naturalWidth)ctx.drawImage(intervalHolding,0,0,960,520);
 rect(0,0,960,520,'#090e173b');
 const open=Math.min(1,t/.9),hx=472,hw=350;rect(hx-9,0,hw+18,29,'#11151b');rect(hx,0,hw,24,'#010207');
 const leaf=(hw/2)*(1-open);
 for(const [x,w]of [[hx,leaf],[hx+hw-leaf,leaf]]){rect(x,0,w,23,'#4b5661');rect(x,20,w,3,'#7b8586');for(let k=8;k<w;k+=22)rect(x+k,3,2,15,'#222d38');}
 rect(hx-9,26,hw+18,3,'#747b7b');rect(hx-9,29,hw+18,6,'#03070a');
 if(ProductionArt.ok('quadro_eletrico'))ProductionArt.prop('quadro_eletrico',397,435,214);
 const body=phase==='body',fall=phase==='fall',scale=.35;
 ctx.fillStyle='#0008';ctx.beginPath();ctx.ellipse(body?620:534,437,body?142:46,8,0,0,Math.PI*2);ctx.fill();
 if(body){const spread=Math.min(1,(t-3.4)/1.8);ctx.fillStyle='#451523';ctx.beginPath();ctx.ellipse(629,436,58+39*spread,7+4*spread,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#672332';ctx.beginPath();ctx.ellipse(633,435,55,4,0,0,Math.PI*2);ctx.fill();}
 if(phase==='hatch'||phase==='drones'){
  if(alexCasualChapter7.complete&&alexCasualChapter7.naturalWidth){
   ctx.drawImage(alexCasualChapter7,0,0,512,534,527-116,floor-533*232/512,232,534*232/512);
  }else if(alexandraFallReady){ctx.drawImage(alexandraFallImage,20,35,460,660,527-81,floor-232,162,232);}
 }else if(alexandraFallReady){
  const p=body?[1305,475,860,220,203,340]:fall?[625,155,600,540,523,220]:[20,35,460,660,643,220];
  const [sx,sy,sw,sh,foot,anchor]=p,progress=Math.max(0,Math.min(1,(t-2.75)/.65));
  const dx=body?558:fall?529+29*progress:529+Math.sin((t-2.3)*35)*3;
  ctx.save();ctx.translate(dx,floor);if(fall)ctx.rotate(progress*progress*.20);
  ctx.drawImage(alexandraFallImage,sx,sy,sw,sh,-anchor*scale,-foot*scale,sw*scale,sh*scale);ctx.restore();
 }
 for(let n=0;n<2;n++){
  const drop=Math.min(1,Math.max(0,(t-.55-n*.12)/1.2)),ease=1-Math.pow(1-drop,3),x=545+n*199,y=-70+ease*(209+n*9);
  const shot=Interval.shots.findIndex((when,k)=>k%2===n&&t>=when&&t<when+.085);
  if(t>.55)serviceDrone(x,y,t,shot>=0);
  if(shot>=0){const targetX=539+(shot%2)*7,targetY=phase==='fall'?365:303;
   ctx.strokeStyle='#ffe5ab';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-41,y+33);ctx.lineTo(targetX,targetY);ctx.stroke();
   ctx.fillStyle='#9c3041';for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(targetX-5-k*3,targetY-8+k*4,2.4,1.2,k*.3,0,Math.PI*2);ctx.fill();}
   const flash=ctx.createRadialGradient(x,y,0,x,y,190);flash.addColorStop(0,'#ffd09825');flash.addColorStop(1,'#ffd09800');ctx.fillStyle=flash;ctx.fillRect(x-190,y-190,380,380);
  }
 }
 const shade=ctx.createLinearGradient(0,0,0,520);shade.addColorStop(0,'#02040b77');shade.addColorStop(.25,'#02040b00');shade.addColorStop(.8,'#02040b00');shade.addColorStop(1,'#02040b66');ctx.fillStyle=shade;ctx.fillRect(0,0,960,520);
}
function serviceFeed(t,x,y,width,height,close=false){
 const sourceX=close?320:0,sourceW=close?520:960,scale=close?Math.max(width/sourceW,height/520):Math.min(width/sourceW,height/520),rw=sourceW*scale,rh=520*scale,rx=x+(width-rw)/2,ry=y+(height-rh)/2;
 ctx.save();ctx.beginPath();ctx.rect(close?x:rx,close?y:ry,close?width:rw,close?height:rh);ctx.clip();ctx.translate(rx-sourceX*scale,ry);ctx.scale(scale,scale);drawServiceRoom(t);ctx.restore();
 ctx.strokeStyle='#71888c';ctx.lineWidth=1;ctx.strokeRect(close?x:rx,close?y:ry,close?width:rw,close?height:rh);
 return close?{x,y,w:width,h:height}:{x:rx,y:ry,w:rw,h:rh};
}
function drawAlexandraExecution(s){
 ctx.clearRect(0,0,W,H);rect(0,0,W,H,'#03070b');
 const mobile=W<500;
 if(mobile&&intervalHolding.complete&&intervalHolding.naturalWidth){
  const im=intervalHolding,k=Math.max(W/im.naturalWidth,H/im.naturalHeight);
  ctx.save();ctx.globalAlpha=.24;ctx.drawImage(im,(W-im.naturalWidth*k)/2,(H-im.naturalHeight*k)/2,im.naturalWidth*k,im.naturalHeight*k);ctx.restore();
  rect(0,0,W,H,'#02040b72');
 }
 if(mobile&&ProductionArt.ok('corredor-47')){
  // Architectural ambient matte: fill the portrait void without repeating
  // Alexandra's body as a second scene or obscuring the actual observation feed.
  const art=ProductionArt.images['corredor-47'],k=Math.max(W/art.naturalWidth,H/art.naturalHeight);
  ctx.save();ctx.globalAlpha=.38;ctx.drawImage(art,(W-art.naturalWidth*k)/2,(H-art.naturalHeight*k)/2,art.naturalWidth*k,art.naturalHeight*k);ctx.restore();
  rect(0,0,W,H,'#02050b60');
 }
 const box=serviceFeed(s.executionTime,mobile?7:16,mobile?H*.078:H*.08,W-(mobile?14:32),mobile?H*.75:H*.80,mobile);
 rect(box.x+3,box.y+3,box.w-6,mobile?27:32,'#030812cf');
 label('CORREDOR DE SERVIÇO',W/2,box.y+(mobile?21:25),'#e2eceb',mobile?11:14);
 const dead=s.executionTime>=3.4;
 label(dead?'ALEXANDRA JONLITH · SINAL VITAL ENCERRADO':'PONTE MANUAL · TRÊS CONTENÇÕES LIBERADAS',W/2,box.y+box.h+25,dead?'#dc9794':'#b8c7bd',mobile?10:13);
 if(!dead){ctx.strokeStyle='#a4bbaf';ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<120;x++){const beat=(x+s.executionTime*50)%42,y=beat<3?-8:beat<6?6:0;const px=W/2-60+x,py=box.y+box.h+43+y;x?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
 else rect(W/2-60,box.y+box.h+43,120,1,'#b96567');
}
function drawAlexandraAftermath(s){
 $('game').classList.add('interval-aftermath');
 ctx.clearRect(0,0,W,H);
 const mobile=W<560, floor=H*(mobile?.75:.925);
 const mw=W*(mobile?.89:.526), mh=mw*(520/960);
 const mx=(W-mw)/2, mt=H*(mobile?.145:.096);
 const talking=s.mode==='intervalDialogue'||s.mode==='paused'&&s.resumeMode==='intervalDialogue';
 // The actors are in a separate observation booth; Alexandra is visible ONLY on a remote CCTV screen.
 rect(0,0,W,H,'#070e19');
 if(intervalFacility.complete&&intervalFacility.naturalWidth){
  ctx.save();ctx.globalAlpha=.56;ctx.drawImage(intervalFacility,0,0,intervalFacility.naturalWidth,intervalFacility.naturalHeight,0,-H*.13,W,H*1.17);ctx.restore();
 }
 const shade=ctx.createLinearGradient(0,0,0,H);
 shade.addColorStop(0,'#050913e8');shade.addColorStop(.48,'#101724ab');shade.addColorStop(.85,'#09111dbb');shade.addColorStop(1,'#02050a');
 ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
 // Solid room architecture: ceiling beam, supporting wall, side technical bays, floor depth.
 rect(0,H*.08,W,H*.024,'#081621');rect(0,H*.10,W,3,'#38607170');
 rect(W*.13,H*.1,W*.013,H*.78,'#233341');rect(W*.85,H*.1,W*.015,H*.78,'#243849');
 rect(0,H*.705,W,H*.026,'#131e2b');rect(0,H*.72,W,2,'#566b8048');
 for(const side of [W*.027,W*.877]){
   const rw=W*(mobile?.083:.091);
   rect(side,H*.165,rw,H*.535,'#060d16');
   rect(side+4,H*.176,rw-8,H*.513,'#142130');
   for(let j=0;j<7;j++){
     const y=H*(.195+j*.064);
     rect(side+8,y,rw-16,H*.05,'#091523');
     rect(side+13,y+5,Math.max(4,rw*.35),2,j%3===0?'#bc60b7':'#4a8d9e');
     rect(side+13,y+11,Math.max(5,rw*.53),2,'#517b88');
     rect(side+rw-21,y+7,5,5,j===2?'#e16baa':'#65bbc4');
   }
 }
 // Cables follow physical mounts rather than decorative horizontal glitch streaks.
 ctx.save();ctx.lineWidth=3;ctx.strokeStyle='#29435c';
 for(let n=0;n<3;n++){const x=W*(.18+n*.30);ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x-20,H*.11,x+27,H*.19,x+W*.06,H*.23);ctx.stroke();}
 ctx.restore();
 // Thick wall-mounted monitor with inset bezel, bracket and a separate power cable.
 rect(mx-16,mt-16,mw+32,mh+39,'#01050b');
 rect(mx-10,mt-10,mw+20,mh+20,'#344b5b');
 rect(mx-4,mt-4,mw+8,mh+8,'#0b202c');
 serviceFeed(11,mx,mt,mw,mh,false); // Native feed aspect ratio: no pillarboxing or crop.
 ctx.save();ctx.strokeStyle='#83acb9';ctx.lineWidth=mobile?2:3;ctx.strokeRect(mx,mt,mw,mh);ctx.restore();
 rect(mx,mt,mw,mobile?21:26,'#081421e9');
 ctx.save();ctx.font=(mobile?8:11)+'px monospace';ctx.textAlign='left';ctx.fillStyle='#bfd2de';
 ctx.fillText('CAM 04  /  CORREDOR DE SERVIÇO',mx+9,mt+(mobile?14:18));
 ctx.fillText('04:47  /  LOCAL',mx+9,mt+mh-11);ctx.restore();
 rect(mx+mw-20,mt+8,5,5,'#e67688');
 // Physically mounted console without text underneath avatars.
 const deskY=mt+mh+H*.045,deskX=mx+mw*.09,deskW=mw*.82;
 rect(deskX,deskY,deskW,H*.049,'#061320');
 rect(deskX,deskY,deskW,4,'#4c7c8c');
 for(let i=0;i<9;i++)rect(deskX+deskW*(.08+i*.092),deskY+H*.018,deskW*.047,3,i===4?'#bc577a':'#427b92');
 rect(deskX+deskW*.025,deskY+H*.049,deskW*.06,H*.23,'#0c1a25');
 rect(deskX+deskW*.915,deskY+H*.049,deskW*.06,H*.23,'#0c1a25');
 // Independent diagnostic terminal: text is never behind the actors.
 const panelX=mobile?mx:W*.785,panelY=mobile?mt+mh+H*.020:H*.275;
 const panelW=mobile?mw:W*.187,panelH=mobile?H*.082:H*.155;
 rect(panelX-4,panelY-4,panelW+8,panelH+8,'#030711');
 rect(panelX,panelY,panelW,panelH,'#101f2c');
 rect(panelX+7,panelY+7,panelW-14,2,'#6b9dae');
 ctx.save();ctx.textAlign='left';
 ctx.font=(mobile?9:12)+'px monospace';ctx.fillStyle='#bbd4db';
 ctx.fillText('REGISTRO / 047',panelX+10,panelY+(mobile?19:26));
 ctx.fillStyle='#e29ab3';
 ctx.font=(mobile?10:11)+'px monospace';
 ctx.fillText('ALEXANDRA JONLITH',panelX+10,panelY+(mobile?35:48));
 ctx.fillText('SINAL VITAL ENCERRADO',panelX+10,panelY+(mobile?47:66));
 ctx.restore();
 // Observers share the SAME ground and actor scale. No unreachable-door gestures.
 rect(0,floor-9,W,H-floor+9,'#0d1823');
 rect(0,floor,W,5,'#67899a');rect(0,floor+8,W,2,'#2a4656');
 for(let k=0;k<5;k++)rect(0,floor+13+k*13,W,1,'#52708427');
 const scale=mobile?(talking?.64:.70):Math.min(1.02,H/720);
 const stride=mobile?W*.205:W*.068,cx=W*.50;
 const people=[['jinx',cx-stride,1],['sierra',cx,0],['aura',cx+stride,1]];
 const poses={jinx:0,sierra:4,aura:5};
 for(const [who,x] of people){
   ctx.save();ctx.translate(Math.round(x),Math.round(floor));
   ctx.scale(scale,scale);
   const face=who==='jinx'?1:-1;
   if(!window.NeoActors?.draw(who,poses[who],230)){
     actor(0,0,face,0,false,who);
   }
   ctx.restore();
 }
 // Foreground rail anchors the actors in the same physical room.
 rect(0,floor+5,W,4,'#243e4c');
 if(s.mode==='intervalDeparture'||s.mode==='paused'&&s.resumeMode==='intervalDeparture'){
  ctx.save();ctx.globalAlpha=Math.min(1,s.exitFade/1.1);rect(0,0,W,H,'#000');ctx.restore();
 }
}

intervalReady();

// Epilogue: the feed is cut. Do not turn Alexandra into a tombstone or a disembodied promotional portrait.
function drawAlexandraMemorial(s){
 ctx.clearRect(0,0,W,H);rect(0,0,W,H,'#040912');
 const x=W*.115,y=H*.14,w=W*.77,h=H*.62;
 rect(x-13,y-13,w+26,h+26,'#1b303b');rect(x,y,w,h,'#02050b');
 rect(x+8,y+8,w-16,2,'#2b5662');rect(x+8,y+h-10,w-16,2,'#2b5662');
 ctx.save();ctx.textAlign='center';ctx.fillStyle='#8eaab4';ctx.font=(W<560?12:17)+'px monospace';ctx.fillText('CAM 04 / TRANSMISSÃO ENCERRADA',W/2,H*.43);
 ctx.font=(W<560?10:13)+'px monospace';ctx.fillStyle='#b8869a';ctx.fillText('04:47  ·  SEM CANAL DE RETORNO',W/2,H*.49);ctx.restore();
}


