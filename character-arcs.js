/* SIERRA & AURA · CANON CHARACTER ARCS
 * References: Sierra_Core2, Aura_Tesla_Lovelace, Jinx_Kernel,
 * Alexandra Jonlith / early Electra manuscript, Kieran M.
 * Electra Vorherr Core is Sierra's early manuscript name. No extra character.
 * Rewrites conversations actually executed by the game after all earlier layers.
 * No change to chapter order, puzzle triggers or Alexandra's irreversible death.
 */
(()=>{
'use strict';
const canon=Object.freeze({
 sierra:{name:'Sierra Vorherr Core',age:25,voice:'Corta o excesso, observa os detalhes, evita promessas fáceis; o sarcasmo se dissolve quando cuida de alguém.'},
 aura:{name:'Aura Tesla Lovelace',age:23,voice:'Rápida, íntima, atrevida e impulsiva. Fala como alguém brilhante e vivo, não como um terminal.'},
 jinx:{name:'Jinx Kernel',age:26,voice:'Fala demais, brinca na hora errada; quando alguém corre perigo, a voz muda. Quer consertar coisas, inclusive a família.'},
 alexandra:{name:'Alexandra Jonlith',age:22,voice:'Seca, contida, observadora. Faz perguntas incisivas e nunca pede piedade. Seus pais da guarda morreram num atentado rebelde.'},
 kieran:{name:'Kieran M.',voice:'Preciso, reservado, anarquista metódico; colaborava com Aura à distância. Sonha viver entre árvores em vez de máquinas.'}
});
const flags={clubTruth:null,clubParents:null,ghostBoundary:null,ghostOpening:null,ghostPromise:null,auraPrivacy:null,injuredTrust:null,interludeChoice:null};
// Canonical prose lives in prologue.js and the chapter *-story.js files.
// Previous versions rewrote those texts at load time, silently overriding
// edits to the source scenes. Keep only choice-consequence hooks below.
// No duplicated story authoring or alternative chapter engine.
// ---------- CONSEQUENCES: hooks on actual choices, with later audible different reactions ----------
const formerClub=clubChoose;
clubChoose=function(index){if(state.chapter===5&&state.mode==='clubDialogue'&&state.response===null){
 if(state.dialogue==='parents')flags.clubParents=index;
 if(state.dialogue==='meet'&&state.dialogueStep===2)flags.clubTruth=index;
}return formerClub(index);};
const formerGhost=ghostChoose;
ghostChoose=function(index){if(state.chapter===6&&state.mode==='ghostDialogue'&&state.response===null){
 if(state.dialogue==='intimacy'&&state.dialogueStep===0)flags.ghostOpening=index;
 if(state.dialogue==='intimacy'&&state.dialogueStep===3)flags.ghostBoundary=index;
 if(state.dialogue==='arrival'&&state.dialogueStep===0)flags.auraPrivacy=index;
 if(state.dialogue==='last'&&state.dialogueStep===0)flags.ghostPromise=index;
}return formerGhost(index);};
const originalContinuityLines=StoryContinuity.lines;
StoryContinuity.lines=function(chapter,beat,step=0){const extra=originalContinuityLines(chapter,beat,step).slice();
 if(chapter===5&&beat==='personal'&&step===0&&flags.clubParents!==null){
  extra.push(['ALEXANDRA: Quando você viu a foto, não tentou me convencer de que mereciam morrer. Eu reparei.','ALEXANDRA: Ainda não sei se concordamos. Pelo menos você não usou os meus pais para ganhar a discussão.','ALEXANDRA: Você perguntou por que eu fico. É porque um dia alguém vai ter que impedir que a história se repita.'][flags.clubParents]);
 }
 if(chapter===6&&beat==='welcome'&&step===0&&flags.clubParents!==null){
  extra.push(['ALEXANDRA: Pode entrar. Foi estranho falar dos meus pais naquela cabine. Mas não me arrependi.','ALEXANDRA: Você não respondeu por reflexo quando viu a foto. Aqui já é um começo.','ALEXANDRA: Você me perguntou por que ajudo os rebeldes. Não tenho uma resposta melhor hoje, mas tenho café.'][flags.clubParents]);
 }
 if(chapter===6&&beat==='intimacy'&&step===1&&flags.ghostOpening!==null){
  extra.push(['ALEXANDRA: Obrigada por perguntar sem me acusar de esconder a verdade para te ferir.','ALEXANDRA: Meu passado com Aura não é um arquivo que possa ser usado como prova contra ela.','ALEXANDRA: Ainda sinto falta dela às vezes. Não estou pedindo que você mude o que vive com ela.'][flags.ghostOpening]);
 }
 if(chapter===6&&beat==='arrival'&&step===1&&flags.auraPrivacy!==null){
  extra.push(['AURA: Vou comparar a assinatura com a cópia local que você preservou. Não preciso abrir sua lente.','AURA: Eu vou perguntar antes de tocar na sua interface. Não quero que você passe a me temer também.','AURA: Eu ouvi. Vamos olhar a cópia juntas.'][flags.auraPrivacy]);
 }
 if(chapter===7&&beat==='map'&&step===0&&flags.clubParents!==null){
  extra.push(flags.clubParents===0?'SIERRA: Contei à Alex que a guarda matou meus pais. Ela me mostrou a foto dos dela. Não resolvemos o que isso significa. Agora preciso encontrá-la.':'SIERRA: Nós nunca resolvemos o que aquela praça significava. Agora a vida dela depende de chegarmos antes de qualquer bandeira.');
 }
 if(chapter===7&&beat==='heard'&&step===0&&flags.ghostBoundary!==null){
  extra.push(['SIERRA: A Alex me disse por que guardou tudo sozinha. Agora preciso encontrar quem ainda pode responder.','SIERRA: Perdi tempo com ciúme do passado dela com Aura. Agora quero respostas sobre o desaparecimento.','SIERRA: Nós concordamos em manter os dados locais. Quero devolver a cópia à própria Alex.'][flags.ghostBoundary]);
 }
 return extra;};
// Existing continuity renderer closes over its original private lines().
// Append only the new relationship-dependent lines here so players SEE them.
const originalRender=StoryContinuity.render;
StoryContinuity.render=function(container,chapter,beat,step=0){
 originalRender(container,chapter,beat,step);
 if(!container||!document.createElement)return;
 const base=originalContinuityLines(chapter,beat,step);
 const additions=StoryContinuity.lines(chapter,beat,step).slice(base.length);
 const anchor=container.querySelector('.club-choices,.club-next,.club-help');
 for(const speech of additions){
  const p=document.createElement('p');p.className='continuity-recall canon-consequence';p.textContent=speech;
  if(anchor)container.insertBefore(p,anchor);else container.appendChild(p);
 }
};
// Use the original continuity beat once; do not concatenate duplicate grief monologues.
const originalReset=StoryContinuity.reset;
StoryContinuity.reset=function(){originalReset();for(const key of Object.keys(flags))flags[key]=null;};
window.CharacterArcs={canon,flags,version:'BIOGRAFIAS / PERSONAGENS VIVOS'};
})();
