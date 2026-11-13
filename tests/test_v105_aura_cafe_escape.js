'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const uprising=read('uprising.js'),interval=read('interval.js'),cafe=read('coffee-sprites.js'),interlude=read('interlude.js'),club=read('club.js'),engine=read('club-engine.js');
// Verify the exact runtime transforms: locomotion art faces right; idle illustration faces left.
const auraFunction=uprising.slice(uprising.indexOf('function drawAuraAt('),uprising.indexOf('function drawUprising('));
const log=[];const sandbox={ctx:{save(){},restore(){},translate(){},scale(x){log.push(['scale',x]);}},auraLoaded:true,state:{chapter:7,stage:'access',mode:'playing'},window:{NeoActors:{frame(name,walking){return walking?20:0},draw(name,frame,h){log.push(['sprite',name,frame,h]);return true;}}}};
vm.createContext(sandbox);vm.runInContext(auraFunction,sandbox);
for(const [walking,face,expected] of [[true,1,1],[true,-1,-1],[false,1,-1],[false,-1,1]]){
 log.length=0;vm.runInContext(`drawAuraAt(100,800,${face},${walking})`,sandbox);
 assert.equal(log.find(x=>x[0]==='scale')?.[1],expected,`Aura visual direction wrong walking=${walking} face=${face}`);
 assert(log.some(x=>x[0]==='sprite'&&x[1]==='aura'),'Aura was not rendered');
}
assert(interval.includes('const auraLooksRight=px<s.x?1:-1'),'Aura idle must face Sierra, never mirror her input');
const ghost=read('ghost.js');assert(ghost.includes('const faceRight=x<state.x')&&ghost.includes('ctx.scale(faceRight?-1:1,1)'),'Chapter 6 Aura must face Sierra, not inherit a stale left-facing idle frame');
assert(!interval.includes("drawAuraAt(px,800,s.auraFace||s.face"),'old erroneous facing leak remains');
for(const id of ['jinx','sierra','cafe-real-table-occlusion']){
 const file=id.startsWith('cafe-')?`assets/visual-v105/${id}.png`:`assets/visual-v105/cafe-seat-${id}.png`;
 assert(fs.existsSync(path.join(root,file)),`new independent cafe art missing ${file}`);
}
assert(cafe.includes('coffeeSceneV105Ready()'),'new cafe seats must have an explicit ready/fallback contract');
assert(interlude.includes('coffeeDrawTableOcclusionV105(wide)'),'cafe hands must be physically occluded by the painted table');
assert(interlude.includes("if(seatedFrame&&!coffeeSceneV105Ready()&&coffeeSeatedReady)"),'old composite is fallback only');
assert(engine.includes("stage==='raid'?[2220,3010]:[320]"),'escape must use small readable patrol');
assert(club.includes('innerWidth<600?18:W-w-24'),'mobile Jinx cover HUD must remain onscreen');
assert(!engine.includes("guards.push({x:3315"),'alternate consequence must not spawn extra crowd');
assert(read('club-story.js').includes("radio('JINX / RÁDIO','Porta de serviço."),'no choice interruption during firefight');
assert(club.includes('if(!(escapeSceneImage.complete&&escapeSceneImage.naturalWidth))drawEscapeBulkhead'),'authored door must not be covered by an unrelated shutter');
assert(club.includes("// The short evacuation shows only Sierra, Jinx and the advancing patrol."),'evacuation must hide unnecessary crowd');
assert(club.includes("assets/visual-v105/service-corridor.png"),'unique service corridor must load');
assert(read('index.html').includes('rc73-club-escape-v105.js'),'short tactical script must load after editorial patches');
console.log('PASS V105: 4 Aura orientation transforms, companion facing, real cafe seats, guarded fallback, reduced escort, corridor art and dialogue patch');
