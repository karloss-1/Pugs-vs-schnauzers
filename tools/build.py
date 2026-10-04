"""Standard-library alternative to npm run build; creates the same portable play.html."""
from pathlib import Path
import re,base64
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text()
js='\n'.join(re.sub(r'^import .*?;\s*$','',(root/f'src/{name}.js').read_text(),flags=re.M).replace('export ','') for name in ['config','engine','art','renderer','audio','app'])+'\n'
js=js.replace("if('serviceWorker'in navigator)","if(location.protocol!=='file:'&&'serviceWorker'in navigator)")
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+(root/'style.css').read_text()+'</style>').replace('<script type="module" src="./src/app.js"></script>','<script>'+js+'</script>').replace('<link rel="manifest" href="./manifest.webmanifest">','')
for name in ['icons/icon-192.png','icons/apple-touch-icon.png','art/characters.png','art/garden.png']:
 html=html.replace('./assets/'+name,'data:image/png;base64,'+base64.b64encode((root/'assets'/name).read_bytes()).decode())
(root/'play.html').write_text(html)
print('Built play.html with embedded art and original procedural audio.')
