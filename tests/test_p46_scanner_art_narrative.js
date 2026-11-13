'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const ctx={console,window:null,globalThis:null};ctx.window=ctx;ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(read('runtime.js'),ctx);const R=ctx.NeoRuntime;
const s=(chapter,extra={})=>({chapter,mode:'playing',stage:'home',energy:100,scan:false,scanLock:false,...extra});
assert.equal(R.scannerProfile(s(1)),'battery');assert.equal(R.scannerProfile(s(2)),'battery');assert.equal(R.scannerProfile(s(3)),'battery');assert.equal(R.scannerProfile(s(5)),'battery');assert.equal(R.scannerProfile(s(6)),'echo');assert.equal(R.scannerProfile(s(7,{avatar:'alex'})),'interface');assert.equal(R.scannerProfile(s(7,{avatar:'sierra'})),'battery');assert.equal(R.scannerProfile(s(8,{stage:'depot'})),'battery');assert.equal(R.scannerProfile(s(8,{stage:'cafe'})),'unavailable');assert.equal(R.scannerProfile(s(4)),'unavailable');
let b=s(1);R.scan(b,true,1/60);assert.equal(b.scan,true);assert.ok(b.energy<100);
for(let i=0;i<600;i++)R.scan(b,true,1/60);assert.equal(b.scanLock,true);assert.equal(b.scan,false);assert.equal(R.scannerCanStart(b),false);
R.scan(b,false,1/60);assert.equal(b.scanLock,false);for(let i=0;i<120;i++)R.scan(b,false,1/60);assert.equal(R.scannerCanStart(b),true);R.scan(b,true,1/60);assert.equal(b.scan,true);
const echo=s(6,{energy:9});R.scan(echo,true,1/60);assert.equal(echo.scan,true);assert.equal(echo.energy,9);assert.equal(R.scannerCanStart(echo),true);
const alex=s(7,{avatar:'alex'});R.scan(alex,true,1/60);assert.equal(alex.scan,false);assert.equal(alex.energy,100);assert.equal(alex.scannerState,'interface');
const locked=s(2,{energy:4});assert.equal(R.scannerCanStart(locked),false);R.scan(locked,true,1/60);assert.equal(locked.scan,false);
vm.runInContext(read('terrace-story.js'),ctx);const T=ctx.Terrace;for(const ending of ['stay','study','refuse']){const x=T.create();x.ending=ending;x.nightChoice='rest';const text=T.ending(x).text;assert.ok(text.includes('Aura')||text.includes('Sierra'));assert.ok(text.length>100&&text.length<500)}
assert.ok(read('p46-atmosphere.js').includes('prefers-reduced-motion'));
assert.ok(read('interlude.js').includes('ARQUIVO')||read('style.css').includes('AUTORIZAÇÃO'));
assert.ok(read('index.html').includes('p46-atmosphere.js'));
console.log('PASS P46 scanner matrix, 12% lock/recovery, ECHO, Alexandra interface, branch endings, cinematic art');
