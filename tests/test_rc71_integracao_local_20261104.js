'use strict';
const assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=n=>fs.readFileSync(path.join(root,n),'utf8');
const context={};context.globalThis=context;
vm.runInNewContext(source('ghost-story.js')+'\n;globalThis.__ghostTest=GhostStory;',context);
vm.runInNewContext(source('interval-story.js'),context);
let ghost=0,interval=0;
for(const [chapter,lines] of Object.entries(context.__ghostTest))for(const [i,beat] of lines.entries()){
 assert.equal(typeof beat.line,'string',`Ghost ${chapter}/${i} missing line`);
 assert.equal(beat.choices?.length,3,`Ghost ${chapter}/${i} needs three options`);ghost++;
}
for(const [chapter,lines] of Object.entries(context.IntervalStory))for(const [i,beat] of lines.entries()){
 assert.equal(typeof beat.text,'string',`Interval ${chapter}/${i} missing text`);
 assert.equal(typeof beat.who,'string',`Interval ${chapter}/${i} missing speaker`);interval++;
}
const uprising=source('uprising.js'),html=source('index.html');
for(const id of ['sierra','aura']){
 const name=`depot-final-half-face-${id}.png`,buf=fs.readFileSync(path.join(root,name));
 assert(buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),`${name} not PNG`);
 assert(!uprising.includes(`src="${name}"`),`The relay corridor must not show a private-memory portrait ${name}`);
}
const terrace=source('terrace-story.js');assert(terrace.includes("root.StoryContinuity?.record('linkReciprocity'"),'Reciprocity decision must persist at the terrace');
assert(terrace.includes("root.StoryContinuity?.record('linkKeaneSignal'"),'Keane memory privacy branch must persist');
assert(html.includes('rc71-enlace-portraits.css'),'Portrait styling not loaded');
for(const [n,needle] of [['ghost.js',"const b=lines?.[state.dialogueStep]"],['interval.js',"const entry=IntervalStory?.[state.dialogue]?.[state.lineIndex]"]])assert(source(n).includes(needle),n+' recovery guard absent');
console.log(`RC71 INTEGRACAO LOCAL PASS: ${ghost} Ghost dialogue beats; ${interval} Interval beats; portraits and continuity references.`);
