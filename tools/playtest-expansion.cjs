const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {route,configs}=require('../tests/endings-routes.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'previas/diario');
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  let raf,clock=0,factory;window.requestAnimationFrame=fn=>(raf=fn,1);window.__tick=()=>{clock+=35;raf?.(clock)};
  Object.defineProperty(window,'createGameRenderer',{configurable:true,get:()=>factory,set:fn=>{factory=(...args)=>{const r=fn(...args),draw=r.draw;r.draw=(state,world,guards,o)=>{window.__qa={state,world};return draw(state,world,guards,o)};return r}}});
 });
 const run=route(configs.voz);
 async function load(id,modify){const c=run.checkpoints.find(c=>c.scene===id),save=JSON.parse(JSON.stringify({version:2,story:c.story,world:c.world}));save.story.pending=null;modify?.(save);await page.goto('file://'+ROOT+'/index.html');await page.evaluate(s=>localStorage.setItem('dont-believe.topdown.v2',JSON.stringify(s)),save);await page.reload();await page.locator('#resume').click();await page.evaluate(()=>__tick());}
 async function choose(index){for(let i=0;i<20;i++){const b=page.locator('#choices>button');if(await b.count()!==1||!(await b.first().innerText()).includes('Continuar'))break;await page.keyboard.press('Enter');}const wanted=page.locator('#choices>button[data-choice-number="'+(index+1)+'"]');for(let i=0;i<30&&!await wanted.count();i++){const more=page.locator('#choices>button').filter({hasText:'Continuar'});if(await more.count())await more.click();else await page.locator('#choices-next').click();}await wanted.click();await page.evaluate(()=>__tick());}
 async function dismiss(){for(let i=0;i<20&&await page.locator('#dialogue').isVisible();i++)await page.keyboard.press('Enter');await page.evaluate(()=>__tick());}
 async function interact(){await page.keyboard.press('e');await page.evaluate(()=>__tick());assert(await page.locator('#dialogue').isVisible());}
 async function meet(who,title){await page.evaluate(who=>{Object.assign(__qa.world.player,GameSocial.actorPoint(who,__qa.state,__qa.world));__qa.world.mel.x=500;__qa.world.mel.y=240;},who);await page.evaluate(()=>__tick());await interact();if(!(await page.locator('#dialogue-title').innerText()).includes(title)){for(let i=0;i<20;i++){const b=page.locator('#choices>button');if(await b.count()!==1||!(await b.first().innerText()).includes('Continuar'))break;await page.keyboard.press('Enter');}await page.getByRole('button',{name:new RegExp(title)}).click();}}
 await load('plano');await meet('eron','A partida interrompida');await choose(0);await dismiss();assert(await page.evaluate(()=>__qa.state.flags.tomasSignalKnown));
 await load('sigilo');await meet('noah','Sua versão, Noah');await choose(0);await dismiss();assert(await page.evaluate(()=>__qa.state.flags.noahVersionQuestioned));assert((await page.evaluate(()=>__qa.state.socialMemory.refusals)).includes('noah-version'));
 await load('destinoVazio');await interact();await choose(0);await dismiss();assert.equal(await page.evaluate(()=>__qa.state.scene),'cruzamento');
 await load('cruzamento');const before=await page.evaluate(()=>({inventory:[...__qa.state.inventory],suspicion:__qa.state.suspicion,danger:JSON.stringify(__qa.state.danger)}));
 await interact();await page.keyboard.press('i');assert.equal(await page.locator('#modal').getAttribute('data-tab'),'objects');assert((await page.locator('#modal').innerText()).includes('T-17'));await page.keyboard.press('Escape');assert(await page.locator('#dialogue').isVisible());await choose(1);await dismiss();assert.equal(await page.evaluate(()=>__qa.state.scene),'cruzamento');
 assert.deepEqual(await page.evaluate(()=>({inventory:[...__qa.state.inventory],suspicion:__qa.state.suspicion,danger:JSON.stringify(__qa.state.danger)})),before);
 await interact();await choose(0);await dismiss();assert.equal(await page.evaluate(()=>__qa.state.scene),'bandejas');assert(await page.evaluate(()=>__qa.state.inventory.includes('Requisição da ala leste')));
 await page.keyboard.press('i');assert((await page.locator('#modal').innerText()).includes('manter na ala leste'));await page.keyboard.press('Escape');
 await load('sigilo');await interact();await choose(1);await dismiss();assert(await page.evaluate(()=>__qa.state.flags.sharedWithNoah));assert(!await page.evaluate(()=>__qa.state.flags.eronBetrayed));
 await load('sinalGrade');await interact();await choose(0);await dismiss();assert.equal(await page.evaluate(()=>__qa.state.scene),'interrogatorio');assert(!await page.evaluate(()=>__qa.state.flags.cellOpen));
 await load('sinalGrade',s=>s.story.flags.tomasSignalKnown=true);await interact();await choose(2);await dismiss();assert.equal(await page.evaluate(()=>__qa.state.scene),'sinalGrade');
 await interact();await choose(1);await dismiss();assert(await page.evaluate(()=>__qa.state.flags.tomasSignalAnswered));assert(!await page.evaluate(()=>__qa.state.flags.cellOpen||__qa.state.flags.tomasRescued));
 await page.keyboard.press('j');assert((await page.locator('#modal').innerText()).includes('duas batidas curtas e uma longa'));await page.screenshot({path:path.join(OUT,'sinal-no-caderno.png')});
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(OUT,'verificacao-puzzles.json'),JSON.stringify({errors,checks:['destino em branco','caixa errada sem custo','caixa correta','documento legível','compartilhar sem denunciar fonte','escutar sem sinal','ritmo errado sem bloqueio','resposta não abre grade','sinal anotado']},null,2));console.log('Puzzles e cenas na interface: OK');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
