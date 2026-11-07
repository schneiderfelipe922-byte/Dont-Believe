---
version: alpha
name: "Don't Believe — O Obelisco"
description: "Interface de exploração e conversas de um orfanato em pixel art, em português."
colors:
  background: "#101719"
  primary: "#d0b77e"
  text: "#e0dfcf"
  muted: "#a1a89d"
  surface: "#211b24"
  border: "#69504f"
  mira: "#c4a0cf"
  eron: "#99b8cf"
  noah: "#d0b77e"
  guard: "#b2b9a5"
  dialogue-text: "#ffffff"
  dialogue-choice: "#b6b0a1"
  dialogue-paper: "#131410"
  dialogue-kali: "#695354"
  dialogue-noah: "#82817b"
  dialogue-mira: "#444541"
  dialogue-eron: "#625a66"
  dialogue-vigia: "#59494a"
  dialogue-tomas: "#50565c"
  dialogue-daty: "#93918a"
  dialogue-inauri: "#50565c"
typography:
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
  display:
    fontFamily: "Georgia, serif"
  dialogue:
    fontFamily: "Solway, American Typewriter, Georgia, serif"
rounded:
  DEFAULT: "0px"
spacing:
  panel: "18px"
  item-gap: "14px"
components:
  notebook-page:
    backgroundColor: "#eee0c4"
    textColor: "#30291f"
  inventory-item:
    backgroundColor: "#211b24"
    textColor: "#e0dfcf"
---

# Interface de OldHood

## Overview

Produto: jogo local de suspense em português, com teclado e toque. O jogador precisa reconhecer pessoas, objetos e consequências sem perder a orientação no mapa. A identidade existente vem de madeira gasta, papel e luz de velas. A exploração privilegia o cenário. O caderno de Kali concentra pistas, objetos e pedidos; relações se revelam nas falas e ações.

A fonte canônica dos tokens é o CSS (modelo B): `css/style.css` controla o jogo e `css/dialogue.css` controla a variante ilustrada das conversas. Este documento espelha esses valores. css/notebook.css controla papel, tinta e fonte manuscrita. As cores das molduras identificam quem fala; não há medidores sociais.

## Colors

`primary` corresponde a `--gold`, `background` a `--bg`, `text` a `--text`, `muted` a `--muted`. A extensão mapeia `surface` para `--social-panel`, `border` para `--social-border`, e cada personagem para `--social-mira`, `--social-eron`, `--social-noah`, `--social-guard`. Não exibir números, barras ou classificações de relações. Estados de tarefa usam texto: aceitar, em andamento, pronto para entregar, concluído e indisponível.

## Typography

Georgia para títulos gerais; Arial para descrições, controles e números. As conversas usam Solway, com peso leve 300 nas falas e escolhas e regular 400 nos nomes, aproximando a serifada da referência enviada pelo usuário. O arquivo exato da fonte da referência não foi fornecido. Solway Light, Regular e Medium são arquivos locais, com licença OFL em `assets/fontes/Solway-OFL.txt`; não há fontes remotas. Português com acentos e quebras naturais. Kalam Regular/Bold locais no caderno, corpo de 20 px (18 px no celular), entrelinha 1,6, tinta #30291f. A licença está em assets/fontes/Kalam-OFL.txt.

## Layout

Sem barras sociais. O caderno ocupa duas páginas no computador e uma página no celular. Abas Investigação, Objetos e Pedidos compartilham o modal nativo. A localização e os avisos de perigo permanecem acessíveis; objetivos completos ficam no diário. Conteúdo longo rola no modal sem deslocar a página; botões de tarefa têm pelo menos 44px de altura. O cenário e os controles de toque mantêm sua geometria anterior.

## Elevation & Depth

Bordas e fundos opacos separam informações. Os painéis novos usam as superfícies e sombras existentes. Os retratos comuns permanecem estáticos. Fotografias encontradas usam a variante `photo-memory` do modal: entrada em fade, imagem inteira sobre uma caixa de fala de Kali, respeitando redução de movimento.

## Shapes

Retângulos e bordas discretas, coerentes com o cenário em pixels. Nada de cartões arredondados ou decoração de aplicativo administrativo.

## Components

- `game.js`: `button`, `modal`, `say`, `notice` são os controles canônicos. As telas novas reutilizam essas funções.
- `style.css`: scrollbar global com estados visíveis e a base do jogo. notebook.css isola os estilos do diário. O modal nativo é o contêiner de inventário, leitura e tarefas.
- `social.js`: estados de tarefas, descrições de itens, falas e recompensas. Coletar e entregar são ações únicas; o resultado permanece no diário e no salvamento.
- `residents.js`: posições atuais; marcadores, interação e entrega consultam a mesma posição. O mundo pausa quando o jogador lê.

