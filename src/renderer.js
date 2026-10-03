import {WORLD,PUGS,ENEMIES,laneY,cellX} from './config.js';
const OUT='#423849';
export function ellipse(c,x,y,rx,ry,fill,stroke=OUT,lw=2.5){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
export function round(c,x,y,w,h,r,fill,stroke=null){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function path(c,points,fill,stroke=OUT,lw=2.5){c.beginPath();c.moveTo(...points[0]);for(const p of points.slice(1))c.lineTo(...p);c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
function line(c,x,y,x2,y2,color=OUT,w=2.5){c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.stroke();}
function bone(c,x,y,s=1,color='#ffe9b2'){c.save();c.translate(x,y);c.scale(s,s);round(c,-11,-4,22,8,3,color,OUT);for(const a of [-1,1])for(const b of [-1,1])ellipse(c,a*10,b*4,4,4,color,OUT,1.5);c.restore();}
export function drawDog(c,{x=0,y=0,type='bark',enemy=false,t=0,scale=1,hit=0,attack=0,walking=false,boss=false,armor=0,slow=0}={}){
 c.save();c.translate(x,y);const bob=Math.sin(t*(walking?9:3))* (walking?3:1.6);c.translate(0,bob);const squash=attack>0?Math.sin(attack*18)*.06:0;c.scale(scale*(1+squash),scale*(1-squash));
 if(enemy)c.scale(-1,1);
 const def=enemy?ENEMIES[type]:PUGS.find(d=>d.id===type);const base=enemy?(def?.color||'#a6adb9'):'#e8bb83';const shade=enemy?'#768297':'#cc9967';const trim=def?.color||'#ffbd57';const phase=t*9;
 // Independent paws, body, ears and tail give the vector rigs a full animation cycle.
 ellipse(c,0,34,33,9,'#28433d35',null);
 for(const i of [-1,1]){const leg=walking?Math.sin(phase+i)*6:Math.sin(t*2+i);ellipse(c,i*20+leg,27,9,12,shade);ellipse(c,i*20+leg+3,34,10,5,base);}
 c.save();c.translate(-31,-2);c.rotate(Math.sin(t*6)*.25);if(enemy){ellipse(c,-4,-6,9,17,base);}else{c.beginPath();c.arc(0,0,10,0,Math.PI*1.8);c.strokeStyle=OUT;c.lineWidth=8;c.stroke();c.strokeStyle=base;c.lineWidth=4;c.stroke();}c.restore();
 ellipse(c,-1,6,34,27,base);ellipse(c,8,11,23,18,enemy?'#c0c6cd':'#f9d5a2',null);
 if(!enemy&&type==='tank'){round(c,-38,-9,73,49,15,'#7bb5b4',OUT);round(c,-32,-3,61,36,11,'#b9e2d4',null);for(let i=-1;i<2;i++)ellipse(c,i*18,15,2,2,'#6d9e9e',null);}
 const hx=attack>0?6:2,hy=-20+(walking?Math.sin(phase)*1.5:0);c.save();c.translate(hx,hy);c.rotate(attack>0?-.05:Math.sin(t*2)*.018);
 if(enemy){
 path(c,[[-29,-13],[-25,-44],[-8,-23]],base);path(c,[[10,-22],[28,-43],[31,-9]],base);
 path(c,[[-23,-22],[-23,-35],[-15,-25]],'#dec5b4',null);path(c,[[17,-23],[25,-34],[25,-20]],'#dec5b4',null);
 round(c,-30,-27,63,58,17,base,OUT);path(c,[[-22,12],[-29,26],[-14,24],[-9,36],[0,30],[9,37],[16,23],[28,25],[20,9]],'#e8ebed',OUT);
 }else{
 ellipse(c,0,0,34,31,base);c.save();c.rotate(Math.sin(t*3)*.025);path(c,[[-29,-21],[-43,-12],[-34,10],[-23,-6]],'#765342');path(c,[[28,-21],[42,-9],[32,9],[23,-6]],'#765342');c.restore();
 ellipse(c,-15,0,11,15,'#775945',null);ellipse(c,15,0,11,15,'#775945',null);
 }
 const blink=Math.sin(t*1.7)>.992;for(const i of [-1,1]){
 ellipse(c,i*15,-2,8,blink?1.2:10,'#fff6e4');if(!blink){ellipse(c,i*15+2,-1,4.8,6.8,'#38313b',null);ellipse(c,i*15+3,-4,1.8,2.3,'#fff',null);}
 }
 if(enemy){line(c,-23,-16,-9,-13,OUT,4);line(c,10,-13,24,-17,OUT,4);}
 else{line(c,-10,-22,-2,-23,'#c28f62',2);line(c,2,-23,10,-22,'#c28f62',2);}
 ellipse(c,0,15,enemy?19:20,enemy?10:14,enemy?'#e8ebed':'#80624e',null);
 ellipse(c,0,8,7,5,'#36323c',OUT,1.5);ellipse(c,-2,7,2,1,'#817883',null);line(c,0,12,0,18,OUT,2);line(c,-7,20,0,18,OUT,2);line(c,0,18,7,20,OUT,2);
 if(attack>0||!enemy){ellipse(c,4,23,5,7,'#e88991',OUT,1.4);line(c,4,23,4,27,'#be6374',1);}
 if(enemy){for(const a of [-1,1])for(let j=0;j<3;j++)line(c,a*6,15+j*4,a*(26+j*2),13+j*5,'#7b8797',1.7);}
 if(!enemy&&type==='chef'){round(c,-23,-35,47,17,5,'#fff9e7',OUT);for(const [px,py,r]of[[-17,-40,13],[0,-48,17],[18,-40,13]])ellipse(c,px,py,r,r,'#fff9e7');round(c,-23,-34,47,10,3,'#fff9e7',null);line(c,-17,-26,17,-26,'#deccaa',1.5);}
 if(!enemy&&type==='splash'){c.beginPath();c.arc(0,-10,33,Math.PI,Math.PI*2);c.strokeStyle=OUT;c.lineWidth=8;c.stroke();c.strokeStyle='#b294db';c.lineWidth=4;c.stroke();round(c,-39,-12,13,24,5,'#bca1e5',OUT);round(c,27,-12,13,24,5,'#bca1e5',OUT);}
 if(!enemy&&type==='slow'){round(c,-29,-32,58,14,6,'#79bdcf',OUT);ellipse(c,15,-37,9,9,'#d6f5f4');}
 if(enemy&&type==='fast'){round(c,-28,-31,57,10,4,'#ed967a',OUT);path(c,[[-24,-30],[-40,-28],[-35,-19]],'#ed967a');}
 if(enemy&&type==='tank'){round(c,-34,-32,69,15,5,'#6b7190',OUT);ellipse(c,0,-28,6,5,'#eab35a');}
 if(enemy&&type==='armor'&&armor>0){round(c,-37,-39,74,23,6,'#bdcfda',OUT);round(c,-17,-45,35,8,4,'#e0e9ed',OUT);line(c,-28,-34,20,-34,'#f2fbff',3);line(c,-35,-26,-46,-26,OUT,5);line(c,35,-26,46,-26,OUT,5);}
 if(enemy&&type==='jumper'){round(c,-29,-34,58,10,4,'#b599df',OUT);path(c,[[17,-34],[29,-51],[32,-31]],'#cab0ea');ellipse(c,30,-51,4,4,'#ffe09b');}
 if(boss){path(c,[[-28,-24],[-36,-49],[-13,-39],[0,-61],[13,-39],[35,-50],[27,-24]],'#ffd168');for(const [a,b]of[[-36,-49],[0,-61],[35,-50]])ellipse(c,a,b,4,4,'#fff2ae');round(c,-29,-28,58,9,3,'#e7ae49',OUT);ellipse(c,15,0,13,13,'#ffffff22','#d9b45d',2);line(c,26,4,34,23,'#d9b45d',1.5);}
 c.restore();
 if(!enemy&&type==='bark'){path(c,[[-26,-4],[24,-4],[3,17]],'#ef7867');ellipse(c,6,2,4,4,'#ffe38d',OUT,1);}
 if(!enemy&&type==='chef'){round(c,-22,9,45,22,5,'#fff8df',OUT);bone(c,0,20,.5);}
 if(!enemy&&type==='slow'){round(c,-29,-1,55,12,4,'#8dcbdc',OUT);round(c,15,6,10,24,3,'#b3e8ec',OUT);}
 if(!enemy&&type==='splash'){round(c,8,10,34,22,6,'#695884',OUT);ellipse(c,25,21,7,7,'#c3a4e7',OUT,1.5);}
 if(boss){path(c,[[-31,-5],[-49,29],[-7,27],[2,-3]],'#bf6f8b',OUT);ellipse(c,-1,1,5,5,'#ffd168');}
 if(enemy&&type==='jumper'){for(const px of [-18,18]){line(c,px,35,px-5,40,'#8e77aa',3);line(c,px-5,40,px+5,45,'#8e77aa',3);line(c,px+5,45,px-5,50,'#8e77aa',3);round(c,px-13,48,27,6,3,'#bca3d9',OUT);}}
 if(hit>0){c.globalAlpha=.55;c.globalCompositeOperation='source-atop';ellipse(c,0,-8,35,44,'#fff',null);c.globalCompositeOperation='source-over';}
 if(slow>0){c.globalAlpha=.75;for(let i=0;i<3;i++){const a=t+i*2.1;ellipse(c,Math.cos(a)*39,Math.sin(a)*15-4,3,3,'#d6fbff',null);}}
 c.restore();
}
export class Renderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.background=document.createElement('canvas');this.background.width=WORLD.w;this.background.height=WORLD.h;this.buildBackground(this.background.getContext('2d'));}
 resize(){const r=this.canvas.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);}
 buildBackground(c){const gradient=c.createLinearGradient(0,0,0,560);gradient.addColorStop(0,'#a7d8c4');gradient.addColorStop(.3,'#b5d9ac');gradient.addColorStop(1,'#689e75');c.fillStyle=gradient;c.fillRect(0,0,1080,560);
 // Original backyard: layered bushes, picket fence, border stones and hand-drawn turf.
 for(let x=0;x<1100;x+=50){ellipse(c,x,27,54,34,x%100?'#67996f':'#7aa57a',null);round(c,x,0,29,38,4,'#e6d5b1','#acb49c');}
 round(c,30,35,1040,493,26,'#53876c','#386750');round(c,96,34,932,496,19,'#c3c29a','#879b73');
 for(let r=0;r<5;r++){round(c,112,42+r*96,900,94,7,r%2?'#8cbe82':'#9ac88c',null);for(let col=0;col<9;col++){if((col+r)%2===0)round(c,112+col*100,42+r*96,98,94,6,'#ffffff09');for(let i=0;i<3;i++){const x=127+col*100+((i*31+r*13)%71),y=62+r*96+((col*17+i*23)%64);line(c,x,y,x-2,y-5,'#70a77170',1);line(c,x,y,x+3,y-4,'#70a77170',1);}}}
 for(let y=65;y<525;y+=35){round(c,1018,y,22,29,7,'#d5ceab','#aaa985');}
 round(c,39,54,49,463,15,'#caac82','#927f64');for(let r=0;r<5;r++){ellipse(c,64,laneY(r),16,19,'#e8cfaa','#ab9579');ellipse(c,64,laneY(r)+4,7,8,'#b29a7c',null);for(let i=0;i<3;i++)ellipse(c,57+i*7,laneY(r)-7,3,4,'#b29a7c',null);}
 for(let x=5;x<1080;x+=43){const y=540+(x%3)*2;ellipse(c,x,y,22,16,'#56846b',null);if(x%2){for(let i=0;i<5;i++){const a=i*1.256;ellipse(c,x+Math.cos(a)*5,y+Math.sin(a)*5,4,4,'#f5cf84',null);}ellipse(c,x,y,3,3,'#b68e60',null);}}
 }
 draw(g,selected,remove=false){const c=this.ctx;c.setTransform(this.canvas.width/WORLD.w,0,0,this.canvas.height/WORLD.h,0,0);c.drawImage(this.background,0,0);c.save();if(g.shake>0)c.translate(Math.sin(g.age*90)*3*g.shake,Math.cos(g.age*75)*2*g.shake);
 if(selected||remove)for(let r=0;r<5;r++)for(let col=0;col<9;col++){const valid=remove?g.pugs.some(p=>p.row===r&&p.col===col):g.valid(selected,r,col);if(valid){round(c,115+col*100,45+r*96,94,88,10,remove?'#f79c8150':'#fff6ae33',remove?'#e49b80':'#f4f0b288');}}
 for(let row=0;row<5;row++)if(g.enemies.some(e=>e.row===row&&e.x<WORLD.left+150)){round(c,112,42+row*96,130,94,7,`rgba(240,130,106,${.15+.06*Math.sin(g.age*8)})`);}
 const boss=g.enemies.find(e=>e.type==='boss');if(boss?.warning>0){const row=boss.pending==='move'?boss.nextRow:boss.row;round(c,112,42+row*96,900,94,7,`rgba(255,166,119,${.13+.07*Math.sin(g.age*14)})`,'#ffe1a9');}
 for(let r=0;r<5;r++){
 for(const p of g.pugs.filter(p=>p.row===r)){const intro=Math.min(1,(g.age-p.born)*4);c.save();c.globalAlpha=intro;drawDog(c,{...p,t:g.age+p.id*.8,scale:.9*(.7+.3*intro)});c.restore();this.health(p.x,p.y+42,55,p.hp/p.maxHp,'#f7edb1',p.hit>0||p.hp<p.maxHp);}
 for(const s of g.shots.filter(s=>s.row===r)){c.save();c.translate(s.x,s.y);c.rotate(s.age*7);if(s.type==='splash'){ellipse(c,0,0,12,12,'#b195db');ellipse(c,0,0,4,4,'#e8d1fc',null);}else if(s.type==='slow'){path(c,[[0,-12],[9,0],[0,12],[-9,0]],'#b9eef5');line(c,-7,0,7,0,'#fff',2);}else{bone(c,0,0,.7);}c.restore();}
 for(const e of g.enemies.filter(e=>e.row===r)){const block=g.pugs.some(p=>p.row===r&&e.x-p.x<62&&e.x-p.x>-25);let yy=e.y;if(e.type==='jumper'&&e.attack>.3)yy-=Math.sin((.65-e.attack)*9)*38;drawDog(c,{...e,y:yy+(e.type==='boss'&&e.row===0?26:0),enemy:true,boss:e.type==='boss',scale:e.type==='boss'?1.38:(e.type==='tank'?1.08:.9),t:g.age+e.id,walking:!block&&e.warning<=0});this.health(e.x,e.y+(e.type==='boss'?49:44),e.type==='boss'?85:50,e.hp/e.maxHp,'#f1a69a',e.type!=='boss');if(e.armor>0)this.health(e.x,e.y+49,50,e.armor/e.maxArmor,'#d2e0ef',true);}
 }
 for(const d of g.drops){const y=d.y+Math.sin(g.age*4+d.id)*4;c.save();c.translate(d.x,y);c.rotate(Math.sin(g.age*2+d.id)*.12);ellipse(c,0,0,23,23,'#ffe4a4','#c79550',2);ellipse(c,-4,-6,13,8,'#fff0c7',null);bone(c,0,0,.9,'#efba6c');c.restore();}
 for(const f of g.effects)this.effect(f,g.age);
 c.restore();
 // Breezy leaves, kept out of the tactical foreground.
 for(let i=0;i<5;i++){const x=(g.age*9+i*237)%1100,y=18+Math.sin(g.age+i)*6;c.save();c.translate(x,y);c.rotate(g.age+i);ellipse(c,0,0,6,3,'#e3e8aa',null);c.restore();}
 if(g.status==='ready'){drawDog(c,{x:360,y:300,type:'bark',scale:2.6,t:g.age});drawDog(c,{x:755,y:300,type:'basic',enemy:true,scale:2.7,t:g.age,walking:true});}
 }
 health(x,y,w,ratio,color,show){if(!show)return;const c=this.ctx;round(c,x-w/2,y,w,5,3,'#37504dcc');round(c,x-w/2+1,y+1,Math.max(0,(w-2)*Math.max(0,ratio)),3,2,color);}
 effect(f,t){const c=this.ctx,p=1-f.ttl/f.max;c.save();c.globalAlpha=Math.min(1,f.ttl*4);if(f.label){c.font='bold 28px ui-rounded, system-ui';c.textAlign='center';c.strokeStyle='#7b6344';c.lineWidth=4;c.strokeText(f.label,f.x,f.y-p*45);c.fillStyle=f.color;c.fillText(f.label,f.x,f.y-p*45);}
 else{const count=f.kind==='bossExit'?28:8;for(let i=0;i<count;i++){const a=i*Math.PI*2/count+f.seed*5,r=p*(f.kind==='bossExit'?170:45),x=f.x+Math.cos(a)*r,y=f.y+Math.sin(a)*r+p*p*25;ellipse(c,x,y,(1-p)*5+1,(1-p)*4+1,f.color,null);}if(['splash','bark','bossExit'].includes(f.kind)){c.beginPath();c.arc(f.x,f.y,12+p*(f.kind==='bark'?130:75),0,Math.PI*2);c.strokeStyle=f.color;c.lineWidth=6*(1-p);c.stroke();}}
 c.restore();}
}
export function paintPortrait(canvas,type,enemy=false,boss=false){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);c.save();c.translate(canvas.width/2,canvas.height*.68);const scale=Math.min(canvas.width/110,canvas.height/142);drawDog(c,{type,enemy,boss,scale,t:0,armor:enemy&&type==='armor'?120:0});c.restore();}
