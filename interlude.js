'use strict';
/* Self-contained interlude renderer. Previous chapters use their original scripts. */
const interludeHome=new Image(),interludeDistrict=new Image(),interludeCity=new Image(),interludeCar=new Image(),interludeCafe=new Image();
const interludeTerminalOff=new Image();interludeTerminalOff.src='assets/interactive-p61/interlude__terminal_off.png';
const interludeTerminalOn=new Image();interludeTerminalOn.src='assets/interactive-p61/interlude__terminal_on.png';
const interludeMei=new Image();interludeMei.src='assets/interactive-p61/interlude__mei.png';
const interludeDepot=new Image();interludeDepot.src='assets/visual-v102/depot-47-evidence-room.png';
const interludeDepotFallback=new Image();interludeDepotFallback.src='assets/visual-v102/_source_depot-47-clean.png';
const depotEvidenceArt=new Image();depotEvidenceArt.src='depot-evidence-art.png';
const depotTerminalArt=new Image();depotTerminalArt.src='depot-terminal-art.png';
const depotGateArt=new Image();depotGateArt.src='depot-gate-art.png';
const depotArchiveDetail=new Image();depotArchiveDetail.src='depot-archive-detail.png';
const depotTapeDetail=new Image();depotTapeDetail.src='depot-tape-detail.png';
const interludeGate=new Image();interludeGate.src='depot-p42-arrival.png';
const depotJourneyArt=new Image();depotJourneyArt.src='depot-p42-car.png';
const depotPropsClean=new Image();depotPropsClean.src='depot-p42-props.png';
const depotAuraFull=new Image();depotAuraFull.src='aura.png';
const depotP21Clues=Object.fromEntries([['depotBoard','mural'],['depotArchive','ficharios'],['depotTape','fita'],['depotTerminal','terminal']].map(([id,name])=>{const im=new Image();im.src='depot-p21-'+name+'.png';return [id,im];}));
const depotP21Aura=new Image();depotP21Aura.src='depot-p21-aura-idle.png';
const depotP27Props=Object.fromEntries(['mural','ficharios','fita','terminal'].map(id=>{const im=new Image();im.src='depot-p27-'+id+'.png';return [id,im];}));
function drawDepotP27Props(s){
 const im=depotPropsClean;if(!im.complete||!im.naturalWidth)return;
 const props=[[[30,20,780,480],525,168,495,270],[[885,80,610,420],1105,343,190,143],[[30,520,730,480],1380,350,150,111],[[805,530,710,475],1630,225,290,236]];
 for(const [src,x,y,w,h] of props){const k=Math.min(w/src[2],h/src[3]);ctx.drawImage(im,...src,x+(w-src[2]*k)/2,y+h-src[3]*k,src[2]*k,src[3]*k);}
}

