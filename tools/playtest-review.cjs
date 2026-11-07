/* Regression playtest for the narrative, sprite and interaction review of 06/11. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {route,configs,G,M,A}=require('../tests/endings-routes.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/revisao-2026-11-06');
const SAVE='dont-believe.topdown.v2',URL='file://'+ROOT+'/index.html';
const clone=s=>JSON.parse(JSON.stringify(s));
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true}),errors=[],checks=[];
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   let raf,time=0,factory;
   window.requestAnimationFrame=fn=>(raf=fn,1);
   window.__tick=(n=1)=>{for(let i=0;i<n;i++){time+=35;raf?.(time);}};
   Object.defineProperty(window,'createGameRenderer',{configurable:true,get:()=>factory,set:fn=>{
    factory=(canvas,...args)=>{const r=fn(canvas,...args),draw=r.draw;
     r.draw=(state,world,guards,options)=>{window.__review={state,world,guards,options,renderer:r};return draw(state,world,guards,options);};return r;
    };
   }});
  });
  const tick=()=>page.evaluate(()=>__tick());
  async function load(story,world=M.fresh()){
   // Enter the menu before installing the fixture; a running game saves on pagehide.
   await page.goto(URL,{waitUntil:'domcontentloaded'});
   await page.evaluate(({story,world,key})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify({version:2,story,world}));},{story,world,key:SAVE});
   await page.reload({waitUntil:'domcontentloaded'});await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));
   await page.locator('#resume').click();await tick();
   assert.deepEqual(await page.evaluate(()=>GameArt.status.failed),[]);
  }
  const snapshot=()=>page.evaluate(()=>JSON.stringify({state:__review.state,world:__review.world,guards:__review.guards}));
  async function shot(name){await tick();await page.screenshot({path:path.join(OUT,name+'.png')});}
  async function readAll(){
   const texts=[];
   for(let n=0;await page.locator('#dialogue').getAttribute('data-phase')==='text';n++){
    assert(n<100,'A leitura deve terminar');texts.push(await page.locator('#dialogue-text').innerText());
    const fits=await page.locator('.dialogue-scroll').evaluate(n=>n.scrollHeight<=n.clientHeight+1);assert(fits);
    await page.keyboard.press('Enter');
   }
   return texts.join(' ');
  }
  // Actual atlas bounds, not only center distances, prove the opening silhouettes are separate.
  const initial=G.initial();initial.prologue={phase:'aftermath',page:4};await load(initial);
  await page.locator('#prologue-pause').focus();await page.keyboard.press('Enter');
  assert(await page.locator('#modal').isVisible());assert(await page.locator('#prologue-screen').isVisible());
  await page.locator('#controls-resume').click();await page.keyboard.press('e');
  await page.locator('#dialogue-title').waitFor({state:'visible'});await tick();
  const separated=await page.evaluate(()=>{
   const r=__review,p=r.world.player,g=r.renderer.npcs(r.state,r.world).find(n=>n.kind==='guard');
   const bounds=(kind,p)=>{const f=CharacterSprites.resolve(kind,'down',0,GameArt.images);return {left:p.x-f.track.anchor[0],right:p.x-f.track.anchor[0]+f.rect[2]};};
   const a=bounds('kali',p),b=bounds('guard',g);return a.right<=b.left||b.right<=a.left;
  });assert(separated);
  assert.equal(await page.locator('#dialogue-title').innerText(),'O silêncio tem olhos');
  assert.equal(await page.evaluate(()=>__review.options.labels),false);
  await shot('computador-inicio');
  await page.setViewportSize({width:390,height:844});await shot('celular-inicio');
  checks.push('Silhuetas iniciais separadas; nomes do cenário recolhidos durante a leitura.');

  // Losing focus freezes the world until explicit resume, and drops held movement input.
  await page.locator('#dismiss-dialogue').focus();await page.keyboard.press('Enter');
  assert(await page.locator('#dialogue').isHidden());
  checks.push('Enter aciona Pausar no prólogo e Explorar depois na fala quando esses botões têm foco.');
  await page.setViewportSize({width:1280,height:900});
  await page.keyboard.down('ArrowRight');await tick();
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  assert(await page.locator('#modal').isVisible());const frozen=await snapshot();
  await page.evaluate(()=>__tick(90));assert.equal(await snapshot(),frozen);
  const position=await page.evaluate(()=>({...__review.world.player}));
  await page.locator('#controls-resume').click();await page.evaluate(()=>__tick(12));
  assert.deepEqual(await page.evaluate(()=>__review.world.player),position);await page.keyboard.up('ArrowRight');
  await page.keyboard.press('e');const original=await page.locator('#dialogue-text').innerText();
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  assert(await page.locator('#modal').isHidden());assert.equal(await page.locator('#dialogue-text').innerText(),original);
  checks.push('Perda de foco pausa exploração e limpa movimento; conversa existente permanece intacta.');

  // Both OS preference changes and the in-game setting reach CSS and canvas immediately.
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.body.classList.contains('reduced'),null,{polling:50});await tick();
  assert(await page.evaluate(()=>document.body.classList.contains('reduced')&&__review.options.reduced));
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForFunction(()=>!document.body.classList.contains('reduced'),null,{polling:50});await tick();
  assert(!await page.evaluate(()=>document.body.classList.contains('reduced')||__review.options.reduced));
  await page.keyboard.press('c');await page.locator('#help').click();
  const setting=page.getByLabel('Reduzir animações');await setting.check();await tick();
  assert(await page.evaluate(()=>document.body.classList.contains('reduced')&&__review.options.reduced));
  await setting.uncheck();await page.keyboard.press('Escape');
  checks.push('Redução de movimento do sistema e do jogo sincronizada com CSS e canvas.');

  // Rotation must keep the current passage, without skipping words or charging a turn.
  const checkpoint=route(configs.voz).checkpoints.find(c=>c.scene==='preparar');
  const pending=clone(checkpoint.story);pending.pending={text:Array.from({length:240},(_,i)=>'marcador'+String(i).padStart(3,'0')).join(' ')};
  await load(pending,checkpoint.world);
  const reading=page.locator('#dialogue-text');
  assert.match(await reading.innerText(),/marcador000/);
  await page.keyboard.down('Enter');const once=await reading.innerText();assert(!once.includes('marcador000'));
  await page.keyboard.down('Enter');assert.equal(await reading.innerText(),once);await page.keyboard.up('Enter');
  for(let i=0;i<2;i++)await page.locator('#choices button').filter({hasText:'Continuar'}).click();
  const passage=await reading.innerText();assert.match(passage,/marcador\d+/);
  const first=Number(passage.match(/marcador(\d+)/)[1]);assert(first>0);
  const turns=await page.evaluate(()=>__review.state.danger.turns);
  const desktopCount=await page.locator('#page-count').innerText();
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(count=>document.getElementById('page-count').textContent!==count,desktopCount,{polling:50});
  const markers=(await page.locator('#dialogue-text').innerText()).match(/marcador\d+/g).map(x=>Number(x.slice(8)));
  assert(markers[0]<=first&&markers.at(-1)>=first,'A nova página deve conter o início da passagem anterior');
  await page.evaluate(()=>document.fonts.dispatchEvent(new Event('loadingdone')));
  assert.equal(await page.evaluate(()=>__review.state.danger.turns),turns);
  assert((await page.locator('#dialogue-text').innerText()).includes('marcador'+String(first).padStart(3,'0')));
  checks.push('Rotação e troca de fonte conservam a passagem e o prazo; manter Enter pressionado não avança novamente.');

  // Meet Eron through the real interaction path after each possible destination for Tomas.
  for(const transferred of [false,true]){
   const story=clone(checkpoint.story);story.pending=null;story.flags.tomasTransferred=transferred;story.flags.tomasRescued=!transferred;
   story.errands={};story.danger.turns=transferred?0:4;
   const world=M.fresh();Object.assign(world.player,M.positions.eronDorm);
   await load(story,world);
   await page.evaluate(()=>Object.assign(__review.world.player,GameSocial.actorPoint('eron',__review.state,__review.world)));
   await tick();await page.keyboard.press('e');
   assert.equal(await page.locator('#speaker').innerText(),'Eron');
   const text=await readAll();assert(!text.includes('Sumiu e ninguém explica'));
   assert(text.includes(transferred?'Levaram o Tomas':'O Tomas saiu da cela'));
   await shot(transferred?'celular-eron-transferencia':'celular-eron-resgate');
  }
  checks.push('Pedidos pessoais de Eron reconhecem resgate e transferência na conversa jogável.');

  // Every ending is actually rendered and can be revisited without consuming the save.
  await page.setViewportSize({width:1280,height:900});
  for(const [id,config]of Object.entries(configs)){
   const run=route(config);await load(run.state,run.world);
   if(await page.locator('#dialogue').isVisible()){
    await readAll();await page.getByRole('button',{name:'Voltar à exploração'}).click();
   }
   assert(await page.locator('#ending-screen').isVisible(),id);
   assert.equal(await page.locator('#ending-title').innerText(),G.scenes[id].title);
   assert((await page.locator('#ending-consequences').innerText()).includes(A.consequences(run.state)[0]));
   await shot('final-'+id);await page.locator('#ending-menu').click();
   const before=await page.evaluate(key=>localStorage.getItem(key),SAVE);
   await page.locator('#endings-btn').click();
   await page.getByRole('button',{name:'REVER ESTE FINAL'}).click();
   assert.equal(await page.locator('#ending-title').innerText(),G.scenes[id].title);
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),SAVE)===before,true,'Rever o final preserva o save atual');
  }
  checks.push('Seis finais exibidos e revisitados, com consequências da partida e salvamento preservado.');
  assert.deepEqual(errors,[]);
  const report={errors,checks,viewports:['1280×900','390×844'],offlineFile:true};
  fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
