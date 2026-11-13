/* MEI: white, long-haired autonomous cat. Presentation only; no puzzle state changes. */
'use strict';
(function(root){
 const poses={};for(const name of ['sit','walk','explore','reach']){const im=new Image();im.src='assets/mei/mei-'+name+'.png?rev=v109-mei-20261111';poses[name]=im;}
 function ensure(s,anchor){
  if(!s.meiAI||!Number.isFinite(s.meiAI.x))s.meiAI={x:anchor,v:0,mode:'sit',last:s.time||0,decisionAt:(s.time||0)+3.8,seed:3,face:1};
  return s.meiAI;
 }
 function step(s,anchor){
  const m=ensure(s,anchor),now=Number(s.time)||0,dt=Math.max(0,Math.min(.07,now-m.last));m.last=now;
  const close=Math.abs((s.x||0)-m.x)<140;
  // The persistent story flag records that Sierra has petted Mei before;
  // only the short reaction timer should keep the reaching pose active.
  const petted=(s.catReactUntil||0)>now;
  if(petted&&close){m.mode='reach';m.decisionAt=now+1.2;}
  else {
   // Leave the interaction pose as soon as its timer expires or Sierra moves away.
   if(m.mode==='reach'){m.mode='sit';m.decisionAt=now+1.2;}
   if(now>=m.decisionAt){
    m.seed=(m.seed*1664525+1013904223)>>>0;
    const roll=m.seed%9;
    m.mode=close?(roll<5?'walk':roll<7?'sit':'explore'):(roll<3?'walk':roll<7?'sit':'explore');
    m.target=anchor+([-47,-26,-14,0,22,44,12,-32,35][roll]);
    m.decisionAt=now+(m.mode==='sit'?4.8:2.8)+(m.seed%15)*.07;
   }
  }
  if(m.mode==='walk'||m.mode==='explore'){
   const goal=Math.max(anchor-50,Math.min(anchor+50,Number.isFinite(m.target)?m.target:anchor));
   const dx=goal-m.x;if(Math.abs(dx)>1){m.face=dx>=0?1:-1;m.x+=Math.sign(dx)*Math.min(Math.abs(dx),dt*20);}else m.mode='sit';
  }else if(m.mode==='reach'&&s.x){m.face=s.x<m.x?-1:1;}
  return m;
 }
 function draw(c,s,x,y,scale=1){
  const m=step(s,x);let key=m.mode;
  const im=poses[key]&&poses[key].complete&&poses[key].naturalWidth?poses[key]:poses.sit;
  if(!im?.naturalWidth)return false;
  // Every pose ends at the same floor plane; sitting cat is taller, not airborne.
  const h=(key==='sit'?83:key==='reach'?69:key==='walk'?60:48)*scale,w=h*im.naturalWidth/im.naturalHeight;
  c.save();c.translate(Math.round(m.x),Math.round(y));c.scale(m.face,1);
  c.globalAlpha=.92;c.fillStyle='#09091570';c.beginPath();c.ellipse(0,1,Math.max(14,w*.44),Math.max(2.5,3*scale),0,0,Math.PI*2);c.fill();
  c.globalAlpha=1;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(im,-w*.5,-h,w,h);c.restore();return true;
 }
 root.MeiAI=Object.freeze({draw,step,poses});
})(typeof window!=='undefined'?window:globalThis);
