/* Deterministic game state and collision logic. Coordinates use the original city scale. */
(function(root){
const platforms=[{x:0,y:800,w:3200,h:200,ground:true},{x:1150,y:715,w:130,h:16},{x:1320,y:630,w:240,h:16},{x:1650,y:715,w:135,h:16},{x:1900,y:710,w:150,h:16},{x:2390,y:710,w:120,h:16},{x:2540,y:625,w:230,h:16}];
function create(){return {mode:'ready',chapter:1,jinxX:150,jinxPulse:0,jinxCooldown:0,time:0,x:240,y:800,vx:0,vy:0,face:1,grounded:true,hp:3,energy:100,alarm:0,inv:0,scan:false,scanLock:false,clues:[{x:680,y:800,found:false,progress:0},{x:1450,y:630,found:false,progress:0},{x:2160,y:800,found:false,progress:0}],relay:false,checkpoint:{x:240,y:800},deaths:0,events:[],jumpWas:false,useWas:false,foot:0};}
function drones(s){return [{x:1060+Math.sin(s.time*.7)*220,y:465,range:135},{x:2080+Math.sin(s.time*.85+1)*220,y:460,range:150},{x:2780+Math.sin(s.time*.6)*120,y:425,range:120}];}
function covered(s,d){return platforms.some(p=>!p.ground&&p.y>s.y-500&&p.y<s.y-55&&p.y>d.y&&s.x>p.x-5&&s.x<p.x+p.w+5);}
function emit(s,type,text){s.events.push({type,text});}
function step(s,input,delta){if(s.mode!=='playing')return;const dt=NeoRuntime.delta(delta);s.time+=dt;s.inv=Math.max(0,s.inv-dt);const move=(input.right?1:0)-(input.left?1:0);s.vx=move*235;if(move)s.face=move;const oldX=s.x;
if(input.jump&&!s.jumpWas&&s.grounded){s.vy=-565;s.grounded=false;emit(s,'jump');}s.jumpWas=!!input.jump;
s.x=Math.max(25,Math.min(3160,s.x+s.vx*dt));NeoRuntime.motion(s,oldX,dt,.045);const oldY=s.y;s.vy+=1500*dt;s.y+=s.vy*dt;s.grounded=false;
NeoRuntime.land(s,oldX,oldY,platforms,dt);
const wasLocked=s.scanLock;NeoRuntime.scan(s,input.scan,dt);if(s.scanLock&&!wasLocked)emit(s,'message','Scanner sem energia. Aguarde a recarga e ative novamente.');
for(const c of s.clues){if(!c.found&&s.scan&&Math.abs(s.x-c.x)<100&&Math.abs(s.y-c.y)<75){c.progress+=dt;if(c.progress>=1.25){c.found=true;s.checkpoint={x:c.x,y:c.y};s.energy=Math.min(100,s.energy+25);emit(s,'clue',s.clues.filter(c=>c.found).length);}}else if(!c.found)c.progress=Math.max(0,c.progress-dt*.3);}
(NeoRuntime.followCompanion||NeoRuntime.follow)(s,'jinx',Math.max(60,s.x-115),dt);s.jinxCooldown=Math.max(0,s.jinxCooldown-dt);s.jinxPulse=Math.max(0,s.jinxPulse-dt);if(s.jinxCooldown===0&&drones(s).some(d=>Math.abs(d.x-s.x)<210)){s.jinxPulse=3.5;s.jinxCooldown=9;emit(s,'message','Jinx: Pulso disparado. Os sensores estão cegos; aproveita!');}const visible=s.jinxPulse===0&&drones(s).some(d=>s.y>d.y&&Math.abs(s.x-d.x)<d.range*(s.scan?1.3:1)&&!covered(s,d));s.detected=visible&&s.inv===0;s.alarm=Math.max(0,Math.min(100,s.alarm+dt*(s.detected?(s.scan?54:39):-27)));
if(s.alarm>=100&&s.inv===0){s.hp--;s.alarm=0;s.inv=3;s.deaths++;s.x=s.checkpoint.x;s.y=s.checkpoint.y;s.vy=0;s.energy=100;NeoRuntime.reset(s,'respawn');emit(s,'damage');if(s.hp<=0){s.mode='lost';emit(s,'lost');}return;}
if(input.use&&!s.useWas){if(Math.abs(s.x-2655)<110&&Math.abs(s.y-625)<80){if(s.clues.every(c=>c.found)){if(!s.relay){s.relay=true;s.checkpoint={x:2780,y:800};emit(s,'relay');}}else emit(s,'message','O relé precisa dos três fragmentos do sinal de Aura.');}else if(Math.abs(s.x-3070)<100){if(s.relay){s.mode='won';emit(s,'won');}else emit(s,'message','Acesso B-3 bloqueado. Ative o relé na passarela.');}else if(Math.abs(s.x-s.jinxX)<150)emit(s,'message','Jinx: Vou cobrir sua retaguarda. Use o scanner perto dos sinais âmbar.');}s.useWas=!!input.use;
}
root.NeoEngine={create,step,drones,platforms};
})(typeof window!=='undefined'?window:globalThis);
