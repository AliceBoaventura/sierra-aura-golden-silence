'use strict';
// Contemporary gameplay contract. No bypass of scanner/evidence/dialogue; state is owned by the real engine.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
function fixture(memory){
 const c={console};c.window=c;c.globalThis=c;
 if(memory)c.StoryContinuity={history:()=>({neri:memory})};
 vm.createContext(c);
 for(const f of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(read(f),c,{filename:f});
 const I=c.Interlude,s=I.create();I.change(s,'depot',1080);s.mode='playing';s.flags.depotUnlocked=true;
 const tick=(frames=1,input={})=>{for(let k=0;k<frames;k++)I.step(s,input,.03)};
 function finish(choice=0){let n=0;
  while(['interludeDialogue','interludeSilence'].includes(s.mode)&&n++<400){
   if(s.mode==='interludeSilence')tick();else{
    const line=s.dialogueLines[s.lineIndex];assert.ok(line,`Missing dialogue line ${s.dialogue}`);
    I.advance(s,line.choices?choice:undefined);
   }
  }
  assert.ok(n<400,`Dialogue did not finish ${s.dialogue}`);
 }
 function use(id,scan=true){const o=I.objects.depot.find(o=>o.id===id);assert.ok(o,id);
  s.x=o.x;tick(22);s.useWas=false;tick(1,{scan,use:true});return s.mode;}
 function clues(){for(const id of ['depotBoard','depotArchive','depotTape','depotTerminal']){
  assert.equal(use(id),'interludeDialogue',`${id} dialogue must begin with SCAN`);
  assert.ok(!s.flags[id],`${id} flag must not commit before dialogue`);
  finish();assert.equal(s.flags[id],true,`${id} flag commits after dialogue`);
  assert.equal(s.stage,'depot','no auto-ending');
 }}
 function deduction(choice=1){assert.equal(use('depotTerminal'),'interludeDialogue');
  assert.equal(s.dialogue,'depotCompare');finish(choice);
  return {choice:s.flags.choice_depotDeduction,final:!!s.flags.depotFinal,mode:s.mode};
 }
 function completeEnd(){tick(800);assert.equal(s.stage,'end');assert.equal(s.mode,'won');}
 return {c,I,s,tick,finish,use,clues,deduction,completeEnd};
}
module.exports={assert,read,root,fixture};
