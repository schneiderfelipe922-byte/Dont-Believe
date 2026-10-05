const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../world.js'),data=require('../character-data.js'),sprites=require('../character-sprites.js'),pixel=require('../pixel-art.js'),createRenderer=require('../render.js');
function context(){return new Proxy({measureText:s=>({width:String(s).length*6})},{get:(o,k)=>k in o?o[k]:()=>{}});}
const makeCanvas=(width,height)=>({width,height,getContext:()=>context()});
test('o renderer do cenário aplica as estaturas do atlas e anima idles sem deslocar os pés',()=>{
 const image={},renderer=createRenderer(makeCanvas(960,640),M,makeCanvas,{sprites:image});
 for(const [kind,spec]of Object.entries(data)){
  const calls=[],c={save(){},restore(){},drawImage(...args){calls.push(args);}};
  for(const time of [0,.5]){
   const frame=sprites.resolve(kind,'down',0,{sprites:image},time),scale=spec.height/spec.sourceHeight;
   renderer.sprite(c,100,200,kind,'down',0,time);const args=calls.at(-1);
   assert.equal(args[0],image);assert.deepEqual(args.slice(1,5),frame.rect);
   assert.equal(args[8],frame.rect[3]*scale);assert(Math.abs(args[6]+frame.track.anchor[1]*scale-200)<=.5);
  }
  if(spec.idleAnimated)assert.notDeepEqual(calls[0].slice(1,5),calls[1].slice(1,5),kind);
 }
});
test('arte de reserva também mantém baixos, medianos e altos no cenário',()=>{
 const renderer=createRenderer(makeCanvas(960,640),M,makeCanvas,{});
 for(const kind of ['kali','mira','noah','eron','tomas','guard','leader']){
  const calls=[],c={drawImage(...args){calls.push(args);}};renderer.sprite(c,100,200,kind,'down',0,0);
  const args=calls[0],scale=data[kind].height/32;
  assert.equal(args[7],32*scale);assert.equal(args[8],40*scale);assert(Math.abs(args[6]+36*scale-200)<=.5);
  const scales=[],direct={save(){},restore(){},translate(){},scale(...args){scales.push(args);},fillRect(){}};
  pixel.sprite(direct,100,200,kind);assert.deepEqual(scales[0],[scale,scale]);
 }
});
