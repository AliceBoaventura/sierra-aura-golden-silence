'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,assert}=require('./current_depot_fixture');
for(const option of [0,2]){const g=fixture();g.clues();assert.equal(g.deduction(option).final,false,`Choice ${option} must not end story`)}
const g=fixture();g.clues();assert.ok(g.deduction(1).final);const time=g.s.time;g.s.mode='paused';g.tick(40);assert.equal(g.s.time,time);g.s.mode='interludeCinematic';g.completeEnd();
for(const outcome of ['rescued','escorted','left',undefined]){const q=fixture(outcome);q.I.speak(q.s,'depotArchive');assert.equal(q.s.flags.depotNeriOutcome,outcome||'unknown');assert.equal(q.s.dialogueLines.length,outcome?6:4)}
const near=fixture();near.s.x=500;assert.equal(near.I.near(near.s)?.id,'depotBoard');near.s.x=330;assert.equal(near.I.near(near.s),null);
console.log('PASS: 3 choices, Neri outcomes, pause, proximity, completed end');
