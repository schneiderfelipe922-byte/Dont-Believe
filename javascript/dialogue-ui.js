(function(root){
'use strict';
const people=['kali','noah','mira','eron','tomas','vigia','lider','daty','inauri'];
const aliases={guard:'vigia',leader:'lider'};
function speakerKey(kind){return aliases[kind]||(people.includes(kind)?kind:'neutral');}
const portraitKeys=Object.fromEntries(people.map(name=>[name,'dialogue_'+name]));
function paginate(texts,fits){
 const result=[];let current=[];
 for(const paragraph of texts.flatMap(t=>String(t).split('\n')).filter(t=>t.trim())){
  if(fits([...current,paragraph])){current.push(paragraph);continue;}
  if(current.length){result.push(current);current=[];}
  const words=paragraph.trim().split(/\s+/);let start=0;
  while(start<words.length){
   let lo=1,hi=words.length-start,best=1;
   while(lo<=hi){const count=Math.floor((lo+hi)/2);if(fits([words.slice(start,start+count).join(' ')])){best=count;lo=count+1;}else hi=count-1;}
   const part=words.slice(start,start+best).join(' ');start+=best;
   if(start<words.length)result.push([part]);else current=[part];
  }
 }
 if(current.length)result.push(current);return result.length?result:[['…']];
}
function portrait(context,width,height,kind,images){
 const art=images?.[portraitKeys[speakerKey(kind)]];
 if(!art||!art.width||!art.height)return false;
 const scale=Math.min(width/art.width,height/art.height),w=art.width*scale,h=art.height*scale;
 context.imageSmoothingEnabled=true;context.drawImage(art,(width-w)/2,height-h,w,h);return true;
}
function bindChoices(container){
 const buttons=[...container.querySelectorAll('button')];let current=-1;
 function select(index,focus=false,reveal=false){
  const target=buttons[index];if(!target||target.disabled)return false;current=index;
  buttons.forEach((b,i)=>{b.dataset.selected=String(i===current);if(i===current)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  if(focus)target.focus({preventScroll:true});
  if(reveal){
   const scroll=container.closest?.('.dialogue-scroll');
   if(scroll){const option=target.getBoundingClientRect(),box=scroll.getBoundingClientRect();
    if(option.bottom>box.bottom)scroll.scrollTop+=option.bottom-box.bottom;
    else if(option.top<box.top)scroll.scrollTop-=box.top-option.top;
   }
  }
  return true;
 }
 buttons.forEach((b,i)=>{b.addEventListener('focus',()=>select(i));b.addEventListener('pointerenter',()=>select(i));});
 const first=buttons.findIndex(b=>!b.disabled);if(first!==-1)select(first,true);
 return {select,move(delta){if(!buttons.some(b=>!b.disabled))return;for(let step=1;step<=buttons.length;step++){const next=(current+delta*step+buttons.length*2)%buttons.length;if(select(next,true,true))return;}},activate(){buttons[current]?.click();},get selectedIndex(){return current;}};
}
const names={kali:'Kali',noah:'Noah',mira:'Mira',eron:'Eron',tomas:'Tomas',vigia:'Vigia',lider:'Líder',daty:'Daty',inauri:'Inauri'};
const api={people,names,speakerKey,portraitKeys,portrait,bindChoices,paginate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DialogueUI=api;
})(typeof window==='undefined'?globalThis:window);
