/* RC37 FULL CAMPAIGN | Aditivo de escolhas do Gemini, integrado ao motor existente.
 * Nao substitui cadillac-intro.js (tela inicial) nem interlude-story.js.
 * A fase do Cadillac e a memoria do cafe compartilham uma escolha observada.
 */
(function(root){
  'use strict';
  const STORE='sierra-aura-cadillac-rc37-v1';
  const POSTURES=['PRAGMATIC','ANALYTIC','SUSPICIOUS'];
  let selected=null,terminalChoice=null;
  try {
    const item=JSON.parse(root.localStorage?.getItem(STORE)||'null');
    if(item?.version===1 && POSTURES.includes(item.posture)) selected=item.posture;
    if(item?.version===1 && ['ISOLATED','EXTRACTED','SEALED'].includes(item.terminal)) terminalChoice=item.terminal;
  } catch (_) { /* armazenamento indisponivel (navegacao privada, file://) */ }
  const originalReset=root.StoryContinuity.reset;
  root.StoryContinuity.reset=function(){
    selected=null;terminalChoice=null;
    try { root.localStorage?.removeItem(STORE); } catch (_) {}
    return originalReset();
  };
  function choose(s,index){
    if(!Number.isInteger(index)||index<0||index>=POSTURES.length)return;
    const posture=POSTURES[index];selected=posture;
    s.flags.sierra_posture=posture;
    root.StoryContinuity?.record?.('cadillacPosture',posture);
    s.flags.aura_state=['DISTANT','SYNCHRONIZED','FRAGMENTED'][index];
    s.flags.jinx_boundary=['DISTANT','PROTECTIVE','OFFENDED'][index];
    s.flags.aura_silenced_in_car=index===0;
    s.flags.pulse_data_saved=index===1;
    try {root.localStorage?.setItem(STORE,JSON.stringify({version:1,posture,terminal:terminalChoice}));}catch(_){}
  }
  function ambient(text){return {who:'AMBIENTE',minute:22,aside:'02:22 / CAFETERIA DO DISTRITO 07',text};}
  const scenes={
    SUSPICIOUS:[
      ambient('Jinx encara a chuva do outro lado do vidro. A caneca está perto do cinzeiro, intocada. Ele deixa Sierra puxar a cadeira sem interromper o olhar.'),
      {who:'JINX',text:'Pode sentar. Não vou te pedir para explicar o tempo que passou pensando que a rota vazou por minha causa.'},
      {who:'SIERRA',choiceKey:'jinx_repair',text:'',choices:[
        {label:'Eu não disse que foi você. Mas alguém conhecia a rota.',reply:[
          {who:'JINX',text:'Eu seguro a lanterna quando você solda há quatro anos, Si. Se desconfia de mim, diz diretamente. Não insinua e vai embora.'},
          {who:'SIERRA',text:'Não tenho prova contra você. Eu tenho medo de estar procurando no lugar errado.'}
        ]},
        {label:'Eu estava com medo e descontei em você.',reply:[
          {who:'JINX',text:'Eu posso lidar com medo. Só não vou aceitar ser tratado como alguém que te entregaria para a patrulha.'},
          {who:'SIERRA',text:'Tá. Você tem razão nessa parte.'}
        ]}
      ]}
    ],
    PRAGMATIC:[
      ambient('O rádio da cafeteria chia entre estações, sem conseguir travar a frequência. Jinx aponta para uma cadeira vazia com a ponta do cigarro.'),
      {who:'JINX',text:'Você cortou o canal de Aura no carro. Desde aquela noite, você evita falar daquele sinal.'},
      {who:'SIERRA',choiceKey:'jinx_repair',text:'',choices:[
        {label:'Se não cortasse, a patrulha podia localizar a gente.',reply:[
          {who:'JINX',text:'Pode ser. Mas você também não queria ouvir o nome da Alex no rádio. As duas coisas podem ser verdade.'},
          {who:'SIERRA',text:'Não estou dizendo que foi só cálculo.'}
        ]},
        {label:'O silêncio parecia mais fácil naquela hora.',reply:[
          {who:'JINX',text:'O silêncio resolveu a fuga. Não resolveu o que aconteceu depois.'},
          {who:'SIERRA',text:'Eu sei. Por isso vim.'}
        ]}
      ]}
    ],
    ANALYTIC:[
      ambient('A fita no balcão estala no segundo compasso. É a mesma pequena falha de áudio registrada na lente de Sierra durante a fuga no Cadillac.'),
      {who:'JINX',text:'Aquele pulso da ponte. Você guardou a assinatura antes de apagar o canal?'},
      {who:'SIERRA',choiceKey:'jinx_repair',text:'',choices:[
        {label:'Guardei. O padrão coincide com o rádio da Alexandra.',reply:[
          {who:'JINX',text:'O rádio dela estava desmontado na bancada. Se emitiu alguma coisa, precisamos descobrir quem fechou o circuito.'},
          {who:'SIERRA',text:'Depois do que aconteceu com ela, não vou chamar isso de coincidência.'}
        ]},
        {label:'Guardei, mas ainda não quero mostrar o arquivo.',reply:[
          {who:'JINX',text:'Tudo bem. Só não confunde manter cópia com carregar esse peso sozinha.'},
          {who:'SIERRA',text:'Quando encontrar uma segunda leitura, você vai ver primeiro.'}
        ]}
      ]}
    ]
  };
  const logStates=['ISOLATED','EXTRACTED','SEALED'];
  const terminalOptions=[
    {label:'[Isolar cópia] Preservo o buffer sem apagar o original.', who:'AURA / ENLACE', text:'Buffer isolado. A nota de Alexandra não sai deste terminal. JINX: Finalmente uma pista que ninguém pode reescrever à distância.'},
    {label:'[Extrair setores] Quero os carimbos de hora, mesmo com lacunas.',who:'AURA / ENLACE',text:'Leitura local concluída: 04:47:00 / ausência de observação. Não é uma gravação contínua. SIERRA: Então a falha aconteceu exatamente quando Alex desapareceu.'},
    {label:'[Selar terminal] Ainda não quero decifrar o recado dela.',who:'JINX',text:'Vou lacrar a cópia, não destruir. Quando você quiser ler, a chave está comigo. SIERRA: Deixa assim por enquanto.'}
  ];
  function terminal(s,index){
    if(s?.chapter!==6 ||s.phase!=='ready'||!Number.isInteger(index)||index<0||index>=3)return null;
    const id=logStates[index];terminalChoice=id;
    s.flags.alexandra_log_status=id;
    s.flags.aura_memory_integrity=index===1?'CAUTION':'STABLE';
    s.flags.alexLogRead=true;
    root.StoryContinuity?.record?.('terminal',id);
    try {root.localStorage?.setItem(STORE,JSON.stringify({version:1,posture:selected,terminal:id}));}catch(_){}
    return terminalOptions[index];
  }
  function cafeBeat(){
    const beats=selected?scenes[selected].map(x=>({...x})):[];
    if(terminalChoice){
      const note={ISOLATED:'A cópia isolada do terminal de Alexandra continua guardada. Ainda não descobri a origem da frase que ela deixou.',EXTRACTED:'O registro dos 04:47 veio do terminal de Alexandra. Sei o horário exato. Não sei quem construiu aquele intervalo.',SEALED:'Jinx ficou com a chave da cópia do terminal. Eu mesma pedi para não abrir. Ainda lembro disso.'}[terminalChoice];
      beats.push({who:'SIERRA',text:note});
    }
    return beats;
  }
  // O palco e o tempo sao os da build RC36. O horario 02:40 enviado pelo
  // Gemini nao foi copiado: a cena real ocorre imediatamente apos a fuga.
  ClubStory.cadillacPulse=[{
    who:'SIERRA / LENTE',
    aside:'CADILLAC 80 / RAMPA DO CANAL. Um pulso analógico atravessa o rádio a cada três segundos. Alexandra ainda está no canal local; Aura acaba de restabelecer o enlace.',
    line:'Aura, esse pulso está aparecendo no meu scanner. O painel do carro está repetindo o mesmo intervalo.',
    choices:[
      ['[Pragmática] Corta o áudio do painel. Não quero uma frequência denunciando nossa rota.',
       'AURA / ENLACE: Canal do painel isolado. A leitura local permanece ativa. JINX: Entendido. Só lembra que o silêncio também tira informação da gente.','trust'],
      ['[Analítica] Salva a assinatura do pulso antes de mexer em qualquer coisa.',
       'AURA / ENLACE: Gravado. Tem uma distorção que lembra a fita da Alexandra. SIERRA: Guarda duas cópias. Uma delas fica fora da rede.','curious'],
      ['[Desconfiada] Quem sabia por qual rampa a gente ia sair?',
       'JINX: Eu estava no volante e a Alex abriu a passagem. Se você está me acusando de alguma coisa, olha pra mim e fala. SIERRA: Estou tentando entender quem nos antecipou.','jealous']
    ]
  }];
  root.RC37Adaptation={choose,cafeBeat,terminal,terminalOptions,selected:()=>selected,terminalStatus:()=>terminalChoice,postures:POSTURES.slice()};
})(typeof window!=='undefined'?window:globalThis);
