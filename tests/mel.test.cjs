const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js');require('../javascript/adventure.js');
function setup(open=false){
 const s=G.initial(),w=M.fresh();w.player={x:0,y:0};
 if(open){Object.assign(s.flags,{cellOpen:true,tunnel:true});for(const d of M.doors)if(d.id!=='exit')w.doors[d.id]=true;}
 return {s,w};
}
function simulate(s,w,seconds,inspect=()=>{}){for(let i=0;i<seconds*10;i++){M.updateMel(s,w,.1);assert(M.walkable(w.mel.x,w.mel.y,7,s,w),'Mel entrou em obstáculo');inspect(w.mel);}}
test('Mel passeia pelos oito cômodos sem atravessar paredes ou móveis',()=>{
 const {s,w}=setup(true),visited=new Set(),directions=new Set();let walked=false;
 simulate(s,w,450,cat=>{visited.add(M.roomAt(cat.x,cat.y));directions.add(cat.dir);walked ||=cat.step>0;});
 for(const room of M.rooms)assert(visited.has(room.name),'Não visitou '+room.name);
 assert(walked);assert.equal(directions.size,4);
});
test('Mel circula pelas passagens abertas e respeita as duas salas trancadas',()=>{
 const {s,w}=setup();const visited=new Set();simulate(s,w,120,cat=>visited.add(M.roomAt(cat.x,cat.y)));
 assert(visited.has('Corredor dos vigias'));assert(!visited.has('Ala restrita'));assert(!visited.has('Arquivos subterrâneos'));
 Object.assign(s.flags,{cellOpen:true,tunnel:true});simulate(s,w,450,cat=>visited.add(M.roomAt(cat.x,cat.y)));
 assert(visited.has('Ala restrita'));assert(visited.has('Arquivos subterrâneos'));
});
test('Mel recalcula o passeio se a grade fecha durante o trajeto',()=>{
 const {s,w}=setup(true);Object.assign(w.mel,{x:1194,y:330,nextStop:7,wait:0});
 M.updateMel(s,w,.1);assert(w.mel.route.length);assert(M.toggleDoor('cell',s,w,[w.mel]).changed);
 simulate(s,w,35,cat=>assert.notEqual(M.roomAt(cat.x,cat.y),'Ala restrita'));
});
test('Mel para para carinho e volta a andar quando o jogador se afasta',()=>{
 const {s,w}=setup();w.mel.wait=0;w.player={x:w.mel.x,y:w.mel.y+24};
 const before={x:w.mel.x,y:w.mel.y};simulate(s,w,3);
 assert.deepEqual({x:w.mel.x,y:w.mel.y},before);assert.equal(w.mel.step,0);
 w.player={x:0,y:0};simulate(s,w,3);assert(Math.hypot(w.mel.x-before.x,w.mel.y-before.y)>20);
});
test('posição de Mel sobrevive ao salvamento e partidas antigas recebem a gata',()=>{
 const {s,w}=setup(true);simulate(s,w,12);
 const saved=JSON.parse(JSON.stringify(w)),before={x:saved.mel.x,y:saved.mel.y,dir:saved.mel.dir};
 M.normalizeWorld(saved,s);assert.deepEqual({x:saved.mel.x,y:saved.mel.y,dir:saved.mel.dir},before);
 simulate(s,saved,8);
 delete saved.mel;M.normalizeWorld(saved,s);assert.deepEqual(M.melPoint(saved),M.fresh().mel);
 saved.mel={x:NaN,y:-100};M.normalizeWorld(saved,s);assert(M.walkable(saved.mel.x,saved.mel.y));
});