## Do's and Don'ts

Preservar os sprites, os requisitos internos das rotas e as trancas narrativas. Relações não apresentam escala visível. Mostrar requisitos e próximos passos antes de uma ação. Não usar só cor para comunicar confiança ou conclusão. Não premiar cliques repetidos. Não abrir grades com chaves de tarefas opcionais. Não animar os retratos dos diálogos.

## Fotografias encontradas

O pedido do jogador de 27/09/2026 introduz duas lembranças visuais, com fade de 600 ms e fala abaixo. A variante `photo-memory` reutiliza o modal nativo e as cores `--bg`, `--text`, `--gold`, `--social-panel` e `--social-border`. Georgia mantém o tom dos diálogos. A fotografia usa `object-fit: contain`; em telas estreitas, a caixa de fala continua abaixo da imagem. Sem recortar pessoas. O sistema e a preferência do jogo podem desativar o fade.


## Diálogos ilustrados — 05/10/2026

A referência enviada pelo jogador define uma moldura de lápis/crayon, aba com o nome acima da caixa e retrato grande à direita. O nome ilustrativo da referência não entra no jogo. O texto falado e os nomes são sempre brancos; apenas o rótulo da escolha selecionada fica roxo. O interior escuro preserva a leitura, e as texturas da moldura e da seta têm transparência real.

`javascript/game.js` continua dono de `say`, `showDialogue`, roteiro, pausa e execução da escolha. `javascript/dialogue-ui.js` controla aliases dos nomes, desenho integral dos retratos e seleção entre botões disponíveis; não altera a história. `assets.js` carrega os nove retratos locais de `assets/dialogos/retratos`. Se uma ilustração estiver ausente, o retrato em pixels existente é a reserva. Os sprites do mundo e suas estaturas permanecem em `CharacterData`.

| Token documental | Variável em css/dialogue.css | Uso |
|---|---|---|
| dialogue-text | --dialogue-text | nome, fala, requisitos e apoio em branco |
| dialogue-choice | --dialogue-choice | seleção e foco em lilás acinzentado; seta com saturação reduzida |
| dialogue-paper | --dialogue-paper | fundo da caixa |
| dialogue-kali | --dialogue-kali | moldura vermelha |
| dialogue-noah | --dialogue-noah | moldura cinza-clara |
| dialogue-mira | --dialogue-mira | moldura preta, com contorno discreto para separação |
| dialogue-eron | --dialogue-eron | moldura roxa |
| dialogue-vigia | --dialogue-vigia | bordô para vigia/guard e líder/leader |
| dialogue-tomas | --dialogue-tomas | azul-escuro |
| dialogue-daty | --dialogue-daty | branco, confirmado pelo jogador |
| dialogue-inauri | --dialogue-inauri | azul-escuro, confirmado pelo jogador |
| typography.dialogue | --dialogue-font | Solway local, com reservas serifadas |

A moldura original roxa é reutilizada com filtros por `data-speaker`, preservando o traço preto e a textura; os tokens de cor também pintam as barras de rolagem. A caixa ocupa a parte inferior do cenário; o retrato fica à direita, atrás da moldura e sem cobrir as falas. Em tela estreita, a cabeça e os ombros aparecem acima da caixa. O nome e as ações de saída ficam fixos; a fala e as escolhas compartilham uma área de rolagem. Escolhas têm pelo menos 44 px de altura.

Retratos são idles estáticos com poses expressivas. Não há movimento automático nem efeito que ignore redução de movimento. Fonte e ilustrações são locais e funcionam após extrair a pasta inteira. `assets/dialogos/prompts.json` registra o modo de geração integrado, as instruções de identidade e as poses.

## Diário ilustrado — 09/10/2026

Arte gerada pela ferramenta integrada imagegen, em assets/diario/caderno-kali.png. Sem texto embutido. Todas as informações são HTML selecionável; imagem e fontes são locais. Marcadores e caminhos só aparecem após solicitação e usam uma marcação por vez. Falha da imagem preserva papel claro e controles. Eventos de imagens antigas de abas descartadas não podem modificar a superfície atual.

Memória social e cenas ficam em investigation.js; notebook.js monta as três seções. J/I/T abrem diretamente cada seção; M mantém o mapa. Os epílogos incluem a fonte protegida e as descobertas compartilhadas. Os seis finais mantêm os requisitos anteriores.

