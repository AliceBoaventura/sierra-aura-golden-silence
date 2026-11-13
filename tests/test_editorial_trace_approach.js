'use strict';
/* Controlled engine-state editorial checks; NOT a continuous browser playthrough. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ctx=vm.createContext({console});ctx.window=ctx;ctx.globalThis=ctx;
for(const f of ['runtime.js','npc-quests.js','story-continuity.js','prelude-engine.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
let n=0;function check(label,fn){fn();console.log('PASS',label);n++;}
const use=(s,x)=>{s.x=x;s.y=800;s.useWas=false;ctx.Prelude.step(s,{use:true},.016);};
check('Passageiro descartável foi removido do percurso',()=>{
 const s=ctx.Prelude.create();s.stage='trace';
 assert.equal(ctx.Prelude.npcs(s).length,0);
 assert.equal(ctx.NPCQuests.status(s,'commuter'),null);
});
check('Pista ambiental no reprodutor aponta ao elevador sem travar a fase',()=>{
 const s=ctx.Prelude.create();s.stage='trace';s.flags.terminal=true;
 use(s,1000);
 const evidence=s.events.filter(e=>e.type==='object').map(e=>e.text).join(' ');
 assert(evidence.includes('B-3'));
 assert(evidence.includes('ELEVADOR DE SERVIÇO'));
 assert(!evidence.includes('PASSAGEIRO'));
 assert.equal(s.mode,'playing');
});
check('Corredor cria pista física sem nome automático antes de tocar interfone',()=>{
 const s=ctx.Prelude.create();s.stage='approach';s.x=470;
 ctx.Prelude.step(s,{},.016);
 const events=s.events.filter(e=>e.type==='object');assert(events.some(e=>e.text.includes('interfone')));
 assert(!events.some(e=>e.text.includes('LOVELACE')));
 assert.equal(s.flags.intercomChecked,undefined);
 use(s,600);
 assert.equal(s.flags.intercomChecked,true);
 assert(s.events.some(e=>e.type==='object'&&e.text.includes('A. LOVELACE')));
 assert.equal(s.mode,'playing');
});
check('Camera rende reação cautelosa de Jinx só após Sierra recuperar o registro',()=>{
 const s=ctx.Prelude.create();s.stage='trace';s.flags.terminal=true;s.flags.credential=true;s.x=2275;
 ctx.Prelude.step(s,{},.016);
 assert(!s.events.some(e=>e.speaker==='JINX'));
 s.flags.camera=true;s.x=2280;
 ctx.Prelude.step(s,{},.016);
 assert.equal(s.events.filter(e=>e.type==='radio'&&e.speaker==='JINX'&&e.text?.includes('O rosto não aparece')).length,1);
 assert(s.events.some(e=>e.text?.includes('não aparece')));
 ctx.Prelude.step(s,{},.016);
 assert.equal(s.events.filter(e=>e.type==='radio'&&e.speaker==='JINX'&&e.text?.includes('O rosto não aparece')).length,1);
});
check('Saída do rastro não ignora evidências obrigatórias',()=>{
 const s=ctx.Prelude.create();s.stage='trace';s.flags.camera=true;
 use(s,3980);assert.equal(s.stage,'trace');assert(s.x<=760,'terminal bloqueia caminho');
 s.flags.terminal=true;use(s,3980);assert.equal(s.stage,'trace');assert(s.x<=1600,'leitor bloqueia caminho');
 s.flags.credential=true;use(s,3980);assert.equal(s.stage,'approach');
});
check('Porta conclui fase apenas após proximidade e interação, com interfone opcional',()=>{
 const s=ctx.Prelude.create();s.stage='approach';use(s,600);
 assert.equal(s.mode,'playing');
 use(s,2130);
 assert.equal(s.mode,'won');assert(s.events.some(e=>e.type==='apartment'));
});
console.log(`EDITORIAL TRACE/APPROACH ${n}/${n}`);
