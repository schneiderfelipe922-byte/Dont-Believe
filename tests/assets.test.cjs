const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
function boot(options={}){
 const requested=[];let attempt=0;
 class Image{
  set src(url){this.url=url;requested.push(url);this.naturalWidth=url.includes('sprites-e-idles/sprites.png')?512:64;this.naturalHeight=url.includes('sprites-e-idles/sprites.png')?1024:64;
   queueMicrotask(()=>{if(options.fail&&url.includes('sprites-e-idles/sprites.png')&&!attempt++){this.onerror();return;}
    if(options.stale&&url.includes('sprites-e-idles/sprites.png'))this.naturalHeight=509;
    this.onload();});
  }
 }
 const sandbox={Image,queueMicrotask};sandbox.window=sandbox;vm.runInNewContext(fs.readFileSync(path.join(ROOT,'javascript/assets.js'),'utf8'),sandbox);return {art:sandbox.GameArt,requested};
}
test('imagens e scripts recebem a revisão real de seus arquivos, inclusive atlas e novos objetos',async()=>{
 const {art,requested}=boot();await art.ready;assert.equal(art.status.failed.length,0);
 for(const name of ['sprites','fullMap','pickups','bedside','dialogue_mel']){
  const [relative,query]=art.urls[name].split('?'),hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,relative))).digest('hex').slice(0,12);
  assert.equal(query,'v='+hash);assert(art.images[name]);
 }
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
 for(const [,url,hash]of html.matchAll(/(?:src|href)="((?:javascript|css)\/[^?\"]+)\?v=([a-f0-9]+)"/g))assert.equal(hash,crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,url))).digest('hex').slice(0,12),url);
 assert(requested.every(url=>url.includes('?v=')));
});
test('atlas com recortes antigos é rejeitado e uma falha permite nova tentativa',async()=>{
 const old=boot({stale:true});await old.art.ready;assert(old.art.status.failed.includes('sprites'));assert.equal(old.art.images.sprites,undefined);
 const fresh=boot({fail:true});await fresh.art.ready;assert(fresh.art.status.failed.includes('sprites'));await fresh.art.retry();assert(fresh.art.images.sprites);assert.equal(fresh.art.status.failed.length,0);assert(fresh.requested.at(-1).includes('&retry=1'));
});
