'use strict';
// P44.4 contract modernization; original untouched in tests/legacy_P13_P44.
const {read,assert}=require('./current_depot_fixture');
const match=read('ghost-story.js').match(/const GhostStory=(\{.*?\});\s*function ghostChoose/s);assert.ok(match,'GhostStory missing');const story=JSON.parse(match[1]);
assert.equal(story.intimacy[1].choices.length,3);
for(const [i,text] of [[0,'Guardei. A voz está no fim da fita'],[1,'Agora quero ouvir as duas gravações'],[2,'achei que fosse defeito do transmissor']])assert.ok(story.intimacy[1].choices[i][1].includes(text));
assert.ok(story.callJinx[0].line.includes('Cadillac'));assert.ok(!story.callJinx[0].line.includes('moto'));
assert.ok(/<title>[^<]*Build Única[^<]*<\/title>/.test(read('index.html')),'must carry current build title');assert.ok(read('qa.js').includes('build:'));
console.log('PASS: P13 narrative contract preserved, current revision identified');
