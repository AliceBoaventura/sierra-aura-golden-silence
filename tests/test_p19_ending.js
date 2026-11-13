'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,read,assert}=require('./current_depot_fixture');
const g=fixture();g.tick(50);const before=g.s.stageTime;g.s.mode='paused';g.tick(70);assert.equal(g.s.stageTime,before);
g.s.mode='playing';g.tick(800);assert.equal(g.s.stage,'depot');assert.ok(!g.s.flags.depotFinal);
g.clues();assert.equal(g.deduction(1).mode,'interludeCinematic');g.completeEnd();
assert.ok(!read('interlude.js').includes('A batalha pela libertação de Neo Rockford fica para a história completa.'));
console.log('PASS: pause, manual ending requirement, final progression');
