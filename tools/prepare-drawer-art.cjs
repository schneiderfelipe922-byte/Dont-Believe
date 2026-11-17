/* Mechanical atlas packing only; artwork authored with image_gen. */
const sharp=require(process.env.SHARP_MODULE_PATH||'sharp');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const source=path.join(root,'assets/exploracao/fontes/gavetas-guache-v1.png');
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const boxes=[0,1].map(cell=>{
  let left=info.width,top=info.height,right=0,bottom=0;
  for(let y=0;y<info.height;y++)for(let x=Math.floor(cell*info.width/2);x<Math.floor((cell+1)*info.width/2);x++){
   if(data[(y*info.width+x)*4+3]>128){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  }
  return {left,top,width:right-left+1,height:bottom-top+1};
 });
 const layers=[];
 for(let i=0;i<2;i++)layers.push({input:await sharp(source).extract(boxes[i]).resize(288,168,{fit:'fill'}).png().toBuffer(),left:(i*48+6)*8,top:30*8});
 await sharp({create:{width:768,height:512,channels:4,background:'#00000000'}}).composite(layers).png().toFile(path.join(root,'assets/exploracao/gavetas-guache-v1.png'));
 console.log(JSON.stringify({sourceBoxes:boxes,atlas:[768,512]}));
})().catch(e=>{console.error(e);process.exit(1);});