## Superfície ampliada e diálogo compacto — 09/10/2026

fullscreen.css adapta a superfície ao espaço da tela, mantendo navegação e controles de toque. fullscreen.js controla API nativa, estado do botão, F/Esc e alternativa dentro da aba. Consultas abertas voltam ao topo após entrar na tela cheia.

No computador, a caixa de diálogo passou de até 460 px para 340 px nas falas; retratos passaram de 32% de largura e 97% de altura para 20% de largura e até 320 px de altura. Escolhas usam até 390 px e paginação quando necessário. Celular usa retratos de até 180 px, acima da caixa. Falas e opções não rolam; são paginadas com medição real. O diário mantém sua própria rolagem.


## Molduras apagadas — 15/10/2026

As nove variantes ilustradas usam pigmentos menos saturados e brilho contido: vermelho envelhecido de Kali, cinzas de Noah e Daty, carvão de Mira, roxo acinzentado de Eron, bordô dos vigias e azul ardósia de Tomas/Inauri. O filtro atua na moldura e na seta, preservando as falas brancas, o fundo opaco e os retratos originais. A seleção usa --dialogue-choice (#b6b0a1); --dialogue-choice-wash controla o fundo discreto de seleção e hover. Os valores por personagem descrevem os acentos; a textura original é colorida pelos filtros de css/dialogue.css.


## Exploração sem faixas — revisão de 15/10/2026

O cenário ocupa toda a janela durante a partida. Cabeçalho, localização, vigilância, rodapé e contadores saíram da exploração. C abre Controles; Esc também abre a pausa. O menu contém diário, objetos, pedidos, mapa, tela cheia, som e ajuda. J/I/T/M continuam disponíveis diretamente. Um botão discreto no canto permite abrir o menu por toque. Os controles de movimento por toque permanecem sobre o cenário.

Objetos, dentro do diário, reúne vigilância, atenção da patrulha, advertências e ferimentos antes do inventário. Consultar pausa o mundo e não cobra ações. A câmera usa escala visual padrão de 1,25 no computador e 1 no celular, ajustada para que a imagem do mapa cubra a janela; a densidade Retina não aproxima a câmera. O mapa permanece em M.

A caixa de fala mede até 620 × 260 px; escolhas usam até 310 px de altura e mantêm paginação e alvos de 44 px. A moldura tem pigmento quase monocromático, mais escuro; o fundo é carvão neutro e a seleção é pedra (#b6b0a1). A fala continua branca. Estas regras substituem as medidas e a seleção roxa descritas nas etapas anteriores.


## Câmera próxima e encaixe dos diálogos — 19/10/2026

A câmera enquadra Kali e parte de um cômodo. A área visível tem no máximo 480 × 320 pixels do mundo em janelas horizontais e 280 × 440 em janelas verticais. O enquadramento cresce proporcionalmente com a resolução física e usa o centro do corpo de Kali como referência, respeitando as bordas do mapa. Esta direção substitui a câmera afastada de 15/10.

A caixa de fala tem até 680 × 280 px; opções usam até 330 px no computador ou 340 px no celular. A moldura preserva textura e pigmentos apagados. O nome fica na aba; o título e a paginação têm hierarquia secundária. Texto em Solway Regular, 18 px no computador e 17 px no celular, com entrelinha 1,5. As margens direitas reservam espaço para a espiral da moldura.

Durante a leitura, Continuar fica no rodapé, junto de Voltar e Explorar depois. O botão não ocupa a área da fala. A paginação usa a área de leitura efetivamente disponível, sem a antiga reserva de espaço para o botão dentro do texto. As escolhas continuam no corpo da caixa, com confirmação explícita e alvos de pelo menos 44 px. Narrativa, custos e requisitos das rotas são preservados.


## Moldura horizontal conforme desenho do jogador — 19/10/2026

A caixa ocupa 94% da largura do cenário (96% no celular), formando uma faixa baixa. O corpo tem 180–210 px no computador, 200 px no celular e 184 px na horizontal curta. Sua altura permanece igual na fala e nas escolhas. A aba do nome fica acima da faixa, sem consumir a área de leitura.

O retrato estático fica acima da borda superior, à direita, com pequeno encaixe atrás da moldura. Cores apagadas, textura, câmera próxima e tamanho legível das letras são preservados. Outros assuntos passou ao cabeçalho; a navegação entre grupos de escolhas passou ao rodapé. Textos e opções extensas são paginados na área disponível, sem aumentar a altura. Este encaixe substitui as caixas de 680 × 280/330 px descritas na revisão anterior.
