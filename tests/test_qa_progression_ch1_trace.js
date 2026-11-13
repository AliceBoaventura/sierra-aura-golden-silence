'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const root=path.resolve(__dirname,'..');const c={console};c.window=c;c.globalThis=c;vm.createContext(c);for(const f of ['runtime.js','npc-quests.js','story-continuity.js','prelude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const P=c.Prelude,s=P.create();s.stage='trace';s.x=150;const log=[];
function tick(i={},n=1){for(let k=0;k<n;k++)P.step(s,i,.03)}
function walk(x){let n=0;while(Math.abs(s.x-x)>7&&n++<1300){tick({[s.x<x?'right':'left']:true});assert.equal(s.mode,'playing');}assert(n<1300,`trace walk stuck at ${s.x} target ${x}`);}
function use(x){walk(x);tick();tick({use:true});tick();}
walk(500);tick({scan:true},40);use(500);assert(s.flags.terminal);log.push('C1 terminal offline recuperado');
use(1400);assert(s.flags.credential);log.push('C1 credencial');
use(2020);assert(s.flags.camera);log.push('C1 câmera');
use(3660);assert.equal(s.stage,'approach');assert(s.flags.liftArchive);log.push('C1 elevador opcional, registro preservado');
use(600);assert(s.flags.intercomChecked);walk(2050);assert(s.door);use(2130);assert.equal(s.mode,'won');assert(s.events.some(e=>e.type==='apartment'));log.push('C1 interfone, porta e acesso ao capítulo 2');
console.log(JSON.stringify({status:'PASS',steps:log,notes:'Inicia em trace para isolar a segunda metade do capítulo; primeira metade testada em test_editorial_chapter1_walkthrough.js.'},null,2));