const depotP25Actors=Object.fromEntries(['sierra','jinx','aura'].map(id=>{
 const im=new Image();im.src=(id==='sierra'?'depot-p39-sierra.png':'depot-p25-'+id+'.png');return [id,im];
}));
// P43 is the source of truth. Preserve P39 Sierra, with independent P25 and
// campaign-pose atlases if a source fails to load or is invalid on a device.
const depotSierraBackup=new Image();depotSierraBackup.src='depot-p25-sierra.png';
const depotSierraLastResort=new Image();depotSierraLastResort.src='actor-restored-0.png';
function depotP25Actor(id,x,y,walking,inspect,time,facing=1,stride=0){
 // V10.2: only locomotion swaps to the enhanced complete-body frames.
 // All authored idle, inspection, injury and cinematic portraits remain intact.
 if(walking&&!inspect&&window.NeoActors){
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(facing<0?-1:1,1);
  const h=id==='jinx'?216:174;
  const ok=NeoActors.draw(id,NeoActors.frame(id,true,stride,''),h);
  ctx.restore();if(ok)return true;
 }

 const main=depotP25Actors[id];
 const im=id==='sierra'&&(!main?.complete||main.naturalWidth!==640||main.naturalHeight<200)?depotSierraBackup:main;
 if(!im?.complete||im.naturalWidth<640||im.naturalHeight<200)return false;
 const bounds={sierra:[[38,17,84,189],[23,14,113,193]],jinx:[[42,10,75,190],[31,7,98,190]],aura:[[43,10,73,190]]};
 const backupBounds=[[22,10,108,190],[22,10,108,190]];
 const frame=walking&&id!=='aura'?Math.floor(time*7)%2:0;
 const [sx,sy,sw,sh]=id==='sierra'&&im===depotSierraBackup?backupBounds[frame]:bounds[id][frame];
 const sourceX=frame*160+sx,h=id==='jinx'?216:174,k=h/sh;
 if(sourceX<0||sourceX+sw>im.naturalWidth||sy+sh>im.naturalHeight)return false;
 ctx.save();
 try{
  ctx.globalAlpha=id==='aura'?.82:1;
  ctx.globalCompositeOperation='source-over';
  ctx.translate(Math.round(x),Math.round(y));ctx.scale(facing<0?-1:1,1);
  if(id==='sierra'){ctx.shadowColor='rgba(1,6,13,.90)';ctx.shadowBlur=7;}
  else if(id==='aura'){ctx.shadowColor='#44d9ee';ctx.shadowBlur=5;}
  ctx.drawImage(im,sourceX,sy,sw,sh,-sw*k/2,-h,sw*k,h);
  return true;
 }catch(error){return false;}
 finally{ctx.restore();}
}
// Campaign pose fallback is independent from the café sprite loader.
function drawDepotSierraFallback(s,y){
 const im=depotSierraLastResort;
 if(!im.complete||!im.naturalWidth||!im.naturalHeight)return false;
 ctx.save();
 try{
  const h=174,k=h/421;
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  ctx.translate(Math.round(s.x),Math.round(y));ctx.scale(s.face<0?-1:1,1);
  ctx.drawImage(im,-153*k,-424*k,im.naturalWidth*k,im.naturalHeight*k);
  return true;
 }catch(error){return false;}
 finally{ctx.restore();}
}
// Reuse the subtle scanner visual language from game.js; P43 keeps its own
// clue brackets and labels. The circles are painted *behind* Sierra.
function drawDepotScanner(s,baseY){
 if(!s.scan||s.mode!=='playing')return;
 const x=s.x,y=baseY-50,pulse=Math.sin(s.time*4)*8;
 ctx.save();
 try{
  ctx.strokeStyle='#7af8f459';ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(x,y,130+pulse,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#48dadb07';ctx.fill();
  ctx.strokeStyle='#74fff254';ctx.setLineDash([5,10]);
  ctx.beginPath();ctx.arc(x,baseY-65,95,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#abfff2';
  for(let k=0;k<6;k++){
   const a=s.time*.8+k*Math.PI/3;
   ctx.fillRect(x+Math.cos(a)*130,y-15+Math.sin(a)*130,3,3);
  }
 }finally{ctx.restore();}
}
function drawDepotCinematic(s){
 const im=s.stage==='depotDrive'?depotJourneyArt:interludeGate;
 rect(0,0,W,H,'#05080d');
 if(im.complete&&im.naturalWidth){const k=Math.min(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*k,h=im.naturalHeight*k;ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);}
 const duration=s.stage==='depotDrive'?8:6,fade=Math.max(0,1-s.stageTime/.6,(s.stageTime-(duration-.6))/.6);
 if(fade>0){ctx.save();ctx.globalAlpha=Math.min(1,fade);rect(0,0,W,H,'#000');ctx.restore();}
}

const sierraSleepPose=new Image(),virtualAura=new Image(),sierraPetting=new Image();sierraSleepPose.src="sierra-p42-sleep.png";virtualAura.src="sm-portrait-aura.png";sierraPetting.src='sierra-seat.png';
let interludeAssets=0,interludeFailed=false,interludeCarTile=null;
function interludeReady(){const b=$('chapterInterlude');if(!b)return;if(interludeFailed||coffeePoseFailed){b.disabled=false;b.textContent='RECARREGAR INTERLÚDIO';b.onclick=()=>location.reload();return;}b.disabled=interludeAssets<5||!coffeePoseReady||!coffeeTableReady||!ready;b.onclick=openInterlude;}
for(const [im,src] of [[interludeHome,'assets/visual-v5/sierra-home-v5.png'],[interludeDistrict,'assets/visual-v5/district-routine-v5.png'],[interludeCity,'assets/visual-v5/city-v5.png'],[interludeCar,'cadillac-80.png'],[interludeCafe,'assets/visual-v5/cafe-0217-v5.png']]){
 im.onload=()=>{if(im===interludeCar)interludeCarTile=clubTrim(im);interludeAssets++;interludeReady();};
 im.onerror=()=>{interludeFailed=true;const b=$('chapterInterlude');if(b){b.disabled=false;b.textContent='RECARREGAR INTERLÚDIO';b.onclick=()=>location.reload();}};
 im.src=src;
}
/* Quiet, synthesized ambience: one low-level loop per location, no external files.
   It belongs to the chapter audio registry, so pause/exit/scene changes stop it. */
let interludeAmbientNode=null,interludeAmbientStage='',interludeNoiseBuffer=null;
function interludeAmbience(){
 if(state.chapter!==8||!sound||state.mode==='paused'||state.mode==='won'||state.mode==='interludeTitle'||state.stage==='end')return;
 if(interludeAmbientNode&&audioNodes.has(interludeAmbientNode)&&interludeAmbientStage===state.stage)return;
 if(interludeAmbientNode&&audioNodes.has(interludeAmbientNode))stopChapterAudio();
 try{
  ac??=new(window.AudioContext||window.webkitAudioContext)();
  if(ac.state==='suspended')ac.resume().catch(()=>{});
  if(!interludeNoiseBuffer){
   interludeNoiseBuffer=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);
   const data=interludeNoiseBuffer.getChannelData(0);let smooth=0;
   for(let i=0;i<data.length;i++){smooth=.94*smooth+.06*(Math.random()*2-1);data[i]=smooth;}
  }
  const o=ac.createBufferSource(),filter=ac.createBiquadFilter(),g=ac.createGain();
  o.buffer=interludeNoiseBuffer;o.loop=true;
  const indoor=['home','homeEnd','morning','cafe','depot'].includes(state.stage);
  filter.type='lowpass';filter.frequency.value=indoor?470:960;
  g.gain.value=indoor?.020:.055;
  if(state.stage==='grief')g.gain.value=.008;

  o.connect(filter);filter.connect(g);g.connect(ac.destination);
  const owned={o,g};interludeAmbientNode=owned;interludeAmbientStage=state.stage;
  audioNodes.add(owned);
  o.onended=()=>{audioNodes.delete(owned);try{filter.disconnect();}catch{}};
  o.start();
 }catch(e){interludeAmbientNode=null;interludeAmbientStage='';}
}
function openInterlude(){
 StoryContinuity.capture(state);leaveTerrace();clearControl();state=Interlude.create();state.mode='interludeTitle';
 $('game').classList.add('interlude-mode','interlude-cinematic','interlude-opening');
 showPanel('Café às<br><em>02:17.</em>','','COMEÇAR INTERLÚDIO',beginInterlude);
 $('overlay').querySelector('.eyebrow').textContent='INTERLÚDIO';
}
function beginInterlude(){
 if(interludeFailed||interludeAssets<5||!coffeePoseReady||!coffeeTableReady||!ready){showPanel('Café às<br><em>02:17.</em>','A noite ainda está carregando.','TENTAR NOVAMENTE',beginInterlude);return;}
 leaveTerrace();clearControl();document.getElementById('interludeCurtain')?.remove();$('game').classList.remove('interlude-ended');document.querySelectorAll('.depot-final-p38').forEach(el=>el.remove());depotFinalMobileLayer=null;document.querySelector('.hud').style.opacity='1';
 state=Interlude.create();camX=0;camY=340;
 preloadDepotFinalArt();
 $('game').classList.add('interlude-mode','interlude-cinematic');$('interludeSkip').classList.remove('hidden');$('overlay').classList.add('hidden');$('overlay').classList.remove('encounter','hacking');
 $('pause').textContent='Ⅱ';$('radio').style.display='none';renderInterludeDialogue();updateUI();
}
function interludeBg(im,wide,baseline=.70,alpha=1,flip=false){if(!im.naturalWidth)return;const ih=wide*im.naturalHeight/im.naturalWidth,y=800-ih*baseline;ctx.save();ctx.globalAlpha=alpha;if(flip){ctx.translate(wide,0);ctx.scale(-1,1);}ctx.drawImage(im,0,y,wide,ih);ctx.restore();}
function drawCat(x,y,scale=1){
 // Mei's autonomy and white-fur poses are managed by the persistent actor module.
 if(globalThis.MeiAI?.draw(ctx,state,x,y,scale))return;
 // The existing painted kitten remains the fallback if the new asset fails to load.
 const im=interludeMei;
 if(im.complete&&im.naturalWidth){const w=92*scale,h=58*scale;ctx.save();ctx.globalAlpha=.96;ctx.drawImage(im,x-w/2,y-h,w,h);ctx.restore();}
}
function drawCafe(s,wide){
 if(interludeCafe.naturalWidth){ctx.drawImage(interludeCafe,0,0,wide,1200);}else rect(0,0,wide,1420,'#1a100e');
 if(Number.isFinite(s.lightsDownAt)){ctx.save();ctx.globalAlpha=Math.min(.16,Math.max(0,s.time-s.lightsDownAt)*.045);rect(0,0,wide,1200,'#090c19');ctx.restore();}
 // Ambient rain is visible only through the real painted windows.
 ctx.save();ctx.beginPath();ctx.rect(0,140,615,515);ctx.clip();ctx.strokeStyle='#a8c6df35';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<28;k++){const x=20+(k*67.1%585),y=170+(k*79+s.time*32)%450;ctx.moveTo(x,y);ctx.lineTo(x-2,y+9);}ctx.stroke();ctx.restore();

}
function drawCar(x,y,scale=1){paintCadillac(interludeCarTile,x,y,740*scale);}
function interludeRain(strength=1){ctx.save();ctx.strokeStyle=`rgba(177,207,232,${.12*strength})`;ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<55;i++){const x=((i*97.31-state.time*155-camX*.2)%W+W)%W,y=(i*61.7+state.time*430)%H;ctx.moveTo(x,y);ctx.lineTo(x-3,y+13);}ctx.stroke();ctx.restore();}
let interludeLastDrawStage=null;
function drawInterlude(){
 const s=state,wide=Interlude.widths[s.stage]||1800,homeCatScale=Interlude.widths.home/Prelude.widths.home;ctx.clearRect(0,0,W,H);
 if(s.mode==='interludeTitle'){rect(0,0,W,H,'#000');return;}
 if(s.stage==='end'){rect(0,0,W,H,'#000');return;}
 if(['depotDrive','depotApproach'].includes(s.stage)){drawDepotCinematic(s);return;}
 if(s.stage==='depotTitle'){
  // The night closes; exactly three days pass before the three reach Alex's door.
  rect(0,0,W,H,'#000');
  const a=Math.max(0,Math.min(1,(s.stageTime-.35)/.6,(3.4-s.stageTime)/.6));
  ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='#e8e5e7';ctx.font='bold '+Math.max(24,Math.min(62,W*.077))+'px monospace';
  ctx.fillText('3 DIAS DEPOIS',W/2,H*.46,Math.max(260,W*.93));
  ctx.fillStyle='#a4b8be';ctx.font=Math.max(12,Math.min(20,W*.023))+'px monospace';
  ctx.fillText('SETOR 47 / 06:14',W/2,H*.53,Math.max(230,W*.85));ctx.restore();return;
 }
 if(s.stage==='grief'){
  // Transition: three days pass in the city, not on a black title screen.
  // The absence remains; Neo Rockford simply replaces its public record.
  const t=s.stageTime,fade=(a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
  rect(0,0,W,H,'#0a1422');
  if(interludeCity.naturalWidth){
   // A city panorama is 3:1. Cover-fill the background so portrait phones
   // never show a huge empty sky, then retain the full street in the foreground.
   const im=interludeCity,scale=Math.max(W/im.naturalWidth,H/im.naturalHeight);
   const cw=im.naturalWidth*scale,ch=im.naturalHeight*scale;
   ctx.save();ctx.globalAlpha=.78;
   ctx.drawImage(im,(W-cw)*.5-(t/9.4)*W*.025,(H-ch)*.52,cw,ch);
   ctx.restore();
   const fw=W*1.16,fh=fw*im.naturalHeight/im.naturalWidth;
   ctx.save();ctx.globalAlpha=W<600?.45:.83;
   ctx.drawImage(im,-W*.07-(t/9.4)*W*.045,H-fh*.86,fw,fh);
   ctx.restore();
  }
  // Wet pavement and a restrained amber streetlamp. The city remains visible.
  const wet=ctx.createLinearGradient(0,H*.70,0,H);wet.addColorStop(0,'#06132200');wet.addColorStop(1,'#0c1726ba');
  ctx.fillStyle=wet;ctx.fillRect(0,H*.68,W,H*.32);
  const lx=W*.17,ly=H*.35;const lamp=ctx.createRadialGradient(lx,ly,2,lx,ly,W*.25);
  lamp.addColorStop(0,'#e8b77922');lamp.addColorStop(1,'#e8b77900');ctx.fillStyle=lamp;ctx.fillRect(0,0,W,H);
  // The public record of Alexandra remains for a moment, then advertising replaces it.
  const portrait=W<600,bw=portrait?W*.86:Math.min(W*.42,460);
  const bh=portrait?Math.min(172,H*.24):Math.max(126,Math.min(H*.28,205));
  const bx=portrait?W*.07:W-bw-Math.max(25,W*.075),by=portrait?H*.10:H*.21;
  ctx.save();ctx.globalAlpha=.96;
  rect(bx,by,bw,bh,'#101923e8');rect(bx,by,bw,3,'#c9a47a');
  rect(bx+10,by+11,bw-20,bh-22,'#152231cc');
  const ad=fade(3.3,4.5),pad=Math.max(13,bw*.06);
  ctx.save();ctx.globalAlpha=1-ad;
  ctx.textAlign='left';ctx.font=`${Math.max(10,Math.min(13,W*.012))}px monospace`;ctx.fillStyle='#b7b7bb';ctx.fillText('CORREDOR DE SERVIÇO',bx+pad,by+bh*.29);
  ctx.font=`bold ${Math.max(12,Math.min(20,W*.018))}px monospace`;ctx.fillStyle='#f0dfcf';ctx.fillText('ALEXANDRA JONLITH',bx+pad,by+bh*.50);
  ctx.font=`${Math.max(10,Math.min(13,W*.012))}px monospace`;ctx.fillStyle='#d1a8a1';ctx.fillText('MORTA · DISPAROS DE DRONES',bx+pad,by+bh*.71);ctx.restore();
  ctx.save();ctx.globalAlpha=ad;
  ctx.textAlign='left';ctx.font=`bold ${Math.max(15,Math.min(24,W*.021))}px monospace`;ctx.fillStyle='#b6ece7';ctx.fillText('NEO ROCKFORD',bx+pad,by+bh*.47);
  ctx.font=`${Math.max(10,Math.min(14,W*.012))}px monospace`;ctx.fillStyle='#c4b69e';ctx.fillText('PLANOS A PARTIR DE 29,90',bx+pad,by+bh*.67);ctx.restore();
  ctx.restore();
  // The date is part of the image. It appears once, never demands an extra click.
  const titleAlpha=Math.min(1,fade(.5,1.35),1-fade(5.0,6.2));
  ctx.save();ctx.globalAlpha=titleAlpha;ctx.textAlign='left';ctx.shadowColor='#000';ctx.shadowBlur=12;
  ctx.font=`${Math.max(12,Math.min(16,W*.016))}px monospace`;ctx.fillStyle='#f2d6b3';
  ctx.fillText('TRÊS DIAS DEPOIS',Math.max(25,W*.075),H*(portrait?.42:.30));
  ctx.font=`${Math.max(10,Math.min(12,W*.011))}px monospace`;ctx.fillStyle='#bdcbd0';
  ctx.fillText('NEO ROCKFORD · DISTRITO 07',Math.max(25,W*.075),H*(portrait?.46:.34));ctx.restore();
  // Foreground rain is physical, not a decorative black overlay.
  ctx.save();ctx.strokeStyle='rgba(190,219,236,.26)';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<86;i++){const x=((i*93.71-t*155)%W+W)%W,y=(i*67.37+t*420)%H;ctx.moveTo(x,y);ctx.lineTo(x-3,y+11);}ctx.stroke();ctx.restore();
  // Panorâmica original sem sobreposições improvisadas.
  // A quiet cut to Sierra's apartment, not a second title card.
  if(t>=6.3&&interludeHome.naturalWidth){
   const a=fade(6.3,7.9);ctx.save();ctx.globalAlpha=a;
   rect(0,0,W,H,'#0a121e');
   const hw=W*1.05,hh=hw*interludeHome.naturalHeight/interludeHome.naturalWidth;
   ctx.drawImage(interludeHome,-W*.02,H*.78-hh*.70,hw,hh);
   rect(0,0,W,H,'#08101d55');
   ctx.restore();
   ctx.save();ctx.globalAlpha=fade(7.5,8.2);ctx.textAlign='left';ctx.shadowColor='#000';ctx.shadowBlur=10;
   ctx.fillStyle='#e0c7a9';ctx.font=`${Math.max(12,Math.min(15,W*.015))}px monospace`;
   ctx.fillText('02:11 / CASA DE SIERRA',Math.max(25,W*.075),H*.79);
   ctx.restore();
  }
  if(t<.65){ctx.save();ctx.globalAlpha=1-t/.65;rect(0,0,W,H,'#000');ctx.restore();}
  return;
 }
 const seatedFrame=s.stage==='cafe'&&s.flags.seated&&s.x>640&&s.x<1020;
 // All visits to Sierra's room use the same character-to-room ratio as chapter 1.
 // The painted room is 1650 world units here versus 1200 in the prologue.
 const homeSpriteHeight=218*(Interlude.widths.home/Prelude.widths.home);
 const parkedScene=['meet','doorstep','depotApproach'].includes(s.stage);
 // Keep actors and reconstructed scenery in one camera coordinate system.
 // The previous .92 seated zoom made the room loom over the figures.
 const sceneZoom=seatedFrame?(W<480?H/1200:1.0):s.stage==='cafe'?1.0:(['home','homeEnd','morning'].includes(s.stage))?1.0:(s.stage==='depot'&&W<480)?0.88:parkedScene?0.88:1;
 const activeSeatGesture=seatedFrame&&s.gestureUntil>s.time?s.gesture:'';
 const look=activeSeatGesture==='window'?-28:activeSeatGesture==='cup'?-10:0;
 const walkingTogether=['walk','returnWalk','depotApproach','depot'].includes(s.stage),friendX=s.stage==='meet'?1120:s.stage==='doorstep'?s.jinxX:s.jinxX;
 const together=walkingTogether||s.stage==='meet'||s.stage==='doorstep'&&!s.flags.finalSaid||s.stage==='cafe';
 const depotAuraX=1071;
 const focus=s.stage==='depotApproach'?1500:s.stage==='depot'?(W<480?(s.x+s.jinxX)/2:(s.jinxX+depotAuraX)/2):seatedFrame&&activeSeatGesture==='counter'?(W<480?1250:1120):seatedFrame?(W<480?725:760):s.stage==='doorstep'&&s.flags.finalSaid?s.x-260:together?(s.x+friendX)/2:s.x;
 const target=Math.max(0,Math.min(Math.max(0,wide*sceneZoom-W),s.stage==='homeEnd'&&s.flags.cloudStarted?752-W*.50:focus*sceneZoom-W*.5+look));
 if(interludeLastDrawStage!==s.stage){
  // Establish the new shot immediately instead of dragging the previous camera
  // across a different background (visible as a jarring mobile transition).
  camX=target;
  camY=H<650?(['depot','depotApproach'].includes(s.stage)?Math.max(0,505-H*.78):800*sceneZoom-H*.74):(['depot','depotApproach'].includes(s.stage)?0:seatedFrame?(W<480?0:335):s.stage==='cafe'?340:parkedScene&&W<480?60:340);
  interludeLastDrawStage=s.stage;
 }
 camX+=(target-camX)*cameraBlend(.085);camY+=((H<650?(['depot','depotApproach'].includes(s.stage)?Math.max(0,505-H*.78):800*sceneZoom-H*.74):(['depot','depotApproach'].includes(s.stage)?0:seatedFrame?(W<480?0:335):s.stage==='cafe'?340:parkedScene&&W<480?60:340))-camY)*cameraBlend(.12);
 if(seatedFrame&&W<480){camX=target;camY=0;} // Instant two-shot: no cropped heads or black floor during seat transition.
 boundCamera(wide*sceneZoom);ctx.save();ctx.translate(-Math.round(camX),-camY);ctx.scale(sceneZoom,sceneZoom);rect(-W,0,wide+W*2,1300,'#080d17');
 if(s.stage==='depot'){
  // A real illustrated environment, not the concept-art with duplicate foreground people.
  // Unique evidence-archive set. Backstage's original art is exclusive to the club.
  // The V10 base remains available only if the new image is not loaded.
  const depotStageReady=interludeDepot.complete&&interludeDepot.naturalWidth>0;
  if(depotStageReady)ctx.drawImage(interludeDepot,0,28,wide,720);
  else if(interludeDepotFallback.complete&&interludeDepotFallback.naturalWidth)ctx.drawImage(interludeDepotFallback,0,28,wide,720);
  else rect(0,28,wide,720,'#17212a');
  // The source fallback is the same clean 16:9 composition; no legacy prop
  // overlays are added, so clue art and hotspot geometry remain one-to-one.
  // The playable trio shares the same floor plane and sprite scale.
  const baseY=505;
  // Consistent feet plane: all three actors are independent of the backdrop.
  const inspecting=!!(s.depotInspectUntil&&s.time<s.depotInspectUntil);
  drawDepotScanner(s,baseY);
  depotP25Actor('jinx',s.jinxX,baseY,s.jinxMoving,false,s.time,s.jinxFace,s.jinxFoot);
  if(!depotP25Actor('sierra',s.x,baseY,Math.abs(s.vx)>2,inspecting,s.time,s.face,s.foot)){
   if(!drawDepotSierraFallback(s,baseY))coffeeActor(s.x,baseY,s.face,s.foot,Math.abs(s.vx)>2,'sierra',false,155);
  }
  depotP25Actor('aura',depotAuraX,baseY,false,inspecting,s.time);
  // Scanner: clues remain discreet until Sierra enables the handheld scan.
  if(!s.flags.depotFinal){
   const enabled=!!s.depotScanEnabled;
   for(const [k,c] of Interlude.objects.depot.entries()){
    const cue=[{x:407,y:270},{x:669,y:376},{x:797,y:368},{x:978,y:340}][k];
    const near=Math.abs(s.x-c.x)<90,found=!!s.flags[c.id];
    const {x,y}=cue;
    ctx.save();
    // The game already requires SCAN to interrogate these objects: no baked
    // labels, bright editor circles or duplicated hotspots when SCAN is off.
    if(enabled){
     const pulse=(Math.sin(s.time*4+k*1.3)+1)*.5;
     ctx.globalAlpha=found?.38:near?1:.65;
     ctx.lineWidth=near?2:1.5;
     ctx.strokeStyle=found?'#68bbae':'#9eece5';ctx.fillStyle=ctx.strokeStyle;
     ctx.beginPath();ctx.arc(x,y,6+pulse*(near?3:1.4),0,Math.PI*2);ctx.stroke();
     ctx.beginPath();ctx.moveTo(x-16,y);ctx.lineTo(x-10,y);
     ctx.moveTo(x+10,y);ctx.lineTo(x+16,y);
     ctx.moveTo(x,y-16);ctx.lineTo(x,y-10);
     ctx.moveTo(x,y+10);ctx.lineTo(x,y+16);ctx.stroke();
     if(near){
      ctx.font='11px monospace';ctx.textAlign='center';ctx.shadowColor='#05121b';ctx.shadowBlur=7;
      const t=found?'REGISTRADO':c.name;
      const labelScreenX=x*sceneZoom-camX;
      const labelX=(Math.max(55,Math.min(W-55,labelScreenX))+camX)/sceneZoom;
      ctx.fillText(t,labelX,y-60);
     }
    }
    ctx.restore();
   }
  }

 }else if(s.stage==='depotApproach'){
  // Cinematic gate painting already contains the trio: never double-draw them.
  if(interludeGate.complete&&interludeGate.naturalWidth)
   (()=>{const iw=interludeGate.naturalWidth,ih=interludeGate.naturalHeight;const scale=Math.min(wide/iw,800/ih);const dw=iw*scale,dh=ih*scale;ctx.fillStyle='#070a13';ctx.fillRect(0,0,wide,800);ctx.drawImage(interludeGate,(wide-dw)/2,(800-dh)/2,dw,dh);})();
  else interludeBg(interludeCity,wide,.78,.77);
 }else if(s.stage==='depotDrive'){
  // Short road bridge: the Cadillac passes an industrial road sign, then cut to gate.
  interludeBg(interludeCity,wide,.78,.77);rect(0,0,wide,800,'#08101a9a');
  const roadY=630;rect(0,roadY,wide,170,'#0b1018');
  ctx.save();ctx.strokeStyle='#a5a39a55';ctx.lineWidth=5;ctx.setLineDash([48,70]);
  ctx.beginPath();ctx.moveTo(0,roadY+92);ctx.lineTo(wide,roadY+92);ctx.stroke();ctx.setLineDash([]);
  const carX=350+Math.min(440,s.stageTime*125);drawCar(carX,roadY+105,.57);
  const signX=1240;ctx.fillStyle='#465a5b';ctx.fillRect(signX,roadY-240,9,240);
  ctx.fillStyle='#152f36';ctx.fillRect(signX-125,roadY-252,275,112);
  ctx.strokeStyle='#8ab3ae';ctx.lineWidth=5;ctx.strokeRect(signX-125,roadY-252,275,112);
  ctx.textAlign='center';ctx.fillStyle='#e1ece8';ctx.font='bold 50px monospace';ctx.fillText('47',signX+12,roadY-174);
  ctx.font='18px monospace';ctx.fillText('SETOR INDUSTRIAL',signX+12,roadY-149);
  ctx.restore();
 }else if(['home','homeEnd','morning'].includes(s.stage)){
  if(interludeHome.naturalWidth){const ih=wide*interludeHome.naturalHeight/interludeHome.naturalWidth;ctx.drawImage(interludeHome,0,800-ih*(600/941),wide,ih);}rect(0,0,wide,800,'#08112618');SceneryFinish.floor(wide,800,'domestic',s.time);if(s.mode==='playing')SceneryFinish.interactionAnchor(Interlude.near(s),800,'warm',s.time);if(!(s.stage==='home'&&(s.catReactUntil||0)>s.time))drawCat(250,790,homeCatScale);
  // A physical terminal rests on the existing desk in both visits home.
  const homeTerm=(s.stage==='homeEnd'&&(s.magentaPulse>0||s.flags.cloudStarted))?interludeTerminalOn:interludeTerminalOff;
  if(homeTerm.complete&&homeTerm.naturalWidth){
   const tw=76,th=57;
   ctx.save();
   if(s.stage==='homeEnd'&&s.magentaPulse>0){ctx.shadowColor='#ff58c8';ctx.shadowBlur=10;}
   ctx.drawImage(homeTerm,658,551,tw,th);
   ctx.restore();
  }else{rect(665,558,70,48,'#151b22');rect(669,562,62,37,'#080e17');rect(661,606,80,4,'#3d4850');}
  if(s.stage==='homeEnd'&&s.flags.cloudStarted&&!s.flags.sleeping){
   // A call on the existing desk monitor, not a giant floating avatar.
   // Keep the conversation personal and the room visually grounded.
   ctx.save();ctx.fillStyle='#bdebd7';ctx.font='10px monospace';ctx.textAlign='left';
   ctx.fillText('AURA / VOZ',668,551);
   rect(669,562,62,37,'#111e2a');
   const bars=[6,14,9,20,11,16,7,12];
   for(let i=0;i<bars.length;i++){
    const h=4+Math.max(2,bars[i]+Math.sin(s.time*2.5+i)*3);
    rect(673+i*7,581-h/2,3,h,i%3===0?'#e9a9d9':'#8ce5d9');
   }
   ctx.restore();
   // Consent-gated, restrained projection: intimate presence, not a giant avatar.
   if(s.flags.cloudConnection==='body'&&s.mode==='interludeDialogue'&&s.dialogue==='auraCloud'){
    const intimate=s.flags.cloudConsent==='intimate';
    const pulse=.58+.13*Math.sin(s.time*(intimate?2.1:1.5));
    ctx.save();ctx.globalAlpha=pulse;
    ctx.shadowColor=intimate?'#ef71c5':'#b278d9';ctx.shadowBlur=intimate?23:11;
    const pw=128,ph=192,px=770,py=352+Math.sin(s.time*1.2)*2;
    if(virtualAura.complete&&virtualAura.naturalWidth)ctx.drawImage(virtualAura,px,py,pw,ph);
    else {rect(px,py,pw,ph,'#684e85');}
    ctx.shadowBlur=0;
    ctx.strokeStyle='#e1a9f0';ctx.lineWidth=1;ctx.strokeRect(px-3,py-3,pw+6,ph+6);
    ctx.globalAlpha=.18;for(let j=0;j<9;j++)rect(px,py+j*23+((s.time*7)%9),pw,1,'#f4c8e7');
    ctx.restore();
   }
  }


 }else if(s.stage==='walk'||s.stage==='returnWalk'){
  // The old district background contains a crowd baked into the painting.
  // The existing empty city asset is the deliberate nighttime replacement.
  interludeBg(interludeCity,wide,.79,.86,s.stage==='walk');rect(0,0,wide,800,'#06102024');
  // A arte original já contém a rua. Não sobrepor vitrines e placas geométricas.
  // The empty street is deliberate after Alexandra's death.
 }else if(s.stage==='cafe'){if(seatedFrame&&!coffeeSceneV105Ready()&&coffeeSeatedReady){ctx.drawImage(coffeeSeatedImage,0,0,wide,1200);if(Number.isFinite(s.lightsDownAt)){ctx.save();ctx.globalAlpha=Math.min(.16,Math.max(0,s.time-s.lightsDownAt)*.045);rect(0,0,wide,1200,'#090c19');ctx.restore();}}else drawCafe(s,wide);}
 else if(s.stage==='doorstep'||s.stage==='meet'){
  interludeBg(interludeCity,wide,.78,.77);rect(0,0,wide,800,'#060b1750');
  // Fachada existente da pintura; não desenhar portas artificiais sobre ela.
  // The same curb, position and tire baseline on arrival and after the walk.
  drawCar(s.stage==='doorstep'?s.carX:940,800,1);
  if(s.stage==='meet')coffeeActor(1120,800,1,0,false,'jinx');
  else if(!s.flags.finalSaid||s.departurePhase==='embrace'||s.departurePhase==='walkToCar')
   coffeeActor(s.jinxX,800,s.jinxFace,s.jinxFoot,!!s.jinxMoving,'jinx');
 }
 if(['home','cafe'].includes(s.stage)&&!(s.stage==='cafe'&&seatedFrame))window.ScenePropsP61?.draw('interlude',s);
 if(s.stage==='walk'||s.stage==='returnWalk'){
  const active=s.mode==='paused'?s.resumeMode:s.mode;
  coffeeActor(s.jinxX,800,s.jinxFace,s.jinxFoot,active==='playing'&&s.jinxMoving,'jinx');
 }
 if(s.stage==='cafe'&&seatedFrame){
  if(coffeeSceneV105Ready()||!coffeeSeatedReady){
   coffeeTableActor('jinx',s.gestureActor==='jinx'&&activeSeatGesture?s.gesture:'');coffeeTableActor('sierra',s.gestureActor==='sierra'&&activeSeatGesture?s.gesture:'');
   coffeeDrawTableOcclusionV105(wide);
  }
  // Only the tabletop and its narrow pedestal occlude the figures. Keep the
  // knees, shoes and chair seats visible instead of repainting a solid rectangle.
  // The table is already painted into the café. Repaint only its near edge as
  // an occlusion mask: arms remain behind the tabletop and legs stay visible.
  // No arbitrary painted strip: the original table is part of the background.
  // Seated actor silhouettes are registered to the existing chairs and floor.
  // A mesa real já está pintada no fundo. Não adicionar objetos desenhados.
 }else{
  if(s.stage==='cafe'){
   ctx.save();ctx.translate(Math.round(s.jinxX),800);ctx.scale(1,1);coffeeActor(0,0,s.jinxFace||1,s.jinxFoot||0,!!s.jinxMoving&&Math.abs(s.vx)>2,'jinx',false,342);ctx.restore();
   ctx.save();ctx.translate(s.x,800);ctx.scale(1,1);coffeeActor(0,0,s.face,s.foot,Math.abs(s.vx)>2,'sierra',false,294);ctx.restore();
  }else if(s.stage==='homeEnd'&&s.flags.sleeping&&sierraSleepPose.complete&&sierraSleepPose.naturalWidth){
   // Single original seated sprite, soles grounded at y=800. The former
   // composite asset contained TWO superimposed Sierras and fake desk legs.
   ctx.save();ctx.imageSmoothingEnabled=true;
   const breathing=Math.sin(s.time*1.1)*.35;
   const sleepScale=Math.min(218/sierraSleepPose.naturalWidth,275/sierraSleepPose.naturalHeight),sleepW=sierraSleepPose.naturalWidth*sleepScale,sleepH=sierraSleepPose.naturalHeight*sleepScale;
   ctx.drawImage(sierraSleepPose,727-sleepW/2,800-sleepH+breathing,sleepW,sleepH);
   ctx.restore();
  }else if(s.stage==='home'&&(s.catReactUntil||0)>s.time&&sierraPetting.complete&&sierraPetting.naturalWidth){
   ctx.save();ctx.imageSmoothingEnabled=true;
   ctx.translate(225,800);
   const seated=ghostSierraTiles[0];if(seated){const h=183*(Interlude.widths.home/Prelude.widths.home),w=h*seated.w/seated.h;ctx.drawImage(seated.im,seated.x,seated.y,seated.w,seated.h,-w/2,-h,w,h);}else {const scale=Interlude.widths.home/Prelude.widths.home;ctx.drawImage(sierraPetting,-70*scale,-191*scale,130*scale,191*scale);}ctx.restore();
   drawCat(250,790,homeCatScale);
  }else if(!['depot','depotApproach'].includes(s.stage)&&!(s.stage==='homeEnd'&&s.flags.sleeping))coffeeActor(s.x,s.y,s.face,s.foot,Math.abs(s.vx)>2,'sierra',false,['home','homeEnd','morning'].includes(s.stage)?homeSpriteHeight:null);
 }
 const o=Interlude.near(s);
 if(o&&s.mode==='playing'&&s.stage!=='doorstep'&&!(s.stage==='cafe'&&s.flags.seated&&s.x>640&&s.x<1020)){
  const ay=['home','homeEnd','morning'].includes(s.stage)?640:655;if(s.stage!=='depot'){actionHalo(o.x,ay);label(o.name,o.x,ay-25,'#f0d29e',12);}
 }
 ctx.restore();
 if(s.stage==='depot') {drawDepotResolve(s);}
 updateDepotFinalMobile(s);
 if(['walk','returnWalk','doorstep'].includes(s.stage))interludeRain(s.stage==='doorstep'&&s.flags.finalSaid?1.15:s.stage==='returnWalk'?.65:.85);
 // P56: the goodbye ends in rain, not an explanatory text overlay.
 if(s.auraPulse>0)drawInterludePulse();
 // Short editorial cuts: road -> 47 gate -> playable room. No long dissolve.
 if(['depotDrive','depotApproach','depot'].includes(s.stage)){
  const elapsed=s.stageTime;
  let black=0;
  if(s.stage==='depotDrive')black=Math.max(Math.max(0,1-elapsed/.30),Math.max(0,(elapsed-3.48)/.32));
  else if(s.stage==='depotApproach')black=Math.max(Math.max(0,1-elapsed/.34),Math.max(0,(elapsed-3.28)/.32));
  else black=Math.max(0,1-elapsed/.42);
  if(black>0){ctx.save();ctx.globalAlpha=Math.min(1,black);rect(0,0,W,H,'#000');ctx.restore();}
 }
 if(s.stage==='homeEnd'&&s.endFade){ctx.save();ctx.globalAlpha=Math.min(1,s.endFade/2.1);rect(0,0,W,H,'#000');ctx.restore();}
}

