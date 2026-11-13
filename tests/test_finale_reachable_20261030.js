'use strict';
const {fixture,read,root,assert}=require('./current_depot_fixture');
const fs=require('node:fs'),path=require('node:path');
// The live campaign must play the depot introduction, not silently bypass it.
const a=fixture(),I=a.I,s=a.s;
I.change(s,'depotApproach',1500);s.mode='interludeCinematic';
a.tick(210);assert.equal(s.stage,'depot');assert.equal(s.mode,'interludeDialogue');
assert.equal(s.dialogue,'depotInside');assert(s.dialogueLines.some(x=>x.text.includes('quatro lugares')));
a.finish();assert.equal(s.mode,'playing');
// Evidence collection and incorrect hypothesis cannot trigger the finale.
a.clues();assert.equal(a.use('depotTerminal'),'interludeDialogue');
assert.equal(s.dialogue,'depotCompare');I.advance(s,0);a.finish();
assert.equal(s.stage,'depot');assert.equal(s.mode,'playing');assert(!s.flags.depotFinal);
// The RC56-approved ending cuts the unnecessary dossier speech after proof is assembled.
assert.equal(a.use('depotTerminal'),'interludeDialogue');
assert.equal(s.dialogue,'depotCompare');
const options=s.dialogueLines[0].choices;
assert.equal(options.length,3,'Keep three deduction choices');
assert(/preparados antes/.test(options[1].label),'The correct evidence-backed hypothesis remains');
assert(!s.flags.depotFinal);
I.advance(s,1);a.finish();
assert.equal(s.stage,'depot');assert.equal(s.mode,'interludeCinematic');
assert(s.flags.depotFinal&&Number.isFinite(s.flags.depotResolveAt));
assert(!s.events.some(e=>e.type==='dialogue'&&e.id==='depotFinal'),'No redundant post-proof speech is triggered');
a.completeEnd();
// The final visual uses the original P43 half-face crops with a retained
// fallback portrait, not a generated stock image or a second epilogue.
for(const id of ['sierra','jinx','aura']){
 const img=path.join(root,`depot-final-half-face-${id}.png`);
 const fallback=path.join(root,`depot-p43-final-${id}.png`);
 assert(fs.statSync(img).size>50000,`Missing canonical half-face crop ${id}`);
 assert(fs.statSync(fallback).size>100000,`Missing fallback portrait ${id}`);
}
const interlude=read('interlude.js'),html=read('index.html'),css=read('finale-refinement.css');
assert(html.includes('finale-refinement.css'));
assert(interlude.includes('preloadDepotFinalArt();'));
assert(interlude.includes('depot-final-half-face-'));
assert(interlude.includes('depot-p43-final-'));
assert(!interlude.includes('ASSINATURA AUSENTE · SEQUÊNCIA PRESERVADA'), 'Final não pode exibir rodapé documental');
assert(css.includes('@media(max-width:760px)'));
assert(css.includes('prefers-reduced-motion:reduce'));
assert(!interlude.includes('window.P53Finale?.open()'));
console.log('PASS: natural depot intro, four manual clues, retry, correct evidence gate, no redundant speech, portraits, mobile/reduced-motion and end card');
