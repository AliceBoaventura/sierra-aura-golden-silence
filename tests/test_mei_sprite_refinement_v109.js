'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const poseNames=['sit','walk','explore','reach'];
const dims={};
for(const name of poseNames){
 const file=path.join(root,'assets','mei',`mei-${name}.png`);
 assert(fs.existsSync(file),`missing Mei pose ${name}`);
 const b=fs.readFileSync(file);
 assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),`${name} must be PNG`);
 assert.equal(b[25],6,`${name} must preserve RGBA transparency`);
 const w=b.readUInt32BE(16),h=b.readUInt32BE(20);
 assert(w>=300&&h>=250,`${name} must retain high-resolution artwork (${w}x${h})`);
 dims[name]=[w,h];
}
const drawLog=[];
class ImageMock{
 constructor(){this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}
 set src(value){
  this._src=value;
  const name=value.match(/mei-(sit|walk|explore|reach)\.png(?:\?.*)?$/)?.[1];
  if(name){[this.naturalWidth,this.naturalHeight]=dims[name];this.complete=true;}
 }
 get src(){return this._src;}
}
const ctx={
 imageSmoothingEnabled:false,imageSmoothingQuality:'low',
 save(){},restore(){},translate(){},scale(){},beginPath(){},ellipse(){},fill(){},
 drawImage(im,...args){drawLog.push({src:im.src,smoothing:this.imageSmoothingEnabled,quality:this.imageSmoothingQuality,args});}
};
const env={Image:ImageMock,ctx,window:{},console,Math,Number,Object};
vm.createContext(env);
vm.runInContext(fs.readFileSync(path.join(root,'mei-ai.js'),'utf8'),env);
const actor=env.window.MeiAI;
assert(actor,'MeiAI controller must initialize');
assert.deepEqual(Object.keys(actor.poses).sort(),poseNames.slice().sort());
for(const name of poseNames){
 const im=actor.poses[name];
 assert(im.complete&&im.naturalWidth>0,`${name} image must load`);
}
assert.equal(actor.draw(ctx,{time:0,x:250},250,790,1.375),true,'idle Mei should draw');
assert.equal(drawLog.length,1);
assert.equal(drawLog[0].smoothing,true,'painted high-resolution sprites require smooth downsampling');
assert.equal(drawLog[0].quality,'high','painted high-resolution sprites use high-quality interpolation');
const interlude=fs.readFileSync(path.join(root,'interlude.js'),'utf8');
assert(interlude.includes('homeCatScale=Interlude.widths.home/Prelude.widths.home'),'single home scale must be computed once');
assert(interlude.includes('drawCat(250,790,homeCatScale);'),'idle and petting Mei must share the same world scale');
assert.equal((interlude.match(/drawCat\(250,790,homeCatScale\)/g)||[]).length,2,'both home render paths must use the same scale');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('mei-ai.js?rev=v109-mei-20261111'),'Mei controller URL must invalidate stale browser cache');
assert(html.includes('interlude.js?rev=v109-mei-20261111'),'Interlude URL must invalidate stale browser cache');
assert(html.includes('application-version\" content=\"RC73-V109-MEI-CANDIDATA-20261111'),'candidate build identity must be explicit');
assert(fs.readFileSync(path.join(root,'mei-ai.js'),'utf8').includes(".png?rev=v109-mei-20261111"),'Mei pose URLs must invalidate stale image cache');
const walkState={time:1,x:250,flags:{},meiAI:{x:260,v:0,mode:'walk',last:1,decisionAt:10,target:300,seed:3,face:1}};
actor.draw(ctx,walkState,250,790,1.375);
const walkDraw=drawLog[drawLog.length-1];
assert.equal(walkDraw.args[3],60*1.375,'walk pose height must be normalized against sitting pose width');
const stickyState={time:10,x:250,catReactUntil:0,flags:{meiPetted:true},meiAI:{x:250,v:0,mode:'sit',last:9,decisionAt:100,seed:3,face:1}};
actor.step(stickyState,250);
assert.notEqual(stickyState.meiAI.mode,'reach','persistent story flag must not keep Mei reaching indefinitely');
const timedState={time:10,x:250,catReactUntil:11,flags:{meiPetted:true},meiAI:{x:250,v:0,mode:'sit',last:9,decisionAt:100,seed:3,face:1}};
actor.step(timedState,250);
assert.equal(timedState.meiAI.mode,'reach','active interaction timer should trigger the reach pose');
timedState.time=11.1;timedState.catReactUntil=11;actor.step(timedState,250);
assert.equal(timedState.meiAI.mode,'sit','Mei must leave the reach pose when the interaction timer expires');
console.log('PASS Mei V109: transparent poses, scale consistency, walk-size normalization, timed petting, cache invalidation');
