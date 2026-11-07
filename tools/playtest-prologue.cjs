/* Percorre o prólogo publicado com teclado, toque, pausa e retomada real. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/prologo');fs.mkdirSync(OUT,{recursive:true});
const SAVE='dont-believe.topdown.v2';
const LOSS_PATH=fs.readFileSync(path.join(ROOT,'javascript/assets.js'),'utf8').match(/prologueLoss:'([^']+)'/)[1];
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(ROOT,'.'+pathname);
 if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf'})[path.extname(file)]||'application/octet-stream');
 res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||chromium.executablePath()}),errors=[],checks=[];
 const snapshot=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE);
 const loaded=page=>page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));
 async function phase(page,name){await page.waitForFunction(name=>{const s=document.getElementById('prologue-screen');return !s.hidden&&s.dataset.phase===name&&!s.hasAttribute('aria-busy');},name);}
 async function step(page,mobile){if(mobile)await page.locator('#prologue-next').tap();else await page.keyboard.press('e');}
 async function approach(page,mobile){
  if(mobile)await page.locator('[data-move="up"]').dispatchEvent('pointerdown',{pointerId:1});else await page.keyboard.down('ArrowUp');
  try{await page.waitForFunction(()=>!document.getElementById('prologue-next').hidden,null,{timeout:10000});}
  finally{if(mobile)await page.locator('[data-move="up"]').dispatchEvent('pointerup',{pointerId:1});else await page.keyboard.up('ArrowUp');}
 }
 async function shot(page,name){await page.waitForTimeout(240);await page.screenshot({path:path.join(OUT,name+'.png')});}
 try{
 for(const [name,width,height,mobile,reduced]of [['computador',1280,800,false,false],['celular',390,844,true,true],['horizontal',844,390,true,false]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2:1,reducedMotion:reduced?'reduce':'no-preference'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(name+': '+e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(name+': HTTP '+r.status()+' '+r.url());});
  await page.goto(base+'/index.html');await loaded(page);assert.deepEqual(await page.evaluate(()=>GameArt.status.failed),[]);
  await page.locator('#start').click();await phase(page,'opening');await page.waitForFunction(()=>document.getElementById('prologue-image').naturalWidth>0);
  assert(await page.locator('#dialogue').isHidden());assert(await page.locator('#menu-btn').isHidden());
  assert((await page.locator('#prologue-image').getAttribute('src')).includes('kali-banco-traseiro'));
  const layout=await page.evaluate(()=>{const s=document.getElementById('prologue-screen').getBoundingClientRect(),c=document.getElementById('prologue-caption'),t=document.getElementById('prologue-text').getBoundingClientRect(),style=getComputedStyle(c);return {x:s.x,y:s.y,w:s.width,h:s.height,captionBottom:t.bottom,captionTop:t.top,background:style.backgroundColor,border:style.borderWidth,overflow:document.documentElement.scrollWidth>innerWidth};});
  assert.deepEqual([layout.x,layout.y,layout.w,layout.h],[0,0,width,height]);assert.equal(layout.background,'rgba(0, 0, 0, 0)');assert.equal(layout.border,'0px');assert(layout.captionTop>=0&&layout.captionBottom<=height);assert(!layout.overflow);
  await shot(page,name+'-abertura');
  // Uma legenda já lida permanece na mesma página após fechar e reabrir o jogo.
  await step(page,mobile);const openingSave=await snapshot(page);assert.equal(openingSave.story.prologue.page,1);
  await page.reload();await loaded(page);await page.locator('#resume').click();await phase(page,'opening');assert.equal((await snapshot(page)).story.prologue.page,1);
  for(let i=1;i<6;i++)await step(page,mobile);await phase(page,'road');
  assert(await page.locator('#prologue-image').isHidden());assert(await page.locator('#prologue-world').isVisible());assert(await page.locator('#prologue-next').isHidden());
  await page.keyboard.press('e');assert.equal(await page.locator('#prologue-screen').getAttribute('data-phase'),'road');
  await approach(page,mobile);
  await shot(page,name+'-estrada');
  await page.locator('#prologue-pause').click();assert(await page.locator('#modal').isVisible());const paused=await snapshot(page);
  assert.equal(paused.story.prologue.phase,'road');assert(paused.story.prologue.player.y<480);assert.equal(paused.story.danger.warnings,0);
  await page.keyboard.down('ArrowUp');await page.waitForTimeout(250);await page.keyboard.up('ArrowUp');assert.deepEqual((await snapshot(page)).story.prologue.player,paused.story.prologue.player);
  await page.locator('#controls-resume').click();
  await page.reload();await loaded(page);await page.locator('#resume').click();await phase(page,'road');assert.deepEqual((await snapshot(page)).story.prologue.player,paused.story.prologue.player);
  if(mobile)await page.locator('#interact-touch').tap();else await page.keyboard.press('e');await phase(page,'loss');
  assert.equal(await page.locator('#prologue-image').getAttribute('src'),await page.evaluate(()=>GameArt.urls.prologueLoss));
  assert(await page.locator('#touch-controls').isHidden());assert(await page.locator('#dialogue').isHidden());
  await shot(page,name+'-revelacao');
  for(let i=0;i<3;i++)await step(page,mobile);await phase(page,'aftermath');
  await step(page,mobile);const aftermathSave=await snapshot(page);assert.equal(aftermathSave.story.prologue.page,1);
  await page.reload();await loaded(page);await page.locator('#resume').click();await phase(page,'aftermath');
  for(let i=1;i<5;i++)await step(page,mobile);
  await page.waitForFunction(()=>!document.body.classList.contains('in-prologue')&&!document.getElementById('dialogue').hidden);
  const complete=await snapshot(page);assert.equal(complete.story.scene,'quarto');assert(complete.story.flags.prologueSeen);assert.equal(complete.story.prologue,undefined);assert.equal(complete.story.danger.warnings,0);
  assert.equal(await page.locator('#dialogue-title').innerText(),'O silêncio tem olhos');
  await shot(page,name+'-orfanato');
  // Partidas após o prólogo continuam no orfanato sem repetir a abertura.
  await page.reload();await loaded(page);await page.locator('#resume').click();assert(await page.locator('#prologue-screen').isHidden());
  checks.push({device:name,fullViewport:true,unboxedSubtitles:true,openingResume:true,roadMovement:mobile?'touch':'keyboard',carRequiresProximity:true,pause:true,roadResume:true,lossImage:true,aftermathResume:true,orphanageContinuation:true,reducedMotion:reduced});await context.close();
 }
 // Salvamento antigo que ainda estava no prólogo inicia a nova apresentação.
 const legacy=await browser.newPage();await legacy.goto(base+'/index.html');await loaded(legacy);
 await legacy.evaluate(key=>localStorage.setItem(key,JSON.stringify({version:2,story:GameStory.initial(),world:GameWorld.fresh()})),SAVE);await legacy.reload();await loaded(legacy);await legacy.locator('#resume').click();await phase(legacy,'opening');await legacy.close();
 // Abrir index.html diretamente também deve desenhar Kali, sem leitura de canvas contaminado.
 const offline=await browser.newPage();offline.on('pageerror',e=>errors.push('file: '+e.message));await offline.goto('file://'+ROOT+'/index.html');await loaded(offline);await offline.locator('#start').click();await phase(offline,'opening');
 for(let i=0;i<6;i++)await step(offline,false);await phase(offline,'road');await approach(offline,false);await offline.keyboard.press('e');await phase(offline,'loss');await offline.close();
 // Arte obrigatória ausente é recuperável, sem iniciar uma sequência incompleta.
 const failure=await browser.newPage();let fail=true;
 await failure.route('**/'+LOSS_PATH+'?*',route=>fail?route.abort():route.continue());
 await failure.goto(base+'/index.html');await loaded(failure);await failure.locator('#start').click();assert((await failure.locator('#modal').innerText()).includes('As artes ainda não carregaram'));
 fail=false;await failure.getByRole('button',{name:'TENTAR NOVAMENTE'}).click();await phase(failure,'opening');await failure.close();
 assert.deepEqual(errors,[]);const report={errors,checks,legacySave:true,assetRetry:true,offlineFile:true};fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{if(errors.length)console.error('Browser errors:',errors);await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exit(1);});
