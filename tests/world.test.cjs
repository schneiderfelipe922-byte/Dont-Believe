const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js');require('../javascript/adventure.js');require('../javascript/expanded-map.js');
const state=()=>{const s=G.initial();Object.assign(s.flags,{cellOpen:true,tunnel:true,latchOpen:true,warehouseOpen:true});return s;};
test('todos os objetivos têm piso livre e rota no andar correto',()=>{
 const s=state(),w=M.fresh();for(const [id,p]of Object.entries(M.positions)){assert(M.walkable(p.x,p.y),id);assert(M.path(p.y>=1200?{x:155,y:1830}:w.player,p,s,w).length,id);}
});
test('portas fechadas bloqueiam movimento e visão; abertas permitem passagem',()=>{
 for(const d of M.doors){const s=state(),w=M.fresh(),box=M.doorBounds(d),x=d.x+d.w/2;w.doors[d.id]=false;
 const before={x,y:box.y-8},after={x,y:d.y+d.h+8};assert(M.walkable(before.x,before.y,7,s,w),d.id+' origem');assert(!M.visible(before,after,s,w),d.id);
 const p={...before};M.move(p,0,after.y-p.y,s,w);assert(p.y<box.y);w.player={...before};assert(M.toggleDoor(d.id,s,w).changed);assert(M.visible(before,after,s,w));M.move(p,0,after.y-p.y,s,w);assert(Math.abs(p.y-after.y)<.001);
 }
});
test('nenhuma porta fecha sobre o jogador ou outro personagem',()=>{
 for(const d of M.doors){const s=state(),w=M.fresh();w.doors[d.id]=true;const p={x:d.x+d.w/2,y:d.y+d.h/2};assert(!M.toggleDoor(d.id,s,w,[p]).changed);w.player=p;assert(!M.toggleDoor(d.id,s,w).changed);}
});
test('trancas continuam válidas com estados de porta adulterados e arquivos não são contornados pela escada',()=>{
 const s=G.initial(),w=M.fresh();for(const d of M.doors){w.doors[d.id]=true;assert(!M.doorOpen(d,s,w));assert(!M.toggleDoor(d.id,s,w).changed);}
 const start={x:155,y:1830};assert.equal(M.path(start,M.positions.miraCell,s,w).length,0);assert.equal(M.path(start,M.positions.records,s,w).length,0);
 s.flags.cellOpen=true;assert(M.path(start,M.positions.miraCell,s,w).length);assert(M.path(start,M.positions.tomas,s,w).length);assert.equal(M.path(start,M.positions.records,s,w).length,0);
 w.tunnelOpen=true;assert(M.path(start,M.positions.records,s,w).length);
});
test('movimentos grandes não atravessam paredes',()=>{const p=M.authoredPoint(12,8);M.move(p,10000,0);assert(M.walkable(p.x,p.y));assert(p.x<490);});
test('rondas nascem livres e respeitam obstáculos',()=>{const s=state(),w=M.fresh();for(const g of M.guards()){assert(M.walkable(g.x,g.y,7,s,w));for(let i=0;i<2000;i++){M.updateGuard(g,.05,1.4,s,w);assert(M.walkable(g.x,g.y,7,s,w));}}});
test('normalização conserva apenas portas válidas e recupera posição obstruída',()=>{const s=state(),w=M.fresh();w.player={x:72,y:72,dir:'up'};w.doors={cell:true,archive:false,study:true,unknown:true};M.normalizeWorld(w,s);assert(M.walkable(w.player.x,w.player.y,7,s,w));assert.deepEqual(w.doors,{cell:true,archive:false});assert.equal(w.player.dir,'up');});
test('interação não cruza paredes, grades nem andares',()=>{const s=state(),w=M.fresh(),d=M.doors[0];w.doors.cell=false;const a={x:435,y:1660},b={x:435,y:1808};assert(!M.canInteract(a,b,s,w,200));w.doors.cell=true;assert(M.canInteract(a,b,s,w,200));assert(!M.visible({x:435,y:400},b,s,w));});
test('portas podem ser acionadas a 80 pixels, objetos comuns não',()=>{const s=state(),w=M.fresh(),p=M.doorPoints(s,w).find(p=>p.door==='cell');assert(M.canInteract({x:p.x,y:p.y+80},p,s,w));assert(!M.canInteract({x:p.x,y:p.y+100},p,s,w));assert(!M.canInteract({x:p.x,y:p.y+80},{...p,door:undefined},s,w));});
