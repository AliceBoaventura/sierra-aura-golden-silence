'use strict';
const apartmentBg=new Image(),auraSprite=new Image();let aptLoaded=false,auraLoaded=false;
const vinylPropV108=new Image();vinylPropV108.src='assets/interactive-p61/casa_alexandra__discos_vinil.png';
// P64: Only the moving face of Aura's existing bedside drawer, sampled from its painting.
// This is NOT another freestanding cabinet and retains the existing drawer flag/hitbox.
const auraDrawerOpen=new Image();auraDrawerOpen.src='assets/interactive-p61/apartamento_aura__gaveta_aberta_integrada.png';
function apartmentReady(){if(typeof intervalReady==='function')intervalReady();if(typeof ghostReady==='function')ghostReady();const b=$('chapterTwo');if(b&&aptLoaded&&auraLoaded&&ready){b.disabled=false;b.onclick=beginApartment;}if(typeof uprisingReady==='function')uprisingReady();if(typeof terraceReady==='function')terraceReady();}
apartmentBg.onload=()=>{aptLoaded=true;apartmentReady();};apartmentBg.src='assets/visual-v5/apartment-v5.png';
auraSprite.onload=()=>{auraLoaded=true;apartmentReady();};auraSprite.src='aura.png';
function beginApartment(){if(!aptLoaded||!auraLoaded){showPanel('Carregando a sala','Os recursos do apartamento ainda não estão disponíveis.','TENTAR NOVAMENTE',beginApartment);return;}StoryContinuity.capture(state);if(typeof leaveTerrace==='function')leaveTerrace();exitChapter();$('game').classList.remove('cinematic');$('prologueUI').classList.add('hidden');$('conversationBox').classList.add('hidden');$('overlay').classList.remove('encounter','neural-reciprocity-open');state=Apartment.create();scanToggle=false;keys.clear();touchKeys.clear();tapQueue.clear();document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('active'));camX=0;camY=330;$('overlay').classList.add('hidden');$('pause').textContent='Ⅱ';$('touchScan').classList.remove('active');radio('JINX / NA ENTRADA','Fico na escada. Duas batidas se alguém subir. E, Si: nem toda leitura da lente é prova.',9);updateUI();window.SceneDirector?.enter(2);}
function drawApartment(){ctx.clearRect(0,0,W,H);const target=Math.max(0,Math.min(2600-W,state.x-W*.38));camX+=(target-camX)*cameraBlend(.09);camY+=((H<650?Math.max(205,state.y-H*.74):Math.max(205,Math.min(390,state.y-H*.67)))-camY)*cameraBlend(.05);boundCamera(2600);ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY));rect(0,0,2600,1100,'#0a1020');if(aptLoaded){
 const painted=state.scan?spectralImage(apartmentBg):apartmentBg;
 ctx.drawImage(painted,0,260,2600,867);
 // The original room painting contains the service passage already open.
 // Reuse its own bookcase pixels as a sliding foreground shelf until the
 // player actually finds the thermal trace and moves it. No generic prop.
 const phase=state.flags.shelf?Math.min(1,Math.max(0,(state.time-(state.shelfOpenedAt??-10))/.75)):0;
 if(phase<1){
  const slide=phase*phase*(3-2*phase),dx=1445-230*slide;
  ctx.save();ctx.globalAlpha=1-.20*slide;
  ctx.fillStyle='#080e19c2';ctx.fillRect(dx-7,411,210,388);
  ctx.drawImage(painted,970,127,180,325,dx,415,197,381);
  ctx.fillStyle='#0b0b13a8';ctx.fillRect(dx-6,417,6,381);
  ctx.fillStyle='#9e80554b';ctx.fillRect(dx-1,420,2,368);
  ctx.fillStyle='#050914a0';ctx.fillRect(dx+195,417,7,381);
  ctx.restore();
 }
}
if(state.flags.drawer && auraDrawerOpen.complete && auraDrawerOpen.naturalWidth){
 ctx.drawImage(auraDrawerOpen,932,687,124,83);
}
if(state.flags.shelf&&vinylPropV108.complete&&vinylPropV108.naturalWidth){ctx.save();ctx.imageSmoothingEnabled=false;ctx.shadowColor='#ffad65';ctx.shadowBlur=6;ctx.drawImage(vinylPropV108,1680,652,88,36);ctx.restore();}
SceneryFinish.practical('apartment',state.time);SceneryFinish.floor(2600,800,'domestic',state.time);window.ScenePropsP61?.draw('apartment',state);if(state.mode==='playing')SceneryFinish.interactionAnchor(Apartment.nearby(state),800,'warm',state.time);
/* P59: remove loose decorative props; stations remain interactive. */// The hidden passage is a narrow physical opening, not a cyan rectangle
// tinting half of Aura's apartment before the player discovers it.
if(!state.flags.shelf&&state.scan){
 const pulse=.55+.28*Math.sin(state.time*2.7);
 ctx.save();ctx.globalAlpha=pulse;ctx.strokeStyle='#9be7d5';ctx.lineWidth=2;
 ctx.setLineDash([4,9]);ctx.beginPath();ctx.moveTo(1596,425);ctx.lineTo(1596,790);ctx.stroke();ctx.setLineDash([]);ctx.restore();
 label('CORRENTE DE AR',1560,615,'#c9a267',14);
}else if(state.flags.shelf){
 ctx.save();const spill=ctx.createLinearGradient(1565,560,1835,770);
 spill.addColorStop(0,'#70e0dc22');spill.addColorStop(.65,'#57afbe12');spill.addColorStop(1,'#70e0dc00');
 ctx.fillStyle=spill;ctx.beginPath();ctx.moveTo(1575,475);ctx.lineTo(1815,800);ctx.lineTo(1515,800);ctx.closePath();ctx.fill();ctx.restore();
}
for(const o of Apartment.stations){if(o.id==='aura'||(o.x>1640&&!state.flags.shelf)||o.id==='workbench'&&(!state.flags.metAura||state.flags.repairedTogether))continue;const near=Apartment.nearby(state)?.id===o.id;if(!near&&!state.scan)continue;ctx.globalAlpha=near?1:.55;if(W>=650)label(state.flags[o.id]?'✓ '+o.name:o.name,o.x,595,state.flags[o.id]?'#7ef1c6':'#f2c484',near?15:12);if(near)actionHalo(o.x,o.id==='mirror'?540:o.id==='cup'?725:635);ctx.globalAlpha=1;}
// Physical investigation affordances: illuminate only existing stations, never
// imply a new action or override the scanner / inventory puzzle state.
if(state.mode==='playing'){
 const clue=Apartment.nearby(state);
 if(clue&&clue.id!=='aura'&&(clue.x<=1640||state.flags.shelf)){
  const markerY=clue.id==='cup'?710:clue.id==='mirror'?537:clue.id==='trace'?735:615;
  const glow=.35+.15*Math.sin(state.time*3.1);
  ctx.save();ctx.globalAlpha=glow;ctx.strokeStyle=state.scan?'#93f3e3':'#e8bc80';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.ellipse(clue.x,markerY,20,7,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(clue.x,markerY-21);ctx.lineTo(clue.x,markerY-9);ctx.stroke();ctx.restore();
 }
}
if(state.scan){ctx.strokeStyle='#79f6eb66';ctx.lineWidth=2;ctx.beginPath();ctx.arc(state.x,state.y-60,135,0,Math.PI*2);ctx.stroke();if(state.x<1640){ctx.setLineDash([7,15]);ctx.strokeStyle='#ffc675';ctx.beginPath();ctx.moveTo(620,796);ctx.lineTo(1560,796);ctx.stroke();ctx.setLineDash([]);if(state.progress){rect(815,690,70,5,'#332637');rect(815,690,70*Math.min(1,state.progress/1.3),5,'#ffc675');}}}
if(state.flags.power&&(state.x>2260||state.flags.recognized)&&auraLoaded){const h=216,w=h*590/1505;ctx.save();ctx.shadowColor='#ffc07d';ctx.shadowBlur=12;ctx.drawImage(auraSprite,260,12,590,1505,2450-w/2,800-h,w,h);ctx.restore();if(state.flags.recognized)label('AURA',2450,560,'#ffbcdd',15);}
if(state.mode==='playing'&&state.interactTime>0&&['cup','drawer','vinyl','glove'].includes(state.interactTarget)&&window.NeoActors){ctx.save();ctx.translate(state.x,state.y);ctx.scale(state.face,1);if(!NeoActors.draw('sierra',6,230))actor(0,0,1,0,false);ctx.restore();}else actor(state.x,state.y,state.face,state.foot,Math.abs(state.vx)>0);if(state.scan&&Apartment.nearby(state))label('⌄',state.x,state.y-242,'#9bfff2',11);ctx.restore();for(let y=0;y<H;y+=4)rect(0,y,W,1,'#00000012');}
function updateApartmentUI(){const f=state.flags;const silent=state.recognition>0&&!f.recognized;document.querySelector('.hud').style.opacity=silent?'0':'1';if(silent)$('radio').style.display='none';$('health').textContent='▰ ▰ ▰';$('energy').style.width=state.energy+'%';$('clues').textContent='CAPÍTULO 02 / SILÊNCIO DOURADO';$('objective').textContent=!f.mirror?'Examine o espelho dourado':!f.trace?'Reconstrua o rastro com SCAN':!f.shelf?'Mova a estante':!f.terminal?'Examine os computadores':!f.power?'Isole o circuito local':!f.metAura?'Ajude Aura a calibrar a bancada':!f.repairedTogether?'Calibre o sinal com Aura (3 leituras)':'Fale com Aura à direita da bancada';$('alert').style.display='none';const o=Apartment.nearby(state);$('hint').textContent=o?(o.id==='trace'&&!f.trace?'Q / SCAN · Reconstruir rastro':'E / USAR · '+(o.id==='aura'?'Falar com Aura':o.name)):'';$('hint').style.display=o&&state.mode==='playing'?'block':'none';if(state.mode==='playing'&&performance.now()>radioUntil)$('radio').style.display='none';}
const aptStories={
 cup:['SIERRA','Café frio. A xícara ficou onde alguém podia alcançá-la enquanto trabalhava. Melhor não mexer.'],
 drawer:['SIERRA','Uma chave sob as contas de energia. Foi deixada à mão, não escondida.'],
 mirror:['SIERRA','Espera. No espelho, aquele livro acabou de virar a página. Olho para a estante e ele continua parado. Não é reflexo.'],
 trace:['SIERRA / SCANNER','O calor atravessa a parede e desaparece atrás dos livros. Não é uma pessoa andando: é uma passagem que alguém tentou apagar.'],
 shelf:['SIERRA','O piso está riscado. Empurraram esta estante várias vezes. Atrás dela, ventoinhas funcionando e uma sala que ninguém declarou na planta.'],
 terminal:['SIERRA','O computador estava aberto hoje. Alguém voltou para conferir esses arquivos. Vou salvar a cópia antes que o servidor acorde.'],
 vinyl:['SIERRA','Um disco sem capa. Há dois tipos de letra na etiqueta e um aviso escrito à mão: “não desliga na melhor parte”. Não reconheço a outra assinatura.'],
 glove:['SIERRA','Uma luva de trabalho com contatos improvisados. Há outra ao lado, menor. Duas pessoas usaram essa bancada ou alguém precisou trocar de mão.'],
 power:['SIERRA','Cortei a ligação externa. Se alguém estava me vendo, agora sabe que perdeu a imagem. Preciso sair daqui antes que apareçam.']
};
function apartmentEvents(){
 // Drain first. A malformed or interrupted interaction must never be replayed
 // on every frame, leaving the apartment apparently frozen on mobile.
 const pending=state.events.splice(0);
 for(const ev of pending){
  if(ev.type==='hint')radio('SIERRA',ev.text,6);
  else if(ev.type==='story'){
   const line=aptStories[ev.id];
   if(!line){reportGameFault('apartamento / evento inesperado',new Error('Sem diálogo para '+String(ev.id)));continue;}
   radio(...line,10);beep(ev.id==='power'?523:330,.2);
  }else if(ev.type==='encounter')encounter(0);
  else if(ev.type==='repairTogether')repairWithAura();
  else if(ev.type==='repairHint')showRepairHint();
  else if(ev.type==='farewell')apartmentFarewell();
 }
}
// Keep each dramatic turn on a single readable panel. Three distinct choices
// replace the old twenty-click lecture without rushing their first meeting.
const encounterBeats=[
 {who:'AURA',text:'Não toca nesse cabo. A bancada está repetindo uma gravação que eu nunca fiz. Quem mandou você?'},
 {who:'SIERRA',text:'Não. Sou Sierra. Segui um sinal que apareceu na minha lente. Meu amigo está na escada, e eu só quero entender por quê.',choices:[
  ['Pedir a Jinx para vigiar a entrada.','guard','SIERRA: Jinx, fica de olho na escada. Ninguém entra sem avisar.\nAURA: Certo. Eu cuido da bancada.'],
  ['Mostrar a gravação da lente, sem conectar nada.','evidence','SIERRA: Tenho o registro aqui. Offline. Quer comparar?\nAURA: Quero. Mas nada entra na rede.'],
  ['Perceber a queimadura na mão de Aura.','care','SIERRA: Sua mão está machucada. Precisa de ajuda?\nAURA: Preciso de alguém que não puxe o cabo errado. Serve?']
 ]},
 {who:'AURA',text:'Você podia ter ido embora quando a porta travou.'},
 {who:'SIERRA',text:'Pensei nisso. Mas o sinal continua se repetindo.'},
 {who:'AURA',text:'Então pega o multímetro. Se vamos olhar isso juntas, primeiro isolamos a bancada.'}
];
// A response is played immediately by its actual speaker. The player's
// decision must not disappear into a variable that the scene never renders.
function firstContactExchange(reply,part,continueAt){
 const lines=reply.split('\n').map(line=>line.trim()).filter(Boolean);
 if(part>=lines.length){encounter(continueAt);return;}
 const match=/^(SIERRA|AURA|JINX):\s*(.*)$/i.exec(lines[part]);
 if(!match){firstContactExchange(reply,part+1,continueAt);return;}
 showPanel(match[1].toUpperCase(),match[2],'CONTINUAR',()=>firstContactExchange(reply,part+1,continueAt));
 $('overlay').classList.add('encounter');
}
function encounter(n){
 document.querySelector('.hud').style.opacity='1';keys.clear();touchKeys.clear();tapQueue.clear();document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('active'));scanToggle=false;$('radio').style.display='none';
 if(n>=encounterBeats.length){state.mode='playing';state.flags.metAura=true;state.useWas=true;$('overlay').classList.remove('encounter');$('overlay').classList.add('hidden');radio('AURA / BANCADA','O multímetro está na bancada. Não puxa o cabo. Primeiro precisamos identificar qual linha alimenta o módulo.',12);updateUI();return;}
 const beat=encounterBeats[n];
 const remembered=n===6&&state.flags.auraFirstContact?({guard:'Jinx responde pelo rádio com um único clique. Aura espera Sierra desligar antes de continuar.',evidence:'Aura afasta o teclado. Sierra aproxima a lente da tela sem tocar no equipamento.',care:'Aura troca a luva queimada. Sierra espera, sem insistir na pergunta.'})[state.flags.auraFirstContact]+'\n\n':'';
 const safeText=remembered+beat.text;
 showPanel(beat.who,safeText.replaceAll('\n','<br>'),'CONTINUAR',()=>encounter(n+1));
 $('overlay').classList.add('encounter');
 if(beat.choices){
  $('continue').remove();const panel=$('overlay').querySelector('.panel');const choices=document.createElement('div');choices.className='first-contact-choices';
  beat.choices.forEach(([label,value,reply])=>{const b=document.createElement('button');b.className='secondary';b.type='button';b.textContent=label;b.onclick=()=>{state.flags.auraFirstContact=value;StoryContinuity.record('firstContact',value);firstContactExchange(reply,0,n+1);};choices.append(b);});
  panel.append(choices);
 }
}

