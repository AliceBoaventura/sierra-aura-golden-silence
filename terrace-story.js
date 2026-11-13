(function(root){
const beats=[
{title:'Uma casa acima do ruído',aside:'Depois do último relé, Sierra convidou Aura a subir. O terminal ficou desligado na mesa.',line:'Você conserta tudo aqui sozinha? Agora entendi por que reclamou da minha bancada. Prometo não fazer uma auditoria da sua casa… pelo menos hoje.',choices:[
['Só parece. Mas hoje eu queria que você visse isso comigo.','Aura guarda o terminal no bolso. — Fechado. Só quero saber como você aprendeu a fazer café tão ruim sem queimar a cozinha.', 'close'],
['Não costumo trazer ninguém aqui.','— É a primeira vez que você me diz isso sem estar olhando para uma câmera. Obrigada por me deixar subir.','close'],
['Escolhi pela saída de emergência. As estrelas vieram de brinde.','Aura ri, sem levantar a voz. — Você acabou de transformar um encontro numa rota de fuga. Impressionante.','guard']]},
{title:'Luz que chega depois',aside:'Uma estrela atravessa uma faixa de nuvens. Aura aponta; Sierra acompanha o gesto.',line:'Algumas dessas luzes começaram a viajar antes de qualquer uma de nós existir. A fonte pode ter acabado, e a luz continua chegando. Você acha bonito ou assustador?',choices:[
['Bonito. Mas eu preferia que a fonte ainda estivesse viva.','— Você sempre procura quem ficou para trás. Até quando a gente está falando de estrelas.','close'],
['Um sinal continuar não significa que alguém ainda esteja lá.','Aura abaixa a mão. — Eu sei. É justamente essa diferença que não consigo tirar da cabeça.','identity'],
['Depende. Você está falando do céu ou tentando me contar alguma coisa?','— De uma coisa que não sei explicar direito. Prefiro tentar sem te empurrar uma resposta.','guard']]},
{title:'O corpo e a nuvem',aside:'O sorriso de Aura desaparece quando ela finalmente fala do seu plano.',line:'Quero congelar meu corpo. Preservá-lo em suspensão e codar minha mente na nuvem. Não um assistente com a minha voz. Eu, dentro da rede. Acho que é o único jeito de chegar ao núcleo da IA.',choices:[
['Ainda estamos nos conhecendo. Você percebe que está me contando uma possível despedida?' ,'— Até você falar assim, eu tinha chamado de transição. Aura olha para a própria mão. — É uma palavra conveniente quando não se está do outro lado esperando.','close'],
['Codar uma mente não prova que a consciência atravessou.','— Não prova. Posso testar cada lembrança, cada resposta. Mas como é que eu testo quem acordou?','identity'],
['Há quanto tempo você está planejando isso sem contar a ninguém?','— A arquitetura, há meses. A decisão, ainda não tomei. Eu ainda não contei isso direito para ninguém.','guard']]},
{title:'Entrar onde ela vive',aside:'Ao fundo, a torre central recorta o céu. Sierra aperta o parapeito, tentando separar o medo de perder Aura dos riscos do plano.',line:'Derrubamos três relés e ela já começou a reconstruir as rotas. De fora, estaremos sempre correndo atrás. Se eu existir onde ela existe, posso encontrar o núcleo que coordena tudo.',choices:[
['E se ela usar você como mais uma peça dela?','— Essa é a falha que mais me assusta. Preciso de isolamento e de uma saída independente. Se eu não puder sair, não é liberdade. É só outra cela.','identity'],
['Não vou trocar uma inteligência que manda na cidade por outra. Nem por você.','Aura sustenta o olhar. — Nem eu quero isso. Se o plano terminar comigo governando alguém, nós teremos errado antes da última linha.','guard'],
['Eu entendo por que você quer tentar. Não sei se consigo aceitar o custo.','— Você não precisa gostar do preço para entender a causa. Mas também não quero que a causa me sirva de desculpa para ignorar você.','close']]},
{title:'Quem acorda?',aside:'Sierra ouve antes de responder. A pergunta não cabe em código.',line:'Se uma mente digital lembrar do meu pai, reconhecer sua voz e repetir esta conversa… o que provaria que ainda sou eu? Não quero pedir que você decida isso por mim.',choices:[
['Eu reconheceria o que sinto. Isso não resolveria o que aconteceu com você.','Aura respira antes de responder. — Então não vamos usar o nosso sentimento como prova de algo que ainda não sabemos.','identity'],
['Eu ia querer acreditar. É por isso que tenho medo de ser enganada.','— Até por uma cópia perfeita de mim. Aura olha para as próprias mãos. — Eu não tinha pensado no que estaria pedindo de você depois.','close'],
['E se a cópia acordar, quem protege a Aura que ficou no corpo?' ,'— Ninguém, se eu não pensar nisso agora. Guardar meu corpo não adianta se eu não tiver como voltar. E hoje eu não sei se teria.','guard']]},
{title:'Não me transforme em despedida',aside:'O polegar de Aura roça a mão de Sierra sobre o metal frio. Nenhuma das duas faz do toque uma resposta automática.',line:'Eu quero viver num mundo em que a gente não precise roubar noites como esta. Quero uma oficina. Quero voltar para algum lugar. Mas tenho medo de ficar esperando até não haver mais ninguém para salvar.',choices:[
['Eu quero que você volte para cá. Isso me torna parcial. Não me torna cega.','— Eu sei. Aura entrelaça os dedos nos dela, devagar. — Sua vontade de me ter aqui não diminui sua capacidade de enxergar.','close'],
['Estar com medo do tempo não torna uma decisão irreversível mais segura.','— Não. Só a torna mais urgente dentro da minha cabeça. Você pode me lembrar dessa diferença quando eu tentar apagar ela.','identity'],
['Não me ofereça uma cidade livre como compensação por perder você.','Aura fica séria. — Não quero que você me agradeça por uma coisa que nem sei se preciso fazer. Muito menos que aceite me perder.','guard']]},
{title:'Limites antes de promessas',aside:'O plano deixa de parecer inevitável quando Sierra exige limites.',line:'O que você precisaria ver para continuar essa conversa comigo? Não para concordar. Para eu saber que não estou me fechando dentro da minha própria ideia.',choices:[
['Um teste reversível. Sem congelar você, sem cortar o caminho de volta.','— Primeiro uma simulação isolada. Com critérios que possam reprovar o projeto. Se eu não aceitar um resultado ruim, não estou fazendo um teste.','identity'],
['Uma alternativa em que a gente lute juntas sem apagar ninguém.','— Vamos procurar. E comparar de verdade, sem eu sabotar as outras opções só porque fui eu que desenhei a primeira.','close'],
['Poder discordar do plano sem precisar justificar o que sinto por você.','— Pode dizer não. Não é uma prova, Sierra. Se eu usar o que sente por mim para ganhar essa discussão, já perdi o direito de pedir que confie em mim.','guard']]},
{title:'Esta noite ainda é nossa',aside:'Por um instante, o futuro pode esperar.',line:'Então não me dê uma resposta só para me acalmar. O que fica entre nós quando esta noite terminar?',choices:[
['Fica mais um pouco. Amanhã a gente conversa sobre as outras saídas.','Aura encosta a testa na dela. — Hoje eu fico. Amanhã eu não escondo de você o que ainda quero tentar.','stay'],
['Eu estudo o plano com você. Mas ainda não concordo em perder seu corpo.','— Você não concordou. Eu ouvi. Vamos começar pelo que pode falhar, não pelo final que eu quero ver.','study'],
['Eu quero ficar com você. E esse plano, desse jeito, me assusta. Não vou fingir que uma coisa cancela a outra.','Aura fecha os olhos por um instante. — Vai doer discordar de você. Eu prefiro isso a fazer você mentir para continuar perto.','refuse']]}
];
beats.push(
{title:'Antes que você vire ausência',aside:'Nenhuma das duas tenta encerrar a noite primeiro.',line:'A gente nem sabe onde vai estar amanhã. Mas eu queria muito te beijar agora. Você quer?',choices:[
['Pode. Eu estava tentando encontrar coragem para pedir.','Sierra se aproxima primeiro. Aura encontra o beijo no meio do caminho. Quando se separam, continuam com as testas encostadas, sem pressa de devolver palavras ao silêncio.','kiss'],
['Sim. Mas não quero chamar isso de último beijo.','— Então não chama. Aura beija Sierra com cuidado. Por alguns instantes, a possibilidade da despedida não desaparece; apenas deixa de ocupar todo o espaço entre elas.','kiss'],
['Quero ficar perto, mas prefiro esperar para beijar.','Aura segura a mão de Sierra. — Tudo bem. Eu prefiro estar aqui e ser ouvida a transformar um beijo em compromisso.','wait']]},
{title:'A noite que ainda tem um corpo',aside:'Sierra pode convidar Aura a ficar, sem transformar a proximidade em consentimento presumido.',line:'Eu gostaria de ficar. Mas só se você quiser. A gente pode conversar, dormir, ou cada uma ir para casa. O que você prefere?',choices:[
['Quero você comigo esta noite. Quero que a gente se aproxime, se você também quiser.','Aura pergunta se Sierra tem certeza. Sierra confirma. Elas se beijam, entram juntas e fecham a porta. O restante da noite pertence às duas, longe da cidade e das câmeras.','sex'],
['Quero dormir com você por perto. Só dormir.','— Então só dormir. Aura deixa o terminal na sala. Elas conversam mais um pouco e adormecem lado a lado.','rest'],
['Quero te ver de novo, mas hoje prefiro ficar sozinha.','— Tudo bem. Aura veste o casaco. Na porta, combinam um horário para conversar no dia seguinte.','leave']]}

);

beats.splice(beats.findIndex(b=>b.title==='Antes que você vire ausência'),0,
{title:'O espelho do outro lado',aside:'Sierra olha para Aura. É estranho sentir tanta intimidade com alguém que acabou de conhecer.',line:'Você ficou quieta de novo. Quer me contar para onde foi?',choices:[
['Estava pensando em como você me entende. Parece que estou olhando para um espelho.','Aura toca de leve os dedos de Sierra. — Também sinto isso. Às vezes você diz uma coisa que eu passei anos tentando explicar para mim mesma.','close'],
['Como é que você parece tão familiar se eu ainda tenho tanta coisa para descobrir sobre você?','— Não sei. Mas não quero usar essa sensação para pular o que ainda falta. Quero te conhecer até nas partes que não se parecem comigo.','identity'],
['Você é o meu reflexo quando eu paro de me esconder. Acho que isso me assusta.','Aura demora um pouco a responder. — E você é o meu quando eu paro de correr. Não precisa deixar de ter medo para continuar aqui comigo.','close']]}
);

beats.push({title:'O rosto do outro lado',aside:'No sonho, a casa está destruída. No único espelho intacto, Sierra vê o rosto de Aura.',line:'Você viu meu rosto antes de me encontrar. Como eu sei que foi um aviso e não uma armadilha?',choices:[
['Não sei se conheço você ou se a rede quer que eu acredite nisso.','O reflexo sorri com uma tristeza que Sierra reconhece sem saber de onde. — Talvez a gente tenha chegado uma à outra antes de saber o caminho. No sonho, a frase soa como lembrança.','close'],
['Se você é o meu reflexo, onde termino eu e começa você?','Aura mantém a mão sobre a dela, do outro lado do vidro. — Não precisa desaparecer para me encontrar. O espelho devolve por um instante os olhos de Sierra dentro do rosto de Aura.','identity'],
['Amanhã eu vou perguntar se você sonhou também. Sem deixar a rede responder por nós.','— Então acorda. A voz já não parece vir do vidro. Sierra sente uma mão procurar a sua, e a superfície do espelho se desfaz em luz.','close']]});

beats.push({title:'O quarto ainda existe',speaker:'SIERRA / DESPERTAR',aside:'Sierra acorda assustada. Aura dorme ao lado dela. O quarto está inteiro.',line:'O quarto está inteiro. Por que o sonho parecia uma lembrança?',choices:[
['Aura… acorda um instante. Eu sonhei que tinha perdido tudo.','Aura desperta devagar e procura sua mão. — Estou aqui. Sierra conta do apartamento em ruínas e do rosto no espelho. Aura escuta sem chamar aquilo de bobagem nem de profecia.','wake'],
['[Tocar com cuidado o rosto de Aura, sem acordá-la.]','Desta vez não há vidro. Sierra sente o calor do rosto de Aura sob os dedos e retira a mão devagar para deixá-la dormir. O susto ainda está ali, mas o quarto não está destruído e Aura não é um reflexo.','wake'],
['[Deitar perto dela e guardar o sonho até amanhecer.]','Sierra volta a se deitar. Aura se move no sono e se aproxima, sem despertar. Sierra fica olhando o quarto intacto por mais algum tempo. Contará o sonho quando houver luz.','wake']]});

// Keep the philosophical question and the refusal, but avoid asking the same
// “I may disappear” question in three consecutive scenes.
for(const title of ['Entrar onde ela vive','Não me transforme em despedida']){
 const idx=beats.findIndex(b=>b.title===title);
 if(idx>=0)beats.splice(idx,1);
}
// Uma noite romântica não precisa repetir a mesma discussão técnica.
for(const title of ['Luz que chega depois','Quem acorda?']){
 const idx=beats.findIndex(b=>b.title===title);if(idx>=0)beats.splice(idx,1);
}
const arrival=beats.find(b=>b.title==='Uma casa acima do ruído');
if(arrival){arrival.aside='Aura chega ao terraço. Há duas cadeiras e um cobertor.';arrival.line='Você deixou o cobertor para mim ou é algum teste de hospitalidade?';arrival.choices=[
 ['Para você. Eu aguento o frio.','— Mentira. Sua mão está gelada. Aura divide o cobertor sem esperar uma desculpa.','close'],
 ['Depende. Vai ficar para ver o nascer do sol?','— Se você quiser companhia até lá, eu fico. Aura senta bem perto.','close'],
 ['Foi a Mei que escolheu. Eu só obedeço.','— Finalmente alguém sensato nesta casa. Aura ri e encosta o ombro no de Sierra.','close']];}
const fear=beats.find(b=>b.title==='O corpo e a nuvem');
if(fear){fear.aside='Aura fica séria. Há algo que ela ainda não contou.';fear.line='Tem uma sala de suspensão esperando por mim. Não assinei nada. Ainda.';fear.choices=[
 ['Você já escolheu uma data?','— Não. Aura passa o polegar pela borda do copo. — Mas já sei o número da sala. Isso me assusta mais do que deveria.','close'],
 ['E quem garante que você volta?','Aura procura uma resposta na cidade lá embaixo. — Ninguém. Por isso ainda estou aqui, com o corpo inteiro e uma escolha por fazer.','identity'],
 ['Você ia me deixar descobrir por um arquivo?','— Não. Aura tira um cartão de acesso do bolso, mas não entrega. — Trouxe isso para te contar. Não para pedir permissão.','guard']];}
const mirror=beats.find(b=>b.title==='O espelho do outro lado');
if(mirror){mirror.line='Você ouviu? A cidade inteira apagou por um segundo. Até o letreiro da esquina.';mirror.choices=[
 ['Eu ouvi. Fica aqui até a luz voltar.','— Estou aqui. Aura encontra a mão de Sierra sem tirar os olhos da rua.','close'],
 ['Foi uma queda de energia ou alguém desligou a quadra?','— Se foi alguém, soube escolher a hora. Aura deixa o terminal virado para baixo.','identity'],
 ['Você está tremendo. Não é por causa do frio.','— Não. Aura respira fundo. — Não queria que você percebesse antes de eu conseguir dizer.','guard']];}
const mirrorBeat=beats.find(b=>b.title==='O espelho do outro lado');
if(mirrorBeat)mirrorBeat.aside='Por um momento, as duas ficam quietas.';

// Conversas cotidianas: humor e pequenos gestos antes das decisões irreversíveis.
const everyday=[
 {title:'Uma coisa boba',aside:'O vento leva um guardanapo. Sierra o segura antes que caia na rua.',line:'Eu ensaiei o que ia dizer quando você chegasse. Esqueci tudo na hora.',choices:[
 ['Ainda dá tempo de inventar alguma coisa.', 'Aura ri. — Então: oi, Sierra. Você tem um terraço bonito e uma péssima cara de quem dormiu pouco.', 'close'],
 ['Eu também estava nervosa.', '— Ainda bem. Achei que fosse só eu. Aura encosta o ombro no de Sierra.', 'close'],
 ['Não precisa fazer discurso. Senta aqui.', 'Aura senta. O silêncio dura um pouco e não incomoda nenhuma das duas.', 'identity']]},
 {title:'A música da rua',aside:'Lá embaixo, alguém toca uma música antiga no rádio de uma janela.',line:'Essa música é terrível. Eu adoro.',choices:[
 ['Você tem um gosto musical duvidoso.', '— E você já roubou a melhor cadeira. Aura tenta cantar o refrão, troca duas palavras e ri antes de terminar.', 'close'],
 ['Quer dançar?', 'Aura olha ao redor. — Aqui? Sierra estende a mão. — Aqui. As duas dão alguns passos desajeitados.', 'close'],
 ['Vamos ficar só ouvindo.', 'Aura se aproxima. As duas acompanham a música sem precisar dizer nada.', 'identity']]}
];
// P53: optionality is explicit; everyday tenderness precedes the irreversible choice.
const livedMoments=[
 {title:'O copo rachado',aside:'Aura segura a caneca pela alça quebrada. Sierra coloca outra ao lado, sem retirar a primeira.',line:'Você guardou uma caneca que não dá mais para usar. Por quê?',choices:[
 ['Porque ainda é minha.', 'Aura gira a caneca entre os dedos. — É uma resposta melhor do que eu esperava.', 'identity'],
 ['Porque foi alguém importante que me deu.', '— Não precisa contar quem. Aura encosta a caneca na nova, fazendo um som breve.', 'close'],
 ['Porque ainda não decidi se quero consertar.', '— Então não deixa ninguém jogar fora antes de você decidir. Aura deixa as duas canecas lado a lado.', 'guard']]},
 {title:'A mão que não se adianta',aside:'O vento esfria o terraço. Aura estende a mão, mas para a alguns centímetros da de Sierra.',line:'Posso?',choices:[
 ['Pode. Mas fica aqui um instante.', 'Aura entrelaça os dedos nos de Sierra. A cidade faz barulho lá embaixo. Nenhuma das duas olha.', 'close'],
 ['Agora não. Só senta comigo.', '— Tudo bem. Aura se senta perto o bastante para dividir a vista, sem encostar.', 'identity'],
 ['Você pode perguntar sempre.', '— Eu pretendo. Aura sorri e recolhe a mão, esperando que Sierra escolha o próximo gesto.', 'guard']]}
];
const livedPosition=beats.findIndex(b=>b.title==='O corpo e a nuvem');
if(livedPosition>=0)beats.splice(livedPosition,0,...livedMoments);
const firstSerious=beats.findIndex(b=>b.title==='O corpo e a nuvem');
if(firstSerious>=0)beats.splice(firstSerious,0,...everyday);
// P47 · Três maneiras diferentes de amar sem confundir cuidado com posse.
const loveScene={title:'Até onde você iria?',aside:'Aura dobra o cartão da sala de suspensão e o põe sobre a mesa. Sierra pode vê-lo, mas não o toca.',line:'Quando soube que podia entrar na rede, pensei primeiro em quem conseguiria tirar de lá. Só depois pensei em quem ficaria me esperando. Você teria coragem de me dizer quando eu passasse do limite?',choices:[
 ['Eu entraria com você, mas só depois de traçarmos uma saída para as duas.','Aura puxa a cadeira ao lado, não a da frente. — Então você não vai ser minha escolta. Vai ser minha parceira. Isso significa que pode me contrariar.','close','together'],
 ['Se você se colocar em perigo, eu vou tentar te impedir. Mesmo que fique com raiva de mim.','Aura retira a mão do cartão. — Pode me pedir para parar. Pode até ir embora. Só não transforme o meu medo em uma assinatura sua.','guard','intervene'],
 ['Quero ficar com você. Essa decisão é sua, mas preciso que me conte o que está acontecendo.','Aura encosta a palma na de Sierra. — Eu conto. Mesmo quando tiver medo do que você vai dizer.','identity','freedom']
 ]};
const lovePosition=beats.findIndex(b=>b.title==='Limites antes de promessas');
if(lovePosition>=0)beats.splice(lovePosition,0,loveScene);
// P05 editorial: fewer mandatory answers; preserve decision flags and the intimate consent path.
for(const title of ["Uma coisa boba", "A música da rua", "O copo rachado", "Esta noite ainda é nossa"]){const at=beats.findIndex(b=>b.title===title);if(at>=0)beats.splice(at,1);}
function create(){return {chapter:4,mode:'conversation',time:0,grounded:true,face:1,foot:0,vx:0,stage:'question',beat:0,chosen:null,answers:[],tone:{close:0,identity:0,guard:0},loveLine:null,ending:null,intimacy:false,sex:false,nightChoice:null,dream:false,awake:false,sky:false,events:[]};}
function choose(s,index){if(s.stage!=='question'||!Number.isInteger(index)||index<0||index>2)return false;
 const current=beatFor(s),c=current.choices[index];s.chosen=index;s.answers.push(index);
 // Choice timing: practical/personal promises are made after extraction, in person.
 if(s.beat===0){const intention=['research','personal','boundary'][index];s.auraPromise=intention;root.StoryContinuity?.record('auraPromise',intention);}
 if(current.title==='Limites antes de promessas'){
  const decision=['study','stay','refuse'][index];s.ending=decision;
  root.StoryContinuity?.record('terrace',decision);
 }
 // Keane's memory may be offered on the terrace, never under fire at the relays.
 if(current.title==='O rádio sob a chuva'){
  const consent=index===0?'deep':'limited';s.linkReciprocity=consent;
  root.StoryContinuity?.record('linkReciprocity',consent);
  root.StoryContinuity?.record('linkKeaneSignal',consent==='deep'?'revealed':'private');
  root.StoryContinuity?.record('linkTrust',consent==='deep'?'shared-memory':'respected-boundary');
 }
if(c[2] in s.tone)s.tone[c[2]]++;if(c[3]){s.loveLine=c[3];root.StoryContinuity?.record('loveLine',c[3]);}if(['stay','study','refuse'].includes(c[2])){s.ending=c[2];root.StoryContinuity?.record('terrace',c[2]);}if(c[2]==='kiss')s.intimacy=true;if(c[2]==='sex'){s.sex=true;s.intimacy=true;}if(['sex','rest','leave'].includes(c[2]))s.nightChoice=c[2];s.stage='response';return true;}
function advance(s){
 if(s.stage==='night'){s.beat++;s.chosen=null;s.stage='question';s.dream=true;return true;}
 if(s.stage!=='response')return false;
 const title=beats[s.beat]?.title;
 if(title==='A noite que ainda tem um corpo'){if(s.nightChoice==='leave'){s.stage='ending';s.mode='won';s.dream=false;return true;}s.stage='night';return true;}
 if(title==='O rosto do outro lado'){s.beat++;s.chosen=null;s.stage='question';s.dream=false;s.awake=true;return true;}
 if(s.beat===beats.length-1){s.stage='ending';s.mode='won';s.dream=false;return true;}
 s.beat++;s.chosen=null;s.stage='question';return true;
}
function ending(s){
 // End with a scene, not a recap of every variable the player touched.
 const night={
  sex:'Sierra acorda primeiro. Aura está ao seu lado, o cabelo espalhado no travesseiro.',
  rest:'Sierra e Aura dividiram a noite, cada uma do seu lado da cama. Aura ainda dorme.',
  leave:'Aura voltou para casa antes do amanhecer. A cadeira ao lado de Sierra está vazia.'
 }[s.nightChoice]||'A noite acabou sem que precisassem se despedir para sempre.';
 const position={
  study:'O cartão da suspensão continua sem data. Antes de qualquer decisão, vão testar outra saída.',
  stay:'O cartão da suspensão continua sem data.',
  refuse:'Sierra não retirou seu não. Aura também não tentou convencê-la a qualquer custo.'
 }[s.ending]||'A suspensão continua sem data.';
 const bond={
  together:'Sierra ainda quer procurar uma saída que sirva às duas.',
  intervene:'Sierra continua temendo uma viagem sem volta. Aura sabe disso.',
  freedom:'Sierra não exigiu acesso à escolha que Aura ainda não fez.'
 }[s.loveLine]||'';
 const dream=s.nightChoice==='leave'?'':'O espelho do sonho não deixou marca alguma no quarto.';
 return {title:s.nightChoice==='leave'?'Até amanhã.':'A primeira luz.',text:[night,position,bond,dream].filter(Boolean).join(' ')};
}
function beatFor(s){const b=beats[s.beat];if(!b)return b;
 if(b.title==='A noite que ainda tem um corpo'&&!s.intimacy)return {...b,
  aside:'Sierra preferiu esperar para beijar. Isso não decide por elas como termina a noite.',
  line:'Quer companhia por mais um tempo, prefere dormir ou quer ficar sozinha?',
  choices:[
   ['Vamos conversar mais um pouco. Depois você pode ir.','Aura fica até o café acabar. Elas se despedem sem apressar nada.','leave'],
   ['Pode dormir aqui. Só dormir.','— Só dormir. Aura apaga a luz do corredor, e as duas descansam lado a lado.','rest'],
   ['Quero ficar sozinha hoje.','— Certo. Me chama se quiser conversar amanhã. Aura se despede na porta.','leave']
  ]};
 if(s.beat===0){return {...b,aside:'Horas depois da extração. No terraço de Sierra, a cidade continua acordada. Aura chega sem a lente ativa; Sierra fechou os equipamentos lá dentro.'};}
return b;}
root.Terrace={beats,create,choose,advance,ending,beatFor};
})(typeof window!=='undefined'?window:globalThis);
