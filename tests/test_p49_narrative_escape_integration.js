'use strict';
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const ctx={console, window:null, globalThis:null,sessionStorage:{removeItem(){}}};
ctx.window=ctx;ctx.globalThis=ctx;ctx.SharedMoments={reset(){}};vm.createContext(ctx);
function load(name){vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),ctx,{filename:name})}
for(const name of ['story-continuity.js','terrace-story.js','club-story.js','ghost-story.js','interval-story.js','interlude-story.js','runtime.js','interlude-engine.js'])load(name);
ctx.ClubStory=vm.runInContext('ClubStory',ctx);ctx.GhostStory=vm.runInContext('GhostStory',ctx);
let n=0;function check(label,f){f();n++;console.log('PASS',label)}
check('Original P47 three-position terrace survives the P48 chase',()=>assert.deepEqual(Array.from(ctx.Terrace.beats.find(x=>x.title==='Até onde você iria?').choices, x=>x[3]),['together','intervene','freedom']));
check('Original P47 privacy confrontation still occurs in the club',()=>assert.match(ctx.ClubStory.meet[1].line,/privacidade/));
check('Alexandra is neither resurrected nor reduced to a willing martyr',()=>{assert(ctx.IntervalStory.aftermath.some(x=>x.text.includes('SINAL VITAL ENCERRADO')));assert.match(ctx.ClubStory.closeness[0].choices[1][1],/Quero sair com eles/)});
check('Fresh session has no fabricated pursuit echoes',()=>{ctx.StoryContinuity.reset();assert(!ctx.StoryContinuity.lines(5,'raid',0).length);assert(!ctx.StoryContinuity.lines(5,'boarding',0).length)});
for(const [k,raid,board] of [
  ['together','prometi que encontraríamos','Dois lugares'],
  ['intervene','Não posso escolher esse preço','Proteger não é ordenar'],
  ['freedom','não usá-lo como escudo','Jinx escolheu cobrir']]){
 check('Club firefight reflects terrace '+k,()=>{ctx.StoryContinuity.restore({loveLine:k});assert(ctx.StoryContinuity.lines(5,'raid',0).some(t=>t.toLowerCase().includes(raid.toLowerCase())));assert(!ctx.StoryContinuity.lines(5,'boarding',0).length)});
 check('Boarding reflects '+k+' only after a genuine evidence choice',()=>{ctx.StoryContinuity.record('evidencePath','protect');assert(ctx.StoryContinuity.lines(5,'boarding',0).some(t=>t.includes(board)))});
}
check('The escape mechanic tests remain present',()=>{assert(fs.readFileSync(path.join(root,'club-engine.js'),'utf8').includes('pursuitBlock'));assert(fs.existsSync(path.join(root,'tests/test_p48_club_live_pursuit.js')))});
check('Ghost Track carries over the earlier choice without making one up',()=>{ctx.StoryContinuity.reset();assert(!ctx.StoryContinuity.lines(6,'welcome',0).some(t=>t.includes('rota de volta')));ctx.StoryContinuity.record('loveLine','together');ctx.StoryContinuity.record('evidencePath','trace');assert(ctx.StoryContinuity.lines(6,'welcome',0).some(t=>t.includes('rota de volta')))});
check('Café recalls the played chase and allows Jinx to challenge heroic framing',()=>{ctx.StoryContinuity.restore({club:'boundary',evidencePath:'trace'});const s=ctx.Interlude.create();ctx.Interlude.speak(s,'cafe1');assert(s.dialogueLines.some(x=>x.text.includes('entrou na frente de um disparo')));assert(s.dialogueLines.some(x=>x.text.includes('não virar a última pessoa no prédio')))});
check('Café does not invent memories in a chapter-select start',()=>{ctx.StoryContinuity.reset();const s=ctx.Interlude.create();ctx.Interlude.speak(s,'cafe1');assert(!s.dialogueLines.some(x=>x.text.includes('entrou na frente de um disparo')))});
check('Cloud reunion retains her right to decide',()=>{ctx.StoryContinuity.record('loveLine','freedom');const s=ctx.Interlude.create();ctx.Interlude.speak(s,'auraCloud');assert(s.dialogueLines.some(x=>x.text.includes('direito de escolher')));assert(s.dialogueLines.some(x=>x.choiceKey==='auraCloud'))});
check('Ending still distinguishes proof of authorization from guilt',()=>{ctx.StoryContinuity.restore({loveLine:'freedom',evidencePath:'trace',ghost:'boundary'});const s=ctx.Interlude.create();ctx.Interlude.speak(s,'depotFinal');assert(s.dialogueLines.some(x=>x.text.includes('HORA DA AUTORIZAÇÃO')));assert(s.dialogueLines.some(x=>x.text.includes('Ainda não sabemos quem assinou')));assert(s.dialogueLines.some(x=>x.text.includes('não era decidir por ela')));const proof=ctx.Interlude.create();ctx.Interlude.speak(proof,'depotCompare');assert(proof.dialogueLines.some(x=>x.choiceKey==='depotDeduction'))});
console.log('PASS '+n+'/'+n+' P49 narrative + P48 chase integration');
