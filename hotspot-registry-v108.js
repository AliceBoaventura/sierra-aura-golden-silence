/* V10.8 / Pilot: declarative physical hotspot geometry. Narrative IDs are stable.
   Source dimensions follow each scene's actual drawing projection. */
(function(root){
'use strict';
const scenes={"ch02_apartamento":{"worldWidth":2600,"items":[{"uid":"ch02_apartamento_examinar_001","id":"mirror","kind":"examinar","name":"ESPELHO DOURADO","xn":0.1192307692,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_examinar_002","id":"cup","kind":"examinar","name":"XÍCARA FRIA","xn":0.2615384615,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_examinar_003","id":"drawer","kind":"examinar","name":"GAVETA DA MESA","xn":0.4307692308,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_examinar_004","id":"trace","kind":"examinar","name":"RASTRO TÉRMICO","xn":0.3269230769,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_transicao_005","id":"shelf","kind":"transicao","name":"ESTANTE","xn":0.5653846154,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_usar_006","id":"terminal","kind":"usar","name":"COMPUTADORES","xn":0.8269230769,"y":0.9,"radius":85,"priority":0},{"uid":"ch02_apartamento_usar_007","id":"power","kind":"usar","name":"CIRCUITO LOCAL","xn":0.7115384615,"y":0.9,"radius":85,"priority":0},{"uid":"ch02_apartamento_pegar_008","id":"vinyl","kind":"pegar","name":"VINIL DE AURA","xn":0.6634615385,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_pegar_009","id":"glove","kind":"pegar","name":"LUVA DE TRABALHO","xn":0.7634615385,"y":0.9,"radius":85,"priority":0},{"uid":"ch02_apartamento_falar_010","id":"aura","kind":"falar","name":"AURA","xn":0.9423076923,"y":0.9,"radius":100,"priority":0},{"uid":"ch02_apartamento_usar_011","id":"workbench","kind":"usar","name":"BANCADA DE AURA","xn":0.8653846154,"y":0.9,"radius":85,"priority":0}]},"ch06_casa":{"worldWidth":1200,"items":[{"uid":"ch06_casa_examinar_001","id":"pc","kind":"examinar","name":"COMPUTADOR","xn":0.4208333333,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_casa_pegar_002","id":"module","kind":"pegar","name":"MÓDULO DO SETOR 0","xn":0.5125,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_casa_usar_003","id":"comm","kind":"usar","name":"COMUNICADOR","xn":0.6083333333,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_casa_transicao_004","id":"leave","kind":"transicao","name":"SAIR","xn":0.95,"y":0.9,"radius":100,"priority":0}]},"ch06_estudio":{"worldWidth":2600,"items":[{"uid":"ch06_estudio_transicao_001","id":"door","kind":"transicao","name":"PORTA / BOTAS","xn":0.0461538462,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_examinar_002","id":"jacket","kind":"examinar","name":"JAQUETA PEQUENA","xn":0.1096153846,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_examinar_003","id":"bath","kind":"examinar","name":"BANHEIRO / MEDICAMENTOS","xn":0.2153846154,"y":0.9,"radius":65,"priority":0},{"uid":"ch06_estudio_usar_004","id":"fridge","kind":"usar","name":"GELADEIRA","xn":0.25,"y":0.9,"radius":65,"priority":0},{"uid":"ch06_estudio_usar_005","id":"records","kind":"usar","name":"DISCOS / CONSOLE","xn":0.3153846154,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_examinar_006","id":"cups","kind":"examinar","name":"DUAS CANECAS","xn":0.3807692308,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_usar_007","id":"sofa","kind":"usar","name":"SOFÁ","xn":0.1846153846,"y":0.9,"radius":65,"priority":0},{"uid":"ch06_estudio_usar_008","id":"desk","kind":"usar","name":"MESA DE ÁUDIO","xn":0.6,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_usar_009","id":"tapes","kind":"usar","name":"ARQUIVO DE FITAS","xn":0.75,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_examinar_010","id":"wall","kind":"examinar","name":"PAREDE DO CORREDOR","xn":0.8653846154,"y":0.9,"radius":100,"priority":0},{"uid":"ch06_estudio_examinar_011","id":"bedroom","kind":"examinar","name":"QUARTO","xn":0.9384615385,"y":0.9,"radius":100,"priority":0}]}};
function objects(key){const scene=scenes[key];if(!scene)return [];
 return scene.items.map(o=>({id:o.id,uid:o.uid,kind:o.kind,name:o.name,
  x:Math.round(o.xn*scene.worldWidth),y:Math.round((o.y||0)*800),radius:o.radius,priority:o.priority}));}
function asRows(key){return objects(key).map(o=>[o.id,o.x,o.name]);}
let visible=false,last=null;
function record(s,items,radius){if(!s||!Array.isArray(items))return;
 const chapter=s.chapter,stage=String(s.stage||'');
 last={chapter,stage,items:items.filter(o=>Number.isFinite(o.x)).map(o=>({id:o.id,uid:o.uid||null,x:o.x,name:o.name||o.id,r:typeof radius==='function'?radius(o):radius}))};}
function draw(ctx,s,cameraX,cameraY,W,H){if(!visible||!last||s.chapter!==last.chapter||String(s.stage||'')!==last.stage)return;
 ctx.save();ctx.font='10px monospace';ctx.textBaseline='middle';
 const placed=[];
 const active=last.items.filter(o=>o.x-cameraX>-160&&o.x-cameraX<W+160).sort((a,b)=>a.x-b.x);
 for(const o of active){const x=o.x-cameraX,y=800-cameraY;
 const r=Math.max(24,Number.isFinite(o.r)?o.r:100);
 ctx.strokeStyle='#ffcf66';ctx.lineWidth=1.4;ctx.setLineDash([4,4]);ctx.beginPath();ctx.ellipse(x,y,r,27,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 const title=(o.uid||o.id)+' / '+o.name,tw=Math.min(220,ctx.measureText(title).width+12);
 const left=Math.max(4,Math.min(W-tw-4,x-tw/2));let top=y-54;
 for(let k=0;k<10;k++){const intersects=placed.some(p=>left<p.x+p.w+7&&left+tw+7>p.x&&top<p.y+p.h+4&&top+19>p.y);
 if(!intersects)break;top-=22;}
 top=Math.max(60,top);placed.push({x:left,y:top,w:tw,h:19});
 ctx.fillStyle='#0a0c1ced';ctx.fillRect(left,top,tw,19);
 ctx.strokeStyle='#e2b55d';ctx.strokeRect(left,top,tw,19);
 ctx.fillStyle='#fff0c6';ctx.fillText(title,left+5,top+10);
 ctx.beginPath();ctx.moveTo(x,top+19);ctx.lineTo(x,y-29);ctx.stroke();}
 ctx.restore();}
function toggle(){visible=!visible;return visible;}
if(typeof document!=='undefined')document.addEventListener('keydown',e=>{if(e.code==='F8'){e.preventDefault();toggle();}});
// Optional in-game diagnostic switch on touch devices. Never visible on release URLs.
if(typeof document!=='undefined'&&typeof location!=='undefined'&&new URLSearchParams(location.search).get('qa')==='hotspots'){
 const b=document.createElement('button');b.id='hotspotDebugV108';b.type='button';b.textContent='HOTSPOTS / F8';
 b.style.cssText='position:fixed;bottom:13px;left:13px;z-index:9999;background:#171623;color:#ffd889;border:1px solid #ffcb71;padding:10px 14px;font:12px monospace';
 b.addEventListener('click',()=>{b.setAttribute('aria-pressed',String(toggle()));});
 const attach=()=>document.body.appendChild(b);
 if(document.body)attach();else document.addEventListener('DOMContentLoaded',attach,{once:true});
}
root.HotspotsV108={scenes,objects,asRows,record,draw,toggle,get visible(){return visible;},get last(){return last;}};
})(typeof window!=='undefined'?window:globalThis);
