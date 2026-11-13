'use strict';
// V10 migration of the original Sierra walk assertion: original body pixels
// remain present in the source atlas, while registered contact frames now draw
// with a fixed sole anchor rather than assuming a 660px canvas for all poses.
const assert=require('assert/strict'),fs=require('fs'),vm=require('vm');
const calls=[];
const metrics=JSON.parse(fs.readFileSync('QA_V10/animation_geometry_v10.json','utf8')).actors;
class ImageMock{
 constructor(){this.complete=true;this.naturalWidth=290;this.naturalHeight=660;}
 set src(path){this._src=path;const m=path.match(/^assets\/animation-v10\/(sierra|aura|jinx|alexandra)-(\d+)\.png$/);if(m){const {canvas_w,canvas_h}=metrics[m[1]];this.naturalWidth=canvas_w;this.naturalHeight=canvas_h;}}
 get src(){return this._src;}
}
const ctx={drawImage(...args){calls.push(args);}},scope={Image:ImageMock,ctx,window:{},console,Math};vm.createContext(scope);
vm.runInContext(fs.readFileSync('neo-art-actors.js','utf8'),scope);
const actors=scope.window.NeoActors;
for(let i=9;i<=12;i++)assert.equal(actors.draw('sierra',i,218),true);
assert.equal(calls.length,4);
for(let i=0;i<4;i++){
 const src=`assets/animation-v10/sierra-${[2,0,3,0][i]}.png`;
 assert.equal(calls[i][0].src,src);
 assert(Math.abs(calls[i][2]+calls[i][4])<1e-6,'sole touches exactly world y=0');
 const visible=calls[i][4]*metrics.sierra.visible_source_height/metrics.sierra.canvas_h;
 assert(Math.abs(visible-218)<.01,'registered visible body is 218 world units');
}
assert.equal(actors.frame('sierra',true,0,''),20);
assert.equal(actors.frame('sierra',false,0,''),0);
console.log('PASS Sierra original key art, registered heights, planted soles and preserved 4-step cycle');
