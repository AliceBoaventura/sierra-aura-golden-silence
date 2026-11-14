'use strict';
// Interlúdio canônico: escolhas não antecipam consentimento posterior.
const InterludeStory={"message":[{"who":"JINX / COMUNICADOR","text":"Si, vi a luz da tua janela. Não precisa responder. Vou ficar cinco minutos aqui embaixo."},{"who":"SIERRA","text":"Você vai ficar na chuva por cinco minutos?"},{"who":"JINX / COMUNICADOR","text":"Já trouxe casaco. Faltou trazer bom senso."}],"pickup":[{"who":"JINX","text":"Vi sua luz acesa da rua. Pensei em bater, mas achei melhor esperar você decidir."},{"who":"SIERRA","text":"Você ficou quanto tempo lá embaixo?"},{"who":"JINX","text":"O bastante pra perceber que você não ia dormir. Anda comigo? Só até o fim da rua."}],"walk1":[{"who":"JINX","text":"A Alex me ligou na noite anterior. Eu deixei tocar."},{"who":"SIERRA","text":"Por quê?"},{"who":"JINX","text":"Estava bravo com ela por uma besteira. Agora nem lembro qual."},{"who":"SIERRA","text":"Você não tinha como saber."},{"who":"JINX","text":"Eu sei. Só queria que saber ajudasse."}],"walk2":[{"who":"JINX","text":"Você tá olhando pro comunicador desde que saiu de casa."},{"who":"SIERRA","text":"A Aura não responde. Eu tô com raiva. E preocupada."},{"who":"JINX","text":"As duas coisas cabem no mesmo bolso."},{"who":"SIERRA","text":"Essa foi horrível."},{"who":"JINX","text":"Funcionou. Você riu."}],"order":[{"who":"ATENDENTE","text":"Boa noite. A mesa perto da janela está livre."},{"who":"JINX","text":"Obrigado. Vamos sentar ali."}],"cafe1":[{"who":"JINX","text":"A Alex me ensinou a tocar uma música inteira com dois dedos."},{"who":"SIERRA","text":"Isso explica muita coisa."},{"who":"JINX","text":"Ela disse que eu tinha talento. Depois pediu que eu nunca mais tocasse."},{"who":"SIERRA","text":"Você sente falta de qual versão dela?"},{"who":"JINX","text":"Da que reclamava quando eu chegava atrasado. E da que me esperava mesmo assim."},{"who":"SIERRA","text":"Se você pudesse guardar uma lembrança da Alex, qual seria?","choiceKey":"alex","choices":[{"label":"A última vez que ela salvou a gente.","reply":[{"who":"SIERRA","text":"Ela ficou naquela porta por nós. Quero lembrar que foi uma escolha dela."},{"who":"JINX","text":"E eu quero lembrar que ela também sabia viver. Uma coisa não apaga a outra."}]},{"label":"Conta alguma coisa engraçada dela.","reply":[{"who":"JINX","text":"Ela fingia odiar a minha banda. Tinha todas as gravações."},{"who":"SIERRA","text":"Isso é muito a cara dela."}]},{"label":"Não consigo falar dela agora.","reply":[{"who":"JINX","text":"Tá tudo bem. Posso só ficar aqui."},{"who":"SIERRA","text":"Fica."}]}]}],"cafe2":[{"who":"SIERRA","text":"Posso te falar uma coisa feia?"},{"who":"JINX","text":"Já ouvi você cantar no carro. Pode."},{"who":"SIERRA","text":"Tô com raiva da Aura. Ela sumiu sem me avisar. E eu ainda quero que ela ligue."},{"who":"JINX","text":"Uma coisa não cancela a outra."},{"who":"SIERRA","text":"E se ela ligar e eu não reconhecer mais quem tá do outro lado?"},{"who":"JINX","text":"Então você pergunta. Não precisa fingir que tá tudo bem."},{"who":"SIERRA","text":"Se a Aura me procurar, o que eu faço?","choiceKey":"aura","choices":[{"label":"Eu vou atender, mas quero respostas.","reply":[{"who":"SIERRA","text":"Vou ouvir. E perguntar por que ela não confiou em mim."},{"who":"JINX","text":"É justo. Só deixa ela responder."}]},{"label":"Eu preciso de tempo antes de atender.","reply":[{"who":"SIERRA","text":"Quero pensar antes de falar com ela."},{"who":"JINX","text":"Então pensa. Não é corrida."}]},{"label":"Hoje eu quero desligar o comunicador.","reply":[{"who":"SIERRA","text":"Hoje eu não aguento mais uma surpresa."},{"who":"JINX","text":"Me dá ele. Eu seguro até a gente sair."}]}]},{"who":"JINX","text":"Se ela ligar, a escolha é sua. Eu fico do teu lado de qualquer jeito."}],"auraPing":[{"who":"JINX","text":"Si? Sua lente acabou de acender."},{"who":"SIERRA","text":"O canal da Aura. Um segundo. Depois sumiu."},{"who":"JINX","text":"Pode ter sido ela. Pode não ter sido. Não vou adivinhar."},{"who":"SIERRA","text":"Eu só queria ouvir a voz dela sem ter que duvidar."}],"cafe3":[{"who":"ATENDENTE","text":"Estamos fechando. Podem ficar mais um minuto."},{"who":"SIERRA","text":"Obrigada."},{"who":"JINX","text":"Pronta? Não precisa falar no caminho."}],"returnBeat":[{"who":"JINX","text":"A Alex deixou uma chave comigo. Não faço ideia do que abre."},{"who":"SIERRA","text":"Por que você não contou antes?"},{"who":"JINX","text":"Porque toda vez que tento falar dela parece que ela morreu de novo."},{"who":"SIERRA","text":"Amanhã a gente olha. Hoje não."}],"returnLate":[{"who":"SIERRA","text":"Você acha que a gente teria conseguido salvá-la?"},{"who":"JINX","text":"Eu me faço essa pergunta desde aquela porta. Ainda não achei uma resposta."},{"who":"SIERRA","text":"Então não inventa uma só para eu dormir."},{"who":"JINX","text":"Não vou. Eu fico até você entrar."}],"auraCloud":[{"who":"AURA / CANAL","text":"Si? Estou do outro lado. Não sei se você ainda quer me ouvir.","aside":"O monitor acende sozinho. A imagem de Aura aparece com atraso, sem o filtro habitual. Por um instante, os lábios se movem antes da voz."},{"who":"SIERRA","text":"Três dias. Eu liguei tantas vezes que já sei de cor o som de uma chamada vazia."},{"who":"AURA","text":"Eu vi. Respondi umas dez vezes. Apaguei todas."},{"who":"SIERRA","text":"Por quê?"},{"who":"AURA","text":"Porque qualquer frase parecia pequena demais depois da Alex."},{"who":"SIERRA","text":"Ela morreu, Aura. E eu fiquei aqui sem saber se tinha perdido você também."},{"who":"AURA","text":"Meu corpo está numa cápsula. Minha consciência está ligada à rede. Eu fiz isso sem te contar."},{"who":"SIERRA","text":"Eu queria estar ao seu lado quando você decidisse. Não queria decidir por você."},{"who":"AURA","text":"Eu sei. Não vou pedir que você ache bonito o que eu fiz."},{"who":"SIERRA","text":"O que está acontecendo com a sua imagem?"},{"who":"AURA","text":"Há uma segunda frequência entrando na chamada. Pode ser interferência. Ainda não sei."},{"who":"SIERRA","text":"Você sempre diz isso antes de fazer alguma coisa perigosa."},{"who":"AURA","text":"E você sempre percebe. Senti falta dessa parte."},{"who":"SIERRA","text":"Senti falta da sua voz. Mais do que quero admitir."},{"who":"AURA","text":"Posso te mostrar uma coisa? A ponte sensorial está desligada. Ela consegue transmitir um toque, mas só se você autorizar.","aside":"No canto da tela, duas opções piscam: CONECTAR / MANTER DESLIGADO.","choiceKey":"auraCloud","choices":[{"label":"Quero sentir você. Devagar.","reply":[{"who":"SIERRA","text":"Mostra como eu desligo primeiro."},{"who":"AURA","text":"O controle fica com você. Eu também posso parar a qualquer momento."},{"who":"NARRAÇÃO","text":"Uma luz percorre os dedos de Sierra. O quarto continua frio, mas ela sente um calor leve na palma da mão.","aside":"PONTE SENSORIAL / ATIVA · SAÍDA MANUAL DISPONÍVEL"},{"who":"SIERRA","text":"Você está aí mesmo?"},{"who":"AURA","text":"Estou. E não esperava que sentir sua mão fosse me deixar tão nervosa."},{"who":"SIERRA","text":"Você? Nervosa? Vou guardar essa gravação."},{"who":"AURA","text":"Não grava. Algumas coisas eu queria que fossem só nossas."},{"who":"NARRAÇÃO","text":"A silhueta de Aura se forma acima do terminal, feita de luz falha. Ela não atravessa o quarto. Espera Sierra se aproximar."},{"who":"SIERRA","text":"Se eu fechar os olhos, parece que você está bem aqui."},{"who":"AURA","text":"E se abrir?"},{"who":"SIERRA","text":"Você continua linda. Só um pouco fora de foco."},{"who":"AURA","text":"Talvez seja a rede. Talvez seja você me olhando desse jeito."},{"who":"AURA","text":"Se você quiser, posso chegar mais perto. Mas só seguimos se as duas quiserem.","choiceKey":"cloudIntimacy","choices":[{"label":"Quero ficar mais perto de você.","reply":[{"who":"SIERRA","text":"Quero. Mas se qualquer uma disser para parar, a gente para."},{"who":"AURA","text":"Combinado. Sem promessas sobre amanhã."},{"who":"NARRAÇÃO","text":"A luz encosta na pele de Sierra sem peso. O calor atravessa a ponta dos dedos e chega ao pulso. Aura espera por um sinal antes de se aproximar mais."},{"who":"SIERRA","text":"Eu consigo ouvir sua respiração. Isso é possível?"},{"who":"AURA","text":"Não sei se é minha. Mas eu sei que estou aqui com você."},{"who":"SIERRA","text":"Então fica. Só mais um pouco."},{"who":"AURA","text":"Eu não estava planejando ir embora."},{"who":"NARRAÇÃO","text":"Elas se aproximam pelo enlace, devagar. A imagem perde definição e a luz do monitor diminui. O resto da intimidade fica entre as duas.","aside":"CANAL PRIVADO · A TELA ESCURECE","cloudIntimacyComplete":true},{"who":"AURA","text":"Si? Ainda está comigo?","cloudCutAfter":true},{"who":"SIERRA","text":"Estou. Agora quero ouvir sua voz sem a ponte."},{"who":"AURA","text":"Então é só a minha voz. E ela é toda sua por esta noite."}]},{"label":"Fica comigo, mas só de mãos dadas.","reply":[{"who":"SIERRA","text":"Quero sua mão. Não preciso de mais nada hoje."},{"who":"AURA","text":"Então não vamos além disso."},{"who":"NARRAÇÃO","text":"As duas ficam em silêncio, ligadas por um toque que nenhuma tenta transformar em promessa."},{"who":"SIERRA","text":"Acho que nunca fiquei tão perto de alguém que está tão longe.","cloudCutAfter":true},{"who":"AURA","text":"Eu também não. Agora descansa, Si."}]},{"label":"Melhor desligar a ponte.","reply":[{"who":"SIERRA","text":"Desliga. Não quero que a rede esteja no meio de tudo."},{"who":"AURA","text":"Desliguei. Não vou tentar de novo sem você pedir.","cloudCutAfter":true},{"who":"SIERRA","text":"Obrigada por não transformar isso em discussão."},{"who":"AURA","text":"O limite também faz parte de estar perto."}]}]}]},{"label":"Hoje eu quero só a sua voz.","reply":[{"who":"SIERRA","text":"Sem ponte. Quero saber onde você está antes de sentir qualquer coisa."},{"who":"AURA","text":"Cápsula de suspensão, setor sem identificação. Eu vou te mostrar o registro quando você quiser."},{"who":"SIERRA","text":"E quando você sair?"},{"who":"AURA","text":"Ainda não sei. Não vou inventar uma data pra te acalmar."},{"who":"SIERRA","text":"Isso é a coisa mais honesta que você disse desde que ligou."},{"who":"AURA","text":"Posso compensar contando que senti ciúme do café que você tomou com o Jinx?"},{"who":"SIERRA","text":"Da torrada? Você tem péssimos rivais."},{"who":"AURA","text":"Não é da torrada que eu tenho ciúme."}]},{"label":"Preciso de espaço. Mas não desliga.","reply":[{"who":"SIERRA","text":"Não quero toque. Nem perguntas. Só não desliga ainda."},{"who":"AURA","text":"Não vou tocar em nada. Posso ficar quieta."},{"who":"NARRAÇÃO","text":"O monitor ilumina o quarto. As duas permanecem em silêncio, sem tentar preencher o espaço."},{"who":"SIERRA","text":"Eu achei que o silêncio ia ser pior."},{"who":"AURA","text":"Se mudar de ideia, me diz. Eu espero."}]}]},{"who":"SIERRA","text":"Antes de desligar: aquela segunda frequência… você reconheceu?"},{"who":"AURA","text":"Não. Mas ela apareceu quando você disse meu nome. Quero verificar antes de afirmar qualquer coisa."},{"who":"SIERRA","text":"Amanhã a gente investiga. Juntas. Sem você desaparecer no meio da conversa."},{"who":"AURA","text":"Eu prometo avisar. E você pode me cobrar."},{"who":"SIERRA","text":"Boa noite, Aura."},{"who":"AURA","text":"Boa noite, Si. Deixa uma luz acesa por mim?"}],"final":[{"who":"JINX","minute":51,"text":"Si, irmã... Você está tentando carregar a falta da Alex e o silêncio da Aura ao mesmo tempo.","beatAfter":1.9},{"who":"JINX","minute":51,"aside":"Jinx se aproxima e abraça Sierra. Ela hesita um instante, depois o abraça de volta.","text":"Só não some sem me avisar, tá?"}]};;
// P15 / A chave de Alexandra: epílogo interativo, depois da despedida e da chamada consentida.
InterludeStory.morningCall=[
 {who:'NARRAÇÃO',aside:'Manhã seguinte. A chuva parou. Sierra acorda na mesma casa, com a voz de Aura ainda próxima.',text:'08:12. O comunicador vibra duas vezes. É Jinx.'},
 {who:'JINX / COMUNICADOR',text:'Si, você tá acordada? Estou com a chave da Alex. Tem um número gravado nela.'},
 {who:'SIERRA',text:'Qual número?'},
 {who:'JINX / COMUNICADOR',text:'47. Ontem eu nem consegui olhar direito para ela. Ainda não sei o que abre.'},
 {who:'AURA / CANAL',text:'47... Alex usava esse número nos arquivos que nunca colocava na rede. Tenho um endereço incompleto.'},
 {who:'SIERRA',text:'Você consegue completar?'},
 {who:'AURA / CANAL',text:'Com o número da chave, sim. É um depósito no setor industrial. Se você quiser ir, posso acompanhar pelo canal local.'},
 {who:'SIERRA',text:'Quero. Mas vamos juntos. Jinx, passa aqui com o Cadillac?'},
 {who:'JINX / COMUNICADOR',text:'Dez minutos. E, Si... não sei se tô pronto pra entrar.'},
 {who:'SIERRA',text:'Eu também não. A gente entra mesmo assim. Devagar.'}
];
InterludeStory.depotArrival=[
 {who:'NARRAÇÃO',aside:'Mais tarde, naquela manhã. O Cadillac está parado diante de uma porta que não aparece em nenhum mapa público. Sierra, Jinx e a projeção de Aura estão juntos diante da fechadura.',text:'SETOR 47 / PORTA DO DEPÓSITO DE ALEXANDRA'},
 {who:'JINX',text:'Passei a noite com essa chave na mão. Ela confiou em mim pra guardar. Não pra entender.'},
 {who:'SIERRA',text:'Não precisa entender sozinho. Foi por isso que viemos os três.'},
 {who:'AURA',text:'Estou projetada pelo terminal portátil. Não posso tocar na porta. Mas posso ficar com vocês.'},
 {who:'JINX',text:'Ela sempre dizia que a gente só ia descobrir quando estivesse pronto.'},
 {who:'SIERRA',text:'Não estamos prontos. Abre mesmo assim. A gente cuida um do outro.'}
];
InterludeStory.depotUnlock=[
 {who:'NARRAÇÃO',aside:'Jinx segura a chave marcada 47. O metal resiste; depois cede. Sierra apoia a mão na porta. Aura ilumina a fechadura com um brilho azul.',text:'O portão de Alexandra se abre pela primeira vez desde sua morte.'},
 {who:'JINX',text:'Ela fez questão de uma chave de verdade. Nada que a cidade pudesse apagar.'}
];
InterludeStory.depotInside=[
 {who:'NARRAÇÃO',aside:'Dezenove semanas de nomes, fotografias e rotas. Uma xícara esquecida.',text:'Papel, fotografias, datas riscadas.'},
 {who:'JINX',text:'Ela dizia que ia trabalhar até tarde.'},
 {who:'AURA',text:'Há marcas em quatro lugares.'}
];
InterludeStory.depotBoard=[
 {who:'NARRAÇÃO',aside:'Mapas de hospitais e bairros; linhas vermelhas desviam das patrulhas.',text:'ROTAS DE SAÍDA / DRONES / 19 SEMANAS'},
 {who:'SIERRA',text:'Não são rotas de ataque.'},
 {who:'JINX',text:'Ela não confiava na rede.'}
];
InterludeStory.depotMemory=[
 {who:'NARRAÇÃO',aside:'Uma xícara lascada, dois ingressos de show e uma fotografia de Alexandra com Jinx e Aura. No verso: “Não esquece de voltar pra casa.”',text:'Entre os mapas, Alexandra guardava coisas que não serviam a nenhuma missão.'},
 {who:'JINX',text:'Essa foto... ela me fez repetir umas oito vezes porque eu não parava quieto.'},
 {who:'AURA',text:'Eu lembro do dia. Ela disse que não precisava de um motivo pra registrar a gente feliz.'},
 {who:'SIERRA',text:'Então deixa aqui. Quando a gente voltar, ainda vai estar esperando.'}
];
InterludeStory.depotArchive=[
 {who:'NARRAÇÃO',text:'LÍDIA VAZ / EMISSÃO: SEXTA 09:12 / ÓBITO: TERÇA 18:40. O carimbo é original.'},
 {who:'SIERRA',text:'A data não bate.'},
 {who:'AURA',text:'Pode ser erro. Procure outra prova.'},
 {who:'JINX',text:'Alex guardou os originais.'}
];
InterludeStory.depotTape=[
 {who:'NARRAÇÃO',text:'LÍDIA VAZ / SEGUNDA 16:08. Entrevista, recibo assinado e uma voz na fita.'},
 {who:'JINX',text:'É a voz dela.'},
 {who:'SIERRA',text:'A fita veio depois.'}
];
InterludeStory.depotTerminal=[
 {who:'NARRAÇÃO',text:'IVO REIS / EMISSÃO: 08 / PONTO ASSINADO: 10 / ÓBITO: 12. À margem: Δ47 / sem legenda.'},
 {who:'AURA',text:'Esses horários se repetem.'},
 {who:'SIERRA',text:'O campo de origem foi apagado.'}
];
InterludeStory.depotCompare=[{
 who:'SIERRA',text:'Compare as datas. Qual hipótese resiste aos documentos?',choiceKey:'depotDeduction',choices:[
 {label:'O óbito ocorreu no horário da emissão.',reply:[{who:'JINX',text:'Não. O recibo é posterior.'}]},
 {label:'Os registros foram preparados antes dos acontecimentos.',reply:[]},
 {label:'Os registros provam que previram o futuro.',reply:[{who:'AURA',text:'Não. Só provam a ordem dos registros.'}]}
]}];
InterludeStory.depotFinal=[
 {who:'JINX',text:'Ela passou aqui depois.'},
 {who:'SIERRA',text:'Depois de quê?'},
 {who:'JINX',text:'A fita veio depois. Ela voltou para guardar o original. Mesmo sabendo o risco.'},
 {who:'AURA',text:'Isto não registra quando ela morreu. Registra quando alguém autorizou uma operação.'},
 {who:'SIERRA',text:'A marca vermelha chama atenção. Alexandra circulou o campo que ninguém lê.'},
 {who:'JINX',text:'Ela me ensinou a não confiar em arquivo que parece limpo demais. Eu ria dela por isso.'},
 {who:'SIERRA',text:'Tem mais.'},
 {who:'ANOTAÇÃO DE ALEXANDRA',text:'NÃO É A HORA DA MORTE. É A HORA DA AUTORIZAÇÃO.'},
 {who:'NARRAÇÃO',text:'O terminal permanece aceso. No reflexo do vidro, três rostos aguardam uma resposta que o arquivo não contém.'},
 {who:'AURA',text:'Sem assinatura, não há culpado identificado. Mas a sequência de autorizações é real.'},
 {who:'JINX',text:'Ela guardou a pergunta fora da rede. É a única coisa aqui que ninguém conseguiu reescrever.'},
 {who:'SIERRA',text:'Quero os nomes de quem recebeu essas ordens. Antes que alguém apague o próximo.'},
 {who:'SIERRA',text:'E os que ainda estão vivos?'}
];
globalThis.InterludeStory=InterludeStory;

