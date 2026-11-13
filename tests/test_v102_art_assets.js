'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f));
const frames=['sierra','aura','jinx','alexandra'];
for(const c of frames){
 let dimensions=new Set();
 for(let i=0;i<4;i++){
  const b=read(`assets/animation-v102/${c}-${i}.png`);
  assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'valid PNG');
  dimensions.add(`${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`);
 }
 assert.equal(dimensions.size,1,`${c} same four-frame geometry`);
}
const img=read('assets/visual-v102/depot-47-evidence-room.png');
assert.equal(img.readUInt32BE(16),1280);assert.equal(img.readUInt32BE(20),720);
const logic=read('interlude-engine.js').toString();
assert.deepEqual(['depotBoard','depotArchive','depotTape','depotTerminal'].map(id=>logic.includes(`id:'${id}'`)),[true,true,true,true]);
const stage=read('interlude.js').toString();
assert(stage.includes("interludeDepot.src='assets/visual-v102/depot-47-evidence-room.png'"));
assert(stage.includes('if(enabled){'),'scanner markers conditional');
assert(stage.includes('const cue=[{x:407,y:270},{x:669,y:376},{x:797,y:368},{x:978,y:340}]'),'render reticles remapped to the aspect-correct artwork');
assert(stage.includes("interludeDepotFallback.src='assets/visual-v102/_source_depot-47-clean.png'"),'aspect-correct source fallback');
assert(stage.includes('const depotAuraX=1071'),'Aura remains inside the corrected world');
const java=read('neo-art-actors.js').toString();
assert(java.includes('failedEnhancedAssets'),'image fallback report');
const seen=[];class Img{constructor(){this.complete=true;this.naturalWidth=420;this.naturalHeight=664;}
 set src(v){this._src=v;}get src(){return this._src;}}
const env={Image:Img,ctx:{drawImage(...args){seen.push(args)}},window:{},console,Math};vm.createContext(env);vm.runInContext(java,env);
const n=env.window.NeoActors;assert.equal(n.frame('sierra',true,0,''),20);assert.equal(n.frame('aura',true,1/.85,''),21);
for(const c of frames){
 for(let i=0;i<4;i++){
  const before=seen.length;assert.equal(n.draw(c,20+i,c==='jinx'?278:218),true);
  const call=seen[before];assert.equal(call[0].src,`assets/animation-v102/${c}-${i}.png`);
  assert(Math.abs(call[2]+call[4])<0.01,'soles stay planted');
 }
}
// Failed enhanced asset must use the previous V10 contact pose.
for(const frame of n.enhancedWalk.jinx){frame.naturalWidth=0;frame.complete=true;}
const before=seen.length;assert.equal(n.draw('jinx',20,278),true);
assert.equal(seen[before][0].src,'assets/animation-v10/jinx-2.png');
console.log('PASS V102 four enhanced sprites, fallback, scanner and preserved hotspot IDs');
