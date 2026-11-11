# Atualização web — 15/10/2026

Base: `Dont-Believe-Relatorio-e-Fluxograma.pdf`, fornecido pelo jogador. As páginas 1–18 comparam versões e descrevem as rotas; as páginas 19–23 apresentam as revisões narrativas incorporadas nesta atualização. O projeto Unity é uma adaptação independente; esta entrega atualiza a versão web, aberta por `index.html`.

## Cenas integradas

- **Interrogatório — O que eles já sabem:** apresentação, quatro respostas e retorno ao dormitório conforme as páginas 19–20. A reação à informação entregue a Noah permanece condicional. A chave continua sendo localizada em todas as respostas; a denúncia de Eron mantém seu efeito irreversível.
- **Resgate — Uma porta entre nós:** apresentação e duas respostas das páginas 21–22. O texto distingue Tomas ainda retido, transferido e já libertado numa preparação opcional. Abrir a grade principal continua diferente de libertar Mira; adiar mantém a possibilidade de voltar antes do confronto.
- **Relíquia — O nó no cordão:** apresentação e resposta da página 23. O símbolo volta ao inventário; a cena segue para a preparação. O texto não estabelece o destino dos pais nem pressupõe que os aliados estejam livres.

As escolhas preservam seus efeitos e custos. Caminhar, ler as páginas e consultar o caderno continuam gratuitos. O prazo de Tomas e os requisitos dos seis finais permanecem válidos.

## Molduras e colisões

As nove molduras usam cores menos saturadas e brilho mais baixo, mantendo a identificação por personagem. A seta e a seleção acompanham um tom de pedra; as falas continuam brancas e o interior da caixa permanece opaco. Valores em `css/dialogue.css` e `documentacao/DESIGN.md`.

O movimento agora alcança a borda livre do obstáculo em vez de descartar o último passo inteiro. Isso elimina uma folga de até 4 pixels, variável com o tamanho do movimento, ao encostar em paredes, móveis ou portas. Os subpassos e o deslizamento por eixo continuam impedindo atravessar sólidos e cantos. O mesmo movimento é usado pelo jogador e pelos moradores.

## Controles e câmera

A exploração usa a janela inteira. As faixas com cabeçalho, vigilância, localização e atalhos foram removidas. C abre o menu de controles, com diário, objetos, pedidos, mapa, tela cheia, som e ajuda. J/I/T/M permanecem como atalhos diretos. A seção Objetos do diário reúne vigilância, atenção da patrulha, advertências e ferimentos com o inventário.

A câmera está mais afastada e respeita a densidade de pixels sem ampliar os personagens em telas Retina. A caixa de fala foi reduzida para até 620 × 260 px; as escolhas usam até 310 px de altura, com paginação. As molduras têm pigmento quase monocromático, escuro e neutro.

## Verificação

- 92 testes automatizados aprovados, incluindo as quatro respostas do interrogatório, as variantes de Tomas, o custo original da relíquia, o resgate na última ação e contato consistente com obstáculos.
- Navegador: portas abertas/fechadas, movimento pelo teclado e os seis finais aprovados; nenhum erro de JavaScript.
- Novos textos: 12 cenários no computador e no celular, com leitura integral e sem consumo de prazo ou alteração de estado pela paginação.
- Nove variantes de moldura capturadas. Paginação também conferida em tela cheia e celular na horizontal.

Resultados: `previas/atualizacao-relatorio/`, `previas/colisoes/` e `previas/dialogos-compactos/`. Ferramenta desta atualização: `tools/playtest-report.cjs`.

Interface conferida em 1280×900, 1440×1000 com Retina, 390×844 e 844×390. Resultados adicionais em `previas/interface-limpa/`; `tools/playtest-clean-ui.cjs` cobre menu, consultas, pausa, câmera e retorno ao menu principal.
