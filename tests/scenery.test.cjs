const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../javascript/world.js'),S=require('../javascript/scenery.js'),G=require('../javascript/story.js');require('../javascript/adventure.js');
const ctx=calls=>new Proxy({drawImage(...args){calls.push(args);}},{get:(o,k)=>k in o?o[k]:()=>{}});
test('usa o mapa fornecido inteiro sem incluir a legenda de sprites no cenário',()=>{
 assert(fs.existsSync(require('node:path').join(__dirname,'../assets/cenarios/mapa sem portas.png')));
 const calls=[],art={fullMap:{}};S.draw(ctx(calls),M,art);
 assert.deepEqual(calls[0].slice(1),[0,0,1456,895,0,0,1456,895]);
 assert(calls.every(c=>c[2]+c[4]<=895),'nenhuma faixa de sprites é desenhada no fundo');
});
test('somente a cela superior direita e os arquivos inferiores direitos têm portas',()=>{
 assert.deepEqual(M.doors.map(d=>d.id),['cell','archive']);
 assert(M.doors[0].y<300&&M.doors[1].y>700);
 for(const d of M.doors){const calls=[],art={fullMap:{}};S.drawDoor(ctx(calls),d,false,art);S.drawDoor(ctx(calls),d,true,art);assert.equal(calls[0][1],S.sprites[d.id][0][0]);assert.equal(calls[1][1],S.sprites[d.id][3][0]);assert.notDeepEqual(calls[0].slice(1,5),calls[1].slice(1,5));assert.deepEqual(calls[0].slice(5),d.art);}
});
test('todos os oito cômodos são alcançáveis quando as duas trancas estão abertas',()=>{
 const s=G.initial(),w=M.fresh();Object.assign(s.flags,{cellOpen:true,tunnel:true});
 for(const r of M.rooms){const p=M.place({x:(r.x+r.w/2)*M.T,y:(r.y+r.h*.8)*M.T});assert(M.path(w.player,p,s,w).length,r.id);}
});
test('animações usam os quadros intermediários da imagem fornecida',()=>{
 for(const d of M.doors){const calls=[],c=ctx(calls),a={fullMap:{}};for(const progress of [0,.25,.75,1])S.drawDoor(c,d,progress>0,a,progress);assert.equal(new Set(calls.map(c=>c[1])).size,4);S.drawDoor(c,d,false,a,.5,true);assert.equal(calls.at(-1)[1],S.sprites[d.id][4][0]);}
});
test('salvamentos da versão anterior são convertidos uma única vez',()=>{
 const s=G.initial(),w=M.fresh();delete w.mapVersion;w.player={x:300,y:240,dir:'up',step:0};w.doors={dorm:true,study:true,cell:false,archive:true};M.normalizeWorld(w,s);assert.equal(w.mapVersion,'illustrated-v1');assert(M.walkable(w.player.x,w.player.y,7,s,w));assert.deepEqual(Object.keys(w.doors),['cell','archive']);const p={...w.player};M.normalizeWorld(w,s);assert.deepEqual(w.player,p);
});
test('portas antigas salvas não bloqueiam as passagens que agora são livres',()=>{
 const s=G.initial(),w=M.fresh();w.doors={dorm:false,study:false,dining:false,kitchen:false,office:false};M.normalizeWorld(w,s);
 for(const id of ['dorm','study','hall','dining','kitchen','office']){const r=M.rooms.find(r=>r.id===id),p=M.place({x:(r.x+r.w/2)*M.T,y:(r.y+r.h*.8)*M.T});assert(M.path(w.player,p,s,w).length,id);}
});
