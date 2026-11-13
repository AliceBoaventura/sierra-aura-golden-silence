'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,read,root,assert}=require('./current_depot_fixture');const fs=require('fs'),path=require('path'),source=read('interlude.js');
for(const n of ['mural','ficharios','fita','terminal','aura-idle']){assert.ok(fs.statSync(path.join(root,`depot-p21-${n}.png`)).size>15000,n);assert.ok(source.includes(`depot-p21-${n}.png`)||source.includes("'depot-p21-'+name+'.png'"),n)}
assert.ok(source.includes('drawDepotEvidence(s)'));assert.ok(source.includes("depotP25Actor('aura'"),'Aura must render on the same floor plane');
const g=fixture();for(const id of ['depotBoard','depotArchive','depotTape','depotTerminal']){assert.equal(g.use(id),'interludeDialogue');assert.equal(g.s.depotInspectArt,id);g.finish();assert.equal(g.s.flags[id],true)}
assert.ok(g.deduction(1).final);g.completeEnd();console.log('PASS: P21 art refs + evidence overlay + deliberate end');
