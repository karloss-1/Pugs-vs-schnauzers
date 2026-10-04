import {WORLD,PUGS,ENEMIES,WAVES,BALANCE,cellX,laneY} from './config.js';
export class Game {
 constructor({seed=42,onEvent=()=>{}}={}) {this.onEvent=onEvent;this.seed=seed;this.reset();}
 reset(){this.rng=this.seed;this.time=0;this.age=0;this.status='ready';this.treats=BALANCE.initialTreats;this.lives=BALANCE.lives;this.pugs=[];this.enemies=[];this.shots=[];this.drops=[];this.effects=[];this.cooldowns={};this.wave=0;this.nextWave=0;this.queue=[];this.passive=0;this.id=0;this.tutorial=0;this.kills=0;this.spent=0;this.bossDefeated=false;this.victoryTimer=0;this.shake=0;this.warning=null;this.stats={produced:0,breaches:0,placements:0};}
 random(){this.rng=(Math.imul(1664525,this.rng)+1013904223)>>>0;return this.rng/4294967296;}
 event(type,data={}){const {type:unit,...rest}=data;this.onEvent({type,unit,...rest});}
 start(){this.status='playing';this.event('start');}
 pause(){if(this.status==='playing'){this.status='paused';this.event('pause');}}
 resume(){if(this.status==='paused'){this.status='playing';this.event('resume');}}
 valid(type,row,col){const d=PUGS.find(p=>p.id===type);return !!d&&(this.tutorial>=2||(this.tutorial===0&&type==='chef')||(this.tutorial===1&&type==='bark'))&&this.status==='playing'&&row>=0&&row<5&&col>=0&&col<9&&!this.pugs.some(p=>p.row===row&&p.col===col)&&this.treats>=d.cost&&!(this.cooldowns[type]>0);}
 place(type,row,col){const d=PUGS.find(p=>p.id===type);if(!this.valid(type,row,col)){this.event('invalid',{reason:this.tutorial<2?'Sigue los dos pasos del tutorial':this.pugs.some(p=>p.row===row&&p.col===col)?'Casilla ocupada':(this.cooldowns[type]>0?'Pug descansando':'Faltan premios')});return false;}
 this.treats-=d.cost;this.spent+=d.cost;this.stats.placements++;this.cooldowns[type]=d.cooldown;
 this.pugs.push({id:++this.id,type,row,col,x:cellX(col),y:laneY(row),hp:d.hp,maxHp:d.hp,timer:type==='chef'?7:0.4,born:this.age,hit:0,attack:0,charge:0,discharge:0});
 this.fx('place',cellX(col),laneY(row),d.color,0.6);this.event('place',{type});
 if(this.tutorial===0&&type==='chef'){this.tutorial=1;this.event('tutorial',{step:1});}else if(this.tutorial===1&&type==='bark'){this.tutorial=2;this.event('tutorial',{step:2});}return true;}
 remove(row,col){const p=this.pugs.find(p=>p.row===row&&p.col===col);if(!p||this.status!=='playing')return false;this.pugs=this.pugs.filter(q=>q!==p);const cost=PUGS.find(d=>d.id===p.type).cost;this.treats=Math.min(BALANCE.maxTreats,this.treats+Math.floor(cost/2));this.fx('exit',p.x,p.y,'#fff',0.6);this.event('remove');return true;}
 collect(id){if(this.status!=='playing')return false;const d=this.drops.find(d=>d.id===id);if(!d)return false;this.drops=this.drops.filter(x=>x!==d);this.treats=Math.min(BALANCE.maxTreats,this.treats+d.amount);this.fx('collect',d.x,d.y,'#ffe09c',0.7,'+'+d.amount);this.event('collect');return true;}
 fx(kind,x,y,color,ttl=0.45,label=''){if(this.effects.length>=100)this.effects.shift();this.effects.push({kind,x,y,color,ttl,max:ttl,label,seed:this.random()});}
 drop(x,y,amount=25){this.drops.push({id:++this.id,x,y,amount,age:0});}
 spawn(type,row){if(this.enemies.length>=BALANCE.maxEnemies)return;const d=ENEMIES[type];const e={id:++this.id,type,row,x:1040,y:laneY(row),hp:d.hp,maxHp:d.hp,armor:d.armor||0,maxArmor:d.armor||0,age:0,hit:0,attack:0,atkTimer:0,slow:0,burn:0,burnTick:0,stun:0,stunGuard:0,recoil:0,walk:0,jumped:false,phase:1,ability:0,barkTimer:7,summonTimer:18,moveTimer:24,warning:0};this.enemies.push(e);this.fx('spawn',e.x,e.y,'#d8f2d1',0.8);if(type==='boss'){this.shake=.3;this.fx('bossArrival',e.x,e.y,'#eab767',2);this.warning={text:'EL BARÓN VON BIGOTES',until:this.time+5};this.event('boss');}else this.event('spawn',{type,row});}
 damage(e,amount){if(e.hp<=0)return;e.hit=.2;e.recoil=.22;if(e.armor>0){const take=Math.min(e.armor,amount);e.armor-=take;amount-=take;if(e.armor<=0){this.fx('break',e.x,e.y,'#dbe1eb',.7);this.event('armorBreak');}}e.hp-=amount*(e.type==='boss'&&e.warning>0?1.25:1);if(e.hp<=0){this.kills++;this.fx('ghost',e.x,e.y,'#fff',.5,e.type);this.fx(e.type==='boss'?'bossExit':'exit',e.x,e.y,e.type==='boss'?'#ffd673':'#f2e8d1',e.type==='boss'?2.5:.7);this.drop(e.x,e.y,e.type==='boss'?75:10);this.event('defeat',{type:e.type});if(e.type==='boss'){this.bossDefeated=true;this.shake=.4;}}}
 update(dt){if(this.status!=='playing')return;dt=Math.min(dt,.05);this.age+=dt;this.shake=Math.max(0,this.shake-dt);for(const f of this.effects)f.ttl-=dt;this.effects=this.effects.filter(f=>f.ttl>0);
 for(const k of Object.keys(this.cooldowns))this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt);
 // Tutorial is player-paced; the invasion clock begins after two guided placements.
 if(this.tutorial>=2){this.time+=dt;this.passive+=dt;if(this.passive>=BALANCE.passiveEvery){this.passive-=BALANCE.passiveEvery;this.drop(150+this.random()*780,50+this.random()*460,BALANCE.passiveAmount);}}
 while(this.nextWave<WAVES.length&&this.time>=WAVES[this.nextWave].at){const w=WAVES[this.nextWave];this.wave=++this.nextWave;this.warning={text:w.name,until:this.time+4};this.event('wave',{number:this.wave,name:w.name});w.types.forEach((type,i)=>this.queue.push({at:w.at+i*w.gap,type,row:type==='boss'?2:(i+this.wave-1)%5}));}
 for(const q of this.queue.filter(q=>q.at<=this.time))this.spawn(q.type,q.row);this.queue=this.queue.filter(q=>q.at>this.time);
 for(const d of [...this.drops]){d.age+=dt;if(d.age>=9)this.collect(d.id);}
 for(const p of this.pugs){
 p.recoil=Math.max(0,(p.recoil||0)-dt);p.hit=Math.max(0,p.hit-dt);p.attack=Math.max(0,p.attack-dt);p.timer-=dt;p.discharge=Math.max(0,(p.discharge||0)-dt);
 const d=PUGS.find(d=>d.id===p.type);
 const target=this.enemies.filter(e=>e.hp>0&&e.row===p.row&&e.x>p.x-15).sort((a,b)=>a.x-b.x)[0];
 if(p.type==='tank'){
  if(target&&target.x-p.x<150&&p.discharge<=0){p.discharge=4.5;p.charge=.4;p.pending='electric';this.event('charge',{type:'electric'});}
 }else if(!p.pending&&p.timer<=0&&(p.type==='chef'||target)){
  p.charge=p.type==='chef'?.55:p.type==='splash'?.42:.25;p.pending=p.type;this.event('charge',{type:p.type});
 }
 if(p.pending){p.charge=Math.max(0,p.charge-dt);if(p.charge===0){
  const kind=p.pending;p.pending=null;p.attack=kind==='chef'?.6:.35;p.timer=d.rate;
  if(kind==='chef'){this.drop(p.x+12,p.y-30);this.stats.produced+=25;this.fx('produce',p.x,p.y-22,'#ffe29a',.6);this.event('produce');}
  else if(kind==='electric'){
   let prev=p;const chain=this.enemies.filter(e=>e.hp>0&&e.row===p.row&&e.x>=p.x-20&&e.x-p.x<340).sort((a,b)=>a.x-b.x).slice(0,3);
   chain.forEach((e,i)=>{this.damage(e,16*Math.pow(.65,i));if(e.stunGuard<=0){e.stun=e.type==='boss'?.06:.18;e.stunGuard=2.5;}this.fx('lightning',prev.x,prev.y-10,'#f8e391',.3);Object.assign(this.effects[this.effects.length-1],{toX:e.x,toY:e.y-10});e.electric=.4;prev=e;});
   if(chain.length)this.event('electric');
  }else if(target){this.shots.push({id:++this.id,type:p.type,x:p.x+33,y:p.y-12,row:p.row,damage:d.damage,speed:p.type==='splash'?330:420,age:0});this.fx('muzzle',p.x+37,p.y-12,d.color,.25);this.event('shoot',{type:p.type});}
 }}
 }
 for(const e of this.enemies){e.age+=dt;e.hit=Math.max(0,e.hit-dt);e.attack=Math.max(0,e.attack-dt);const wasSlow=e.slow;e.slow=Math.max(0,e.slow-dt);if(wasSlow>0&&!e.slow){this.fx('thaw',e.x,e.y,'#c2f5ff',.45);this.event('thaw');}
 e.stun=Math.max(0,e.stun-dt);e.stunGuard=Math.max(0,e.stunGuard-dt);e.electric=Math.max(0,(e.electric||0)-dt);e.recoil=Math.max(0,e.recoil-dt);
 if(e.burn>0){e.burn=Math.max(0,e.burn-dt);e.burnTick-=dt;if(e.burnTick<=0){e.burnTick=.5;this.damage(e,3);this.fx('ember',e.x,e.y-12,'#ffaf60',.35);}}
 if(e.hp<=0)continue;if(e.stun>0)continue;const d=ENEMIES[e.type];
 if(e.type==='boss')this.updateBoss(e,dt);
 const block=this.pugs.filter(p=>p.hp>0&&p.row===e.row&&p.x<e.x+25&&e.x-p.x<62).sort((a,b)=>b.x-a.x)[0];
 if(block&&e.type==='jumper'&&!e.jumped&&e.x>WORLD.left+100){e.jumped=true;e.x=block.x-72;e.attack=.65;this.fx('jump',e.x,e.y,'#e0c9ff',.6);this.event('jump');}
 else if(block){e.atkTimer-=dt;if(e.atkTimer<=0){e.atkTimer=1;e.attack=.22;block.hp-=d.damage;block.hit=.2;this.fx('hit',block.x+20,block.y,'#ffd48c',.25);this.event('bite');}}
 else if(!(e.type==='boss'&&e.warning>0)){const step=d.speed*(e.slow>0?(e.type==='boss'?.75:.5):1)*(e.type==='boss'&&e.phase===2?1.25:1)*dt;e.x-=step;e.walk+=step/12;}
 if(e.x<WORLD.left-38){e.hp=0;this.lives--;this.stats.breaches++;this.shake=.5;this.fx('breach',60,e.y,'#f67e78',1);this.event('breach');if(this.lives<=0||e.type==='boss'){this.finish('lost');return;}}}
 for(const s of this.shots){s.x+=s.speed*dt;s.age+=dt;const e=this.enemies.filter(e=>e.hp>0&&e.row===s.row&&Math.abs(e.x-s.x)<35).sort((a,b)=>a.x-b.x)[0];if(e){if(s.type==='splash'){for(const target of this.enemies.filter(t=>t.hp>0&&t.row===s.row&&Math.abs(t.x-e.x)<90)){this.damage(target,s.damage);target.burn=3;target.burnTick=.5;}this.fx('fire',e.x,e.y,'#ffae65',.6);}else{this.damage(e,s.damage);this.fx('hit',e.x,e.y-10,s.type==='slow'?'#bcf5ff':'#ffe59e',.3);}if(s.type==='slow'){e.slow=4;this.fx('ice',e.x,e.y,'#b9f3ff',.55);}s.dead=true;this.event('hit',{type:s.type});}}
 this.shots=this.shots.filter(s=>!s.dead&&s.x<1120&&s.age<4);
 for(const p of this.pugs.filter(p=>p.hp<=0)){this.fx('exit',p.x,p.y,'#ffe4b9',.6);this.event('pugExit');}
 this.pugs=this.pugs.filter(p=>p.hp>0);this.enemies=this.enemies.filter(e=>e.hp>0);
 if(this.bossDefeated&&!this.enemies.length&&!this.queue.length){this.victoryTimer+=dt;if(this.victoryTimer>=2.3)this.finish('won');}}
 updateBoss(e,dt){if(e.hp<e.maxHp*.5&&e.phase===1){e.phase=2;this.fx('bossArrival',e.x,e.y,'#f1bc73',1.2);this.event('bossPhase');this.warning={text:'¡Segunda fase! Sigue defendiendo.',until:this.time+4};this.shake=.25;}
 e.barkTimer-=dt;e.summonTimer-=dt;e.moveTimer-=dt;
 if(e.warning>0){e.warning-=dt;if(e.warning<=0){if(e.pending==='bark'){for(const p of this.pugs.filter(p=>p.row===e.row)){p.hp-=BALANCE.bossBarkDamage;p.hit=.3;}this.fx('bark',e.x,e.y,'#ffbf76',.9);this.fx('wind',e.x,e.y,'#e5e6c9',.9);for(const p of this.pugs.filter(p=>p.row===e.row))p.recoil=.3;this.shake=.22;this.event('bossBark');}else if(e.pending==='move'){e.row=e.nextRow;e.y=laneY(e.row);this.fx('spawn',e.x,e.y,'#d9c6ff',.8);this.event('bossMove');}e.pending=null;}}
 else if(e.moveTimer<=0){e.moveTimer=BALANCE.bossMoveEvery;e.nextRow=(e.row+2)%5;e.pending='move';e.warning=3;this.event('bossWarning',{text:'El Barón cambia de carril',row:e.nextRow});}
 else if(e.barkTimer<=0){e.barkTimer=BALANCE.bossBarkEvery;e.pending='bark';e.warning=2.5;this.event('bossWarning',{text:'¡Ladrido en camino!',row:e.row});}
 if(e.summonTimer<=0){e.summonTimer=BALANCE.bossSummonEvery;this.spawn(e.phase===2?'fast':'basic',(e.row+1)%5);this.event('bossSummon');}}
 finish(status){this.status=status;this.event(status,{time:this.time,kills:this.kills,lives:this.lives});}
}
