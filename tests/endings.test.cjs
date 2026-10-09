const test=require('node:test'),assert=require('node:assert/strict');
const {route,configs,G,A,D}=require('./endings-routes.cjs');
for(const [id,config]of Object.entries(configs))test('partida completa: '+G.scenes[id].title+'; todos os objetivos possuem percurso físico',()=>{
 const run=route(config);assert.equal(run.state.scene,id);assert(G.scenes[run.state.scene].ending);
 assert(A.consequences(run.state).length>=6);
 if(id==='voz'||id==='luz'){assert(run.state.flags.rescued);assert(run.state.flags.tomasRescued);assert(!run.state.flags.tomasTransferred);}
 assert.equal(G.choices(run.state).length,0);
});
test('perder a prova no cerco cancela uma fuga coletiva que dependia dela',()=>{
 const run=route(configs.voz),saved=run.checkpoints.find(c=>c.scene==='confronto').story;
 saved.mira=0;assert(A.groupReady(saved));let s=G.take(saved,0);assert(s.danger.encounter);s=D.resolve(s,'proof');s.pending=null;s=G.take(s,0);s.pending=null;s=G.take(s,0);assert.equal(s.scene,'captura');
});
test('retornar com disfarce e chave não resgata Tomas já transferido',()=>{
 const run=route(configs.voz),s=run.checkpoints.find(c=>c.scene==='confronto').story;
 s.adults=3;s.flags.key=true;s.flags.tomasTransferred=true;s.flags.tomasRescued=false;
 let next=G.take(s,1);next.pending=null;next=G.take(next,1);assert.equal(next.scene,'voz');assert.equal(next.flags.tomasRescued,false);assert(next.flags.tomasTransferred);
});