// Final is DOM-rendered; the canvas hook stays intentionally empty.
function drawDepotResolve(s){ /* Rendered by updateDepotFinalMobile only. */ }

// Preload the original P43 half-face crops actually shown in the four-shot
// ending. Loading different full portraits here left the real ending art cold
// until its first frame, risking a blank face on slow connections.
const depotFinalArt=Object.create(null);
function preloadDepotFinalArt(){
 for(const id of ['sierra','jinx','aura']){
  if(depotFinalArt[id])continue;
  const portrait=new Image();portrait.decoding='async';portrait.src='depot-final-half-face-'+id+'.png';
  depotFinalArt[id]=portrait;
 }
}
// The DOM layer is viewport-relative, so the dialogue is readable on mobile.
let depotFinalMobileLayer=null;
function updateDepotFinalMobile(s){
 const active=s.stage==='depot'&&s.flags.depotFinal&&s.mode==='interludeCinematic';
 if(!active){if(depotFinalMobileLayer){depotFinalMobileLayer.remove();depotFinalMobileLayer=null;}return;}
 if(!depotFinalMobileLayer){
  depotFinalMobileLayer=document.createElement('section');
  depotFinalMobileLayer.className='depot-final-p38';
  depotFinalMobileLayer.setAttribute('aria-label','Encerramento do Depósito 47');
  depotFinalMobileLayer.innerHTML='<div class="depot-final-p38-backdrop" aria-hidden="true"></div><img class="depot-final-p38-face" alt=""><div class="depot-final-p38-caption" aria-live="polite"><div class="depot-final-p38-name"></div><p class="depot-final-p38-line"></p></div>';
  $('game').appendChild(depotFinalMobileLayer);
 }
 const t=s.time-s.flags.depotResolveAt;
 // Encerramento canônico da demo: investigação encontrada no Depósito 47.
 // The evidence establishes the sequence of authorizations, not the
 // identity or intent of the person who issued them. Preserve that distinction.
 const beats=[
  {from:.25,to:4.25,id:'sierra',who:'SIERRA',line:'Ela descobriu demais.'},
  {from:4.25,to:8.25,id:'jinx',who:'JINX',line:'E pagou o preço por isso.'},
  {from:8.25,to:12.25,id:'aura',who:'AURA',line:'Eles acham que acabou.'},
  {from:12.25,to:16.5,id:'sierra',who:'SIERRA',line:'Então vamos mostrar como começa.'}
 ];
 const beat=beats.find(b=>t>=b.from&&t<b.to);
 depotFinalMobileLayer.classList.toggle('depot-final-p38-black',!beat);
 const current=beat?.id||'black';
 if(depotFinalMobileLayer.dataset.shot!==current){depotFinalMobileLayer.dataset.shot=current;depotFinalMobileLayer.classList.remove('p46-shot-enter');void depotFinalMobileLayer.offsetWidth;depotFinalMobileLayer.classList.add('p46-shot-enter');}
 depotFinalMobileLayer.style.setProperty('--p46-shot-progress',String(Math.max(0,Math.min(1,beat?(t-beat.from)/(beat.to-beat.from):0))));
 if(!beat)return;
 const face=depotFinalMobileLayer.querySelector('img');
 const src='depot-final-half-face-'+beat.id+'.png';
 if(face.dataset.finalId!==beat.id){
  face.dataset.finalId=beat.id;
  face.onerror=()=>{face.onerror=null;face.setAttribute('src','depot-p43-final-'+beat.id+'.png');};
  face.setAttribute('src',src);
 }
 face.alt='Retrato de '+beat.who+' no Depósito 47';
 depotFinalMobileLayer.querySelector('.depot-final-p38-name').textContent=beat.who;
 depotFinalMobileLayer.querySelector('.depot-final-p38-line').textContent=beat.line;
}

