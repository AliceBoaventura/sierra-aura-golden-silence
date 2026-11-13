/* Chapter 3: optical interface, cooperative intrusion and local liberation. */
(function(root){
const platforms=[{x:0,y:800,w:3200,h:200,ground:true},{x:830,y:710,w:180,h:16},{x:1770,y:710,w:185,h:16},{x:2680,y:710,w:185,h:16}];
const nodes=[{x:700,y:800,name:'IDENTIFICAÇÃO'},{x:1630,y:800,name:'RASTREAMENTO'},{x:2520,y:800,name:'COMANDO'}];
function create(){return {chapter:3,stage:'lab',mode:'playing',time:0,x:2000,y:800,vx:0,vy:0,face:1,grounded:true,hp:3,energy:100,alarm:0,inv:0,foot:0,scan:false,scanLock:false,events:[],clues:[],flags:{},nodes:nodes.map(n=>({...n,found:false,progress:0,revealed:false})),drones:[{base:1020,disabled:0,tag:0},{base:1920,disabled:0,tag:0},{base:2780,disabled:0,tag:0}],checkpoint:2000,useWas:true,jumpWas:false,puzzle:null,hacks:0,deaths:0};}
function drones(s){return s.drones.map((d,i)=>({...d,index:i,x:d.base+Math.sin(s.time*.7+i)*100,y:495,range:160}));}
function near(s){if(s.stage==='lab'){return NeoRuntime.closest(s,[{id:'memory',x:1900,name:'ARQUIVO DE KEANE'},{id:'aura',x:2160,name:'CONVERSAR COM AURA'},{id:'bench',x:2390,name:s.flags.upgraded?'OLHO SINCRONIZADO':'BANCADA / OLHO ESQUERDO'},{id:'exit',x:1580,name:'ACESSO AO RELÉ'}],o=>o.id==='memory'||o.id==='exit'?90:100);}
// The extraction hatch must win over patrolling drones once all relays are resolved.
// Previously the last drone intermittently stole E / USAR at x>2990, softlocking progress.
const n=s.nodes.findIndex(n=>!n.found&&Math.abs(s.x-n.x)<100&&Math.abs(s.y-n.y)<80);if(n>=0)return {id:'node',index:n,name:s.nodes[n].name};
if(s.x>2990&&s.nodes.every(n=>n.found))return {id:'exit',name:'EXTRAÇÃO'};
const d=drones(s).filter(d=>d.disabled<=0&&Math.abs(s.x-d.x)<290).sort((a,b)=>Math.abs(s.x-a.x)-Math.abs(s.x-b.x))[0];if(d)return {id:'drone',index:d.index,name:'DRONE'};if(s.x>2990)return {id:'exit',name:'EXTRAÇÃO'};return null;}
function startRelay(s){NeoRuntime.reset(s);s.stage='relay';s.checkpoint=150;s.x=150;s.y=800;s.vx=s.vy=0;s.energy=100;s.alarm=0;s.mode='playing';s.useWas=true;s.inv=3;s.scan=false;s.events.push({type:'radio',speaker:'AURA / ENLACE ÓPTICO',text:'Três relés nos separam da saída. Chegue perto de cada terminal e use INTERAGIR: eu isolo o sinal. O SCAN continua útil contra os drones.'});}
function isolateRelay(s,id){const n=s.nodes[id];if(!n||n.found)return false;n.found=true;n.revealed=true;n.progress=.9;s.checkpoint=n.x+120;s.energy=100;s.hp=Math.min(3,s.hp+1);s.alarm=0;s.inv=4;s.events.push({type:'node',index:id});return true;}
function step(s,i,delta){if(s.mode!=='playing')return;const dt=NeoRuntime.delta(delta);s.time+=dt;s.inv=Math.max(0,s.inv-dt);const move=(i.right?1:0)-(i.left?1:0);s.vx=move*235;if(move)s.face=move;const oldX=s.x;
const cap=s.stage==='lab'?2500:!s.nodes[0].found?1130:!s.nodes[1].found?2120:!s.nodes[2].found?2930:3160;s.x=Math.max(s.stage==='lab'?1490:25,Math.min(cap,s.x+s.vx*dt));NeoRuntime.motion(s,oldX,dt,.045);if(i.jump&&!s.jumpWas&&s.grounded){s.vy=-565;s.grounded=false;}s.jumpWas=!!i.jump;const oldY=s.y;s.vy+=1500*dt;s.y+=s.vy*dt;s.grounded=false;NeoRuntime.land(s,oldX,oldY,s.stage==='lab'?[platforms[0]]:platforms,dt);
NeoRuntime.scan(s,i.scan,dt);
if(s.stage==='relay'){
for(const n of s.nodes){if(!n.revealed&&s.scan&&Math.abs(s.x-n.x)<125&&Math.abs(s.y-n.y)<90){n.progress+=dt;if(n.progress>=.9)n.revealed=true;}}
for(const d of s.drones)d.disabled=Math.max(0,d.disabled-dt);for(const d of drones(s)){const actual=s.drones[d.index];if(!d.disabled&&s.scan&&Math.abs(s.x-d.x)<290)actual.tag=Math.min(1,actual.tag+dt*1.6);else if(!d.disabled&&actual.tag<1)actual.tag=Math.max(0,actual.tag-dt*.25);}
const exposed=drones(s).some(d=>!d.disabled&&Math.abs(s.x-d.x)<d.range&&!platforms.some(p=>!p.ground&&s.y>p.y+55&&s.x>p.x&&s.x<p.x+p.w));s.detected=exposed&&s.inv===0;s.alarm=Math.max(0,Math.min(100,s.alarm+dt*(s.detected?(s.scan?29:21):-32)));
if(s.alarm>=100&&s.inv===0){s.hp--;s.deaths++;s.x=s.checkpoint;s.y=800;s.vy=0;s.alarm=0;s.energy=100;s.inv=4;NeoRuntime.reset(s,'respawn');s.events.push({type:'damage'});if(!s.hp){s.mode='lost';s.events.push({type:'lost'});}return;}
}
if(i.use&&!s.useWas){const o=near(s);if(o){if(s.stage==='lab'){
if(o.id==='memory'&&!s.flags.memory){s.mode='dialogue';s.events.push({type:'memory'});}
if(o.id==='aura'){s.mode='dialogue';s.events.push({type:s.flags.talked?'talkAgain':'talk'});}
if(o.id==='bench'){if(!s.flags.talked)s.events.push({type:'hint',text:'Converse com Aura antes de conectar seu implante.'});else if(!s.flags.memory)s.events.push({type:'hint',text:'Antes de conectar sua lente, examine com Aura o arquivo na bancada à esquerda.'});else if(!s.flags.upgraded){s.flags.upgraded=true;s.events.push({type:'upgraded'});}else s.events.push({type:'hint',text:'Interface pronta. Vá à passagem à esquerda para alcançar o relé.'});}
if(o.id==='exit'){if(s.flags.upgraded)startRelay(s);else s.events.push({type:'hint',text:'Aura precisa adaptar seu olho na bancada antes da incursão.'});}
}else if(o.id==='node'){isolateRelay(s,o.index);}
else if(o.id==='drone'){const d=s.drones[o.index];if(d.tag<1)s.events.push({type:'hint',text:'Mantenha SCAN até identificar o drone; depois aperte USAR.'});else if(s.energy<25)s.events.push({type:'hint',text:'Desligue SCAN para recuperar energia. A inversão exige 25%.'});else{d.disabled=12;d.tag=0;s.energy-=25;s.alarm=0;s.hacks++;s.events.push({type:'override'});}}
else if(o.id==='exit'&&s.nodes.every(n=>n.found)){s.mode='dialogue';s.events.push({type:'ending'});}
}}s.useWas=!!i.use;}
function retry(s){NeoRuntime.retry(s);}
root.Uprising={create,step,near,drones,platforms,isolateRelay,startRelay,retry};
})(typeof window!=='undefined'?window:globalThis);
