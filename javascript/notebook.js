/* Caderno de Kali: texto real sobre uma ilustração, sem alterar o estado ao consultar. */
(function(root){
'use strict';
const tabs=[['investigation','Investigação','J'],['objects','Objetos','I'],['requests','Pedidos','T']];
function open(ctx,tab='investigation',focusTab=false){
 const {document:doc,state:s,world:w,G,A,S,D,F,V,modal,button,track,trackErrand,openPhoto}=ctx;
 if(!tabs.some(([id])=>id===tab))tab='investigation';
 const el=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=V.present(text);if(cls)n.className=cls;return n;};
 modal('Diário de Kali');const shell=doc.getElementById('modal');shell.className='notebook';shell.dataset.tab=tab;
 shell.setAttribute('aria-labelledby','notebook-title');shell.setAttribute('aria-describedby','notebook-intro');
 const spread=el('div',undefined,'notebook-spread'),left=el('aside',undefined,'notebook-index'),page=el('section',undefined,'notebook-page');
 const title=el('h2','Diário de Kali');title.id='notebook-title';
 const intro=el('p','OldHood. O que eu vi, o que ouvi e o que ainda preciso entender.','notebook-intro');intro.id='notebook-intro';
 left.append(el('small','O Obelisco','notebook-chapter'),title,intro);
 const nav=el('div',undefined,'notebook-tabs');nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Seções do caderno');
 let selected;
 for(const [id,label,key]of tabs){
  const b=button(label,()=>open(ctx,id,true),'notebook-tab');b.id='notebook-tab-'+id;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(id===tab));b.setAttribute('aria-controls','notebook-panel');b.setAttribute('tabindex',id===tab?'0':'-1');b.append(el('kbd',key));
  b.addEventListener('keydown',e=>{const i=tabs.findIndex(([value])=>value===id);let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();open(ctx,tabs[next][0],true);}});
  nav.append(b);if(id===tab)selected=b;
 }
 left.append(nav,button('Abrir mapa',ctx.showMap,'notebook-map'));
 if(w.tracked)left.append(button('Apagar a marcação',ctx.clearTracking,'notebook-map'));
 left.append(el('p','Estas páginas ficam comigo. Uma lembrança não é uma prova.','notebook-margin'));
 const heading=el('h3',tabs.find(([id])=>id===tab)[1]);heading.id='notebook-section-title';
 const content=el('div',undefined,'notebook-writing');content.id='notebook-panel';content.setAttribute('role','tabpanel');content.setAttribute('aria-labelledby','notebook-tab-'+tab);content.setAttribute('tabindex','0');
 const entry=(title,text)=>{const n=el('article',undefined,'notebook-entry');n.append(el('h4',title),el('p',text));content.append(n);return n;};
 const mark=(node,label,fn)=>node.append(button(label,fn,'notebook-action'));
 if(tab==='investigation'){
  const stage=ctx.mainGoal;const next=entry('Meu próximo passo',stage?.objective||'Este caminho chegou ao fim. Posso reler as marcas da minha escolha.');
  if(stage&&!G.scenes[s.scene].ending)mark(next,'Marcar este lugar',()=>track('mission'));
  if(s.danger?.turns!==null&&s.danger?.turns!==undefined&&!G.scenes[s.scene].ending){
   entry('Antes do último sino',s.flags.tomasTransferred?'Tomas foi transferido. Ainda posso ajudar quem ficou.':s.flags.tomasRescued?'Tomas saiu da cela. Agora preciso preparar a saída.':'Restam '+s.danger.turns+' ações antes da transferência de Tomas. Caminhar e consultar estas páginas não gastam ações.');
   entry('O preço de agir','Escolhas e preparações custam uma ação; revistas custam duas. Destruir a ordem dá mais três. Confirmar o confronto encerra minha preparação.');
  }
  const notes=V.notes(s);content.append(el('h4','O que observei','notebook-divider'));
  if(!notes.facts.length)entry('Ainda estou procurando','Tomas não respondeu à chamada. Posso ouvir os moradores e observar o que ficou no dormitório.');
  for(const [name,text]of notes.facts)entry(name,text);
  if(notes.doubts.length){content.append(el('h4','O que preciso conferir','notebook-divider'));for(const [name,text]of notes.doubts)entry(name,text);}
  if(A.act(s)>=3&&!G.scenes[s.scene].ending){
   content.append(el('h4','Pessoas e portas','notebook-divider'));
   for(const p of A.plan(s)){const n=entry(p.done?'Cumpri este compromisso':'Ainda preciso agir',p.text);if(!p.done&&A.available(p.action,s))mark(n,'Marcar onde agir',()=>track(p.action));}
   entry('Sair com os moradores',A.groupReady(s)?'Mira está livre. Eron aceitou sua tarefa e combinamos o caminho. Ainda preciso atravessar.':A.groupReason(s));
   entry('A porta de Noah',A.noahReady(s)?'Vi o trinco aberto. Mira está livre e Eron aceitou ajudar.':'Preciso ver Noah abrir o trinco, libertar Mira e combinar a ajuda de Eron.');
   entry('Uma saída por conta própria','Para sair sozinho, preciso conhecer o trajeto. Para usar o disfarce, os adultos precisam autorizar a passagem e a braçadeira não pode ter sido confiscada.');
  }
  if(A.act(s)>=1&&!s.flags.committed&&!G.scenes[s.scene].ending){const actions=A.points(s,w);if(actions.length)content.append(el('h4','Onde posso investigar','notebook-divider'));for(const p of actions){const n=entry(p.name,'Posso procurar esse encontro se quiser me preparar.');mark(n,'Marcar encontro',()=>track(p.action));}}
  if(s.history.length){content.append(el('h4','O que fiz até aqui','notebook-divider'));for(const h of s.history.slice().reverse())entry(h.title,h.choice);}
 }else if(tab==='objects'){
  if(!s.inventory.length){const n=entry('Meus bolsos estão vazios','Posso conversar com os moradores. Os objetos e documentos que encontrar ficam guardados aqui.');mark(n,'Ver meus pedidos',()=>open(ctx,'requests'));}
  const uses={'Arame':['Posso levantar a lingueta da grade. O arame ficará preso depois do uso.','gate'],'Pão':['Posso entregar a Mira ou sacrificar a porção durante uma revista.','mira'],'Chave da ala leste':['Abre a grade da ala leste, sem barulho.','gate'],'Trajeto de Eron':['Conheço as curvas, mas ainda preciso combinar quem fará cada tarefa.','eron']};
  for(const name of s.inventory){
   const photo=F.byName(name),info=photo?{text:photo.description}:S.itemInfo(name),n=entry(name,uses[name]?.[0]||info.text);
   if(photo)mark(n,'VER FOTOGRAFIA',()=>openPhoto(photo.id,true));
   const q=S.quests.find(q=>q.items.some(([item])=>item===name)&&s.errands[q.id]==='active');
   if(q)mark(n,'Marcar a entrega',()=>trackErrand(q.id));
   else if(uses[name]&&A.available(uses[name][1],s))mark(n,'Marcar o local de uso',()=>track(uses[name][1]));
  }
 }else{
  if(A.act(s)>=3)entry('Antes de recolher','Recolher um item ou entregar um pedido custa uma ação do prazo. Ler e marcar lugares não custa.');
  for(const [who,name]of Object.entries(S.names)){
   const group=el('section',undefined,'notebook-requests');group.append(el('h4',name));content.append(group);
   const current=S.current(who,s);
   for(const q of S.quests.filter(q=>q.who===who&&(s.errands[q.id]||current?.id===q.id))){
    const status=s.errands[q.id],active=status==='active',done=status==='done',available=current?.id===q.id&&S.ownerAvailable(who,s);
    const card=el('article',undefined,'notebook-entry');card.append(el('small',done?'Entreguei':active?S.ready(q,s)?'Posso entregar':'Estou procurando':available?'Posso perguntar':'Não posso conversar agora'),el('h5',active||done?q.title:'Conversar com '+name));
    if(done)card.append(el('p','Cumpri o pedido. '+q.thanks));
    else if(active){for(const [item]of q.items){const held=s.inventory.includes(item),lock=S.itemLock(S.items[item],s,w);card.append(el('p',(held?'Já guardei: ':'Preciso encontrar: ')+item+(!held&&lock?' — '+lock:'')));}}
    else card.append(el('p','Ainda não combinei este pedido. Preciso conversar pessoalmente antes de anotar o que procurar.'));
    if(!done&&available)mark(card,active?'Marcar meu próximo passo':'Encontrar '+name,()=>trackErrand(q.id));
    else if(!done&&!S.ownerAvailable(who,s))card.append(el('p','Não consigo tratar deste pedido agora.'));
    group.append(card);
   }
  }
 }
 page.append(heading,content);spread.append(left,page);doc.getElementById('modal-content').replaceChildren(spread);
 const image=el('img');image.alt='';image.className='notebook-art-probe';
 shell.notebookArtProbe=image;
 image.addEventListener('error',()=>{if(shell.notebookArtProbe===image)shell.dataset.art='missing';});
 image.addEventListener('load',()=>{if(shell.notebookArtProbe===image&&image.naturalWidth)shell.dataset.art='ready';});
 left.append(image);image.src='assets/diario/caderno-kali.png';
 if(focusTab)selected.focus({preventScroll:true});else content.focus({preventScroll:true});
}
root.GameNotebook={open,tabs};if(typeof module!=='undefined')module.exports=root.GameNotebook;
})(typeof window==='undefined'?globalThis:window);
