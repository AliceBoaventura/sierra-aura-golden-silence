'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
const context={console,window:{},StoryContinuity:{history(){return{}},record(){}}};
vm.createContext(context);
vm.runInContext(read('dialogue-director.js'),context);
const r=context.window.DialogueDirector.response;
assert.equal(r('JINX: Fico na porta.','ALEXANDRA').speaker,'JINX');
assert.equal(r('JINX: Fico na porta.','ALEXANDRA').text,'Fico na porta.');
assert.equal(r('AURA / ENLACE: Só a janela autorizada.','ALEXANDRA').speaker,'AURA / ENLACE');
assert.equal(r('ALEX: É o original.','ALEXANDRA').speaker,'ALEXANDRA');
assert.equal(r('BARMAN: Guardem a lente.','ALEXANDRA').speaker,'BARMAN');
assert.equal(r('Jinx alisa o cartaz. Não diz mais nada.','JINX').speaker,'CENA');
assert.equal(r('Jinx, vem aqui.','SIERRA').speaker,'SIERRA');
assert.equal(r('O canal não responde.','SIERRA').text,'O canal não responde.');
assert(read('club.js').includes("displayed?.speaker||b.who")&&read('ghost.js').includes("displayed?.speaker||b.who"));
vm.runInContext(read('terrace-story.js'),context);
const T=context.window.Terrace;
assert.equal(T.beats.length,10);
assert(T.beats.every(b=>b.choices.length===3));
for(const ending of ['stay','study','refuse']){
 for(const option of ['sex','rest','leave']){
  const s=T.create();s.ending=ending;s.nightChoice=option;s.loveLine='together';const txt=T.ending(s).text;
  assert(txt.length<480,'The epilogue must not repeat the same explanation');
  assert(txt.includes('saída que sirva às duas'),'Epilogue must preserve an earlier bond decision');
  if(option==='leave')assert(!txt.includes('O sonho continua'),'No shared dream after Aura leaves');
 }
}
assert(/h=id==='jinx'\?216:174/.test(read('interlude.js')),'Jinx must be visibly taller in the depot, too');
assert(read('scenery-finish.js').includes('only source of columns'),'Scene finishing may not paint extra structural columns');
assert(!read('scene-props-p61.js').includes("['poster','rc73-club-poster'"),'No floating poster cutout');
assert(read('scene-props-p61.js').includes("'poster'"),'Preserve in-world poster hotspot coverage');
const index=read('index.html');
assert(index.includes('abertura-original')===false||index.includes('cadillacWeather'),'Keep the original title markup');
assert(index.includes('id="bootStatus"')&&index.includes('id="start"'));
console.log('V9 targeted QA PASS: 7 voice attribution cases; 9 epilogue combinations; 10 scenes x 3 choices; asset/layout/boot contracts');
