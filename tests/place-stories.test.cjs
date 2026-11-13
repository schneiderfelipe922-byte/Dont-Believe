const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../javascript/story.js'),M=require('../javascript/world.js'),A=require('../javascript/adventure.js');
require('../javascript/danger.js');const S=require('../javascript/social.js'),V=require('../javascript/investigation.js');
const ids=['laundryMemory','warehouseMemory','eliasMemory','courtyardMemory'];
test('encontros têm pontos caminháveis nos quatro locais e podem ser marcados no diário',()=>{
 const s=G.initial();s.scene='plano';
 for(const id of ids){const a=A.actions[id],p=M.positions[a.target],r=M.rooms.find(r=>r.id===a.room);assert(M.walkable(p.x,p.y,7));assert(p.x>=r.x*M.T&&p.x<(r.x+r.w)*M.T&&p.y>=r.y*M.T&&p.y<(r.y+r.h)*M.T);assert(A.points(s).some(p=>p.action===id));}
});
test('lembranças são opcionais, persistem e não concedem resgates, prova ou atalhos',()=>{
 let s=G.initial();s.scene='plano';const before=JSON.parse(JSON.stringify(s));
 for(const id of ids){s=A.perform(s,id,0).state;assert(!A.available(id,s));}
 assert.equal(s.scene,before.scene);assert.deepEqual(s.inventory,before.inventory);assert.equal(s.danger.turns,null);
 for(const flag of ['proof','passage','cellOpen','rescued','tomasRescued','latchOpen','warehouseOpen'])assert(!s.flags[flag]);
 for(const stat of ['mira','eron','noah','adults','suspicion'])assert.equal(s[stat],before[stat]);
 assert.equal(A.groupReady(s),A.groupReady(before));assert.equal(A.noahReady(s),A.noahReady(before));
 assert(V.notes(A.normalize(JSON.parse(JSON.stringify(s)))).doubts.some(([t])=>t==='Para onde foi Elias?'));
});
test('escolha no armazém muda diário e balanço sem fabricar prova assinada',()=>{
 const s=G.initial();s.scene='plano';const a=A.perform(s,'warehouseMemory',0).state,b=A.perform(s,'warehouseMemory',1).state;
 assert.notDeepEqual(V.notes(a),V.notes(b));assert.notDeepEqual(A.consequences(a),A.consequences(b));assert(!a.flags.proof&&!b.flags.proof);
});
test('lembranças respeitam prisão, resgate e transferência nas conversas',()=>{
 const s=G.initial();s.flags.courtyardMemoryRead=true;s.flags.laundryMemoryRead=true;s.flags.eliasMemoryRead=true;
 assert.match(S.conversation('eron',s).text,/casa maior/);s.flags.tomasTransferred=true;assert.match(S.conversation('eron',s).text,/Hoje eu não consigo/);
 s.flags.eronBetrayed=true;assert.doesNotMatch(S.conversation('eron',s).text,/segurava a manga|casa maior/);
 s.flags.miraTaken=true;assert.doesNotMatch(S.conversation('mira',s).text,/recado de Elias/);
});
test('durante urgência uma ação custa exatamente um turno e não desfaz transferência',()=>{
 let s=G.initial();s.scene='preparar';s.danger.turns=1;s=A.perform(s,'courtyardMemory',0).state;
 assert.equal(s.danger.turns,0);assert(s.flags.tomasTransferred);assert(!s.flags.tomasRescued);assert(!A.available('courtyardMemory',s));
 s.flags.committed=true;assert(!A.available('eliasMemory',s));
});
