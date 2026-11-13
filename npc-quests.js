/* Neo Rockford | Side stories are voluntary, grounded in actual world interactions,
   and never silently clear just because a conversation was started. */
(function(root){
'use strict';
const data={
 vendor:{key:'liaDelivery',title:'CAFÉ PARA MARA',who:'LIA',goal:'Leve o café de Mara até o quadro elétrico.',done:'Mara recebeu o café antes do próximo turno.'},
 mechanic:{key:'maraClinic',title:'ENERGIA PARA A CLÍNICA',who:'MARA',goal:'Restaure o quadro e confira o circuito da catraca da clínica.',done:'Circuito auxiliar da clínica religado.'},
 patient:{key:'neriCare',title:'DONA NERI',who:'DONA NERI',goal:'Restaure o quadro e confira o registro da catraca com a autorização de Dona Neri.',done:'A catraca corrigiu a duplicidade; Dona Neri entrou para atendimento.'},
 courier:{key:'irisReceipt',title:'COMPROVANTE PERDIDO',who:'ÍRIS',goal:'Depois do reparo, recupere o comprovante na catraca e volte a Íris.',done:'Íris recuperou a prova de que a entrega foi feita.'},
 recycler:{key:'caioSalvage',title:'FILTRO DESCARTADO',who:'CAIO',goal:'Inspecione a placa de manutenção e devolva o filtro a Caio.',done:'Caio recuperou o filtro sem entrar no setor de segurança.'},
 watcher:{key:'noaBeacon',title:'FAROL CIVIL',who:'NOA',goal:'Isole a alimentação local e sinalize o farol no painel; avise Noa.',done:'Noa confirmou o aviso de passagem segura.'}
};
function ensure(s){if(!s.quests||typeof s.quests!=='object')s.quests={};return s.quests;}
function status(s,id){const d=data[id];return d?(ensure(s)[d.key]||'available'):null;}
function set(s,id,value){const d=data[id];if(d)ensure(s)[d.key]=value;}
function emit(s,text,title='REGISTRO CIVIL'){s.events.push({type:'object',title,text});}
function complete(s,id){if(status(s,id)!=='active')return false;set(s,id,'complete');remember(s);emit(s,data[id].done,'DISTRITO 07');return true;}
function options(s,id){if(!data[id])return [];
 const st=status(s,id);
 if(st==='complete')return [];
 if(st==='active')return [{label:'REVER OBJETIVO',value:'remind'},{label:'ADIAR, CONTINUAR DEPOIS',value:'later'}];
 if(id==='patient')return [{label:'SOLICITAR ATENDIMENTO NA CATRACA',value:'accept'},{label:'PEDIR A JINX QUE CHAME A FILHA',value:'escort'},{label:'SEGUIR SEM INTERVIR',value:'decline'}];
 const labels={vendor:'LEVAR O CAFÉ A MARA',mechanic:'RELIGAR O CIRCUITO DA CLÍNICA',courier:'RECUPERAR O COMPROVANTE',recycler:'BUSCAR O FILTRO',watcher:'AJUSTAR O FAROL DE ALERTA'};
 return [{label:labels[id]||'AJUDAR',value:'accept'},{label:'NÃO AGORA',value:'decline'}];
}
function choose(s,id,value){const d=data[id];if(!d)return [];
 if(value==='remind')return [[d.who,d.goal],['SIERRA','Entendido. Ainda posso cuidar disso antes de sair do setor.']];
 if(value==='later')return [[d.who,'Tudo bem. Não vou fingir que isso está resolvido.']];
 if(value==='decline'){
   if(id==='patient'){s.flags.neriOutcome='left';s.flags.helped=false;s.flags.neriSaved=false;}
   set(s,id,'declined');return [[d.who,id==='patient'?'Eu ainda vou estar aqui. Se mudar de ideia, me procura.':({vendor:'Vou deixar a tampa bem fechada. Se esfriar, a Mara reclama comigo.',mechanic:'Tá. Eu fico com o quadro. E não encosta no fio vermelho. Estou falando sério.',courier:'Vou guardar o recibo amassado. É o único que sobrou.',recycler:'Se vir o filtro, deixa em cima da bancada.',watcher:'Vou avisando quem passa até alguém consertar.'})[id]],['SIERRA',({vendor:'Se eu encontrar Mara pelo caminho, eu levo.',mechanic:'Não toco na caixa sem te avisar.',patient:'Eu te ouvi. Só não vou te prometer uma vaga que não tenho.',courier:'Guarda a hora da entrega. Não deixa alterarem.',recycler:'Se o filtro aparecer no caminho, eu guardo.',watcher:'Se vir o farol apagar de vez, fecha a passagem.'})[id]]];
 }
 if(value==='escort'&&id==='patient'){
  set(s,id,'complete');s.flags.neriOutcome='escorted';s.flags.helped=true;s.flags.neriSaved=false;
  emit(s,'Jinx confirmou pelo rádio: a filha de Dona Neri está a caminho.');
  return [['SIERRA','Dona Neri, quer que o Jinx avise sua filha?'],['DONA NERI','Quero. Mas diga a ela que a clínica ainda não me atendeu.'],['JINX / RÁDIO','A filha confirmou que vem. Vou deixar a linha aberta.']];
 }
 if(value==='accept'){
  set(s,id,'active');if(!tracked(s))s.trackedQuest=id;
  if(id==='patient'){delete s.flags.neriOutcome;s.flags.helped=false;s.flags.neriSaved=false;}
  if(id==='mechanic'&&s.flags.repair){return [[d.who,'O quadro já voltou. Falta religar a derivação da clínica na catraca.'],['SIERRA',d.goal]];}
  return [[d.who,d.goal],['SIERRA',({vendor:'Se eu derramar, a culpa vai ser do Jinx.',mechanic:'Me mostra onde começa a derivação.',patient:'Vou conferir a duplicidade na catraca. Se aparecer algo diferente do que a senhora contou, eu volto aqui.',courier:'Vou conferir o terminal da clínica.',recycler:'O filtro tem alguma marca?',watcher:'Vou ao painel. Me avisa se os drones voltarem.'})[id]]];
 }
 return [];
}
function onMeet(s,id){const st=status(s,id);
 if(id==='mechanic'&&status(s,'vendor')==='active'&&!s.flags.liaDelivered){s.flags.liaDelivered=true;complete(s,'vendor');emit(s,'Mara recebeu o café de Lia.');}
 if(id==='courier'&&status(s,id)==='active'&&s.flags.clinicReceipt){complete(s,id);}
 if(id==='recycler'&&status(s,id)==='active'&&s.flags.scrapFilter){complete(s,id);}
 if(id==='watcher'&&status(s,id)==='active'&&s.flags.beaconMarked){complete(s,id);}
 return st;
}
// Called on actual object use, not on dialogue text or scanner-only hover.
function onObject(s,id){
 if(s.stage==='district'&&id==='clinic'){
  if(!s.flags.repair)return 'CLÍNICA / Sem alimentação. O quadro elétrico de Mara precisa ser restaurado primeiro.';
  if(status(s,'mechanic')==='active'){s.flags.clinicReady=true;complete(s,'mechanic');}
  if(status(s,'courier')==='active'){s.flags.clinicReceipt=true;}
  if(status(s,'patient')==='active'){
   if((s.progress.clinic||0)<.7)return 'CLÍNICA / SCAN (Q) por 1 segundo para conferir a divergência biométrica antes de confirmar com E.';
   s.flags.neriOutcome='rescued';s.flags.neriSaved=true;s.flags.helped=true;complete(s,'patient');
   return 'CLÍNICA / Registro corrigido com autorização de Dona Neri. A enfermeira confirmou a entrada. No registro anterior, a triagem constava como encerrada antes de ela ser atendida. A correção ficou protocolada.';
  }
  if(s.flags.neriOutcome==='rescued')return 'CLÍNICA / DONA NERI EM ATENDIMENTO';
  return s.flags.clinicReady?'CLÍNICA / Circuito auxiliar ativo. Atendimento novamente disponível.':'CLÍNICA / Rede restaurada. A triagem ainda exige conferência manual.';
 }
 if(s.stage==='district'&&id==='maintenance'&&status(s,'recycler')==='active'){
  s.flags.scrapFilter=true;return 'MANUTENÇÃO / Filtro intacto recolhido entre as peças descartadas. Devolva a Caio.';
 }
 if(s.stage==='district'&&id==='power'&&status(s,'watcher')==='active'&&s.flags.power){
  s.flags.beaconMarked=true;return 'FAROL CIVIL / A passagem segura agora aparece no painel local. Avise Noa.';
 }
 return null;
}
function dialogue(s,id){const st=status(s,id), d=data[id];if(!d)return [];
 if(st==='complete'){
  const extra={vendor:'A Mara não precisava só de uma máquina funcionando.',mechanic:'Agora a catraca abre. Pela primeira vez hoje, não precisei discutir com uma luz vermelha.',patient:s.flags.neriOutcome==='escorted'?'Minha filha confirmou que está vindo. O atendimento ainda terá de ser resolvido.':'Dessa vez a tela mostrou meu nome. A enfermeira até se assustou quando eu ri.',courier:'Com esse comprovante eles não podem dizer que eu inventei a entrega.',recycler:'O filtro vai durar mais um mês. Um mês faz diferença aqui.',watcher:'O farol é pequeno. Dá para avisar muita gente sem entregar seus nomes.'};
  return [[d.who,extra[id]||d.done]];
 }
 if(st==='active')return [[d.who,'Ainda está pendente: '+d.goal]];
 const greetings={courier:[['ÍRIS / ENTREGAS','Entreguei a caixa. A clínica diz que nunca chegou. E o comprovante sumiu do sistema.'],['SIERRA','Você lembra a hora exata?'],['ÍRIS','04:17. Até a câmera registrou minha chegada.']],recycler:[['CAIO / RECICLAGEM','Tiraram o filtro do painel de manutenção e chamaram de descarte. É a única peça que falta para ligar minha oficina.']],watcher:[['NOA / PASSAGEM','O farol da passagem apagou. Agora o pessoal vira a esquina sem saber de que lado os drones estão.']]};
 if(greetings[id])return greetings[id];
 return [];
}
function tracked(s){const id=s.trackedQuest;return id&&status(s,id)==='active'?id:null;}
function track(s,id){if(id===null||status(s,id)==='active'){s.trackedQuest=id;return true;}return false;}
function target(s,id=tracked(s)){
 const targets={vendor:'mechanic',mechanic:s.flags.repair?'clinic':'repair',patient:s.flags.repair?'clinic':'repair',courier:s.flags.clinicReceipt?'courier':'clinic',recycler:s.flags.scrapFilter?'recycler':'maintenance',watcher:s.flags.beaconMarked?'watcher':'power'};
 return targets[id]||null;
}
function listing(s){return Object.entries(data).map(([id,d])=>({id,...d,status:status(s,id)}));}
function departure(s){
 if(!s||s.chapter!==1||s.stage!=='district')return false;
 if(['rescued','escorted','left'].includes(s.flags?.neriOutcome))return false;
 s.flags.neriOutcome='left';
 s.flags.helped=false;
 s.flags.neriSaved=false;
 set(s,'patient','declined');
 remember(s);
 return true;
}
function remember(s){
 if(!s||s.chapter!==1)return;
 const flags=s.flags||{};
 const memo={quests:{...ensure(s)},outcome:flags.neriOutcome||null,clinicReady:!!flags.clinicReady,beaconMarked:!!flags.beaconMarked};
 root.neoDistrictNpcHistory=memo;
 try{root.sessionStorage?.setItem('sierra-aura-district-npc-v1',JSON.stringify(memo));}catch{}
}
function history(){
 if(root.neoDistrictNpcHistory)return root.neoDistrictNpcHistory;
 try{const data=root.sessionStorage?.getItem('sierra-aura-district-npc-v1');if(data)return JSON.parse(data);}catch{}
 return null;
}
function chooseAndRemember(s,id,value){const lines=choose(s,id,value);remember(s);return lines;}
root.NPCQuests={data,ensure,status,options,choose:chooseAndRemember,onMeet,onObject,dialogue,listing,complete,departure,remember,history,tracked,track,target};
})(typeof window!=='undefined'?window:globalThis);
