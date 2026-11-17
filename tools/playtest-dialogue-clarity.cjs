const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/dialogos-claros');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});const errors=[];try{
for(const [device,width,height]of [['computador',1280,800],['celular',390,844],['horizontal',844,390],['estreito',320,568]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{let raf,time=0;window.requestAnimationFrame=f=>(raf=f,1);window.__tick=()=>raf?.(time+=35);});
 await page.goto('file://'+ROOT+'/index.html');
 await page.evaluate(()=>{const s=GameStory.initial(),w=GameWorld.fresh();s.scene='altar';s.flags.prologueSeen=true;Object.assign(w.player,GameWorld.positions.altar);localStorage.setItem('dont-believe.topdown.v2',JSON.stringify({version:2,story:s,world:w}));});
 await page.reload();await page.evaluate(()=>GameArt.ready);await page.locator('#resume').click();await page.evaluate(()=>__tick());await page.keyboard.press('KeyE');
 await page.locator('#dialogue').waitFor({state:'visible'});
 // Encontra a página do ritual, com falas e atribuições de narração.
 for(let n=0;n<10&&!await page.locator('.dialogue-block.speech').count();n++)await page.locator('#choices button').first().click();
 assert(await page.locator('.dialogue-block.speech').count());assert(await page.locator('.dialogue-block.narration').count());
 await page.evaluate(()=>__tick());await page.screenshot({path:path.join(OUT,device+'-leitura.png')});
 await page.locator('#choices button').first().click();
 assert.equal(await page.locator('#dialogue').getAttribute('data-phase'),'choices','um clique exibe todas as respostas');
 assert.equal(await page.locator('#choices button').count(),3);
 assert.equal(await page.locator('#choice-pager').count(),0);
 await page.evaluate(()=>__tick());await page.screenshot({path:path.join(OUT,device+'-respostas.png')});
 const box=await page.locator('.dialogue-card').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');
 assert.equal(await page.locator('#choices [data-selected=true]').getAttribute('data-choice-number'),'3');
 const visible=await page.evaluate(()=>{const b=document.querySelector('#choices [data-selected=true]').getBoundingClientRect(),s=document.querySelector('.dialogue-scroll').getBoundingClientRect();return b.top>=s.top-1&&b.bottom<=s.bottom+1});assert(visible,'seleção por teclado revela a resposta');
 await page.keyboard.press('Enter');assert.equal(await page.locator('#dialogue').getAttribute('data-phase'),'text');
 await page.goto('file://'+ROOT+'/index.html');
 // Save de confronto com opções indisponíveis: todas as rotas continuam comparáveis.
 await page.evaluate(()=>{const s=GameStory.initial(),w=GameWorld.fresh();s.scene='confronto';s.flags.prologueSeen=true;Object.assign(w.player,GameWorld.positions.climax);localStorage.setItem('dont-believe.topdown.v2',JSON.stringify({version:2,story:s,world:w}));});
 await page.reload();await page.evaluate(()=>GameArt.ready);await page.locator('#resume').click();await page.evaluate(()=>__tick());await page.keyboard.press('KeyE');
 await page.locator('#choices button').first().click();
 assert.equal(await page.locator('#dialogue').getAttribute('data-phase'),'choices','um clique exibe todas as respostas');
 assert.equal(await page.locator('#choices button').count(),await page.evaluate(()=>GameStory.choices({...GameStory.initial(),scene:'confronto'}).length));
 assert(await page.locator('#choices button:disabled').count());
 assert(await page.locator('#choices .choice-hint').count());
 const overflow=await page.evaluate(()=>{const s=document.querySelector('.dialogue-scroll');return s.scrollHeight>s.clientHeight+8});
 if(overflow)assert(await page.locator('#dialogue-scroll-hint').isVisible());
 await page.evaluate(()=>__tick());await page.screenshot({path:path.join(OUT,device+'-confronto.png')});
 await page.locator('#dialogue-back').click();assert.equal(await page.locator('#dialogue').getAttribute('data-phase'),'text');
 await page.close();
}
assert.deepEqual(errors,[]);console.log(JSON.stringify({devices:4,errors,allChoices:true,keyboard:true,lockedChoices:true}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
