const test=require('node:test'),assert=require('node:assert/strict'),S=require('../javascript/scenery.js');
test('a sala atual revela suas soleiras sem revelar o centro das outras salas',()=>{
 for(const r of S.layout){const p={x:r[2]+r[4]/2,y:r[3]+r[5]/2},v=S.roomView(p);assert.equal(v.id,r[0]);assert(v.contains(p));for(const other of S.layout)if(other!==r)assert(!v.contains({x:other[2]+other[4]/2,y:other[3]+other[5]/2}),other[0]);}
});
test('as passagens sempre mantêm Kali visível durante a troca de sala',()=>{
 for(const [x,y,w,h]of S.passageRects)for(let i=0;i<=10;i++){const p={x:x+w*i/10,y:y+h*i/10};assert(S.roomView(p).contains(p));}
});
test('vigia perto da saída avisa antes de entrar, sem revelar vigias distantes ou atrás de outra sala',()=>{
 const p={x:319,y:260};assert.equal(S.roomView(p).id,'dorm');assert(S.guardWarnings(p,[{x:380,y:384}]).length>0);
 assert.equal(S.guardWarnings(p,[{x:1100,y:384}]).length,0);
 assert.equal(S.guardWarnings(p,[{x:250,y:200}]).length,0);
 assert.equal(S.guardWarnings(p,[{x:400,y:510}]).length,0);
});
