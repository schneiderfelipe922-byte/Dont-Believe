const assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js');
const A=require('../javascript/adventure.js'),D=require('../javascript/danger.js');require('../javascript/social.js');require('../javascript/investigation.js');
const clone=s=>JSON.parse(JSON.stringify(s));
function route(config={}){
 let s=G.initial(),w=M.fresh(),steps=[],checkpoints=[];
 function travel(target){
  const points=M.path(w.player,target,s,w,{exact:true});assert(points.length,`${s.scene}: objetivo inacessível (${target.x}, ${target.y})`);
  for(const p of [...points,target]){
   for(const d of M.doors)if(!M.doorOpen(d,s,w)&&!M.doorLocked(d,s,w)){w.player={...w.player};M.toggleDoor(d.id,s,w);}
   M.move(w.player,p.x-w.player.x,p.y-w.player.y,s,w);
   assert(Math.hypot(w.player.x-p.x,w.player.y-p.y)<.01,`${s.scene}: rota cruza um obstáculo`);
   assert(M.walkable(w.player.x,w.player.y,7,s,w));
  }
 }
 function side(id,index=0){s.pending=null;travel(M.positions[A.actions[id].target]);assert(A.available(id,s));const c=A.sideChoices(id,s)[index];assert(c&&!c.lock,`${id}: ${c?.lock}`);steps.push({type:'side',id,index});s=A.perform(s,id,index).state;}
 for(let i=0;i<70&&!G.scenes[s.scene].ending;i++){
  s.pending=null;
  if(s.danger.encounter){const option=D.options(s).find(c=>c.id==='bread'&&!c.lock)||D.options(s).find(c=>c.id==='resist'&&!c.lock);steps.push({type:'encounter',id:option.id});s=D.resolve(s,option.id);s.pending=null;}
  if(s.scene==='ronda'&&!s.flags.breadTaken)side('bread');
  if(s.scene==='subsolo'&&s.flags.cellOpen&&!s.flags.tomasRescued&&config.rescueTomas)side('tomas');
  if(s.scene==='preparar'){
   if(config.group&&!s.flags.escapePlan)side('eron',A.sideChoices('eron',s).findIndex(c=>c.once==='escapePlan'));
   if(config.noah&&!s.flags.latchOpen)side('noah');
  }
  const goal=M.target(s,w);assert(goal,`Cena sem objetivo: ${s.scene}`);travel(goal);
  const index=config.choices?.[s.scene]??({noah:1,preparar:1,confinamento:2,fechadura:1,confronto:config.group?0:config.noah?2:3}[s.scene]??0);
  checkpoints.push({scene:s.scene,choice:index,story:clone(s),world:clone(w)});
  steps.push({type:'story',scene:s.scene,index});const previous=s.scene;s=G.take(s,index);
  if(s.flags.tunnel)w.tunnelOpen=true;
  // A transição do altar usa o mesmo ponto de chegada do jogo.
  if(previous==='subsolo'&&s.scene==='arquivo')Object.assign(w.player,M.authoredPoint(54,41.8));
 }
 assert(G.scenes[s.scene].ending,'Rota não terminou');
 return {state:s,world:w,steps,checkpoints};
}
const configs={
 voz:{group:true,rescueTomas:true},
 luz:{noah:true,rescueTomas:true},
 sobrevivente:{},
 traicao:{choices:{oferta:2}},
 isolamento:{choices:{plano:2,confinamento:3,arquivo:0,confronto:3}},
 captura:{choices:{confronto:0}}
};
module.exports={route,configs,G,M,A,D};
