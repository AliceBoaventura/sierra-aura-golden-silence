'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const context={};vm.createContext(context);
vm.runInContext(read('runtime.js'),context);
let passed=0;
function test(condition,label){assert.ok(condition,label);passed++;}
const R=context.NeoRuntime;
const chapters=['Sierra Core','Apartamento de Aura','Enlace','Zona Cega','47 Minutos','Café às 02:17'];
for(const chapter of chapters){
  const s={mode:'playing',energy:100,scan:false,scanLock:false};
  R.scan(s,true,1);
  test(s.energy===88&&s.scan,chapter+' drains at 12%/s');
  R.scan(s,false,1);
  test(s.energy===100&&!s.scan,chapter+' recharges at 16%/s');
}
const echo={mode:'playing',energy:50,scan:false,scanLock:false};
R.scan(echo,true,1,0,0);
test(echo.energy===50&&echo.scan,'ECHO is exempt from battery drain');
for(const f of ['engine.js','apartment-engine.js','uprising-engine.js','prelude-engine.js','club-engine.js','interval-engine.js','interlude-engine.js']){
  const text=read(f);
  test(/NeoRuntime\.scan\(s,(?:i|input)\.scan,dt\)/.test(text),f+' uses shared scanner balance');
}
const game=read('game.js');
test(game.includes("e.target?.closest?.('input,select,textarea"),'global keyboard listener exempts focused range inputs');
test(game.includes('keys.delete(e.code);'),'focused range does not leave a held movement key');
const css=read('style.css');
test(css.includes('.demo-final-actions{opacity:1;'),'ending action row no longer fades buttons');
test(css.includes('min-height:44px')&&css.includes('color:#f0f3f7'),'ending actions have legible color and 44px touch target');
test(css.includes('.demo-final-actions button:focus-visible'),'ending buttons have visible keyboard focus');
console.log('PASS '+passed+'/'+passed+' P44.1 regression checks');
