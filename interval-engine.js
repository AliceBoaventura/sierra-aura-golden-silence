/* Chapter 7: local evidence, two playable perspectives, no speculative explanation. */
(function(root){
const widths={holding:2800,access:3400,archive:2800,sacrifice:2800,aftermath:2800};
const objects={sacrifice:[['override',1240,'DERIVAÇÃO MANUAL'],['contact',2150,'CONTATO DE EMERGÊNCIA']],aftermath:[],holding:[['cot',180,'MACA'],['wrist',440,'INTERFACE PESSOAL'],['names',840,'NOMES NA PAREDE'],['cabinet',1240,'CAIXA DE MANUTENÇÃO'],['pulse',1670,'BARRAMENTO LOCAL'],['reader',2150,'LEITOR DA PORTA'],['exit',2580,'TRAVA DE SERVIÇO']],access:[['map',240,'COORDENADA LOCAL'],['trace0',670,'FIM DO REGISTRO'],['trace1',1260,'MEMÓRIA DO CABO'],['brace',1830,'PASSAGEM OBSTRUÍDA'],['trace2',2410,'REGISTRO SEM ORIGEM'],['entry',3160,'ESCOTILHA ANTIGA']],archive:[['files',570,'ARQUIVO DOS AUSENTES'],['keane',1070,'ÍNDICE DE KEANE'],['power',1540,'TERMINAL ISOLADO'],['terminal',2150,'RETORNO BIOMÉTRICO'],['second',2570,'SEGUNDA LEITURA']]};
function create(prior='unknown'){return {chapter:7,mode:'playing',stage:'holding',avatar:'alex',time:0,stageTime:0,x:180,y:800,vx:0,vy:0,face:1,grounded:true,foot:0,hp:3,energy:100,alarm:0,inv:0,clues:[],events:[],flags:{clubEvidence:root.StoryContinuity?.history?.()?.evidencePath||null},seen:{},journal:[],useWas:true,jumpWas:false,scan:false,scanLock:false,scannerState:'off',echoState:'off',trace:0,traceProgress:0,glitch:0,hold:0,jinxX:90,auraX:215,prior,pulsePattern:null,answers:[],dialogue:null,lineIndex:0,puzzle:null,captureTime:0,sacrificeProgress:0,executionTime:0,shotIndex:0,exitFade:0};}
function emit(s,type,data={}){s.events.push({type,...data});}
function note(s,id,title,text){if(s.journal.some(n=>n.id===id))return;s.journal.push({id,title,text});}
function say(s,who,text){emit(s,'radio',{who,text});}
function speak(s,id){if(s.mode!=='playing')return;NeoRuntime.reset(s);s.mode='intervalDialogue';s.dialogue=id;s.lineIndex=0;emit(s,'dialogue');}
function near(s){return NeoRuntime.closest(s,(objects[s.stage]||[]).map(([id,x,name])=>({id,x,name})),120);}
function openPuzzle(s,kind){NeoRuntime.reset(s);s.mode='intervalPuzzle';s.puzzle=kind==='hack'?{kind,paths:[0,0,0],target:[1,2,0],error:false}:{kind,paths:(()=>{const a=[Math.floor(Math.random()*3),Math.floor(Math.random()*3),Math.floor(Math.random()*3)];if(a.every((v,i)=>v===i))a[0]=(a[0]+1)%3;return a;})(),error:false};emit(s,'puzzle');}
function rotate(s,i){if(s.mode!=='intervalPuzzle'||!Number.isInteger(i)||i<0||i>2)return;s.puzzle.paths[i]=(s.puzzle.paths[i]+1)%3;s.puzzle.error=false;}
function solve(s){if(s.mode!=='intervalPuzzle'||!s.puzzle)return false;if(s.puzzle.paths.some((v,i)=>v!==(s.puzzle.kind==='hack'?s.puzzle.target[i]:i))){s.puzzle.error=true;return false;}const kind=s.puzzle.kind;s.puzzle=null;s.mode='playing';NeoRuntime.reset(s);s.flags[kind]=true;note(s,kind,kind==='patch'?'Circuito de serviço':'Terminal em circuito fechado',kind==='patch'?'A interface pessoal não transmite. O barramento de manutenção ainda conduz pulsos locais.':'Aura isolou o retorno externo. A consulta utiliza apenas o circuito da instalação.');speak(s,kind==='patch'?'patched':'hacked');return true;}
function change(s,stage){NeoRuntime.reset(s);s.events.length=0;s.stage=stage;s.stageTime=0;s.x=stage==='access'||stage==='archive'?380:180;s.y=800;s.vx=0;s.vy=0;s.grounded=true;s.useWas=true;s.scanLock=false;s.energy=100;s.hold=0;s.avatar=stage==='sacrifice'?'alex':'sierra';s.auraX=stage==='access'||stage==='archive'?235:95;s.jinxX=stage==='access'||stage==='archive'?90:50;emit(s,'transition');}
function finishDialogue(s){const id=s.dialogue;s.mode='playing';NeoRuntime.reset(s);s.dialogue=null;s.lineIndex=0;
 if(id==='wrist')s.flags.wrist=true;
 if(id==='names'){s.flags.names=true;note(s,'names','Nomes riscados','L. MORAES / 731 e E. VAZ / 204. Há outros nomes ilegíveis. As marcas foram feitas em momentos diferentes.');}
 if(id==='pulse'){s.flags.pulse=true;note(s,'pulse','Um pulso deixado por Alexandra',patterns[s.pulsePattern||0]+'. Gravado em um circuito de manutenção sem resposta externa.');}
 if(id==='reader')s.flags.identified=true;
 if(id==='escape'){s.flags.attempted=true;change(s,'access');if(s.flags.clubEvidence==='trace'){s.flags.traceBoostPending=true;note(s,'nr731','NR-731/04:47','O identificador obtido no clube coincide com o horário do primeiro vestígio. A primeira leitura começa parcialmente alinhada.');}say(s,'SIERRA / COTA −12','A coordenada termina aqui. O resto da rua foi removido do mapa.');}
 if(id==='brace'){s.flags.brace=true;s.hold=0;say(s,'JINX','Passa. Estou segurando. Aura, vai com ela.');}
 if(id==='files'){s.flags.files=true;note(s,'files','Os mesmos ausentes','IDs 731 e 204 constam na cópia de Ghost Track. Os registros cessam sem passagem por portas ou veículos. Restaurado: desconhecido.');}
 if(id==='keane'){s.flags.keane=true;note(s,'keane','Índice preservado','Keane catalogou falhas de observação. Há referências ao intervalo morto, mas nenhum mecanismo documentado aqui.');}
 if(id==='alive'){s.flags.alive=true;note(s,'alive','Retorno compatível, sem confirmação','Pulso local reconhecido e contador avançando. A origem física e a condição de Alexandra permanecem não verificadas. JONLITH // ACTIVE é apenas um campo do terminal.');}
 if(id==='instance'){s.flags.instance=true;s.flags.captured=true;s.mode='intervalCapture';s.captureTime=0;note(s,'instance','TESLA, AURA / INSTANCE 02','A segunda presença continua ativa. Ao abrir o registro, o trio foi isolado pelas barreiras da instalação.');emit(s,'capture');}
 if(id==='override'){s.flags.override=true;note(s,'override','Derivação irreversível','A energia que mantém a porta de Alexandra disponível será desviada para liberar as três contenções. A ponte manual precisa permanecer fechada até a conclusão.');}
 if(id==='sacrificeEnd'){s.flags.freed=true;s.mode='intervalExecution';s.executionTime=0;s.shotIndex=0;s.scan=false;emit(s,'execution');}
 if(id==='aftermath'){note(s,'dead','Alexandra Jonlith / morta','Dois drones dispararam no corredor de serviço. O corpo permanece no chão. Sinal vital encerrado. A ponte libertou Sierra, Aura e Jinx.');s.mode='intervalDeparture';s.exitFade=0;emit(s,'quiet');}
}
const patterns=['CURTO · CURTO · LONGO','LONGO · CURTO · LONGO','CURTO · LONGO · CURTO'];
function advance(s){if(s.mode!=='intervalDialogue')return;const lines=root.IntervalStory[s.dialogue];if(lines[s.lineIndex].choices)return;s.lineIndex++;if(s.lineIndex>=lines.length)finishDialogue(s);else emit(s,'dialogue');}
function choose(s,i){if(s.mode!=='intervalDialogue'||!Number.isInteger(i)||i<0||i>2)return;const line=root.IntervalStory[s.dialogue][s.lineIndex];if(!line.choices)return;s.answers.push({dialogue:s.dialogue,index:i});if(s.dialogue==='pulse')s.pulsePattern=i;if(s.dialogue==='keane')s.tone=i;s.lineIndex++;if(s.lineIndex>=root.IntervalStory[s.dialogue].length)finishDialogue(s);else emit(s,'dialogue');}
function use(s,o){const f=s.flags,id=o.id;
 if(s.stage==='sacrifice'){if(id==='override')speak(s,'override');if(id==='contact')say(s,'ALEXANDRA',f.override?'Segure E / USAR para manter a ponte fechada. Se eu soltar antes, eles ficam presos.':'A derivação manual está na caixa à esquerda. Preciso mudar a alimentação primeiro.');return;}
 if(s.stage==='holding'){
  if(id==='cot')speak(s,'cot');
  if(id==='wrist')speak(s,'wrist');
  if(id==='names')speak(s,'names');
  if(id==='cabinet'){if(!f.wrist)say(s,'ALEXANDRA','Primeiro, preciso saber o que ainda funciona no meu implante.');else if(!f.patch)openPuzzle(s,'patch');else say(s,'ALEXANDRA','Circuito de serviço estabilizado. Nenhuma resposta de fora.');}
  if(id==='pulse'){if(!f.patch)say(s,'ALEXANDRA','Sem alimentação, o cabo não leva nada. A caixa fica à esquerda.');else if(!f.pulse)speak(s,'pulse');else say(s,'BARRAMENTO',patterns[s.pulsePattern]+' / RETORNO EXTERNO: AUSENTE');}
  if(id==='reader')speak(s,'reader');
  if(id==='exit'){if(!f.patch||!f.pulse||!f.names||!f.identified)say(s,'ALEXANDRA',!f.names?'Alguém riscou nomes na parede. Não vou deixar isso para trás.':!f.identified?'O leitor ao lado da porta acendeu sozinho.':!f.patch?'O fecho de serviço precisa de energia.':'Antes de atravessar, vou deixar um sinal no cabo.');else speak(s,'escape');}
 }else if(s.stage==='access'){
  if(id==='map')speak(s,'map');
  if(id.startsWith('trace'))say(s,'SIERRA','Q / SCAN. Precisamos seguir os registros em ordem, sem preencher as lacunas com suposições.');
  if(id==='brace'){if(s.trace<2)say(s,'JINX','Marca a base com a lente. Não vou derrubar isso em cima de vocês.');else if(!f.brace){s.hold=1.6;say(s,'JINX','Achei o apoio. Afasta um pouco.');}else say(s,'JINX','A passagem está livre. Eu vou logo atrás.');}
  if(id==='entry'){if(s.trace<3||!f.brace)say(s,'SIERRA','Falta reconstruir o último registro do lado de dentro.');else{change(s,'archive');speak(s,'entry');}}
 }else{
  if(id==='files')speak(s,'files');if(id==='keane')speak(s,'keane');
  if(id==='power'){if(!f.files||!f.keane)say(s,'AURA','Preciso do índice e dos IDs do arquivo antes de abrir a consulta.');else if(!f.hack)openPuzzle(s,'hack');else say(s,'AURA','Consulta local isolada. O monitor à direita está respondendo.');}
  if(id==='terminal'){if(!f.hack)say(s,'AURA','O retorno externo ainda está ligado. Vou isolar na caixa à esquerda.');else if(!f.alive)speak(s,'alive');else say(s,'SIERRA','O sinal continua ativo. Há uma segunda leitura no módulo à direita.');}
  if(id==='second'){if(!f.alive)say(s,'SIERRA','Primeiro, Alexandra. O terminal está à esquerda.');else if(!f.secondRead)say(s,'LENTE','Q / SCAN · Comparar a segunda presença com a leitura local.');else speak(s,'instance');}
 }
}
const shots=[2.3,2.44,2.59,2.87,3.03];
function executionPhase(t){return t<.9?'hatch':t<2.3?'drones':t<2.75?'impact':t<3.4?'fall':'body';}
function step(s,i,delta){const dt=NeoRuntime.delta(delta);
 if(s.mode==='paused'||s.mode==='won')return;
 if(s.mode==='intervalDeparture'){s.exitFade+=dt;if(s.exitFade>=1.1){s.mode='intervalMemorial';s.memorialTime=0;emit(s,'memorial');}return;}
 if(s.mode==='intervalMemorial'){s.memorialTime+=dt;if(s.memorialTime>=4.8){s.mode='won';emit(s,'ending');}return;}
 if(s.mode==='intervalExecution'){
  s.executionTime+=dt;s.time+=dt;
  while(s.shotIndex<shots.length&&s.executionTime>=shots[s.shotIndex]){emit(s,'shot',{index:s.shotIndex++});}
  if(s.executionTime>=3.4&&!s.flags.dead){s.flags.dead=true;s.flags.bodyVisible=true;note(s,'deathConfirmed','Alexandra / fim do sinal','O sinal vital de Alexandra encerrou após os disparos. A morte é definitiva; o terminal não representa uma rota de retorno.');root.StoryContinuity?.capture(s);emit(s,'vitalsEnded');}
  // Body holds at full opacity for over six seconds before any dialogue.
  if(s.executionTime>=10.2){change(s,'aftermath');s.x=1980;s.auraX=1880;s.jinxX=1780;s.mode='playing';speak(s,'aftermath');}return;
 }if(s.mode==='intervalDialogue'&&s.stage==='aftermath'){s.time+=dt;return;}if(s.mode==='intervalCapture'){s.captureTime+=dt;if(s.captureTime>=3){change(s,'sacrifice');s.mode='playing';speak(s,'heard');}return;}if(s.mode!=='playing')return;s.time+=dt;s.stageTime+=dt;s.glitch=Math.max(0,s.glitch-dt);const move=(i.right?1:0)-(i.left?1:0);s.vx=move*(s.avatar==='alex'?175:210);if(move)s.face=move;const oldX=s.x;s.x=Math.max(50,Math.min(widths[s.stage]-60,(Number.isFinite(s.x)?s.x:180)+s.vx*dt));if(s.stage==='access'&&!s.flags.brace)s.x=Math.min(s.x,1940);NeoRuntime.motion(s,oldX,dt);
 // P59: 145px of separation between three full-height bodies.
 // Real positions are updated, not merely offset while drawing.
 NeoRuntime.follow(s,'jinx',Math.max(90,s.x-290),dt);NeoRuntime.follow(s,'aura',Math.max(225,s.x-145),dt);
 if(s.avatar==='sierra')NeoRuntime.scan(s,i.scan,dt);else {s.scan=false;s.scannerState='off';if(i.scan&&!s.scanWas){s.flags.wrist=true;say(s,'INTERFACE / ALEXANDRA','EMISSOR: INDISPONÍVEL · RELÓGIO: SEM REFERÊNCIA · CIRCUITO LOCAL: OPERANTE');}s.scanWas=!!i.scan;}
 const o=near(s);if(s.stage==='sacrifice'&&s.flags.override&&o?.id==='contact'&&i.use){s.vx=0;s.sacrificeProgress=Math.min(4,s.sacrificeProgress+dt);if(s.sacrificeProgress>=4&&!s.flags.sacrificed){s.flags.sacrificed=true;note(s,'sacrifice','Alexandra / ponte mantida','A saída de Alexandra foi selada para liberar o trio. A escotilha de segurança dá acesso ao corredor onde ela ficou presa.');speak(s,'sacrificeEnd');return;}}else if(s.stage==='sacrifice')s.sacrificeProgress=0;
 if(s.stage==='access'&&s.trace<3&&s.scan&&o?.id==='trace'+s.trace){s.echoState='tracking';if(s.flags.traceBoostPending){s.traceProgress=.6;s.flags.traceBoostPending=false;}s.traceProgress+=dt;if(s.traceProgress>=1.25){s.trace++;s.traceProgress=0;note(s,'trace'+s.trace,'Registro '+s.trace,["TRACE LOST: 04:47 / TRACE RESTORED: UNKNOWN. Nenhum deslocamento entre os dois pontos.",'Um pulso de serviço alcançou este cabo. O caminho físico do cabo não é uma rota de transporte.','Outros IDs perderam observação do mesmo modo. O registro de entrada está vazio.'][s.trace-1]);speak(s,'trace'+s.trace);}}else{s.traceProgress=0;s.echoState=s.trace===3?'complete':'idle';}
 if(s.hold>0){s.hold=Math.max(0,s.hold-dt);if(s.hold===0)speak(s,'brace');}
 if(s.stage==='archive'&&o?.id==='second'&&s.flags.alive&&s.scan&&!s.flags.secondRead){s.flags.secondRead=true;s.glitch=.18;say(s,'LENTE','SEGUNDA PRESENÇA DETECTADA · E / ABRIR REGISTRO');}
 if(s.mode==='playing'&&i.use&&!s.useWas&&o)use(s,o);s.useWas=!!i.use;
}
root.Interval={create,step,near,objects,widths,patterns,shots,executionPhase,speak,advance,choose,rotate,solve};
})(typeof window!=='undefined'?window:globalThis);
