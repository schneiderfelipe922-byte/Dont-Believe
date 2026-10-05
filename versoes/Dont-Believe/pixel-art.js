(function(root){
'use strict';
// Arte original em pixels: a mesma paleta e unidade gráfica em todo o orfanato.
const P={ink:'#21151e',deep:'#241922',wall:'#6f4b43',wallLight:'#765654',beam:'#2e2027',beamLight:'#51323a',wood:'#664039',woodLight:'#815a4c',woodDark:'#38232a',gold:'#aa9568',paper:'#c4bca1',teal:'#414e54',green:'#574042'};
const R=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function box(c,x,y,w,h,color,edge=P.ink){R(c,x,y,w,h,edge);R(c,x+2,y+2,w-4,h-4,color);}
function line(c,x,y,w,color){R(c,x,y,w,2,color);}
function diamond(c,x,y,s,color){for(let j=-s;j<=s;j++)R(c,x-(s-Math.abs(j)),y+j,(s-Math.abs(j))*2+1,1,color);}
function book(c,x,y,w=12,h=16,color='#506f62'){box(c,x,y,w,h,color);R(c,x+w-4,y+3,2,h-6,P.paper);R(c,x+3,y+3,2,h-6,'#ffffff20');R(c,x+3,y+5,w-8,2,P.gold);}
function candle(c,x,y){R(c,x-6,y+11,14,3,P.ink);R(c,x-4,y+9,10,2,P.gold);R(c,x,y+1,2,9,P.gold);R(c,x-2,y-9,6,11,P.paper);R(c,x-2,y-9,2,10,'#f4e8c4');R(c,x,y-15,2,5,'#f3ac50');R(c,x,y-13,2,3,'#fff1b0');}
function windowArt(c,x,y,w=60,h=48){box(c,x-4,y-4,w+8,h+8,P.woodLight);box(c,x,y,w,h,'#c06439');R(c,x+5,y+4,w-10,h-10,'#ce713e');R(c,x+7,y+6,w/2-10,h/2-5,'#f39c56');R(c,x+w/2+3,y+h/2+1,w/2-10,h/2-6,'#ce773f');R(c,x+w/2-2,y+1,4,h-2,P.woodDark);R(c,x,y+h/2-2,w,4,P.woodDark);R(c,x-8,y-7,w+16,4,P.gold);for(let side=0;side<2;side++){const xx=x-5+side*(w-12);R(c,xx,y-3,17,h-4,P.ink);R(c,xx+2,y-2,13,h-7,'#38242c');for(let a=0;a<3;a++)R(c,xx+3+a*4,y,2,h-12,['#5b3540','#452b34','#6e4344'][a]);R(c,xx+2,y+h-17,13,3,P.gold);R(c,xx+5,y+h-12,9,10,'#54313a');}R(c,x-7,y+h,w+14,5,P.woodDark);line(c,x-5,y+h,w+10,P.woodLight);}
function picture(c,x,y,w=28,h=24){box(c,x,y,w,h,P.woodLight);box(c,x+3,y+3,w-6,h-6,'#426363');R(c,x+6,y+7,5,8,'#c3ad71');R(c,x+11,y+12,5,5,'#698460');R(c,x+w-10,y+6,3,9,'#81946e');line(c,x,y,w,P.gold);}
function carpet(c,x,y,w,h,round=false,purple=false){const base=purple?'#594052':'#5e4248',light=purple?'#8e667a':'#93705c';if(round){for(let j=0;j<h;j+=2){const d=(j-h/2)/(h/2),ww=Math.round(w/2*Math.sqrt(Math.max(0,1-d*d))/2)*2;R(c,x+w/2-ww,y+j,ww*2,2,P.woodDark);if(ww>5)R(c,x+w/2-ww+4,y+j,ww*2-8,2,light);if(ww>9&&j>7&&j<h-8)R(c,x+w/2-ww+8,y+j,ww*2-16,2,base);}}else{box(c,x,y,w,h,P.woodDark);box(c,x+3,y+3,w-6,h-6,light);box(c,x+7,y+7,w-14,h-14,base,base);for(let a=4;a<w;a+=8){R(c,x+a,y-3,2,4,light);R(c,x+a,y+h-1,2,4,light);}for(let a=14;a<w-10;a+=18){diamond(c,x+a,y+13,2,light);diamond(c,x+a,y+h-14,2,light);}line(c,x+10,y+20,w-20,light);line(c,x+10,y+h-22,w-20,light);}for(let a=25;a<w-20;a+=25)for(let b=29;b<h-20;b+=25)diamond(c,x+a,y+b,2,light);}
function furniture(c,p){let{x,y,w,h}=p; x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let type=p.id==='crates'?'fridge':p.type.replace(/^art/,'');if(type==='wall')return;if(type==='rug'){carpet(c,x,y,w,h,false,p.id==='altarRug');return;}R(c,x+4,y+6,w,h,'#161d1840');
if(type==='fridge'){box(c,x,y,w,h,'#37434b');box(c,x+3,y+3,w-6,h*.32,'#4e5960');box(c,x+3,y+h*.34,w-6,h*.62,'#46515b');R(c,x+8,y+h*.45,3,16,'#1e2935');R(c,x+8,y+8,3,9,'#26303d');R(c,x+w*.6,y+h*.4,10,13,'#b8957c');R(c,x+w*.65,y+h*.41,3,3,'#91504c');R(c,x+5,y+h-9,w-10,2,'#5b6060');
}else if(type==='bed'){
 box(c,x,y,w,h,P.woodDark);box(c,x+3,y+1,w-6,28,P.woodLight);R(c,x+10,y-3,w-20,5,P.woodDark);line(c,x+12,y,w-24,P.gold);for(let a=12;a<w-8;a+=13)diamond(c,x+a,y+12,4,'#795c39');
 box(c,x+5,y+25,w-10,h-35,'#c1b494');box(c,x+8,y+26,w-16,20,'#c3b7ae');R(c,x+10,y+28,w-20,3,'#e0d1bd');R(c,x+w/2,y+27,2,16,'#8b8180');box(c,x+7,y+47,w-14,h-61,P.teal);R(c,x+10,y+48,w-20,6,'#618378');R(c,x+12,y+55,3,h-74,'#456872');R(c,x+8,y+h-18,w-16,5,'#c0ab80');box(c,x,y+h-11,w,11,P.woodLight);R(c,x+3,y+h-2,6,7,P.woodDark);R(c,x+w-9,y+h-2,6,7,P.woodDark);
}else if(type==='cabinet'){
 box(c,x,y,w,h,P.woodDark);box(c,x+3,y-4,w-6,9,P.woodLight);for(let side=0;side<2;side++){const xx=x+5+side*(w/2-3);box(c,xx,y+10,w/2-7,h-18,'#764b3e');box(c,xx+5,y+15,w/2-17,h-32,'#624039',P.woodLight);R(c,xx+(side?5:w/2-16),y+h/2,3,5,P.gold);}R(c,x+4,y+h-2,6,5,P.woodDark);R(c,x+w-10,y+h-2,6,5,P.woodDark);
}else if(type==='books'){
 box(c,x,y,w,h,P.woodDark);R(c,x+4,y+4,w-8,h-8,'#211821');for(let yy=y+5;yy<y+h-12;yy+=21){for(let a=6;a<w-9;a+=9){const bh=12+((a*7)%5);R(c,x+a,yy+16-bh,6,bh,['#486963','#916049','#777443','#535b72'][Math.floor(a/9)%4]);R(c,x+a+1,yy+18-bh,4,2,P.gold);}R(c,x+3,yy+17,w-6,4,P.woodLight);}line(c,x,y,w,P.woodLight);R(c,x+3,y+h-5,w-6,3,P.woodLight);
}else if(['table','counter','desk'].includes(type)){
 box(c,x+4,y+5,w-8,h-4,P.woodDark);box(c,x,y,w,h-7,P.woodLight);for(let a=12;a<w-4;a+=15){line(c,x+4,y+(a%(h-13)),w-8,'#8d683f');R(c,x+a,y+3,1,h-14,'#b28b54');}R(c,x+5,y+h-5,6,10,P.woodDark);R(c,x+w-11,y+h-5,6,10,P.woodDark);
 if(type==='desk'){box(c,x+8,y+12,w-18,24,P.woodDark);R(c,x+10,y+14,w-22,20,P.wood);R(c,x+w/2,y+20,4,3,P.gold);R(c,x+12,y+41,28,20,P.paper);for(let a=0;a<3;a++)line(c,x+16,y+47+a*4,17,'#9d8b68');book(c,x+w-29,y+43,17,22,'#667257');candle(c,x+w-19,y+11);
 }else if(type==='table'){R(c,x+8,y+8,w-16,h-27,'#755657');R(c,x+10,y+10,w-20,h-31,'#a08779');for(let a=14;a<w-6;a+=29){box(c,x+a,y+12,12,10,'#ddd4ba');R(c,x+a+3,y+14,6,5,'#9c865c');R(c,x+a+14,y+12,2,11,P.paper);}}else{box(c,x+9,y+5,30,25,'#7d6e66');box(c,x+13,y+9,22,16,'#484750');R(c,x+23,y+4,4,9,P.paper);R(c,x+48,y+12,21,12,'#b88961');R(c,x+50,y+10,17,2,'#d6ab7d');}
}else if(type==='bench'){box(c,x,y,w,12,P.woodLight);line(c,x+3,y+3,w-6,'#b08c59');R(c,x+5,y+12,4,6,P.woodDark);R(c,x+w-9,y+12,4,6,P.woodDark);
}else if(type==='crate'){
 box(c,x,y,w,h,P.wood);for(let a=8;a<w;a+=12)R(c,x+a,y+2,2,h-4,P.woodDark);box(c,x+1,y+4,w-2,7,P.woodLight);box(c,x+1,y+h-12,w-2,7,P.woodLight);R(c,x+w/2-3,y+h/2-3,6,8,'#b6a67c');
}else if(type==='plant'){
 box(c,x+4,y+14,18,13,'#865044');line(c,x+5,y+15,16,'#b07351');R(c,x+8,y+19,10,9,'#705439');for(const[xx,yy,s,col]of [[7,7,6,'#47663c'],[18,9,7,'#426444'],[11,0,7,'#597d41'],[4,4,5,'#5d7249'],[18,1,5,'#658646']])diamond(c,x+xx,y+yy,s,col);diamond(c,x+13,y+3,4,'#765184');diamond(c,x+13,y+3,1,'#dbac6d');
}else if(type==='stove'){
 box(c,x,y,w,h,'#4f4c54');for(let a=10;a<w-12;a+=30){box(c,x+a,y+6,20,18,'#2c3833');box(c,x+a+4,y+8,12,11,'#73747a');R(c,x+a+4,y+5,12,3,'#b0b49c');}box(c,x+9,y+h-17,w-18,13,'#39343e');R(c,x+15,y+h-12,20,4,'#d3904d');
}else if(type==='altar'){
 box(c,x-5,y+h-9,w+10,16,'#42534a');box(c,x,y,w,h-8,'#5e6a58');box(c,x-3,y-4,w+6,12,'#b8b298');R(c,x+3,y+4,w-6,7,P.paper);R(c,x+w/2-17,y+4,34,h-1,'#817045');R(c,x+w/2-14,y+4,28,h-1,'#d5c7a1');diamond(c,x+w/2,y+h/2,9,P.gold);R(c,x+w/2-1,y+18,3,31,'#716046');candle(c,x+17,y+2);candle(c,x+w-20,y+2);book(c,x+w-40,y-9,14,9,'#4e3d4d');
}else if(type==='relic'){box(c,x,y,w,h,'#665241');box(c,x+4,y+4,w-8,h-8,P.gold);box(c,x+8,y+8,w-16,h-16,'#3b3f39');diamond(c,x+w/2,y+h/2,9,'#aa8d52');R(c,x+w/2-1,y+12,3,26,'#efd99a');R(c,x+w/2-7,y+18,15,3,'#efd99a');}
}
function floorTile(c,x,y){const px=x*24,py=y*24;for(let row=0;row<2;row++){const yy=py+row*12,n=(x*7+y*3+row)%5;R(c,px,yy,24,12,['#422630','#4c2d36','#35222c','#462832','#522e36'][n]);R(c,px,yy,24,2,'#291922');R(c,px,yy+2,24,1,'#624048');const joint=(x+Math.floor(y*2+row))%3===0?7:24;if(joint<24)R(c,px+joint,yy+2,2,10,'#301c24');R(c,px+3,yy+7,13,1,'#503139');R(c,px+14,yy+9,7,1,'#3d252c');}}
function buildMap(c,M){const{T,W,H}=M;R(c,0,0,W*T,H*T,'#0c090e');
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const t=M.grid[y][x],px=x*T,py=y*T;if(t){floorTile(c,x,y); }
 else if([[0,1],[0,-1],[1,0],[-1,0]].some(([a,b])=>M.grid[y+b]?.[x+a])){box(c,px,py,T,T,P.beam);R(c,px+3,py+3,T-6,3,P.beamLight);R(c,px+3,py+5,3,T-9,'#425446');R(c,px+T-5,py+7,3,T-9,'#263b34');}}
 for(const r of M.rooms){const x=r.x*T,y=r.y*T,w=r.w*T; // Back wall resides above the walkable floor.
 box(c,x-6,y-28,w+12,36,P.wall);R(c,x+2,y-26,w-4,18,'#1e1625');R(c,x+2,y-8,w-4,9,P.wallLight);R(c,x,y-5,w,5,'#57323b');R(c,x,y,w,4,P.deep);for(let a=18;a<w;a+=46){R(c,x+a,y-17,5,2,'#66424c');R(c,x+a+6,y-14,2,4,'#78505a');}for(const xx of [x-12,x+w-7]){box(c,xx,y-31,19,43,P.beam);R(c,xx+3,y-27,12,4,P.beamLight);}if(r.id!=='hall'&&r.id!=='dorm'){const ww=Math.min(58,w*.2);windowArt(c,x+w*.53-ww/2,y-27,ww,28);picture(c,x+w*.24,y-22,24,19);}else if(r.id==='hall')for(let a=130;a<w;a+=240){picture(c,x+a,y-24,27,22);}}
 // Open the wall at every real north entrance; decoration must not hide a passage.
 for(const room of M.rooms){const y=room.y*T;for(let tx=room.x;tx<room.x+room.w;tx++){if(!M.grid[room.y-1]?.[tx])continue;const x=tx*T;floorTile(c,tx,room.y-1);R(c,x,y,T,4,'#63383a');if(!M.grid[room.y-1]?.[tx-1]){R(c,x-4,y-26,5,31,P.deep);R(c,x-2,y-24,2,27,P.woodLight);}if(!M.grid[room.y-1]?.[tx+1]){R(c,x+T-1,y-26,5,31,P.deep);R(c,x+T,y-24,2,27,P.woodLight);}}}
 // Bedroom preserves the bed, round rug, cabinet, writing desk and scattered papers.
 carpet(c,205,194,175,108,true);windowArt(c,242,51,77,46);picture(c,164,55,36,29);picture(c,207,64,19,24);
 furniture(c,{type:'table',x:166,y:113,w:43,h:35});book(c,177,115,18,24,'#446c69');
 carpet(c,1110,167,130,60,false,true);carpet(c,910,642,140,69);carpet(c,854,939,113,70);carpet(c,1226,940,121,69,false,true);
 M.props.filter(p=>p.type==='rug').forEach(p=>furniture(c,p));
 M.props.filter(p=>p.type!=='rug'&&p.id!=='plant4').forEach(p=>furniture(c,p));
 for(const [x,y]of [[378,276],[188,258],[873,970],[704,234],[1294,987]]){R(c,x+2,y+2,17,12,'#312d2444');R(c,x,y,16,11,P.paper);for(let a=0;a<2;a++)line(c,x+3,y+3+a*3,9,'#9b8b6d');}
 for(const [bx,by]of [[420,57],[742,101],[1326,909],[1122,599]]){book(c,bx,by,17,12,'#594552');book(c,bx+2,by-7,16,11,'#4c5c61');book(c,bx-2,by-14,17,11,'#754943');}book(c,346,131,19,24,'#625373');book(c,468,282,13,18,'#8b5545');
 for(const room of M.rooms){const x=room.x*T,y=room.y*T,w=room.w*T;for(let i=11;i<w-15;i+=37){R(c,x+i,y-22,2,10,'#100f1855');R(c,x+i+2,y-12,4,2,'#261a26');}R(c,x,y+4,w,5,'#08091328');}
 for(const prop of M.props.filter(p=>p.solid&&!p.type.includes('wall')&&p.type!=='plant')){R(c,prop.x+4,prop.y+prop.h,prop.w,4,'#05070d48');}
 // Worn door thresholds follow actual carved passages, leaving them visibly open.
 for(const [x,y,w]of [[11,14,3],[32,12,3],[51,12,3],[14,20,3],[39,20,3],[38,31,3],[52,31,3]]){R(c,x*T,y*T,w*T,4,'#b29564');R(c,x*T,y*T+5,w*T,3,'#423e2c');}
}
const designs={kali:{hair:'#d7b34e',hl:'#f2d170',shirt:'#4c7843',light:'#82a858',pants:'#d5c3a0',skin:'#eac18d'},noah:{hair:'#603a2e',hl:'#85513a',shirt:'#973932',light:'#c45140',pants:'#343e3e',skin:'#dfa76f'},eron:{hair:'#278aca',hl:'#66c8ee',shirt:'#37769d',light:'#62aed0',pants:'#57475e',skin:'#dfd9c7'},mira:{hair:'#57372d',hl:'#86553e',shirt:'#292e30',light:'#454c4d',pants:'#83a9bd',skin:'#e5b28b'},guard:{hair:'#202e2b',hl:'#38453f',shirt:'#202c29',light:'#3b4940',pants:'#202925',skin:'#e2ac76'},leader:{hair:'#192521',hl:'#374439',shirt:'#1c2924',light:'#3b4b3d',pants:'#17231f',skin:'#d5aa79'}};
function person(c,kind='kali',dir='down',walk=0){const d=designs[kind]||designs.kali,hood=kind==='guard'||kind==='leader',back=dir==='up',left=dir==='left',right=dir==='right',side=left||right;
 const phase=walk>0?(walk-1)*Math.PI/4:0,stride=walk>0?Math.round(Math.sin(phase)*3):0,bob=walk>0&&walk%4===2?-1:0,swing=walk>0?Math.round(Math.cos(phase)):0;
 const r=(x,y,w,h,col)=>{let xx=x,yy=y;if(y<23)yy+=bob;if(y>=23&&w<=6&&h<=9){const shift=x<14?stride:-stride;const lift=side?Math.round(shift/2):shift;if(y===23||(kind==='noah'&&y===26))h=Math.max(1,h+lift);else yy+=lift;xx+=(side?shift:0)+(x<14?swing:-swing);}if(y>=16&&y<=25&&w<=4&&(x<=5||x>=20)){yy+=x<14?-stride:stride;}if(hood&&y>=18&&w>=14)xx+=Math.round(Math.sin(phase)*(y-17)/12)+swing;if(kind==='kali'&&x>=21&&y<12)yy+=Math.round(stride/2);R(c,xx,yy,w,h,col);},out=P.ink,foot=0;
 r(5,29,16,3,'#07161255');r(7,23,5,7+foot,out);r(15,23,5,8-foot,out);r(8,23,3,4,d.pants);r(16,23,3,4,d.pants);r(7,29+foot,6,2,'#29332d');r(15,30-foot,6,2,'#29332d');
 r(5,13,17,11,out);r(6,14,15,9,d.shirt);r(4,16,4,8,out);r(20,16,4,8,out);r(5,16,3,5,d.light);r(21,16,2,5,d.shirt);r(5,22,3,3,d.skin);r(21,22,3,3,d.skin);r(9,14,8,2,d.light);
 if(kind==='kali'){r(7,22,14,2,'#624831');r(13,22,3,2,P.gold);r(9,15,2,7,'#aac170');if(back){r(10,15,9,10,'#5e4935');r(11,16,7,7,'#a89056');r(14,15,2,10,'#d1c7a1');}}
 if(kind==='noah'){r(8,23,12,4,d.pants);r(8,26,3,2,d.skin);r(16,26,3,2,d.skin);r(10,15,7,2,'#ad4438');}
 if(kind==='mira'){r(10,15,7,8,'#d0d7cf');r(12,16,3,6,'#eff0db');r(8,24,3,3,'#b9d0d6');r(16,25,3,2,'#b9d0d6');}
 r(6,3,16,12,out);r(8,1,11,3,out);r(7,4,14,9,d.hair);r(8,3,11,5,d.hl);r(8,7,12,7,d.skin);r(9,13,10,2,'#bb805c');r(7,5,6,4,d.hair);r(8,5,4,2,d.hl);r(19,6,3,8,d.hair);
 if(kind==='mira'){r(5,7,3,12,d.hair);r(20,8,3,14,d.hair);r(6,7,2,10,d.hl);r(19,14,3,7,d.hl);r(9,4,8,2,d.hl);}
 if(kind==='eron'){r(5,5,4,5,d.hl);r(6,3,5,4,d.hl);r(13,1,4,3,d.hair);r(18,5,5,4,d.hl);r(9,6,4,5,d.hair);r(18,7,3,6,d.hair);}
 if(kind==='noah'){r(8,1,3,4,d.hair);r(16,0,3,4,d.hl);r(5,5,4,3,d.hair);r(13,4,6,3,d.hair);}
 if(kind==='kali'){r(7,0,14,3,out);r(8,1,12,3,d.light);r(6,3,16,3,d.shirt);r(19,2,4,5,d.shirt);r(21,5,4,4,d.shirt);r(23,8,3,3,d.shirt);r(7,5,6,2,d.hl);r(5,9,3,2,d.skin);r(21,9,3,2,d.skin);}
 if(back){r(7,5,14,10,d.hair);r(8,5,11,3,d.hl);if(kind==='kali'){r(7,4,15,7,d.shirt);r(11,6,10,5,d.light);r(16,11,7,3,d.shirt);}if(kind==='mira'){r(7,10,15,10,d.hair);r(8,11,2,7,d.hl);}}else{const a=left?8:right?16:10;r(a,10,2,3,'#253332');if(!side)r(17,10,2,3,'#253332');r(left?7:right?20:13,13,2,1,'#b77359');if(side)r(left?17:7,6,4,9,d.hair);}
 if(hood){r(9,0,8,2,out);r(7,2,12,3,d.shirt);r(5,5,17,11,out);r(6,5,15,3,d.light);r(6,8,4,9,d.shirt);r(19,8,3,9,d.shirt);r(10,8,9,7,back?d.shirt:'#101a17');if(!back){r(11,11,7,4,d.skin);r(14,13,3,1,'#9d614c');}for(let j=17;j<31;j++)r(6-Math.floor((j-17)/5),j,17+2*Math.floor((j-17)/5),1,out);for(let j=18;j<30;j++)r(7-Math.floor((j-18)/5),j,14+2*Math.floor((j-18)/5),1,d.shirt);r(7,20,2,8,d.light);r(19,20,2,9,'#34423b');r(11,18,2,11,'#131f1b');r(14,16,3,3,kind==='leader'?P.gold:'#8f815d');r(4,30,20,2,out);if(left||right){r(left?17:6,8,5,8,d.shirt);r(left?10:17,12,2,2,d.skin);}}
}
function sprite(c,x,y,kind='kali',dir='down',step=0,idle=0){if(root.CharacterSprites?.draw(c,x,y,kind,dir,step,idle))return;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x)-21,Math.round(y)-45+(step===0&&Math.sin(idle)> .94?-1:0));c.scale(1.5,1.5);person(c,kind,dir,step>0?1+Math.floor(step*2)%8:0);c.restore();}
function spriteAtlas(makeCanvas){const kinds=Object.keys(designs),dirs=['down','left','right','up'],sheet=makeCanvas(32*9,40*24),c=sheet.getContext('2d');c.imageSmoothingEnabled=false;for(let k=0;k<kinds.length;k++)for(let d=0;d<4;d++)for(let f=0;f<9;f++){c.save();c.translate(f*32+2,(k*4+d)*40+4);person(c,kinds[k],dirs[d],f);c.restore();}return {sheet,draw(c,x,y,kind='kali',dir='down',step=0,idle=0){const k=Math.max(0,kinds.indexOf(kind)),d=Math.max(0,dirs.indexOf(dir)),f=step>0?1+Math.floor(step*2)%8:0;c.imageSmoothingEnabled=false;c.drawImage(sheet,f*32,(k*4+d)*40,32,40,Math.round(x)-24,Math.round(y)-51+(f===0&&Math.sin(idle)>.94?-1:0),48,60);}};}
function portrait(c,kind='kali',x=0,y=0,size=64){const d=designs[kind]||designs.kali,hood=kind==='guard'||kind==='leader';c.save();c.translate(x,y);c.scale(size/64,size/64);const r=(x,y,w,h,col)=>R(c,x,y,w,h,col);
 // A hand-built 64px bust, deliberately distinct from the small walking sprite.
 r(9,54,46,10,P.ink);r(14,46,37,18,P.ink);r(17,44,31,20,d.shirt);r(12,51,9,13,d.shirt);r(47,51,8,13,d.shirt);r(19,48,6,16,d.light);r(41,47,5,17,d.light);r(28,40,12,10,d.skin);r(28,42,12,4,'#bd825e');
 r(16,12,36,27,P.ink);r(20,7,26,8,P.ink);r(14,20,39,18,d.hair);r(18,11,31,23,d.hair);r(20,9,24,7,d.hl);r(21,19,27,21,d.skin);r(25,39,19,5,d.skin);r(23,21,21,17,'#f0cda0');r(20,31,4,6,'#d99373');r(43,32,5,6,'#d99373');r(26,28,5,8,P.ink);r(40,28,5,8,P.ink);r(27,29,2,2,'#fff0cb');r(41,29,2,2,'#fff0cb');r(33,38,5,1,'#ab6d58');r(33,34,2,2,'#d99975');
 r(18,15,15,10,d.hair);r(22,12,17,6,d.hl);r(20,17,9,5,d.hl);r(46,18,6,22,d.hair);r(48,22,3,13,d.hl);
 if(kind==='kali'){r(18,5,26,6,P.ink);r(21,3,18,4,P.ink);r(19,6,25,7,d.shirt);r(22,5,16,4,d.light);r(43,8,9,9,d.shirt);r(49,14,8,9,d.shirt);r(53,22,7,7,d.shirt);r(17,12,29,5,d.light);r(15,26,7,5,d.skin);r(12,24,5,3,d.skin);r(49,26,6,4,d.skin);r(26,48,13,4,'#bdc98a');r(28,51,8,7,'#91b260');r(40,47,4,17,'#866441');r(26,30,5,5,'#426b59');r(40,30,5,5,'#426b59');r(27,29,2,2,'#fff4d6');r(41,29,2,2,'#fff4d6');}
 if(kind==='noah'){r(23,5,6,8,d.hair);r(39,2,5,11,d.hl);r(17,14,8,8,d.hair);r(32,14,9,6,d.hair);r(26,46,16,4,'#63312c');r(28,50,12,3,d.light);}
 if(kind==='eron'){r(14,16,8,11,d.hl);r(18,10,9,11,d.hl);r(33,7,14,9,d.hl);r(29,18,8,10,d.hair);r(42,18,9,10,d.hl);r(47,29,7,9,d.hair);r(24,45,19,6,'#3d3b52');r(29,48,12,10,d.light);r(26,53,5,8,'#c5d7cb');}
 if(kind==='mira'){r(12,26,8,24,d.hair);r(15,37,9,15,d.hair);r(48,27,8,27,d.hair);r(45,39,8,17,d.hair);r(14,25,3,18,d.hl);r(49,29,3,19,d.hl);r(22,9,8,6,d.hl);r(35,12,10,6,d.hl);r(28,48,12,16,'#d1d7d2');r(31,50,6,14,'#eef0e6');r(25,50,3,13,'#171f20');r(40,49,3,15,'#171f20');}
 if(hood){r(27,2,12,5,P.ink);r(22,6,23,5,d.shirt);r(17,11,32,7,d.shirt);r(14,18,39,11,d.shirt);r(17,15,7,30,d.light);r(15,26,7,19,d.shirt);r(46,19,9,26,d.light);r(21,20,28,10,'#101a17');r(22,29,25,5,'#151d18');r(26,33,18,8,d.skin);r(30,40,11,3,'#b67b56');r(33,37,7,2,'#97553d');r(21,42,26,7,d.shirt);r(23,48,21,7,d.light);r(28,51,4,13,'#14201b');r(36,51,3,13,'#14201b');diamond(c,34,51,3,kind==='leader'?P.gold:'#9b8c61');if(kind==='leader'){line(c,22,15,25,'#998755');line(c,22,17,25,'#38463b');}}
 c.restore();}
const api={buildMap,spriteAtlas,sprite,portrait,designs,person};root.PixelArt=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
