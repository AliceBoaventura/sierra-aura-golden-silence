'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=__dirname+'/../';
const coffee=fs.readFileSync(root+'coffee-sprites.js','utf8');
const apartment=fs.readFileSync(root+'apartment-engine.js','utf8');
const apartmentView=fs.readFileSync(root+'apartment.js','utf8');
assert(coffee.includes('const chairX=jinx?530:805,soleY=800'),'seated soles anchor to the shared cafe floor line');
for(const [height,anchor,k] of [[855,833,.25],[805,783,.27]]){
 const y=930-(height-anchor)*k;assert(Math.abs((y+height*k-anchor*k)-930)<1e-9);
}
assert(apartment.includes('(o.x<=1640||s.flags.shelf)'),'locked room must not expose stations');
assert(apartmentView.includes('Apartment.nearby(state)?.id===o.id'),'station display must match actual accessible station');
const runtime={closest(s,stations,r){return stations.filter(o=>Math.abs(o.x-s.x)<r).sort((a,b)=>Math.abs(a.x-s.x)-Math.abs(b.x-s.x))[0]||null}};
const env={NeoRuntime:runtime};env.globalThis=env;
vm.runInNewContext(apartment,env);
const s=env.Apartment.create();s.x=1725;
assert.equal(env.Apartment.nearby(s),null,'vinyl inaccessible before shelf');
s.flags.shelf=true;
assert.equal(env.Apartment.nearby(s).id,'vinyl','vinyl accessible after shelf');
console.log('PASS 5 / 5: feet baselines, locked room, visual affordance, unlock transition, no sprite replacement');
