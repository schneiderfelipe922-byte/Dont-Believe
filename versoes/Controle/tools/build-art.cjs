// Rebuild portraits and altar art from the game's native pixel drawing code.
// NODE_PATH or CODEX_PRIMARY_RUNTIME_NODE_MODULES may point to @napi-rs/canvas.
const {createCanvas}=require((process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/':'')+'@napi-rs/canvas');
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),pixel=require('../pixel-art.js'),M=require('../world.js');
const atlas=createCanvas(1536,1024),ac=atlas.getContext('2d');['kali','noah','mira','eron','guard','leader'].forEach((k,i)=>pixel.portrait(ac,k,i%3*512,Math.floor(i/3)*512,512));fs.writeFileSync(path.join(root,'assets/portraits.png'),atlas.toBuffer('image/png'));
// A detail view of the actual pixel altar, for the inspection interaction.
const map=createCanvas(M.W*M.T,M.H*M.T);pixel.buildMap(map.getContext('2d'),M);
const detail=createCanvas(288,192),dc=detail.getContext('2d');dc.imageSmoothingEnabled=false;dc.drawImage(map,240,520,288,192,0,0,288,192);const cx=144,cy=70;
for(let y=-52;y<25;y++){const hw=y<-16?Math.floor((y+52)/3):12;dc.fillStyle='#251c32';dc.fillRect(cx-hw,cy+y,hw*2+1,1);dc.fillStyle='#aa82c3';dc.fillRect(cx-hw+1,cy+y,Math.max(0,hw-1),1);dc.fillStyle='#694784';dc.fillRect(cx+1,cy+y,Math.max(0,hw-1),1);}dc.fillStyle='#d3a8e0';for(const[x,y]of [[-4,-12],[3,0],[-3,9],[2,-24]]){dc.fillRect(cx+x,cy+y,2,5);dc.fillRect(cx+x-2,cy+y+2,6,1);}dc.fillStyle='#c0a772';dc.fillRect(cx-14,cy+25,29,4);
const altar=createCanvas(864,576),cc=altar.getContext('2d');cc.imageSmoothingEnabled=false;cc.drawImage(detail,0,0,864,576);fs.writeFileSync(path.join(root,'assets/altar-pixel.png'),altar.toBuffer('image/png'));console.log('Pixel portraits and altar generated.');

// O atlas dos personagens é reconstruído por import-characters.py.
