/* Tela cheia preserva os controles, as consultas e o estado da partida. */
(function(){
'use strict';
const root=document.documentElement,button=document.getElementById('fullscreen');
if(!button)return;
let expanded=false,busy=false,previous=false;
const nativeElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
const active=()=>!!nativeElement()||expanded;
function sync(){
 const on=active();root.classList.toggle('is-fullscreen',on);
 // Ao entrar, recoloca uma consulta aberta acima da superfície de tela cheia.
 const modal=document.getElementById('modal'),focus=document.activeElement;
 if(on&&!previous&&modal?.open){modal.close();modal.showModal();if(focus?.isConnected)focus.focus({preventScroll:true});}
 previous=on;
 button.setAttribute('aria-pressed',String(on));
 button.setAttribute('aria-label',on?'Sair da tela cheia':'Entrar em tela cheia');
 button.title=on?'Sair da tela cheia (F ou Esc)':'Tela cheia (F)';
 button.querySelector('.fullscreen-label').textContent=on?'SAIR DA TELA CHEIA':'TELA CHEIA';
 // Aguarda o layout antes de ajustar a resolução do cenário.
 requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}
async function toggle(){
 if(busy)return;busy=true;
 try{
  if(nativeElement()){
   const exit=document.exitFullscreen||document.webkitExitFullscreen;
   if(exit)await exit.call(document);
  }else if(expanded){expanded=false;}
  else{
   const enter=root.requestFullscreen||root.webkitRequestFullscreen;
   if(enter){try{await enter.call(root);}catch{expanded=true;}}
   else expanded=true;
  }
 }catch{
  // Uma saída recusada pelo navegador mantém o estado atual do jogo.
 }finally{busy=false;sync();}
}
button.addEventListener('click',toggle);
for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,sync);
document.addEventListener('keydown',e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||e.target?.matches?.('input,textarea,select,[contenteditable="true"]'))return;
 if(e.code==='KeyF'){e.preventDefault();e.stopImmediatePropagation();toggle();}
 else if(e.code==='Escape'&&active()){
  // Esc sai da tela cheia antes de afetar a conversa ou abrir a pausa.
  e.preventDefault();e.stopImmediatePropagation();toggle();
 }
},true);
sync();
})();
