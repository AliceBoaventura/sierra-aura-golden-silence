/* P60 visual integration: subtle lighting anchored in game world, not a static overlay. */
(()=>{'use strict';
const defs={sierra:['#d55498','#60bbfa'],jinx:['#3f8fce','#7fe0f5'],aura:['#ef4ebe','#54d9ef'],alexandra:['#dd5ca6','#79c5d9']};
function contact(ctx,x,y,kind='sierra',scale=1){
 const pair=defs[kind]||defs.sierra,r=35*scale;
 ctx.save();const floor=ctx.createRadialGradient(x,y,1,x,y,r*2.6);
 floor.addColorStop(0,'#020711b0');floor.addColorStop(.44,'#0c142055');floor.addColorStop(1,'#02071100');
 ctx.fillStyle=floor;ctx.beginPath();ctx.ellipse(x,y+2,r*2.6,7*scale,0,0,Math.PI*2);ctx.fill();
 // Light is cast on ground, not drawn over clothing or UI.
 const spill=ctx.createRadialGradient(x,y,1,x,y,48*scale);
 const cc=kind==='aura'?'#c83d965c':kind==='jinx'?'#4b8abe54':'#e69e6450';
 spill.addColorStop(0,cc);spill.addColorStop(1,'#10111d00');
 ctx.fillStyle=spill;ctx.fillRect(x-48*scale,y-14*scale,96*scale,20*scale);
 ctx.restore();
}
window.P60Visual=Object.freeze({contact});
})();
