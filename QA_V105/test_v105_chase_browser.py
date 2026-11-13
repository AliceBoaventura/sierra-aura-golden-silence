"""Non-deployment Chromium QA. Browser image CORS shim is harness-only."""
from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import json,mimetypes,traceback
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(__file__).parent
ORIGIN='https://v105.qa.invalid/'
report={'errors':[],'missing':[],'steps':[]}
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
 ctx=browser.new_context(viewport={'width':1280,'height':720},device_scale_factor=1)
 def serve(route):
  url=urlparse(route.request.url);path=(ROOT/unquote(url.path).lstrip('/')).resolve()
  if not path.is_relative_to(ROOT) or not path.is_file():
   report['missing'].append(url.path);return route.fulfill(status=404,body='not found')
  return route.fulfill(status=200,body=path.read_bytes(),content_type=mimetypes.guess_type(path.name)[0] or 'application/octet-stream',headers={'Access-Control-Allow-Origin':'*'})
 ctx.route('**/*',serve)
 page=ctx.new_page()
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 page.on('console',lambda m:report['errors'].append('console:'+m.text[:250]) if m.type=='error' else None)
 shim="""<script>(()=>{const ImageOriginal=window.Image;window.Image=class QAImage extends ImageOriginal{constructor(){super();this.crossOrigin='anonymous';}};const d={};try{localStorage.setItem('qa_tmp','1');localStorage.removeItem('qa_tmp')}catch{Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>d[k]||null,setItem:(k,v)=>d[k]=String(v),removeItem:k=>delete d[k],clear:()=>{},key:k=>Object.keys(d)[k]||null,get length(){return Object.keys(d).length}}})}})();</script>"""
 html=(ROOT/'index.html').read_text().replace('<head>','<head><base href="'+ORIGIN+'">'+shim,1)
 def state():
  return page.evaluate("""() => ({chapter:state.chapter,stage:state.stage,mode:state.mode,x:Math.round(state.x),jinxX:Math.round(state.jinxX),hp:state.hp,latchRead:!!state.flags.latchRead,latch:!!state.flags.latch,guards:state.pursuit?.guards.length||0,dialogue:state.dialogue})""")
 try:
  page.set_content(html,wait_until='load',timeout=45000);page.wait_for_timeout(950)
  assert page.evaluate('ready'),'Boot did not load'
  page.locator('#chooseFromTitle').click(timeout=5000)
  page.locator('#chapterPicker [data-episode="5"]').click(timeout=5000)
  page.wait_for_timeout(300)
  page.evaluate("""() => {state.flags.module=true;state.flags.met=true;Club.change(state,'booth');state.x=2070;state.mode='playing';state.useWas=true;document.querySelector('#clubDialogue').classList.add('hidden');} """)
  page.keyboard.press('e');page.wait_for_timeout(300)
  assert state()['dialogue']=='closeness',state()
  for _ in range(6):
   if state()['stage']=='raid':break
   if page.locator('#clubAnswer0:visible').count():page.locator('#clubAnswer0').click(timeout=3000)
   elif page.locator('#clubNext:visible').count():page.locator('#clubNext').click(timeout=3000)
   else:raise AssertionError('club transition stalled: '+str(state()))
   page.wait_for_timeout(90)
  scene=state();report['steps'].append(['booth_to_raid',scene])
  assert scene['stage']=='raid' and scene['mode']=='playing',scene
  assert page.locator('#clubDialogue').is_hidden(),'firefight is paused by a dialogue overlay'
  assert scene['guards']==2,'extra guards on the evacuation floor'
  page.evaluate("""() => {state.x=3025;state.jinxX=2950;state.pursuit.inv=10;state.useWas=true;}""")
  page.keyboard.down('ArrowRight');page.wait_for_timeout(600);page.keyboard.up('ArrowRight')
  scene=state();report['steps'].append(['raid_run',scene])
  assert scene['x']>3030,scene
  page.screenshot(path=str(OUT/'raid_running_actual_controls.png'),animations='disabled')
  page.keyboard.press('e');page.wait_for_timeout(300)
  scene=state();report['steps'].append(['raid_exit',scene])
  assert scene['stage']=='escape' and scene['guards']==1,scene
  page.evaluate("""() => {state.x=1370;state.jinxX=1240;state.pursuit.inv=10;state.useWas=false;state.mode='playing';}""")
  page.keyboard.down('q');page.wait_for_timeout(1120);page.keyboard.up('q')
  scene=state();report['steps'].append(['reader_scanner',scene])
  assert scene['latchRead'],scene
  page.screenshot(path=str(OUT/'service_reader_scanned.png'),animations='disabled')
  page.keyboard.press('e');page.wait_for_timeout(250)
  scene=state();report['steps'].append(['reader_opened',scene])
  assert scene['latch'],scene
  page.evaluate("""() => {state.x=2610;state.jinxX=2520;state.pursuit.inv=10;state.useWas=false;}""")
  page.keyboard.press('e');page.wait_for_timeout(300)
  scene=state();report['steps'].append(['boarding_dialogue',scene])
  assert scene['mode']=='clubDialogue' and scene['dialogue']=='boarding',scene
  assert scene['guards']==0,'guards should stop firing once both board'
  page.locator('#clubAnswer0').click(timeout=3000)
  page.locator('#clubNext').click(timeout=3000)
  page.wait_for_timeout(250)
  scene=state();report['steps'].append(['cadillac',scene])
  assert scene['stage']=='drive' and scene['mode']=='playing',scene
  page.screenshot(path=str(OUT/'cadillac_departure_browser.png'),animations='disabled')
  page.set_viewport_size({'width':390,'height':844})
  page.evaluate("""() => {Club.change(state,'raid');state.x=3025;state.jinxX=3170;state.mode='playing';state.useWas=true;state.pursuit.inv=15;}""")
  page.wait_for_timeout(260)
  page.screenshot(path=str(OUT/'raid_mobile_390x844.png'),animations='disabled')
  report['mobile']={'viewport':390,'scrollWidth':page.evaluate('document.documentElement.scrollWidth'),'stage':state()['stage']}
  assert report['mobile']['scrollWidth']<=395,report['mobile']
 except Exception as exc:
  report['exception']=str(exc);report['traceback']=traceback.format_exc()[-1500:]
 finally:
  report['pass']=not report['errors'] and not report['missing'] and 'exception' not in report
  (OUT/'directed_chase_browser.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
  print(json.dumps({k:v for k,v in report.items() if k!='traceback'},indent=2,ensure_ascii=False))
  browser.close()
