const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js'),S=require('../javascript/scenery.js');require('../javascript/adventure.js');
test('gavetas abrem, fecham e sobrevivem ao salvamento sem modificar a história',()=>{
 const story=G.initial(),world=M.fresh(),before=JSON.stringify(story);
 for(const d of M.drawers){
  const point=M.drawerPoints(world).find(p=>p.drawer===d.id);
  assert(M.walkable(point.x,point.y,7,story,world));assert(M.path(world.player,point,story,world).length);
  assert.match(point.name,/Abrir/);
  assert.equal(M.toggleDrawer(d.id,world).open,true);assert.match(M.drawerPoints(world).find(p=>p.drawer===d.id).name,/Fechar/);
  const saved=JSON.parse(JSON.stringify(world));M.normalizeWorld(saved,story);assert.equal(saved.drawers[d.id],true);
  assert.equal(M.toggleDrawer(d.id,saved).open,false);assert.equal(JSON.stringify(story),before);
 }
});
test('saves antigos recebem gavetas fechadas e estados inválidos são descartados',()=>{
 const story=G.initial(),world=M.fresh();delete world.drawers;M.normalizeWorld(world,story);assert.deepEqual(world.drawers,{});
 world.drawers={'bedside-left':true,'bedside-right':'aberta',outro:true};M.normalizeWorld(world,story);assert.deepEqual(world.drawers,{'bedside-left':true});
 const before=JSON.stringify(world);assert.equal(M.toggleDrawer('inexistente',world).changed,false);assert.equal(JSON.stringify(world),before);
});
test('o criado-mudo mantém o mesmo encaixe ao mostrar o interior da gaveta',()=>{
 const calls=[],c={drawImage(...args){calls.push(args);}},art={bedside:{}};
 for(const d of M.drawers){
  S.drawDrawer(c,d,false,art);S.drawDrawer(c,d,true,art);
  assert.deepEqual(calls.at(-2).slice(1,5),[6,30,36,21]);assert.deepEqual(calls.at(-1).slice(1,5),[54,30,36,21]);
  assert.deepEqual(calls.at(-1).slice(5),d.art);assert.deepEqual(calls.at(-2).slice(5),d.art);
 }
});
