const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'..');let outcome;const c={console,StoryContinuity:{history:()=>({neri:outcome})}};vm.createContext(c);
for(const f of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const I=c.Interlude;const make=()=>{const s=Object.assign(I.create(),{stage:'depot',mode:'playing',useWas:false,x:454});I.step(s,{scan:true},.016);assert(s.scan);I.step(s,{scan:false},.016);assert(!s.scan);return s;};
const finish=s=>{let n=0;while(s.mode==='interludeDialogue'&&n++<40)I.advance(s);assert(n<40);};
let s=make();I.step(s,{use:true,scan:true},.016);assert.equal(s.dialogue,'depotBoard');assert(!s.flags.depotBoard);finish(s);assert(s.flags.depotBoard);
for(const id of ['depotArchive','depotTape','depotTerminal']){s.time+=1;s.x=I.objects.depot.find(o=>o.id===id).x;s.useWas=false;I.step(s,{use:true,scan:true},.016);assert.equal(s.dialogue,id);finish(s);assert(s.flags[id]);}
s.time+=1;s.useWas=false;I.step(s,{use:true,scan:true},.016);assert.equal(s.dialogue,'depotCompare');I.advance(s,0);finish(s);assert(!s.flags.depotFinal);
s.time+=1;s.useWas=false;I.step(s,{use:true,scan:true},.016);I.advance(s,2);finish(s);assert(!s.flags.depotFinal);
s.time+=1;s.useWas=false;I.step(s,{use:true,scan:true},.016);I.advance(s,1);finish(s);assert(s.flags.depotFinal);assert.equal(s.mode,'interludeCinematic');
let time=s.time;s.mode='paused';I.step(s,{},1);assert.equal(s.time,time);s.mode='interludeCinematic';for(let n=0;n<3000&&s.stage!=='end';n++)I.step(s,{},.02);assert.equal(s.stage,'end');
for(outcome of ['rescued','escorted','left',undefined]){s=make();I.speak(s,'depotArchive');assert.equal(s.flags.depotNeriOutcome,outcome||'unknown');assert.equal(s.dialogueLines.length,outcome?6:4);}
s=make();s.x=500;assert.equal(I.near(s).id,'depotBoard');s.x=330;assert.equal(I.near(s),null);
s=make();s.depotUseAt=1;I.step(s,{use:true},.01);assert.equal(s.mode,'playing');
s=make();s.x=1100;I.step(s,{right:true},.02);assert.equal(s.jinxX,300);assert(s.x>1100);
assert.equal(c.InterludeStory.depotArchive.length,4,'shared scripts must not inherit previous playthrough');
console.log('PASS P43 regression (Q-held): evidence read before flags, deduction 3 branches, retry, final, pause, 4 Neri states, range, cooldown, movement, no script mutation');
