const test=require('node:test'),assert=require('node:assert/strict');
const {G,A,D}=require('./endings-routes.cjs');
function state(scene){const s=G.initial();Object.assign(s,{scene,adults:4,mira:4,eron:4,noah:4,suspicion:4});return s;}
test('as quatro respostas do interrogatório preservam efeitos, acesso à chave e destino',()=>{
 const effects=[{adults:5,mira:4,eron:4,suspicion:3},{adults:4,mira:5,eron:5,suspicion:5},{adults:4,mira:5,eron:4,suspicion:6},{adults:6,mira:2,eron:0,suspicion:2}];
 for(let i=0;i<4;i++){
  const s=state('interrogatorio'),next=G.take(s,i);
  assert.equal(next.scene,'sumico');assert(next.flags.keySeen);assert(next.flags.miraTaken);
  for(const [key,value]of Object.entries(effects[i]))assert.equal(next[key],value,key);
  assert.equal(next.danger.turns,null);assert.equal(next.danger.wounds,0);
  assert.equal(!!next.flags.faith,i===2);assert.equal(!!next.flags.eronBetrayed,i===3);
  assert(next.pending.text.length>300);
 }
 const s=state('interrogatorio');assert(!G.value(G.scenes.interrogatorio.text,s).join(' ').includes('só disse a Noah'));
 s.flags.disclosed=true;assert(G.value(G.scenes.interrogatorio.text,s).join(' ').includes('só disse a Noah'));
});
test('o resgate distingue Tomas retido, transferido e já libertado, sem cobrar pela leitura',()=>{
 for(const status of ['retido','transferido','livre']){
  const s=state('resgate');Object.assign(s.flags,{cellOpen:true,miraTaken:true,tomasTransferred:status==='transferido',tomasRescued:status==='livre'});s.danger.turns=status==='transferido'?0:4;
  const before=JSON.stringify(s),text=G.value(G.scenes.resgate.text,s).join('\n');
  assert.equal(JSON.stringify(s),before);
  assert.equal(text.includes('Ouvi Tomas atrás da divisória'),status==='retido');
  assert.equal(text.includes('Levaram Tomas.'),status==='transferido');
  assert.equal(text.includes('Tomas já está fora da divisória'),status==='livre');
  assert.equal(text.includes('Ele prova que Tomas ainda está aqui.'),status==='retido');
  const rescue=G.take(s,0);assert.equal(rescue.scene,'subsolo');assert(rescue.flags.rescued&&rescue.flags.passage&&rescue.flags.altarClue);assert.equal(rescue.mira,5);
  assert.equal(rescue.flags.tomasTransferred,s.flags.tomasTransferred);assert.equal(rescue.flags.tomasRescued,s.flags.tomasRescued);
  const wait=G.take(s,1);assert.equal(wait.scene,'subsolo');assert(wait.flags.rescueSkipped&&wait.flags.altarClue);assert(!wait.flags.rescued&&!wait.flags.passage);assert.equal(wait.mira,3);
  assert.equal(wait.danger.turns,Math.max(0,s.danger.turns-1));assert.equal(rescue.danger.turns,wait.danger.turns);
  if(status!=='transferido'){assert(A.available('mira',wait));assert(!A.sideChoices('mira',wait).find(c=>c.once==='rescued').lock);}
 }
});
test('recuperar o símbolo preserva pessoas, relações, perigo e custa somente a ação original',()=>{
 const s=state('reliquia');Object.assign(s.flags,{miraTaken:true,tomasTransferred:true,eronBetrayed:true});s.danger.turns=0;s.danger.wounds=2;
 const before=JSON.stringify(s);G.value(G.scenes.reliquia.text,s);assert.equal(JSON.stringify(s),before);
 const next=G.take(s,0);assert.equal(next.scene,'preparar');assert(next.flags.relic);assert(next.inventory.includes('Símbolo do Luzitruismo'));
 for(const key of ['adults','mira','eron','noah','suspicion','danger'])assert.deepEqual(next[key],s[key],key);
 for(const flag of ['miraTaken','tomasTransferred','eronBetrayed'])assert(next.flags[flag]);
 assert(!next.flags.rescued&&!next.flags.tomasRescued);assert.equal(G.choices(s).length,1);
 const active=state('reliquia');active.danger.turns=5;assert.equal(G.take(active,0).danger.turns,4);
});
test('resgate de Tomas na última ação e transferência definitiva continuam válidos',()=>{
 const s=state('resgate');Object.assign(s.flags,{cellOpen:true,miraTaken:true});s.danger.turns=1;
 const rescued=A.perform(s,'tomas',0).state;assert.equal(rescued.danger.turns,0);assert(rescued.flags.tomasRescued);assert(!rescued.flags.tomasTransferred);
 const expired=D.clock(s,1);assert(expired.length);assert(s.flags.tomasTransferred);assert(A.sideChoices('tomas',s)[0].lock);
});

