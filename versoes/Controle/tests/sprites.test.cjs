const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../character-data.js'),sprites=require('../character-sprites.js');
const png=fs.readFileSync(path.join(__dirname,'../assets/sprites.png')),width=png.readUInt32BE(16),height=png.readUInt32BE(20);
test('todos os personagens usam o mesmo atlas e todos os recortes estão dentro dele',()=>{
 assert.deepEqual(Object.keys(data).sort(),['daty','eron','guard','inauri','kali','leader','mel','mira','noah','tomas']);
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
test('estaturas usam pixels do atlas sem escala adicional e mantêm a âncora dos pés',()=>{
 const images={sprites:{width,height}},groups={40:['mira','kali','daty'],46:['noah','eron','tomas'],54:['guard','leader','inauri']};
 for(const [expected,kinds]of Object.entries(groups))for(const kind of kinds){
  assert.equal(data[kind].height,Number(expected),kind);assert.equal(data[kind].sourceHeight,Number(expected),kind);
  for(const dir of Object.keys(data[kind].idles)){
   const f=sprites.resolve(kind,dir,0,images,.5),calls=[],c={save(){},restore(){},drawImage(...args){calls.push(args);}};
   assert(sprites.draw(c,100,200,kind,dir,0,.5,images));
   const args=calls[0];assert.equal(args[6]+f.track.anchor[1],200,kind+' mantém os pés');
   assert.equal(args[7],f.rect[2]);assert.equal(args[8],f.rect[3]);
  }
 }
 assert.equal(data.mel.height,26);
});
test('os nove personagens humanos têm quatro quadros frontais em loop',()=>{
 const images={sprites:{width,height}};
 for(const [kind,spec]of Object.entries(data)){
  if(kind==='mel')continue;
  assert.equal(spec.idleAnimated,true);assert.equal(spec.idles.down.frames.length,4);
  assert.deepEqual([0,.5,.9,1.3,1.4].map(t=>sprites.resolve(kind,'down',0,images,t).index),[0,1,2,3,0]);
 }
});
test('pais sem animações laterais usam idle frontal e não simulam caminhada',()=>{
 const images={sprites:{width,height}};
 for(const kind of ['daty','inauri']){
  assert.equal(data[kind].idleOnly,true);assert.deepEqual(Object.keys(data[kind].directions),['down']);
  for(const dir of ['down','up','left','right'])assert.equal(sprites.resolve(kind,dir,0,images,.5).track,data[kind].idles.down);
  assert.equal(sprites.resolve(kind,'left',1,images).track.frames.length,1);
 }
});
test('Tomas e Líder percorrem seis quadros nas quatro direções e retornam ao idle correto',()=>{
 const images={sprites:{width,height}};
 for(const kind of ['tomas','leader'])for(const dir of ['down','left','right','up']){
  const track=data[kind].directions[dir];assert.equal(track.frames.length,6);
  for(let i=0;i<6;i++){
   const f=sprites.resolve(kind,dir,(i*200+1)/400,images);
   assert.equal(f.index,i);assert.deepEqual(f.rect,track.frames[i]);
   assert.equal(f.rect[3],data[kind].height);
  }
  assert.equal(sprites.resolve(kind,dir,1201/400,images).index,0);
  assert.equal(sprites.resolve(kind,dir,0,images).track,data[kind].idles[dir]);
 }
});
