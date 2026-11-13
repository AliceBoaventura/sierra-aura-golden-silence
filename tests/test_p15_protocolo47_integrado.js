'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,read,assert}=require('./current_depot_fixture');
assert.ok(!read('prelude-engine.js').includes('Há uma tubulação baixa'));
assert.ok(!read('dialogue-director.js').includes('AUTO: ON'));
assert.ok(read('interlude-story.js').includes('SETOR 47 / PORTA DO DEPÓSITO DE ALEXANDRA'));
assert.ok(read('interlude.js').includes('drawDepotResolve(s)'));
const g=fixture();assert.ok(g.c.InterludeStory.final.some(x=>x.text==='Só não some sem me avisar, tá?'));g.clues();assert.ok(g.deduction(1).final);g.completeEnd();
console.log('PASS: 47-minute sequence with required manual investigation');
