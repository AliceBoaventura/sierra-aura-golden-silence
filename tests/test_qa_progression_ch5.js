'use strict';
// Chapter 5 mechanical route with real scanner, gate/latch timing and puzzle.
// Dialogue completion callbacks from club.js are represented as the documented state effects.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const root=path.resolve(__dirname,'..');
const c={console,ClubCrowd:{visitors:[]}};c.window=c;c.globalThis=c;vm.createContext(c);for(const f of ['runtime.js','club-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const C=c.Club,s=C.create(),log=[];
function tick(i={},n=1){for(let k=0;k<n;k++)C.step(s,i,.03)}
function walk(x){let n=0;while(Math.abs(s.x-x)>7&&n++<1100){tick({[s.x<x?'right':'left']:true});assert.equal(s.mode,'playing',`movement blocked in ${s.stage}: ${s.mode}`);}assert(n<1100,`walk stalled ${s.stage} x=${s.x} target=${x}`);}
function use(x){walk(x);tick();tick({use:true});const ev=s.events.splice(0);tick();return ev;}
walk(620);tick({scan:true},35);assert(s.flags.gateRead);use(620);tick({},65);assert(s.flags.gate);log.push('C5 entrada soldada + Jinx');
use(2520);assert.equal(s.mode,'clubDialogue');assert.equal(s.dialogue,'meet');s.flags.met=true;s.mode='playing';s.useWas=true;log.push('C5 encontro com Alexandra');
use(3220);assert.equal(s.stage,'booth');assert.equal(s.mode,'clubDialogue');s.mode='playing';s.useWas=true;
use(410);assert(s.flags.record);s.mode='playing';s.useWas=true;
use(1230);assert.equal(s.mode,'clubPuzzle');assert.equal(C.solve(s),false);s.puzzle.phase=s.puzzle.targetPhase;s.puzzle.filter=s.puzzle.targetFilter;assert(C.solve(s));assert(s.flags.correlated);s.mode='playing';s.useWas=true;log.push('C5 fita + puzzle de sinal');
use(1730);assert(s.flags.module);s.mode='playing';s.useWas=true;
use(2070);assert.equal(s.dialogue,'closeness');s.flags.evidencePath='trace';C.change(s,'raid');s.mode='playing';s.flags.raid=true;s.useWas=true;log.push('C5 módulo e rota de saída');
use(3160);assert.equal(s.stage,'escape');log.push('C5 fuga pela saída dos fundos');
walk(1370);tick({scan:true},35);assert(s.flags.latchRead);use(1370);assert.equal(s.mode,'playing','opening latch cannot pause the escape');assert(s.flags.latch);log.push('C5 trinco de fuga');
use(2630);assert.equal(s.dialogue,'boarding');C.change(s,'drive');s.mode='playing';s.useWas=true;tick({},105);assert.equal(s.dialogue,'cadillacPulse');s.mode='playing';s.useWas=true;tick({},170);assert.equal(s.dialogue,'return');log.push('C5 Cadillac e ligação de Aura');
console.log(JSON.stringify({status:'PASS',steps:log,notes:'Caminhada, SCAN, puzzle e portas no motor Node; diálogos via efeitos simulados dos callbacks HTML.'},null,2));
