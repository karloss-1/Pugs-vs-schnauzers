// Original procedural sound design. No external samples or network dependencies.
export class Audio {
 constructor(){this.ctx=null;this.muted=false;this.voices=new Set();this.last={};try{this.muted=localStorage.getItem('pugs-muted')==='1';}catch{}}
 async unlock(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!this.ctx){this.ctx=new C();this.master=this.ctx.createGain();this.master.gain.value=this.muted?0:.75;const limiter=this.ctx.createDynamicsCompressor();limiter.threshold.value=-15;limiter.ratio.value=6;this.master.connect(limiter);limiter.connect(this.ctx.destination);const n=this.ctx.sampleRate;this.noise=this.ctx.createBuffer(1,n, this.ctx.sampleRate);const a=this.noise.getChannelData(0);let seed=79;for(let i=0;i<n;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;a[i]=seed/2147483648-1;}}if(this.ctx.state==='suspended')await this.ctx.resume();}catch{}}
 stop(){for(const v of this.voices){try{v.stop();}catch{}}this.voices.clear();}
 toggle(){this.muted=!this.muted;if(this.master)this.master.gain.value=this.muted?0:.75;if(this.muted)this.stop();try{localStorage.setItem('pugs-muted',this.muted?'1':'0');}catch{}return this.muted;}
 pause(){this.stop();if(this.ctx?.state==='running')this.ctx.suspend().catch(()=>{});}
 tone(freq,duration,delay=0,type='sine',volume=.06,end=freq){this.voice(freq,duration,delay,type,volume,end);}
 voice(freq,duration,delay=0,type='sine',volume=.06,end=freq){
 if(this.muted||!this.ctx||this.ctx.state!=='running'||this.voices.size>=16)return;
 const c=this.ctx,noise=type==='noise',o=noise?c.createBufferSource():c.createOscillator(),g=c.createGain(),filter=c.createBiquadFilter(),now=c.currentTime+delay,jitter=.96+Math.random()*.08;
 if(noise){o.buffer=this.noise;filter.type='lowpass';filter.frequency.setValueAtTime(freq,now);filter.frequency.exponentialRampToValueAtTime(Math.max(40,end),now+duration);}else{o.type=type;o.frequency.setValueAtTime(freq*jitter,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,end*jitter),now+duration);filter.frequency.value=8000;}
 g.gain.setValueAtTime(.0001,now);g.gain.linearRampToValueAtTime(volume*(.92+Math.random()*.16),now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(filter);filter.connect(g);g.connect(this.master);this.voices.add(o);o.onended=()=>{this.voices.delete(o);o.disconnect();filter.disconnect();g.disconnect();};o.start(now);o.stop(now+duration+.02);
 }
 play(type,unit){const key=type+':'+(unit||''),now=performance.now();if(now-(this.last[key]??-1000)<(type==='hit'?75:90))return;this.last[key]=now;
 const tone=(...a)=>this.tone(...a),noise=(f,d,v=.04,end=100)=>this.voice(f,d,0,'noise',v,end);
 if(type==='shoot'){
  if(unit==='splash'){noise(1500,.24,.045,250);tone(110,.18,0,'sine',.04,55);}
  else if(unit==='slow'){tone(1250,.15,0,'sine',.03,750);tone(1850,.16,.025,'triangle',.012,1000);}
  else{noise(1300,.07,.03,400);tone(340,.08,0,'triangle',.025,180);}
 }else if(type==='hit'){
  if(unit==='splash'){noise(850,.25,.06,80);tone(80,.18,0,'sine',.05,40);}
  else if(unit==='slow'){tone(1800,.13,0,'sine',.025,1300);tone(2400,.1,.04,'sine',.014,1700);}
  else{noise(700,.06,.035,100);tone(150,.075,0,'triangle',.03,65);}
 }else if(type==='electric'){noise(3500,.13,.025,700);tone(130,.18,0,'sawtooth',.025,430);tone(660,.1,.03,'square',.008,220);}
 else if(type==='thaw'||type==='armorBreak'){noise(3600,.16,.026,900);tone(2100,.11,0,'triangle',.02,1200);}
 else if(type==='charge'){if(unit==='splash')tone(100,.25,0,'triangle',.012,180);if(unit==='slow')tone(650,.2,0,'sine',.01,950);}
 else if(type==='produce'){tone(440,.1,0,'triangle',.045,660);tone(880,.15,.08,'sine',.045);}
 else if(type==='collect'){tone(740,.08);tone(1110,.16,.05,'sine',.04);}
 else if(type==='bite'||type==='pugExit'){noise(500,.08,.035);tone(160,.07,0,'triangle',.02,75);}
 else if(type==='place'){tone(220,.1,0,'sine',.06,440);tone(550,.12,.06);}
 else if(type==='boss'||type==='bossPhase'){[98,123,147].forEach((f,i)=>tone(f,.65,i*.12,'triangle',.05));noise(350,.5,.04,70);}
 else if(type==='bossBark'){noise(650,.4,.08,60);tone(85,.35,0,'sawtooth',.025,40);}
 else if(type==='bossMove'||type==='jump'){noise(1200,.3,.025,250);tone(220,.15,0,'sine',.025,450);}
 else if(type==='defeat'&&unit==='boss'){[196,294,392,588].forEach((f,i)=>tone(f,.5,i*.15,'triangle',.055));noise(600,.6,.05,60);}
 else if(type==='won'){[392,494,587,784].forEach((n,i)=>tone(n,.4,i*.16,'triangle',.06));}
 else if(type==='lost'||type==='breach'){[330,262,196].forEach((n,i)=>tone(n,.25,i*.12,'triangle',.05));}
 else if(type==='invalid')tone(150,.12,0,'triangle',.03,100);
 else if(type==='wave'){tone(440,.13);tone(660,.2,.12);}
 else if(type==='select')tone(520,.06,0,'sine',.025);
 }
}
