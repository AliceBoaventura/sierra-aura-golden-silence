'use strict';
// Regression: the Chapter-4 terrace decision has a Chapter-5 echo, not a relay-room romance.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync(require('node:path').join(__dirname,'../story-continuity.js'),'utf8');
const ctx={SharedMoments:{reset(){}},document:{createElement(){}},sessionStorage:{removeItem(){}}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const mem=ctx.StoryContinuity;
const expected={
 research:'AURA / RÁDIO: A cópia que você trouxe ao terraço continua isolada. Os seis minutos ainda não têm explicação.',
 personal:'AURA / RÁDIO: Você pediu uma conversa sem aparelhos no terraço. Eu lembro.',
 boundary:'AURA / RÁDIO: Sobre o que combinamos no terraço: não entro em outro enlace sem te mostrar a rota de saída.'
};
for(const [choice,line] of Object.entries(expected)){
 mem.reset();mem.record('auraPromise',choice);
 const out=mem.lines(5,'meet',1);
 assert.deepEqual(Array.from(out),[line],`Unplayed consequence for ${choice}`);
 const snapshot=mem.history();mem.reset();mem.restore(snapshot);
 assert.deepEqual(Array.from(mem.lines(5,'meet',1)),[line],`Restored ${choice}`);
 console.log('PASS',choice,'correct and persists');
}
mem.reset();assert.equal(mem.lines(5,'meet',1).length,0,'Fresh run must not inherit a promise');
console.log('PASS fresh-run isolation');
