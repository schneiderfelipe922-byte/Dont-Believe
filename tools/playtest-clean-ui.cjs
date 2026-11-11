const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {route,configs}=require('../tests/endings-routes.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/interface-limpa');fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true}),errors=[],checks=[];
 const checkpoint=route(configs.voz).checkpoints.find(c=>c.scene==='preparar');
 for(const [device,width,height,dpr]of [['computador',1280,900,1],['retina',1440,1000,2],['celular',390,844,1],['horizontal',844,390,1]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   let raf,time=0,factory;window.requestAnimationFrame=fn=>(raf=fn,1);window.__tick=(n=1)=>{for(let i=0;i<n;i++){time+=35;raf?.(time)}};
   Object.defineProperty(window,'createGameRenderer',{get:()=>factory,set:fn=>{factory=(canvas,...args)=>{const r=fn(canvas,...args),draw=r.draw;r.draw=(s,w,g,o)=>{const ctx=canvas.getContext('2d'),scale=ctx.scale;let zoom;ctx.scale=function(x,y){zoom??=x;return scale.call(this,x,y)};try{const result=draw(s,w,g,o);window.__qa={state:s,world:w,zoom,dpr:o.dpr,width:canvas.width,height:canvas.height};return result;}finally{ctx.scale=scale;}};return r;};}});
  });
  const story=JSON.parse(JSON.stringify(checkpoint.story)),world=JSON.parse(JSON.stringify(checkpoint.world));story.pending=null;story.suspicion=5;story.danger.warnings=2;story.danger.wounds=1;story.danger.grace=7;world.alert=42;
  await page.goto('file://'+ROOT+'/index.html');await page.evaluate(s=>{localStorage.clear();localStorage.setItem('dont-believe.topdown.v2',JSON.stringify(s));},{version:2,story,world});await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));await page.locator('#resume').click();await page.evaluate(()=>__tick());
  assert.equal(await page.locator('header').count(),0);assert.equal(await page.locator('.game-top,.game-bottom,.risk,#danger-status').count(),0);
  const stage=await page.locator('#stage').boundingBox();assert.equal(stage.x,0);assert.equal(stage.y,0);assert(Math.abs(stage.width-width)<1&&Math.abs(stage.height-height)<1);
  const camera=await page.evaluate(()=>({scale:__qa.zoom/__qa.dpr,worldWidth:__qa.width/__qa.zoom,worldHeight:__qa.height/__qa.zoom}));assert(camera.worldWidth<=(width<height?280.01:480.01)&&camera.worldHeight<=(width<height?440.01:320.01));assert(camera.worldWidth<=1464.01&&camera.worldHeight<=912.01);
  await page.screenshot({path:path.join(OUT,device+'-jogo.png')});
  await page.keyboard.press('c');assert.equal(await page.locator('#modal').getAttribute('class'),'controls-menu');assert(await page.locator('#journal').isVisible());assert(await page.locator('#fullscreen').isVisible());assert(await page.locator('#help').isVisible());
  const before=await page.evaluate(()=>JSON.stringify({danger:__qa.state.danger,player:__qa.world.player,alert:__qa.world.alert}));await page.evaluate(()=>__tick(40));assert.equal(await page.evaluate(()=>JSON.stringify({danger:__qa.state.danger,player:__qa.world.player,alert:__qa.world.alert})),before);
  await page.screenshot({path:path.join(OUT,device+'-controles.png')});
  await page.locator('#inventory').click();assert.equal(await page.locator('#modal').getAttribute('data-tab'),'objects');await page.waitForFunction(()=>document.querySelector('#modal').dataset.art==='ready',null,{polling:100});
  assert((await page.locator('.notebook-condition').innerText()).includes('Vigilância:'));assert((await page.locator('.notebook-condition').innerText()).includes('Advertências: 2 de 3'));assert((await page.locator('.notebook-condition').innerText()).includes('Ferimentos: 1 de 2'));assert((await page.locator('#notebook-panel').innerText()).includes(story.inventory[0]));
  await page.screenshot({path:path.join(OUT,device+'-objetos.png')});
  await page.keyboard.press('Escape');assert(!await page.locator('#modal').isVisible());await page.keyboard.press('c');await page.keyboard.press('c');assert(!await page.locator('#modal').isVisible());
  await page.locator('#menu-btn').click();assert(await page.locator('#modal').isVisible());await page.locator('#controls-resume').click();assert(!await page.locator('#modal').isVisible());
  await page.keyboard.press('j');assert.equal(await page.locator('#modal').getAttribute('data-tab'),'investigation');await page.keyboard.press('t');assert.equal(await page.locator('#modal').getAttribute('data-tab'),'requests');await page.keyboard.press('m');assert((await page.locator('#modal-content').innerText()).includes('Mapa do orfanato'));await page.keyboard.press('Escape');
  // O menu pode ser consultado durante a leitura e retorna à mesma página.
  await page.keyboard.press('e');if(await page.locator('#dialogue').isVisible()){
   const text=await page.locator('#dialogue-text').innerText();await page.keyboard.press('c');await page.keyboard.press('c');assert.equal(await page.locator('#dialogue-text').innerText(),text);
   const box=await page.locator('.dialogue-card').boundingBox();assert(box.width>=width*.9&&box.height<=211);const portrait=await page.locator('#dialogue .portrait').boundingBox();assert(Math.abs(portrait.y+portrait.height-box.y)<10);await page.evaluate(()=>__tick());await page.screenshot({path:path.join(OUT,device+'-dialogo.png')});
   let reads=0;while(await page.locator('#dialogue').getAttribute('data-phase')==='text'&&reads++<80)await page.keyboard.press('Enter');
   assert(reads<80);assert.equal((await page.locator('.dialogue-card').boundingBox()).height,box.height,'as escolhas não aumentam a altura da moldura');
   const footer=await page.locator('.dialogue-foot button').evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).map(n=>{const b=n.getBoundingClientRect(),p=n.closest('.dialogue-main').getBoundingClientRect();return {left:b.left,right:b.right,bottom:b.bottom,min:p.left,max:p.right,end:p.bottom}}));
   for(const b of footer)assert(b.left>=b.min-1&&b.right<=b.max+1&&b.bottom<=b.end+1,JSON.stringify(b));
   await page.evaluate(()=>__tick());await page.screenshot({path:path.join(OUT,device+'-opcoes.png')});
  }
  await page.keyboard.press('Escape');await page.keyboard.press('c');await page.locator('#controls-home').click();assert(await page.locator('#home-screen').isVisible());assert.equal(await page.locator('header').count(),0);
  await page.locator('#options-home').click();assert(await page.locator('#journal').isDisabled());assert.equal(await page.locator('#controls-return-label').innerText(),'VOLTAR AO MENU');assert(await page.locator('#controls-resume').isEnabled());await page.locator('#controls-resume').click();
  checks.push({device,camera,cleanScreen:true,controls:true,notebookStatus:true,paused:true});await page.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify({errors,checks},null,2));console.log(JSON.stringify({errors,checks}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
