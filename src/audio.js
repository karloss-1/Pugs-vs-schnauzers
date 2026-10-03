// Original synthesized effects; no samples, downloads or third-party recordings.
export class Audio {
 constructor(){this.ctx=null;this.muted=false;try{this.muted=localStorage.getItem('pugs-muted')==='1';}catch{}this.last={};}
 async unlock(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!this.ctx)this.ctx=new C();if(this.ctx.state==='suspended')await this.ctx.resume();}catch{/* Gameplay remains available if audio is unavailable. */}}
 toggle(){this.muted=!this.muted;try{localStorage.setItem('pugs-muted',this.muted?'1':'0');}catch{}return this.muted;}
 pause(){if(this.ctx?.state==='running')this.ctx.suspend().catch(()=>{});}
 tone(freq,duration,delay=0,type='sine',volume=.06,end=freq){if(this.muted||!this.ctx||this.ctx.state!=='running')return;const c=this.ctx,o=c.createOscillator(),g=c.createGain(),now=c.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),now+duration);g.gain.setValueAtTime(.001,now);g.gain.linearRampToValueAtTime(volume,now+.012);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g);g.connect(c.destination);o.start(now);o.stop(now+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();};}
 play(type){const now=performance.now();if(now-(this.last[type]||0)<90)return;this.last[type]=now;
 if(type==='collect'||type==='produce'){this.tone(660,.1);this.tone(990,.16,.06);}
 else if(type==='shoot'){this.tone(280,.09,0,'triangle',.025,160);}
 else if(type==='hit'||type==='bite'){this.tone(130,.065,0,'triangle',.025,70);}
 else if(type==='place'){this.tone(220,.1,0,'sine',.07,440);this.tone(550,.12,.06);}
 else if(type==='boss'||type==='bossBark'){this.tone(90,.25,0,'sawtooth',.04,55);this.tone(130,.2,.18,'triangle',.05,70);}
 else if(type==='won'){[392,494,587,784].forEach((n,i)=>this.tone(n,.35,i*.15,'triangle',.07));}
 else if(type==='lost'||type==='breach'){[330,262,196].forEach((n,i)=>this.tone(n,.25,i*.12,'triangle',.06));}
 else if(type==='invalid'){this.tone(150,.12,0,'triangle',.04,100);}
 else if(type==='wave'){this.tone(440,.13);this.tone(660,.2,.12);}
 else if(type==='select'){this.tone(520,.06,0,'sine',.025);}}
}
