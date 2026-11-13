'use strict';
const prologueScenes=[
 {tag:'PRÓLOGO / A CIDADE',title:'Neo Rockford',line:'A cidade registra tudo que faz. O que deixa de fora não tem como reclamar.',image:()=>bg},
 {tag:'PRÓLOGO / DISTRITO 07',title:'Sem pendências.',line:'O sistema da clínica informa que está tudo em ordem. A fila continua do lado de fora.',image:()=>districtBg},
 {tag:'PRÓLOGO / JINX',title:'A segunda mensagem.',line:'Jinx manda uma piada sobre o café de Lia. Depois, sem piada: “Mara. Quadro elétrico da clínica. Agora.”',image:()=>bg},
 {tag:'PRÓLOGO / A LENTE',title:'Um segundo ausente.',line:'A lente de Sierra falha. Ela procura a gravação desse segundo. Não há arquivo.',image:()=>homeBg},
 {tag:'PRÓLOGO / 06:42',title:'Sierra Core',line:'Antes de sair para ajudar Mara, Sierra vai à bancada. Precisa saber por que a própria lente mentiu.',image:()=>homeBg}
];
function beginPrologue(){if(!ready||!homeLoaded||!districtLoaded||lifeLoaded<2)return;leaveTerrace();clearControl();state={chapter:-1,mode:'prologue',time:0,slide:0,clues:[]};$('overlay').classList.add('hidden');$('game').classList.add('cinematic');$('prologueUI').classList.remove('hidden');window.SceneDirector?.reset();paintPrologue();}
function paintPrologue(){const p=prologueScenes[state.slide];$('prologueTag').textContent=p.tag;$('prologueTitle').textContent=p.title;$('prologueLine').textContent=p.line;$('prologueNext').textContent=state.slide===prologueScenes.length-1?'CAPÍTULO 1 · SIERRA CORE':'CONTINUAR';$('prologueCount').textContent=(state.slide+1)+' / '+prologueScenes.length;}
function nextPrologue(){if(state.mode!=='prologue')return;if(state.slide===prologueScenes.length-1){ChapterCurtain.to(1,beginPrelude);return;}state.slide++;state.time=0;paintPrologue();}
function drawPrologue(){ctx.clearRect(0,0,W,H);const slide=state.slide||0,im=prologueScenes[slide].image();if(im.complete&&im.naturalWidth){const z=Math.max(W/im.naturalWidth,H/im.naturalHeight)*1.1;const w=im.naturalWidth*z,h=im.naturalHeight*z;const drift=Math.sin(state.time*.025)*Math.min(90,w-W);ctx.drawImage(im,(W-w)/2-drift,(H-h)/2,w,h);}else rect(0,0,W,H,'#080e1b');const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#03071722');shade.addColorStop(.4,'#03071711');shade.addColorStop(1,'#030717f2');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);if(state.mode==='prologue'){ctx.strokeStyle='#b8d6ef22';ctx.beginPath();for(let j=0;j<45;j++){const x=((j*107-state.time*60)%W+W)%W,y=(j*71+state.time*230)%H;ctx.moveTo(x,y);ctx.lineTo(x-3,y+12);}ctx.stroke();}rect(0,0,W,24,'#040710');rect(0,H-24,W,24,'#040710');}
$('prologueNext').onclick=nextPrologue;
// Canonical campaign must complete the prologue; chapter selection remains a separate QA tool.
$('prologueSkip').disabled=true;$('prologueSkip').classList.add('hidden');
$('start').onclick=beginPrologue;
qaListen(window,'keydown',e=>{if(state.mode!=='prologue')return;if(['Enter','Space','KeyE'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)nextPrologue();}},true);
state={chapter:-1,mode:'title',time:0,slide:0,clues:[]};$('game').classList.add('cinematic');
