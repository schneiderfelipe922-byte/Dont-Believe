const test=require('node:test'),assert=require('node:assert/strict');
const UI=require('../javascript/dialogue-ui.js');
test('paginação divide um parágrafo longo sem perder palavras, acentos ou ordem',()=>{
 const source=['Noah disse que Tomas foi transferido. Ainda não vi uma prova disso. '.repeat(12),'Mira viu duas bandejas.'];
 const pages=UI.paginate(source,p=>p.join(' ').length<=180);
 assert(pages.length>3);assert(pages.every(p=>p.join(' ').length<=180));
 assert.equal(pages.flat().join(' ').replace(/\s+/g,' ').trim(),source.join(' ').replace(/\s+/g,' ').trim());
});
test('paginação preserva parágrafos curtos e sempre progride mesmo em espaço mínimo',()=>{
 assert.deepEqual(UI.paginate(['Primeira frase.','Segunda frase.'],p=>p.join(' ').length<=60),[['Primeira frase.','Segunda frase.']]);
 assert.deepEqual(UI.paginate(['Uma palavra.'],()=>false),[['Uma'],['palavra.']]);
});
function menu(disabled=[]){
 let confirmed=[],focused=-1;
 const buttons=Array.from({length:4},(_,i)=>({disabled:disabled.includes(i),dataset:{},events:{},attributes:{},addEventListener(k,f){this.events[k]=f;},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},focus(){focused=i;this.events.focus?.();},click(){if(!this.disabled)confirmed.push(i);}}));
 const selection=UI.bindChoices({querySelectorAll:()=>buttons});
 return {buttons,selection,confirmed,get focused(){return focused;}};
}
test('seleção pula opções bloqueadas, circula e só confirma quando solicitada',()=>{
 const m=menu([0,2]);assert.equal(m.selection.selectedIndex,1);assert.equal(m.focused,1);
 m.selection.move(1);assert.equal(m.selection.selectedIndex,3);m.selection.move(1);assert.equal(m.selection.selectedIndex,1);
 m.selection.move(-1);assert.equal(m.selection.selectedIndex,3);assert.deepEqual(m.confirmed,[]);
 assert.equal(m.selection.select(2),false);m.selection.activate();assert.deepEqual(m.confirmed,[3]);
 assert.equal(m.buttons.filter(b=>b.dataset.selected==='true').length,1);
});
test('mouse e foco movem a seta sem executar a escolha; bloqueadas não recebem seleção',()=>{
 const m=menu([2]);m.buttons[3].events.pointerenter();assert.equal(m.selection.selectedIndex,3);
 m.buttons[1].focus();assert.equal(m.selection.selectedIndex,1);m.buttons[2].events.pointerenter();assert.equal(m.selection.selectedIndex,1);
 assert.deepEqual(m.confirmed,[]);assert.equal(m.buttons[1].attributes['aria-current'],'true');assert.equal(m.buttons[3].attributes['aria-current'],undefined);
});
test('todas as opções bloqueadas mantêm o diálogo sem execução acidental',()=>{
 const m=menu([0,1,2,3]);m.selection.move(1);m.selection.activate();assert.equal(m.selection.selectedIndex,-1);assert.deepEqual(m.confirmed,[]);
});
test('ilustrações usam aliases dos vigias, contêm a figura inteira e permitem reserva',()=>{
 const calls=[],ctx={drawImage(...args){calls.push(args);}},art={width:1024,height:1536};
 assert.equal(UI.speakerKey('guard'),'vigia');assert.equal(UI.speakerKey('leader'),'lider');assert.equal(UI.speakerKey('mel'),'neutral');
 assert.equal(UI.portrait(ctx,768,1152,'guard',{dialogue_vigia:art}),true);
 assert.deepEqual(calls[0],[art,0,0,768,1152]);assert.equal(ctx.imageSmoothingEnabled,true);
 assert.equal(UI.portrait(ctx,768,1152,'noah',{}),false);assert.equal(UI.portrait(ctx,768,1152,'mel',{}),false);
 const square={width:900,height:900};UI.portrait(ctx,768,1152,'kali',{dialogue_kali:square});assert.deepEqual(calls[1],[square,0,384,768,768]);
});


test('setas mantêm a escolha visível dentro da caixa sem rolar a página',()=>{
 const m=menu();const scroll={scrollTop:0,getBoundingClientRect:()=>({top:100,bottom:200})};
 m.buttons.forEach((b,i)=>b.getBoundingClientRect=()=>({top:100+i*60,bottom:160+i*60}));
 const controller=UI.bindChoices({querySelectorAll:()=>m.buttons,closest:()=>scroll});
 assert.equal(scroll.scrollTop,0);controller.move(1);assert.equal(scroll.scrollTop,20);
 scroll.scrollTop=150;m.buttons[0].getBoundingClientRect=()=>({top:75,bottom:135});controller.move(-1);assert.equal(scroll.scrollTop,125);
});
