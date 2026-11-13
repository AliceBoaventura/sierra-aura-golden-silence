/* P55 · Illustrated hardware. Rendering only: no world state or interaction writes. */
(()=>{'use strict';
 const images={};
 const specs={
  facility:{src:'assets/consoles/facility-terminal.png',crop:[204,116,654,1282],height:178},
  relay:{src:'assets/gallery/reader.png',crop:[20,7,249,423],height:118}
 };
 for(const [kind,spec]of Object.entries(specs)){const im=new Image();im.src=spec.src;images[kind]=im;}
 const colours={idle:'213,163,111',mapped:'100,216,232',isolated:'124,222,187',active:'124,222,187',sealed:'218,127,120'};
 function ready(kind){const im=images[kind];return !!im&&im.complete&&im.naturalWidth>0;}
 function draw(c,x,floor,options={}){
  const kind=options.kind||'facility',spec=specs[kind];
  if(!spec||!ready(kind))return false;
  const h=options.height||spec.height,[sx,sy,sw,sh]=spec.crop,w=h*sw/sh;
  const status=options.status||'idle',rgb=colours[status]||colours.idle;
  const active=status==='active'||status==='isolated';
  c.save();c.imageSmoothingEnabled=true;
  // Contact shadow and reflected light share the device's original world anchor.
  c.fillStyle='#0206099c';c.beginPath();c.ellipse(x,floor+1,w*.62,Math.max(2,h*.022),0,0,Math.PI*2);c.fill();
  c.save();c.translate(x,floor-1);c.scale(1,.13);
  const spill=c.createRadialGradient(0,0,0,0,0,h*.5);
  spill.addColorStop(0,`rgba(${rgb},${active?.19:options.scan?.14:.065})`);spill.addColorStop(1,`rgba(${rgb},0)`);
  c.fillStyle=spill;c.fillRect(-h*.5,-h*.5,h,h);c.restore();
  c.drawImage(images[kind],sx,sy,sw,sh,x-w/2,floor-h,w,h);
  // The lamp is painted onto the bezel, never a floating rectangle over the screen.
  const lx=x+w*.22,ly=floor-h*(kind==='facility'?.80:.68),radius=Math.max(5,h*.105);
  const lamp=c.createRadialGradient(lx,ly,0,lx,ly,radius);
  lamp.addColorStop(0,`rgba(${rgb},${active?.75:.28})`);lamp.addColorStop(1,`rgba(${rgb},0)`);
  c.fillStyle=lamp;c.fillRect(lx-radius,ly-radius,radius*2,radius*2);
  if(active||options.scan){c.fillStyle=`rgb(${rgb})`;c.beginPath();c.arc(lx,ly,Math.max(1,h*.007),0,Math.PI*2);c.fill();}
  if(options.scan){
   const left=x-w*.58,right=x+w*.58,top=floor-h-6,b=Math.max(4,h*.045);
   c.strokeStyle=`rgba(${rgb},.65)`;c.lineWidth=1.2;c.beginPath();
   c.moveTo(left,top+b);c.lineTo(left,top);c.lineTo(left+b,top);
   c.moveTo(right-b,top);c.lineTo(right,top);c.lineTo(right,top+b);c.stroke();
  }
  c.restore();return true;
 }
 window.ConsoleArt=Object.freeze({draw,ready});
})();
