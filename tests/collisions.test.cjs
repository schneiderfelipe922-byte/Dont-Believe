const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js');require('../javascript/adventure.js');
const {configs,route}=require('./endings-routes.cjs');
const inside=(p,x,y,r=7)=>x+r>p.x&&x-r<p.x+p.w&&y+r>p.y&&y-r<p.y+p.h;
test('cadeiras, cabeceiras, mesa e obelisco bloqueiam os pés até a borda da arte',()=>{
 for(const [name,x,y]of [['cama',150,170],['estante',730,110],['mesa salão',200,630],['obelisco',375,700],['bancada',890,580],['mesa observação',840,850],['mesa arquivo',1200,1580],['árvore',1400,550],['lavadora',1400,190]])assert(!M.walkable(x,y,7),name);
});
test('vãos não desativam móveis e laterais de paredes; nenhum pé válido invade um sólido',()=>{
 let checked=0;
 for(let y=0;y<M.H*M.T;y+=3)for(let x=0;x<M.W*M.T;x+=3){
  if(!M.walkable(x,y,7))continue;checked++;
  assert(!M.sceneryProps.some(p=>inside(p,x,y)),`obstáculo atravessável em ${x},${y}`);
 }
 assert(checked>20000);
 for(const [x,y]of [[700,500],[555,1660],[1200,480],[1250,320]])assert(!M.walkable(x,y,7),`canto da passagem ${x},${y}`);
});
test('apertar diagonalmente e dar passos grandes não permite atravessar cantos ou janelas',()=>{
 const s=G.initial(),w=M.fresh();s.flags.cellOpen=s.flags.tunnel=true;
 const starts=[[230,198],[300,155],[510,245],[1250,790],[920,781],[1240,279],[780,265]];
 for(const [x,y]of starts)for(const [dx,dy]of [[900,900],[-900,900],[900,-900],[-900,-900],[10000,0],[0,-10000]]){
  const p=M.place({x,y});M.move(p,dx,dy,s,w);assert(M.walkable(p.x,p.y,7,s,w));
  assert(!M.sceneryProps.some(o=>inside(o,p.x,p.y)));
 }
});
test('rotas do mapa têm largura para os pés do personagem em cada segmento',()=>{
 const run=route(configs.voz),s=run.state,w=run.world;
 const samples=[M.positions.bed,M.positions.examiner,M.positions.relic,M.positions.records,M.positions.miraCell];
 for(const goal of samples){const p=M.place(goal.y>=1200?{x:155,y:1830}:M.fresh().player);const path=M.path(p,goal,s,w);assert(path.length);for(const next of [...path,goal]){M.move(p,next.x-p.x,next.y-p.y,s,w);assert(Math.hypot(p.x-next.x,p.y-next.y)<.01)}}
});
test('retomar partidas recupera jogador sobre cadeira ou porta fechada sem mudar a história',()=>{
 for(const [x,y]of [[340,143],[900,832],[1216,843],[1199,258],[1215,755]]){
  const s=G.initial(),w=M.fresh(),before=JSON.stringify(s);w.player={x,y,dir:'left',step:2};M.normalizeWorld(w,s);assert(M.walkable(w.player.x,w.player.y,7,s,w));assert.equal(JSON.stringify(s),before);assert.equal(w.player.dir,'left');
 }
});
test('porta fechada bloqueia toda a folha visível pelo norte, sul e laterais',()=>{
 for(const d of M.doors){
  const s=G.initial(),w=M.fresh();s.flags.cellOpen=s.flags.tunnel=true;w.doors[d.id]=false;const box=M.doorBounds(d),x=box.x+box.w/2;
  for(let y=box.y;y<box.y+box.h;y+=4)assert(!M.walkable(x,y,7,s,w),`${d.id}: pé sobre a folha em ${y}`);
  const p={x:box.x+7,y:box.y-7};assert(M.walkable(p.x,p.y,7,s,w));M.move(p,0,box.h+40,s,w);assert.equal(p.y,box.y-7);
  w.doors[d.id]=true;assert(!M.toggleDoor(d.id,s,w,[{x,y:box.y+12}]).changed,'não fecha sobre quem está junto à parte superior da folha');
 }
});
test('janelas laterais e bordas inferiores das paredes não viram piso',()=>{
 for(const [name,x,y]of [['janela dormitório',95,149],['parede leitura',550,180],['parede celas',570,1600],['mureta corredor',600,450],['parede salão',72,660],['parede inferior salão',400,915]])assert(!M.walkable(x,y,7),name);
});
test('contato com parede, móvel e porta não deixa uma folga dependente do passo',()=>{
 const s=G.initial(),w=M.fresh();s.flags.cellOpen=true;w.doors.cell=false;
 const probes=[
  {x:300,y:155,dx:0,dy:-40,axis:'y',edge:142},
  {x:200,y:175,dx:-40,dy:0,axis:'x',edge:192},
  {x:300,y:155,dx:0,dy:-200,axis:'y',edge:142},
  {x:435,y:1830,dx:0,dy:-200,axis:'y',edge:1791}
 ];
 for(const probe of probes)for(const frames of [1,7,30]){
  const p={x:probe.x,y:probe.y};
  for(let i=0;i<frames;i++)M.move(p,probe.dx/frames,probe.dy/frames,s,w);
  assert(M.walkable(p.x,p.y,7,s,w));
  assert(Math.abs(p[probe.axis]-probe.edge)<.002,JSON.stringify({probe,frames,p}));
 }
});
test('andar na diagonal desliza junto à parede sem prender nem atravessar os pés',()=>{
 const s=G.initial(),w=M.fresh(),p={x:240,y:155};
 M.move(p,40,-40,s,w);
 assert.equal(p.x,280);assert(Math.abs(p.y-142)<.002);assert(M.walkable(p.x,p.y,7,s,w));
});

test('paredes laterais e inferiores pintadas bloqueiam até deslocamentos grandes',()=>{
 for(const probe of [{x:140,y:200,dx:-100,dy:0,minX:122},{x:450,y:220,dx:100,dy:0,maxX:473},{x:200,y:850,dx:0,dy:150,maxY:878},{x:1500,y:400,dx:150,dy:0,maxX:1523}]){
  const p={x:probe.x,y:probe.y};assert(M.walkable(p.x,p.y,7));M.move(p,probe.dx,probe.dy);assert(M.walkable(p.x,p.y,7));if(probe.minX)assert(p.x>=probe.minX);if(probe.maxX)assert(p.x<=probe.maxX);if(probe.maxY)assert(p.y<=probe.maxY);
 }
});
