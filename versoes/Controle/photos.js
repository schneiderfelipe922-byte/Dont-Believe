(function(root){
'use strict';
const photos={
 family:{id:'family',name:'Fotografia da minha família',hint:'Fotografia antiga',room:'Dormitório',x:7.8*24,y:7*24,flag:'familyPhoto',src:'assets/fotos/kali-com-familia.png',alt:'Kali entre Daty e Inauri, em pé diante de uma casa simples perto de um bosque.',description:'Uma casa perto do bosque. Daty, Inauri e eu, juntos.'},
 friends:{id:'friends',name:'Fotografia de Eron e Tomas',hint:'Fotografia entre os livros',room:'Sala de leitura',x:36.5*24,y:7*24,flag:'friendsPhoto',src:'assets/fotos/eron-tomas-orfanato.png',alt:'Eron e Tomas lado a lado, com os braços sobre os ombros um do outro, no orfanato.',description:'Eron e Tomas abraçados no orfanato, antes do desaparecimento.'}
};
const M=root.GameWorld||(typeof require==='function'?require('./world.js'):null);
for(const p of Object.values(photos))Object.assign(p,M.place(M.remap(p)));
function found(s,id){return !!photos[id]&&s.inventory.includes(photos[id].name);}
function points(s){return Object.values(photos).filter(p=>!found(s,p.id)).map(p=>({...p,photo:p.id,name:'Examinar: '+p.hint}));}
function collect(s,id){const p=photos[id];if(!p)return false;const fresh=!found(s,id);if(fresh)s.inventory.push(p.name);s.flags[p.flag]=true;return fresh;}
function text(s,id){
 if(id==='family')return 'São meus pais… Daty e Inauri. Agora eu lembro. Aquela casa, o bosque… e eu ali, entre os dois. Como pude esquecer o rosto deles?';
 if(s.flags.tomasRescued)return 'Então é o Tomas… Eron parecia tão feliz ao lado dele. Antes de tudo isso. Ainda bem que consegui encontrá-lo.';
 return 'Então esse era o Tomas… Eron parecia tão feliz ao lado dele. O que será que aconteceu com ele?';
}
const api={photos,found,points,collect,text,byName:name=>Object.values(photos).find(p=>p.name===name)};
root.GamePhotos=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
