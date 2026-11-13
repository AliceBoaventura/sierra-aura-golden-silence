'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const pool=[];
class Image{constructor(){this.complete=true;this.naturalWidth=1049;pool.push(this);}set src(v){this.url=v;}}
const host={Image};host.window=host;vm.createContext(host);vm.runInContext(read('console-art.js'),host);
const c={ops:[],depth:0,save(){this.depth++;},restore(){this.depth--;},beginPath(){},ellipse(){},fill(){},translate(){},scale(){},arc(){},moveTo(){},lineTo(){},stroke(){},fillRect(){},drawImage(...v){this.ops.push(v);},createRadialGradient(){return{addColorStop(){}}}};
const state={flags:{patch:false,identified:false},scan:true,x:1240};
for(const status of ['idle','mapped','isolated','active','sealed']){
 const before=JSON.stringify(state);
 assert.equal(host.ConsoleArt.draw(c,1240,800,{status,scan:state.scan}),true);
 const draw=c.ops.at(-1);
 assert.equal(draw[1],204);assert.equal(draw[2],116);
 assert.equal(draw[6]+draw[8],800,'Sprite sole must match the engine floor');
 assert.equal(draw[5]+draw[7]/2,1240,'Sprite centre must match the interaction coordinate');
 assert.equal(c.depth,0,'Canvas save/restore must remain balanced');
 assert.equal(JSON.stringify(state),before,'Renderer must not write progress');
}
assert.equal(host.ConsoleArt.draw(c,700,800,{kind:'relay'}),true);
assert.equal(c.ops.at(-1)[0].url,'assets/gallery/reader.png');
const count=c.ops.length;pool[0].complete=false;
assert.equal(host.ConsoleArt.draw(c,1540,800),false,'Loading failure must enable the existing fallback');
assert.equal(c.ops.length,count);assert.equal(host.ConsoleArt.draw(c,0,0,{kind:'unknown'}),false);
assert.equal(c.depth,0);
for(const im of pool)assert.ok(fs.existsSync(path.join(root,im.url)),im.url);
const iv=read('interval.js'),up=read('uprising.js');
assert.match(iv,/s\.stage==='sacrifice'\?\[\[1240,s\.flags\.override\],\[2150,s\.flags\.sacrificed\]\]/,'Only two reachable consoles in sacrifice');
assert.ok(up.includes('ConsoleArt?.draw(ctx,n.x,800'));
const env={console};env.window=env;vm.createContext(env);
for(const file of ['runtime.js','interval-story.js','interval-engine.js'])vm.runInContext(read(file),env);
const s=env.Interval.create();
assert.equal(s.flags.patch,undefined);s.x=1240;
assert.equal(env.Interval.near(s).id,'cabinet');
// Power must still be locked behind the implant examination, then the actual puzzle.
s.useWas=false;env.Interval.step(s,{use:true},.03);assert.equal(s.mode,'playing');
s.flags.wrist=true;s.useWas=false;env.Interval.step(s,{use:true},.03);
assert.equal(s.mode,'intervalPuzzle');assert.equal(s.puzzle.kind,'patch');
s.puzzle.paths=[0,1,2];assert.equal(env.Interval.solve(s),true);
assert.equal(s.flags.patch,true);assert.equal(s.dialogue,'patched');
assert.equal(typeof env.IntervalStory.patched[0].text,'string');
console.log('P55 PASS: device art, world anchors, safe fallback, two sacrifice controls, gated patch puzzle and revised dialogue');
