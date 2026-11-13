(function(root){
'use strict';
const data=root.CharacterData||(typeof require==='function'?require('./character-data.js'):{});
const painted=root.PaintedCharacterData||(typeof require==='function'?require('./painted-sprites.js'):{});
function paintedFrame(kind,dir,step,images,idleSeconds){
 const name=({guard:'vigia',leader:'lider'})[kind]||kind,character=painted[name];if(!character)return null;
 const action=step>0&&character.tracks.walk?'walk':'idle',base=character.tracks[action],row=({down:0,left:1,right:2,up:3})[dir]??0;
 const source=base.directions?.[row]||base,frames=source===base?base.frames[row]:source.frames,img=images[source.image];if(!img)return null;
 const durations=action==='walk'?[140,140,140,140,140,140]:[450,250,450,250];let time=(action==='walk'?step*400:idleSeconds*1000)%durations.reduce((a,b)=>a+b,0),index=0;
 while(index<frames.length-1&&time>=durations[index])time-=durations[index++];const f=frames[index];
 return {painted:true,spec:{height:source.displayHeight,sourceHeight:source.sourceHeight},img,track:{anchor:f.anchor,bounds:[0,0,f.rect[2],f.rect[3]],frames:frames.map(f=>f.rect),durations},rect:f.rect,index};
}
function resolve(kind,dir,step,images,idleSeconds=0){images=images||root.GameArt?.images||{};if(Object.keys(images).some(k=>k.startsWith('painted_')))return paintedFrame(kind,dir,step,images,idleSeconds);const spec=data[kind],img=(images||root.GameArt?.images||{})[spec?.image];if(!spec||!img)return null;const idle=spec.idles?.[dir]||spec.idles?.down;const track=step<=0&&idle?idle:(spec.directions[dir]||spec.directions.down);let index=0;const elapsed=step>0?step*400:spec.idleAnimated?idleSeconds*1000:0;if(elapsed>0){const total=track.durations.reduce((a,b)=>a+b,0);let t=elapsed%total;while(index<track.frames.length-1&&t>=track.durations[index])t-=track.durations[index++];}return {spec,img,track,rect:track.frames[index],index};}
function draw(c,x,y,kind='kali',dir='down',step=0,idle=0,images){const frame=resolve(kind,dir,step,images,idle);if(!frame)return false;const{spec,img,track,rect}=frame,scale=spec.height/spec.sourceHeight;c.save();c.imageSmoothingEnabled=!!frame.painted;c.imageSmoothingQuality='high';c.drawImage(img,...rect,Math.round(x-track.anchor[0]*scale),Math.round(y-track.anchor[1]*scale),rect[2]*scale,rect[3]*scale);c.restore();return true;}
function portrait(c,w,h,kind,images){const f=resolve(kind,'down',0,images,0);if(!f)return false;const b=f.track.bounds,sw=b[2]-b[0],sh=(b[3]-b[1])*(kind==='mel'?1:.66),scale=Math.min(w*.90/sw,h*.96/sh);c.save();c.imageSmoothingEnabled=!!f.painted;c.drawImage(f.img,f.rect[0]+b[0],f.rect[1]+b[1],sw,sh,(w-sw*scale)/2,h-sh*scale,sw*scale,sh*scale);c.restore();return true;}
const api={data,resolve,draw,portrait};root.CharacterSprites=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
