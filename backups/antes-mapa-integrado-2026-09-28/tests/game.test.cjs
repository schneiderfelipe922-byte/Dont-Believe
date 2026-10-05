// Integration checks execute the shipped game and input handlers with a minimal DOM.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function boot(configure){
 const draws=[],gradient={addColorStop(){}};
 const context=new Proxy({fillRect(x,y,w,h){draws.push({x,y,w,h,color:this.fillStyle});},measureText:s=>({width:String(s).length*7}),createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:(()=>{})});
 class Element{
  constructor(tag='div'){this.tagName=tag;this.children=[];this.events={};this.style={setProperty(){}};this.classList={add(){},remove(){}};this.dataset={};this.hidden=false;this.width=960;this.height=640;this.textContent='';}
  addEventListener(name,fn){(this.events[name]??=[]).push(fn);}
  click(){if(!this.disabled)for(const fn of this.events.click||[])fn({});}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=children;}
  setAttribute(){} removeAttribute(){} focus(){} getContext(){return context;}
  getBoundingClientRect(){return {width:960,height:640};}
  showModal(){this.open=true;} close(){this.open=false;}
  querySelectorAll(selector){return this.children.filter(c=>c.tagName==='button'&&(!selector.includes(':disabled')||!c.disabled));}
  querySelector(selector){return this.querySelectorAll(selector)[0];}
 }
 const elements=new Map(),get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 const events={},storage=new Map();let tick;
 const document={getElementById:get,createElement:tag=>new Element(tag),body:new Element(),hidden:false,querySelector:()=>new Element(),querySelectorAll:()=>[],addEventListener:(n,fn)=>(events[n]??=[]).push(fn)};
 const sandbox={document,console,devicePixelRatio:1,innerWidth:960,performance:{now:()=>0},setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:fn=>{tick=fn;},addEventListener(){},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)}};
 sandbox.window=sandbox;const c=vm.createContext(sandbox),root=path.resolve(__dirname,'..');
 for(const f of ['story.js','scenery.js','world.js','adventure.js','danger.js','social.js','residents.js','photos.js','character-data.js','character-sprites.js','pixel-art.js','render.js','endings.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
 c.GameArt={ready:{then(){}},images:{sprites:{width:512,height:509}},urls:{},status:{failed:[]}};
 const story=c.GameStory.initial(),world=c.GameWorld.fresh();story.scene='quarto';configure?.(story,world,c);
 const saveKey='dont-believe.topdown.v2';storage.set(saveKey,JSON.stringify({version:2,story,world}));
 vm.runInContext(fs.readFileSync(path.join(root,'game.js'),'utf8'),c,{filename:'game.js'});
 get('resume').click();
 return {get,c,storage,saveKey,draws,tick:(time=32)=>tick(time),key:(code,key='')=>{for(const fn of events.keydown||[])fn({code,key,preventDefault(){}});},snapshot:()=>{get('menu-btn').click();return JSON.parse(storage.get(saveKey));}};
}
test('E faz carinho em Mel, mostra diálogo e não altera a história; é repetível',()=>{
 const h=boot((s,w,c)=>{w.player={...c.GameWorld.positions.mel,y:c.GameWorld.positions.mel.y+24,dir:'up',step:0};});
 const before=JSON.parse(h.storage.get(h.saveKey)).story;
 for(let i=0;i<2;i++){
  h.tick();assert.equal(h.get('near-label').textContent,'Fazer carinho em Mel');
  h.key('KeyE','e');assert.equal(h.get('dialogue').hidden,false);assert.equal(h.get('dialogue-title').textContent,'Mel');
  assert.equal(h.get('dialogue-text').children[0].textContent,'Você faz carinho em Mel. Ela não responde, mas gosta de você.');
  h.key('KeyE','e');assert.equal(h.get('dialogue').hidden,true);
 }
 const after=h.snapshot().story;
 for(const field of ['scene','inventory','flags','history','adults','mira','eron','noah','suspicion'])assert.deepEqual(after[field],before[field],field);
});
test('E abre e fecha a porta e o estado é salvo',()=>{
 const h=boot((s,w,c)=>{const d=c.GameWorld.doors[0];w.player={x:d.x+d.w/2,y:d.y-24,dir:'down',step:0};});
 h.tick();assert.match(h.get('near-label').textContent,/Abrir: Porta do dormitório/);
 h.key('KeyE','e');assert.equal(JSON.parse(h.storage.get(h.saveKey)).world.doors.dorm,true);
 h.tick();assert.match(h.get('near-label').textContent,/Fechar: Porta do dormitório/);
 h.key('KeyE','e');assert.equal(JSON.parse(h.storage.get(h.saveKey)).world.doors.dorm,false);
});
test('carinho também funciona pelo botão de interação de toque',()=>{
 const h=boot((s,w,c)=>{w.player={...c.GameWorld.positions.mel,y:c.GameWorld.positions.mel.y+24,dir:'up',step:0};});
 h.get('interact-touch').click();assert.equal(h.get('dialogue-title').textContent,'Mel');
});
test('aviso e tecla E permitem abrir a porta a 80 pixels',()=>{
 const h=boot((s,w,c)=>{const d=c.GameWorld.doors.find(d=>d.id==='study');w.player={x:d.x+d.w/2,y:d.y+d.h/2+80,dir:'up',step:0};});
 h.tick();assert.match(h.get('near-label').textContent,/Abrir: Porta da leitura/);
 h.key('KeyE','e');assert.equal(JSON.parse(h.storage.get(h.saveKey)).world.doors.study,true);
});
test('carinho acompanha Mel fora do dormitório e o mapa marca sua posição atual',()=>{
 const h=boot((s,w)=>{Object.assign(w.mel,{x:492,y:444});w.player={x:492,y:468,dir:'up',step:0};});
 h.tick();assert.equal(h.get('near-label').textContent,'Fazer carinho em Mel');
 h.key('KeyE','e');assert.equal(h.get('dialogue-title').textContent,'Mel');
 h.key('KeyE','e');const saved=h.snapshot();assert.equal(saved.world.mel.x,492);assert.equal(saved.world.mel.y,444);
 h.get('close-modal').click();h.draws.length=0;h.get('map-btn').click();
 assert(h.get('modal-content').children.some(e=>e.tagName==='canvas'));
 assert(h.draws.some(d=>d.color==='#f1eee5'&&d.x===486&&d.y===438&&d.w===12&&d.h===12));
});
test('a posição da gata é salva mesmo quando o jogador não se move',()=>{
 const h=boot((s,w)=>{w.player={x:1000,y:444,dir:'up',step:0};w.mel.wait=0;});
 const start=JSON.parse(h.storage.get(h.saveKey)).world.mel;
 for(let i=0;i<180;i++)h.tick(i*35);
 const saved=JSON.parse(h.storage.get(h.saveKey));assert(Math.hypot(saved.world.mel.x-start.x,saved.world.mel.y-start.y)>20);
 assert.equal(saved.world.player.x,1000);assert.equal(saved.world.player.y,444);
});
test('Mel permanece parada enquanto um diálogo está aberto',()=>{
 const h=boot(),before=JSON.parse(h.storage.get(h.saveKey)).world.mel;
 h.key('KeyE','e');assert.equal(h.get('dialogue').hidden,false);
 for(let i=0;i<180;i++)h.tick(i*35);
 const after=h.snapshot().world.mel;
 assert.equal(after.x,before.x);assert.equal(after.y,before.y);assert.equal(after.step,0);
});
function advancePages(h){for(let i=0;i<12;i++){const buttons=h.get('choices').children;if(buttons.length!==1||buttons[0].children[1]?.textContent!=='Continuar')return;h.key('KeyE','e');}}
function chooseText(h,text){advancePages(h);const b=h.get('choices').children.find(b=>b.children[1]?.textContent.includes(text));assert(b,'Opção ausente: '+text);b.click();}
test('aceitar, recolher e entregar um pedido atualiza inventário, relação e salvamento',()=>{
 const h=boot((s,w)=>{s.scene='altar';w.player={x:288,y:852,dir:'up',step:0};});
 h.key('KeyE','e');chooseText(h,'Aceitar pedido: Entre as páginas');h.key('KeyE','e');
 let save=h.snapshot();assert.equal(save.story.errands['mira-book'],'active');h.get('close-modal').click();
 const pickup=boot((s,w,c)=>{Object.assign(s,save.story);Object.assign(w,save.world);w.player={...c.GameSocial.items['Livro de capa verde'],dir:'down',step:0};});
 pickup.key('KeyE','e');save=pickup.snapshot();assert(save.story.inventory.includes('Livro de capa verde'));
 const deliver=boot((s,w,c)=>{Object.assign(s,save.story);Object.assign(w,save.world);w.player={...c.GameSocial.actorPoint('mira',s,w),dir:'up',step:0};});
 deliver.key('KeyE','e');chooseText(deliver,'Entregar os itens');save=deliver.snapshot();assert.equal(save.story.errands['mira-book'],'done');assert.equal(save.story.mira,2);assert(!save.story.inventory.includes('Livro de capa verde'));
 assert.equal(deliver.get('relationships').children[0].children[0].children[1].textContent,'2 / 9');
});
test('inventário vazio e painel de tarefas oferecem orientação sem bloquear a exploração',()=>{
 const h=boot();h.get('inventory').click();assert.equal(h.get('modal').open,true);assert(h.get('modal-content').children.some(c=>c.tagName==='div'));
 h.get('close-modal').click();h.get('tasks').click();assert.equal(h.get('modal-content').children.filter(c=>c.tagName==='section').length,4);
});
function descendants(node){return [node,...node.children.flatMap(descendants)];}
for(const id of ['family','friends'])test('fotografia '+id+': interação, pausa, salvamento e releitura',()=>{
 const h=boot((s,w,c)=>{const p=c.GamePhotos.photos[id];w.player={x:p.x,y:p.y+15,dir:'up',step:0};});
 h.tick();assert.match(h.get('near-label').textContent,/Fotografia/);
 const before=JSON.parse(h.storage.get(h.saveKey));h.key('KeyE','e');
 assert.equal(h.get('modal').open,true);assert.equal(h.get('modal').className,'photo-memory');
 const all=descendants(h.get('modal-content')),img=all.find(n=>n.tagName==='img'),words=all.find(n=>n.id==='memory-words');
 assert.equal(img.src,h.c.GamePhotos.photos[id].src);assert.match(words.textContent,id==='family'?/São meus pais… Daty e Inauri/:/Então esse era o Tomas/);
 const opened=JSON.parse(h.storage.get(h.saveKey));
 for(let i=0;i<90;i++)h.tick(64+i*35);
 h.key('KeyE','e');assert.equal(h.get('modal').open,false);
 const saved=h.snapshot();h.get('close-modal').click();assert.equal(saved.story.scene,before.story.scene);assert.deepEqual(saved.story.danger,opened.story.danger);assert.deepEqual(saved.world.player,opened.world.player);assert.deepEqual(saved.world.mel,opened.world.mel);
 const name=h.c.GamePhotos.photos[id].name;assert.equal(saved.story.inventory.filter(n=>n===name).length,1);
 h.key('KeyI','i');const view=descendants(h.get('modal-content')).find(n=>n.textContent==='VER FOTOGRAFIA');assert(view);view.click();assert.equal(h.get('modal').className,'photo-memory');
 h.key('Escape');assert.equal(h.get('modal').open,true);assert.equal(h.get('modal-content').children[0].textContent,'Inventário');
 assert.equal(JSON.parse(h.storage.get(h.saveKey)).story.inventory.filter(n=>n===name).length,1);
 const restored=boot((s,w)=>{Object.assign(s,saved.story);Object.assign(w,saved.world);});restored.key('KeyI','i');assert(descendants(restored.get('modal-content')).some(n=>n.textContent==='VER FOTOGRAFIA'));
});
test('foto funciona por toque e oferece recuperação de imagem sem perder a lembrança',()=>{
 const h=boot((s,w,c)=>{const p=c.GamePhotos.photos.family;w.player={x:p.x,y:p.y,dir:'down',step:0};});h.get('interact-touch').click();
 const all=descendants(h.get('modal-content')),img=all.find(n=>n.tagName==='img'),retry=all.find(n=>n.textContent==='TENTAR NOVAMENTE');
 img.events.error[0]();assert.equal(img.hidden,true);assert.equal(retry.hidden,false);retry.click();assert.equal(img.hidden,false);img.events.load[0]();assert.equal(retry.hidden,true);
 all.find(n=>n.textContent==='GUARDAR E CONTINUAR').click();assert.equal(h.get('modal').open,false);
 assert(JSON.parse(h.storage.get(h.saveKey)).story.inventory.includes(h.c.GamePhotos.photos.family.name));
});
