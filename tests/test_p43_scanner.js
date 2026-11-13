const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..'),c={console,StoryContinuity:{history:()=>({})}};vm.createContext(c);
for(const f of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const I=c.Interlude;let s=Object.assign(I.create(),{stage:'depot',mode:'playing',x:454,useWas:false});
I.step(s,{use:true,scan:false},.02);assert.equal(s.mode,'playing');assert(!s.flags.depotBoard);assert(s.events.some(e=>e.type==='depotScannerOff'));
const finish=()=>{let n=0;while(s.mode==='interludeDialogue'&&n++<50)I.advance(s);assert(n<50)};
for(const id of ['depotBoard','depotArchive','depotTape','depotTerminal']){
 s.x=I.objects.depot.find(o=>o.id===id).x;s.useWas=false;s.depotUseAt=0;
 I.step(s,{use:true,scan:true},.05);assert.equal(s.dialogue,id);finish();assert(s.flags[id]);
}
s.x=960;s.useWas=false;s.depotUseAt=0;I.step(s,{use:true,scan:true},.05);assert.equal(s.dialogue,'depotCompare');
I.advance(s,1);finish();assert(s.flags.depotFinal);assert.equal(s.mode,'interludeCinematic');
for(let i=0;i<2000&&s.mode!=='won';i++)I.step(s,{},.02);
assert.equal(s.mode,'won');assert(s.events.some(e=>e.type==='ending'));
console.log('PASS P43: scanner gate, four discoveries, terminal deduction, ending');
