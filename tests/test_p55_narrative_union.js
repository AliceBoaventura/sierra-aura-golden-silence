'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const c={console,renderGhostDialogue(){},renderClubDialogue(){},clearControl(){},ghostEvents(){},radio(){},sessionStorage:{removeItem(){}},$(){return{classList:{add(){}}}},document:{createElement(){return{className:'',textContent:''}},getElementById(){return null}}};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['runtime.js','story-continuity.js','ghost-engine.js','club-story.js','ghost-story.js','interval-story.js','interlude-story.js','interlude-engine.js','character-arcs.js','narrative-consequences.js','ghost-narrative-bridge.js','p54-integracao-seletiva.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const G=c.Ghost,C=c.StoryContinuity;
const canonical=()=>vm.runInContext('JSON.stringify(InterludeStory)',c);
const initial=canonical();
function box(){const children=[];return{children,querySelector(q){return q==='.ghost-memory-recall'?children.find(x=>x.className.includes('ghost-memory-recall')):null;},append(x){children.push(x)},appendChild(x){children.push(x)},insertBefore(x){children.push(x)}};}
function use(s,id){s.x=G.objects(s).find(x=>x.id===id).x;s.useWas=false;G.step(s,{use:true},.03);}
const counts=[];
for(let choice=0;choice<3;choice++){
 C.reset();let s=G.create();c.state=s;s.stage='apartment';s.phase='explore';
 assert.equal(C.history().bridgeCup,null);
 use(s,'cups');assert.equal(s.dialogue,'cups');c.ghostChoose(choice);
 assert.equal(s.flags.cupsChoice,choice);assert.equal(C.history().bridgeCup,choice);
 const saved=JSON.parse(JSON.stringify({state:s,continuity:C.history()}));
 for(let repeat=0;repeat<7;repeat++){
  const coffee=c.Interlude.create();c.Interlude.speak(coffee,'cafe1');
  const occurrences=(JSON.stringify(coffee.dialogueLines).match(/A lembrança não responde a Jinx/g)||[]).length;
  assert.equal(occurrences,1,'Repeated café must contain one contextual memory');counts.push(occurrences);
  assert.equal(canonical(),initial,'Canonical dialogue was mutated');
 }
 const recall=box();C.render(recall,7,'heard',0);assert(recall.children.some(x=>x.className.includes('ghost-memory-recall')),'Earned memory reaches chapter 7');
 C.reset();assert.equal(C.history().bridgeCup,null);
 let fresh=c.Interlude.create();c.Interlude.speak(fresh,'cafe1');assert(!JSON.stringify(fresh.dialogueLines).includes('A lembrança não responde a Jinx'));
 C.restore(saved.continuity);s=JSON.parse(JSON.stringify(saved.state));s.mode='playing';s.phase='missing';c.state=s;
 use(s,'cups');assert.equal(s.flags.cupsAftermath,true);assert.equal(C.history().bridgeCup,choice);
 let restored=c.Interlude.create();c.Interlude.speak(restored,'cafe1');assert.equal((JSON.stringify(restored.dialogueLines).match(/A lembrança não responde a Jinx/g)||[]).length,1);
 assert.equal(canonical(),initial);
}
for(const id of ['fridge','records']){
 const s=G.create();s.stage='apartment';s.phase='missing';c.state=s;use(s,id);
 assert.equal(s.mode,'playing');assert.equal(s.events.find(x=>x.type==='radio').who,'SIERRA','No absent Alexandra dialogue');
}
C.reset();let s=G.create();s.stage='apartment';c.state=s;G.speak(s,'auraCall');c.ghostChoose(1);
assert.equal(s.flags.privacyProtocol,true);s.x=1800;G.phase(s,'arrival');const boundaryTarget=s.auraTarget;
const noBoundary=G.create();noBoundary.stage='apartment';noBoundary.x=1800;G.phase(noBoundary,'arrival');assert(boundaryTarget<noBoundary.auraTarget);
s.phase='team';s.mode='playing';s.events=[];use(s,'desk');assert.equal(s.flags.permissionGiven,true);assert.equal(s.events.find(e=>e.type==='radio').who,'AURA');
C.capture(s);const privacy=C.history();C.reset();assert.equal(C.history().bridgePrivacy,false);C.restore(privacy);assert.equal(C.history().bridgePrivacy,true);
for(let i=0;i<3;i++){
 s=G.create();c.state=s;G.speak(s,'intimacy');c.ghostChoose(i);assert.equal(s.nearChoice,null);
 s.response=null;s.dialogueStep=3;c.ghostChoose(i);assert.equal(s.nearChoice,['evidence','jealous','boundary'][i]);
}
assert(vm.runInContext("IntervalStory.aftermath.some(x=>x.text.includes('SINAL VITAL ENCERRADO'))",c));
assert.equal(canonical(),initial);C.reset();assert.equal(C.history().bridgeCup,null);
console.log('PASS live narrative: 21 repeated café scenes, three cup branches, reset and restore, chapters 6/7/8 consequences, privacy, canonical choices, no shared-state mutation');

// Invoke the real chapter-6 key handler with no mixer button in the ECHO view.
let echoKey,backClicks=0;
c.Image=class{};c.qaListen=(target,type,handler)=>{if(type==='keydown')echoKey=handler;};
c.$=id=>id==='ghostScan'?null:{classList:{add(){},remove(){}},click(){if(id==='ghostBack')backClicks++;}};
vm.runInContext(fs.readFileSync(path.join(root,'ghost.js'),'utf8'),c,{filename:'ghost.js'});
c.state=G.create();c.state.mode='ghostPuzzle';c.state.puzzleKind='ghost';c.state.trace=4;
const event=code=>({code,repeat:false,target:{closest(){return null}},preventDefault(){},stopImmediatePropagation(){}});
assert.doesNotThrow(()=>echoKey(event('KeyQ')));assert.equal(c.state.trace,4);assert.equal(c.state.mode,'ghostPuzzle');
echoKey(event('Escape'));assert.equal(backClicks,1);
console.log('PASS ECHO keyboard: Q without a mixer button is safe; Escape still closes the panel');
