import {Game} from '../src/engine.js';
import {PUGS} from '../src/config.js';
export function simulate(seed=42,strategy='balanced'){
 const g=new Game({seed});g.start();let nextDecision=0,plan=[];
 g.place('chef',0,0);g.place('bark',0,2);
 if(strategy==='idle'){for(let i=0;i<24000&&g.status==='playing';i++)g.update(.05);return g;}
 // Simple fair player: collects resources, covers empty lanes, expands economy, then reacts.
 const occupied=(r,c)=>g.pugs.some(p=>p.row===r&&p.col===c);
 for(let i=0;i<18000&&g.status==='playing';i++){
 g.update(.05);
 if(g.age<nextDecision)continue;
 nextDecision=g.age+(strategy==='slow'?4:1.7);
 for(const d of [...g.drops])g.collect(d.id);
 plan=[];
 // Build a reliable shot in every lane before spending on a large economy.
 for(let r=0;r<5;r++)if(!g.pugs.some(p=>p.row===r&&p.type==='bark')){const c=[2,1,3,0].find(c=>!occupied(r,c));if(c!==undefined)plan.push(['bark',r,c]);}
 for(let r=0;r<(strategy==='slow'?3:5);r++)if(!occupied(r,0))plan.push(['chef',r,0]);
 const threats=[...g.enemies].sort((a,b)=>a.x-b.x);
 for(const e of threats){if(e.x<700&&!occupied(e.row,6))plan.push(['tank',e.row,6]);if(!occupied(e.row,3))plan.push(['slow',e.row,3]);if(!occupied(e.row,4))plan.push(['splash',e.row,4]);}
 for(let r=0;r<5;r++){if(!occupied(r,3))plan.push(['slow',r,3]);if(!occupied(r,4))plan.push(['splash',r,4]);if(!occupied(r,1))plan.push(['bark',r,1]);}
 if(strategy==='slow')plan=plan.filter(([type])=>type!=='splash'||g.time>240);
 for(const [type,r,c] of plan){if(g.valid(type,r,c)){g.place(type,r,c);break;}}
 }
 return g;
}
if(process.argv[1]?.endsWith('balance.js')){
 for(const strategy of ['balanced','slow','idle'])for(const seed of [1,42,123,999,2026]){const g=simulate(seed,strategy);console.log(JSON.stringify({strategy,seed,status:g.status,time:Math.round(g.time),kills:g.kills,lives:g.lives,placements:g.stats.placements,produced:g.stats.produced,bossDefeated:g.bossDefeated,spent:g.spent}));}
}
