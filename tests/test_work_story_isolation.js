'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
function mkBox(){let aside={textContent:'',className:'club-aside'};return {
 aside,querySelector(selector){return selector==='.club-aside'?this.aside:selector==='.club-line'?{tag:'line'}:null;},
 insertBefore(n){this.aside=n;},appendChild(n){this.aside=n;}
};}
const club=mkBox(),ghost=mkBox();
const ClubStory={return:[{},{},{aside:'BASE CLUB'}]},GhostStory={arrival:[{},{aside:'BASE GHOST'}]};
const context={ClubStory,GhostStory,Interlude:{speak:(state,id)=>{state.dialogueLines=[];}},state:{},
 document:{getElementById:(id)=>({clubDialogue:club,ghostDialogue:ghost})[id],createElement:(tag)=>({tag, textContent:'',className:''})},
 renderClubDialogue:()=>{club.aside.textContent=ClubStory.return[2].aside;},
 renderGhostDialogue:()=>{ghost.aside.textContent=GhostStory.arrival[1].aside;}};
context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/../narrative-consequences.js','utf8'),context);
let checks=0;
function test(x,message){assert(x,message);checks++;}
for(let index=0;index<3;index++){
 context.state={chapter:5,dialogue:'return',dialogueStep:2,response:null,answers:[{beat:'closeness:0',choice:index}]};context.renderClubDialogue();
 test(club.aside.textContent!=='BASE CLUB','club consequence '+index);
 test(ClubStory.return[2].aside==='BASE CLUB','canonical club story changed');
 context.state={chapter:6,dialogue:'arrival',dialogueStep:1,response:null,answers:[{beat:'auraCall:0',choice:index}]};context.renderGhostDialogue();
 test(ghost.aside.textContent!=='BASE GHOST','ghost consequence '+index);
 test(GhostStory.arrival[1].aside==='BASE GHOST','canonical ghost story changed');
}
// New runs with no choice must immediately render unmodified canon.
context.state={chapter:5,dialogue:'return',dialogueStep:2,response:null,answers:[]};context.renderClubDialogue();
test(club.aside.textContent==='BASE CLUB','club previous-run text leaked');
context.state={chapter:6,dialogue:'arrival',dialogueStep:1,response:null,answers:[]};context.renderGhostDialogue();
test(ghost.aside.textContent==='BASE GHOST','ghost previous-run text leaked');
console.log(`${checks}/${checks} Work regressions: branch-local consequences, canonical source unchanged, and new-run isolation`);
