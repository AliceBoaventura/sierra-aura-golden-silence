'use strict';
// P43R: isolated engine/canvas assertions. These are NOT visual playtests.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const sandbox={console,StoryContinuity:{history:()=>({})}};
vm.createContext(sandbox);
for(const f of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f});
const engine=sandbox.Interlude;
let s=Object.assign(engine.create(),{stage:'depot',mode:'playing',useWas:false,x:454});
engine.step(s,{use:true},.025);assert.equal(s.mode,'playing','scanner-off cannot open a clue');
const initialEnergy=s.energy;
for(let j=0;j<50;j++)engine.step(s,{scan:true},.02);
assert.equal(s.scan,true);assert.equal(s.depotScanEnabled,true);assert(s.energy<initialEnergy,'hold Q drains power');
const spent=s.energy;
engine.step(s,{scan:false},.02);
assert.equal(s.scan,false,'Q release stops scanning');assert.equal(s.depotScanEnabled,false,'depot uses shared scanner state');
assert(s.energy>spent,'energy recharges once released');
s.useWas=false;engine.step(s,{scan:true,use:true},.02);
assert.equal(s.dialogue,'depotBoard','scanning and E discovers evidence');
let n=0;while(s.mode==='interludeDialogue'&&n++<50)engine.advance(s);
assert(s.flags.depotBoard,'discovery persists after scanning');
s=Object.assign(engine.create(),{stage:'depot',mode:'playing',x:454,energy:.01});
engine.step(s,{scan:true},.02);
assert.equal(s.scan,false,'scanner stops when depleted');assert.equal(s.depotScanEnabled,false);
engine.step(s,{scan:false},.5);assert(s.energy>0,'scanner recovers when input released');
// Extract only the sprite and scanner drawing helpers; no browser needed.
const src=fs.readFileSync(path.join(root,'interlude.js'),'utf8');
const start=src.indexOf('const depotP25Actors='),end=src.indexOf('function drawDepotCinematic(');
assert(start>=0&&end>start,'P43 actors section');
const calls=[];
class MockImage{
 constructor(){this.complete=true;this.naturalWidth=640;this.naturalHeight=208;}
 set src(x){this._src=x;if(x==='actor-restored-0.png'){this.naturalWidth=301;this.naturalHeight=427;}}get src(){return this._src;}
}
const ctx={
 save(){},restore(){},translate(){},scale(){},beginPath(){},arc(){},stroke(){},fill(){},setLineDash(){},fillRect(...x){calls.push(['fillRect',...x]);},
 drawImage(...x){calls.push(['drawImage',...x]);},
};
const canvas={Image:MockImage,ctx};vm.createContext(canvas);vm.runInContext(src.slice(start,end),canvas);
let drawn=vm.runInContext("depotP25Actor('sierra',780,505,false,false,1,1)",canvas);
assert(drawn);assert.equal(calls.filter(x=>x[0]==='drawImage').length,1);
assert.equal(calls.find(x=>x[0]==='drawImage')[1].src,'depot-p39-sierra.png');
calls.length=0;
vm.runInContext('depotP25Actors.sierra.complete=false',canvas);
drawn=vm.runInContext("depotP25Actor('sierra',780,505,false,false,1,1)",canvas);
assert(drawn);assert.equal(calls.find(x=>x[0]==='drawImage')[1].src,'depot-p25-sierra.png');
calls.length=0;
vm.runInContext('depotSierraBackup.complete=false',canvas);
drawn=vm.runInContext("depotP25Actor('sierra',780,505,false,false,1,1)",canvas);
assert.equal(drawn,false);
assert(vm.runInContext('drawDepotSierraFallback({x:454,face:1},505)',canvas));
assert.equal(calls.find(x=>x[0]==='drawImage')[1].src,'actor-restored-0.png');
calls.length=0;
vm.runInContext('drawDepotScanner({scan:true,mode:"playing",x:454,time:5},505)',canvas);
assert(calls.filter(x=>x[0]==='fillRect').length===6,'scanner draws six dots');
calls.length=0;
vm.runInContext('drawDepotScanner({scan:false,mode:"playing",x:454,time:5},505)',canvas);
assert.equal(calls.length,0,'no scanner visual while off');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
assert(css.includes('#game.interlude-depot-explore > .hud .identity{')&&css.includes('display:block!important'),'HUD meter restored');
console.log('PASS P43R: Q hold/release, energy drain/recharge/depletion, evidence gate, P39/P25/campaign sprite fallbacks, scanner canvas, visible meter');
