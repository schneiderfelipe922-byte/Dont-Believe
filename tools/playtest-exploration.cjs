/* Mobile/desktop acceptance with a primed stale HTTP cache and actual game input. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const G=require('../javascript/story.js'),M=require('../javascript/world.js');require('../javascript/adventure.js');require('../javascript/danger.js');require('../javascript/social.js');
const F=require('../javascript/photos.js');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/exploracao');fs.mkdirSync(OUT,{recursive:true});
const sentinel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQmcAAAAASUVORK5CYII=','base64');
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname);
 if(pathname==='/warm'){res.setHeader('Content-Type','text/html');res.end('<img id="old" src="/assets/sprites-e-idles/sprites.png"><script src="/javascript/assets.js"></script>');return;}
 if(pathname==='/assets/sprites-e-idles/sprites.png'&&!url.search){res.setHeader('Content-Type','image/png');res.setHeader('Cache-Control','public,max-age=31536000,immutable');res.end(sentinel);return;}
 if(pathname==='/javascript/assets.js'&&!url.search){res.setHeader('Content-Type','text/javascript');res.setHeader('Cache-Control','public,max-age=31536000,immutable');res.end('window.oldAssets=true');return;}
 const file=path.resolve(ROOT,'.'+pathname);if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf'};
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','public,max-age=31536000,immutable');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true}),errors=[],checks=[];
 try{
 for(const [device,width,height,mobile]of [['computador',1280,900,false],['celular',390,844,true],['horizontal',844,390,true]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/warm');await page.waitForFunction(()=>document.getElementById('old').complete);assert.equal(await page.locator('#old').evaluate(n=>n.naturalWidth),1);
  await page.addInitScript(()=>{
   let raf,time=0,factory;window.requestAnimationFrame=fn=>(raf=fn,1);window.__tick=(n=1)=>{for(let i=0;i<n;i++){time+=35;raf?.(time);}};
   Object.defineProperty(window,'createGameRenderer',{configurable:true,get:()=>factory,set:fn=>{factory=(canvas,...args)=>{const r=fn(canvas,...args),draw=r.draw;r.draw=(s,w,g,o)=>{
    const c=canvas.getContext('2d'),original=c.drawImage,order=[];
    c.drawImage=function(image,...a){if(image===GameArt.images.pickups)order.push('pickup');if(image===GameArt.images.bedside)order.push(a[0]===54?'drawer-open':'drawer-closed');if(image===GameArt.images.sprites&&Object.values(CharacterData.kali.idles).some(t=>t.frames.some(f=>f[0]===a[0]&&f[1]===a[1])))order.push('kali');return original.call(this,image,...a);};
    try{window.__qa={state:s,world:w,order};return draw(s,w,g,o);}finally{c.drawImage=original;}
   };return r;};}});
  });
  await page.goto(base+'/index.html');await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));
  assert.deepEqual(await page.evaluate(()=>GameArt.status.failed),[]);assert.equal(await page.locator('header,#brand').count(),0);
  assert.equal((await page.locator('#stage').boundingBox()).y,0);
  assert.deepEqual(await page.evaluate(()=>[GameArt.images.sprites.naturalWidth,GameArt.images.sprites.naturalHeight]),[512,1024]);
  const url=await page.evaluate(()=>GameArt.urls.sprites),response=await page.request.get(base+'/'+url),sha=crypto.createHash('sha256').update(await response.body()).digest('hex');assert.equal(sha,crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,'assets/sprites-e-idles/sprites.png'))).digest('hex'));
  await page.screenshot({path:path.join(OUT,device+'-inicio.png')});
  async function load(point){
   const story=G.initial();story.scene='quarto';story.pending=null;story.errands={'eron-letter':'active'};
   const world=M.fresh();Object.assign(world.player,point,{dir:'up',step:0});world.drawers={};
   await page.goto(base+'/index.html');await page.evaluate(s=>localStorage.setItem('dont-believe.topdown.v2',JSON.stringify(s)),{version:2,story,world});await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));await page.locator('#resume').click();await page.evaluate(()=>__tick());
  }
  for(const drawer of M.drawers){
   await load(drawer.point);assert((await page.locator('#near-label').innerText()).includes('gaveta'));
   const before=await page.evaluate(()=>JSON.stringify(__qa.state));
   await page.screenshot({path:path.join(OUT,device+'-'+drawer.id+'-fechada.png')});
   if(mobile)await page.locator('#interact-touch').tap();else await page.keyboard.press('e');await page.evaluate(()=>__tick());
   assert.equal(await page.evaluate(id=>__qa.world.drawers[id],drawer.id),true);assert((await page.locator('#notice').innerText()).includes('aberta'));
   assert.equal(await page.evaluate(()=>JSON.stringify(__qa.state)),before);
   await page.screenshot({path:path.join(OUT,device+'-'+drawer.id+'-aberta.png')});
   await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));await page.locator('#resume').click();await page.evaluate(()=>__tick());assert.equal(await page.evaluate(id=>__qa.world.drawers[id],drawer.id),true);
   if(mobile)await page.locator('#interact-touch').tap();else await page.keyboard.press('e');await page.evaluate(()=>__tick());assert.equal(await page.evaluate(id=>__qa.world.drawers[id],drawer.id),false);
  }
  await load({x:F.photos.family.x,y:F.photos.family.y+8});
  const order=await page.evaluate(()=>__qa.order);assert(order.includes('pickup')&&order.includes('kali'));assert(order.lastIndexOf('pickup')<order.indexOf('kali'),order.join(','));
  await page.screenshot({path:path.join(OUT,device+'-foto-sob-kali.png')});
  await page.keyboard.press('e');assert.equal(await page.locator('#modal').getAttribute('class'),'photo-memory');assert((await page.locator('.memory-caption').innerText()).includes('Daty'));await page.keyboard.press('Escape');await page.evaluate(()=>__tick());assert(await page.evaluate(()=>__qa.state.inventory.includes('Fotografia da minha família')));
  const before=await page.evaluate(()=>JSON.stringify(__qa.state));await page.keyboard.press('c');await page.evaluate(()=>__tick(20));assert.equal(await page.evaluate(()=>JSON.stringify(__qa.state)),before);await page.keyboard.press('Escape');
  checks.push({device,isMobile:mobile,staleCacheReplaced:true,latestAtlasHash:sha,headerRemoved:true,drawersTouchAndKeyboard:true,drawerSave:true,itemsBelowPlayer:true,photoCollection:true});await context.close();
 }
 // Real failure path: play waits for the current atlas and retry loads it, without legacy art.
 const page=await browser.newPage();let failed=true;await page.route('**/assets/sprites-e-idles/sprites.png?*',route=>failed?route.abort():route.continue());await page.goto(base+'/index.html');await page.evaluate(()=>GameArt.ready);await page.locator('#start').click();assert((await page.locator('#modal').innerText()).includes('As artes ainda'));assert(await page.locator('#home-screen').isVisible());failed=false;await page.getByRole('button',{name:'TENTAR NOVAMENTE'}).click();await page.waitForFunction(()=>document.body.classList.contains('in-game'),null,{polling:100});assert(await page.evaluate(()=>!!GameArt.images.sprites));await page.close();
 const slow=await browser.newPage();let release;
 await slow.route('**/assets/sprites-e-idles/sprites.png?*',route=>{release=()=>route.continue();});
 await slow.goto(base+'/index.html',{waitUntil:'domcontentloaded'});await slow.locator('#start').click();assert((await slow.locator('#modal').innerText()).includes('Carregando o orfanato'));
 await slow.keyboard.press('Escape');await release();await slow.evaluate(()=>GameArt.ready);assert(await slow.locator('#home-screen').isVisible());assert(!await slow.locator('#modal').isVisible());await slow.close();
 assert.deepEqual(errors,[]);const report={generatedAt:new Date().toISOString(),errors,checks,retryVerified:true,loadingCancellationVerified:true};fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
