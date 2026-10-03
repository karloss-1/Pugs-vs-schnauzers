export const WORLD = { w:1080, h:560, left:112, top:42, cols:9, rows:5, cellW:100, cellH:96 };
export const PUGS = [
 {id:'bark',name:'Capitán Guau',role:'Ladridos a distancia',short:'Ataque',cost:100,cooldown:5,hp:190,damage:24,rate:1.35,color:'#ffbd57',accessory:'bandana'},
 {id:'chef',name:'Chef Migajas',role:'Produce 25 premios cada 12 s',short:'Premios',cost:75,cooldown:6,hp:150,rate:12,color:'#ffd978',accessory:'chef'},
 {id:'tank',name:'Don Cojín',role:'Bloquea con 850 de resistencia',short:'Escudo',cost:125,cooldown:12,hp:850,rate:0,color:'#88c8c3',accessory:'pillow'},
 {id:'splash',name:'DJ Croqueta',role:'Daño de área en su carril',short:'Área',cost:200,cooldown:10,hp:185,damage:42,rate:2.8,color:'#c2a1ef',accessory:'headphones'},
 {id:'slow',name:'Pug Polar',role:'Ralentiza 50% durante 4 s',short:'Control',cost:150,cooldown:8,hp:180,damage:12,rate:1.9,color:'#9cdbea',accessory:'scarf'}
];
export const ENEMIES = {
 basic:{name:'Bigotes',hp:145,speed:11,damage:18,color:'#a6adb9'},
 fast:{name:'Turbo',hp:95,speed:27,damage:15,color:'#d4bba0'},
 tank:{name:'Grandote',hp:480,speed:7,damage:25,color:'#727b93'},
 armor:{name:'Olla de acero',hp:175,armor:155,speed:10,damage:20,color:'#91a4ac'},
 jumper:{name:'Saltimbanqui',hp:145,speed:14,damage:18,color:'#b8b0cf'},
 boss:{name:'EL BARÓN VON BIGOTES',hp:2600,speed:3.8,damage:32,color:'#77829e'}
};
// Fixed, readable introductions. Recovery time is included between waves.
export const WAVES = [
 {at:28,name:'Visita inesperada',types:['basic','basic'],gap:9},
 {at:58,name:'Los vecinos insisten',types:['basic','basic','basic','basic'],gap:5},
 {at:90,name:'¡Llegó Turbo!',types:['fast','basic','basic','fast','basic'],gap:5},
 {at:126,name:'Un asunto de peso',types:['tank','basic','fast','basic','basic','fast'],gap:5},
 {at:165,name:'Cocina blindada',types:['armor','basic','tank','fast','basic','armor','basic','fast'],gap:4},
 {at:202,name:'Bigotes por el aire',types:['jumper','basic','fast','armor','jumper','basic','tank','fast','armor'],gap:4},
 {at:242,name:'La fiesta del jardín',types:['tank','armor','fast','jumper','basic','armor','fast','tank','armor','jumper','fast','basic'],gap:4},
 {at:285,name:'Última travesura',types:['armor','tank','jumper','fast','armor','basic','fast','tank','jumper','armor','fast','tank','basic','jumper','armor'],gap:3},
 {at:330,name:'El Barón llega',types:['boss'],gap:0}
];
export const BALANCE = {initialTreats:350,passiveEvery:10,passiveAmount:25,maxTreats:999,lives:3,bossSummonEvery:25,bossBarkEvery:15,bossBarkDamage:28,bossMoveEvery:24,maxEnemies:32};
export const laneY = row => WORLD.top + row*WORLD.cellH + WORLD.cellH/2;
export const cellX = col => WORLD.left + col*WORLD.cellW + WORLD.cellW/2;
