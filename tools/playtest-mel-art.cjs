const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const G=require('../javascript/story.js'),M=require('../javascript/world.js');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/mel');
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true}),errors=[],checks=[];
 try{
 for(const [device,width,height]of [['computador',1280,900],['celular',390,844],['horizontal',844,390]]){
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   let raf,time=0,factory;window.requestAnimationFrame=fn=>(raf=fn,1);window.__tick=(n=1)=>{for(let i=0;i<n;i++){time+=35;raf?.(time);}};
   Object.defineProperty(window,'createGameRenderer',{configurable:true,get:()=>factory,set:fn=>{factory=(...args)=>{const r=fn(...args),draw=r.draw;r.draw=(s,w,g,o)=>{window.__qa={state:s,world:w};return draw(s,w,g,o);};return r;};}});
  });
  const story=G.initial(),world=M.fresh();story.scene='quarto';story.pending=null;
  world.player={...world.player,x:world.mel.x,y:world.mel.y+24};
  await page.goto('file://'+ROOT+'/index.html');await page.evaluate(s=>{localStorage.clear();localStorage.setItem('dont-believe.topdown.v2',JSON.stringify(s));},{version:2,story,world});await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));
  assert.deepEqual(await page.evaluate(()=>GameArt.status.failed),[]);
  assert(await page.evaluate(()=>GameArt.images.dialogue_mel?.naturalWidth>0));
  await page.locator('#resume').click();await page.evaluate(()=>__tick());
  assert((await page.locator('#near-label').innerText()).includes('Mel'));
  await page.screenshot({path:path.join(OUT,device+'-cenario.png')});
  const before=await page.evaluate(()=>JSON.stringify(__qa.state));
  await page.keyboard.press('e');await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>__tick());
  assert.equal(await page.locator('#dialogue').getAttribute('data-speaker'),'mel');
  assert.equal(await page.locator('#speaker').innerText(),'Mel');assert.equal(await page.locator('#portrait').getAttribute('data-illustrated'),'true');
  assert.equal(await page.locator('#portrait').getAttribute('aria-label'),'Retrato de MEL');
  assert.deepEqual(await page.locator('#portrait').evaluate(n=>[n.width,n.height]),[1152,768]);
  assert((await page.locator('#dialogue-text').innerText()).includes('Você faz carinho em Mel'));
  const portrait=await page.locator('#dialogue .portrait').boundingBox(),card=await page.locator('.dialogue-card').boundingBox();
  assert(portrait.x>=0&&portrait.x+portrait.width<=width);assert(Math.abs(portrait.y+portrait.height-card.y)<10);
  await page.screenshot({path:path.join(OUT,device+'-interacao.png')});
  await page.evaluate(()=>__tick(90));assert.equal(await page.evaluate(()=>JSON.stringify(__qa.state)),before);
  const melBefore=await page.evaluate(()=>JSON.stringify(__qa.world.mel));await page.evaluate(()=>__tick(50));assert.equal(await page.evaluate(()=>JSON.stringify(__qa.world.mel)),melBefore);
  // Missing illustrated art must use the new resting sprite, never another character.
  await page.evaluate(()=>{delete GameArt.images.dialogue_mel;document.fonts.dispatchEvent(new Event('loadingdone'));});
  assert.equal(await page.locator('#portrait').getAttribute('data-illustrated'),'false');
  await page.screenshot({path:path.join(OUT,device+'-reserva.png')});
  await page.keyboard.press('Escape');assert(!await page.locator('#dialogue').isVisible());
  await page.context().setOffline(true);await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));await page.locator('#resume').click();await page.evaluate(()=>__tick());await page.keyboard.press('e');
  assert.equal(await page.locator('#portrait').getAttribute('data-illustrated'),'true');
  checks.push({device,width,height,illustratedPortrait:true,spriteFallback:true,storyUnchanged:true,paused:true,offline:true});await page.close();
 }
 assert.deepEqual(errors,[]);const report={generatedAt:new Date().toISOString(),errors,checks};fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
