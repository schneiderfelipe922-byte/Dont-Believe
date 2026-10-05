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
 dorm:[[104,40,428,93],[144,120,63, 60],[435,120,58, 60],[104,170,34,106],[498,159,34,118],[180,208,24,35]],
 study:[[641,42,316,57],[641,98,55,25],[686,126,36,69],[767,119,46,109],[866,120,37,65],[916,99,41,40],[641,161,30,38],[923,184,34,37],[687,213,38,35],[874,211,37,37]],
 cell:[[1042,44,318, 60],[1042,103,35,61],[1325,99,35,74],[1180,137,70,29],[1042,191,123,62],[1234,191,126,62]],
 hall:[[94,311,1268,40]],
 dining:[[96,469,611,42],[135,554,157,82],[516,554,155,82],[135,703,157,81],[516,703,155,81],[344,628,110,142],[96,817,105,51],[606,817,101,51]],
 kitchen:[[779,470,585,50],[779,517,36,84],[1327,518,37,115],[875,543,167,20],[1081,543,164,20],[894,590,134,20],[1079,590,145,20],[779,599,95,36]],
 office:[[782,718,261,52],[782,771,25,102],[1017,768,26,105],[854,801,86,28]],
 archive:[[1107,713,258,47],[1107,760,32,96],[1321,760,44,96],[1187,785,61,49],[1107,850,61,21],[1303,849,62,22]]
};
function rooms(T){return layout.map(([id,name,x,y,w,h,floor])=>({id,name,x:x/T,y:y/T,w:w/T,h:h/T,floor}));}
function geometry(){return Object.entries(blocks).flatMap(([room,list])=>list.map(([x,y,w,h],i)=>({id:`scenery-${room}-${i}`,room,x,y,w,h,solid:true})));}
function areas(){return [...layout.map(r=>({x:r[2],y:r[3],w:r[4],h:r[5]})),...passageRects.map(([x,y,w,h])=>({x,y,w,h}))];}
const sprites={cell:[[28,941,125,97],[172,941,125,97],[315,941,125,97],[456,941,125,97],[600,941,125,97]],archive:[[746,941,129,97],[891,941,129,97],[1034,941,129,97],[1177,941,129,97],[1320,941,129,97]]};
function floor(c,image,box){c.save();c.beginPath();c.rect(...box);c.clip();for(let y=box[1];y<box[1]+box[3];y+=12)for(let x=box[0];x<box[0]+box[2];x+=53)c.drawImage(image,894,660,53,12,x,y,53,12);c.restore();}
function draw(c,M,art){c.fillStyle='#0b090e';c.fillRect(0,0,M.W*M.T,M.H*M.T);if(!art.fullMap)return;c.drawImage(art.fullMap,...mapCrop,...mapCrop);
 // Retira a grade decorativa do salão: apenas cela e arquivos recebem portas reais.
 floor(c,art.fullMap,[343,403, 73,73]);
 // Apaga as folhas embutidas sob os quadros dinâmicos, para não reaparecerem abertas.
 floor(c,art.fullMap,[1164,190,70,73]);floor(c,art.fullMap,[1180,696,70,67]);
}
function drawDoor(c,d,open,art,progress=open?1:0,closing=false){if(!art.fullMap||!sprites[d.id])return false;const frames=sprites[d.id];const frame=progress<=0?0:progress>=1?3:closing?4:progress<.5?1:2;const source=frames[frame],dest=d.art;
 c.drawImage(art.fullMap,...source,...dest);return true;
}
const api={mapCrop,layout,passageRects,rooms,geometry,areas,sprites,draw,drawDoor};root.GameScenery=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
