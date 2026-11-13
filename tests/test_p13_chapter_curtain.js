'use strict';
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const dir=path.join(__dirname,'..');
const calls=[];
function classes(){const s=new Set();return {add(...a){a.forEach(x=>s.add(x));},remove(...a){a.forEach(x=>s.delete(x));},toggle(x,v){if(v)s.add(x);else s.delete(x);},contains(x){return s.has(x)}};}
const heading={textContent:'',classList:classes()},subtitle={textContent:''};
const surface={classList:classes(),setAttribute(){},innerHTML:'',querySelector(s){return s==='.cc-heading'?heading:subtitle}};
const doc={createElement(){return surface},body:{appendChild(){}},getElementById(){return null}};
const window={};const ctx={window,document:doc,setTimeout(fn){setImmediate(fn)},console};
vm.runInNewContext(fs.readFileSync(path.join(dir,'chapter-curtain.js'),'utf8'),ctx);
const C=window.ChapterCurtain;
assert(C&&Object.keys(C.chapters).length===8);
(async()=>{
 for(let n=1;n<=8;n++){
  let entered=0;
  const result=await C.to(n,()=>{entered++;calls.push([n,heading.textContent,subtitle.textContent,C.active]);});
  assert.equal(result,true);assert.equal(entered,1);assert.equal(C.active,false);
  assert.equal(calls.at(-1)[3],true);
 }
 assert.equal(calls[0][1],'CHAPTER 01');assert.equal(calls[7][1],'INTERLUDE');
 assert.equal(await C.to(999,()=>{}),false);
 const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 assert(html.includes('chapter-curtain.css')&&html.includes('chapter-curtain.js'));
 const hooks={
  'prologue.js':'ChapterCurtain.to(1,beginPrelude)',
  'prelude.js':'ChapterCurtain.to(2,beginApartment)',
  'apartment.js':'ChapterCurtain.to(3,beginUprising)',
  'uprising.js':'ChapterCurtain.to(4,beginTerrace)',
  'terrace.js':'ChapterCurtain.to(5,beginClub)',
  'club.js':'ChapterCurtain.to(6,beginGhost)',
  'ghost.js':'ChapterCurtain.to(7,beginInterval)',
  'interval.js':'ChapterCurtain.to(8,openInterlude)'};
 for(const [f,s] of Object.entries(hooks))assert(fs.readFileSync(path.join(dir,f),'utf8').includes(s),f);
 console.log('PASS: 8 title cards, 8 campaign hooks, lifecycle and assets');
})().catch(e=>{console.error(e);process.exitCode=1});
