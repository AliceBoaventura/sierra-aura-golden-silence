'use strict';
const relayBg=new Image();let relayLoaded=false,relayFailed=false;
function uprisingReady(){const b=$('chapterThree');if(!b)return;b.disabled=!(relayLoaded&&aptLoaded&&auraLoaded&&ready);if(relayFailed){b.disabled=false;b.textContent='RECARREGAR CAPÍTULO 03';b.onclick=()=>location.reload();}else b.onclick=beginUprising;}
relayBg.onload=()=>{relayLoaded=true;uprisingReady();};relayBg.onerror=()=>{relayFailed=true;uprisingReady();};relayBg.src='relay-corridor.png';
function clearControl(){resetInput();}
function beginUprising(){StoryContinuity.capture(state);$('game').classList.remove('cinematic');$('prologueUI').classList.add('hidden');$('conversationBox').classList.add('hidden');if(typeof leaveTerrace==='function')leaveTerrace();if(!relayLoaded||!aptLoaded||!auraLoaded||!ready){showPanel('Carregando<br><em>o enlace.</em>','Aguarde o carregamento da arte para iniciar.','TENTAR NOVAMENTE',beginUprising);return;}state=Uprising.create();state.flags.talked=true;state.flags.memory=true;state.flags.upgraded=true;state.flags.linkCompleted=true;Uprising.startRelay(state);clearControl();camX=0;camY=365;$('overlay').classList.remove('encounter','hacking','neural-reciprocity-open');$('overlay').classList.add('hidden');$('pause').textContent='Ⅱ';radio('AURA / ENLACE','Consigo ver pela sua lente. Vá ao primeiro terminal e use INTERAGIR. Eu isolo o sinal para a ronda não seguir você.',9);updateUI();window.SceneDirector?.enter(3);}
function drawAuraAt(x,y,face=-1,walking=false,foot=0){if(!auraLoaded)return;const h=state.chapter===4?122:216,w=h*590/1505;
 const emotion=state.chapter===7&&state.stage==='aftermath'?'grief':state.mode==='dialogue'?'tension':'';
 const pose=window.NeoActors?.frame('aura',walking,foot,emotion);
 ctx.save();ctx.translate(x,y);ctx.shadowColor='#ee80cc';ctx.shadowBlur=5;
 // Aura's walking drawings face right; her standing drawings face left.
 const movingRightArt=(pose===2||pose===3||(pose>=20&&pose<=23));
 const stageFace=face<0?-1:1;
 ctx.save();ctx.scale(movingRightArt?stageFace:-stageFace,1);
 const drawn=window.NeoActors?.draw('aura',pose,h);ctx.restore();
 if(!drawn){ctx.scale(-face,1);ctx.drawImage(auraSprite,260,12,590,1505,-w/2,-h,w,h);}ctx.restore();}
