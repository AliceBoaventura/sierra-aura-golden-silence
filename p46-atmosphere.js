/* P46 cinematic atmosphere: screen-space weather, depth and lens character.
   No collision, state, save, camera or hitbox changes. Reduced motion respected. */
(()=>{'use strict';
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function render(s,ctx,W,H){
 if(!s||!ctx||!W||!H||s.chapter===-1||s.mode==='paused'||s.mode==='won')return;
 if(s.chapter===4||s.chapter===8&&['depot','end','depotTitle','depotDrive','depotApproach'].includes(s.stage)&&s.mode==='interludeCinematic')return;
 const t=Number.isFinite(s.time)?s.time:0;
 const outside=s.chapter===1&&['district','approach'].includes(s.stage)||s.chapter===5&&['club','raid','escape'].includes(s.stage)||s.chapter===8&&['walk','returnWalk','doorstep'].includes(s.stage);
 const tense=s.chapter===5||s.chapter===6||s.chapter===7;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);
 // Depth from existing artwork, without obscuring actors or navigation cues.
 const glow=ctx.createRadialGradient(W*.74,H*.27,H*.05,W*.58,H*.48,Math.max(W,H)*.78);
 glow.addColorStop(0,tense?'#a448ad0b':'#54b7d20d');glow.addColorStop(.58,'#00000000');glow.addColorStop(1,'#01040e55');
 ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 const shadow=ctx.createLinearGradient(0,H*.56,0,H);
 shadow.addColorStop(0,'#050b1400');shadow.addColorStop(1,'#03071245');ctx.fillStyle=shadow;ctx.fillRect(0,H*.56,W,H*.44);
 if(outside){
  const rate=reduce()?0:t;
  for(let i=0;i<46;i++){
   const seed=i*97.13;
   const x=((seed*13.7+(rate*(i%3===0?82:155)))%(W+90))-45;
   const y=((seed*7.3+rate*(i%4===0?245:350))%(H+120))-60;
   ctx.strokeStyle=i%5===0?'#b7c9f322':'#88b8d71c';ctx.lineWidth=i%4===0?1.2:.7;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+14+(i%5)*4);ctx.stroke();
  }
 }
 // A tiny electrical bloom breathes with scene tension, not with player input.
 if(tense&&!reduce()){
  const alpha=.013+.009*(.5+.5*Math.sin(t*1.8));
  ctx.fillStyle=`rgba(149,82,190,${alpha})`;ctx.fillRect(0,0,W,H);
 }
 ctx.restore();
}
window.P46Atmosphere={render};
})();
