
'use strict';
const ProductionArt=(()=>{
 const root='./assets/production/';const images={};
 const names=['corredor-47','estudio-ghost','apartamento-cinematico','quadro_eletrico','radio','scanner','terminal','chave','entrada-residencial',...Array.from({length:6},(_,i)=>'urbana_'+i)];
 const failures=new Set();
 for(const name of names){
  const im=new Image();images[name]=im;
  if(name==='entrada-residencial'){
   const refresh=()=>{if(typeof preludeReady==='function')preludeReady();if(typeof interludeReady==='function')interludeReady();};
   im.onload=()=>{failures.delete(name);refresh();};
   im.onerror=()=>{failures.add(name);refresh();};
  }
  im.src=root+name+'.png';
 }
 const ok=n=>images[n]?.complete&&images[n].naturalWidth>0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function background(n,x,y,w,h){if(!ok(n))return false;const im=images[n];ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(im,Math.round(x),Math.round(y),Math.round(w),Math.round(h));ctx.restore();return true;}
 function prop(n,x,y,h,opacity=1){if(!ok(n))return false;const im=images[n],w=h*im.naturalWidth/im.naturalHeight;ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=clamp(opacity,0,1);ctx.drawImage(im,Math.round(x-w/2),Math.round(y-h),Math.round(w),Math.round(h));ctx.restore();return true;}
 function urbanNPC(x,y,t,walking=false,face=1){
  const pose=walking?(Math.floor(t*.85)%2?3:4):Math.floor(t*.28)%2;
  if(!ok('urbana_'+pose))return;const im=images['urbana_'+pose],h=195,w=h*im.naturalWidth/im.naturalHeight;
  ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.fillStyle='#0009';ctx.beginPath();ctx.ellipse(0,0,38,5,0,0,Math.PI*2);ctx.fill();ctx.imageSmoothingEnabled=false;ctx.drawImage(im,Math.round(-w/2),-h,Math.round(w),h);ctx.restore();
 }
 function door(x,y,progress=0,height=310){
  if(!ok('entrada-residencial'))return false;
  const im=images['entrada-residencial'],open=clamp(progress,0,1),k=height/508;
  // The threshold is the actor's ground plane. Frame, wall and canopy stay still.
  ctx.save();ctx.translate(Math.round(x-768*k),Math.round(y-818*k));ctx.scale(k,k);
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,0,0);
  if(open>0){
   ctx.save();ctx.beginPath();ctx.rect(554,309,429,509);ctx.clip();
   const interior=ctx.createLinearGradient(554,309,983,818);
   interior.addColorStop(0,'#070b13');interior.addColorStop(.75,'#101925');interior.addColorStop(1,'#26303a');
   ctx.fillStyle=interior;ctx.fillRect(554,309,429,509);
   const slide=open*216;
   ctx.drawImage(im,554,309,214,509,554-slide,309,214,509);
   ctx.drawImage(im,768,309,215,509,768+slide,309,215,509);
   ctx.restore();
  }
  ctx.restore();return true;
 }
 return {background,prop,urbanNPC,door,ok,images,failed:n=>failures.has(n)};
})();
