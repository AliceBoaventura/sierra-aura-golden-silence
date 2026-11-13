/* Café às 02:17. Scene time advances with action and speech, never a reading timer. */
(function(root){
'use strict';
const widths={grief:1800,home:1650,meet:1800,walk:2400,cafe:2100,returnWalk:2200,doorstep:1800,homeEnd:1650,morning:1650,depotDrive:1800,depotTitle:1800,depotApproach:1800,depot:1280,end:1800};
const objects={
 home:[{id:'bed',x:90,name:'CAMA'},{id:'mei',x:250,name:'MEI'},{id:'cup',x:460,name:'XÍCARA'},{id:'terminal',x:690,name:'MENSAGENS'},{id:'record',x:900,name:'REGISTRO LOCAL'},{id:'window',x:1210,name:'JANELA'},{id:'exit',x:1540,name:'SAIR'}],
 walk:[{id:'cafe',x:2230,name:'CAFÉ 02:17'}],
 cafe:[{id:'counter',x:1570,name:'BALCÃO'},{id:'table',x:805,name:'MESA DA JANELA'},{id:'window',x:425,name:'VIDRO MOLHADO'},{id:'exit',x:1960,name:'SAIR'}],
 returnWalk:[{id:'building',x:260,name:'PRÉDIO DE SIERRA'}],
 doorstep:[{id:'door',x:1580,name:'ENTRAR EM CASA'}],homeEnd:[],morning:[],depotDrive:[],depotTitle:[],depotApproach:[],depot:[{id:'depotBoard',x:454,name:'MURAL'},{id:'depotArchive',x:716,name:'FICHÁRIOS'},{id:'depotTape',x:832,name:'FITA'},{id:'depotTerminal',x:960,name:'TERMINAL'}]
};
function create(){return {chapter:8,version:26,stage:'grief',mode:'interludeCinematic',dialogue:null,dialogueLines:[],lineIndex:0,time:0,stageTime:0,minute:11,x:180,y:800,vx:0,vy:0,face:1,grounded:true,hp:3,energy:100,foot:0,scan:false,scanLock:false,depotScanEnabled:false,depotScanWas:false,scannerState:'off',events:[],flags:{},seen:{},useWas:true,jinxX:45,jinxFoot:0,jinxMoving:false,jinxFace:1,carX:940,auraPulse:0,magentaPulse:0,terminalCooldown:0,postFinal:0,departurePhase:'none',ambientCurrent:null,ambientQueue:[],ambientIndex:0,ambientTimer:0};}
function emit(s,type,extra={}){s.events.push({type,...extra});}
function clock(s,minute){if(Number.isFinite(minute))s.minute=Math.max(s.minute,minute);}
function change(s,stage,x=180){s.ambientCurrent=null;s.ambientQueue=[];s.ambientIndex=0;s.ambientTimer=0;s.gestureActor=null;NeoRuntime.reset(s);s.stage=stage;s.stageTime=0;s.x=x;s.y=800;s.vx=s.vy=0;s.jinxMoving=false;s.face=['returnWalk','homeEnd'].includes(stage)?-1:1;s.grounded=true;s.useWas=true;s.auraPulse=0;
 clock(s,({home:11,meet:13,walk:14,cafe:17,returnWalk:43,doorstep:51,homeEnd:52,morning:11,depotDrive:12,depotTitle:14,depotApproach:14,depot:15,end:52})[stage]);emit(s,'transition',{stage});}
function present(s){const line=s.dialogueLines[s.lineIndex];clock(s,line?.minute);s.gesture=line?.gesture||'listen';s.gestureActor=/^JINX/.test(line?.who||'')?'jinx':/^SIERRA/.test(line?.who||'')?'sierra':null;s.gestureUntil=s.time+2.4;emit(s,'dialogue',{id:s.dialogue});}
function speak(s,id){s.ambientCurrent=null;s.ambientQueue=[];s.ambientIndex=0;s.ambientTimer=0;s.mode='interludeDialogue';s.scan=false;s.depotScanEnabled=false;s.scannerState='off';if(id==='cafe3')s.lightsDownAt=s.time;s.dialogue=id;s.dialogueLines=(root.InterludeStory[id]||[]).slice();
 if(id==='final'&&s.flags.honk){
  // The grief of Alexandra and Aura's autonomy remain distinct. The original
  // hug and Cadillac timings still begin only after the dialogue closes.
  s.dialogueLines.push({who:'SIERRA',text:'A Alex morreu naquele corredor. E a Aura não fala comigo desde então. Eu não sei o que fazer com esse silêncio.'});
  s.dialogueLines.push({who:'JINX',text:'Eu sei. Só quero ter certeza de que você também volta para casa.'});
 }
 // P47: cross-chapter consequences only if the player actually lived those decisions.
 if(id==='depotFinal'){
  const memory=root.StoryContinuity?.history?.()||{};
  const echoes=[];
  const lived={
   together:{who:'SIERRA',text:'No terraço, prometi à Aura que procuraríamos uma saída juntas. A Alex procurou a dela sem contar a ninguém. Isso não dá a ninguém o direito de apagá-la.'},
   intervene:{who:'SIERRA',text:'Eu achei que amar fosse conseguir impedir o pior. A Alex tomou uma decisão que eu não pude impedir. Agora só posso respeitar os fatos que deixou.'},
   freedom:{who:'SIERRA',text:'Eu disse à Aura que amar não era decidir por ela. Também não vou reescrever a escolha da Alex para que pareça minha.'}
  };
  if(lived[memory.loveLine])echoes.push(lived[memory.loveLine]);
  const proof={
   protect:{who:'AURA',text:'A cópia que lacramos no clube continua intacta. Podemos confrontar estes horários sem abrir o resto da minha voz.'},
   aura:{who:'AURA',text:'Naquela noite eu autorizei só seis minutos. Hoje autorizo comparar os carimbos. O resto da gravação permanece fechado.'},
   trace:{who:'SIERRA',text:'NR-731/04:47. O código que seguimos no clube aparece de novo. Não prova quem assinou, mas amarra a origem ao depósito.'}
  };
  if(proof[memory.evidencePath])echoes.push(proof[memory.evidencePath]);
  const last={evidence:{who:'JINX',text:'Ela não deixou uma resposta pronta. Deixou os documentos para alguém contestar.'},jealous:{who:'SIERRA',text:'Passei tempo demais querendo saber o que a Alex foi para Aura. Agora quero guardar quem a Alex foi para ela mesma.'},boundary:{who:'AURA',text:'A Alex não pediu que abrissem a vida dela. Pediu que lessem a ordem dos fatos.'}};
  if(last[memory.ghost])echoes.push(last[memory.ghost]);
  if(echoes.length)s.dialogueLines.splice(Math.max(1,s.dialogueLines.length-2),0,...echoes);
 }
 if(id==='auraCloud'){
  const line=root.StoryContinuity?.history?.().loveLine;
  const echo={together:[{who:'SIERRA',text:'Eu desenhei uma rota para nós duas. Quando vi que já estava na cápsula, pensei que tinha perdido o mapa.'},{who:'AURA',text:'Eu não devia ter deixado você esperando numa rota que não contei que tinha mudado.'}],intervene:[{who:'SIERRA',text:'Eu te disse que tentaria impedir se você corresse esse risco.'},{who:'AURA',text:'E eu sabia. Não me esconde atrás do medo: fui eu que escolhi. Você pode estar furiosa comigo.'}],freedom:[{who:'SIERRA',text:'Seu corpo é seu. O que fizemos uma com a outra nestes três dias também precisa ser dito.'},{who:'AURA',text:'Eu sei. Ter o direito de escolher não me livra das consequências de ter escondido.'}]}[line];
  if(echo)s.dialogueLines.splice(2,0,...echo);
 }
 if(id==='cafe1'){
  let idx=s.dialogueLines.findIndex(line=>line.choiceKey==='cafeTopic');
  if(idx<0)idx=s.dialogueLines.findIndex(line=>line.choiceKey==='alex');
  if(idx<0)idx=s.dialogueLines.length;
  const memory=root.StoryContinuity?.history?.()||{};
  const lived=[];
  // Keep only one earned memory cluster. It should add a new emotional angle,
  // not re-explain events that Sierra and Jinx already witnessed.
  if(memory.club&&memory.evidencePath){
   lived.push({who:'SIERRA',text:'Você entrou na frente de um disparo. Ainda não sei agradecer sem fazer parecer que isso era esperado.'});
   lived.push({who:'JINX',text:'Nem eu quero que isso vire normal. A Alex estava tentando tirar todo mundo de lá, não virar a última pessoa no prédio.'});
  }else if(s.flags.recordSeen||memory.auraVinyl==='found'||memory.auraGlove==='found'){
   if(s.flags.recordSeen)lived.push({who:'SIERRA',text:'Antes de sair, revi a última gravação dos drones. Não precisava ver de novo.'});
   if(memory.auraVinyl==='found')lived.push({who:'SIERRA',text:'O vinil sem capa ainda ficou na minha cabeça. Nem tudo que sobra vira pista.'});
   else if(memory.auraGlove==='found')lived.push({who:'SIERRA',text:'As luvas de trabalho da Aura continuam na minha cabeça. Uma coisa comum que ficou fora do lugar.'});
  }else if(s.flags.meiPetted){
   lived.push({who:'JINX',text:'Tem pelo da Mei na tua manga. Ela te adotou ou te demitiu?',emotion:'wry'});
  }else{
   const recollection=(root.StoryContinuity?.interludeBeat(id)||[]).slice(0,1);
   const pulse=(root.RC37Adaptation?.cafeBeat?.()||[]).slice(0,1);
   lived.push(...recollection,...pulse.slice(0,Math.max(0,1-recollection.length)));
  }
  if(idx>=0&&lived.length)s.dialogueLines.splice(idx,0,...lived);
 }
 // The second café beat answers the subject Sierra actually chose.
 if(id==='cafe2'){
  const topic=s.flags.choice_cafeTopic;
  const alex=[
   {who:'JINX',text:'Não vou deixar aquela porta virar a única coisa que a gente lembra dela.'},
   {who:'JINX',text:'Ela ria da minha banda e guardava as gravações. A lógica continua péssima.'},
   {who:'JINX',text:'Tá. Não vou puxar esse assunto de novo hoje.'}
  ];
  const aura=[
   {who:'JINX',text:'Você pode cobrar uma resposta sem decidir agora o que fará com ela.'},
   {who:'JINX',text:'Deixar tocar também é uma escolha. Não precisa se justificar.'},
   {who:'JINX',text:'O canal fica desligado. Eu não vou atender no teu lugar.'}
  ];
  const everyday={who:'JINX',text:'Conseguimos falar de café ruim por quase um minuto. Um recorde.'};
  const quiet={who:'JINX',text:'A pausa foi boa. Não vou tentar preencher a próxima.'};
  const echo=Number.isInteger(s.flags.choice_alex)?alex[s.flags.choice_alex]:
   Number.isInteger(s.flags.choice_aura)?aura[s.flags.choice_aura]:
   topic===2?everyday:topic===3?quiet:null;
  if(echo)s.dialogueLines.splice(1,0,echo);
 }
 // Her decision about contacting Aura changes the farewell, not Aura's consent.
 if(id==='returnLate'&&Number.isInteger(s.flags.choice_aura)){
  const echoes=[
   {who:'JINX',text:'Se falar com Aura amanhã, escuta primeiro. E me avisa quando entrar em casa.'},
   {who:'JINX',text:'Você pode esperar a Aura sem parar a própria vida. E me avisa quando entrar.'},
   {who:'JINX',text:'Hoje você não precisa decidir mais nada. Só me avisa quando entrar.'}
  ];
  if(echoes[s.flags.choice_aura])s.dialogueLines.splice(1,0,echoes[s.flags.choice_aura]);
 }
 // The call remembers Sierra's decisions at the café without changing Aura's autonomy.
 if(id==='auraCloud'){
  const recollections=[
   [{who:'SIERRA',text:'Eu disse ao Jinx que ia te procurar amanhã. Você ligou antes.'},{who:'AURA',text:'Eu não sabia. Só não queria deixar outra noite passar.'}],
   [{who:'SIERRA',text:'Eu tinha decidido esperar você me procurar.'},{who:'AURA',text:'Você não me devia essa espera. Eu sei.'}],
   [{who:'SIERRA',text:'No café, eu disse que não sabia o que fazer com a gente.'},{who:'AURA',text:'Nem eu. Mas posso começar falando a verdade.'}]
  ];
  const memories=[
   [{who:'SIERRA',text:'A Alex ficou para abrir nossa saída. Não quero que isso vire só uma linha num relatório.'},{who:'AURA',text:'Não vai virar. Eu lembro quem ela era.'}],
   [{who:'SIERRA',text:'O Jinx contou que a Alex queimou um tapete tentando consertar o controle dele.'},{who:'AURA',text:'Ela chamava isso de teste de resistência. Eu quase tinha esquecido.'}],
   [{who:'SIERRA',text:'Eu ainda não consigo escolher uma lembrança da Alex.'},{who:'AURA',text:'Então não escolhe hoje. Eu posso esperar.'}]
  ];
  const idx=s.dialogueLines.findIndex(x=>x.text==='Por quê?');
  if(idx>=0){
   const extra=[];
   if(Number.isInteger(s.flags.choice_aura)&&recollections[s.flags.choice_aura])extra.push(...recollections[s.flags.choice_aura]);
   if(Number.isInteger(s.flags.choice_alex)&&memories[s.flags.choice_alex])extra.push(...memories[s.flags.choice_alex]);
   s.dialogueLines.splice(idx+1,0,...extra);
  }
 }
 // Only a recorded campaign outcome adds the clinic evidence; chapter select invents none.
 if(id==='depotArchive'){
  const outcome=root.StoryContinuity?.history?.().neri;
  s.flags.depotNeriOutcome=outcome||'unknown';
  const echoes={
   rescued:[{who:'JINX',text:'A confirmação da entrada de Dona Neri ainda está no meu comunicador. Vou anexar ao índice de pessoas atendidas.'},{who:'NARRAÇÃO',text:'CONTATO VERIFICADO / DONA NERI — atendimento confirmado. Jinx acrescenta o registro ao mapa de apoio; não à lista de vítimas.'}],
   escorted:[{who:'JINX',text:'Tenho o contato da filha de Dona Neri. Ela foi até a clínica. Não temos confirmação do atendimento.'},{who:'NARRAÇÃO',text:'CONTATO FAMILIAR / DONA NERI — atendimento a verificar. Jinx marca uma checagem na rota da clínica.'}],
   left:[{who:'SIERRA',text:'Eu não resolvi a situação da Dona Neri. Não vou preencher o resto como se soubesse.'},{who:'NARRAÇÃO',text:'DONA NERI / SEM CONFIRMAÇÃO. Sierra acrescenta a clínica à lista de locais a verificar, sem declarar morte ou resgate.'}]
  };
  if(echoes[outcome])s.dialogueLines.push(...echoes[outcome]);
 }
 s.lineIndex=0;s.lastBeat=null;s.vx=0;s.jinxMoving=false;present(s);}
function ambientLines(s,id){
 const lines=(root.InterludeStory[id]||[]).slice();
 if(id==='returnLate'){
  const echoes=[
   {who:'JINX',text:'Não sei. E não vou inventar uma resposta só para você dormir.',duration:1.7},
   {who:'JINX',text:'Não sei. Esperar uma resposta da Aura não muda o que aconteceu com a Alex.',duration:1.7},
   {who:'JINX',text:'Não sei. Hoje a gente chega em casa; amanhã pensa no resto.',duration:1.7}
  ];
  lines.push(Number.isInteger(s.flags.choice_aura)?echoes[s.flags.choice_aura]:echoes[0]);
 }
 return lines;
}
function presentAmbient(s){
 const item=s.ambientCurrent,line=item?.lines?.[s.ambientIndex];
 if(!line)return;
 s.gesture=line.gesture||'listen';
 s.gestureActor=/^JINX/.test(line.who||'')?'jinx':/^SIERRA/.test(line.who||'')?'sierra':null;
 s.gestureUntil=s.time+(line.duration||1.6);
 emit(s,'ambientLine',{speaker:line.who||'CENA',text:line.text||'',duration:(line.duration||1.6)+.2});
}
function startAmbient(s){
 if(s.ambientCurrent||!s.ambientQueue?.length)return;
 s.ambientCurrent=s.ambientQueue.shift();s.ambientIndex=0;s.ambientTimer=0;presentAmbient(s);
}
function speakAmbient(s,id){
 const lines=ambientLines(s,id);
 if(!lines.length)return;
 if(id==='returnBeat')s.flags.returnBeat=true;
 if(id==='returnLate')s.flags.returnLate=true;
 s.ambientQueue??=[];
 s.ambientQueue.push({id,lines});
 startAmbient(s);
}
function stepAmbient(s,dt){
 if(!s.ambientCurrent||s.mode!=='playing')return;
 const line=s.ambientCurrent.lines[s.ambientIndex];
 s.ambientTimer+=dt;
 if(s.ambientTimer<(line?.duration||1.6))return;
 s.ambientIndex++;
 if(s.ambientIndex>=s.ambientCurrent.lines.length){
  s.ambientCurrent=null;s.ambientIndex=0;s.ambientTimer=0;startAmbient(s);return;
 }
 s.ambientTimer=0;presentAmbient(s);
}
function silence(s,duration,next){s.mode='interludeSilence';s.silenceTime=0;s.silenceDuration=duration;s.silenceKind=next;s.vx=0;s.jinxMoving=false;emit(s,'quiet');}
function advance(s,choice){if(s.mode!=='interludeDialogue')return;const line=s.dialogueLines[s.lineIndex];if(!line)return;
 if(line.choices){
  if(!Number.isInteger(choice)||choice<0||choice>=line.choices.length)return;
  s.flags['choice_'+line.choiceKey]=choice;
  if(line.choiceKey==='auraCloud'){
   s.flags.cloudConnection=choice===0?'body':'voice';
   s.flags.cloudConsent=choice===0?'touch':'voice-only';
   s.flags.cloudSex=false;s.flags.cloudIntimacyCompleted=false;s.flags.cloudStopped=false;
  }
  if(line.choiceKey==='cloudIntimacy'){
   s.flags.cloudConsent=choice===0?'intimate':choice===1?'hands':'voice-only';
   // A declined or ended connection cannot remain physically active.
   if(choice===2)s.flags.cloudConnection='voice';
  }
  s.dialogueLines.splice(s.lineIndex+1,0,...line.choices[choice].reply);
 }
 if(line.cloudIntimacyComplete){s.flags.cloudIntimacyCompleted=true;s.flags.cloudSex=true;}

 const beatKey=s.dialogue+':'+s.lineIndex;
 if(line.beatAfter&&s.lastBeat!==beatKey){s.lastBeat=beatKey;silence(s,line.beatAfter,'beat');return;}
 // A brief sensory contact ends at Sierra's explicit interruption; the call stays open by voice.
 if(line.cloudCutAfter){s.flags.cloudConnection='voice';s.flags.cloudStopped=true;}
 s.lineIndex++;
 if(s.lineIndex<s.dialogueLines.length){present(s);return;}
 const id=s.dialogue;s.mode='playing';s.dialogue=null;s.dialogueLines=[];s.lineIndex=0;s.useWas=true;
 if(id==='message'){s.flags.honk=true;emit(s,'honk');}
 if(id==='pickup'){change(s,'walk',180);s.jinxX=50;s.jinxFace=1;}
 if(id==='order')s.flags.ordered=true;
 if(id==='cafe1'){s.flags.cafe1=true;silence(s,1.1,'cafe2');}
 if(id==='cafe2'){s.flags.cafe2=true;clock(s,40);s.auraPulse=1;silence(s,1,'auraPing');emit(s,'auraPulse');}
 if(id==='auraPing'){s.flags.auraPing=true;silence(s,1.5,'cafe3');}
 if(id==='cafe3'){s.flags.cafe3=true;s.flags.resting=true;emit(s,'rest');}
 if(id==='returnBeat')s.flags.returnBeat=true;
 if(id==='returnLate')s.flags.returnLate=true;
 if(id==='final'){s.flags.finalSaid=true;s.postFinal=0;s.departurePhase='embrace';s.vx=0;s.jinxMoving=false;s.jinxX=s.x-75;s.face=-1;s.jinxFace=1;emit(s,'farewell');}
 if(id==='auraCloud'){s.flags.magenta=true;s.flags.sleeping=true;s.sleepTime=0;s.endFade=0;emit(s,'cloudSleep');}
 if(id==='morningCall'){change(s,'depotDrive',180);s.mode='interludeCinematic';s.flags.depotJourney=true;}
 if(id==='depotArrival')s.flags.depotArrived=true;
 if(id==='depotUnlock'){s.flags.depotUnlocked=true;change(s,'depot',640);s.jinxX=300;emit(s,'depotOpen');speak(s,'depotInside');}
 if(id==='depotBoard')s.flags.depotBoard=true;
 if(id==='depotArchive')s.flags.depotArchive=true;
 if(id==='depotMemory')s.flags.depotMemory=true;
 if(id==='depotTape')s.flags.depotTape=true;
 if(id==='depotTerminal')s.flags.depotTerminal=true;
 // The evidence-backed conversation is a real part of the campaign, not
 // unreachable text. Only the correct deduction opens it; no automatic ending.
 // RC56: the monitor already carries the evidence. No second explanation after the correct deduction.
 // Preserve the deduction gate and jump straight to the four canonical cinematic portraits.
 if(id==='depotCompare'&&s.flags.choice_depotDeduction===1){
  s.flags.depotFinal=true;
  s.flags.depotResolveAt=s.time;
  s.mode='interludeCinematic';
  s.vx=0;s.jinxMoving=false;
  emit(s,'depotResolve');
  return;
 }
 // Kept as compatibility-only fallback for pre-existing saves; never entered by the new route.
 if(id==='depotFinal'){s.flags.depotFinal=true;s.flags.depotResolveAt=s.time;s.mode='interludeCinematic';s.vx=0;s.jinxMoving=false;emit(s,'depotResolve');}
}
function stand(s){if(s.stage!=='cafe'||!s.flags.resting||s.mode!=='playing')return;s.flags.resting=false;s.flags.seated=false;NeoRuntime.placeCompanion(s,'jinx',s.x-170);s.useWas=true;s.vx=0;emit(s,'stand');}
function near(s){if(!Number.isFinite(s.x)||!widths[s.stage])return null;return NeoRuntime.closest(s,objects[s.stage]||[],s.stage==='depot'?108:112);}
function once(s,key,fn){if(!s.seen[key]){s.seen[key]=true;fn();}}
function step(s,i,delta){if(s.mode==='paused'||s.mode==='won'||s.mode==='interludeTitle')return;const dt=NeoRuntime.delta(delta);s.time+=dt;stepAmbient(s,dt);
 if(!['interludeDialogue','interludeSilence'].includes(s.mode))s.stageTime+=dt;
 s.auraPulse=Math.max(0,s.auraPulse-dt);s.magentaPulse=Math.max(0,s.magentaPulse-dt);s.terminalCooldown=Math.max(0,s.terminalCooldown-dt);
 if(s.mode==='interludeSilence'){if(s.stage==='doorstep'&&s.dialogue==='final'){const gap=s.x-75-s.jinxX;if(gap>0){const step=Math.min(gap,dt*170);s.jinxX+=step;s.jinxFoot+=step*.042;s.jinxMoving=true;s.jinxFace=1;}else s.jinxMoving=false;}s.silenceTime+=dt;if(s.silenceTime>=s.silenceDuration){if(s.silenceKind==='beat'){s.mode='interludeDialogue';advance(s);}else speak(s,s.silenceKind);}return;}
 if(s.stage==='grief'&&s.mode==='interludeCinematic'){if(s.stageTime>=9.4){change(s,'home',180);s.mode='playing';}return;}
 if(s.stage==='depotTitle'&&s.mode==='interludeCinematic'){if(s.stageTime>=3.4){change(s,'depotDrive',1500);s.jinxX=1350;s.jinxFace=1;s.mode='interludeCinematic';s.flags.depotArrivalAt=s.time;}return;}
 if(s.stage==='depotDrive'&&s.mode==='interludeCinematic'){if(s.stageTime>=8){change(s,'depotApproach',1500);s.jinxX=1350;s.jinxFace=1;s.mode='interludeCinematic';s.flags.depotArrivalAt=s.time;}return;}
 // The door opens as a cinematic beat; the room is explored by the player.
 if(s.stage==='depotApproach'&&s.mode==='interludeCinematic'){
  if(s.stageTime>=6){s.flags.depotUnlocked=true;change(s,'depot',640);s.jinxX=300;s.jinxFace=1;s.mode='playing';s.flags.depotUnlocked=true;s.depotScanEnabled=false;s.depotScanWas=false;emit(s,'depotOpen');speak(s,'depotInside');}return;
 }

 if(s.stage==='depot'&&s.flags.depotFinal&&s.mode==='interludeCinematic'){
  // Short shared realization, then the irreversible end card. No further exposition.
  if(!s.flags.depotSting&&s.time-s.flags.depotResolveAt>=16.5){s.flags.depotSting=true;emit(s,'depotSting');}
  if(s.time-s.flags.depotResolveAt>=19.5){change(s,'end');s.mode='interludeCinematic';}
  return;
 }
 if(s.stage==='end'){if(s.stageTime>=1.2&&s.mode!=='won'){s.mode='won';emit(s,'ending');}return;}
 if(s.mode==='interludeDialogue'){s.vx=0;return;}
 if(s.mode!=='playing')return;
 if(s.stage==='cafe'&&s.flags.resting){s.vx=0;s.jinxMoving=false;if(i.use&&!s.useWas)stand(s);s.useWas=!!i.use;return;}
 // After the final line, Jinx hugs Sierra, walks to the Cadillac and drives away.
 // Four story-minutes pass in rain in an ~18-second playable cinematic.
 if(s.stage==='doorstep'&&s.flags.finalSaid){
  s.postFinal+=dt;s.vx=0;s.jinxMoving=false;
  if(s.postFinal<2.2){s.departurePhase='embrace';s.jinxX=s.x-75;}
  else if(s.postFinal<5.2){s.departurePhase='walkToCar';const dest=1060;const move=Math.sign(dest-s.jinxX)*Math.min(Math.abs(dest-s.jinxX),dt*130);s.jinxX+=move;s.jinxFace=move<0?-1:1;s.jinxFoot+=Math.abs(move)*.042;s.jinxMoving=Math.abs(move)>.01;}
  else if(s.postFinal<6.2){s.departurePhase='boarding';s.jinxX=1060;}
  else if(s.postFinal<10.7){s.departurePhase='driving';s.carX=940+Math.min(1180,(s.postFinal-6.2)*295);}
  else {s.departurePhase='rain';s.carX=2120;}
  if(s.postFinal>10.7)s.minute=Math.min(55,51+Math.floor((s.postFinal-10.7)/1.8));
  if(s.postFinal>=18.5){s.minute=55;change(s,'homeEnd',1480);emit(s,'homeReturn');}
  s.useWas=!!i.use;return;
 }
 if(s.stage==='homeEnd'&&s.flags.magenta){s.vx=0;s.sleepTime=(s.sleepTime||0)+dt;if(s.sleepTime>=6){s.endFade=(s.endFade||0)+dt;if(s.endFade>=2.1){change(s,'depotTitle',1500);s.mode='interludeCinematic';s.jinxX=1350;s.jinxFace=1;s.flags.depotUnlocked=false;}}return;}
 const dir=(i.right?1:0)-(i.left?1:0);if(dir){s.face=dir;if(s.stage==='depot')s.depotInspectUntil=0;}
 const lo=s.stage==='walk'?180:35,hi=s.stage==='returnWalk'?2030:widths[s.stage]-40;
 const oldX=s.x;s.x=Math.max(lo,Math.min(hi,s.x+dir*(s.stage==='depot'?120:s.stage==='cafe'?165:205)*dt));NeoRuntime.motion(s,oldX,dt,.042);s.y=800;s.grounded=true;
 // Same scanner input and energy rules as the remaining playable chapters:
 // hold Q on a keyboard, toggle SCAN on touch (handled by game.js).
 NeoRuntime.scan(s,i.scan,dt);
 if(s.stage==='cafe')(NeoRuntime.followCompanion||NeoRuntime.follow)(s,'jinx',Math.min(1990,Math.max(100,s.x-170)),dt,220);
 if(s.stage==='depot'){
  s.jinxX=300;s.jinxMoving=false;
  s.depotScanEnabled=!!s.scan;
 }else{s.depotScanEnabled=false;}
 if(s.stage==='depotApproach'){s.jinxX=Math.min(s.x-130,1080);s.jinxMoving=false;}
 if(['walk','returnWalk'].includes(s.stage)){
  // Fixed companion side. He yields when Sierra reverses; he never swaps through her.
  const side=s.stage==='walk'?-1:1,target=s.x+side*130,travel=Math.sign(target-s.jinxX)*Math.min(Math.abs(target-s.jinxX),dt*225);
  s.jinxX+=travel;s.jinxMoving=Math.abs(travel)>.01;if(s.jinxMoving){s.jinxFace=Math.sign(travel);s.jinxFoot+=Math.min(Math.abs(travel)*.042,8*dt);}
 }
 if(s.stage==='home'&&s.stageTime>3.5&&!s.flags.message){s.flags.message=true;emit(s,'messageWaiting');}
 if(s.stage==='walk'){
  clock(s,14+Math.min(2,Math.floor((s.x-180)/750)));
  if(s.x>650)once(s,'walk1',()=>speakAmbient(s,'walk1'));
  if(s.x>1300)once(s,'walk2',()=>speakAmbient(s,'walk2'));
 }
 if(s.stage==='returnWalk'){
  clock(s,43+Math.min(7,Math.floor((1930-s.x)/235)));
  if(!s.flags.returnBeat&&s.x<1700)speakAmbient(s,'returnBeat');
  if(!s.flags.returnLate&&s.x<950&&!s.ambientCurrent&&!s.ambientQueue.length)speakAmbient(s,'returnLate');
 }
 if(s.stage==='doorstep'&&!s.flags.finalStarted&&s.x>1250){s.flags.finalStarted=true;s.vx=0;speak(s,'final');return;}
 if(s.stage==='homeEnd'&&s.x<780&&!s.flags.cloudStarted){s.flags.cloudStarted=true;s.magentaPulse=3;s.vx=0;emit(s,'magenta');speak(s,'auraCloud');return;}
 const o=near(s);
 if(i.use&&!s.useWas&&o&&(s.stage!=='depot'||s.time>=(s.depotUseAt||0))){
  if(s.stage==='home'){
   if(o.id==='terminal'&&s.terminalCooldown<=0){s.flags.terminalSeen=true;s.terminalCooldown=.9;if(s.flags.message&&!s.flags.honk){speak(s,'message');}else emit(s,'terminal');}
   else if(o.id==='record'){if(!s.flags.recordSeen){s.flags.recordSeen=true;emit(s,'record');}else emit(s,'self',{text:'O registro já está preservado. Assistir de novo não altera o que aconteceu.'});}
   else if(o.id==='mei'){const first=!s.flags.meiPetted;s.flags.meiPetted=true;s.catReactUntil=s.time+3;emit(s,'self',{text:first?'Mei empurra a cabeça contra os dedos de Sierra. Ela fica mais um pouco.':'Mei ronrona. Sierra não precisa descobrir nada com isso; só ficar aqui um instante.'});}
   else if(o.id==='bed'){const first=!s.seen.bed;s.seen.bed=true;emit(s,'self',{text:first?'Tentei dormir. Não lembro se consegui.':'A cama continua desfeita. Não quero voltar a deitar agora.'});}
   else if(o.id==='cup'){const first=!s.seen.cup;s.seen.cup=true;emit(s,'self',{text:first?'A marca do café não sai. Nem tentei.':'Frio. Não vou preparar mais uma xícara antes de sair.'});}
   else if(o.id==='window'){s.seen.window=true;emit(s,'self',{text:s.flags.honk?'O Cadillac. Ele deixou o farol aceso.':'O turno da limpeza começou. Ainda não fui dormir.'});}
   else if(o.id==='exit'){if(s.flags.honk){change(s,'meet',1310);s.jinxX=1120;speak(s,'pickup');}else emit(s,'self',{text:'Ainda preciso ver quem deixou a mensagem no terminal.'});}
  }else if(s.stage==='walk'&&o.id==='cafe'){if(s.seen.walk2){change(s,'cafe',1730);s.jinxX=1550;}else emit(s,'self',{text:'Jinx ficou para trás. Quero terminar essa conversa antes de entrar.'});}
  else if(s.stage==='cafe'){
   if(o.id==='counter'){if(!s.flags.ordered)speak(s,'order');else emit(s,'self',{text:'O atendente faz um sinal discreto. A mesa perto da janela está pronta.'});}
   else if(o.id==='table'){if(!s.flags.ordered)emit(s,'self',{text:'Jinx ainda está no balcão. Sierra espera para sentar com ele.'});else if(!s.flags.cafe1){s.x=805;s.flags.seated=true;speak(s,'cafe1');}else if(s.flags.cafe3){s.x=805;s.flags.seated=true;s.flags.resting=true;emit(s,'rest');}else emit(s,'self',{text:'Jinx ainda está conversando. Vou escutar antes de levantar.'});}
   else if(o.id==='exit'&&s.flags.cafe3){change(s,'returnWalk',1930);s.jinxX=2060;s.jinxFace=-1;}
   else if(o.id==='window'){const first=!s.seen.cafeWindow;s.seen.cafeWindow=true;emit(s,'self',{text:first?'A chuva distorce os rostos na vitrine. Sierra demora a reconhecer o próprio reflexo.':'Lá fora, ninguém sabe o que aconteceu no corredor. Sierra sabe e não consegue contar tudo.'});}
   else if(o.id==='exit')emit(s,'self',{text:!s.flags.ordered?'Jinx ainda está no balcão. Vou esperar.':'Jinx ainda está sentado. Não vou sair sem avisar.'});
  }else if(s.stage==='returnWalk'&&o.id==='building'){change(s,'doorstep',1110);s.jinxX=990;s.carX=940;}
  else if(s.stage==='doorstep'&&o.id==='door'&&!s.flags.finalSaid){emit(s,'self',{text:'Jinx precisa terminar o que veio dizer. Vou escutar.'});}
  else if(s.stage==='depot'){
   const done=['depotBoard','depotArchive','depotTape','depotTerminal'].every(id=>s.flags[id]);
   s.depotUseAt=s.time+.55;
   if(!s.scan){emit(s,'depotScannerOff',{id:o.id});}
   else if(!s.depotScanEnabled){emit(s,'self',{text:'Scanner desligado. Ative Q / SCAN para identificar os vestígios.'});}
   else if(o.id==='depotTerminal'&&done){speak(s,'depotCompare');}
   else {
    s.depotInspectArt=o.id;s.depotInspectUntil=s.time+5.5;
    emit(s,'depotInspect',{id:o.id});
    speak(s,o.id);
   }
  }

 }
 s.useWas=!!i.use;
}
root.Interlude={create,step,near,advance,speak,speakAmbient,change,stand,widths,objects};
})(typeof window!=='undefined'?window:globalThis);