function drawUprising(){ctx.clearRect(0,0,W,H);const lab=state.stage==='lab',worldWidth=lab?2600:3200;const target=Math.max(0,Math.min(worldWidth-W,state.x-W*.4));camX+=(target-camX)*cameraBlend(.09);camY+=((H<650?Math.max(205,state.y-H*.74):Math.max(205,Math.min(390,state.y-H*.67)))-camY)*cameraBlend(.05);boundCamera(worldWidth);ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY));rect(0,0,worldWidth,1150,'#080f20');if(lab&&aptLoaded)ctx.drawImage(apartmentBg,0,260,2600,867);if(!lab&&relayLoaded)ctx.drawImage(relayBg,0,155,3200,1067);SceneryFinish.practical(lab?'lab':'relay',state.time);SceneryFinish.service(worldWidth,lab?'interior':'relay',state.time);if(state.mode==='playing')SceneryFinish.interactionAnchor(Uprising.near(state),800,'cool',state.time);
if(lab){window.ScenePropsP61?.draw('uprising',state);drawAuraAt(2190,800,state.x<2190?-1:1);label('AURA',2190,560,'#fab6d9',14);for(const o of [{x:1580,t:'RELÉ / SAÍDA',on:state.flags.upgraded},{x:1900,t:'ARQUIVO DE KEANE',on:state.flags.memory},{x:2390,t:state.flags.upgraded?'ENLACE PRONTO':'BANCADA ÓPTICA',on:state.flags.upgraded}]){if(Math.abs(state.x-o.x)<135||state.scan)label(o.t,o.x,555,o.on?'#7bf5d2':'#e2b879',13);if(Math.abs(state.x-o.x)<135)actionHalo(o.x,610);}if(state.flags.upgraded){ctx.strokeStyle='#7df5e766';ctx.setLineDash([4,8]);ctx.beginPath();ctx.moveTo(state.x,state.y-95);ctx.lineTo(2190,718);ctx.stroke();ctx.setLineDash([]);}}
else{Uprising.platforms.forEach(platform);for(let k=0;k<3;k++){const gate=[1130,2120,2930][k];if(!state.nodes[k].found){ctx.globalAlpha=.45+.2*Math.sin(state.time*3);rect(gate,560,5,240,'#f178cc');ctx.globalAlpha=1;label('BLOQUEIO '+(k+1),gate,545,'#ed9dd1',12);}}
state.nodes.forEach((n,k)=>{const col=n.found?'#78ffd0':n.revealed?'#76faff':'#e2a4d8';label((n.found?'✓ ':String(k+1).padStart(2,'0')+' / ')+n.name,n.x,648,col,14);if(!window.ConsoleArt?.draw(ctx,n.x,800,{kind:'relay',status:n.found?'active':n.revealed?'mapped':'idle',scan:state.scan})){ctx.strokeStyle=col;ctx.lineWidth=2;ctx.strokeRect(n.x-22,700,44,56);rect(n.x-15,710,30,25,n.found?'#37b69b77':'#74478f55');}if(state.scan||n.revealed||Math.abs(state.x-n.x)<150){label(n.found?'ISOLADO':'E / ISOLAR',n.x,674,col,12);rect(n.x-30,770,60,4,'#172b43');rect(n.x-30,770,60*Math.min(1,n.progress/.9),4,col);}});
for(const d of Uprising.drones(state)){if(!d.disabled){const grad=ctx.createLinearGradient(d.x,d.y,d.x,800);grad.addColorStop(0,'#ed4e9e45');grad.addColorStop(1,'#ed4e9e04');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(d.x,d.y+10);ctx.lineTo(d.x-d.range,800);ctx.lineTo(d.x+d.range,800);ctx.closePath();ctx.fill();}ctx.save();if(d.disabled)ctx.filter='hue-rotate(130deg)';droneBody(d);ctx.restore();if(d.disabled)label('INVERTIDO / '+Math.ceil(d.disabled)+'s',d.x,d.y-34,'#7bfbd6',13);else if(state.scan||d.tag>0){label(d.tag>=1?'E / INVERTER':'IDENTIFICANDO',d.x,d.y-34,'#bdfcff',13);rect(d.x-32,d.y-25,64,4,'#22344b');rect(d.x-32,d.y-25,64*d.tag,4,'#7df2e7');}}
label(state.nodes.every(n=>n.found)?'E / EXTRAÇÃO':'SAÍDA BLOQUEADA',3080,655,'#8befe0',14);
}
if(state.scan){ctx.strokeStyle='#86fff377';ctx.lineWidth=2;ctx.beginPath();ctx.arc(state.x,state.y-60,140+Math.sin(state.time*4)*5,0,Math.PI*2);ctx.stroke();ctx.setLineDash([3,9]);ctx.beginPath();ctx.arc(state.x,state.y-60,175,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
actor(state.x,state.y,state.face,state.foot,Math.abs(state.vx)>0);label('▼',state.x,state.y-235,state.flags.upgraded?'#ffc779':'#8df5ef',13);ctx.restore();for(let y=0;y<H;y+=8)rect(0,y,W,1,'#00000010');if(state.detected)rect(0,0,W,3,'#ff6eae');}
function updateUprisingUI(){const s=state,f=s.flags,lab=s.stage==='lab',n=s.nodes.filter(n=>n.found).length;$('health').textContent='▰ '.repeat(Math.max(0,s.hp))+'▱ '.repeat(3-Math.max(0,s.hp));$('energy').style.width=s.energy+'%';$('clues').textContent=lab?'CAPÍTULO 03 / ENLACE':'RELÉS LIBERTADOS '+n+' / 3';$('objective').textContent=lab?(!f.talked?'Conheça Aura':!f.memory?'Examine o arquivo com Aura':!f.upgraded?'Sincronize o olho na bancada':'Entre no corredor do relé'):n===3?'Alcance a saída do distrito':'Isole os três relés';$('alert').style.display=s.alarm>2?'block':'none';$('alarm').style.width=s.alarm+'%';const o=Uprising.near(s);let hint='';if(o){hint='E / USAR · '+o.name;if(o.id==='node')hint='E / USAR · ISOLAR '+o.name;if(o.id==='drone')hint=s.drones[o.index].tag>=1?'E / USAR · Inverter drone (25%)':'Q / SCAN · Identificar drone';}$('hint').textContent=hint;$('hint').style.display=hint&&s.mode==='playing'?'block':'none';if(state.mode==='playing'&&performance.now()>radioUntil)$('radio').style.display='none';}
// Dialogue is short; the player's calibration and exploration do the storytelling.
const meeting=[
 ['AURA','Sierra? Sou Aura. Você conseguiu passar pelo bloqueio.'],
 ['SIERRA','Quase não consegui. Onde fica o corte de emergência?'],
 ['AURA','Na sua lente. Eu abro o canal, você decide quando encerrar.'],
 ['SIERRA','Então podemos começar. Mostra os relés.']
];
const upgradeLines=[
 ['AURA','Leitura estável. Posso ativar o isolamento?'],
 ['SIERRA','Pode. A chave de corte fica comigo.'],
 ['JINX / RÁDIO','Drones se aproximando da entrada. Vocês precisam sair agora.']
];
const finale=[
 ['AURA / ENLACE','Três relés isolados. Não sei por quanto tempo.'],
 ['SIERRA','Estou na saída. Desligo a lente quando passar pelo portão.'],
 ['AURA / ENLACE','Certo. Encerro o canal assim que você estiver fora do alcance deles.']
];
function chapterDialogue(lines,done,n=0){state.mode='dialogue';clearControl();$('radio').style.display='none';if(n>=lines.length){$('overlay').classList.remove('encounter','hacking');$('overlay').classList.add('hidden');state.mode='playing';state.useWas=true;done?.();return;}const [who,line]=lines[n];showPanel(who,line.replaceAll('\n','<br>'),'CONTINUAR',()=>chapterDialogue(lines,done,n+1));$('overlay').classList.remove('hacking');$('overlay').classList.add('encounter');}
// Intimacy and shared memories belong to the terrace, after evacuation.
// The relay corridor is not a safe space for relationship decisions.
function uprisingEvents(){const queue=state.events.splice(0);for(const ev of queue){if(ev.type==='hint')radio('AURA',ev.text,6);if(ev.type==='radio')radio(ev.speaker,ev.text,12);if(ev.type==='memory')chapterDialogue([
 ['AURA','Esse arquivo tem a assinatura de Keane. O resto está corrompido.'],
 ['SIERRA','A lacuna coincide com a do distrito.'],
 ['AURA','Vamos guardar os originais. Nenhuma conclusão sem comparar os registros.'],
 ['SIERRA','Duas cópias offline. Depois você me conta de onde veio esse arquivo.']
],()=>{state.flags.memory=true;});if(ev.type==='talk')chapterDialogue(meeting,()=>{state.flags.talked=true;radio('AURA','A bancada está à direita. Vamos alinhar os canais antes de tocar na rede.',8);});if(ev.type==='talkAgain')chapterDialogue([['AURA','Conferiu a chave de corte? Ela continua com você.'],['SIERRA','Conferi. Vamos terminar antes que o Jinx perca a paciência.']],()=>{});if(ev.type==='upgraded')chapterDialogue(upgradeLines,()=>radio('AURA','Passagem à esquerda. Depois de entrar, SCAN revela circuitos e identifica drones; USAR invade ou inverte.',11));if(ev.type==='override'){beep(640,.2);radio('AURA / ENLACE','Comando invertido. Doze segundos sem esse sensor. Continua.',5);}if(ev.type==='node'){beep(820,.3);radio('AURA / ENLACE',[ 'Identificação isolada. Primeiro bloqueio aberto.', 'Rastreamento interrompido. Vá ao último relé.', 'Canal de comando fora do ar. Saída à direita, Sierra.'][ev.index],9);}if(ev.type==='damage'){beep(95,.25,'sawtooth');radio('AURA / ENLACE','Cortei a conexão antes de fecharem o rastreamento. Os relés invadidos continuam nossos.',7);}if(ev.type==='lost')showPanel('Enlace<br><em>interrompido.</em>','Aura preservou os relés já invadidos. Recupere-se no último ponto seguro e use o olho para desativar os drones antes de atravessar.','RETOMAR DO CHECKPOINT',()=>{Uprising.retry(state);clearControl();$('overlay').classList.add('hidden');});if(ev.type==='ending')chapterDialogue(finale,()=>{state.mode='won';ChapterCurtain.to(4,beginTerrace);});}}
qaListen(window,'keydown',e=>{if(state.chapter!==3||state.mode==='paused')return;
 if(['dialogue','won'].includes(state.mode)&&['KeyE','Space','Enter','Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].includes(e.code)){
 e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
 const choices=[...$('overlay').querySelectorAll('.first-contact-choices button')];
 const i={'Digit1':0,'Digit2':1,'Digit3':2,'Numpad1':0,'Numpad2':1,'Numpad3':2}[e.code];
 if(choices.length){
  if(Number.isInteger(i))choices[i]?.click();
  else if(['KeyE','Space','Enter'].includes(e.code)&&choices.includes(document.activeElement))document.activeElement.click();
 }else $('continue')?.click();
}},true);
uprisingReady();
