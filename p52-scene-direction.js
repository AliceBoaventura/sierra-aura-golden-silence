/* P52 visual direction pass: authored lighting for gallery, nightclub and getaway.
   Render-only, deterministic, respects reduced motion. No save, physics or hitbox edits. */
(()=>{'use strict';
const reduced=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function glow(c,x,y,r,colour,alpha){
 const g=c.createRadialGradient(x,y,2,x,y,r);g.addColorStop(0,`rgba(${colour},${alpha})`);g.addColorStop(.45,`rgba(${colour},${alpha*.29})`);g.addColorStop(1,`rgba(${colour},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
}
function gallery(c,w,t,scanning){
 c.save();const still=reduced();
 // The visible light sources belong to the wall fixtures and cast onto the actual walkway.
 for(let x=270,i=0;x<w;x+=540,i++){
  const cyan=i%3!==1, rgb=cyan?'81,207,232':'224,113,169';
  const f=still?1:.94+.06*Math.sin(t*1.8+i*3.1);
  c.globalCompositeOperation='screen';
  glow(c,x,425,235,rgb,.20*f);
  const cone=c.createLinearGradient(x,395,x,796);
  cone.addColorStop(0,`rgba(${rgb},${.12*f})`);cone.addColorStop(1,`rgba(${rgb},0)`);
  c.fillStyle=cone;c.beginPath();c.moveTo(x-12,414);c.lineTo(x-146,791);c.lineTo(x+134,791);c.closePath();c.fill();
  c.save();c.translate(x,791);c.scale(1,.15);glow(c,0,0,190,rgb,.21*f);c.restore();
 }
 c.globalCompositeOperation='source-over';
 // Suspended fine dust at three distances, never drawn as a foreground HUD effect.
 for(let i=0;i<70;i++){
  const depth=i%3,seed=i*187.17;
  const x=((seed*11.73+(still?0:t*(depth+1)*2.8))%w+w)%w;
  const y=265+((seed*3.37+(still?0:t*(depth+1)*.7))%495);
  c.fillStyle=depth===0?'#d7e8ef26':depth===1?'#88c3d33a':'#edc1ef3a';
  c.beginPath();c.arc(x,y,depth===0?.65:depth===1?1:1.4,0,Math.PI*2);c.fill();
 }
 if(scanning){
  const line=(t*76)%240;c.fillStyle='#9af5e012';
  for(let y=300+line;y<800;y+=240)c.fillRect(0,y,w,3);
 }
 c.restore();
}
function club(c,stage,w,t,s){
 if(!['club','raid','escape','booth'].includes(stage))return;
 c.save();const still=reduced();const emergency=stage==='raid'||stage==='escape';
 const lamps=emergency?[{x:460,c:'246,66,110'},{x:1250,c:'255,89,112'},{x:2170,c:'240,66,107'},{x:2900,c:'95,205,240'}]:[
  {x:430,c:'105,218,237'},{x:1150,c:'240,76,183'},{x:1870,c:'130,111,240'},{x:2670,c:'243,87,166'}];
 c.globalCompositeOperation='screen';
 lamps.forEach((l,i)=>{
  const wave=still?0:Math.sin(t*(emergency?6.5:1.8)+i*2.5);
  const a=(emergency?.21:.13)*(1+.18*wave);
  const lx=l.x+(emergency?0:wave*20);
  glow(c,lx,330,emergency?360:430,l.c,a);
  const cone=c.createLinearGradient(lx,250,lx,805);
  cone.addColorStop(0,`rgba(${l.c},${a*.55})`);cone.addColorStop(1,`rgba(${l.c},0)`);
  c.fillStyle=cone;c.beginPath();c.moveTo(lx-12,260);c.lineTo(lx-195,800);c.lineTo(lx+165,800);c.closePath();c.fill();
  c.save();c.translate(lx,797);c.scale(1,.16);glow(c,0,0,220,l.c,a*.75);c.restore();
 });
 if(emergency){
  const time=Number.isFinite(s?.pursuit?.time)?s.pursuit.time:0;
  const pulse=still?.07:.05+.045*Math.max(0,Math.sin(t*7));
  c.globalCompositeOperation='source-over';c.fillStyle=`rgba(245,55,88,${pulse})`;c.fillRect(0,260,w,535);
  // A thin tactical warning, attached to the level geometry, not floating in the HUD.
  for(let x=450;x<w;x+=700){c.fillStyle='#ef6588a8';c.fillRect(x,481,44,3);c.fillStyle='#101826bb';c.fillRect(x,484,44,5);}
 }
 c.restore();
}
function screen(s,c,w,h){
 if(!s||!c||!w||!h||s.chapter===-1||s.mode==='paused')return;
 const chase=s.chapter===5&&['raid','escape'].includes(s.stage);
 const intimate=s.chapter===4;
 const depot=s.chapter===7||s.chapter===8&&['depot','depotFinal','end'].includes(s.stage);
 c.save();c.setTransform(1,0,0,1,0,0);
 // Real photographic color treatment: edge falloff and letterbox only in high-stakes scenes.
 const vignette=c.createRadialGradient(w*.52,h*.45,h*.16,w*.52,h*.45,Math.max(w,h)*.77);
 vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,chase?'#08030c8e':intimate?'#070b1a69':'#02071265');
 c.fillStyle=vignette;c.fillRect(0,0,w,h);
 if(chase||depot){
  const bar=Math.max(5,Math.round(h*.018));c.fillStyle='#02050db8';c.fillRect(0,0,w,bar);c.fillRect(0,h-bar,w,bar);
 }
 if(chase&&s.mode==='playing'){
  // Edge alert is readable but never masks the centre or action prompts.
  const a=.14+.10*(reduced()?0:(.5+.5*Math.sin((s.time||0)*7)));
  c.strokeStyle=`rgba(248,75,113,${a})`;c.lineWidth=7;c.strokeRect(3,3,w-6,h-6);
 }
 c.restore();
}
window.P52SceneDirection=Object.freeze({gallery,club,screen});
})();
