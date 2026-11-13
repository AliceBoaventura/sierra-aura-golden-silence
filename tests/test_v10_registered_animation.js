'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const metric=JSON.parse(fs.readFileSync('QA_V10/animation_geometry_v10.json','utf8')).actors;
const costumes=JSON.parse(fs.readFileSync('QA_V10/costumes_v10.json','utf8'));
const all=[];
class ImageMock{
 constructor(){this.complete=true;this.naturalWidth=290;this.naturalHeight=660;}
 set src(v){this._src=v;const m=v.match(/assets\/animation-v10\/(sierra|aura|jinx|alexandra)-(\d+)\.png$/);const c=v.match(/assets\/animation-v10\/(alex-ghost|alex-casual)-(\d+)\.png$/);
 if(m){this.naturalWidth=metric[m[1]].canvas_w;this.naturalHeight=metric[m[1]].canvas_h;}
 if(c){[this.naturalWidth,this.naturalHeight]=costumes[c[1]].canvas;}}
 get src(){return this._src;}
}
const ctx={drawImage(...args){all.push(args);}};
const env={Image:ImageMock,ctx,window:{},console,Math};vm.createContext(env);vm.runInContext(fs.readFileSync('neo-art-actors.js','utf8'),env);
const n=env.window.NeoActors;
for(const name of Object.keys(metric)){
 const h=name==='jinx'?278:name==='aura'?226:name==='sierra'?218:226;
 for(let i=0;i<4;i++){
  const before=all.length;assert.equal(n.draw(name,i,h),true);
  const a=all[before];assert(a,`${name}:${i} missing draw`);
  assert.equal(a[0].src,`assets/animation-v10/${name}-${i}.png`);
  assert(Math.abs(a[2]+a[4])<.0001,`${name}:${i} sole moved away from ground`);
  const visible=a[4]*metric[name].visible_source_height/metric[name].canvas_h;
  assert(Math.abs(visible-h)<.02,`${name}:${i} height changed`);
 }
}
for(const name of Object.keys(costumes))for(let i=0;i<4;i++){
 const before=all.length;assert.equal(n.drawCostume(name,i,232),true);
 const a=all[before];assert.equal(a[0].src,`assets/animation-v10/${name}-${i}.png`);
 assert(Math.abs(a[2]+a[4])<.0001,`sole moved for ${name}:${i}`);
}
// Distinct uniforms must never map to the same resource set.
assert.notEqual(n.drawCostume('alex-ghost',0,232),n.drawCostume('unknown',0,232));
assert.equal(n.frame('sierra',false,0,''),0);
assert.equal(n.frame('jinx',true,0,''),20); // V102 enhanced walk; V10 direct pose and fallback registrations preserved
console.log('PASS V10 all 4 casts, four authored poses each, both Alexandra costumes, planted soles and physical scale');
