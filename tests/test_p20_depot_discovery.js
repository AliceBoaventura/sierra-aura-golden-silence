'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,assert}=require('./current_depot_fixture');
const g=fixture();assert.equal(g.use('depotBoard',false),'playing');assert.ok(!g.s.flags.depotBoard,'no clue without scanner');
g.clues();assert.equal(g.s.flags.depotFinal,undefined);const end=g.deduction(1);assert.equal(end.choice,1);assert.ok(end.final);g.completeEnd();
console.log('PASS: scanner + 4 clues + completed dialogues + terminal decision');
