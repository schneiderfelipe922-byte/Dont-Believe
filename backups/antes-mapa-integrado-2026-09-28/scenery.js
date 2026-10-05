/* Cenários importados. Recortes e colisões usam pixels das imagens originais. */
(function(root){
'use strict';
const scenes={
 dorm:{file:'quarto.png',crop:[55,60,1425,820],blocks:[[55,60,1425,285],[185,340,190,170],[1145,340,195,175],[55,400,115,440],[1360,380,120,490],[310,640,75,100]]},
 study:{file:'Biblioteca.png',crop:[105,95,1330,710],blocks:[[105,95,1330,200],[105,295,255,65],[320,360,170,215],[675,350,190,350],[1040,350,190,240],[1290,300,145,180],[105,535,145,150],[1260,575,175,140],[350,675,150,130],[1050,670,145,135]]},
 cell:{file:'Cela.png',crop:[160,95,1215,680],blocks:[[160,95,1215,210],[160,305,135,295],[1250,305,125,290],[640,390,260,135],[160,575,480,200],[900,575,475,200]]},
 hall:{file:'Corredor.png',crop:[55,245,1870,275],blocks:[[55,245,1870,116]]},
 dining:{file:'sala.png',crop:[95,55,1345,840],blocks:[[95,55,1345,110],[170,215,355,180],[1010,215,355,180],[170,550,355,180],[1010,550,355,180],[635,380,265,265],[95,835,250,60],[1190,835,250,60]]},
 kitchen:{file:'cozinha.png',crop:[80,115,1380,745],blocks:[[80,115,1380,220],[80,335,95,290],[1340,330,120,355],[365,425,340,120],[835,425,340,120],[410,635,280,120],[840,635,300,120],[80,725,310,135],[1300,710,160,150]]},
 office:{file:'Vigia.png',crop:[260,150,1010,620],blocks:[[260,150,1010,220],[260,370,95,270],[1210,440,60,230],[595,460,345,155]]},
 archive:{file:'Arquivos.png',crop:[110,100,1320,700],blocks:[[110,100,1320,210],[110,310,225,100],[110,445,255,230],[615,415,300,190],[1185,400,245,245],[110,685,420,115],[1120,675,310,125]]}
};
function rect(room,s,b,T){const [sx,sy,sw,sh]=s.crop;return {x:(room.x+(b[0]-sx)/sw*room.w)*T,y:(room.y+(b[1]-sy)/sh*room.h)*T,w:b[2]/sw*room.w*T,h:b[3]/sh*room.h*T};}
function entrances(M,room){const {T,grid}=M,result=[],s=scenes[room.id];for(const side of ['top','bottom']){const row=side==='top'?room.y-1:room.y+room.h;let start=null;for(let x=room.x;x<=room.x+room.w;x++){const open=x<room.x+room.w&&grid[row]?.[x];if(open&&start===null)start=x;if(!open&&start!==null){const edge=side==='top'?s.crop[1]:s.crop[1]+s.crop[3];const touching=s.blocks.filter(b=>{const p=rect(room,s,b,T);return p.x<(x*T)&&p.x+p.w>start*T&&(side==='top'?b[1]<=edge:b[1]+b[3]>=edge);});let depth=touching.length?Math.max(...touching.map(b=>b[3]/s.crop[3]*room.h*T))+16:16;depth=Math.min(room.h*T,depth);result.push({x:start*T,y:side==='top'?room.y*T:(room.y+room.h)*T-depth,w:(x-start)*T,h:depth,repair:touching.length>0});start=null;}}}return result;}
function geometry(M){return M.rooms.flatMap(room=>{const s=scenes[room.id];return s.blocks.map((b,i)=>({...rect(room,s,b,M.T),id:'scenery-'+room.id+'-'+i,room:room.id,solid:true}));});}
// As molduras são recortes dos próprios cenários; nenhum contorno procedural.
const borders={
 dorm:{top:[55,25,1425,35],bottom:[55,880,1425,65],left:[25,60,30,820],right:[1480,60,30,820]},
 study:{top:[105,60,1330,35],bottom:[105,805,1330,65],left:[42,95,63,710],right:[1435,95,60,710]},
 cell:{top:[160,48,1215,47],bottom:[160,775,1215,65],left:[100,95,60,680],right:[1375,95,60,680]},
 hall:{top:[55,205,1870,40],bottom:[55,520,1870,48],left:[18,370,37,150],right:[1925,370,40,150]},
 dining:{top:[95,15,1345,40],bottom:[95,895,1345,65],left:[32,55,63,840],right:[1440,55,63,840]},
 kitchen:{top:[80,80,1380,35],bottom:[80,860,1380,62],left:[22,115,58,745],right:[1460,115,58,745]},
 office:{top:[260,110,1010,40],bottom:[260,770,1010,65],left:[215,150,45,620],right:[1270,150,50,620]},
 archive:{top:[110,70,1320,30],bottom:[110,800,1320,65],left:[45,100,65,700],right:[1430,100,60,700]}
};
function tileFloor(c,img,area,stone=false){
 if(!img){c.fillStyle='#392b30';c.fillRect(area.x,area.y,area.w,area.h);return;}
 const source=stone?[454,16,188,196]:[17,16,197,195],size=64;
 c.save();c.beginPath();c.rect(area.x,area.y,area.w,area.h);c.clip();
 for(let y=Math.floor(area.y/size)*size;y<area.y+area.h;y+=size)for(let x=Math.floor(area.x/size)*size;x<area.x+area.w;x+=size)c.drawImage(img,...source,x,y,size,size);
 c.restore();
}
function wallCells(M){const result=[];for(let y=0;y<M.H;y++)for(let x=0;x<M.W;x++)if(!M.grid[y][x]&&[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>M.grid[y+dy]?.[x+dx]))result.push([x,y]);return result;}
function draw(c,M,art){const T=M.T,walls=wallCells(M);c.fillStyle='#0c090e';c.fillRect(0,0,M.W*T,M.H*T);
 // Piso do atlas somente nas conexões; o piso e os tapetes dos cômodos ficam intactos.
 for(const [x,y,w,h]of M.passages)tileFloor(c,art.floorTiles,{x:x*T,y:y*T,w:w*T,h:h*T});
 for(const [x,y]of walls){if(art.floorTiles){c.save();c.translate(x*T,y*T);if(M.grid[y]?.[x-1]||M.grid[y]?.[x+1]){c.translate(T,0);c.rotate(Math.PI/2);}c.drawImage(art.floorTiles,48,814,150,48,0,0,T,T);c.restore();}else{c.fillStyle='#30232e';c.fillRect(x*T,y*T,T,T);}}
 for(const room of M.rooms){const s=scenes[room.id],img=art['scene_'+room.id],x=room.x*T,y=room.y*T,w=room.w*T,h=room.h*T;
 if(!img){tileFloor(c,art.floorTiles,{x,y,w,h});c.fillStyle='#352832';for(const b of s.blocks){const p=rect(room,s,b,T);c.fillRect(p.x,p.y,p.w,p.h);}continue;}
 c.drawImage(img,...s.crop,x,y,w,h);
 // Mantém o recorte original ao longo de todo o perímetro, sem fechar as conexões.
 c.save();c.beginPath();for(const [tx,ty]of walls)c.rect(tx*T,ty*T,T,T);c.clip();const border=borders[room.id];
 c.drawImage(img,...border.top,x,y-T,w,T);c.drawImage(img,...border.bottom,x,y+h,w,T);
 c.drawImage(img,...border.left,x-T,y,T,h);c.drawImage(img,...border.right,x+w,y,T,h);c.restore();
 // Só remove um obstáculo quando ele realmente cruza a entrada. Na biblioteca,
 // a passagem central já está livre e nenhuma faixa é pintada sobre o tapete.
 for(const e of entrances(M,room).filter(e=>e.repair))tileFloor(c,art.floorTiles,e);
 }
}
const doorFrames={wood:{x:178,y:16,w:146,h:145},bars:{x:176,y:208,w:150,h:151}};
function drawDoor(c,d,open,art){if(!art.doorTiles)return false;const f=doorFrames[d.id==='cell'||d.id==='exit'?'bars':'wood'],sx=f.x+(open?4*207:0),width=d.vertical?d.h:d.w,height=Math.min(52,width*f.h/f.w);
 c.save();c.translate(d.x,d.y);if(d.vertical)c.rotate(Math.PI/2);c.drawImage(art.doorTiles,sx,f.y,f.w,f.h,0,8-height,width,height);c.restore();return true;
}
const api={scenes,geometry,entrances,draw,drawDoor,borders,tileFloor};root.GameScenery=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
