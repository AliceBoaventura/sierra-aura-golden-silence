from playwright.sync_api import sync_playwright
import json,time
from pathlib import Path
root=Path(__file__).parent
obs={"load":{},"scenes":{},"errors":[],"failedRequests":[]}
url='http://127.0.0.1:8776/index.html?qa=v106'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--ignore-gpu-blocklist'])
 pg=b.new_page(viewport={"width":1365,"height":768},device_scale_factor=1)
 pg.on('pageerror',lambda e:obs['errors'].append(str(e)))
 pg.on('console',lambda e:obs['errors'].append('console: '+e.text) if e.type=='error' else None)
 pg.on('requestfailed',lambda r:obs['failedRequests'].append(r.url))
 pg.goto(url,wait_until='load',timeout=45000)
 pg.wait_for_function("document.querySelector('#start') && !document.querySelector('#start').disabled",timeout=30000)
 pg.wait_for_timeout(650)
 obs['load']={'startEnabled':True,'status':pg.locator('#start').inner_text()}
 # Activate the genuine chapter 5 engine and place actors at the fully traversed ramp.
 pg.evaluate('''() => {beginClub();Club.change(state,'escape');state.mode='playing';state.flags.latch=true;state.flags.latchRead=true;state.x=2300;state.jinxX=2180;state.face=1;state.vx=0;state.pursuit.guards=[];state.pursuit.shots=[];document.getElementById('clubDialogue').classList.add('hidden');state.events=[];}''')
 pg.wait_for_timeout(650)
 pg.screenshot(path=str(root/'escape_cadillac_desktop.png'))
 obs['scenes']['escape'] = pg.evaluate('''() => ({chapter:state.chapter,stage:state.stage,x:state.x,car:{center:2500,width:760,ground:800},jinxX:state.jinxX,near:Club.near(state)?.id,ready:cadillacTile?.w>0})''')
 # Test that the real interactable is reachable and opens the approved boarding dialogue.
 pg.evaluate('''() => {state.x=2630;state.jinxX=2560;state.mode='playing';state.useWas=false;Club.step(state,{use:true},.016);clubEvents();}''')
 obs['scenes']['boarding'] = pg.evaluate('''() => ({mode:state.mode,dialogue:state.dialogue,near:Club.near(state)?.id,stage:state.stage})''')
 # The drive retains the wheel hubs and puts seats behind the original side glass.
 pg.evaluate('''() => {Club.change(state,'drive');state.mode='playing';state.driveTime=1.3;state.events=[];document.getElementById('clubDialogue').classList.add('hidden');}''')
 pg.wait_for_timeout(450);pg.screenshot(path=str(root/'drive_cadillac_desktop.png'))
 obs['scenes']['drive']=pg.evaluate('''() => ({stage:state.stage,driveTime:state.driveTime,carLoaded:!!cadillacTile})''')
 # Actual investigation scene with live movement and unique markers.
 pg.evaluate('''() => {beginPrelude();state.stage='trace';state.mode='playing';state.x=700;state.y=800;state.jinxX=530;state.flags.terminal=true;state.flags.credential=true;state.flags.camera=true;state.scan=false;state.events=[];}''')
 pg.keyboard.down('ArrowRight');pg.wait_for_timeout(650);pg.keyboard.up('ArrowRight');pg.wait_for_timeout(200)
 pg.screenshot(path=str(root/'trace_investigation_desktop.png'))
 obs['scenes']['trace']=pg.evaluate('''() => ({chapter:state.chapter,narrative:state.narrative,stage:state.stage,x:Math.round(state.x),foot:state.foot,investigationAssets:NeoActors.investigationFrames.filter(im=>im.complete&&im.naturalWidth>0).length,near:Prelude.near(state)?.id})''')
 # Chapter 2 (apartment): activate original logic and walk to evidence without reauthoring puzzles.
 pg.evaluate('''() => {beginApartment();state.mode='playing';state.x=850;state.y=800;state.events=[];}''')
 pg.keyboard.down('ArrowRight');pg.wait_for_timeout(600);pg.keyboard.up('ArrowRight');pg.wait_for_timeout(120)
 pg.screenshot(path=str(root/'chapter2_investigation_desktop.png'))
 obs['scenes']['chapter2']=pg.evaluate('''() => ({chapter:state.chapter,x:Math.round(state.x),metAura:state.flags.metAura??false,foot:state.foot,assets:NeoActors.investigationFrames.filter(i=>i.complete&&i.naturalWidth>0).length})''')
 # Mobile-size sanity check: canvas still renders and car/hotspot logic remain available.
 pg.set_viewport_size({'width':390,'height':844});pg.evaluate('''() => {beginClub();Club.change(state,'escape');state.mode='playing';state.flags.latch=true;state.x=2480;state.jinxX=2400;state.pursuit.guards=[];state.pursuit.shots=[];document.getElementById('clubDialogue').classList.add('hidden');state.events=[];}''');pg.wait_for_timeout(350)
 pg.screenshot(path=str(root/'escape_cadillac_mobile.png'))
 obs['scenes']['mobile']=pg.evaluate('''() => ({viewport:[innerWidth,innerHeight],carLoaded:!!cadillacTile,stage:state.stage,bodyOverflow:document.documentElement.scrollWidth>innerWidth})''')
 b.close()
(root/'browser_result.json').write_text(json.dumps(obs,indent=2,ensure_ascii=False))
print(json.dumps(obs,indent=2,ensure_ascii=False))
