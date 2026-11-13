/** Node VM / DOM simulado. Não substitui gameplay real em navegador. */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const sources={save:fs.readFileSync(path.join(root,'chapter-select.js'),'utf8'),life:fs.readFileSync(path.join(root,'lifecycle.js'),'utf8')};
const checkpoint=sources.save.slice(sources.save.indexOf('/* RC48 · Persistent checkpoint'));
assert(checkpoint.startsWith('/* RC48'), 'Persistent checkpoint block missing');
function element(hidden=true){const classes=new Set(hidden?['hidden']:[]);return {
 classList:{contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c),toggle(c,on){const turn=on??!classes.has(c);turn?classes.add(c):classes.delete(c);}},
 style:{},textContent:'',disabled:false,title:'',children:[],insertAdjacentElement(){},
 };}
const ids=new Map();for(const id of ['overlay','chapterPicker','start','continueSaved','terraceDialogue','terraceUI','radio','clubDialogue','ghostDialogue','intervalDialogue','interludeDialogue','clubPuzzle','ghostPuzzle','intervalPuzzle','pauseLayer','conversationBox','ghostNotes','intervalNotes','interludeSkip'])ids.set(id,element(id!=='terraceUI'&&id!=='terraceDialogue'));
ids.get('start').insertAdjacentElement=(_,el)=>ids.set(el.id,el);
const savedMap=new Map();let rendered=0,refreshUI=0;const memory={terrace:'refuse',club:'boundary'};
const context={console,JSON,Date,Number,Math,Object,Array,
 ready:true,NeoEngine:{create:()=>({chapter:1,mode:'ready',events:[]})},state:{chapter:4,mode:'conversation',stage:'response',beat:8,chosen:2,answers:[0,1,2,0,1,2,0,1,2],tone:{close:3,guard:3,identity:3},ending:'refuse',nightChoice:null,intimacy:false,sex:false,sky:false,events:[]},
 window:{SierraChapterSelect:{available:[true,true,true,true,true,true,true,true,true]},CharacterArcs:{flags:{}},},
 localStorage:{getItem:k=>savedMap.get(k)||null,setItem:(k,v)=>savedMap.set(k,v),removeItem:k=>savedMap.delete(k)},
 document:{createElement:()=>element(),getElementById:id=>ids.get(id)||null},
 $:id=>ids.get(id)||null,
 StoryContinuity:{capture:()=>{},history:()=>({...memory}),reset:()=>{},restore:m=>Object.assign(memory,m)},
 clearControl:()=>{},updateUI:()=>{refreshUI++},renderTerraceDialogue:()=>{rendered++},qaListen:()=>{},setInterval:()=>{},
 beginTerrace:()=>{context.state={chapter:4,mode:'conversation',stage:'question',beat:0,ending:null,events:[]}},
};
for(const n of ['beginPrologue','beginPrelude','beginApartment','beginUprising','beginClub','beginGhost','beginInterval','beginInterlude'])context[n]=()=>{};
vm.createContext(context);vm.runInContext(checkpoint,context,{filename:'chapter-select.js'});
const api=context.window.SierraSave;
assert(api,'Save API was not installed');api.newRun();
assert.equal(api.save(),true,'Terrace response must save as a playable checkpoint');
let snapshot=api.read();assert(snapshot&&snapshot.state,'Terrace save rejected as invalid');
assert.equal(snapshot.chapter,4);assert.equal(snapshot.state.mode,'conversation');assert.equal(snapshot.state.ending,'refuse');assert.equal(snapshot.state.beat,8);
context.state={chapter:-1,mode:'title'};
assert.equal(api.resume(),true,'Terrace resume rejected');
assert.equal(context.state.chapter,4);assert.equal(context.state.mode,'conversation');assert.equal(context.state.ending,'refuse');assert.equal(context.state.beat,8);assert.equal(context.state.chosen,2);
assert.equal(rendered,1,'Must redraw restored Terrace dialogue, not the first beat');assert.equal(refreshUI,1);
assert.equal(memory.terrace,'refuse');
// The final Terrace screen also resumes as an ending, never restarting the conversation.
context.state.mode='won';context.state.stage='ending';context.state.beat=10;
assert.equal(api.save(),true,'Terrace ending checkpoint must be saved');
assert.equal(api.read().state.stage,'ending');
context.state={chapter:-1,mode:'title'};
assert.equal(api.resume(),true,'Terrace ending must resume');
assert.equal(context.state.mode,'won');assert.equal(context.state.stage,'ending');assert.equal(context.state.ending,'refuse');
assert.equal(rendered,2,'Restored ending screen must be rendered');
// The title view cannot be paused by a window.blur handler.
const pauseFn=sources.life.match(/function suspendGame\(\)\{[\s\S]*?\n\}/)?.[0];
assert(pauseFn,'suspendGame was not found');
const mode={state:{mode:'title'},window:{},$(){throw Error('Title should not open pause overlay');}};
vm.createContext(mode);vm.runInContext(pauseFn+'\nsuspendGame()',mode,{filename:'lifecycle.js'});
assert.equal(mode.state.mode,'title','Blur must not pause title');
console.log('PASS 10/10: Terraço válido, decisões/etapa/beat preservados, retomada visual, memória, pausa inicial protegida (Node VM/DOM simulado).');
