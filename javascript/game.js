'use strict';
(()=>{
const G=window.GameStory,M=window.GameWorld,A=window.GameAdventure,D=window.GameDanger,S=window.GameSocial,R=window.GameResidents,F=window.GamePhotos,V=window.GameInvestigation,$=id=>document.getElementById(id),canvas=$('canvas');
const SAVE='dont-believe.topdown.v2',ENDS='dont-believe.endings.v1',PREFS='dont-believe.topdown.preferences';
const renderer=createGameRenderer(canvas,M,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;},window.GameArt?.images||{});
let state=G.initial(),world=M.fresh(),guards=M.guards(),playing=false,dialogue=null,keys=new Set(),dpr=1,last=0,saving=0,storageOK=true,walkSinceSave=false,touchSneak=false,soundOn=false,audio=null,gain=null;
let endView=null,endPreview=false,endReturn=null,memoryView=null,dialogueChoices=null,fontRevision=0;
let endings=read(ENDS,[]);if(!Array.isArray(endings))endings=[];endings=endings.filter(id=>G.scenes[id]?.ending);
let prefs=read(PREFS,{cones:true,reduced:false});if(!prefs||typeof prefs!=='object')prefs={cones:true,reduced:false};
let saved=read(SAVE,null);if(!validSave(saved))saved=null;
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{storageOK=false;return false;}}
function validSave(s){return !!(s&&s.version===2&&s.story&&Object.hasOwn(G.scenes,s.story.scene)&&['adults','mira','eron','noah','suspicion'].every(k=>Number.isFinite(s.story[k])&&s.story[k]>=0&&s.story[k]<=9)&&s.story.flags&&typeof s.story.flags==='object'&&Array.isArray(s.story.history)&&s.story.history.every(h=>h&&typeof h.title==='string'&&typeof h.choice==='string')&&Array.isArray(s.story.inventory)&&s.story.inventory.every(v=>typeof v==='string')&&(!s.story.pending||typeof s.story.pending.text==='string')&&s.world?.player&&Number.isFinite(s.world.player.x)&&Number.isFinite(s.world.player.y));}
function save(){saved={version:2,story:state,world};write(SAVE,saved);$('save-status').textContent=storageOK?'✓ PROGRESSO SALVO':'SALVAMENTO INDISPONÍVEL';walkSinceSave=false;}
function element(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=V.present(text);if(cls)e.className=cls;return e;}
function button(text,fn,cls='primary'){const b=element('button',text,cls);b.addEventListener('click',fn);return b;}
function notice(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('notice').hidden=true,4100);}
function clearMovement(){keys.clear();world.player.step=0;}
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(320,Math.round(r.width*dpr));canvas.height=Math.max(300,Math.round(r.height*dpr));}
function objective(){D.normalize(state);S.normalize(state);updateRelationships();$('task-count').textContent=S.quests.filter(q=>state.errands[q.id]==='active').length;$('danger-status').textContent=D.status(state);$('danger-status').hidden=!playing||!!G.scenes[state.scene].ending;const goal=M.target(state,world);$('objective').textContent=goal?.objective||'Suas escolhas chegaram ao fim deste caminho.';$('item-count').textContent=state.inventory.length;$('ending-count').textContent=endings.length+' / 6';$('resume').hidden=!saved;$('chapter-label').textContent=A.chapters[A.act(state)];const clues=A.evidence.filter(([f])=>state.flags[f]).length;$('quest-progress').textContent=world.tracked?'PISTA MARCADA · J para voltar à missão':state.scene==='preparar'?A.plan(state).filter(p=>p.done).length+' / 4 preparações · J para ver as rotas':clues+' pistas conectadas · J diário';const marks=[];if(state.flags.cellOpen)marks.push('Grade aberta');if(state.flags.rescued)marks.push('Mira livre');if(state.flags.tomasRescued)marks.push('Tomas livre');if(state.flags.distracted)marks.push('Ronda desviada');if(state.flags.latchOpen)marks.push('Trinco aberto');$('world-state').textContent=marks.join(' · ');$('world-state').hidden=!marks.length;}
function atHome(){$('danger-status').hidden=true;hideEnding();playing=false;clearMovement();closeDialogue();$('home-screen').hidden=false;$('mission').hidden=true;$('world-state').hidden=true;$('interact-prompt').hidden=true;document.body.classList.add('at-home');$('resume').hidden=!saved;$('ending-count').textContent=endings.length+' / 6';$('location').textContent='O Orfanato';}
function start(){state=G.initial();world=M.fresh();guards=M.guards();save();enter();openStory();}
function newGame(){if(saved){modal('Uma nova história');para('Uma nova partida substitui o progresso 2D atual. Os finais descobertos serão mantidos.');$('modal-content').append(button('CONTINUAR PARTIDA',()=>{closeModal();resume();}),button('INICIAR NOVA PARTIDA',()=>{closeModal();start();}),button('CANCELAR',closeModal,'secondary'));}else start();}
function enter(){hideEnding();playing=true;$('home-screen').hidden=true;$('mission').hidden=false;document.body.classList.remove('at-home');objective();resize();canvas.focus({preventScroll:true});if(G.scenes[state.scene].ending)openStory();}
function resume(){if(!saved)return;state=A.normalize(JSON.parse(JSON.stringify(saved.story)));world=Object.assign(M.fresh(),JSON.parse(JSON.stringify(saved.world)));world.observed=world.observed&&typeof world.observed==='object'&&!Array.isArray(world.observed)?world.observed:{};world.explored=Array.isArray(world.explored)?world.explored:[];world.alert=Math.max(0,Math.min(99,world.alert||0));M.normalizeWorld(world,state);world.player.dir=['up','down','left','right'].includes(world.player.dir)?world.player.dir:'down';world.player.step=Number.isFinite(world.player.step)?world.player.step:0;guards=M.guards();enter();if(state.pending||state.danger.encounter)openStory();}
function pages(texts){const pages=[];let current=[],length=0;for(const paragraph of texts.flatMap(t=>t.split('\n'))){if(length+paragraph.length>360&&current.length){pages.push(current);current=[];length=0;}current.push(paragraph);length+=paragraph.length;}if(current.length)pages.push(current);return pages.length?pages:[['…']];}
function speaker(){const custom=G.scenes[state.scene].speaker;if(custom)return [custom==='guard'?'VIGIA DA ACTRAS':custom==='leader'?'LÍDER DA ACTRAS':custom.toUpperCase(),custom];const id=state.scene;if(['noah','segredo','oferta','limiar','emboscada','questionar','verdade'].includes(id))return ['NOAH','noah'];if(['mira','resgate'].includes(id))return ['MIRA','mira'];if(['desaparecimento','eron'].includes(id))return ['ERON','eron'];if(['quarto','recusa','interrogatorio','confinamento'].includes(id))return ['VIGIA DA ACTRAS','guard'];if(id==='confronto')return ['LÍDER DA ACTRAS','leader'];return ['KALI','kali'];}
function openStory(){if(state.danger?.encounter){openEncounter();return;}const scene=G.scenes[state.scene];clearMovement();if(scene.ending&&!state.pending){if(!endings.includes(state.scene)){endings.push(state.scene);write(ENDS,endings);objective();}showEnding(state.scene);return;}if(state.pending)dialogue={type:'consequence',title:'O eco da sua escolha',pages:pages([state.pending.text]),page:0,note:state.pending.note,changes:state.pending.changes,speaker:['KALI','kali']};else dialogue={type:scene.ending?'ending':'story',title:scene.title,pages:pages(G.value(scene.text,state)),page:0,speaker:speaker()};if(scene.ending&&!state.pending&&!endings.includes(state.scene)){endings.push(state.scene);write(ENDS,endings);objective();}showDialogue();}
function hideEnding(){endView=null;endPreview=false;endReturn=null;$('ending-screen').hidden=true;document.body.classList.remove('at-ending');resize();}
function showEnding(id,preview=false){$('danger-status').hidden=true;const scene=G.scenes[id],theme=window.EndingScreens.themes[id];if(!scene?.ending||!theme)return;if(preview&&!endings.includes(id))return;const back=preview?{id:endView,home:!$('home-screen').hidden}:null;closeDialogue();if($('modal').open)closeModal();clearMovement();endView=id;endPreview=preview;endReturn=back;$('home-screen').hidden=true;$('mission').hidden=true;$('interact-prompt').hidden=true;$('notice').hidden=true;$('world-state').hidden=true;document.body.classList.remove('at-home');document.body.classList.add('at-ending');$('ending-screen').hidden=false;$('ending-screen').style.setProperty('--ending-accent',theme.accent);$('ending-number').textContent='FINAL '+theme.number+' / 06';$('ending-label').textContent=theme.label;$('ending-title').textContent=scene.title;$('ending-quote').textContent='“'+scene.quote+'”';$('ending-story').replaceChildren(...G.value(scene.text,state).flatMap(t=>t.split('\n')).map(t=>element('p',t)));const outcome=preview?read('dont-believe.outcomes.v3',{})[id]:state;$('ending-consequences').replaceChildren(element('small','AS MARCAS DESTA PARTIDA'));if(outcome)A.consequences(outcome).forEach(t=>$('ending-consequences').append(element('p',t)));else $('ending-consequences').append(element('p','Este final foi descoberto numa versão anterior. Uma nova partida registra as consequências detalhadas.'));if(!preview){const records=read('dont-believe.outcomes.v3',{});records[id]=JSON.parse(JSON.stringify(state));write('dont-believe.outcomes.v3',records);}$('ending-discovered').textContent=(preview?'REVISITANDO ESTE FINAL':'CAMINHO CONCLUÍDO')+' · '+endings.length+' DE 6 FINAIS DESCOBERTOS';$('ending-menu').textContent=preview?'VOLTAR À COLEÇÃO':'VOLTAR AO MENU';$('ending-art').setAttribute('aria-label',theme.alt);window.EndingScreens.draw($('ending-art'),id);$('ending-screen').scrollTop=0;$('ending-title').focus({preventScroll:true});resize();}
function leaveEnding(){if(!endPreview){save();atHome();return;}const back=endReturn;hideEnding();if(back?.id)showEnding(back.id);else if(back?.home)atHome();else{$('mission').hidden=!playing;}showEndings();}
function say(title,text,actions=null,who=['KALI','kali']){clearMovement();dialogue={type:'lore',title,pages:pages([text]),page:0,speaker:who,actions};showDialogue();}
function dialogueOptions(d){
 if(d.type==='consequence')return [{label:'Voltar à exploração',fn:()=>{state.pending=null;closeDialogue();objective();save();if(G.scenes[state.scene].ending)openStory();}}];
 if(d.type==='story')return G.choices(state).map((c,i)=>({label:c.label,lock:c.requires?.(state),hint:choiceHint(c),fn:()=>select(i)}));
 if(d.type==='ending')return [{label:'Ver os finais descobertos',fn:showEndings},{label:'Voltar ao menu',fn:()=>{closeDialogue();save();atHome();}}];
 return d.actions||[{label:'Voltar à exploração',fn:closeDialogue}];
}
function choiceButton(c,index,label=c.label){
 const b=button('',c.fn,'choice');b.dataset.choiceNumber=String(index+1);b.setAttribute('aria-keyshortcuts',String(index+1));
 b.append(element('span',String(index+1).padStart(2,'0')));const text=element('div',label);
 if(label===c.label){if(c.lock)text.append(element('small',c.lock));else if(c.hint)text.append(element('small',c.hint,'choice-hint'));}
 b.append(text,element('span',c.lock?'—':'↗'));b.disabled=!!c.lock;return b;
}
function moveChoicePage(delta){if(!dialogue)return;dialogue.choicePage=Math.max(0,Math.min((dialogue.choiceGroups?.length||1)-1,(dialogue.choicePage||0)+delta));dialogue.detailPage=0;showDialogue();}
function showDialogue(){
 const d=dialogue;if(!d)return;
 d.sourceTexts??=d.pages.flat();document.body.classList.add('in-dialogue');$('dialogue').hidden=false;resize();
 const shell=$('dialogue');shell.dataset.phase=d.readComplete?'choices':'text';
 $('interact-prompt').hidden=true;$('dialogue-title').textContent=d.title;$('speaker').textContent=window.DialogueUI.names[window.DialogueUI.speakerKey(d.speaker[1])]||d.speaker[0];shell.dataset.speaker=window.DialogueUI.speakerKey(d.speaker[1]);
 $('dismiss-dialogue').hidden=d.type==='ending'||d.type==='danger';$('dialogue-extra').hidden=!(d.type==='story'&&['mira','eron','noah'].includes(d.speaker[1]));
 $('consequence-list').replaceChildren();$('choices').replaceChildren();$('choice-pager').hidden=true;
 $('dialogue-note').textContent=d.readComplete?'↑ ↓ escolher · Enter confirmar':'E / Enter para continuar';
 $('dialogue-back').hidden=!d.page&&!d.readComplete;
 const scroll=document.querySelector('.dialogue-scroll'),head=document.querySelector('.dialogue-head'),text=$('dialogue-text');
 const renderText=parts=>text.replaceChildren(...parts.map(t=>element('p',t,t.startsWith('—')?'speech':'')));
 const measured=!!scroll?.clientHeight;
 const capacity=Math.max(24,(scroll?.clientHeight||240)-(head?.offsetHeight||20)-12);
 const fit=(parts,height)=>{renderText(parts);return measured?text.scrollHeight<=height:parts.join(' ').length<=300;};
 const signature=[canvas.width,canvas.height,fontRevision,JSON.stringify(d.changes||[])].join(':');
 if(!d.readComplete&&d.layoutSignature!==signature){
  const notes=[...d.sourceTexts,...(d.note?[d.note]:[]),...(d.changes||[])].map(V.present);
  d.pages=window.DialogueUI.paginate(notes,p=>fit(p,capacity-54));
  if(d.layoutSignature)d.page=0;d.layoutSignature=signature;
 }
 paintPortrait(d.speaker[1]);
 if(!d.readComplete){
  renderText(d.pages[d.page]||d.pages[0]);
  const next=d.type==='lore'&&!d.actions&&d.pages.length===1?dialogueOptions(d)[0]:{label:'Continuar',fn:()=>{if(d.page<d.pages.length-1)d.page++;else{d.readComplete=true;d.choicePage=0;}showDialogue();}};
  $('choices').append(choiceButton(next,0));
  $('page-count').textContent=String(d.page+1).padStart(2,'0')+' / '+String(d.pages.length).padStart(2,'0');
 }else{
  renderText([]);const options=dialogueOptions(d),budget=capacity-48;
  const samples=options.map((c,i)=>choiceButton(c,i));$('choices').append(...samples);
  const groups=[];let group=[],height=0;
  samples.forEach((b,i)=>{const h=measured?b.offsetHeight+2:44;if(group.length&&measured&&height+h>budget){groups.push(group);group=[];height=0;}group.push(i);height+=h;});if(group.length)groups.push(group);
  d.choiceGroups=groups;d.choicePage=Math.min(d.choicePage||0,groups.length-1);
  const visible=groups[d.choicePage]||[];$('choices').replaceChildren(...visible.map(i=>samples[i]));
  // Opções excepcionalmente longas também são lidas em páginas antes de confirmar.
  if(measured&&visible.length===1&&samples[visible[0]].offsetHeight>budget){
   const index=visible[0],c=options[index];$('choices').replaceChildren();
   const details=window.DialogueUI.paginate([c.label,c.lock||c.hint||''],p=>fit(p,capacity-102));
   d.detailPage=Math.min(d.detailPage||0,details.length-1);renderText(details[d.detailPage]);
   if(d.detailPage<details.length-1)$('choices').append(choiceButton({label:'Continuar',fn:()=>{d.detailPage++;showDialogue();}},0));
   else $('choices').append(choiceButton(c,index,c.lock?'Escolha indisponível':'Confirmar esta escolha'));
  }
  $('page-count').textContent='Opções '+(d.choicePage+1)+' / '+groups.length;
  $('choice-pager').hidden=groups.length<=1;$('choices-previous').disabled=d.choicePage===0;$('choices-next').disabled=d.choicePage===groups.length-1;
 }
 shell.scrollTop=0;if(scroll)scroll.scrollTop=0;dialogueChoices=window.DialogueUI.bindChoices($('choices'));
}

