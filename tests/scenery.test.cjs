const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),S=require('../javascript/scenery.js'),G=require('../javascript/story.js');require('../javascript/adventure.js');require('../javascript/expanded-map.js');
const ctx=calls=>new Proxy({drawImage(...args){calls.push(args);}},{get:(o,k)=>k in o?o[k]:()=>{}});
test('os mapas completos são desenhados em andares separados, sem distorcer a proporção',()=>{
 const calls=[],art={fullMap:{id:'ground'},basementMap:{id:'basement'}};S.draw(ctx(calls),M,art);
 assert.deepEqual(calls[0],[art.fullMap,0,0,1586,992]);assert.deepEqual(calls[1],[art.basementMap,0,1200,1717,916]);
});
test('celas e arquivos ficam no subterrâneo; armazém no térreo',()=>{
 for(const d of M.doors)assert.equal(S.floorAt(d).id,d.id==='warehouse'?'ground':'basement');
 assert(M.rooms.some(r=>r.id==='warehouse'));assert(M.rooms.some(r=>r.id==='elias'));assert(M.rooms.some(r=>r.id==='laundry'));assert(M.rooms.some(r=>r.id==='courtyard'));
});
test('grades fechadas usam a arte pintada original e abertas liberam o vão',()=>{
 for(const d of M.doors.filter(d=>d.art)){const calls=[],art={basementMap:{}};S.drawDoor(ctx(calls),d,false,art);assert.deepEqual(calls[0].slice(1,5),[d.art[0],d.art[1]-1200,d.art[2],d.art[3]]);calls.length=0;S.drawDoor(ctx(calls),d,true,art);assert.equal(calls.length,0);}
});
test('cada ambiente é alcançável a partir da chegada segura do seu andar',()=>{
 const s=G.initial(),w=M.fresh();Object.assign(s.flags,{cellOpen:true,tunnel:true,warehouseOpen:true});
 for(const r of M.rooms){const p=M.place({x:(r.x+r.w/2)*M.T,y:(r.y+r.h*.8)*M.T}),start=p.y>=1200?{x:155,y:1830}:w.player;assert(M.path(start,p,s,w).length,r.id);}
});
test('salvamentos ilustrados e antigos migram uma vez preservando direção e trancas',()=>{
 for(const version of [undefined,'illustrated-v1']){const s=G.initial(),w=M.fresh();w.mapVersion=version;w.player={x:300,y:240,dir:'up',step:0};w.doors={dorm:true,cell:false,archive:true};const before=JSON.stringify(s);M.normalizeWorld(w,s);assert.equal(w.mapVersion,'expanded-v2');assert(M.walkable(w.player.x,w.player.y,7,s,w));assert.deepEqual(w.doors,{cell:false,archive:true});assert.equal(JSON.stringify(s),before);const p={...w.player};M.normalizeWorld(w,s);assert.deepEqual(w.player,p);}
});
test('saves nas antigas celas e arquivos reaparecem no subterrâneo correspondente',()=>{
 for(const [x,y,room]of [[1200,180,'cell'],[1280,820,'archive']]){const s=G.initial(),w=M.fresh();s.flags.cellOpen=s.flags.tunnel=true;w.mapVersion='illustrated-v1';w.player={x,y};M.normalizeWorld(w,s);assert.equal(w.player.area,'basement');const r=M.rooms.find(r=>r.id===room);assert(w.player.x>=r.x*M.T&&w.player.x<(r.x+r.w)*M.T);assert(M.walkable(w.player.x,w.player.y,7,s,w));}
});
