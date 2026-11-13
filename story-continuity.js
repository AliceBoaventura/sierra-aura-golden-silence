/* RC33 · Continuidade narrativa. Only observed choices affect later dialogue. */
(function(root){
 'use strict';
 const memory={};
 function capture(s){
  if(!s||!Number.isInteger(s.chapter))return;
  if(s.chapter===2&&['guard','evidence','care'].includes(s.flags?.auraFirstContact))memory.firstContact=s.flags.auraFirstContact;
  if(s.chapter===2&&['cautious','playful','curious'].includes(s.flags?.auraParting))memory.auraParting=s.flags.auraParting;
  if(s.chapter===2&&s.flags?.repairedTogether)memory.repairBond='together';
  if(s.chapter===2&&s.flags?.vinyl)memory.auraVinyl='found';
  if(s.chapter===2&&s.flags?.glove)memory.auraGlove='found';
  if(s.chapter===3&&['research','personal','boundary'].includes(s.flags?.auraPromise))memory.auraPromise=s.flags.auraPromise;
  if(s.chapter===1){
   if(s.flags?.liftArchive)memory.liftArchive='found';
   const o=s.flags?.neriOutcome;
   if(['rescued','escorted','left'].includes(o))memory.neri=o;
  }
  if(s.chapter===4&&['stay','study','refuse'].includes(s.ending))memory.terrace=s.ending;
  if(s.chapter===5&&['approach','jealous','boundary'].includes(s.closeness))memory.club=s.closeness;if(s.chapter===5&&['protect','aura','trace'].includes(s.flags?.evidencePath))memory.evidencePath=s.flags.evidencePath;
  if(s.chapter===6&&['evidence','jealous','boundary'].includes(s.nearChoice))memory.ghost=s.nearChoice;
  if(s.chapter===6&&['ISOLATED','EXTRACTED','SEALED'].includes(s.flags?.alexandra_log_status))memory.terminal=s.flags.alexandra_log_status;
  if(s.chapter===5&&['PRAGMATIC','ANALYTIC','SUSPICIOUS'].includes(s.flags?.sierra_posture))memory.cadillacPosture=s.flags.sierra_posture;
  if(s.chapter===7&&s.flags?.dead)memory.alexandra='dead';
 }
 function history(){return {...memory};}
 function reset(){root.SharedMoments?.reset();for(const key of Object.keys(memory))delete memory[key];try{root.sessionStorage?.removeItem('sierra-aura-district-npc-v1');}catch{}delete root.neoDistrictNpcHistory;}
 function record(key,value){const allowed={liftArchive:['found'],evidencePath:['protect','aura','trace'],auraPromise:['research','personal','boundary'],auraParting:['cautious','playful','curious'],linkReciprocity:['deep','limited'],linkTrust:['shared-memory','respected-boundary'],linkKeaneSignal:['revealed','private'],repairBond:['together'],auraVinyl:['found'],auraGlove:['found'],firstContact:['guard','evidence','care'],neri:['rescued','escorted','left'],terrace:['stay','study','refuse'],loveLine:['together','intervene','freedom'],club:['approach','jealous','boundary'],ghost:['evidence','jealous','boundary'],terminal:['ISOLATED','EXTRACTED','SEALED'],cadillacPosture:['PRAGMATIC','ANALYTIC','SUSPICIOUS']};if(allowed[key]?.includes(value))memory[key]=value;}
 const terrace={
  stay:'SIERRA: Eu pedi uma noite sem despedidas. Investigar a Alex não significa voltar a aceitar o plano.',
  study:'SIERRA: Eu prometi examinar os riscos com você, Aura. Não concordei com uma transferência irreversível.',
  refuse:'SIERRA: Eu disse não ao plano do jeito que está. Isso não mudou só porque estamos juntas.'
 };
 const neri={
  rescued:'JINX: A clínica admitiu a Dona Neri. Recebi a confirmação. Ela não ficou esperando naquela calçada.',
  escorted:'JINX: A filha da Dona Neri chegou. A clínica ainda deve uma resposta, mas ela não ficou sozinha.',
  left:'SIERRA: Eu passei por Dona Neri sem resolver a situação. Não sei o que aconteceu com ela depois.'
 };
 const club={
  approach:'ALEXANDRA: Você disse que mostraria tudo à Aura. Não esquece dessa parte.',
  jealous:'ALEXANDRA: O que houve entre mim e Aura não é uma competição. Não vou usar nosso passado para te diminuir.',
  boundary:'ALEXANDRA: Você não quis prometer nada pela Aura. Está certa. A decisão sobre os dados dela precisa ser dela.'
 };
 const ghost={
  evidence:'SIERRA: Na casa da Alex eu só queria entender por que ela guardou tudo sozinha. Agora vou encontrar a pessoa que faltou ao arquivo.',
  jealous:'SIERRA: Eu perdi tempo com ciúme do passado. Alexandra desapareceu e isso é o que importa agora.',
  boundary:'SIERRA: Ela respeitou o limite dos nossos dados. Devo fazer o mesmo por ela.'
 };
 const grief={
  evidence:'SIERRA: Eu queria ter entendido melhor as razões da Alex. Ainda tenho as perguntas, mas não tenho mais a pessoa.',
  jealous:'SIERRA: Desperdicei parte da última conversa tentando entender meu ciúme da história delas.',
  boundary:'SIERRA: Fui embora da conversa com o limite definido. Não tive tempo de agradecer pelo que ela preservou.'
 };
 function lines(chapter,beat,step=0){const out=[];
  if(chapter===5&&beat==='brief'&&step===0&&memory.liftArchive==='found')out.push('SIERRA: No elevador achei um acesso às 04:47 sem identificação. É a mesma hora da fita.');
  if(chapter===5&&beat==='brief'&&step===0&&memory.auraParting==='cautious')out.push('AURA / RÁDIO: Você disse que voltaria pela investigação. O arquivo está aqui. Pode conferir antes de confiar na minha palavra.');
  if(chapter===5&&beat==='brief'&&step===0&&memory.auraParting==='playful')out.push('AURA / RÁDIO: A bancada ainda está funcionando. Você vai ter que arrumar outra desculpa para voltar.');
  if(chapter===5&&beat==='brief'&&step===0&&memory.auraParting==='curious')out.push('AURA / RÁDIO: Eu ainda quero aquela conversa sem o arquivo. Quando isto acabar.');
  if(chapter===5&&beat==='meet'&&step===1&&memory.auraPromise==='boundary')out.push('AURA / RÁDIO: Sobre o que combinamos no terraço: não entro em outro enlace sem te mostrar a rota de saída.');
  if(chapter===5&&beat==='meet'&&step===1&&memory.auraPromise==='personal')out.push('AURA / RÁDIO: Você pediu uma conversa sem aparelhos no terraço. Eu lembro.');
  if(chapter===5&&beat==='meet'&&step===1&&memory.auraPromise==='research')out.push('AURA / RÁDIO: A cópia que você trouxe ao terraço continua isolada. Os seis minutos ainda não têm explicação.');
  if(chapter===5&&beat==='brief'&&step===1&&memory.firstContact==='guard')out.push('JINX: Na primeira noite você me chamou pra cobrir a porta. Continuo aqui, Sierra.');
  if(chapter===5&&beat==='brief'&&step===1&&memory.firstContact==='care')out.push('AURA / RÁDIO: Naquela primeira noite, você perguntou da queimadura antes de tocar na bancada. Eu lembro.');
  if(chapter===5&&beat==='brief'&&step===1&&memory.firstContact==='evidence')out.push('AURA / RÁDIO: Você pediu uma cópia isolada quando a gente se conheceu. Fiz o mesmo com os seis minutos da fita.');
  if(chapter===6&&beat==='welcome'&&step===0&&memory.evidencePath==='protect')out.push('SIERRA: Trouxe a cópia do clube sem conectar à rede. Só Aura e eu temos a chave.');if(chapter===6&&beat==='welcome'&&step===0&&memory.evidencePath==='aura')out.push('SIERRA: Aura ouviu o trecho no clube e pediu que o resto ficasse fechado. A guarda chegou enquanto esperávamos.');if(chapter===6&&beat==='welcome'&&step===0&&memory.evidencePath==='trace')out.push('SIERRA: O disco veio de NR-731/04:47. Vou conferir esse código com o arquivo da Alex.');if(chapter===7&&beat==='trace1'&&step===1&&memory.evidencePath==='trace')out.push('SIERRA: É o mesmo 04:47 do identificador NR-731. Não é uma localização, mas liga os dois registros.');if(chapter===7&&beat==='map'&&step===0&&memory.evidencePath==='protect')out.push('SIERRA: A cópia lacrada ainda está intacta. Não vou abri-la pela rede da instalação.');if(chapter===7&&beat==='map'&&step===0&&memory.evidencePath==='aura')out.push('AURA: Eu autorizei só seis minutos. Se encontrarmos o resto aqui, quero escolher antes de abrir.');if(chapter===6&&beat==='last'&&step===0&&memory.terminal)out.push({ISOLATED:'SIERRA: O registro da Alex está preservado offline. Não vou deixar a rede decidir o que houve.',EXTRACTED:'SIERRA: O terminal marcou 04:47:00. Essa hora aparece em lugares demais para ser um defeito aleatório.',SEALED:'SIERRA: Jinx guardou a chave do registro. Não destruímos nada; agora preciso escolher o que perguntar.'}[memory.terminal]);
  if(chapter===5&&beat==='brief'&&step===0&&terrace[memory.terrace])out.push(terrace[memory.terrace]);
  if(chapter===5&&beat==='brief'&&step===1&&neri[memory.neri])out.push(neri[memory.neri]);
  if(chapter===6&&beat==='welcome'&&step===0&&club[memory.club])out.push(club[memory.club]);
  if(chapter===7&&beat==='map'&&step===0&&ghost[memory.ghost])out.push(ghost[memory.ghost]);
  if(chapter===7&&beat==='map'&&step===0&&memory.terminal==='EXTRACTED')out.push('SIERRA: O carimbo de 04:47 está preservado numa cópia offline. O sinal no setor não é imaginação.');
  // P47: a promise from the terrace is heard, not simply counted.
  // P49 · What Sierra promised on the terrace changes what she says while Jinx
  // takes fire for her. A chapter-select entry never invents the earlier promise.
  if(chapter===5&&beat==='raid'&&step===0&&memory.loveLine){
   const echoes={
    together:'SIERRA / RÁDIO: Prometi que encontraríamos uma saída juntas. Jinx está levando os tiros. Eu não vou deixar essa promessa custar a vida dele.',
    intervene:'SIERRA / RÁDIO: Quis impedir que Aura corresse riscos. Agora Jinx está se arriscando por mim. Não posso escolher esse preço por ele.',
    freedom:'SIERRA / RÁDIO: Eu defendi a escolha da Aura. Jinx também escolheu ficar. Preciso correr com ele, não usá-lo como escudo.'
   };
   out.push(echoes[memory.loveLine]);
  }
  if(chapter===5&&beat==='boarding'&&step===0&&memory.loveLine&&memory.evidencePath){
   const echoes={
    together:'SIERRA: Dois lugares no carro. Era disso que eu estava falando quando prometi voltar com quem me ajudasse.',
    intervene:'SIERRA: Proteger não é ordenar que Jinx fique para trás. Só entro quando ele alcançar a porta.',
    freedom:'SIERRA: Jinx escolheu cobrir a fuga. Eu escolho não deixá-lo sozinho na pista.'
   };
   out.push(echoes[memory.loveLine]);
  }
  if(chapter===5&&beat==='brief'&&step===0&&memory.loveLine){
   const echo={together:'SIERRA / RÁDIO: Ontem eu prometi à Aura que procuraria uma saída para nós duas. Hoje preciso começar por não transformar a gravação em isca.',intervene:'SIERRA / RÁDIO: Eu disse que tentaria impedir Aura de se perder. Antes disso, preciso saber se a pista é real ou só um jeito de assustá-la.',freedom:'SIERRA / RÁDIO: Aura decide sobre o próprio corpo. Não sobre quem se machuca por ela. Vou buscar a prova sem entregar ninguém.'};
   out.push(echo[memory.loveLine]);
  }
  if(chapter===6&&beat==='welcome'&&step===0&&memory.loveLine&&memory.evidencePath){
   const echo={together:'SIERRA: A gente combinou procurar uma rota de volta. Mas não há rota segura para a Alex se eu levar a rede inteira até este apartamento.',intervene:'SIERRA: Na minha cabeça, proteger era impedir que alguém se arriscasse. A Alex continuou trabalhando mesmo assim.',freedom:'SIERRA: Não decidi pela Aura no clube. A Alex também merece decidir o que vai expor. Quero ouvir antes de abrir a cópia.'};
   out.push(echo[memory.loveLine]);
  }
  if(chapter===7&&beat==='map'&&step===0&&memory.loveLine&&memory.ghost){
   const echo={together:'SIERRA: Prometi à Aura que não entraríamos sem uma saída. A Alex entrou sozinha. Não vou usar essa promessa como desculpa para abandonar a busca.',intervene:'SIERRA: Eu pensei que conseguiria impedir quem amo de se colocar em risco. Agora preciso agir com as provas que a Alex deixou, não com o que eu queria ter evitado.',freedom:'SIERRA: A Alex teve direito à própria decisão. Nós ainda temos o dever de descobrir quem colocou essa decisão diante dela.'};
   out.push(echo[memory.loveLine]);
  }
  if(chapter===7&&beat==='files'&&step===1&&club[memory.club])out.push({approach:'SIERRA: No clube prometi mostrar a verdade à Aura. Ainda não sei quanto dessa gravação consigo provar.',jealous:'SIERRA: No clube eu deixei o passado das duas me atingir. Agora preciso encontrar a Alex antes que seja tarde.',boundary:'SIERRA: No clube eu me recusei a decidir pela Aura. Ainda é ela quem deve escolher o destino dos dados.'}[memory.club]);
  return out;
 }
 function render(container,chapter,beat,step=0){
  // P57: Do not stack flashback monologues between the main line and
  // the player's choices. Decisions still affect later story branches.
  if(chapter===5)return;
  if(!container||!('createElement' in root.document))return;
  const text=lines(chapter,beat,step);if(!text.length)return;
  const anchor=container.querySelector('.club-choices,.club-next,.club-help');
  for(const speech of text){const p=root.document.createElement('p');p.className='continuity-recall';p.textContent=speech;if(anchor)container.insertBefore(p,anchor);else container.appendChild(p);}
 }
 function interludeBeat(id){
  if(id!=='cafe1'||!grief[memory.ghost])return [];
  return [{who:'SIERRA',text:grief[memory.ghost].replace(/^SIERRA: /,'')},{who:'JINX',text:'Se quiser falar dela, eu escuto. Não tenho uma resposta pra te dar.'}];
 }
 // Restore only known decisions. Never trust raw browser storage as executable state.
 function restore(saved){
  reset();
  if(!saved||typeof saved!=='object'||Array.isArray(saved))return;
  for(const [key,value] of Object.entries(saved))record(key,value);
  if(saved.alexandra==='dead')memory.alexandra='dead';
 }
 root.StoryContinuity={capture,record,reset,restore,history,lines,render,interludeBeat};
})(typeof window!=='undefined'?window:globalThis);
