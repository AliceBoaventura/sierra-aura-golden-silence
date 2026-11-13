'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/../terrace.js','utf8');
const a=source.indexOf('function renderTerraceDialogue(){'),b=source.indexOf('function drawTerrace(){',a);
assert(a>=0&&b>a);
let count=0;const verify=(yes,msg)=>{assert(yes,msg);count++;};
function setup(search){
 const classes=new Set();const game={classList:{toggle:(key,flag)=>{if(flag)classes.add(key);else classes.delete(key);},has:key=>classes.has(key)}};
 const nodes={game,terraceSky:{textContent:''},terraceDialogue:{innerHTML:'',scrollTop:7}};
 function $(id){if(id==='game'||id==='terraceSky'||id==='terraceDialogue')return nodes[id];
  if(nodes.terraceDialogue.innerHTML.includes('id="'+id+'"'))return nodes[id]??(nodes[id]={onclick:null,click(){this.onclick?.();}});
  return null;}
 const state={chapter:4,mode:'won',stage:'ending',sky:true,dream:false,awake:false,beat:0};
 const ctx={$,state,location:{search},URLSearchParams,Terrace:{ending:()=>({title:'A primeira luz',text:'Texto da escolha'})},sound:false,ownChapterUI:()=>{},beep:()=>{},beginClub:()=>{},beginTerrace:()=>{},showChapterMenu:()=>{ctx.menuCalled=true;},window:{SierraSave:{save:()=>true}},console};
 vm.createContext(ctx);vm.runInContext(source.slice(a,b),ctx);
 return {ctx,nodes,classes};
}
const publicRun=setup('');publicRun.ctx.renderTerraceDialogue();
verify(publicRun.classes.has('sky-only'),'saved sky flag did not restore CSS');
verify(publicRun.nodes.terraceDialogue.innerHTML.includes('id="terraceClub"'),'missing forward progression');
verify(!publicRun.nodes.terraceDialogue.innerHTML.includes('id="terraceMenu"'),'public chapter skip offered');
publicRun.ctx.state.sky=false;publicRun.ctx.renderTerraceDialogue();
verify(!publicRun.classes.has('sky-only'),'return did not restore dialogue layout');
const qaRun=setup('?qa');qaRun.ctx.renderTerraceDialogue();
verify(qaRun.nodes.terraceDialogue.innerHTML.includes('id="terraceMenu"'),'QA selector removed');
qaRun.ctx.$('terraceMenu').click();verify(qaRun.ctx.menuCalled===true,'QA selector inactive');
verify(fs.readFileSync(__dirname+'/../lifecycle.js','utf8').includes("if(!new URLSearchParams(location.search).has('qa')){location.reload();return;}"),'public MENU must return to title without exposing QA chapter selection');
console.log(`${count}/${count} Terraço state, save-visible sky CSS and public/QA chapter selector checks (controlled JS harness)`);
