'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const c={console,Image:class{set src(v){this._src=v;}},window:{},globalThis:null,NeoRuntime:{reset:()=>{},delta:x=>x,scan:()=>{},closest:()=>null,placeCompanion:()=>{},follow:()=>{}}};c.window=c;c.globalThis=c;vm.createContext(c);let passed=0;
const check=(v,why)=>{assert.ok(v,why);passed++};
vm.runInContext(read('runtime.js'),c,{filename:'runtime.js'});
for(const ms of [17,33,80,120,200]){
 const steps=c.NeoRuntime.frameSteps(ms/1000);const sum=steps.reduce((a,b)=>a+b,0);
 check(steps.every(x=>x>0&&x<=1/60+1e-8),`frameSteps(${ms}ms) keeps physics bounded`);
 check(Math.abs(sum-ms/1000)<1e-9,`frameSteps(${ms}ms) retains elapsed time`);
}
check(c.NeoRuntime.frameSteps(100).reduce((a,b)=>a+b,0)<=.2+1e-8,'long tab stalls have safe 200ms cap');
vm.runInContext(read('neo-art-actors.js'),c,{filename:'neo-art-actors.js'});
for(const who of ['aura','jinx','alexandra']){
 const poses=[0,1,2,3].map(n=>c.NeoActors.frame(who,true,n/.85));
 check(JSON.stringify(poses)==='[20,21,22,23]',`${who} strides pass through planted-foot contact`);
 check(c.NeoActors.frame(who,false,4)===0,`${who} stops on a stable idle sprite`);
}
vm.runInContext(read('terrace-story.js'),c,{filename:'terrace-story.js'});
for(const tone of [{close:1,guard:3,identity:0},{close:1,guard:0,identity:3},{close:3,guard:0,identity:0}]){
 const s=c.Terrace.create();s.tone=tone;s.nightChoice='rest';s.ending='study';s.loveLine='freedom';
 const out=c.Terrace.ending(s).text;
 check(out.includes('dividiram a noite')&&out.includes('testar outra saída')&&out.includes('não exigiu acesso')&&out.length<500,'terrace outcome is concise and retains agency, context and the chosen bond');
}
vm.runInContext(read('interlude-story.js'),c,{filename:'interlude-story.js'});
const final=c.InterludeStory.depotFinal;
check(final.length>=10,'depot ending contains expanded in-game dialogue');
check(final.some(x=>x.who==='ANOTAÇÃO DE ALEXANDRA'&&x.text.includes('HORA DA AUTORIZAÇÃO')),'Alexandra archival note retained');
check(final[final.length-1].text==='E os que ainda estão vivos?','cliffhanger preserved');
vm.runInContext(read('interlude-engine.js'),c,{filename:'interlude-engine.js'});
for(const hasMessage of [false,true]){
 const s=c.Interlude.create();s.flags.honk=hasMessage;s.mode='playing';s.scan=true;
 c.Interlude.speak(s,'final');
 check(!s.scan&&s.scannerState==='off','evidence dialogue releases scanner');
 check(s.dialogueLines.length===(hasMessage?4:2),'farewell expansion activates only on actual route');
}
check(read('interval.js').includes('Math.round(x-48),y-155,96,155'),'v53 chapter 7 console alignment retained');
check(read('neo-hud.js').includes('root.dataset.scannerKind'),'scanner type exposed for accessibility');
check(read('style.css').includes('#game.radio-visible #hint'),'interactions remain visible beneath radio');
console.log(`PASS ${passed}/${passed} P45 release integration, 4-beat character gait and emotional continuation checks`);
