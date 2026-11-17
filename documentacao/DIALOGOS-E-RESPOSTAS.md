# Diálogos e respostas — revisão de 17/11/2026

## 1. Propósito
Responder ao teste de jogador que não distinguia narração de fala e não percebia todas as respostas. Incorporar a orientação posterior do usuário de evitar vários cliques para terminar a leitura.

## 2. Experiência do jogador
Cada diálogo é apresentado inteiro em uma área rolável, sem páginas de leitura. Blocos identificados como “Narração”, “Fala” e “Consequência / orientação” diferenciam descrição, palavras pronunciadas e retorno das ações. Quando há atribuição explícita no texto, o rótulo da fala inclui o personagem; o retrato da cena não é usado para deduzir quem falou.

Um clique em “Ver as N respostas” abre a lista completa. Não há botão “Mais opções”. Alternativas bloqueadas continuam visíveis com o motivo. Listas maiores rolam, com aviso de conteúdo abaixo. É possível reler o diálogo antes de escolher. Consequências usam diretamente o botão de retorno; quando a partida terminou, ele diz “Ver o desfecho”.

## 3. Regras
Preservados ordem e índices das alternativas, efeitos, requisitos, custos, decisões e condições dos finais. Setas navegam entre respostas disponíveis e mantêm a seleção visível; durante a leitura, rolam o texto. Enter confirma e números mantêm os atalhos existentes. Não é obrigatório rolar até o fim para decidir. Retomar o jogo continua usando o salvamento existente.

## 4. Visual e som
Moldura maior e responsiva, papel escuro ameixa, bordas ocre, fonte Solway já disponível no projeto. Fala tem fundo e borda próprios; narração tem tratamento distinto e rótulo textual, sem depender apenas de cor. Retratos existentes preservados; nas respostas a moldura aproveita o espaço sem o retrato. Sem arte gerada ou áudio novo.

## 5. Impacto no existente
Mudanças em dialogue-ui.js, game.js, dialogue.css e index.html. Em adventure.js e story.js, algumas quebras de linha separam descrições que estavam coladas a falas (ronda, plano e sigilo); fatos narrativos preservados. Nenhuma mudança no mapa, no planejamento em Elias ou nas condições de resgate. Cópias da interface anterior em backups/antes-dialogos-20261117. Revisões de cache e pacote estático atualizados.

## 6. Tamanho
Revisão localizada de interface e segmentação textual. Não reescreve os diálogos nem acrescenta cenas. A identificação de falantes é conservadora: sem atribuição explícita, o bloco diz somente “Fala”.

## 7. Testes e conclusão
137 testes automatizados aprovados, incluindo preservação das rotas dos finais, navegação por teclado, falas intercaladas e atribuição explícita. Playtest no Chromium em 1280×800, 390×844, 844×390 e 320×568: ritual, transição à lista com um clique, alternativas bloqueadas, custos/avisos, seleção da terceira resposta por teclado, releitura, limites da moldura e ausência de rolagem horizontal. Nenhum erro de JavaScript. Capturas em previas/dialogos-claros; script reproduzível em tools/playtest-dialogue-clarity.cjs (aceita PLAYWRIGHT_MODULE_PATH e CHROMIUM_PATH).

- Clareza: atende à revisão visual e funcional; separação textual explícita, leitura sem paginação, lista completa com quantidade e indicação de rolagem.
- Pistas e escolhas: atende por preservação dos textos, efeitos e requisitos; custo e risco continuam junto das respostas.
- Finais: atende por preservação das regras e regressão das rotas; transição para o epílogo tem rótulo coerente.

Não houve sessão com participante novo. A revisão visual e os testes automatizados não demonstram, por si só, a compreensão de um novo jogador.
