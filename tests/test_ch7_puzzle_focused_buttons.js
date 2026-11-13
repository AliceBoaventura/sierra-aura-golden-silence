'use strict';
// Node VM with a simulated DOM: confirms that the canonical handler does not
// consume Enter intended for a focused puzzle control. Not a browser test.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'..','interval.js'),'utf8');
const from=source.indexOf("qaListen(window,'keydown',e=>{");
assert(from>=0,'Canonical chapter 7 keyboard handler not found');
const to=source.indexOf('},true);',from);
assert(to>from,'Canonical chapter 7 keyboard handler terminator not found');
const snippet=source.slice(from,to+'},true);'.length);
const calls=[];let handler;
const state={chapter:7,mode:'intervalPuzzle',puzzle:{kind:'patch',paths:[2,0,1],error:false}};
const controls={intervalBack:{click(){calls.push('back')}},intervalConnect:{click(){calls.push('commit')}},isoBack:{click(){calls.push('back')}},isoCommit:{click(){calls.push('commit')}}};
const context={window:{},state,qaListen:(_w,type,cb)=>{assert.equal(type,'keydown');handler=cb;},$:(id)=>controls[id],Interval:{rotate:(_s,i)=>calls.push('rotate:'+i)},paintIntervalPuzzle:()=>calls.push('paint'),intervalNotes:()=>{},intervalAfterDialogue:()=>{},IntervalStory:{}};
vm.createContext(context);vm.runInContext(snippet,context,{filename:'interval.js'});
function press(code,focus){calls.length=0;let prevented=false,stopped=false;
 const target={closest(selector){if(selector==='.rc36-toggle')return null;if(selector==='#intervalPuzzle button, #intervalPuzzle select')return focus?{id:focus}:null;return null;}};
 handler({code,target,repeat:false,preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});
 return {calls:[...calls],prevented,stopped};
}
for(const [kind,id] of [['patch','intervalBack'],['hack','isoBack']]){
 state.puzzle.kind=kind;
 const result=press('Enter',id);
 assert.deepEqual(result.calls,[],`Enter on focused ${id} must defer to native activation`);
 assert.equal(result.prevented,false,`Enter on focused ${id} must not be cancelled`);
}
state.puzzle.kind='hack';
const select=press('Enter','iso0');
assert.deepEqual(select.calls,[],'Enter on focused select must not submit');
assert.equal(select.prevented,false);
state.puzzle.kind='patch';
const pathButton=press('Enter','intervalPath0');
assert.deepEqual(pathButton.calls,[],'Enter on focused path button must not submit');
assert.equal(pathButton.prevented,false);
assert.deepEqual(press('Enter',null).calls,['commit'],'Enter with no focused control retains shortcut');
assert.deepEqual(press('KeyE',null).calls,['commit'],'E retains confirm shortcut');
assert.deepEqual(press('Escape',null).calls,['back'],'Escape retains return shortcut');
assert.deepEqual(press('Digit1',null).calls,['rotate:0','paint'],'Digits retain puzzle controls');
// Engine-only progression regression: valid paths advance to the next dialogue,
// invalid isolation policies never set the success flag. Still not gameplay.
const engineContext={window:{},NeoRuntime:{reset(){}}};
vm.createContext(engineContext);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','interval-engine.js'),'utf8'),engineContext);
const engine=engineContext.window.Interval;
const patched=engine.create();patched.mode='intervalPuzzle';patched.puzzle={kind:'patch',paths:[0,1,2],error:false};
assert.equal(engine.solve(patched),true);assert.equal(patched.flags.patch,true);
assert.equal(patched.mode,'intervalDialogue');assert.equal(patched.dialogue,'patched');
const isolated=engine.create();isolated.mode='intervalPuzzle';isolated.puzzle={kind:'hack',paths:[0,0,0],target:[1,2,0],error:false};
assert.equal(engine.solve(isolated),false);assert.equal(isolated.flags.hack,undefined);assert.equal(isolated.puzzle.error,true);
isolated.puzzle.paths=[1,2,0];assert.equal(engine.solve(isolated),true);
assert.equal(isolated.flags.hack,true);assert.equal(isolated.mode,'intervalDialogue');assert.equal(isolated.dialogue,'hacked');
console.log('PASS Node VM: Cap7 focused puzzle controls, shortcuts and patch/hack progression');
