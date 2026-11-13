'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={NeoRuntime:{reset(){},closest(s,objects,range){return objects.find(o=>Math.abs(o.x-s.x)<=range)||null},delta(v){return v},motion(){},scan(){},follow(){},placeCompanion(){}},console};
ctx.globalThis=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'prelude-engine.js'),'utf8'),ctx);
assert.equal(ctx.Prelude.widths.home,1200,'The real prologue loads first in index.html');
vm.runInContext(fs.readFileSync(path.join(root,'ghost-engine.js'),'utf8'),ctx);
function interact(s,id){s.mode='playing';s.x=ctx.Ghost.objects(s).find(o=>o.id===id).x;s.useWas=false;ctx.Ghost.step(s,{use:true},.016);}
let s=ctx.Ghost.create();interact(s,'pc');assert.equal(s.flags.pcChecked,true);assert(s.journal.some(n=>n.id==='home-pc'));let count=s.journal.length;s.useWas=false;interact(s,'pc');assert.equal(s.journal.length,count,'no duplicate journal entries');
s=ctx.Ghost.create();s.stage='apartment';s.phase='missing';interact(s,'bedroom');assert.equal(s.flags.bedroom,true);assert(s.journal.some(n=>n.id==='empty-bedroom'));assert.equal(s.phase,'missing','inspection alone cannot skip missing-person sequence');
s=ctx.Ghost.create();s.stage='apartment';s.phase='explore';interact(s,'bedroom');assert.equal(s.flags.privateRoomRespected,true);assert(s.journal.some(n=>n.id==='privacy'));assert.equal(s.phase,'explore','respectful choice does not force a chapter transition');
const interlude=fs.readFileSync(path.join(root,'interlude.js'),'utf8');assert(interlude.includes('ctx.scale(1,1);coffeeActor'));assert(!interlude.includes('ctx.scale(1.22,1.22);coffeeActor'));
console.log('PASS P1: 3 environmental interactions, journal persistence, no duplication, narrative phase guards, cafe render scale');
