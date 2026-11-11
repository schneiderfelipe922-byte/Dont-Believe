const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../javascript/character-data.js'),sprites=require('../javascript/character-sprites.js');
const png=fs.readFileSync(path.join(__dirname,'../assets/sprites-e-idles/sprites.png')),width=png.readUInt32BE(16),height=png.readUInt32BE(20);
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
  assert.equal(data.mel.idles[dir].frames.length,4);
  assert.equal(data.mel.directions[dir].frames.length,6);
  assert.deepEqual(sprites.resolve('mel',dir,0,images,0).rect,data.mel.idles[dir].frames[0]);
  assert.deepEqual(sprites.resolve('mel',dir,0,images,.5).rect,data.mel.idles[dir].frames[1]);
  assert.deepEqual(data.mel.idles[dir].anchor,data.mel.directions[dir].anchor);
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
test('pais usam os quatro idles novos e não simulam caminhada',()=>{
 const images={sprites:{width,height}};
 for(const kind of ['daty','inauri']){
  assert.equal(data[kind].idleOnly,true);assert.deepEqual(Object.keys(data[kind].directions),['down']);
  for(const dir of ['down','up','left','right']){
   assert.equal(data[kind].idles[dir].frames.length,4);
   assert.equal(sprites.resolve(kind,dir,0,images,.5).track,data[kind].idles[dir]);
  }
  assert.equal(sprites.resolve(kind,'left',1,images).track.frames.length,1);
 }
});
test('os sete personagens percorrem seis quadros nas quatro direções no ritmo do pacote novo',()=>{
 const images={sprites:{width,height}};
 for(const kind of ['kali','noah','mira','eron','tomas','guard','leader'])for(const dir of ['down','left','right','up']){
  const track=data[kind].directions[dir];assert.equal(track.frames.length,6);
  let elapsed=0;
  for(let i=0;i<6;i++){
   const f=sprites.resolve(kind,dir,(elapsed+1)/400,images);
   assert.equal(f.index,i);assert.deepEqual(f.rect,track.frames[i]);
   assert.equal(f.rect[3],data[kind].height);
   elapsed+=track.durations[i];
  }
  assert.equal(sprites.resolve(kind,dir,(elapsed+1)/400,images).index,0);
  assert.equal(sprites.resolve(kind,dir,0,images).track,data[kind].idles[dir]);
  assert.equal(data[kind].idles[dir].frames.length,4);
  assert.deepEqual(track.anchor,data[kind].idles[dir].anchor,kind+' mantém a origem entre idle e caminhada');
 }
});
test('novo Kali anima quatro idles e seis passos em cada direção mantendo 40 px',()=>{
 const images={sprites:{width,height}};
 assert.equal(data.kali.height,40);assert.equal(data.kali.sourceHeight,40);
 for(const dir of ['down','left','right','up']){
  const walk=data.kali.directions[dir],idle=data.kali.idles[dir];
  assert.equal(walk.frames.length,6);assert.equal(idle.frames.length,4);
  assert.deepEqual([0,.5,.9,1.3,1.4].map(t=>sprites.resolve('kali',dir,0,images,t).index),[0,1,2,3,0]);
  for(let i=0;i<6;i++){
   const f=sprites.resolve('kali',dir,(i*140+1)/400,images);
   assert.equal(f.index,i);assert.equal(f.rect[3],40);
  }
  assert.equal(sprites.resolve('kali',dir,841/400,images).index,0);
  assert.equal(sprites.resolve('kali',dir,0,images).track,idle);
 }
});
test('o jogo usa as dez fontes finais, suas estaturas e suas durações',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/sprites-e-idles/sprites-novos/manifest.json'),'utf8'));
 assert.equal(manifest.integrado_ao_jogo,true);
 const aliases={vigia:'guard',lider:'leader'},dirs=['down','left','right','up'];
 for(const [name,source]of Object.entries(manifest.personagens)){
  const spec=data[aliases[name]||name];
  assert.equal(spec.sourcePackage,'sprites-novos/'+name);
  assert.equal(spec.height,source.altura);
  for(const dir of dirs){
   assert.deepEqual(spec.idles[dir].durations,source.idle.duracoes_ms);
   if(source.walk)assert.deepEqual(spec.directions[dir].durations,source.walk.duracoes_ms);
   else assert.equal(spec.idleOnly,true);
  }
 }
});

test('Mel usa repouso baixo animado e conserva a escala e a base ao caminhar',()=>{
 assert.equal(data.mel.idleAnimated,true);
 assert.equal(data.mel.sourcePackage,'sprites-novos/mel');
 assert.equal(data.mel.sourceHeight,26);
 const images={sprites:{width,height}};
 for(const dir of ['down','left','right','up']){
  const idle=data.mel.idles[dir],walk=data.mel.directions[dir];
  assert.deepEqual(idle.durations,[450,250,450,250]);assert.deepEqual(walk.durations,[160,160,160,160,160,160]);
  const boxes=[];
  for(const [step,time]of [[0,0],[0,.5],[.01,0],[.5,0]]){
   const c={save(){},restore(){},drawImage(...args){boxes.push(args);}};
   const f=sprites.resolve('mel',dir,step,images,time);sprites.draw(c,100,200,'mel',dir,step,time,images);
   const b=boxes.at(-1);assert.equal(b[6]+f.track.anchor[1],200);assert.equal(b[7],f.rect[2]);assert.equal(b[8],f.rect[3]);
  }
 }
});
