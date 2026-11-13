'use strict';
// RC67 removed the former three tile puzzles deliberately; test the active real-world circuit.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const NeoRuntime={reset(){},retry(){},delta:d=>d,closest:()=>null,motion(){},land(s){s.y=800;s.grounded=true},scan(s,on){s.scan=!!on;s.energy=Math.max(0,s.energy-(on?.01:0))}};
const ctx={window:{},NeoRuntime,console,Math,performance:{now:()=>0}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'uprising-engine.js'),'utf8'),ctx);
const U=ctx.window.Uprising;assert(U);assert.equal(typeof U.solve,'undefined','Removed tile-puzzle solver must remain absent');
for(let id=0;id<3;id++){
 const s=U.create();U.startRelay(s);
 for(let j=0;j<id;j++){s.nodes[j].found=true;s.nodes[j].revealed=true}
 s.x=[700,1630,2520][id];s.y=800;s.useWas=false;
 for(let k=0;k<36;k++)U.step(s,{scan:true},.03);
 assert(s.nodes[id].revealed,'SCAN can reveal active relay '+id);
 U.step(s,{use:true,scan:false},.03);
 assert(s.nodes[id].found,'USE isolates relay '+id);
 assert.equal(s.mode,'playing','Isolation preserves playable corridor');
 assert.equal(s.puzzle,null,'No deleted tile puzzle');
 assert.equal(s.checkpoint,s.nodes[id].x+120);
 assert(s.events.some(e=>e.type==='node'&&e.index===id),'Node isolation event emitted');
 const count=s.events.filter(e=>e.type==='node').length;
 U.step(s,{},.03);U.step(s,{use:true},.03);
 assert.equal(s.events.filter(e=>e.type==='node').length,count,'Relay does not duplicate success');
}
const ui=fs.readFileSync(path.join(root,'uprising.js'),'utf8');
assert(!ui.includes('showAfterRelayChoice'),'No personal choice in the combat corridor');
assert(!ui.includes('chooseLinkReciprocity'),'Shared memories belong on terrace, not during extraction');
assert(ui.includes('ChapterCurtain.to(4,beginTerrace)'),'Extraction transitions to safety');
const terrace=fs.readFileSync(path.join(root,'terrace-story.js'),'utf8');
assert(terrace.includes("root.StoryContinuity?.record('linkKeaneSignal'"),'Keane privacy choice persisted in safe Chapter 4');
assert(terrace.includes("root.StoryContinuity?.record('auraPromise'"),'Chapter 4 intention preserved for next chapter');
assert(!ui.includes('B/C CIFRADOS'),'Obsolete tile-puzzle UI not revived');
const sc=fs.readFileSync(path.join(root,'story-continuity.js'),'utf8');
assert(sc.includes("linkReciprocity:['deep','limited']"),'Privacy paths remain valid');
console.log('PASS RC67 active Enlace: scanner, 3 direct relay isolations, checkpoints, single-fire events and consent branches');
