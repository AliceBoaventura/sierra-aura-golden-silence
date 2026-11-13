/* RC73 V7: fix narrative divergence caused by numeric-index edits applied
   after the terrace had been structurally shortened. Preserve ten beats,
   their choice IDs, branching outcomes, state flags and chapter transitions. */
(()=>{'use strict';
 const beats=globalThis.Terrace?.beats;
 const patches={
 'Uma casa acima do ruído':{
   speaker:'AURA',line:'O cobertor é para mim? Ou você já contava que eu fosse ficar?',
   aside:'Aura para ao lado das duas cadeiras. O terminal de Sierra permanece desligado.',
   replies:[
    'Aura divide o cobertor. Sierra sente os dedos dela frios como os seus.',
    'Aura senta perto. Não há promessa no convite; só vontade de continuar ali.',
    'Aura sorri. Mei observa as duas pela porta entreaberta.'
   ]},
 'A mão que não se adianta':{
   speaker:'AURA',line:'Posso segurar sua mão?',
   aside:'Aura estende a mão, mas espera Sierra responder.',
   replies:[
    'Aura entrelaça os dedos nos de Sierra. O vento continua frio.',
    'Aura se senta ao lado, respeitando a distância que Sierra pediu.',
    'Aura mantém a mão próxima e espera Sierra decidir se quer tocá-la.'
   ]},
 'O corpo e a nuvem':{
   speaker:'AURA',line:'Reservei uma sala de suspensão. Quero testar se minha consciência pode operar dentro da rede. Ainda não assinei nada.',
   aside:'Aura mostra o cartão de acesso sem oferecê-lo a Sierra. O plano ainda é uma hipótese perigosa.',
   replies:[
    'Aura passa o dedo pelo número do cartão. Ainda não escolheu uma data.',
    'Aura não tenta tranquilizá-la: ninguém pode garantir que a mesma consciência retornaria.',
    'Aura guarda o cartão. Contar não foi pedir autorização; foi deixar Sierra saber antes da decisão.'
   ]},
 'Até onde você iria?':{
   speaker:'AURA',line:'Se eu tentar entrar na rede, vou precisar de uma saída. Você me diria quando eu estivesse ultrapassando meus próprios limites?',
   aside:'O projeto ainda não tem protocolo de retorno confiável. Aura admite isso pela primeira vez.',
   replies:[
    'Aura assente. Sem um caminho de volta, não será uma parceria.',
    'Aura encara Sierra. Pode pedir que ela pare, mas não escolher por ela.',
    'Aura promete contar seus avanços antes de se colocar em risco — sem pedir que Sierra concorde com tudo.'
   ]},
 'Limites antes de promessas':{
   speaker:'AURA',line:'O que eu precisaria demonstrar para você continuar essa conversa, mesmo sem concordar comigo?',
   aside:'Sierra não assina o plano. Aura não trata a discordância como abandono.',
   replies:[
    'Aura concorda em começar por uma simulação reversível, capaz de reprovar o próprio projeto.',
    'Aura aceita estudar uma alternativa em que nenhuma das duas precise desaparecer.',
    'Aura escuta o limite de Sierra e não o transforma em prova de amor.'
   ]},
 'O espelho do outro lado':{
   speaker:'AURA',line:'Você viu? O quarteirão inteiro apagou por um segundo.',
   aside:'As janelas da cidade se acendem novamente. Algo interrompeu a iluminação, não a conversa.',
   replies:[
    'Aura segura a mão de Sierra e espera as luzes voltarem.',
    'Aura observa a rua. Nenhuma delas consegue identificar a origem do apagão.',
    'Aura admite que o apagão a assustou. Sierra não confunde medo com confirmação de ameaça.'
   ]},
 'Antes que você vire ausência':{
   speaker:'AURA',replyLabel:'CENA',
   line:'Eu quero te beijar. Você também quer?',
   replies:[
    'Sierra se aproxima; Aura encontra seu beijo. Elas ficam juntas, sem chamar aquilo de despedida.',
    'Aura beija Sierra. Nenhuma delas promete o que ainda não pode cumprir.',
    'Aura aceita esperar. Elas continuam de mãos dadas, sem que a recusa seja tratada como perda.'
   ]},
 'A noite que ainda tem um corpo':{
   speaker:'AURA',replyLabel:'CENA',
   line:'Posso ficar esta noite, se você quiser. Podemos conversar, dormir ou nos despedir aqui.',
   replies:[
    'Elas confirmam o que desejam, entram juntas e fecham a porta. O restante da noite fica fora das câmeras.',
    'Aura deixa o terminal na mesa. Elas dormem próximas, sem que isso implique outra intimidade.',
    'Aura vai para casa. As duas combinam conversar novamente amanhã.'
   ]},
 'O rosto do outro lado':{
   speaker:'VOZ / ORIGEM INDEFINIDA',replyLabel:'SONHO',
   aside:'Sierra sonha com o apartamento em ruínas. No espelho aparece o rosto de Aura, mas o som não coincide com seus lábios.',
   line:'Você tem certeza de que está acordada?',
   choices:[
    ['Se estivesse, o seu rosto não estaria preso no meu espelho.','O vidro se deforma. O rosto de Aura permanece imóvel, como uma fotografia antiga.','close'],
    ['Quem está usando a voz dela?','O som se repete sem resposta. Sierra recua, incapaz de localizar sua origem.','identity'],
    ['Não vou responder a uma voz que não reconheço.','A imagem perde definição. A casa desaba no silêncio e Sierra desperta.','guard']
   ]},
 'O quarto ainda existe':{
   speaker:'SIERRA / PENSAMENTO',responseLabel:'SIERRA DECIDE',replyLabel:'CENA',
   aside:'Sierra acorda. Aura está ao lado dela. O quarto não sofreu nenhum dano.',
   line:'O quarto está inteiro. Aura está aqui. O que eu faço com esse sonho?',
   replies:[
    'Aura acorda devagar. Sierra relata o espelho sem tratá-lo como prova de alguma coisa.',
    'Sierra toca o rosto de Aura por um instante e deixa que ela continue dormindo.',
    'Sierra fica acordada mais um pouco, observando o quarto real antes de contar o sonho.'
   ]}
 };
 const report={version:'RC73-V7-TERRACE-SEMANTIC',expected:Object.keys(patches).length,applied:0,missing:[],optionCountsPreserved:true};
 for(const [title,patch] of Object.entries(patches)){
  const beat=beats?.find(b=>b.title===title);
  if(!beat){report.missing.push(title);continue;}
  const oldCount=beat.choices?.length;
  for(const [key,value] of Object.entries(patch)){
   if(key==='replies'){for(let i=0;i<value.length;i++){
     if(beat.choices?.[i])beat.choices[i][1]=value[i];
   }}else if(key==='choices'){
     if(value.length!==oldCount){report.optionCountsPreserved=false;continue;}
     for(let i=0;i<value.length;i++){
      beat.choices[i][0]=value[i][0];beat.choices[i][1]=value[i][1];
      // Preserve the original choice's tone/outcome identity.
     }
   }else beat[key]=value;
  }
  if(beat.choices?.length!==oldCount)report.optionCountsPreserved=false;
  report.applied++;
 }
 globalThis.RC73V7EditorialAudit=Object.freeze(report);
 if(report.missing.length||!report.optionCountsPreserved)console.error('RC73 V7 terrace patch incomplete',report);
})();
