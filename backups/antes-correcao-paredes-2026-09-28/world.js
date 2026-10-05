(function(root){
'use strict';
const T=24,W=62,H=46;
const rooms=[{id:'dorm',name:'Dormitório',x:2,y:2,w:20,h:12,floor:'wood'},{id:'study',name:'Sala de leitura',x:26,y:2,w:15,h:10,floor:'wood'},{id:'cell',name:'Ala restrita',x:45,y:2,w:15,h:10,floor:'stone'},{id:'hall',name:'Corredor dos vigias',x:2,y:15,w:58,h:5,floor:'stone'},{id:'dining',name:'Salão do obelisco',x:2,y:23,w:28,h:20,floor:'stone'},{id:'kitchen',name:'Cozinha',x:33,y:23,w:27,h:8,floor:'wood'},{id:'office',name:'Sala de observação',x:33,y:35,w:12,h:8,floor:'wood'},{id:'archive',name:'Arquivos subterrâneos',x:48,y:35,w:12,h:8,floor:'stone'}];
const grid=Array.from({length:H},()=>Array(W).fill(0));
function carve(x,y,w,h,type=1){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)grid[j][i]=type;}
rooms.forEach(r=>carve(r.x,r.y,r.w,r.h,r.floor==='wood'?2:1));
// Passagens largas e galeria de serviço ligam todos os cômodos.
const passages=[[10,14,4,1],[31,12,4,3],[51,12,4,3],[13,20,4,3],[38,20,4,3],[38,31,4,4],[52,31,4,4],[38,32,18,2],[60,16,1,3]];
passages.forEach(a=>carve(...a));
const doors=[
 {id:'dorm',name:'Porta do dormitório',x:10*T,y:14*T,w:4*T,h:8},
 {id:'study',name:'Porta da leitura',x:31*T,y:13*T,w:4*T,h:8},
 {id:'cell',name:'Grade da ala leste',x:51*T,y:14*T,w:4*T,h:8,lock:'cellOpen'},
 {id:'dining',name:'Porta do salão',x:13*T,y:21*T,w:4*T,h:8},
 {id:'kitchen',name:'Porta da cozinha',x:38*T,y:21*T,w:4*T,h:8},
 {id:'office',name:'Porta da observação',x:38*T,y:34*T,w:4*T,h:8},
 {id:'archive',name:'Porta dos arquivos',x:52*T,y:34*T,w:4*T,h:8,lock:'tunnel'},
 {id:'exit',name:'Portão de saída',x:59*T,y:15*T,w:8,h:5*T,lock:'exit',vertical:true}
];
const props=[];
const prop=(id,type,x,y,w=1,h=1,solid=true)=>props.push({id,type,x:x*T,y:y*T,w:w*T,h:h*T,solid});
// Todo móvel visível e sólido tem a mesma geometria na arte e na física.
prop('artBed','artbed',2.7,2.2,3.7,5.8);
prop('artDesk','artdesk',18.3,6.5,3.7,4.4);
prop('artWardrobe','artcabinet',16.5,2.3,4.1,3.2);
prop('artTrunk','artcrate',14.6,3.5,2.0,1.6);
prop('bedside','table',6.9,4.7,1.8,1.45);
prop('miraBed','bed',8.8,2.4,2.7,3.9);
prop('dormRug','rug',9.3,8.5,6,3.7,false);
prop('artBoxes','artcrate',19.2,11.7,2.5,1.9);
prop('rugStudy','rug',28,6,10,4,false);prop('shelf1','books',27,3,5,2);prop('shelf2','books',35,3,5,2);prop('reading','table',31,7,4,2);
prop('cellbed','bed',46,3,2,3);prop('cellcrate','crate',56,4,2,2);
prop('altar','altar',13,24,6,3);prop('altarRug','rug',12,27,8,5,false);
[[5,32],[20,32],[5,38],[20,38]].forEach(([x,y],i)=>{prop('table'+i,'table',x,y,5,2);prop('benchA'+i,'bench',x,y-1,5,.75);prop('benchB'+i,'bench',x,y+2,5,.75);});
prop('stove','stove',34,24,5,2);prop('counter','counter',41,24,6,2);prop('crates','crate',55,24,3,3);
prop('officeTable','table',36,36,5,2);prop('officeShelf','books',34,40,3,2);
prop('archiveShelf','books',49,36,3,2);prop('archiveShelf2','books',56,36,3,2);prop('relic','relic',53,37,2,2);
[[3,24],[28,24],[3,41],[28,41],[3,3],[24,17],[43,17],[59,3],[34,29],[59,29]].forEach(([x,y],i)=>prop('plant'+i,'plant',x,y,1,1));
const lights=[[12.5,25.5],[19.5,25.5],[3.5,16],[23.5,16],[43.5,16],[59,18],[28.5,40],[3.5,40],[35,29],[58,29],[49,40],[58,40],[20.5,7],[27.5,10],[58,10]];
const point=(x,y)=>({x:x*T,y:y*T});
const positions={mel:point(10.5,10.5),guardDorm:point(12.5,9.8),altar:point(16,27.5),mira:point(12,34.5),noahHall:point(27,17.5),eronDorm:point(17,8),bed:point(7.3,8.3),eronKitchen:point(50,28),service:point(40,23),examiner:point(40,39.3),miraBed:point(8.3,6.8),noahDorm:point(17,9.8),officeDoor:point(39.5,34.5),guardHall:point(36,17.5),miraCell:point(51,7),relic:point(54,39.5),leader:point(51,40.7),exit:point(60.2,17.5)};
const stages={
 prologo:['bed','Uma memória antes do primeiro sino.','Memória'],
 quarto:['guardDorm','Fale com o vigia no dormitório.','Vigia'],
 altar:['altar','Vá ao salão e interaja com o altar.','Obelisco'],recusa:['altar','Responda ao vigia diante do altar.','Vigia do altar'],
 mira:['mira','Converse discretamente com Mira no salão.','Mira'],noah:['noahHall','Encontre Noah no corredor central.','Noah'],segredo:['noahHall','Decida o que revelar a Noah.','Noah'],
 desaparecimento:['eronDorm','Volte ao dormitório e fale com Eron.','Eron'],bilhete:['bed','Examine o bilhete na cama.','Bilhete'],eron:['eronKitchen','Encontre Eron atrás da cozinha.','Eron'],explorar:['service','Investigue a entrada da cozinha.','Ala de serviço'],
 interrogatorio:['examiner','Apresente-se na sala de observação.','Interrogador'],sumico:['miraBed','Procure uma pista na cama de Mira.','Cama de Mira'],oferta:['noahDorm','Noah está esperando no dormitório.','Noah'],limiar:['officeDoor','Investigue a porta da sala de observação.','Porta entreaberta'],emboscada:['examiner','Entre na sala de observação.','Noah e os adultos'],questionar:['noahDorm','Peça uma explicação a Noah.','Noah'],verdade:['noahDorm','Confronte Noah sobre a Actras.','Noah'],
 confinamento:['guardHall','Fale com o vigia no corredor durante o alarme.','Vigia'],resgate:['miraCell','Alcance Mira na ala restrita.','Mira'],subsolo:['altar','Examine a base do altar para encontrar os arquivos.','Base do altar'],confronto:['leader','Encare o líder da Actras nos arquivos.','Líder da Actras'],disfarce:['exit','Chegue à saída e decida se vai voltar.','Saída do orfanato']};
const night=new Set(['bilhete','eron','explorar','oferta','limiar','questionar','verdade','confinamento','resgate','subsolo','confronto','disfarce']);
function target(state,world){if(state.scene==='subsolo'&&world.tunnelOpen)return {...positions.relic,id:'relic',name:'Símbolo do Luzitruismo',objective:'Recupere o símbolo nos arquivos subterrâneos.'};const a=stages[state.scene];return a?{...positions[a[0]],id:a[0],name:a[2],objective:a[1]}:null;}
function tile(x,y){return grid[Math.floor(y/T)]?.[Math.floor(x/T)]||0;}
const overlaps=(p,x,y,r=7)=>x+r>p.x&&x-r<p.x+p.w&&y+r>p.y&&y-r<p.y+p.h;
function doorLocked(door,state,world){
 if(!door.lock)return false;
 if(door.lock==='exit')return !state?.flags?.latchOpen&&!['portao','disfarce'].includes(state?.scene)&&!state?.flags?.escaped;
 return !state?.flags?.[door.lock]&&!(door.lock==='tunnel'&&world?.tunnelOpen);
}
function doorOpen(door,state,world){
 if(doorLocked(door,state,world))return false;
 // Desbloqueios da história abrem a grade/passagem imediatamente.
 return world?.doors?.[door.id]??!!door.lock;
}
function walkable(x,y,r=7,state=null,world=null){
 if(!Number.isFinite(x)||!Number.isFinite(y))return false;
 for(const [dx,dy] of [[-r,-r],[r,-r],[-r,r],[r,r]])if(!tile(x+dx,y+dy))return false;
 if(props.some(p=>p.solid&&overlaps(p,x,y,r)))return false;
 return !world||!doors.some(d=>!doorOpen(d,state,world)&&overlaps(d,x,y,r));
}
function move(player,dx,dy,state=null,world=null){
 // Subpassos impedem atravessar paredes/portas em movimentos grandes.
 const count=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/4)||1;
 for(let i=0;i<count;i++){
  if(walkable(player.x+dx/count,player.y,7,state,world))player.x+=dx/count;
  if(walkable(player.x,player.y+dy/count,7,state,world))player.y+=dy/count;
 }
}
function roomAt(x,y){return rooms.find(r=>x>=r.x*T&&x<(r.x+r.w)*T&&y>=r.y*T&&y<(r.y+r.h)*T)?.name||'Galeria de serviço';}
function visible(a,b,state=null,world=null,ignoreDoor=null){
 const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4);
 for(let i=1;i<n;i++){
  const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;
  if(!walkable(x,y,1))return false;
  if(world&&doors.some(d=>d.id!==ignoreDoor&&!doorOpen(d,state,world)&&overlaps(d,x,y,1)))return false;
 }
 return true;
}
function canInteract(player,p,state,world,range=p?.door?96:53){return !!p&&Math.hypot(player.x-p.x,player.y-p.y)<range&&visible(player,p,state,world,p.door);}
function doorPoints(state,world){return doors.map(d=>({id:'door-'+d.id,door:d.id,x:d.x+d.w/2,y:d.y+d.h/2,name:(doorLocked(d,state,world)?'Trancada: ':doorOpen(d,state,world)?'Fechar: ':'Abrir: ')+d.name}));}
function toggleDoor(id,state,world,actors=[]){
 const door=doors.find(d=>d.id===id);
 if(!door)return {changed:false,text:'Porta não encontrada.'};
 if(doorLocked(door,state,world))return {changed:false,text:door.lock==='cellOpen'?'A grade está trancada. Procure uma chave, um arame ou uma distração.':door.lock==='tunnel'?'Os arquivos estão trancados. O mecanismo do altar abre a passagem.':'O portão está trancado. Prepare sua fuga ou peça a Noah para soltar o trinco.'};
 const open=doorOpen(door,state,world);
 if(open&&[world.player,...actors].some(p=>overlaps(door,p.x,p.y,9)))return {changed:false,text:'Afaste-se da passagem para fechar a porta.'};
 world.doors=world.doors||{};world.doors[id]=!open;
 return {changed:true,text:door.name+(open?' fechada.':' aberta.')};
}
function path(start,end,state=null,world=null,options={}){
 const cell=p=>[Math.floor(p.x/T),Math.floor(p.y/T)], [sx,sy]=cell(start),[ex,ey]=cell(end),queue=[[sx,sy]],seen=new Map([[`${sx},${sy}`,null]]);
 // Rotas atravessam portas que podem ser abertas com E, mas nunca trancas.
 const routeWorld=world&&options.openDoors!==false?{...world,doors:Object.fromEntries(doors.map(d=>[d.id,true]))}:world;
 let found=null;
 for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i],p=point(x+.5,y+.5);
  if(Math.abs(x-ex)+Math.abs(y-ey)<=(options.exact?0:1)&&visible(p,end,state,routeWorld)){found=[x,y];break;}
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,ny=y+dy,k=`${nx},${ny}`,next=point(nx+.5,ny+.5);
   if(!seen.has(k)&&walkable(next.x,next.y,7,state,routeWorld)&&visible(p,next,state,routeWorld)&&(!options.exact||clearWalk(p,next,state,routeWorld))){
    seen.set(k,[x,y]);queue.push([nx,ny]);
   }
  }
 }
 if(!found)return [];
 const result=[];while(found){result.unshift(point(found[0]+.5,found[1]+.5));found=seen.get(found.join(','));}return result;
}
function blocked(state,world,x,y){const d=doors.find(d=>!doorOpen(d,state,world)&&overlaps(d,x,y));return d?d.name+' fechada. Use E perto da porta.':null;}
function normalizeWorld(world,state){
 const stored=world.doors;world.doors={};
 for(const d of doors)if(typeof stored?.[d.id]==='boolean')world.doors[d.id]=stored[d.id];
 if(!walkable(world.player.x,world.player.y,7,state,world)){
  let best=null,distance=Infinity;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const p=point(x+.5,y+.5),dist=Math.hypot(p.x-world.player.x,p.y-world.player.y);
   if(dist<distance&&walkable(p.x,p.y,7,state,world)){best=p;distance=dist;}
  }
  Object.assign(world.player,best||fresh().player);
 }
 normalizeMel(world,state);world.actors={};return world;
}
function updateGuard(g,dt,pace,state,world){
 const distance=g.dir*g.speed*pace*dt,old={x:g.x,y:g.y};
 move(g,g.axis==='x'?distance:0,g.axis==='y'?distance:0,state,world);
 if(g[g.axis]>=g.b){g[g.axis]=g.b;g.dir=-1;}
 else if(g[g.axis]<=g.a){g[g.axis]=g.a;g.dir=1;}
 else if(Math.hypot(g.x-old.x,g.y-old.y)<Math.abs(distance)*.5)g.dir*=-1;
 g.step=(g.step||0)+Math.hypot(g.x-old.x,g.y-old.y)/20;
}
// Pontos de passeio em cômodos diferentes; o trajeto só usa portas já abertas.
const melStops=[[14.5,11.5],[20.5,18.5],[29.5,10.5],[16.5,36.5],[49.5,28.5],[42.5,39.5],[54.5,41.5],[52.5,8.5],[10.5,10.5]].map(([x,y])=>point(x,y));
function freshMel(){return {...positions.mel,dir:'down',step:0,wait:1.5,nextStop:0,route:[],doors:null};}
function melPoint(world){return world?.mel||positions.mel;}
function normalizeMel(world,state){
 const saved=world.mel;
 world.mel=saved&&walkable(saved.x,saved.y,7,state,world)?{
  ...freshMel(),x:saved.x,y:saved.y,
  dir:['up','down','left','right'].includes(saved.dir)?saved.dir:'down',
  wait:Number.isFinite(saved.wait)?Math.max(0,Math.min(3,saved.wait)):1.5,
  nextStop:Number.isInteger(saved.nextStop)?((saved.nextStop%melStops.length)+melStops.length)%melStops.length:0
 }:freshMel();
 return world.mel;
}
function clearWalk(a,b,state,world){
 const count=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4)||1;
 for(let i=1;i<=count;i++)if(!walkable(a.x+(b.x-a.x)*i/count,a.y+(b.y-a.y)*i/count,7,state,world))return false;
 return true;
}
function updateMel(state,world,dt){
 const cat=world.mel||normalizeMel(world,state);
 if(!Number.isFinite(dt)||dt<=0)return false;
 dt=Math.min(dt,.1);
 // Ela espera o carinho sem fugir do jogador nem reagir através das paredes.
 if(canInteract(world.player,cat,state,world,53)){
  cat.step=0;
  const dx=world.player.x-cat.x,dy=world.player.y-cat.y;
  if(Math.hypot(dx,dy)>1)cat.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  return false;
 }
 const signature=doors.map(d=>doorOpen(d,state,world)?'1':'0').join('');
 if(cat.doors!==signature){cat.doors=signature;cat.route=[];}
 if(cat.wait>0){cat.wait=Math.max(0,cat.wait-dt);cat.step=0;return false;}
 if(!cat.route.length){
  for(let offset=0;offset<melStops.length;offset++){
   const index=(cat.nextStop+offset)%melStops.length,target=melStops[index];
   if(Math.hypot(target.x-cat.x,target.y-cat.y)<T)continue;
   const route=path(cat,target,state,world,{openDoors:false,exact:true});
   if(route.length&&clearWalk(cat,route[0],state,world)){
    cat.route=route;cat.nextStop=(index+1)%melStops.length;break;
   }
  }
  if(!cat.route.length){cat.wait=2;cat.step=0;return false;}
 }
 let budget=38*dt,moved=0;
 while(budget>0&&cat.route.length){
  const target=cat.route[0],dx=target.x-cat.x,dy=target.y-cat.y,distance=Math.hypot(dx,dy);
  if(distance<.01){cat.route.shift();continue;}
  const amount=Math.min(distance,budget),before={x:cat.x,y:cat.y};
  move(cat,dx/distance*amount,dy/distance*amount,state,world);
  const actual=Math.hypot(cat.x-before.x,cat.y-before.y);
  moved+=actual;budget-=amount;
  if(actual<amount-.001){cat.route=[];cat.wait=.5;break;}
  cat.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  if(distance<=amount+.001)cat.route.shift();
 }
 cat.step=moved>0?cat.step+moved/12:0;
 if(!cat.route.length){cat.step=0;cat.wait=2;}
 return moved>0;
}
function fresh(){return {player:{x:12.5*T,y:8*T,dir:'down',step:0},mel:freshMel(),tunnelOpen:false,doors:{},observed:{},explored:[],alert:0};}
function guards(){return [{x:5*T,y:18.5*T,a:5*T,b:55*T,axis:'x',dir:1,speed:30},{x:37*T,y:28.5*T,a:37*T,b:53*T,axis:'x',dir:1,speed:22},{x:4*T,y:36*T,a:4*T,b:28*T,axis:'x',dir:-1,speed:26}];}
const api={melPoint,normalizeMel,updateMel,doors,passages,doorLocked,doorOpen,doorPoints,toggleDoor,canInteract,normalizeWorld,updateGuard,T,W,H,rooms,grid,props,lights,positions,stages,night,target,tile,walkable,move,roomAt,visible,path,blocked,fresh,guards};root.GameWorld=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
