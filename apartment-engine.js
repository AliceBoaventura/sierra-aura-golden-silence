(function(root){
const stations=root.HotspotsV108?.objects('ch02_apartamento')||[{id:'mirror',x:310,name:'ESPELHO DOURADO'},{id:'cup',x:680,name:'XÍCARA FRIA'},{id:'drawer',x:1120,name:'GAVETA DA MESA'},{id:'trace',x:850,name:'RASTRO TÉRMICO'},{id:'shelf',x:1470,name:'ESTANTE'},{id:'terminal',x:2150,name:'COMPUTADORES'},{id:'power',x:1850,name:'CIRCUITO LOCAL'},{id:'vinyl',x:1725,name:'VINIL DE AURA'},{id:'glove',x:1985,name:'LUVA DE TRABALHO'},{id:'aura',x:2450,name:'AURA'},{id:'workbench',x:2250,name:'BANCADA DE AURA'}];
function create(){return {chapter:2,mode:'playing',time:0,x:150,y:800,vx:0,vy:0,face:1,grounded:true,hp:3,energy:100,alarm:0,inv:0,foot:0,scan:false,events:[],clues:[],flags:{},progress:0,interactTime:0,interactTarget:'',useWas:true,jumpWas:false};}
function nearby(s){return NeoRuntime.closest(s,stations.filter(o=>(o.x<=1640||s.flags.shelf)&&(o.id!=='aura'||s.flags.power&&s.flags.recognized)&&(o.id!=='workbench'||s.flags.metAura&&!s.flags.repairedTogether)),root.HotspotsV108?(o=>o.radius||105):105);}
function step(s,i,delta){if(s.mode!=='playing')return;const dt=Math.min(.035,delta);s.time+=dt;s.interactTime=Math.max(0,(s.interactTime||0)-dt);if(s.flags.power&&s.x>2260&&!s.flags.recognized){s.recognition=(s.recognition||0)+dt;s.vx=0;if(s.recognition>=2.8){s.flags.recognized=true;s.events.push({type:'hint',text:'O sinal tinha um rosto.'});}return;}const dir=(i.right?1:0)-(i.left?1:0);s.vx=dir*235;if(dir)s.face=dir;const oldX=s.x;s.x=Math.max(85,Math.min(s.flags.shelf?2540:1640,s.x+s.vx*dt));NeoRuntime.motion(s,oldX,dt,.045);if(i.jump&&!s.jumpWas&&s.grounded){s.vy=-420;s.grounded=false;}s.jumpWas=!!i.jump;s.vy+=1500*dt;s.y+=s.vy*dt;NeoRuntime.flatGround(s,oldX,dt);NeoRuntime.scan(s,i.scan,dt);
const o=nearby(s);if(o?.id==='trace'&&!s.flags.trace&&s.scan){s.progress+=dt;if(s.progress>=1.3){s.flags.trace=true;s.events.push({type:'story',id:'trace'});}}else s.progress=0;
if(i.use&&!s.useWas&&o){s.interactTime=.52;s.interactTarget=o.id;let id=o.id;if(id==='cup'||id==='drawer'){if(!s.flags[id]){s.flags[id]=true;s.events.push({type:'story',id});}else s.events.push({type:'hint',text:id==='cup'?'A xícara continua fria. A marca na borda já está registrada.':'A gaveta está aberta e a chave comigo. Não há outra pista sob as contas.'});}
else if(id==='trace'){s.events.push({type:'hint',text:s.flags.trace?'O rastro termina atrás da estante.':'Segure SCAN para reconstruir o rastro.'});}
else if(id==='shelf'&&(!s.flags.trace||!s.flags.mirror))s.events.push({type:'hint',text:!s.flags.mirror?'O trilho é recente. Algo na sala deve mostrar quem usou essa passagem.':'A estante pesa demais. Primeiro preciso seguir o rastro de calor até o fim.'});
else if(id==='power'&&!s.flags.terminal){
 s.blockedPower=(s.blockedPower||0)+1;
 if(s.blockedPower===1)s.events.push({type:'hint',text:'O disjuntor está isolado. Preciso descobrir em qual terminal essa linha termina.'});
 else if(s.blockedPower===2)s.events.push({type:'hint',text:'O painel não responde sem o código que está nos computadores.'});
 else s.events.push({type:'hint',text:'A chave deve estar nos terminais, à direita.'});
 }
else if(id==='shelf'&&!s.flags.shelf){s.flags.shelf=true;s.shelfOpenedAt=s.time;s.events.push({type:'story',id});}
else if(id==='workbench'){
  if(s.flags.metAura&&!s.flags.repairedTogether){s.mode='dialogue';s.events.push({type:'repairTogether'});}
  else s.events.push({type:'hint',text:'A bancada já está estabilizada. Aura aguarda junto ao terminal.'});
 }
else if(id==='aura'){s.mode='dialogue';s.events.push({type:s.flags.metAura?(s.flags.repairedTogether?'farewell':'repairHint'):'encounter'});}
else if(!s.flags[id]){s.flags[id]=true;s.events.push({type:'story',id});}
else s.events.push({type:'hint',text:({mirror:'Não mudou. O reflexo ainda não acompanha o quarto.',cup:'Batom na borda. Não preciso tocar nisso de novo.',drawer:'A chave já está comigo.',shelf:'A passagem continua aberta.',terminal:s.flags.repairedTogether?'A cópia está segura. Aura espera à direita da bancada.':'Já tenho a cópia local.',power:'A linha está isolada.'})[id]||'Nada novo aqui.'});}s.useWas=!!i.use;}
root.Apartment={create,step,nearby,stations};
})(typeof window!=='undefined'?window:globalThis);
