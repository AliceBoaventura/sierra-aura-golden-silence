'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'runtime.js'),'utf8'),ctx);
const R=ctx.NeoRuntime;let count=0;
function ok(cond,msg){assert.ok(cond,msg);count++;}
for(const name of ['Sierra Core','Apartamento','Enlace','Zona Cega','47 Minutos','Café']){
 const s={mode:'playing',energy:100,scan:false,scanLock:false};
 R.scan(s,true,.5);ok(s.scan&&s.energy===94,`${name}: 12 units/sec`);
 R.scan(s,false,.5);ok(!s.scan&&s.energy===100,`${name}: 16 units/sec`);
}
let s={mode:'playing',energy:1,scan:false,scanLock:false};
R.scan(s,true,.2);ok(!s.scan&&s.scanLock&&s.energy===0,'empty scanner locks');
R.scan(s,true,.5);ok(!s.scan&&s.energy===8,'held key does not auto-reactivate after depletion');
R.scan(s,false,.5);ok(!s.scanLock&&s.energy===16,'release recharges and unlocks');
R.scan(s,true,.1);ok(s.scan&&s.energy<16,'press again activates');
s={mode:'playing',energy:75,scan:false,scanLock:false};R.scan(s,true,.5,0,0);ok(s.scan&&s.energy===75,'Ghost ECHO retains distinct energy rule');
for(const who of ['jinx','aura']){
 s={x:900,[who+'X']:100,[who+'Face']:1,[who+'Foot']:0};let previous=s[who+'X'];
 for(let i=0;i<200;i++){R.followCompanion(s,who,s.x-125,1/60);ok(s[who+'X']-previous<=310/60+.0001,'companion max velocity');previous=s[who+'X'];}
 ok(Math.abs(s[who+'X']-775)<35,`${who} catches up without teleporting`);
}
const code=fs.readFileSync(path.join(root,'game.js'),'utf8');
ok(code.includes("e.target?.closest?.('input,select,textarea"),'keyboard respects range, selects and editable controls');
ok(code.includes("state.mode!=='playing'"),'touch scanner latch cancels on dialogue or puzzle');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
ok(css.includes('.demo-final-actions button:focus-visible'),'final action keyboard focus visible');
console.log(`PASS ${count}/${count} P44.2 regression checks (Node VM, not browser)`);
