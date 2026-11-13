'use strict';
const npcAtlas=new Image(),propAtlas=new Image();let lifeLoaded=0;const npcTiles=[],propTiles=[];
// The citizens sheet is not a perfect grid: the second-row hair starts at y=505.
// Use the clear gutter at y=498; never borrow pixels from the next character.
function figureMetrics(im,x,y,w,h){
 const sw=Math.max(0,Math.floor(w)),sh=Math.max(0,Math.floor(h));
 if(!sw||!sh||!im?.naturalWidth&&!im?.width)return null;
 const c=document.createElement('canvas');c.width=sw;c.height=sh;
 const g=c.getContext('2d');g.drawImage(im,x,y,sw,sh,0,0,sw,sh);
 const d=g.getImageData(0,0,sw,sh).data;let l=sw,t=sh,r=0,b=0;
 for(let yy=0;yy<sh;yy++)for(let xx=0;xx<sw;xx++)if(d[(yy*sw+xx)*4+3]>30){l=Math.min(l,xx);t=Math.min(t,yy);r=Math.max(r,xx);b=Math.max(b,yy);}
 if(l>r||t>b)return null;
 let weight=0,moment=0;const height=b-t+1;
 for(let yy=Math.floor(t+height*.07);yy<Math.floor(t+height*.20);yy++)for(let xx=l;xx<=r;xx++){
  const a=d[(yy*sw+xx)*4+3];if(a>30){weight+=a;moment+=a*xx;}
 }
 return {im:c,x:l,y:t,w:Math.max(1,r-l+1),h:height,axis:weight?moment/weight:(l+r)/2};
}
function registerPair(a,b){if(!a||!b)return;const h=Math.max(a.h,b.h);a.standing=b.standing=h;}
function cutCells(im,out,people=false){
 const cw=im.naturalWidth/4,ch=im.naturalHeight/2,gutter=people?Math.round(im.naturalHeight*498/1024):ch;
 for(let k=0;k<8;k++){const y=k<4?0:gutter,h=k<4?gutter:im.naturalHeight-gutter;out.push(figureMetrics(im,k%4*cw,y,cw,h));}
 if(people)for(let k=0;k<8;k+=2)registerPair(out[k],out[k+1]);
}
function figureBox(p,height){const scale=height/(p.standing||p.h);return {x:(p.x-p.axis)*scale,y:-p.h*scale,w:p.w*scale,h:p.h*scale};}
function drawFigure(p,height){if(!p)return;const b=figureBox(p,height);ctx.drawImage(p.im,p.x,p.y,p.w,p.h,b.x,b.y,b.w,b.h);}
function lifeReady(){lifeLoaded++;if(typeof updateBoot==='function')updateBoot();if(typeof clubReady==='function')clubReady();if(typeof preludeReady==='function')preludeReady();}
npcAtlas.onload=()=>{cutCells(npcAtlas,npcTiles,true);lifeReady();};npcAtlas.src='citizens.png';propAtlas.onload=()=>{cutCells(propAtlas,propTiles);lifeReady();};propAtlas.src='world-props.png';
for(const im of [npcAtlas,propAtlas])im.onerror=()=>{const b=$('start');if(b){b.disabled=false;b.textContent='RECARREGAR ARTE';b.onclick=()=>location.reload();}};
// Nine locally bundled two-frame visitors. If a variant fails, the original atlas is used.
const visitorTiles=[];for(let vi=0;vi<9;vi++){
 const image=new Image();visitorTiles[vi]=null;
 image.onload=()=>{const w=image.naturalWidth/2,h=image.naturalHeight;
  const pair=[figureMetrics(image,0,0,w,h),figureMetrics(image,w,0,w,h)];registerPair(...pair);visitorTiles[vi]=pair;
 };image.src='assets/npcs/visitor_'+vi+'.png';
}
function sceneMode(){return state.mode==='paused'?state.resumeMode:state.mode;}
function citizenPose(n,walking){
 const mode=sceneMode();let speaking=false;
 if(mode==='conversation'&&state.interactId===n.id){
  const who=state.conversation?.[state.talkIndex]?.[0]||'';
  speaking=who.split(' / ')[0]===(NPCQuests.data[n.id]?.who||n.name?.split(' / ')[0]);
 }
 if(mode==='clubDialogue'&&state.dialogue===n.id)speaking=true;
 // A gesture belongs to a line of dialogue, not a half-second timer.
 return speaking?1:walking&&n.id!=='patient'?Math.floor((n.foot||0)*.6)%2:0;
}
function prop(k,x,y,h,flip=false){const p=propTiles[k];if(!p)return;const w=p.w/p.h*h;if(x+w/2<camX-32||x-w/2>camX+W+32)return;ctx.save();ctx.translate(Math.round(x),Math.round(y));if(flip)ctx.scale(-1,1);ctx.drawImage(p.im,p.x,p.y,p.w,p.h,-w/2,-h,w,h);ctx.restore();}
const citizenFacing=new WeakMap();
function citizen(n,y=800,walking=false){
 if(n.x+(n.h||210)<camX||n.x-(n.h||210)>camX+W)return;
 const phase=citizenPose(n,walking),p=n.variant!==undefined&&visitorTiles[n.variant]?visitorTiles[n.variant][phase]:npcTiles[Math.min(n.sprite+phase,7)];
 if(!p)return;
 let faces=citizenFacing.get(state);if(!faces){faces=new Map();citizenFacing.set(state,faces);}
 const id=n.id||n.name||'npc-'+n.sprite+'-'+n.x,delta=state.x-n.x;
 let face=faces.get(id)||n.face||-1;
 // Passing a single pixel across the actor's origin must not flip the whole body.
 if(walking)face=n.face||face;else if(Math.abs(delta)>90)face=Math.sign(delta);
 faces.set(id,face);
 const h=n.h||210,b=figureBox(p,h);
 ctx.save();ctx.translate(Math.round(n.x),Math.round(y));ctx.scale(face,1);
 ctx.fillStyle='#02071277';ctx.beginPath();ctx.ellipse(0,0,Math.min(32,b.w*.26),4,0,0,Math.PI*2);ctx.fill();
 drawFigure(p,h);ctx.restore();
}
function atmosphere(stage,worldWidth){const t=state.time;if(stage==='trace'){ctx.save();for(let j=0;j<30;j++){const x=camX+((j*113+t*(j%3+1)*3)%Math.max(W,1)),y=camY+((j*67+t*7)%Math.max(H,1));rect(x,y,j%3?1:2,1,j%2?'#c4d7e523':'#c8a88128');}ctx.restore();return;}if(stage==='home'){for(let j=0;j<18;j++){const x=330+(j*57+t*4)%550,y=490+(j*41+t*9)%280;rect(x,y,2,2,'#edc38035');}if(state.radioOn){for(let k=0;k<9;k++)rect(590+k*3,510-Math.abs(Math.sin(t*3+k))*8,2,8,'#eabc6a99');}return;}if(stage==='approach'){const g=ctx.createRadialGradient(state.x,650,10,state.x,650,270);g.addColorStop(0,'#efb56606');g.addColorStop(1,'#02051177');ctx.fillStyle=g;ctx.fillRect(camX,camY,W,H);return;}
ctx.strokeStyle='#bedaf120';ctx.lineWidth=1;ctx.beginPath();for(let j=0;j<52;j++){const x=camX+((j*89.7-t*110)%W+W)%W,y=camY+(j*47+t*400)%H;ctx.moveTo(x,y);ctx.lineTo(x-5,y+18);}ctx.stroke();for(let j=0;j<5;j++){const x=camX+(j*211+t*13)%W,y=795-(t*28+j*13)%95;ctx.fillStyle='#b2d5d708';ctx.beginPath();ctx.ellipse(x,y,25,8,0,0,Math.PI*2);ctx.fill();}}
function actionHalo(x,y){const pulse=.5+.5*Math.sin(state.time*3);ctx.strokeStyle='#f3d29b';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,9+pulse*2,0,Math.PI*2);ctx.stroke();rect(x-2,y-2,4,4,'#fff1cf');}
function signalGlitch(){if(state.glitch<=0)return;const a=Math.min(.32,state.glitch*.2);ctx.save();ctx.globalAlpha=a;for(let j=0;j<7;j++){const y=(j*97+Math.floor(state.time*18)*31)%H;rect(j%2?0:W*.18,y,W*(j%2?.65:.82),j%3===0?9:2,j%2?'#70ffff':'#ff53b1');}ctx.globalAlpha=.15;ctx.drawImage(canvas,7,0,W,H);ctx.restore();if(!matchMedia('(prefers-reduced-motion: reduce)').matches){ctx.save();ctx.globalAlpha=.055;rect(0,0,W,H,'#a7e1ee');ctx.restore();}}
function showConversation(){
 clearControl();$('radio').style.display='none';
 const box=$('conversationBox'),next=$('talkNext');
 let options=$('neriChoices');if(!options){options=document.createElement('div');options.id='neriChoices';next.insertAdjacentElement('afterend',options);}
 options.replaceChildren();
 const pair=state.conversation[state.talkIndex];
 if(!pair){
  const available=state.chapter===1&&!state.conversationDecisionTaken?NPCQuests.options(state,state.interactId):[];
  if(available.length){
   $('talkSpeaker').textContent='SIERRA / DECISÃO';
   $('talkLine').textContent='Como você quer responder a '+(NPCQuests.data[state.interactId]?.who||'essa pessoa')+'?';
   next.style.display='none';
   available.forEach(({label,value},i)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=(i+1)+' · '+label;btn.onclick=()=>{
      if(state.mode!=='conversation'||state.chapter!==1)return;
      state.conversationDecisionTaken=true;
      state.conversation=NPCQuests.choose(state,state.interactId,value);
      state.talkIndex=0;next.style.display='';showConversation();
   };options.appendChild(btn);});
   box.classList.remove('hidden');ownChapterUI('conversationBox');return;
  }
  state.mode='playing';state.useWas=true;state.interactId=null;delete state.talkX;state.vx=0;
  box.classList.add('hidden');next.style.display='';next.onclick=null;return;
 }
 next.style.display='';box.classList.remove('hidden');$('talkSpeaker').textContent=pair[0];$('talkLine').textContent=window.DialogueDirector?.line(pair[1],state,state.interactId+':'+state.talkIndex)??pair[1];
 const willChoose=state.chapter===1&&!state.conversationDecisionTaken&&NPCQuests.options(state,state.interactId).length>0;
 next.textContent=state.talkIndex===state.conversation.length-1?(willChoose?'ESCOLHER RESPOSTA':'VOLTAR À INVESTIGAÇÃO'):'CONTINUAR';
 next.onclick=()=>{state.talkIndex++;showConversation();};ownChapterUI('conversationBox');window.DialogueDirector?.attach(box,state);
}
qaListen(window,'keydown',e=>{if(e.target?.closest?.('.dialogue-auto'))return;if(state.chapter!==1||state.mode!=='conversation'||e.repeat)return;const focusedChoice=e.target?.closest?.('#neriChoices button');if(focusedChoice&&['Enter','Space'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();focusedChoice.click();return;}const number=['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].indexOf(e.code)%3;if(number>=0){const choice=$('neriChoices').querySelectorAll('button')[number];if(choice){e.preventDefault();e.stopImmediatePropagation();choice.click();return;}}if(['KeyE','Space','Enter'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if($('talkNext').style.display!=='none')$('talkNext').click();}},true);
