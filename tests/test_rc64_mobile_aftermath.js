// RC64 mobile-aftermath guard: no silent regression to portrait/dialogue overlap.
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'interval.js'),'utf8');
const css=fs.readFileSync(path.join(root,'rc64-mobile-observation.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(js.includes('const mobile=W<560, floor=H*(mobile?.75:.925);'));
assert(js.includes('const scale=mobile?(talking?.64:.70):Math.min(1.02,H/720);'));
assert(js.includes('panelY=mobile?mt+mh+H*.020:H*.275'));
assert(css.includes('height:25dvh!important;max-height:25dvh!important'));
assert(css.includes('display:flex!important;flex-direction:column!important'));
assert(css.includes('#intervalNext'));
assert(css.includes('overflow-y:auto!important'));
assert(html.indexOf('rc64-mobile-observation.css')>html.indexOf('qa-fixes-20261101.css'));
console.log('RC64 mobile aftermath guard PASS');
