/* P51 / Galeria técnica: image-backed environmental installation art.
   Source art is existing production sprites, reworked into eight wall-mounted
   composites; the world and all coordinates/gameplay remain from P50.
   Important: export to globalThis because prelude.js accesses window.TraceGallery. */
'use strict';
const TraceGallery=(()=>{
 const background=new Image(); background.src='assets/locations/aura-hideout-approach.jpg';
 const dimensions=Object.freeze({
  console:[210,161],audio:[210,154],reader:[141,216],repair:[207,222],
  camera:[180,125],archive:[227,164],lift:[143,218],exit:[221,278]
 });
 const installed=Object.create(null);
 for(const kind of Object.keys(dimensions)){
  const im=new Image(); im.src=`assets/gallery/${kind}.png`; installed[kind]=im;
 }
 const STATIONS=Object.freeze({
  terminal:{x:500,y:661,kind:'console'},music:{x:1000,y:675,kind:'audio'},
  credential:{x:1400,y:661,kind:'reader'},solder:{x:1760,y:672,kind:'repair'},
  camera:{x:2020,y:652,kind:'camera'},files:{x:3120,y:654,kind:'archive'},
  lift:{x:3660,y:643,kind:'lift'},exit:{x:3980,y:659,kind:'exit'}
 });
 function loaded(im){return !!im&&im.complete&&im.naturalWidth>0;}
 function ready(){return loaded(background);}
 function assetsReady(){return ready()&&Object.keys(installed).every(k=>loaded(installed[k]));}
 function drawBackground(c,wide,scanning,spectral){
  if(!ready()){
   c.save();c.fillStyle='#07121b';c.fillRect(0,235,wide,700);c.restore();return false;
  }
  // One continuous room-to-hideout composition; no looping catracas or repeating machinery.
  const picture=scanning?spectral(background):background;
  c.save();c.imageSmoothingEnabled=false;
  c.drawImage(picture,0,260,wide,900);
  c.restore();return true;
 }
 function lettering(c,text,x,y,color='#b0d5d6',size=10){
  c.fillStyle=color;c.font=`bold ${size}px ui-monospace,Consolas,monospace`;
  c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y);
 }
 function glow(c,x,y,color='81,213,231',strength=.09,r=110){
  const g=c.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,`rgba(${color},${strength})`);
  g.addColorStop(1,`rgba(${color},0)`);
  c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
 }
 function drawAtmosphere(c,wide,time){
  // Small painted utility marks and subtle reflected light. No fake UI panels.
  c.save();
  const letters=[
   [510,'B3 / ENTRADA DISFARÇADA'],[1400,'ACESSO / SEM REDE'],[2020,'CFTV LOCAL'],
   [3130,'QUARTO / ABRIGO'],[3655,'PORTA SEM REGISTRO'],[3975,'AURA']
  ];
  for(const [x,title] of letters){
   c.save();c.globalAlpha=.55;
   lettering(c,title,x,503,'#91b9bf',10);
   c.fillStyle='#c99c59a4';c.fillRect(x-17,511,34,2);
   c.restore();
  }
  for(let x=520;x<wide;x+=1100){
   glow(c,x,606,'78,190,230',.055+.01*Math.sin(time*1.4+x),132);
  }
  c.restore();
 }
 function drawStation(c,o,s){
  // V7: interactions are physical points of the existing environment, NOT floating
  // UI cards (computer/boombox/handheld device) suspended over an industrial wall.
  // Preserve each world's x coordinate, scanner condition, and every puzzle flag.
  const st=STATIONS[o.id];if(!st)return [o.x,650];
  const {x,kind}=st;
  const y=kind==='camera'?625:kind==='exit'?660:646;
  const completed=(kind==='console'&&s.flags.terminal)||
   (kind==='reader'&&s.flags.credential)||(kind==='camera'&&s.flags.camera);
  const near=Math.abs(s.x-x)<118;
  const inspect=!!s.scan||near;
  if(inspect){
   c.save();
   const alpha=near?.92:.56;
   c.globalAlpha=alpha;
   // Minimal embedded equipment indicator: no large false prop, no double wall.
   const dx=x-14,dy=y-29;
   c.fillStyle='#101b24c9';c.fillRect(dx,dy,28,13);
   c.strokeStyle=completed?'#8de0c4':'#6b9db0';c.lineWidth=1;
   c.strokeRect(dx+.5,dy+.5,27,12);
   // Each reader has a compact, physical glyph instead of eight identical LEDs.
   c.strokeStyle=completed?'#7ef4ca':'#85cbd4';
   c.beginPath();
   if(['audio','archive'].includes(kind)){
    c.moveTo(dx+4,dy+7);c.lineTo(dx+8,dy+4);c.lineTo(dx+12,dy+9);
    c.lineTo(dx+16,dy+5);c.lineTo(dx+23,dy+7);
   }else if(['reader','exit'].includes(kind)){
    c.moveTo(dx+7,dy+4);c.lineTo(dx+7,dy+10);c.moveTo(dx+20,dy+4);c.lineTo(dx+20,dy+10);
    c.moveTo(dx+7,dy+7);c.lineTo(dx+20,dy+7);
   }else{
    c.moveTo(dx+5,dy+8);c.lineTo(dx+9,dy+8);c.lineTo(dx+9,dy+4);
    c.moveTo(dx+14,dy+4);c.lineTo(dx+14,dy+9);c.lineTo(dx+22,dy+9);
   }
   c.stroke();
   if(s.scan&&near){
    c.strokeStyle='#81e1dcaa';c.setLineDash([3,4]);
    c.strokeRect(x-27,y-43,54,47);c.setLineDash([]);
   }
   c.restore();
  }
  // The selection ring and name are drawn by Prelude.draw with the returned anchor.
  return [x,y-16];
 }
 return Object.freeze({ready,assetsReady,drawBackground,drawAtmosphere,drawStation,stations:STATIONS,assetSizes:dimensions});
})();
globalThis.TraceGallery=TraceGallery;
