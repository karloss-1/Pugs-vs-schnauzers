import {artReady} from './art.js';
import {Game} from './engine.js';
import {WORLD,PUGS,WAVES} from './config.js';
import {Renderer,paintPortrait} from './renderer.js';
import {Audio} from './audio.js';
const $=id=>document.getElementById(id),canvas=$('game'),renderer=new Renderer(canvas),audio=new Audio();
let selected=null,removing=false,last=0,uiClock=0,toastUntil=0,bannerUntil=0,guideWasPlaying=false,ready=false;
const game=new Game({seed:Math.floor(Math.random()*100000),onEvent:handleEvent});
const hints=['Tu primera misión: coloca a Chef Migajas en una casilla de la izquierda.','Ahora coloca a Capitán Guau a la derecha del Chef, en el mismo carril.','Defiende los cinco carriles. Toca los premios dorados para recogerlos.'];
const cardNodes=new Map();
for(const d of PUGS){const b=document.createElement('button');b.className='pug-card';b.dataset.type=d.id;b.setAttribute('aria-label',`${d.name}, ${d.role}, ${d.cost} premios`);b.setAttribute('aria-pressed','false');b.style.setProperty('--accent',d.color);b.innerHTML=`<canvas width="100" height="94" aria-hidden="true"></canvas><span class="card-info"><strong>${d.name}</strong><small>${d.short}</small><b class="card-cost"><span>✦</span> ${d.cost}</b></span><i class="cooldown-shade"></i><span class="cooldown-label"></span>`;b.onclick=()=>select(d.id);$('cards').append(b);paintPortrait(b.querySelector('canvas'),d.id);cardNodes.set(d.id,b);}
paintPortrait($('hero-pug'),'bark');paintPortrait($('hero-enemy'),'basic',true);
function select(type){if(game.status!=='playing')return;audio.unlock();removing=false;selected=selected===type?null:type;audio.play('select');const d=PUGS.find(d=>d.id===type);if(selected)toast(game.tutorial<2&&selected!==(game.tutorial===0?'chef':'bark')?'Primero completa los dos pasos del tutorial.':d.role);updateUI();}
function toast(message,seconds=2.4){$('toast').textContent=message;$('toast').classList.add('show');toastUntil=performance.now()+seconds*1000;}
function handleEvent(e){audio.play(e.type,e.unit);if(e.type==='invalid')toast(e.reason,1.3);
 if(e.type==='tutorial'){selected=e.step===1?'bark':null;$('hint').textContent=hints[e.step];}
 if(e.type==='wave'){showBanner(`Oleada ${e.number} · ${e.name}`,3);if(e.number===3)toast('Turbo corre rápido. ¡Polar puede frenarlo!',4);if(e.number===4)toast('Don Cojín aguanta a los Grandotes.',4);if(e.number===5)toast('Rompe la olla con ataques. Brasa quema grupos.',4);if(e.number===6)toast('Saltimbanqui salta una unidad. Coloca otra detrás.',5);if(e.number>1)$('hint').textContent='';}
 if(e.type==='boss'){showBanner('♛ EL BARÓN VON BIGOTES',4);$('hint').textContent='La fila naranja anuncia su habilidad. ¡Ataca durante la preparación!';}
 if(e.type==='bossWarning')toast(e.text,2.5);if(e.type==='bossPhase'){showBanner('¡Bigotes despeinados! Fase 2',3);}
 if(e.type==='breach')toast('¡Entraron al patio! Protege los carriles abiertos.',3);
 if(e.type==='won'||e.type==='lost'){selected=null;removing=false;showResult(e);}
 updateUI();}
