/* Sierra Aura · Merge 2026-10-29 · RC43 lived narrative ported onto P53.
 * Does not replace P53/P54 scene writing, keyframe performance, or chapter progression.
 * Optional action; no gating on the route to chapter 7.
 */
(()=>{'use strict';
 const memory={cup:null,cupMorning:false,privacy:false};
 const afterMissing=s=>s.stage==='apartment'&&['missing','echo','call','arrival','team','ghost','ready'].includes(s.phase);
 const safeMemory=['da borda lascada da caneca de Alexandra','da caneca que Alexandra reservou','da caneca que havia lavado enquanto Alexandra procurava a faixa'];
 GhostStory.cups=[{
  who:'ALEXANDRA',
  aside:'Duas canecas diferentes ao lado do console. Uma tem uma lasca antiga na borda e a marca circular de uma xícara quente. Alex pega a mais danificada, sem olhar.',
  line:'Não confia no meu café? É uma decisão defensável.',
  choices:[
   ['A sua caneca está lascada.','ALEXANDRA: É a única que não desaparece quando o Jinx aparece. Ele odeia beber nela. Alex passa o dedo pela lasca sem se cortar.','curious'],
   ['Você separou uma para mim?','ALEXANDRA: Você vai ficar umas horas. O café é ruim, mas eu tenho educação. Ela empurra a outra caneca para Sierra.','trust'],
   ['Me dá a lascada. Eu lavo a outra.','ALEXANDRA: Ela já estava limpa. SIERRA: Então eu posso fingir que ajudei. Alexandra ri e entrega a caneca.','desire']
  ]
 }];

 const api={
  onUse(s,id){
   if(s.chapter!==6||s.stage!=='apartment')return false;
   if(id==='cups'){
    if(afterMissing(s)){
     if(!s.flags.cupsAftermath){
      s.flags.cupsAftermath=true; memory.cupMorning=true;
      Ghost.note(s,'cups-after','Duas canecas · depois','As duas canecas continuam sobre a bancada. Uma traz uma lasca na borda. O cômodo não foi reorganizado desde a gravação interrompida.');
     }
     const text=s.flags.cupsChoice===0?'Alex disse que Jinx não usava essa caneca. A cozinha ainda guarda uma conversa que não terminou.':s.flags.cupsChoice===1?'Alexandra deixou uma caneca para mim. A caneca ficou. Ela não.':s.flags.cupsChoice===2?'Eu lavei uma delas. A outra continua exatamente onde Alex a deixou.':'Duas canecas na bancada. Nada nelas explica a ausência.';
     s.events.push({type:'radio',who:'SIERRA',line:text});
    }else if(s.flags.cupsChoice===undefined&&!s.flags.cupsOpened){
     s.flags.cupsOpened=true; Ghost.speak(s,'cups');
    }else s.events.push({type:'radio',who:'SIERRA',line:'O café esfriou. Alexandra não parece ter percebido que eu observava a bancada.'});
    return true;
   }
   if(afterMissing(s)&&id==='fridge'){
    s.flags.fridgeUsed=true;
    Ghost.note(s,'fridge-morning','Cozinha · 05:04','A luz da geladeira acende. Água e alimentos comuns, nenhum indício de fuga planejada.');
    s.events.push({type:'radio',who:'SIERRA',line:'A luz acendeu. A casa continua fazendo as coisas de sempre.'}); return true;
   }
   if(afterMissing(s)&&id==='records'){
    Ghost.note(s,'record-morning','Discos · nenhuma nova faixa','O toca-discos permanece parado. O disco do primeiro cachê ainda está lá.');
    s.events.push({type:'radio',who:'SIERRA',line:s.flags.records?'Ela me contou por que guardava o disco. Agora o silêncio entre as faixas ficou maior.':'Um disco com uma data escrita à mão. Não vou inventar uma história para completar o que não sei.'}); return true;
   }
   if(id==='desk'&&['arrival','team'].includes(s.phase)&&s.flags.privacyProtocol){
    if(!s.flags.permissionGiven){
     s.flags.permissionGiven=true;
     Ghost.note(s,'protocol','Acesso com consentimento','Aura pediu autorização para consultar um horário. A cópia permanece local; a lente de Sierra não foi aberta.');
     s.events.push({type:'radio',who:'AURA',line:'Posso conferir só o horário no terminal? Não vou entrar na sua lente.'});
    }else s.events.push({type:'radio',who:'SIERRA',line:'Pode olhar a cópia local. A original fica comigo.'});
    return true;
   }
   return false;
  },
  memory:()=>({...memory}),
  reset(){memory.cup=null;memory.cupMorning=false;memory.privacy=false;}
 };
 window.GhostNarrativeBridge=api;
 const previousChoose=ghostChoose;
 ghostChoose=function(i){
  const s=state,valid=s?.chapter===6&&s.mode==='ghostDialogue'&&s.response===null;
  const dialogue=valid?s.dialogue:null,step=valid?s.dialogueStep:null;
  const choices=valid?GhostStory[dialogue]?.[step]?.choices:null;
  if(!choices?.[i])return previousChoose(i);
  if(dialogue==='cups'){
   s.flags.cupsChoice=i;memory.cup=i;
   const notes=[['A caneca lascada','Alexandra guardava a caneca porque Jinx não gostava dela.'],['Caneca reservada','Alexandra deixou uma caneca para Sierra sem saber se ela ficaria.'],['A caneca lavada','Sierra lavou uma caneca na casa de Alexandra. Um gesto pequeno, sem promessa.']];
   Ghost.note(s,'alex-cup',...notes[i]);
  }
  if((dialogue==='auraCall'&&step===0&&i===1)||(dialogue==='arrival'&&step===0&&i===1)){
   s.flags.privacyProtocol=true;memory.privacy=true;
  }
  return previousChoose(i);
 };
 const previousRender=renderGhostDialogue;
 renderGhostDialogue=function(){
  const result=previousRender();
  if(state.chapter!==6||state.response!==null)return result;
  const box=document.getElementById('ghostDialogue');
  if(!box||box.classList.contains('hidden'))return result;
  let line='';
  if(state.dialogue==='arrival'&&state.dialogueStep===1&&state.flags.privacyProtocol)
   line='Aura mantém as mãos longe da lente de Sierra. Jinx afasta a cadeira do terminal para alcançar a cópia local.';
  if(state.dialogue==='last'&&state.dialogueStep===0&&state.flags.cupsAftermath)
   line='Sierra pensa nas canecas ao lado do computador. Não são prova, mas a cozinha parece vazia demais.';
  if(line){const paragraph=document.createElement('p');paragraph.className='ghost-lived-memory';paragraph.textContent=line;const anchor=box.querySelector('.club-choices,.club-help');if(anchor)box.insertBefore(paragraph,anchor);else box.append(paragraph);}
  return result;
 };
 const previousHistory=StoryContinuity.history;
 StoryContinuity.history=function(){
  return {...previousHistory(),bridgeCup:memory.cup,bridgeCupAftermath:memory.cupMorning,bridgePrivacy:memory.privacy};
 };
 const previousRestore=StoryContinuity.restore;
 StoryContinuity.restore=function(saved){
  previousRestore(saved);
  memory.cup=[0,1,2].includes(saved?.bridgeCup)?saved.bridgeCup:null;
  memory.cupMorning=saved?.bridgeCupAftermath===true;
  memory.privacy=saved?.bridgePrivacy===true;
 };
 const oldCapture=StoryContinuity.capture;
 StoryContinuity.capture=function(s){
  if(s?.chapter===6){
   if(Number.isInteger(s.flags?.cupsChoice))memory.cup=s.flags.cupsChoice;
   memory.cupMorning=!!s.flags?.cupsAftermath;
   memory.privacy=!!s.flags?.privacyProtocol;
  }
  return oldCapture(s);
 };
 const oldRender=StoryContinuity.render;
 StoryContinuity.render=function(container,chapter,beat,step=0){
  oldRender(container,chapter,beat,step);
  if(!container||chapter!==7||beat!=='heard'||step!==0||memory.cup===null)return;
  if(container.querySelector('.ghost-memory-recall'))return;
  const paragraph=document.createElement('p');paragraph.className='continuity-recall ghost-memory-recall';
  paragraph.textContent=['SIERRA: Alex disse que o Jinx não suportava aquela caneca lascada. Eu vou contar a ele quando ela voltar.',
   'SIERRA: Na cozinha da Alex havia uma caneca reservada para mim. Não sei por que me lembro disso agora.',
   'SIERRA: Eu lavei uma caneca na casa da Alex. Pensei que haveria outras noites iguais.'][memory.cup];
  const anchor=container.querySelector('.club-choices,.club-next,.club-help');if(anchor)container.insertBefore(paragraph,anchor);else container.append(paragraph);
 };
 const oldSpeak=Interlude.speak;
 Interlude.speak=function(s,id){
  const result=oldSpeak(s,id);
  if(id==='cafe1'&&memory.cup!==null&&Array.isArray(s.dialogueLines)){
   // The engine's outer .slice() still shares each row with InterludeStory.
   // Keep this contextual description owned by this invocation of the scene.
   s.dialogueLines=s.dialogueLines.map(row=>({...row}));
   const line=s.dialogueLines.find(row=>row.who==='SIERRA'&&!row.choiceKey);
   if(line)line.aside=(line.aside?line.aside+' ':'')+'Sierra segura a caneca pelas duas mãos. Lembra-se '+safeMemory[memory.cup]+'. A lembrança não responde a Jinx.';
  }
  return result;
 };
 const oldReset=StoryContinuity.reset;
 StoryContinuity.reset=function(){api.reset();return oldReset();};
})();
