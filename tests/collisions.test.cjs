const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../javascript/world.js'),G=require('../javascript/story.js');require('../javascript/adventure.js');
const {configs,route}=require('./endings-routes.cjs');
const inside=(p,x,y,r=7)=>x+r>p.x&&x-r<p.x+p.w&&y+r>p.y&&y-r<p.y+p.h;
test('cadeiras, cabeceiras, mesa e obelisco bloqueiam os pés até a borda da arte',()=>{
 for(const [name,x,y]of [['cadeira da escrivaninha',340,143],['pé da cama',169,183],['cadeira do salão',212,639],['banco do salão',212,798],['bancada da cozinha',951,613],['cadeira da observação',900,832],['mesa dos arquivos',1216,843],['cristal do altar',400,610]])assert(!M.walkable(x,y,7),name);
});
test('vãos não desativam móveis e laterais de paredes; nenhum pé válido invade um sólido',()=>{
 let checked=0;
 for(let y=0;y<M.H*M.T;y+=3)for(let x=0;x<M.W*M.T;x+=3){
  if(!M.walkable(x,y,7))continue;checked++;
  assert(!M.sceneryProps.some(p=>inside(p,x,y)),`obstáculo atravessável em ${x},${y}`);
 }
 assert(checked>20000);
 for(const [x,y]of [[890,611],[963,740],[883,340],[1238,242]])assert(!M.walkable(x,y,7),`canto da passagem ${x},${y}`);
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
 for(const goal of samples){const p=M.place({...w.player});const path=M.path(p,goal,s,w);assert(path.length);for(const next of [...path,goal]){M.move(p,next.x-p.x,next.y-p.y,s,w);assert(Math.hypot(p.x-next.x,p.y-next.y)<.01)}}
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
 for(const [name,x,y]of [['janela esquerda do dormitório',119,149],['janela direita do dormitório',516,146],['parede da leitura',653,148],['parede lateral da cela',1055,178],['mureta do corredor',600,400],['parede lateral do salão',104,660],['parede inferior do salão',400,862]])assert(!M.walkable(x,y,7),name);
});
