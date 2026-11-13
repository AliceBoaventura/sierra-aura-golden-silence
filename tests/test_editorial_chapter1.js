/* Regression for chapter 1's existing quest and narrative engines. Not a browser playthrough. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const ctx=vm.createContext({console,window:null,globalThis:null});ctx.window=ctx;ctx.globalThis=ctx;
for(const file of ['runtime.js','npc-quests.js','story-continuity.js','prelude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const tests=[];
function check(name,fn){try{fn();tests.push({name,pass:true});console.log('PASS',name);}catch(err){tests.push({name,pass:false,error:String(err.stack||err)});console.error('FAIL',name,err.message);}}
function inDistrict(){const s=ctx.Prelude.create();s.stage='district';s.flags.repair=true;s.flags.signature=true;s.flags.power=true;s.x=3970;s.useWas=false;return s;}
function exitDistrict(s){s.mode='playing';s.useWas=false;s.x=3970;ctx.Prelude.step(s,{use:true},.035);assert.equal(s.stage,'trace');}
check('The opening screen does not reveal chapter 3 time stamp',()=>{
 const text=fs.readFileSync(path.join(root,'prelude-engine.js'),'utf8');
 assert(!text.includes('amanhã, às 04:47'));
 assert(!text.includes('registro de acesso perdeu seis minutos'));
 assert(text.includes('intervalo em branco')); 
});
check('First talk with Neri offers three different choices',()=>{
 const s=inDistrict();const opts=ctx.NPCQuests.options(s,'patient');
 assert.deepEqual(Array.from(opts,x=>x.value),['accept','escort','decline']);
 assert(ctx.Prelude.dialogue(s,'patient').some(x=>x[1].includes('autoriza a correção')));
});
check('Neri rescue needs prior acceptance and scanner confirmation',()=>{
 const s=inDistrict();s.x=1860;
 assert(!s.flags.neriSaved);
 assert(ctx.NPCQuests.onObject(s,'clinic').includes('triagem'));
 ctx.NPCQuests.choose(s,'patient','accept');
 assert(ctx.NPCQuests.onObject(s,'clinic').includes('SCAN'));
 assert(!s.flags.neriSaved);
 s.progress.clinic=1;
 assert(ctx.NPCQuests.onObject(s,'clinic').includes('autorização'));
 assert.equal(s.flags.neriOutcome,'rescued');
 assert.equal(ctx.NPCQuests.status(s,'patient'),'complete');
 exitDistrict(s);
 assert.equal(s.flags.neriOutcome,'rescued');
 ctx.StoryContinuity.capture(s);
 assert.equal(ctx.StoryContinuity.history().neri,'rescued');
});
check('Jinx contacts the daughter without claiming treatment',()=>{
 const s=inDistrict();const lines=ctx.NPCQuests.choose(s,'patient','escort');
 assert(lines.some(l=>l[0]==='DONA NERI'&&l[1].includes('ainda não me atendeu')));
 assert.equal(s.flags.neriOutcome,'escorted');assert.equal(s.flags.neriSaved,false);
 exitDistrict(s);ctx.StoryContinuity.capture(s);
 assert.equal(ctx.StoryContinuity.history().neri,'escorted');
});
check('Leaving with active Neri case records unresolved consequence',()=>{
 const s=inDistrict();ctx.NPCQuests.choose(s,'patient','accept');
 exitDistrict(s);
 assert.equal(s.flags.neriOutcome,'left');
 assert.equal(ctx.NPCQuests.status(s,'patient'),'declined');
 assert(s.events.some(e=>e.text?.includes('ficou do lado de fora')));
 assert(s.events.findIndex(e=>e.type==='transition') < s.events.findIndex(e=>e.type==='radio'&&e.speaker==='JINX'&&e.text?.includes('ficou do lado de fora'))); 
 ctx.StoryContinuity.capture(s);
 assert.equal(ctx.StoryContinuity.history().neri,'left');
});
check('Walking past Neri without interaction is not silently counted as a rescue',()=>{
 const s=inDistrict();exitDistrict(s);
 assert.equal(s.flags.neriOutcome,'left');assert.equal(s.flags.neriSaved,false);
});
check('Explicit refusal is not overwritten by departure',()=>{
 const s=inDistrict();ctx.NPCQuests.choose(s,'patient','decline');
 assert.equal(s.flags.neriOutcome,'left');exitDistrict(s);
 assert.equal(s.flags.neriOutcome,'left');
 assert(!s.events.some(e=>e.text?.includes('ficou do lado de fora')));
});
check('Lia reacts to the actual clinic outcome, not an invented one',()=>{
 const s=inDistrict();s.npcMood.vendor=true;
 assert(ctx.Prelude.dialogue(s,'vendor')[0][1].includes('quadro voltou'));
 s.flags.neriOutcome='rescued';
 assert(ctx.Prelude.dialogue(s,'vendor')[0][1].includes('Neri entrou'));
 s.flags.neriOutcome='escorted';
 assert(ctx.Prelude.dialogue(s,'vendor')[0][1].includes('filha da Neri'));
 s.flags.neriOutcome=undefined;s.flags.repair=false;
 assert(ctx.Prelude.dialogue(s,'vendor')[0][1].includes('Mara ainda'));
});
check('Chapter-1 consequence survives continuity snapshot and restoration',()=>{
 const s=inDistrict();exitDistrict(s);ctx.StoryContinuity.capture(s);
 const snapshot=JSON.parse(JSON.stringify({flags:s.flags,quests:s.quests,memory:ctx.StoryContinuity.history()}));
 ctx.StoryContinuity.reset();ctx.StoryContinuity.restore(snapshot.memory);
 assert.equal(ctx.StoryContinuity.history().neri,'left');
 assert.equal(snapshot.flags.neriOutcome,'left');
 assert.equal(snapshot.quests.neriCare,'declined');
});
const pass=tests.filter(t=>t.pass).length;
console.log(`EDITORIAL C1 RESULT ${pass}/${tests.length}`);
process.exitCode=pass===tests.length?0:1;
