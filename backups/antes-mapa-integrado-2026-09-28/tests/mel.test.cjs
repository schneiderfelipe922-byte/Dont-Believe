const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../world.js'),G=require('../story.js');require('../adventure.js');
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
test('Mel circula no dormitório com a porta fechada e sai quando ela abre',()=>{
 const {s,w}=setup();let travelled=0,last={...w.mel};
 simulate(s,w,25,cat=>{assert.equal(M.roomAt(cat.x,cat.y),'Dormitório');travelled+=Math.hypot(cat.x-last.x,cat.y-last.y);last={...cat};});
 assert(travelled>100);
 w.doors.dorm=true;let left=false;
 simulate(s,w,45,cat=>{left ||=M.roomAt(cat.x,cat.y)==='Corredor dos vigias';});assert(left);
});
test('Mel recalcula o passeio se uma porta fecha durante o trajeto',()=>{
 const {s,w}=setup();w.doors.study=true;
 Object.assign(w.mel,{x:33.5*M.T,y:15.5*M.T,nextStop:2,wait:0});
 M.updateMel(s,w,.1);assert(w.mel.route.length);
 assert(M.toggleDoor('study',s,w,[w.mel]).changed);
 simulate(s,w,35,cat=>assert.notEqual(M.roomAt(cat.x,cat.y),'Sala de leitura'));
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
