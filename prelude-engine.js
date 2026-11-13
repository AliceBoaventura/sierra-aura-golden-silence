/* A playable everyday routine gradually becomes a search. No identity is revealed by the initial state. */
(function(root){
const widths={home:1200,district:4200,trace:4200,approach:2300};
const base={home:[{x:0,y:800,w:1200,h:200,ground:true}],district:[{x:0,y:800,w:4200,h:200,ground:true},],trace:[{x:0,y:800,w:4200,h:200,ground:true},{x:1960,y:710,w:180,h:16},{x:2160,y:620,w:230,h:16},{x:2450,y:710,w:190,h:16}],approach:[{x:0,y:800,w:2300,h:200,ground:true}]};
const objects={home:[{id:'photo',x:495,name:'MOLDURA',text:'O vidro foi colado no canto esquerdo. Sierra conhece a rachadura de cor; é o que sobra da última fotografia com os pais.'},{id:'radio',x:610,name:'RÁDIO',text:'A mesma música que Sierra e Jinx ouviam no carro. Ela reconhece o refrão antes de lembrar o nome.'},{id:'bench',x:545,name:'BANCADA ÓPTICA'},{id:'mirror',x:230,name:'ESPELHO',text:'A lente pisca fora de sincronia com o olho. Sierra cobre o visor com a palma e espera o reflexo voltar ao normal.'},{id:'bed',x:95,name:'CAMA'},{id:'mei',x:338,name:'MEI'},{id:'communicator',x:730,name:'COMUNICADOR'},{id:'coffee',x:842,name:'CAFÉ FRIO'},{id:'screen',x:950,name:'TELA LOCAL'},{id:'exit',x:1140,name:'SAIR DE CASA'}],district:[{id:'gate',x:450,name:'IDENTIFICAÇÃO'},{id:'repair',x:930,name:'QUADRO ELÉTRICO'},{id:'clinic',x:1860,name:'CATRACA',text:'ATENDIMENTO ENCERRADO / PRIORIDADE COGNITIVA INSUFICIENTE'},{id:'maintenance',x:2320,name:'MANUTENÇÃO',text:'NEURAL INITIATIVE / ASSISTÊNCIA URBANA — sob a placa, outro carimbo: SEGURANÇA.'},{id:'signature',x:3000,name:'UNIDADE AVARIADA'},{id:'power',x:3250,name:'ALIMENTAÇÃO LOCAL'},{id:'exit',x:3970,name:'PASSAGEM DE SERVIÇO'}],trace:[{id:'terminal',x:500,name:'CONSOLE DA GALERIA'},{id:'music',x:1000,name:'FITA DO ESCONDERIJO',text:'A melodia do rádio de Sierra reaparece aqui, agora sobre uma etiqueta manuscrita: B-3 / ELEVADOR DE SERVIÇO / PORTA CAMUFLADA. O elevador está desativado; alguém quis que ela reconhecesse o caminho sem expor a localização.'},{id:'credential',x:1400,name:'LEITOR DA PORTA'},{id:'solder',x:1760,name:'PAINEL DE MANUTENÇÃO',text:'Alguém soldou uma ponte para manter a porta aberta. Foi feito às pressas.'},{id:'camera',x:2020,name:'ARQUIVO DA CÂMERA'},{id:'files',x:3120,name:'CADERNO OFFLINE DE AURA',text:'O lugar foi adaptado para morar: pratos, roupas e um terminal sem uplink. A assinatura de Aura aparece em cópias locais, nunca numa rede pública.'},{id:'lift',x:3660,name:'ALÇAPÃO PARTICULAR'},{id:'exit',x:3980,name:'PORTA DO ESCONDERIJO'}],approach:[{id:'resident',x:600,name:'CAMPAINHA ANALÓGICA',text:'O interfone analógico foi desligado da rede. Um bilhete improvisado diz: Se chegar pelo lado certo, toque duas vezes.'},{id:'reflection',x:1280,name:'VIDRO DA PASSAGEM',text:'No vidro escuro, uma palavra aparece por um segundo: SIERRA. Jinx olha para a rua. Ele não viu.'},{id:'exit',x:2130,name:'PORTA'}]};
function npcs(s){
 if(s.stage==='district')return [
  {id:'vendor',x:680,name:'LIA / CAFÉ',npc:true,sprite:4},
  {id:'mechanic',x:1080,name:'MARA / MANUTENÇÃO',npc:true,sprite:0},
  {id:'patient',x:s.neriX??1640,name:'DONA NERI',npc:true,sprite:2,departing:s.flags.neriOutcome==='rescued',face:1,foot:s.neriFoot||0},
  {id:'courier',x:2070,name:'ÍRIS / ENTREGAS',npc:true,sprite:6,h:190},
  {id:'recycler',x:2710,name:'CAIO / RECICLAGEM',npc:true,sprite:0,h:195},
  {id:'watcher',x:3620,name:'NOA / PASSAGEM',npc:true,sprite:4,h:185}
 ].filter(n=>n.id!=='patient'||!s.neriInside);
 return [];
}
function dialogue(s,id){
 const lines={
  vendor:s.npcMood.vendor
   ?(s.flags.neriOutcome==='rescued'
     ?[['LIA','A Neri entrou. Eu vi a enfermeira chamar pelo nome dela.'],['SIERRA','O sistema tinha registrado um atendimento que não aconteceu.'],['LIA','Então guarda a prova. Eles vão dizer que foi um erro pequeno.']]
     :s.flags.neriOutcome==='escorted'
     ?[['LIA','A filha da Neri confirmou que vem. A catraca ainda não deixou ninguém entrar.'],['SIERRA','O Jinx ficou com o contato.'],['LIA','Bom. Pelo menos alguém vai saber onde ela está.']]
     :s.flags.repair
     ?[['LIA','O quadro voltou, mas a clínica ainda está com a catraca fechada.'],['SIERRA','E a Neri?'],['LIA','Continua esperando. A filha dela não sabe que o registro falhou.']]
     :[['LIA','Mara ainda está no quadro. Se a luz cair de vez, a clínica fecha.'],['SIERRA','Estou indo.'],['LIA','Eu sei. O café vai esperar.']])
   :[['LIA','O café de sempre?'],['SIERRA','Ainda está quente?'],['LIA','O seu, sim. O do Jinx virou peça de museu.'],['JINX','Eu chamo de maturação.'],['LIA','Chama de dívida desde terça.'],['SIERRA','Mara mandou chamar por causa do quadro.'],['LIA','Se a luz cair de novo, a clínica fecha a porta. Tem gente esperando desde ontem.']],
  mechanic:s.flags.repair
   ?[['MARA','Voltou. Ouvi a clínica ligar as bombas do outro lado.'],['SIERRA','O painel estava recebendo um comando que não veio daqui.'],['MARA','Você guardou a leitura?'],['SIERRA','Só uma cópia fora da rede. Vou descobrir de onde veio.']]
   :[['MARA','O quadro diz que está normal. Encosta a mão aqui, sem tocar no cobre.'],['SIERRA','Está quente. Quando foi a última queda?'],['MARA','Ontem à noite. Depois de novo antes do amanhecer.'],['SIERRA','A derivação da clínica passa por este cabo?'],['MARA','Passa. Se eu cortar, apago a sala de atendimento.'],['SIERRA','Então segura a transferência no reserva. Eu verifico o circuito antes de religar.'],['MARA','Eu seguro. Você me avisa antes de puxar qualquer coisa.']],
  patient:s.flags.neriOutcome==='rescued'
   ?[['DONA NERI','Chamaram meu nome. Eu quase não levantei, achei que era para outra pessoa.']]
   :s.flags.neriOutcome==='escorted'
   ?[['DONA NERI','Minha filha vem me buscar. A catraca continua errada, mas eu não fico mais aqui sozinha.']]
   :s.flags.neriOutcome==='left'
   ?[['DONA NERI','A tela continua dizendo que eu já fui embora. Eu ainda estou aqui.']]
   :[['DONA NERI','A máquina diz que fui atendida. A enfermeira diz que não pode me chamar duas vezes.'],['SIERRA','A senhora entrou na clínica?'],['DONA NERI','Não. Passei a noite neste banco.'],['SIERRA','Tem alguém que a senhora queira avisar?'],['DONA NERI','Minha filha. Ela acha que eu já entrei.'],['SIERRA','Posso conferir a catraca. Se o registro estiver errado, a senhora autoriza a correção?'],['DONA NERI','Se aparecer meu nome, pode corrigir. Só não me faça desaparecer outra vez.']],
 };
 const quest=NPCQuests.dialogue(s,id);
 return quest.length?quest:(lines[id]||[]);
}
function create(){return {chapter:1,narrative:true,stage:'home',mode:'playing',time:0,stageTime:0,x:150,y:800,vx:0,vy:0,face:1,grounded:true,hp:3,energy:100,alarm:0,inv:0,foot:0,scan:false,scanLock:false,flags:{},seen:{},progress:{},clues:[],events:[],jumpWas:false,useWas:true,dashWas:false,dash:0,dashCooldown:0,crouch:false,jinxX:40,jinxPulse:0,jinxCooldown:0,checkpoint:150,blackout:0,glitch:0,fragment:0,quiet:0,liftY:800,door:false,deaths:0,interact:0,interactId:null,stall:0,lastMove:150,conversation:[],talkIndex:0,talkReturn:'playing',npcMood:{},quests:{},radioOn:false,repairOpen:false,neriX:1640,neriInside:false,neriFoot:0};}
function emit(s,type,text,extra={}){s.events.push({type,text,...extra});}
function once(s,key,fn){if(!s.seen[key]){s.seen[key]=true;fn();}}
function near(s){
 if(Math.abs(s.y-800)>=80)return null;
 const candidates=[...objects[s.stage],...npcs(s).filter(n=>!n.departing)];
 // The optical bench and family photo are only 50 px apart. While scanning
 // the required lens calibration, focus the bench instead of the photo.
 // Keep the photo selectable before scanning and after calibration.
 if(s.stage==='home'&&!s.flags.bench&&
    (s.scan||(s.progress?.bench||0)>=.8)&&Math.abs(s.x-545)<=60)
  return objects.home.find(o=>o.id==='bench');
 return NeoRuntime.focus(s,candidates,o=>s.stage==='home'?60:o.npc?115:100);
}
function settleConversation(s,dt){
 if(!Number.isFinite(s.talkX))return;
 const old=s.x,gap=s.talkX-s.x;s.x+=Math.sign(gap)*Math.min(Math.abs(gap),100*dt);
 NeoRuntime.motion(s,old,dt,.04);
 const n=npcs(s).find(n=>n.id===s.interactId);if(n)s.face=Math.sign(n.x-s.x)||s.face;
}
const platformCache=new WeakMap();
function platforms(s){if(s.stage!=='trace')return base[s.stage];let list=platformCache.get(s);if(!list){list=[...base.trace,{x:3540,y:s.liftY,w:230,h:16,lift:true}];platformCache.set(s,list);}list[list.length-1].y=s.liftY;return list;}

function drones(s){if(s.stage==='district'&&s.x>2500)return [{x:3000+Math.sin(s.time*.8)*180,y:480,range:155,type:'patrol'}];if(s.stage==='trace'&&s.x>1980&&s.x<2750)return [{x:2480,y:470,range:120+Math.sin(s.time*1.6)*50,type:'sweep'}];return [];}
function next(s){const neriUnresolved=s.stage==='district'&&NPCQuests.departure(s);if(s.stage!=='home')NPCQuests.remember(s);NeoRuntime.reset(s);const stages=['home','district','trace','approach'];s.stage=stages[stages.indexOf(s.stage)+1];s.x=150;s.y=800;s.vx=s.vy=0;NeoRuntime.placeCompanion(s,'jinx',60);s.stageTime=0;s.checkpoint=150;s.energy=100;s.alarm=0;s.inv=2;s.useWas=true;s.scan=false;s.glitch=0;s.quiet=s.stage==='approach'?60:0;emit(s,'transition',s.stage);if(neriUnresolved)emit(s,'radio','Dona Neri ficou do lado de fora. A clínica não confirmou atendimento.',{speaker:'JINX'});}
function read(s,o){if(o.text)emit(s,'object',o.text,{title:o.name});}
function step(s,i,delta){if(s.mode==='conversation'){const dt=NeoRuntime.delta(delta);s.time+=dt;settleConversation(s,dt);return;}if(s.mode!=='playing')return;const dt=NeoRuntime.delta(delta);s.time+=dt;s.stageTime+=dt;s.interact=Math.max(0,s.interact-dt);s.stall=Math.abs(s.x-s.lastMove)<2?s.stall+dt:0;if(Math.abs(s.x-s.lastMove)>=2)s.lastMove=s.x;for(const k of ['inv','dash','dashCooldown','jinxPulse','jinxCooldown','blackout','glitch','fragment','quiet'])s[k]=Math.max(0,s[k]-dt);if(s.stage==='district'&&s.flags.neriOutcome==='rescued'&&!s.neriInside){s.neriX=Math.min(1860,(s.neriX??1640)+68*dt);s.neriFoot=(s.neriFoot||0)+dt*2;s.neriInside=s.neriX>=1860;}s.crouch=!!i.crouch&&s.grounded;const dir=(i.right?1:0)-(i.left?1:0);if(dir)s.face=dir;
if(i.dash&&!s.dashWas&&s.dashCooldown===0){s.dash=.19;s.dashCooldown=1.1;emit(s,'dash');}s.dashWas=!!i.dash;s.vx=s.dash>0?s.face*570:dir*(s.crouch?130:235);const oldX=s.x;s.x=Math.max(25,Math.min(widths[s.stage]-40,s.x+s.vx*dt));
if(s.stage==='district'){if(!s.flags.repair&&s.x>1120){s.x=1120;once(s,'blockedRepair',()=>emit(s,'radio','A passagem está sem energia. Vamos voltar ao quadro.',{speaker:'SIERRA'}));}if(!s.flags.power&&s.x>3410)s.x=3410;}
if(s.stage==='trace'){if(!s.flags.terminal&&s.x>760)s.x=760;if(!s.flags.credential&&s.x>1600)s.x=1600;if(!s.flags.camera&&s.x>2200)s.x=2200;}
NeoRuntime.motion(s,oldX,dt,.045);
if(i.jump&&!s.jumpWas&&s.grounded&&!s.crouch){s.vy=-610;s.grounded=false;emit(s,'jump');}s.jumpWas=!!i.jump;const oldY=s.y;s.vy+=1500*dt;s.y+=s.vy*dt;s.grounded=false;
if(s.stage==='trace'&&s.x>3350)once(s,'lift',()=>emit(s,'radio','O elevador de serviço está ligado. Podemos subir por ele ou seguir pelo corredor.',{speaker:'JINX'}));
NeoRuntime.land(s,oldX,oldY,platforms(s),dt);
NeoRuntime.scan(s,i.scan,dt);
const o=near(s);if(o&&s.scan){s.progress[o.id]=(s.progress[o.id]||0)+dt;if(s.progress[o.id]>.8&&s.stage==='district'&&o.id==='repair')once(s,'unknown',()=>{s.glitch=.7;emit(s,'signal','SOURCE UNKNOWN / SIGNAL COLLISION');});if(s.progress[o.id]>1&&o.id==='signature')once(s,'signature',()=>{s.flags.signature=true;s.glitch=.5;emit(s,'signal','SIGNAL ID: AU-RA/7F');});}
if(s.stage==='district'){if(s.x>300)once(s,'jinx',()=>emit(s,'radio','A Mara está esperando na clínica. Ela disse que o quadro caiu de novo. Vamos?',{speaker:'JINX'}));if(s.x>1500)once(s,'repeat',()=>{s.glitch=.55;emit(s,'signal','PORTADOR: DESCONHECIDO');});}
if(s.stage==='trace'){if(s.flags.camera&&s.x>2270)once(s,'cameraDiscussed',()=>emit(s,'radio','O rosto não aparece. Mas o registro mostra alguém cruzando o corredor depois do apagão. Guarda a hora, não um palpite.',{speaker:'JINX'}));if(s.x>2650)once(s,'follow',()=>{s.glitch=.6;s.quiet=7;emit(s,'signal','AU-RA/7F / SINAL LOCAL');});if(s.x>2900)once(s,'voice',()=>{s.quiet=8;emit(s,'voice','Sierra.');});if(s.x>3320)once(s,'match',()=>{s.glitch=1.8;emit(s,'biomatch','PARTIAL MATCH: SIERRA CORE');});}
if(s.stage==='approach'){if(s.x>1170)once(s,'auraInvitation',()=>emit(s,'radio','Não estou pedindo que confie em mim. Só quero que me escute. A porta B-3 está aberta.',{speaker:'AURA / CANAL LOCAL'}));if(s.x>450)once(s,'resident',()=>emit(s,'object','Há um interfone ao lado do portão. A plaqueta está coberta pelo vidro escurecido.',{title:'CORREDOR'}));if(s.x>1850&&!s.door){s.door=true;s.doorOpenedAt=s.time;s.quiet=8;emit(s,'door');}}
(NeoRuntime.followCompanion||NeoRuntime.follow)(s,'jinx',Math.max(60,s.x-185),dt);const ds=drones(s);if(ds.length&&s.jinxCooldown===0&&ds.some(d=>Math.abs(s.x-d.x)<240)){s.jinxPulse=2;s.jinxCooldown=12;once(s,'cover',()=>emit(s,'radio','Não fica no facho. Eu seguro este lado.',{speaker:'JINX'}));}
const visible=!s.blackout&&!s.jinxPulse&&ds.some(d=>Math.abs(s.x-d.x)<d.range&&!platforms(s).some(p=>!p.ground&&s.y>p.y+50&&s.x>p.x&&s.x<p.x+p.w));s.detected=!!visible&&!s.inv;s.alarm=Math.max(0,Math.min(100,s.alarm+dt*(s.detected?(s.scan?36:24):-30)));if(s.alarm>=100&&s.inv===0){s.hp--;s.deaths++;s.x=s.checkpoint;s.y=800;s.vy=0;s.alarm=0;s.energy=100;s.inv=4;NeoRuntime.reset(s,'respawn');emit(s,'damage');if(s.hp<=0){s.mode='lost';emit(s,'lost');}return;}
if(i.use&&!s.useWas&&o){s.interact=.65;s.interactId=o.id;if(o.npc){NPCQuests.onMeet(s,o.id);s.talkX=Math.max(25,Math.min(widths[s.stage]-40,o.x+(s.x<=o.x?-115:115)));s.vx=0;s.mode='conversation';s.conversation=dialogue(s,o.id);s.talkIndex=0;s.conversationDecisionTaken=false;s.npcMood[o.id]=true;emit(s,'conversation');s.useWas=true;return;}if(o.id==='radio'){s.radioOn=!s.radioOn;emit(s,'music');}read(s,o);const sideResult=NPCQuests.onObject(s,o.id);if(sideResult)emit(s,'object',sideResult,{title:'REGISTRO LOCAL'});if(s.stage==='home'){
 if(['bed','mei','communicator','coffee','screen'].includes(o.id)){
  const lines={
   bed:['SIERRA','Acordei antes do alarme. Mei continua dormindo do meu lado da cama.'],
   mei:['SIERRA','Mei se espreguiça contra a mão de Sierra. A unha prende na luva e a gata se recusa a soltá-la.'],
   communicator:['JINX / COMUNICADOR','A Mara pediu ajuda com o quadro da clínica. Sei que era teu dia livre. Ainda dá tempo de fingir que não ouviu.'],
   coffee:['SIERRA','A caneca do Jinx ainda está aqui. Ele deixou ontem e jurou que voltava para buscar.'],
   screen:['SIERRA','O diagnóstico da lente tem um intervalo em branco. Sierra desliga a conexão externa antes de guardar uma cópia local.']
  };
  if(!s.seen['home_'+o.id]){s.seen['home_'+o.id]=true;emit(s,'object',lines[o.id][1],{title:lines[o.id][0]});}
  else if(o.id==='mei')emit(s,'object','A gata agora dorme com a pata sobre a luva. Sierra não a acorda.',{title:'SIERRA'});
 }
 if(o.id==='bench'){if((s.progress.bench||0)<.8)emit(s,'object','Q / SCAN — verificar a lente antes de sair.',{title:'BANCADA'});else{s.flags.bench=true;emit(s,'object','SIERRA CORE // LENTE CALIBRADA / CÓPIA DA FALHA PRESERVADA OFFLINE',{title:'OLHO ESQUERDO'});}}if(o.id==='exit'){if(s.flags.bench)next(s);else emit(s,'object','A lente ainda precisa de calibração.',{title:'SIERRA'});}}
else if(s.stage==='district'){if(o.id==='gate')emit(s,'object','SIERRA CORE / ACCESS GRANTED',{title:'CATRACA'});if(o.id==='repair'){if((s.progress.repair||0)<.8)emit(s,'object','Sem tensão. SCAN mostra o circuito.',{title:'QUADRO'});else if(!s.flags.repair){s.flags.repair=true;s.repairOpen=true;s.checkpoint=1180;emit(s,'signal','ALIMENTAÇÃO RESTAURADA');}}if(o.id==='power'){if(!s.flags.signature)emit(s,'object','A unidade avariada está emitindo um sinal. Use SCAN.',{title:'QUADRO'});else if(!s.flags.power){s.flags.power=true;s.blackout=14;emit(s,'signal','REDE LOCAL ISOLADA');}}if(o.id==='exit')next(s);}
else if(s.stage==='trace'){if(o.id==='lift'){s.flags.liftArchive=true;root.StoryContinuity?.record('liftArchive','found');next(s);emit(s,'object','O alçapão camuflado liga a trilha de manutenção ao abrigo de Aura. Uma marcação manual aponta a última passagem às 04:47, sem assinatura digital. Sierra fotografa antes de seguir.',{title:'ALÇAPÃO / REGISTRO ANALÓGICO'});return;}if(o.id==='terminal'){if((s.progress.terminal||0)<.8)emit(s,'object','SCAN / localizar a alimentação de reserva.',{title:'TERMINAL'});else if(!s.flags.terminal){s.flags.terminal=true;s.checkpoint=800;emit(s,'object','SESSÃO RECUPERADA / A. T. LOVELACE / ORIGEM NÃO VERIFICADA. O registro foi aberto após o corte de energia.',{title:'TERMINAL LOCAL'});}}if(o.id==='credential'&&!s.flags.credential){s.flags.credential=true;s.checkpoint=1650;emit(s,'object','TOKEN REVOGADO / A. LOVELACE / REVOGAÇÃO SEM ASSINATURA',{title:'ARQUIVO LOCAL'});}if(o.id==='camera'&&!s.flags.camera){s.flags.camera=true;s.fragment=.85;emit(s,'camera');}if(o.id==='files'){emit(s,'object','Alguém consultou SIERRA CORE usando uma sessão local. O registro marca um horário posterior ao apagão. Sierra guarda as duas horas; o terminal não identifica quem fez a busca.',{title:'HISTÓRICO LOCAL'});}if(o.id==='solder')emit(s,'radio','Alguém contornou a trava sem usar a rede. Não prova quem esteve aqui, mas explica por que o terminal continuou ligado.',{speaker:'SIERRA'});if(o.id==='exit'){if(s.flags.terminal&&s.flags.credential&&s.flags.camera)next(s);else emit(s,'object','Sem o terminal, o leitor de acesso e a câmera, seguir esse cabo seria só um chute.',{title:'SIERRA'});}}
else if(s.stage==='approach'){if(o.id==='reflection'){s.flags.reflectionSeen=true;emit(s,'radio','Você ouviu alguém? Eu só escutei o cabo vibrar.',{speaker:'JINX'});}if(o.id==='resident'){s.flags.intercomChecked=true;emit(s,'object','A. LOVELACE / SEM CADASTRO PÚBLICO. O nome está riscado no verso do interfone desligado. Alguém vive aqui fora do mapa municipal.',{title:'INTERFONE / ENTRADA CAMUFLADA'});}if(o.id==='exit'&&s.door){s.mode='won';emit(s,'apartment');}}}
s.useWas=!!i.use;}
function retry(s){NeoRuntime.retry(s);}
root.Prelude={create,step,near,drones,platforms,widths,objects,retry,npcs,dialogue};
})(typeof window!=='undefined'?window:globalThis);
