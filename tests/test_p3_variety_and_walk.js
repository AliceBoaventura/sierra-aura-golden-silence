'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx={NeoRuntime:{reset(){},placeCompanion(){},closest(){return null},focus(){return null}},ClubCrowd:{visitors:[]}};
vm.createContext(ctx);vm.runInContext(read('club-engine.js'),ctx);
const combinations=new Set();
for(let i=0;i<80;i++){
 const s=ctx.Club.create();combinations.add(s.puzzle.targetPhase+':'+s.puzzle.targetFilter);
 assert(s.puzzle.targetPhase>=1&&s.puzzle.targetPhase<=3);
 assert(s.puzzle.targetFilter>=1&&s.puzzle.targetFilter<=3);
 s.mode='clubPuzzle';s.puzzle.phase=s.puzzle.targetPhase;s.puzzle.filter=s.puzzle.targetFilter;
 assert.equal(ctx.Club.quality(s),100);
 assert.equal(ctx.Club.solve(s),true);
 assert.equal(s.flags.correlated,true);
 assert.equal(ctx.Club.solve(s),false);
}
assert(combinations.size>2,'Multiple puzzle solutions across fresh sessions');
let old=ctx.Club.create();old.puzzle={phase:2,filter:3};assert.equal(ctx.Club.quality(old),100,'Old saves still have their original solution');
const director={window:{}};vm.createContext(director);vm.runInContext(read('dialogue-director.js'),director);
const D=director.window.DialogueDirector;
const first={dialogueSeed:1},second={dialogueSeed:2};
assert.equal(D.line('O café de sempre?',first,'vendor:0'),D.line('O café de sempre?',first,'vendor:0'),'Line stable within the same scene');
assert.equal(D.line('Critical canonical clue',first,'anything'),'Critical canonical clue');
assert.notEqual(D.ambient('JINX','Não fica no facho. Eu seguro este lado.',first),D.ambient('JINX','Não fica no facho. Eu seguro este lado.',first),'Ambient banter rotates');
assert.equal(D.auto,false,'Auto is opt-in');
const draws=[],images=[];
function Image(){this.complete=true;this.naturalWidth=290;this.naturalHeight=660;images.push(this);}
const visual={Image,window:{},ctx:{drawImage(...args){draws.push(args)}}};vm.createContext(visual);vm.runInContext(read('neo-art-actors.js'),visual);
const A=visual.window.NeoActors;
assert.equal(A.frame('sierra',true,0,''),20); // V102 new four-frame walk; V10 9..12 fallback remains testable
for(let f=9;f<=12;f++){assert.equal(A.draw('sierra',f,218),true);const d=draws.pop();const y=d.length===9?d[6]:d[2],h=d.length===9?d[8]:d[4];assert(h>0&&h<240,'Walk poses share body scale');assert(Math.abs(y+h)<.0001,'Ground contact at y=0');}
console.log('PASS P3: randomized solvable puzzle, backward compatible target, dialogue variation, walk anchor and opt-in auto');
