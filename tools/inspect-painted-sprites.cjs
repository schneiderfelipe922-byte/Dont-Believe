// Read alpha and record crop metadata; never rewrites the generated artwork.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),DIR=path.join(ROOT,'assets/sprites-e-idles/guache-v1');
(async()=>{const manifest=JSON.parse(fs.readFileSync(path.join(DIR,'generation.json'))),browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage(),characters={};
 for(const job of [...manifest.images,...(manifest.corrections||[])]){
  await page.goto('file://'+path.join(DIR,job.file));
  const info=await page.evaluate(async ({count,rows})=>{
   const image=document.querySelector('img');await image.decode();const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data,w=canvas.width,h=canvas.height,frames=[];let empty=0,maxAlpha=0;
   for(let i=3;i<pixels.length;i+=4){if(!pixels[i])empty++;maxAlpha=Math.max(maxAlpha,pixels[i]);}
   // Find painted silhouettes instead of assuming perfectly regular generated gutters.
   const visited=new Uint8Array(w*h),components=[],queue=new Int32Array(w*h);
   for(let pos=0;pos<w*h;pos++)if(!visited[pos]&&pixels[pos*4+3]>180){
    let read=0,write=1,area=0,left=w,top=h,right=0,bottom=0;queue[0]=pos;visited[pos]=1;
    while(read<write){const n=queue[read++],x=n%w,y=Math.floor(n/w);area++;left=Math.min(left,x);right=Math.max(right,x+1);top=Math.min(top,y);bottom=Math.max(bottom,y+1);
     for(const next of [x>0?n-1:-1,x<w-1?n+1:-1,y>0?n-w:-1,y<h-1?n+w:-1])if(next>=0&&!visited[next]&&pixels[next*4+3]>180){visited[next]=1;queue[write++]=next;}
    }
    if(area>100)components.push({left,top,right,bottom,area});
   }
   const figures=components.sort((a,b)=>b.area-a.area).slice(0,count*rows).sort((a,b)=>(a.top+a.bottom)-(b.top+b.bottom));
   if(figures.length!==count*rows)throw Error('Expected '+count*rows+' silhouettes, got '+figures.length);
   for(let row=0;row<rows;row++){const strip=figures.slice(row*count,(row+1)*count).sort((a,b)=>a.left-b.left).map(b=>{
    const left=Math.max(0,b.left-4),top=Math.max(0,b.top-4),right=Math.min(w,b.right+4),bottom=Math.min(h,b.bottom+4);
    return {rect:[left,top,right-left,bottom-top],anchor:[(right-left)/2,bottom-top-4],touchesCellEdge:left===0||right===w||top===0||bottom===h,paintedArea:b.area};
   });frames.push(strip)}
   return {width:w,height:h,transparentFraction:empty/(w*h),maxAlpha,frames};
  },{count:job.action==='walk'?6:4,rows:job.rows||4});
  if(info.frames.flat().some(f=>f.rect[2]<=0||f.rect[3]<=0))throw Error(job.file+': empty frame');
  const c=characters[job.who]??={height:manifest.heights[job.who],tracks:{}};const track={file:job.file,...info,sourceHeight:Math.max(...info.frames.flat().map(f=>f.rect[3])),displayHeight:job.who==='mel'&&job.action==='idle'?14:c.height};
  if(job.directions){c.tracks[job.action].directions??={};job.directions.forEach((direction,i)=>{c.tracks[job.action].directions[direction]={...track,frames:track.frames[i]};});}else c.tracks[job.action]=track;
  console.log(job.file,JSON.stringify({size:[info.width,info.height],transparent:info.transparentFraction,edges:info.frames.flat().filter(f=>f.touchesCellEdge).length}));
 }
 for(const c of Object.values(characters))c.sourceHeight=Math.max(...Object.values(c.tracks).flatMap(t=>t.frames.flat().map(f=>f.rect[3])));
 fs.writeFileSync(path.join(DIR,'frames.json'),JSON.stringify(characters,null,2));fs.writeFileSync(path.join(DIR,'frames.js'),'window.PaintedSprites='+JSON.stringify(characters)+';\n');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
