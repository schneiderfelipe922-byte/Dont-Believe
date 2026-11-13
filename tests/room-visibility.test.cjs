const test=require('node:test'),assert=require('node:assert/strict'),S=require('../javascript/scenery.js');
test('todos os cômodos do andar atual ficam visíveis, inclusive os vizinhos',()=>{
 for(const r of S.layout){const p={x:r[2]+r[4]/2,y:r[3]+r[5]/2},v=S.roomView(p);assert(v.contains(p));for(const other of S.layout){const q={x:other[2]+other[4]/2,y:other[3]+other[5]/2};assert.equal(v.contains(q),S.floorAt(p).id===S.floorAt(q).id);}}
});
test('soleiras pertencem ao andar visível; não existe máscara por cômodo',()=>{
 for(const [x,y,w,h]of S.passageRects)for(let i=0;i<=10;i++){const p={x:x+w*i/10,y:y+h*i/10};assert(S.roomView(p).contains(p));assert.equal(S.roomView(p).boxes.length,1);}
});
test('não há mais avisos associados à ocultação de cômodos',()=>{assert.deepEqual(S.guardWarnings({x:319,y:260},[{x:380,y:384}]),[]);});
