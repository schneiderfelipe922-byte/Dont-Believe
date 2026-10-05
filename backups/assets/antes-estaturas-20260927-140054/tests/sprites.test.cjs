const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../character-data.js'),sprites=require('../character-sprites.js');
const png=fs.readFileSync(path.join(__dirname,'../assets/sprites.png')),width=png.readUInt32BE(16),height=png.readUInt32BE(20);
test('todos os personagens usam o mesmo atlas e todos os recortes estão dentro dele',()=>{
 assert.deepEqual(Object.keys(data).sort(),['eron','guard','kali','leader','mel','mira','noah','tomas']);
 for(const spec of Object.values(data)){
  assert.equal(spec.image,'sprites');
  for(const track of [...Object.values(spec.directions),...Object.values(spec.idles)]){
   assert.equal(track.frames.length,track.durations.length);
   for(const [x,y,w,h]of track.frames){assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=width&&y+h<=height);}
  }
 }
});
test('vigia tem caminhada em quatro direções e Mel tem pose parada própria',()=>{
 const images={sprites:{width,height}};
 for(const dir of ['down','left','right','up']){
  assert.equal(data.guard.directions[dir].frames.length,6);
  assert.notDeepEqual(sprites.resolve('guard',dir,.01,images).rect,sprites.resolve('guard',dir,.6,images).rect);
  assert.deepEqual(sprites.resolve('mel',dir,0,images,100).rect,data.mel.idles[dir].frames[0]);
 }
});
test('todos os retratos mantêm a pose parada frontal independentemente do tempo',()=>{
 const images={sprites:{width,height}};
 for(const [kind,spec]of Object.entries(data)){
  const calls=[],c={save(){},restore(){},drawImage(...args){calls.push(args);}};
  for(const time of [0,200,450,1000,9000])assert(sprites.portrait(c,512,512,kind,images,time));
  for(const call of calls)assert.deepEqual(call,calls[0],kind);
  const [x,y,w]=spec.idles.down.frames[0];
  assert.deepEqual(calls[0].slice(1,4),[x,y,w],kind+' deve usar idle, não caminhada');
 }
});
