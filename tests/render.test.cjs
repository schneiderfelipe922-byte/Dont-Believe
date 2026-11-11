const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),data=require('../javascript/character-data.js'),sprites=require('../javascript/character-sprites.js'),pixel=require('../javascript/pixel-art.js'),createRenderer=require('../javascript/render.js');
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
test('falha ou carregamento do atlas não substitui os personagens por sprites antigos',()=>{
 const renderer=createRenderer(makeCanvas(960,640),M,makeCanvas,{}),calls=[];
 const c={drawImage(...args){calls.push(args);}};
 for(const kind of Object.keys(data))assert.equal(renderer.sprite(c,100,200,kind,'down',0,0),false);
 assert.deepEqual(calls,[]);
});
test('portas e móveis são desenhados entre personagens de acordo com a posição dos pés',()=>{
 const G=require('../javascript/story.js');require('../javascript/adventure.js');
 const art={fullMap:{name:'map'},sprites:{name:'sprites'}},calls=[];
 const gradient={addColorStop(){}};
 const c=new Proxy({measureText:s=>({width:String(s).length*6}),createRadialGradient:()=>gradient,drawImage(...a){calls.push(a);}},{get:(o,k)=>k in o?o[k]:()=>{}});
 const make=(width,height)=>({width,height,getContext:()=>c}),renderer=createRenderer(make(960,640),M,make,art),s=G.initial(),w=M.fresh();
 const d=M.doors[0];
 for(const y of [d.y-8,d.y+d.h+8]){
  Object.assign(w.player,{x:d.x+d.w/2,y,dir:'down',step:0});calls.length=0;renderer.draw(s,w,[],{minimap:false,reduced:true});
  const door=calls.findIndex(a=>a[0]===art.fullMap&&a[1]===28&&a[2]===941);
  const frame=sprites.resolve('kali','down',0,art),actor=calls.findIndex(a=>a[0]===art.sprites&&a[1]===frame.rect[0]&&a[2]===frame.rect[1]);
  assert(door>=0&&actor>=0);assert(y<d.y?actor<door:door<actor,'a porta oculta apenas quem está atrás');
 }
 const p=M.sceneryProps.find(p=>p.room==='dining'&&p.x===130&&p.y===548);
 Object.assign(w.player,{x:212,y:540});calls.length=0;renderer.draw(s,w,[],{minimap:false,reduced:true});
 const furniture=calls.findIndex(a=>a[0]===renderer.map&&a[1]===p.x&&a[2]===p.y&&a[3]===p.w);
 const frame=sprites.resolve('kali','down',0,art),actor=calls.findIndex(a=>a[0]===art.sprites&&a[1]===frame.rect[0]&&a[2]===frame.rect[1]);assert(furniture>actor);
});

test('cartas e fotografias no chão são desenhadas antes de Kali, mesmo no mesmo ponto',()=>{
 const G=require('../javascript/story.js');require('../javascript/adventure.js');
 const gradient={addColorStop(){}},calls=[],art={fullMap:{},sprites:{},pickups:{},bedside:{}};
 const c=new Proxy({measureText:s=>({width:String(s).length*6}),createRadialGradient:()=>gradient,drawImage(...a){calls.push(a);}},{get:(o,k)=>k in o?o[k]:()=>{}});
 const make=(width,height)=>({width,height,getContext:()=>c}),renderer=createRenderer(make(960,640),M,make,art),s=G.initial(),w=M.fresh();
 const oldSocial=global.GameSocial,oldPhotos=global.GamePhotos;
 global.GameSocial={points:()=>[{x:w.player.x,y:w.player.y,type:'bilhete',name:'Carta no chão'}]};
 global.GamePhotos={points:()=>[{id:'family',photo:'family',x:w.player.x,y:w.player.y}]};
 try{
  calls.length=0;renderer.draw(s,w,[],{minimap:false,reduced:true});
  const frame=sprites.resolve('kali','down',0,art),actor=calls.findIndex(a=>a[0]===art.sprites&&a[1]===frame.rect[0]&&a[2]===frame.rect[1]);
  const props=calls.map((a,i)=>a[0]===art.pickups?i:-1).filter(i=>i>=0);
  assert(props.length>=2);assert(actor>=0);assert(props.every(i=>i<actor),'objetos do chão nunca cobrem Kali');
 }finally{global.GameSocial=oldSocial;global.GamePhotos=oldPhotos;}
});