test('conversas opcionais não recolocam Tomas na cela depois do resgate ou transferência',()=>{
 for(const status of ['livre','transferido']){
  const s=state('preparar');Object.assign(s.flags,{rescued:true,miraTaken:true,kitchenClue:true,tomasRescued:status==='livre',tomasTransferred:status==='transferido'});
  const mira=G.value(A.actions.mira.text,s);assert(!mira.includes('não deixe Tomas na divisória'));
  const choice=A.sideChoices('eron',s).find(c=>c.once==='evidenceShared');assert(!choice.response.includes('ainda dá tempo'));
  const delivered=A.perform(s,'eron',A.sideChoices('eron',s).findIndex(c=>c.once==='evidenceShared'));assert.equal(typeof delivered.text,'string');assert(!delivered.text.includes('ainda dá tempo'));
  const bread=A.sideChoices('mira',s).find(c=>c.once==='fedMira');assert(!bread.response.includes('Agora precisamos da porta.'));
  if(status==='transferido'){
   assert(!G.value(A.actions.tomas.text,s).includes('A resposta vem baixa'));
   assert.match(A.sideChoices('tomas',s)[0].lock,/já foi transferido/);
   for(const c of A.sideChoices('gate',s))assert(!c.response.includes('Tomas continuam nas celas')&&!c.response.includes('Tomas ainda aguardam'));
  }
 }
});

test('pedidos de Eron acompanham o destino de Tomas sem alterar requisitos nem recompensas',()=>{
 const S=require('../javascript/social.js');
 for(const id of ['eron-letter','eron-piece']){
  const q=S.quests.find(q=>q.id===id),s=state('preparar'),before=JSON.stringify(q);
  assert.equal(S.request(q,s),q.request);
  s.flags.tomasRescued=true;assert.notEqual(S.request(q,s),q.request);assert(!/Sumiu|ninguém explica/.test(S.request(q,s)));
  s.flags.tomasRescued=false;s.flags.tomasTransferred=true;assert.notEqual(S.request(q,s),q.request);
  assert.equal(JSON.stringify(q),before);
 }
});

test('epílogo de captura antecipada não inventa prisão de Mira nem saída de Tomas',()=>{
 const s=state('captura'),text=A.consequences(s).join(' ');
 assert(!text.includes('Mira continuou presa'));assert(!text.includes('Tomas ficou em OldHood'));
 assert.match(text,/destino de Tomas.*não foi confirmado/);
 s.flags.miraTaken=true;assert(A.consequences(s).some(t=>t.includes('Mira continuou presa')));
 s.flags.tomasTransferred=true;assert(A.consequences(s).some(t=>t.includes('transferido')));
});

test('epílogos separam a saída de Kali da travessia de quem foi libertado',()=>{
 const s=state('sobrevivente');Object.assign(s.flags,{escapeSolo:true,miraTaken:true,rescued:true,tomasRescued:true});
 const solo=A.consequences(s);assert(solo.some(t=>t.includes('Kali saiu sozinho')));assert(solo.some(t=>t.includes('Mira saiu da cela')));
 assert(!solo.some(t=>t.includes('cruzou o portão com os outros')));
 s.scene='voz';Object.assign(s.flags,{escapeSolo:false,tomasRescued:false,tomasTransferred:true});
 const group=A.consequences(s);assert(group.some(t=>t.includes('Mira atravessou o portão')));
 assert(group.some(t=>t.includes('Tomas foi transferido')));assert(!group.some(t=>t.includes('Tomas cruzou o portão')));
});
