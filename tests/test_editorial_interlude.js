'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const ctx={globalThis:{},NeoRuntime:{reset(){},delta:x=>x,closest:()=>null},console};ctx.globalThis=ctx;vm.createContext(ctx);
for(const file of ['interlude-story.js','interlude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const cloud=ctx.InterludeStory.auraCloud;
const entry=cloud.find(l=>l.choiceKey==='auraCloud');assert.equal(entry.choices.length,3);
assert(entry.choices[0].reply.some(l=>l.choiceKey==='cloudIntimacy'),'Opt-in intimacy requires a second choice');
assert(!entry.choices[1].reply.some(l=>l.choiceKey==='cloudIntimacy'),'Voice route must not request intimacy');
assert(!entry.choices[2].reply.some(l=>l.choiceKey==='cloudIntimacy'),'Silence route must not request intimacy');
assert(cloud.some(l=>l.text.includes('Ela morreu')),'Alexandra remains definitively dead');
function run(first,second){
 const s=ctx.Interlude.create();ctx.Interlude.speak(s,'auraCloud');let n=0;
 while(s.mode==='interludeDialogue'){
  assert(++n<130,'Dialogue loop must terminate');const line=s.dialogueLines[s.lineIndex];
  if(line.choices){ctx.Interlude.advance(s,line.choiceKey==='auraCloud'?first:second);}else ctx.Interlude.advance(s);
 }
 assert.equal(s.flags.sleeping,true);assert.equal(s.flags.choice_auraCloud,first);
 assert.equal(s.flags.cloudConnection,'voice','All routes finish with sensory bridge off');
 return s;
}
for(let first=0;first<3;first++){
 if(first===0){for(let second=0;second<3;second++){
  const s=run(first,second);assert.equal(s.flags.choice_cloudIntimacy,second);
  assert.equal(!!s.flags.cloudIntimacyCompleted,second===0);
  assert.equal(!!s.flags.cloudSex,second===0);
 }}else{const s=run(first);assert.equal(s.flags.choice_cloudIntimacy,undefined);assert.equal(!!s.flags.cloudSex,false);}
}
console.log('PASS P5: full cloud narrative, 5 endings, two consent gates, persistent flags, no forced intimacy');
