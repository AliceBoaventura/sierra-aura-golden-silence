/* P62 · Rebuilt physical narrative objects (on P60, after P61). Rendering-only integration on the supplied P60.
 * Each sprite belongs to an existing hotspot; no gameplay state, collision,
 * dialogue, scanner, story flag or save data is written here.
 * Painted furniture, NPCs, scanner-only evidence and already-rendered consoles
 * deliberately stay in their existing renderer, without duplicated cabinets.
 */
(function(root){
'use strict';
const prefix='assets/interactive-p61/';
const C={
 prelude:{
  home:[
   ['communicator','rc73-communicator',730,633,69]
  ],
  // P61 wall-sized images suppressed the original, floor-anchored
  // interactive cabinets in prelude.js. Use the previously working props.
  district:[],
  approach:[], // Painted door intercom and reflective window; no portable radio or photo pasted over them.
  trace:[] // TraceGallery.drawStation owns the actual physical sprites.
 },
 apartment:{main:[
  // The tea table, drawers and heat traces are already painted or scanner-only.
  ['power','zona_cega__painel_eletrico',1850,574,57,'power'],
  // Vinyl record is already part of the illustrated room's shelf; no pasted decal.
  ['glove','prop-glove',1985,731,48,'glove']
 ]},
 uprising:{lab:[],relay:[]}, // Existing laboratory door includes its own entry hardware.
 club:{club:[
  // Entrance lock belongs to the illustrated door; poster is fixed to the back wall.
  // Wall art is already painted into the club; no floating poster square.
 ],booth:[
  // Record/photo/console return to the original visible world-props atlas.
  ['module','rc73-module',1730,744,84,'module']
 ],escape:[],raid:[],drive:[]},
 ghost:{home:[['comm','rc73-communicator',730,640,75]],
 apartment:[
  // Existing records hotspot: a physical stack beside the audio shelves.
  // Record stack is already painted beside the real shelves.
  // Hardware at the existing tape archive, no new interaction targets.
  // Archive reels belong to the rendered desk, not a floating overlay.
 ]},
 interval:{holding:[], // Personal wrist interface is worn, not a gadget left on the floor.
 access:[
 ],archive:[],sacrifice:[],aftermath:[]},
 interlude:{home:[],cafe:[],depot:[] // Local recording lives on the real desk terminal; café cups already painted.
 }
};
const OWNED={
 prelude:{home:['bed','mirror','mei','photo','radio','coffee','bench','screen','exit'],district:['gate','clinic','music','signature','resident','exit','terminal','credential','camera','files','solder'],approach:['resident','reflection','exit','door'],trace:['*']},
 apartment:{main:['mirror','cup','drawer','trace','shelf','terminal','aura','workbench']},
 uprising:{lab:['aura','exit','memory','bench'],relay:['*']},
 club:{club:['gate','bar','alex','booth','poster'],booth:['alexPersonal','exit','wave'],escape:['latch','exit'],raid:['exit'],drive:['*']},
 ghost:{home:['pc','module','comm','leave'],apartment:['door','jacket','records','fridge','cups','tapes','sofa','wall','bedroom','desk']},
 interval:{holding:['cot','wrist','cabinet','pulse','reader','exit','names'],access:['brace','entry','map','trace0','trace1','trace2'],archive:['files','power','terminal','second','keane'],sacrifice:['override','contact'],aftermath:['*']},
 interlude:{home:['bed','mei','cup','record','terminal','window','exit'],cafe:['counter','table','window','exit'],walk:['cafe'],returnWalk:['building'],doorstep:['door'],depot:['*']}
};
const images=Object.create(null),failed=new Set(),requested=new Set();let last=null;
const variants={
 screen:(s)=>s.flags?.screen?'prop-terminal':'prop-terminal-off',
 drawer:(s)=>s.flags?.drawer?'prop-drawer-open':'prop-drawer-closed',
 vinyl:(s)=>s.flags?.vinyl?null:'rc73-vinyl',
 glove:(s)=>s.flags?.glove?null:'prop-glove',
 gate:(s)=>s.flags?.gate?'prop-reader-open':'prop-reader',
 power:(s)=>s.flags?.power?'zona_cega__painel_eletrico_reparado':'zona_cega__painel_eletrico',
 upgraded:(s)=>s.flags?.upgraded?'prop-terminal':'prop-terminal-off',
 wave:(s)=>s.flags?.correlated?'prop-terminal':'prop-terminal-off',
 module:(s)=>s.flags?.module?null:'rc73-module',
 latch:(s)=>s.flags?.latch?'prop-reader-open':'prop-reader',
 tapes:(s)=>'rc73-tape'
};
function getImage(key){
 if(!key)return null;
 if(!images[key]){const im=new Image();images[key]=im;requested.add(key);im.onerror=()=>failed.add(key);im.src=prefix+key+'.png';}
 const im=images[key];return im.complete&&im.naturalWidth>0?im:null;
}
function stageFor(scene,s){return scene==='apartment'?'main':scene==='uprising'?(s.stage==='lab'?'lab':'relay'):s.stage;}
function list(scene,stage){return C[scene]?.[stage]||[];}
function has(scene,stage,id){return list(scene,stage).some(a=>a[0]===id);}
function owner(scene,stage,id){const l=OWNED[scene]?.[stage]||[];return l.includes(id)||l.includes('*');}
function draw(scene,s){
 const stage=stageFor(scene,s);let drawn=0;
 for(const [id,base,x,y,height,variant] of list(scene,stage)){
  let key=variant&&variants[variant]?variants[variant](s):base;
  if(!key)continue;
  const im=getImage(key);if(!im)continue;
  const w=Math.min(height*im.naturalWidth/im.naturalHeight,176),h=height;
  // Props have a physical contact shadow and a restrained warm/cool rim.
  // No UI label, no interaction halo, no duplicate hitbox.
  ctx.save();
  ctx.globalAlpha=.97;
  ctx.filter=(scene==='ghost'||scene==='interval')?'brightness(.86) saturate(.78)':(scene==='club'?'brightness(.96) saturate(1.03)':'brightness(1.02) saturate(1.06)');
  if(y>=730){ctx.fillStyle='rgba(4,6,14,.25)';ctx.beginPath();ctx.ellipse(x,y-1,Math.min(w*.40,55),Math.min(7,h*.055),0,0,Math.PI*2);ctx.fill();}
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(im,Math.round(x-w/2),Math.round(y-h),Math.round(w),Math.round(h));
  ctx.restore();drawn++;
 }
 last={scene,stage,drawn};return drawn;
}
function audit(scene,stage,ids){return ids.map(id=>({id,coverage:has(scene,stage,id)?'sprite':owner(scene,stage,id)?'painted-or-existing-renderer':'MISSING'}));}
// Load the small object sprites while the existing P60 boot screen is active.
// This prevents the first visit to a room from showing an empty hotspot.
const prefetch=new Set();
for(const scenes of Object.values(C))for(const entries of Object.values(scenes))
 for(const entry of entries)prefetch.add(entry[1]);
for(const key of ['zona_cega__painel_eletrico_reparado','rc73-vinyl','rc73-module'])prefetch.add(key);
for(const key of prefetch)getImage(key);
root.ScenePropsP61=Object.freeze({draw,has,owner,audit,stageFor,list,failed,requested,images,get last(){return last;},version:'RC73-V3-VISIBLE-PROPS'});
})(window);
