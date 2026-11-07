/* Browser acceptance for the gothic UI: actual layouts, not CSS string snapshots. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {route,configs}=require('../tests/endings-routes.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/ui-gotico/depois');
fs.mkdirSync(OUT,{recursive:true});
const clone=value=>JSON.parse(JSON.stringify(value));
function contrast(a,b){
 const luminance=hex=>{const c=hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
(async()=>{
 const browser=await chromium.launch({headless:true}),errors=[],checks=[];
 try {
 const run=route(configs.voz),checkpoint=run.checkpoints.find(c=>c.scene==='preparar');
 for(const [device,width,height,dpr]of [['computador',1280,900,1],['retina',1440,1000,2],['celular',390,844,1],['horizontal',844,390,1],['estreito',320,740,1]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr});
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   let raf,time=0,factory;window.requestAnimationFrame=fn=>(raf=fn,1);
   window.__tick=(n=1)=>{for(let i=0;i<n;i++){time+=35;raf?.(time);}};
   Object.defineProperty(window,'createGameRenderer',{configurable:true,get:()=>factory,set:fn=>{factory=(...args)=>{const r=fn(...args),draw=r.draw;r.draw=(s,w,g,o)=>{window.__qa={state:s,world:w};return draw(s,w,g,o);};return r;};}});
  });
  async function tick(){await page.evaluate(()=>__tick());}
  async function shot(name){await page.evaluate(()=>document.fonts.ready);await tick();await page.screenshot({path:path.join(OUT,device+'-'+name+'.png'),animations:'disabled'});}
  async function fit(selector){const boxes=await page.locator(selector).evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).map(n=>{const b=n.getBoundingClientRect();return {id:n.id,left:b.left,right:b.right,top:b.top,bottom:b.bottom,client:n.clientWidth,scroll:n.scrollWidth};}));for(const b of boxes){assert(b.left>=-1&&b.right<=width+1,JSON.stringify({device,b}));assert(b.top>=-1&&b.bottom<=height+1,JSON.stringify({device,b}));assert(b.scroll<=b.client+1,JSON.stringify({device,overflow:b}));}}
  async function targets(selector){for(const b of await page.locator(selector).evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).map(n=>{const r=n.getBoundingClientRect();return {id:n.id,width:r.width,height:r.height};})))assert(b.width>=43.9&&b.height>=43.9,JSON.stringify({device,target:b}));}
  async function load(story=checkpoint.story,world=checkpoint.world){
   await page.goto('file://'+ROOT+'/index.html');await page.evaluate(s=>{localStorage.clear();localStorage.setItem('dont-believe.topdown.v2',JSON.stringify(s));},{version:2,story,world});await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));
  }
  await load();
  const tokens=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return {bg:s.getPropertyValue('--bg').trim(),font:s.fontFamily};});
  assert.equal(tokens.bg,'#100f13');assert(tokens.font.includes('Solway'));
  await shot('menu');
  await targets('.art-hit,#resume');await fit('.art-hit,#resume');
  for(const id of ['chapters','endings-btn','credits','options-home']){
   await page.locator('#'+id).click();await page.evaluate(()=>document.fonts.ready);await fit('#modal');
   assert(await page.locator('#modal').getAttribute('aria-labelledby'));
   await targets('#close-modal');await shot(id);await page.keyboard.press('Escape');
  }
  await page.locator('#resume').click();await tick();if(await page.locator('#dialogue').isVisible())await page.keyboard.press('Escape');
  await fit('#stage,#touch-controls');await targets('#menu-btn,#touch-controls button');
  await page.keyboard.press('c');await targets('#modal button');await fit('#modal');
  const state=await page.evaluate(()=>JSON.stringify(__qa.state));await page.evaluate(()=>__tick(20));assert.equal(await page.evaluate(()=>JSON.stringify(__qa.state)),state);
  await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement.matches(':focus-visible')));
  await shot('controles');await page.locator('#controls-resume').click();
  await page.keyboard.press('j');await page.waitForFunction(()=>document.querySelector('#modal').dataset.art==='ready',null,{polling:100});
  assert((await page.locator('.notebook-entry p').first().evaluate(n=>getComputedStyle(n).fontFamily)).includes('Kalam'));
  await fit('#modal');await shot('diario');await page.keyboard.press('i');await shot('objetos');await page.keyboard.press('t');await shot('pedidos');
  await page.keyboard.press('m');await fit('#modal');await shot('mapa');await page.keyboard.press('Escape');
  await page.keyboard.press('e');assert(await page.locator('#dialogue').isVisible());
  await targets('#dialogue button');await shot('dialogo');
  // Walk all pages with real keyboard events. Reading must preserve the action budget.
  const turns=await page.evaluate(()=>__qa.state.danger.turns);
  async function dialogueFits(){
   const b=await page.locator('.dialogue-scroll').evaluate(n=>({client:n.clientHeight,scroll:n.scrollHeight}));assert(b.scroll<=b.client+1,JSON.stringify({device,dialogue:b}));
   for(const b of await page.locator('.dialogue-foot button,#choices>button').evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).map(n=>{const r=n.getBoundingClientRect(),m=n.closest('.dialogue-main').getBoundingClientRect();return {id:n.id,left:r.left,right:r.right,bottom:r.bottom,min:m.left,max:m.right,end:m.bottom};})))assert(b.left>=b.min-1&&b.right<=b.max+1&&b.bottom<=b.end+1,JSON.stringify({device,b}));
  }
  await dialogueFits();
  for(let n=0;await page.locator('#dialogue').getAttribute('data-phase')==='text';n++){
   assert(n<80);await page.keyboard.press('Enter');await dialogueFits();
  }
  assert.equal(await page.evaluate(()=>__qa.state.danger.turns),turns);
  await targets('#dialogue button');await shot('escolhas');await page.keyboard.press('Escape');
  // Local assets and fonts must load with the browser fully offline.
  const story=clone(checkpoint.story);story.pending=null;story.inventory.push('Fotografia da minha família');story.flags.familyPhoto=true;
  await page.context().setOffline(true);await page.emulateMedia({reducedMotion:'reduce'});
  await load(story);await page.locator('#resume').click();await tick();await page.keyboard.press('i');
  await page.getByRole('button',{name:'VER FOTOGRAFIA'}).first().click();
  await page.waitForFunction(()=>document.querySelector('.memory-image')?.naturalWidth>0,null,{polling:100});await fit('#modal');await targets('.memory-continue,#close-modal');
  assert.equal(await page.locator('.memory-image').evaluate(n=>getComputedStyle(n).opacity),'1');
  assert(await page.evaluate(()=>document.fonts.check('16px Solway')));await shot('fotografia');
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  const final=run.state;await load(final,run.world);await page.locator('#resume').click();await shot('final');await fit('#ending-screen');await targets('.ending-actions button');
  checks.push({device,width,height,dpr,localFont:tokens.font,offline:true,keyboard:true,targets44:true,readingFree:true});
  await page.close();
 }
 const contrasts={};for(const [label,a,b]of [['marfim/madeira','E9DFCF','211B20'],['secundário/madeira','BBAFA2','211B20'],['bronze/madeira','A58B63','211B20'],['marfim/vinho','E9DFCF','783844']]){const value=contrast(a,b);assert(value>=4.5,label);contrasts[label]=Math.round(value*100)/100;}
 assert.deepEqual(errors,[]);
 const report={generatedAt:new Date().toISOString(),errors,checks,contrasts};fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
