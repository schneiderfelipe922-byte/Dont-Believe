const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {route,configs,G}=require('../tests/endings-routes.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/colisoes'),URL='file://'+ROOT+'/index.html';
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  let raf,clock=0,factory;window.requestAnimationFrame=fn=>(raf=fn,1);
  window.__tick=(count=1)=>{for(let i=0;i<count;i++){clock+=35;raf?.(clock)}};
  Object.defineProperty(window,'createGameRenderer',{configurable:true,get:()=>factory,set:fn=>{factory=(...args)=>{const renderer=fn(...args),draw=renderer.draw;renderer.draw=(s,w,guards,options)=>{window.__qa={state:s,world:w,renderer,guards};return draw(s,w,guards,options)};return renderer}}});
 });
 async function tick(count=1){await page.evaluate(n=>__tick(n),count)}
 async function load(save){await page.goto(URL);await page.evaluate(s=>{if(s)localStorage.setItem('dont-believe.topdown.v2',JSON.stringify(s));else{localStorage.clear()}},save);await page.reload();await page.evaluate(()=>GameArt.ready);await page.locator(save?'#resume':'#start').click();await tick();assert.deepEqual(await page.evaluate(()=>GameArt.status.failed),[]);}
 async function choose(index){for(let i=0;i<12;i++){const buttons=page.locator('#choices > button');if(await buttons.count()===1&&(await buttons.first().innerText()).includes('Continuar')){await page.keyboard.press('Enter')}else break;}const wanted=page.locator('#choices > button[data-choice-number="'+(index+1)+'"]');for(let i=0;i<30&&!await wanted.count();i++){const more=page.locator('#choices>button').filter({hasText:'Continuar'});if(await more.count())await more.click();else await page.locator('#choices-next').click();}await wanted.click();await tick();}
 async function dismiss(){for(let i=0;i<10&&await page.locator('#dialogue').isVisible();i++){await page.keyboard.press('Enter');await tick()}}
 await load(null);await page.screenshot({path:path.join(OUT,'inicio.png')});await page.keyboard.press('Escape');await tick();
 // Ensaio de movimento pelo teclado: pressionar contra mesas e janelas, inclusive diagonal.
 const probes=[{name:'janela-dormitorio',x:300,y:155,key:'ArrowUp',limit:140,axis:'y',side:'min'},
 {name:'cadeira-dormitorio',x:193,y:253,key:'ArrowUp',limit:250,axis:'y',side:'min'},
 {name:'mesa-sala',x:212,y:665,key:'ArrowUp',limit:649,axis:'y',side:'min'},
 {name:'obelisco',x:400,y:540,key:'ArrowDown',limit:549,axis:'y',side:'max'}];
 for(const p of probes){
  await page.evaluate(p=>{Object.assign(__qa.world.player,{x:p.x,y:p.y});__qa.state.scene='quarto';__qa.world.mel.x=500;__qa.world.mel.y=240;},p);await tick();await page.keyboard.down(p.key);await tick(70);await page.keyboard.up(p.key);
  const value=await page.evaluate(axis=>__qa.world.player[axis],p.axis);assert(p.side==='min'?value>=p.limit:value<=p.limit,p.name+': '+value);await page.screenshot({path:path.join(OUT,p.name+'.png')});
 }
 // Portas fechadas, alcance por E, travessia aberta, fechamento sobre jogador.
 for(const id of ['cell','archive']){
  await page.evaluate(id=>{const d=GameWorld.doors.find(d=>d.id===id);__qa.state.flags.cellOpen=true;__qa.state.flags.tunnel=true;__qa.world.doors[id]=false;Object.assign(__qa.world.player,{x:d.x+d.w/2,y:d.y+d.h+7});__qa.world.mel.x=500;},id);await tick();assert(await page.evaluate(()=>GameWorld.walkable(__qa.world.player.x,__qa.world.player.y,7,__qa.state,__qa.world)));
  await page.keyboard.down('ArrowUp');await tick(35);await page.keyboard.up('ArrowUp');
  const blocked=await page.evaluate(id=>{const d=GameWorld.doors.find(d=>d.id===id);return __qa.world.player.y>=d.y+d.h+7},id);assert(blocked,id+': atravessou fechada');
  await page.screenshot({path:path.join(OUT,id+'-fechada.png')});await page.keyboard.press('KeyE');await tick(10);assert(await page.evaluate(id=>__qa.world.doors[id]===true,id),id+': E não abriu');
  await page.keyboard.down('ArrowUp');await tick(4);await page.keyboard.up('ArrowUp');
  await page.keyboard.press('KeyE');await tick();assert(await page.evaluate(id=>__qa.world.doors[id]===true,id),'porta fechou sobre o jogador');
  await page.keyboard.down('ArrowUp');await tick(15);await page.keyboard.up('ArrowUp');
  assert(await page.evaluate(id=>{const d=GameWorld.doors.find(d=>d.id===id);return __qa.world.player.y<d.y-7},id),'não atravessou a porta aberta');await page.screenshot({path:path.join(OUT,id+'-aberta.png')});
  await page.evaluate(id=>{const d=GameWorld.doors.find(d=>d.id===id),box=GameWorld.doorBounds(d);Object.assign(__qa.world.player,{x:box.x+7,y:box.y-7});__qa.world.doors[id]=false;},id);await tick();await page.keyboard.down('ArrowDown');await tick(35);await page.keyboard.up('ArrowDown');assert(await page.evaluate(id=>{const box=GameWorld.doorBounds(GameWorld.doors.find(d=>d.id===id));return __qa.world.player.y===box.y-7},id),'pisou na folha fechada pelo norte');await page.screenshot({path:path.join(OUT,id+'-norte-fechada.png')});
 }
 // Mapa de evidência: os contornos mostram os sólidos conferidos.
 await page.evaluate(()=>{const c=document.createElement('canvas');c.id='qa-map';c.width=1464;c.height=962;const ctx=c.getContext('2d');ctx.fillStyle='#0b090e';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(__qa.renderer.map,0,0);ctx.strokeStyle='#f48484';ctx.lineWidth=1;ctx.fillStyle='#e66c6c28';for(const p of GameWorld.sceneryProps){ctx.fillRect(p.x,p.y,p.w,p.h);ctx.strokeRect(p.x,p.y,p.w,p.h)}ctx.strokeStyle='#69d5fc';ctx.lineWidth=2;for(const d of GameWorld.doors){const p=GameWorld.doorBounds(d);ctx.strokeRect(p.x,p.y,p.w,p.h)}ctx.fillStyle='#eee';ctx.font='18px monospace';ctx.fillText('VERMELHO: paredes, janelas e móveis sólidos',24,936);ctx.fillStyle='#69d5fc';ctx.fillText('AZUL: folha fechada das portas',810,936);document.body.append(c)});await page.locator('#qa-map').screenshot({path:path.join(OUT,'mapa-colisoes.png')});await page.locator('#qa-map').evaluate(c=>c.remove());
 const endings=[];
 for(const [id,config]of Object.entries(configs)){
  const run=route(config),last=run.checkpoints.at(-1);await load({version:2,story:last.story,world:last.world});await page.keyboard.press('KeyE');await tick();assert(await page.locator('#dialogue').isVisible(),id+': sem diálogo final');await choose(last.choice);await dismiss();await tick();
  assert(await page.locator('#ending-screen').isVisible(),id+': epílogo ausente');assert.equal(await page.locator('#ending-title').innerText(),G.scenes[id].title);
  assert(await page.evaluate(id=>JSON.parse(localStorage.getItem('dont-believe.endings.v1')).includes(id),id));
  await page.screenshot({path:path.join(OUT,'final-'+id+'.png'),fullPage:true});endings.push({id,title:G.scenes[id].title,steps:run.steps.length});
  await page.locator('#ending-menu').click();await tick();assert(await page.locator('#home-screen').isVisible());
 }
 await page.locator('#endings-btn').click();assert.equal(await page.getByRole('button',{name:'REVER ESTE FINAL'}).count(),6);await page.getByRole('button',{name:'REVER ESTE FINAL'}).first().click();assert(await page.locator('#ending-screen').isVisible());await page.keyboard.press('Escape');await tick();
 // Diálogo e controles de toque no tamanho móvel.
 await page.setViewportSize({width:390,height:844});await load(null);await page.screenshot({path:path.join(OUT,'mobile-dialogo.png'),fullPage:true});await page.keyboard.press('Escape');await tick();await page.locator('#interact-touch').click();await tick();await page.screenshot({path:path.join(OUT,'mobile-jogo.png'),fullPage:true});
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(OUT,'verificacao-browser.json'),JSON.stringify({errors,endings,collisionProbes:probes.map(p=>p.name),doors:['cell','archive'],viewports:['1440x1000','390x844']},null,2));console.log(JSON.stringify({errors,endings,doors:'OK',keyboard:'OK',mobile:'OK'}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
