/* Mapa completo fornecido pelo jogador. Coordenadas em pixels da imagem 1456×1080. */
(function(root){
'use strict';
const mapCrop=[0,0,1456,895];
const layout=[
 ['dorm','Dormitório',104,40,428,240,'wood'],['study','Sala de leitura',641,42,316,206,'wood'],
 ['cell','Ala restrita',1042,44,318,209,'stone'],['hall','Corredor dos vigias',94,311,1268,100,'wood'],
 ['dining','Salão do obelisco',96,469,611,399,'wood'],['kitchen','Cozinha',779,470,585,165,'stone'],
 ['office','Sala de observação',782,718,261,155,'wood'],['archive','Arquivos subterrâneos',1107,713,258,158,'wood']
];
const passageRects=[[286,260,66,100],[730,235,89,128],[1164,240,70,124],[344,401,72,120],[884,396,80,132],[884,628,80,150],[1180,655,70,126],[884,655,366,40]];
const blocks={
 dorm:[[104,40,428,93],[144,117,63,68],[435,117,58,68],[104,133,34,147],[498,133,34,147],[180,208,24,35],[206,104,23,41],[316,120,47,30],[146,244,26,33],[478,245,54,32]],
 study:[[641,42,316,57],[641,98,55,25],[686,126,36,69],[767,119,46,109],[866,120,37,65],[916,99,41,40],[641,161,30,38],[923,184,34,37],[687,213,38,35],[874,211,37,37]],
 cell:[[1042,44,318, 60],[1042,103,35,150],[1325,99,35,154],[1180,137,70,29],[1042,191,123,62],[1234,191,126,62]],
 hall:[[94,311,1268,45]],
 dining:[[96,469,611,42],[130,548,168,94],[511,548,165,94],[130,710,168,91],[511,710,165,91],[344,556,110,214],[96,817,105,51],[606,817,101,51]],
 kitchen:[[779,470,585,50],[779,517,36,84],[1327,518,37,115],[875,540,167,28],[1081,540,164,28],[894,589,134,27],[1079,589,145,27],[779,599,95,36]],
 office:[[782,718,261,52],[782,771,25,102],[1017,768,26,105],[852,795,94,39]],
 archive:[[1107,713,258,47],[1107,760,32,96],[1321,760,44,96],[1185,784,66,63],[1107,850,61,21],[1303,849,62,22]]
};
// Somente estes vãos recortam as paredes. Móveis na passagem continuam sólidos.
const wallOpenings={study:[[730,235,89,13]],cell:[[1164,240,70,13]],hall:[[286,311,66,45],[730,311,89,45],[1164,311,70,45]],dining:[[344,469,72,42]],kitchen:[[884,470,80,50]],office:[[884,718,80,52]],archive:[[1180,713,70,47]]};
const boundaryWalls=[
 ['dorm',[104,267,428,13],[[286,267,66,13]]],
 ['study',[641,123,30,125],[]],['study',[933,139,24,109],[]],['study',[641,234,316,14],[[730,234,89,14]]],
 ['hall',[94,396,1268,15],[[344,396,72,15],[884,396,80,15]]],['hall',[94,356,12,55],[]],['hall',[1350,356,12,55],[]],
 ['dining',[96,511,15,357],[]],['dining',[690,511,17,357],[]],['dining',[96,852,611,16],[]],
 ['kitchen',[779,634,585,1],[[884,634,80,1]]],
 ['office',[782,860,261,13],[]],['archive',[1107,856,258,15],[]]
];
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
function floor(c,image,box){c.save();c.beginPath();c.rect(...box);c.clip();for(let y=box[1];y<box[1]+box[3];y+=12)for(let x=box[0];x<box[0]+box[2];x+=53)c.drawImage(image,894,660,53,12,x,y,53,12);c.restore();}
function draw(c,M,art){c.fillStyle='#0b090e';c.fillRect(0,0,M.W*M.T,M.H*M.T);if(!art.fullMap)return;c.drawImage(art.fullMap,...mapCrop,...mapCrop);
 // Retira a grade decorativa do salão: apenas cela e arquivos recebem portas reais.
 floor(c,art.fullMap,[343,403, 73,73]);
 // Apaga as folhas embutidas sob os quadros dinâmicos, para não reaparecerem abertas.
 floor(c,art.fullMap,[1164,190,70,73]);floor(c,art.fullMap,[1180,696,70,67]);
 // O acesso à observação precisa ser um vão visível, igual ao da física.
 floor(c,art.fullMap,[884,700,80,70]);
}
function drawDoor(c,d,open,art,progress=open?1:0,closing=false){if(!art.fullMap||!sprites[d.id])return false;const frames=sprites[d.id];const frame=progress<=0?0:progress>=1?3:closing?4:progress<.5?1:2;const source=frames[frame],dest=d.art;
 c.drawImage(art.fullMap,...source,...dest);return true;
}
const api={mapCrop,layout,passageRects,rooms,geometry,areas,sprites,draw,drawDoor};root.GameScenery=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
