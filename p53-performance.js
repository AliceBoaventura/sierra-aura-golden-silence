/* P53 · keyframed original performance. Transform only; no hitbox, save or collision edits. */
(()=>{'use strict';
const reduced=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const tracks={
 sierra:{idle:[0,.6,0,-.4,0],scan:[0,-1.2,-2,-1.2,0],threat:[0,1.4,2.4,1.4,0]},
 aura:{idle:[0,-.5,-.9,-.5,0],scan:[0,.4,1,.4,0],threat:[0,-.6,-1.5,-.6,0]},
 jinx:{idle:[0,.4,.8,.4,0],scan:[0,-.7,-1.3,-.7,0],threat:[0,-1.4,-2.7,-1.4,0]},
 alexandra:{idle:[0,-.35,-.6,-.35,0],scan:[0,-.4,-.8,-.4,0],threat:[0,1.1,1.8,1.1,0]}
};
function sample(points,phase){const u=((phase%1)+1)%1*(points.length-1),i=Math.min(points.length-2,Math.floor(u));const v=u-i,sm=v*v*(3-2*v);return points[i]*(1-sm)+points[i+1]*sm;}
function apply(c,name,s,walking,airborne,ghost){
 if(!c||!s||walking||airborne||ghost||reduced()||s.mode!=='playing')return;
 const track=tracks[name];if(!track)return;
 const tension=s.alarm>35||s.detected||s.chapter===5&&['raid','escape'].includes(s.stage);
 const mode=tension?'threat':s.scan&&name==='sierra'?'scan':'idle';
 const speed=mode==='idle'?.18:.34,phase=(s.time||0)*speed+({sierra:0,aura:.2,jinx:.4,alexandra:.6}[name]||0);
 const tilt=sample(track[mode],phase)*Math.PI/180;
 // Grounded ankle axis: actor's foot stays at the exact world coordinate.
 c.transform(1,0,Math.tan(tilt),1,0,0);
 // Authored counter-motion of the chest; only subtle whole-body translation.
 c.translate(Math.sin(phase*Math.PI*2)*.45,0);
}
window.P53Performance=Object.freeze({apply,sample,tracks});
})();
