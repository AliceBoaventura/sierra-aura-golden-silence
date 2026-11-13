'use strict';
// Chapter 6 motor with actual dialogue handlers, exploration, SCAN, sleep, disappearance and GHOST_TRACK.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const root=path.resolve(__dirname,'..');
const c={console,camX:0,W:1280,StoryContinuity:{record() {},history:()=>({evidencePath:'trace'})},renderGhostDialogue(){},ghostEvents(){},radio(){},clearControl(){},$:()=>({classList:{add(){}}})};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['runtime.js','prelude-engine.js','ghost-engine.js','ghost-story.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const G=c.Ghost,s=G.create(),log=[];c.state=s;
function dialogue(){let n=0;while(s.mode==='ghostDialogue'&&n++<100){c.ghostChoose(0);c.ghostAdvance();}assert(n<100,`dialogue stuck ${s.dialogue}`);}
function tick(i={},n=1){for(let k=0;k<n;k++){G.step(s,i,.03);if(s.mode==='ghostDialogue')dialogue();}}
function walk(x){let n=0;while(Math.abs(s.x-x)>6&&n++<1500){tick({[s.x<x?'right':'left']:true});assert.equal(s.mode,'playing',`walk blocked ${s.stage}/${s.phase}/${s.mode}`);}assert(n<1500,`walk stalled ${s.stage}/${s.phase} ${s.x} target ${x}`);}
function use(x){walk(x);tick();tick({use:true});tick();dialogue();}
use(G.objects(s).find(o=>o.id==='comm').x);assert(s.flags.invited);use(G.objects(s).find(o=>o.id==='leave').x);assert.equal(s.stage,'apartment');assert.equal(s.phase,'explore');log.push('C6 convite e entrada no apartamento');
use(1560);assert.equal(s.phase,'mix');use(1560);assert.equal(s.mode,'ghostPuzzle');s.channels=[false,false,false,false,false,true];s.flags.spectrum=true;assert(G.solve(s));dialogue();assert.equal(s.phase,'work');log.push('C6 gravação e isolamento dos seis canais');
use(1950);assert.equal(s.phase,'floor');use(1560);assert.equal(s.phase,'decoded');use(480);assert.equal(s.mode,'ghostSleep');tick({},305);assert.equal(s.phase,'missing');dialogue();log.push('C6 rotina, sono e desaparecimento');
for(const x of [120,560,2440,1950])use(x);assert(s.flags.door&&s.flags.bath&&s.flags.bedroom&&s.flags.belongings);use(480);assert.equal(s.phase,'echo');log.push('C6 busca nos cômodos');
for(const x of G.traceX){walk(x);tick({scan:true},45);}assert.equal(s.trace,4);use(2250);assert.equal(s.phase,'call');use(1560);assert.equal(s.phase,'arrival');tick({},400);assert.equal(s.phase,'team');log.push('C6 ECHO 04:47, chamada e chegada da equipe');
use(2250);assert.equal(s.phase,'ghost');use(1560);assert.equal(s.mode,'ghostPuzzle');s.flags.spectrum=true;G.speak(s,'packet');dialogue();assert.equal(s.phase,'ready');use(2250);assert.equal(s.mode,'ghostFuture');tick({},120);assert.equal(s.mode,'won');log.push('C6 GHOST_TRACK_47, registro e conclusão');
console.log(JSON.stringify({status:'PASS',steps:log,notes:'Motor Node e handlers de diálogo reais; clique do puzzle ECHO representado pela escolha correta; sem renderização no navegador.'},null,2));
