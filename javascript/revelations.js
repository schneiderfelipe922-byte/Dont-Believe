/* Revelações persistentes. O chamador bloqueia a simulação enquanto active=true. */
(function(root){
'use strict';
const scenes={
 laundry:{title:'A roupa T-17',src:'assets/revelacoes/roupa-t17-v2-guache-v2.png',alt:'Máquina de lavar vertical aberta diante de uma parede, com roupa úmida, costura azul e etiqueta T-17 sobre a borda e um cesto de roupas sujas ao lado.',lines:()=>[['KALI','T-17… O mesmo número que encontrei na cama.'],['KALI','A roupa dele ficou aqui. Isso não combina com a história da transferência.'],['KALI','Preciso conferir para onde mandaram essas peças.']]},
 warehouse:{title:'Pertences sem dono',src:'assets/revelacoes/armazem-v2.png',alt:'Da porta do armazém, uma sala com malas, cartas, chapéus, relógios, roupas e brinquedos espalhados junto às paredes.',lines:s=>[['KALI','Tudo isso pertencia a alguém.'],['KALI','Cartas, roupas… até brinquedos. Guardaram as coisas e apagaram os nomes.'],['KALI',s.flags.eliasRoom?'Talvez alguma coisa aqui explique quem dormia naquele quarto.':'Talvez ainda existam nomes nas etiquetas.']]},
 tomas:{title:'Uma voz atrás das grades',src:'assets/revelacoes/tomas-cela-v2-guache-v2.png',alt:'Tomas muito magro, com óculos e moletom claro largo, apoia-se nas grades da cela.',lines:()=>[['TOMAS','Ei… por favor. Me ajuda.'],['KALI','Tomas? Você está aqui…'],['TOMAS','Eles quase não trazem comida. Eu não consigo ficar em pé por muito tempo.'],['KALI','Preciso abrir essa grade.']]}
};
function normalize(s){
 if(!s.revelations||typeof s.revelations!=='object'||Array.isArray(s.revelations))s.revelations={seen:{},current:null};
 const r=s.revelations;if(!r.seen||typeof r.seen!=='object'||Array.isArray(r.seen))r.seen={};
 for(const id of Object.keys(r.seen))if(!scenes[id]||r.seen[id]!==true)delete r.seen[id];
 if(r.current){const c=r.current;if(!scenes[c.id])r.current=null;else{c.page=Number.isInteger(c.page)?Math.max(0,Math.min(c.page,scenes[c.id].lines(s).length-1)):0;c.replay=!!c.replay;}}
 return r;
}
function begin(s,id,replay=false){const r=normalize(s);if(!scenes[id]||r.current||(!replay&&r.seen[id])||(replay&&!r.seen[id]))return false;
 if(id==='tomas'&&!replay&&(s.flags.tomasTransferred||s.flags.tomasRescued))return false;
 r.current={id,page:0,replay};return true;
}
function advance(s){const r=normalize(s),c=r.current;if(!c)return null;
 if(c.page<scenes[c.id].lines(s).length-1){c.page++;return {done:false};}
 const first=!c.replay&&!r.seen[c.id];r.seen[c.id]=true;r.current=null;
 if(first){if(c.id==='laundry')s.flags.laundryObserved=true;if(c.id==='warehouse')s.flags.warehouseOpen=true;if(c.id==='tomas')s.flags.tomasSeen=true;}
 return {done:true,id:c.id,first};
}
function create({document:doc,getState,save,clearMovement,pause,finish=()=>{},reduced=()=>false}){
 const shell=doc.createElement('section');shell.id='revelation-screen';shell.hidden=true;shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-label','Revelação ilustrada');
 const img=doc.createElement('img'),caption=doc.createElement('div'),who=doc.createElement('p'),words=doc.createElement('p'),next=doc.createElement('button'),pauseButton=doc.createElement('button'),error=doc.createElement('div'),retry=doc.createElement('button');
 caption.className='revelation-caption';words.setAttribute('aria-live','polite');words.id='revelation-text';next.setAttribute('aria-describedby',words.id);pauseButton.className='revelation-pause';pauseButton.textContent='Pausar · Esc';retry.textContent='Tentar carregar a imagem';error.textContent='A imagem não carregou. Você pode tentar novamente ou continuar pelo texto. ';error.append(retry);error.className='revelation-error';error.hidden=true;caption.append(who,words,next);shell.append(img,pauseButton,error,caption);doc.getElementById('stage').append(shell);
 let token=0,busy=false,currentSrc='';
 function render(){const c=normalize(getState()).current;if(!c){shell.hidden=true;return;}const scene=scenes[c.id];shell.hidden=false;shell.dataset.reduced=String(reduced());shell.setAttribute('aria-label',scene.title);const line=scene.lines(getState())[c.page];who.textContent=line[0];words.textContent=line[1];next.textContent=c.page===scene.lines(getState()).length-1?'Voltar à exploração →':'Continuar →';if(currentSrc!==scene.src){currentSrc=scene.src;error.hidden=true;img.hidden=false;img.src=scene.src;img.alt=scene.alt;}next.disabled=busy;}
 async function step(){if(busy||shell.hidden)return;busy=true;const serial=++token;next.disabled=true;clearMovement();const result=advance(getState());save();if(result?.done){shell.classList.add('fading');await new Promise(resolve=>setTimeout(resolve,reduced()?0:180));if(serial!==token)return;shell.hidden=true;shell.classList.remove('fading');finish(result);}busy=false;render();if(!shell.hidden)next.focus();}
 next.addEventListener('click',step);pauseButton.addEventListener('click',pause);retry.addEventListener('click',()=>{error.hidden=true;img.hidden=false;img.src=currentSrc+'?retry='+Date.now();});img.addEventListener('error',()=>{img.hidden=true;error.hidden=false;});img.addEventListener('load',()=>{error.hidden=true;});
 return {get active(){return !shell.hidden;},show(){clearMovement();render();if(!shell.hidden)next.focus();},open(id,replay=false){if(!begin(getState(),id,replay))return false;save();this.show();return true;},advance:step,focus(){next.focus();},hide(){token++;busy=false;shell.hidden=true;shell.classList.remove('fading');},element:shell};
}
const api={scenes,normalize,begin,advance,create};root.GameRevelations=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
