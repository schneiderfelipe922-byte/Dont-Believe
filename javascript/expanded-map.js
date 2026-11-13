/* Integração espacial dos cenários. Não altera custos, resgates ou condições dos finais. */
(function(root){
'use strict';
const M=root.GameWorld||(typeof require==='function'?require('./world.js'):null),G=root.GameStory||(typeof require==='function'?require('./story.js'):null),A=root.GameAdventure||(typeof require==='function'?require('./adventure.js'):null),S=root.GameScenery||(typeof require==='function'?require('./scenery.js'):null);
Object.assign(M.positions,{
 cellDoor:{x:435,y:1808},miraCell:{x:430,y:1620},tomas:{x:720,y:1620},
 records:{x:1200,y:1698},relic:{x:1350,y:1550},leader:{x:1350,y:1640},
 exit:{x:80,y:402},exitLatch:{x:110,y:402},escapeTurn:{x:180,y:402},
 washer:{x:1420,y:251},laundryBook:{x:1415,y:280},serviceCabinet:{x:1515,y:255},
 warehouseObjects:{x:1080,y:220},eliasRoom:{x:1120,y:870}
});
const transitions=[
 {id:'stairs-down',name:'Descer · celas do subterrâneo',x:1100,y:665,to:{x:155,y:1830},area:'ground'},
 {id:'stairs-up',name:'Subir · cozinha',x:155,y:1810,to:{x:1090,y:665},area:'basement'},
 {id:'altar-down',name:'Descer · arquivos pelo altar',x:285,y:700,to:{x:1575,y:1735},area:'ground',lock:'tunnel'},
 {id:'archive-up',name:'Subir · salão do obelisco',x:1575,y:1735,to:{x:285,y:700},area:'basement',lock:'tunnel'}
];
function unlocked(t,s,w){return !t.lock||s.flags.tunnel||w.tunnelOpen;}
function passagePoints(s,w){return transitions.filter(t=>t.area===S.floorAt(w.player).id).map(t=>({...t,passage:t.id,name:unlocked(t,s,w)?t.name:'Escotilha fechada · mecanismo do altar'}));}
function travel(id,s,w){const t=transitions.find(t=>t.id===id);if(!t||!M.canInteract(w.player,t,s,w,62))return {changed:false,text:'Aproxime-se da escada.'};if(!unlocked(t,s,w))return {changed:false,text:'A escotilha dos arquivos depende do mecanismo do altar. A escada da cozinha leva apenas às celas.'};
 const destination=M.place(t.to);if(!M.walkable(destination.x,destination.y,7,s,w))return {changed:false,text:'A passagem está bloqueada.'};
 Object.assign(w.player,destination,{step:0,dir:'down'});w.alert=0;if(s.danger)s.danger.grace=Math.max(s.danger.grace||0,2);return {changed:true,text:S.floorAt(w.player).name+' · '+M.roomAt(w.player.x,w.player.y)};
}
function navigationGoal(p,goal,s,w){
 if(!goal||S.floorAt(p).id===S.floorAt(goal).id)return goal;
 const archive=goal.x>=890&&S.floorAt(goal).id==='basement';
 const id=S.floorAt(p).id==='ground'?(archive&&unlocked(transitions[2],s,w)?'altar-down':'stairs-down'):(p.x>890&&p.y<1785?'archive-up':'stairs-up');
 const t=transitions.find(t=>t.id===id);return {...t,name:t.name,objective:t.name+' → '+goal.name,waypoint:true};
}
const observations={
 washer:['Roupa T-17','A roupa úmida tem uma costura azul e a etiqueta T-17. Isso não combina com uma bagagem pronta para partir. A roupa sozinha não diz onde Tomas está; compare com os registros e a requisição da cozinha.'],
 laundryBook:['Registro da lavanderia','As peças T-17 foram lavadas e guardadas dentro de OldHood. Nenhum destino de viagem foi anotado. O livro de chamadas na sala de leitura e a caixa da cozinha permitem continuar a investigação.'],
 warehouseObjects:['Pertences sem dono','Cartas, chapéus, relógios, roupas e brinquedos permanecem guardados. Há uma etiqueta com o nome Elias. Os objetos preservam um nome; não provam o que aconteceu com ele.'],
 eliasRoom:['Quarto abandonado','Uma cama desfeita, poeira e papéis esquecidos. A gaveta guarda o nome Elias. Nada aqui confirma uma transferência ou uma morte. O armazém pode conter outros pertences.']
};
function sceneryPoints(s,w){return [...Object.keys(observations).map(id=>({...M.positions[id],id,sceneryAction:id,name:'Examinar · '+observations[id][0]})),{...M.positions.serviceCabinet,id:'serviceCabinet',sceneryAction:'serviceCabinet',name:s.flags.warehouseOpen?'Examinar armário de serviço':'Procurar a chave do armazém'}].filter(p=>S.floorAt(p).id===S.floorAt(w.player).id);}
function examine(id,s,w){
 if(id==='serviceCabinet'){
  if(!s.flags.warehouseOpen){s.flags.warehouseOpen=true;if(!s.inventory.includes('Chave do armazém'))s.inventory.push('Chave do armazém');return {title:'Chave do armazém',text:'A chave está no armário de serviço. Sua etiqueta diz “Armazém”, a sala ao lado da leitura. Você pode explorar os pertences quando quiser; esta chave não é necessária para o resgate.'};}
  return {title:'Armário de serviço',text:'Você já guardou a chave do armazém.'};
 }
 const entry=observations[id];if(!entry)return null;
 w.observed??={};if(!w.observed[id]){w.observed[id]=true;s.history.push({scene:s.scene,title:entry[0],choice:'Examinar o cenário',note:entry[1]});}
 return {title:entry[0],text:entry[1]};
}
// Atualiza referências espaciais sem reescrever provas ou inventar consequências.
function relocateText(text){return text.replace(/ala leste/gi,'ala das celas no subterrâneo').replace('A escada da cozinha desce aos arquivos.','A escada da cozinha desce às celas; os arquivos só abrem pelo altar.');}
for(const scene of Object.values(G.scenes)){
 if(Array.isArray(scene.text))scene.text=scene.text.map(relocateText);
 else if(typeof scene.text==='function'){const original=scene.text;scene.text=s=>original(s).map(relocateText);}
 for(const c of Array.isArray(scene.choices)?scene.choices:[])for(const k of ['response','note','hint'])if(typeof c[k]==='string')c[k]=relocateText(c[k]);
}
for(const stage of Object.values(M.stages))stage[1]=relocateText(stage[1]);
M.stages.confinamento[1]='Fale com o vigia no corredor. A escada da cozinha leva às celas.';
M.stages.resgate[1]='Desça pela cozinha e alcance Mira na cela do subterrâneo.';
Object.assign(M,{transitions,passagePoints,travel,navigationGoal,sceneryPoints,examine});
const api={transitions,travel,navigationGoal,sceneryPoints,examine};root.GameExpandedMap=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
