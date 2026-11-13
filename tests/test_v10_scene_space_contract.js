'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const paths=['prelude.js','apartment.js','uprising.js','terrace.js','club.js','ghost.js','interval.js','interlude.js'];
const stages=JSON.parse(fs.readFileSync('QA_V10/scene_inventory_v10.json','utf8'));
for(const s of stages)assert(fs.existsSync(s.path),`${s.stage} missing background ${s.path}`);
assert(stages.length>=13,'require scene coverage across eight episodes');
assert(paths.every(s=>fs.existsSync(s)));
const rendered=[];
class Img{constructor(){this.complete=true;this.naturalWidth=128;this.naturalHeight=128;}set src(v){this._src=v;}get src(){return this._src;}}
const ctx={save(){},restore(){},fillRect(){},strokeRect(){},beginPath(){},ellipse(){},fill(){},drawImage(...args){rendered.push(args)},filter:'none',globalAlpha:1};
const env={Image:Img,ctx,window:{},console,Math,Set,Object};vm.createContext(env);
vm.runInContext(fs.readFileSync('scene-props-p61.js','utf8'),env);
const p=env.window.ScenePropsP61;
// Every authored interaction has an owner: painted, sprite, or original renderer.
const cases={
 prelude:{home:['bed','bench','screen','communicator','exit'],district:['gate','clinic','terminal','music'],trace:['terminal','music','credential','solder','camera','files','lift','exit']},
 apartment:{main:['mirror','cup','drawer','shelf','power','glove','aura','workbench']},
 club:{club:['gate','bar','alex','poster'],booth:['module','wave','exit'],escape:['latch','exit']},
 ghost:{home:['comm','pc','leave'],apartment:['door','records','fridge','tapes','desk','sofa']},
 interval:{holding:['cot','wrist','reader'],access:['brace','trace0','trace1'],archive:['files','terminal','keane']},
 interlude:{home:['window','terminal','exit'],cafe:['table','counter','exit'],depot:['terminal']}
};
let coverage=0;for(const [scene,stages] of Object.entries(cases))for(const [stage,ids]of Object.entries(stages)){
 const found=p.audit(scene,stage,ids);for(const target of found){assert.notEqual(target.coverage,'MISSING',`${scene}/${stage}/${target.id} lacks a physical owner`);coverage++;}
}
// V10 removes the false stripe/rivet floor painted on top of an already
// illustrated walkway; world coordinate 800 and level hitboxes stay unchanged.
const floor=fs.readFileSync('scenery-finish.js','utf8');
assert(!floor.includes('for(let x=85;x<w;x+=260)'),'floating rivets overlay returned');
assert(floor.includes('function floor(w,y=800'),'floor coordinate remains unchanged');
const interval=fs.readFileSync('interval.js','utf8');
assert(!interval.includes('for(let x=350;x<wide;x+=620)'),'fake corridor columns returned');
assert(interval.includes("s.stage==='access'"),'access scene preserved');
const gallery=fs.readFileSync('trace-gallery.js','utf8');
assert(gallery.includes('return [x,y-16]'),'gallery continues to use physically anchored hotspots');
console.log(`PASS ${stages.length} documented scene art locations, ${coverage} hotspot owners, no duplicate painted-floor geometry`);
