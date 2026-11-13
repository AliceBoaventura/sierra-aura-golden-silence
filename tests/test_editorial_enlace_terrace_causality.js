/** Temporal contract: no personal promise during the relays, and all three
    meaningful Chapter 4 positions persist into Chapter 5. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const c={console,sessionStorage:{removeItem(){}},SharedMoments:{reset(){}}};c.window=c;c.globalThis=c;vm.createContext(c);
for(const f of ['story-continuity.js','terrace-story.js','club-story.js','ghost-story.js','interlude-story.js','rc73-editorial-v104.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const C=c.StoryContinuity,T=c.Terrace;
assert.equal(c.RC73V104EditorialAudit.errors.length,0,'Complete editorial patch must resolve every story target');
assert(!fs.readFileSync(path.join(root,'uprising.js'),'utf8').includes('showAfterRelayChoice'), 'no personal choice overlay in active relay corridor');
for(const [i,choice,phrase] of [[0,'research','cópia'],[1,'personal','sem aparelhos'],[2,'boundary','rota de saída']]){
 C.reset();const s=T.create();assert.equal(C.history().auraPromise,undefined);
 assert.match(T.beatFor(s).aside,/Horas depois da extração/);
 assert(!/prometeu|escolheu|conectou antes|beijou/.test(T.beatFor(s).aside));
 assert(T.choose(s,i));assert.equal(C.history().auraPromise,choice);
 assert.equal(C.history().loveLine,undefined,'The Chapter-4 arrival cannot preselect a romance branch');
 assert(C.lines(5,'meet',1)[0].includes(phrase),'Later consequence must match the actual, on-screen choice');
 const saved=C.history();C.reset();C.restore(saved);assert.equal(C.history().auraPromise,choice);
 console.log('PASS terrace arrival choice / Chapter 5 echo',choice);
}
C.reset();assert.equal(C.lines(5,'meet',1).length,0,'A fresh game has no invented promise');
