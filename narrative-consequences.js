/* GOLDEN SILENCE · escolhas com memória; falas pertencem às suas cenas originais. */
(()=>{'use strict';
// Consequence text belongs to the current render, never to global story objects.
// Mutating ClubStory/GhostStory leaked a previous run's choices into new games.
function setCurrentAside(boxId,aside){
 if(!aside)return;
 const box=document.getElementById(boxId);
 if(!box)return;
 let line=box.querySelector('.club-aside');
 if(!line){
  line=document.createElement('p');line.className='club-aside';
  const anchor=box.querySelector('.club-line');
  if(anchor)box.insertBefore(line,anchor);else box.appendChild(line);
 }
 line.textContent=aside;
}
const clubRender=renderClubDialogue;
renderClubDialogue=function(){
 const result=clubRender();
 if(state.chapter===5&&state.dialogue==='return'&&state.dialogueStep===2&&state.response===null){
  const chosen=state.answers?.find(v=>v.beat==='closeness:0');
  const memories=[
   'Alexandra exigiu transparência sobre Aura. Sierra segura o módulo e pensa na promessa que fez.',
   'Sierra admitiu o ciúme sobre o passado de Aura. Jinx percebe que não é hora de brincar.',
   'Sierra recusou prometer pela Aura. A integridade da cópia agora importa mais que qualquer declaração.'
  ];
  if(Number.isInteger(chosen?.choice))setCurrentAside('clubDialogue',memories[chosen.choice]);
 }
 return result;
};
const ghostRender=renderGhostDialogue;
renderGhostDialogue=function(){
 const result=ghostRender();
 if(state.chapter===6&&state.dialogue==='arrival'&&state.dialogueStep===1&&state.response===null){
  const previous=state.answers?.find(v=>v.beat==='auraCall:0');
  const reactions=[
   'Sierra coloca o relatório no meio da mesa. A pergunta sobre a noite anterior vai esperar até que Alex seja encontrada.',
   'Aura olha para o canal desligado do scanner. Sierra não volta a abri-lo sem perguntar.',
   'Jinx observa as duas. Ninguém sabe ainda o que aconteceu às 04:47.'
  ];
  if(Number.isInteger(previous?.choice))setCurrentAside('ghostDialogue',reactions[previous.choice]);
 }
 return result;
};
const originalSpeak=Interlude.speak;Interlude.speak=function(s,id){originalSpeak(s,id);
 if(id==='auraCloud' && Number.isInteger(s.flags.choice_aura) && s.dialogueLines[0]){
 const memory=['Sierra disse a Jinx que procuraria Aura de manhã. Ela ligou antes.',
 'Sierra tinha decidido esperar, e Aura enfim tomou a iniciativa.',
 'Sierra não conseguiu decidir no café. Agora escuta a pergunta do outro lado da tela.'];
 s.dialogueLines[0]={...s.dialogueLines[0],aside:memory[s.flags.choice_aura]};}
 if(id==='cafe2' && Number.isInteger(s.flags.choice_alex) && s.dialogueLines[0]){
 const memory=['Sierra lembra do braço de Alexandra mantendo a ponte aberta até o último instante.',
 'Sierra pensa nos discos e no copo deixado na mesa de Alexandra.',
 'Jinx deixa que a lembrança de Alex fique sem palavras por um momento.'];
 s.dialogueLines[0]={...s.dialogueLines[0],aside:memory[s.flags.choice_alex]};}};
// The screen reacts to the actual branch, not just to words.
window.CanonNarrativo={version:'5.0',stories:['club','ghost','interval','interlude','terrace','shared'],cloudBranch:s=>s.flags.cloudConsent||null,manualOnly:true};
})();
