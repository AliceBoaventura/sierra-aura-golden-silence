// Count app-owned registrations and scheduled frames, without patching browser APIs.
const qaRuntime={listeners:0,raf:0};
function qaListen(target,...args){target.addEventListener(...args);qaRuntime.listeners++;}
// Keep the only game loop alive if a rendering/plugin exception occurs.
// Previous code silently abandoned requestAnimationFrame after the first exception.
const gameFaults=[];
function reportGameFault(part,error){
 const item={part,chapter:typeof state==='undefined'?null:state.chapter,mode:typeof state==='undefined'?null:state.mode,message:String(error?.message||error),at:Math.round(performance.now())};
 gameFaults.push(item);if(gameFaults.length>30)gameFaults.shift();
 globalThis.__gameRuntimeFaults=gameFaults;
 // Avoid a console flood when the same asset fails every frame.
 if(gameFaults.length<=2||gameFaults.length%120===0)console.error('[SIERRA AURA / '+part+']',error);
}
function queueGameFrame(){
 if(qaRuntime.raf)return;
 qaRuntime.raf++;
 requestAnimationFrame(now=>{
  qaRuntime.raf--;
  try{frame(now);}
  catch(error){
   reportGameFault('motor',error);
   // The next iteration may recover a missing panel or a transient asset error.
   if(typeof last!=='undefined')last=0;
  }finally{
   // frame() normally queues the next tick. If it failed, rescue that tick.
   if(!qaRuntime.raf)queueGameFrame();
  }
 });
}
/* Opt-in, memory-only diagnostics. No upload, cookies or remote telemetry. */
(() => {
  const enabled=new URLSearchParams(location.search).has('qa');
  const report={build:'P13-revisao-qualidade-20261023',startedAt:new Date().toISOString(),events:[],errors:[],frames:0,activeSeconds:0,slowFrames:0,viewport:{},milestones:[]};
  let shown=enabled,lastNow=0,lastPaint=0,previous=null,flags=new Set(),frameTimes=[],frameIndex=0;
  const panel=document.createElement('aside');panel.id='qaPanel';panel.hidden=!shown;
  panel.innerHTML='<strong>DEBUG_QA · F2</strong><pre></pre><div id="qaControls"><button id="qaDamage">DANO</button><button id="qaDeath">FORÇAR MORTE</button><button id="qaRespawn">CHECKPOINT</button><button id="qaClearInput">LIMPAR INPUT</button></div><button id="qaDownload" type="button">BAIXAR JSON LOCAL</button>';
  document.getElementById('game').appendChild(panel);
  const button=document.createElement('button');button.hidden=!enabled;button.id='qaToggle';button.textContent='QA';button.title='Diagnóstico local (F2)';button.setAttribute('aria-label','Mostrar diagnóstico local');document.querySelector('.menu').appendChild(button);
  function toggle(){shown=!shown;panel.hidden=!shown;button.setAttribute('aria-pressed',String(shown));}
  button.onclick=toggle;qaListen(window,'keydown',e=>{if(e.code==='F2'){e.preventDefault();toggle();}});
  function qaAction(action){
 if(!shown)return false;
 if(action==='clear'){resetInput();return true;}
 const engine=state.narrative?Prelude:state.chapter===3?Uprising:null;
 if(!engine||!['playing','lost'].includes(state.mode))return false;
 if(action==='respawn'){resetInput();cancelChapterTimers();stopChapterAudio();engine.retry(state);document.getElementById('overlay').classList.add('hidden');last=0;updateUI();return true;}
 if(state.mode!=='playing')return false;
 if(action==='death')state.hp=1;
 state.inv=0;state.alarm=100;engine.step(state,{},0);
 resetInput();cancelChapterTimers();stopChapterAudio();events();updateUI();return true;
 }
 for(const [id,action] of [['qaDamage','damage'],['qaDeath','death'],['qaRespawn','respawn'],['qaClearInput','clear']])document.getElementById(id).onclick=()=>qaAction(action);
 const keep=(list,item)=>{list.push(item);if(list.length>2000)list.shift();};
  qaListen(window,'error',e=>keep(report.errors,{message:e.message||'Falha ao carregar recurso',resource:e.target?.getAttribute?.('src')||null,line:e.lineno||null}),true);
  qaListen(window,'unhandledrejection',e=>keep(report.errors,{message:String(e.reason)}));
  qaListen(document,'visibilitychange',()=>{lastNow=0;});qaListen(window,'blur',()=>{lastNow=0;});
  function snapshot(){const sorted=[...frameTimes].sort((a,b)=>a-b);return {...report,fps:sorted.length?{average:Number((1000/(frameTimes.reduce((a,b)=>a+b,0)/frameTimes.length)).toFixed(1)),p95FrameMs:Number(sorted[Math.floor((sorted.length-1)*.95)].toFixed(2)),sampleFrames:sorted.length}:null,lastState:previous,runtime:{...qaRuntime},note:'Execução local. Flags e eventos indicam ativação, não compreensão narrativa. Sem medição de GPU, bateria ou sensação de controle.'};}
  document.getElementById('qaDownload').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='neo-rockford-qa.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  globalThis.DebugQA={snapshot,sample(now,dt,s){
    if(!shown&&!enabled){lastNow=0;return;}
    const stage=s.narrative?'cap1/'+s.stage:'cap'+s.chapter+'/'+(s.stage||'');
    const current={stage,mode:s.mode,x:Math.round(s.x||0),y:Math.round(s.y||0),grounded:!!s.grounded,energy:Math.round(s.energy||0),health:s.hp,elapsed:Number((s.time||0).toFixed(2))};
    if(previous?.stage!==stage||previous?.mode!==s.mode){keep(report.events,{...current,type:'state'});if(previous?.stage!==stage)flags.clear();}
    for(const [key,value] of Object.entries(s.flags||{}))if(value&&!flags.has(key)){flags.add(key);keep(report.milestones,{stage,key,elapsed:current.elapsed});}
    for(const event of s.events||[])keep(report.events,{stage,elapsed:current.elapsed,...event});
    if(s.mode==='playing'&&!document.hidden){if(lastNow&&previous?.mode==='playing'){const raw=now-lastNow;if(raw>0){frameTimes[frameIndex]=raw;frameIndex=(frameIndex+1)%3600;report.frames++;report.activeSeconds+=raw/1000;if(raw>50)report.slowFrames++;}}lastNow=now;}else lastNow=0;
    previous=current;
    if(now-lastPaint<200)return;lastPaint=now;
    report.viewport={width:innerWidth,height:innerHeight,dpr:devicePixelRatio,canvasWidth:document.getElementById('world').width,canvasHeight:document.getElementById('world').height};
    if(!shown)return;
    const nearest=s.narrative?Prelude.near(s):s.chapter===2?Apartment.nearby(s):s.chapter===8?Interlude.near(s):s.chapter===3?Uprising.near(s):null;
    const data=snapshot();for(const id of ['qaDamage','qaDeath','qaRespawn'])document.getElementById(id).disabled=!(s.narrative||s.chapter===3)||!['playing','lost'].includes(s.mode);panel.querySelector('pre').textContent=`${stage} · ${s.mode}\nSierra ${current.x}, ${current.y} · chão ${current.grounded}\nInteração: ${nearest?.name||'nenhuma'}\nEnergia ${current.energy}% · HP ${s.hp??'—'}\nCheckpoint ${s.checkpoint??'—'} · scanner ${s.scannerState||'off'} · ECHO ${s.echoState||'off'}\nListeners globais ${qaRuntime.listeners} · rAF ${qaRuntime.raf+1} (em execução) · áudio ${audioNodes.size}\nTempo simulado ${current.elapsed}s\nFPS médio ${data.fps?.average??'—'} · p95 ${data.fps?.p95FrameMs??'—'}ms\nViewport ${innerWidth}×${innerHeight}\nEventos ${report.events.length} · erros ${report.errors.length}`;
  }};
})();
