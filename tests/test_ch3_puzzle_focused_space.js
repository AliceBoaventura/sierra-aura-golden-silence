'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'..','uprising.js'),'utf8');
const start=code.indexOf("qaListen(window,'keydown',e=>{");
const end=code.indexOf('},true);',start)+('},true);').length;
assert(start>=0&&end>start,'Chapter 3 dialog key listener exists');
let handler,continueCount=0,choiceCounts=[0,0,0];
const btns=choiceCounts.map((_,i)=>({click(){choiceCounts[i]++}}));
const env={window:{},state:{chapter:3,mode:'dialogue'},StoryContinuity:{},
 qaListen:(_win,ev,fn)=>{assert.equal(ev,'keydown');handler=fn;},
 document:{activeElement:btns[0]},
 $:id=>id==='overlay'?{querySelectorAll:()=>btns}:id==='continue'?{click(){continueCount++}}:null};
vm.createContext(env);vm.runInContext(code.slice(start,end),env);
function fire(code,repeat=false){let prevented=false,stopped=false;handler({code,repeat,preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});return {prevented,stopped};}
for(const [code,i] of [['Digit1',0],['Digit2',1],['Numpad3',2]]){let res=fire(code);assert(res.prevented&&res.stopped);assert.equal(choiceCounts[i],1)}
let r=fire('Space');assert(r.prevented);assert.equal(choiceCounts[0],2,'Space activates focused response');
r=fire('Space',true);assert(r.prevented);assert.equal(choiceCounts[0],2,'Repeat must not double-activate responses');
env.$=id=>id==='overlay'?{querySelectorAll:()=>[]}:id==='continue'?{click(){continueCount++}}:null;
fire('Enter');assert.equal(continueCount,1,'Enter advances simple dialogue');
env.state.mode='playing';assert.equal(fire('Space').prevented,false,'Space in world movement is not intercepted by dialogue');
assert(!/\.puzzle-panel|puzzleCursor|rotate\(/.test(code.slice(start,end)),'Removed relay puzzle keyboard shortcuts must not return');
console.log('PASS chapter 3 current dialogue keyboard choices, repeat guards and no obsolete puzzle shortcuts');
