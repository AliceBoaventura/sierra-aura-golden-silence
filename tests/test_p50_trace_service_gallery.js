'use strict';
// This regression suite began in P50. P51 extends it to protect the
// production-art assets, global runtime hookup, and alpha wall mounting.
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'trace-gallery.js'),'utf8');
const imagePool=[];
class Image{
 constructor(){this.complete=true;this.naturalWidth=2172;this.naturalHeight=724;imagePool.push(this)}
 set src(v){this.url=v;}get src(){return this.url;}
}
const cx={Image,console};cx.window=cx;cx.globalThis=cx;vm.createContext(cx);
vm.runInContext(code,cx,{filename:'trace-gallery.js'});
const gallery=cx.TraceGallery;
assert(gallery,'P50 broke here: gallery must be exposed as window.TraceGallery');
assert.equal(imagePool[0].src,'assets/locations/aura-hideout-approach.jpg');
assert(fs.statSync(path.join(root,imagePool[0].src)).size>10000,'Hideout background ships');
const kinds=['console','audio','reader','repair','camera','archive','lift','exit'];
for(const kind of kinds){
 assert(imagePool.some(im=>im.src===`assets/gallery/${kind}.png`),'Load art '+kind);
 const p=path.join(root,'assets/gallery',`${kind}.png`);
 assert(fs.statSync(p).size>10000,'Fully rendered sprite '+kind);
 const sig=fs.readFileSync(p).subarray(0,8).toString('hex');assert.equal(sig,'89504e470d0a1a0a');
}
const input=fs.readFileSync(path.join(root,'prelude.js'),'utf8');
const engine=fs.readFileSync(path.join(root,'prelude-engine.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const atmosphere=fs.readFileSync(path.join(root,'p46-atmosphere.js'),'utf8');
const worldlife=fs.readFileSync(path.join(root,'world-life.js'),'utf8');
assert(/<script src="\.\/trace-gallery\.js"><\/script><script src="\.\/prelude\.js(?:\?rev=[^"]+)?"><\/script>/.test(html));
assert(input.includes('TraceGallery.drawBackground(ctx,wide,s.scan,spectralImage)'));
assert(input.includes("else if(s.stage==='trace'&&window.TraceGallery){anchor=TraceGallery.drawStation(ctx,o,s);}"));
assert(input.includes("if(s.scan&&s.stage!=='home'&&s.stage!=='trace')"));
assert(!atmosphere.includes("['district','trace','approach'].includes"),'No rain indoors');
assert(worldlife.includes("if(stage==='trace'){ctx.save()"));
assert(engine.includes("name:'ARQUIVO DA CÂMERA'"));
const expected={terminal:500,music:1000,credential:1400,solder:1760,camera:2020,files:3120,lift:3660,exit:3980};
for(const [id,x] of Object.entries(expected))assert.equal(gallery.stations[id].x,x);
const objects=vm.runInNewContext(engine+';globalThis.Prelude.objects.trace',{NeoRuntime:{},NPCQuests:{},StoryContinuity:{},console,globalThis:{}});
for(const [id,x] of Object.entries(expected))assert.equal(objects.find(o=>o.id===id)?.x,x);
function mockCtx(){
 const ops=[];const c={ops,save(){},restore(){},translate(){},fillRect(...a){ops.push(['fillRect',...a]);},strokeRect(...a){ops.push(['strokeRect',...a]);},setLineDash(...a){ops.push(['setLineDash',...a]);},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillText(){},drawImage(...a){ops.push(['drawImage',...a]);},createRadialGradient(){return{addColorStop(){}}},createLinearGradient(){return{addColorStop(){}}}};return c;
}
const ctx=mockCtx();const flags={terminal:true,credential:false,camera:false};const state={scan:true,x:1400,flags};
for(const o of objects){
 const snap=JSON.stringify(state);const anchor=gallery.drawStation(ctx,o,state);
 assert.equal(anchor[0],o.x,o.id+' world x');assert(anchor[1]>=600&&anchor[1]<=700);
 assert.equal(JSON.stringify(state),snap,'Drawing must not mutate game flags');
}
const paints=ctx.ops.filter(op=>op[0]==='drawImage');
assert.equal(paints.length,0,'Do not float large item sprites over an already painted environment');
const marks=ctx.ops.filter(op=>op[0]==='strokeRect');
assert(marks.length>=8,'Each of the eight stations gets a small inline status marker when scanning');
assert(marks.every(op=>op[3]<=55&&op[4]<=47),'No gigantic overlay panel or fake floating object');
assert.equal(gallery.assetsReady(),true);
const back=mockCtx();assert.equal(gallery.drawBackground(back,4200,false,x=>x),true);
const painted=back.ops.filter(op=>op[0]==='drawImage');assert.equal(painted.length,1,'New single hideout background must not tile/duplicate');
assert.equal(painted[0][2],0);assert.equal(painted[0][3],260);
assert.equal(painted[0][4],4200);assert.equal(painted[0][5],900);
imagePool[0].complete=false;const fallback=mockCtx();assert.equal(gallery.drawBackground(fallback,4200,false,x=>x),false);
assert.equal(fallback.ops.filter(op=>op[0]==='fillRect').length,1,'Loading fallback must not spawn ugly boxes');
console.log('PASS current hideout: 8 grounded scanner markers, immutable game flags, no floating props and a single room background');
