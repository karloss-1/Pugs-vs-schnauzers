import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
const advance=(g,seconds)=>{for(let t=0;t<seconds;t+=.05)g.update(.05);};
function setup(type){const g=new Game();g.start();g.tutorial=2;g.treats=999;g.place(type,2,3);g.spawn('tank',2);g.enemies[0].x=g.pugs[0].x+100;return g;}
test('fire adds bounded nonstacking burn that continues after projectile impact',()=>{const g=setup('splash');advance(g,1.5);const e=g.enemies[0];assert.ok(e.burn>0&&e.burn<=3);g.pugs=[];const hp=e.hp;advance(g,1);assert.ok(e.hp<hp);advance(g,3);assert.equal(e.burn,0);});
test('electric shield chains to at most three enemies and respects stun immunity',()=>{const events=[],g=setup('tank');g.onEvent=e=>events.push(e);for(let i=0;i<3;i++){g.spawn('tank',2);g.enemies[i+1].x=g.pugs[0].x+130+i*40;}advance(g,.5);assert.equal(g.enemies.filter(e=>e.hp<e.maxHp).length,3);assert.equal(g.enemies.filter(e=>e.stunGuard>0).length,3);assert.ok(events.some(e=>e.type==='electric'));advance(g,.5);assert.ok(g.enemies.every(e=>e.stun===0));});
test('unit metadata no longer overwrites action event names',()=>{const events=[],g=setup('bark');g.onEvent=e=>events.push(e);advance(g,2);assert.ok(events.some(e=>e.type==='shoot'&&e.unit==='bark'));assert.ok(events.some(e=>e.type==='hit'&&e.unit==='bark'));});
