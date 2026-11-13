'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const c={console};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(read(f),c,{filename:f});
const I=c.Interlude;
function tick(s,input={},n=1){for(let i=0;i<n;i++)I.step(s,input,.03);}
function finishDialogue(s,topic,alex=1,aura=0){
 let guard=0;
 while(['interludeDialogue','interludeSilence'].includes(s.mode)&&guard++<200){
  if(s.mode==='interludeSilence'){tick(s,{},Math.ceil((s.silenceDuration-s.silenceTime)/.03)+1);continue;}
  const line=s.dialogueLines[s.lineIndex];
  assert(line,'missing café dialogue line');
  if(line.choiceKey==='cafeTopic')I.advance(s,topic);
  else if(line.choiceKey==='alex')I.advance(s,alex);
  else if(line.choiceKey==='aura')I.advance(s,aura);
  else I.advance(s);
 }
 assert(guard<200,'café branch did not terminate');
}
for(let topic=0;topic<4;topic++){
 const s=I.create();s.mode='playing';s.stage='cafe';I.speak(s,'cafe1');
 const prompt=s.dialogueLines.find(x=>x.choiceKey==='cafeTopic');
 assert.equal(prompt.choices.length,4,'four café topics are available');
 finishDialogue(s,topic);
 assert.equal(s.mode,'playing');
 assert.equal(s.flags.choice_cafeTopic,topic);
 assert.equal(Number.isInteger(s.flags.choice_alex),topic===0,'Alexandra sub-choice only exists on Alexandra route');
 assert.equal(Number.isInteger(s.flags.choice_aura),topic===1,'Aura sub-choice only exists on Aura route');
 if(topic===3)assert(s.events.some(e=>e.type==='quiet'),'silence route includes an authored pause');
 I.speak(s,'cafe2');
 const followup=s.dialogueLines.map(x=>x.text).join(' ');
 if(topic===0)assert(followup.includes('Ela ria da minha banda'),'Alexandra choice changes the later café response');
 if(topic===1)assert(followup.includes('Você pode cobrar uma resposta'),'Aura choice changes the later café response');
 if(topic===2)assert(followup.includes('café ruim por quase um minuto'),'everyday route has its own consequence');
 if(topic===3)assert(followup.includes('A pausa foi boa'),'silence route has a later response');
}
{
 const s=I.create();s.stage='walk';s.mode='playing';s.x=640;
 tick(s,{right:true},2);
 assert.equal(s.mode,'playing','ambient conversation must not enter modal dialogue mode');
 assert(s.x>640,'Sierra continues walking as the ambient conversation starts');
 assert.equal(s.ambientCurrent.id,'walk1');
 const first=s.x;tick(s,{right:true},5);
 assert(s.x>first,'movement remains available while ambient lines progress');
 assert.equal(s.mode,'playing');
 assert(s.events.some(e=>e.type==='ambientLine'),'ambient line is emitted to the radio subtitle');
}
{
 const s=I.create();s.stage='returnWalk';s.mode='playing';s.x=1701;
 tick(s,{left:true});
 assert.equal(s.mode,'playing','return-walk banter is also non-blocking');
 assert(s.x<1701);
 assert(s.flags.returnBeat,'key-47 beat is recorded without stopping movement');
}
assert(read('interlude.js').includes("['Digit1','Digit2','Digit3','Digit4']"),'fourth choice is keyboard accessible');
assert(read('interlude.js').includes('interludeStayCounter'),'counter interaction is present in the seated menu');
assert(read('coffee-sprites.js').includes("gesture==='cup'"),'cup gesture has a distinct seated posture cue');
console.log('PASS Café editorial: four topic branches, consent/choice isolation, non-blocking walk dialogue, cup/counter gestures');