function paintPortrait(kind){
 const c=$('portrait'),pc=c.getContext('2d'),atlas=window.GameArt?.images.portraits;pc.clearRect(0,0,c.width,c.height);c.setAttribute('aria-label','Retrato de '+(dialogue?.speaker[0]||'Kali'));
 if(window.DialogueUI.portrait(pc,c.width,c.height,kind,window.GameArt?.images)){c.dataset.illustrated='true';return;}c.dataset.illustrated='false';
 if(window.CharacterSprites?.portrait(pc,c.width,c.height,kind,window.GameArt?.images))return;
 if(atlas){const index=window.GameArt.portraits[kind]??0,cw=atlas.width/3,ch=atlas.height/2;pc.imageSmoothingEnabled=false;pc.drawImage(atlas,(index%3)*cw,Math.floor(index/3)*ch,cw,ch,0,0,c.width,c.height);}
 else{pc.save();pc.scale(c.width/36,c.height/42);renderer.sprite(pc,18,38,kind,'down',0);pc.restore();}
}
function closeDialogue(){if(dialogue?.type==='danger'&&state.danger?.encounter)return;dialogue=null;dialogueChoices=null;$('dialogue').hidden=true;document.body.classList.remove('in-dialogue');clearMovement();resize();if(playing)canvas.focus({preventScroll:true});}
function choiceHint(c){const prefix=D.storyCost(state,G.choices(state).indexOf(c))?'Custo: 1 ação do prazo. ':'';const e=G.value(c.effect,state)||{};if((state.scene==='fechadura'||dialogue?.sideId==='gate')&&(e.suspicion||0)+state.suspicion>=7&&e.flags?.cellOpen&&(e.suspicion||0)>0)return 'VIGILÂNCIA CRÍTICA: este método termina em captura. Volte para buscar ajuda ou a chave.';return prefix+(c.hint||c.note||'');}
function select(index){const previous=state.scene;state=G.take(state,index);world.tracked=null;if(state.flags.tunnel)world.tunnelOpen=true;if(previous==='subsolo'&&state.scene==='arquivo'){Object.assign(world.player,M.authoredPoint(54,41.8));world.player.dir='up';}world.alert=0;closeDialogue();objective();save();if(state.pending||G.scenes[state.scene].ending)openStory();else notice('Anotei meu próximo passo no caderno.');}

