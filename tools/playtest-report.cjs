const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {route,configs}=require('../tests/endings-routes.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/atualizacao-relatorio');
fs.mkdirSync(OUT,{recursive:true});
const compact=text=>text.replace(/\s+/g,' ').trim();
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage(),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.requestAnimationFrame=fn=>(window.__reportFrame=fn,1);});
 const run=route(configs.voz),SAVE='dont-believe.topdown.v2';
 async function load(scene,flags={}){
  const c=run.checkpoints.find(c=>c.scene===scene),save=JSON.parse(JSON.stringify({version:2,story:c.story,world:c.world}));
  save.story.pending=null;Object.assign(save.story.flags,flags);
  if(flags.tomasTransferred)save.story.danger.turns=0;
  await page.goto('file://'+ROOT+'/index.html');
  await page.evaluate(({save,key})=>{localStorage.clear();localStorage.setItem(key,JSON.stringify(save));},{save,key:SAVE});
  await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));
  await page.locator('#resume').click();await page.keyboard.press('e');await page.evaluate(()=>__reportFrame(16));
  assert(await page.locator('#dialogue').isVisible(),scene);
  const title=await page.evaluate(scene=>GameStory.scenes[scene].title,scene);
  if(await page.locator('#dialogue-title').innerText()!==title){
   await readAll();await page.locator('#choices>button').filter({hasText:'Continuar a história:'}).click();
  }
  assert.equal(await page.locator('#dialogue-title').innerText(),title);
  await page.evaluate(()=>__reportFrame(32));
  assert.deepEqual(await page.evaluate(()=>GameArt.status.failed),[]);
  return save.story;
 }
 async function fits(){
  const box=await page.locator('.dialogue-scroll').evaluate(n=>({height:n.clientHeight,scroll:n.scrollHeight}));
  assert(box.height>50&&box.scroll<=box.height+1,JSON.stringify(box));
 }
 async function readAll(){
  const text=[];let pages=0;
  while(await page.locator('#dialogue').getAttribute('data-phase')==='text'){
   await fits();text.push(await page.locator('#dialogue-text').innerText());
   assert(++pages<80,'paginação não termina');await page.keyboard.press('Enter');
  }
  await fits();return {text:compact(text.join(' ')),pages};
 }
 for(const [device,width,height]of [['computador',1280,900],['celular',390,844]]){
  await page.setViewportSize({width,height});
  for(const [scene,flags]of [['interrogatorio',{}],['interrogatorio',{disclosed:true}],['resgate',{tomasTransferred:false,tomasRescued:false}],['resgate',{tomasTransferred:true,tomasRescued:false}],['resgate',{tomasTransferred:false,tomasRescued:true}],['reliquia',{}]]){
   const before=await load(scene,flags),suffix=flags.tomasTransferred?'transferido':flags.tomasRescued?'livre':flags.disclosed?'noah':'principal';
   const source=await page.evaluate(s=>GameStory.value(GameStory.scenes[s.scene].text,s).map(GameInvestigation.present).join(' '),before);
   await page.screenshot({path:path.join(OUT,`${device}-${scene}-${suffix}.png`)});
   const read=await readAll();assert.equal(read.text,compact(source),`${device}/${scene}/${suffix}: texto integral`);
   const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).story,SAVE);
   for(const key of ['scene','flags','inventory','adults','mira','eron','noah','suspicion','danger'])assert.deepEqual(after[key],before[key],key);
   checks.push({device,scene,variant:suffix,pages:read.pages,complete:true,readingFree:true});
  }
 }
 await page.setViewportSize({width:1280,height:900});await load('reliquia');
 // Amostras reais do CSS para todas as molduras, sem alterar a partida.
 const frames=[];
 for(const speaker of ['kali','noah','mira','eron','vigia','lider','tomas','daty','inauri']){
  await page.locator('#dialogue').evaluate((el,speaker)=>{el.dataset.speaker=speaker;document.getElementById('speaker').textContent=DialogueUI.names[speaker];},speaker);
  const filter=await page.locator('.dialogue-card').evaluate(n=>getComputedStyle(n,'::before').filter);
  await page.locator('.dialogue-card').screenshot({path:path.join(OUT,'moldura-'+speaker+'.png')});frames.push({speaker,filter});
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify({errors,checks,frames},null,2));
 console.log(JSON.stringify({errors,scenarios:checks.length,completeText:true,readingFree:true,frames:frames.length}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
