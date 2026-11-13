'use strict';
// P44.3 contract: depot evidence is intentionally investigated by scanner,
// completed dialogue and explicit deduction, not the deprecated auto-ending.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),c={console};vm.createContext(c);
for(const name of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),c,{filename:name});
const I=c.Interlude,s=I.create();I.change(s,'depot',640);s.mode='playing';s.flags.depotUnlocked=true;
let passed=0;const ok=(v,label)=>{assert.ok(v,label);passed++};
function tick(n=1,inp={}){for(let j=0;j<n;j++)I.step(s,inp,.03)}
function complete(){let n=0;while(s.mode==='interludeDialogue'&&n++<200){let l=s.dialogueLines[s.lineIndex];I.advance(s,l.choices?0:undefined);if(s.mode==='interludeSilence'){tick(100);}}
 ok(n<200,`dialogue termination ${s.dialogue}`);}
function useAt(id){s.x=I.objects.depot.find(o=>o.id===id).x;tick(21);s.useWas=false;tick(1,{scan:true,use:true});}
// Unscanned interactions must NOT magically collect a clue.
useAt('depotBoard');ok(!s.flags.depotBoard,'scanner required in depot');
for(const id of ['depotBoard','depotArchive','depotTape','depotTerminal']){
 useAt(id);ok(s.mode==='interludeDialogue',`${id} starts clue dialogue`);
 complete();ok(s.flags[id]===true,`${id} discovered only after dialogue`);ok(s.stage==='depot','No early ending');
}
useAt('depotTerminal');ok(s.dialogue==='depotCompare','Four clues unlock intentional deduction');
let n=0;while(s.mode==='interludeDialogue'&&n++<100){const l=s.dialogueLines[s.lineIndex];I.advance(s,l.choices?1:undefined);}
ok(s.flags.choice_depotDeduction===1,'Selected supported final deduction');
ok(s.flags.depotFinal&&s.mode==='interludeCinematic','Final sequence starts only after choice');
for(let i=0;i<780;i++)tick();
ok(s.stage==='end'&&s.mode==='won','Final cinematic reaches end state');
console.log(`P44.3 active depot contract: ${passed}/${passed} PASS`);