function openEncounter(){clearMovement();const final=state.danger.encounter.kind==='checkpoint';dialogue={type:'danger',title:final?'O cerco do portão':'Pare. Esvazie os bolsos.',pages:pages([final?'O vigia bloqueia a última curva. — O líder deixou você passar. Eu não. Kali precisa sacrificar um recurso ou arriscar o próprio corpo. A preparação ainda pode se desfazer aqui.':'Uma mão prende o ombro de Kali. — Outra vez fora do quarto. O vigia estende a palma. Não existe resposta sem custo. Na próxima detecção após três advertências, ou com vigilância 8, haverá captura.']),page:0,speaker:['VIGIA DA ACTRAS','guard'],note:D.status(state)+' · A revista custa 2 ações do prazo.',actions:D.options(state).map(c=>({...c,fn:()=>{state=D.resolve(state,c.id);closeDialogue();objective();save();openStory();}}))};showDialogue();}

function openSide(id){if(!A.available(id,state)){notice('Esta ação já foi concluída ou a preparação terminou.');return;}const action=A.actions[id],opts=A.sideChoices(id,state);dialogue={type:'lore',sideId:id,title:action.title,pages:pages([G.value(action.text,state)]),page:0,speaker:[action.who.toUpperCase(),action.who],actions:opts.map((c,i)=>({label:c.label,lock:c.lock,hint:((id==='gate')&&(c.effect?.suspicion||0)+state.suspicion>=7&&c.effect?.flags?.cellOpen&&(c.effect?.suspicion||0)>0)?'VIGILÂNCIA CRÍTICA: este método termina em captura.':A.act(state)>=3?'Custo: 1 ação do prazo de Tomas.':null,fn:()=>{const result=A.perform(state,id,i);state=result.state;world.tracked=null;world.alert=0;objective();save();if(G.scenes[state.scene].ending){closeDialogue();openStory();return;}say(action.title,result.text,null,[action.who.toUpperCase(),action.who]);dialogue.changes=result.changes;showDialogue();}})).concat([{label:'Voltar à exploração.',fn:closeDialogue}])};clearMovement();showDialogue();}
function interact(){if(!playing||endView||$('modal').open)return;if(dialogue){dialogueChoices?.activate();return;}
if(state.pending||state.danger.encounter){openStory();return;}const nearest=interactionTarget();
if(nearest?.door){const result=M.toggleDoor(nearest.door,state,world,[...renderer.npcs(state,world),...guards]);notice(result.text);if(result.changed)save();return;}
if(nearest?.id==='mel'){say('Mel','Você faz carinho em Mel. Ela não responde, mas gosta de você.',null,['MEL','mel']);$('dialogue-note').textContent='UM MOMENTO DE CALMA';return;}
if(nearest?.photo){openPhoto(nearest.photo);return;}
if(nearest?.item){applyErrand('collect',nearest.item);return;}
if(nearest?.person){openCharacter(nearest.person);return;}
if(nearest?.mission){if(nearest.action)openSide(nearest.action);else openStory();return;}
if(nearest?.action){if(['mira','eron','noah'].includes(nearest.action))openCharacter(nearest.action);else openSide(nearest.action);return;}if(nearest?.id==='altar'){say('O obelisco de ametista','A base tem três discos: sino, chama e raiz. A inscrição está parcialmente escondida pela toalha. A passagem será investigada quando você tiver resolvido como agir diante do confinamento.',[{label:'Observar a arte do altar.',fn:()=>{closeDialogue();modal('O altar da Actras');const img=element('img');img.src=window.GameArt?.urls.altar||'assets/cenarios/altar-pixel.png';img.alt='Altar gótico com o obelisco de ametista';img.className='altar-image';$('modal-content').append(img);}},{label:'Afastar-se.',fn:closeDialogue}]);}
else if(nearest?.id==='books')say('O livro de chamadas',state.flags.registerClue?'Você já encontrou a linha de Tomas. O diário liga o número T-17 à caixa da cozinha. O código do altar é sino, chama e raiz.':'Um livro de chamadas repousa na estante. Você precisa de um nome ou número para distinguir uma pista entre centenas de linhas.');
else if(nearest?.id==='bed')say('Uma cama, quatro paredes',state.flags.bedClue?'A etiqueta retirada da costura aponta para T-17. O colchão foi recolocado.':'A cama guarda marcas de quem passou por OldHood. Eron pode ajudar a distinguir quais delas são recentes.');
else if(['mira','eron','noah','guard'].includes(nearest?.id))openCharacter(nearest.id);
else notice('Aproxime-se de alguém ou de um objeto. J abre minhas pistas no caderno.');}
function nearby(){
 const list=[...F.points(state),...M.doorPoints(state,world),{...M.melPoint(world),id:'mel',name:'Fazer carinho em Mel'},...S.points(state,world),...A.points(state,world),{...M.positions.altar,id:'altar',name:'Examinar o altar'},{...M.positions.bed,id:'bed',name:'Examinar a cama'},{...M.positions.ledger,id:'books',name:'Examinar os livros'},...renderer.npcs(state,world).filter(n=>['mira','eron','noah','guard'].includes(n.kind)).map(n=>({...n,id:n.kind,person:n.kind,name:'Conversar com '+n.name}))];
 return list.filter(p=>M.canInteract(world.player,p,state,world)).sort((a,b)=>Math.hypot(a.x-world.player.x,a.y-world.player.y)-Math.hypot(b.x-world.player.x,b.y-world.player.y))[0];
}
function interactionTarget(){
 const goal=M.target(state,world),near=nearby(),p=world.player;
 const gd=M.canInteract(p,goal,state,world,62)?Math.hypot(p.x-goal.x,p.y-goal.y):Infinity;
 const nd=near?Math.hypot(p.x-near.x,p.y-near.y):Infinity;
 // Portas e Mel próximas têm prioridade; a mesma escolha alimenta o aviso e E.
 if(near&&(near.door||near.id==='mel'||near.photo)&&nd<=gd+12)return near;
 return gd<62&&gd<=nd+12?{...goal,mission:true}:near;
}
function move(dx,dy){const p=world.player,old={x:p.x,y:p.y};M.move(p,dx,dy,state,world);return p.x!==old.x||p.y!==old.y;}
function update(dt){const p=world.player;let dx=(keys.has('right')?1:0)-(keys.has('left')?1:0),dy=(keys.has('down')?1:0)-(keys.has('up')?1:0);const sneak=keys.has('sneak')||touchSneak;const speed=(sneak?64:128)*(1-state.danger.wounds*.15);if(dx||dy){const len=Math.hypot(dx,dy);const ox=p.x,oy=p.y;if(move(dx/len*speed*dt,dy/len*speed*dt)){p.step+=Math.hypot(p.x-ox,p.y-oy)/20;walkSinceSave=true;}else p.step=0;p.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}else p.step=0;
if(M.updateMel(state,world,dt))walkSinceSave=true;
if(R.update(state,world,dt))walkSinceSave=true;
renderer.updateActors?.(state,world,dt);
let seen=false;
const activeGuards=guards.filter((g,i)=>!state.flags.distracted||i===0);for(const g of activeGuards){const pace=1+state.suspicion*.035+(state.danger.hunt>0?.7:0);M.updateGuard(g,dt,pace,state,world);const x=p.x-g.x,y=p.y-g.y,distance=Math.hypot(x,y),range=(sneak?64:125)+state.suspicion*(sneak?2:5);g.range=range;const angle=Math.abs(Math.atan2(y,x*g.dir));if(M.night.has(state.scene)&&distance<range&&(distance<24||angle<.5)&&M.visible(g,p,state,world))seen=true;}
state.danger.grace=Math.max(0,state.danger.grace-dt);state.danger.hunt=Math.max(0,(state.danger.hunt||0)-dt);
if(M.night.has(state.scene)&&state.danger.grace<=0)world.alert=Math.max(0,Math.min(100,(world.alert||0)+(seen?(sneak?26:48):-38)*dt));else world.alert=0;
if(world.alert>=100){world.alert=0;state=D.startEncounter(state);objective();save();openStory();}
$('danger-status').textContent=D.status(state)+(state.danger.grace>0?' · RECUAR '+Math.ceil(state.danger.grace)+'s':state.danger.hunt>0?' · RONDA EM ALERTA':'');
$('location').textContent=M.roomAt(p.x,p.y);$('stealth-label').textContent=sneak?'KALI · PASSOS SILENCIOSOS':'KALI · LUZITRUISTA';$('risk-label').textContent=world.alert>15?'SENDO VISTO':state.suspicion>=4?'ALTA':state.suspicion>=2?'ATENTA':'DISCRETA';$('risk-bar').style.width=Math.max(8,world.alert||state.suspicion/9*100)+'%';$('risk-bar').style.background=world.alert>15?'#d79d75':'#d0b77e';
const liveGoal=M.target(state,world);if(liveGoal&&$('objective').textContent!==liveGoal.objective)$('objective').textContent=liveGoal.objective;
const close=interactionTarget();$('interact-prompt').hidden=!close||!!dialogue;if(close)$('near-label').textContent=close.name;
}
function frame(time){const dt=Math.min(.035,(time-last)/1000||0);last=time;if(playing&&!endView&&!dialogue&&!$('modal').open&&!document.hidden){update(dt);saving+=dt;if(saving>2){if(walkSinceSave)save();saving=0;}}const displayState=playing?state:{...G.initial(),scene:'altar'},displayWorld=playing?world:{...M.fresh(),player:{...M.authoredPoint(16,30),dir:'up',step:0}};renderer.draw(displayState,displayWorld,guards.filter((g,i)=>!state.flags.distracted||i===0),{time,dpr,cones:prefs.cones,reduced:prefs.reduced,minimap:playing&&innerWidth>700});requestAnimationFrame(frame);}
function modal(title){memoryView=null;$('modal').className='';$('modal').removeAttribute('aria-labelledby');$('modal').removeAttribute('aria-describedby');clearMovement();$('modal-content').replaceChildren(element('h2',title));if(!$('modal').open)$('modal').showModal();}
function closeModal(){const back=memoryView?.fromInventory;memoryView=null;$('modal').close();$('modal').className='';clearMovement();if(back){showInventory();return;}if(playing){if(dialogue)dialogueChoices?.select(dialogueChoices.selectedIndex,true);else canvas.focus({preventScroll:true});}}
function openPhoto(id,fromInventory=false){
 const photo=F.photos[id];if(!photo||!playing)return;
 if(!fromInventory){F.collect(state,id);objective();save();}
 modal(photo.name);const view=memoryView={id,fromInventory};
 const shell=$('modal');shell.className='photo-memory';shell.dataset.reduced=String(prefs.reduced||!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
 shell.setAttribute('aria-labelledby','memory-title');shell.setAttribute('aria-describedby','memory-words');$('interact-prompt').hidden=true;
 const title=$('modal-content').children[0];title.id='memory-title';title.className='memory-title';
 const layout=element('div',undefined,'memory-layout'),figure=element('figure',undefined,'memory-photo'),img=element('img'),status=element('p','Revelando a fotografia…','memory-load');status.setAttribute('role','status');
 img.alt=photo.alt;img.width=1086;img.height=1448;img.className='memory-image';
 const retry=button('TENTAR NOVAMENTE',()=>{img.hidden=false;retry.hidden=true;status.hidden=false;status.textContent='Revelando a fotografia…';img.src=photo.src;},'secondary memory-retry');retry.hidden=true;
 img.addEventListener('load',()=>{if(memoryView!==view)return;status.hidden=true;retry.hidden=true;figure.classList.add('is-ready');});
 img.addEventListener('error',()=>{if(memoryView!==view)return;img.hidden=true;status.hidden=false;status.textContent='A foto não carregou. Tente novamente. Ela continua guardada no inventário.';retry.hidden=false;});
 figure.append(img,status,retry);img.src=photo.src;
 const caption=element('section',undefined,'memory-caption'),words=element('p',F.text(state,id));words.id='memory-words';
 caption.append(element('small','KALI · UMA LEMBRANÇA'),words);
 const close=button(fromInventory?'VOLTAR AO INVENTÁRIO':'GUARDAR E CONTINUAR',closeModal,'secondary memory-continue');
 caption.append(close);layout.append(figure,caption);$('modal-content').append(layout);close.focus({preventScroll:true});
}
function para(text){$('modal-content').append(element('p',text));}
function showMap(){if(!playing)return;modal('Mapa do orfanato');para('Verde: Kali. Branco: Mel. A rota aparece somente para o lugar que você marcou no caderno. Portas trancadas continuam bloqueando o caminho.');const c=element('canvas');c.width=930;c.height=690;renderer.drawMap(c,state,world);$('modal-content').append(c);para(world.tracked?M.target(state,world)?.objective:'Minhas pistas e próximos passos estão no caderno.');$('modal-content').append(button('ABRIR CADERNO',showJournal,'secondary'));}
function entry(title,text,cls='entry'){const e=element('div',undefined,cls);e.append(element('small',title),element('p',text));$('modal-content').append(e);return e;}
function track(id){if(['mira','tomas'].includes(id)&&state.flags.miraTaken&&!state.flags.cellOpen)id='gate';world.tracked=id;closeModal();objective();save();notice('Ponto marcado no mapa. J permite voltar à missão principal.');}
function openNotebook(tab='investigation',focusTab=false){
 if(!playing)return;
 window.GameNotebook.open({document,state,world,G,A,S,D,F,V,modal,button,track,trackErrand,openPhoto,showMap,
 mainGoal:M.target(state,{...world,tracked:null}),clearTracking:()=>{world.tracked=null;closeModal();objective();save();notice('Apaguei a marcação. Minhas pistas continuam no caderno.');}},tab,focusTab);
}
function showJournal(){openNotebook('investigation');}
function updateRelationships(){if(world.tracked)document.body.classList.add('has-tracking');else document.body.classList.remove('has-tracking');}
function applyErrand(op,id){
 const result=S.perform(state,op,id,world);if(result.error){notice(result.error);return;}
 state=result.state;if(op==='accept')world.tracked='errand:'+result.quest.id;
 if(op==='deliver'&&world.tracked==='errand:'+result.quest.id)world.tracked=null;
 objective();save();say(result.quest.title,result.text,null,[op==='deliver'?S.names[result.quest.who].toUpperCase():'KALI',op==='deliver'?result.quest.who:'kali']);dialogue.changes=result.changes;showDialogue();
}
function openCharacter(who){
 const line=S.conversation(who,state),actions=[],q=S.current(who,state),goal=M.target(state,{...world,tracked:null});
 if(S.storyKind(state)===who&&M.canInteract(world.player,goal,state,world,62))actions.push({label:'Continuar a história: '+G.scenes[state.scene].title,fn:openStory});
 let text=line.text;
 if(q&&S.ownerAvailable(who,state)){
  text+='\n\n'+q.request;
  if(!state.errands[q.id])actions.push({label:'Aceitar pedido: '+q.title,hint:'Entregue pessoalmente. O personagem lembrará do que você fez.',fn:()=>applyErrand('accept',q.id)});
  else if(S.ready(q,state))actions.push({label:'Entregar os itens: '+q.title,hint:'Entregar os itens pessoalmente.'+(A.act(state)>=3?' Custa 1 ação do prazo.':''),fn:()=>applyErrand('deliver',q.id)});
  else actions.push({label:'Marcar o próximo passo: '+q.title,fn:()=>{closeDialogue();trackErrand(q.id);}});
 }
 if(['mira','eron','noah'].includes(who)&&A.available(who,state))actions.push({label:'Investigações e preparações',fn:()=>openSide(who)});
 for(const id of V.optionalFor(who,state))actions.push({label:A.actions[id].title,fn:()=>openSide(id)});
 actions.push({label:'Até depois.',fn:closeDialogue});say(line.title,text,actions,[S.names[who].toUpperCase(),who]);
}
function trackErrand(id){world.tracked='errand:'+id;closeModal();objective();save();notice('Pedido marcado. O alvo acompanha o personagem quando ele anda.');}
function showTasks(){openNotebook('requests');}
function showInventory(){openNotebook('objects');}
function showEndings(){modal('Seis ecos da mesma história');for(const [i,id]of ['voz','luz','sobrevivente','traicao','isolamento','captura'].entries()){const e=element('div',undefined,'entry'),found=endings.includes(id);e.append(element('small',String(i+1).padStart(2,'0')),element('p',found?G.scenes[id].title:'Final desconhecido'),element('span',found?G.scenes[id].quote:'Suas próximas escolhas podem revelar outro caminho.'));if(found)e.append(button('REVER ESTE FINAL',()=>showEnding(id,true),'secondary'));$('modal-content').append(e);}}
function help(){modal('Como jogar');para('PERIGO PERSISTENTE: revistas custam recursos, aliados ou ferimentos. Após cada revista, recue durante os 12 segundos de proteção. O prazo de Tomas avança por ações; diálogos e leitura ficam pausados.');para('Use o botão Tela cheia ou F para ampliar o jogo. F ou Esc volta à janela. Se o navegador não permitir tela cheia, o jogo aproveita a área disponível da aba.');para('Você controla Kali. Explore com WASD ou as setas. Aproxime-se dos personagens e objetos e pressione E. No celular, use o direcional e o botão Interagir.');para('J abre a investigação no caderno; I abre os objetos; T abre os pedidos. As relações aparecem nas falas: Mira se tranquiliza, Eron conversa mais e Noah pode pressionar quando você recusa suas orientações. Os personagens lembram de ações significativas.');para('Explore pelas pistas. O caderno separa observações de dúvidas. Marcar um lugar é opcional: só então aparece uma rota no mapa (M). As falas passam em páginas sem rolagem. Continuar avança e Voltar permite reler. Nas opções, esquerda/direita ou os botões mudam a página; cima/baixo seleciona. Enter, E, Espaço, números, clique e toque confirmam a opção visível.');para('Use E perto de uma porta para abrir ou fechar. Grades e arquivos exigem os desbloqueios da história. Mel passeia pelo orfanato através das portas abertas. Aproxime-se dela e use E para fazer carinho.');para('Nas cenas noturnas, os vigias patrulham. Evite a área iluminada à frente deles e use Shift (ou Furtivo no celular) para reduzir o alcance em que percebem você. Paredes e móveis bloqueiam a visão. Os vigias param enquanto você lê diálogos.');para('Ser visto inicia uma revista. Depois de 3 advertências, ou com vigilância 8, a próxima detecção encerra a fuga. Resistir causa um ferimento e vigilância +2. Andar furtivamente e esperar a patrulha passar ajuda a evitar isso.');para('O diário (J) liga pistas, registra compromissos e permite marcar lugares no mapa. Nos diálogos, Outros assuntos abre ações opcionais: entregar pão, mostrar provas, combinar o plano ou verificar Noah. As mudanças aparecem imediatamente após a escolha. Os itens são usados perto do personagem ou porta correspondente.');para('O progresso e a posição são salvos neste navegador. O jogo funciona sem internet. O novo modo 2D tem um salvamento separado da versão narrativa.');
for(const [key,label]of [['cones','Mostrar campo de visão dos vigias'],['reduced','Reduzir animações']]){const row=element('label',undefined,'settings-row'),input=element('input');input.type='checkbox';input.checked=!!prefs[key];input.addEventListener('change',()=>{prefs[key]=input.checked;write(PREFS,prefs);});row.append(element('span',label),input);$('modal-content').append(row);}para('Ficção de suspense: coerção, perseguição religiosa e perigo envolvendo adolescentes.');}
function pause(){if(!playing){atHome();return;}modal('Uma pausa no silêncio');para('Seu progresso está salvo. A vigilância fica pausada enquanto este menu estiver aberto.');save();$('modal-content').append(button('VOLTAR AO JOGO',closeModal),button('COMO JOGAR E AJUSTES',help,'secondary'),button('VOLTAR AO MENU INICIAL',()=>{closeModal();atHome();},'secondary'));}
async function sound(){try{if(!audio){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error();audio=new AC();gain=audio.createGain();gain.gain.value=0;gain.connect(audio.destination);for(const f of [55,82.41,110]){const osc=audio.createOscillator(),v=audio.createGain();osc.frequency.value=f;v.gain.value=.15;osc.connect(v);v.connect(gain);osc.start();}}await audio.resume();soundOn=!soundOn;gain.gain.setTargetAtTime(soundOn?.15:0,audio.currentTime,.2);$('sound').textContent=soundOn?'SOM ON':'SOM OFF';$('sound').setAttribute('aria-pressed',soundOn);}catch{notice('Áudio indisponível neste navegador.');}}
const directions={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'sneak',ShiftRight:'sneak'};
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;if($('modal').open){if(!memoryView&&!e.repeat){const sections={KeyJ:'investigation',KeyI:'objects',KeyT:'requests'};if(sections[e.code]){e.preventDefault();openNotebook(sections[e.code],true);return;}if(e.code==='KeyM'){e.preventDefault();showMap();return;}}if(memoryView&&e.code==='Tab'){const buttons=[...$('modal').querySelectorAll('button:not(:disabled)')].filter(b=>!b.hidden&&b.getClientRects().length);if(buttons.length){e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}return;}if(memoryView&&!e.repeat&&['KeyE','Space','Escape'].includes(e.code)){e.preventDefault();closeModal();}return;}if(endView){if(e.code==='Tab'){const buttons=[...$('ending-screen').querySelectorAll('button:not([hidden]):not(:disabled)')];if(buttons.length){e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}}if(e.code==='Escape'&&!e.repeat){e.preventDefault();leaveEnding();}return;}if(dialogue){if(!e.repeat){const sections={KeyJ:'investigation',KeyI:'objects',KeyT:'requests'};if(sections[e.code]){e.preventDefault();openNotebook(sections[e.code],true);return;}if(e.code==='KeyM'){e.preventDefault();showMap();return;}}if(e.code==='Tab'){const buttons=[...$('dialogue').querySelectorAll('button:not([hidden]):not(:disabled)')].filter(b=>b.getClientRects().length);if(buttons.length){e.preventDefault();const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}return;}if(e.repeat)return;if(e.code==='Escape'&&dialogue.type!=='ending'){e.preventDefault();closeDialogue();return;}if(dialogue.readComplete&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();moveChoicePage(e.code==='ArrowLeft'?-1:1);return;}if(['ArrowUp','ArrowDown'].includes(e.code)){e.preventDefault();dialogueChoices?.move(e.code==='ArrowUp'?-1:1);return;}if(['Enter','NumpadEnter','KeyE','Space'].includes(e.code)){e.preventDefault();dialogueChoices?.activate();return;}if(/^[1-9]$/.test(e.key)){e.preventDefault();[...$('choices').querySelectorAll('button')].find(b=>b.dataset.choiceNumber===e.key)?.click();}return;}if(!playing)return;if(directions[e.code]){e.preventDefault();keys.add(directions[e.code]);return;}if(e.repeat)return;if(e.code==='KeyE'||e.code==='Space'){e.preventDefault();interact();}if(e.code==='KeyM'){e.preventDefault();showMap();}if(e.code==='KeyJ')showJournal();if(e.code==='KeyI')showInventory();if(e.code==='KeyT')showTasks();if(e.code==='Escape')pause();});
document.addEventListener('keyup',e=>{if(directions[e.code])keys.delete(directions[e.code]);});window.addEventListener('blur',()=>{clearMovement();if(playing)save();});window.addEventListener('resize',()=>{resize();if(dialogue)showDialogue();});document.fonts?.addEventListener('loadingdone',()=>{fontRevision++;if(dialogue)showDialogue();});window.addEventListener('pagehide',()=>{if(playing)save();});document.addEventListener('visibilitychange',()=>{clearMovement();if(audio)gain.gain.setTargetAtTime(soundOn&&!document.hidden?.15:0,audio.currentTime,.2);if(document.hidden&&playing)save();});
for(const b of document.querySelectorAll('[data-move]')){const direction=b.dataset.move;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(playing&&!endView&&!dialogue&&!$('modal').open)keys.add(direction);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(direction));}
$('ending-menu').addEventListener('click',leaveEnding);$('ending-restart').addEventListener('click',newGame);$('ending-collection').addEventListener('click',showEndings);
$('sneak-touch').addEventListener('click',()=>{touchSneak=!touchSneak;$('sneak-touch').setAttribute('aria-pressed',touchSneak);});$('interact-touch').addEventListener('click',interact);$('start').addEventListener('click',newGame);$('resume').addEventListener('click',resume);$('brand').addEventListener('click',pause);$('menu-btn').addEventListener('click',pause);$('map-btn').addEventListener('click',showMap);$('journal').addEventListener('click',showJournal);$('inventory').addEventListener('click',showInventory);$('tasks').addEventListener('click',showTasks);$('endings-btn').addEventListener('click',showEndings);$('chapters').addEventListener('click',()=>{modal('Capítulo único — O Obelisco');para('Explore o orfanato OldHood e encontre a verdade por trás da Actras. Cinco atos, investigação com pistas conectadas, preparações opcionais e seis desfechos com consequências registradas.');$('modal-content').append(button(saved?'CONTINUAR O CAPÍTULO':'COMEÇAR O CAPÍTULO',()=>{closeModal();saved?resume():start();}));});$('options-home').addEventListener('click',help);$('credits').addEventListener('click',()=>{modal('Créditos');para('Pesquisa: Enzo Raphael dos Reis Pessoa.');para('Ideia, História e Arte: Felipe Bertol Schneider.');para('Desenvolvimento: Enzo Raphael dos Reis Pessoa, Felipe Bertol Schneider.');});$('exit-home').addEventListener('click',()=>{modal('Até o próximo sino');para('O progresso já salvo foi mantido. Você pode fechar esta aba ou voltar ao menu.');$('modal-content').append(button('VOLTAR AO MENU',closeModal));});$('help').addEventListener('click',help);$('sound').addEventListener('click',sound);$('close-modal').addEventListener('click',closeModal);$('dismiss-dialogue').addEventListener('click',closeDialogue);$('choices-previous').addEventListener('click',()=>moveChoicePage(-1));$('choices-next').addEventListener('click',()=>moveChoicePage(1));$('dialogue-back').addEventListener('click',()=>{if(!dialogue)return;if(dialogue.readComplete){dialogue.readComplete=false;dialogue.page=dialogue.pages.length-1;}else dialogue.page=Math.max(0,dialogue.page-1);showDialogue();});$('dialogue-extra').addEventListener('click',()=>{if(dialogue)openCharacter(dialogue.speaker[1]);});$('modal').addEventListener('close',clearMovement);$('modal').addEventListener('cancel',e=>{e.preventDefault();closeModal();});
window.GameArt?.ready.then(()=>{renderer.refreshArt();if(dialogue)paintPortrait(dialogue.speaker[1]);if(endView)window.EndingScreens.draw($('ending-art'),endView);if(window.GameArt.status.failed.length)notice('Algumas artes não carregaram. Extraia o ZIP inteiro antes de abrir index.html.');});resize();atHome();requestAnimationFrame(frame);
})();
