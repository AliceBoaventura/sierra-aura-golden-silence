/* Grounded environment finishing pass. Pure render, no flags, no game-state
   mutations, no new collision surfaces. Details match the physical floor and
   existing platform definitions so depth and reachable locations agree. */
const SceneryFinish=(()=>{
 function floor(w,y=800,type='industrial',t=0){
  ctx.save();
  // Shared atmospheric palette across legacy sets: kept deliberately subtle.
  // The effect is anchored to world-space geometry, not to the camera or HUD.
  const domestic=type==='domestic';
  const ambient=ctx.createLinearGradient(0,y-420,0,y+8);
  ambient.addColorStop(0,domestic?'#bd845006':'#5e9ab209');
  ambient.addColorStop(.72,domestic?'#bb987006':'#58abc109');
  ambient.addColorStop(1,'#07101824');
  ctx.fillStyle=ambient;ctx.fillRect(0,y-420,w,428);
  ctx.restore();
  ctx.save();
  const warm=type==='domestic';
  const shade=ctx.createLinearGradient(0,y-110,0,y+20);
  shade.addColorStop(0,'#05070d00');shade.addColorStop(.94,warm?'#20161d4d':'#09131b66');shade.addColorStop(1,'#070b0e88');
  ctx.fillStyle=shade;ctx.fillRect(0,y-110,w,130);
  // V10 visual audit: all current backgrounds already paint pavement, seams
  // and reflections. A second full-width strip/rivet pattern looked pasted on,
  // and falsely implied a second floor. Keep only the atmospheric shading.
  // Collision still uses the original world y=800; this is render-only.
  ctx.restore();
 }
 function contact(x,y,rx=29){
  ctx.save();ctx.fillStyle='#04080c80';ctx.beginPath();ctx.ellipse(x,y+2,rx,5,0,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 function service(w,stage,time){
  ctx.save();
  // Lighting depth changes by room function, without covering readable art.
  const light=ctx.createLinearGradient(0,180,0,800);
  light.addColorStop(0,stage==='facility'?'#91bfd009':'#c68a770a');
  light.addColorStop(.55,'#00000000');light.addColorStop(1,'#060d1650');
  ctx.fillStyle=light;ctx.fillRect(0,120,w,690);
  // Existing illustrated architecture is the only source of columns, doors
  // and ribs. This finishing pass adds light, never synthetic structures.
  ctx.restore();equipmentReflections(stage,time,w);floor(w,800,'industrial',time);
 }
 // Equipment reflection pass: small, world-anchored physical light, not
 // new objects. It leaves the painted consoles, hitboxes and clues untouched.
 function equipmentReflections(stage,t,w){
  const placements=stage==='apartment'?[[2130,535,125,'#ecb47f'],[2325,555,90,'#73c8d5']]
   :stage==='booth'?[[1240,520,100,'#77e0e3'],[1725,565,86,'#f4aa82']]
   :stage==='facility'?[[w*.78,545,130,'#b0eeed'],[w*.88,535,86,'#70cbd6']]
   :[];
  if(!placements.length)return;
  const quiet=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const [x,y,r,colour] of placements){
   const shimmer=quiet?1:.95+.05*Math.sin(t*1.24+x*.03);
   const halo=ctx.createRadialGradient(x,y,0,x,y,r*1.55);
   halo.addColorStop(0,colour+'2c');halo.addColorStop(.36,colour+'12');halo.addColorStop(1,colour+'00');
   ctx.fillStyle=halo;ctx.fillRect(x-r*1.55,y-r*1.55,r*3.1,r*3.1);
   ctx.save();ctx.translate(x,793);ctx.scale(1,.11);
   const floorGlow=ctx.createRadialGradient(0,0,0,0,0,r*1.15);
   floorGlow.addColorStop(0,colour+'21');floorGlow.addColorStop(1,colour+'00');
   ctx.fillStyle=floorGlow;ctx.beginPath();ctx.arc(0,0,r*1.15,0,Math.PI*2);ctx.fill();ctx.restore();
   // Reflections are interrupted by seams in the floor rather than being a
   // flat light rectangle. Width follows the fixture, so it never reads as UI.
   for(let i=-2;i<=2;i++){
    const width=(r*.17)*(1-Math.abs(i)*.15);
    ctx.fillStyle=colour+(i===0?'25':'12');
    ctx.fillRect(x+i*r*.22-width/2,785,width,1.6*shimmer);
   }
  }
  ctx.restore();
 }
 // Light sources are tied to painted fixtures and reachable floor, never to HUD coordinates.
 // Scene compositing only: no extra collision surfaces, timers or state flags.
 function practical(stage,t=0){
  const fixtures={
   apartment:[[390,480,290,'#e6a05b'],[2050,475,330,'#6ecddc'],[2440,515,215,'#a4e7ed']],
   club:[[1240,490,370,'#f49b59'],[2500,455,440,'#dd63a7'],[3220,485,240,'#76d9db']],
   booth:[[430,475,300,'#dca273'],[1430,450,360,'#6fbdd2'],[1860,515,240,'#b98bca']],
   relay:[[700,525,280,'#73c3d2'],[1630,525,280,'#e0a77a'],[2520,525,280,'#73c3d2']],
   lab:[[670,480,310,'#d8a66c'],[1830,465,380,'#6ebecb']]
  }[stage];
  if(!fixtures)return;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(const [x,y,r,c] of fixtures){
   const flicker=1+Math.sin(t*1.17+x*.021)*.025;
   const glow=ctx.createRadialGradient(x,y,0,x,y,r*flicker);
   glow.addColorStop(0,c+'1d');glow.addColorStop(.45,c+'0c');glow.addColorStop(1,c+'00');
   ctx.fillStyle=glow;ctx.fillRect(x-r,y-r,r*2,r*2);
   ctx.save();ctx.translate(x,791);ctx.scale(1,.13);
   const contact=ctx.createRadialGradient(0,0,0,0,0,r*.62);
   contact.addColorStop(0,c+'18');contact.addColorStop(1,c+'00');
   ctx.fillStyle=contact;ctx.fillRect(-r*.62,-r*.62,r*1.24,r*1.24);ctx.restore();
  }
  // P46: near/mid/far particulate layers drift at different rates. They are
  // world-anchored, so camera motion exposes depth rather than HUD noise.
  const span=Math.max(1600,Math.max(...fixtures.map(f=>f[0]))+450);
  const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(let i=0;i<17;i++){
   const depth=i%3,seed=i*187.71;
   const x=((seed*3.11+(reduced?0:t*(depth===0?4:depth===1?11:22)))%span);
   const y=210+((seed*1.83+(reduced?0:t*(depth===0?3:depth===1?7:15)))%520);
   ctx.fillStyle=depth===0?'#d7e6ee18':depth===1?'#b6c8d82a':'#d8d4d132';
   ctx.beginPath();ctx.arc(x,y,depth===0?.9:depth===1?1.3:1.8,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  equipmentReflections(stage,t,span);
 }
 function sectionPlatform(p){
  if(p.ground)return;
  ctx.save();const y=p.y,w=p.w,x=p.x;
  ctx.fillStyle='#101820';ctx.fillRect(x,y+1,w,10);
  ctx.fillStyle='#9ab1b2aa';ctx.fillRect(x,y-2,w,3);
  ctx.fillStyle='#253847';ctx.fillRect(x+4,y+11,w-8,3);
  ctx.fillStyle='#050b10a0';ctx.fillRect(x+14,y+14,7,Math.max(5,800-y-14));
  ctx.fillRect(x+w-21,y+14,7,Math.max(5,800-y-14));
  ctx.restore();
 }
 function interactionAnchor(object,y=800,theme='cool',time=0){
  if(!object||!Number.isFinite(object.x))return;
  const x=object.x,pulse=.55+.16*Math.sin(time*3);
  ctx.save();ctx.globalAlpha=pulse;
  const grad=ctx.createRadialGradient(x,y,1,x,y,48);
  grad.addColorStop(0,theme==='warm'?'#debf9670':'#9acdc877');
  grad.addColorStop(.5,theme==='warm'?'#b88a5239':'#44b8bb33');
  grad.addColorStop(1,'#00000000');
  ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(x,y-2,50,9,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=theme==='warm'?'#b3a68a':'#8baebb';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(x-9,y-7);ctx.lineTo(x-4,y-12);ctx.moveTo(x+9,y-7);ctx.lineTo(x+4,y-12);ctx.stroke();
  ctx.restore();
 }
 function hotspot(x,y,kind='terminal'){
  ctx.save();const label={terminal:'CONSULTA LOCAL',door:'ACESSO MANUAL',mechanic:'REPARO',signal:'FONTE DE SINAL'}[kind]||'INTERAÇÃO';
  ctx.fillStyle='#071017bd';ctx.fillRect(x-74,y-35,148,22);
  ctx.fillStyle='#baa689';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(label,x,y-20);
  ctx.fillStyle='#a1bdba';ctx.fillRect(x-2,y-13,4,5);
  ctx.restore();
 }
 return {floor,contact,service,practical,sectionPlatform,interactionAnchor,hotspot};
})();
