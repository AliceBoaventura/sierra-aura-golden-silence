'use strict';
// Dedicated interlude poses; the original chapter atlas remains untouched.
const coffeePoseImage=new Image();let coffeePoseReady=false,coffeePoseFailed=false;
const coffeePoseBounds=[[133,20,349,488,290],[639,16,254,492,762],[1080,17,342,492,1222],[191,513,198,500,280],[657,588,255,418,732],[1082,596,304,410,1200]];
coffeePoseImage.onload=()=>{coffeePoseReady=true;if(typeof interludeReady==='function')interludeReady();};
coffeePoseImage.onerror=()=>{coffeePoseFailed=true; $('chapterInterlude').textContent='RECARREGAR PERSONAGENS';$('chapterInterlude').onclick=()=>location.reload();};
coffeePoseImage.src='coffee-character-poses.png';
const coffeeTableImage=new Image();let coffeeTableReady=false;
coffeeTableImage.onload=()=>{coffeeTableReady=true;if(typeof interludeReady==='function')interludeReady();};
coffeeTableImage.onerror=()=>{coffeePoseFailed=true;if(typeof interludeReady==='function')interludeReady();};
coffeeTableImage.src='coffee-table-poses.png';
// The seated composition uses the original cafe chairs, table and floor.
const coffeeSeatedImage=new Image();let coffeeSeatedReady=false;
coffeeSeatedImage.onload=()=>{coffeeSeatedReady=true;if(typeof interludeReady==='function')interludeReady();};
coffeeSeatedImage.onerror=()=>{coffeeSeatedReady=false;};
coffeeSeatedImage.src='cafe-seated-composite.png';
// V10.5: Cafe seats are individually registered, without characters baked into scenery.
const coffeeSeatV105={};const coffeeSeatAssetState={};
for(const id of ['jinx','sierra']){
 const im=new Image();coffeeSeatAssetState[id]=false;
 im.onload=()=>{coffeeSeatAssetState[id]=im.naturalWidth>0;};
 im.onerror=()=>{coffeeSeatAssetState[id]=false;};
 im.src=`assets/visual-v105/cafe-seat-${id}.png`;coffeeSeatV105[id]=im;
}
const coffeeTableOcclusionV105=new Image();
coffeeTableOcclusionV105.src='assets/visual-v105/cafe-real-table-occlusion.png';
function coffeeSceneV105Ready(){return Object.values(coffeeSeatAssetState).every(Boolean)&&coffeeTableOcclusionV105.complete&&coffeeTableOcclusionV105.naturalWidth>0;}
function coffeeDrawTableOcclusionV105(wide){if(coffeeSceneV105Ready())ctx.drawImage(coffeeTableOcclusionV105,0,0,wide,1200);}

// Full sitting silhouettes, registered at the soles. Both use one physical scale.
// Seat silhouettes share the same visual scale and stay on the actual café chairs.
// The previous baseline (y=794) put both figures on the FLOOR, not on the chairs.
// Keep the seated poses behind the foreground UI, not behind a fake painted strip.
function coffeeTableActor(kind,gesture=''){
 const jinx=kind==='jinx';
 const chairX=jinx?530:805,soleY=800;
 const sprite=coffeeSeatV105[kind];
 // Tiny authored gesture offsets: Sierra reaches toward the cup; Jinx leans in
 // or glances toward the counter. The seat registration and foot plane do not change.
 const lean=gesture==='cup'?-3:gesture==='lean'?3:gesture==='counter'?2:0;
 const lift=gesture==='cup'||gesture==='lean'?-1:0;
 if(coffeeSceneV105Ready()&&sprite?.naturalWidth){
  const h=jinx?278:262,w=sprite.naturalWidth*h/sprite.naturalHeight;
  ctx.save();ctx.translate(Math.round(chairX+lean),soleY+lift);ctx.scale(jinx?1:-1,1);
  ctx.fillStyle='#06122255';ctx.beginPath();ctx.ellipse(0,0,30,4,0,0,Math.PI*2);ctx.fill();
  ctx.drawImage(sprite,Math.round(-w/2),-h,Math.round(w),h);ctx.restore();
  return;
 }
 // Fallback for a missing optional V10.5 image; never hide the characters.
 if(!coffeeTableReady)return;
 const r=jinx?[270,20,605,855]:[985,70,695,805],h=jinx?278:262;
 const w=r[2]*h/r[3];
 ctx.save();ctx.translate(Math.round(chairX+lean),soleY+lift);ctx.scale(jinx?1:-1,1);
 ctx.drawImage(coffeeTableImage,r[0],r[1],r[2],r[3],-w/2,-h,w,h);
 ctx.restore();
}
function coffeePoseIndex(kind,walking,foot,seated){return seated?(kind==='jinx'?4:5):kind==='jinx'?(walking?[0,1,2,1][Math.floor(foot)%4]:3):(walking?Math.floor(foot)%4:4);}
function coffeeActor(x,y,face,foot,walking,kind='sierra',seated=false,heightOverride=null){
 if(!coffeePoseReady||!actorsLoaded)return;
 const i=coffeePoseIndex(kind,walking,foot,seated),custom=kind==='jinx'||seated;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.fillStyle='#02071170';ctx.beginPath();ctx.ellipse(0,1,seated?40:30,4,0,0,Math.PI*2);ctx.fill();ctx.scale(face,1);
 const breathe=0; // Pixel art stays on a stable grid while listening.
 // A room is painted at a different world width than the café. Keep the actor
 // proportional to the architecture, rather than shrinking Sierra on returning home.
 const worldHeight=Number.isFinite(heightOverride)&&heightOverride>0?heightOverride:(kind==='jinx'?264:208);
 if(!seated&&window.NeoActors?.draw(kind,NeoActors.frame(kind,walking,foot,''),worldHeight)){/* Keep the same reconstructed body throughout the walk to the café. */}
 else if(kind==='jinx'&&!seated&&jinxMotionReady){drawJinxFrame(foot,walking,worldHeight);}
 else if(custom){const [sx,sy,w,h,anchor]=coffeePoseBounds[i],base=worldHeight/500,scale=base;ctx.drawImage(coffeePoseImage,sx,sy,w,h,Math.round((sx-anchor)*scale),-Math.round(h*scale)+breathe,Math.round(w*scale),Math.round(h*scale));}
 else{drawActorFrame(i,worldHeight);}
 ctx.restore();
}
