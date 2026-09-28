(function(root){
'use strict';
const data=root.CharacterData||(typeof require==='function'?require('./character-data.js'):{});
function resolve(kind,dir,step,images){const spec=data[kind],img=(images||root.GameArt?.images||{})[spec?.image];if(!spec||!img)return null;const track=spec.directions[dir]||spec.directions.down;let index=0;if(step>0){const total=track.durations.reduce((a,b)=>a+b,0);let t=step*400%total;while(index<track.frames.length-1&&t>=track.durations[index])t-=track.durations[index++];}return {spec,img,track,rect:track.frames[index],index};}
function draw(c,x,y,kind='kali',dir='down',step=0,idle=0,images){const frame=resolve(kind,dir,step,images);if(!frame)return false;const{spec,img,track,rect}=frame,scale=spec.height/spec.sourceHeight;c.save();c.imageSmoothingEnabled=false;c.drawImage(img,...rect,Math.round(x-track.anchor[0]*scale),Math.round(y-track.anchor[1]*scale),rect[2]*scale,rect[3]*scale);c.restore();return true;}
function portrait(c,w,h,kind,images){const f=resolve(kind,'down',0,images);if(!f)return false;const b=f.track.bounds,sw=b[2]-b[0],sh=(b[3]-b[1])*.66,scale=Math.min(w*.90/sw,h*.96/sh);c.save();c.imageSmoothingEnabled=false;c.drawImage(f.img,f.rect[0]+b[0],f.rect[1]+b[1],sw,sh,(w-sw*scale)/2,h-sh*scale,sw*scale,sh*scale);c.restore();return true;}
const api={data,resolve,draw,portrait};root.CharacterSprites=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
