'use strict';
// The public ALFA has no ?qa chapter selector. Both ending MENU buttons
// must return to the title, rather than silently doing nothing.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const life=fs.readFileSync(path.join(root,'lifecycle.js'),'utf8');
const fn=life.match(/function showChapterMenu\(\)\{[\s\S]*?\n\}/)?.[0];
assert(fn,'Canonical showChapterMenu() not found');
for(const name of ['interval.js','interlude.js']){
 const code=fs.readFileSync(path.join(root,name),'utf8');
 assert(code.includes("$('"+(name==='interval.js'?'chapterSevenMenu':'interludeMenu')+"').onclick=showChapterMenu"),`${name} end MENU is not bound to showChapterMenu`);
}
let reloads=0,qaOpens=0;
const publicContext={URLSearchParams,location:{search:'',reload:()=>reloads++},window:{SierraChapterSelect:{open:()=>qaOpens++}}};
vm.createContext(publicContext);vm.runInContext(fn+'\nshowChapterMenu();',publicContext,{filename:'lifecycle.js'});
assert.equal(reloads,1,'MENU must return to title in public ALFA');
assert.equal(qaOpens,0,'Public ALFA must not expose chapter selector');
const qaContext={URLSearchParams,location:{search:'?qa',reload:()=>reloads++},window:{SierraChapterSelect:{open:()=>qaOpens++}}};
vm.createContext(qaContext);vm.runInContext(fn+'\nshowChapterMenu();',qaContext,{filename:'lifecycle.js'});
assert.equal(qaOpens,1,'QA menu must retain its existing chapter selector');
assert.equal(reloads,1,'QA menu must not reload');
console.log('PASS public ending menus return to title; ?qa selector unchanged (Node VM / DOM-independent)');