function showBanner(text,seconds){$('banner').textContent=text;$('banner').hidden=false;bannerUntil=performance.now()+seconds*1000;}
function updateUI(){ $('treats').textContent=game.treats;$('lives').textContent='♥ '.repeat(Math.max(0,game.lives))+'♡ '.repeat(3-Math.max(0,game.lives));$('lives').setAttribute('aria-label',`${game.lives} oportunidades`);$('wave-number').textContent=`${game.wave} / 9`;$('wave-label').textContent=game.wave?WAVES[game.wave-1].name:'Prepara tu defensa';$('wave-fill').style.width=Math.min(100,game.time/330*100)+'%';
 for(const d of PUGS){const b=cardNodes.get(d.id),cool=game.cooldowns[d.id]||0;b.classList.toggle('selected',selected===d.id);b.classList.toggle('unavailable',game.treats<d.cost||cool>0);b.setAttribute('aria-pressed',String(selected===d.id));b.querySelector('.cooldown-shade').style.height=(cool/d.cooldown*100)+'%';b.querySelector('.cooldown-label').textContent=cool>0?Math.ceil(cool)+'s':'';}
 $('remove').classList.toggle('selected',removing);$('pause').disabled=game.status!=='playing'&&game.status!=='paused';const boss=game.enemies.find(e=>e.type==='boss');$('boss-bar').hidden=!boss;if(boss){$('boss-fill').style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';$('boss-phase').textContent=`Fase ${boss.phase}`;}}
async function start(){if(!ready)return;await audio.unlock();audio.stop();game.reset();game.start();selected='chef';removing=false;$('menu').hidden=true;$('pause-menu').hidden=true;$('result').hidden=true;$('guide').hidden=true;$('banner').hidden=true;$('boss-bar').hidden=true;$('hint').textContent=hints[0];last=performance.now();updateUI();}
function showResult(e){$('result').hidden=false;const win=e.type==='won';$('result-eyebrow').textContent=win?'LOS BIGOTES PIDIERON TREGUA':'LOS VECINOS SE COLARON';$('result-title').textContent=win?'¡El jardín es tuyo!':'Una revancha con patitas.';$('result-text').textContent=win?'El Barón se retira. Los Pugs celebran con una ronda de premios.':'Prueba con Chefs atrás, atacantes en cada carril y cojines delante. Guarda algunos premios para reaccionar.';$('result-stats').innerHTML=`<span><b>${Math.floor(e.time/60)}:${String(Math.floor(e.time%60)).padStart(2,'0')}</b>tiempo</span><span><b>${e.kills}</b>bigotes fuera</span><span><b>${game.stats.placements}</b>Pugs colocados</span>`;paintPortrait($('result-dog'),win?'bark':'chef');}
function pause(){if(game.status==='playing'){game.pause();audio.pause();$('pause-menu').hidden=false;}}
async function resume(){if(document.hidden||matchMedia('(orientation: portrait)').matches)return;await audio.unlock();$('pause-menu').hidden=true;game.resume();last=performance.now();}
function openGuide(){guideWasPlaying=game.status==='playing';if(guideWasPlaying){game.pause();audio.pause();}$('guide').hidden=false;}
$('start').onclick=start;$('restart-result').onclick=start;$('restart-pause').onclick=start;$('pause').onclick=pause;$('resume').onclick=resume;$('help').onclick=openGuide;
$('close-guide').onclick=async()=>{$('guide').hidden=true;if(guideWasPlaying){await audio.unlock();game.resume();last=performance.now();}};
$('sound').onclick=async()=>{await audio.unlock();audio.toggle();updateSound();};
function updateSound(){$('sound').textContent=audio.muted?'♫̸':'♪';$('sound').setAttribute('aria-label',audio.muted?'Activar sonido':'Desactivar sonido');$('sound').setAttribute('aria-pressed',String(!audio.muted));}
$('remove').onclick=()=>{if(game.status!=='playing')return;removing=!removing;selected=null;toast(removing?'Toca un Pug para retirarlo. Recuperas la mitad de su coste.':'Selecciona un Pug.');updateUI();};
$('install-help').onclick=()=>{$('install').hidden=false;};$('close-install').onclick=()=>{$('install').hidden=true;};document.querySelector('.wordmark').onclick=e=>{e.preventDefault();openGuide();};
canvas.addEventListener('pointerdown',e=>{e.preventDefault();if(game.status!=='playing')return;audio.unlock();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*WORLD.w,y=(e.clientY-r.top)/r.height*WORLD.h;
 const drop=[...game.drops].reverse().find(d=>Math.hypot(d.x-x,d.y-y)<42);if(drop){game.collect(drop.id);return;}
 const col=Math.floor((x-WORLD.left)/WORLD.cellW),row=Math.floor((y-WORLD.top)/WORLD.cellH);if(row<0||row>=5||col<0||col>=9)return;
 if(removing){if(!game.remove(row,col))toast('Aquí no hay un Pug.',1.2);return;}if(selected){game.place(selected,row,col);}else toast('Selecciona un Pug abajo y toca una casilla.',1.7);
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();audio.pause();}last=performance.now();});window.addEventListener('pagehide',()=>{pause();audio.pause();});window.addEventListener('pageshow',()=>{last=performance.now();});
const orientation=matchMedia('(orientation: portrait)');orientation.addEventListener('change',()=>{if(orientation.matches)pause();renderer.resize();last=performance.now();});new ResizeObserver(()=>renderer.resize()).observe(canvas);
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('guide').hidden)$('close-guide').click();else if(game.status==='paused')resume();else pause();}if(/^[1-5]$/.test(e.key))select(PUGS[Number(e.key)-1].id);});
function frame(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(game.status==='ready')game.age+=dt;game.update(dt);renderer.draw(game,selected,removing);uiClock+=dt;if(uiClock>.1){updateUI();uiClock=0;}if(now>toastUntil)$('toast').classList.remove('show');if(now>bannerUntil)$('banner').hidden=true;requestAnimationFrame(frame);}
// All images and sprites are local and preloaded before the first playable frame.
Promise.all([artReady,...['./assets/icons/icon-192.png','./assets/icons/apple-touch-icon.png'].map(url=>new Promise(resolve=>{const i=new Image();i.onload=resolve;i.onerror=resolve;i.src=url;}))]).then(()=>{for(const d of PUGS)paintPortrait(cardNodes.get(d.id).querySelector('canvas'),d.id);paintPortrait($('hero-pug'),'bark');paintPortrait($('hero-enemy'),'basic',true);renderer.resize();ready=true;$('loading').textContent='';$('start').disabled=false;updateSound();updateUI();requestAnimationFrame(frame);});$('start').disabled=true;
if('serviceWorker'in navigator){navigator.serviceWorker.register('./sw.js').then(async registration=>{const worker=registration.installing||registration.waiting||registration.active;const report=()=>{if(navigator.serviceWorker.controller)$('offline-status').textContent='Jardín listo: esta versión puede abrirse sin conexión desde este dispositivo.';};report();navigator.serviceWorker.addEventListener('controllerchange',report);if(worker)worker.addEventListener('statechange',report);}).catch(()=>{$('offline-status').textContent='Para jugar offline, abre el juego desde una dirección HTTPS o localhost.';});}
