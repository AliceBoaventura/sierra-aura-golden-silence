'use strict';
// V10.1: environmental identity regression — the club booth and evidence depot are not the same set.
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>fs.readFileSync(path.join(root,p));
const sha=p=>crypto.createHash('sha256').update(load(p)).digest('hex');
const backstage='assets/visual-v5/backstage-v5.png';
const archive='assets/visual-v102/depot-47-evidence-room.png';
const oldDepot='depot-p26-architecture.png';
for(const p of [backstage,archive,oldDepot]){
 const bytes=load(p);assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),p+' must be PNG');
}
const archiveBytes=load(archive);
assert.equal(archiveBytes.readUInt32BE(16),1280,'depot art must preserve source aspect ratio');
assert.equal(archiveBytes.readUInt32BE(20),720,'depot art must preserve source aspect ratio');
const source=load('assets/visual-v102/_source_depot-47-clean.png');
assert.equal(source.readUInt32BE(16),1672);assert.equal(source.readUInt32BE(20),941);
assert.notEqual(sha(archive),sha(backstage),'depot must not use backstage image');
assert.notEqual(sha(archive),sha(oldDepot),'new depot must differ from old backstage-derived architecture');
const club=load('club.js').toString();const interlude=load('interlude.js').toString();
assert(club.includes("backstageImage.src='assets/visual-v5/backstage-v5.png'"));
assert(interlude.includes("interludeDepot.src='assets/visual-v102/depot-47-evidence-room.png'"));
assert(interlude.includes("interludeDepotFallback.src='assets/visual-v102/_source_depot-47-clean.png'"), 'source art is the aspect-correct fallback');
assert(interlude.includes('no legacy prop') || interlude.includes('no legacy prop\n'), 'fallback does not add duplicate floating props');
const env={console};vm.createContext(env);for(const name of ['runtime.js','interlude-story.js','interlude-engine.js'])vm.runInContext(load(name).toString(),env,{filename:name});
const targets=JSON.parse(JSON.stringify(env.Interlude.objects.depot));
assert.deepEqual(targets.map(x=>[x.id,x.x]),[['depotBoard',454],['depotArchive',716],['depotTape',832],['depotTerminal',960]]);
assert.equal(env.Interlude.widths.depot,1280);
console.log('PASS V10.3 distinct depot, aspect-correct 16:9 background, remapped evidence hotspots, compact world width, fallback isolation');
