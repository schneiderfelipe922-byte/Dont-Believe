---
version: alpha
name: "Don’t Believe — O Obelisco"
description: "Interface de jogo narrativo com gótico discreto, preto, cinza e detalhes roxos."
colors:
  background: "#100E14"
  surface: "#211D28"
  bronze: "#B99BD8"
  text: "#EDEAF0"
  muted: "#BBB4C4"
  primary: "#59396F"
typography:
  interface:
    fontFamily: "'Mystery Quest', Georgia, serif"
    fontSize: "16px"
    lineHeight: "1.6"
  handwriting:
    fontFamily: "'Mystery Quest', Georgia, serif"
    fontSize: "20px"
    lineHeight: "1.6"
rounded:
  DEFAULT: "0px"
spacing:
  touch-target: "44px"
  panel-padding: "32px"
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text}"
    height: "44px"
    rounded: "{rounded.DEFAULT}"
  modal:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    width: "760px"
    typography: "{typography.interface}"
    padding: "{spacing.panel-padding}"
  label:
    textColor: "{colors.bronze}"
  secondary-text:
    textColor: "{colors.muted}"
---

# Don’t Believe — direção da interface

## Direção pintada — 10/11/2026

A estética aprovada passa a orientar as imagens e cenários: nanquim orgânico, guache seco, pinceladas visíveis, sombras malva e luzes ocre. Foram repintados o mapa de OldHood e suas portas, a estrada do prólogo, o altar, as duas fotografias e as seis imagens finais. Esta revisão substitui a orientação anterior de cores chapadas para esses recursos. Layout do mapa, recortes das portas e colisões permanecem nas coordenadas existentes. Sprites jogáveis ficam para a etapa seguinte; as prévias não foram integradas. Arquivos e prompts completos em `documentacao/direcao-pintada-2026-11-10.md`.

## Revisão U03 — 09/11/2026

O mesmo acabamento em nanquim e guache também foi aplicado às duas cenas dos pais no prólogo: olhando para o banco traseiro e mortos após o acidente. As versões `pais-olhando-tras-nanquim-v1.png` e `pais-acidente-nanquim-v1.png` substituem as cores chapadas anteriores no carregamento do jogo, preservando personagens, roupas e composição. Prompts em `assets/prologo/nanquim-v1-prompts.md`.

A pedido do usuário, a tela inicial passa a usar uma nova ilustração original de OldHood em nanquim e guache, com contornos livres, arquitetura irregular, textura de papel e luz violeta. Esta revisão substitui, para o menu inicial, a orientação anterior de preservar a arte e usar somente cantos retos. O arquivo anterior permanece disponível. O título é HTML e os botões têm bordas assimétricas discretas, mantendo foco, leitura e ações reais. A navegação simplificada do U01 permanece. Cenários jogáveis, sprites e colisões não foram alterados nesta etapa. Prompt e origem em `assets/menus/oldhood-nanquim-u03.md`; capturas e verificação em `previas/u03/`.

## Overview

O ponto de partida é o próprio orfanato OldHood: madeira escura, ferragens envelhecidas, tecidos vinho e objetos guardados por Kali. A UI serve à exploração e à leitura em português brasileiro no computador e no celular. A assinatura visual é a moldura ilustrada dos diálogos, acompanhada de bordas duplas discretas nos painéis. Evitar neon, cartões arredondados e ornamentação que ocupe a área de leitura.

O plano aprovado em 25/10/2026 abrange a versão web. A arte do menu e do caderno, os retratos, as cenas, a história, os atalhos e os salvamentos permanecem preservados. É um jogo local, sem dependências de rede.

**Propriedade dos tokens: modelo B.** `css/style.css :root` é a fonte canônica em runtime. Este documento espelha seus valores e explica o uso. Não há geração de CSS ou biblioteca de componentes.

## Colors

| Papel | Token CSS | Consumidores |
| --- | --- | --- |
| Carvão | `--bg` | Fundo, avisos, atalhos, placas internas |
| Madeira | `--surface` | Modal, controles, folha dos finais |
| Bronze | `--gold` | Bordas, foco e títulos auxiliares |
| Marfim | `--text` | Texto principal e botões vinho |
| Texto secundário | `--muted` | Metadados, atalhos, descrições |
| Vinho | `--wine` | Ação principal e estado pressionado |

`--line` deriva do bronze com transparência; `--hover` deriva do vinho. Bronze não é texto sobre vinho: nesses botões o texto é marfim. Estados têm contorno, texto ou atributos de seleção além da cor. Os pigmentos por personagem são mantidos em `css/dialogue.css`; a paleta de papel e tinta pertence a `css/notebook.css`. A identidade de cada final continua informada por `--ending-accent`, sem substituir o texto marfim. As barras de rolagem globais pertencem a `css/style.css` e o caderno tem a variante de papel.

## Typography

Mystery Quest (400), local, é a fonte única de toda a interface, incluindo menu, diálogos, diário, controles, prólogo e rótulos do mapa. Os textos desenhados no menu são cobertos por botões HTML usando a mesma família ornamental. Usar `--font-ui`. Títulos 26–36 px, corpo 16–20 px e rótulos pelo menos 12 px. Falas mantêm 18 px no computador e 17 px no celular, entrelinha 1,5.

O diário usa a mesma família, com 20 px no computador e 18 px no celular e entrelinha 1,6. A fonte e a licença OFL estão em `assets/fontes`; não há dependência de fontes remotas em runtime.

## Layout

