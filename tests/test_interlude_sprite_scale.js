'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const log=[];
class MockImage {constructor(){this.naturalWidth=1536;this.naturalHeight=1024;this.complete=true;}
 set src(v){this._src=v;if(this.onload)this.onload();}get src(){return this._src;}}
const ctx={save(){},restore(){},translate(...p){log.push(['translate',...p]);},scale(...p){log.push(['scale',...p]);},beginPath(){},ellipse(){},fill(){},drawImage(...a){log.push(['drawImage',...a]);}};
const env={Image:MockImage,ctx,state:{chapter:8,stage:'cafe'},actorsLoaded:true,jinxMotionReady:true,console,Math,window:{},$:()=>({}),interludeReady(){},drawJinxFrame(...a){log.push(['jinx',...a]);},drawActorFrame(...a){log.push(['sierra',...a]);}};
vm.createContext(env);vm.runInContext(fs.readFileSync('coffee-sprites.js','utf8'),env);
vm.runInContext("coffeeActor(200,800,1,0,false,'sierra'); coffeeActor(400,800,1,0,false,'jinx')",env);
assert(log.some(a=>a[0]==='sierra'&&a[2]===208),'Sierra stands at correct 208px world height');
assert(log.some(a=>a[0]==='jinx'&&a[3]===264),'Jinx stands tall at 264px world height');
assert(264>208*1.2,'Jinx remains visibly taller than Sierra at café');
log.length=0;env.state.stage='walk';
vm.runInContext("coffeeActor(200,800,1,0,false,'sierra'); coffeeActor(400,800,1,0,false,'jinx')",env);
assert(log.some(a=>a[0]==='sierra'&&a[2]===208),'Outside Sierra keeps 208px height');
assert(log.some(a=>a[0]==='jinx'&&a[3]===264),'Outside Jinx keeps 264px height');
log.length=0;env.state.stage='cafe';
vm.runInContext("coffeeTableActor('jinx'); coffeeTableActor('sierra')",env);
const frames=log.filter(a=>a[0]==='drawImage');assert.strictEqual(frames.length,2);
assert(Math.abs(frames[0][5]-278)<.01,'Jinx seated cafe scale');
assert(Math.abs(frames[1][5]-262)<.01,'Sierra seated cafe scale');
assert.deepStrictEqual(log.filter(a=>a[0]==='translate').map(a=>a.slice(1)),[[530,800],[805,800]],'Chair seat and foot registration');
const ratio=frames[0][5]/frames[1][5];assert(ratio>1.05&&ratio<1.1,'Jinx retains a taller seated silhouette');
assert(frames.every(a=>a[1]&&a[1]._src?.includes('assets/visual-v105/cafe-seat-')),'new transparent seated characters, not old painted composite');
console.log('PASS V105 Interlúdio: transparent dynamic seats, proportions, feet at floor');
