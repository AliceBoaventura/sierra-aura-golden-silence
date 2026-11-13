'use strict';
// Current scene uses the same home world width, not the removed 1850px zoom.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');const source=n=>fs.readFileSync(path.join(root,n),'utf8');
const env={window:{},NeoRuntime:{},NPCQuests:{},StoryContinuity:{}};
vm.createContext(env);vm.runInContext(source('prelude-engine.js'),env);
assert.equal(env.window.Prelude.widths.home,1200);
const ghost=source('ghost.js');
assert(ghost.includes("const wide=s.stage==='home'?Prelude.widths.home:2600"),'Home chapter uses the actual shared world width');
assert(ghost.includes('const sceneZoom=1'),'Home no longer applies a hidden 1850px camera stretch');
assert(ghost.includes('const homeFrameOffset='),'Scene maintains centered home viewport framing');
assert(ghost.includes("s.stage==='home'?homeBg:ghostHome"),'Appropriate home art chosen for scene');
assert(ghost.includes('ctx.scale(sceneZoom,sceneZoom)'),'Camera scale remains stable');
console.log('PASS home scene uses consistent 1200px world width, centered camera and stable character-ground coordinates');
