'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');let count=0;
const radios=[],faults=[];
class StubImage{set src(x){this.path=x;}}
const element={classList:{add(){},remove(){},contains(){return false;}},style:{},onclick:null};
const env={console,Image:StubImage,performance:{now:()=>0},document:{querySelector:()=>element,querySelectorAll:()=>[]},qaListen(){},radio:(...args)=>radios.push(args),beep(){},reportGameFault:(part,error)=>faults.push([part,error.message])};
delete env['$'];env.$=()=>element;env.window=env;env.globalThis=env;
vm.createContext(env);
for(const f of ['runtime.js','apartment-engine.js','apartment.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),env,{filename:f});
function test(name,fn){fn();count++;console.log('PASS',name);}
function fresh(flags){const s=env.Apartment.create();Object.assign(s.flags,flags);s.y=800;s.grounded=true;s.useWas=false;env.state=s;return s;}
function use(s,x){s.x=x;s.useWas=false;env.Apartment.step(s,{use:true},.016);return s.events;}
test('pre-repair workbench is usable as intended',()=>{const s=fresh({metAura:true,shelf:true});assert.equal(env.Apartment.nearby({...s,x:2250})?.id,'workbench');assert.equal(use(s,2250)[0]?.type,'repairTogether');assert.equal(s.mode,'dialogue');});
test('finished workbench is removed from available interactions',()=>{const s=fresh({metAura:true,repairedTogether:true,shelf:true,power:true,recognized:true,terminal:true});s.x=2250;assert.notEqual(env.Apartment.nearby(s)?.id,'workbench');assert(use(s,2250).every(e=>e.type!=='story')); assert.equal(s.mode,'playing');assert.equal(s.flags.workbench,undefined);});
test('following the terminal instruction allows Aura farewell',()=>{const s=fresh({metAura:true,repairedTogether:true,shelf:true,power:true,recognized:true,terminal:true});assert.equal(use(s,2450)[0].type,'farewell');assert.equal(s.mode,'dialogue');});
test('valid apartment story still presents its radio line',()=>{const s=fresh({});s.events.push({type:'story',id:'power'});const before=radios.length;vm.runInContext('apartmentEvents()',env);assert.equal(s.events.length,0);assert.equal(radios.length,before+1);assert.match(radios.at(-1)[1],/Cortei/);});
test('unexpected story event is reported, not reexecuted forever',()=>{const s=fresh({});s.events.push({type:'story',id:'workbench'});const prev=faults.length;vm.runInContext('apartmentEvents()',env);vm.runInContext('apartmentEvents()',env);assert.equal(s.events.length,0);assert.equal(faults.length,prev+1);assert.match(faults.at(-1)[1],/workbench/);});
test('repaired workbench cannot corrupt progress on repeated touch',()=>{const s=fresh({metAura:true,repairedTogether:true,shelf:true,power:true,recognized:true,terminal:true});for(let i=0;i<12;i++){use(s,2250);s.useWas=false;}assert.equal(s.mode,'playing');assert(s.events.every(e=>e.type!=='story'));assert.equal(s.flags.repairedTogether,true);});
test('chapter title does not display continue while loading assets',()=>{const src=fs.readFileSync(path.join(root,'chapter-select.js'),'utf8');assert(src.includes('visible=!!saved&&canResume(saved)'));});
console.log('CH2 LOCKUP RESULT',count+'/'+count);
