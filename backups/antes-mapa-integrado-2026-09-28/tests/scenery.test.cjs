const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../world.js'),S=require('../scenery.js'),G=require('../story.js');require('../adventure.js');
test('os oito cenários existem e são desenhados nos cômodos correspondentes',()=>{
 const art={},calls=[];
 for(const r of M.rooms){const scene=S.scenes[r.id];assert(scene);assert(fs.existsSync(path.join(__dirname,'../assets',scene.file)));art['scene_'+r.id]={id:r.id};}
 S.draw(new Proxy({drawImage(...args){calls.push(args);}},{get:(o,k)=>k in o?o[k]:()=>{}}),M,art);
 for(const r of M.rooms){const draw=calls.find(c=>c[0].id===r.id);assert.deepEqual(draw.slice(5),[r.x*M.T,r.y*M.T,r.w*M.T,r.h*M.T]);}
});
test('cada ambiente mantém colisões e entradas alcançáveis no mapa original',()=>{
 const s=G.initial(),w=M.fresh();Object.assign(s.flags,{cellOpen:true,tunnel:true,latchOpen:true});
 for(const r of M.rooms){
  const p=M.place({x:(r.x+r.w/2)*M.T,y:(r.y+r.h*.75)*M.T});assert(M.path(w.player,p,s,w).length,r.id);
  if(r.id!=='hall')assert(M.sceneryProps.some(b=>b.room===r.id&&!M.walkable(b.x+b.w/2,b.y+b.h/2,1)),r.id);
 }
});
test('entrada da biblioteca não repinta o tapete nem o piso original',()=>{
 const room=M.rooms.find(r=>r.id==='study');
 assert(S.entrances(M,room).length>0);
 assert(S.entrances(M,room).every(e=>!e.repair));
 const calls=[],art={scene_study:{id:'study'},floorTiles:{id:'floor'}};
 const ctx=new Proxy({drawImage(...args){calls.push(args);}},{get:(o,k)=>k in o?o[k]:()=>{}});
 S.draw(ctx,M,art);
 const roomCall=calls.findIndex(c=>c[0]===art.scene_study);
 const carpet={x:28.5*M.T,y:6*M.T,w:10*M.T,h:4*M.T};
 assert(!calls.slice(roomCall+1).some(c=>c[0]===art.floorTiles&&c[5]<carpet.x+carpet.w&&c[5]+c[7]>carpet.x&&c[6]<carpet.y+carpet.h&&c[6]+c[8]>carpet.y));
});
test('paredes são recortadas da imagem original de cada ambiente',()=>{
 const calls=[],art=Object.fromEntries(M.rooms.map(r=>['scene_'+r.id,{id:r.id}]));
 const ctx=new Proxy({drawImage(...args){calls.push(args);}},{get:(o,k)=>k in o?o[k]:()=>{}});
 S.draw(ctx,M,art);
 for(const room of M.rooms)for(const side of Object.values(S.borders[room.id]))assert(calls.some(c=>c[0]===art['scene_'+room.id]&&side.every((v,i)=>v===c[i+1])),room.id);
});
test('portas de madeira e grades usam quadros distintos para abertas e fechadas',()=>{
 const art={doorTiles:{}},calls=[],ctx={save(){},restore(){},translate(){},rotate(){},drawImage(...args){calls.push(args);}};
 for(const id of ['dorm','cell','exit']){const d=M.doors.find(d=>d.id===id);S.drawDoor(ctx,d,false,art);S.drawDoor(ctx,d,true,art);const [closed,open]=calls.slice(-2);assert.equal(open[1]-closed[1],828);assert.equal(closed[2],id==='dorm'?16:208);assert(closed[8]<=52);}
});