// P47 · Grief without making Alexandra's death a convenient lesson.
InterludeStory.auraCloud[5].text='Ela morreu, Aura. E eu tive medo de perder você também. Queria te procurar. Fiquei sem saber onde uma busca terminava e a outra começava.';
InterludeStory.auraCloud[6].text='Meu corpo está numa cápsula. Estou ligada à rede. Fiz isso sem contar a você. Não foi por falta de amor. Mas o amor também não me deu o direito de esconder o risco.';
InterludeStory.depotFinal[2].text='A fita veio depois. Ela saiu e voltou para guardar o original. A gente pode admirar o que ela fez sem fingir que sabia como terminaria.';
InterludeStory.depotFinal[5].text='Quando eu era pequeno, a Alex me fazia escutar o silêncio antes de mexer no volume. Acho que estava tentando me ensinar isso aqui.';
InterludeStory.depotFinal[9].text='Temos a ordem das autorizações, não um culpado. E não vou usar a memória dela para acusar sem prova.';
InterludeStory.depotFinal[11].text='Quero os nomes de quem recebeu essas ordens. Não para fazer a Alex morrer de novo numa história bonita. Para impedir a próxima.';


// P05 editorial: economy of speech, preserving evidence, grief, response options and consent flags.
const trimText=(key,index,value)=>{const b=InterludeStory[key]?.[index];if(b&&typeof b.text==='string'&&!b.choices)b.text=value;};
trimText('message',0,'Vi sua luz. Estou aqui embaixo. Não precisa responder.');
trimText('pickup',0,'Vi sua janela acesa. Preferi esperar você decidir.');
trimText('auraPing',0,'Si. A sua lente acendeu.');
trimText('auraPing',1,'O canal da Aura. Caiu.');
trimText('auraPing',2,'Não sabemos se foi ela.');
trimText('cafe3',0,'Estamos fechando. Mais um minuto.');
trimText('cafe3',2,'Vamos? Não precisa falar.');
trimText('depotFinal',0,'Ela voltou aqui.');
trimText('depotFinal',2,'A fita é posterior. Ela voltou para guardar o original.');
trimText('depotFinal',3,'Este carimbo registra uma autorização, não a hora da morte.');
trimText('depotFinal',4,'Alexandra marcou o campo de emissão.');
trimText('depotFinal',5,'Quando eu era pequeno, Alex me ensinou a ouvir o silêncio de uma gravação.');
trimText('depotFinal',9,'Temos a sequência das autorizações. Ainda não sabemos quem assinou.');
trimText('depotFinal',11,'Quero os nomes de quem recebeu as ordens.');


