/* Consequências persistentes: revistas, ferimentos e transferência. */
(function(root){
'use strict';
const G=root.GameStory||(typeof require==='function'?require('./story.js'):null),A=root.GameAdventure||(typeof require==='function'?require('./adventure.js'):null);
const clone=s=>JSON.parse(JSON.stringify(s));
function normalize(s){const legacy=!s.danger;s.danger=Object.assign({warnings:0,wounds:0,turns:null,encounter:null,grace:0},s.danger||{});if(legacy&&A.act(s)>=3&&!s.flags.committed&&!G.scenes[s.scene].ending)s.danger.turns=10;return s;}
const init=G.initial;G.initial=()=>normalize(init());
const oldNormalize=A.normalize;A.normalize=s=>normalize(oldNormalize(s));
function log(s,text){s.events.push({title:'O preço da escolha',changes:[text]});s.events=s.events.slice(-80);return text;}
function clock(s,cost){normalize(s);if(s.danger.turns===null||s.flags.committed||G.scenes[s.scene].ending)return [];
 s.danger.turns=Math.max(0,s.danger.turns-cost);const lines=[];
 if(s.danger.turns===0&&!s.flags.tomasRescued&&!s.flags.tomasTransferred){s.flags.tomasTransferred=true;lines.push(log(s,'O último sino tocou. Tomas foi transferido; a cela interna está vazia. Não será possível resgatá-lo nesta partida.'));}
 return lines;
}
function storyCost(s,i){return A.act(s)>=3&&!s.flags.committed&&!G.scenes[s.scene].ending&&!(s.scene==='preparar'||(s.scene==='subsolo'&&i===2)||(s.scene==='fechadura'&&i===3))?1:0;}
function status(s){normalize(s);return 'Advertências '+s.danger.warnings+'/3 · Ferimentos '+s.danger.wounds+'/2'+(s.flags.tomasTransferred?' · TOMAS TRANSFERIDO':s.flags.tomasRescued?' · Tomas protegido':s.danger.turns!==null?' · Transferência em '+s.danger.turns+' ações':'');}
function startEncounter(s,kind='patrol'){s=clone(s);normalize(s);if(s.danger.encounter||G.scenes[s.scene].ending)return s;
 if(kind==='patrol'&&(s.danger.warnings>=3||s.suspicion>=8)){s.scene='captura';s.pending={text:'O vigia reconhece Kali antes de ouvir uma explicação. A ficha já está marcada. Desta vez, não há advertência: a porta se fecha.',note:'Três advertências anteriores ou vigilância 8: a próxima detecção termina em captura.'};return s;}
 s.danger.encounter={kind};return s;
}
function options(s){normalize(s);const final=s.danger.encounter?.kind==='checkpoint';return [
 {id:'cover',label:'Entregar a braçadeira de serviço.',lock:!s.flags.cover?'Você não tem uma braçadeira válida.':null,hint:'Consome o disfarce. Adultos −2; essa autorização não poderá ser usada de novo.'},
 {id:'bread',label:'Oferecer a porção de pão.',lock:!s.inventory.includes('Pão')?'Você não tem pão.':null,hint:'O vigia fica com o pão. Você perde a possibilidade de entregá-lo a Mira.'},
 {id:'proof',label:'Entregar o registro assinado.',lock:!s.flags.proof?'Você não possui a prova original.':null,hint:'Perda definitiva da prova. Sem Mira 2, a rota coletiva deixa de funcionar.'},
 {id:'eron',label:'Entregar o nome de Eron.',lock:s.flags.eronBetrayed?'Eron já foi denunciado.':s.flags.committed?'O cerco já começou: não há novo acordo.':A.act(s)<2?'O vigia ainda não aceita uma denúncia.':null,hint:'Eron é preso. Você perde sua ajuda, a distração e as duas rotas de grupo.'},
 {id:'resist',label:final?'Forçar passagem e suportar o golpe.':'Recusar a revista e escapar do braço do vigia.',hint:s.danger.wounds>=2?'Você já está muito ferido. Resistir termina em captura.':'Um ferimento permanente e vigilância +2. Sua velocidade cai; a patrulha acelera por 20 segundos.'}
 ];}
function resolve(s,id){const c=options(s).find(c=>c.id===id);if(!s.danger.encounter||!c||c.lock)throw Error('Resposta de revista indisponível');const next=clone(s),d=next.danger,final=d.encounter.kind==='checkpoint';let text='';
 d.encounter=null;d.warnings=Math.min(3,d.warnings+1);d.grace=12;
 if(id==='cover'){next.flags.cover=false;next.flags.coverBurned=true;next.adults=Math.max(0,next.adults-2);next.inventory=next.inventory.filter(x=>x!=='Braçadeira de serviço');text='— Só valeu desta vez. O vigia corta a braçadeira. Sua autorização acabou; o favor cobrou o disfarce.';}
 if(id==='bread'){next.inventory=next.inventory.filter(x=>x!=='Pão');next.flags.breadBribe=true;text='O vigia esconde o pão dentro da capa. — Eu não vi você. Mira ficará sem a porção que você guardou.';}
 if(id==='proof'){next.flags.proof=false;next.flags.proofLost=true;next.inventory=next.inventory.filter(x=>x!=='Registro de transferência');text='O adulto rasga a assinatura diante de Kali. Os fatos continuam na memória, mas a prova original não existe mais.';}
 if(id==='eron'){next.flags.eronBetrayed=true;next.flags.escapePlan=false;next.flags.distracted=false;next.flags.organized=false;next.eron=0;next.suspicion=Math.max(0,next.suspicion-2);text='Kali diz o nome. O vigia leva Eron para a ala leste. Ao passar, Eron olha para Kali: — Você sabia o que iam fazer. A promessa de fuga acaba ali.';}
 if(id==='resist'){if(d.wounds>=2){next.scene='captura';text='A perna cede antes da curva. Kali não consegue escapar de um terceiro golpe.';}else{d.wounds++;next.suspicion=Math.min(9,next.suspicion+2);d.hunt=20;text='Kali se solta, mas o bastão atinge sua perna. O ferimento reduz seus passos pelo resto da partida. O vigia chama a ronda.';}}
 if(final)next.flags.checkpointPassed=true;
 const changes=[log(next,status(next)),...clock(next,2)];next.history.push({scene:s.scene,title:final?'O cerco do portão':'Revista no corredor',choice:c.label,note:text});next.pending={text,note:'A revista consome 2 ações do prazo, quando ele está ativo. Você tem 12 segundos de recuo sem nova detecção.',changes};return next;
}
const take=G.take;G.take=(s,i)=>{normalize(s);if(s.danger.encounter)throw Error('Resolva a revista antes de continuar');let next=take(s,i);normalize(next);const lines=[];
 if(next.scene==='confinamento'&&next.danger.turns===null){next.danger.turns=10;lines.push(log(next,'A transferência de Tomas ocorre após 10 ações. Caminhar, ler e consultar o diário não gastam o prazo.'))}
 if(next.flags.eronBetrayed&&!s.flags.eronBetrayed){next.eron=0;next.flags.escapePlan=false;next.flags.distracted=false;next.flags.organized=false;lines.push(log(next,'Eron foi preso. Sua ajuda e as rotas coletivas foram perdidas.'));}
 if(next.flags.transferDelayed&&!s.flags.transferDelayed&&!next.flags.tomasTransferred){next.danger.turns+=3;lines.push(log(next,'Ordem destruída: mais 3 ações antes da transferência.'));}
 lines.push(...clock(next,storyCost(s,i)));
 if(next.flags.tomasTransferred)next.flags.tomasRescued=false;
 if(s.scene==='disfarce'&&next.scene==='voz'&&next.flags.eronBetrayed){next.scene='captura';next.pending={text:'A chave abre a grade, mas Eron está preso e não há quem reúna os moradores. A denúncia destruiu o apoio necessário para voltar.',note:'Eron denunciado: retorno coletivo bloqueado.'};}
 if(s.scene==='portao'&&s.flags.escapeGroup&&!A.groupReady(s)){next.scene='captura';next.pending={text:'Sem a prova e sem a confiança de Mira, a fila se desfaz diante da última ordem. O vigia retoma o portão.',note:'Perder a prova na revista alterou a preparação da rota.'};}
 if(next.pending)next.pending.changes=[...(next.pending.changes||[]),...lines];
 if(next.scene==='travessia'&&s.scene!=='travessia'&&!next.flags.checkpointPassed)next=startEncounter(next,'checkpoint');
 return next;
};
const perform=A.perform;A.perform=(s,id,i)=>{normalize(s);if(s.danger.encounter)throw Error('Resolva a revista antes de agir');const result=perform(s,id,i);normalize(result.state);result.changes.push(...clock(result.state,A.act(s)>=3?1:0));return result;};
const cons=A.consequences;A.consequences=s=>{normalize(s);return [...cons(s),s.flags.eronBetrayed?'Eron foi denunciado por Kali e permaneceu preso. Sua ausência desfez o plano coletivo.':'Kali não entregou Eron aos vigias.',s.flags.tomasTransferred?'O prazo se esgotou: Tomas foi transferido antes de poder ser alcançado.':'A transferência de Tomas não se consumou antes do fim deste caminho.',s.flags.proofLost?'Kali entregou o registro durante uma revista. A prova foi destruída.':s.flags.coverBurned?'A braçadeira foi sacrificada para atravessar uma revista.':'',`Kali terminou com ${s.danger.wounds} ferimento(s) e ${s.danger.warnings} advertência(s).`].filter(Boolean);};
const rescueText=G.scenes.resgate.text;G.scenes.resgate.text=s=>s.flags.tomasTransferred?['Mira segura a grade. — Ouvi a carruagem. Levaram Tomas enquanto esperávamos. A divisória está vazia. Não diga que ainda dá tempo para ele.',...rescueText.slice(1)]:rescueText;
const archiveText=G.scenes.arquivo.text;G.scenes.arquivo.text=s=>s.flags.tomasTransferred?['T-17. Tomas. A ordem previa saída ao amanhecer; a carruagem já partiu. A assinatura foi feita antes da transferência, mas agora o nome também desapareceu da cela.','Kali reconhece a data e o destino: outra unidade da Actras. O papel ainda pode comprovar o procedimento. Destruí-lo não desfaz a viagem.',archiveText[2]]:archiveText;
const confinementText=G.scenes.confinamento.text;G.scenes.confinamento.text=s=>{const lines=confinementText(s);if(s.flags.tomasTransferred)lines[1]='Mira continua na primeira cela. Tomas foi transferido; sua divisória está vazia. Ainda é possível abrir a grade para Mira.';return lines;};
const api={normalize,clock,storyCost,status,startEncounter,options,resolve};root.GameDanger=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
