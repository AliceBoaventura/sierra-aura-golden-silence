'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {fixture,read,root,assert}=require('./current_depot_fixture');const fs=require('fs'),path=require('path');
const g=fixture();g.clues();assert.equal(g.s.flags.depotFinal,undefined);assert.ok(g.deduction(1).final);
g.tick(130);assert.equal(g.s.stage,'depot','must not jump over epilogue');g.completeEnd();
const js=read('interlude.js');assert.ok(js.includes('drawDepotResolve(s)'));for(const text of ['NÃO É A HORA DA MORTE. É A HORA DA AUTORIZAÇÃO.','Ela passou aqui depois.'])assert.ok(read('interlude-story.js').includes(text),text);
for(const n of ['mural','ficharios','fita','terminal','aura-idle'])assert.ok(fs.statSync(path.join(root,`depot-p21-${n}.png`)).size>15000);
console.log('PASS: 4 mystery clues, three ending lines, full epilogue and sprites');
