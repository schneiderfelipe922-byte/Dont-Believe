const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js'),A=require('../javascript/adventure.js');
require('../javascript/danger.js');require('../javascript/social.js');require('../javascript/investigation.js');require('../javascript/expanded-map.js');
const R=require('../javascript/residents.js');
test('planejamento acessível no quarto de Elias sem chave ou prova obrigatória',()=>{
 const s=G.initial(),w=M.fresh();s.scene='preparar';
 const goal=M.target(s,w);
 assert.equal(M.roomAt(goal.x,goal.y),'Quarto de Elias');
 assert(M.path(w.player,goal,s,w,{exact:true}).length);
 assert.match(goal.objective,/quarto abandonado de Elias/);
 assert.equal(G.scenes.preparar.place,'Quarto de Elias');
 const eron=R.point('eron',s,w);assert.equal(eron.mode,'planning');
 assert.equal(M.roomAt(eron.x,eron.y),'Quarto de Elias');
 assert(M.path(goal,eron,s,w,{exact:true}).length);
 const before={x:eron.x,y:eron.y};for(let i=0;i<100;i++)R.update(s,w,.1);
 assert.deepEqual({x:eron.x,y:eron.y},before);
 s.flags.eronBetrayed=true;assert.equal(R.point('eron',s,w).mode,'cell');
});
test('revisar mantém preparação aberta e confirmar inicia confronto',()=>{
 const s=G.initial();s.scene='preparar';s.flags.tomasRescued=true;
 const reviewing=G.take(s,0);assert.equal(reviewing.scene,'preparar');assert(!reviewing.flags.committed);
 const confirmed=G.take(s,1);assert.equal(confirmed.scene,'confronto');assert(confirmed.flags.committed);
 assert(!A.available('eron',confirmed));assert(confirmed.flags.tomasRescued);
});
