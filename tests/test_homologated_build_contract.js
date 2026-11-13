'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=n=>fs.readFileSync(path.join(root,n),'utf8');
// Exercise the real pursuit, including the finite cover window and a fatal retry.
const c={console,ClubCrowd:{visitors:[]}};c.window=c;vm.createContext(c);
for(const name of ['runtime.js','club-engine.js'])vm.runInContext(read(name),c,{filename:name});
const s=c.Club.create();c.Club.change(s,'escape');s.mode='playing';s.x=800;s.y=800;
c.NeoRuntime.placeCompanion(s,'jinx',710);s.pursuit.guards=[];s.pursuit.inv=0;
c.Club.pursuitStep(s,.035);assert(s.pursuit.coverSeconds>7.9);assert(s.pursuit.inv>0);
for(let n=0;n<245;n++)c.Club.pursuitStep(s,.035);
assert.equal(s.pursuit.coverSeconds,0,'Approach protection must expire');
assert.equal(s.pursuit.inv,0,'Jinx is not permanent invulnerability');
assert(!s.flags.latch&&!s.flags.latchRead,'Protection must not solve the scanner or latch');
s.hp=1;s.pursuit.shots=[{x:s.x+30,y:690,vx:-500,age:0}];
c.Club.pursuitStep(s,.035);
assert.equal(s.hp,3);assert.equal(s.x,200);assert.equal(s.pursuit.retries,1);
assert.equal(s.pursuit.coverSeconds,8,'A fatal retry renews the bounded approach window');
assert(!s.flags.latch&&!s.flags.latchRead);

// Render each active final shot through the actual DOM rendering function.
const source=read('interlude.js');
assert(source.includes("portrait.src='depot-final-half-face-'+id+'.png'"),'Chapter 8 must preload the same half-face crops shown by the final DOM, not old full portraits');
assert(!source.includes('depotFinalFaces'),'Dead full-body portrait preload must not consume bandwidth during the ending');
const body=source.slice(source.indexOf('function updateDepotFinalMobile(s){'),source.indexOf('\nfunction drawDepotEvidence(s){'));
assert(body.startsWith('function updateDepotFinalMobile'));
function element(){return{dataset:{},style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this[k]=v;},getAttribute(k){return this[k]??null;},remove(){this.removed=true;},querySelector(sel){return this.children[sel];},children:{}};}
const face=element(),name=element(),line=element(),layer=element();layer.children={'img':face,'.depot-final-p38-name':name,'.depot-final-p38-line':line};
const game=element();game.appendChild=()=>{};
const f={document:{createElement(){return layer;}},$(id){assert.equal(id,'game');return game;}};
vm.createContext(f);vm.runInContext('let depotFinalMobileLayer=null;\n'+body,f);
const final={stage:'depot',mode:'interludeCinematic',flags:{depotFinal:true,depotResolveAt:100},time:101};
for(const [time,id,who,text] of [[101,'sierra','SIERRA','Ela descobriu demais.'],[105,'jinx','JINX','E pagou o preço por isso.'],[109,'aura','AURA','Eles acham que acabou.'],[113,'sierra','SIERRA','Então vamos mostrar como começa.']]){
 final.time=time;f.updateDepotFinalMobile(final);
 assert.equal(name.textContent,who);assert.equal(line.textContent,text);
 assert.equal(face.src,'depot-final-half-face-'+id+'.png');
 assert(fs.existsSync(path.join(root,face.src)),'Updated final portrait must ship');
}
// A failed new image falls back once, without being reloaded every frame.
final.time=109;f.updateDepotFinalMobile(final);assert.equal(face.src,'depot-final-half-face-aura.png');
face.onerror();assert.equal(face.src,'depot-p43-final-aura.png');
f.updateDepotFinalMobile(final);assert.equal(face.src,'depot-p43-final-aura.png');
final.stage='end';f.updateDepotFinalMobile(final);assert(layer.removed,'Portrait must not obscure FIM DA DEMO');
console.log('PASS official build: finite Jinx cover, scanner gate, retry, four canonical final shots and end-card cleanup');
