/* Plantas em guache: térreo 1586×992; subterrâneo 1717×916, deslocado 1200 px em Y. */
(function(root){
'use strict';
const mapCrop=[0,0,1586,992],basementOffset=1200;
const floors=[{id:'ground',name:'Térreo',x:0,y:0,w:1586,h:992},{id:'basement',name:'Subterrâneo',x:0,y:basementOffset,w:1717,h:916}];
const layout=[
 ['dorm','Dormitório',105,70,385,225,'wood'],['study','Sala de leitura',565,70,320,228,'wood'],
 ['warehouse','Armazém de pertences',935,65,285,235,'wood'],['hall','Corredor dos vigias',55,330,1155,105,'stone'],
 ['dining','Salão do obelisco',90,490,570,405,'wood'],['kitchen','Cozinha',720,490,460,200,'stone'],
 ['office','Sala de observação',725,750,210,155,'wood'],['elias','Quarto de Elias',980,750,320,155,'wood'],
 ['courtyard','Pátio',1230,350,310,330,'stone'],['laundry','Lavanderia',1275,105,275,215,'stone'],
 ['cell','Cela de Mira',315,1460,240,212,'stone'],['tomasCell','Cela de Tomas',615,1460,210,212,'stone'],
 ['basementHall','Corredor subterrâneo',90,1800,1530,180,'stone'],['serviceStairs','Escada de serviço',95,1530,115,280,'stone'],
 ['archive','Arquivos subterrâneos',900,1320,730,450,'stone']
];
// Vãos reais; os dois andares são ilhas separadas ligadas por interações nas escadas.
const passageRects=[[280,280,65,75],[680,275,65,85],[1058,280,48,80],[320,420,50,100],[820,420,40,110],[830,680,60,145],[925,825,80,55],[1190,370,55,55],[1380,305,50,70],[315,1655,240,165],[615,1655,210,165],[925,1750,100,75]];
const blocks={
 dorm:[[105,70,385,65],[120,130,65,60],[400,130,65,65],[108,215,25,65],[448,250,40,40]],
 study:[[565,70,320,60],[565,155,35,85],[620,145,35,62],[705,145,40,88],[793,145,36,65],[845,200,40,60],[610,235,45,30]],
 warehouse:[[935,65,285,90],[935,160,52,130],[1140,150,80,105],[1120,250,100,48],[985,240,45,55]],
 hall:[[55,330,220,40],[350,330,325,40],[750,330,300,40],[1110,330,100,40]],
 dining:[[90,490,220,50],[390,490,270,50],[120,575,145,83],[485,575,145,83],[120,725,145,86],[485,725,145,86],[310,575,120,212],[90,855,100,40],[535,855,125,40]],
 kitchen:[[720,490,90,45],[870,490,310,55],[720,545,45,60],[820,560,135,35],[990,560,130,35],[835,610,120,35],[985,610,115,35],[1135,550,45,65],[720,625,70,55],[1115,625,60,62]],
 office:[[725,750,95,55],[900,750,35,55],[800,830,80,48],[725,810,30,95]],
 elias:[[1090,775,48,47],[1150,765,75,102],[1240,760,60,100],[1015,850,90,40]],
 courtyard:[[1320,480,155,105],[1250,545,45,70],[1480,545,45,70],[1230,625,35,55],[1505,625,35,55]],
 laundry:[[1275,105,275,125],[1290,235,110,65]],
 cell:[[325,1480,140,85],[485,1520,55,45]],tomasCell:[[620,1480,135,85],[775,1520,45,45]],
 archive:[[900,1635,25,135],[1025,1635,30,135],[1010,1320,500,140],[900,1400,90,230],[1430,1430,85,275],[1110,1525,210,155],[1530,1440,100,275]]
};
const wallOpenings={};
// Bordas internas das paredes pintadas; os vãos continuam transitáveis.
const boundaryWalls=layout.flatMap(([id,,x,y,w,h])=>{
 const holes=[...passageRects,...layout.filter(r=>r[0]!==id).map(r=>r.slice(2,6))];
 return [[x,y,w,10],[x,y+h-10,w,10],[x,y,10,h],[x+w-10,y,10,h]].map(box=>[id,box,holes]);
});
function subtract(box,hole){
 const [x,y,w,h]=box,[hx,hy,hw,hh]=hole,left=Math.max(x,hx),top=Math.max(y,hy),right=Math.min(x+w,hx+hw),bottom=Math.min(y+h,hy+hh);
 if(left>=right||top>=bottom)return [box];
 return [[x,y,w,top-y],[x,bottom,w,y+h-bottom],[x,top,left-x,bottom-top],[right,top,x+w-right,bottom-top]].filter(a=>a[2]>0&&a[3]>0);
}
function rooms(T){return layout.map(([id,name,x,y,w,h,floor])=>({id,name,x:x/T,y:y/T,w:w/T,h:h/T,floor}));}
function geometry(){return [...Object.entries(blocks).flatMap(([room,list])=>list.flatMap((box,i)=>{
 const pieces=i===0?(wallOpenings[room]||[]).reduce((pieces,hole)=>pieces.flatMap(p=>subtract(p,hole)),[box]):[box];
 return pieces.map(([x,y,w,h],part)=>({id:`scenery-${room}-${i}-${part}`,room,x,y,w,h,solid:true}));
})),...boundaryWalls.flatMap(([room,box,holes],i)=>holes.reduce((pieces,hole)=>pieces.flatMap(p=>subtract(p,hole)),[box]).map(([x,y,w,h],part)=>({id:`boundary-${room}-${i}-${part}`,room,x,y,w,h,solid:true})))];}
function areas(){return [...layout.map(r=>({x:r[2],y:r[3],w:r[4],h:r[5]})),...passageRects.map(([x,y,w,h])=>({x,y,w,h}))];}
const sprites={cell:[[28,941,125,97],[172,941,125,97],[315,941,125,97],[456,941,125,97],[600,941,125,97]],archive:[[746,941,129,97],[891,941,129,97],[1034,941,129,97],[1177,941,129,97],[1320,941,129,97]]};
// Source coordinates retain the authored 1456×1080 atlas space across repaints.
function atlas(c,image,sx,sy,sw,sh,...dest){
 const scaleX=(image.naturalWidth||image.width||1456)/1456,scaleY=(image.naturalHeight||image.height||1080)/1080;
 c.drawImage(image,sx*scaleX,sy*scaleY,sw*scaleX,sh*scaleY,...dest);
}
function floor(c,image,box){c.save();c.beginPath();c.rect(...box);c.clip();for(let y=box[1];y<box[1]+box[3];y+=12)for(let x=box[0];x<box[0]+box[2];x+=53)atlas(c,image,894,660,53,12,x,y,53,12);c.restore();}
function draw(c,M,art){
 c.fillStyle='#0b090e';c.fillRect(0,0,M.W*M.T,M.H*M.T);
 if(art.fullMap)c.drawImage(art.fullMap,0,0,1586,992);
 if(art.basementMap)c.drawImage(art.basementMap,0,basementOffset,1717,916);
 // Passagens dinâmicas: cobrir as folhas pintadas com piso do mesmo cenário.
 const patch=(image,source,box)=>{if(image)c.drawImage(image,...source,...box);};
 patch(art.fullMap,[840,710,40,18],[935,825,68,55]);
 patch(art.basementMap,[350,390,180,70],[315,1672,240,128]);
 patch(art.basementMap,[650,390,160,70],[615,1672,210,128]);
 patch(art.basementMap,[1045,460,100,100],[925,1645,100,180]);
}
function drawDoor(c,d,open,art){
 if(open)return true;
 if(art.basementMap&&d.art){c.drawImage(art.basementMap,d.art[0],d.art[1]-basementOffset,d.art[2],d.art[3],...d.art);return true;}
 c.save();c.fillStyle='#231c29';c.fillRect(d.x,d.y,d.w,d.h);
 c.fillStyle=d.id==='warehouse'?'#886249':'#9a7b83';
 if(d.id==='warehouse'||d.id==='archive'){c.fillRect(d.x+3,d.y+2,d.w-6,d.h-4);c.fillStyle='#d1ad66';c.fillRect(d.x+d.w-12,d.y+6,5,5);}
 else {for(let x=d.x+5;x<d.x+d.w;x+=16)c.fillRect(x,d.y-24,4,44);c.fillRect(d.x,d.y-24,d.w,5);}
 c.restore();return true;
}
// Os dois criados-mudos do dormitório usam a mesma origem entre aberto e fechado.
const drawers=[
 {id:'bedside-left',name:'Gaveta do criado-mudo esquerdo',art:[183,111,27,24],depth:140,point:{x:205,y:155}},
 {id:'bedside-right',name:'Gaveta do criado-mudo direito',art:[376,111,27,24],depth:140,point:{x:383,y:155}}
];
function drawDrawer(c,d,open,art){
 if(!art.bedside)return false;
 // O tampo e a vela já existem no mapa: substitui só a frente, sem duplicar a chama.
 c.drawImage(art.bedside,(open?48:0)+6,30,36,21,...d.art);return true;
}
// Documentos da rota principal usam o mesmo desenho das coletas opcionais.
function storyPickups(state,M){
 const target=M.stages[state.scene]?.[0];
 if(!['bed','ledger','records','tomasBed','keyDesk'].includes(target)||!M.positions[target]||state.pending)return [];
 const p=M.positions[target];return [{...p,type:target==='keyDesk'?'chave':target==='ledger'?'livro':'bilhete',name:target==='bed'?'Carta de Eron':'Documento'}];
}
function drawPickup(c,item,art){
 if(!art.pickups)return false;
 const name=item.item||item.name||'';
 const index=item.photo?(item.id==='family'?2:3):item.type==='chave'?5:item.type==='livro'||/Caderno/.test(name)?4:/Fita/.test(name)?6:/Peça/.test(name)?7:/Carta/.test(name)?0:1;
 const size=item.photo?18:16;
 c.drawImage(art.pickups,index%4*32,Math.floor(index/4)*32,32,32,Math.round(item.x-size/2),Math.round(item.y-size/2),size,size);return true;
}
function floorAt(p){return p.y>=basementOffset?floors[1]:floors[0];}
// Visibilidade por andar: cômodos vizinhos permanecem visíveis.
function roomView(point){const f=floorAt(point);return {id:f.id,name:f.name,core:[f.x,f.y,f.w,f.h],boxes:[[f.x,f.y,f.w,f.h]],passages:[],contains:p=>floorAt(p).id===f.id};}
function guardWarnings(){return [];}
const api={floors,floorAt,basementOffset,roomView,guardWarnings,storyPickups,drawers,drawDrawer,drawPickup,mapCrop,layout,passageRects,rooms,geometry,areas,sprites,draw,drawDoor};root.GameScenery=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
