'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');const c={console,StoryContinuity:{history:()=>({evidencePath:'trace'}),capture:()=>{}}};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['runtime.js','interval-story.js','interval-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const I=c.Interval,s=I.create(),log=[];
function dialogue(){let n=0;while(s.mode==='intervalDialogue'&&n++<80){const line=c.IntervalStory[s.dialogue][s.lineIndex];if(line.choices)I.choose(s,0);else I.advance(s);}assert(n<80,'dialogue never ends');}
function tick(input={},count=1){for(let j=0;j<count;j++){I.step(s,input,.03);if(s.mode==='intervalDialogue')dialogue();}}
function walk(x){let n=0;while(Math.abs(s.x-x)>5&&n++<1100){tick({[s.x<x?'right':'left']:true});}assert(n<1100,`cannot walk ${s.stage} to ${x}, stopped ${s.x}`);}
function use(x){walk(x);tick();tick({use:true});tick();dialogue();}
function solvePuzzle(){assert.equal(s.mode,'intervalPuzzle');const p=s.puzzle;for(let i=0;i<3;i++)for(let k=0;k<3&&p.paths[i]!== (p.kind==='hack'?p.target[i]:i);k++)I.rotate(s,i);assert(I.solve(s));dialogue();}
use(440);assert(s.flags.wrist);use(840);assert(s.flags.names);use(1240);solvePuzzle();assert(s.flags.patch);use(1670);assert(s.flags.pulse);use(2150);assert(s.flags.identified);use(2580);assert.equal(s.stage,'access');log.push('C7 Alexandra: patch, pulse, names, reader, escape');
for(let i=0;i<3;i++){
 const x=[670,1260,2410][i];walk(x);tick({scan:true},55);assert.equal(s.trace,i+1,`trace ${i} not recovered`);log.push(`C7 scanner rastro ${i+1}`);
 if(i===1){use(1830);tick({},65);assert(s.flags.brace,'Jinx brace not resolved');}
}
use(3160);assert.equal(s.stage,'archive');log.push('C7 entrada no arquivo');
use(570);assert(s.flags.files);use(1070);assert(s.flags.keane);use(1540);solvePuzzle();assert(s.flags.hack);use(2150);assert(s.flags.alive);walk(2570);tick({scan:true},3);assert(s.flags.secondRead);use(2570);assert.equal(s.mode,'intervalCapture');log.push('C7 terminal, segunda leitura, captura');
tick({},105);assert.equal(s.stage,'sacrifice');use(1240);assert(s.flags.override);walk(2150);tick({use:true},150);assert(s.flags.sacrificed);assert.equal(s.mode,'intervalExecution');log.push('C7 derivação e ponte física');
tick({},345);assert(s.flags.dead);assert(s.flags.bodyVisible);assert.equal(s.stage,'aftermath');dialogue();assert.equal(s.mode,'intervalDeparture');tick({},40);assert.equal(s.mode,'intervalMemorial');tick({},165);assert.equal(s.mode,'won');log.push('C7 morte definitiva e fim de capítulo');
console.log(JSON.stringify({status:'PASS',steps:log,notes:'Motor Node com caminhada, scanner, diálogos e puzzles; não substitui teste visual de navegador.'},null,2));
