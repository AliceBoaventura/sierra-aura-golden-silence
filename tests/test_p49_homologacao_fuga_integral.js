'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),c={console,ClubCrowd:{visitors:[]}};c.window=c;c.globalThis=c;vm.createContext(c);
for(const file of ['runtime.js','club-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
function journey(approach,early){
 const s=c.Club.create();s.flags.evidencePath=approach;s.flags.module=true;s.flags.guardEarly=early;
 c.Club.change(s,'raid');s.x=2450;c.NeoRuntime.placeCompanion(s,'jinx',2560);s.mode='playing';s.useWas=false;
 let latchReleased=false,boarding=false,stageAt=null,steps=0,blocks=0,hits=0,retries=0,shots=0,scanTicks=0;
 const scenes=new Set(['raid']);
 for(let frame=0;frame<60*170;frame++){
   const i={};
   if(s.stage==='raid'){
     if(s.x<3095)i.right=true;else i.use=frame%13===0;
   }else if(s.stage==='escape'){
     scenes.add('escape');
     if(!s.flags.latch){
       if(s.x<1325)i.right=true;
       else if(s.x>1400)i.left=true;
       else if(!s.flags.latchRead){i.scan=true;scanTicks++;}
       else i.use=frame%12===0;
     }else if(s.x<2600)i.right=true;
     else i.use=frame%12===0;
   }else if(s.stage==='drive'){boarding=true;break;}
   // Fight for the exit: actual movement and collisions, no teleportation.
   if(i.right&&frame%93===0)i.dash=true;
   if(i.right&&frame%107===0)i.jump=true;
   c.Club.step(s,i,1/60);
   for(const e of s.events.splice(0)){
     if(e.type==='pursuitShot')shots++;
     if(e.type==='pursuitBlock')blocks++;
     if(e.type==='pursuitHit')hits++;
     if(e.type==='pursuitRetry')retries++;
   }
   if(s.stage==='escape'&&!stageAt)stageAt=frame;
   if(s.stage==='escape'&&s.flags.latch)latchReleased=true;
   assert.notEqual(s.dialogue==='parting'&&s.mode==='clubDialogue',true,'no dialogue may interrupt a live chase');
   if(s.mode==='clubDialogue'&&s.dialogue==='boarding'){
      assert(Math.abs(s.jinxX-s.x)<=175,'Jinx is physically next to Sierra at boarding');
      boarding=true;break;
   }
   steps=frame;
 }
 assert(scenes.has('escape'),`${approach}: raid exit reached by running and pressing USAR`);
 assert(latchReleased,`${approach}: scanner and latch opened without stopping the chase`);
 assert(boarding,`${approach}: both reached Cadillac`);
 assert(s.flags.latchRead&&s.flags.latch,`${approach}: scan actually reveals the latch`);
 assert(s.flags.module&&s.flags.evidencePath===approach,`${approach}: evidence kept intact`);
 assert(shots>0&&blocks>0,`${approach}: guards shoot and Jinx protects`);
 assert(scanTicks>=45,`${approach}: scanner requires sustained input`);
 return {evidencePath:approach,earlyPatrol:early,seconds:(steps/60).toFixed(1),scanTicks,shots,blocks,hits,retries,boardedTogether:boarding};
}
let results=[];for(const [path,early] of [['protect',false],['aura',true],['trace',false]])results.push(journey(path,early));
console.log('PASS three actual combat-escape-boarding paths:',JSON.stringify(results));
