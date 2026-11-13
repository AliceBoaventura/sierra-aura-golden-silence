// The optional Keane memory now appears in a safe Chapter-4 conversation, never in the relay room.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const c={console,sessionStorage:{removeItem(){}},SharedMoments:{reset(){}}};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['story-continuity.js','terrace-story.js','club-story.js','ghost-story.js','interlude-story.js','rc73-editorial-v104.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const C=c.StoryContinuity,T=c.Terrace;
const beat=T.beats.findIndex(x=>x.title==='O rádio sob a chuva');assert(beat>=0,'The Keane memory must be physically placed on the terrace');
for(const [option,choice] of [[0,'deep'],[1,'limited'],[2,'limited']]){
 C.reset();const s=T.create();s.beat=beat;assert(T.choose(s,option));
 assert.equal(C.history().linkReciprocity,choice);
 assert.equal(C.history().linkKeaneSignal,choice==='deep'?'revealed':'private');
 assert.equal(C.history().linkTrust,choice==='deep'?'shared-memory':'respected-boundary');
 const copy=C.history();C.reset();C.restore(copy);assert.equal(C.history().linkReciprocity,choice);
}
C.reset();assert.equal(C.history().linkReciprocity,undefined);
assert(!fs.readFileSync(path.join(root,'uprising.js'),'utf8').includes('chooseLinkReciprocity'), 'No memory choice inside the relay room');
console.log('PASS private memory consent, boundary, save/restore and correct scene');
