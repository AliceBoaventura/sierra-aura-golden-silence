'use strict';
// Node VM event harness. It does not simulate a real browser's native click/default action.
// Reproduces the global keydown handler's cancellation of Space on focused visible controls.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','game.js'),'utf8');
const begin=source.indexOf("qaListen(window,'keydown',e=>{");
const end=source.indexOf(";qaListen(window,'keyup'",begin);
assert(begin>=0&&end>begin,'Canonical global keydown handler not found');
const handlerSource=source.slice(begin,end+1);
function harness(mode){
 let handler,pauses=0;
 const context={window:{},document:{getElementById:()=>null},state:{mode},
  keys:new Set(),tapQueue:new Set(),pause:()=>pauses++,qaListen:(obj,type,fn)=>{assert.equal(type,'keydown');handler=fn;}};
 vm.createContext(context);vm.runInContext(handlerSource,context,{filename:'game.js'});
 return {context,dispatch(code,target,repeat=false){let prevented=false,stopped=false;
  handler({code,target,repeat,preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}});
  return {prevented,stopped};
 },get pauses(){return pauses;}};
}
function target(tag,{hidden=false,visible=true}={}){
 const el={tagName:tag.toUpperCase(),getClientRects:()=>visible?[{width:80,height:30}]:[],
  closest(selector){
   if(selector==='.hidden,[inert]')return hidden?{className:'hidden'}:null;
   if(selector==='button,select,input,textarea,a[href],[role="button"]')return /^(button|select|input|textarea|a)$/.test(tag)?el:null;
   return null;
  }};
 return el;
}
let checks=0;
function check(condition,reason){assert(condition,reason);checks++;}
const title=harness('title');
for(const name of ['INICIAR INVESTIGAÇÃO','CONTINUAR SALVO']){
 const r=title.dispatch('Space',target('button'));
 check(!r.prevented,`Space on ${name} must keep native button activation`);
}
const paused=harness('paused');
check(!paused.dispatch('Space',target('button')).prevented,'Space on CONTINUAR in pause layer must keep native button activation');
const puzzle=harness('intervalPuzzle');
check(!puzzle.dispatch('Space',target('select')).prevented,'Space on focused native select must remain available to the puzzle');
check(!puzzle.dispatch('Space',target('input')).prevented,'Space on focused input must not be stolen');
const playing=harness('playing');
check(!playing.dispatch('Space',target('button')).prevented,'Space on visible HUD button must keep native activation');
check(playing.dispatch('Space',target('button',{hidden:true})).prevented,'Hidden former-title button must not block gameplay Space');
check(playing.dispatch('Space',target('button',{visible:false})).prevented,'Invisible former button must not block gameplay Space');
check(playing.dispatch('Space',target('div')).prevented,'Space during active gameplay must still be intercepted for jump');
check(playing.context.tapQueue.has('jump'),'Space during gameplay must still queue jump');
check(playing.dispatch('KeyE',target('button')).prevented,'KeyE game interaction must remain mapped');
check(playing.context.tapQueue.has('use'),'KeyE must still queue interaction');
const escape=harness('playing');escape.dispatch('Escape',target('div'));
check(escape.pauses===1,'Escape must still invoke pause');
console.log(`PASS ${checks}/${checks}: visible controls keep native Space, hidden controls do not intercept gameplay, movement/use/pause preserved (Node VM only)`);
