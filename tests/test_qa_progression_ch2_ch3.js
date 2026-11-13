'use strict';
// QA progressão atual: movimento real, E/SCAN e relés sem puzzle extra (RC67).
// Respostas de diálogos HTML são representadas apenas pelos efeitos do callback.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),c={console};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['runtime.js','apartment-engine.js','uprising-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const log=[];
function use(engine,s){engine.step(s,{},.03);engine.step(s,{use:true},.03);const out=s.events.splice(0);engine.step(s,{},.03);return out;}
function walk(engine,s,x,scan=false){let n=0;while(Math.abs(s.x-x)>5&&n++<1500){engine.step(s,{[s.x<x?'right':'left']:true,scan},.03);if(s.mode!=='playing')break;}assert(n<1500,`walking stalled at ${s.x}, goal ${x}`);return s.x;}
const a=c.Apartment.create();
walk(c.Apartment,a,310);use(c.Apartment,a);assert(a.flags.mirror);log.push('C2 espelho');
walk(c.Apartment,a,850,true);for(let i=0;i<50;i++)c.Apartment.step(a,{scan:true},.03);assert(a.flags.trace);log.push('C2 rastro scanner');
walk(c.Apartment,a,1470);use(c.Apartment,a);assert(a.flags.shelf);log.push('C2 passagem');
walk(c.Apartment,a,2150);use(c.Apartment,a);assert(a.flags.terminal);log.push('C2 terminal');
walk(c.Apartment,a,1850);use(c.Apartment,a);assert(a.flags.power);log.push('C2 energia');
walk(c.Apartment,a,2450);for(let i=0;i<100;i++)c.Apartment.step(a,{},.03);assert(a.flags.recognized);let ev=use(c.Apartment,a);assert(ev.some(e=>e.type==='encounter'));assert.equal(a.mode,'dialogue');
a.flags.metAura=true;a.mode='playing';a.useWas=true;log.push('C2 encontro acionado');
walk(c.Apartment,a,2250);ev=use(c.Apartment,a);assert(ev.some(e=>e.type==='repairTogether'));assert.equal(a.mode,'dialogue');
a.flags.repairedTogether=true;a.mode='playing';log.push('C2 bancada desbloqueada');
const s=c.Uprising.create();
walk(c.Uprising,s,2160);ev=use(c.Uprising,s);assert(ev.some(e=>e.type==='talk'));assert.equal(s.mode,'dialogue');s.flags.talked=true;s.mode='playing';
walk(c.Uprising,s,1900);ev=use(c.Uprising,s);assert(ev.some(e=>e.type==='memory'));s.flags.memory=true;s.mode='playing';
walk(c.Uprising,s,2390);ev=use(c.Uprising,s);assert.equal(s.mode,'playing');assert(s.flags.upgraded);assert(ev.some(e=>e.type==='upgraded'));assert.equal(s.puzzle,null,'The removed eye rotation puzzle must not return');log.push('C3 encontro + arquivo + sincronização do olho');
walk(c.Uprising,s,1580);use(c.Uprising,s);assert.equal(s.stage,'relay');log.push('C3 entrada nos relés');
for(let i=0;i<3;i++){
 const node=s.nodes[i];walk(c.Uprising,s,node.x);
 // Scanner must be held long enough to reveal the physical relay.
 for(let k=0;k<34;k++)c.Uprising.step(s,{scan:true},.03);
 assert(node.revealed,`relay ${i} not scanned`);
 ev=use(c.Uprising,s);assert.equal(s.mode,'playing',`relay ${i} must isolate directly`);
 assert.equal(s.puzzle,null,'No forced tile puzzle after scanner');
 assert(node.found);assert(ev.some(e=>e.type==='node'&&e.index===i));assert.equal(s.checkpoint,node.x+120);
 log.push(`C3 relé ${i+1} completo`);
}
walk(c.Uprising,s,3100);ev=use(c.Uprising,s);assert(ev.some(e=>e.type==='ending'));assert.equal(s.mode,'dialogue');
assert(s.nodes.every(n=>n.found));log.push('C3 extração desbloqueada');
console.log(JSON.stringify({status:'PASS',steps:log,notes:'Movimento e SCAN simulados no motor Node; callbacks de diálogos representados por flags; não é playtest visual.'},null,2));
