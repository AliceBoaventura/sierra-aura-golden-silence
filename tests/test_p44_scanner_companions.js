'use strict';
// P44 focused runtime checks. These do not claim a real browser playthrough.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const sandbox={console};vm.createContext(sandbox);vm.runInContext(read('runtime.js'),sandbox,{filename:'runtime.js'});
const R=sandbox.NeoRuntime;let count=0;
function check(ok,message){assert.ok(ok,message);count++;}
{
 const s={mode:'playing',scan:false,scanLock:false,energy:100};
 R.scan(s,true,.035,16,12);check(s.scan&&s.scannerState==='active'&&s.energy<100,'scanner active and draining');
 for(let i=0;i<300;i++)R.scan(s,true,.035,16,12);
 check(!s.scan&&s.scanLock&&s.scannerState==='depleted','empty scanner locks and reports depletion');
 const depleted=s.energy;R.scan(s,false,.035,16,12);
 check(!s.scanLock&&s.energy>depleted&&s.scannerState==='off','scanner recharges when released');
}
{
 const s={x:0,jinxX:-170,jinxFoot:0,jinxFace:1};let maxStep=0;
 for(let i=0;i<130;i++){s.x+=215/60;const before=s.jinxX;R.followCompanion(s,'jinx',s.x-170,1/60);maxStep=Math.max(maxStep,Math.abs(s.jinxX-before));}
 check(s.x-s.jinxX<225,'Jinx stays near Sierra during continuous movement');
 check(maxStep<=310/60+1e-5,'companion speed is bounded per frame');
 const x=s.jinxX;s.x=s.jinxX+170+1;R.followCompanion(s,'jinx',s.x-170,1/60);
 check(s.jinxX===x,'follower rests within 3-pixel dead zone');
}
{
 const source=read('game.js');
 const a=source.indexOf('function syncTouchScanner(){');
 const b=source.indexOf("$('touchScan').onclick=",a);
 check(a>0&&b>a,'touch scanner synchronization function exists');
 const button={classList:{active:false,toggle(k,v){if(k==='active')this.active=v;}},attributes:{},setAttribute(k,v){this.attributes[k]=v;}};
 const ctx={state:{chapter:1,mode:'playing',scan:false},scanToggle:true,$:()=>button};
 vm.createContext(ctx);vm.runInContext(source.slice(a,b),ctx);
 ctx.syncTouchScanner();check(button.attributes['aria-pressed']==='false'&&!button.classList.active,'latched request is not falsely shown as active');
 ctx.state.scan=true;ctx.syncTouchScanner();check(button.attributes['aria-pressed']==='true'&&button.classList.active,'active scanner has visible pressed state');
 ctx.state.chapter=7;ctx.state.avatar='alex';ctx.state.scan=false;ctx.syncTouchScanner();
 check(button.attributes['aria-label'].includes('Alexandra'),'Alexandra uses interface label, not a fake active scanner');
}
{
 const source=read('neo-hud.js');
 const rootEl={classList:{toggle(){}},dataset:{},querySelector:()=>null};
 const status={textContent:'',dataset:{}},energy={setAttribute(k,v){this[k]=v}};
 const toggle={setAttribute(){},onclick:null};
 const hint={style:{}},radio={textContent:'',style:{}};
 const elements={game:rootEl,hint,radio,hudDetails:toggle,scannerStatus:status,energy};
 const ctx={document:{getElementById:id=>elements[id]},state:{mode:'playing',chapter:1,energy:100,scan:false},getComputedStyle:()=>({display:'none'})};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(source,ctx);
 const update=()=>ctx.NeoHUD.update();
 update();check(status.textContent==='SCAN · PRONTO','idle scanner clearly marked ready');
 ctx.state.scan=true;update();check(status.textContent==='SCAN · ATIVO'&&rootEl.dataset.scanner==='active','active status visible');
 ctx.state.scan=false;ctx.state.energy=4;update();check(status.textContent.includes('RECARREGANDO'),'low battery visibly marked recharging');
 ctx.state.energy=100;ctx.state.chapter=6;ctx.state.scan=true;update();check(status.textContent==='ECHO · ATIVO','Ghost Track retains ECHO-specific feedback');
 ctx.state.chapter=7;ctx.state.avatar='alex';ctx.state.scan=false;update();check(status.textContent.includes('SEM EMISSOR'),'Alexandra does not claim Sierra scanner is available');
 ctx.state.chapter=1;ctx.state.mode='paused';update();check(status.textContent==='SCAN · EM ESPERA','pause does not claim active scanning');
}
{
 const interval=read('interval.js');
 check(interval.includes('Number.isFinite(s.jinxX)?s.jinxX')&&interval.includes('Number.isFinite(s.auraX)?s.auraX'), 'chapter 7 renders actual companion positions in dialogue and exploration');
 const html=read('index.html');check(html.includes('id="scannerStatus"'),'shared scanner status is present in actual game HTML');
}
console.log(`PASS ${count}/${count} P44 scanner, UI, companion and render assertions (Node VM)`);
