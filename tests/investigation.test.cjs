const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../javascript/story.js'),M=require('../javascript/world.js'),A=require('../javascript/adventure.js');
require('../javascript/danger.js');const S=require('../javascript/social.js'),V=require('../javascript/investigation.js');
const clean=s=>{s.pending=null;return s;};
test('salvamento anterior ganha memória social sem mudar cena, prazo, itens ou relações',()=>{
 const s=G.initial();delete s.socialMemory;s.scene='preparar';s.danger.turns=4;s.inventory=['Pão'];s.mira=3;
 const restored=A.normalize(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored.socialMemory,{refusals:[]});assert.equal(restored.scene,'preparar');assert.equal(restored.danger.turns,4);assert.deepEqual(restored.inventory,['Pão']);assert.equal(restored.mira,3);
});
test('caixa errada é reversível e não consome prazo, recursos ou relações',()=>{
 let s=G.initial();s.scene='cruzamento';s.flags.bedClue=true;s.inventory=['Etiqueta T-17','Bilhete de Eron'];const before=JSON.parse(JSON.stringify(s));
 for(const i of [1,2,1]){s=clean(G.take(s,i));assert.equal(s.scene,'cruzamento');assert.equal(s.suspicion,before.suspicion);assert.deepEqual(s.inventory,before.inventory);assert.deepEqual(s.danger,before.danger);}
 s=G.take(s,0);assert.equal(s.scene,'bandejas');assert(s.flags.boxMatched);assert(s.inventory.includes('Requisição da ala leste'));assert.equal(s.danger.turns,null);
});
test('sinal precisa de uma lembrança significativa e não abre nem resgata ninguém',()=>{
 let s=G.initial();s.scene='plano';assert(!A.available('memoryTomas',s));s.flags.protectedEron=true;assert(A.available('memoryTomas',s));
 s=A.perform(s,'memoryTomas',0).state;assert(s.flags.tomasSignalKnown);assert(!A.available('memoryTomas',s));
 s.scene='sinalGrade';s=clean(G.take(s,2));assert.equal(s.scene,'sinalGrade');assert.equal(s.suspicion,0);
 s=G.take(s,1);assert.equal(s.scene,'interrogatorio');assert(s.flags.tomasSignalAnswered);assert(!s.flags.cellOpen);assert(!s.flags.tomasRescued);assert.equal(s.danger.turns,null);
});
test('sem sinal ainda é possível escutar e prosseguir; repetir não muda relações',()=>{
 let s=G.initial();s.scene='sinalGrade';assert(G.choices(s)[1].requires(s));s=G.take(s,0);assert.equal(s.scene,'interrogatorio');assert(s.flags.cellVoicesHeard);assert.equal(s.eron,0);
});
test('Noah lembra recusas distintas, sem denúncia automática, e permite reparação',()=>{
 let s=G.initial();s.scene='noah';s=clean(G.take(s,1));assert.equal(s.socialMemory.refusals.length,1);assert.match(S.conversation('noah',s).text,/nunca faz/);
 s.scene='noah';s=clean(G.take(s,1));assert.equal(s.socialMemory.refusals.length,1);
 s.scene='oferta';s=clean(G.take(s,3));assert.equal(s.socialMemory.refusals.length,2);assert.match(S.conversation('noah',s).text,/decide sozinho/);assert(!s.flags.eronBetrayed);
 s.scene='verdade';s=clean(G.take(s,0));s.flags.confronted=true;assert(s.flags.noahTask);assert.match(S.conversation('noah',s).text,/pode cobrar/);
});
test('Mira e Eron mudam suas falas mas prisão e perda têm prioridade',()=>{
 const s=G.initial();const low=S.conversation('mira',s).text;s.mira=6;assert.notEqual(S.conversation('mira',s).text,low);assert.match(S.conversation('mira',s).text,/sem cortar/);
 s.flags.miraTaken=true;assert.match(S.conversation('mira',s).text,/grade/);
 s.flags.rescued=true;s.mira=0;assert.match(S.conversation('mira',s).text,/abriu a porta/);
 s.eron=6;assert.match(S.conversation('eron',s).text,/ideia|não precisa fazer tudo/i);s.flags.eronBetrayed=true;assert.match(S.conversation('eron',s).text,/entregou meu nome/);
});
test('versões aparecem apenas depois de ouvi-las e conversas novas respeitam a prisão',()=>{
 const s=G.initial();assert.equal(V.notes(s).doubts.length,0);s.history.push({scene:'noah'});assert(V.notes(s).doubts.some(([,t])=>t.includes('Noah disse')));
 s.scene='plano';s.flags.mealMismatch=true;assert(A.available('noahVersion',s));s.flags.miraTaken=true;assert(!A.available('noahVersion',s));
 assert.match(S.itemInfo('Requisição da ala leste').text,/manter na ala leste/);
});
test('compartilhar registra destinatário sem expor a fonte nem mudar os requisitos das fugas',()=>{
 const s=G.initial();s.scene='sigilo';const next=G.take(s,1);assert(next.flags.sharedWithNoah);assert.equal(next.mira,s.mira);assert.equal(next.noah,s.noah);assert(!next.flags.eronBetrayed);assert(!A.groupReady(next));
});
test('anotações distinguem fatos e versões; apresentação não revela pontuação social',()=>{
 const s=G.initial();s.flags.registerClue=true;s.scene='registro';const notes=V.notes(s);assert(notes.facts.some(([,t])=>t.includes('destino está vazio')));assert(notes.doubts.some(([,t])=>t.includes('Noah disse')));
 for(const text of ['Mira +2 · Eron −1','Mira e Eron +1','Adultos +2 · Mira −1','Precisa de confiança 3 com os adultos.','Precisa de Eron livre e confiança 2.','Sem Mira 2, a rota coletiva deixa de funcionar.'])assert(!/(Mira|Eron|Noah|Adultos)\s*[+−-]\d|confiança\s*\d|Mira 2/.test(V.present(text)),text);
});
