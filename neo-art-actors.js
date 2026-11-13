/* Neo Rockford: original illustrated 8-pose actor sets, loaded locally.
   Preserves physics, anchors, hitboxes and puzzle state. */
(()=>{'use strict';
const repairs={"sierra-4":{"box":[65,52,1272,1049],"height":342,"anchor":166.0},"aura-4":{"box":[43,31,1183,1237],"height":364,"anchor":174.0},"jinx-4":{"box":[2,18,1197,1279],"height":382,"anchor":174.5},"alexandra-4":{"box":[3,33,1211,1218],"height":368,"anchor":172.5},"aura-5":{"box":[3,5,1148,1337],"height":344,"anchor":145.0},"sierra-6":{"box":[68,20,1281,1071],"height":373,"anchor":165.0},"aura-6":{"box":[16,178,1100,995],"height":402,"anchor":163.5},"jinx-6":{"box":[119,13,1319,1028],"height":403,"anchor":162.0},"alexandra-6":{"box":[98,12,1395,963],"height":387,"anchor":178.0},"sierra-8":{"box":[109,0,936,1484],"height":550,"anchor":200}};
// Walk atlas: manually registered hip axes, alpha bounds, one common scale.
const crouchArt=new Image();crouchArt.src='assets/rebuild/actors/sierra-crouch.png';
const walkAtlas=new Image();walkAtlas.src='assets/rebuild/actors/sierra-walk.png';
const walkFrames=[{box:[48,32,528,665],axis:286},{box:[1093,25,561,671],axis:1371}];
// One planted-foot pose between each stride prevents the high-knee 'march'.
// 9 and 11 are planted strides; 10 and 12 are neutral contact poses.
const actors={};for(const name of ['sierra','jinx','aura','alexandra']){
 actors[name]=[];for(let i=0;i<(name==='sierra'?9:8);i++){const im=new Image();im.src=(name==='jinx'&&i<4)?`assets/visual-v5/jinx/jinx-${i}.png`:`assets/rebuild/actors/${name}-${i}.png`;actors[name].push(im);}
}
// Registered contact-pose textures. Normalizing happens once offline: fixed
// supporting soles, no runtime crop, no morphing, no limb substitution. Missing
// optional V10 art falls back to the original approved sprites without stopping boot.
const registeredMetrics=Object.freeze({sierra:659,aura:628,jinx:610,alexandra:627});
// V10.2: four new authored locomotion phases. V10 stays as a full fallback.
// The existing character standing and emotional poses are deliberately retained;
// no unrelated scene or costume changes are made by the walk art.
const enhancedMetrics=Object.freeze({sierra:659,aura:628,jinx:610,alexandra:627});
const enhancedWalk={};
const failedEnhancedAssets=new Set();
for(const name of Object.keys(enhancedMetrics)){
 enhancedWalk[name]=Array.from({length:4},(_,i)=>{
  const im=new Image();const path=`assets/animation-v102/${name}-${i}.png`;
  im.onerror=()=>failedEnhancedAssets.add(path);
  im.src=path;return im;
 });
}
// V10.6: eight registered, authored source frames exclusively for following traces.
const investigationFrames=Array.from({length:8},(_,i)=>{const im=new Image();im.src=`assets/animation-v106/trace-sierra-${i}.png`;return im;});
const failedAnimationAssets=new Set();
function animationImage(path){
 const im=new Image();im.onerror=()=>failedAnimationAssets.add(path);
 im.src=path;return im;
}
const registered=Object.fromEntries(Object.keys(registeredMetrics).map(name=>[name,Array.from({length:4},(_,i)=>
 animationImage(`assets/animation-v10/${name}-${i}.png`)
)]));
const costumes={
 'alex-casual':{height:527,frames:Array.from({length:4},(_,i)=>animationImage(`assets/animation-v10/alex-casual-${i}.png`))},
 'alex-ghost':{height:627,frames:Array.from({length:4},(_,i)=>animationImage(`assets/animation-v10/alex-ghost-${i}.png`))}
};
function assetQA(){
 const all=[...Object.values(registered).flat(),...Object.values(costumes).flatMap(c=>c.frames)];
 return {total:all.length,ready:all.filter(im=>im.complete&&im.naturalWidth>0).length,
  failed:[...failedAnimationAssets,...failedEnhancedAssets],enhancedTotal:16,enhancedReady:Object.values(enhancedWalk).flat().filter(im=>im.complete&&im.naturalWidth>0).length};
}
function registeredDraw(im,visibleHeight,worldHeight){
 if(!im?.complete||im.naturalWidth<1||!Number.isFinite(worldHeight)||worldHeight<=0)return false;
 const k=worldHeight/visibleHeight;
 ctx.drawImage(im,-im.naturalWidth*k/2,-im.naturalHeight*k,im.naturalWidth*k,im.naturalHeight*k);
 return true;
}
function drawInvestigation(t,worldHeight){
 const phase=Math.floor(Math.abs(t)*1.04)%8;
 return registeredDraw(investigationFrames[phase],659,worldHeight);
}
function drawCostume(name,frame,worldHeight){
 const set=costumes[name];if(!set)return false;
 return registeredDraw(set.frames[Math.max(0,Math.min(3,frame|0))],set.height,worldHeight);
}
function draw(name,frame,worldHeight){const seq=actors[name];if(!seq)return false;
 if(name==='sierra'&&frame===13){
  if(crouchArt.complete&&crouchArt.naturalWidth){
   // Uniform scale, alpha bounds registered at the supporting sole.
   const h=worldHeight*.64,w=h*895/1236;
   ctx.drawImage(crouchArt,140,88,895,1236,-w*.48,-h,w,h);return true;
  }
  frame=0; // Never stretch a standing frame while the new art loads.
 }
 // Stage-specific emotions still use the authored unmodified portraits.
 // Walk poses share a single footline and consistent source scale in all chapters.
 if(name==='sierra'&&frame>=9&&frame<=12)frame=[2,0,3,0][frame-9];
 // Locomotion is isolated to 20..23: standing/sitting/gesture artwork stays V10.
 if(frame>=20&&frame<=23){
  const beat=frame-20;
  if(registeredDraw(enhancedWalk[name]?.[beat],enhancedMetrics[name],worldHeight))return true;
  // Missing enhanced image cannot remove the character or block progress.
  frame=[2,0,3,0][beat];
 }
 if(frame>=0&&frame<=3&&registeredDraw(registered[name][frame],registeredMetrics[name],worldHeight))return true;
 const img=seq[Math.max(0,Math.min(seq.length-1,frame|0))];if(!img?.complete||!img.naturalWidth)return false;
 // Standing frames have a common apparent body height. Seated, crouched
 // and emotionally collapsed poses retain their actual shorter silhouettes.
 // Scaling every frame to the full standing height made the seated poses
 // twice as large as their environment, even though their feet touched y=0.
 const base=seq[0]?.naturalHeight||({sierra:660,jinx:639,aura:629,alexandra:628}[name]||img.naturalHeight);
 // Use one body scale across poses; a bent knee must not enlarge the torso.
 const scale=worldHeight/base,repair=repairs[name+'-'+Math.max(0,Math.min(seq.length-1,frame|0))];
 if(repair){
  // Repaired art has a larger canvas. Register visible soles and keep the
  // original body axis instead of centering the newly completed hand/boot.
  const [sx,sy,sw,sh]=repair.box,h=repair.height*scale,w=h*sw/sh;
  ctx.drawImage(img,sx,sy,sw,sh,-repair.anchor*scale,-h,w,h);
 }else{
  const h=img.naturalHeight*scale,w=img.naturalWidth*scale;
  ctx.drawImage(img,-w/2,-h,w,h);
 }
 return true;
}
function frame(name,walking,t,emotion,airborne=false){
 if(airborne&&name==='sierra')return 8;
 if(name==='sierra'&&emotion==='crouch')return 13;
 if(emotion==='grief')return 5;
 if(emotion==='reach')return 6;
 if(emotion==='tension')return 1;
 if(emotion==='sit')return 4;
 if(walking){
  // 4-beat cycle on traveled distance: stride, planted foot, opposing stride,
  // planted foot. Aura/Jinx/Alexandra use their original approved contact pose.
  // The neutral contact frame eliminates hard 2-frame flicker at low FPS.
  const beat=Math.floor(Math.abs(t)*(name==='sierra'?.92:.85))%4;
  return 20+beat;
 }
 return 0;
}
window.NeoActors={draw,drawCostume,drawInvestigation,investigationFrames,frame,actors,registered,registeredMetrics,
 enhancedWalk,enhancedMetrics,assetQA,
 originalArt:true,revision:'V102-enhanced-walk-registered'};
})();
