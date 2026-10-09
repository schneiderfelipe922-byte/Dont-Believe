/* Expansão de O Obelisco: pistas, memória social e puzzles sem tempo real. */
(function(root){
'use strict';
const G=root.GameStory||(typeof require==='function'?require('./story.js'):null);
const M=root.GameWorld||(typeof require==='function'?require('./world.js'):null);
const A=root.GameAdventure||(typeof require==='function'?require('./adventure.js'):null);
const S=root.GameSocial||(typeof require==='function'?require('./social.js'):null);
const clone=s=>JSON.parse(JSON.stringify(s));
function normalize(s){
 const memory=s.socialMemory&&typeof s.socialMemory==='object'?s.socialMemory:{};
 s.socialMemory={refusals:Array.isArray(memory.refusals)?[...new Set(memory.refusals.filter(x=>typeof x==='string'))]:[]};
 return s;
}
const init=G.initial;G.initial=()=>normalize(init());
const normal=A.normalize;A.normalize=s=>normalize(normal(s));
const C=(label,to,effect={},response='',hint='',requires=null)=>({label,to,effect,response,hint,note:hint,requires});
function scene(id,title,who,target,text,choices){
 G.scenes[id]={title,speaker:who,act:1,place:M.roomAt(M.positions[target].x,M.positions[target].y),text,choices};
 M.stages[id]=[target,title+' · consulte suas anotações no caderno.',title];
}
scene('destinoVazio','Destino em branco','kali','ledger',[
 'A etiqueta T-17 cabe ao lado da linha de Tomas. Kali passa o dedo pelas colunas: nome, entrada, saída, destino. A última não tem uma única palavra.',
 'Noah disse que houve uma transferência. O livro, porém, não registra para onde. A anotação sobre material enviado à cozinha é um fato; a viagem ainda é uma versão de alguém.',
 'Kali escreve no caderno: “Encontrei T-17 no registro. O destino está vazio. Vou procurar a caixa antes de aceitar uma explicação.”'
],[C('Registrar a contradição e procurar a caixa T-17.','cruzamento',{flags:{destinationCompared:true}},'A ausência de destino não prova tudo. Mas dá a Kali uma pergunta que pode ser conferida.','A descoberta ficou no caderno.')]);
for(const c of G.scenes.registro.choices)c.to='destinoVazio';
G.scenes.cruzamento.title='Qual caixa é de Tomas?';
G.scenes.cruzamento.text=[
 'Três caixas ocupam a bancada do fundo. As etiquetas são T-17, T-71 e M-04. A poeira cobre parte dos números, mas Kali consegue afastá-la com a manga.',
 'A costura do colchão guardava um número. Você pode conferir a etiqueta no caderno antes de escolher; olhar a caixa errada não consome nada.'
];
G.scenes.cruzamento.choices=[
 C('Examinar a caixa T-17.','bandejas',{flags:{kitchenClue:true,boxMatched:true},items:['Requisição da ala leste']},'Dentro estão a caneca lascada e a coberta azul. A requisição pede “manter na ala leste até a segunda chamada”. Não prepararam bagagem para uma viagem. Kali guarda a requisição e fecha a tampa.','A etiqueta corresponde à pista da cama.'),
 C('Examinar a caixa T-71.','cruzamento',{},'A caixa guarda panos de manutenção. Nada liga esses objetos a Tomas. Kali fecha a tampa e volta às etiquetas.','Posso tentar outra caixa. Não perco itens nem aumento a vigilância.'),
 C('Examinar a caixa M-04.','cruzamento',{},'Há peças de reposição, cada uma embrulhada em papel. Kali deixa tudo como encontrou. O número da cama pode ajudar.','Posso consultar o caderno antes de tentar novamente.')
];
scene('bandejas','Duas bandejas a mais','mira','mira',[
 'Mira lê a requisição. Desta vez, não precisa que Kali termine a pergunta. — Duas bandejas a mais vão para a ala leste. Nunca voltam com o resto.',
 '— Eles dizem que são para os vigias. Mas eu vi o vigia comer aqui. Não sei quem recebe a comida lá dentro. Sei que não pararam de levar.',
 'Kali junta as observações: a caixa ficou, o destino está vazio e a comida continua chegando à ala. Ainda precisa encontrar Tomas; os indícios não substituem uma pessoa.'
],[C('Anotar o que Mira observou, sem revelar seu nome.','plano',{flags:{mealMismatch:true,miraSourceProtected:true}},'— Obrigada por não fazer disso uma pergunta para todo o salão — Mira diz. — Agora precisamos de um caminho.','Registrei uma observação. A fonte continua protegida.')]);
scene('sigilo','Quem pode ouvir','kali','watch',[
 'A requisição está dobrada no bolso. Mostrá-la não exige contar quem reparou nas bandejas. Kali pode escolher quanto da descoberta vai deixar com outra pessoa.',
 'Eron procura Tomas. Noah repete as listas dos adultos. Guardar o papel também é uma escolha; a investigação não precisa de uma promessa feita em voz alta.'
],[
 C('Compartilhar a requisição com Eron, preservando Mira.','ronda',{flags:{sharedWithEron:true}},'Eron lê a assinatura e guarda o nome de Mira fora da conversa. — Então vamos procurar onde ainda levam comida. Não vou falar de quem te contou.','Eron conhecerá essa descoberta. Nenhum nome de fonte será entregue.'),
 C('Mostrar a Noah apenas a requisição, sem mencionar Mira.','ronda',{flags:{sharedWithNoah:true}},'— Isso é papel de serviço — Noah responde. — Você não devia ter pegado. Kali não revela quem o ajudou. Noah agora conhece a descoberta, mas não sua fonte.','Noah conhecerá a investigação. A fonte permanece protegida.'),
 C('Guardar a descoberta por enquanto.','ronda',{flags:{evidenceKeptPrivate:true}},'Kali fecha o bolso. Primeiro vai observar a ronda. Compartilhar depois continua sendo possível.','A descoberta continua no caderno e no inventário.')
]);
for(const id of ['plano','bilhete','ferramentas','explorar'])for(const c of G.scenes[id].choices)if(c.to==='ronda')c.to='sigilo';
scene('sinalGrade','Uma resposta atrás da grade','kali','cellDoor',[
 'Do corredor, Kali ouve uma caneca raspar no chão da ala restrita. Depois, uma batida na divisória. Ele permanece do lado de fora; a grade continua trancada.',
 'Um sinal conhecido poderia transformar o ruído em uma resposta. Sem ele, Kali ainda pode escutar. Não é preciso arriscar a porta para continuar a investigação.'
],[
 C('Escutar e registrar que há alguém na ala.','interrogatorio',{flags:{cellVoicesHeard:true}},'Uma voz pede água. Kali não consegue reconhecer quem falou. Registra apenas o que ouviu. O vigia o chama para a observação.','O som é um indício. Ainda preciso encontrar Tomas.'),
 C('Reproduzir duas batidas curtas e uma longa.','interrogatorio',{flags:{cellVoicesHeard:true,tomasSignalAnswered:true}},'Duas batidas curtas respondem, seguidas de uma longa. Era o sinal da partida que Eron contou. Kali registra: “A resposta combina com Tomas. Vou conferir quando puder entrar.” A grade permanece fechada.','Sinal reconhecido. Não abre a grade nem confirma um resgate.',s=>s.flags.tomasSignalKnown?null:'Eron pode contar a lembrança da partida, se eu tiver protegido seu nome ou entregue a carta.'),
 C('Tentar três batidas longas.','sinalGrade',{},'Nenhuma resposta acompanha o ritmo. Kali pode escutar ou consultar o sinal no caderno. A porta continua intacta.','Posso tentar novamente. Não há custo nem exigência de rapidez.')
]);
G.scenes.ronda.choices[0].to='sinalGrade';
A.actions.memoryTomas={target:'eronKitchen',name:'A partida interrompida',act:1,done:'tomasSignalKnown',who:'eron',title:'A partida interrompida',text:'Eron gira uma peça imaginária entre os dedos. — Quando queríamos terminar o jogo sem chamar o vigia, Tomas batia duas vezes curtinho e uma vez devagar. Eu respondia igual. Era nosso jeito de dizer “ainda estou aqui”.\nEle olha para Kali. — Não quero que vire uma brincadeira dos adultos.',choices:[{label:'Guardar o sinal e proteger essa lembrança.',requires:s=>s.flags.eronBetrayed?'Eron foi denunciado e não aceita compartilhar essa lembrança.':s.flags.protectedEron||s.errands?.['eron-letter']==='done'?null:'Primeiro proteja Eron diante do vigia ou entregue a carta de Tomas.',effect:{flags:{tomasSignalKnown:true}},response:'— Duas curtas e uma longa — Kali repete. — Não vou dar isso a eles.\nEron ergue o rosto. — Agora, se ouvir, você sabe que alguém está respondendo.'}]};
A.actions.noahVersion={target:'noahDorm',name:'Sua versão, Noah',act:1,done:'noahVersionQuestioned',who:'noah',title:'Sua versão, Noah',text:'— Você disse que Tomas saiu — Kali lembra. — O destino no registro está vazio e a comida continua indo para a ala. Você viu uma transferência ou ouviu dizer?\nNoah aperta a folha contra o peito. — O vigia disse. Não preciso conferir tudo o que ele fala.',choices:[{label:'“Vou conferir antes de repetir. Não vou seguir uma lista sem perguntar.”',requires:s=>s.flags.mealMismatch?null:'Compare a requisição com as bandejas que Mira observou primeiro.',effect:{flags:{noahVersionQuestioned:true}},response:'— Você sempre acha que sabe melhor? — Noah pergunta, a voz mais dura. — Eu tento ajudar e você complica tudo.\nKali não entrega outro nome. A irritação de Noah não prova uma viagem nem muda o registro.'}]};
const availability=A.available;A.available=(id,s)=>availability(id,s)&&(!['memoryTomas','noahVersion'].includes(id)||A.act(s)<3)&&!(id==='memoryTomas'&&(s.flags.eronBetrayed||!(s.flags.protectedEron||s.errands?.['eron-letter']==='done')))&&!(id==='noahVersion'&&(!s.flags.mealMismatch||s.flags.miraTaken));
const sidePoints=A.points;A.points=(s,w)=>sidePoints(s,w).map(p=>p.action==='memoryTomas'?{...p,...S.actorPoint('eron',s,w)}:p.action==='noahVersion'?{...p,...S.actorPoint('noah',s,w)}:p);
const baseConversation=S.conversation;
const originalInfo=S.itemInfo;
const documents={
 'Etiqueta T-17':'Retirei esta etiqueta da terceira costura da cama de Tomas. Está escrito T-17. Preciso comparar com o livro de chamadas.',
 'Cópia do registro T-17':'Copiei a linha de Tomas: T-17. A coluna de destino está vazia e há uma anotação sobre material enviado à cozinha. Na margem, anotei sino → chama → raiz.',
 'Página original T-17':'A página original associa T-17 a Tomas, deixa o destino vazio e registra material enviado à cozinha. Retirei a folha; a falta pode ser percebida. A ordem do altar é sino → chama → raiz.',
 'Requisição da ala leste':'Encontrei na caixa T-17: “manter na ala leste até a segunda chamada”. A caneca e a coberta de Tomas estavam juntas. O papel não registra uma viagem.',
 'Registro de transferência':'T-17. Tomas. Ala leste, cela interna. Saída prevista: amanhecer. A assinatura já consta como recebido. O documento de Mira foi preparado da mesma maneira. O destino é outra unidade da Actras.',
 'Símbolo do Luzitruismo':'Reconheci o símbolo da minha família no envelope com a data do acidente. O cordão ainda tem barro no nó. Não encontrei uma resposta sobre meus pais junto dele.',
 'Horário da ronda':'Observei que a passagem fica disponível quando o vigia retorna depois do sino. Preciso esperar a volta; usar esse intervalo ainda deixa sinais.',
 'Braçadeira de serviço':'Os adultos reconhecem esta braçadeira. Ela permite apresentar meu serviço, mas não substitui o preparo de uma fuga. Se a confiscarem, perco a cobertura.'
};
S.itemInfo=name=>documents[name]?{name,type:'bilhete',text:documents[name]}:originalInfo(name);
S.conversation=(who,s)=>{
 normalize(s);let line=baseConversation(who,s);
 if(who==='mira'&&!(s.flags.miraTaken&&!s.flags.rescued)){
  if(s.mira>=5)line={title:'Posso terminar a frase',text:'Mira deixa a caneca sobre a mesa e fica ao lado de Kali, sem cortar a frase para conferir o corredor. — Eu queria te mostrar um desenho. Antes escondia até o lápis.\nEla abre um pequeno sorriso. — Ainda tenho medo daqui. Com você, consigo falar de outras coisas também.'+(s.flags.rescued?'\n— Agora posso acompanhar os outros. Você abre a passagem; eu fico com quem precisar.':'')};
  else if(s.mira>=2)line={title:'Você voltou',text:'Mira reconhece Kali antes de recolher as mãos. — Você voltou. Eu estava pensando no que queria te contar.\nEla fala baixo, mas já não interrompe cada palavra. — Obrigada por fazer o que combinou. Tenho mais uma coisa para mostrar quando houver espaço.'};
  if(s.flags.rescued)line={title:'A grade ficou para trás',text:'Mira olha para a passagem da cozinha. — Você abriu a porta. Eu ainda escuto as chaves, mas não estou mais esperando atrás da grade.\nEla se volta para Kali. — Agora precisamos sair de verdade. Posso acompanhar quem tiver dificuldade. Me diga quando o caminho estiver pronto.'+(s.mira>=5?'\nEla deixa a caneca sobre a mesa e termina a frase sem recolher as mãos. — Depois, quero te mostrar o desenho inteiro.':'')};
  if(s.flags.miraSourceProtected)line.text+='\n— Você guardou meu nome fora das perguntas. Eu lembro.';
 }
 if(who==='eron'&&!s.flags.eronBetrayed&&!s.flags.tomasTransferred&&!s.flags.tomasRescued){
  if(s.eron>=5)line={title:'Tenho uma ideia',text:'Eron puxa espaço no banco para Kali. — Tomas dizia que eu levava o tabuleiro a sério demais. Depois escondia a peça que eu ia usar.\nEle quase ri e continua sem esperar outra pergunta. — Quero terminar aquela partida. Mas primeiro vamos buscar ele. Se você abrir a passagem, eu conto quem saiu. Não precisa fazer tudo sozinho.'};
  else if(s.eron>=2)line={title:'Uma lembrança inteira',text:'Eron ergue o rosto. — Posso contar uma coisa sobre Tomas? Ele fazia piada até da sopa. Eu dizia que não tinha graça. Tinha.\nEle espera a resposta de Kali e acrescenta: — Você procurou em vez de mandar esquecer. Agora quero saber o que posso fazer para ajudar.'};
  if(s.flags.sharedWithEron)line.text+='\n— A assinatura naquela requisição continua na minha cabeça. Vou guardar o que você me mostrou.';
 }
 if(who==='noah'&&!s.flags.confronted){
  if(s.socialMemory.refusals.length>=2)line={title:'Então decide sozinho',text:'Noah cruza os braços. — Então decide sozinho. Eu explico, você pergunta de novo. Eu mostro o caminho, você não vem.\nEle responde antes de Kali terminar: — Não diga depois que eu não avisei.\nA voz ficou agressiva, mas ele não chamou o vigia nem fez uma nova denúncia.'};
  else if(s.socialMemory.refusals.length===1)line={title:'Por que não me escuta?',text:'Noah aperta a manga e fala mais depressa. — Por que você nunca faz o que eu digo? Aqui tem um jeito certo de fazer as coisas.\nEle tenta retomar o sorriso. — Vem comigo da próxima vez. Não fica procurando outra explicação para tudo.'};
  if(s.flags.sharedWithNoah)line.text+='\n— Não esqueci o papel que você mostrou. Não precisava ter mexido nele.';
 }
 return line;
};
// Cenas principais e conversas livres consultam a mesma memória.
for(const [id,who]of [['mira','mira'],['desaparecimento','eron'],['noah','noah']]){
 const original=G.scenes[id].text;G.scenes[id].text=s=>[S.conversation(who,s).text,...original(s).slice(1)];
}
const ambient=G.ambient;G.ambient=(who,s)=>S.names[who]?S.conversation(who,s):ambient(who,s);
function refusal(s,key){normalize(s);if(!s.socialMemory.refusals.includes(key))s.socialMemory.refusals.push(key);}
const take=G.take;G.take=(s,index)=>{
 const n=normalize(take(s,index));
 if(s.scene==='noah'&&index!==0)refusal(n,'noah-independent');
 if(s.scene==='segredo'&&index===1)refusal(n,'segredo-private');
 if(s.scene==='oferta'&&[0,3].includes(index))refusal(n,'oferta-questioned');
 if(s.scene==='verdade'&&index===1)refusal(n,'verdade-refused');
 return n;
};
const perform=A.perform;A.perform=(s,id,index)=>{const result=perform(s,id,index);normalize(result.state);if(id==='noahVersion')refusal(result.state,'noah-version');return result;};
const consequences=A.consequences;A.consequences=s=>{
 const result=consequences(s);
 if(s.flags.tomasSignalAnswered)result.push('Kali reconheceu o sinal ligado a Tomas antes de alcançar a cela. O indício não substituiu o resgate.');
 if(s.flags.miraSourceProtected)result.push('A observação das bandejas foi registrada sem entregar Mira como fonte.');
 if(s.flags.sharedWithEron)result.push('Eron recebeu a descoberta sobre a requisição e lembrou desse compromisso.');
 if(s.flags.sharedWithNoah)result.push('Noah conheceu a requisição, mas Kali preservou o nome de quem ajudou.');
 if(s.socialMemory?.refusals.length>=2)result.push(s.flags.confronted?'Kali recusou orientações distintas de Noah e exigiu que uma promessa fosse cumprida.':'Noah pressionou Kali diante de recusas distintas. A pressão não produziu uma nova denúncia automática.');
 return result;
};
// Apresentação pública: números sociais permanecem nas regras, nunca na interface.
function present(value){
 let text=String(value??'');
 text=text.replace(/Mira e Eron\s*[+−-]\d+/gi,'Mira e Eron lembram da sua proteção');
 text=text.replace(/\b(Mira|Eron|Noah|Adultos|Vigias)\s*([+−-])\s*\d+/gi,(_,who,sign)=>who==='Adultos'||who==='Vigias'?(sign==='+'?'Os adultos reconhecem o serviço':'A autorização dos adultos ficou mais frágil'):(sign==='+'?who+' lembra do que você fez':who+' se afasta após essa escolha'));
 text=text.replace(/confiança (?:de Mira \()?2\)?/gi,'um compromisso de ajuda').replace(/confiança 3/gi,'autorização dos adultos');
 text=text.replace(/Mira 2/gi,'o apoio de Mira').replace(/Eron livre e confiança 2/gi,'Eron livre e disposto a ajudar');
 text=text.replace(/Eron precisa de um compromisso de ajuda\./gi,'Eron precisa aceitar participar do plano.');
 return text;
}
function notes(s){
 const facts=[],doubts=[];
 if(s.flags.bedClue)facts.push(['A costura azul','Encontrei uma etiqueta T-17 na cama de Tomas. Esse número é meu próximo passo.']);
 if(s.flags.registerClue)facts.push(['O registro','T-17 corresponde a Tomas. O destino está vazio; o livro menciona material enviado à cozinha.']);
 if(s.flags.boxMatched||s.flags.kitchenClue)facts.push(['A caixa T-17','Encontrei a caneca e a coberta. A requisição manda manter Tomas na ala leste.']);
 if(s.flags.mealMismatch)facts.push(['As bandejas','Mira viu duas bandejas extras irem para a ala. Registrei a observação sem contar seu nome.']);
 if(s.flags.tomasSignalKnown)facts.push(['O sinal da partida','Eron me ensinou: duas batidas curtas e uma longa. Era o sinal que dividia com Tomas.']);
 if(s.flags.cellVoicesHeard)facts.push(['Atrás da grade',s.flags.tomasSignalAnswered?'Ouvi uma resposta igual ao sinal de Eron. Ainda preciso ver quem respondeu.':'Ouvi uma voz pedir água. Não consegui reconhecer quem falou.']);
 if(s.flags.warning)facts.push(['O aviso de Mira','Mira escreveu que está na primeira cela e Tomas atrás da divisória. Ela pediu que eu verificasse a ajuda de Noah.']);
 if(s.flags.altarClue)facts.push(['O altar','Anotei a ordem dos símbolos: sino → chama → raiz.']);
 if(s.flags.proof)facts.push(['Uma assinatura','Estou com o registro de transferência. Ele tem nomes, destino e uma assinatura.']);
 if(s.flags.transferDelayed)facts.push(['O tempo que ganhei','Destruí a ordem. Ganhei tempo, mas perdi a prova assinada.']);
 if(s.flags.rescued)facts.push(['Mira saiu','Abri a cela. Ela espera na cozinha; ainda precisamos sair do orfanato.']);
 if(s.flags.tomasRescued)facts.push(['Encontrei Tomas','Tomas deixou a cela interna. Não é mais apenas um número no livro.']);
 if(s.flags.tomasTransferred)facts.push(['A cela vazia','O prazo acabou antes do resgate. Tomas foi levado para outra unidade.']);
 if(s.flags.latchOpen)facts.push(['O trinco','Vi Noah abrir o trinco. A ajuda foi feita diante de mim.']);
 if((A.act(s)>=1||s.history.some(h=>h.scene==='noah'))&&!s.flags.kitchenClue)doubts.push(['A versão de Noah','Noah disse que Tomas foi transferido. Ainda não vi uma prova disso.']);
 if(s.flags.cellVoicesHeard&&!s.flags.tomasRescued&&!s.flags.tomasTransferred)doubts.push(['Quem respondeu?','O som veio da ala leste. Preciso entrar para encontrar Tomas.']);
 if(s.flags.noahTask&&!s.flags.latchOpen)doubts.push(['Uma promessa','Noah disse que abriria o trinco. Preciso conferir antes de depender dele.']);
 return {facts,doubts};
}
const api={normalize,present,notes,optionalFor:(who,s)=>[['eron','memoryTomas'],['noah','noahVersion']].filter(([kind,id])=>kind===who&&A.available(id,s)).map(([,id])=>id)};
root.GameInvestigation=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
