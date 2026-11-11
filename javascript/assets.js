(function(root){
'use strict';
const urls={fullMap:'assets/cenarios/orfanato-nanquim-v3-guache-v2.png',floorTiles:'assets/cenarios/piso.png',doorTiles:'assets/cenarios/portas.png',endings:'assets/finais/finais-nanquim-kali-v2-guache-v2.png',sprites:'assets/sprites-e-idles/sprites.png',portraits:'assets/personagens/portraits.png',altar:'assets/cenarios/altar-nanquim-v1-guache-v2.png',pickups:'assets/exploracao/objetos.png',bedside:'assets/exploracao/criado-mudo.png',prologueFamily:'assets/prologo/pais-olhando-tras-nanquim-v1-guache-v2.png',prologueRoad:'assets/prologo/estrada-nanquim-v1-guache-v2.png',prologueLoss:'assets/prologo/pais-acidente-nanquim-v1-guache-v2.png',prologueChild:'assets/prologo/kali-crianca-sprites.png'};
for(const name of ['kali','noah','mira','eron','tomas','vigia','lider','daty','inauri','mel'])urls['dialogue_'+name]='assets/dialogos/retratos/'+name+'.png';
// BEGIN GENERATED ART REVISIONS — tools/prepare-web-assets.py
const revisions={"fullMap":"b4560a8f42f8","floorTiles":"39a5393b4cdb","doorTiles":"d1760b1ff8f0","endings":"201ac00c6f3a","sprites":"2dc5493baec2","portraits":"da73018655f7","altar":"0a98419aa86e","pickups":"2d22715c8e01","bedside":"f9ab8720dcaa","prologueFamily":"c8848a064215","prologueRoad":"817fbdcbbb63","prologueLoss":"226bdd946e31","prologueChild":"ded5015f7169","dialogue_kali":"07ff2fa79a6b","dialogue_noah":"b8779c6a7f3b","dialogue_mira":"344e54783c75","dialogue_eron":"72b10141f4c9","dialogue_tomas":"4788fb2d28b8","dialogue_vigia":"f4edf095b285","dialogue_lider":"4bde90d7456f","dialogue_daty":"79fb300ee81d","dialogue_inauri":"ed6db085d600","dialogue_mel":"d880efdc9bd0"};
const spriteSize=[512,1024];
// END GENERATED ART REVISIONS
for(const name of Object.keys(urls))urls[name]+='?v='+revisions[name];
const images={},status={ready:false,failed:[]};let attempt=0;
function load(names){
 status.ready=false;
 return Promise.all(names.map(name=>new Promise(resolve=>{
  const image=new Image();
  const fail=()=>{delete images[name];if(!status.failed.includes(name))status.failed.push(name);resolve();};
  image.onload=()=>{
   if(name==='sprites'&&(image.naturalWidth!==spriteSize[0]||image.naturalHeight!==spriteSize[1])){fail();return;}
   images[name]=image;status.failed=status.failed.filter(key=>key!==name);resolve();
  };
  image.onerror=fail;
  image.src=urls[name]+(attempt?'&retry='+attempt:'');
 }))).then(()=>{status.ready=true;return images;});
}
const api={urls,images,status,revisions,spriteSize,portraits:{kali:0,noah:1,mira:2,eron:3,guard:4,leader:5},retry(){attempt++;api.ready=load(status.failed.slice());return api.ready;}};
api.ready=load(Object.keys(urls));root.GameArt=api;
})(window);
