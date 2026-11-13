(function(root){
const width={club:3400,booth:2200,escape:2900,raid:3400,drive:2900};
const objects={club:[{id:'gate',x:620,name:'TRAVA DA ENTRADA'},{id:'bar',x:1230,name:'BALCÃO'},{id:'poster',x:1740,name:'CARTAZ REMENDADO'},{id:'alex',x:2520,name:'DJ'},{id:'booth',x:3220,name:'CABINE RESERVADA'}],booth:[{id:'record',x:410,name:'FITA DE SEIS MINUTOS'},{id:'photo',x:810,name:'FOTO VIRADA'},{id:'wave',x:1230,name:'MESA DE SINAIS'},{id:'alexPersonal',x:1480,name:'ALEXANDRA'},{id:'module',x:1730,name:'MÓDULO FÍSICO'},{id:'exit',x:2070,name:'SAÍDA DE SERVIÇO'}],escape:[{id:'latch',x:1370,name:'LEITOR DE SERVIÇO'},{id:'exit',x:2630,name:'CADILLAC 80'}],raid:[{id:'exit',x:3160,name:'SAÍDA DOS FUNDOS'}],drive:[]};
// P48: active, finite guard pursuit. Shots exist in world space; the actors
// remain upright at the common 800px ground line in every club scene.
function newPursuit(stage){
 const positions=stage==='raid'?[2220,3010]:[320];
 return {stage,guards:positions.map((x,n)=>({x,cd:.45+n*.23,flash:0,shots:0})),shots:[],shield:4,inv:1.1,flash:0,blocked:0,hits:0,retries:0,noise:0,time:0};
}
function pursuitStep(s,dt){
 if(s.stage!=='raid'&&s.stage!=='escape')return;
 const c=s.pursuit||(s.pursuit=newPursuit(s.stage));
 if(c.stage!==s.stage){s.pursuit=newPursuit(s.stage);return;}
 c.inv=Math.max(0,c.inv-dt);c.flash=Math.max(0,c.flash-dt);
 c.shield=Math.min(4,c.shield+dt*.31);
 c.noise=Math.max(0,c.noise-dt);c.time+=dt;
 const advance=s.stage==='escape'&&!s.flags.latch;
 // The shutter is a stand-and-scan beat; Jinx deliberately holds the line.
 const brace=advance&&Math.abs(s.x-1370)<185;
 if(brace&&Math.abs(s.jinxX-s.x)>165)NeoRuntime.follow(s,'jinx',Math.max(65,s.x-86),dt,330);
 // P57: one canonical protection rule, no duplicate escort blocks.
 // Jinx keeps pace during the approach; the escort is finite and shield-based.
 // A retry renews the approach window, but never solves the scanner or latch.
 if(advance&&c.coverSeconds===undefined)c.coverSeconds=8;
 if(advance&&s.x<1510&&Math.abs(s.jinxX-s.x)>135)
   NeoRuntime.follow(s,'jinx',Math.max(65,s.x-88),dt,440);
 const jinxNearby=Math.abs(s.jinxX-s.x)<240;
 const escort=advance&&s.x<1510&&c.coverSeconds>0&&jinxNearby&&c.shield>=.65;
 if(escort){c.inv=Math.max(c.inv,dt+.06);c.coverSeconds=Math.max(0,c.coverSeconds-dt);c.shield=Math.max(.65,c.shield-dt*.12);}
 // The scanner still needs 0.80s at the latch; Jinx must be near with shield.
 const latchCover=brace&&s.scan&&jinxNearby&&c.shield>=.65;
 if(latchCover){c.inv=Math.max(c.inv,dt+.08);c.shield=Math.max(.65,c.shield-dt*.32);}
 for(const g of c.guards){
   g.flash=Math.max(0,g.flash-dt);g.cd-=dt;
   const range=Math.abs(g.x-s.x);
   if(range>790||g.cd>0)continue;
   // The back line fires more often, the far line telegraphs before shooting.
   g.cd=1.65+((g.shots+c.guards.indexOf(g))%3)*.26+(s.stage==='raid'?.18:0);
   g.flash=.15;g.shots++;
   const heading=g.x<s.x?1:-1;
   c.shots.push({x:g.x+heading*35,y:685+(g.shots%3-1)*16,vx:heading*(445+(g.shots%3)*38),age:0});
   if(c.shots.length>7)c.shots.shift();
   if(c.noise===0){emit(s,'pursuitShot');c.noise=.6;}
 }
 for(let n=c.shots.length-1;n>=0;n--){
   const b=c.shots[n],previous=b.x;
   b.x+=b.vx*dt;b.age+=dt;
   if(b.age>2.6||b.x<0||b.x>width[s.stage]){c.shots.splice(n,1);continue;}
   // A crossing projectile hits Jinx's reinforced arm/plate before Sierra.
   const crossed=(x)=>Math.min(previous,b.x)-20<=x&&x<=Math.max(previous,b.x)+20;
   const protecting=(Math.abs(s.jinxX-s.x)<220||brace)&&c.shield>=.65;
   const between=b.vx>0?s.jinxX<=s.x+20:s.jinxX>=s.x-20;
   if(protecting&&between&&crossed(s.jinxX)&&Math.abs((s.y-112)-b.y)<70){
     c.shield=Math.max(0,c.shield-.65);c.blocked++;c.flash=.18;
     c.shots.splice(n,1);emit(s,'pursuitBlock');continue;
   }
   if(crossed(s.x)&&Math.abs((s.y-(s.crouch?47:110))-b.y)<49){
     c.shots.splice(n,1);
     if(c.inv>0||s.dash>0)continue;
     s.hp=Math.max(0,s.hp-1);c.inv=1.35;c.flash=.36;c.hits++;
     emit(s,'pursuitHit');
     if(s.hp===0){
       c.retries++;s.hp=3;c.shield=4;c.shots.length=0;c.inv=2.5;if(s.stage==='escape'&&!s.flags.latch)c.coverSeconds=8;
       s.x=s.stage==='raid'?2420:s.flags.latch?1610:200;
       s.y=800;s.vy=0;s.grounded=true;s.vx=0;
       NeoRuntime.placeCompanion(s,'jinx',s.x-90);
       emit(s,'pursuitRetry');break;
     }
   }
 }
}
function create(previous='study'){return {chapter:5,mode:'playing',stage:'club',time:0,x:185,y:800,vx:0,vy:0,grounded:true,face:1,foot:0,hp:3,energy:100,alarm:0,clues:[],flags:{},seen:{},progress:{},events:[],useWas:true,jumpWas:false,dashWas:false,dash:0,cooldown:0,scan:false,scanLock:false,glitch:0,hold:0,jinxX:70,previous,tone:{trust:0,jealous:0,curious:0},answers:[],dialogue:null,dialogueStep:0,response:null,puzzle:{phase:0,filter:0,targetPhase:1+Math.floor(Math.random()*3),targetFilter:1+Math.floor(Math.random()*3)},beatClock:0,driveTime:0,alexX:1450,pursuit:null};}
function emit(s,type,extra={}){s.events.push({type,...extra});}function once(s,key,fn){if(!s.seen[key]){s.seen[key]=true;fn();}}
function near(s){
 if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||Math.abs(s.y-800)>=75)return null;
 const items=objects[s.stage].map(o=>o.id==='alexPersonal'?{...o,x:s.alexX}:o);
 if(s.stage==='club')items.push(...ClubCrowd.visitors);
 return NeoRuntime.focus(s,items,o=>o.id==='alexPersonal'?180:o.id.startsWith('guest')?110:95);
}
function settleDialogue(s,dt){
 if(s.stage==='escape'&&s.dialogue==='parting')NeoRuntime.follow(s,'jinx',1370,dt,150);
 if(s.stage==='booth'&&Number.isFinite(s.alexTalkTarget)){const gap=115;NeoRuntime.follow(s,'alex',s.x+s.alexTalkSide*gap,dt,105);}
 if(!Number.isFinite(s.talkX))return;
 const old=s.x,gap=s.talkX-s.x;s.x+=Math.sign(gap)*Math.min(Math.abs(gap),100*dt);
 NeoRuntime.motion(s,old,dt,.04);
}
function speak(s,id){delete s.talkX;delete s.alexTalkTarget;if(s.stage==='booth'&&['personal','closeness'].includes(id)){s.alexTalkSide=s.alexX<=s.x?-1:1;s.alexTalkTarget=s.x+s.alexTalkSide*115;}const n=ClubCrowd.visitors.find(n=>n.id===id);if(n){s.talkX=Math.max(35,Math.min(width[s.stage]-45,n.x+(s.x<=n.x?-110:110)));s.face=s.x<=n.x?1:-1;}s.vx=0;s.mode='clubDialogue';s.dialogue=id;s.dialogueStep=0;s.response=null;s.scan=false;s.scannerState='off';s.echoState='off';emit(s,'dialogue');}
function change(s,stage){NeoRuntime.reset(s);s.hold=0;s.cooldown=0;s.stage=stage;s.x=150;NeoRuntime.placeCompanion(s,'jinx',75);s.y=800;s.vy=0;s.scan=false;s.energy=100;s.useWas=true;s.pursuit=['raid','escape'].includes(stage)?newPursuit(stage):null;if(stage==='raid'){s.hp=Math.max(2,s.hp);if(s.flags.guardEarly)s.pursuit.guards.forEach(g=>{g.cd=Math.max(.15,g.cd-.24);});}emit(s,'transition');}
function quality(s){return Math.max(0,100-Math.abs(s.puzzle.phase-(s.puzzle.targetPhase??2))*22-Math.abs(s.puzzle.filter-(s.puzzle.targetFilter??3))*18);}
function solve(s){if(s.mode!=='clubPuzzle'||s.flags.correlated||quality(s)!==100)return false;s.flags.correlated=true;s.mode='playing';emit(s,'solved');return true;}
function step(s,i,delta){const dt=NeoRuntime.delta(delta);if(s.mode==='paused'||s.mode==='won'||s.mode==='journal')return;s.time+=dt;if(s.mode==='clubDialogue'){settleDialogue(s,dt);return;}if(s.mode!=='playing')return;if(s.stage==='drive'){s.driveTime+=dt;if(s.driveTime>=3&&!s.flags.cadillacPulsePresented){s.flags.cadillacPulsePresented=true;speak(s,'cadillacPulse');return;}if(s.driveTime>=8&&!s.flags.departed){s.flags.departed=true;speak(s,'return');}return;}for(const k of ['dash','cooldown','glitch'])s[k]=Math.max(0,s[k]-dt);const dir=(i.right?1:0)-(i.left?1:0);if(dir)s.face=dir;if(i.dash&&!s.dashWas&&s.cooldown===0){s.dash=.18;s.cooldown=1.2;}s.dashWas=!!i.dash;s.crouch=!!i.crouch&&s.grounded;s.vx=s.dash?s.face*520:dir*(s.crouch?115:215);const oldX=s.x;s.x=Math.max(35,Math.min(width[s.stage]-45,s.x+s.vx*dt));
if(s.stage==='club'&&!s.flags.gate)s.x=Math.min(s.x,760);if(s.stage==='escape'&&!s.flags.latch)s.x=Math.min(s.x,1510);
NeoRuntime.motion(s,oldX,dt);
if(i.jump&&!s.jumpWas&&s.grounded&&!s.crouch){s.vy=-520;s.grounded=false;}s.jumpWas=!!i.jump;s.vy+=1500*dt;s.y+=s.vy*dt;NeoRuntime.flatGround(s,oldX,dt);
NeoRuntime.scan(s,i.scan,dt);
const o=near(s);if(s.scan){if(s.stage==='club'&&s.x>850)once(s,'saturation',()=>{s.glitch=.6;emit(s,'radio',{who:'LENTE / LEITURA INCONCLUSIVA',line:'NETWORK SATURATION · 47 IDENTITIES · 0 VERIFIED'});});if(o?.id==='alex')once(s,'unregistered',()=>emit(s,'radio',{who:'LENTE',line:'SUBJECT NOT REGISTERED'}));if(o&&['gate','latch'].includes(o.id)){
// P44.3: scanner exposure measures real elapsed frame time. Movement/physics
// continue to use the bounded dt; otherwise a slow phone registers only 35ms
// of exposure for every 70–120ms spent holding SCAN near the lock.
// Cap an individual exposure to avoid completing a puzzle after a suspended tab.
const exposure=Number.isFinite(delta)?Math.max(0,Math.min(delta,.20)):dt;
s.progress[o.id]=(s.progress[o.id]||0)+exposure;
if(s.progress[o.id]>=.80&&!s.flags[o.id+'Read']){s.flags[o.id+'Read']=true;emit(s,'radio',{who:'SIERRA',line:o.id==='gate'?'A trava está soldada. Jinx, a peça sob a dobradiça.':'O trinco de cima recebe toda a carga. Consegue segurar?'});}}}
if(s.hold>0){s.hold=Math.max(0,s.hold-dt);if(s.hold===0){s.flags.gate=true;emit(s,'radio',{who:'JINX',line:'Sua vez. Vai antes que eu comece a cobrar por porta.'});}}
if(s.stage==='club'){(NeoRuntime.followCompanion||NeoRuntime.follow)(s,'jinx',Math.max(70,s.x-145),dt);if(s.x>2070)once(s,'oldfriends',()=>emit(s,'radio',{who:'JINX',line:'Ela está na mesa. Não aponta a lente para as pessoas aqui.'}));}
if(s.stage==='raid')NeoRuntime.follow(s,'jinx',Math.min(3280,s.x+145),dt,290);
if(s.stage==='escape'){if(s.x>650)once(s,'shield',()=>{s.glitch=.35;s.flags.shield=true;emit(s,'protection');});const target=Math.max(65,s.x-(s.flags.latch?100:90));NeoRuntime.follow(s,'jinx',target,dt,295);if(s.x>1900)once(s,'car',()=>emit(s,'radio',{who:'JINX',line:'O Cadillac está adiante. Não solta o módulo.'}));}
pursuitStep(s,dt);
if(i.use&&!s.useWas&&o){if(o.id==='gate'){if(s.flags.gate)emit(s,'radio',{who:'JINX',line:'A porta está aberta. O segredo é não pedir licença à dobradiça.'});else if(s.flags.gateRead){if(!s.hold){s.hold=1.8;emit(s,'radio',{who:'JINX',line:'Afasta a mão. Essa parte é comigo.'});}}else emit(s,'radio',{who:'SIERRA',line:'SCAN na trava. Preciso encontrar onde a solda cede.'});}
if(o.id.startsWith('guest'))speak(s,o.id);if(o.id==='bar')speak(s,'bar');if(o.id==='poster')speak(s,'poster');if(o.id==='alex')speak(s,s.flags.met?'again':'meet');
if(o.id==='booth'){if(s.flags.met){change(s,'booth');speak(s,'six');}else emit(s,'radio',{who:'SEGURANÇA',line:'A cabine é dela. Fale com a DJ primeiro.'});}
if(o.id==='alexPersonal')speak(s,'personal');if(o.id==='record'){s.flags.record=true;speak(s,'record');}if(o.id==='photo')speak(s,'parents');if(o.id==='wave'){if(!s.flags.record)emit(s,'radio',{who:'ALEXANDRA',line:'Primeiro, a fita à esquerda. É a única cópia que nunca entrou na rede.'});else if(!s.flags.correlated){s.mode='clubPuzzle';s.scan=false;emit(s,'puzzle');}else speak(s,'result');}
if(o.id==='module'){if(s.flags.correlated){s.flags.module=true;speak(s,'module');}else emit(s,'radio',{who:'ALEXANDRA',line:'Sem reconstruir o sinal, isso é só metal. A mesa está à esquerda.'});}
if(o.id==='exit'&&s.stage==='booth'){if(s.flags.module){speak(s,'closeness');}else emit(s,'radio',{who:'SIERRA',line:'Ainda preciso do módulo. Ele está ao lado da mesa.'});}
else if(o.id==='exit'&&s.stage==='raid'){change(s,'escape');s.jinxX=65;emit(s,'radio',{who:'ALEXANDRA / RÁDIO',line:'Passagem de serviço aberta. O carro está no fim da rampa.'});}else if(o.id==='exit'&&s.stage==='escape'){if(Math.abs(s.jinxX-s.x)>175){emit(s,'radio',{who:'SIERRA / RÁDIO',line:'Jinx ainda está vindo. Não vou sair sem ele.'});}else {if(s.pursuit){s.pursuit.shots.length=0;s.pursuit.guards.length=0;}speak(s,'boarding');}}
if(o.id==='latch'){if(s.flags.latchRead){s.flags.latch=true;emit(s,'radio',{who:'JINX',line:'Soltou. Passa, Si. Eu vou atrás.'});}else emit(s,'radio',{who:'JINX',line:'Marca o retorno com a lente. Eu cubro a porta.'});}}
s.useWas=!!i.use;
}
root.Club={create,step,near,objects,width,speak,change,quality,solve,newPursuit,pursuitStep};
})(typeof window!=='undefined'?window:globalThis);
