/* Prólogo: lembrança em tela cheia, estrada explorável e revelação do carro. */
(function(root){
'use strict';
const opening=[
 {who:'KALI',text:'Naquela noite, deixamos a casa perto do bosque. Meus pais disseram que precisávamos partir antes que a Actras nos encontrasse.'},
 {who:'INAURI',text:'Eles estão atrás de nós. Afaste-se da janela, Kali. Fique abaixado.'},
 {who:'DATY',text:'Escute, meu filho. Não importa o que aconteça: não deixe ninguém decidir no que você deve acreditar.'},
 {who:'KALI',text:'Minha mãe olhou para o símbolo no meu peito. Eu o apertei entre os dedos. Meu pai continuava olhando para a estrada… e para trás.'},
 {who:'INAURI',text:'Abaixe a cabeça! Segure firme!'},
 {who:'KALI',text:'Um impacto na lateral. O som do vidro. Depois, tudo ficou escuro.'}
];
const loss=[
 {who:'KALI',text:'Mãe…? Pai…? Eu estou aqui.'},
 {who:'KALI',text:'Eu esperei que olhassem para mim outra vez. Nenhum dos dois se moveu.'},
 {who:'KALI',text:'O fogo já alcançava a janela. Eu queria segurar a mão da minha mãe, mas o calor me fez recuar.'}
];
const aftermath=[
 {who:'UMA VOZ',text:'O menino está vivo. Levem para OldHood.'},
 {who:'KALI',text:'Mãos me puxaram para longe do carro. Eu tentei voltar. Alguém segurou meu casaco.'},
 {who:'KALI',text:'O cordão arrebentou. Um homem recolheu o símbolo do chão, embrulhou-o e anotou alguma coisa.'},
 {who:'KALI',text:'Foi assim que uma lembrança da minha família virou um item numa lista.'},
 {who:'',text:'Anos depois…'}
];
const stages=new Set(['opening','road','loss','aftermath']);
const spawn={x:1060,y:535,dir:'up',step:0};
const car={x:1115,y:380,range:92};
const bounds={w:1672,h:941};
// Recortes do alpha da fonte. Evitam ler pixels de arquivos file:// no navegador.
const childFrames=[[[160,10,146,266],[447,13,145,270],[721,13,149,270],[1007,13,145,271]],[[159,313,147,270],[444,314,152,271],[722,313,149,272],[1002,313,152,272]],[[155,609,151,271],[440,610,153,272],[716,609,154,274],[1008,609,153,274]],[[162,910,142,268],[441,906,148,272],[720,906,149,274],[1007,909,146,270]]];
function normalize(state){
 const old=state.prologue&&typeof state.prologue==='object'&&!Array.isArray(state.prologue)?state.prologue:{},phase=stages.has(old.phase)?old.phase:'opening';
 const script=phase==='opening'?opening:phase==='loss'?loss:aftermath;
 const player=old.player&&typeof old.player==='object'&&!Array.isArray(old.player)?old.player:{};
 old.phase=phase;old.page=Number.isInteger(old.page)?Math.max(0,Math.min(script.length-1,old.page)):0;
 Object.assign(player,{x:Number.isFinite(player.x)?Math.max(80,Math.min(1590,player.x)):spawn.x,y:Number.isFinite(player.y)?Math.max(375,Math.min(615,player.y)):spawn.y,
  dir:['up','down','left','right'].includes(player.dir)?player.dir:spawn.dir,step:Number.isFinite(player.step)?player.step:0});
 old.player=player;state.prologue=old;return old;
}
function create({document,art,getState,save,finish,clearMovement,pause,reduced}){
 const $=id=>document.getElementById(id),shell=$('prologue-screen'),image=$('prologue-image'),canvas=$('prologue-world'),ctx=canvas.getContext('2d');
 let active=false,busy=false,serial=0,clock=0;
 const data=()=>normalize(getState());
 const isReduced=()=>reduced()||!!root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(root.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));}
 function near(){const p=data().player;return Math.hypot(p.x-car.x,p.y-car.y)<car.range;}
 function controls(){
  const road=data().phase==='road';document.body.classList.toggle('prologue-road',road);
  $('prologue-next').hidden=busy||(road&&!near());
  $('prologue-next').textContent=road?'Examinar o carro →':'Continuar →';
  $('prologue-hint').textContent=road?(near()?'E / Espaço · examinar':'WASD / setas · aproximar-se do carro'):'E / Enter / Espaço · continuar';
 }
 function render(){
  if(!active)return;
  const p=data(),road=p.phase==='road',before=p.phase==='opening';
  shell.dataset.phase=p.phase;canvas.hidden=!road;image.hidden=road;
  if(!road){const key=before?'prologueFamily':'prologueLoss';if(image.getAttribute('src')!==art.urls[key])image.src=art.urls[key];shell.style.setProperty('--prologue-art','url("'+image.src+'")');
   image.alt=before?'Perspectiva de Kali no banco traseiro. Seus pais olham para ele, desesperados, na estrada à noite.':'Daty e Inauri permanecem imóveis dentro do carro azul tombado. Há chamas junto à janela.';}
  const line=road?{who:'KALI',text:'O carro… Preciso chegar perto. Meus pais ainda estavam lá dentro.'}:(before?opening:p.phase==='loss'?loss:aftermath)[p.page];
  $('prologue-speaker').textContent=line.who;$('prologue-text').textContent=line.text;
  $('prologue-text').dataset.page=p.phase+':'+p.page;
  controls();resize();
 }
 async function transition(change){
  if(busy||!active)return;
  busy=true;clearMovement();const token=++serial;controls();shell.style.setProperty('--prologue-fade-ms',isReduced()?'0ms':'200ms');shell.classList.add('is-fading');shell.setAttribute('aria-busy','true');
  const delay=ms=>new Promise(resolve=>root.setTimeout(resolve,ms));
  await delay(isReduced()?0:220);if(token!==serial||!active)return;
  change();save();render();
  await delay(isReduced()?0:160);if(token!==serial||!active)return;
  shell.classList.remove('is-fading');shell.removeAttribute('aria-busy');busy=false;controls();
  if(data().phase!=='road')$('prologue-next').focus({preventScroll:true});else canvas.focus({preventScroll:true});
 }
 function advance(){
  if(!active||busy)return;
  const p=data();
  if(p.phase==='road'){if(near())transition(()=>{p.phase='loss';p.page=0;});return;}
  const script=p.phase==='opening'?opening:p.phase==='loss'?loss:aftermath;
  if(p.page<script.length-1){p.page++;save();render();return;}
  if(p.phase==='opening')transition(()=>{p.phase='road';p.page=0;});
  else if(p.phase==='loss')transition(()=>{p.phase='aftermath';p.page=0;});
  else transition(()=>{hide();finish();});
 }
 function show(){active=true;busy=false;serial++;normalize(getState());shell.hidden=false;shell.classList.remove('is-fading');shell.removeAttribute('aria-busy');
  document.body.classList.add('in-prologue');$('notice').hidden=true;$('interact-prompt').hidden=true;clearMovement();render();
  if(data().phase==='road')canvas.focus({preventScroll:true});else $('prologue-next').focus({preventScroll:true});}
 function hide(){active=false;busy=false;serial++;shell.hidden=true;shell.classList.remove('is-fading');shell.removeAttribute('aria-busy');document.body.classList.remove('in-prologue','prologue-road');clearMovement();}
 function update(dt,keys){
  if(!active||busy||data().phase!=='road')return false;
  const p=data().player,dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);
  if(!dx&&!dy){p.step=0;return false;}
  const len=Math.hypot(dx,dy),x=p.x,y=p.y;
  p.x=Math.max(80,Math.min(1590,p.x+dx/len*155*dt));p.y=Math.max(375,Math.min(615,p.y+dy/len*155*dt));
  p.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  const distance=Math.hypot(p.x-x,p.y-y);p.step=distance?p.step+distance/18:0;controls();return distance>0;
 }
 function draw(time){
  if(!active||data().phase!=='road')return;
  clock=time;const p=data().player,w=canvas.width,h=canvas.height,bg=art.images.prologueRoad;if(!bg)return;
  const portrait=w<h;
  const scale=Math.max(w/bounds.w,h/bounds.h,portrait?w/660:h/800);
  const vw=w/scale,vh=h/scale,focusX=(p.x+car.x)/2,focusY=(p.y+car.y)/2+35;
  const x=Math.max(0,Math.min(bounds.w-vw,focusX-vw/2)),y=Math.max(0,Math.min(bounds.h-vh,focusY-vh/2));
  ctx.fillStyle='#080b12';ctx.fillRect(0,0,w,h);ctx.save();ctx.scale(scale,scale);ctx.translate(-x,-y);ctx.imageSmoothingEnabled=true;ctx.drawImage(bg,0,0,bounds.w,bounds.h);ctx.imageSmoothingEnabled=false;
  const row={down:0,left:1,right:2,up:3}[p.dir],col=p.step?Math.floor(p.step)%4:0,frame=childFrames[row][col];
  if(frame){const [sx,sy,sw,sh]=frame,dh=58,dw=sw/sh*dh;ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(p.x,p.y-1,15,4,0,0,Math.PI*2);ctx.fill();ctx.drawImage(art.images.prologueChild,sx,sy,sw,sh,p.x-dw/2,p.y-dh,dw,dh);}
  // Luz sutil do incêndio, com pulsação desativada em movimento reduzido.
  const pulse=isReduced()?1:.95+Math.sin(clock*.003)*.05,glow=ctx.createRadialGradient(1110,315,5,1110,315,170);
  glow.addColorStop(0,'#ffad1820');glow.addColorStop(1,'#ff6f0000');ctx.globalAlpha=pulse;ctx.fillStyle=glow;ctx.fillRect(940,145,340,340);ctx.restore();
 }
 $('prologue-next').addEventListener('click',advance);$('prologue-pause').addEventListener('click',pause);
 function focus(){if(active)(data().phase==='road'?canvas:$('prologue-next')).focus({preventScroll:true});}
 return {show,hide,advance,update,draw,resize,near,focus,get active(){return active;},get busy(){return busy;},get walking(){return active&&!busy&&data().phase==='road';}};
}
const api={opening,loss,aftermath,spawn,car,bounds,normalize,create};root.GamePrologue=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
