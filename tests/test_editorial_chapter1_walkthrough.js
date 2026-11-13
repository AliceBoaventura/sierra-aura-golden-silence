/* Engine movement through Chapter 1, no teleports or preloaded flags.
   This is not a browser test: UI dialogues are verified separately. */
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const c=vm.createContext({console});c.window=c;c.globalThis=c;
for(const file of ['runtime.js','npc-quests.js','story-continuity.js','prelude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
const s=c.Prelude.create();
const tick=(i={})=>c.Prelude.step(s,i,0.033);
function walk(x,extra={}){for(let k=0;k<1000&&s.x<x-10;k++)tick({right:true,...extra});assert(s.x>=x-10,`cannot reach ${x}; at ${s.x} ${s.stage}`);tick({});}
function scan(t=1.2){for(let k=0;k<Math.ceil(t/.033);k++)tick({scan:true});tick({});}
function use(){tick({use:true});tick({});}
function near(id){assert.equal(c.Prelude.near(s)?.id,id,`expected ${id}, got ${c.Prelude.near(s)?.id} x=${s.x}`);}
walk(545);near('bench');scan();use();assert(s.flags.bench);
walk(1140);near('exit');use();assert.equal(s.stage,'district');console.log('PASS home bench scan + exit into district');
walk(930);near('repair');scan();use();assert(s.flags.repair);console.log('PASS Mara repair physical scanner interaction');
walk(1640);near('patient');use();assert.equal(s.mode,'conversation');assert(s.conversation.length>1);const opts=c.NPCQuests.options(s,'patient');assert.equal(opts.length,3);c.NPCQuests.choose(s,'patient','accept');s.mode='playing';s.conversation=[];s.useWas=true;tick({});
walk(1860);near('clinic');scan(1);use();assert.equal(s.flags.neriOutcome,'rescued');console.log('PASS Neri prior consent + clinic scan + admission');
walk(3000,{crouch:true});near('signature');scan(1.3);assert(s.flags.signature,'signature scanner did not discover local signal');
walk(3250,{crouch:true});near('power');use();assert(s.flags.power,'power not isolated');
walk(3970,{crouch:true});near('exit');use();assert.equal(s.stage,'trace');
c.StoryContinuity.capture(s);assert.equal(c.StoryContinuity.history().neri,'rescued');
console.log('PASS district exit to trace and Neri consequence recorded');
console.log('EDITORIAL WALKTHROUGH 4/4; no flags or x teleport; engine-only');