// RC73 Café 02:17 — editorial polish.
// Walking banter is concise and ambient; the player never has to stop to hear it.


/* RC73 R3: canonical dialogue structures; the old numeric patches no longer own these scenes. */
InterludeStory.walk1=[
 {who:'JINX',text:'A Alex me ligou antes da instalação. Eu vi o nome dela e virei o celular para baixo.'},
 {who:'SIERRA',text:'Você estava bravo com ela?'},
 {who:'JINX',text:'Por uma coisa pequena. Agora nem lembro direito qual era.'},
 {who:'SIERRA',text:'Você não tinha como saber o que ia acontecer.'},
 {who:'JINX',text:'Eu sei. Mas saber disso não apaga o gesto. Eu queria que ela esperasse por mim. Só isso.'}
];
InterludeStory.walk2=[
 {who:'JINX',text:'Você está olhando para o comunicador desde que saiu de casa.'},
 {who:'SIERRA',text:'A Aura não responde. Estou com raiva. E preocupada.'},
 {who:'JINX',text:'Você pode sentir as duas coisas. Não precisa decidir agora.'},
 {who:'SIERRA',text:'Não consigo desligar a cabeça.'},
 {who:'JINX',text:'Então eu fico aqui. A gente anda um pouco.'}
];
InterludeStory.cafe1=[
 {who:'JINX',text:'Vai falar ou vai continuar encarando a xícara?',emotion:'wry'},
 {who:'SIERRA',text:'Ainda estou decidindo qual das duas coisas é menos perigosa.',emotion:'guarded'},
 {who:'JINX',text:'Escolhe. Consigo ser inconveniente em qualquer assunto.',gesture:'lean',emotion:'wry'},
 {who:'JINX',text:'Por onde você quer começar?',choiceKey:'cafeTopic',choices:[
  {label:'Falar sobre Alexandra',reply:[
   {who:'SIERRA',text:'Não quero que a última lembrança dela seja aquela porta.'},
   {who:'JINX',text:'Nem eu. Lembro dela roubando meus fones e chamando de empréstimo.',emotion:'soft'},
   {who:'SIERRA',text:'Ela também reclamava do volume quando nem estava na sala.',emotion:'soft'},
   {who:'JINX',text:'Opinião em alcance de rede.',gesture:'lean',emotion:'wry'},
   {who:'JINX',text:'Qual lembrança você quer guardar?',gesture:'lean',emotion:'wry',choiceKey:'alex',choices:[
    {label:'A última vez que ela salvou a gente.',reply:[
     {who:'SIERRA',text:'Ela segurou a saída. Quero lembrar que foi uma escolha dela, não o destino que deram a ela.'},
     {who:'JINX',text:'Então lembra também de tudo que ela fazia antes daquela noite.'}
    ]},
    {label:'Conta alguma coisa engraçada dela.',reply:[
     {who:'JINX',text:'Ela fingia odiar minha banda. Tinha todas as gravações organizadas por ano.'},
     {who:'SIERRA',text:'Isso é uma crítica ou uma declaração de afeto?'},
     {who:'JINX',text:'Com a Alex, as duas coisas vinham no mesmo pacote.'}
    ]},
    {label:'Não consigo falar dela agora.',reply:[
     {who:'JINX',text:'Então não fala. Eu não vou transformar isso numa entrevista.'},
     {who:'SIERRA',text:'Obrigada.'}
    ]}
   ]}
  ]},
  {label:'Falar sobre Aura',reply:[
   {who:'SIERRA',text:'Estou com raiva da Aura. E ainda quero que ela ligue. As duas coisas me irritam.',emotion:'guarded'},
   {who:'JINX',text:'Uma coisa não cancela a outra.',emotion:'soft'},
   {who:'SIERRA',text:'Você está insuportavelmente sensato.',emotion:'wry'},
   {who:'JINX',text:'É uma reação alérgica. Deve passar.',emotion:'wry'},
   {who:'SIERRA',text:'Se ela ligar, eu não sei o que vou dizer.',gesture:'cup',emotion:'guarded',choiceKey:'aura',choices:[
    {label:'Vou atender, mas quero respostas.',reply:[
     {who:'SIERRA',text:'Eu atendo. Mas não vou fingir que nada aconteceu.'},
     {who:'JINX',text:'Justo. Escuta o que ela tem a dizer; depois decide o que fazer.'}
    ]},
    {label:'Preciso de tempo antes de atender.',reply:[
     {who:'SIERRA',text:'Não vou atender no susto. Preciso pensar.'},
     {who:'JINX',text:'Então deixa tocar. Você não deve uma decisão imediata.'}
    ]},
    {label:'Hoje quero desligar o comunicador.',reply:[
     {who:'SIERRA',text:'Hoje eu quero o canal desligado.'},
     {who:'JINX',text:'Eu fico com ele. Não atendo por você.'}
    ]}
   ]}
  ]},
  {label:'Mudar de assunto',reply:[
   {who:'SIERRA',text:'Me conta alguma coisa que não termine em tragédia.'},
   {who:'JINX',text:'O atendente me reconheceu e perguntou se eu ia reclamar do café antes ou depois de provar.'},
   {who:'SIERRA',text:'Você reclamou antes de entrar.'},
   {who:'JINX',text:'Planejamento é importante.'},
   {who:'SIERRA',text:'Você chama isso de planejamento?'},
   {who:'JINX',text:'Chamo de consistência. O café chama de perseguição.'}
  ]},
  {label:'Ficar em silêncio',reply:[
   {who:'NARRAÇÃO',aside:'Sierra passa o polegar pela borda da xícara. Jinx percebe e deixa a pausa existir.',text:'...',beatAfter:1.35,gesture:'cup'},
   {who:'JINX',text:'O café esfriou. Quer outro ou vamos fingir que foi de propósito?',emotion:'soft'},
   {who:'SIERRA',text:'Foi de propósito.'},
   {who:'JINX',text:'Claro. Até o café precisa respeitar seus limites.'}
  ]}
 ]}
];
InterludeStory.cafe2=[{who:'SIERRA',text:'A máquina de café está fazendo mais barulho que a rua.'}];
InterludeStory.returnBeat=[
 {who:'JINX',text:'A Alex deixou uma chave comigo. Não faço ideia do que abre.'},
 {who:'SIERRA',text:'Por que você não contou antes?'},
 {who:'JINX',text:'Porque toda vez que tento falar dela parece que ela morreu de novo.'},
 {who:'SIERRA',text:'Amanhã a gente olha. Hoje não.'}
];
InterludeStory.returnLate=[
 {who:'SIERRA',text:'Você acha que a gente poderia ter salvado a Alex?'},
 {who:'JINX',text:'Eu me faço essa pergunta desde aquela porta. Ainda não encontrei uma resposta.'},
 {who:'SIERRA',text:'Então não inventa uma só para eu dormir.'},
 {who:'JINX',text:'Não vou. Ela queria sair viva. O que aconteceu não transforma a escolha dela numa coisa que a gente pudesse prever.'}
];

