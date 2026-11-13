'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n));
const main=read('assets/visual-v102/depot-47-evidence-room.png');
const source=read('assets/visual-v102/_source_depot-47-clean.png');
const dims=b=>({w:b.readUInt32BE(16),h:b.readUInt32BE(20)});
const a=dims(main),b=dims(source);
assert.deepEqual(a,{w:1280,h:720});
assert(Math.abs(a.w/a.h-b.w/b.h)<.001,'the source composition is uniformly scaled, not stretched');
const env={console};vm.createContext(env);
for(const f of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(read(f).toString(),env,{filename:f});
const I=env.Interlude;
assert.equal(I.widths.depot,1280,'depot world follows the 16:9 art width');
assert.deepEqual(JSON.parse(JSON.stringify(I.objects.depot.map(o=>[o.id,o.x]))),[
 ['depotBoard',454],['depotArchive',716],['depotTape',832],['depotTerminal',960]
]);
const s=I.create();I.change(s,'depot',640);s.mode='playing';
assert.equal(s.x,640);
for(const clue of I.objects.depot){s.x=clue.x;assert.equal(I.near(s)?.id,clue.id,clue.id+' remains reachable');}
assert.equal(I.near(Object.assign(s,{x:330})),null,'proximity radius is scaled with the corrected scene');
const engine=read('interlude-engine.js').toString(),stage=read('interlude.js').toString();
assert(engine.includes("s.stage==='depot'?108:112"),'depot interaction radius matches new world scale');
assert(engine.includes("s.stage==='depot'?120:s.stage==='cafe'?165:205"),'depot movement speed matches new world scale');
assert(engine.includes('s.jinxX=300;s.jinxMoving=false'),'Jinx stays clear of the mural hotspot');
assert(stage.includes("interludeDepot.src='assets/visual-v102/depot-47-evidence-room.png'"));
assert(stage.includes("interludeDepotFallback.src='assets/visual-v102/_source_depot-47-clean.png'"));
assert(stage.includes('const depotAuraX=1071'));
assert(stage.includes("W<480?(s.x+s.jinxX)/2:(s.jinxX+depotAuraX)/2"),'camera framing adapts to mobile and desktop');
assert(stage.includes("(s.stage==='depot'&&W<480)?0.88"),'mobile depot uses uniform scene scaling');
assert(stage.includes("W<480?(s.x+s.jinxX)/2:(s.jinxX+depotAuraX)/2"),'mobile camera keeps the pair visible on entry');
assert(stage.includes('ctx.fillText(t,labelX,y-60)'),'scanner labels stay above the actor silhouette');
assert(stage.includes('Math.max(55,Math.min(W-55,labelScreenX))'),'scanner labels stay inside the mobile viewport');
assert(stage.includes('const cue=[{x:407,y:270},{x:669,y:376},{x:797,y:368},{x:978,y:340}]'));
assert(stage.includes('ctx.drawImage(interludeDepot,0,28,wide,720)'));
console.log('PASS V10.3: depot art aspect, world scale, actor anchors, scanner cues, proximity, and movement contract');
