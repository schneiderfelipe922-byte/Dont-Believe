(function(root){
'use strict';
const T=24,W=62,H=46;
const rooms=[{id:'dorm',name:'Dormitório',x:2,y:2,w:20,h:12,floor:'wood'},{id:'study',name:'Sala de leitura',x:26,y:2,w:15,h:10,floor:'wood'},{id:'cell',name:'Ala restrita',x:45,y:2,w:15,h:10,floor:'stone'},{id:'hall',name:'Corredor dos vigias',x:2,y:15,w:58,h:5,floor:'stone'},{id:'dining',name:'Salão do obelisco',x:2,y:23,w:28,h:20,floor:'stone'},{id:'kitchen',name:'Cozinha',x:33,y:23,w:27,h:8,floor:'wood'},{id:'office',name:'Sala de observação',x:33,y:35,w:12,h:8,floor:'wood'},{id:'archive',name:'Arquivos subterrâneos',x:48,y:35,w:12,h:8,floor:'stone'}];
const grid=Array.from({length:H},()=>Array(W).fill(0));
function carve(x,y,w,h,type=1){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)grid[j][i]=type;}
rooms.forEach(r=>carve(r.x,r.y,r.w,r.h,r.floor==='wood'?2:1));
[[11,12,3,3],[32,12,3,3],[51,12,3,3],[14,20,3,3],[39,20,3,3],[38,31,3,4],[52,31,3,4]].forEach(a=>carve(...a));
const props=[];
const prop=(id,type,x,y,w=1,h=1,solid=true)=>props.push({id,type,x:x*T,y:y*T,w:w*T,h:h*T,solid});
// Geometria do quarto preservada; pixel-art.js desenha os móveis nesses limites.
prop('artBed','artbed',2.7,2.2,3.7,5.8);
prop('artDesk','artdesk',18.3,6.5,3.7,4.4);
prop('artWardrobe','artcabinet',16.5,1.8,4.1,3.9);
prop('artTrunk','artcrate',14.6,3.5,2.0,1.6);
prop('artBackWall','artwall',2,2,14.5,1.25);
prop('artBoxes','artcrate',19.2,11.7,2.5,1.9);
prop('rugStudy','rug',28,6,10,4,false);prop('shelf1','books',27,3,5,2);prop('shelf2','books',35,3,5,2);prop('reading','table',31,7,4,2);
prop('cellbed','bed',46,3,2,3);prop('cellcrate','crate',56,4,2,2);
prop('altar','altar',13,24,6,3);prop('altarRug','rug',12,27,8,5,false);
[[5,32],[20,32],[5,38],[20,38]].forEach(([x,y],i)=>{prop('table'+i,'table',x,y,5,2);prop('benchA'+i,'bench',x,y-1,5,1);prop('benchB'+i,'bench',x,y+2,5,1);});
prop('stove','stove',34,24,5,2);prop('counter','counter',41,24,6,2);prop('crates','crate',55,24,3,3);
prop('officeTable','table',36,36,5,2);prop('officeShelf','books',34,40,3,2);
prop('archiveShelf','books',49,36,3,2);prop('archiveShelf2','books',56,36,3,2);prop('relic','relic',53,37,2,2);
[[3,24],[28,24],[3,41],[28,41],[3,3],[24,17],[43,17],[59,3],[34,29],[59,29]].forEach(([x,y],i)=>prop('plant'+i,'plant',x,y,1,1));
const lights=[[12.5,25.5],[19.5,25.5],[3.5,16],[23.5,16],[43.5,16],[59,18],[28.5,40],[3.5,40],[35,29],[58,29],[49,40],[58,40],[20.5,7],[27.5,10],[58,10]];
const point=(x,y)=>({x:x*T,y:y*T});
const positions={guardDorm:point(12.5,9.8),altar:point(16,27.5),mira:point(12,34.5),noahHall:point(27,17.5),eronDorm:point(17,8),bed:point(7.3,8.3),eronKitchen:point(50,28),service:point(40,23),examiner:point(40,39.3),miraBed:point(8.3,5.7),noahDorm:point(17,9.8),officeDoor:point(39.5,34.5),guardHall:point(36,17.5),miraCell:point(51,7),relic:point(54,39.5),leader:point(51,40.7),exit:point(58,17.5)};
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
function walkable(x,y,r=7){for(const [dx,dy] of [[-r,-r],[r,-r],[-r,r],[r,r]])if(!tile(x+dx,y+dy))return false;return !props.some(p=>p.solid&&x+r>p.x&&x-r<p.x+p.w&&y+r>p.y&&y-r<p.y+p.h);}
function move(player,dx,dy){if(walkable(player.x+dx,player.y))player.x+=dx;if(walkable(player.x,player.y+dy))player.y+=dy;}
function roomAt(x,y){return rooms.find(r=>x>=r.x*T&&x<(r.x+r.w)*T&&y>=r.y*T&&y<(r.y+r.h)*T)?.name||'Passagem';}
function visible(a,b){const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/8);for(let i=1;i<n;i++)if(!walkable(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,1))return false;return true;}
function path(start,end){const cell=p=>[Math.floor(p.x/T),Math.floor(p.y/T)], [sx,sy]=cell(start),[ex,ey]=cell(end),queue=[[sx,sy]],seen=new Map([[`${sx},${sy}`,null]]);let found=null;for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(Math.abs(x-ex)+Math.abs(y-ey)<=1){found=[x,y];break;}for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(!seen.has(k)&&walkable((nx+.5)*T,(ny+.5)*T)){seen.set(k,[x,y]);queue.push([nx,ny]);}}}if(!found)return [];const result=[];while(found){result.unshift(point(found[0]+.5,found[1]+.5));found=seen.get(found.join(','));}return result;}
function fresh(){return {player:{x:12.5*T,y:8*T,dir:'down',step:0},tunnelOpen:false,observed:{},explored:[],alert:0};}
function guards(){return [{x:5*T,y:18*T,a:5*T,b:55*T,axis:'x',dir:1,speed:30},{x:35*T,y:29*T,a:35*T,b:53*T,axis:'x',dir:1,speed:22},{x:4*T,y:36*T,a:4*T,b:28*T,axis:'x',dir:-1,speed:26}];}
const api={T,W,H,rooms,grid,props,lights,positions,stages,night,target,tile,walkable,move,roomAt,visible,path,fresh,guards};root.GameWorld=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
