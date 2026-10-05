/* Roteiro e regras independentes da interface. */
(function (root) {
'use strict';
const initial = () => ({ scene:'prologo', adults:0, mira:0, eron:0, noah:0, suspicion:0, flags:{}, inventory:[], history:[], pending:null });
const c = (label,to,effect={},response='',note='',requires=null) => ({label,to,effect,response,note,requires});
const s = (place,title,text,choices,extra={}) => ({place,title,text,choices,...extra});
const ending = (title,text,quote) => ({place:'Epílogo',title,text,ending:true,quote,choices:[]});
const scenes = {
  "prologo": {
    "place": "Estrada • anos atrás",
    "title": "A marca",
    "text": [
      "A chuva fazia os faróis atrás do carro parecerem uma única luz. Kali segurava o símbolo do Luzitruismo. Sua mãe fechou os dedos dele sobre o metal.",
      "— Se alguém perguntar no que você acredita, a resposta continua sendo sua. Mesmo se precisar guardá-la por um tempo.",
      "O pai olhou o retrovisor. Não respondeu. A batida veio de lado. O vidro, o cinto apertado, a terra entrando pela janela: Kali lembraria disso em pedaços.",
      "— O menino está vivo. Levem para OldHood.\nA voz não perguntou pelos pais. Kali tentou alcançar a mão da mãe. Alguém o puxou pelo casaco.",
      "O cordão arrebentou. Um homem recolheu o símbolo da lama, embrulhou-o num pano e anotou alguma coisa. Foi a primeira vez que Kali viu uma lembrança de sua família virar um item numa lista."
    ],
    "choices": [
      {
        "label": "Abrir os olhos",
        "to": "quarto",
        "effect": {

        },
        "response": "",
        "note": "",
        "requires": null
      }
    ],
    "chapter": "PRÓLOGO"
  },
  "quarto": {
    "place": "Dormitório • dia 01",
    "title": "O silêncio tem olhos",
    "text": [
      "Anos depois, o primeiro sino desperta Kali antes da luz. Aos quatorze anos, ele reconhece o vigia pelo arrastar de uma sola no corredor. Hoje, os passos param cedo demais.",
      "— Vocês também ouviram alguém sair durante a noite?\nNoah ergue os olhos para a câmera. Eron prende a respiração. Mira passa um dedo pelo pó da mesa, apagando uma marca que Kali não chegou a ler.",
      "Na chamada da véspera, Tomas respondera pelo dormitório ao lado. Depois do segundo sino, ninguém mais o ouviu.",
      "A fechadura gira. O vigia olha primeiro para Noah, depois para Kali.\n— Existe algum problema?\nNinguém responde. O adulto deixa a porta aberta, como se esperasse receber um nome."
    ],
    "choices": [
      {
        "label": "“Não. Só acordei.”",
        "to": "altar",
        "effect": {
          "adults": 2
        },
        "response": "O vigia confere a cama e a janela. — Na segunda chamada, quero você no salão.\nQuando ele sai, Noah faz um pequeno sinal positivo. Kali ainda não sabe para quem o gesto foi feito.",
        "note": "Você parece obediente aos olhos dos adultos.",
        "requires": null
      },
      {
        "label": "“Por que tem uma câmera no quarto?”",
        "to": "altar",
        "effect": {
          "suspicion": 2
        },
        "response": "— Para proteger vocês.\n— Proteger de quê?\n— De decisões ruins.\nNoah espera a porta fechar. — Você não deveria ter perguntado isso.",
        "note": "O vigia anotou seu nome.",
        "requires": null
      },
      {
        "label": "“Não é nada importante.”",
        "to": "altar",
        "effect": {
          "mira": 1
        },
        "response": "— Espero que continue assim.\nQuando o adulto sai, Mira ergue os olhos por um instante. — Boa resposta.",
        "note": "Mira percebeu sua discrição.",
        "requires": null
      }
    ]
  },
  "altar": {
    "place": "Refeitório • manhã",
    "title": "O obelisco",
    "text": [
      "O sino conduz os moradores ao salão. Ninguém escolhe onde sentar. Um adulto guarda a porta, outro conta as bandejas; o terceiro observa quem demora a se ajoelhar.",
      "O obelisco de ametista repousa contra a parede, entre velas e flores secas. Na pedra escura, Kali vê o próprio rosto dividido por uma rachadura. Há riscos no piso diante da base, como se o altar já tivesse sido arrastado.",
      "— Na luz encontramos a ordem — recita o vigia.\n— A disciplina purifica — respondem os moradores.\nNoah acompanha cada palavra. Eron termina um instante depois dos outros.",
      "Kali conhece a diferença entre esse ritual e o que aprendeu com a mãe. Aqui, alguém confere a resposta antes de permitir que ele coma."
    ],
    "choices": [
      {
        "label": "Ajoelhar-se completamente.",
        "to": "mira",
        "effect": {
          "adults": 2,
          "noah": 1,
          "mira": -1,
          "flags": {
            "knelt": true
          }
        },
        "response": "Você imita Noah.\n— Muito bem — diz o vigia.\nMira desvia o olhar.",
        "note": "Sua obediência foi notada.",
        "requires": null
      },
      {
        "label": "Apenas abaixar a cabeça.",
        "to": "mira",
        "effect": {
          "mira": 1
        },
        "response": "— Isso é tudo?\n— Estou tentando aprender.\nO adulto aceita. Mira acompanha a cena em silêncio.",
        "note": "Você mantém suas intenções escondidas.",
        "requires": null
      },
      {
        "label": "Recusar o ritual.",
        "to": "recusa",
        "effect": {

        },
        "response": "— Não quero fazer isso.\nO salão inteiro fica em silêncio. O adulto se aproxima. — Por quê?",
        "note": "",
        "requires": null
      }
    ],
    "art": true
  },
  "recusa": {
    "place": "Refeitório • diante do altar",
    "title": "Termine a frase",
    "text": [
      "A colher de alguém bate na tigela. O vigia não olha para o barulho; mantém a mão sobre o encosto da cadeira de Kali.",
      "— A comida pode esperar. Sua resposta, não.\nNoah murmura: — Diga que não entendeu.",
      "Mira afasta a própria bandeja, abrindo espaço para Kali passar caso o adulto permita. Ele precisa escolher quanto de si vai deixar sobre aquela mesa."
    ],
    "choices": [
      {
        "label": "“Ainda não entendo a Actras.”",
        "to": "mira",
        "effect": {
          "suspicion": 1
        },
        "response": "— Então aprenderá.\nO adulto deixa você passar, mas acompanha cada passo.",
        "note": "A Actras está atenta.",
        "requires": null
      },
      {
        "label": "“Minha família acreditava em outra coisa.”",
        "to": "mira",
        "effect": {
          "suspicion": 3,
          "flags": {
            "family": true
          }
        },
        "response": "— Que coisa?\nVocê não responde. Ele o segura pelo ombro antes de soltá-lo.",
        "note": "Sua família entrou na investigação.",
        "requires": null
      }
    ],
    "art": true
  },
  "mira": {
    "place": "Refeitório • à mesa",
    "title": "Palavras pequenas",
    "text": (st=>[
 st.flags.knelt?'Mira mantém a caneca entre os dois. — Decorou rápido — diz. Kali não sabe se ela está falando da oração ou da maneira de baixar os olhos.':'Mira empurra discretamente um pedaço de pão para a borda da bandeja dele. — Esfria se você esperar demais. É a primeira frase que alguém lhe dirige sem fazer uma pergunta.',
'Um vigia percorre a mesa. Mira só continua quando ele se abaixa para corrigir a postura de outro morador.',
'— O cobertor do dormitório ao lado ficou sobrando.\nTomas. Kali entende por que ela não disse o nome. Uma resposta direta pode transformar os dois numa conversa que o vigia queira terminar.'
]),
    "choices": [
      {
        "label": "“Só estou tentando não causar problemas.”",
        "to": "noah",
        "effect": {
          "mira": 2
        },
        "response": "— Então fale da comida — diz Mira. — Da chuva. De qualquer coisa que não precise de um nome.\nEla encosta a caneca na dele. — O cobertor com remendo azul não devia estar na pilha de reserva.",
        "note": "Mira confiou a você uma primeira pista.",
        "requires": null
      },
      {
        "label": "“Talvez eu concorde com eles.”",
        "to": "noah",
        "effect": {
          "adults": 1,
          "mira": -2
        },
        "response": "Mira para de comer. — Talvez.\nO vigia parece satisfeito. A conversa termina ali.",
        "note": "Mira se fecha.",
        "requires": null
      },
      {
        "label": "“E você? O que acha?”",
        "to": "noah",
        "effect": {
          "mira": -1,
          "suspicion": 1
        },
        "response": "Mira vê o adulto se aproximar. — Acho que a sopa está fria.\nEla leva a bandeja embora. Kali percebe que exigiu uma resposta quando era ela quem corria o risco de ser ouvida.",
        "note": "A pergunta era direta demais.",
        "requires": null
      }
    ]
  },
  "noah": {
    "place": "Corredor leste • manhã",
    "title": "Um amigo atento",
    "text": [
      "Noah espera sob a placa das regras. A porta da sala dos adultos fecha atrás dele. Quando vê Kali olhando, ajeita a manga da camiseta.",
      "— Perguntaram se você estava se adaptando. Eu disse que sim.\n— Eles pediram para você me observar?\n— Pediram para eu ajudar.",
      "Noah baixa a voz. — Não deixe que precisem descobrir as coisas sozinhos. Comigo, você pode falar.\nA oferta soa como amizade. A frase parece ter vindo da sala atrás dele."
    ],
    "choices": [
      {
        "label": "“Então vou ouvir você.”",
        "to": "segredo",
        "effect": {
          "noah": 2
        },
        "response": "— Boa escolha. Você pode me contar qualquer coisa.",
        "note": "Noah quer conhecer seus planos.",
        "requires": null
      },
      {
        "label": "“Você parece saber bastante.”",
        "to": "desaparecimento",
        "effect": {
          "noah": -1,
          "flags": {
            "earlyDoubt": true
          }
        },
        "response": "— Alguém tem que prestar atenção — responde Noah.\n— Deve ser cansativo.\nA frase parece inofensiva, mas Noah demora a recuperar o sorriso.",
        "note": "Noah passa a medir as palavras.",
        "requires": null
      },
      {
        "label": "“Todo mundo parece saber alguma coisa.”",
        "to": "desaparecimento",
        "effect": {

        },
        "response": "— Você aprende rápido.\nVocê deixa a frase sem explicação.",
        "note": "Você mantém Noah próximo, sem se expor.",
        "requires": null
      }
    ]
  },
  "segredo": {
    "place": "Corredor leste • sussurros",
    "title": "O que ele precisa saber?",
    "text": (st=>['— O que ficou preso na sua garganta diante do altar? — pergunta Noah.',st.flags.family?'Kali já mencionou a família ao vigia. Contar mais agora pode ligar o que restou da história.':'Kali passa o polegar pela marca onde o cordão costumava tocar a pele. Noah percebe o gesto.','— Não precisa contar tudo — diz Noah. — Só o suficiente para eu entender.\nNa escada, o adulto que guarda a passagem consulta uma folha. Noah espera a resposta sem olhar para trás.']),
    "choices": [
      {
        "label": "Contar sobre sua família e sua crença.",
        "to": "desaparecimento",
        "effect": {
          "noah": 1,
          "suspicion": 1,
          "flags": {
            "disclosed": true
          }
        },
        "response": "— Minha família seguia o Luzitruismo. Eu não esqueci.\nNoah olha para a escada. — Seu segredo está seguro.",
        "note": "Você entregou a Noah uma parte importante da sua história.",
        "requires": null
      },
      {
        "label": "“Só queria terminar a refeição.”",
        "to": "desaparecimento",
        "effect": {

        },
        "response": "— Claro — responde Noah.\nVocê não acrescenta nada.",
        "note": "Algumas coisas continuam sendo apenas suas.",
        "requires": null
      }
    ]
  },
  "desaparecimento": {
    "place": "Dormitório • dia 02",
    "title": "A cama vazia",
    "text": [
      "Na segunda manhã, o nome de Tomas já não está na lista da chamada. Seu cobertor foi dobrado junto aos de reserva. Kali reconhece um remendo azul na ponta.",
      "— Tomas deixou isso?\nA colher escapa da mão de Eron. O vigia interrompe a contagem.",
      "— Quem estava falando?\nEron olha para a colher no chão. Kali percebe que ainda pode fazer sua pergunta significar outra coisa."
    ],
    "choices": [
      {
        "label": "“Eu estava perguntando sobre a colher.”",
        "to": (st=>st.eron>0?'bilhete':'explorar'),
        "effect": {
          "eron": 2
        },
        "response": "Kali aponta para o chão. — A colher. Ela está torta.\nO vigia manda Eron recolhê-la. Mais tarde, o menino passa por Kali e murmura apenas um número: — Duas.\nKali ainda não entende. À noite, o bilhete explicará as rondas.",
        "note": "Eron sabe que você o protegeu.",
        "requires": null
      },
      {
        "label": "“Perguntei sobre Tomas.”",
        "to": "explorar",
        "effect": {
          "suspicion": 2,
          "eron": -1
        },
        "response": "— Tomas não mora mais aqui.\n— Para onde ele foi?\n— Isso não é da sua conta.\nEron se afasta.",
        "note": "Perguntar teve um preço.",
        "requires": null
      },
      {
        "label": "“Esquece.”",
        "to": "explorar",
        "effect": {

        },
        "response": "O adulto o observa por longos segundos. Depois vai embora. Eron continua calado.",
        "note": "Você passou despercebido. Eron continua distante.",
        "requires": null
      }
    ]
  },
  "bilhete": {
    "place": "Dormitório • depois das luzes",
    "title": "Debaixo do travesseiro",
    "text": [
      "Sob o travesseiro, Kali encontra um papel arrancado da margem de um livro: “Atrás da cozinha. Depois das luzes. Espere a sola arrastar duas vezes.”",
      "Eron está deitado de costas para a câmera. Um de seus sapatos aparece sob o cobertor.",
      "A ronda para diante da porta. Kali fecha a mão sobre o bilhete e espera. Encontrar Eron significa confiar no intervalo entre dois adultos, não na ausência deles."
    ],
    "choices": [
      {
        "label": "Esperar a ronda passar e encontrar Eron.",
        "to": "eron",
        "effect": {

        },
        "response": "Você dobra o bilhete e espera os passos se distanciarem.",
        "note": "",
        "requires": null
      },
      {
        "label": "Guardar o bilhete e permanecer no quarto.",
        "to": "interrogatorio",
        "effect": {

        },
        "response": "Kali guarda o papel até a tinta manchar a palma. Os passos se repetem; ele não sai.\nNa manhã seguinte, Eron recolhe um banco sem olhar para ele. Não houve denúncia. Também não houve encontro.",
        "note": "Você não descobriu o caminho de Eron.",
        "requires": null
      }
    ]
  },
  "eron": {
    "place": "Atrás da cozinha • madrugada",
    "title": "O corredor que não existe",
    "text": [
      "Eron conta baixinho enquanto observa o corredor. — Dezenove. Vinte. Agora podemos falar.",
      "— Tomas passou por aqui?\n— Vi levarem a caixa dele. Não vi para onde levaram Tomas.\nEron evita oferecer uma certeza que não tem.",
      "Ele aponta uma junta no reboco. — Cozinha, parede solta, escada. Embaixo do altar ficam os registros. O ramal à esquerda chega ao pátio. A direita termina numa parede.",
      "As chaves tilintam. Eron empurra um balde para a frente dos dois, como se estivessem limpando o chão. O vigia passa. Só depois ele termina: — Apague minhas marcas. Se perguntarem, você se perdeu sozinho."
    ],
    "choices": [
      {
        "label": "Memorizar o trajeto.",
        "to": "interrogatorio",
        "effect": {
          "flags": {
            "passage": true
          },
          "items": [
            "Trajeto de Eron"
          ]
        },
        "response": "Você apaga as marcas da poeira antes de voltar.",
        "note": "Passagem secreta descoberta.",
        "requires": null
      }
    ]
  },
  "explorar": {
    "place": "Ala de serviço • depois das luzes",
    "title": "Sem ninguém para guiar",
    "text": [
      "A ala de serviço cheira a cinza molhada. Sem o trajeto de Eron, cada porta parece pertencer à mesma parede.",
      "Um vigia passa carregando uma caixa. Pela tampa mal fechada, Kali vê um pedaço de tecido com remendo azul. A câmera acompanha o adulto até ele alcançar a escada.",
      "A lente volta devagar para a cozinha. Há um intervalo. Kali pode observá-lo, arriscar atravessar ou aceitar que ainda não tem informação suficiente."
    ],
    "choices": [
      {
        "label": "Observar a ronda antes de entrar.",
        "to": "interrogatorio",
        "effect": {
          "suspicion": 1,
          "flags": {
            "timing": true
          }
        },
        "response": "Você conta os passos, mas a porta fecha antes que consiga atravessar. Pelo menos agora conhece o intervalo da ronda.",
        "note": "Você aprendeu o ritmo da vigilância.",
        "requires": null
      },
      {
        "label": "Atravessar a área proibida.",
        "to": (st=>st.suspicion>=4?'captura':'interrogatorio'),
        "effect": {
          "suspicion": 2
        },
        "response": (st=>st.suspicion>=4?'Uma lanterna o encontra. — Eu sabia. Contra a parede.':'Você vê a câmera girar e recua por pouco. O vigia anota o horário.'),
        "note": "Explorar sozinho aumentou o risco.",
        "requires": null
      },
      {
        "label": "Voltar antes de ser visto.",
        "to": "interrogatorio",
        "effect": {

        },
        "response": "Você retorna ao quarto sem respostas.",
        "note": "A passagem continua desconhecida.",
        "requires": null
      }
    ]
  },
  "interrogatorio": {
    "place": "Sala de observação • dia 04",
    "title": "A fotografia",
    "text": (st=>[
'No quarto dia, o vigia chama Kali pelo nome completo. Na sala de observação, só há uma cadeira desse lado da mesa. A porta fica encostada; outro adulto permanece do lado de fora.',
'Sobre a mesa está uma fotografia dos pais, marcada com o mesmo número de registro que Kali usa na chamada.',
 st.flags.disclosed?'— Você disse que não esqueceu.\nSão as palavras exatas que Kali usou com Noah. O adulto espera que ele perceba antes de continuar.':st.flags.family?'— Sua família acreditava em outra coisa. Foi o que você disse diante do altar.\nO adulto desliza a fotografia para perto.':'— Guardamos tudo que pode ajudar na sua adaptação.\nA fotografia estava aqui desde o dia em que o trouxeram. A pergunta não é uma descoberta; é uma verificação.',
'— Você ainda segue o Luzitruismo?\nKali olha a foto. No canto dobrado, a mão da mãe segura algo que a imagem não mostra. Responder com sinceridade e responder para sair dessa sala são riscos diferentes.'
]),
    "choices": [
      {
        "label": "“Não lembro muito.”",
        "to": "sumico",
        "effect": {
          "adults": 2,
          "suspicion": -1
        },
        "response": "— Não lembra ou não quer responder?\n— Eu era pequeno.\nO adulto registra a frase. Kali espera ser dispensado para voltar a respirar no próprio ritmo.",
        "note": "Os adultos aceitam sua aparente adaptação.",
        "requires": null
      },
      {
        "label": "“Talvez. Faz muito tempo.”",
        "to": "sumico",
        "effect": {

        },
        "response": "— Talvez?\nO adulto não consegue decidir se você está mentindo.",
        "note": "Sua resposta permanece inconclusiva.",
        "requires": null
      },
      {
        "label": "“Sim.”",
        "to": "sumico",
        "effect": (st=>({suspicion:3,mira:st.mira>0?1:0,eron:st.eron>0?1:0,flags:{faith:true}})),
        "response": "O adulto se levanta. — Então temos um problema.\nA porta demora a abrir.",
        "note": "Você preservou sua identidade diante deles.",
        "requires": null
      }
    ]
  },
  "sumico": {
    "place": "Dormitório • dia 05",
    "title": "A ausência de Mira",
    "text": (st=>['No dia seguinte ao interrogatório, os livros de Mira desapareceram. O travesseiro está liso demais. Kali toca a dobra do colchão onde ela costumava esconder as mãos.',st.mira>=2?'Um papel fino raspa em seus dedos: “Ele sempre sabe quando vêm. Antes de ouvir as chaves.” A letra é de Mira.':'Não há bilhete para ele. Kali se lembra das conversas interrompidas e das vezes em que ela precisou medir se podia confiar.', '— Não mexa aí — diz Noah.\n— Você sabe por quê?\n— Sei o que acontece com quem insiste.\nA fechadura ainda está imóvel quando Noah se afasta da porta. Um segundo depois, chegam os passos.']),
    "choices": [
      {
        "label": "Esperar a noite.",
        "to": "oferta",
        "effect": (st=>st.mira>=2?{flags:{warning:true},items:['Aviso de Mira']}:{}),
        "response": "",
        "note": "",
        "requires": null
      }
    ]
  },
  "oferta": {
    "place": "Dormitório • noite",
    "title": "A mão estendida",
    "text": (st=>['À noite, Noah aproxima um banco da cama de Kali. Mantém distância suficiente para que a câmera veja os dois.','— Posso levar você até Mira. Não vou conseguir manter essa chance aberta por muito tempo.\n— Quem abriu essa chance?\n— Você quer ajudar ou quer discutir?',st.flags.warning?'O aviso de Mira pesa mais que o papel escondido em seu bolso. Noah sabe quando virão os adultos. Talvez também saiba quando não devem vir.':'Kali precisa de um caminho. Noah oferece um com pressa demais para permitir perguntas.', '— Eu vou na frente — acrescenta Noah.\nÉ uma promessa pequena. Kali precisa decidir se ela serve como garantia.']),
    "choices": [
      {
        "label": "“Eu confio em você.”",
        "to": (st=>st.noah>=2?'emboscada':'limiar'),
        "effect": {
          "noah": 1
        },
        "response": "",
        "note": "",
        "requires": null
      },
      {
        "label": "“Primeiro me diga como sabe.”",
        "to": "questionar",
        "effect": {

        },
        "response": "",
        "note": "",
        "requires": null
      },
      {
        "label": "“Não vou com você.”",
        "to": "confinamento",
        "effect": {
          "suspicion": 1
        },
        "response": "— Você prefere ficar sozinho?\n— Talvez.\n— Pessoas sozinhas não duram muito aqui.\nAquilo não foi um conselho.",
        "note": "Noah vai falar com os adultos.",
        "requires": null
      }
    ]
  },
  "limiar": {
    "place": "Ala restrita • noite",
    "title": "Uma porta aberta",
    "text": [
      "Noah atravessa duas portas sem pedir licença. Os ganchos onde ficam as lanternas dos vigias estão vazios. Kali não ouviu mudança de ronda.",
      "— Por que ninguém nos parou?\n— Porque eu resolvi.\nNoah olha para uma porta entreaberta. O cheiro de tinta e papel é o mesmo da sala de observação.",
      "Uma cadeira arrasta lá dentro. Noah para atrás de Kali. Dessa vez, ele não pretende entrar primeiro."
    ],
    "choices": [
      {
        "label": "Entrar na sala.",
        "to": "emboscada",
        "effect": {

        },
        "response": "",
        "note": "",
        "requires": null
      },
      {
        "label": "Recuar antes da porta.",
        "to": "confinamento",
        "effect": {
          "suspicion": 1
        },
        "response": "Você se afasta. Noah não insiste. É isso que torna tudo pior.",
        "note": "",
        "requires": null
      }
    ]
  },
  "emboscada": {
    "place": "Sala de observação • noite",
    "title": "O preço da confiança",
    "text": [
      "A luz acende antes que Kali veja a sala inteira. Um adulto fecha a porta; outro coloca uma folha sobre a mesa. Noah fica do lado deles.",
      "— Você disse que era por Mira.\n— Se eu não trouxesse você, trariam os dois — responde Noah.",
      "O vigia recolhe os pertences de Kali. — Ele colaborou por vontade própria.\nNoah não corrige a frase. Kali entende que a lealdade exigida dele precisava ter o nome de outra pessoa.",
      "— Você podia ter me avisado.\nNoah abre a boca. O adulto põe a mão em seu ombro e a resposta não vem."
    ],
    "choices": [
      {
        "label": "Encarar Noah pela última vez.",
        "to": "traicao",
        "effect": {

        },
        "response": "",
        "note": "",
        "requires": null
      }
    ]
  },
  "questionar": {
    "place": "Dormitório • noite",
    "title": "Uma resposta ensaiada",
    "text": (st=>['— Eu ouvi onde a colocaram — diz Noah.\n— E deixaram você sair para contar?\n— Eu sei como falar com eles.',st.flags.warning?'Kali lembra do bilhete e da maneira como Noah se afastou da porta antes das chaves. Agora existem duas coisas que não dependem da palavra dele.':'Kali reconhece a contradição, mas ainda não tem uma pista que Noah não consiga negar. Acusar alguém sob uma câmera é uma escolha sem volta.','— Diga o nome de quem deixou você entrar — pede Kali.\nNoah olha para a porta. Pela primeira vez, parece estar esperando que ninguém venha.']),
    "choices": [
      {
        "label": "“Você avisa os adultos antes de avisar a gente.”",
        "to": "verdade",
        "effect": {
          "flags": {
            "confronted": true
          }
        },
        "response": "Noah congela. Depois fecha a porta.",
        "note": "O aviso de Mira deu sentido às suas suspeitas.",
        "requires": (st=>st.flags.warning?null:'Você precisa de uma pista sobre Noah.')
      },
      {
        "label": "Pedir que prove sua história.",
        "to": "confinamento",
        "effect": {
          "suspicion": 1
        },
        "response": "— Você deveria confiar em mim.\n— Não é uma resposta.\nNoah sai sem dizer mais nada.",
        "note": "",
        "requires": null
      },
      {
        "label": "Segui-lo mesmo assim.",
        "to": (st=>st.noah>=2?'emboscada':'limiar'),
        "effect": {
          "noah": 1
        },
        "response": "",
        "note": "",
        "requires": null
      }
    ]
  },
  "verdade": {
    "place": "Dormitório • porta fechada",
    "title": "Desde antes de você chegar",
    "text": [
      "— Você entrega nossas conversas.\nNoah fecha a porta. — Diminua a voz.\n— Para me proteger ou para eles não ouvirem você?",
      "Noah apoia a mão na maçaneta. — Quando cheguei, disseram que eu podia ser útil. Uma cama perto da janela. Refeição sem ficar por último. Depois pediram nomes.",
      "— Mira? Tomas?\n— Eu anotei perguntas. Disseram que iam conversar com eles.\n— E continuou depois que não voltaram?",
      "Noah olha para o chão. — Se eu parasse, iam perguntar de que lado eu estava.\nKali sente vontade de gritar. Em vez disso, precisa decidir se ainda existe uma escolha que Noah não tenha entregue aos adultos."
    ],
    "choices": [
      {
        "label": "“Ainda pode escolher não ser como eles.”",
        "to": "confinamento",
        "effect": (st=>({flags:{mercy:true,noahDoubt:st.noah>=1}})),
        "response": (st=>st.noah>=1?'— Não estou dizendo que confio — diz Kali. — Estou dizendo que você pode parar.\nNoah afrouxa a mão na maçaneta. — Eles vão saber.\n— Então escolha o que vai fazer antes disso.':'— Quando foi que você confiou em mim? — pergunta Noah.\n— Isso não muda o que fizeram com Mira.\nEle deixa Kali passar, mas não promete mais nada.'),
        "note": "Você ofereceu a Noah uma escolha.",
        "requires": null
      },
      {
        "label": "“Afaste-se. Não vou dar mais nada a você.”",
        "to": "confinamento",
        "effect": {
          "flags": {
            "rejected": true
          }
        },
        "response": "Você atravessa o quarto. Noah não tenta impedir.",
        "note": "Você rompeu a relação.",
        "requires": null
      }
    ]
  },
  "confinamento": {
    "place": "Corredor central • alarme",
    "title": "Todas as portas",
    "text": (st=>['O alarme interrompe a noite. Um vigia recolhe as chaves enquanto outro confere a lista dos quartos. A Actras não precisa correr; basta fechar as saídas.',st.flags.disclosed?'Ao chegar perto, Kali ouve sua crença citada numa ordem. A conversa com Noah virou uma informação de serviço.':'O adulto confere duas descrições antes de reconhecer Kali. As respostas vagas deixaram lacunas nos registros.',st.adults>=3?'— Você pode ajudar. Leve estes cobertores.\nKali recebe uma tarefa porque aprendeu a parecer previsível. A mesma confiança pode permitir que ele veja portas que normalmente estariam fechadas.':'— Fique junto à parede.\nKali obedece até conseguir enxergar a próxima esquina. Precisa da ronda que observou, de alguém que o ajude ou de um risco que ainda possa suportar.','Atrás de uma porta, alguém bate duas vezes e espera. Kali reconhece o intervalo que Mira deixava entre uma frase e outra.']),
    "choices": (st=>st.adults>=3?[
 c('Continuar fingindo obediência.','resgate',{flags:{cell:true}},'Você distribui os cobertores e vê um vigia deixar comida numa sala pequena. Mira está lá.','Cela de Mira localizada.'),
 c('Aproveitar a distração e roubar uma chave.',st=>st.suspicion>=4?'captura':'resgate',st=>st.suspicion>=4?{}:{flags:{key:true,cell:true},items:['Chave da ala restrita']},st=>st.suspicion>=4?'Uma mão prende seu pulso. — Eu estava esperando por isso.':'O metal desliza para o bolso. O adulto não percebe.'),
 c('Avisar Eron.',st=>st.eron>=2?'resgate':'captura',st=>st.eron>=2?{flags:{organized:true,cell:true}}:{suspicion:2},st=>st.eron>=2?'Eron entende seu gesto. — Vou reunir os outros. Mira está na sala ao lado da despensa.':'Eron recua com medo. — Ele está tentando sair! O vigia se vira.')
]:[
 c('Esperar a troca de vigia e seguir a parede.',st=>st.flags.timing||st.suspicion<4?'resgate':'captura',{flags:{cell:true}},st=>st.flags.timing||st.suspicion<4?'Os passos se afastam. Você escuta Mira atrás da porta da despensa.':'Outro adulto o esperava no fim do corredor. Não havia brecha.'),
 c('Pedir uma distração a Eron.','resgate',{flags:{organized:true,cell:true}},'Eron derruba uma pilha de pratos. Enquanto os adultos correm, você alcança a despensa.', '',st=>st.eron>=2?null:'Eron ainda não confia em você.'),
 c('Usar o caminho atrás da cozinha.','subsolo',{},'Você passa pela parede falsa antes que a ronda retorne. Mira continua presa.','Você priorizou alcançar o altar.',st=>st.flags.passage?null:'Você não descobriu a passagem.'),
 c('Esconder-se e seguir um vigia até os arquivos.','subsolo',{suspicion:1},'Você espera atrás de um armário. O vigia leva uma caixa para o salão. As marcas no piso terminam atrás do altar; é por ali que você deve procurar a descida.','Você encontrou os arquivos, mas ainda não conhece uma saída.')
])
  },
  "resgate": {
    "place": "Despensa • ala restrita",
    "title": "Do outro lado da porta",
    "text": (st=>['— Não fale meu nome — pede Mira pela fresta.\nKali se aproxima da madeira. — Você está machucada?\n— Consigo andar. É o que importa agora.','Mira viu caixas descerem para os arquivos sob o altar. Fotografias, cadernos, símbolos. — O que tiram de nós fica perto deles.','— E Tomas?\n— Vi o registro. Tiraram daqui. Não dizia para onde.\nNenhum dos dois chama isso de uma resposta.',st.flags.key?'Kali encaixa a chave. Pode libertá-la sem denunciar a fechadura.':'A lingueta está exposta. Uma haste solta da janela pode alcançá-la, mas o metal vai bater na madeira.','— Se abrir, espere por mim na primeira curva — diz Mira. — Não me faça adivinhar de novo se posso confiar em você.']),
    "choices": [
      {
        "label": "Abrir a porta e libertar Mira.",
        "to": "subsolo",
        "effect": (st=>({mira:1,flags:{rescued:true,passage:true},items:['Pista sob o altar'],suspicion:st.flags.key?0:1})),
        "response": (st=>st.flags.key?'A chave gira. Mira sai e segura seu braço. — Eu vou com você.':'Você força a lingueta com a haste da janela. O estalo ecoa. Mira sai antes que os passos voltem.'),
        "note": "Mira está livre.",
        "requires": null
      },
      {
        "label": "Prometer voltar e seguir a pista.",
        "to": "subsolo",
        "effect": {
          "flags": {
            "passage": true
          },
          "items": [
            "Pista sob o altar"
          ]
        },
        "response": "— Eu volto.\nMira não responde. Você segue para o altar.",
        "note": "Você conhece a passagem, mas Mira continua presa.",
        "requires": null
      }
    ]
  },
  "subsolo": {
    "place": "Sob o altar • madrugada",
    "title": "O que foi tirado de nós",
    "text": (st=>[st.flags.rescued?'Mira alcança Kali nos arquivos. Ela mantém a porta da escada no campo de visão enquanto ele procura as etiquetas.':'Kali alcança os arquivos sozinho. Pela escada, os ruídos do salão chegam abafados. Mira continua em algum lugar acima dele.', 'A Actras guardou o que dizia ter destruído: cartas, fotografias e símbolos de crenças diferentes. Numa ficha, “transferido” substitui o nome de Tomas. O destino foi deixado em branco.', 'O registro de Kali contém um envelope de tecido. Dentro dele está o símbolo do Luzitruismo. Ainda há terra presa na emenda do metal. O homem que o recolheu naquela noite nunca o jogou fora.', '— Eu sabia que você viria buscar isso.\nNoah está na escada. Atrás dele, uma lanterna ilumina o primeiro degrau. Kali fecha a mão sobre o símbolo antes de se virar.']),
    "choices": [
      {
        "label": "Segurar o símbolo e encará-los.",
        "to": "confronto",
        "effect": {
          "items": [
            "Símbolo do Luzitruismo"
          ]
        },
        "response": "",
        "note": "",
        "requires": null
      }
    ],
    "art": true
  },
  "confronto": {
    "place": "Arquivos subterrâneos • confronto",
    "title": "Quem merece a verdade?",
    "text": (st=>['O líder entra sem erguer a voz. — Coloque isso na mesa. Ainda podemos evitar uma situação pior.\nKali vê o vigia se aproximar da saída enquanto o homem fala.', '— Você guardou a fotografia. Guardou isso.\n— Para que um dia você entendesse.\n— Minha mãe não precisava trancar uma porta para me explicar no que acreditava.',st.flags.noahDoubt?'O líder estende a mão para Noah. — Pegue.\nNoah olha para a porta lateral, depois para Kali. Ainda pode obedecer; ainda pode fazer outra coisa.':st.flags.earlyDoubt?'— Ele nunca confiou em mim — diz Noah.\n— Você devia ter resolvido isso.\nA resposta do líder o deixa tão imóvel quanto os outros moradores.':'Noah se coloca ao lado do líder. — Eu trouxe ele até aqui.\nNão há orgulho na frase. Há um pedido para que aquilo seja suficiente.',st.flags.rescued&&st.eron>=2?'Duas batidas chegam pelo encanamento. Mira ergue os olhos: Eron conseguiu alcançar alguém. Kali tem poucos segundos para transformar a ajuda em uma saída.':'Nenhum sinal vem do corredor. Kali precisa decidir com o que realmente pode contar, não com o que gostaria que estivesse do outro lado.']),
    "choices": [
      {
        "label": "Pedir ajuda aos moradores.",
        "to": (st=>st.mira>=2&&st.eron>=2&&st.flags.rescued?'voz':'captura'),
        "effect": {

        },
        "response": (st=>st.mira>=2&&st.eron>=2&&st.flags.rescued?'— Vocês não precisam continuar obedecendo!\nMira responde. Eron abre as portas. Outras vozes se juntam à sua.':'Você grita, mas não há aliados suficientes livres para enfrentar os vigias.'),
        "note": "As relações que você construiu decidem quem responde.",
        "requires": null
      },
      {
        "label": "“Posso levar os outros de volta.”",
        "to": "disfarce",
        "effect": {

        },
        "response": "Kali baixa a mão que segura o símbolo. — Eles me viram ajudar durante o alarme. Posso fazer isso de novo.\nO líder reconhece o morador obediente que aprendeu a esperar. — Sem desvios.\nA porta se abre.",
        "note": "Eles deixam você sair da sala.",
        "requires": (st=>st.adults>=3?null:'Você não conquistou a confiança dos adultos.')
      },
      {
        "label": "Confiar uma última vez em Noah.",
        "to": (st=>st.flags.noahDoubt&&st.flags.rescued&&st.eron>=2?'luz':'traicao'),
        "effect": {

        },
        "response": (st=>st.flags.noahDoubt&&st.flags.rescued&&st.eron>=2?'Noah abre a porta lateral. — Corre. Leve os dois.\n— E você?\n— Alguém precisa fechar isso.':'Noah estende a mão. Quando você se aproxima, ele toma o símbolo e o entrega ao líder.'),
        "note": "",
        "requires": null
      },
      {
        "label": "Tentar fugir sozinho.",
        "to": (st=>st.flags.passage?'sobrevivente':'isolamento'),
        "effect": {

        },
        "response": (st=>st.flags.passage?'Você conhece a curva atrás da cozinha. Corre antes que os vigias fechem a escada.':'Você entra no corredor errado. Ao fundo, uma lanterna se acende.'),
        "note": "",
        "requires": null
      }
    ],
    "art": true
  },
  "disfarce": {
    "place": "Escada de serviço • última chance",
    "title": "A liberdade de quem?",
    "text": [
      "— Posso levar os outros de volta — diz Kali. — Eles vão me ouvir.\nO líder examina o histórico de obediência antes de soltá-lo. — Então seja útil.",
      "Kali sobe com a tarefa que serviu de disfarce durante o alarme. No pátio, a porta está destrancada: os adultos acreditam que ele está trabalhando para eles.",
      "Do lado de fora, há espaço para correr. Do lado de dentro, ainda há fechaduras e pessoas esperando um sinal. A mentira comprou minutos. Kali escolhe para quem vai usá-los."
    ],
    "choices": [
      {
        "label": "Fugir enquanto a porta está aberta.",
        "to": "sobrevivente",
        "effect": {

        },
        "response": "",
        "note": "",
        "requires": null
      },
      {
        "label": "Voltar para libertar os outros.",
        "to": (st=>st.flags.key||st.flags.organized||(st.flags.rescued&&st.eron>=2)?'voz':'captura'),
        "effect": {

        },
        "response": (st=>st.flags.key?'Você usa a chave para abrir as celas. As primeiras pessoas acordam as outras.':st.flags.organized||st.flags.rescued&&st.eron>=2?'Eron e Mira o ajudam a abrir as portas. Agora ninguém corre sozinho.':'Sem uma chave nem um grupo preparado, você demora demais diante da primeira porta. Os passos retornam.'),
        "note": "",
        "requires": null
      }
    ]
  },
  "voz": {
    "place": "Epílogo",
    "title": "A Voz",
    "text": [
      "Mira, Eron e os outros moradores atravessam os corredores. Os adultos tentam controlar a situação, mas há gente demais para silenciar.",
      "Cada gesto de proteção, cada conversa pequena, cada risco compartilhado se transforma numa voz. A Actras perde o controle do orfanato.",
      "Kali atravessa a porta com seu símbolo na mão. Dessa vez, ninguém precisa ficar para trás."
    ],
    "ending": true,
    "quote": "A confiança pode salvar.",
    "choices": [

    ]
  },
  "luz": {
    "place": "Epílogo",
    "title": "A Luz",
    "text": [
      "Noah segura a porta lateral enquanto Kali, Mira e Eron passam. O corredor de serviço os leva para fora.",
      "— VAI! — ele grita.\nKali olha para trás uma última vez. Noah permanece no orfanato, atrasando os adultos. Seu destino fica desconhecido.",
      "O amanhecer encontra os três além dos muros. A escolha de Noah não apaga o que ele fez. Mas permitiu que existisse um depois."
    ],
    "ending": true,
    "quote": "Ninguém deveria decidir no que você deve acreditar.",
    "choices": [

    ]
  },
  "sobrevivente": {
    "place": "Epílogo",
    "title": "Sobrevivente",
    "text": [
      "Kali atravessa o pátio e alcança as árvores. O ar frio dói nos pulmões. Pela primeira vez, ninguém o manda voltar.",
      "Ele está livre. Os outros ficaram para trás.",
      "O símbolo do Luzitruismo pesa em sua mão. Sobreviver era necessário. Saber o preço disso será outra história."
    ],
    "ending": true,
    "quote": "O silêncio pode proteger. Mas também deixa ecos.",
    "choices": [

    ]
  },
  "traicao": {
    "place": "Epílogo",
    "title": "Traição",
    "text": [
      "Noah não olha mais para você. Os adultos fecham o círculo, e a porta se tranca.",
      "A última pessoa em quem Kali confiou foi quem permitiu que a Actras o capturasse.",
      "Do outro lado, alguém pergunta se tudo está em ordem. Noah responde que sim."
    ],
    "ending": true,
    "quote": "A confiança também pode destruir.",
    "choices": [

    ]
  },
  "isolamento": {
    "place": "Epílogo",
    "title": "Isolamento",
    "text": [
      "O corredor termina numa parede. Kali se vira. Um adulto já bloqueia a única saída.",
      "Evitar vínculos o protegeu de alguns perigos, mas também o deixou sem o caminho que outra pessoa poderia ter mostrado.",
      "Quando precisou de ajuda, não havia ninguém que soubesse onde encontrá-lo."
    ],
    "ending": true,
    "quote": "Nem todo silêncio é abrigo.",
    "choices": [

    ]
  },
  "captura": {
    "place": "Epílogo",
    "title": "Sob Vigilância",
    "text": [
      "Uma mão fecha sobre seu braço. Depois outra. Os vigias se movem como se já soubessem onde você estaria.",
      "Kali é levado para uma sala sem janela. A câmera continua acesa. Do outro lado da parede, o sino anuncia mais uma refeição.",
      "Ainda existem perguntas. Agora, a Actras controla quem pode ouvi-las."
    ],
    "ending": true,
    "quote": "Em um lugar onde todos observam, até uma conversa pode ser perigosa.",
    "choices": [

    ]
  }
};
function value(v,state){return typeof v==='function'?v(state):v;}
function choices(state){return value(scenes[state.scene].choices,state);}
function take(state,index){
 const choice=choices(state)[index]; if(!choice)throw new Error('Escolha inexistente');
 if(choice.requires&&choice.requires(state))throw new Error('Escolha indisponível');
 const next=JSON.parse(JSON.stringify(state));const effect=value(choice.effect,state)||{};
 for(const key of ['adults','mira','eron','noah','suspicion'])next[key]=Math.max(0,Math.min(9,next[key]+(effect[key]||0)));
 Object.assign(next.flags,effect.flags||{});
 next.inventory=[...new Set([...next.inventory,...(effect.items||[])])];
 next.history.push({scene:state.scene,title:scenes[state.scene].title,choice:choice.label,note:choice.note});
 next.scene=value(choice.to,next);if(!scenes[next.scene])throw new Error('Cena inexistente: '+next.scene);
 const response=value(choice.response,next);next.pending=response?{text:response,note:choice.note}:null;
 return next;
}
function ambient(kind,state){
 if(kind==='mira')return state.flags.rescued?{title:'Na primeira curva',text:'— Ainda consegue andar? — Kali pergunta.\n— Consigo. Só não suma da minha frente.\nMira confere a saída antes de continuar. — Eles contam com a gente correndo sozinho.'}:state.mira>=2?{title:'Uma conversa sobre o frio',text:'Mira aproxima as mãos da caneca. — Esfriou de novo.\n— Quer que eu feche a janela?\n— Ainda não. Às vezes é bom saber de onde vem o ar.\nEla olha para a porta de serviço. Kali entende que não deve acompanhar o olhar.'}:{title:'O que pode ser ouvido',text:'— A sopa está fria — diz Mira, antes que Kali pergunte qualquer coisa.\nUm vigia está perto. Ela espera que ele compreenda por que só podem falar disso.'};
 if(kind==='eron')return state.flags.passage?{title:'Esquerda, depois da escada',text:'— Não troque as curvas — murmura Eron. — O ar frio vem da esquerda.\n— E se você não estiver lá?\n— Memorize mesmo assim. Um caminho não pode depender de uma pessoa voltar.'}:state.eron>=2?{title:'Contar os passos',text:'Eron marca um ritmo com a ponta do sapato. Para quando o couro de uma sola raspa no corredor.\n— Não é sempre o mesmo intervalo — avisa. — Se as chaves pararem, você para também.'}:{title:'Uma conta interrompida',text:'Eron conta alguma coisa sem mover os lábios. Kali se aproxima e a conta para.\n— Perdi o número — ele diz. — Agora preciso começar de novo.\nKali entende o pedido de espaço.'};
 return state.flags.confronted?{title:'Depois da verdade',text:state.flags.mercy?'Noah segura a maçaneta sem girar. — Eu ouvi o que você disse.\n— Então não me peça outra promessa. Faça uma escolha.\nEle solta a porta.':'Noah abre espaço no corredor. Kali passa sem entregar outra palavra. Dessa vez, o silêncio tem um limite claro.'}:state.flags.warning?{title:'Antes das chaves',text:'— Você anda quieto — comenta Noah.\n— Aprendi a ouvir.\nNoah olha para a escada antes que apareça alguém. Kali guarda esse instante junto ao aviso de Mira.'}:{title:'Tudo em ordem',text:'— Se perguntarem, estamos só esperando a chamada — diz Noah.\n— Perguntaram?\n— Ainda não.\nEle ajeita a manga da camiseta e acompanha a porta com os olhos.'};
}
const api={initial,scenes,choices,take,value,ambient};root.GameStory=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