// This is part of the apartment's existing interaction loop: the first meeting
// is not an instant romance or a chapter-complete button. Play a small, shared
// task in the actual apartment before deciding whether Sierra returns.
function showRepairHint(){
 state.mode='dialogue';
 showPanel('AURA','Antes de conversar sobre o que a lente viu, precisamos isolar a bancada. O painel ao lado tem duas leituras. Venha conferir comigo.','IR À BANCADA',()=>{state.mode='playing';state.useWas=true;$('overlay').classList.add('hidden');});
 $('overlay').classList.add('encounter');
}
// Microjogo de três leituras. Um erro ensina; nunca apaga progresso.
const auraCalibration=[
 {prompt:'01 / A tela mostra dois relógios: 04:47 e 04:46. O que você compara primeiro?',options:[['Os horários das duas gravações.',true,'AURA: Boa. Um segundo de diferença. Agora sabemos onde procurar.'],['A cor do indicador.',false,'AURA: Cor não mede atraso. Olha os dois relógios.'],['Reiniciar o computador.',false,'AURA: Se reiniciar, perde a única leitura que temos.']]},
 {prompt:'02 / A bancada esquenta e o sinal externo começa a piscar. Qual linha deve ser isolada?',options:[['A alimentação e os dados, separadamente.',true,'SIERRA: Dados isolados. A gravação continua aqui.\nAURA: E ninguém lá fora pode alterá-la.'],['Desligar a memória junto com a energia.',false,'AURA: A memória também cai. Precisamos guardar a prova.'],['Abrir o canal de transmissão.',false,'AURA: Não sabemos quem está escutando. Nada de rede.']]},
 {prompt:'03 / Duas cópias, mesmo corredor, horários diferentes. Como salvar o resultado?',options:[['Guardar as duas versões offline.',true,'AURA: Pronto. Duas cópias. Se alguém mudar uma, a outra entrega a mentira.'],['Apagar a versão mais antiga.',false,'AURA: Não sabemos qual é a falsa. Precisamos das duas.'],['Enviar tudo para um servidor público.',false,'AURA: Isso entrega nossa localização e a prova. Sem chance.']]}
];
function repairWithAura(){
 state.mode='dialogue';clearControl();
 const step=Math.max(0,Math.min(2,state.flags.auraCalibrationStep||0));const task=auraCalibration[step];
 showPanel('AURA + SIERRA / CALIBRAÇÃO',task.prompt,'',()=>{});
 $('continue')?.remove();const box=$('overlay').querySelector('.panel');const list=document.createElement('div');list.className='first-contact-choices';
 task.options.forEach(([label,correct,reply],index)=>{
  const b=document.createElement('button');b.className='secondary';b.type='button';b.textContent=(index+1)+' · '+label;
  b.onclick=()=>{
   if(correct)state.flags.auraCalibrationStep=step+1;else state.flags.repairMistakes=(state.flags.repairMistakes||0)+1;
   const lines=reply.split('\n');let at=0;
   const next=()=>{if(at<lines.length){const line=lines[at++],match=/^(SIERRA|AURA):\s*(.*)$/.exec(line);showPanel(match?match[1]:'AURA',match?match[2]:line,'CONTINUAR',next);$('overlay').classList.add('encounter');return;}
    if(!correct){repairWithAura();return;}
    if(step<2){repairWithAura();return;}
    state.flags.repairedTogether=true;StoryContinuity.record('repairBond','together');state.mode='playing';state.useWas=true;$('overlay').classList.remove('encounter');$('overlay').classList.add('hidden');radio('AURA / BANCADA','A cópia está segura. Vem até o terminal. Quero te mostrar uma coisa.',9);updateUI();};next();
  };list.appendChild(b);
 });box.append(list);$('overlay').classList.add('encounter');
}
function apartmentFarewell(){
 state.mode='dialogue';clearControl();
 showPanel('AURA / UMA DECISÃO','Os relés registraram a sua lente quando você entrou. Posso usar a imagem que você vê para isolar o rastreamento. Eu fico na bancada. Você controla a chave de corte.','',()=>{});
 $('continue')?.remove();const panel=$('overlay').querySelector('.panel');const list=document.createElement('div');list.className='first-contact-choices';
 const options=[
  ['Pode abrir. Me mostra como desligar primeiro.','cautious','SIERRA: Pode abrir. Só até sairmos do rastreamento.\nAURA: O corte está aqui. Se apertar, eu saio.'],
  ['Só a visão. Minhas lembranças ficam comigo.','curious','SIERRA: Só a visão. Minhas lembranças ficam comigo.\nAURA: Combinado. Abro a imagem; o resto continua fechado.'],
  ['Se fritar minha lente, você me deve outra.','playful','SIERRA: Se eu disser para, você para.\nAURA: Sem negociar. E vou tentar não te dever uma lente.']
 ];
 for(const [label,choice,line] of options){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=label;
  // On touch devices, USAR can open this overlay between pointerdown and click.
  // Chromium then retargets that same touch click to a newly inserted option.
  // Consent requires a fresh pointerdown on the option (or an explicit keyboard action).
  let pressedOnChoice=false;
  b.addEventListener('pointerdown',()=>{pressedOnChoice=true;});
  b.addEventListener('pointercancel',()=>{pressedOnChoice=false;});
  b.onclick=e=>{
   const pointerClick=!!e.pointerType||e.detail>0;
   if(e.isTrusted&&pointerClick&&!pressedOnChoice)return;
   pressedOnChoice=false;
   state.flags.auraParting=choice;state.flags.linkConsent=true;StoryContinuity.record('auraParting',choice);StoryContinuity.record('auraLink','mutual-consent');auraLinkCinema(line);
  };list.append(b);
 }panel.append(list);$('overlay').classList.add('encounter');
}
function auraLinkCinema(agreement){
 state.mode='dialogue';clearControl();$('game').classList.add('aura-link-chapter-cut');
 // This is a remote optical link. Preserve the actual room and both adult actors.
 state.x=Math.min(state.x,2340);state.face=1;
 const shots=agreement.split('\n').filter(Boolean).map(line=>{
  const m=/^(SIERRA|AURA):\s*(.*)$/.exec(line);return {who:m?m[1]:'AURA',text:m?m[2]:line};
 });
 shots.push(
  {who:'SIERRA',text:'Imagem sincronizada. Sua voz está no canal interno.'},
  {who:'AURA',text:'Você continua no controle. Se disser para, eu desligo.'},
  {who:'SIERRA',text:'Entendido. Vou até o primeiro relé.'}
 );let at=0;
 const next=()=>{
  if(at>=shots.length){$('overlay').classList.remove('aura-link-screen','encounter');state.flags.linkCompleted=true;StoryContinuity.record('auraLinkCompleted',true);$('game').classList.remove('aura-link-chapter-cut');state.mode='won';ChapterCurtain.to(3,beginUprising);return;}
  const sh=shots[at++];showPanel(sh.who,sh.text,'CONTINUAR',next);$('overlay').classList.add('encounter','aura-link-screen');
 };
 next();
}

// The chapter 2 conversation is part of the game controls, not mouse-only UI.
// Do not select an answer implicitly: the player must choose 1, 2 or 3.
qaListen(window,'keydown',e=>{
 if(state.chapter!==2||!['dialogue','won'].includes(state.mode)||$('overlay').classList.contains('hidden')||e.repeat)return;
 const option=['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].indexOf(e.code);
 const choices=[...$('overlay').querySelectorAll('.first-contact-choices button')];
 const isAdvance=['KeyE','Enter','Space'].includes(e.code);
 if(option<0&&!isAdvance)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(choices.length){
  if(option>=0)choices[option%3]?.click();
  else if(choices.includes(document.activeElement))document.activeElement.click();
  return;
 }
 if(isAdvance)$('continue')?.click();
},true);
// Remove dialogue framing whenever a chapter is restarted.
$('chapterTwo').onclick=beginApartment;
