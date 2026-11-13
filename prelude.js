'use strict';
const homeBg=new Image(),districtBg=new Image(),auraCorridorBg=new Image();let homeLoaded=false,districtLoaded=false;
// Dedicated architectural passage to Aura: use the original corridor painting, never a recycled apartment interior.
auraCorridorBg.src='assets/production/corredor-47.png';
function preludeReady(){if(typeof updateBoot==='function')updateBoot();if(typeof ghostReady==='function')ghostReady();const b=$('start');if(b){b.disabled=!(ready&&homeLoaded&&districtLoaded&&lifeLoaded===2);b.textContent=b.disabled?'CARREGANDO HISTÓRIA…':'COMEÇAR A HISTÓRIA';}}
homeBg.onload=()=>{homeLoaded=true;preludeReady();};homeBg.src='assets/visual-v5/sierra-home-v5.png';districtBg.onload=()=>{districtLoaded=true;preludeReady();};districtBg.src='assets/visual-v5/district-routine-v5.png';
for(const im of [homeBg,districtBg])im.onerror=()=>{const b=$('start');if(b){b.disabled=false;b.textContent='RECARREGAR CENÁRIO';b.onclick=()=>location.reload();}};
const spectralCache=new WeakMap();
function spectralImage(im){if(!im.naturalWidth)return im;if(spectralCache.has(im))return spectralCache.get(im);const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.filter='grayscale(1) brightness(.65) contrast(1.5)';g.drawImage(im,0,0);g.filter='none';g.globalCompositeOperation='multiply';g.fillStyle='#70dba3';g.fillRect(0,0,c.width,c.height);spectralCache.set(im,c);return c;}
function beginPrelude(){if(!ready||!homeLoaded||!districtLoaded||lifeLoaded<2)return;leaveTerrace();$('game').classList.remove('cinematic');$('prologueUI').classList.add('hidden');$('conversationBox').classList.add('hidden');state=Prelude.create();scanToggle=false;keys.clear();touchKeys.clear();tapQueue.clear();document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('active'));camX=0;camY=330;$('overlay').classList.remove('encounter');$('overlay').classList.add('hidden');$('radio').style.display='none';$('pause').textContent='Ⅱ';syncTouchScanner();$('game').classList.add('prelude');radio('CAPÍTULO 1 / SIERRA CORE','A lente falhou sem deixar registro. Antes da clínica: Q / SCAN na bancada; E / USAR para conferir.',8);updateUI();window.SceneDirector?.enter(1);}
function drawPrelude(){ctx.clearRect(0,0,W,H);const s=state,wide=Prelude.widths[s.stage];camX+=(Math.max(0,Math.min(Math.max(0,wide-W),s.x-W*.4))-camX)*cameraBlend(.09);camY+=((H<650?Math.max(205,s.y-H*.74):Math.max(205,Math.min(390,s.y-H*.70)))-camY)*cameraBlend(.06);boundCamera(wide);ctx.save();const offset=s.stage==='home'?Math.max(0,(W-wide)/2):0;ctx.translate(offset-Math.round(camX),-Math.round(camY));rect(-W,0,wide+W*2,1300,'#080e19');const im=s.stage==='home'?homeBg:s.stage==='district'?districtBg:s.stage==='approach'&&auraCorridorBg.naturalWidth?auraCorridorBg:s.stage==='approach'?apartmentBg:bg;const imageW=s.stage==='district'?2400:s.stage==='trace'?5000:wide;const ih=im.naturalWidth?imageW*im.naturalHeight/im.naturalWidth:0;const baseline=s.stage==='home'?600/941:s.stage==='district'?.70:s.stage==='approach'?.87:.72;const imageY=800-ih*baseline;if(s.stage==='trace'&&window.TraceGallery){TraceGallery.drawBackground(ctx,wide,s.scan,spectralImage);}else{if(ih>0)ctx.drawImage(s.scan?spectralImage(im):im,0,imageY,imageW,ih);if(ih>0&&imageW<wide)ctx.drawImage(s.scan?spectralImage(im):im,imageW,imageY,imageW,ih);}if(s.stage==='approach'){
 // Distant neon remains in the masonry; the final twenty metres are deliberately unmarked.
 rect(0,0,wide,1000,'#08061548');
 ctx.save();
 for(const x of [220,790,1360,1860]){
   const flicker=.75+.18*Math.sin(s.time*(x===1360?3.2:1.1)+x*.01);
   rect(x-85,278,170,4,'#9c65cb66');
   rect(x-2,280,4,410,'#171c31aa');
   ctx.globalAlpha=.09*flicker;rect(x-74,286,148,355,'#b45bf0');ctx.globalAlpha=1;
 }
 // Floor-level conduits, a modest security camera, and a blind, unnumbered wall.
 rect(0,781,wide,3,'#a65bd157');rect(0,795,wide,2,'#4a284b');
 rect(590,494,9,132,'#202439');rect(589,492,26,8,'#50375d');
 ctx.fillStyle='#181927';ctx.beginPath();ctx.arc(622,504,10,0,Math.PI*2);ctx.fill();
 rect(616,503,6,2,'#dc5ab8');
 ctx.restore();
 }if(s.stage!=='trace')SceneryFinish.floor(wide,800,s.stage==='home'||s.stage==='approach'?'domestic':'industrial',s.time);else if(window.TraceGallery){TraceGallery.drawAtmosphere(ctx,wide,s.time);window.P52SceneDirection?.gallery(ctx,wide,s.time,s.scan);}if(s.mode==='playing')SceneryFinish.interactionAnchor(Prelude.near(s),800,s.stage==='home'?'warm':'cool',s.time);if(s.blackout)rect(0,0,wide,800,'#01071c77');
for(const p of Prelude.platforms(s))if(p.x+p.w>camX&&p.x<camX+W)platform(p);
if(s.stage==='district'){label('NEO ROCKFORD IS SAFE',1640,455,'#b8d9e8',20);if(!s.flags.repair){rect(1120,590,6,210,'#ed648e99');label('SEM ALIMENTAÇÃO',1120,565,'#f49fb4',12);}if(!s.flags.power){rect(3410,540,6,260,'#ef677f88');label('CONTROLE DE ACESSO',3410,520,'#f49fb4',12);}prop(7,680,800,272);if(s.flags.neriOutcome==='rescued'){label('ATENDIMENTO EM ANDAMENTO',1858,490,'#9feccc',12);rect(1862,505,8,24,'#7de1b4');}if(s.flags.beaconMarked){label('PASSAGEM SINALIZADA',3250,480,'#9feccc',12);}}
if(s.stage==='approach'){const opening=s.door?Math.min(1,Math.max(0,(s.time-(s.doorOpenedAt??(s.time-.85)))/.85)):0;if(!ProductionArt.door(2125,800,opening,310)){rect(2038,515,184,285,'#090e19');rect(2052+opening*68,530,142-opening*136,270,'#1d293a');rect(2038,515,5,285,'#bc966d');}label('B-3 / ACESSO TÉCNICO',2125,393,'#9e91ba',12);}
window.ScenePropsP61?.draw('prelude',s);const near=Prelude.near(s),homeAnchors={bed:[95,625],mirror:[230,550],mei:[338,690],photo:[505,500],radio:[610,500],bench:[545,657],communicator:[730,630],coffee:[842,640],screen:[950,600],exit:[1140,650]};
for(const o of Prelude.objects[s.stage]){if(o.x<camX-180||o.x>camX+W+180)continue;const active=near===o;let anchor=[o.x,635];if(s.stage==='home'){anchor=homeAnchors[o.id];}else if(s.stage==='trace'&&window.TraceGallery){anchor=TraceGallery.drawStation(ctx,o,s);}else if(s.stage==='trace'){anchor=[o.x,652];}else{const map={gate:4,repair:s.flags.repair?1:0,clinic:4,maintenance:6,signature:0,power:6,terminal:5,music:2,credential:4,solder:1,camera:5,files:5,resident:4};if(o.id in map){const h=['music'].includes(o.id)?66:['gate','clinic','credential','resident'].includes(o.id)?140:190;if(!window.ScenePropsP61?.has('prelude',s.stage,o.id))prop(map[o.id],o.x,o.id==='resident'?700:800,h);anchor=[o.x,800-h-20];}if(o.id==='signature'){droneBody({x:o.x,y:780});anchor=[o.x,585];}if(o.id==='exit'&&s.stage!=='approach'){label('SAÍDA',o.x,580,'#a7e5cd',13);anchor=[o.x,660];}}
if(!active&&NPCQuests.target(s)===o.id&&Math.abs(o.x-s.x)<360)label('◇',anchor[0],anchor[1]-24,'#7cf4f1',18);if(active){actionHalo(...anchor);if(s.stage!=='home'&&W>=650)label(o.name,anchor[0],anchor[1]-24,'#ffe0a8',13);}else if(s.scan)rect(anchor[0]-2,anchor[1]-2,4,4,'#85fac7');
if(s.scan&&['bench','repair','signature','terminal'].includes(o.id)&&active){const pct=Math.min(1,(s.progress[o.id]||0)/(o.id==='signature'?1:.8));rect(anchor[0]-35,anchor[1]+18,70,4,'#17352b');rect(anchor[0]-35,anchor[1]+18,70*pct,4,'#9affd4');}
if(s.scan&&s.stage!=='home'&&s.stage!=='trace'){ctx.strokeStyle='#77ffc755';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(o.x,750);ctx.lineTo(o.x,818);ctx.lineTo(o.x+160,818);ctx.stroke();if(['signature','terminal','camera'].includes(o.id))for(let j=0;j<3;j++)rect(o.x-12+j*10,anchor[1]+10,4,4,'#fb83d9');}}

for(const n of Prelude.npcs(s)){citizen(n,800,n.departing);const questStatus=NPCQuests.status(s,n.id);if(!n.departing&&(near?.id===n.id||NPCQuests.target(s)===n.id&&Math.abs(n.x-s.x)<360)&&questStatus==='active')label('◇',n.x,568,'#7cf4f1',19);if(!n.departing&&near?.id===n.id){actionHalo(n.x,555);label(n.name,n.x,527,'#f1d29b',13);}}
if(s.scan){ctx.strokeStyle='#84f6b966';ctx.strokeRect(s.x-65,s.y-226,130,231);}
if(s.stage==='district'||s.stage==='trace')actor(s.jinxX,800,s.jinxFace||1,s.jinxFoot||0,s.jinxMoving,'jinx');
for(const d of Prelude.drones(s)){if(!s.blackout&&!s.jinxPulse){ctx.fillStyle='#ec47952a';ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.range,800);ctx.lineTo(d.x+d.range,800);ctx.closePath();ctx.fill();}droneBody(d);}if(s.jinxPulse){ctx.strokeStyle='#7bf9da55';ctx.beginPath();ctx.arc(s.jinxX,685,100+Math.sin(s.time*7)*25,0,Math.PI*2);ctx.stroke();}
// V10.6: no duplicated silhouette over the hideout trail or threshold.
if(s.dash>0&&s.stage==='district'){ctx.save();ctx.globalAlpha=.11;actor(s.x-s.face*35,s.y,s.face,s.foot,true);ctx.restore();}
if(s.stage==='home'&&typeof drawCat==='function')drawCat(338,800);
if(s.stage==='home'&&s.interactId==='mei'&&s.interact>0&&window.NeoActors){
 ctx.save();ctx.translate(Math.round(s.x),Math.round(s.y));ctx.scale(s.face||1,1);
 if(!NeoActors.draw('sierra',4,195))actor(0,0,1,0,false);ctx.restore();
} else {ctx.save();
 // Scene-floor anchoring: contact shadow sits at ground 800, never follows body in the air.
 // Keeps Sierra visually planted in the service corridor and the hideout threshold.
 if(s.grounded&&['trace','approach'].includes(s.stage)){
  ctx.globalAlpha=.34;ctx.fillStyle='#050613';ctx.beginPath();ctx.ellipse(s.x,801,24,4.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 }
 actor(s.x,s.y,s.face,s.foot,Math.abs(s.vx)>0);ctx.restore();}if(s.interact>0&&!near?.npc){ctx.strokeStyle='#eac58c88';ctx.beginPath();ctx.arc(s.x+s.face*35,s.y-130,14*(1-s.interact/.65),0,Math.PI*2);ctx.stroke();}atmosphere(s.stage,wide);ctx.restore();signalGlitch();
if(s.fragment>0&&auraLoaded){ctx.save();ctx.globalAlpha=.65;ctx.drawImage(auraSprite,410,130,220,130,W/2-110,H/2-65,220,130);ctx.restore();label('FRAME 007 / DADOS INCOMPLETOS',W/2,H/2+90,'#fab4d9');}if(s.stage==='trace'&&s.seen.match&&s.glitch>0)label(s.glitch>.7?'PARTIAL MATCH: SIERRA CORE':'ERROR / LEITURA INTERROMPIDA',W/2,H*.42,'#f9adcf',16);
}
function updatePreludeUI(){const s=state;updateNPCJournal();$('game').classList.add('prelude');$('missionChapter').textContent={home:'CAPÍTULO 1 / SIERRA CORE',district:'CAPÍTULO 1 / DISTRITO 07',trace:'CAPÍTULO 1 / ACESSO AO ESCONDERIJO',approach:'CAPÍTULO 1 / DO OUTRO LADO'}[s.stage];$('health').textContent='▰ '.repeat(Math.max(0,s.hp))+'▱ '.repeat(3-Math.max(0,s.hp));$('energy').style.width=s.energy+'%';$('clues').textContent=s.stage==='home'?'06:42 / CASA':s.flags.terminal?'A. T. LOVELACE':s.flags.signature?'AU-RA/7F':'REDE LOCAL';$('objective').textContent=s.stage==='home'?(s.flags.bench?'Saia quando estiver pronta':'Confira a lente na bancada'):s.stage==='district'?(!s.flags.repair?'Restaure o quadro elétrico':!s.flags.signature?'Siga a falha na rede':!s.flags.power?'Isole a alimentação local':'Atravesse a passagem de serviço'):s.stage==='trace'?(!s.flags.terminal?'Recupere a trilha offline do esconderijo':!s.flags.credential?'Confira a porta técnica':!s.flags.camera?'Reconstrua o arquivo da câmera':'Siga a passagem camuflada até Aura'):'Encontre a porta B-3';$('alert').style.display=s.alarm>2?'block':'none';$('alarm').style.width=s.alarm+'%';const o=Prelude.near(s);let hint=o?(o.npc?'E / CONVERSAR · ':'E / USAR · ')+o.name:'';if(o&&['bench','repair','signature','terminal'].includes(o.id)&&!s.flags[o.id])hint='Q / SCAN · '+o.name+(o.id==='signature'?'':' · E / USAR');if(o&&['bench','repair','terminal'].includes(o.id)&&!s.flags[o.id]&&(s.progress[o.id]||0)>=.8)hint='LEITURA COMPLETA · E / USAR para '+({bench:'calibrar a lente',repair:'restaurar a alimentação',terminal:'recuperar a sessão'}[o.id]);if(!hint&&s.stall>8)hint=s.stage==='home'?'A bancada fica sob a luminária · A / D ou setas para andar':s.stage==='district'&&!s.flags.repair?'O quadro fica perto de Mara, sob a luz magenta · Q para identificar, E para usar':'';$('hint').textContent=hint;$('hint').style.display=hint&&s.mode==='playing'?'block':'none';if(state.mode==='playing'&&performance.now()>radioUntil)$('radio').style.display='none';}
function preludeEvents(){for(const ev of state.events.splice(0)){if(ev.type==='conversation')showConversation();if(ev.type==='music'&&sound){beep(220,.45,'triangle',.012);chapterLater(()=>beep(330,.45,'triangle',.012),230);}if(ev.type==='transition'){camX=0;camY=330;scanToggle=false;syncTouchScanner();$('radio').style.display='none';if(ev.text==='trace')radio('GALERIA TÉCNICA / DISTRITO 07','A trilha do cabo termina atrás de uma porta de manutenção. Jinx a fecha: os consoles ficam embutidos na parede, longe da rua.',6);}if(ev.type==='object')radio(ev.title,ev.text,6);if(ev.type==='radio')radio(ev.speaker,ev.text,4);if(ev.type==='signal'){radio('LEITURA LOCAL',ev.text,3);beep(420,.09);chapterLater(()=>beep(520,.09),140);chapterLater(()=>beep(420,.12),280);}if(ev.type==='voice')radio('VOZ / ORIGEM DESCONHECIDA','Sierra.',3);if(ev.type==='camera')radio('REGISTRO CORROMPIDO','Um vulto cruza a imagem antes de o relógio saltar. Sierra não consegue identificar o rosto.',5);if(ev.type==='door'){beep(280,.15);radio('SIERRA',state.flags.intercomChecked?'A. Lovelace. A porta destravou sem ninguém atender. Jinx, espera aqui um instante.':'A porta destravou sozinha. Jinx, espera aqui um instante.',4);}if(ev.type==='damage')radio('JINX','Pela direita, Sierra. Eu cubro sua saída.',4);if(ev.type==='lost')showPanel('Ainda existe<br><em>uma saída.</em>','O distrito ainda tem uma saída. Use as coberturas e desligue o scanner nos fachos.','RETOMAR DO PONTO SEGURO',()=>{Prelude.retry(state);$('overlay').classList.add('hidden');});if(ev.type==='apartment'){NPCQuests.remember(state);$('game').classList.remove('prelude');ChapterCurtain.to(2,beginApartment);}}}
$('start').onclick=beginPrelude;preludeReady();

