'use strict';
// P44.3 new contracts: exposure is real wall-clock time near the lock,
// physics stays clamped; progress requires a scanner and an explicit Jinx action.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.join(__dirname,'..');
const c={console};vm.createContext(c);
for(const n of ['runtime.js','club-crowd.js','club-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,n),'utf8'),c,{filename:n});
const C=c.Club;let passed=0;const ok=(v,m)=>{assert.ok(v,m);passed++};
for(const ms of [16.667,33.334,60,90,120,180,250,320]){
 const s=C.create();s.x=620; s.jinxX=450;s.useWas=false;
 const dt=ms/1000;
 for(let i=0;i<Math.ceil(1.3/dt);i++)C.step(s,{scan:true},dt);
 ok(s.flags.gateRead===true,`Gate must become readable when SCAN held ~1.3s at ${ms}ms/frame`);
 ok(!s.flags.gate,`Reading is not enough to open gate ${ms}`);
 ok(s.energy>0&&s.energy<100,`Reading respects scanner energy ${ms}`);
 s.useWas=false;C.step(s,{use:true},dt);
 ok(s.hold>0,`Jinx starts helping after player presses USE ${ms}`);
 for(let j=0;j<65;j++) C.step(s,{},1/30);
 ok(s.flags.gate===true,`Jinx opens gate after holding the latch ${ms}`);
}
{
 const s=C.create();s.x=620;for(let i=0;i<80;i++)C.step(s,{},.03);
 ok(!s.flags.gateRead,'Player must use scanner to read the gate');
}
{
 const s=C.create();s.x=620; C.step(s,{scan:true},30);
 ok(!s.flags.gateRead,'Single 30-second stalled frame cannot auto-solve scanner');
}
{
 const s=C.create();s.x=620;for(let i=0;i<6;i++)C.step(s,{scan:true},.1);
 const previous=s.progress.gate; s.x=400;
 for(let i=0;i<6;i++)C.step(s,{scan:true},.1);
 ok(s.progress.gate===previous,'SCANNER outside interaction radius cannot advance gate progress');
}
{
 const s=C.create();s.stage='escape';s.x=1370;
 for(let i=0;i<13;i++)C.step(s,{scan:true},.1);
 ok(s.flags.latchRead,'Later latch uses same exposure rules as nightclub gate');
 ok(!s.flags.latch,'Later latch still requires player interaction');
}
console.log(`P44.3 gate low-FPS gameplay mechanics: ${passed}/${passed} PASS`);
