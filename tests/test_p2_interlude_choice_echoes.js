'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx={InterludeStory:{
 cafe2:[{who:'SIERRA',text:'Conversa com Aura'}],
 returnLate:[{who:'SIERRA',text:'Boa noite'}],
 cafe1:[{who:'SIERRA',choiceKey:'alex',choices:[]}]
},NeoRuntime:{},StoryContinuity:{interludeBeat:()=>[]},RC37Adaptation:{cafeBeat:()=>[]}};
ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','interlude-engine.js'),'utf8'),ctx);
for(const [scene,flag] of [['cafe2','choice_alex'],['returnLate','choice_aura']]){
 for(let choice=0;choice<3;choice++){
  const state=ctx.Interlude.create();state.flags[flag]=choice;
  ctx.Interlude.speak(state,scene);
  assert.equal(state.dialogueLines.length,2);
  assert.equal(state.dialogueLines.filter(x=>x.who==='JINX').length,1);
  assert.equal(state.dialogueLines.filter(x=>x.who==='SIERRA').length,1);
  assert.notEqual(state.dialogueLines.find(x=>x.who==='JINX').text,'');
 }
 const state=ctx.Interlude.create();ctx.Interlude.speak(state,scene);
 assert.equal(state.dialogueLines.length,1,'No choice should not fabricate memory');
}
console.log('PASS P2: 6 choice-dependent callbacks and 2 no-choice fallbacks');
