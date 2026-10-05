/* Rotinas de moradores: movimento usa a mesma geometria física do jogador. */
(function(root){
'use strict';
const M=root.GameWorld||(typeof require==='function'?require('./world.js'):null),A=root.GameAdventure||(typeof require==='function'?require('./adventure.js'):null);
const p=(x,y)=>M.authoredPoint(x,y);
function setup(kind,s){
 if(['travessia','portao'].includes(s.scene)&&!s.flags.escapeSolo){return {mode:'escape',start:p(kind==='mira'?54:kind==='eron'?56:55,17.2),stops:[]};}
 if(kind==='mira')return s.flags.miraTaken&&!s.flags.rescued?{mode:'cell',start:M.positions.miraCell,stops:[]}:
  s.flags.rescued?{mode:'rescued',start:p(46,28.5),stops:[p(48.5,28.5),p(17.5,35.5)]}:{mode:'free',start:M.positions.mira,stops:[p(29.5,10.5),p(9.5,9.5),p(12.5,35.5)]};
 if(kind==='eron')return s.flags.eronBetrayed?{mode:'cell',start:p(55,8.5),stops:[]}:{mode:'free',start:M.positions.eronDorm,stops:[p(50.5,28.5),p(17.5,36.5),p(17,8)]};
 if(['limiar','emboscada'].includes(s.scene))return {mode:'office',start:p(42,39.5),escort:p(40,39.5),stops:[]};
 if(s.flags.noahTask&&A.act(s)>=3)return {mode:'latch',start:p(56,18.2),escort:p(54,18.2),stops:[]};
 return {mode:'free',start:p(15,9.8),escort:M.positions.guardDorm,stops:[p(27.5,18.5),p(42.5,39.5),p(37.5,28.5),p(12.5,9.5)]};
}
function freshActor(spec){return {...spec.start,mode:spec.mode,dir:'down',step:0,wait:2,next:0,route:[],doors:null};}
function ensure(s,w){
 if(!w)return null;
 w.residents=w.residents&&typeof w.residents==='object'?w.residents:{};
 for(const kind of ['mira','eron','noah']){
  const spec=setup(kind,s),old=w.residents[kind];
  if(!old||old.mode!==spec.mode||!M.walkable(old.x,old.y))w.residents[kind]=freshActor(spec);
 }
 const spec=setup('noah',s),old=w.residents.escort;
 if(!old||old.mode!==spec.mode||!M.walkable(old.x,old.y)){
  const noah=w.residents.noah,anchor=spec.escort||M.place({x:noah.x-2*M.T,y:noah.y});
  w.residents.escort=freshActor({...spec,start:anchor});
  w.residents.escort.trail=[{x:noah.x,y:noah.y},{...anchor}];
 }
 return w.residents;
}
function point(kind,s,w){const actors=ensure(s,w);return actors?.[kind==='guard'?'escort':kind]|| (kind==='guard'?(setup('noah',s).escort||M.positions.guardDorm):setup(kind,s).start);}
function normalize(s,w){const actors=ensure(s,w);for(const a of Object.values(actors)){
 a.route=[];a.doors=null;a.step=0;a.wait=Number.isFinite(a.wait)?Math.min(3,Math.max(0,a.wait)):2;a.next=Number.isInteger(a.next)?Math.max(0,a.next):0;
 a.dir=['up','down','left','right'].includes(a.dir)?a.dir:'down';
 }
 // Preserva a trilha curta entre Noah e seu acompanhante ao retomar a partida.
 const e=actors.escort,n=actors.noah;
 if(!Array.isArray(e.trail)||e.trail.length>300||e.trail.some(t=>!Number.isFinite(t.x)||!Number.isFinite(t.y)))e.trail=[{x:n.x,y:n.y},{x:e.x,y:e.y}];
}
function face(a,b){const dx=b.x-a.x,dy=b.y-a.y;if(Math.hypot(dx,dy)>1)a.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
function walk(a,stops,s,w,dt,occupants){
 if(!stops.length){a.step=0;return false;}
 const signature=M.doors.map(d=>M.doorOpen(d,s,w)?'1':'0').join('');
 if(a.doors!==signature){a.route=[];a.doors=signature;}
 if(a.wait>0){a.wait=Math.max(0,a.wait-dt);a.step=0;return false;}
 if(!a.route.length){
  for(let i=0;i<stops.length;i++){
   const index=(a.next+i)%stops.length,target=stops[index];if(Math.hypot(target.x-a.x,target.y-a.y)<12)continue;
   const route=M.path(a,target,s,w,{exact:true});
   if(route.length){a.route=route;a.next=(index+1)%stops.length;break;}
  }
  if(!a.route.length){a.wait=2;a.step=0;return false;}
 }
 let distance=30*dt,moved=0,opened=false;
 while(distance>0&&a.route.length){
  const t=a.route[0],dx=t.x-a.x,dy=t.y-a.y,len=Math.hypot(dx,dy);
  if(len<.05){a.route.shift();continue;}
  const step=Math.min(distance,len),nx=a.x+dx/len*step,ny=a.y+dy/len*step;
  for(const door of M.doors)if(!M.doorOpen(door,s,w)&&!M.doorLocked(door,s,w)&&nx+7>door.x&&nx-7<door.x+door.w&&ny+7>door.y&&ny-7<door.y+door.h){
   opened=M.toggleDoor(door.id,s,w,occupants).changed||opened;a.doors=M.doors.map(d=>M.doorOpen(d,s,w)?'1':'0').join('');
  }
  const before={x:a.x,y:a.y};M.move(a,dx/len*step,dy/len*step,s,w);const actual=Math.hypot(a.x-before.x,a.y-before.y);
  moved+=actual;distance-=step;face(a,{x:a.x+dx,y:a.y+dy});
  if(actual<step-.01){a.route=[];a.wait=.5;break;}
  if(len<=step+.01)a.route.shift();
 }
 a.step=moved?a.step+moved/20:0;if(!a.route.length){a.wait=3;a.step=0;}
 return moved>0||opened;
}
function followEscort(n,e){
 e.trail.push({x:e.x,y:e.y});let length=0;
 for(let i=e.trail.length-1;i>0;i--)length+=Math.hypot(e.trail[i].x-e.trail[i-1].x,e.trail[i].y-e.trail[i-1].y);
 while(e.trail.length>1){const a=e.trail[0],b=e.trail[1],d=Math.hypot(b.x-a.x,b.y-a.y);if(length-d<56)break;length-=d;e.trail.shift();}
 const a=e.trail[0],b=e.trail[1]||a,d=Math.hypot(b.x-a.x,b.y-a.y),excess=Math.max(0,length-56),ratio=d?Math.min(1,excess/d):0;
 const next={x:a.x+(b.x-a.x)*ratio,y:a.y+(b.y-a.y)*ratio},travel=Math.hypot(next.x-n.x,next.y-n.y);
 if(Math.hypot(next.x-e.x,next.y-e.y)<36){e.yield=true;n.step=0;return;}
 face(n,next);n.x=next.x;n.y=next.y;n.step=travel?n.step+travel/20:0;
}
function update(s,w,dt){
 const actors=ensure(s,w);dt=Math.min(.1,Math.max(0,dt));let changed=false;
 for(const kind of ['mira','eron']){const actor=actors[kind];if(M.canInteract(w.player,actor,s,w,78)){actor.step=0;face(actor,w.player);continue;}changed=walk(actor,setup(kind,s).stops,s,w,dt,Object.values(actors))||changed;}
 const n=actors.noah,e=actors.escort,near=M.canInteract(w.player,n,s,w,78)||M.canInteract(w.player,e,s,w,62),spec=setup('noah',s);
 if(near||!spec.stops.length){n.step=0;e.step=0;if(near){face(n,w.player);face(e,w.player);}}
 else if(e.yield){
  // Em uma meia-volta, Noah abre espaço antes de o vigia retomar a ronda.
  const distance=Math.hypot(n.x-e.x,n.y-e.y),choices=[];
  for(let i=0;i<8;i++){const angle=i*Math.PI/4,t={x:n.x+Math.cos(angle)*45*dt,y:n.y+Math.sin(angle)*45*dt};if(M.walkable(t.x,t.y,7,s,w))choices.push({...t,d:Math.hypot(t.x-e.x,t.y-e.y)});}
  choices.sort((a,b)=>b.d-a.d);const t=choices[0];
  if(t&&t.d>distance){face(n,t);n.step+=Math.hypot(t.x-n.x,t.y-n.y)/20;n.x=t.x;n.y=t.y;changed=true;}
  else{e.route=[];e.wait=0;e.yield=false;}
  e.trail=[{x:n.x,y:n.y},{x:e.x,y:e.y}];if(Math.hypot(n.x-e.x,n.y-e.y)>=56)e.yield=false;
 }else{const before={x:e.x,y:e.y};changed=walk(e,spec.stops,s,w,dt,Object.values(actors))||changed;
 if(e.x!==before.x||e.y!==before.y)followEscort(n,e);else n.step=0;}
 return changed;
}
const normalizeWorld=M.normalizeWorld;M.normalizeWorld=(w,s)=>{normalizeWorld(w,s);normalize(s,w);return w;};
const api={point,update,normalize};root.GameResidents=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
