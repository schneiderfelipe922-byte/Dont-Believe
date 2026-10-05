const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../story.js'),M=require('../world.js'),A=require('../adventure.js');require('../danger.js');const S=require('../social.js'),R=require('../residents.js');
function setup(){const s=G.initial(),w=M.fresh();s.scene='quarto';return {s,w};}
function run(s,w,op,id){const result=S.perform(s,op,id,w);assert(!result.error,result.error);return result.state;}
test('12 pedidos: três por personagem, sequência, itens e recompensas únicas',()=>{
 assert.equal(S.quests.length,12);
 for(const who of Object.keys(S.names)){
  let {s,w}=setup();s.flags.tunnel=true;w.tunnelOpen=true;
  for(const d of M.doors)w.doors[d.id]=true;
  const qs=S.quests.filter(q=>q.who===who);assert.equal(qs.length,3);let total=0;
  for(const q of qs){
   const initial=s[S.stat[who]];s=run(s,w,'accept',q.id);
   for(const [name]of q.items){const item=S.items[name];assert(M.walkable(item.x,item.y),name);w.player={...item};s=run(s,w,'collect',name);assert(s.inventory.includes(name));assert(S.perform(s,'collect',name,w).error);}
   assert(S.ready(q,s));w.player={...S.actorPoint(who,s,w)};s=run(s,w,'deliver',q.id);
   assert.equal(s.errands[q.id],'done');assert.equal(s[S.stat[who]],initial+q.reward);total+=q.reward;
   assert(S.perform(s,'deliver',q.id,w).error);assert(S.perform(s,'accept',q.id,w).error);
  }
  assert.equal(s[S.stat[who]],total);assert.equal(S.current(who,s),undefined);
 }
});
test('chave precede a carta; entregas exigem itens e proximidade',()=>{
 let {s,w}=setup();s=run(s,w,'accept','eron-letter');w.player={...S.items['Carta de Tomas']};assert(S.perform(s,'collect','Carta de Tomas',w).error);
 assert(S.perform(s,'deliver','eron-letter',w).error);
 w.player={...S.items['Chave do baú de Tomas']};s=run(s,w,'collect','Chave do baú de Tomas');w.player={...S.items['Carta de Tomas']};s=run(s,w,'collect','Carta de Tomas');
 w.player={x:900,y:700};assert(S.perform(s,'deliver','eron-letter',w).error);
});
test('missões respeitam prisão, compromisso final, prazo e migração de salvamentos',()=>{
 let {s,w}=setup();s.errands={'mira-book':'active',bad:'done'};A.normalize(s);assert.deepEqual(s.errands,{'mira-book':'active'});
 s.flags.miraTaken=true;assert(S.perform(s,'collect','Livro de capa verde',w).error);
 s.flags.miraTaken=false;s.flags.committed=true;assert(S.perform(s,'collect','Livro de capa verde',w).error);
 s.flags.committed=false;s.scene='confinamento';s.danger.turns=4;w.player={...S.items['Livro de capa verde']};s=run(s,w,'collect','Livro de capa verde');assert.equal(s.danger.turns,3);
 const restored=A.normalize(JSON.parse(JSON.stringify(s)));assert.equal(restored.errands['mira-book'],'active');assert(restored.inventory.includes('Livro de capa verde'));
});
test('todos os itens são alcançáveis com as trancas de história abertas',()=>{
 const {s,w}=setup();Object.assign(s.flags,{cellOpen:true,tunnel:true,latchOpen:true});
 for(const item of Object.values(S.items)){assert(M.walkable(item.x,item.y),item.name);assert(M.path(w.player,item,s,w).length,item.name);}
});
test('Mira e Eron falam mais com confiança; Noah e vigias mantêm vozes próprias',()=>{
 const {s}=setup();for(const who of ['mira','eron']){const low=S.conversation(who,s).text;s[who]=6;assert(S.conversation(who,s).text.length>low.length);}
 assert.match(S.conversation('noah',s).text,/vigia|adulto/);assert.match(S.conversation('guard',s).text,/\?/);
});
test('Mira, Eron e Noah andam por pelo menos dois cômodos e Noah permanece com um vigia',()=>{
 const {s,w}=setup();w.player={x:0,y:0};const visited={mira:new Set(),eron:new Set(),noah:new Set()};
 for(let i=0;i<6000;i++){
  R.update(s,w,.1);
  for(const k of Object.keys(visited)){const a=R.point(k,s,w);assert(M.walkable(a.x,a.y,7,s,w),`${k} colidiu em ${a.x},${a.y}`);const room=M.rooms.find(r=>a.x>=r.x*M.T&&a.x<(r.x+r.w)*M.T&&a.y>=r.y*M.T&&a.y<(r.y+r.h)*M.T);if(room)visited[k].add(room.id);}
  const n=R.point('noah',s,w),g=R.point('guard',s,w),distance=Math.hypot(n.x-g.x,n.y-g.y);assert(distance>=25&&distance<=65,'Noah/guarda: '+distance);
 }
 for(const [who,rooms]of Object.entries(visited))assert(rooms.size>=2,who+': '+[...rooms]);
});
test('objetivos, preparações e retorno de tarefas usam a posição real dos personagens',()=>{
 const {s,w}=setup();s.scene='mira';R.normalize(s,w);const relocated=M.place({x:708,y:252});Object.assign(w.residents.mira,relocated);
 const target=M.target(s,w);assert.equal(target.x,relocated.x);assert.equal(target.y,relocated.y);
 s.errands['mira-book']='active';s.inventory.push('Livro de capa verde');w.tracked='errand:mira-book';assert.equal(M.target(s,w).x,relocated.x);
 const saved=JSON.parse(JSON.stringify(w));M.normalizeWorld(saved,s);assert.equal(R.point('mira',s,saved).x,relocated.x);
 s.flags.miraTaken=true;assert.deepEqual({x:R.point('mira',s,w).x,y:R.point('mira',s,w).y},M.positions.miraCell);
});