function drawDepotEvidence(s){
 if(s.mode!=='playing'||!s.depotInspectUntil||s.time>=s.depotInspectUntil)return;
 ctx.save();ctx.globalAlpha=.48;ctx.fillStyle='#91dcd2';ctx.fillRect(W*.48,H*.11,W*.04,2);ctx.restore();
}

function updateDepotJourneyCaption(){
 let el=document.getElementById('depotJourneyCaption');
 const show=state.chapter===8&&state.stage==='depotDrive'&&state.stageTime>1.1&&state.stageTime<7.2;
 if(!show){el?.remove();return;}
 if(!el){el=document.createElement('div');el.id='depotJourneyCaption';el.className='depot-journey-caption';el.innerHTML='<strong>JINX</strong><p>Acho que é aqui.</p>';$('game').appendChild(el);ownChapterUI('depotJourneyCaption');}
}
function interludeObjective(){const s=state;if(['grief','end','depotDrive','depotTitle','depotApproach','depot','morning'].includes(s.stage))return '';if(s.stage==='home')return s.flags.honk?'Jinx está lá embaixo':s.flags.message?'Nova mensagem no terminal · quando quiser':'Uma noite sem dormir';if(s.stage==='meet')return '02:13 / Cadillac estacionado';if(s.stage==='walk')return 'Caminhe até o café';if(s.stage==='cafe')return !s.flags.ordered?'Fale com o atendente':!s.flags.seated&&!s.flags.cafe3?'Sente perto da janela':s.flags.cafe3?'Saia quando quiser':'À mesa';if(s.stage==='returnWalk')return 'Volte para casa';if(s.stage==='doorstep')return s.flags.finalSaid?(s.departurePhase==='rain'?'Sierra fica na chuva, antes de subir':'A despedida de Jinx'):'';if(s.stage==='homeEnd'&&s.flags.sleeping)return '';if(s.stage==='homeEnd')return s.flags.cloudStarted?(s.flags.cloudConnection==='body'?(s.flags.cloudConsent==='intimate'?'AURA / CANAL PRIVADO':'AURA / PONTE SENSORIAL'):'AURA / CHAMADA DE VOZ'):'Volte ao terminal';return '';}
function interludeClock(){return state.stage==='grief'?'TRÊS DIAS DEPOIS':['depot','depotApproach','depotTitle'].includes(state.stage)?'TRÊS DIAS DEPOIS / SETOR 47':state.stage==='morning'?'08:12 / CASA DE SIERRA':'02:'+String(state.minute||11).padStart(2,'0')+' / '+({home:'CASA',meet:'CADILLAC ESTACIONADO',walk:'DISTRITO 07',cafe:'CAFETERIA',returnWalk:'DISTRITO 07',doorstep:'CASA',homeEnd:'CASA',depot:'DEPÓSITO 47',end:''}[state.stage]||'');}
function updateInterludeUI(){const s=state;

 updateDepotJourneyCaption();$('interludeSkip').classList.toggle('hidden', !(s.stage==='grief'&&s.mode==='interludeCinematic'));$('game').dataset.interludeSeated=(s.stage==='cafe'&&s.flags.seated)?'true':'false';$('game').classList.toggle('interlude-depot-explore',s.stage==='depot'&&s.mode==='playing');$('game').classList.toggle('interlude-cinematic',['grief','depotTitle','depotDrive','depotApproach','depot','end'].includes(s.stage)&&s.mode==='interludeCinematic');if(sound)interludeAmbience();$('identityLabel').textContent='SIERRA / CORE';$('missionChapter').textContent=['depot','depotApproach','depotTitle','depotDrive','morning','end'].includes(s.stage)?'EPÍLOGO / PROTOCOLO 47':'INTERLÚDIO / CAFÉ ÀS 02:17';$('health').textContent='▰ ▰ ▰';$('energy').style.width=state.energy+'%';$('clues').textContent=interludeClock();$('objective').textContent=interludeObjective();$('alert').style.display='none';$('game').classList.toggle('interlude-final-focus',s.stage==='doorstep'&&s.flags.finalStarted&&!s.flags.finalSaid);$('game').classList.toggle('interlude-sensory',s.stage==='homeEnd'&&s.flags.cloudConnection==='body');$('game').classList.toggle('interlude-private',s.stage==='homeEnd'&&s.flags.cloudConnection==='body'&&s.flags.cloudConsent==='intimate');
 const o=Interlude.near(s);let hint='';if(o&&s.mode==='playing'){
  if(s.stage==='cafe'&&o.id==='table'&&!s.flags.ordered)hint='Fale com o atendente primeiro.';
  else if(s.stage==='cafe'&&o.id==='exit'&&!s.flags.cafe3)hint='Ainda há algo para dizer.';
  else if(s.stage==='doorstep'&&!s.flags.finalSaid)hint='';
  else if(s.stage==='cafe'&&s.flags.resting)hint='E / USAR · LEVANTAR';
  else if(s.stage==='depot')hint=(!s.depotScanEnabled?'Q / SCAN · ATIVAR SCANNER': 'E · '+(o.id==='depotTerminal'&&['depotBoard','depotArchive','depotTape','depotTerminal'].every(id=>s.flags[id])?'COMPARAR REGISTROS':'EXAMINAR'));
  else hint='E / USAR · '+o.name;
 }
 if(s.stage==='depot'&&s.mode==='playing'&&!hint)hint=s.depotScanEnabled?'SCANNER ON · APROXIME-SE DAS MARCAS':'Q / SCAN · LIGAR';$('hint').textContent=hint;$('hint').style.display=hint?'block':'none';$('game').classList.toggle('interlude-talking',['interludeDialogue','interludeSilence'].includes(s.mode));if(s.mode==='playing'&&performance.now()>radioUntil)$('radio').style.display='none';
}
function renderInterludeDialogue(){
 clearControl();$('radio').style.display='none';const line=state.dialogueLines?.[state.lineIndex];if(!line)return;
 const box=$('interludeDialogue'),iconic=state.dialogue==='final',grief=state.dialogue==='grief';box.classList.remove('hidden','interlude-rest');box.classList.toggle('interlude-final-dialogue',iconic);box.classList.toggle('interlude-grief-dialogue',grief);
 const portrait=line.who==='SIERRA'?'sierra':line.who==='JINX'?'jinx':line.who?.startsWith('AURA')?'aura':null;
 const safe=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 box.innerHTML=(portrait?'<div class="interlude-portrait '+portrait+'" data-emotion="'+safe(line.emotion||'neutral')+'" aria-hidden="true"></div>':'')+
 '<div class="club-dialogue-top"><span>'+safe(line.who)+'</span><small>'+safe(interludeClock())+'</small></div>'+
 (line.aside?'<p class="club-aside">'+safe(line.aside)+'</p>':'')+
 (line.text==='...'?'':'<p class="club-line">'+safe(window.DialogueDirector?.line(line.text,state,state.dialogue+':'+state.lineIndex)??line.text).replaceAll('\n','<br>')+'</p>')+
 (line.choices?'<div class="club-choices">'+line.choices.map((c,i)=>'<button class="interlude-choice" data-choice="'+i+'"><span>'+(i+1)+'</span>'+safe(c.label)+'</button>').join('')+'</div>':'<button class="club-next" id="interludeNext">'+(grief?'CONTINUAR':'CONTINUAR')+'</button>')+
 '<p class="club-help">'+(line.choices?'1–'+line.choices.length+' · Escolher':'E / Enter · Continuar')+'</p>';
 if(line.choices)for(const b of box.querySelectorAll('.interlude-choice'))b.onclick=()=>{Interlude.advance(state,Number(b.dataset.choice));interludeAfterDialogue();};
 else $('interludeNext').onclick=()=>{Interlude.advance(state);interludeAfterDialogue();};
 // While the bodily bridge is active, Sierra can cut the sensory channel
 // instantly without ending the conversation or being forced through intimate lines.
 if(state.dialogue==='auraCloud'&&state.flags.cloudConnection==='body'){
  const cut=document.createElement('button');cut.type='button';cut.id='interludeCutBody';
  cut.className='interlude-cut-body';cut.textContent='DESLIGAR CONTATO · MANTER A VOZ';
  cut.setAttribute('aria-label','Desligar contato sensorial e continuar conversando com Aura');
  cut.onclick=()=>{
   if(state.dialogue!=='auraCloud'||state.flags.cloudConnection!=='body')return;
   state.flags.cloudConnection='voice';state.flags.cloudConsent='voice-only';state.flags.cloudStopped=true;if(!state.flags.cloudIntimacyCompleted)state.flags.cloudSex=false;
   const idx=state.dialogueLines.findIndex((x,i)=>i>=state.lineIndex&&x.text==='Antes de desligar: aquela segunda frequência… você reconheceu?');
   const end=idx<0?state.dialogueLines.length:idx;
   state.dialogueLines.splice(state.lineIndex,Math.max(0,end-state.lineIndex),
    {who:'SIERRA',text:'Desliga a ponte. Quero continuar ouvindo você.'},
    {who:'AURA',text:'Desliguei. Só minha voz, Si. Estou aqui.'});
   renderInterludeDialogue();
  };
  box.appendChild(cut);
 }
 box.scrollTop=0;ownChapterUI('interludeDialogue');window.DialogueDirector?.attach(box,state);
}
function skipInterludeMontage(){
 if(state.chapter!==8||state.stage!=='grief'||state.mode!=='interludeCinematic')return;
 Interlude.change(state,'home',180);state.mode='playing';interludeEvents();updateUI();
}
$('interludeSkip').onclick=skipInterludeMontage;
function interludeAfterDialogue(){if(state.mode!=='interludeDialogue'){$('interludeDialogue').classList.add('hidden');$('interludeDialogue').classList.remove('interlude-final-dialogue','interlude-grief-dialogue');clearControl();}interludeEvents();}
function interludeEnding(){
 stopChapterAudio();$('interludeDialogue').classList.add('hidden');$('radio').style.display='none';$('hint').style.display='none';
 // Remove the full-screen portrait layer BEFORE displaying the end title.
 // It previously lived on <body> with a near-maximum z-index, hiding the card.
 if(depotFinalMobileLayer){depotFinalMobileLayer.remove();depotFinalMobileLayer=null;}
 document.querySelectorAll('body > .depot-final-p38, #game > .depot-final-p38').forEach(el=>el.remove());
 document.getElementById('interludeCurtain')?.remove();
 $('game').classList.add('interlude-ended');
 const actions=document.createElement('div');actions.id='interludeCurtain';actions.classList.add('memorial-actions');
 actions.innerHTML='<p class="demo-final-title">FIM DA DEMO</p><p class="demo-final-question">As ordens ficaram registradas. Quem assinou?</p><div class="demo-final-actions"><button id="interludeCase">REVER O CASO</button> <button id="interludeReplay">REVISITAR</button> <button id="interludeMenu">MENU</button></div>';$('game').appendChild(actions);$('interludeCase').onclick=()=>document.getElementById('rc37LogToggle')?.click();$('interludeReplay').onclick=openInterlude;$('interludeMenu').onclick=showChapterMenu;/* A demo termina no Depósito 47. A pergunta reaproveita a evidência existente; não antecipa a história posterior. */
}
function interludeRest(){
 const box=$('interludeDialogue');box.classList.remove('hidden');box.classList.add('interlude-rest');box.innerHTML='<button id="interludeStayCup">GIRAR A XÍCARA</button><button id="interludeStayCounter">OLHAR O BALCÃO</button><button id="interludeStayWindow">OLHAR A RUA</button><button id="interludeStand">LEVANTAR</button>';
 $('interludeStayCup').onclick=()=>{state.gesture='cup';state.gestureActor='sierra';state.gestureUntil=state.time+1.6;beep(740,.035,'sine',.004);};
 $('interludeStayCounter').onclick=()=>{state.gesture='counter';state.gestureActor='jinx';state.gestureUntil=state.time+2.2;radio('CENA','O atendente empilha as últimas xícaras. A máquina pinga mais uma vez.',3.2);};
 $('interludeStayWindow').onclick=()=>{state.gesture='window';state.gestureActor='sierra';state.gestureUntil=state.time+2;};
 $('interludeStand').onclick=()=>{Interlude.stand(state);interludeEvents();};ownChapterUI('interludeDialogue');
}
function interludeEvents(){for(const e of state.events.splice(0)){
 if(e.type==='quiet'){clearControl();$('interludeDialogue').classList.add('hidden');}
 if(e.type==='dialogue')renderInterludeDialogue();
 if(e.type==='ambientLine')radio(e.speaker||'CENA',e.text||'',e.duration||2.2);
 if(e.type==='transition'){
   if(state.stage==='end')stopChapterAudio();
   $('interludeDialogue').classList.remove('interlude-rest');clearControl();camX=Math.max(0,Math.min(Math.max(0,Interlude.widths[state.stage]-W),state.x-W*.43));camY=340;$('radio').style.display='none';$('interludeDialogue').classList.add('hidden');
   $('game').classList.toggle('interlude-cinematic',['depotTitle','depotApproach','depot','end'].includes(state.stage));$('interludeSkip').classList.add('hidden');
   // Chapter 8 already begins with a timed three-day scene and an in-world call.
   // Another forced introduction repeated Jinx's invitation before it happened.
  }
 if(e.type==='honk'){beep(180,.16,'square',.018);radio('RUA / UMA BUZINA','O Cadillac está sob a janela.',3);}
 if(e.type==='meet')radio('JINX','Café.',2);
 if(e.type==='terminal')radio('TERMINAL / AURA','Três mensagens. Três dias sem resposta.',4);if(e.type==='messageWaiting')radio('TERMINAL','Jinx deixou uma mensagem. Leia quando quiser.',3);
 if(e.type==='record')radio('REGISTRO LOCAL / DRONES','Escotilha aberta. Dois drones. Alexandra no chão. Sierra fecha o registro.',5);
 if(e.type==='rest')interludeRest();
 if(e.type==='stand'){$('interludeDialogue').classList.add('hidden');$('interludeDialogue').classList.remove('interlude-rest');clearControl();}
 if(e.type==='self')radio('SIERRA',e.text,3);
 if(e.type==='depotOpen'){$('radio').style.display='none';}
 if(e.type==='depotInspect'){$('radio').style.display='none';}
 if(e.type==='depotSting'){stopChapterAudio();beep(93,.12,'sawtooth',.028);}
 if(e.type==='homeReturn')$('radio').style.display='none';if(e.type==='farewell'){$('radio').style.display='none';}
 if(e.type==='cloudSleep'){$('interludeDialogue').classList.add('hidden');clearControl();$('radio').style.display='none';}
 if(e.type==='ending')interludeEnding();
}}
qaListen(window,'keydown',e=>{if(e.target?.closest?.('.dialogue-auto'))return;if(['Enter','Space'].includes(e.code)&&e.target?.closest?.('.rc36-toggle'))return;
 if(state.chapter===8&&state.stage==='grief'&&state.mode==='interludeCinematic'&&!e.repeat&&['KeyE','Enter','Space'].includes(e.code)){
  e.preventDefault();e.stopImmediatePropagation();skipInterludeMontage();return;
 }
 if(state.chapter!==8||state.mode==='paused'||state.mode!=='interludeDialogue'||e.repeat)return;
 // Keep the emergency sensory cutoff keyboard-operable; it must never advance dialogue instead.
 if(['Enter','Space'].includes(e.code)&&e.target?.closest?.('#interludeCutBody'))return;
 const line=state.dialogueLines?.[state.lineIndex];if(!line)return;
 if(line.choices&&['Enter','Space'].includes(e.code)){
  const selected=e.target?.closest?.('#interludeDialogue .interlude-choice');
  if(selected){e.preventDefault();e.stopImmediatePropagation();selected.click();return;}
 }
 if(line.choices&&['Digit1','Digit2','Digit3','Digit4'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();const n=Number(e.code.slice(-1))-1;const b=$('interludeDialogue')?.querySelector('[data-choice="'+n+'"]');b?.click();return;}
 if(!line.choices&&['KeyE','Enter','Space'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();$('interludeNext')?.click();}
},true);
interludeReady();

function drawInterludeCityLife(t,w,h){
 // Night shift, traffic and an ordinary advert keep moving through the title.
 ctx.save();ctx.globalAlpha=.72;
 for(let n=0;n<4;n++){const x=((t*(16+n*5)+n*w*.32)%(w+90))-45,y=h*(.77+n*.035);rect(x,y,31,6,'#263543');rect(x+24,y+2,9,2,'#e5bb86');rect(x-5,y+3,3,2,'#bc615e');rect(x-2,y+10,37,1,'#e8ab6a33');}
 citizen({x:w*.20+t*3,h:Math.max(40,h*.075),sprite:4,face:1},h*.79,false);
 citizen({x:w*.72-t*2,h:Math.max(36,h*.067),sprite:0,face:-1},h*.81,false);
 ctx.restore();
}
function drawInterludeStreetLife(s,wide){
 // The painted street already contains shutters, signs, windows and reflections.
 // Never paste geometric boxes or fake signage over the authored environment.
 // Subtle rain is composited in screen space by interludeRain().
}

function drawInterludePulse(){
 // One second of an unsolicited visual-channel connection, with no location or pursuit.
 // There is no explanation of INSTANCE 02 in this scene.
 ctx.save();ctx.globalAlpha=.045;rect(0,0,W,H,'#eb56b7');ctx.restore();
 const y=H*.19,bw=Math.min(W-28,420),x=(W-bw)/2;
 rect(x,y,bw,45,'#110d20eb');rect(x,y,3,45,'#e46bb2');
 label('AURA / SINAL DETECTADO',W/2,y+18,'#f6b9df',W<500?9:12);
 label('00:00:01 · ORIGEM INDEFINIDA',W/2,y+34,'#b492b2',W<500?9:11);
 // The narrow displacement belongs to Sierra's eye, not an explosion or jump scare.
 ctx.save();ctx.globalAlpha=.15;rect(W*.19,H*.44,W*.57,1,'#ed79c5');ctx.restore();
}

function drawInterludeTableDetails(s){
 // Furniture, cups and table are already painted in cafe-0217.png.
 // No crude ellipses or rectangles over the detailed original artwork.
}

