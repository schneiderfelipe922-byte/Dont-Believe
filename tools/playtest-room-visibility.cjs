const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/visao-sala');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
 const errors=[],checks=[];
 for(const [device,width,height]of [['computador',1280,800],['celular',390,844],['horizontal',844,390]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{let fn,time=0,factory;window.requestAnimationFrame=f=>(fn=f,1);window.__tick=()=>fn?.(time+=35);window.__texts=[];const fill=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,...args){window.__texts.push(t);return fill.call(this,t,...args)};Object.defineProperty(window,'createGameRenderer',{get:()=>factory,set:f=>factory=(...args)=>{const r=f(...args),draw=r.draw;r.draw=(s,w,g,o)=>{window.__qa={s,w,g,r};return draw(s,w,g,o)};return r}})});
 await page.goto('file://'+ROOT+'/index.html');await page.evaluate(()=>{const story=GameStory.initial();story.scene='quarto';story.pending=null;story.flags.prologueSeen=true;localStorage.setItem('dont-believe.topdown.v2',JSON.stringify({version:2,story,world:GameWorld.fresh()}));});
 await page.reload();await page.evaluate(()=>Promise.all([GameArt.ready,document.fonts.ready]));await page.locator('#resume').click();await page.evaluate(()=>__tick());
 await page.evaluate(()=>{Object.assign(__qa.w.player,{x:319,y:260});Object.assign(__qa.g[0],{x:380,y:384});__texts=[];__tick();});
 assert(await page.evaluate(()=>__texts.includes('PASSOS · VIGIA')));
 await page.screenshot({path:path.join(OUT,device+'-aviso.png')});
 const visibility=await page.evaluate(()=>{const v=GameScenery.roomView(__qa.w.player);return {room:v.id,neighbor:v.contains({x:380,y:384}),player:v.contains(__qa.w.player)}});assert.equal(visibility.room,'dorm');assert(!visibility.neighbor);assert(visibility.player);
 await page.evaluate(()=>{Object.assign(__qa.w.player,{x:319,y:384});__tick();});assert.equal(await page.evaluate(()=>GameScenery.roomView(__qa.w.player).id),'hall');
 await page.screenshot({path:path.join(OUT,device+'-corredor.png')});checks.push({device,warning:true,roomTransition:true});
 await page.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(OUT,'verificacao.json'),JSON.stringify({errors,checks},null,2));console.log(JSON.stringify({errors,checks}));
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
