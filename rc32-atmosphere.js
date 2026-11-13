(()=>{'use strict';
const game=document.getElementById('game'),world=document.getElementById('world');if(!game||!world)return;
const layer=document.createElement('canvas');layer.id='rc32-atmosphere';layer.setAttribute('aria-hidden','true');game.insertBefore(layer,world.nextSibling);
const ctx=layer.getContext('2d',{alpha:true});if(!ctx)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');let w=0,h=0,frame=0,raf=0,last=0;
const profiles={
'rc29-prologo':{color:[149,168,195],count:15,wind:.08},
'rc29-distrito':{color:[95,217,224],count:32,wind:.25},
'rc29-apartamento':{color:[228,175,128],count:12,wind:.04},
'rc29-enlace':{color:[220,123,187],count:28,wind:.16},
'rc29-terraco':{color:[175,184,248],count:24,wind:.30},
'rc29-zona-cega':{color:[234,111,153],count:22,wind:.18},
'rc29-ghost-track':{color:[194,159,203],count:16,wind:.05},
'rc29-intervalo':{color:[151,196,178],count:17,wind:.07},
'rc29-cafe':{color:[246,188,131],count:10,wind:.03}};
let seed=913;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const motes=Array.from({length:45},()=>({x:rand(),y:rand(),s:.35+rand()*.9,r:.6+rand()*1.6,a:.12+rand()*.20}));
function resize(){const b=world.getBoundingClientRect();const d=Math.min(devicePixelRatio||1,1.25);if(!b.width||!b.height)return;w=b.width;h=b.height;layer.style.left=b.left-game.getBoundingClientRect().left+'px';layer.style.top=b.top-game.getBoundingClientRect().top+'px';layer.style.width=w+'px';layer.style.height=h+'px';const pw=Math.round(w*d),ph=Math.round(h*d);if(layer.width!==pw||layer.height!==ph){layer.width=pw;layer.height=ph;ctx.setTransform(d,0,0,d,0,0);}}
function render(t){if(t-last<(state?.chapter===4?90:48))return;const dt=Math.min((t-last)/1000||.033,.08);last=t;if(!w||frame++%45===0)resize();ctx.clearRect(0,0,w,h);if(reduce.matches||!w||game.classList.contains('overlay-open')||document.hidden||['paused','won','intervalExecution','intervalDeparture','intervalMemorial','interludeTitle'].includes(state.mode)||state.chapter===7&&state.stage==='aftermath'||state.chapter===8&&['grief','homeEnd','end'].includes(state.stage))return;
const k=Object.keys(profiles).find(c=>game.classList.contains(c));if(!k)return;const q=profiles[k];const c=q.color;
for(let i=0;i<q.count;i++){const m=motes[i];m.y-=dt*m.s*.011;m.x+=dt*q.wind*.012;if(m.y<-.02)m.y=1.02;if(m.x>1.02)m.x=-.02;const x=m.x*w,y=m.y*h;ctx.beginPath();ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${m.a})`;ctx.arc(x,y,m.r,0,Math.PI*2);ctx.fill();}
// Subtle physical light spill; each location keeps its own lighting and narrative tone.
const g=ctx.createRadialGradient(w*.84,h*.23,0,w*.84,h*.23,w*.53);g.addColorStop(0,`rgba(${c[0]},${c[1]},${c[2]},.052)`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
}
globalThis.SceneAtmosphere={render};window.addEventListener('resize',resize,{passive:true});
})();