import base64,json
from PIL import Image
from pathlib import Path
from playwright.sync_api import sync_playwright
D=Path('/mnt/data/SIERRA_AURA_V106_WORK');OUT=D/'QA_V106'
def enc(p):return 'data:image/png;base64,'+base64.b64encode(Path(p).read_bytes()).decode()
assets={
 'car':enc(D/'cadillac-80.png'),
 'jinx':enc(D/'assets/animation-v102/jinx-0.png'),
 'sierra':enc(D/'assets/animation-v102/sierra-0.png'),
 'scene':enc(D/'assets/visual-v105/service-corridor.png'),
}
# Precropped car, same transparency rectangle measured by engine clubTrim.
car=Image.open(D/'cadillac-80.png').convert('RGBA');a=car.getchannel('A').point(lambda z:255 if z>40 else 0).getbbox();print('car trim',a)
# Source sprite frames have transparent borders, matching registeredDraw's visible-height contract.
sprites={}
for name in ['jinx','sierra']:
 im=Image.open(D/f'assets/animation-v102/{name}-0.png').convert('RGBA'); sprites[name]=im.getbbox()
meta={'carCrop':a,'sprites':sprites,'widthBefore':425,'widthAfter':760,'visibleActorHeight':{'jinx':278,'sierra':218},'carHeightBefore':round(425*(a[3]-a[1])/(a[2]-a[0]),2),'carHeightAfter':round(760*(a[3]-a[1])/(a[2]-a[0]),2)}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 pg=b.new_page(viewport={'width':1450,'height':940},device_scale_factor=1)
 pg.goto('about:blank')
 # All images are embedded locally. This is a compositor test, not a hosted-game test.
 data=json.dumps({'assets':assets,'crop':a,'spr':sprites})
 html='''<html><head><style>body{margin:0;background:#080d18;color:white;font-family:monospace}canvas{display:block;margin:auto;border:1px solid #334;max-width:95vw}h3{font-size:15px;margin:12px 40px}</style></head><body><h3>TESTE DE PROPORÇÃO — art assets originais e coordenadas da V10.6, composição isolada (não captura de gameplay)</h3><canvas id="canvas" width="1400" height="824"></canvas><script id="data" type="application/json">'''+data+'''</script><script>
(async()=>{const cfg=JSON.parse(document.querySelector('#data').textContent),ctx=document.querySelector('canvas').getContext('2d');const ims={};for(let [k,src]of Object.entries(cfg.assets)){const im=new Image;im.src=src;await im.decode();ims[k]=im}
const {carCrop,sprites}=({carCrop:cfg.crop,sprites:cfg.spr});
function row(top,title,carWidth){ctx.fillStyle='#080f1b';ctx.fillRect(0,top,1400,405);ctx.save();ctx.beginPath();ctx.rect(0,top,1400,405);ctx.clip();const cw=1400/2900, sy=top+355;
ctx.drawImage(ims.scene,0,top-180,1400,467); // real stage image, equivalent broad crop
const carLeft=1040-carWidth/2;const crop=cfg.crop;ctx.fillStyle='#010813b0';ctx.beginPath();ctx.ellipse(1040,sy,carWidth*.47,7,0,0,6.29);ctx.fill();
const aspect=(crop[3]-crop[1])/(crop[2]-crop[0]),carHeight=carWidth*aspect;
ctx.drawImage(ims.car,crop[0],crop[1],crop[2]-crop[0],crop[3]-crop[1],carLeft,sy-carHeight,carWidth,carHeight);
function actor(key,x,height){const im=ims[key],box=cfg.spr[key],vis=box[3]-box[1],scale=height/vis,w=(box[2]-box[0])*scale;
ctx.drawImage(im,box[0],box[1],box[2]-box[0],vis,x-w/2,sy-height,w,height);}
actor('jinx',810,278);actor('sierra',1130,218);ctx.fillStyle='#06111cbd';ctx.fillRect(0,top,1400,33);ctx.fillStyle='#e9d8b8';ctx.font='16px monospace';ctx.fillText(title+' / veículo '+carWidth+' unidades / Jinx 278 / Sierra 218',20,top+24);
ctx.restore()}
row(0,'ANTES — V10.5',425);row(410,'DEPOIS — V10.6',760);
})();</script></body></html>'''
 pg.set_content(html,wait_until='load')
 pg.wait_for_timeout(2400)
 pg.screenshot(path=str(OUT/'cadillac_scale_browser_comparison.png'),full_page=True)
 meta['chromiumComposite']=True
 b.close()
(OUT/'car_ratio_metrics.json').write_text(json.dumps(meta,indent=2))
print(json.dumps(meta,indent=2))
