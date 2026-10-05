(function(root){
'use strict';
function createRenderer(canvas,M,makeCanvas,art={}){
const ctx=canvas.getContext('2d'),map=makeCanvas(M.W*M.T,M.H*M.T),g=map.getContext('2d');let clock=0;
const shade=makeCanvas(1,1),sc=shade.getContext('2d');
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const pixel=typeof PixelArt!=='undefined'?PixelArt:require('./pixel-art.js');
function refreshArt(){g.imageSmoothingEnabled=false;pixel.buildMap(g,M);}
refreshArt();

function label(c,text,x,y,color='#d6cda9',size=9){c.font=`${size}px monospace`;c.textAlign='center';c.fillStyle='#0009';c.fillRect(x-c.measureText(text).width/2-6,y-size-4,c.measureText(text).width+12,size+9);c.fillStyle=color;c.fillText(text,x,y);}
const imported=typeof CharacterSprites!=='undefined'?CharacterSprites:require('./character-sprites.js'),atlas=pixel.spriteAtlas(makeCanvas);
const sprite=(c,x,y,kind,dir,step,idle)=>{if(!imported.draw(c,x,y,kind,dir,step,idle,art))atlas.draw(c,x,y,kind,dir,step,idle);};
function npcs(state,world){const p=M.positions;let a=[{...p.guardDorm,kind:'guard',name:'Vigia'}, {...p.examiner,kind:'guard',name:'Vigia'}];
 const stage=state.scene;
 let noah=['emboscada','limiar'].includes(stage)?{x:42*M.T,y:39.5*M.T}:['noah','segredo'].includes(stage)?p.noahHall:['confronto','subsolo'].includes(stage)?{x:54*M.T,y:41*M.T}:p.noahDorm;
 a.push({...noah,kind:'noah',name:'Noah'});
 if(!['sumico','oferta','limiar','emboscada','questionar','verdade','confinamento','resgate','subsolo','confronto','disfarce'].includes(stage))a.push({...p.mira,kind:'mira',name:'Mira'});
 else if(!state.flags.rescued)a.push({...p.miraCell,kind:'mira',name:'Mira'});
 else a.push({...p.leader,x:p.leader.x-38,kind:'mira',name:'Mira'});
 a.push({...(['eron'].includes(stage)?p.eronKitchen:p.eronDorm),kind:'eron',name:'Eron'});
 if(stage==='confronto')a.push({...p.leader,kind:'leader',name:'Líder'});
 if(stage==='confinamento')a.push({...p.guardHall,kind:'guard',name:'Vigia'});
 return a.map((n,i)=>{const key=n.kind+':'+i,m=world?.actors?.[key];return m&&m.ax===n.x&&m.ay===n.y?{...n,x:n.x+m.dx,y:n.y+m.dy,dir:m.dir,step:m.step}:n;});
}
function updateActors(state,world,dt){world.animTime=(Number.isFinite(world.animTime)?world.animTime:0)+dt;world.actors=world.actors&&typeof world.actors==='object'?world.actors:{};npcs(state).forEach((n,i)=>{const key=n.kind+':'+i;let a=world.actors[key];if(!a||a.ax!==n.x||a.ay!==n.y)a=world.actors[key]={ax:n.x,ay:n.y,dx:0,dy:0,step:0,dir:'down'};const distance=Math.hypot(world.player.x-n.x-a.dx,world.player.y-n.y-a.dy);if(distance<78){a.step=0;const dx=world.player.x-n.x-a.dx,dy=world.player.y-n.y-a.dy;a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');return;}const t=(world.animTime+i*1.3)%8;const tx=n.kind==='guard'||n.kind==='leader'?0:t<2?10:t<5?10:0;const delta=Math.max(-10*dt,Math.min(10*dt,tx-a.dx));if(Math.abs(delta)>.01&&M.walkable(n.x+a.dx+delta,n.y+a.dy,7)){a.dx+=delta;a.dir=delta>0?'right':'left';a.step+=Math.abs(delta)/8;}else{a.step=0;if(t>6)a.dir='up';}});}
function draw(state,world,guards,options={}){
 clock=options.time||0;const w=canvas.width,h=canvas.height,dpr=options.dpr||1,z=options.zoom||2*dpr;
 const player=world.player,cam={x:Math.max(0,Math.min(map.width-w/z,player.x-w/z/2)),y:Math.max(0,Math.min(map.height-h/z,player.y-h/z/2))};
 cam.x=Math.round(cam.x);cam.y=Math.round(cam.y);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#10171a';ctx.fillRect(0,0,w,h);ctx.save();ctx.scale(z,z);ctx.translate(-cam.x,-cam.y);ctx.imageSmoothingEnabled=false;ctx.drawImage(map,0,0);
 // Amber spill from the windows follows the reference's lamplit interiors.
 for(const room of M.rooms){if(room.id==='hall')continue;const wx=room.id==='dorm'?280:(room.x+room.w*.53)*M.T,wy=room.id==='dorm'?96:room.y*M.T;ctx.fillStyle='#e18b4514';for(let row=0;row<75;row+=3){const wide=27+row*.30;ctx.fillRect(Math.round(wx-wide),wy+row,Math.round(wide*2),3);}}
 const altar=M.props.find(p=>p.id==='altar'),cx=altar.x+altar.w/2,cy=altar.y+25;
 const glow=ctx.createRadialGradient(cx,cy,2,cx,cy,90);glow.addColorStop(0,'#a382d13b');glow.addColorStop(1,'#9f64da00');ctx.fillStyle=glow;ctx.fillRect(cx-90,cy-90,180,180);
 for(let yy=-45;yy<17;yy++){const hw=yy<-14?Math.floor((yy+45)/3):10;rect(ctx,cx-hw,cy+yy,hw*2+1,1,'#241d31');if(hw>1){rect(ctx,cx-hw+1,cy+yy,hw,1,'#aa82c3');rect(ctx,cx+1,cy+yy,hw-1,1,'#694784');}}
 for(const [xx,yy]of [[-4,-12],[3,0],[-3,9],[2,-24]]){rect(ctx,cx+xx,cy+yy,2,5,'#d3a8e0');rect(ctx,cx+xx-2,cy+yy+2,6,1,'#d3a8e0');}rect(ctx,cx-12,cy+16,25,4,'#c0a772');
 if(options.cones&&M.night.has(state.scene))for(const guard of guards){ctx.save();ctx.translate(guard.x,guard.y);ctx.rotate(guard.dir>0?0:Math.PI);ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,125,-.5,.5);ctx.closePath();ctx.fillStyle=world.alert>30?'#d1914233':'#ddc78517';ctx.fill();ctx.restore();}
 const all=npcs(state,world).concat(guards.map(p=>({...p,kind:'guard',dir:p.dir>0?'right':'left',step:p.step||0})),[{...player,kind:'kali',step:player.step}]).sort((a,b)=>a.y-b.y);
 all.forEach(p=>sprite(ctx,p.x,p.y,p.kind,p.dir||'down',p.step||0,options.reduced?0:(world.animTime||0)+p.x*.01));
 // Ambient darkness is pierced by nearby candles; the player stays legible.
 const sw=Math.ceil(w/z),sh=Math.ceil(h/z);if(shade.width!==sw||shade.height!==sh){shade.width=sw;shade.height=sh;}
 sc.globalCompositeOperation='source-over';sc.clearRect(0,0,sw,sh);sc.fillStyle=M.night.has(state.scene)?'rgba(5,6,16,.58)':'rgba(10,6,17,.39)';sc.fillRect(0,0,sw,sh);
 sc.globalCompositeOperation='destination-out';
 function reveal(x,y,r,strength){const lx=x-cam.x,ly=y-cam.y,halo=sc.createRadialGradient(lx,ly,3,lx,ly,r);halo.addColorStop(0,`rgba(0,0,0,${strength})`);halo.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=halo;sc.fillRect(lx-r,ly-r,r*2,r*2);}
 const pulse=options.reduced?1:.97+Math.sin((world.animTime||0)*2)*.03;
 M.lights.forEach(([x,y])=>reveal(x*M.T,y*M.T,78*pulse,.93));reveal(cx,cy,105,.75);M.rooms.filter(r=>r.id!=='hall').forEach(r=>reveal(r.id==='dorm'?280:(r.x+r.w*.53)*M.T,r.id==='dorm'?97:r.y*M.T,72,.38));reveal(player.x,player.y-15,105,.62);
 sc.globalCompositeOperation='source-over';ctx.drawImage(shade,cam.x,cam.y);

 for(const [x,y]of M.lights){const lx=x*M.T,ly=y*M.T,light=ctx.createRadialGradient(lx,ly,0,lx,ly,85);light.addColorStop(0,'#ffbc633e');light.addColorStop(1,'#ffc97000');ctx.fillStyle=light;ctx.fillRect(lx-85,ly-85,170,170);rect(ctx,lx-3,ly-9,6,13,'#dec79a');rect(ctx,lx-1,ly-14,3,6,'#ffdf86');}
 const goal=M.target(state,world);if(goal){const t=clock*.002,bob=options.reduced?0:Math.sin(t)*3;ctx.save();ctx.translate(goal.x,goal.y-48+bob);ctx.rotate(Math.PI/4);rect(ctx,-3,-3,6,6,'#e0c284');ctx.restore();if(Math.hypot(player.x-goal.x,player.y-goal.y)<62){label(ctx,'E · '+goal.name,goal.x,goal.y-58,'#e9d5a4',8);}}
 label(ctx,'KALI',player.x,player.y+17,'#c4d3a5',7);
 ctx.restore();
 const vignette=ctx.createRadialGradient(w/2,h/2,h*.14,w/2,h/2,w*.61);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#02040acf');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 if(goal){const gx=(goal.x-cam.x)*z,gy=(goal.y-cam.y)*z;if(gx<28||gx>w-28||gy<28||gy>h-28){const dx=gx-w/2,dy=gy-h/2,ratio=Math.min((w/2-27)/Math.abs(dx),(h/2-27)/Math.abs(dy)),ax=w/2+dx*ratio,ay=h/2+dy*ratio;ctx.save();ctx.translate(ax,ay);ctx.rotate(Math.atan2(dy,dx));ctx.fillStyle='#dac28d';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,-5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore();}}
 if(options.minimap!==false){const scale=Math.min(.12*dpr,w*.21/map.width),mw=map.width*scale,mh=map.height*scale,ox=w-mw-18*dpr,oy=18*dpr;ctx.fillStyle='#0b1419df';ctx.fillRect(ox-5,oy-5,mw+10,mh+10);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);ctx.globalAlpha=.65;ctx.drawImage(map,0,0);ctx.globalAlpha=1;rect(ctx,player.x-15,player.y-15,30,30,'#ade589');if(goal)rect(ctx,goal.x-13,goal.y-13,26,26,'#ffe0a0');ctx.restore();}
}
function drawMap(canvas,state,world){const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const s=Math.min(canvas.width/map.width,canvas.height/map.height);c.fillStyle='#101719';c.fillRect(0,0,canvas.width,canvas.height);c.save();c.scale(s,s);c.drawImage(map,0,0);M.rooms.forEach(r=>label(c,r.name,(r.x+r.w/2)*M.T,(r.y+r.h/2)*M.T,'#fff1c9',18));const goal=M.target(state,world);if(goal){const route=M.path(world.player,goal);c.strokeStyle='#e8d18b';c.lineWidth=4;c.setLineDash([7,7]);c.beginPath();route.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();c.setLineDash([]);rect(c,goal.x-7,goal.y-7,14,14,'#ffe59a');}rect(c,world.player.x-9,world.player.y-9,18,18,'#a5e885');c.restore();}
return {draw,drawMap,sprite,map,npcs,updateActors,refreshArt,spriteSheet:atlas.sheet};
}
root.createGameRenderer=createRenderer;if(typeof module!=='undefined')module.exports=createRenderer;
})(typeof window!=='undefined'?window:globalThis);