A tela inicial não tem cabeçalho externo: o título pertence à própria arte do menu. O cenário ocupa toda a janela durante a exploração. Menus e consultas pausam a ação. Painéis respeitam o viewport e rolam verticalmente quando necessário; não reduzir fontes para fazer conteúdo caber. Controles têm pelo menos 44 px de altura e ações somente por ícone têm também 44 px de largura.

Abaixo de 700 px, painéis usam margens menores e as ações do menu de controles formam uma coluna. O caderno conserva sua adaptação ilustrada. O menu inicial usa botões HTML sobre a arte abaixo de 1000 px; na horizontal curta, o título e os botões ficam lado a lado. Missões marcadas ficam abaixo do botão Controles nas telas estreitas.

Diálogo: largura 94–96%, altura estável de 180–210 px no computador, 200 px no celular, 184 px na horizontal curta; retrato acima à direita. Textos e escolhas longos são paginados, sem aumentar a moldura ou cortar conteúdo. O motor mede o espaço real depois que as fontes carregam.

## Elevation & Depth

Uma sombra externa contida separa o painel do cenário. A borda dupla é feita com traços finos e sombra interna, sem empilhar cartões com sombras. Ornamentos dos painéis ficam em dois cantos nas margens e nunca sobre o conteúdo. O escurecimento atrás dos modais concentra a leitura.

## Shapes

Cantos retos, bronze fino e encaixes discretos. O caderno é a exceção material com bordas de papel. A moldura raster dos diálogos e sua aba de nome mantêm o encaixe original; nenhum novo ornamento compete com ela.

## Components

- **Botões:** `.primary` usa vinho e marfim; `.secondary` usa madeira e borda bronze; `.plain` é textual. Hover preserva o contraste, foco tem contorno visível, pressionado tem relevo interno e desabilitado não dispara ação.
- **Modais:** `#modal` é a caixa nativa compartilhada. `controls-menu`, `notebook` e `photo-memory` são variantes existentes, não novos sistemas de overlay. Títulos, fechamento e ações permanecem acessíveis por teclado.
- **Exploração:** cartas, fotografias e outros itens apoiados no chão são desenhados antes dos personagens; móveis e portas mantêm profundidade pelos pés. Gavetas possuem estados aberto/fechado persistidos no mundo.
- **HUD:** Controles, interação, aviso e objetivo compartilham fonte e paleta. Sem novos painéis persistentes sobre a exploração. O objetivo só aparece após marcação no caderno.
- **Diálogos:** `css/dialogue.css` possui moldura, nome, pigmento por personagem, seleção e paginação visual. `javascript/dialogue-ui.js` e `javascript/game.js` mantêm navegação, medição e custo das ações.
- **Diário:** `css/notebook.css` usa páginas cinza-escuras, texto claro, detalhes roxos e abas, com a fonte canônica.
- **Tela cheia e toque:** `css/fullscreen.css` possui enquadramento, posicionamento do HUD e menu de controles. A UI não altera câmera, hitboxes ou movimentos. O início em tela cheia usa toda a altura, sem reserva para cabeçalho.
- **Fotografias e finais:** arte inteira com `object-fit: contain`; corpo legível e ações com o mesmo tratamento dos demais painéis.
- **Movimento:** transições discretas somente na revelação de fotografias; respeitar preferência do jogo e `prefers-reduced-motion`. Modo de cores forçadas preserva foco e contornos.

Atualização de 30/10/2026: o prólogo usa `css/prologue.css` e `javascript/prologue.js`. As ilustrações abrem em tela cheia, inteiras, com legendas na fonte canônica na parte inferior e sem caixa, bordas ou retrato separado. Em telas verticais, a própria arte escurecida e desfocada preenche o fundo, preservando o enquadramento completo dos pais. A estrada possui câmera própria e Kali criança; os controles de toque aparecem somente durante a exploração. Transições passam pelo preto e respeitam movimento reduzido. A caixa ilustrada continua sendo usada nas conversas do orfanato.

Atualização de 01/11/2026: abertura, estrada e revelação do carro passam a usar desenho simples com contornos limpos, cores chapadas e poucas sombras. Foram reduzidos hachuras, texturas, detalhes pequenos e a quantidade de fogo. O fundo da estrada é suavizado ao escalar; os sprites mantêm seu tratamento de pixel art. Enquadramentos, geometria e fases da sequência foram preservados.

Atualização de 07/11/2026: sombras junto aos pés integram os personagens ao cenário. Durante as falas, as placas de nome do cenário cedem espaço ao retrato e à identificação do interlocutor na moldura. Diálogos conservam a passagem na rotação de tela; Enter e Espaço acionam o botão de navegação focado. Em telas de toque, a ação Interagir tem rótulo próprio. Ao trocar de aba ou janela, a exploração fica pausada até voltar ao jogo. A redução de movimento, pelo sistema ou pelo jogo, elimina as animações de repouso, a pulsação da luz e os quadros intermediários das portas.

## Do's and Don'ts

Reutilizar tokens e variantes existentes, testar computador/celular/horizontal e manter toda a fala acessível. Não acrescentar uma nova camada de overrides ao fim do CSS para corrigir regras obsoletas: alterar o proprietário correspondente. Não alterar dados salvos, custos narrativos ou conteúdo das artes para acomodar a UI.

Verificação: testes de regras existentes, playtests de interface/diário/diálogo/tela cheia e `tools/playtest-ui-theme.cjs`. Evidências e comparação visual em `previas/ui-gotico/`. O auditor genérico de UI não reconhece os eventos externos ligados por `getElementById`; suas indicações de botões sem ação precisam ser confrontadas com os listeners e playtests.
