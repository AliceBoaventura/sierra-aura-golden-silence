'use strict';
// Controlled Node VM, not browser gameplay. Reproduces a concrete continuity echo.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const context={console,sessionStorage:{removeItem(){}},document:{createElement(){return {textContent:'',className:''};}},state:null,
 clubChoose(index){context.state.response=index;},ghostChoose(index){context.state.response=index;}};
context.window=context;context.globalThis=context;
vm.createContext(context);
for(const name of ['story-continuity.js','character-arcs.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
const source=fs.readFileSync(path.join(root,'club-story.js'),'utf8');
assert.match(source,/Os meus também foram mortos\. Pela guarda\. Eu tinha nove anos\./,'Club parents first choice changed; inspect test');
for(const index of [0,1,2]){
 context.StoryContinuity.reset();
 context.state={chapter:5,mode:'clubDialogue',dialogue:'parents',dialogueStep:0,response:null};
 vm.runInContext(`clubChoose(${index})`,context);
 assert.equal(context.CharacterArcs.flags.clubParents,index,'parents choice not registered');
 const echoes=context.StoryContinuity.lines(7,'map',0);
 assert.equal(echoes.length,1,'chapter 7 must have one conditional parents echo');
 assert.equal(echoes[0].startsWith('SIERRA:'),true);
 assert.doesNotMatch(echoes[0],/história que eu escolhi defender|defendi a bomba|mereciam morrer/i,'Sierra must not claim a stance she never took');
 if(index===0){
  assert.match(echoes[0],/guarda matou meus pais/i,'actual first choice must be recalled accurately');
  assert.match(echoes[0],/Alex/i,'Alexandra must remain the concern');
 }else{
  assert.match(echoes[0],/praça|foto|Alex/i);
 }
 console.log('PASS chapter 7 parents recall, option',index);
}
context.StoryContinuity.reset();
assert.equal(context.StoryContinuity.lines(7,'map',0).length,0,'no parents echo without choice');
console.log('PASS new run does not invent club parents history');
