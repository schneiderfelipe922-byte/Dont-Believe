(function(root){
'use strict';
const themes={
 voz:{number:'01',label:'NINGUÉM FICA PARA TRÁS',accent:'#d6ac73',sky:'#463339',light:'#e3ac68',alt:'Kali, Mira e Eron diante dos portões abertos do orfanato.'},
 luz:{number:'02',label:'UM DEPOIS AINDA É POSSÍVEL',accent:'#e6b87f',sky:'#66515b',light:'#efbc80',alt:'Noah segura uma porta enquanto Kali, Mira e Eron alcançam o amanhecer.'},
 sobrevivente:{number:'03',label:'O PREÇO DA LIBERDADE',accent:'#8bada3',sky:'#203237',light:'#93aaa0',alt:'Kali e Mel na floresta, com o orfanato distante atrás das árvores.'},
 traicao:{number:'04',label:'A ÚLTIMA CONFIANÇA',accent:'#cf7371',sky:'#331c2b',light:'#a94b3e',alt:'Noah entre Kali e os adultos de capa preta, diante de uma porta trancada.'},
 isolamento:{number:'05',label:'NINGUÉM SABE ONDE VOCÊ ESTÁ',accent:'#a49ab6',sky:'#242130',light:'#766c91',alt:'Kali e Mel no fim de um corredor estreito, separados da saída por uma sombra.'},
 captura:{number:'06',label:'A ACTRAS AINDA OBSERVA',accent:'#b3997d',sky:'#29232a',light:'#a07753',alt:'Kali atrás das grades de uma cela sob o ponto vermelho de uma câmera.'}
};
// Recortes de exibição: excluem títulos e botões pintados na prancha.
// Os textos e controles acessíveis continuam no HTML do jogo.
const panels={voz:[8,31,494,362],luz:[521,31,494,362],sobrevivente:[1035,31,493,362],traicao:[8,541,494,359],isolamento:[521,541,494,359],captura:[1035,541,493,359]};
function draw(canvas,id){
 const art=root.GameArt?.images.endings,rect=panels[id];
 if(art&&rect){
  const c=canvas.getContext('2d');canvas.width=rect[2]*2;canvas.height=rect[3]*2;
  c.save();c.imageSmoothingEnabled=false;c.clearRect(0,0,canvas.width,canvas.height);
  c.drawImage(art,...rect,0,0,canvas.width,canvas.height);c.restore();return;
 }
 drawFallback(canvas,id);
}
function drawFallback(canvas,id){const theme=themes[id];if(!theme)return;const c=canvas.getContext('2d'),pixel=typeof PixelArt!=='undefined'?PixelArt:require('./pixel-art.js');c.save();c.imageSmoothingEnabled=false;c.clearRect(0,0,canvas.width,canvas.height);c.scale(canvas.width/480,canvas.height/360);
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const person=(x,y,kind,dir='down',scale=2)=>{c.save();c.translate(x,y);c.scale(scale,scale);pixel.sprite(c,0,0,kind,dir,0);c.restore();};
 const glow=(x,y,size,col)=>{const g=c.createRadialGradient(x,y,1,x,y,size);g.addColorStop(0,col);g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(x-size,y-size,size*2,size*2);};
 function floor(y,col){r(0,y,480,360-y,col);for(let j=y;j<360;j+=14){r(0,j,480,2,'#140f16');for(let x=(j%3)*18;x<480;x+=75)r(x,j,2,14,'#1e141a');}}
 function door(x,y,w,h,open=false){r(x-7,y-7,w+14,h+14,'#161018');r(x-3,y-3,w+6,h+6,'#715449');r(x,y,w,h,open?theme.light:'#412930');if(!open){r(x+w/2,y,3,h,'#170f19');r(x+w-13,y+h*.6,4,4,'#c49159');}r(x-10,y+h,w+20,5,'#8b6651');}
 r(0,0,480,360,theme.sky);
 if(id==='voz'||id==='luz'){
  for(let i=0;i<12;i++)r(0,75+i*9,480,9,['#6d4a44','#82564a','#9c6e51','#b4835c'][Math.min(3,Math.floor(i/3))]);
  glow(242,148,160,'#edb96b7a');floor(220,'#654b3b');
  for(let x=0;x<480;x+=22){if(x>110&&x<360)continue;r(x,131,6,118,'#201a22');r(x+2,127,2,6,'#201a22');}r(0,168,116,5,'#271c24');r(362,168,118,5,'#271c24');
  if(id==='voz'){
   for(const x of [88,371]){r(x,67,25,195,'#29202a');r(x-5,64,35,8,'#563d36');r(x+5,82,5,163,'#5a403a');}
   for(let i=0;i<4;i++){r(40+i*14,122+i*8,5,117-i*7,'#1d1920');r(402+i*14,146-i*8,5,94+i*7,'#1d1920');}
   person(174,260,'mira','up',1.45);person(304,251,'eron','up',1.45);person(239,288,'kali','up',1.8);
   for(const x of [70,385]){r(x,285,20,30,'#302831');r(x+3,275,14,14,'#594139');}
  }else{
   r(0,0,139,272,'#191722');door(58,90,71,158,true);r(72,95,49,152,'#30232d');
   person(111,248,'noah','right',1.6);person(303,236,'mira','right',1.15);person(352,237,'eron','right',1.15);person(274,273,'kali','right',1.6);
   for(let x=148;x<480;x+=31)r(x,280+(x%9),18,2,'#a57b57');
  }
 }else if(id==='sobrevivente'){
  glow(291,68,112,'#8baca344');r(276,34,28,24,'#93a298');r(281,30,18,31,'#93a298');floor(225,'#243630');
  r(177,114,108,89,'#364145');for(let i=0;i<18;i++)r(171+i*3,115-i*2,120-i*6,2,'#18292b');
  for(let x=190;x<280;x+=24)for(let y=128;y<178;y+=24)r(x,y,6,11,'#aa754d');
  for(const [x,y,w]of [[28,16,34],[80,70,22],[361,12,35],[429,52,28]]){r(x,y,w,360-y,'#101d21');r(x+6,y,5,360-y,'#26312f');for(let i=0;i<5;i++)r(x-25+i*4,y+40+i*5,w+50-i*8,5,'#152725');}
  for(let j=0;j<7;j++)r(208-j*10,210+j*23,48+j*20,23,j%2?'#3d4137':'#414439');
  person(244,303,'kali','down',1.8);glow(248,247,42,'#bdae5833');
 }else if(id==='traicao'){
  floor(227,'#48252b');door(168,40,145,193);r(186,58,110,13,'#271923');r(186,181,110,13,'#271923');
  glow(74,134,101,'#cb623b66');glow(411,134,101,'#cb623b55');for(const x of [65,410]){r(x,113,5,39,'#ba9468');r(x,104,5,9,'#ffbd67');}
  person(108,252,'guard','down',1.9);person(367,252,'leader','down',1.9);person(246,239,'noah','down',1.7);person(233,333,'kali','up',2);
  r(267,197,9,3,'#dec88d');r(270,193,3,11,'#dec88d');
 }else if(id==='isolamento'){
  floor(118,'#3d303b');for(let i=0;i<100;i++){r(0,i*3,135-i*.5,3,'#171620');r(345+i*.5,i*3,135-i*.5,3,'#171620');}
  r(135,16,210,100,'#39303d');for(let y=27;y<115;y+=18){r(138,y,203,2,'#221e2b');for(let x=145+(y%2)*27;x<340;x+=57)r(x,y,2,18,'#26222f');}
  r(155,108,171,5,'#514153');person(238,201,'kali','up',1.55);glow(240,195,80,'#8d729a22');
  person(251,384,'guard','up',3.5);
 }else{
  floor(240,'#3d2d30');for(let y=40;y<240;y+=26){r(0,y,480,2,'#211d25');for(let x=(y%3)*32;x<480;x+=81)r(x,y,2,26,'#211d25');}
  r(74,62,71,56,'#14121c');r(81,69,57,42,'#615653');for(let x=89;x<136;x+=14)r(x,67,5,48,'#16171e');
  r(72,218,114,31,'#473534');r(72,215,114,6,'#867357');person(235,278,'kali','down',1.8);
  r(351,70,39,17,'#11141d');r(386,74,9,12,'#666266');r(365,83,4,16,'#11141d');r(357,75,4,4,'#e34640');glow(359,77,32,'#d9443a33');
  for(let x=18;x<480;x+=62){r(x,5,10,355,'#10111a');r(x+2,5,2,355,'#393039');}r(0,31,480,12,'#12111a');r(0,315,480,10,'#12111a');
 }
 const v=c.createRadialGradient(240,174,63,240,174,290);v.addColorStop(0,'#0000');v.addColorStop(1,'#070711cc');c.fillStyle=v;c.fillRect(0,0,480,360);c.restore();
}
const api={themes,panels,draw};root.EndingScreens=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