/* Mission journal for district citizens and the optional club water delivery. */
let questJournalCached='';
function updateNPCJournal(force=false){
 const club=state.chapter===5&&state.stage==='club';
 const active=(state.chapter===1&&['district','trace'].includes(state.stage))||club;
 const btn=$('questToggle');btn.classList.toggle('hidden',!active);const count=club?(state.flags.waterRequested&&!state.flags.waterDelivered?1:0):NPCQuests.listing(state).filter(q=>q.status==='active').length;const caption='M / MISSÕES'+(count?' · '+count:'');if(btn.textContent!==caption)btn.textContent=caption;
 if(!active){$('questPanel').classList.add('hidden');btn.setAttribute('aria-expanded','false');questJournalCached='';return;}
 if($('questPanel').classList.contains('hidden'))return;
 const list=$('questList'),labels={available:'DISPONÍVEL',active:'EM ANDAMENTO',complete:'CONCLUÍDA',declined:'NÃO ACEITA'};
 const quests=club?[]:NPCQuests.listing(state).filter(q=>q.status!=='available');
 const key=JSON.stringify({chapter:state.chapter,tracked:NPCQuests.tracked(state),quests:quests.map(q=>[q.id,q.status]),water:club?[!!state.flags.waterRequested,!!state.flags.waterCarried,!!state.flags.waterDelivered]:null,history:club?NPCQuests.history():null});
 if(!force&&key===questJournalCached)return;
 questJournalCached=key;list.replaceChildren();
 if(club){
  const row=document.createElement('article');row.className='quest-entry';const title=document.createElement('strong');title.textContent='ÁGUA SEM IDENTIFICAÇÃO';const status=document.createElement('span');status.textContent=state.flags.waterDelivered?'CONCLUÍDA':state.flags.waterRequested?'EM ANDAMENTO':'DISPONÍVEL';const desc=document.createElement('p');desc.textContent=state.flags.waterDelivered?'Rafa recebeu a água sem precisar entregar a identidade.':state.flags.waterCarried?'Encontre Rafa, ao lado da pista, e entregue a água.':'Converse com Rafa na pista e peça água no balcão.';row.append(title,status,desc);list.appendChild(row);
  const saved=NPCQuests.history();
  if(saved&&saved.outcome){const row2=document.createElement('article');row2.className='quest-entry';const tt=document.createElement('strong');tt.textContent='DISTRITO 07 / DONA NERI';const pp=document.createElement('p');pp.textContent=saved.outcome==='rescued'?'A autorização foi corrigida. Dona Neri conseguiu entrar na clínica.':saved.outcome==='escorted'?'Jinx conseguiu contato com a filha dela, sem falsificar um atendimento.':'Sierra saiu sem intervir; a situação continua pendente.';row2.append(tt,pp);list.appendChild(row2);}
  return;
 }
 if(!quests.length){const msg=document.createElement('p');msg.textContent='As tarefas surgem nas conversas. Aproxime-se de alguém e use E / CONVERSAR. Você escolhe quais aceitar; a investigação principal continua independente.';list.appendChild(msg);return;}
 const current=NPCQuests.tracked(state);
 const heading=document.createElement('p');heading.className='quest-section';heading.textContent='EM ANDAMENTO · '+quests.filter(q=>q.status==='active').length;list.appendChild(heading);
 function row(q,parent){
  const entry=document.createElement('article');entry.className='quest-entry'+(q.id===current?' quest-current':'');
  const title=document.createElement('strong');title.textContent=q.title;
  const status=document.createElement('span');status.textContent=q.id===current?'ACOMPANHANDO':labels[q.status];
  const desc=document.createElement('p');desc.textContent=q.status==='complete'?q.done:q.status==='active'?q.goal:'Você pode retornar e oferecer ajuda.';entry.append(title,status,desc);
  if(q.status==='active'){
   const button=document.createElement('button');button.className='quest-track';button.textContent=q.id===current?'PARAR DE ACOMPANHAR':'ACOMPANHAR';
   button.onclick=()=>{if(state.mode!=='journal')return;NPCQuests.track(state,q.id===NPCQuests.tracked(state)?null:q.id);updateNPCJournal(true);};entry.appendChild(button);
  }
  parent.appendChild(entry);
 }
 const activeQuests=quests.filter(q=>q.status==='active').sort((a,b)=>(b.id===current)-(a.id===current));
 activeQuests.forEach(q=>row(q,list));
 if(!activeQuests.length){const empty=document.createElement('p');empty.textContent='Nenhuma tarefa opcional pendente.';list.appendChild(empty);}
 for(const [status,title] of [['complete','CONCLUÍDAS'],['declined','ADIADAS']]){
  const group=quests.filter(q=>q.status===status);if(!group.length)continue;
  const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=title+' · '+group.length;details.appendChild(summary);group.forEach(q=>row(q,details));list.appendChild(details);
 }
}
function closeNPCJournal(){
 if(state.mode!=='journal')return;
 $('questPanel').classList.add('hidden');$('questToggle').setAttribute('aria-expanded','false');
 state.mode='playing';clearControl();state.useWas=true;radioUntil=performance.now()+pausedRadioRemaining;resumeChapterTimers();
}
$('questToggle').onclick=()=>{
 if(![1,5].includes(state.chapter))return;
 if(state.mode==='journal'){closeNPCJournal();return;}if(state.mode!=='playing')return;
 pausedRadioRemaining=Math.max(0,radioUntil-performance.now());pauseChapterTimers();clearControl();state.mode='journal';
 $('questPanel').classList.remove('hidden');$('questToggle').setAttribute('aria-expanded','true');questJournalCached='';updateNPCJournal(true);
};
$('questClose').onclick=closeNPCJournal;
qaListen(window,'keydown',e=>{
 if(e.repeat)return;
 if(state.mode==='journal'&&['KeyM','Escape'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();closeNPCJournal();return;}
 if([1,5].includes(state.chapter)&&state.mode==='playing'&&e.code==='KeyM'){e.preventDefault();e.stopImmediatePropagation();$('questToggle').click();}
},true);

/* RC46_CLEANUP_QUESTS: keep the campaign on a single line of play.
   Optional mission journal and club side-task UI stay disabled in the principal build. */
(function(){
  const hideQuestUI=()=>{
    $('questToggle')?.classList.add('hidden');
    $('questPanel')?.classList.add('hidden');
    if($('questToggle')) $('questToggle').setAttribute('aria-expanded','false');
  };
  updateNPCJournal=function(){hideQuestUI();};
  closeNPCJournal=function(){hideQuestUI(); if(state.mode==='journal'){state.mode='playing'; clearControl(); state.useWas=true; resumeChapterTimers();}};
  if($('questToggle')) $('questToggle').onclick=(e)=>{e?.preventDefault?.(); hideQuestUI();};
  if($('questClose')) $('questClose').onclick=(e)=>{e?.preventDefault?.(); closeNPCJournal();};
  hideQuestUI();
})();
