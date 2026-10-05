(function(root){
'use strict';
function createRenderer(canvas,M,makeCanvas,art={}){
const ctx=canvas.getContext('2d'),map=makeCanvas(M.W*M.T,M.H*M.T),g=map.getContext('2d');let clock=0;const doorAnimation=new Map();
const shade=makeCanvas(1,1),sc=shade.getContext('2d');
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const pixel=typeof PixelArt!=='undefined'?PixelArt:require('./pixel-art.js');
const scenery=root.GameScenery||(typeof require==='function'?require('./scenery.js'):null);
function refreshArt(){g.imageSmoothingEnabled=false;scenery.draw(g,M,art);}
refreshArt();

function label(c,text,x,y,color='#d6cda9',size=9){c.font=`${size}px monospace`;c.textAlign='center';c.fillStyle='#0009';c.fillRect(x-c.measureText(text).width/2-6,y-size-4,c.measureText(text).width+12,size+9);c.fillStyle=color;c.fillText(text,x,y);}
const imported=typeof CharacterSprites!=='undefined'?CharacterSprites:require('./character-sprites.js'),atlas=pixel.spriteAtlas(makeCanvas);
const sprite=(c,x,y,kind,dir,step,idle)=>{if(!imported.draw(c,x,y,kind,dir,step,idle,art))atlas.draw(c,x,y,kind,dir,step,idle);};
function npcs(state,world){const p=M.positions,A=root.GameAdventure;let a=[{...(root.GameResidents?.point('guard',state,world)||p.guardDorm),kind:'guard',name:'Vigia'}, {...p.examiner,kind:'guard',name:'Vigia'}, {...M.melPoint(world),kind:'mel',name:'Mel'}];
 if(A){for(const kind of ['mira','eron','noah'])a.push({...(root.GameResidents?.point(kind,state,world)||A.characterPoint(kind,state)),kind,name:kind[0].toUpperCase()+kind.slice(1)});
 if(state.flags.miraTaken&&!state.flags.tomasTransferred)a.push({...state.flags.tomasRescued?M.authoredPoint(44.5,29.2):p.tomas,kind:'tomas',name:'Tomas'});
 if(['travessia','portao'].includes(state.scene)&&!state.flags.escapeSolo){a=a.filter(n=>!['mira','eron','tomas'].includes(n.kind));a.push({...M.authoredPoint(54,17.2),kind:'mira',name:'Mira'},{...M.authoredPoint(56,17.2),kind:'eron',name:'Eron'});if(state.flags.tomasRescued)a.push({...M.authoredPoint(55,18.8),kind:'tomas',name:'Tomas'});}
 }else{a.push({...p.mira,kind:'mira',name:'Mira'},{...p.eronDorm,kind:'eron',name:'Eron'},{...p.noahDorm,kind:'noah',name:'Noah'});}
 if(state.scene==='confronto')a.push({...p.climax||p.leader,kind:'leader',name:'Líder'});
 if(state.scene==='confinamento')a.push({...p.guardHall,kind:'guard',name:'Vigia'});
 return a.map((n,i)=>{if(n.kind==='mel'||root.GameResidents&&['mira','eron','noah','guard'].includes(n.kind))return n;const key=n.kind+':'+i,m=world?.actors?.[key];return m&&m.ax===n.x&&m.ay===n.y?{...n,x:n.x+m.dx,y:n.y+m.dy,dir:m.dir,step:m.step}:n;});
}
function drawChanges(c,state,world){const f=state.flags,t=M.T;
 for(const d of M.doors){
  const open=M.doorOpen(d,state,world),locked=M.doorLocked(d,state,world);
  let anim=doorAnimation.get(d.id);if(!anim){anim={value:open?1:0,time:clock};doorAnimation.set(d.id,anim);}const elapsed=Math.max(0,Math.min(100,clock-anim.time));anim.time=clock;anim.value=open?Math.min(1,anim.value+elapsed/320):Math.max(0,anim.value-elapsed/320);
  if(!scenery.drawDoor(c,d,open,art,anim.value,!open)){c.save();c.translate(d.x,d.y);if(d.vertical)c.rotate(Math.PI/2);
  const w=d.vertical?d.h:d.w;
  rect(c,0,0,w,8,'#171219');
  if(open){rect(c,0,0,7,8,'#869577');rect(c,w-7,0,7,8,'#869577');rect(c,1,-22,5,25,'#745247');rect(c,w-6,-22,5,25,'#745247');}
  else{rect(c,3,-12,w-6,20,locked?'#523a46':'#755043');rect(c,5,-10,w-10,3,'#ad8b62');for(let x=10;x<w-8;x+=12)rect(c,x,-7,2,12,'#32232d');rect(c,w/2-3,-5,6,8,locked?'#c78980':'#d7b974');}
  c.restore();}
  if(Math.hypot(state._px-d.x-d.w/2,state._py-d.y-d.h/2)<125)label(c,locked?'TRANCADA':open?'ABERTA':'E · ABRIR',d.x+d.w/2,d.y+d.h/2+23,open?'#a7c1a0':'#d1b388',7);
 }

}
function updateActors(state,world,dt){world.animTime=(Number.isFinite(world.animTime)?world.animTime:0)+dt;world.actors=world.actors&&typeof world.actors==='object'?world.actors:{};npcs(state).forEach((n,i)=>{if(n.kind==='mel'||root.GameResidents&&['mira','eron','noah','guard'].includes(n.kind))return;const key=n.kind+':'+i;let a=world.actors[key];if(!a||a.ax!==n.x||a.ay!==n.y)a=world.actors[key]={ax:n.x,ay:n.y,dx:0,dy:0,step:0,dir:'down'};const distance=Math.hypot(world.player.x-n.x-a.dx,world.player.y-n.y-a.dy);if(distance<78){a.step=0;const dx=world.player.x-n.x-a.dx,dy=world.player.y-n.y-a.dy;a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');return;}const t=(world.animTime+i*1.3)%8;const tx=n.kind==='guard'||n.kind==='leader'?0:t<2?10:t<5?10:0;const delta=Math.max(-10*dt,Math.min(10*dt,tx-a.dx));if(Math.abs(delta)>.01&&M.walkable(n.x+a.dx+delta,n.y+a.dy,7,state,world)){a.dx+=delta;a.dir=delta>0?'right':'left';a.step+=Math.abs(delta)/8;}else{a.step=0;if(t>6)a.dir='up';}});}
function draw(state,world,guards,options={}){
 clock=options.time||0;const w=canvas.width,h=canvas.height,dpr=options.dpr||1,z=options.zoom||2*dpr;
 const player=world.player,cam={x:Math.max(0,Math.min(map.width-w/z,player.x-w/z/2)),y:Math.max(0,Math.min(map.height-h/z,player.y-h/z/2))};
 cam.x=Math.round(cam.x);cam.y=Math.round(cam.y);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#10171a';ctx.fillRect(0,0,w,h);ctx.save();ctx.scale(z,z);ctx.translate(-cam.x,-cam.y);ctx.imageSmoothingEnabled=false;ctx.drawImage(map,0,0);drawChanges(ctx,{...state,_px:player.x,_py:player.y},world);
 // Amber spill from the windows follows the reference's lamplit interiors.
 for(const room of M.rooms){if(art.fullMap||room.id==='hall')continue;const wx=room.id==='dorm'?280:(room.x+room.w*.53)*M.T,wy=room.id==='dorm'?96:room.y*M.T;ctx.fillStyle='#e18b4514';for(let row=0;row<75;row+=3){const wide=27+row*.30;ctx.fillRect(Math.round(wx-wide),wy+row,Math.round(wide*2),3);}}
 const cx=400,cy=660;
 const glow=ctx.createRadialGradient(cx,cy,2,cx,cy,90);glow.addColorStop(0,'#a382d13b');glow.addColorStop(1,'#9f64da00');ctx.fillStyle=glow;ctx.fillRect(cx-90,cy-90,180,180);
 if(!art.fullMap){for(let yy=-45;yy<17;yy++){const hw=yy<-14?Math.floor((yy+45)/3):10;rect(ctx,cx-hw,cy+yy,hw*2+1,1,'#241d31');if(hw>1){rect(ctx,cx-hw+1,cy+yy,hw,1,'#aa82c3');rect(ctx,cx+1,cy+yy,hw-1,1,'#694784');}}
 for(const [xx,yy]of [[-4,-12],[3,0],[-3,9],[2,-24]]){rect(ctx,cx+xx,cy+yy,2,5,'#d3a8e0');rect(ctx,cx+xx-2,cy+yy+2,6,1,'#d3a8e0');}rect(ctx,cx-12,cy+16,25,4,'#c0a772');}
 if(options.cones&&M.night.has(state.scene))for(const guard of guards){ctx.save();ctx.translate(guard.x,guard.y);ctx.rotate(guard.dir>0?0:Math.PI);ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,guard.range||125+state.suspicion*5,-.5,.5);ctx.closePath();ctx.fillStyle=world.alert>30?'#d1914233':'#ddc78517';ctx.fill();ctx.restore();}
 const all=npcs(state,world).concat(guards.map(p=>({...p,kind:'guard',dir:p.dir>0?'right':'left',step:p.step||0})),[{...player,kind:'kali',step:player.step}]).sort((a,b)=>a.y-b.y);
 all.forEach(p=>{sprite(ctx,p.x,p.y,p.kind,p.dir||'down',p.step||0,options.reduced?0:(world.animTime||0)+p.x*.01);if(p.kind==='kali'&&state.flags.cover)rect(ctx,p.x-10,p.y-23,6,4,'#b29063');if(p.name&&Math.hypot(p.x-player.x,p.y-player.y)<100)label(ctx,p.name,p.x,p.y+13,p.kind==='tomas'?'#93b5cf':'#c5b6a5',7);});
 // Ambient darkness is pierced by nearby candles; the player stays legible.
 const sw=Math.ceil(w/z),sh=Math.ceil(h/z);if(shade.width!==sw||shade.height!==sh){shade.width=sw;shade.height=sh;}
 sc.globalCompositeOperation='source-over';sc.clearRect(0,0,sw,sh);sc.fillStyle=M.night.has(state.scene)?'rgba(5,6,16,.32)':'rgba(10,6,17,.10)';sc.fillRect(0,0,sw,sh);
 sc.globalCompositeOperation='destination-out';
 function reveal(x,y,r,strength){const lx=x-cam.x,ly=y-cam.y,halo=sc.createRadialGradient(lx,ly,3,lx,ly,r);halo.addColorStop(0,`rgba(0,0,0,${strength})`);halo.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=halo;sc.fillRect(lx-r,ly-r,r*2,r*2);}
 const pulse=options.reduced?1:.97+Math.sin((world.animTime||0)*2)*.03;
 M.lights.forEach(([x,y])=>reveal(x*M.T,y*M.T,78*pulse,.93));reveal(cx,cy,105,.75);M.rooms.filter(r=>r.id!=='hall').forEach(r=>reveal(r.id==='dorm'?280:(r.x+r.w*.53)*M.T,r.id==='dorm'?97:r.y*M.T,72,.38));reveal(player.x,player.y-15,105,.62);
 sc.globalCompositeOperation='source-over';ctx.drawImage(shade,cam.x,cam.y);

 for(const [x,y]of M.lights){const lx=x*M.T,ly=y*M.T,light=ctx.createRadialGradient(lx,ly,0,lx,ly,85);light.addColorStop(0,'#ffbc633e');light.addColorStop(1,'#ffc97000');ctx.fillStyle=light;ctx.fillRect(lx-85,ly-85,170,170);if(!art.fullMap&&!M.rooms.some(r=>art['scene_'+r.id]&&lx>=r.x*M.T&&lx<(r.x+r.w)*M.T&&ly>=r.y*M.T&&ly<(r.y+r.h)*M.T)){rect(ctx,lx-3,ly-9,6,13,'#dec79a');rect(ctx,lx-1,ly-14,3,6,'#ffdf86');}}
 for(const p of root.GameAdventure?.points(state,world)||[]){if(Math.hypot(player.x-p.x,player.y-p.y)<230){rect(ctx,p.x-2,p.y-51,5,5,'#8ab4c5');}}
 for(const item of root.GameSocial?.points(state,world)||[]){rect(ctx,item.x-5,item.y-8,10,8,item.type==='chave'?'#e0c284':'#dbd1b9');rect(ctx,item.x-3,item.y-6,6,1,'#735a51');}
 for(const photo of root.GamePhotos?.points(state)||[]){
  rect(ctx,photo.x-8,photo.y-13,16,20,'#211b24');rect(ctx,photo.x-6,photo.y-11,12,16,'#e0dfcf');rect(ctx,photo.x-4,photo.y-9,8,10,photo.id==='family'?'#62744e':'#645274');rect(ctx,photo.x-2,photo.y-6,4,5,'#c5ab76');
  if(Math.hypot(player.x-photo.x,player.y-photo.y)<170)label(ctx,'FOTOGRAFIA',photo.x,photo.y-24,'#e0dfcf',7);
 }
 const goal=M.target(state,world);if(goal){const t=clock*.002,bob=options.reduced?0:Math.sin(t)*3;ctx.save();ctx.translate(goal.x,goal.y-48+bob);ctx.rotate(Math.PI/4);rect(ctx,-3,-3,6,6,'#e0c284');ctx.restore();if(M.canInteract(player,goal,state,world,62)){label(ctx,'E · '+goal.name,goal.x,goal.y-58,'#e9d5a4',8);}}
 label(ctx,'KALI',player.x,player.y+17,'#c4d3a5',7);
 ctx.restore();
 const vignette=ctx.createRadialGradient(w/2,h/2,h*.14,w/2,h/2,w*.61);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#02040acf');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 if(goal){const gx=(goal.x-cam.x)*z,gy=(goal.y-cam.y)*z;if(gx<28||gx>w-28||gy<28||gy>h-28){const dx=gx-w/2,dy=gy-h/2,ratio=Math.min((w/2-27)/Math.abs(dx),(h/2-27)/Math.abs(dy)),ax=w/2+dx*ratio,ay=h/2+dy*ratio;ctx.save();ctx.translate(ax,ay);ctx.rotate(Math.atan2(dy,dx));ctx.fillStyle='#dac28d';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,-5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore();}}
 if(options.minimap!==false){const scale=Math.min(.12*dpr,w*.21/map.width),mw=map.width*scale,mh=map.height*scale,ox=w-mw-18*dpr,oy=18*dpr;ctx.fillStyle='#0b1419df';ctx.fillRect(ox-5,oy-5,mw+10,mh+10);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);ctx.globalAlpha=.65;ctx.drawImage(map,0,0);ctx.globalAlpha=1;rect(ctx,player.x-15,player.y-15,30,30,'#ade589');if(goal)rect(ctx,goal.x-13,goal.y-13,26,26,'#ffe0a0');const mel=M.melPoint(world);rect(ctx,mel.x-11,mel.y-11,22,22,'#f1eee5');ctx.restore();}
}
function drawMap(canvas,state,world){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const s=Math.min(canvas.width/map.width,canvas.height/map.height);c.fillStyle='#101719';c.fillRect(0,0,canvas.width,canvas.height);c.save();c.scale(s,s);c.drawImage(map,0,0);drawChanges(c,{...state,_px:-9999,_py:-9999},world);const mel=M.melPoint(world);rect(c,mel.x-6,mel.y-6,12,12,'#f1eee5');label(c,'Mel',mel.x,mel.y+26,'#f1eee5',14);for(const p of root.GameAdventure?.points(state,world)||[])rect(c,p.x-6,p.y-6,12,12,'#8ab4c5');M.rooms.forEach(r=>label(c,r.name,(r.x+r.w/2)*M.T,(r.y+r.h/2)*M.T,'#fff1c9',18));for(const item of root.GameSocial?.points(state,world)||[])rect(c,item.x-6,item.y-6,12,12,'#e0c284');for(const kind of ['mira','eron','noah']){const pos=root.GameResidents?.point(kind,state,world);if(pos){rect(c,pos.x-5,pos.y-5,10,10,'#8ab4c5');label(c,kind.toUpperCase(),pos.x,pos.y-16,'#d9dfdb',12);}}for(const photo of root.GamePhotos?.points(state)||[]){rect(c,photo.x-7,photo.y-7,14,14,'#e0dfcf');label(c,'Foto',photo.x,photo.y-16,'#e0dfcf',12);}const goal=M.target(state,world);if(goal){const route=M.path(world.player,goal,state,world);c.strokeStyle='#e8d18b';c.lineWidth=4;c.setLineDash([7,7]);c.beginPath();route.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();c.setLineDash([]);rect(c,goal.x-7,goal.y-7,14,14,'#ffe59a');}rect(c,world.player.x-9,world.player.y-9,18,18,'#a5e885');c.restore();}
return {draw,drawMap,sprite,map,npcs,updateActors,refreshArt,spriteSheet:atlas.sheet};
}
root.createGameRenderer=createRenderer;if(typeof module!=='undefined')module.exports=createRenderer;
})(typeof window!=='undefined'?window:globalThis);
