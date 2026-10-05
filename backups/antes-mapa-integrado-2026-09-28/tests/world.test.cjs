const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../world.js'),G=require('../story.js');require('../adventure.js');
const state=()=>{const s=G.initial();Object.assign(s.flags,{cellOpen:true,tunnel:true,latchOpen:true});return s;};
test('todos os objetivos e a Mel têm piso livre e rota alcançável',()=>{
 const s=state(),w=M.fresh();
 for(const [id,p]of Object.entries(M.positions)){
  assert(M.walkable(p.x,p.y),`${id} está dentro de um móvel`);
  assert(M.path(w.player,p,s,w).length,`${id} não possui rota`);
 }
});
test('portas fechadas bloqueiam movimento e visão; abertas permitem passagem',()=>{
 for(const d of M.doors){
  const s=state(),w=M.fresh(),x=d.x+d.w/2,y=d.y+d.h/2;
  w.doors[d.id]=false;
  const before=d.vertical?{x:x-20,y}:{x,y:y-20},after=d.vertical?{x:x+20,y}:{x,y:y+20};
  assert(!M.visible(before,after,s,w),d.id);
  const p={...before};M.move(p,after.x-p.x,after.y-p.y,s,w);
  assert(d.vertical?p.x<x:p.y<y,d.id);
  w.player={...before};assert(M.toggleDoor(d.id,s,w).changed,d.id);
  assert(M.visible(before,after,s,w),d.id);
  M.move(p,after.x-p.x,after.y-p.y,s,w);assert.deepEqual(p,after,d.id);
 }
});
test('nenhuma porta fecha sobre o jogador ou outro personagem',()=>{
 for(const d of M.doors){
  const s=state(),w=M.fresh();w.doors[d.id]=true;
  const p={x:d.x+d.w/2,y:d.y+d.h/2};
  assert(!M.toggleDoor(d.id,s,w,[p]).changed,d.id);
  w.player=p;assert(!M.toggleDoor(d.id,s,w).changed,d.id);
 }
});
test('trancas dependem da história e não de valores adulterados no mapa',()=>{
 const s=G.initial(),w=M.fresh();
 for(const d of M.doors.filter(d=>d.lock)){
  w.doors[d.id]=true;assert(!M.doorOpen(d,s,w),d.id);
  assert(!M.toggleDoor(d.id,s,w).changed,d.id);
 }
 assert.equal(M.path(w.player,M.positions.miraCell,s,w).length,0);
 assert.equal(M.path(w.player,M.positions.records,s,w).length,0);
 s.flags.cellOpen=true;assert(M.path(w.player,M.positions.miraCell,s,w).length);
 w.tunnelOpen=true;assert(M.path(w.player,M.positions.records,s,w).length);
 s.scene='portao';assert(!M.doorLocked(M.doors.find(d=>d.id==='exit'),s,w));
});
test('movimentos grandes não atravessam móveis nem paredes',()=>{
 const p={x:12*M.T,y:8*M.T};M.move(p,10000,0);
 assert(M.walkable(p.x,p.y));assert(p.x<18.3*M.T);
});
test('rondas nascem livres e não atravessam obstáculos',()=>{
 const s=state(),w=M.fresh();
 for(const g of M.guards()){
  assert(M.walkable(g.x,g.y,7,s,w));
  for(let i=0;i<2000;i++){M.updateGuard(g,.05,1.4,s,w);assert(M.walkable(g.x,g.y,7,s,w));}
 }
});
test('salvamentos antigos preservam portas válidas e recuperam posições obstruídas',()=>{
 const s=state(),w=M.fresh();w.player={x:3*M.T,y:3*M.T,dir:'up'};w.doors={study:true,office:false,cell:'yes',unknown:true};
 M.normalizeWorld(w,s);assert(M.walkable(w.player.x,w.player.y,7,s,w));
 assert.deepEqual(w.doors,{study:true,office:false});assert.equal(w.player.dir,'up');
 const copy=JSON.parse(JSON.stringify(w));M.normalizeWorld(copy,s);assert.deepEqual(copy.doors,w.doors);
});
test('não é possível interagir com personagens através de paredes ou portas',()=>{
 const s=state(),w=M.fresh(),d=M.doors[0];
 const a={x:d.x+40,y:d.y-15},b={x:d.x+40,y:d.y+20};
 assert(!M.canInteract(a,b,s,w));w.doors[d.id]=true;assert(M.canInteract(a,b,s,w));
 assert(M.canInteract({x:M.positions.mel.x,y:M.positions.mel.y+30},M.positions.mel,s,w));
});
test('portas podem ser acionadas de mais longe, respeitando paredes e o alcance dos outros alvos',()=>{
 const s=state(),w=M.fresh(),p=M.doorPoints(s,w).find(p=>p.door==='study');
 assert(M.canInteract({x:p.x,y:p.y+80},p,s,w));
 assert(!M.canInteract({x:p.x,y:p.y+100},p,s,w));
 assert(!M.canInteract({x:p.x,y:p.y+80},{...p,door:undefined},s,w));
 assert(!M.canInteract({x:p.x-80,y:p.y},p,s,w),'a parede lateral bloqueia interação');
});
