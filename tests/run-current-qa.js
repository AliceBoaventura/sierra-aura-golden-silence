#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const files=fs.readdirSync(__dirname).filter(n=>/^test_.*\.js$/.test(n)).sort();
let good=0;const fails=[];
for(const name of files){
 const r=cp.spawnSync(process.execPath,[path.join(__dirname,name)],{cwd:path.join(__dirname,'..'),encoding:'utf8',timeout:15000,maxBuffer:1024*1024});
 if(r.status===0){good++;process.stdout.write(`OK ${name}\n`)}
 else{fails.push(name);process.stderr.write(`FAIL ${name}: ${(r.stderr||r.stdout||String(r.error)).slice(-400)}\n`)}
}
console.log(`RESULTADO ${good}/${files.length}`);
if(fails.length)process.exitCode=1;
