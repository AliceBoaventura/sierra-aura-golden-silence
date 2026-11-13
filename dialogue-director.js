/* P3: varied, paced dialogue without shuffling facts, decisions, or plot order.
   All variants are authored; no procedural fabrication of canonical evidence. */
(()=>{'use strict';
const variants=new Map([
 ['O café de sempre?',['O de sempre, Sierra?','Quer teu café de sempre?','Hoje vai de café ou vai fingir que dormiu?']],
 ['Ainda está quente?',['Ainda está quente?','Você acabou de passar?','Diz que não esfriou.']],
 ['Mara mandou chamar por causa do quadro.',['A Mara me chamou pro quadro.','Tenho que ver o painel da clínica.','A Mara precisa de ajuda com a luz.']],
 ['Estou indo.',['Já vou lá.','Vou falar com ela.','Certo. Tô indo.']],
 ['Eu sei. O café vai esperar.',['Guardo o teu café.','Vai. Depois a gente conversa.','Eu sei. O café espera.']],
 ['O café ainda está quente.',['Ainda dá pra beber.','Acabei de passar.','Pelo menos o café não caiu junto com a luz.']],
 ['Você saiu da oficina por minha causa?',['Deixou a oficina por mim?','Você largou tudo lá?','Não precisava sair da oficina.']],
 ['Saí porque não conseguia consertar nada. Você quer me ajudar a desperdiçar um café ruim?',['Hoje eu não estava consertando nada mesmo. Vem tomar um café ruim?','A oficina pode esperar. Tem um café aberto.','Eu precisava sair também. Vem comigo?']],
 ['Você pediu um lugar familiar. A comida veio no pacote.',['Você escolheu o lugar. Aguenta a torrada.','Não reclama. Você conhece esse café.','O lugar é seu. A torrada é problema teu.']],
 ['Eu sei. Só queria ter ouvido ela rir mais uma vez.',['Queria ouvir a risada dela mais uma vez.','Sinto falta de ouvir ela rir.','Eu só queria mais uma noite com ela.']],
 ['Também queria. E não por uma gravação.',['Eu também. De verdade.','Também sinto falta disso.','Eu sei, Si. Eu também.']],
 ['Si, vi a luz da tua janela. Não precisa responder. Vou ficar cinco minutos aqui embaixo.',['Si, tua luz está acesa. Tô aqui embaixo. Sem pressa.','Passei pelo teu prédio. Quer dar uma volta? Se não quiser, tudo bem.','Si, vim até aqui. Se não quiser sair, volto pra casa.']],
 ['Você vai ficar na chuva por cinco minutos?',['Vai ficar aí na chuva?','Jinx, tá chovendo.','Você veio sem guarda-chuva?']],
 ['Trouxe casaco. Não trouxe nenhuma notícia.',['Estou de casaco. A rua está vazia.','Estou coberto. Pode descer quando quiser.','A chuva é a parte menos ruim da noite.']],
 ['Quando entrar, manda um ponto. Só pra eu saber que chegou.',['Me manda uma mensagem quando entrar.','Dá um toque quando estiver em casa.','Não precisa conversar. Só avisa que chegou.']],
 ['Sierra? O canal continua aberto. Não vou te pedir outra decisão hoje.',['Estou aqui. Não precisa decidir mais nada hoje.','Podemos ficar quietas, se quiser.','Não vou pedir nada. Só estou aqui.']]
]);
const ambientVariants=new Map([
 ['A Mara está esperando na clínica. Ela disse que o quadro caiu de novo. Vamos?', ['A Mara está lá na frente. Vamos?','A Mara pediu ajuda. O quadro caiu de novo.','A clínica está sem energia. A Mara está esperando.']],
 ['Não fica no facho. Eu seguro este lado.', ['Cuidado com a luz. Eu cubro daqui.','Sai do facho, Si. Eu seguro.','Pela sombra, Sierra. Tô aqui.']],
 ['Pela direita, Sierra. Eu cubro sua saída.', ['Vai pela direita!','Sierra, abaixa! Eu seguro aqui.','Por aqui, Si! Tô cobrindo.']],
 ['Sua vez. Vai antes que eu comece a cobrar por porta.', ['Vai, Si. Eu seguro.','Pronto. Agora passa.','A passagem é tua. Vai.']],
 ['A porta abriu. Não sei quanto tempo vai ficar assim.', ['A passagem está livre. Vamos.','Tá livre. Vamos.','Abriu. Melhor sair antes de alguém conferir.']]
]);
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
function seed(s){if(!s||typeof s!=='object')return 0;if(!Number.isInteger(s.dialogueSeed))s.dialogueSeed=Math.floor(Math.random()*0x7fffffff);return s.dialogueSeed;}
function line(text,s,slot=''){const pool=variants.get(text);if(!pool)return text;return pool[hash(String(seed(s))+'|'+slot)%pool.length];}
function ambient(speaker,text,s){const pool=ambientVariants.get(text);if(!pool)return text;const counter=s&&typeof s==='object'?(s.ambientCounts??={}) : {};const key=speaker+'|'+text;const n=counter[key]||0;counter[key]=n+1;return pool[(hash(String(seed(s))+'|'+key)+n)%pool.length];}
// P15: all dialogue progresses by explicit player action. No timer or AUTO control.
// Reply text is authored in several character voices. The response can be
// spoken by someone other than the person who asked the question; the displayed
// heading must follow the reply, not silently attribute it to that questioner.
// This is presentation-only. Do not change authored strings or story flags.
const replyPrefix=/^\s*(ALEXANDRA|ALEX|JINX|SIERRA|AURA|BARMAN)(\s*\/\s*(?:ENLACE|CANAL SEGURO|RÁDIO))?\s*:\s*/i;
function response(text,questionSpeaker='CENA'){
 const value=String(text??'');const m=replyPrefix.exec(value);
 if(!m){
  // Narrative stage directions belong to the scene, not to a speaking role.
  // Restrict detection to explicit third-person action verbs; names followed by
  // a comma (direct address) remain dialogue, not an action.
  const stageAction=/^\s*(?:Jinx|Sierra|Aura|Alexandra)\s+(?:alisa|observa|recua|segura|deixa|fecha|guarda|encara|aperta|sorri|se\s+afasta)\b/i;
  if(stageAction.test(value))return {speaker:'CENA',text:value,attributed:true};
  return {speaker:String(questionSpeaker||'CENA'),text:value,attributed:false};
 }
 const who=m[1].toUpperCase()==='ALEX'?'ALEXANDRA':m[1].toUpperCase();
 const channel=m[2]?m[2].replace(/\s*\/\s*/,' / ').toUpperCase():'';
 return {speaker:who+channel,text:value.slice(m[0].length),attributed:true};
}
function cancel(){} // Compatibility for chapter renderers.
function attach(box){if(!box)return;const toggle=box.querySelector('.dialogue-auto');if(toggle)toggle.remove();}
window.DialogueDirector={line,ambient,response,attach,seed,cancel,get auto(){return false;}};
})();
