/* Shared transient state; chapter data and narrative remain owned by their engines. */
(function(root){
function reset(s,reason='reset'){
 s.scan=false;s.scanWas=false;s.scanLock=false;s.scannerState='off';s.echoState='off';
 for(const k of ['vx','dash','glitch','fragment','traceProgress'])if(k in s)s[k]=0;
 s.focusId=null;s.detected=false;s.crouch=false;s.jumpWas=false;s.dashWas=false;s.useWas=true;
 for(const who of ['jinx','aura','alex']){s[who+'Vx']=0;s[who+'Moving']=false;}
 if(reason==='respawn'){delete s.talkX;
  s.vy=0;s.grounded=true;s.face=1;s.alarm=0;s.energy=100;
  for(const k of ['dashCooldown','cooldown','blackout','jinxPulse','jinxCooldown','interact','stall'])if(k in s)s[k]=0;
  if('jinxX' in s)s.jinxX=Math.max(40,s.x-115);
  if(s.drones)for(const d of s.drones){d.disabled=0;d.tag=0;}
  if(s.nodes)for(const n of s.nodes)if(!n.found){n.progress=0;n.revealed=false;}
  if(s.clues)for(const c of s.clues)if(!c.found)c.progress=0;
  s.puzzle=null;s.events.length=0;
 }
}
// P46: one explicit scanner contract shared by keyboard, touch, HUD and engines.
// The ECHO reconstruction is not a battery scanner; Alexandra has no emitter.
const scannerBalance=Object.freeze({drain:12,charge:16,minimum:12});
function scannerProfile(s){
 if(!s||s.chapter===-1||s.chapter===4||s.chapter===8&&s.stage!=='depot')return 'unavailable';
 if(s.chapter===7&&s.avatar==='alex')return 'interface';
 if(s.chapter===6)return 'echo';
 return 'battery';
}
function scannerCanStart(s){
 const profile=scannerProfile(s);
 return !!s&&s.mode==='playing'&&profile!=='unavailable'&&
  (profile!=='battery'||(!s.scanLock&&(Number.isFinite(s.energy)?s.energy:100)>=scannerBalance.minimum));
}
function scan(s,held,dt,drain=scannerBalance.drain,charge=scannerBalance.charge){
 // Backwards-compatible helper for chapter-less tooling. Actual chapters
 // always use the P46 profile and the 12% activation threshold.
 if(!Number.isInteger(s.chapter)){
  if(s.mode!=='playing'){s.scan=false;s.scannerState='off';return;}
  if(!held)s.scanLock=false;
  s.scan=!!held&&s.energy>0&&!s.scanLock;
  s.energy=Math.max(0,Math.min(100,s.energy+dt*(s.scan?-drain:charge)));
  if(s.energy===0){s.scan=false;s.scanLock=true;}
  s.scannerState=s.scan?'active':s.scanLock?'depleted':'off';return;
 }
 const profile=scannerProfile(s);
 if(s.mode!=='playing'||profile==='unavailable'||profile==='interface'){
  s.scan=false;s.scanLock=false;s.scannerState=profile==='interface'?'interface':'unavailable';return;
 }
 if(profile==='echo'){
  s.scan=!!held;s.scanLock=false;s.scannerState=s.scan?'active':'off';return;
 }
 // Battery behavior is identical for every Sierra chapter. Releasing a
 // depleted scanner re-arms it only after the 12% minimum is recovered.
 if(!held)s.scanLock=false;
 const available=Number.isFinite(s.energy)?s.energy:100;
 s.scan=!!held&&!s.scanLock&&available>=scannerBalance.minimum;
 s.energy=Math.max(0,Math.min(100,available+dt*(s.scan?-drain:charge)));
 if(s.energy<scannerBalance.minimum){s.scan=false;if(held)s.scanLock=true;}
 s.scannerState=s.scan?'active':s.scanLock||s.energy<scannerBalance.minimum?'depleted':'off';
}
function delta(value){return Number.isFinite(value)?Math.max(0,Math.min(value,.035)):0;}
// From site GPT v53: preserve game time when rendering drops frames.
// Never run a physics step larger than 1/60 s; cap catch-up at 200 ms.
function frameSteps(elapsed){
 const span=Number.isFinite(elapsed)?Math.max(0,Math.min(elapsed,.2)):0;
 if(!span)return [];
 const count=Math.max(1,Math.ceil(span/(1/60)-1e-9));
 return Array(count).fill(span/count);
}
// Collision audit: swept footpoint prevents a character from landing through a
// ledge when the horizontal step crosses its edge. Ground is always last resort.
function land(s,oldX,oldY,platforms,dt,groundY=800){
 if(!Number.isFinite(s.x)||!Number.isFinite(s.y)||!Number.isFinite(s.vy)){
  s.x=Number.isFinite(oldX)?oldX:50;s.y=groundY;s.vy=0;s.grounded=true;return 'invalid-state';
 }
 // Test horizontal overlap at the instant the feet cross a platform top,
 // not at the end of the frame. This avoids phantom landings when dashing.
 let landing=null;
 if(s.vy>=0&&s.y>=oldY){
  for(const p of platforms||[]){
   if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||!Number.isFinite(p.w)||p.w<=0)continue;
   if(oldY>p.y+0.5||s.y<p.y)continue;
   const fraction=s.y===oldY?1:Math.max(0,Math.min(1,(p.y-oldY)/(s.y-oldY)));
   const crossingX=oldX+(s.x-oldX)*fraction;
   if(crossingX+12<=p.x||crossingX-12>=p.x+p.w)continue;
   if(!landing||p.y<landing.y)landing=p;
  }
 }
 if(landing){s.y=landing.y;s.vy=0;s.grounded=true;return landing.ground?'ground':'platform';}
 if(s.y>=groundY){s.y=groundY;s.vy=0;s.grounded=true;return 'ground';}
 s.grounded=false;return 'air';
}
// Stable, physically reachable selection for adjacent overlapping hotspots.
function closest(s,items,radius=100,groundOnly=true){
 if(!Number.isFinite(s?.x)||!Number.isFinite(s?.y))return null;
 if(groundOnly&&Math.abs(s.y-800)>75)return null;
 root.HotspotsV108?.record(s,items,radius);return focus(s,items,o=>typeof radius==='function'?radius(o):radius);
}
// A guarded step for flat-ground levels that previously trusted arbitrary
// starting coordinates after UI transitions. Valid jumps and dashes are untouched.
function flatGround(s,oldX,dt,groundY=800){
 if(!Number.isFinite(s.x))s.x=Number.isFinite(oldX)?oldX:60;
 if(!Number.isFinite(s.y)||!Number.isFinite(s.vy)){
  s.y=groundY;s.vy=0;s.grounded=true;
  if(Number.isFinite(oldX))s.x=oldX;
  return 'invalid-state';
 }
 if(s.y>=groundY){s.y=groundY;s.vy=0;s.grounded=true;return 'ground';}
 s.grounded=false;return 'air';
}

// Animate resolved displacement, not attempted movement into a closed door.
// A dash keeps its original speed without running the pose cycle at 23 Hz.
function motion(s,oldX,dt,rate=.04){
 const travel=s.x-oldX;s.vx=dt>0?travel/dt:0;
 if(s.grounded!==false)s.foot+=Math.min(Math.abs(travel)*rate,8*dt);
}
function placeCompanion(s,who,x,face=1){
 s[who+'X']=x;s[who+'Vx']=0;s[who+'Moving']=false;s[who+'Face']=face;s[who+'Foot']=0;
}
// Bounded catch-up, with a dead zone at rest. Each companion owns its gait
// and facing; Sierra stopping or reversing does not flip their sprite.
function follow(s,who,target,dt,maxSpeed=250){
 const key=who+'X',gap=target-s[key];
 const travel=Math.abs(gap)<.25?0:Math.sign(gap)*Math.min(Math.abs(gap)*(1-Math.exp(-3*dt)),maxSpeed*dt);
 s[key]+=travel;s[who+'Vx']=dt>0?travel/dt:0;s[who+'Moving']=Math.abs(travel)>.001;
 if(s[who+'Moving']){s[who+'Face']=Math.sign(travel);s[who+'Foot']=(s[who+'Foot']||0)+Math.min(Math.abs(travel)*.018,4*dt);}
}
// Free-roaming companions should not trail hundreds of pixels behind Sierra
// when she walks continuously. Keep choreography-specific follow() untouched.
function followCompanion(s,who,target,dt,maxSpeed=310){
 const key=who+'X';
 if(!Number.isFinite(target)||!Number.isFinite(dt)||dt<=0)return;
 if(!Number.isFinite(s[key])){placeCompanion(s,who,target);return;}
 const gap=target-s[key];
 const travel=Math.abs(gap)<=3?0:Math.sign(gap)*Math.min(Math.max(0,Math.abs(gap)-2)*(1-Math.exp(-7*dt)),maxSpeed*dt);
 s[key]+=travel;s[who+'Vx']=travel/dt;s[who+'Moving']=Math.abs(travel)>.001;
 if(s[who+'Moving']){s[who+'Face']=Math.sign(travel);s[who+'Foot']=(s[who+'Foot']||0)+Math.min(Math.abs(travel)*.018,4*dt);}
}
// Stable focus: two overlapping use radii cannot make the prompt oscillate.
function focus(s,items,radius){
 const distance=o=>Math.abs(s.x-o.x),eligible=items.filter(o=>Number.isFinite(o.x)&&Number.isFinite(radius(o))&&radius(o)>0&&distance(o)<=radius(o));
 eligible.sort((a,b)=>distance(a)-distance(b));
 let best=eligible[0]||null;const previous=eligible.find(o=>o.id===s.focusId);
 if(previous&&best&&distance(previous)<=distance(best)+20)best=previous;
 s.focusId=best?.id||null;return best;
}
// Existing checkpoints retain committed discoveries. Build the complete retry state
// before publishing any of it; transient puzzles/progress never become objectives.
function retry(s){
 const copy=v=>JSON.parse(JSON.stringify(v));
 const next={hp:3,energy:100,x:s.checkpoint,y:800,vy:0,alarm:0,inv:5,mode:'playing'};
 for(const k of ['flags','seen','npcMood','quests'])if(s[k])next[k]=copy(s[k]);
 if(s.nodes)next.nodes=s.nodes.map(n=>({...n,progress:n.found?n.progress:0,revealed:!!n.found}));
 if(s.progress)next.progress={};
 Object.assign(s,next);reset(s,'respawn');
 s.checkpointSnapshot={chapter:s.chapter,stage:s.stage,x:s.checkpoint,hp:3,energy:100,flags:copy(s.flags||{}),seen:copy(s.seen||{}),nodes:s.nodes?.map(n=>({found:n.found}))};
}
root.NeoRuntime={reset,scan,scannerProfile,scannerCanStart,scannerBalance,delta,frameSteps,retry,motion,placeCompanion,follow,followCompanion,focus,closest,land,flatGround};
})(typeof window!=='undefined'?window:globalThis);
