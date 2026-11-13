/* Dialogue cohesion adapter: *presentation only*. No input listeners, no new
 * choice engine, no response timers or automatic dialogue advancement. */
(()=>{'use strict';
const names={sierra:'assets/rebuild/portraits/sierra.webp',aura:'assets/rebuild/portraits/aura.webp',jinx:'assets/rebuild/portraits/jinx.webp',alexandra:'assets/rebuild/portraits/alexandra.webp'};
const ids=['clubDialogue','ghostDialogue','intervalDialogue','interludeDialogue','conversationBox'];
const cache=new WeakMap();let updating=false;
function actorFor(s){s=String(s||'').toUpperCase();if(s.includes('SIERRA')||s.includes('ELECTRA'))return 'sierra';if(s.includes('AURA'))return 'aura';if(s.includes('JINX'))return 'jinx';if(s.includes('ALEX'))return 'alexandra';return 'narration';}
function active(b){return b&&!b.classList.contains('hidden')&&!b.classList.contains('interlude-rest')}
function reconcile(b){if(updating)return;
 if(!active(b))return;
 let label=b.querySelector('.club-dialogue-top span,#talkSpeaker')?.textContent||'';
 // Reply remains inside the SAME panel. It may have a different speaker.
 const reply=typeof state!=='undefined'?state.response:null;
 if(typeof reply==='string'&&['clubDialogue','ghostDialogue'].includes(b.id)){
  const match=reply.match(/^\s*(SIERRA|AURA|JINX|ALEXANDRA|ALEX)\s*:/i);
  if(match)label=match[1];else label='RESPOSTA';
 }
 const character=actorFor(label), key=character+'|'+label+'|'+(typeof state!=='undefined'?(state.dialogue??'')+':'+(state.dialogueStep??'')+':'+(state.response??''):'');
 if(cache.get(b)===key && (character==='narration'||b.querySelector(':scope > .dialogue-avatar')))return;
 updating=true;
 try{
  b.classList.add('dialogue-coherent');b.dataset.actor=character;
  // First speaker in a response owns the portrait and headline; the question's
  // old speaker must not be falsely attributed to Jinx, Sierra or Aura.
  const header=b.querySelector('.club-dialogue-top span');
  if(header && typeof reply==='string' && ['clubDialogue','ghostDialogue'].includes(b.id)){
    const prefix=reply.match(/^\s*(SIERRA|AURA|JINX|ALEXANDRA|ALEX)\s*:/i);
    if(prefix)header.textContent=prefix[1].toUpperCase();
    else if(!header.textContent.startsWith('RESPOSTA'))header.textContent='RESPOSTA / '+header.textContent;
  }
  const last=state?.answers?.at?.(-1),choices=state?.chapter===5?(typeof ClubStory==='undefined'?null:ClubStory):state?.chapter===6?(typeof GhostStory==='undefined'?null:GhostStory):null;
  const current=choices?.[state.dialogue]?.[state.dialogueStep];
  const matching=last?.beat===state.dialogue+':'+state.dialogueStep;
  const mood=matching?current?.choices?.[last.choice]?.[2]:null;
  b.dataset.emotion=['trust','jealous','curious'].includes(mood)?mood:'neutral';
  b.querySelectorAll(':scope > .dialogue-avatar').forEach(a=>a.remove());
  if(names[character]){const img=document.createElement('img');img.className='dialogue-avatar';img.src='./'+names[character];img.alt='';img.setAttribute('aria-hidden','true');b.prepend(img);}
  for(const other of ids){const el=document.getElementById(other);if(el&&el!==b&&!el.classList.contains('hidden'))el.classList.add('hidden');}
  cache.set(b,key);
 }finally{updating=false;}
}
const observers=[];
function setup(){for(const id of ids){const el=document.getElementById(id);if(!el)continue;
 const ob=new MutationObserver(()=>reconcile(el));ob.observe(el,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});observers.push(ob);reconcile(el);
}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
window.DialogueCohesion={reconcile,actorFor,active};
})();