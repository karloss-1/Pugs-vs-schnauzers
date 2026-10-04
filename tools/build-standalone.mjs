import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
let html=await readFile(new URL('index.html',root),'utf8');
const style=await readFile(new URL('style.css',root),'utf8');
let js='';for(const file of ['config','engine','art','renderer','audio','app']){js+=(await readFile(new URL(`src/${file}.js`,root),'utf8')).replace(/^import .*?;\s*$/gm,'').replace(/export /g,'')+'\n';}
js=js.replace("if('serviceWorker'in navigator)","if(location.protocol!=='file:'&&'serviceWorker'in navigator)");
html=html.replace('<link rel="stylesheet" href="./style.css">',`<style>${style}</style>`).replace('<script type="module" src="./src/app.js"></script>',`<script>${js}</script>`);
for(const name of ['icon-192.png','apple-touch-icon.png']){const bytes=await readFile(new URL('assets/icons/'+name,root));html=html.replaceAll('./assets/icons/'+name,'data:image/png;base64,'+bytes.toString('base64'));}
html=html.replace('<link rel="manifest" href="./manifest.webmanifest">','');
// Preload icon strings in the bundled script too.
for(const name of ['icon-192.png','apple-touch-icon.png']){const bytes=await readFile(new URL('assets/icons/'+name,root));html=html.replaceAll('./assets/icons/'+name,'data:image/png;base64,'+bytes.toString('base64'));}
for(const name of ['characters.png','garden.png']){const bytes=await readFile(new URL('assets/art/'+name,root));html=html.replaceAll('./assets/art/'+name,'data:image/png;base64,'+bytes.toString('base64'));}
await writeFile(new URL('play.html',root),html);
