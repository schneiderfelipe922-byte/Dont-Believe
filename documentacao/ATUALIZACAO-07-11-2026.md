# Revisão de Don’t Believe — 07/11/2026

Revisão do capítulo web **O Obelisco**. A referência é o suspense de OldHood: o jogador investiga o que os moradores dizem, confere provas e decide em quem confiar. A adaptação Unity é um projeto separado. Este documento menciona acontecimentos da história.

| Área | Problema encontrado | Correção aplicada |
| --- | --- | --- |
| Sprites e cenário | O vigia cobria Kali na primeira cena; os nomes disputavam atenção com o retrato. | Kali começa ao lado do vigia, ainda dentro do alcance da conversa. Sombras junto aos pés dão contato com o piso; os nomes do cenário desaparecem durante a leitura. O atlas, as estaturas e a ordem de profundidade são preservados. |
| Leitura e teclado | A fala voltava à primeira página ao mudar de tamanho; Enter podia confirmar uma escolha quando o foco estava no botão de sair ou pausar. | A nova paginação conserva a passagem atual e mantém a seleção visível quando a lista é reorganizada. Enter e Espaço acionam o botão focado. A confirmação continua sendo necessária para executar uma escolha. |
| Toque e movimento | A ação de toque exibia uma tecla redundante, e o ajuste de movimento não chegava a todas as animações do cenário. | Interagir tem rótulo direto. Os avisos de toque dispensam teclas. A preferência do sistema ou do jogo desativa os ciclos de repouso, a pulsação e a animação intermediária das portas. |
| Pausa e salvamento | Ao perder o foco, o mundo podia continuar avançando. | A exploração pausa e salva ao trocar de aba ou janela. Ao retornar, o jogador retoma pelo menu; uma conversa aberta conserva a página. |
| Prólogo e primeiro encontro | A direção falada de Inauri disputava atenção com a estrada; a chegada a OldHood demorava a apresentar a primeira decisão. | Inauri pede que Kali se proteja; a estrada indica a aproximação. O despertar tem frases mais curtas e reações distintas de Noah, Eron e Mira. A resposta discreta menciona os passos sem entregar um nome. |
| Diálogos e pedidos | Algumas falas tratavam Tomas como desaparecido ou retido depois de seu resgate ou transferência. | Pedidos de Eron, reações de Mira, leitura da requisição e falas junto à grade usam o estado da partida. A foto de Eron e Tomas reconhece a transferência; a foto familiar retoma a memória do prólogo. |
| Diário e finais | O diário podia antecipar uma pista ou manter a dúvida depois de resolver o caso. O epílogo podia declarar Mira presa em uma captura anterior ao confinamento. | As anotações acompanham as descobertas; a dúvida sobre a grade cede lugar ao resgate ou à cela vazia. Os epílogos distinguem o que aconteceu daquilo que Kali não chegou a confirmar. |
| Distribuição | O ZIP de jogo incluía imagens antigas e outras fontes de trabalho. | O pacote reúne recursos realmente carregados, licenças e documentação, com versões por conteúdo. As artes de trabalho continuam no projeto. |

Os seis finais, as condições das rotas, as recompensas dos doze pedidos, os custos do prazo, as colisões e os salvamentos locais continuam compatíveis. A revisão não acrescenta capítulos nem estabelece um novo destino para os pais de Kali.

Verificações reproduzíveis: `node --test tests/*.test.cjs`, `tools/playtest-review.cjs`, `tools/playtest-prologue.cjs` e `tools/playtest-ui-theme.cjs`. Os playtests de navegador usam Playwright e Chromium. Capturas da revisão e registro do navegador em `previas/revisao-2026-11-06/`.
