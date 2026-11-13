'use strict';
// Integration-level state checks in a Node VM; not a real browser playthrough.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const world={
  console,
  NeoRuntime:{
    closest(s,items,r){return items.filter(x=>Math.abs(x.x-s.x)<=r).sort((a,b)=>Math.abs(a.x-s.x)-Math.abs(b.x-s.x))[0]||null;},
    motion(){}, flatGround(s){s.y=800;s.grounded=true;}, scan(s){s.scan=false;},
    delta:d=>d,reset(){},follow(){},placeCompanion(){}
  },
  SharedMoments:{reset(){}},
  InterludeStory:{cafe1:[{who:'SIERRA',text:'Cena do café',choiceKey:'alex',choices:[]}]},
  RC37Adaptation:{cafeBeat:()=>[]}
};world.globalThis=world;
vm.createContext(world);
for (const f of ['story-continuity.js','apartment-engine.js','ghost-engine.js','interlude-engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),world,{filename:f});
}
let checks=0;
function check(v,message){assert.ok(v,message);checks++;}
function useApartment(s,x){s.x=x;s.useWas=false;world.Apartment.step(s,{use:true},.016);const out=s.events.slice();s.events.length=0;return out;}
// One-time discovery, then explicit feedback instead of duplicate story event.
for(const [id,x] of [['cup',680],['drawer',1120]]) {
  let s=world.Apartment.create();
  let first=useApartment(s,x);
  check(first.filter(e=>e.type==='story'&&e.id===id).length===1,`${id}: first discovery`);
  let second=useApartment(s,x);
  check(second.filter(e=>e.type==='story').length===0,`${id}: no repeated discovery`);
  check(second.some(e=>e.type==='hint'),`${id}: repeat feedback`);
}
// Exploration state propagates across chapter boundaries only after capture/restore.
{
 const a=world.Apartment.create();a.flags.vinyl=true;a.flags.glove=true;
 world.StoryContinuity.capture(a);
 let m=world.StoryContinuity.history();
 check(m.auraVinyl==='found'&&m.auraGlove==='found','optional apartment clues captured');
 world.StoryContinuity.restore(JSON.parse(JSON.stringify(m)));
 check(world.StoryContinuity.history().auraVinyl==='found','optional clues restore');
 const s=world.Interlude.create();s.flags.recordSeen=true;
 world.Interlude.speak(s,'cafe1');
 check(s.dialogueLines.some(x=>x.text.includes('vinil sem capa')),'vinyl remembered in cafe');
 check(s.dialogueLines.some(x=>x.text.includes('última gravação dos drones')),'record remembered in cafe');
 world.StoryContinuity.reset();
 check(!world.StoryContinuity.history().auraVinyl,'new game clears optional clues');
}
// Ghost Track: repeated record interaction does not replay the reveal.
{
 const s=world.Ghost.create();s.stage='apartment';s.phase='explore';s.mode='playing';s.x=820;s.useWas=false;
 world.Ghost.step(s,{use:true},.016);
 check(s.flags.records===true&&s.dialogue==='records','first record reveals scene');
 s.mode='playing';s.useWas=false;s.events.length=0;
 world.Ghost.step(s,{use:true},.016);
 check(!s.events.some(e=>e.type==='dialogue'),'record repeat does not re-open dialogue');
 check(s.events.some(e=>e.type==='radio'),'record repeat has feedback');
}
// Interlude: real interactions respond differently according to chapter state.
function act(s,stage,x){s.stage=stage;s.mode='playing';s.x=x;s.useWas=false;s.events.length=0;world.Interlude.step(s,{use:true},.016);return s.events.slice();}
{
 let s=world.Interlude.create();let a=act(s,'home',900);
 check(a.some(e=>e.type==='record')&&s.flags.recordSeen,'record can be opened once');
 let b=act(s,'home',900);
 check(b.some(e=>e.type==='self')&&!b.some(e=>e.type==='record'),'repeat record yields reflection');
 let c=act(s,'home',1540);
 check(c.some(e=>e.type==='self')&&s.stage==='home','early exit explains missing prerequisite');
 let d=act(s,'cafe',805);
 check(d.some(e=>e.type==='self')&&!s.flags.seated,'cannot sit for narrative without ordering');
 let e=act(s,'cafe',1570);
 check(s.dialogue==='order'&&e.some(ev=>ev.type==='dialogue'),'counter opens order dialogue');
 s.mode='playing';s.flags.ordered=true;
 let f=act(s,'cafe',1570);
 check(f.some(ev=>ev.type==='self')&&!f.some(ev=>ev.type==='dialogue'),'counter repeat has feedback');
 let g=act(s,'cafe',805);
 check(s.dialogue==='cafe1'&&g.some(ev=>ev.type==='dialogue'),'ordered coffee unlocks cafe conversation');
}
console.log(`PASS ${checks}/${checks} integration state/interaction checks (Node VM, not browser)`);
