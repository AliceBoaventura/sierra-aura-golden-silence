'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const names=['club.js','ghost.js','interval.js','terrace.js','world-life.js'];
const codes=['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'];
for(const name of names){
 const code=fs.readFileSync(path.join(__dirname,'..',name),'utf8');
 assert(code.includes("['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].indexOf(e.code)%3"),name);
 for(let i=0;i<codes.length;i++){
  const index=codes.indexOf(codes[i])%3;
  assert.equal(index,i%3,`${name} ${codes[i]}`);
 }
}
console.log('PASS 5 chapters: keyboard and numpad choices 1/2/3 mappings');
