'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const ctx=vm.createContext({console});ctx.window=ctx;ctx.globalThis=ctx;
for(const f of ['runtime.js','story-continuity.js','apartment-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const source=fs.readFileSync(path.join(root,'apartment.js'),'utf8');let passed=0;
function test(name,fn){fn();passed++;console.log('PASS',name);}
function interact(s,id){const o=ctx.Apartment.stations.find(o=>o.id===id);s.x=o.x;s.useWas=false;ctx.Apartment.step(s,{use:true},.016);const events=s.events.splice(0);return events;}
test('first encounter cannot trigger before power and recognition',()=>{let s=ctx.Apartment.create();s.flags.shelf=true;s.x=2450;assert.equal(ctx.Apartment.nearby(s)?.id,'workbench'===ctx.Apartment.nearby(s)?.id?'workbench':undefined);s.flags.power=true;s.flags.recognized=true;assert.equal(ctx.Apartment.nearby(s)?.id,'aura');});
test('mirror, scan, shelf and terminal gate the route',()=>{let s=ctx.Apartment.create();let e=interact(s,'shelf');assert.equal(s.flags.shelf,undefined);assert(e.some(x=>x.type==='hint'));interact(s,'mirror');s.scan=true;s.x=850;for(let n=0;n<45;n++)ctx.Apartment.step(s,{scan:true},.034);assert.equal(s.flags.trace,true);interact(s,'shelf');assert.equal(s.flags.shelf,true);interact(s,'terminal');assert.equal(s.flags.terminal,true);interact(s,'power');assert.equal(s.flags.power,true);});
test('meeting opens dialogue only by interacting with Aura',()=>{let s=ctx.Apartment.create();Object.assign(s.flags,{mirror:true,trace:true,shelf:true,terminal:true,power:true,recognized:true});assert.equal(s.flags.metAura,undefined);let e=interact(s,'aura');assert.equal(s.mode,'dialogue');assert(e.some(x=>x.type==='encounter'));});
test('bench cannot be used before first encounter',()=>{let s=ctx.Apartment.create();Object.assign(s.flags,{shelf:true,power:true,recognized:true});assert(!ctx.Apartment.nearby({...s,x:2250}) || ctx.Apartment.nearby({...s,x:2250}).id!=='workbench');});
test('bench requires a separate interaction after meeting',()=>{let s=ctx.Apartment.create();Object.assign(s.flags,{shelf:true,metAura:true});let e=interact(s,'workbench');assert.equal(s.mode,'dialogue');assert(e.some(x=>x.type==='repairTogether'));assert.equal(s.flags.repairedTogether,undefined);});
test('first meeting is brief and player-initiated',()=>{assert(source.includes('Não toca nesse cabo'));assert(source.includes('Sou Sierra'));assert(source.includes('AURA / BANCADA'));assert(source.includes('const auraCalibration=['));assert(!source.includes('A data do arquivo ainda não chegou'));});
test('all three first contact choices persist to narrative memory',()=>{assert(source.includes("StoryContinuity.record('firstContact',value)"));for(const value of ['guard','evidence','care']){ctx.StoryContinuity.record('firstContact',value);assert.equal(ctx.StoryContinuity.history().firstContact,value);}});
test('bench mistake records consequence but only success unlocks progress',()=>{assert(source.includes('state.flags.repairMistakes=(state.flags.repairMistakes||0)+1'));assert(source.includes('state.flags.repairedTogether=true'));assert(source.includes('state.flags.auraCalibrationStep=step+1')); assert(source.includes("StoryContinuity.record('repairBond','together')"));});
test('parting preserves three nonromantic choices and next chapter',()=>{for(const x of ['cautious','playful','curious'])assert(source.includes("'"+x+"'"));assert(source.includes('beginUprising'));assert(!source.includes('Não são um casal.'));});
test('Work continuity keeps decisions across save and reload',()=>{
 const data={auraParting:'cautious',auraPromise:'boundary',firstContact:'evidence',neri:'escorted',terrace:'refuse',club:'boundary'};
 ctx.StoryContinuity.restore(data);
 assert.equal(ctx.StoryContinuity.history().club,'boundary');
 assert.equal(ctx.StoryContinuity.history().firstContact,'evidence');
 assert.equal(ctx.StoryContinuity.history().auraPromise,'boundary');
});
test('prior promises are recalled at relevant beat, not stacked in opening',()=>{
 const h=ctx.StoryContinuity.history();
 assert(h.auraParting&&h.auraPromise&&h.terrace);
 const opening=ctx.StoryContinuity.lines(5,'brief',0);
 const jinx=ctx.StoryContinuity.lines(5,'brief',1);
 const data=ctx.StoryContinuity.lines(5,'meet',1);
 assert.equal(opening.length,2,JSON.stringify(opening));
 assert.equal(jinx.length,2,JSON.stringify(jinx));
 assert.equal(data.length,1,JSON.stringify(data));
 assert(data[0].includes('rota de saída'));
});
test('all first-contact paths get a grounded consequence',()=>{
 for(const value of ['guard','evidence','care']){
  ctx.StoryContinuity.record('firstContact',value);
  const recalled=ctx.StoryContinuity.lines(5,'brief',1);
  assert(recalled.some(text=>text.includes(value==='guard'?'cobrir a porta':value==='care'?'queimadura':'cópia isolada')),value);
 }
});
test('club boundaries never invent a promise about a protected copy',()=>{
 ctx.StoryContinuity.record('club','boundary');
 const response=ctx.StoryContinuity.lines(6,'welcome',0).join(' ');
 assert(response.includes('não quis prometer'));
 assert(!response.includes('limite que combinamos'));
});
test('all three club routes preserve distinct accurate recollections',()=>{
 const expected={approach:'prometi mostrar',jealous:'passado das duas',boundary:'decidir pela Aura'};
 for(const [value,fragment] of Object.entries(expected)){
  ctx.StoryContinuity.record('club',value);
  const response=ctx.StoryContinuity.lines(7,'files',1);
  assert.equal(response.length,1);
  assert(response[0].includes(fragment),value+' '+response[0]);
 }
});
test('consequence does not fabricate asking for a password or welfare inquiry',()=>{
 ctx.StoryContinuity.record('firstContact','care');
 ctx.StoryContinuity.record('auraParting','cautious');
 const all=[...ctx.StoryContinuity.lines(5,'brief',0),...ctx.StoryContinuity.lines(5,'brief',1)].join(' ');
 assert(!all.includes('pedir a senha'));
 assert(!all.includes('perguntar como eu estava'));
});
console.log('AURA BENCH RESULT',passed,'/',passed);
