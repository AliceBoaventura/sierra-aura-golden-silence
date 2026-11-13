/** V10.4 production narrative contract. There must be no intimate choice under fire.
 * Keep all branches, consent, and continuity visible in the approved story engine. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(base,n),'utf8');
const context={console,sessionStorage:{removeItem(){}},SharedMoments:{reset(){}}};
context.window=context;context.globalThis=context;vm.createContext(context);
for(const file of ['story-continuity.js','terrace-story.js','club-story.js','ghost-story.js','interlude-story.js','rc73-editorial-v104.js']) vm.runInContext(read(file),context,{filename:file});
const U=read('uprising.js');
assert(!U.includes('showAfterRelayChoice')&&!U.includes('chooseLinkReciprocity'));
assert(U.includes("ChapterCurtain.to(4,beginTerrace)"));
assert(U.includes('Três relés isolados. Não sei por quanto tempo.'));
assert(!/Estou na saída[\s\S]{0,200}beijo/.test(U));
const audit=context.RC73V104EditorialAudit;
assert.equal(audit.errors.length,0);assert.equal(audit.choicesPreserved,true);
assert.equal(audit.scenes.length,37);
const T=context.Terrace,C=context.StoryContinuity;
assert.equal(T.beats.length,10);assert(T.beats.every(b=>b.choices.length===3));
assert.equal(T.beats[0].speaker,'AURA');
assert.match(T.beats[0].aside,/Horas depois da extração/);
assert.equal(T.beats[6].title,'Antes que você vire ausência');
assert.equal(T.beats[7].title,'A noite que ainda tem um corpo');
for(const [intent,choice] of [['research',0],['personal',1],['boundary',2]]){
 C.reset();const s=T.create();assert.equal(C.history().auraPromise,undefined);
 assert.equal(T.choose(s,choice),true);assert.equal(C.history().auraPromise,intent);
 assert.equal(s.stage,'response');assert.equal(T.advance(s),true);
 assert.equal(s.beat,1);
}
for(const [expected,index] of [['study',0],['stay',1],['refuse',2]]){
 C.reset();const s=T.create();s.beat=4;
 assert.equal(T.choose(s,index),true);assert.equal(s.ending,expected);
 assert.equal(C.history().terrace,expected);
}
for(const [choice,expectedTrust,expectedSignal] of [[0,'shared-memory','revealed'],[1,'respected-boundary','private'],[2,'respected-boundary','private']]){
 C.reset();const s=T.create();s.beat=5;
 assert.equal(T.choose(s,choice),true);
 assert.equal(C.history().linkTrust,expectedTrust);
 assert.equal(C.history().linkKeaneSignal,expectedSignal);
}
for(const [night,index] of [['rest',1],['leave',2]]){
 C.reset();const s=T.create();s.beat=6;
 assert(T.choose(s,2));assert.equal(s.intimacy,false);
 assert(T.advance(s));assert.equal(s.beat,7);
 assert.equal(T.beatFor(s).choices.length,3);
 assert(T.choose(s,index));assert.equal(s.sex,false);
 assert.equal(s.nightChoice,night);
 assert(T.advance(s));
 assert.equal(s.stage,night==='rest'?'night':'ending');
 if(night==='leave')assert.equal(s.dream,false);
}
const inter=context.InterludeStory;
assert.equal(inter.auraCloud[6].who,'AURA');assert.match(inter.auraCloud[6].text,/corpo.*suspensão/);
assert.equal(inter.auraCloud[7].who,'SIERRA');
assert.equal(inter.auraCloud[8].who,'AURA');
assert.match(inter.auraCloud[8].text,/quebrei/);
assert.equal(inter.auraCloud[14].who,'AURA');assert.match(inter.auraCloud[14].text,/se você quiser/);
// Chapter 5 actually speaks the prior promise instead of keeping it in a
// hidden StoryContinuity array. A fresh chapter-select remains neutral.
const clubSource=read('club.js');
assert(clubSource.includes('v104ClubBriefLine(b.line)'));
const helper=clubSource.slice(clubSource.indexOf('function v104ClubBriefLine('),clubSource.indexOf('function renderClubDialogue()'));
for(const [intent,fragment] of [['research','cópia que isolamos'],['personal','canal aberto'],['boundary','saída segura']]){
 const q={state:{dialogue:'brief',dialogueStep:0},window:{StoryContinuity:{history:()=>({auraPromise:intent})}}};
 assert(vm.runInNewContext(helper+';v104ClubBriefLine("original")',q).includes(fragment));
}
const blank={state:{dialogue:'brief',dialogueStep:0},window:{StoryContinuity:{history:()=>({})}}};
assert.equal(vm.runInNewContext(helper+';v104ClubBriefLine("original")',blank),'original');
assert(read('index.html').includes('rc73-editorial-v104.js'));
console.log('V10.4 temporal narrative QA: 37 changes, 10 beats, choice persistence, memory privacy, no-kiss consent, interlude speaker order and operating exit PASS');
