'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const runtime={reset(){},placeCompanion(){}};
const sandbox={NeoRuntime:runtime};vm.createContext(sandbox);vm.runInContext(read('ghost-engine.js'),sandbox);
for(let bits=0;bits<64;bits++){
 const s=sandbox.Ghost.create();s.channels=Array.from({length:6},(_,i)=>!!(bits&(1<<i)));
 assert.equal(sandbox.Ghost.isolated(s),bits===32);
 s.mode='ghostPuzzle';s.flags.spectrum=true;
 assert.equal(sandbox.Ghost.solve(s),bits===32);
 if(bits===32){assert.equal(s.flags.map,true);assert.equal(s.dialogue,'map');assert.equal(sandbox.Ghost.solve(s),false);}
 else assert.equal(s.flags.map,undefined);
}
for(const channels of [[],[false,false,false,false,false],null])assert.equal(sandbox.Ghost.isolated({channels}),false);
let s=sandbox.Ghost.create();s.channels=[false,false,false,false,false,true];s.mode='ghostPuzzle';assert.equal(sandbox.Ghost.solve(s),false);
const draws=[],assets=[];
function Image(){this.complete=true;this.naturalWidth=1115;this.naturalHeight=660;assets.push(this);}
const actors={Image,window:{},ctx:{drawImage(...args){draws.push(args)}}};vm.createContext(actors);vm.runInContext(read('neo-art-actors.js'),actors);
const a=actors.window.NeoActors;assert.equal(a.frame('sierra',false,0,'crouch'),13);assert.equal(a.frame('sierra',false,0,'crouch',true),8);assert.equal(a.frame('jinx',false,0,'crouch'),0);
assert.equal(a.draw('sierra',13,218),true);let d=draws.pop();assert.equal(d.length,9);assert.equal(d[6]+d[8],0);assert(Math.abs(d[7]/d[8]-895/1236)<1e-9,'uniform pose scale');
assets.find(x=>x.src.endsWith('sierra-crouch.png')).complete=false;assert.equal(a.draw('sierra',13,218),true,'existing pose fallback');
assert(!read('prelude.js').includes('ctx.scale(1,.62)'));
// Test HUD disclosure and damage visibility with a minimal DOM; not a browser test.
const classes=new Set(),elements={hint:{style:{}},radio:{textContent:''}},attributes={};
const menu={prepend(el){elements[el.id]=el}};
elements.game={classList:{toggle(n,on){on?classes.add(n):classes.delete(n)}},querySelector(){return menu}};
const hud={window:{},state:{hp:3,alarm:0,scan:false},getComputedStyle(){return {display:'none'}},document:{getElementById(id){return elements[id]},createElement(){return {setAttribute(k,v){attributes[k]=v}}}}};
vm.createContext(hud);vm.runInContext(read('neo-hud.js'),hud);hud.window.NeoHUD.update();assert(classes.has('hud-compact'));assert.equal(attributes['aria-expanded'],'false');
elements.hudDetails.onclick();hud.window.NeoHUD.update();assert(!classes.has('hud-compact'));assert.equal(attributes['aria-expanded'],'true');hud.state.hp=2;hud.window.NeoHUD.update();assert(classes.has('hud-danger'));
console.log('PASS P3: 64 mixer combinations, invalid inputs, solve guards, crouch aspect/anchor/fallback, HUD disclosure and damage visibility (VM mocks).');
