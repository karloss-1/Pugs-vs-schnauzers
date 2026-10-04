// Original generated atlas. Coordinates are source pixels, never remote resources.
export const ART_URL='./assets/art/characters.png';
export const GARDEN_URL='./assets/art/garden.png';
export const sprites={bark:[0,0,362,362],chef:[362,0,362,362],tank:[724,0,362,362],splash:[1086,0,362,362],slow:[0,362,362,362],basic:[362,362,362,350],fast:[704,362,350,350],enemyTank:[1054,362,394,350],armor:[0,712,362,374],jumper:[342,712,334,374],boss:[670,704,391,382],bossAttack:[1020,704,428,382]};
export const atlas=typeof Image!=='undefined'?new Image():null;
export const garden=typeof Image!=='undefined'?new Image():null;
export const artReady=Promise.all([[atlas,ART_URL],[garden,GARDEN_URL]].map(([img,url])=>new Promise(resolve=>{if(!img)return resolve(false);img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=url;})));
export const reducedMotion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
// A narrow leg strip moves independently while the upper body rocks. No per-frame canvases.
export function spriteDog(c,o){
 if(!atlas?.complete||!atlas.naturalWidth)return false;
 const {x=0,y=0,type='bark',enemy=false,t=0,scale=1,hit=0,attack=0,charge=0,walking=false,boss=false,slow=0,burn=0,electric=0,stun=0,walk=0,hp=1,maxHp=1,recoil=0,warning=0,phase=1,armor=1,age=1}=o;
 const key=boss&&(attack>0||warning>0||phase===2)?'bossAttack':enemy&&type==='tank'?'enemyTank':enemy&&type==='armor'&&armor<=0?'basic':type;
 const [sx,sy,sw,sh]=sprites[key]||sprites.bark;
 const motion=reducedMotion?.25:1, stride=walking?Math.sin(walk*2.8):0, breath=Math.sin(t*2.2)*.012*motion;
 const anticipation=charge>0?Math.min(1,charge/.25):0, kick=attack>0?Math.sin(Math.min(1,attack/.35)*Math.PI):0;
 const recoilShift=recoil>0?Math.sin(recoil/.22*Math.PI)*5:0;
 const w=boss?112:100,h=boss?112:100;
 c.save();if(enemy)c.globalAlpha*=Math.min(1,age*3);c.translate(x+(enemy?Math.max(0,1-age*2)*20:0),y);c.fillStyle='#203a353c';c.beginPath();c.ellipse(0,33,37*scale,8*scale,0,0,Math.PI*2);c.fill();
 c.translate((enemy?1:-1)*recoilShift+(enemy?-1:1)*kick*5,-Math.abs(stride)*2.8*motion);
 c.rotate((stride*.025+(hit>0?.045:0)-anticipation*.06*(enemy?-1:1))*motion);
 c.scale(scale*(1+breath+kick*.045-anticipation*.07),scale*(1-breath-kick*.03+anticipation*.04));
 if(electric>0&&!reducedMotion)c.translate(Math.sin(t*100)*1.5,0);
 const dx=-w/2,dy=35-h,upper=.79,legH=h*(1-upper);
 c.drawImage(atlas,sx,sy,sw,sh*upper,dx,dy,w,h*upper+.6);
 for(let i=0;i<4;i++){const offset=walking?Math.sin(walk*2.8+i*Math.PI/2)*2.5*motion:0;c.drawImage(atlas,sx+sw*i/4,sy+sh*upper,sw/4,sh*(1-upper),dx+w*i/4+offset,dy+h*upper,w/4+.5,legH);}
 // Rim indicators stay outside the artwork: frozen > electric > burning; all gameplay timers coexist.
 const state=slow>0?'#aeefff':electric>0?'#fff39e':burn>0?'#ff9b50':null;
 if(state){c.strokeStyle=state;c.lineWidth=2;c.globalAlpha=.7;c.beginPath();c.ellipse(0,31,38,8,0,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
 if(slow>0){c.fillStyle='#8cdaf335';c.beginPath();c.ellipse(0,15,w*.39,19,0,0,Math.PI*2);c.fill();for(let i=0;i<4;i++){let px=-35+i*23;c.beginPath();c.moveTo(px,32);c.lineTo(px-4,18-i%2*9);c.lineTo(px+3,9-i%2*5);c.lineTo(px+9,32);c.fillStyle='#bcefffaa';c.fill();c.strokeStyle='#e5ffff';c.lineWidth=1;c.stroke();}}
 else if(electric>0){c.strokeStyle='#fff2a8';c.lineWidth=2;c.beginPath();c.moveTo(-33,-25);c.lineTo(-40,-13);c.lineTo(-31,-10);c.lineTo(-39,2);c.moveTo(34,-18);c.lineTo(40,-5);c.lineTo(32,-3);c.lineTo(38,12);c.stroke();}
 if(burn>0){for(let i=0;i<3;i++){const q=(t*1.6+i*.33)%1;c.globalAlpha=(1-q)*.8;c.fillStyle=i%2?'#ffcf78':'#f58444';c.beginPath();c.ellipse(-26+i*22,18-q*55,3*(1-q)+1,7*(1-q)+1,-.3,0,Math.PI*2);c.fill();}c.globalAlpha=1;}
 if(charge>0){const color=type==='splash'?'#ffb05c':type==='slow'?'#c6f5ff':type==='tank'?'#fff4a2':'#ffe8a5';c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.arc(enemy?-36:36,-14,7+Math.sin(t*30)*2,0,Math.PI*2);c.stroke();for(let i=0;i<3;i++){const a=t*5+i*2.1;c.fillStyle=color;c.fillRect(34+Math.cos(a)*12,-14+Math.sin(a)*12,3,3);}}
 if(!enemy&&type==='tank'&&hp/maxHp<.65){c.strokeStyle='#63482c';c.lineWidth=2;c.beginPath();c.moveTo(-11,-5);c.lineTo(-17,4);c.lineTo(-10,10);if(hp/maxHp<.3){c.lineTo(-18,20);c.moveTo(-17,4);c.lineTo(-24,7);}c.stroke();}
 if(hit>0){c.strokeStyle='#fff5cf';c.lineWidth=2.5;c.beginPath();for(let i=0;i<3;i++){const px=(enemy?-1:1)*(35+i*4);c.moveTo(px,-12+i*9);c.lineTo(px+6,-16+i*9);}c.stroke();}
 if(stun>0){c.fillStyle='#fff1a0';c.font='bold 12px system-ui';c.fillText('✦',-6,-65);}
 c.restore();return true;
}
