(function(root){
'use strict';
const urls={fullMap:'assets/cenarios/orfanato-humanizado-v2.png',floorTiles:'assets/cenarios/piso.png',doorTiles:'assets/cenarios/portas.png',endings:'assets/finais/telas-finais-personagens-mel.png',sprites:'assets/sprites-e-idles/sprites.png',portraits:'assets/personagens/portraits.png',altar:'assets/cenarios/altar-pixel.png',pickups:'assets/exploracao/objetos.png',bedside:'assets/exploracao/criado-mudo.png',prologueFamily:'assets/prologo/kali-banco-traseiro-pai-corrigido-v4.png',prologueRoad:'assets/prologo/estrada-noturna-desenho-simples-v4.png',prologueLoss:'assets/prologo/pais-no-carro-desenho-simples-v5.png',prologueChild:'assets/prologo/kali-crianca-sprites.png'};
for(const name of ['kali','noah','mira','eron','tomas','vigia','lider','daty','inauri','mel'])urls['dialogue_'+name]='assets/dialogos/retratos/'+name+'.png';
// BEGIN GENERATED ART REVISIONS — tools/prepare-web-assets.py
const revisions={"fullMap":"67dc697ae582","floorTiles":"39a5393b4cdb","doorTiles":"d1760b1ff8f0","endings":"f5d9d5adc6d3","sprites":"2dc5493baec2","portraits":"da73018655f7","altar":"75692bb814e2","pickups":"2d22715c8e01","bedside":"f9ab8720dcaa","prologueFamily":"8e84ad0f198f","prologueRoad":"a79670f84970","prologueLoss":"88a99ec401bb","prologueChild":"ded5015f7169","dialogue_kali":"ae6073e855ea","dialogue_noah":"5d398cc7038d","dialogue_mira":"a51269450720","dialogue_eron":"448ad42ea3c2","dialogue_tomas":"cd13e6268163","dialogue_vigia":"757c0d8eaf90","dialogue_lider":"ccfb028347c2","dialogue_daty":"e130229b6cb6","dialogue_inauri":"b83261e26766","dialogue_mel":"49556a269803"};
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
