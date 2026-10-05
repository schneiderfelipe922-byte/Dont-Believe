(function(root){
'use strict';
const urls={fullMap:"assets/mapa sem portas.png",floorTiles:'piso.png',doorTiles:'portas.png',endings:'assets/finais/telas-finais-personagens-mel.png',sprites:'assets/sprites.png',portraits:'assets/portraits.png',altar:'assets/altar-pixel.png'};

const images={},status={ready:false,failed:[]};
const ready=Promise.all(Object.entries(urls).map(([name,url])=>new Promise(resolve=>{const img=new Image();img.onload=()=>{images[name]=img;resolve();};img.onerror=()=>{status.failed.push(name);resolve();};img.src=url;}))).then(()=>{status.ready=true;return images;});
root.GameArt={urls,images,status,ready,portraits:{kali:0,noah:1,mira:2,eron:3,guard:4,leader:5}};
})(window);
