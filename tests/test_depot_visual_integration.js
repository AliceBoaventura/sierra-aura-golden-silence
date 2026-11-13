'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,read,root,assert}=require('./current_depot_fixture');const fs=require('fs'),path=require('path');
for(const n of ['depot-gate-art.png','depot-workshop-art.png','depot-evidence-art.png','depot-terminal-art.png','sprite-chave-47.png','sprite-mural-alexandra.png','sprite-terminal-47.png']){
 const data=fs.readFileSync(path.join(root,n));assert.ok(data.length>10000,n);assert.ok(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),n)}
assert.ok(read('interlude.js').includes('FIM DA DEMO'));const g=fixture();g.tick(1000);assert.equal(g.s.stage,'depot');g.clues();assert.ok(g.deduction(1).final);g.completeEnd();
console.log('PASS: original art + evidence-gated cinematic ending');
