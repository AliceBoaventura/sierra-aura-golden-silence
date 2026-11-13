'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');const c={console,ClubCrowd:{visitors:[]}};c.window=c;c.globalThis=c;vm.createContext(c);
for(const file of ['runtime.js','club-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
const Club=c.Club;
function stage(mode){const s=Club.create();Club.change(s,mode);s.events.length=0;s.mode='playing';return s;}
function step(s,inp={},n=1){for(let i=0;i<n;i++)Club.step(s,inp,1/60);}
// Two intentional guards form the pursuit; no civilian parade or guard crowd.
let s=stage('raid');s.x=2450;c.NeoRuntime.placeCompanion(s,'jinx',2550);
step(s,{right:true},110);assert(s.x>2750,'Sierra must truly run toward exit');
assert.equal(s.pursuit.guards.length,2,'two intentional guards on the club floor');assert(s.pursuit.guards.some(g=>g.shots>0),'guards actually fire');
assert(s.pursuit.blocked>0,'Jinx must actively intercept shots');
assert(s.pursuit.shield<4,'blocks must cost Jinx shield energy');
assert(s.events.some(e=>e.type==='pursuitBlock'),'blocking feedback');
// Calling Aura in an earlier choice summons an extra forward patrol.
const early=Club.create();early.flags.guardEarly=true;Club.change(early,'raid');assert(early.pursuit.guards.length===s.pursuit.guards.length&&early.pursuit.guards[0].cd<s.pursuit.guards[0].cd,'prior narrative risk increases urgency without crowding the scene');
// A bullet can actually injure Sierra, so this is a real playable threat.
s=stage('escape');s.x=850;c.NeoRuntime.placeCompanion(s,'jinx',150);s.pursuit.guards=[];s.pursuit.inv=0;s.pursuit.shots=[{x:890,y:690,vx:-500,age:0}];
step(s,{},9);assert(s.hp<3,'projectiles must deal damage');
// Crouching below the shot path protects the player.
s=stage('escape');s.x=850;c.NeoRuntime.placeCompanion(s,'jinx',150);s.pursuit.guards=[];s.pursuit.inv=0;s.pursuit.shots=[{x:890,y:690,vx:-500,age:0}];
step(s,{crouch:true},9);assert.equal(s.hp,3,'crouch must dodge high fire');
// Exhausting health must recover within the chase, not erase story/puzzle progress.
s=stage('escape');s.x=850;s.hp=1;s.flags.module=true;c.NeoRuntime.placeCompanion(s,'jinx',150);s.pursuit.guards=[];s.pursuit.inv=0;s.pursuit.shots=[{x:890,y:690,vx:-500,age:0}];
step(s,{},9);assert.equal(s.hp,3,'safe checkpoint restores vitality');assert.equal(s.flags.module,true,'collected proof survives retry');
assert(s.pursuit.retries===1&&s.pursuit.shots.length===0,'chase restarts cleanly');
// The board interaction is gated by the physical presence of both friends.
s=stage('escape');s.flags.latch=true;s.x=2630;s.jinxX=2100;s.useWas=false;
step(s,{use:true});assert.equal(s.mode,'playing','Sierra cannot leave Jinx behind');
s.useWas=false;c.NeoRuntime.placeCompanion(s,'jinx',2540);step(s,{use:true});assert.equal(s.mode,'clubDialogue');assert.equal(s.dialogue,'boarding');
console.log('PASS P48 guard pursuit, shield, injuries, crouch, checkpoint, two-person boarding');
