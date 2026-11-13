'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const ctx={NeoRuntime:{reset(){},delta:x=>x,closest:()=>null},console};vm.createContext(ctx);
for(const f of ['interlude-story.js','interlude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const s=ctx.Interlude.create();ctx.Interlude.speak(s,'auraCloud');
let steps=0;while(s.dialogueLines[s.lineIndex].choiceKey!=='auraCloud'){ctx.Interlude.advance(s);assert(++steps<30)}
ctx.Interlude.advance(s,0);assert.equal(s.flags.cloudConnection,'body');
while(s.dialogueLines[s.lineIndex].choiceKey!=='cloudIntimacy'){ctx.Interlude.advance(s);assert(++steps<55)}
ctx.Interlude.advance(s,0);assert.equal(s.flags.cloudConsent,'intimate');assert.equal(s.flags.cloudSex,false,'Consent is not the completed event');
while(!s.dialogueLines[s.lineIndex].cloudIntimacyComplete){ctx.Interlude.advance(s);assert(++steps<90)}
assert.equal(s.flags.cloudSex,false);ctx.Interlude.advance(s);assert.equal(s.flags.cloudSex,true);assert.equal(s.flags.cloudIntimacyCompleted,true);
while(s.mode==='interludeDialogue'){ctx.Interlude.advance(s);assert(++steps<130)}
assert.equal(s.flags.cloudConnection,'voice');assert.equal(s.flags.cloudSex,true,'Completed, consensual moment is remembered');
const ui=fs.readFileSync(path.join(root,'interlude.js'),'utf8');assert(ui.includes("state.flags.cloudConnection='voice'"));assert(ui.includes("const idx=state.dialogueLines.findIndex"));assert(ui.includes("'interlude-sensory'"));
console.log('PASS P5: intimacy records only on completion; sensory bridge ends; UI has immediate stop control');
