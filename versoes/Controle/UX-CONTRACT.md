# Contrato de interação — OldHood

Fonte de regras: pedido do usuário de 27/09/2026, `story.js`, `adventure.js` e `danger.js`. Este documento descreve a interface dessas regras. Idioma pt-BR, dados locais no navegador, sem conta, rede ou operações externas.

| Fluxo | Componente canônico | Resultado | Recuperação |
|---|---|---|---|
| Conversar | `say` / `showDialogue` em game.js | Mundo pausado, retrato parado, opções por teclado ou toque | E avança página; Esc volta à exploração, exceto revista obrigatória |
| Aceitar pedido | `openCharacter` → `GameSocial.perform` | Pedido ativo, próximo passo marcado, salvamento | Pedido já aceito ou futuro não pode ser premiado/aceito novamente |
| Recolher | E perto do item → `GameSocial.perform` | Item no inventário; pistas permanecem legíveis | Mostra requisito de chave ou passagem; não cobra ação se falhar |
| Entregar | Conversa com o solicitante | Consome os itens entregues, aumenta relação uma vez, libera pedido seguinte | Sem itens ou longe do personagem: feedback textual, sem perda |
| Ler | `showInventory` → modal de leitura | Texto completo e botão Voltar ao inventário | Esc fecha o modal, sem descartar o objeto |
| Acompanhar | `showTasks` / `trackErrand` | Marcador no objeto ou na posição atual do solicitante | Diário permite voltar à missão principal |
| Salvar | `save`, localStorage | Inventário, tarefas, relações e posições persistem | Saves anteriores recebem campos novos sem apagar a história |

Inventário e tarefas reutilizam o modal nativo já existente. O navegador gerencia isolamento e foco do modal; `closeModal` restaura o foco ao Canvas. Não há popups do sistema, formulários, tabelas ou seleção múltipla. Botões são nativos, têm foco visível e rótulos explícitos. `notice` é o feedback canônico com role=status. Scrollbars globais ficam em style.css; não são ocultadas.

Relações: 0–9, nome + número + barra ARIA. Doze pedidos, três por solicitante. Conversas e leitura são gratuitas; recolher e entregar durante o prazo de Tomas consomem uma ação, anunciado no painel. A chave do baú e a chave da despensa nunca abrem trancas narrativas. Confiança em Noah não comprova lealdade nem substitui a abertura do trinco.

Moradores abrem portas comuns, nunca grades trancadas. Mira presa e Eron denunciado permanecem nas celas. Noah tem um acompanhante da ronda e mantém distância física. Marcadores, mapa e interação usam a mesma posição atual. O movimento pausa nos diálogos e menus.

Verificação: tests/social.test.cjs cobre regras e trajetos; tests/game.test.cjs exercita comandos em DOM simulado. Auditoria estática do skill identificou 27 avisos de botão sem ação por não reconhecer o helper `$` e listeners em arquivo separado; as ações reais são registradas em game.js e verificadas pela integração/navegador. Não adicionar handlers inline duplicados para satisfazer esse detector.

## Verificação realizada

33 testes automatizados aprovados. Chrome: aceitar pedido de Mira, coletar livro, ler no inventário, entregar, conferir relação 2/9 e salvamento. Telas de 1280 px e 390 px inspecionadas; sem rolagem horizontal na tela estreita nem erros de JavaScript. O validador de DESIGN.md retornou zero erros; avisos de tokens documentais sem referência não alteram o CSS canônico.

## Fotografias — pedido do jogador de 27/09/2026

| Capacidade | Dono canônico | Variante e comportamento | Verificação |
|---|---|---|---|
| Descobrir foto | `photos.js`, `nearby` / `interact` | E ou Interagir; exige proximidade e visão livre, respeitando paredes | testes de regras e integração |
| Exibir lembrança | `modal` / `closeModal` em game.js | `photo-memory`: foto em fade e fala abaixo; foco preso pelo dialog nativo; E, Espaço, Esc e botão fecham | navegador desktop/celular e redução de movimento |
| Reabrir foto | `showInventory` | Uma cópia por inventário, sem custo de ação nem mudança de cena; fechar retorna ao inventário | salvamento e releitura |
| Falha de imagem | variante `photo-memory` | Mensagem com Tentar novamente, manter inventário e saída disponíveis | falha de recurso em navegador |

A foto da família fica junto à mesa de cabeceira do dormitório; a de Eron e Tomas, perto da mesa da sala de leitura. As duas usam os pontos e marcadores de `GamePhotos`. Mundo, rondas e prazo permanecem pausados no modal. Retratos e diálogos comuns mantêm seu comportamento.

Estaturas no cenário: o renderer usa `CharacterData.height` (40/46/54 px), incluindo a arte de reserva durante carregamento. Âncora dos pés preservada; idles frontais recebem o tempo da animação, retratos de conversa continuam parados.

Verificação das fotos e estaturas: 44 testes Node aprovados; Chromium via Playwright em 1280×900 e 390×844, descoberta, fade, foco/Tab/Esc, toque, releitura após reload, falha de imagem e nova tentativa, redução de movimento do sistema e do jogo. Auditoria estática continua com os 27 falsos positivos preexistentes de listeners via `$`; nenhum novo tipo de aviso.
