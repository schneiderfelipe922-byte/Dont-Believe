const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const G=require('../story.js'),M=require('../world.js'),F=require('../photos.js');
test('as duas fotografias têm arte e locais alcançáveis sem trancas da história',()=>{
 const s=G.initial(),w=M.fresh();
 for(const p of F.points(s)){
  assert(fs.existsSync(path.join(__dirname,'..',p.src)));assert(M.walkable(p.x,p.y,7,s,w));assert(M.path(w.player,p,s,w).length);
  assert.equal(M.roomAt(p.x,p.y),p.room);
 }
 const p=F.photos.family;assert(!M.canInteract({x:p.x,y:30},p,s,w,200),'parede impede examinar');
});
test('coleta é única, não altera história ou prazo, e é preservada pelo save',()=>{
 const s=G.initial(),before=JSON.parse(JSON.stringify(s));
 for(const id of ['family','friends']){assert(F.collect(s,id));assert(!F.collect(s,id));}
 assert.equal(s.scene,before.scene);assert.deepEqual(s.history,before.history);assert.equal(F.points(s).length,0);
 const restored=JSON.parse(JSON.stringify(s));assert(F.found(restored,'family'));assert(F.found(restored,'friends'));
 assert.equal(F.points(before).length,2,'save antigo continua compatível');
});
test('a fala da foto respeita o resgate já realizado de Tomas',()=>{
 const s=G.initial();assert.match(F.text(s,'friends'),/O que será que aconteceu/);s.flags.tomasRescued=true;assert.match(F.text(s,'friends'),/consegui encontrá-lo/);
});
