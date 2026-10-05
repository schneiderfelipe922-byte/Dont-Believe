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
typography:
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
  display:
    fontFamily: "Georgia, serif"
rounded:
  DEFAULT: "0px"
spacing:
  panel: "18px"
  item-gap: "14px"
components:
  relation-meter:
    backgroundColor: "#211b24"
    textColor: "#e0dfcf"
  inventory-item:
    backgroundColor: "#211b24"
    textColor: "#e0dfcf"
---

# Interface de OldHood

## Overview

Produto: jogo local de suspense em português, com teclado e toque. O jogador precisa reconhecer pessoas, objetos e consequências sem perder a orientação no mapa. A identidade existente vem de madeira gasta, papel e luz de velas. As novas barras parecem anotações ao lado da vigilância; não cobrem o mundo nem concorrem com os diálogos.

A fonte canônica dos tokens é `style.css` (modelo B). Este documento registra a interface existente e a extensão de relações e tarefas; não reconfigura o tema do jogo.

## Colors

`primary` corresponde a `--gold`, `background` a `--bg`, `text` a `--text`, `muted` a `--muted`. A extensão mapeia `surface` para `--social-panel`, `border` para `--social-border`, e cada personagem para `--social-mira`, `--social-eron`, `--social-noah`, `--social-guard`. Barras usam cor, nome e valor 0–9. Estados de tarefa usam texto: aceitar, em andamento, pronto para entregar, concluído e indisponível.

## Typography

Georgia para nomes e títulos; Arial para diálogos, descrições, controles e números. Não há fontes remotas. Português com acentos e quebras naturais. Valores de relação usam algarismos tabulares.

## Layout

Quatro barras acima do cenário; duas colunas em telas estreitas. Inventário em duas colunas no computador, uma no celular. Tarefas agrupadas por morador dentro do modal existente. Conteúdo longo rola no modal sem deslocar a página; botões de tarefa têm pelo menos 44px de altura. O cenário e os controles de toque mantêm sua geometria anterior.

## Elevation & Depth

Bordas e fundos opacos separam informações. Os painéis novos usam as superfícies e sombras existentes. Os retratos comuns permanecem estáticos. Fotografias encontradas usam a variante `photo-memory` do modal: entrada em fade, imagem inteira sobre uma caixa de fala de Kali, respeitando redução de movimento.

## Shapes

Retângulos e bordas discretas, coerentes com o cenário em pixels. Nada de cartões arredondados ou decoração de aplicativo administrativo.

## Components

- `game.js`: `button`, `modal`, `say`, `notice` são os controles canônicos. As telas novas reutilizam essas funções.
- `style.css`: scrollbar global com estados visíveis, relações, cartões de itens e pedidos. O modal nativo é o contêiner de inventário, leitura e tarefas.
- `social.js`: estados de tarefas, descrições de itens, falas e recompensas. Coletar e entregar são ações únicas; o resultado permanece no diário e no salvamento.
- `residents.js`: posições atuais; marcadores, interação e entrega consultam a mesma posição. O mundo pausa quando o jogador lê.

## Do's and Don'ts

Preservar o roteiro, os sprites, a escala 0–9 e as trancas narrativas. Mostrar requisitos e próximos passos antes de uma ação. Não usar só cor para comunicar confiança ou conclusão. Não premiar cliques repetidos. Não abrir grades com chaves de tarefas opcionais. Não animar os retratos dos diálogos.

## Fotografias encontradas

O pedido do jogador de 27/09/2026 introduz duas lembranças visuais, com fade de 600 ms e fala abaixo. A variante `photo-memory` reutiliza o modal nativo e as cores `--bg`, `--text`, `--gold`, `--social-panel` e `--social-border`. Georgia mantém o tom dos diálogos. A fotografia usa `object-fit: contain`; em telas estreitas, a caixa de fala continua abaixo da imagem. Sem recortar pessoas. O sistema e a preferência do jogo podem desativar o fade.
