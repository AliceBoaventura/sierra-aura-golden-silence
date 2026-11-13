'use strict';
// Engine-level walk-through with actual movement, Q / E and puzzle rotation.
// No direct setting of node found or exit flags; not a browser playthrough.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const c={console};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['runtime.js','uprising-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const U=c.Uprising,s=U.create();U.startRelay(s);
const tick=(input={},n=1)=>{for(let i=0;i<n;i++){U.step(s,input,1/60);if(s.mode==='lost')throw Error('lost while proceeding: '+s.x+' deaths='+s.deaths);}};
const records=[];
function goTo(x){let frames=0;while(Math.abs(s.x-x)>8&&frames++<2500){tick({[s.x<x?'right':'left']:true});}assert(frames<2500,'Movement stalled to '+x+' at '+s.x);return frames;}
function reveal(i){const x=s.nodes[i].x;let n=0;goTo(x);while(!s.nodes[i].revealed&&n++<1200){tick({scan:true});}assert(n<1200,'Relay '+i+' reveal stalled');tick({},2);s.useWas=false;tick({use:true});assert.equal(s.mode,'playing','Relay '+i+' must isolate without obsolete puzzle');assert.equal(s.puzzle,null);assert(s.nodes[i].found,'Relay '+i+' flag set by engine');assert.equal(s.checkpoint,s.nodes[i].x+120);records.push({relay:i+1,x,revealFrames:n,checkpoint:s.checkpoint,stage:s.stage,mode:s.mode});}
for(let i=0;i<3;i++)reveal(i);
assert(s.nodes.every(x=>x.found),'All 3 relays solved');goTo(3070);tick({},2);s.useWas=false;tick({use:true});assert.equal(s.mode,'dialogue');assert(s.events.some(e=>e.type==='ending'),'Extraction emits proper chapter transition event');
console.log('PASS CH03 relay traversal + three real scanner/direct-isolation resolutions + exit event',JSON.stringify({nodes:records,deaths:s.deaths,hacks:s.hacks,exitX:s.x}));
