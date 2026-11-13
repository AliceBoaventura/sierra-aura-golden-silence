"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const source=fs.readFileSync(path.join(__dirname,"..","game.js"),"utf8");
const bridge=source.slice(source.indexOf("// RC72: keep the optional GPT investigation tool"));
assert(bridge.startsWith("// RC72"));
function probe({hostname="game.example",referrer="",registerTool}={}){
 const context={document:{referrer,modelContext:registerTool?{registerTool}:undefined},location:{hostname},state:{chapter:3,stage:"relay",mode:"playing",clues:[],relay:1,hp:3},URL};
 vm.runInNewContext(bridge,context,{filename:"game.js"});return context;
}
probe();
let called=0;
probe({hostname:"html.itch.zone",registerTool:()=>{called++;throw Error("Blocked");}});
probe({hostname:"content.cdn.example",referrer:"https://wonderlandalic66.itch.io/neorockford",registerTool:()=>{called++;throw Error("Blocked");}});
assert.equal(called,0,"Do not register sandbox-incompatible tools on itch.io");
probe({hostname:"gpt.example",registerTool:def=>{called++;assert.equal(def.name,"read_investigation_status");assert.equal(def.execute().chapter,3);}});
assert.equal(called,1,"Registration on supported hosts must remain available");
probe({hostname:"gpt.example",registerTool:()=>{throw Error("Rejected synchronously");}});
const pending=probe({hostname:"gpt.example",registerTool:()=>Promise.reject(Error("Rejected asynchronously"))});
Promise.resolve().then(()=>new Promise(resolve=>setImmediate(resolve))).then(()=>{
 assert.equal(typeof pending.registerInvestigationContextTool,"function");
 console.log("PASS: absent host, itch.zone, itch.io iframe, supported host, sync throw, async rejection");
}).catch(e=>{console.error(e);process.exitCode=1});
