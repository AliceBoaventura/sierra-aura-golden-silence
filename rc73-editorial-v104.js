/* SIERRA & AURA · V10.4 / revisão de tempo e voz.
 * Main rule: tactical scene != intimate scene. No decisions about a private
 * relationship in an active combat corridor. Preserve title IDs, choice counts,
 * flags, fallout, character agency and post-demo continuity.
 */
(()=>{'use strict';
const report={version:'RC73-V104-TIMING',scenes:[],errors:[],choicesPreserved:true};
const terr=globalThis.Terrace?.beats;
const patchBeat=(title,patch)=>{
 const b=terr?.find(x=>x.title===title);
 if(!b){report.errors.push('terrace missing: '+title);return;}
 const n=b.choices.length;
 for(const [key,val] of Object.entries(patch)){
  if(key==='choices'){
   if(val.length!==n){report.errors.push('choice count: '+title);report.choicesPreserved=false;continue;}
   val.forEach(([label,reply],i)=>{b.choices[i][0]=label;b.choices[i][1]=reply;});
  }else b[key]=val;
 }
 report.scenes.push('terrace: '+title);
};
patchBeat('Uma casa acima do ruído',{
 speaker:'AURA',replyLabel:'CENA',
 aside:'Horas depois da extração, as duas chegam à casa de Sierra. A lente está desligada na mesa.',
 line:'Achei que você fosse se trancar em casa depois dos relés. Por que me chamou?',
 choices:[
  ['Trouxe a cópia. Amanhã quero entender o que você encontrou.','Aura olha o módulo desligado. — Amanhã. Hoje podemos deixar a cidade lá embaixo.'],
  ['Queria ouvir sua voz sem um canal aberto entre nós.','Aura se senta. — Então, por enquanto, é só a gente.'],
  ['Porque antes do próximo enlace precisamos combinar uma saída.','Aura concorda. — Nenhum acesso novo sem uma rota de volta. E não precisamos resolver isso esta noite.']
 ]
});
patchBeat('A mão que não se adianta',{
 speaker:'AURA',replyLabel:'CENA',aside:'O vento aumenta. Aura deixa a mão sobre o parapeito, próxima à de Sierra.',
 line:'Posso segurar sua mão?',
 choices:[
  ['Pode.','Aura entrelaça os dedos nos de Sierra. As duas continuam olhando as luzes.'],
  ['Agora não. Mas fica aqui.','— Fico. Aura se senta sem diminuir a distância que Sierra escolheu.'],
  ['Pode perguntar. Eu digo quando quiser.','Aura recolhe a mão, sorrindo de leve. A proximidade continua sendo uma escolha.']
 ]
});
patchBeat('O corpo e a nuvem',{
 speaker:'AURA',replyLabel:'CENA',aside:'Aura tira do bolso o cartão de uma instalação de suspensão. Não o entrega a Sierra.',
 line:'Reservei uma sala de suspensão. Quero tentar levar minha consciência à rede. Ainda não decidi fazer isso.',
 choices:[
  ['Você está me contando porque pretende ir?','— Porque estou considerando. Eu queria que soubesse antes de uma decisão.'],
  ['Você não sabe se quem acorda lá ainda é você.','— Não sei. E não vou fingir que essa pergunta está resolvida.'],
  ['Há quanto tempo você tem esse cartão?','— Meses. Não marquei uma data. Mas reservar já foi um passo grande demais para esconder.']
 ]
});
patchBeat('Até onde você iria?',{
 speaker:'AURA',replyLabel:'CENA',aside:'O núcleo da IA está oculto atrás das luzes da torre central. Aura não olha para ele.',
 line:'De dentro talvez eu encontre o núcleo que controla esta cidade. Mas ainda não tenho uma maneira confiável de voltar.',
 choices:[
  ['Eu procuro uma saída com você. Não entramos sem volta.','— Então começamos pelo que pode falhar. Não quero sua confiança como substituto de um teste.'],
  ['Se você for sem retorno, vou tentar te impedir.','— Pode tentar me convencer, pode discordar. Meu corpo ainda é minha decisão.'],
  ['A escolha é sua. Eu preciso saber antes de você se arriscar.','— Você vai saber. Inclusive quando eu tiver vontade de esconder meu medo.']
 ]
});
patchBeat('Limites antes de promessas',{
 speaker:'AURA',replyLabel:'CENA',aside:'Aura guarda o cartão. Não há data de suspensão, nem garantia de retorno.',
 line:'Se houver outro caminho para alcançar a rede, quero encontrá-lo antes de arriscar meu corpo.',
 choices:[
  ['Um teste reversível, com critérios que possam reprovar a ideia.','— E sem mudar as regras quando o resultado não me agradar.'],
  ['Podemos continuar lutando daqui de fora. Ainda não tentamos tudo.','— Vamos procurar. Sem chamar de fracasso uma saída que nos mantém vivas.'],
  ['Quero poder discordar sem isso se tornar uma prova de amor.','— Você pode. Não estou pedindo que assine minha escolha.']
 ]
});
patchBeat('O espelho do outro lado',{
 title:'O rádio sob a chuva',speaker:'AURA',replyLabel:'CENA',
 aside:'Aura tira um pequeno visor offline do bolso. É uma lembrança anterior à investigação.',
 line:'Meu pai me ensinou a consertar um rádio durante uma tempestade. Guardei um fragmento daquela noite. Quer ver?',
 choices:[
  ['Se você quiser dividir, eu vejo com você.','Aura abre somente a lembrança: chuva, estática, um rádio que enfim toca. Na borda aparece a assinatura de Keane. Sierra não copia nada.'],
  ['Pode me contar. Não precisa abrir o arquivo.','Aura desliga o visor. — Ele dizia que até o ruído tinha alguma coisa a dizer. Sierra escuta sem pedir uma gravação.'],
  ['Não agora. Quero ficar com você, sem outra tela.','— Tudo bem. Aura guarda a lembrança. Nenhuma das duas precisa explicar o silêncio.']
 ]
});
patchBeat('Antes que você vire ausência',{
 speaker:'AURA',replyLabel:'CENA',aside:'O visor já foi guardado. Pela primeira vez, nenhuma pergunta depende da rede.',
 line:'Eu quero te beijar. Você quer?',
 choices:[
  ['Quero.','Sierra se aproxima. Aura encontra o beijo no meio do caminho.'],
  ['Quero. Mas não como uma despedida.','— Não é. Aura beija Sierra sem tentar resolver o futuro com um gesto.'],
  ['Quero ficar perto, mas prefiro esperar.','— Tudo bem. Aura fica ao lado dela, sem interpretar a espera como rejeição.']
 ]
});
patchBeat('A noite que ainda tem um corpo',{
 speaker:'AURA',replyLabel:'CENA',aside:'A cidade se apaga aos poucos sob o terraço. A decisão sobre a noite é distinta do plano de suspensão.',
 line:'Gostaria de ficar. Mas posso ir embora também. O que você prefere?',
 choices:[
  ['Quero você comigo esta noite, se quiser também.','Elas confirmam que querem ficar juntas. A porta se fecha; o resto da noite não pertence à cidade.'],
  ['Pode dormir aqui. Só dormir.','— Só dormir. Aura deixa o terminal na sala e se deita perto de Sierra.'],
  ['Quero te ver outra vez. Hoje prefiro ficar sozinha.','— Eu entendo. Aura se despede na porta. Não transforma isso numa cobrança.']
 ]
});
patchBeat('O rosto do outro lado',{
 replyLabel:'SONHO',aside:'Sierra sonha com um apartamento em ruínas. O reflexo mostra Aura, mas a voz não acompanha os lábios.',
 line:'Você tem certeza de que está acordada?'
});
patchBeat('O quarto ainda existe',{
 speaker:'SIERRA / PENSAMENTO',responseLabel:'SIERRA DECIDE',replyLabel:'CENA',
 aside:'Sierra acorda. O quarto está intacto. Aura dorme ao seu lado; nenhuma evidência do sonho está presente.',
 line:'O quarto está inteiro. A voz não era dela. Conto o que vi ou espero?'
});
function editStory(scope,group,idx,changes){
 let data;
 try{data=eval(scope)}catch(e){report.errors.push(scope+': '+e.message);return;}
 const beat=data?.[group]?.[idx];if(!beat){report.errors.push(scope+'/'+group+'/'+idx);return;}
 for(const [key,val] of Object.entries(changes)){
  if(key==='choices')for(const [i,choice] of Object.entries(val)){
   if(!beat.choices?.[+i]){report.errors.push(scope+'/'+group+'/'+idx+'/choice '+i);continue;}
   if(choice.label!==undefined)beat.choices[+i][0]=choice.label;
   if(choice.reply!==undefined)beat.choices[+i][1]=choice.reply;
  }else{
   if(typeof beat[key]!=='string'){report.errors.push(scope+'/'+group+'/'+idx+'/'+key);continue;}
   beat[key]=val;
  }
 }
 report.scenes.push(`${scope}/${group}/${idx}`);
}
// Chapter 5: remote communication remains practical until Sierra reaches safety.
editStory('ClubStory','brief',0,{line:'Alex encontrou seis minutos da minha voz numa gravação que eu não lembro de fazer. O original está no clube. Não conecta sua lente à rede de lá.'});
editStory('ClubStory','return',1,{line:'Sierra? A chamada caiu quando vieram as sirenes. Você e Jinx conseguiram sair? Alguém se machucou?'});
// Chapter 6: Aura violated Sierra's privacy out of fear for Alexandra;
// she acknowledges the violation without claiming the urgency justified it.
editStory('GhostStory','auraCall',0,{line:'O sinal da Alex desapareceu. Você está com ela?'});
editStory('GhostStory','auraCall',1,{line:'Entrei na sua lente sem pedir. Foi errado. Preciso localizar o último registro da Alex, mas você decide o que posso acessar.'});
editStory('GhostStory','arrival',0,{line:'Há duas assinaturas diferentes na chave do comunicador. Ainda não sabemos quem a trocou nem quando.'});
editStory('GhostStory','last',1,{line:'O rastro da Alex acaba aqui. A cópia continua preservada. Não vamos abrir a mente de outra pessoa para preencher o que falta.'});
// Interlude: the body/cloud decision happened *without* telling Sierra.
// The intimacy choice is offered only after the disclosure and disagreement.
const cloud=[
 'Si? Posso falar com você?',
 'Três dias. Eu te liguei todos eles.',
 'Eu vi as chamadas.',
 'E não respondeu.',
 'Achei que encontraria uma forma de dizer. Não encontrei.',
 'A Alex morreu. Você sumiu. Eu não sabia se tinha perdido as duas.',
 'Estou ligada à rede. Meu corpo está em suspensão. Entrei sem te contar.',
 'No terraço você disse que ainda não tinha um caminho de volta.',
 'Eu quebrei o que combinamos. Não vou pedir que você me perdoe agora.',
 'Sua imagem está falhando. Tem alguém ouvindo?',
 'Outra frequência entrou. Não sei de onde.',
 'Não investiga às escondidas de novo.',
 'Vou contar o que encontrar. Mesmo se você não quiser ouvir.',
 'Senti sua falta.',
 'Posso abrir uma ponte sensorial, se você quiser. Não muda o que fiz.',
 'Antes: a outra frequência apareceu quando?',
 'Quando você disse meu nome. É tudo que sei.',
 'Amanhã vemos o rastro. Agora fica na linha.',
 'Fico. Se precisar sair, eu aviso.',
 'Boa noite, Aura.',
 'Boa noite, Si.'
];
for(let i=0;i<cloud.length;i++)editStory('InterludeStory','auraCloud',i,{text:cloud[i]});
// These changes are purely editorial: choice IDs, endings, events, flags and
// saved-state representation remain owned by the existing story engines.
globalThis.RC73V104EditorialAudit=Object.freeze(report);
if(report.errors.length||!report.choicesPreserved)console.error('[V10.4] editorial integration incomplete',report);
})();
